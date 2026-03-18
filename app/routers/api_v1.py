"""Avanti Public API v1 — Agent-Native endpoints.

Authenticate with API key via X-API-Key header or Authorization: Bearer avanti_...
"""
import asyncio
import logging
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session_factory, get_db
from app.models import GeoPlan, Run, RunStatus, User
from app.routers.auth import get_current_user_flexible
from app.schemas import CreateRunRequest, RunResponse

router = APIRouter(prefix="/api/v1", tags=["API v1"])
logger = logging.getLogger(__name__)

_PAID_TIERS = {"growth", "scale", "enterprise"}


def _tier(user: User) -> str:
    return user.subscription_tier.value if hasattr(user.subscription_tier, "value") else str(user.subscription_tier)


def _check_credits(user: User, cost: int):
    """Raise 429 if free-tier user lacks credits."""
    if _tier(user) in _PAID_TIERS:
        return
    if user.credit_balance < cost:
        raise HTTPException(status_code=429, detail={
            "code": "credits_exhausted",
            "balance": user.credit_balance,
            "required": cost,
        })


async def _deduct(user: User, cost: int, db: AsyncSession) -> int:
    """Deduct credits for free-tier, return remaining balance."""
    if _tier(user) in _PAID_TIERS:
        return user.credit_balance
    user.credit_balance -= cost
    await db.commit()
    return user.credit_balance


# ── Account ──────────────────────────────────────────────────────────────────

@router.get("/me")
async def api_me(user: User = Depends(get_current_user_flexible)):
    """Verify your API key and get account info."""
    return {
        "id": str(user.id),
        "email": user.email,
        "tier": _tier(user),
        "credit_balance": user.credit_balance,
    }


@router.get("/credits")
async def api_credits(user: User = Depends(get_current_user_flexible)):
    """Get credit balance and cost reference."""
    return {
        "balance": user.credit_balance,
        "tier": _tier(user),
        "is_paid": _tier(user) in _PAID_TIERS,
        "costs": {
            "scan": "free (2/month limit for free tier)",
            "reddit_search": 1,
            "kol_search": 1,
            "tiktok_search": 1,
            "content_score": 1,
            "faq_generate": 5,
            "content_generate": 10,
        },
    }


# ── GEO Scans ────────────────────────────────────────────────────────────────

_FREE_TIER_SCANS_PER_MONTH = 2


@router.post("/scans", status_code=202)
async def create_scan(
    body: CreateRunRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user_flexible),
):
    """Create a new AI visibility scan. Returns 202 with run ID."""
    from app.routers.runs import _generate_run_code
    from app.services.job_runner import run_job

    tier = _tier(user)
    if tier not in _PAID_TIERS:
        now = datetime.now(timezone.utc)
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly = await db.scalar(
            select(func.count(Run.id)).where(Run.user_id == user.id, Run.created_at >= month_start)
        ) or 0
        if monthly >= _FREE_TIER_SCANS_PER_MONTH:
            raise HTTPException(status_code=429, detail={
                "code": "scan_limit_reached",
                "monthly_scans": monthly,
                "limit": _FREE_TIER_SCANS_PER_MONTH,
            })

    run_code = await _generate_run_code(db, body.brand_name)
    run = Run(
        brand_name=body.brand_name,
        competitor_names=body.competitor_names,
        category=body.category,
        region=body.region,
        num_prompts=body.num_prompts,
        providers=body.providers,
        price_band=body.price_band,
        progress_total=body.num_prompts * len(body.providers),
        progress_done=0,
        run_code=run_code,
        user_id=user.id,
    )
    db.add(run)
    await db.commit()
    await db.refresh(run)
    asyncio.create_task(run_job(run.id, async_session_factory))
    return {
        "id": str(run.id),
        "run_code": run.run_code,
        "status": run.status.value if hasattr(run.status, "value") else run.status,
        "brand_name": run.brand_name,
        "category": run.category,
        "message": "Scan started. Poll GET /api/v1/scans/{id} for status.",
    }


