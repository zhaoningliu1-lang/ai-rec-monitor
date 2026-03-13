"""
B2A Analytics — AI Engine Attribution & Intelligence

Aggregates GEO scan data to show which AI engines recommend brands,
competitive share of voice by engine, and source intelligence.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import PromptResult, Run, RunSnapshot

router = APIRouter(prefix="/b2a", tags=["b2a"])


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
    # Base query: count mentions per provider
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

    # Build brand → engine → metrics mapping
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

    # Sort by total mentions, limit
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
    base = base.limit(500)  # cap for performance

    result = await db.execute(base)
    rows = result.all()

    # Aggregate URL frequencies
    url_counts: dict[str, dict] = {}
    for row in rows:
        urls = row.cited_urls if isinstance(row.cited_urls, list) else []
        for url in urls:
            if not isinstance(url, str):
                continue
            # Extract domain
            try:
                from urllib.parse import urlparse
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

    # Convert sets to lists and sort
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
        "snippet": """<script>
(function(){
  'use strict';
  var AI={
    'chatgpt.com':'ChatGPT','chat.openai.com':'ChatGPT','openai.com':'ChatGPT',
    'perplexity.ai':'Perplexity','claude.ai':'Claude',
    'gemini.google.com':'Gemini','bard.google.com':'Gemini',
    'copilot.microsoft.com':'Copilot','grok.x.ai':'Grok',
    'deepseek.com':'DeepSeek','meta.ai':'Meta AI',
    'you.com':'You.com','phind.com':'Phind'
  };
  var ref=document.referrer;
  if(!ref)return;
  try{
    var h=new URL(ref).hostname.replace(/^www\\./,'');
    for(var d in AI){
      if(h===d||h.endsWith('.'+d)){
        navigator.sendBeacon('/api/b2a/event',JSON.stringify({
          event:'ai_visit',engine:AI[d],
          referrer:ref,page:location.pathname,
          ts:new Date().toISOString()
        }));
        return;
      }
    }
    var p=new URLSearchParams(location.search);
    if(p.get('utm_source')==='chatgpt.com'){
      navigator.sendBeacon('/api/b2a/event',JSON.stringify({
        event:'ai_visit',engine:'ChatGPT',
        referrer:ref,page:location.pathname,
        ts:new Date().toISOString()
      }));
    }
  }catch(e){}
})();
</script>""",
        "one_liner": '<script src="https://avantia2a.com/b2a.js" async></script>',
    }
