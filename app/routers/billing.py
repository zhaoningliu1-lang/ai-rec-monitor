"""Stripe billing — checkout / webhook / customer portal."""
import logging
from datetime import datetime, timezone

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models import SubscriptionStatus, SubscriptionTier, User
from app.routers.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/billing", tags=["billing"])

_TIER_MAP = {
    "growth": (settings.stripe_price_growth, SubscriptionTier.growth),
    "scale": (settings.stripe_price_scale, SubscriptionTier.scale),
}

_STATUS_MAP = {
    "active": SubscriptionStatus.active,
    "trialing": SubscriptionStatus.trialing,
    "past_due": SubscriptionStatus.past_due,
    "canceled": SubscriptionStatus.canceled,
}


def _stripe():
    if not settings.stripe_secret_key:
        raise HTTPException(status_code=503, detail="Stripe not configured")
    stripe.api_key = settings.stripe_secret_key
    return stripe


# ── Schemas ───────────────────────────────────────────────────────────────────

class CheckoutIn(BaseModel):
    tier: str          # "growth" | "scale"
    success_url: str
    cancel_url: str


class CheckoutOut(BaseModel):
    checkout_url: str


class PortalOut(BaseModel):
    portal_url: str


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("/checkout", response_model=CheckoutOut)
async def create_checkout(
    body: CheckoutIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    s = _stripe()
    if body.tier not in _TIER_MAP:
        raise HTTPException(status_code=400, detail="Invalid tier")

    price_id, _ = _TIER_MAP[body.tier]
    if not price_id:
        raise HTTPException(status_code=503, detail=f"Price for {body.tier} not configured")

    # Create or reuse Stripe customer
    if not user.stripe_customer_id:
        customer = s.Customer.create(email=user.email, name=user.full_name or user.email)
        result = await db.execute(select(User).where(User.id == user.id))
        db_user = result.scalar_one()
        db_user.stripe_customer_id = customer.id
        await db.commit()
        customer_id = customer.id
    else:
        customer_id = user.stripe_customer_id

    session = s.checkout.Session.create(
        customer=customer_id,
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=body.success_url,
        cancel_url=body.cancel_url,
        allow_promotion_codes=True,
        subscription_data={"metadata": {"user_id": str(user.id), "tier": body.tier}},
    )
    return CheckoutOut(checkout_url=session.url)


@router.post("/portal", response_model=PortalOut)
async def customer_portal(
    return_url: str,
    user: User = Depends(get_current_user),
):
    s = _stripe()
    if not user.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No Stripe customer found")

    session = s.billing_portal.Session.create(
        customer=user.stripe_customer_id,
        return_url=return_url,
    )
    return PortalOut(portal_url=session.url)


@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle Stripe webhook events — update subscription state in DB."""
    s = _stripe()
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")

    if settings.stripe_webhook_secret:
        try:
            event = s.Webhook.construct_event(payload, sig, settings.stripe_webhook_secret)
        except stripe.error.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid signature")
    else:
        import json
        event = json.loads(payload)

    etype = event["type"]
    logger.info("Stripe webhook: %s", etype)

    if etype in ("customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"):
        sub = event["data"]["object"]
        customer_id = sub["customer"]
        new_status = _STATUS_MAP.get(sub["status"], SubscriptionStatus.none)
        metadata = sub.get("metadata", {})
        tier_name = metadata.get("tier", "free")
        tier = _TIER_MAP.get(tier_name, (None, SubscriptionTier.free))[1]

        if etype == "customer.subscription.deleted":
            new_status = SubscriptionStatus.canceled
            tier = SubscriptionTier.free

        period_end = None
        if sub.get("current_period_end"):
            period_end = datetime.fromtimestamp(sub["current_period_end"], tz=timezone.utc)

        result = await db.execute(select(User).where(User.stripe_customer_id == customer_id))
        user = result.scalar_one_or_none()
        if user:
            user.stripe_subscription_id = sub["id"]
            user.subscription_status = new_status
            user.subscription_tier = tier
            user.subscription_current_period_end = period_end
            await db.commit()
            logger.info("Updated user %s subscription → tier=%s status=%s", user.id, tier, new_status)

    return {"received": True}