@router.get("/scans")
async def list_scans(
    brand: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user_flexible),
):
    """List your scans."""
    q = select(Run).where(Run.user_id == user.id).order_by(Run.created_at.desc()).limit(limit)
    if brand:
        q = q.where(Run.brand_name.ilike(f"%{brand}%"))
    result = await db.execute(q)
    runs = result.scalars().all()
    return [
        {
            "id": str(r.id),
            "run_code": r.run_code,
            "brand_name": r.brand_name,
            "category": r.category,
            "status": r.status.value if hasattr(r.status, "value") else r.status,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in runs
    ]


@router.get("/scans/{scan_id}")
async def get_scan(
    scan_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user_flexible),
):
    """Get scan status and basic info."""
    run = await db.get(Run, scan_id)
    if not run:
        raise HTTPException(status_code=404, detail="Scan not found")
    return RunResponse.model_validate(run)


@router.get("/scans/{scan_id}/metrics")
async def get_scan_metrics(
    scan_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user_flexible),
):
    """Get computed metrics (SOV, ARRS, mentions) for a completed scan."""
    from app.routers.reports import _build_metrics
    run = await db.get(Run, scan_id)
    if not run:
        raise HTTPException(status_code=404, detail="Scan not found")
    if run.status != RunStatus.completed:
        raise HTTPException(status_code=409, detail=f"Scan status is '{run.status.value}', not completed.")
    return await _build_metrics(run, db)


@router.get("/scans/{scan_id}/geo-plan")
async def get_geo_plan(
    scan_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user_flexible),
):
    """Get the AI-generated action plan for a scan."""
    result = await db.execute(select(GeoPlan).where(GeoPlan.run_id == scan_id))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="No plan yet. POST /api/v1/scans/{id}/geo-plan to generate.")
    return {
        "id": str(plan.id),
        "run_id": str(plan.run_id),
        "brand_name": plan.brand_name,
        "current_geo_score": plan.current_geo_score,
        "projected_geo_score": plan.projected_geo_score,
        "weaknesses": plan.weaknesses,
        "actions": plan.actions,
        "generated_at": plan.generated_at.isoformat() if plan.generated_at else None,
    }


@router.post("/scans/{scan_id}/geo-plan")
async def create_geo_plan(
    scan_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user_flexible),
):
    """Generate an AI action plan using Claude."""
    from app.services.geo_plan_generator import generate_geo_plan
    run = await db.get(Run, scan_id)
    if not run:
        raise HTTPException(status_code=404, detail="Scan not found")
    if run.status != RunStatus.completed:
        raise HTTPException(status_code=409, detail="Scan must be completed before generating a plan.")
    plan = await generate_geo_plan(run.id, async_session_factory)
    return {
        "id": str(plan.id),
        "run_id": str(plan.run_id),
        "brand_name": plan.brand_name,
        "current_geo_score": plan.current_geo_score,
        "projected_geo_score": plan.projected_geo_score,
        "weaknesses": plan.weaknesses,
        "actions": plan.actions,
        "generated_at": plan.generated_at.isoformat() if plan.generated_at else None,
    }


@router.get("/scans/{scan_id}/market-signals")
async def get_market_signals(
    scan_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user_flexible),
):
    """Get cross-platform market signals (Reddit, YouTube, TikTok, Google Trends)."""
    from app.services.market_signals import fetch_market_signals
    run = await db.get(Run, scan_id)
    if not run:
        raise HTTPException(status_code=404, detail="Scan not found")
    try:
        signals = await asyncio.wait_for(
            fetch_market_signals(run.brand_name, run.category or ""), timeout=30
        )
        return signals.to_dict()
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="Market signals fetch timed out")
    except Exception as e:
        logger.warning("Market signals error: %s", e)
        raise HTTPException(status_code=502, detail="Failed to fetch market signals")


# ── Intelligence Search ──────────────────────────────────────────────────────

