"""
B2A Analytics — AI Engine Attribution & Intelligence

Aggregates GEO scan data to show which AI engines recommend brands,
competitive share of voice by engine, and source intelligence.
Also provides event collection for the B2A tracking snippet.
"""

from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, Query, Request
from fastapi.responses import Response
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import B2AEvent, PromptResult, Run

router = APIRouter(prefix="/b2a", tags=["b2a"])


# ── B2A JS Snippet ────────────────────────────────────────────────────────────

_B2A_JS = """(function(){
'use strict';
var E='https://ai-rec-monitor-production.up.railway.app';
var AI={
'chatgpt.com':'ChatGPT','chat.openai.com':'ChatGPT','openai.com':'ChatGPT',
'perplexity.ai':'Perplexity','claude.ai':'Claude',
'gemini.google.com':'Gemini','bard.google.com':'Gemini',
'copilot.microsoft.com':'Copilot','grok.x.ai':'Grok',
'deepseek.com':'DeepSeek','meta.ai':'Meta AI',
'you.com':'You.com','phind.com':'Phind'
};
function vid(){
var k='_b2a_vid',v=localStorage.getItem(k);
if(!v){v=Math.random().toString(36).substr(2,12);localStorage.setItem(k,v)}
return v
}
function detect(){
var ref=document.referrer;
if(ref){
try{
var h=new URL(ref).hostname.replace(/^www\\./,'');
for(var d in AI){if(h===d||h.endsWith('.'+d))return{engine:AI[d],referrer:ref}}
}catch(e){}
}
var p=new URLSearchParams(location.search);
if(p.get('utm_source')==='chatgpt.com')return{engine:'ChatGPT',referrer:ref||''};
return null
}
var src=detect();
if(!src)return;
var data=JSON.stringify({
engine:src.engine,referrer:src.referrer,
page:location.pathname,site:location.hostname,
visitor_id:vid(),ts:new Date().toISOString()
});
navigator.sendBeacon(E+'/b2a/event',data);
})();"""


@router.get("/b2a.js")
async def serve_b2a_js():
    """Serve the B2A tracking JavaScript file."""
    return Response(
        content=_B2A_JS,
        media_type="application/javascript",
        headers={
            "Cache-Control": "public, max-age=3600",
            "Access-Control-Allow-Origin": "*",
        },
    )


# ── Event Collection ──────────────────────────────────────────────────────────

class B2AEventPayload(BaseModel):
    engine: str
    referrer: str = ""
    page: str = "/"
    site: str = ""
    visitor_id: str = ""
    ts: str = ""


@router.options("/event")
async def event_preflight():
    """Handle CORS preflight for beacon requests from any client site."""
    return Response(
        status_code=204,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400",
        },
    )


