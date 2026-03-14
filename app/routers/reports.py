import uuid
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import distinct, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import GeoPlan, Recommendation, PromptResult, Run, RunSnapshot, User
from app.schemas import (
    CategoryLeaderboardEntry,
    EnrichedLeaderboardEntry,
    GeoPlanResponse,
    PromptResultDetailResponse,
    RecommendationResponse,
    RunSnapshotResponse,
    TrendsLeaderboardResponse,
)
from app.routers.auth import get_current_user_optional
from app.services.parser import detect_list, score_sentiment

_PAID_TIERS_REPORTS = {"growth", "scale", "enterprise"}

router = APIRouter()

_TEMPLATES_DIR = Path(__file__).parent.parent / "templates"
templates = Jinja2Templates(directory=str(_TEMPLATES_DIR))

_INTENT_WEIGHTS: dict[str, float] = {
    "high": 1.5,
    "comparison": 1.2,
    "info": 1.0,
}
_INTENT_WEIGHTS_SUM = sum(_INTENT_WEIGHTS.values())  # 3.7

_INTENT_LABELS: dict[str, str] = {
    "high": "High Intent",
    "comparison": "Comparison",
    "info": "Informational",
}


# ── Low-level helpers ─────────────────────────────────────────────────────────

def _brand_stats(
    mention_count: int,
    total: int,
    total_all_mentions: int,
    positions: list[int],
    sentiment_counter: Counter,
) -> dict:
    return {
        "mention_count": mention_count,
        "mention_rate": round(mention_count / total * 100, 1) if total else 0.0,
        "sov": round(mention_count / total_all_mentions * 100, 1) if total_all_mentions else 0.0,
        "avg_position": round(sum(positions) / len(positions), 1) if positions else None,
        "sentiment": {
            "positive": sentiment_counter.get("positive", 0),
            "neutral": sentiment_counter.get("neutral", 0),
            "negative": sentiment_counter.get("negative", 0),
        },
    }


def _arrs(weighted_sov: float, pos_rate: float) -> float:
    """AI Replacement Risk Score (0–100). weighted_sov is already 0–100."""
    return round(min(100.0, weighted_sov + pos_rate * 15), 1)


def _gap_arrs(
    brand_row: dict,
    comp_rows: list[dict],
    list_pct: float,
) -> tuple[int, str, str]:
    """Gap-based ARRS for primary brand (0–100, band, explain)."""
    b_hi = brand_row.get("sov_high", 0.0)
    b_comp = brand_row.get("sov_comp", 0.0)
    b_info = brand_row.get("sov_info", 0.0)
    top_hi = max((r.get("sov_high", 0.0) for r in comp_rows), default=0.0)
    top_comp = max((r.get("sov_comp", 0.0) for r in comp_rows), default=0.0)
    top_info = max((r.get("sov_info", 0.0) for r in comp_rows), default=0.0)

    gap_hi = max(0.0, top_hi - b_hi)
    gap_comp = max(0.0, top_comp - b_comp)
    gap_info = max(0.0, top_info - b_info)

    raw = gap_hi * 1.5 + gap_comp * 1.2 + gap_info * 1.0
    multiplier = 1.0 if list_pct >= 70 else (0.5 if list_pct <= 30 else 0.7)
    score = min(100, round(raw * multiplier))

    band = "high" if score >= 60 else ("med" if score >= 30 else "low")

    gaps = {"High Intent": gap_hi, "Comparison": gap_comp, "Informational": gap_info}
    worst = max(gaps, key=lambda k: gaps[k])
    explain = (
        f"Largest gap in {worst} ({gaps[worst]:.0f}pp behind top competitor)"
        if gaps[worst] > 0 else "No gap vs competitors"
    )
    return score, band, explain


def _intent_sov_map(
    results: list[PromptResult],
    brand_name: str,
    competitor_names: list[str],
) -> dict[str, dict[str, float]]:
    """
    Returns {brand: {intent_type: sov_pct}} for the primary brand + all competitors.
    sov_pct is 0–100, computed as brand_mentions / total_all_brand_mentions per intent slice.
    """
    all_names = [brand_name] + list(competitor_names)
    sov: dict[str, dict[str, float]] = {n: {} for n in all_names}

    for it in _INTENT_WEIGHTS:
        slice_ = [r for r in results if (r.intent_type or "high") == it]
        if not slice_:
            for n in all_names:
                sov[n][it] = 0.0
            continue

        counts: dict[str, int] = {}
        counts[brand_name] = sum(1 for r in slice_ if r.brand_mentioned)
        for comp in competitor_names:
            counts[comp] = sum(
                1 for r in slice_
                if (r.competitors_data or {}).get(comp, {}).get("mentioned")
            )
        total_all = sum(counts.values())
        for n in all_names:
            sov[n][it] = round(counts[n] / total_all * 100, 1) if total_all else 0.0

    return sov


# ── Brand table builder ───────────────────────────────────────────────────────

