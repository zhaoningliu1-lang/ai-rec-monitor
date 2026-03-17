"""GEO Command Center — AI CMO dashboard analytics and opportunity feed."""
import re
from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import PromptResult, Run, RunSnapshot, RunStatus
from app.routers.auth import get_current_user_optional
from app.models import User

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

_SEVERITY_ORDER = {"critical": 0, "high": 1, "medium": 2, "low": 3}


def _extract_keywords(text: str, max_words: int = 6) -> list[str]:
    """Pull meaningful keywords from a prompt string."""
    stop = {"the", "a", "an", "for", "of", "in", "on", "is", "are", "what", "which",
            "best", "good", "top", "most", "my", "i", "to", "and", "or", "vs", "should",
            "do", "can", "will", "how", "why", "when", "buy", "get", "use", "find"}
    words = re.findall(r"[a-zA-Z]{3,}", text.lower())
    seen: list[str] = []
    for w in words:
        if w not in stop and w not in seen:
            seen.append(w)
        if len(seen) >= max_words:
            break
    return seen


def _top_competitor(competitors_data: dict) -> str:
    """Return the competitor name most mentioned in a PromptResult."""
    if not competitors_data:
        return "a competitor"
    mentioned = [(name, data) for name, data in competitors_data.items()
                 if isinstance(data, dict) and data.get("mentioned")]
    if not mentioned:
        return list(competitors_data.keys())[0]
    # pick lowest position (i.e. #1 ranking)
    mentioned.sort(key=lambda x: (x[1].get("position") or 99))
    return mentioned[0][0]


# ── Analytics endpoint ────────────────────────────────────────────────────────

@router.get("/analytics")
async def get_analytics(
    brand: str = Query(..., description="Brand name to look up"),
    db: AsyncSession = Depends(get_db),
    _user: User | None = Depends(get_current_user_optional),
):
    """Return GEO analytics for the latest completed run of a brand."""
    # 1. Find latest completed run
    run_row = await db.execute(
        select(Run)
        .where(Run.brand_name.ilike(f"%{brand}%"), Run.status == RunStatus.done)
        .order_by(Run.finished_at.desc())
        .limit(1)
    )
    run: Run | None = run_row.scalar_one_or_none()
    if not run:
        raise HTTPException(status_code=404, detail=f"No completed runs found for brand '{brand}'")

    # 2. RunSnapshot
    snap_row = await db.execute(select(RunSnapshot).where(RunSnapshot.run_id == run.id))
    snap: RunSnapshot | None = snap_row.scalar_one_or_none()

    geo_score = int(round((snap.weighted_sov if snap else 0) * 100))

    # 3. All PromptResults for this run
    pr_rows = await db.execute(select(PromptResult).where(PromptResult.run_id == run.id))
    results: list[PromptResult] = list(pr_rows.scalars().all())

    # 4. Provider stats
    provider_map: dict[str, dict] = defaultdict(lambda: {"total": 0, "mentions": 0, "positions": []})
    for pr in results:
        pname = pr.provider or "openai"
        provider_map[pname]["total"] += 1
        if pr.brand_mentioned:
            provider_map[pname]["mentions"] += 1
            if pr.brand_mention_position is not None:
                provider_map[pname]["positions"].append(pr.brand_mention_position)

    provider_display = {"openai": "ChatGPT", "anthropic": "Claude", "gemini": "Gemini", "perplexity": "Perplexity"}
    providers_out = []
    for pkey, stats in provider_map.items():
        total = stats["total"] or 1
        mentions = stats["mentions"]
        score_pct = int(round((mentions / total) * 100))
        positions = stats["positions"]
        avg_pos = round(sum(positions) / len(positions), 1) if positions else None
        providers_out.append({
            "name": provider_display.get(pkey, pkey.capitalize()),
            "key": pkey,
            "score": score_pct,
            "mentions": mentions,
            "total": total,
            "avg_position": avg_pos,
            "status": "ok" if score_pct >= 35 else "warn",
        })
    providers_out.sort(key=lambda x: -x["score"])

    # 5. Sentiment
    mentioned_results = [r for r in results if r.brand_mentioned]
    if mentioned_results:
        positive = sum(1 for r in mentioned_results if str(r.brand_sentiment).endswith("positive"))
        sentiment_score = round(positive / len(mentioned_results), 2)
    else:
        sentiment_score = 0.0

    # 6. Competitor SOV aggregation
    comp_counts: dict[str, int] = defaultdict(int)
    comp_total = len(results) or 1
    for pr in results:
        for cname, cdata in (pr.competitors_data or {}).items():
            if isinstance(cdata, dict) and cdata.get("mentioned"):
                comp_counts[cname] += 1
    competitors_out = [
        {"name": cname, "sov": round(count / comp_total, 3)}
        for cname, count in sorted(comp_counts.items(), key=lambda x: -x[1])
    ][:6]

    # 7. Avg position for brand
    brand_positions = [r.brand_mention_position for r in mentioned_results if r.brand_mention_position is not None]
    avg_position = round(sum(brand_positions) / len(brand_positions), 1) if brand_positions else None

    return {
        "brand": run.brand_name,
        "run_id": str(run.id),
        "run_code": run.run_code,
        "scanned_at": run.finished_at.isoformat() if run.finished_at else None,
        "geo": {
            "score": geo_score,
            "sov_overall": round(snap.sov_overall, 3) if snap else 0,
            "sov_high": round(snap.sov_high, 3) if snap else 0,
            "mention_count": snap.mention_count if snap else 0,
            "total_prompts": snap.total_prompts if snap else len(results),
            "sentiment": sentiment_score,
            "avg_position": avg_position,
            "arrs": round(snap.arrs, 3) if snap else 0,
        },
        "providers": providers_out,
        "competitors": competitors_out,
        "category": run.category,
        "region": run.region,
    }


