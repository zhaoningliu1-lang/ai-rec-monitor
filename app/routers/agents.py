"""Agent Growth Engine API — autonomous GEO optimization cycles."""

import asyncio
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session_factory, get_db
from app.models import AgentCycle, CycleStatus, User
from app.routers.auth import get_current_user_optional

router = APIRouter(prefix="/agents", tags=["agents"])

_PAID_TIERS = {"growth", "scale", "enterprise"}


class CycleCreate(BaseModel):
    brand_name: str
    category: str
    region: str = "us"
    competitor_names: list[str] = []
    providers: list[str] = ["openai"]
    language: str = "en"


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
async def create_cycle(
    body: CycleCreate,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """Launch a new autonomous growth agent cycle. Costs 3 credits for free-tier."""
    credit_cost = 0
    if user is None:
        raise HTTPException(status_code=401, detail="Sign in to use Growth Agent.")
    tier = user.subscription_tier.value if hasattr(user.subscription_tier, "value") else str(user.subscription_tier)
    if tier not in _PAID_TIERS:
        credit_cost = 3
        if user.credit_balance < credit_cost:
            raise HTTPException(
                status_code=429,
                detail={
                    "code": "credits_exhausted",
                    "balance": user.credit_balance,
                    "cost": credit_cost,
                    "message": "Not enough credits for Growth Agent. Upgrade for unlimited access.",
                },
            )
        user.credit_balance -= credit_cost
        await db.commit()
        await db.refresh(user)

    cycle = AgentCycle(
        brand_name=body.brand_name,
        category=body.category,
        region=body.region,
        competitor_names=body.competitor_names,
        providers=body.providers,
        language=body.language,
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
            language=body.language,
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
