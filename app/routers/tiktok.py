"""TikTok Shop Intelligence API — product search, trending, brand presence, OAuth."""

import logging
import os

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import User
from app.routers.auth import get_current_user_optional
from app.services.tiktok_shop import (
    CATEGORY_TIKTOK_QUERIES,
    exchange_auth_code,
    get_category_trending,
    get_oauth_url,
    get_token_status,
    search_brand_on_tiktok,
    search_products,
)

_REDIRECT_URI = os.getenv(
    "TIKTOK_REDIRECT_URI",
    "https://avantia2a.com/api/tiktok/callback",
)

router = APIRouter(prefix="/tiktok", tags=["tiktok"])
logger = logging.getLogger(__name__)

_PAID_TIERS = {"growth", "scale", "enterprise"}


# ── OAuth endpoints ───────────────────────────────────────────────────────────

@router.get("/auth")
async def tiktok_auth():
    """Redirect to TikTok Shop OAuth authorization page.
    Visit /api/tiktok/auth in browser to authorize Avanti Growth Lab."""
    url = get_oauth_url(_REDIRECT_URI)
    return RedirectResponse(url=url)


@router.get("/callback")
async def tiktok_callback(
    code: str = Query(..., description="OAuth auth_code from TikTok"),
    state: str = Query(default="avanti"),
):
    """TikTok OAuth callback. TikTok redirects here after seller authorizes.
    Exchanges auth_code for access_token + refresh_token."""
    result = await exchange_auth_code(code)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result)

    return {
        **result,
        "next_steps": [
            f"Add TIKTOK_ACCESS_TOKEN={result['access_token'][:20]}... to Railway env vars",
            f"Add TIKTOK_REFRESH_TOKEN={result['refresh_token'][:20]}... to Railway env vars",
            "Redeploy Railway to persist tokens across restarts",
        ],
    }


@router.get("/status")
async def tiktok_status():
    """Check TikTok API connection status and token validity."""
    return get_token_status()


def _user_tier(user: User) -> str:
    return user.subscription_tier.value if hasattr(user.subscription_tier, "value") else str(user.subscription_tier)


@router.get("/search")
async def tiktok_search(
    q: str = Query(..., min_length=2, max_length=100, description="Keyword to search"),
    category: str | None = Query(default=None),
    limit: int = Query(default=10, ge=1, le=25),
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """Search TikTok Shop products. 1 credit for free users."""
    limited = False
    credit_cost = 0

    if user is None:
        limited = True
    else:
        tier = _user_tier(user)
        if tier not in _PAID_TIERS:
            credit_cost = 1
            if user.credit_balance < credit_cost:
                raise HTTPException(status_code=429, detail={
                    "code": "credits_exhausted",
                    "balance": user.credit_balance,
                    "cost": credit_cost,
                    "message": "Credits exhausted. Upgrade to search TikTok Shop.",
                })

    products = await search_products(q, category, limit)

    if credit_cost > 0 and user and products:
        user.credit_balance -= credit_cost
        await db.commit()
        await db.refresh(user)

    if limited:
        products = products[:3]

    return {
        "products": products,
        "total": len(products),
        "limited": limited,
        "credits_remaining": user.credit_balance if user else None,
        "credit_cost": credit_cost,
        "query": q,
    }


@router.get("/trending/{category}")
async def tiktok_trending(
    category: str,
    limit: int = Query(default=10, ge=1, le=25),
):
    """Get trending TikTok Shop products for a category. Free endpoint."""
    products = await get_category_trending(category, limit)
    return {
        "category": category,
        "products": products,
        "total": len(products),
        "available_categories": list(CATEGORY_TIKTOK_QUERIES.keys()),
    }


@router.get("/brand/{brand}")
async def tiktok_brand_presence(
    brand: str,
    category: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """Check brand presence on TikTok Shop. 1 credit for free users."""
    credit_cost = 0
    if user is not None:
        tier = _user_tier(user)
        if tier not in _PAID_TIERS:
            credit_cost = 1
            if user.credit_balance < credit_cost:
                raise HTTPException(status_code=429, detail={
                    "code": "credits_exhausted",
                    "balance": user.credit_balance,
                    "cost": credit_cost,
                    "message": "Credits exhausted. Upgrade for brand analysis.",
                })

    result = await search_brand_on_tiktok(brand, category)

    if credit_cost > 0 and user:
        user.credit_balance -= credit_cost
        await db.commit()
        await db.refresh(user)

    return {
        **result,
        "brand": brand,
        "category": category,
        "credits_remaining": user.credit_balance if user else None,
        "credit_cost": credit_cost,
    }
