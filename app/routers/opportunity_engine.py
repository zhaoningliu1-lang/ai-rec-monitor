"""A2A Opportunity Engine — AI trend signal → supplier match → cost → listing.

Integrates ALL available data sources:
- Market Signals Engine (Reddit, YouTube KOL, TikTok Shop, Google Trends)
- Rainforest API (Amazon product data, BSR, reviews, pricing)
- Historical PromptResult DB (AI engine recommendation trends)
- Claude AI (trend analysis synthesis)
"""

import asyncio
import json
import logging
from dataclasses import asdict
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.routers.auth import get_current_user_optional
from app.models import PromptResult, Run, RunStatus, User
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


# ── Helper: fetch Amazon competition data ──────────────────────────────────

async def _fetch_amazon_data(brand: str, category: str) -> dict:
    """Fetch real Amazon competition data via Rainforest API."""
    try:
        from app.services.amazon_service import search_brand, search_keyword_ranking
        brand_data, keyword_data = await asyncio.gather(
            search_brand(brand),
            search_keyword_ranking(category.lower(), brand),
            return_exceptions=True,
        )
        result = {}
        if isinstance(brand_data, dict):
            result["brand_presence"] = {
                "product_count": brand_data.get("product_count", 0),
                "avg_rating": brand_data.get("avg_rating", 0),
                "avg_reviews": brand_data.get("avg_reviews", 0),
                "top_products": brand_data.get("top_products", [])[:5],
            }
        if isinstance(keyword_data, dict):
            result["keyword_ranking"] = {
                "brand_rank": keyword_data.get("brand_rank"),
                "total_results": keyword_data.get("total_results", 0),
                "top_competitors": keyword_data.get("top_competitors", [])[:5],
            }
        return result
    except Exception as e:
        logger.warning("Amazon data fetch failed: %s", e)
        return {}


# ── Helper: fetch Reddit raw posts ─────────────────────────────────────────

async def _fetch_reddit_posts(brand: str, category: str) -> list:
    """Fetch real Reddit posts mentioning brand/category."""
    try:
        from app.services.reddit_scraper import search_brand_across_subreddits
        posts = await search_brand_across_subreddits(brand, category, limit_per_sub=5)
        return [
            {
                "title": p.get("title", ""),
                "subreddit": p.get("subreddit", ""),
                "score": p.get("score", 0),
                "num_comments": p.get("num_comments", 0),
                "url": p.get("url", ""),
                "snippet": (p.get("selftext_snippet", "") or "")[:200],
            }
            for p in (posts or [])[:8]
        ]
    except Exception as e:
        logger.warning("Reddit fetch failed: %s", e)
        return []


# ── Helper: fetch YouTube KOLs ─────────────────────────────────────────────

async def _fetch_youtube_kols(brand: str, category: str) -> list:
    """Fetch real YouTube KOL data."""
    try:
        from app.services.youtube_scraper import search_kols
        kols = await search_kols(brand, category, limit=8)
        return [
            {
                "channel_name": k.get("channel_name", ""),
                "video_title": k.get("video_title", ""),
                "video_url": k.get("video_url", ""),
                "views": k.get("views", 0),
                "tier": k.get("tier", "micro"),
                "sentiment": k.get("sentiment", "mixed"),
            }
            for k in (kols or [])[:8]
        ]
    except Exception as e:
        logger.warning("YouTube KOL fetch failed: %s", e)
        return []


# ── Helper: fetch TikTok Shop data ─────────────────────────────────────────

async def _fetch_tiktok_data(brand: str, category: str) -> dict:
    """Fetch real TikTok Shop data."""
    try:
        from app.services.tiktok_shop import search_brand_on_tiktok
        data = await search_brand_on_tiktok(brand, category)
        if isinstance(data, dict):
            return {
                "present": data.get("present", False),
                "product_count": data.get("product_count", 0),
                "avg_rating": data.get("avg_rating", 0),
                "top_products": [
                    {"title": p.get("title", ""), "price": p.get("price", ""), "sales": p.get("sales", 0)}
                    for p in (data.get("top_products") or [])[:5]
                ],
            }
        return {}
    except Exception as e:
        logger.warning("TikTok data fetch failed: %s", e)
        return {}


# ── Helper: query historical PromptResult for trend detection ──────────────