@router.get("/search/reddit")
async def search_reddit(
    q: str = Query(..., min_length=2, max_length=200),
    category: str | None = Query(default=None),
    limit: int = Query(default=10, ge=1, le=25),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user_flexible),
):
    """Search Reddit for brand mentions. Cost: 1 credit (free tier)."""
    from app.services.reddit_scraper import (
        basic_sentiment,
        search_brand_across_subreddits,
        search_reddit as _search,
    )

    _check_credits(user, 1)

    if category:
        posts = await search_brand_across_subreddits(q, category=category, limit_per_sub=5)
    else:
        posts = await _search(q, limit=limit)

    enriched = []
    now_ts = datetime.now(timezone.utc).timestamp()
    for p in posts:
        enriched.append({
            **p,
            "sentiment": basic_sentiment(f"{p.get('title', '')} {p.get('selftext_snippet', '')}"),
            "age_days": max(0, int((now_ts - p.get("created_utc", now_ts)) / 86400)),
        })

    remaining = await _deduct(user, 1, db)
    return {"posts": enriched, "total": len(enriched), "credit_cost": 1, "credits_remaining": remaining}


@router.get("/search/kol")
async def search_kol(
    q: str = Query(..., min_length=2, max_length=200),
    category: str | None = Query(default=None),
    limit: int = Query(default=10, ge=1, le=25),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user_flexible),
):
    """Search YouTube for KOL coverage. Cost: 1 credit (free tier)."""
    from app.services.youtube_scraper import search_kols

    _check_credits(user, 1)
    kols = await search_kols(q, category=category, limit=limit)
    remaining = await _deduct(user, 1, db)
    return {"kols": kols, "total": len(kols), "credit_cost": 1, "credits_remaining": remaining}


@router.get("/search/tiktok")
async def search_tiktok(
    q: str = Query(..., min_length=2, max_length=200),
    category: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user_flexible),
):
    """Search TikTok Shop products. Cost: 1 credit (free tier)."""
    from app.services.tiktok_shop import search_products

    _check_credits(user, 1)
    products = await search_products(q, category=category)
    remaining = await _deduct(user, 1, db)
    return {"products": products, "total": len(products), "credit_cost": 1, "credits_remaining": remaining}


# ── Trends & Categories ──────────────────────────────────────────────────────

@router.get("/categories")
async def list_categories(db: AsyncSession = Depends(get_db)):
    """List all monitored categories."""
    result = await db.execute(
        select(Run.category).where(Run.category.isnot(None)).distinct()
    )
    categories = sorted([r[0] for r in result.all() if r[0]])
    return {"categories": categories}


@router.get("/categories/{category}/leaderboard")
async def category_leaderboard(
    category: str,
    limit: int = Query(default=20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """Get brand rankings for a category by AI visibility (SOV)."""
    from app.models import RunSnapshot
    subq = (
        select(RunSnapshot.brand_name, func.max(RunSnapshot.snapshot_at).label("latest"))
        .join(Run, RunSnapshot.run_id == Run.id)
        .where(Run.category == category, Run.status == RunStatus.completed)
        .group_by(RunSnapshot.brand_name)
        .subquery()
    )
    result = await db.execute(
        select(RunSnapshot)
        .join(subq, (RunSnapshot.brand_name == subq.c.brand_name) & (RunSnapshot.snapshot_at == subq.c.latest))
        .order_by(RunSnapshot.sov_overall.desc())
        .limit(limit)
    )
    snapshots = result.scalars().all()
    return {
        "category": category,
        "brands": [
            {
                "brand": s.brand_name,
                "sov_overall": round(s.sov_overall, 1) if s.sov_overall else 0,
                "arrs": round(s.arrs, 2) if s.arrs else 0,
                "mention_count": s.mention_count,
                "total_prompts": s.total_prompts,
            }
            for s in snapshots
        ],
    }


@router.get("/trends/google/{category}")
async def google_trends(category: str):
    """Get Google Trends data for a category."""
    from app.services.selection_intelligence import _get_google_trends
    try:
        data = await _get_google_trends(category)
        return data
    except Exception:
        return {"keywords": {}, "delta_4w_pct": {}, "rising_queries": []}
