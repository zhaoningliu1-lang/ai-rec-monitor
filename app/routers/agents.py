"""Agent Growth Engine API — autonomous GEO optimization cycles."""

import asyncio
import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import desc, select

from app.database import async_session_factory
from app.models import AgentCycle, CycleStatus

router = APIRouter(prefix="/agents", tags=["agents"])


class CycleCreate(BaseModel):
    brand_name: str
    category: str
    region: str = "us"
    competitor_names: list[str] = []
    providers: list[str] = ["openai"]


class CycleOut(BaseModel):
    id: str
    brand_name: str
    category: str
    region: str
    competitor_names: list[str]
    providers: list[str]
    status: str
    monitor_output: dict | None
    analyst_output: dict | None
    strategist_output: dict | None
    experiment_output: dict | None
    created_at: str | None
    completed_at: str | None


def _to_dict(c: AgentCycle) -> dict:
    return {
        "id": str(c.id),
        "brand_name": c.brand_name,
        "category": c.category,
        "region": c.region,
        "competitor_names": c.competitor_names or [],
        "providers": c.providers or [],
        "status": c.status.value,
        "monitor_output": c.monitor_output,
        "analyst_output": c.analyst_output,
        "strategist_output": c.strategist_output,
        "experiment_output": c.experiment_output,
        "created_at": c.created_at.isoformat() if c.created_at else None,
        "completed_at": c.completed_at.isoformat() if c.completed_at else None,
    }


@router.post("/cycles")
async def create_cycle(body: CycleCreate):
    """Launch a new autonomous growth agent cycle."""
    cycle = AgentCycle(
        brand_name=body.brand_name,
        category=body.category,
        region=body.region,
        competitor_names=body.competitor_names,
        providers=body.providers,
    )

    async with async_session_factory() as db:
        db.add(cycle)
        await db.commit()
        await db.refresh(cycle)
        cycle_id = str(cycle.id)

    from app.agents.engine import run_growth_cycle

    asyncio.create_task(
        run_growth_cycle(
            cycle_id=cycle_id,
            brand_name=body.brand_name,
            category=body.category,
            region=body.region,
            competitors=body.competitor_names,
            providers=body.providers,
        )
    )

    async with async_session_factory() as db:
        cycle = await db.get(AgentCycle, uuid.UUID(cycle_id))
    return _to_dict(cycle)


@router.get("/cycles")
async def list_cycles(limit: int = 20):
    """List recent growth agent cycles."""
    async with async_session_factory() as db:
        result = await db.execute(
            select(AgentCycle)
            .order_by(desc(AgentCycle.created_at))
            .limit(limit)
        )
        cycles = result.scalars().all()
    return [_to_dict(c) for c in cycles]


@router.get("/cycles/{cycle_id}")
async def get_cycle(cycle_id: str):
    """Get a single growth agent cycle with all agent outputs."""
    async with async_session_factory() as db:
        cycle = await db.get(AgentCycle, uuid.UUID(cycle_id))
    if not cycle:
        raise HTTPException(status_code=404, detail="Cycle not found")
    return _to_dict(cycle)
