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
from app.models import Recommendation, PromptResult, Run, RunSnapshot
from app.schemas import (
    CategoryLeaderboardEntry,
    PromptResultDetailResponse,
    RecommendationResponse,
    RunSnapshotResponse,
)
from app.services.parser import detect_list, score_sentiment

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

@router.get("/runs/{run_id}/sources")
async def get_run_sources(
    run_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Aggregate cited domains from AI responses for a run.
    Returns top domains and opportunity list (competitor cited, you're not).
    """
    from urllib.parse import urlparse

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

    opportunities = []
    for d in domains:
        comp_total = sum(d["competitors_mentioned"].values())
        if comp_total > 0 and d["brand_mentioned"] == 0:
            top_comp = max(d["competitors_mentioned"], key=lambda k: d["competitors_mentioned"][k])
            opportunities.append({
                "domain": d["domain"],
                "citation_count": d["citation_count"],
                "top_competitor": top_comp,
                "competitor_mentions": d["competitors_mentioned"][top_comp],
            })

    opportunities.sort(key=lambda x: x["citation_count"], reverse=True)

    return {
        "domains": domains[:30],
        "opportunities": opportunities[:10],
        "total_unique_domains": len(domain_stats),
    }


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