def _build_brand_table(
    results: list[PromptResult],
    brand_name: str,
    competitor_names: list[str],
    with_intent: bool = False,
) -> list[dict]:
    """
    Build a per-brand stats list for the given result slice.
    When with_intent=True, adds sov_high/sov_comp/sov_info/weighted_sov/arrs.
    """
    total = len(results)
    if total == 0:
        return []

    # Primary brand counts
    brand_mention_count = sum(1 for r in results if r.brand_mentioned)
    brand_positions = [
        r.brand_mention_position
        for r in results
        if r.brand_mentioned and r.brand_mention_position is not None
    ]
    brand_sentiment_ctr = Counter(
        r.brand_sentiment.value for r in results if r.brand_mentioned
    )

    # Competitor counts
    comp_data: dict[str, dict] = {}
    for comp in competitor_names:
        positions: list[int] = []
        sentiments: list[str] = []
        count = 0
        for r in results:
            cd = (r.competitors_data or {}).get(comp, {})
            if cd.get("mentioned"):
                count += 1
                pos = cd.get("position")
                if pos is not None:
                    positions.append(pos)
                if r.raw_response:
                    sentiments.append(score_sentiment(r.raw_response, comp))
        comp_data[comp] = {
            "count": count,
            "positions": positions,
            "sentiment_ctr": Counter(sentiments),
        }

    total_all_mentions = brand_mention_count + sum(d["count"] for d in comp_data.values())

    # Compute intent SOV map once if needed
    isov = _intent_sov_map(results, brand_name, competitor_names) if with_intent else {}

    def _add_intent_fields(name: str, sentiment: dict) -> dict:
        hi = isov[name].get("high", 0.0)
        comp = isov[name].get("comparison", 0.0)
        info = isov[name].get("info", 0.0)
        weighted = round(
            (hi * 1.5 + comp * 1.2 + info * 1.0) / _INTENT_WEIGHTS_SUM, 1
        )
        total_mentions = sum(sentiment.values())
        pos_rate = sentiment["positive"] / total_mentions if total_mentions else 0.0
        return {
            "sov_high": hi,
            "sov_comp": comp,
            "sov_info": info,
            "weighted_sov": weighted,
            "arrs": _arrs(weighted, pos_rate),
        }

    table: list[dict] = []

    # Primary brand row
    base = _brand_stats(
        brand_mention_count, total, total_all_mentions,
        brand_positions, brand_sentiment_ctr,
    )
    row: dict = {"name": brand_name, "is_primary": True, **base}
    if with_intent:
        row.update(_add_intent_fields(brand_name, base["sentiment"]))
    table.append(row)

    # Competitor rows
    for comp in competitor_names:
        d = comp_data[comp]
        base = _brand_stats(
            d["count"], total, total_all_mentions,
            d["positions"], d["sentiment_ctr"],
        )
        row = {"name": comp, "is_primary": False, **base}
        if with_intent:
            row.update(_add_intent_fields(comp, base["sentiment"]))
        table.append(row)

    return table


# ── List / rank-method metadata ───────────────────────────────────────────────

def _list_meta(results: list[PromptResult]) -> tuple[list[dict], float, str, str]:
    """
    Returns (result_meta, list_pct, dominant_method, dominant_confidence).
    result_meta is parallel to `results`.
    """
    meta: list[dict] = []
    for r in results:
        if r.error:
            meta.append({"list_detected": False, "confidence": "low", "rank_method": "first-mention"})
            continue
        ld = detect_list(r.raw_response)
        meta.append({
            "list_detected": ld,
            "confidence": "high" if ld else "low",
            "rank_method": "list-order" if ld else "first-mention",
        })

    total = len(results)
    list_count = sum(1 for m in meta if m["list_detected"])
    list_pct = round(list_count / total * 100, 1) if total else 0.0

    if list_pct >= 70:
        dominant_method, dominant_confidence = "list-order", "high"
    elif list_pct <= 30:
        dominant_method, dominant_confidence = "first-mention", "low"
    else:
        dominant_method, dominant_confidence = "mixed", "mixed"

    return meta, list_pct, dominant_method, dominant_confidence


# ── Main metrics aggregator ───────────────────────────────────────────────────

