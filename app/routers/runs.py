import re
import uuid
from datetime import date, datetime, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, Request
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


# Free-scan ladder (fairness must point toward signing up):
#   anonymous:       3 scans / day / IP   (DB-backed — survives redeploys,
#                                          shared across instances)
#   signed-in free:  8 scans / day / user (was 2/MONTH — worse than anon,
#                                          an inverted incentive; fixed)
#   paid tiers:      unlimited
_ANON_SCANS_PER_IP_PER_DAY = 3
_FREE_USER_SCANS_PER_DAY = 8


async def _anon_cap_ok(db: AsyncSession, ip: str) -> bool:
    """True if this anonymous IP may scan today; increments the counter."""
    from app.models import AnonScanLog
    today = date.today().isoformat()
    row = (
        await db.execute(
            select(AnonScanLog).where(AnonScanLog.ip == ip, AnonScanLog.day == today)
        )
    ).scalar_one_or_none()
    if row is None:
        db.add(AnonScanLog(ip=ip, day=today, count=1))
        await db.commit()
        return True
    if row.count >= _ANON_SCANS_PER_IP_PER_DAY:
        return False
    row.count += 1
    await db.commit()
    return True


@router.post("/runs", response_model=RunResponse, status_code=202)
async def create_run(
    body: CreateRunRequest,
    request: Request,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    # ── Measure layer is FREE — no credits deducted for scans.
    ADMIN_EMAIL = "hello@avantia2a.com"
    if user is None:
        xff = request.headers.get("x-forwarded-for")
        ip = xff.split(",")[0].strip() if xff else (request.client.host if request.client else "unknown")
        if not await _anon_cap_ok(db, ip):
            raise HTTPException(
                status_code=429,
                detail={
                    "code": "anon_scan_limit_reached",
                    "limit": _ANON_SCANS_PER_IP_PER_DAY,
                    "message": f"Free scans are limited to {_ANON_SCANS_PER_IP_PER_DAY}/day. Create a free account for {_FREE_USER_SCANS_PER_DAY}/day.",
                },
            )
    if user and user.email != ADMIN_EMAIL:
        tier = user.subscription_tier.value if hasattr(user.subscription_tier, "value") else str(user.subscription_tier)
        if tier not in _PAID_TIERS:
            from datetime import datetime, timezone, timedelta
            now = datetime.now(timezone.utc)
            day_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            daily_count = await db.scalar(
                select(func.count(Run.id)).where(
                    Run.user_id == user.id,
                    Run.created_at >= day_start,
                )
            ) or 0
            if daily_count >= _FREE_USER_SCANS_PER_DAY:
                raise HTTPException(
                    status_code=429,
                    detail={
                        "code": "scan_limit_reached",
                        "daily_scans": daily_count,
                        "limit": _FREE_USER_SCANS_PER_DAY,
                        "message": f"Free plan allows {_FREE_USER_SCANS_PER_DAY} scans/day. Upgrade to Starter for unlimited scans.",
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


@router.get("/runs/{run_id}/market-signals")
async def run_market_signals(
    run_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """Fetch cross-platform market signals for a run's brand + category."""
    run = await db.get(Run, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    # Market signals are part of the Measure layer — free for all tiers.
    from app.services.market_signals import fetch_market_signals

    signals = await fetch_market_signals(run.brand_name, run.category or "")
    result = signals.to_dict()
    result["credits_remaining"] = user.credit_balance if user else None
    result["credit_cost"] = 0
    return result
