"""A2A Opportunity Engine — AI trend signal → supplier match → cost → listing."""

import json
import logging
from dataclasses import asdict
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.routers.auth import get_current_user_optional
from app.models import User
from app.services.supplier_data import (
    calculate_landed_cost,
    get_tariff,
    search_suppliers,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/opportunity-engine", tags=["opportunity-engine"])


# ── Request / Response Models ──────────────────────────────────────────────

class ScanRequest(BaseModel):
    brand: str
    category: str
    market: str = "US"


class CostCalculateRequest(BaseModel):
    supplier_unit_cost: float
    quantity: int = 1000
    hs_code: str
    weight_kg: float = 1.0


class GenerateListingRequest(BaseModel):
    brand: str
    product_name: str
    product_description: str = ""
    ai_signals: dict = {}
    target_platform: str = "amazon"
    language: str = "en"


# ── Demo data for instant hackathon pitch ──────────────────────────────────

_DEMO_SCAN_RESULT = {
    "brand": "Sensarte",
    "category": "Cookware",
    "market": "US",
    "market_signals": {
        "reddit_score": 72,
        "reddit_post_count": 18,
        "reddit_sentiment": "positive",
        "kol_count": 12,
        "kol_total_views": 2_400_000,
        "tiktok_present": True,
        "tiktok_product_count": 8,
        "tiktok_trending": True,
        "google_trend_direction": "up",
        "google_delta": 34,
        "market_alignment_score": 74,
        "alignment_label": "strong",
    },
    "ai_trending_products": [
        {
            "product_name": "Honeycomb Stainless Steel Wok",
            "why_trending": "AI engines increasingly recommend hybrid stainless-nonstick woks. Reddit r/Cooking sees 3x more wok discussions. ChatGPT now ranks 'honeycomb wok' in top 3 for 'best wok' queries.",
            "ai_recommendation_score": 92,
            "search_volume_trend": "rising",
            "competitor_gap": "HexClad dominates at $200+. No mid-range ($35-60) hybrid option exists — massive price gap.",
            "suggested_hs_code": "7323.93",
            "suggested_category_keyword": "cookware",
        },
        {
            "product_name": "Ceramic Coated Cast Iron Dutch Oven",
            "why_trending": "Perplexity and Claude recommend ceramic-coated cast iron for health-conscious cooks. Le Creuset alternatives trending on TikTok with 15M+ views.",
            "ai_recommendation_score": 85,
            "search_volume_trend": "rising",
            "competitor_gap": "Lodge and Cuisinart own budget segment. No Chinese brand has AI visibility in this space.",
            "suggested_hs_code": "7323.94",
            "suggested_category_keyword": "cookware",
        },
        {
            "product_name": "Granite Stone Griddle Pan",
            "why_trending": "Google Trends shows +45% search interest for 'griddle pan' in Q1 2026. AI engines link granite coating to PFOA-free safety narrative.",
            "ai_recommendation_score": 78,
            "search_volume_trend": "rising",
            "competitor_gap": "Sensarte already has nonstick pans but no griddle variant. Easy SKU extension.",
            "suggested_hs_code": "7323.93",
            "suggested_category_keyword": "cookware",
        },
        {
            "product_name": "Stackable Nonstick Pot & Pan Set (6-pc)",
            "why_trending": "AI engines recommend space-saving cookware for small kitchens. Apartment-dweller demographic growing. ChatGPT 'best cookware set for small kitchen' triggers this category.",
            "ai_recommendation_score": 71,
            "search_volume_trend": "stable",
            "competitor_gap": "Caraway and Our Place own premium stackable. Budget ($40-80) segment is wide open.",
            "suggested_hs_code": "7323.93",
            "suggested_category_keyword": "cookware",
        },
    ],
    "scan_timestamp": "2026-03-28T12:00:00Z",
}

_DEMO_LISTING = {
    "title": "SENSARTE Honeycomb Stainless Steel Wok, 12.5 Inch Hybrid Non-Stick Stir Fry Pan with Stay-Cool Handle, PFOA-Free, Induction Compatible, Dishwasher Safe",
    "bullet_points": [
        "HONEYCOMB NON-STICK TECHNOLOGY — Patented laser-etched honeycomb surface creates air pockets that prevent food from contacting the pan directly, delivering true non-stick performance without chemical coatings",
        "HYBRID STAINLESS STEEL CONSTRUCTION — 3-ply 18/10 stainless steel body with aluminum core for even heat distribution. Combines the durability of stainless steel with the convenience of non-stick",
        "HEALTHY COOKING — 100% PFOA-free, PFOS-free, and cadmium-free. No chemical coatings that degrade over time. Safe for metal utensils without scratching",
        "UNIVERSAL COMPATIBILITY — Works on all cooktops including induction, gas, electric, and ceramic. Oven-safe up to 500°F. Flat bottom design for stability",
        "ERGONOMIC STAY-COOL HANDLE — Riveted stainless steel handle stays cool during stovetop cooking. Balanced weight distribution for easy tossing and flipping",
    ],
    "description": "Upgrade your kitchen with the SENSARTE Honeycomb Stainless Steel Wok — the perfect fusion of professional-grade stainless steel and effortless non-stick cooking. Our patented honeycomb technology creates microscopic air pockets on the cooking surface, allowing food to release naturally without chemical coatings. Ideal for stir-frying, searing, sautéing, and deep-frying, this 12.5-inch wok handles everything from weeknight dinners to weekend feasts. The 3-ply construction with an aluminum core ensures even heat distribution and eliminates hot spots, while the stay-cool handle keeps you comfortable during extended cooking sessions.",
    "backend_keywords": [
        "honeycomb wok", "stainless steel wok", "non stick wok", "hybrid wok",
        "PFOA free wok", "induction wok", "stir fry pan", "healthy wok",
        "hexclad alternative", "nonstick stainless steel", "wok pan 12 inch",
    ],
    "faq_schema": [
        {"question": "Is this wok truly non-stick without chemical coatings?",
         "answer": "Yes! The honeycomb texture creates physical non-stick properties through micro air pockets, not chemical coatings. Food releases naturally when the pan is properly preheated with a small amount of oil."},
        {"question": "How does this compare to HexClad?",
         "answer": "The SENSARTE Honeycomb Wok uses similar hybrid technology at a fraction of the price. Both feature laser-etched stainless steel surfaces, but SENSARTE offers the same performance at 60-70% less cost."},
        {"question": "Can I use metal utensils on this wok?",
         "answer": "Absolutely. The stainless steel honeycomb surface is highly scratch-resistant. Metal spatulas, tongs, and whisks are all safe to use."},
        {"question": "Is this wok dishwasher safe?",
         "answer": "Yes, it is dishwasher safe. However, for best longevity, we recommend hand washing with warm soapy water."},
    ],
    "ai_optimization_notes": [
        "FAQ Schema included — AI engines cite FAQ-rich listings 3x more often",
        "Direct competitor comparison (HexClad) included — AI engines use comparison data in recommendation queries",
        "PFOA-free safety narrative emphasized — matches health-conscious AI recommendation patterns",
        "Price-value positioning highlighted — AI engines increasingly recommend 'best value' alternatives",
        "Specific technical specs (3-ply, 18/10 steel) — AI factual grounding improves citation likelihood",
    ],
}


# ── Endpoints ──────────────────────────────────────────────────────────────

@router.post("/scan")
async def scan_opportunities(
    req: ScanRequest,
    demo: bool = Query(False, description="Return instant demo data"),
    user: User | None = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    """Scan AI engines for trending product opportunities that a brand is missing."""
    if demo:
        return _DEMO_SCAN_RESULT

    # ── 1. Fetch market signals ────────────────────────────────────────────
    from app.services.market_signals import fetch_market_signals

    try:
        signals = await fetch_market_signals(req.brand, req.category)
        signals_dict = asdict(signals)
    except Exception as e:
        logger.warning("Market signals fetch failed: %s", e)
        signals_dict = {}

    # ── 2. Call Claude for AI trend analysis ────────────────────────────────
    import anthropic

    system_prompt = """\
You are an AI-powered cross-border e-commerce trend analyst for Avanti A2A.
Your job: identify products that AI engines (ChatGPT, Claude, Perplexity, Gemini) are
increasingly recommending, but that a given brand does NOT currently offer.

You will receive:
- A brand name and its current product category
- Cross-platform market signals (Reddit, YouTube KOL, TikTok, Google Trends)

Return ONLY a valid JSON array of 3-5 trending product opportunities:
[
  {
    "product_name": "Specific product name",
    "why_trending": "2-3 sentences explaining why AI engines are recommending this. Reference specific signals.",
    "ai_recommendation_score": <int 0-100, how strongly AI engines are pushing this>,
    "search_volume_trend": "rising" | "stable",
    "competitor_gap": "Who currently dominates and what gap exists for this brand",
    "suggested_hs_code": "XXXX.XX format",
    "suggested_category_keyword": "one of: cookware, baby, electronics, home, outdoor"
  }
]

Rules:
1. Products must be SPECIFIC (not generic categories).
2. Each opportunity should have a clear reason why AI engines are recommending it.
3. ai_recommendation_score: 90+ = AI engines actively recommending, 70-89 = emerging trend, 50-69 = early signal.
4. Reference actual market signal data in your reasoning.
5. Return ONLY valid JSON, no markdown, no explanation."""

    user_prompt = (
        f"Brand: {req.brand}\n"
        f"Category: {req.category}\n"
        f"Market: {req.market}\n\n"
        f"Market Signals:\n{json.dumps(signals_dict, indent=2, default=str)}\n\n"
        f"Identify 3-5 product opportunities that AI engines are trending toward "
        f"but {req.brand} doesn't currently offer."
    )

    try:
        client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
        message = await client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        text = message.content[0].text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        trending_products = json.loads(text.strip())
    except Exception as e:
        logger.error("Claude trend analysis failed: %s", e)
        trending_products = []

    return {
        "brand": req.brand,
        "category": req.category,
        "market": req.market,
        "market_signals": signals_dict,
        "ai_trending_products": trending_products,
        "scan_timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/suppliers")
async def get_suppliers(
    keyword: str = Query(..., description="Product keyword to search"),
    hs_code: str | None = Query(None, description="HS code for tariff preview"),
):
    """Search 1688 supplier database by product keyword."""
    suppliers = search_suppliers(keyword)
    tariff_preview = None
    if hs_code:
        t = get_tariff(hs_code)
        tariff_preview = t.to_dict() if t else None

    return {
        "keyword": keyword,
        "suppliers": [s.to_dict() for s in suppliers],
        "tariff_preview": tariff_preview,
    }


@router.post("/cost-calculate")
async def cost_calculate(req: CostCalculateRequest):
    """Calculate full landed cost breakdown for importing from China to US."""
    breakdown = calculate_landed_cost(
        supplier_unit_cost=req.supplier_unit_cost,
        quantity=req.quantity,
        hs_code=req.hs_code,
        weight_kg=req.weight_kg,
    )
    return breakdown.to_dict()


@router.post("/generate-listing")
async def generate_listing(
    req: GenerateListingRequest,
    demo: bool = Query(False, description="Return instant demo data"),
    user: User | None = Depends(get_current_user_optional),
):
    """Generate an AI-optimized Amazon listing using Claude."""
    if demo:
        return _DEMO_LISTING

    import anthropic

    system_prompt = """\
You are an expert Amazon listing copywriter who specializes in AI-optimized product listings.
Your listings are designed to be cited and recommended by AI engines (ChatGPT, Claude, Perplexity).

AI Optimization Principles:
1. Include FAQ Schema — AI engines cite FAQ-rich listings 3x more
2. Use specific, factual claims with numbers — AI engines prefer verifiable information
3. Include competitor comparisons — AI engines use this for recommendation queries
4. Highlight safety certifications — AI engines prioritize safety in recommendations
5. Use natural language that matches how AI engines phrase recommendations

Return ONLY a valid JSON object:
{
  "title": "Brand + Product Title with key features (under 200 chars)",
  "bullet_points": ["5 bullet points, each starting with CAPITALIZED BENEFIT"],
  "description": "2-3 paragraph product description",
  "backend_keywords": ["10-15 search keywords"],
  "faq_schema": [{"question": "...", "answer": "..."}, ...4 items],
  "ai_optimization_notes": ["5 notes explaining what was optimized for AI engines"]
}"""

    user_prompt = (
        f"Brand: {req.brand}\n"
        f"Product: {req.product_name}\n"
        f"Description: {req.product_description}\n"
        f"Platform: {req.target_platform}\n"
        f"Language: {req.language}\n\n"
        f"AI Trend Signals:\n{json.dumps(req.ai_signals, indent=2, default=str)}\n\n"
        f"Generate an AI-optimized {req.target_platform} listing."
    )

    try:
        client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
        message = await client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=3000,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        text = message.content[0].text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text.strip())
    except Exception as e:
        logger.error("Listing generation failed: %s", e)
        raise HTTPException(status_code=500, detail=f"Listing generation failed: {e}")
