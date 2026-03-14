"""Selection Intelligence API — category discovery with cross-platform signals."""

import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import User
from app.routers.auth import get_current_user_optional
from app.schemas import (
    SelectionCategoryDetailResponse,
    SelectionIntelligenceResponse,
)
from app.services.selection_intelligence import (
    get_category_detail,
    get_selection_intelligence,
)

router = APIRouter(prefix="/selection", tags=["selection"])
logger = logging.getLogger(__name__)

_PAID_TIERS = {"growth", "scale", "enterprise"}


def _user_tier(user: User) -> str:
    return user.subscription_tier.value if hasattr(user.subscription_tier, "value") else str(user.subscription_tier)


@router.get("/intelligence", response_model=SelectionIntelligenceResponse)
async def selection_intelligence(
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """
    Return all categories with AI visibility data + cross-platform signals.

    - Anonymous: all categories visible, top_brands limited to 1st place only
    - Free user: 1 credit, full top_brands for first 9 categories
    - Paid user: unlimited, all categories fully enriched
    """
    credit_cost = 0
    limited = False

    if user is None:
        limited = True
    else:
        tier = _user_tier(user)
        if tier not in _PAID_TIERS:
            credit_cost = 1
            if user.credit_balance < credit_cost:
                raise HTTPException(
                    status_code=429,
                    detail={
                        "code": "credits_exhausted",
                        "balance": user.credit_balance,
                        "cost": credit_cost,
                        "message": "Credits exhausted. Upgrade for full selection intelligence.",
                    },
                )

    categories = await get_selection_intelligence(db)

    # Apply access restrictions
    if limited:
        # Anonymous: show all categories but only first brand
        for cat in categories:
            cat["top_brands"] = cat["top_brands"][:1]
            cat["google_trends_delta"] = None
            cat["reddit_posts"] = None
            cat["youtube_kols"] = None
    elif credit_cost > 0:
        # Free tier: full data for first 9 categories only
        for cat in categories[9:]:
            cat["top_brands"] = cat["top_brands"][:1]

    # Deduct credit
    if credit_cost > 0 and user:
        user.credit_balance -= credit_cost
        await db.commit()
        await db.refresh(user)

    return SelectionIntelligenceResponse(
        categories=categories,
        total=len(categories),
        limited=limited,
        credits_remaining=user.credit_balance if user else None,
        credit_cost=credit_cost,
    )


@router.get(
    "/categories/{category}/detail",
    response_model=SelectionCategoryDetailResponse,
)
async def selection_category_detail(
    category: str,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """
    Detailed category view: full leaderboard + Reddit + YouTube + Google Trends.
    Costs 1 credit for free-tier users.
    """
    credit_cost = 0

    if user is None:
        raise HTTPException(status_code=401, detail="Sign in for category details.")

    tier = _user_tier(user)
    if tier not in _PAID_TIERS:
        credit_cost = 1
        if user.credit_balance < credit_cost:
            raise HTTPException(
                status_code=429,
                detail={
                    "code": "credits_exhausted",
                    "balance": user.credit_balance,
                    "cost": credit_cost,
                    "message": "Credits exhausted. Upgrade for category details.",
                },
            )

    detail = await get_category_detail(category, db)

    # Deduct credit
    if credit_cost > 0:
        user.credit_balance -= credit_cost
        await db.commit()
        await db.refresh(user)

    return SelectionCategoryDetailResponse(
        **detail,
        credits_remaining=user.credit_balance,
        credit_cost=credit_cost,
    )