def _compute_metrics(
    results: list[PromptResult],
    brand_name: str,
    competitor_names: list[str],
) -> dict:
    total = len(results)
    if total == 0:
        return {
            "total": 0,
            "brand_table": [],
            "result_meta": [],
            "list_pct": 0.0,
            "dominant_method": "first-mention",
            "dominant_confidence": "low",
            "provider_sections": [],
            "providers_used": [],
            "failed_count": 0,
            "intent_sections": [],
            "arrs_leaderboard": [],
            "arrs": 0,
            "arrs_band": "low",
            "arrs_explain": "",
        }

    result_meta, list_pct, dominant_method, dominant_confidence = _list_meta(results)

    # Overall brand table with intent metrics
    brand_table = _build_brand_table(results, brand_name, competitor_names, with_intent=True)

    # ARRS leaderboard — top 5 brands by arrs
    arrs_leaderboard = sorted(
        brand_table,
        key=lambda r: r.get("arrs", 0.0),
        reverse=True,
    )[:5]

    # Top-level gap-based ARRS for primary brand
    primary_row = next((r for r in brand_table if r["is_primary"]), None)
    comp_rows_all = [r for r in brand_table if not r["is_primary"]]
    arrs, arrs_band, arrs_explain = (
        _gap_arrs(primary_row, comp_rows_all, list_pct) if primary_row else (0, "low", "")
    )

    # Per-intent breakdown sections (simplified table without intent nesting)
    intent_sections: list[dict] = []
    for it, weight in _INTENT_WEIGHTS.items():
        slice_ = [r for r in results if (r.intent_type or "high") == it]
        intent_sections.append({
            "intent_type": it,
            "label": _INTENT_LABELS[it],
            "weight": weight,
            "count": len(slice_),
            "brand_table": _build_brand_table(slice_, brand_name, competitor_names, with_intent=True),
        })

    # Per-provider breakdown
    providers_used = sorted({r.provider for r in results if r.provider})
    provider_sections: list[dict] = []
    for pname in providers_used:
        p_results = [r for r in results if r.provider == pname]
        _, p_list_pct, p_method, p_conf = _list_meta(p_results)
        p_brand_table = _build_brand_table(p_results, brand_name, competitor_names, with_intent=True)
        p_primary = next((r for r in p_brand_table if r["is_primary"]), None)
        p_comps = [r for r in p_brand_table if not r["is_primary"]]
        p_arrs, p_arrs_band, p_arrs_explain = (
            _gap_arrs(p_primary, p_comps, p_list_pct) if p_primary else (0, "low", "")
        )
        provider_sections.append({
            "provider": pname,
            "total": len(p_results),
            "brand_table": p_brand_table,
            "list_pct": p_list_pct,
            "dominant_method": p_method,
            "dominant_confidence": p_conf,
            "failed_count": sum(1 for r in p_results if r.error is not None),
            "arrs": p_arrs,
            "arrs_band": p_arrs_band,
            "arrs_explain": p_arrs_explain,
        })

    failed_count = sum(1 for r in results if r.error is not None)

    return {
        "total": total,
        "brand_table": brand_table,
        "result_meta": result_meta,
        "list_pct": list_pct,
        "dominant_method": dominant_method,
        "dominant_confidence": dominant_confidence,
        "provider_sections": provider_sections,
        "providers_used": providers_used,
        "failed_count": failed_count,
        "intent_sections": intent_sections,
        "arrs_leaderboard": arrs_leaderboard,
        "arrs": arrs,
        "arrs_band": arrs_band,
        "arrs_explain": arrs_explain,
    }


# ── Routes ────────────────────────────────────────────────────────────────────

