"""CRUD endpoints for ScheduledRun — recurring automated run configuration."""
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import ScheduledRun
from app.schemas import CreateScheduleRequest, ScheduleResponse

router = APIRouter(prefix="/schedules", tags=["schedules"])


def _compute_next_run(cron_expr: str) -> datetime | None:
    """Compute the next fire time for a cron expression."""
    try:
        from croniter import croniter
        it = croniter(cron_expr, datetime.now(timezone.utc))
        return it.get_next(datetime)
    except Exception:
        return None


@router.post("", response_model=ScheduleResponse, status_code=201)
async def create_schedule(
    body: CreateScheduleRequest,
    db: AsyncSession = Depends(get_db),
):
    next_run = _compute_next_run(body.cron_expr)
    schedule = ScheduledRun(
        brand_name=body.brand_name,
        competitor_names=body.competitor_names,
        category=body.category,
        region=body.region,
        providers=body.providers,
        price_band=body.price_band,
        cron_expr=body.cron_expr,
        num_prompts=body.num_prompts,
        enabled=True,
        next_run_at=next_run,
    )
    db.add(schedule)
    await db.commit()
    await db.refresh(schedule)
    return schedule


@router.get("", response_model=list[ScheduleResponse])
async def list_schedules(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ScheduledRun).order_by(ScheduledRun.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{schedule_id}", response_model=ScheduleResponse)
async def get_schedule(schedule_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    s = await db.get(ScheduledRun, schedule_id)
    if not s:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return s


@router.patch("/{schedule_id}/enable", response_model=ScheduleResponse)
async def enable_schedule(schedule_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    s = await db.get(ScheduledRun, schedule_id)
    if not s:
        raise HTTPException(status_code=404, detail="Schedule not found")
    s.enabled = True
    s.next_run_at = _compute_next_run(s.cron_expr)
    await db.commit()
    await db.refresh(s)
    return s


@router.patch("/{schedule_id}/disable", response_model=ScheduleResponse)
async def disable_schedule(schedule_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    s = await db.get(ScheduledRun, schedule_id)
    if not s:
        raise HTTPException(status_code=404, detail="Schedule not found")
    s.enabled = False
    await db.commit()
    await db.refresh(s)
    return s


@router.delete("/{schedule_id}", status_code=204)
async def delete_schedule(schedule_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    s = await db.get(ScheduledRun, schedule_id)
    if not s:
        raise HTTPException(status_code=404, detail="Schedule not found")
    await db.delete(s)
    await db.commit()
