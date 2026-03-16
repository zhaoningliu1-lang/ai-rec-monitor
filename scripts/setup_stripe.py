#!/usr/bin/env python3
"""
Stripe Product & Price Setup for Avanti AI Visibility Platform.

Usage:
  # Test mode (recommended first):
  STRIPE_SECRET_KEY=sk_test_xxx python scripts/setup_stripe.py

  # Live mode:
  STRIPE_SECRET_KEY=sk_live_xxx python scripts/setup_stripe.py

Output: Prints env variables to add to .env / Railway.
"""

import os
import sys

try:
    import stripe
except ImportError:
    print("pip install stripe")
    sys.exit(1)

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
if not stripe.api_key:
    print("Error: Set STRIPE_SECRET_KEY environment variable")
    print("  export STRIPE_SECRET_KEY=sk_test_...")
    sys.exit(1)

mode = "TEST" if "test" in stripe.api_key else "LIVE"
print(f"\n{'='*50}")
print(f"  Avanti — Stripe Setup ({mode} MODE)")
print(f"{'='*50}\n")


def create_product_with_price(name: str, description: str, amount_cents: int, interval: str = "month") -> tuple[str, str]:
    """Create a Stripe product and price. Returns (product_id, price_id)."""
    product = stripe.Product.create(
        name=name,
        description=description,
        metadata={"platform": "avanti-aiv"},
    )
    price = stripe.Price.create(
        product=product.id,
        unit_amount=amount_cents,
        currency="usd",
        recurring={"interval": interval},
    )
    print(f"  Created: {name}")
    print(f"    Product: {product.id}")
    print(f"    Price:   {price.id} (${amount_cents / 100:.0f}/{interval})")
    return product.id, price.id


# ── Create Products & Prices ─────────────────────────────────────────────────

print("Creating products...\n")

_, starter_price = create_product_with_price(
    name="Avanti — Starter",
    description="1 brand, monthly AI visibility reports, 4 AI engines, selection intelligence",
    amount_cents=9900,
)

_, growth_price = create_product_with_price(
    name="Avanti — Growth",
    description="3 brands, bi-weekly reports, cross-platform signals, AI Visibility Plans, priority support",
    amount_cents=24900,
)

_, agency_price = create_product_with_price(
    name="Avanti — Agency",
    description="20 brands, weekly reports, white-label, API access, dedicated strategist",
    amount_cents=99900,
)

# ── Configure Customer Portal ────────────────────────────────────────────────

try:
    stripe.billing_portal.Configuration.create(
        features={
            "subscription_cancel": {"enabled": True, "mode": "at_period_end"},
            "subscription_update": {
                "enabled": True,
                "default_allowed_updates": ["price"],
                "products": [
                    {"product": p, "prices": [pr]}
                    for p, pr in [(starter_price, starter_price), (growth_price, growth_price), (agency_price, agency_price)]
                ],
            },
            "invoice_history": {"enabled": True},
        },
        business_profile={
            "headline": "Avanti — AI Visibility Platform",
        },
    )
    print("\n  Customer portal configured.")
except Exception as e:
    print(f"\n  Portal config skipped: {e}")

# ── Webhook Endpoint ─────────────────────────────────────────────────────────

print("\n" + "="*50)
print("  SETUP COMPLETE")
print("="*50)
print(f"""
Add these to your .env (local) or Railway variables (production):

  STRIPE_SECRET_KEY={stripe.api_key}
  STRIPE_PRICE_STARTER={starter_price}
  STRIPE_PRICE_MONITOR={growth_price}
  STRIPE_PRICE_PRO={agency_price}

Then configure webhook in Stripe Dashboard:
  URL: https://ai-rec-monitor-production.up.railway.app/billing/webhook
  Events: customer.subscription.created, customer.subscription.updated, customer.subscription.deleted

  After creating the webhook, copy the signing secret and add:
  STRIPE_WEBHOOK_SECRET=whsec_xxx

Done! Restart your backend to apply.
""")