@router.get("/runs/{run_id}/metrics", response_class=JSONResponse)
async def get_metrics(
    run_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    run = await db.get(Run, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    stmt = (
        select(PromptResult)
        .where(PromptResult.run_id == run_id)
        .order_by(PromptResult.provider, PromptResult.processed_at)
    )
    result_rows = await db.execute(stmt)
    results = result_rows.scalars().all()

    metrics = _compute_metrics(results, run.brand_name, run.competitor_names or [])
    return JSONResponse(content=metrics)


@router.post("/runs/{run_id}/export/notion")
async def export_to_notion(
    run_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    from app.config import settings
    from app.services.notion_export import export_run_to_notion

    if not settings.notion_token or not settings.notion_database_id:
        raise HTTPException(status_code=400, detail="Notion is not configured (missing NOTION_TOKEN or NOTION_DATABASE_ID)")

    run = await db.get(Run, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    stmt = (
        select(PromptResult)
        .where(PromptResult.run_id == run_id)
        .order_by(PromptResult.provider, PromptResult.processed_at)
    )
    result_rows = await db.execute(stmt)
    results = result_rows.scalars().all()

    metrics = _compute_metrics(results, run.brand_name, run.competitor_names or [])

    try:
        page_url = await export_run_to_notion(run, metrics)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Notion API error: {exc}")

    return {"page_url": page_url}


@router.get("/runs/{run_id}/report", response_class=HTMLResponse)
async def get_report(
    run_id: uuid.UUID,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    run = await db.get(Run, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    stmt = (
        select(PromptResult)
        .where(PromptResult.run_id == run_id)
        .order_by(PromptResult.provider, PromptResult.processed_at)
    )
    result_rows = await db.execute(stmt)
    results = result_rows.scalars().all()

    metrics = _compute_metrics(results, run.brand_name, run.competitor_names or [])

    return templates.TemplateResponse(
        "report.html.j2",
        {"request": request, "run": run, "results": results, **metrics},
    )


# ── Trend snapshots ───────────────────────────────────────────────────────────

@router.get("/brands/{brand_name}/trends", response_model=list[RunSnapshotResponse])
async def get_brand_trends(
    brand_name: str,
    days: int = Query(default=90, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
):
    """Return RunSnapshot history for a brand (for trend charts)."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    stmt = (
        select(RunSnapshot)
        .where(
            RunSnapshot.brand_name == brand_name,
            RunSnapshot.snapshot_at >= cutoff,
        )
        .order_by(RunSnapshot.snapshot_at.asc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()


# ── Recommendations ───────────────────────────────────────────────────────────

@router.get("/runs/{run_id}/recommendations", response_model=RecommendationResponse)
async def get_recommendations(
    run_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Return AI-generated optimization recommendations for a completed run."""
    stmt = select(Recommendation).where(Recommendation.run_id == run_id)
    result = await db.execute(stmt)
    rec = result.scalar_one_or_none()
    if not rec:
        raise HTTPException(
            status_code=404,
            detail="Recommendations not yet available for this run. They are generated automatically after the run completes.",
        )
    return rec


# ── Individual prompt results ─────────────────────────────────────────────────

@router.get(
    "/runs/{run_id}/results",
    response_model=list[PromptResultDetailResponse],
)
async def get_run_results(
    run_id: uuid.UUID,
    intent: str | None = Query(default=None, description="Filter by intent_type: high, comparison, info"),
    provider: str | None = Query(default=None, description="Filter by provider: openai, claude, gemini"),
    mentioned: bool | None = Query(default=None, description="Filter by brand_mentioned"),
    limit: int = Query(default=100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
):
    """Return individual prompt-response pairs for a run, with optional filters."""
    run = await db.get(Run, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    stmt = (
        select(PromptResult)
        .where(PromptResult.run_id == run_id)
        .order_by(PromptResult.intent_type, PromptResult.provider, PromptResult.processed_at)
        .limit(limit)
    )
    if intent:
        stmt = stmt.where(PromptResult.intent_type == intent)
    if provider:
        stmt = stmt.where(PromptResult.provider == provider)
    if mentioned is not None:
        stmt = stmt.where(PromptResult.brand_mentioned == mentioned)

    rows = await db.execute(stmt)
    return rows.scalars().all()


# ── Source / citation analysis ────────────────────────────────────────────────

# Domain type classification table
_DOMAIN_TYPES: dict[str, str] = {
    "wirecutter.com": "Review", "rtings.com": "Review", "tomsguide.com": "Review",
    "pcmag.com": "Review", "bestreviews.com": "Review", "reviewed.com": "Review",
    "techradar.com": "Tech Media", "theverge.com": "Tech Media", "engadget.com": "Tech Media",
    "cnet.com": "Tech Media", "zdnet.com": "Tech Media", "gizmodo.com": "Tech Media",
    "wired.com": "Tech Media", "arstechnica.com": "Tech Media", "tomshardware.com": "Tech Media",
    "9to5mac.com": "Tech Media", "9to5google.com": "Tech Media", "macrumors.com": "Tech Media",
    "amazon.com": "E-commerce", "bestbuy.com": "E-commerce", "walmart.com": "E-commerce",
    "reddit.com": "Community", "quora.com": "Community", "stackexchange.com": "Community",
    "youtube.com": "Video", "vimeo.com": "Video",
    "forbes.com": "Business", "businessinsider.com": "Business", "inc.com": "Business",
    "nytimes.com": "News", "wsj.com": "News", "bloomberg.com": "News", "reuters.com": "News",
    "consumer.ftc.gov": "Gov", "fda.gov": "Gov",
}


def _classify_domain(domain: str) -> str:
    if domain in _DOMAIN_TYPES:
        return _DOMAIN_TYPES[domain]
    d = domain.lower()
    if any(k in d for k in ("review", "reviews", "rating", "ratings", "compare")):
        return "Review"
    if any(k in d for k in ("news", "times", "post", "daily", "herald", "journal")):
        return "News"
    if any(k in d for k in ("blog", "guide", "tips", "how-to")):
        return "Blog"
    if any(k in d for k in ("shop", "store", "buy", "price", "deal")):
        return "E-commerce"
    return "Media"


def _opportunity_priority(score: float) -> str:
    if score >= 15:
        return "high"
    if score >= 5:
        return "medium"
    return "low"


@router.get("/runs/{run_id}/sources")
async def get_run_sources(
    run_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """
    Aggregate cited domains from AI responses for a run.
    Returns:
    - domains: all cited domains with citation counts and brand/competitor presence
    - opportunities: domains where competitors outrank the brand (sorted by opportunity_score)
    - summary stats + citation_health
    Costs 1 credit for free-tier users.
    """
    from urllib.parse import urlparse

    credit_cost = 0
    if user is not None:
        tier = user.subscription_tier.value if hasattr(user.subscription_tier, "value") else str(user.subscription_tier)
        if tier not in _PAID_TIERS_REPORTS:
            credit_cost = 1
            if user.credit_balance < credit_cost:
                raise HTTPException(
                    status_code=429,
                    detail={
                        "code": "credits_exhausted",
                        "balance": user.credit_balance,
                        "cost": credit_cost,
                        "message": "Credits exhausted. Upgrade for citation health analysis.",
                    },
                )

    run = await db.get(Run, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    stmt = select(PromptResult).where(PromptResult.run_id == run_id)
    rows = await db.execute(stmt)
    results = rows.scalars().all()

    competitor_names: list[str] = run.competitor_names or []
    domain_stats: dict[str, dict] = {}

    for r in results:
        urls: list[str] = r.cited_urls or []
        if not urls:
            continue

        domains_seen: set[str] = set()
        for url in urls:
            try:
                netloc = urlparse(url).netloc.lower()
                domain = netloc.lstrip("www.")
            except Exception:
                continue
            if not domain or domain in domains_seen:
                continue
            domains_seen.add(domain)

            if domain not in domain_stats:
                domain_stats[domain] = {
                    "domain": domain,
                    "citation_count": 0,
                    "brand_mentioned": 0,
                    "competitors_mentioned": {c: 0 for c in competitor_names},
                }
            s = domain_stats[domain]
            s["citation_count"] += 1
            if r.brand_mentioned:
                s["brand_mentioned"] += 1
            for comp in competitor_names:
                if (r.competitors_data or {}).get(comp, {}).get("mentioned"):
                    s["competitors_mentioned"][comp] += 1

    domains = sorted(domain_stats.values(), key=lambda x: x["citation_count"], reverse=True)

    # Build opportunities: domains where competitors outrank brand
    opportunities = []
    for d in domains:
        comp_total = sum(d["competitors_mentioned"].values())
        # Include if any competitor is cited AND they have more citations than the brand
        if comp_total > d["brand_mentioned"]:
            comp_breakdown = {c: v for c, v in d["competitors_mentioned"].items() if v > 0}
            top_comp = max(comp_breakdown, key=lambda k: comp_breakdown[k]) if comp_breakdown else ""
            gap = comp_total - d["brand_mentioned"]
            # Score = how much competitors dominate × how frequently this domain is cited
            score = round((comp_total * d["citation_count"]) / max(d["brand_mentioned"] + 0.5, 1), 1)
            opportunities.append({
                "domain": d["domain"],
                "domain_type": _classify_domain(d["domain"]),
                "citation_count": d["citation_count"],
                "brand_mentioned": d["brand_mentioned"],
                "competitors_data": comp_breakdown,
                "top_competitor": top_comp,
                "competitor_mentions": comp_breakdown.get(top_comp, 0),
                "competitor_total": comp_total,
                "gap": gap,
                "opportunity_score": score,
                "priority": _opportunity_priority(score),
                "is_pure_gap": d["brand_mentioned"] == 0,
            })

    opportunities.sort(key=lambda x: x["opportunity_score"], reverse=True)

    pure_gaps = sum(1 for o in opportunities if o["is_pure_gap"])

    # ── Citation Health aggregation ───────────────────────────────────────
    _HEALTH_BUCKET = {
        "Review": "expert", "Tech Media": "expert", "News": "expert",
        "Business": "expert", "Gov": "expert",
        "Community": "community", "Video": "community",
        "E-commerce": "retail",
        "Blog": "auto_generated", "Media": "auto_generated",
    }
    _HEALTH_META = {
        "expert":         {"label": "Expert Reviews & Media", "color": "#22c55e"},
        "community":      {"label": "Community & Forums",     "color": "#f5a623"},
        "retail":         {"label": "Retail & Listings",      "color": "#7070a0"},
        "auto_generated": {"label": "Auto-Generated / SEO",   "color": "#ff4d6d"},
    }

    bucket_counts: dict[str, int] = {"expert": 0, "community": 0, "retail": 0, "auto_generated": 0}
    bucket_examples: dict[str, list[str]] = {"expert": [], "community": [], "retail": [], "auto_generated": []}
    total_citations = sum(d["citation_count"] for d in domains)

    for d in domains:
        dtype = _classify_domain(d["domain"])
        bucket = _HEALTH_BUCKET.get(dtype, "auto_generated")
        bucket_counts[bucket] += d["citation_count"]
        if len(bucket_examples[bucket]) < 3:
            bucket_examples[bucket].append(f'{d["domain"]} ({d["citation_count"]})')

    breakdown = []
    for btype in ("expert", "community", "retail", "auto_generated"):
        pct = round(bucket_counts[btype] / max(total_citations, 1) * 100) if total_citations else 0
        meta = _HEALTH_META[btype]
        entry: dict = {
            "type": btype,
            "label": meta["label"],
            "percent": pct,
            "count": bucket_counts[btype],
            "examples": bucket_examples[btype],
            "color": meta["color"],
        }
        if btype == "auto_generated" and pct >= 12:
            entry["risk_tag"] = "Critical" if pct >= 20 else "Watch"
        elif btype == "retail" and pct >= 35:
            entry["risk_tag"] = "At risk"
        breakdown.append(entry)

    expert_pct = breakdown[0]["percent"]
    auto_pct = breakdown[3]["percent"]
    community_pct = breakdown[1]["percent"]
    health_score = min(100, max(0, round(
        expert_pct * 1.0 + community_pct * 0.6 - auto_pct * 0.5 + 20
    )))
    risk_level = "critical" if auto_pct >= 20 else "warning" if auto_pct >= 12 else "healthy"

    citation_health = {
        "score": health_score,
        "risk_level": risk_level,
        "total_citations": total_citations,
        "breakdown": breakdown,
    }

    # Deduct credit after successful computation
    if credit_cost > 0 and user:
        user.credit_balance -= credit_cost
        await db.commit()
        await db.refresh(user)

    return {
        "domains": domains[:30],
        "opportunities": opportunities[:15],
        "total_unique_domains": len(domain_stats),
        "gap_count": len(opportunities),
        "pure_gap_count": pure_gaps,
        "citation_health": citation_health,
    }


# ── Content Brief Generator ───────────────────────────────────────────────────

@router.get("/runs/{run_id}/content-briefs")
async def get_content_briefs(
    run_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    For each HIGH-priority source gap, use Claude Haiku to generate a specific,
    publishable content brief: headline, draft intro, key talking points.
    """
    import json
    from urllib.parse import urlparse

    run = await db.get(Run, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    competitor_names: list[str] = run.competitor_names or []

    stmt = select(PromptResult).where(PromptResult.run_id == run_id)
    rows = await db.execute(stmt)
    results = rows.scalars().all()

    # Rebuild domain_stats inline
    domain_stats: dict[str, dict] = {}
    for r in results:
        domains_seen: set[str] = set()
        for url in (r.cited_urls or []):
            try:
                domain = urlparse(url).netloc.lower().lstrip("www.")
            except Exception:
                continue
            if not domain or domain in domains_seen:
                continue
            domains_seen.add(domain)
            if domain not in domain_stats:
                domain_stats[domain] = {
                    "domain": domain,
                    "citation_count": 0,
                    "brand_mentioned": 0,
                    "competitors_mentioned": {c: 0 for c in competitor_names},
                }
            s = domain_stats[domain]
            s["citation_count"] += 1
            if r.brand_mentioned:
                s["brand_mentioned"] += 1
            for comp in competitor_names:
                if (r.competitors_data or {}).get(comp, {}).get("mentioned"):
                    s["competitors_mentioned"][comp] += 1

    # Pick top HIGH-priority opportunities
    top_opps = []
    for d in domain_stats.values():
        comp_total = sum(d["competitors_mentioned"].values())
        if comp_total > d["brand_mentioned"]:
            score = round((comp_total * d["citation_count"]) / max(d["brand_mentioned"] + 0.5, 1), 1)
            if _opportunity_priority(score) == "high":
                top_opps.append({
                    "domain": d["domain"],
                    "domain_type": _classify_domain(d["domain"]),
                    "citation_count": d["citation_count"],
                    "brand_mentioned": d["brand_mentioned"],
                    "competitor_total": comp_total,
                    "score": score,
                })
    top_opps.sort(key=lambda x: x["score"], reverse=True)
    top_opps = top_opps[:5]

    if not top_opps:
        return []

    try:
        import anthropic
        client = anthropic.AsyncAnthropic()

        opp_summary = "\n".join(
            f"- {o['domain']} ({o['domain_type']}): cited {o['citation_count']}x, "
            f"competitor mentions={o['competitor_total']}, brand mentions={o['brand_mentioned']}"
            for o in top_opps
        )

        prompt = (
            f"You are a GEO (Generative Engine Optimization) strategist.\n"
            f"Brand: {run.brand_name}\n"
            f"Category: {run.category} | Region: {run.region}\n"
            f"Competitors: {', '.join(competitor_names) or 'none specified'}\n\n"
            f"These platforms cite competitors more than {run.brand_name} in AI responses. "
            f"Generate one specific content brief per platform.\n\n"
            f"Platforms:\n{opp_summary}\n\n"
            f"Return a JSON array. Each item must have:\n"
            f'- "domain": the platform domain\n'
            f'- "content_type": e.g. "Product Review Pitch", "Comparison Article", "Reddit Thread", "YouTube Script"\n'
            f'- "headline": specific working title that would get {run.brand_name} cited by AI\n'
            f'- "draft_intro": 2-3 sentence opening that naturally positions {run.brand_name} vs competitors\n'
            f'- "key_points": array of 3 specific talking points to include\n'
            f'- "effort": "low"|"medium"|"high"\n'
            f'- "impact": "low"|"medium"|"high"\n'
            f'- "rationale": 1 sentence — why AI models would start citing {run.brand_name} after this content\n\n'
            f"Return ONLY valid JSON array, no markdown."
        )

        message = await client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=2500,
            messages=[{"role": "user", "content": prompt}],
        )
        text = message.content[0].text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        briefs = json.loads(text.strip())
        return briefs

    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Content brief generation failed: {exc}")


# ── Why-Losing Analysis ────────────────────────────────────────────────────────

@router.get("/runs/{run_id}/why-analysis")
async def get_why_analysis(
    run_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Sample prompts where brand was skipped but competitors were mentioned.
    Claude Sonnet analyzes the patterns and returns root-cause insights.
    """
    import json
    import random

    run = await db.get(Run, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    competitor_names: list[str] = run.competitor_names or []
    if not competitor_names:
        raise HTTPException(status_code=400, detail="No competitors to compare against")

    # Prompts where brand was NOT mentioned but a competitor was
    stmt = select(PromptResult).where(
        PromptResult.run_id == run_id,
        PromptResult.brand_mentioned == False,  # noqa: E712
    )
    rows = await db.execute(stmt)
    lost = rows.scalars().all()

    competitive_losses = [
        r for r in lost
        if any((r.competitors_data or {}).get(c, {}).get("mentioned") for c in competitor_names)
    ]
    if not competitive_losses:
        return {
            "error": "no_data",
            "message": "No prompts found where competitors were mentioned without the brand.",
            "sample_size": 0,
            "total_losses": 0,
        }

    sample = random.sample(competitive_losses, min(15, len(competitive_losses)))

    samples_text = ""
    for i, r in enumerate(sample):
        mentioned = [c for c in competitor_names if (r.competitors_data or {}).get(c, {}).get("mentioned")]
        samples_text += (
            f"\n--- Example {i + 1} ---\n"
            f"Query: {r.prompt_text[:200]}\n"
            f"AI mentioned: {', '.join(mentioned)}\n"
            f"Excerpt: {r.raw_response[:350]}\n"
        )

    try:
        import anthropic
        client = anthropic.AsyncAnthropic()

        prompt = (
            f'You are analyzing why "{run.brand_name}" is NOT being recommended by AI models '
            f"when competitors are.\n"
            f"Brand: {run.brand_name} | Category: {run.category} | Region: {run.region}\n"
            f"Competitors: {', '.join(competitor_names)}\n\n"
            f"Here are {len(sample)} real examples where AI skipped {run.brand_name}:\n"
            f"{samples_text}\n\n"
            f"Analyze the patterns. Return a JSON object with exactly these keys:\n"
            f'- "top_reasons": array of 3-4 specific reasons {run.brand_name} is being skipped '
            f"(quote evidence from the examples)\n"
            f'- "competitor_advantages": array of objects {{"competitor": name, "edge": specific reason AI favors them}}\n'
            f'- "brand_gaps": array of 3-5 specific content/positioning gaps to fix\n'
            f'- "quick_wins": array of 3 concrete, immediately actionable tactics '
            f"(e.g. exact article title to publish, exact platform to target)\n\n"
            f"Return ONLY valid JSON, no markdown."
        )

        message = await client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1500,
            messages=[{"role": "user", "content": prompt}],
        )
        text = message.content[0].text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        analysis = json.loads(text.strip())
        analysis["sample_size"] = len(sample)
        analysis["total_losses"] = len(competitive_losses)
        return analysis

    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Why-analysis failed: {exc}")


# ── Category index ─────────────────────────────────────────────────────────────

@router.get("/categories")
async def list_categories(db: AsyncSession = Depends(get_db)):
    """Return all unique categories with brand counts."""
    stmt = (
        select(Run.category, func.count(distinct(Run.brand_name)).label("brand_count"))
        .group_by(Run.category)
        .order_by(func.count(distinct(Run.brand_name)).desc())
    )
    rows = await db.execute(stmt)
    return [{"category": r.category, "brand_count": r.brand_count} for r in rows]


@router.get(
    "/categories/{category}/leaderboard",
    response_model=list[CategoryLeaderboardEntry],
)
async def category_leaderboard(
    category: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Return all brands tracked in a category, ranked by weighted_sov descending.
    Uses the most recent RunSnapshot per brand.
    """
    # Latest snapshot_at per brand where the parent run matches the category
    subq = (
        select(
            RunSnapshot.brand_name,
            func.max(RunSnapshot.snapshot_at).label("latest_at"),
        )
        .join(Run, RunSnapshot.run_id == Run.id)
        .where(func.lower(Run.category) == category.lower())
        .group_by(RunSnapshot.brand_name)
        .subquery()
    )

    stmt = (
        select(RunSnapshot)
        .join(
            subq,
            (RunSnapshot.brand_name == subq.c.brand_name)
            & (RunSnapshot.snapshot_at == subq.c.latest_at),
        )
        .order_by(RunSnapshot.weighted_sov.desc())
    )
    rows = await db.execute(stmt)
    return rows.scalars().all()


@router.get(
    "/categories/{category}/leaderboard-with-trends",
    response_model=TrendsLeaderboardResponse,
)
async def category_leaderboard_with_trends(
    category: str,
    sparkline_points: int = Query(default=5, ge=2, le=10),
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """
    Enriched leaderboard with credit gating:
    - Anonymous: top 3 brands only (limited=True)
    - Free user: costs 1 credit per call
    - Paid user: unlimited
    """
    from collections import defaultdict

    # ── Credit logic ────────────────────────────────────────────────────────
    credit_cost = 0
    limited = False

    if user is None:
        limited = True  # anonymous → top 3 only
    else:
        tier = user.subscription_tier.value if hasattr(user.subscription_tier, "value") else str(user.subscription_tier)
        if tier not in _PAID_TIERS_REPORTS:
            credit_cost = 1
            if user.credit_balance < credit_cost:
                raise HTTPException(
                    status_code=429,
                    detail={
                        "code": "credits_exhausted",
                        "balance": user.credit_balance,
                        "cost": credit_cost,
                        "message": "Credits exhausted. Upgrade to continue viewing trends.",
                    },
                )

    # ── Query ───────────────────────────────────────────────────────────────
    ranked = (
        select(
            RunSnapshot.brand_name,
            RunSnapshot.weighted_sov,
            RunSnapshot.sov_high,
            RunSnapshot.sov_comparison,
            RunSnapshot.sov_info,
            RunSnapshot.arrs,
            RunSnapshot.mention_count,
            RunSnapshot.total_prompts,
            RunSnapshot.snapshot_at,
            func.row_number()
            .over(partition_by=RunSnapshot.brand_name, order_by=RunSnapshot.snapshot_at.desc())
            .label("rn"),
        )
        .join(Run, RunSnapshot.run_id == Run.id)
        .where(func.lower(Run.category) == category.lower())
        .subquery()
    )

    stmt = (
        select(ranked)
        .where(ranked.c.rn <= sparkline_points)
        .order_by(ranked.c.brand_name, ranked.c.snapshot_at.asc())
    )
    rows = (await db.execute(stmt)).all()

    brands: dict[str, list] = defaultdict(list)
    for r in rows:
        brands[r.brand_name].append(r)

    entries = []
    for brand_name, snapshots in brands.items():
        latest = snapshots[-1]
        sparkline = [s.weighted_sov for s in snapshots]
        sov_change = sparkline[-1] - sparkline[0] if len(sparkline) > 1 else 0.0

        if len(sparkline) < 2:
            trend = "stable"
        elif sov_change > 5:
            trend = "rising"
        elif sov_change < -5:
            trend = "falling"
        else:
            trend = "stable"

        entries.append(EnrichedLeaderboardEntry(
            brand_name=brand_name,
            weighted_sov=latest.weighted_sov,
            sov_high=latest.sov_high,
            sov_comparison=latest.sov_comparison,
            sov_info=latest.sov_info,
            arrs=latest.arrs,
            mention_count=latest.mention_count,
            total_prompts=latest.total_prompts,
            snapshot_at=latest.snapshot_at,
            sparkline=sparkline,
            trend_direction=trend,
            sov_change=round(sov_change, 1),
        ))

    entries.sort(key=lambda e: e.weighted_sov, reverse=True)

    # ── Deduct credit (after successful query) ──────────────────────────────
    if credit_cost > 0 and user:
        user.credit_balance -= credit_cost
        await db.commit()
        await db.refresh(user)

    # ── Limit for anonymous users ───────────────────────────────────────────
    if limited:
        entries = entries[:3]

    return TrendsLeaderboardResponse(
        entries=entries,
        limited=limited,
        credits_remaining=user.credit_balance if user and not limited else None,
        credit_cost=credit_cost,
    )


# ── GEO Action Plan ──────────────────────────────────────────────────────────


@router.get("/runs/{run_id}/geo-plan", response_model=GeoPlanResponse)
async def get_geo_plan(
    run_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Return cached GEO Action Plan for a run (if it exists)."""
    stmt = select(GeoPlan).where(GeoPlan.run_id == run_id)
    result = await db.execute(stmt)
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(
            status_code=404,
            detail="GEO Plan not yet generated for this run. Use POST to generate.",
        )
    return plan


@router.post("/runs/{run_id}/geo-plan", response_model=GeoPlanResponse, status_code=201)
async def create_geo_plan(
    run_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """Generate a GEO Action Plan for a completed run (on-demand)."""
    run = await db.get(Run, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    if run.status.value != "done":
        raise HTTPException(status_code=400, detail="Run is not completed yet")

    # Check if plan already exists
    existing = await db.execute(select(GeoPlan).where(GeoPlan.run_id == run_id))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=409,
            detail="GEO Plan already exists for this run. Use GET to retrieve it.",
        )

    # Credit check: 2 credits for free-tier users
    credit_cost = 0
    if user:
        tier = user.subscription_tier.value if hasattr(user.subscription_tier, "value") else str(user.subscription_tier)
        if tier not in _PAID_TIERS_REPORTS:
            credit_cost = 2
            if user.credit_balance < credit_cost:
                raise HTTPException(
                    status_code=429,
                    detail={
                        "code": "credits_exhausted",
                        "balance": user.credit_balance,
                        "cost": credit_cost,
                        "message": "Not enough credits for GEO Plan generation.",
                    },
                )
            user.credit_balance -= credit_cost
            await db.commit()

    from app.database import async_session_factory
    from app.services.geo_plan_generator import generate_geo_plan

    plan = await generate_geo_plan(run_id, async_session_factory)
    return plan