@router.post("/event")
async def collect_event(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Collect B2A tracking events from client websites.
    Accepts JSON payload from navigator.sendBeacon().
    """
    try:
        raw = await request.body()
        body = json.loads(raw)
        payload = B2AEventPayload(**body)
    except Exception:
        return Response(
            content='{"ok":false}',
            media_type="application/json",
            headers={"Access-Control-Allow-Origin": "*"},
        )

    # Parse event timestamp
    event_at = datetime.now(timezone.utc)
    if payload.ts:
        try:
            event_at = datetime.fromisoformat(payload.ts.replace("Z", "+00:00"))
        except Exception:
            pass

    # Extract site domain
    site_domain = payload.site or ""
    if not site_domain and payload.referrer:
        try:
            site_domain = urlparse(payload.referrer).netloc
        except Exception:
            pass

    event = B2AEvent(
        site_domain=site_domain or "unknown",
        engine=payload.engine,
        referrer=payload.referrer or None,
        page_path=payload.page or None,
        user_agent=request.headers.get("user-agent"),
        visitor_id=payload.visitor_id or None,
        event_at=event_at,
    )
    db.add(event)
    await db.commit()

    return Response(
        content='{"ok":true}',
        media_type="application/json",
        headers={"Access-Control-Allow-Origin": "*"},
    )


# ── Event Stats ───────────────────────────────────────────────────────────────

@router.get("/traffic-stats")
async def traffic_stats(
    site: str | None = Query(default=None, description="Filter by site domain"),
    days: int = Query(default=30, le=90, description="Number of days to look back"),
    db: AsyncSession = Depends(get_db),
):
    """
    B2A Traffic Statistics — aggregated AI referral events.
    Shows engine breakdown, daily trends, top pages.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)

    # Engine breakdown
    engine_q = (
        select(
            B2AEvent.engine,
            func.count().label("visits"),
            func.count(func.distinct(B2AEvent.visitor_id)).label("unique_visitors"),
        )
        .where(B2AEvent.event_at >= cutoff)
    )
    if site:
        engine_q = engine_q.where(B2AEvent.site_domain == site)
    engine_q = engine_q.group_by(B2AEvent.engine).order_by(func.count().desc())

    result = await db.execute(engine_q)
    engine_rows = result.all()

    engines = [
        {"engine": r.engine, "visits": r.visits, "unique_visitors": r.unique_visitors}
        for r in engine_rows
    ]
    total_visits = sum(e["visits"] for e in engines)
    for e in engines:
        e["pct"] = round(100 * e["visits"] / total_visits, 1) if total_visits > 0 else 0

    # Daily trend (last N days)
    daily_q = (
        select(
            func.date(B2AEvent.event_at).label("day"),
            func.count().label("visits"),
        )
        .where(B2AEvent.event_at >= cutoff)
    )
    if site:
        daily_q = daily_q.where(B2AEvent.site_domain == site)
    daily_q = daily_q.group_by(func.date(B2AEvent.event_at)).order_by(func.date(B2AEvent.event_at))

    result = await db.execute(daily_q)
    daily_rows = result.all()
    daily = [{"date": str(r.day), "visits": r.visits} for r in daily_rows]

    # Top pages
    pages_q = (
        select(
            B2AEvent.page_path,
            func.count().label("visits"),
        )
        .where(B2AEvent.event_at >= cutoff)
        .where(B2AEvent.page_path.isnot(None))
    )
    if site:
        pages_q = pages_q.where(B2AEvent.site_domain == site)
    pages_q = pages_q.group_by(B2AEvent.page_path).order_by(func.count().desc()).limit(10)

    result = await db.execute(pages_q)
    page_rows = result.all()
    top_pages = [{"page": r.page_path, "visits": r.visits} for r in page_rows]

    return {
        "period_days": days,
        "total_visits": total_visits,
        "engines": engines,
        "daily": daily,
        "top_pages": top_pages,
        "site_filter": site,
    }


# ── GEO-based Attribution (existing scan data) ──────────────────────────────

@router.get("/engine-attribution")
async def engine_attribution(
    brand: str | None = Query(default=None, description="Filter by brand name"),
    category: str | None = Query(default=None, description="Filter by category"),
    db: AsyncSession = Depends(get_db),
):
    """
    AI Engine Attribution — which AI engine recommends brands most.
    Returns per-engine mention rate, sentiment breakdown, and position stats.
    """
    base = select(
        PromptResult.provider,
        func.count().label("total_prompts"),
        func.count().filter(PromptResult.brand_mentioned == True).label("mentions"),  # noqa: E712
        func.avg(PromptResult.brand_mention_position).filter(
            PromptResult.brand_mentioned == True  # noqa: E712
        ).label("avg_position"),
    ).join(Run, Run.id == PromptResult.run_id)

    if brand:
        base = base.where(Run.brand_name == brand)
    if category:
        base = base.where(Run.category == category)

    base = base.where(PromptResult.provider.isnot(None))
    base = base.group_by(PromptResult.provider)

    result = await db.execute(base)
    rows = result.all()

    engines = []
    total_mentions = sum(r.mentions for r in rows)
    for r in rows:
        mention_rate = round(100 * r.mentions / r.total_prompts, 1) if r.total_prompts > 0 else 0
        engines.append({
            "engine": r.provider,
            "total_prompts": r.total_prompts,
            "mentions": r.mentions,
            "mention_rate": mention_rate,
            "avg_position": round(r.avg_position, 1) if r.avg_position else None,
            "share_of_mentions": round(100 * r.mentions / total_mentions, 1) if total_mentions > 0 else 0,
        })

    engines.sort(key=lambda x: x["mentions"], reverse=True)

    return {
        "engines": engines,
        "total_prompts": sum(r.total_prompts for r in rows),
        "total_mentions": total_mentions,
        "brand_filter": brand,
        "category_filter": category,
    }


