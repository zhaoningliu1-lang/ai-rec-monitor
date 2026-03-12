import re
import uuid
from datetime import date, datetime, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session_factory, get_db
from app.models import Run, User
from app.routers.auth import get_current_user_optional
from app.schemas import CreateRunRequest, RunResponse
from app.services.brand_normalizer import _KNOWN_ALIASES
from app.services.job_runner import run_job

router = APIRouter()

# ── Credit costs ──────────────────────────────────────────────────────────────
# 1 credit = 5 prompts; paid tiers have unlimited usage.
_PAID_TIERS = {"growth", "scale", "enterprise"}


def _brand_abbr(brand_name: str) -> str:
    """Return 4-char uppercase code using English alias when available."""
    english = _KNOWN_ALIASES.get(brand_name.strip(), brand_name)
    ascii_letters = re.sub(r"[^A-Za-z]", "", english.encode("ascii", "ignore").decode())
    return ascii_letters[:4].upper().ljust(4, "X")


async def _generate_run_code(db: AsyncSession, brand_name: str) -> str:
    """Generate a unique human-readable run code: YYYYMMDD-ABBR-NNNN."""
    today = date.today().strftime("%Y%m%d")
    abbr = _brand_abbr(brand_name)
    prefix = f"{today}-{abbr}-"
    count = await db.scalar(
        select(func.count(Run.id)).where(Run.run_code.like(f"{prefix}%"))
    ) or 0
    return f"{prefix}{count + 1:04d}"


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.post("/runs", response_model=RunResponse, status_code=202)
async def create_run(
    body: CreateRunRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    # ── Credit check for free-tier authenticated users ──────────────────────────
    credit_cost = 0
    if user:
        tier = user.subscription_tier.value if hasattr(user.subscription_tier, "value") else str(user.subscription_tier)
        if tier not in _PAID_TIERS:
            credit_cost = max(1, body.num_prompts // 5)
            if user.credit_balance < credit_cost:
                raise HTTPException(
                    status_code=429,
                    detail={
                        "code": "credits_exhausted",
                        "balance": user.credit_balance,
                        "cost": credit_cost,
                        "message": "Credits exhausted. Add a payment method to continue.",
                    },
                )

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
        user_id=user.id if user else None,
    )
    db.add(run)
    if credit_cost > 0:
        user.credit_balance -= credit_cost
    await db.commit()
    await db.refresh(run)

    background_tasks.add_task(run_job, run.id, async_session_factory)
    return run


@router.get("/runs", response_model=list[RunResponse])
async def list_runs(
    brand: str | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    if not user:
        return []
    stmt = (
        select(Run)
        .where(Run.user_id == user.id)
        .order_by(Run.created_at.desc())
        .limit(limit)
    )
    if brand:
        stmt = stmt.where(Run.brand_name == brand)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/runs/{run_id}", response_model=RunResponse)
async def get_run(run_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    run = await db.get(Run, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run
