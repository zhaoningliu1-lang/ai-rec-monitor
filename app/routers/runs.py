import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session_factory, get_db
from app.models import Run
from app.schemas import CreateRunRequest, RunResponse
from app.services.job_runner import run_job

router = APIRouter()


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.post("/runs", response_model=RunResponse, status_code=202)
async def create_run(
    body: CreateRunRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    # progress_total = prompts × providers; job_runner will set the exact count
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
):
    stmt = select(Run).order_by(Run.created_at.desc()).limit(limit)
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