@router.get("/competitive-landscape")
async def competitive_landscape(
    category: str = Query(description="Category to analyze"),
    limit: int = Query(default=10, le=20),
    db: AsyncSession = Depends(get_db),
):
    """
    Competitive SOV by AI engine for a category.
    Shows how different AI engines favor different brands.
    """
    stmt = (
        select(
            Run.brand_name,
            PromptResult.provider,
            func.count().label("total"),
            func.count().filter(PromptResult.brand_mentioned == True).label("mentions"),  # noqa: E712
        )
        .join(Run, Run.id == PromptResult.run_id)
        .where(Run.category == category)
        .where(PromptResult.provider.isnot(None))
        .group_by(Run.brand_name, PromptResult.provider)
    )
    result = await db.execute(stmt)
    rows = result.all()

    brand_data: dict[str, dict] = {}
    for r in rows:
        if r.brand_name not in brand_data:
            brand_data[r.brand_name] = {"brand": r.brand_name, "engines": {}, "total_mentions": 0}
        sov = round(100 * r.mentions / r.total, 1) if r.total > 0 else 0
        brand_data[r.brand_name]["engines"][r.provider] = {
            "sov": sov,
            "mentions": r.mentions,
            "total": r.total,
        }
        brand_data[r.brand_name]["total_mentions"] += r.mentions

    brands = sorted(brand_data.values(), key=lambda x: x["total_mentions"], reverse=True)[:limit]

    return {
        "category": category,
        "brands": brands,
    }


@router.get("/source-intelligence")
async def source_intelligence(
    brand: str | None = Query(default=None),
    category: str | None = Query(default=None),
    limit: int = Query(default=20, le=50),
    db: AsyncSession = Depends(get_db),
):
    """
    AI citation source analysis — which URLs do AI engines cite when mentioning brands.
    """
    base = (
        select(PromptResult.cited_urls, PromptResult.provider, Run.brand_name)
        .join(Run, Run.id == PromptResult.run_id)
        .where(PromptResult.brand_mentioned == True)  # noqa: E712
        .where(PromptResult.cited_urls.isnot(None))
    )
    if brand:
        base = base.where(Run.brand_name == brand)
    if category:
        base = base.where(Run.category == category)
    base = base.limit(500)

    result = await db.execute(base)
    rows = result.all()

    url_counts: dict[str, dict] = {}
    for row in rows:
        urls = row.cited_urls if isinstance(row.cited_urls, list) else []
        for url in urls:
            if not isinstance(url, str):
                continue
            try:
                domain = urlparse(url).netloc
            except Exception:
                domain = url
            if domain not in url_counts:
                url_counts[domain] = {"domain": domain, "count": 0, "engines": set(), "sample_urls": []}
            url_counts[domain]["count"] += 1
            if row.provider:
                url_counts[domain]["engines"].add(row.provider)
            if len(url_counts[domain]["sample_urls"]) < 3:
                url_counts[domain]["sample_urls"].append(url)

    sources = sorted(url_counts.values(), key=lambda x: x["count"], reverse=True)[:limit]
    for s in sources:
        s["engines"] = sorted(s["engines"])

    return {
        "sources": sources,
        "brand_filter": brand,
        "category_filter": category,
    }


@router.get("/snippet")
async def get_snippet():
    """Returns the B2A tracking JavaScript snippet for client integration."""
    return {
        "snippet": f"<script>\n{_B2A_JS}\n</script>",
        "one_liner": '<script src="https://ai-rec-monitor-production.up.railway.app/b2a/b2a.js" async></script>',
    }