async def _fetch_ai_trend_data(category: str, db: AsyncSession) -> dict:
    """Query historical PromptResult DB for AI recommendation trends."""
    try:
        # Get recent runs in this category
        runs_q = await db.execute(
            select(Run.id, Run.brand_name, Run.created_at)
            .where(Run.category.ilike(f"%{category}%"), Run.status == RunStatus.done)
            .order_by(Run.created_at.desc())
            .limit(20)
        )
        recent_runs = runs_q.all()
        if not recent_runs:
            return {}

        run_ids = [r.id for r in recent_runs]

        # Get mention counts per brand across these runs
        brand_mentions_q = await db.execute(
            select(
                Run.brand_name,
                func.count(PromptResult.id).label("total_prompts"),
                func.count(PromptResult.id).filter(PromptResult.brand_mentioned == True).label("mentions"),
            )
            .join(Run, PromptResult.run_id == Run.id)
            .where(Run.id.in_(run_ids))
            .group_by(Run.brand_name)
        )
        brand_data = brand_mentions_q.all()

        # Compile trend data
        brands_trending = []
        for row in brand_data:
            total = row.total_prompts or 1
            mentions = row.mentions or 0
            sov = round(mentions / total * 100, 1)
            brands_trending.append({
                "brand": row.brand_name,
                "sov_pct": sov,
                "total_prompts": total,
                "mention_count": mentions,
            })

        brands_trending.sort(key=lambda x: x["sov_pct"], reverse=True)

        return {
            "category": category,
            "recent_runs_count": len(recent_runs),
            "top_brands_by_sov": brands_trending[:10],
        }
    except Exception as e:
        logger.warning("AI trend DB query failed: %s", e)
        return {}


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
    """Scan ALL data sources in parallel for trending product opportunities."""
    if demo:
        return _DEMO_SCAN_RESULT

    # ── 1. Fetch ALL data sources in parallel ──────────────────────────────
    from app.services.market_signals import fetch_market_signals

    (
        signals_result,
        amazon_result,
        reddit_result,
        youtube_result,
        tiktok_result,
        ai_trend_result,
    ) = await asyncio.gather(
        fetch_market_signals(req.brand, req.category),
        _fetch_amazon_data(req.brand, req.category),
        _fetch_reddit_posts(req.brand, req.category),
        _fetch_youtube_kols(req.brand, req.category),
        _fetch_tiktok_data(req.brand, req.category),
        _fetch_ai_trend_data(req.category, db),
        return_exceptions=True,
    )

    # Process results (graceful degradation)
    signals_dict = asdict(signals_result) if not isinstance(signals_result, Exception) else {}
    amazon_data = amazon_result if not isinstance(amazon_result, Exception) else {}
    reddit_posts = reddit_result if not isinstance(reddit_result, Exception) else []
    youtube_kols = youtube_result if not isinstance(youtube_result, Exception) else []
    tiktok_data = tiktok_result if not isinstance(tiktok_result, Exception) else {}
    ai_trend_data = ai_trend_result if not isinstance(ai_trend_result, Exception) else {}

    # ── 2. Build enriched context for Claude ───────────────────────────────
    enriched_context = {
        "market_signals": signals_dict,
        "amazon_competition": amazon_data,
        "reddit_discussions": reddit_posts[:5],
        "youtube_kols": youtube_kols[:5],
        "tiktok_shop": tiktok_data,
        "ai_historical_trends": ai_trend_data,
    }

    # ── 3. Call Claude with ALL real data ───────────────────────────────────
    import anthropic

    system_prompt = """\
You are an AI-powered cross-border e-commerce trend analyst for Avanti A2A.
Your job: identify products that AI engines (ChatGPT, Claude, Perplexity, Gemini) are
increasingly recommending, but that a given brand does NOT currently offer.

You will receive REAL cross-platform data:
- Market signals (Reddit sentiment, YouTube KOL coverage, TikTok Shop, Google Trends)
- Amazon competition data (product counts, ratings, reviews, BSR rankings, top competitors)
- Reddit discussions (actual community posts and engagement)
- YouTube KOL videos (creator names, view counts, tiers)
- TikTok Shop data (product presence, sales, ratings)
- Historical AI recommendation trends (which brands AI engines are pushing in this category)

Return ONLY a valid JSON array of 3-5 trending product opportunities:
[
  {
    "product_name": "Specific product name",
    "why_trending": "2-3 sentences referencing SPECIFIC real data points (e.g., actual Reddit post titles, YouTube creator names, Amazon competitor review counts, TikTok sales numbers)",
    "ai_recommendation_score": <int 0-100>,
    "search_volume_trend": "rising" | "stable",
    "competitor_gap": "Reference SPECIFIC competitors from Amazon data with their review counts and ratings",
    "suggested_hs_code": "XXXX.XX format",
    "suggested_category_keyword": "one of: cookware, baby, electronics, home, outdoor"
  }
]

Rules:
1. Products must be SPECIFIC (not generic categories).
2. MUST reference actual data from the provided sources (real Reddit titles, real Amazon competitors, real YouTube creators).
3. ai_recommendation_score: 90+ = AI engines actively recommending, 70-89 = emerging trend, 50-69 = early signal.
4. competitor_gap MUST cite real competitor names and their Amazon stats if available.
5. Return ONLY valid JSON, no markdown, no explanation."""

    user_prompt = (
        f"Brand: {req.brand}\n"
        f"Category: {req.category}\n"
        f"Market: {req.market}\n\n"
        f"=== REAL DATA (all fetched live) ===\n\n"
        f"{json.dumps(enriched_context, indent=2, default=str)}\n\n"
        f"Identify 3-5 product opportunities that AI engines are trending toward "
        f"but {req.brand} doesn't currently offer. Reference the REAL data above."
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

    # ── 4. Return enriched response with all real data ─────────────────────
    return {
        "brand": req.brand,
        "category": req.category,
        "market": req.market,
        "market_signals": signals_dict,
        "amazon_data": amazon_data,
        "reddit_posts": reddit_posts,
        "youtube_kols": youtube_kols,
        "tiktok_data": tiktok_data,
        "ai_trend_data": ai_trend_data,
        "ai_trending_products": trending_products,
        "scan_timestamp": datetime.now(timezone.utc).isoformat(),
        "data_sources": [
            s for s in [
                "market_signals" if signals_dict else None,
                "amazon_rainforest" if amazon_data else None,
                "reddit_praw" if reddit_posts else None,
                "youtube_kol" if youtube_kols else None,
                "tiktok_shop" if tiktok_data else None,
                "ai_historical_db" if ai_trend_data else None,
                "claude_sonnet",
            ] if s
        ],
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