# ── Opportunities endpoint ────────────────────────────────────────────────────

@router.get("/opportunities")
async def get_opportunities(
    brand: str = Query(..., description="Brand name to generate opportunities for"),
    db: AsyncSession = Depends(get_db),
    _user: User | None = Depends(get_current_user_optional),
):
    """Generate GEO opportunity cards from the latest completed run."""
    # Latest completed run
    run_row = await db.execute(
        select(Run)
        .where(Run.brand_name.ilike(f"%{brand}%"), Run.status == RunStatus.done)
        .order_by(Run.finished_at.desc())
        .limit(1)
    )
    run: Run | None = run_row.scalar_one_or_none()
    if not run:
        raise HTTPException(status_code=404, detail=f"No completed runs found for brand '{brand}'")

    snap_row = await db.execute(select(RunSnapshot).where(RunSnapshot.run_id == run.id))
    snap: RunSnapshot | None = snap_row.scalar_one_or_none()

    # PromptResults where brand not mentioned (sorted: high_intent first)
    missed_rows = await db.execute(
        select(PromptResult)
        .where(PromptResult.run_id == run.id, PromptResult.brand_mentioned == False)  # noqa: E712
        .order_by(
            (PromptResult.intent_type == "high_intent").desc(),
            PromptResult.processed_at.asc()
        )
        .limit(5)
    )
    missed: list[PromptResult] = list(missed_rows.scalars().all())

    opportunities = []

    # ── 1. Critical: Low high-intent SOV ──────────────────────────────────────
    sov_high = snap.sov_high if snap else 0
    if sov_high < 0.20:
        opportunities.append({
            "id": f"{run.id}-low-sov",
            "type": "low_sov",
            "severity": "critical",
            "title": f"High-intent SOV: only {sov_high:.0%} — critical gap",
            "description": "Buyers ready to purchase rarely see your brand in AI answers. Closing this gap with targeted content is the highest-ROI action.",
            "credit_cost": 10,
            "fix": {
                "route": "/content-studio",
                "label": "Generate High-Intent Content",
                "prefill": {
                    "brand": run.brand_name,
                    "product": run.category or run.brand_name,
                    "platform": "blog",
                    "keywords": [],
                },
            },
        })

    # ── 2. Content gaps (missed prompts) ──────────────────────────────────────
    for pr in missed[:4]:
        competitor = _top_competitor(pr.competitors_data or {})
        keywords = _extract_keywords(pr.prompt_text)
        severity = "high" if pr.intent_type == "high_intent" else "medium"
        prompt_preview = pr.prompt_text[:70] + ("…" if len(pr.prompt_text) > 70 else "")
        opportunities.append({
            "id": str(pr.id),
            "type": "content_gap",
            "severity": severity,
            "title": f'Not mentioned: "{prompt_preview}"',
            "description": f"{competitor} is recommended instead. A targeted blog post or FAQ can change this.",
            "credit_cost": 10,
            "fix": {
                "route": "/content-studio",
                "label": "Generate Blog Post",
                "prefill": {
                    "brand": run.brand_name,
                    "product": run.category or run.brand_name,
                    "platform": "blog",
                    "keywords": keywords,
                },
            },
        })

    # ── 3. Amazon listing GEO ─────────────────────────────────────────────────
    opportunities.append({
        "id": f"{run.id}-listing-geo",
        "type": "listing_geo",
        "severity": "medium",
        "title": "Amazon listing not GEO-optimized",
        "description": "Add FAQ schema, authoritative specs, and a structured buying guide. AI models 3× more likely to cite listings with structured data.",
        "credit_cost": 10,
        "fix": {
            "route": "/content-studio",
            "label": "Rewrite Amazon Listing",
            "prefill": {
                "brand": run.brand_name,
                "product": run.category or run.brand_name,
                "platform": "amazon",
                "keywords": [],
            },
        },
    })

    # ── 4. FAQ page missing ───────────────────────────────────────────────────
    opportunities.append({
        "id": f"{run.id}-faq-missing",
        "type": "faq_missing",
        "severity": "medium",
        "title": "No AI-ready FAQ page detected",
        "description": "FAQ pages with JSON-LD schema are cited by AI 3× more often. Generate one in 30 seconds.",
        "credit_cost": 5,
        "fix": {
            "route": "/faq-generator",
            "label": "Generate FAQ Page",
            "prefill": {
                "brand": run.brand_name,
                "product": run.category or run.brand_name,
                "platform": "blog",
                "keywords": [],
            },
        },
    })

    # ── 5. Reddit presence ────────────────────────────────────────────────────
    opportunities.append({
        "id": f"{run.id}-reddit-gap",
        "type": "reddit_gap",
        "severity": "medium",
        "title": f"Brand presence in r/{(run.category or 'your category').lower().replace(' ', '')} unknown",
        "description": "Reddit threads are heavily cited by AI. A timely reply to relevant discussions increases citation rate.",
        "credit_cost": 3,
        "fix": {
            "route": "/reddit",
            "label": "Find Reddit Opportunities",
            "prefill": {
                "brand": run.brand_name,
                "product": run.category or run.brand_name,
                "platform": "reddit",
                "keywords": [],
            },
        },
    })

    # Sort by severity
    opportunities.sort(key=lambda x: _SEVERITY_ORDER.get(x["severity"], 9))

    return {
        "brand": run.brand_name,
        "run_code": run.run_code,
        "opportunities": opportunities,
        "total": len(opportunities),
    }


# ── Brand list (distinct brands from runs) ───────────────────────────────────

@router.get("/brands")
async def list_brands(
    db: AsyncSession = Depends(get_db),
    _user: User | None = Depends(get_current_user_optional),
):
    """Return distinct brand names that have at least one completed run."""
    rows = await db.execute(
        select(Run.brand_name)
        .where(Run.status == RunStatus.done)
        .distinct()
        .order_by(Run.brand_name)
    )
    brands = [r[0] for r in rows.all()]
    return {"brands": brands}
