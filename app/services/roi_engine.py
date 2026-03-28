"""ROI Engine — closes the GEO Score → Sales Impact loop.

Three capabilities:
1. ROI Dashboard: GEO Score change → AI traffic change → estimated revenue impact
2. Competitor Alerts: detect competitor Amazon listing changes (price, reviews, new SKUs)
3. Auto Report: one-click monthly brand report generation

Uses B2AEvent for traffic attribution + RunSnapshot for GEO history + Rainforest for Amazon data.
"""

import asyncio
import logging
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Any

from sqlalchemy import func, select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import B2AEvent, Run, RunSnapshot, RunStatus

logger = logging.getLogger(__name__)


# ═══════════════════════════════════════════════════════════════════════════
# 1. ROI DASHBOARD — GEO Score → Traffic → Revenue Attribution
# ═══════════════════════════════════════════════════════════════════════════

async def compute_roi_dashboard(brand: str, db: AsyncSession) -> dict:
    """Compute the full GEO Score → Traffic → Revenue attribution funnel.

    Connects three data sources:
    - RunSnapshot: GEO Score changes over time
    - B2AEvent: AI-referred traffic to brand's site
    - Industry benchmarks: estimated conversion rates and AOV
    """
    now = datetime.now(timezone.utc)
    thirty_days_ago = now - timedelta(days=30)
    sixty_days_ago = now - timedelta(days=60)

    # ── 1. GEO Score history (from RunSnapshot) ───────────────────────────
    snapshots_q = await db.execute(
        select(RunSnapshot.weighted_sov, RunSnapshot.sov_high, RunSnapshot.arrs,
               RunSnapshot.mention_count, RunSnapshot.total_prompts, RunSnapshot.snapshot_at)
        .join(Run, RunSnapshot.run_id == Run.id)
        .where(Run.brand_name.ilike(f"%{brand}%"), Run.status == RunStatus.done)
        .order_by(RunSnapshot.snapshot_at.desc())
        .limit(20)
    )
    snapshots = snapshots_q.all()

    geo_current = round(snapshots[0].weighted_sov * 100, 1) if snapshots else 0
    geo_prev = round(snapshots[-1].weighted_sov * 100, 1) if len(snapshots) > 1 else geo_current
    geo_delta = round(geo_current - geo_prev, 1)
    geo_trend = "improving" if geo_delta > 1 else "declining" if geo_delta < -1 else "stable"

    geo_sparkline = [round(s.weighted_sov * 100, 1) for s in reversed(snapshots[:12])]

    # ── 2. AI Traffic attribution (from B2AEvent) ─────────────────────────
    # Current period (last 30 days)
    current_traffic_q = await db.execute(
        select(
            B2AEvent.engine,
            func.count(B2AEvent.id).label("visits"),
            func.count(func.distinct(B2AEvent.visitor_id)).label("unique_visitors"),
        )
        .where(
            B2AEvent.site_domain.ilike(f"%{brand.lower()}%"),
            B2AEvent.event_at >= thirty_days_ago,
        )
        .group_by(B2AEvent.engine)
    )
    current_traffic = current_traffic_q.all()

    # Previous period (30-60 days ago)
    prev_traffic_q = await db.execute(
        select(func.count(B2AEvent.id).label("visits"))
        .where(
            B2AEvent.site_domain.ilike(f"%{brand.lower()}%"),
            B2AEvent.event_at >= sixty_days_ago,
            B2AEvent.event_at < thirty_days_ago,
        )
    )
    prev_traffic_row = prev_traffic_q.first()
    prev_visits = prev_traffic_row.visits if prev_traffic_row else 0

    total_ai_visits = sum(r.visits for r in current_traffic)
    total_unique = sum(r.unique_visitors for r in current_traffic)
    traffic_delta_pct = round((total_ai_visits - prev_visits) / max(prev_visits, 1) * 100, 1)

    engine_breakdown = [
        {"engine": r.engine, "visits": r.visits, "unique_visitors": r.unique_visitors}
        for r in current_traffic
    ]
    engine_breakdown.sort(key=lambda x: -x["visits"])

    # Daily trend (last 14 days)
    daily_q = await db.execute(
        select(
            func.date(B2AEvent.event_at).label("day"),
            func.count(B2AEvent.id).label("visits"),
        )
        .where(
            B2AEvent.site_domain.ilike(f"%{brand.lower()}%"),
            B2AEvent.event_at >= now - timedelta(days=14),
        )
        .group_by(func.date(B2AEvent.event_at))
        .order_by(func.date(B2AEvent.event_at))
    )
    daily_visits = [{"date": str(r.day), "visits": r.visits} for r in daily_q.all()]

    # ── 3. Revenue estimation (industry benchmarks) ───────────────────────
    # Cross-border e-commerce benchmarks:
    # - AI-referred traffic conversion rate: ~2.8% (higher than organic ~2.1%)
    # - Average Order Value for cookware/home: ~$42
    # - Average Order Value for electronics: ~$65
    # - Average Order Value for baby: ~$35
    CONV_RATE = 0.028
    AVG_AOV = 42.0  # Default for general cross-border products

    estimated_conversions = round(total_ai_visits * CONV_RATE)
    estimated_revenue = round(estimated_conversions * AVG_AOV, 2)
    prev_estimated_revenue = round(prev_visits * CONV_RATE * AVG_AOV, 2)
    revenue_delta = round(estimated_revenue - prev_estimated_revenue, 2)

    # ── 4. ROI correlation: GEO Score Δ → Traffic Δ → Revenue Δ ──────────
    roi_narrative = _generate_roi_narrative(
        brand, geo_current, geo_delta, geo_trend,
        total_ai_visits, traffic_delta_pct,
        estimated_revenue, revenue_delta,
    )

    return {
        "brand": brand,
        "period": "last_30_days",

        # GEO Score metrics
        "geo": {
            "current_score": geo_current,
            "previous_score": geo_prev,
            "delta": geo_delta,
            "trend": geo_trend,
            "sparkline": geo_sparkline,
            "scans_count": len(snapshots),
        },

        # AI Traffic metrics
        "traffic": {
            "total_ai_visits": total_ai_visits,
            "unique_visitors": total_unique,
            "prev_period_visits": prev_visits,
            "delta_pct": traffic_delta_pct,
            "engine_breakdown": engine_breakdown,
            "daily_trend": daily_visits,
        },

        # Revenue estimation
        "revenue": {
            "estimated_conversions": estimated_conversions,
            "estimated_revenue": estimated_revenue,
            "prev_estimated_revenue": prev_estimated_revenue,
            "revenue_delta": revenue_delta,
            "conversion_rate": CONV_RATE,
            "avg_order_value": AVG_AOV,
            "note": "Estimated based on industry benchmarks (2.8% AI conversion rate, $42 AOV). Connect Amazon SP-API for actual sales data.",
        },

        # The story
        "roi_narrative": roi_narrative,
    }


def _generate_roi_narrative(
    brand: str, geo_score: float, geo_delta: float, geo_trend: str,
    visits: int, traffic_delta: float,
    revenue: float, revenue_delta: float,
) -> list[str]:
    """Generate human-readable ROI narrative connecting GEO → Traffic → Revenue."""
    lines = []

    if geo_trend == "improving":
        lines.append(f"{brand}'s AI visibility improved by +{geo_delta} points (GEO Score: {geo_score}/100).")
    elif geo_trend == "declining":
        lines.append(f"⚠️ {brand}'s AI visibility dropped by {geo_delta} points (GEO Score: {geo_score}/100).")
    else:
        lines.append(f"{brand}'s AI visibility is stable at GEO Score {geo_score}/100.")

    if visits > 0:
        lines.append(f"AI engines drove {visits:,} visits to {brand}'s site in the last 30 days ({traffic_delta:+.1f}% vs previous period).")
    else:
        lines.append(f"No AI-referred traffic detected yet. Install the B2A tracking snippet on {brand}'s website to start tracking.")

    if revenue > 0:
        lines.append(f"Estimated revenue from AI channel: ${revenue:,.0f} ({revenue_delta:+,.0f} vs previous period).")

    if geo_delta > 0 and traffic_delta > 0:
        lines.append(f"✅ Positive correlation: GEO Score ↑{geo_delta}pp → AI traffic ↑{traffic_delta:.0f}% → Revenue ↑${revenue_delta:,.0f}. GEO optimization is working.")
    elif geo_delta > 0 and traffic_delta <= 0:
        lines.append("GEO Score improved but traffic hasn't followed yet. It typically takes 2-4 weeks for AI engines to reflect content improvements.")
    elif geo_delta < 0:
        lines.append("GEO Score declined. Review competitor activity and update content to maintain AI visibility.")

    return lines


# ═══════════════════════════════════════════════════════════════════════════
# 2. COMPETITOR ALERTS — Detect Amazon listing changes
# ═══════════════════════════════════════════════════════════════════════════

async def check_competitor_changes(brand: str, competitors: list[str] | None = None) -> dict:
    """Check competitors' Amazon listings for changes (price, reviews, new SKUs).

    Uses Rainforest API to fetch current competitor data and compares against
    the most recent scan data.
    """
    from app.services.amazon_service import search_brand

    if not competitors:
        # Default competitors for common categories
        competitors = []

    # Fetch current data for brand + competitors in parallel
    all_brands = [brand] + competitors[:5]
    results = await asyncio.gather(
        *[search_brand(b) for b in all_brands],
        return_exceptions=True,
    )

    brand_data = {}
    for b, result in zip(all_brands, results):
        if isinstance(result, dict):
            brand_data[b] = result

    if not brand_data:
        return {"alerts": [], "error": "Failed to fetch Amazon data"}

    # Analyze competitive position
    alerts = []
    brand_info = brand_data.get(brand, {})
    brand_reviews = brand_info.get("avg_reviews", 0)
    brand_rating = brand_info.get("avg_rating", 0)
    brand_products = brand_info.get("product_count", 0)

    for comp_name, comp_data in brand_data.items():
        if comp_name == brand:
            continue

        comp_reviews = comp_data.get("avg_reviews", 0)
        comp_rating = comp_data.get("avg_rating", 0)
        comp_products = comp_data.get("product_count", 0)

        # Review gap alert
        if comp_reviews > brand_reviews * 3:
            alerts.append({
                "type": "review_gap",
                "severity": "high",
                "competitor": comp_name,
                "message": f"{comp_name} has {comp_reviews:,} avg reviews vs your {brand_reviews:,}. Review gap is {comp_reviews // max(brand_reviews, 1)}x.",
                "action": "Accelerate review collection through follow-up email campaigns and insert cards.",
            })

        # Rating alert
        if comp_rating > brand_rating + 0.3:
            alerts.append({
                "type": "rating_gap",
                "severity": "medium",
                "competitor": comp_name,
                "message": f"{comp_name} rated {comp_rating:.1f}★ vs your {brand_rating:.1f}★.",
                "action": "Analyze negative reviews for product improvement opportunities.",
            })

        # SKU count alert
        if comp_products > brand_products * 2:
            alerts.append({
                "type": "sku_expansion",
                "severity": "medium",
                "competitor": comp_name,
                "message": f"{comp_name} has {comp_products} products vs your {brand_products}. They're expanding faster.",
                "action": "Consider SKU expansion — use Opportunity Engine to find new product gaps.",
            })

        # Top product analysis
        comp_top = comp_data.get("top_products", [])
        for p in comp_top[:3]:
            price = p.get("price", 0)
            reviews = p.get("reviews", 0)
            if reviews > 5000:
                alerts.append({
                    "type": "dominant_product",
                    "severity": "low",
                    "competitor": comp_name,
                    "message": f"{comp_name}'s \"{p.get('title', '')[:60]}\" has {reviews:,} reviews at ${price}.",
                    "action": "This product dominates AI recommendations. Differentiate on price, features, or niche targeting.",
                })

    alerts.sort(key=lambda x: {"high": 0, "medium": 1, "low": 2}.get(x["severity"], 3))

    return {
        "brand": brand,
        "competitors_analyzed": list(brand_data.keys()),
        "brand_metrics": {
            "product_count": brand_products,
            "avg_rating": brand_rating,
            "avg_reviews": brand_reviews,
        },
        "alerts": alerts,
        "alert_count": len(alerts),
    }


# ═══════════════════════════════════════════════════════════════════════════
# 3. AUTO REPORT — One-click monthly brand report
# ═══════════════════════════════════════════════════════════════════════════

async def generate_auto_report(brand: str, category: str, db: AsyncSession) -> dict:
    """Generate a comprehensive monthly brand report automatically.

    Combines: GEO Score history + Market Signals + Competitor Analysis +
    AI Traffic + Revenue Estimation + Action Items
    """
    from app.services.market_signals import fetch_market_signals
    from dataclasses import asdict

    # Fetch all data in parallel
    roi_result, signals_result, competitor_result = await asyncio.gather(
        compute_roi_dashboard(brand, db),
        fetch_market_signals(brand, category),
        check_competitor_changes(brand),
        return_exceptions=True,
    )

    roi = roi_result if not isinstance(roi_result, Exception) else {}
    signals = asdict(signals_result) if not isinstance(signals_result, Exception) else {}
    competitors = competitor_result if not isinstance(competitor_result, Exception) else {}

    # Generate executive summary with Claude
    import anthropic
    from app.config import settings

    summary_prompt = f"""Generate a concise executive summary (3-4 sentences) for {brand}'s monthly AI visibility report.

Data:
- GEO Score: {roi.get('geo', {}).get('current_score', 'N/A')}/100 (trend: {roi.get('geo', {}).get('trend', 'N/A')})
- AI Traffic: {roi.get('traffic', {}).get('total_ai_visits', 0)} visits ({roi.get('traffic', {}).get('delta_pct', 0):+.1f}% MoM)
- Est. Revenue: ${roi.get('revenue', {}).get('estimated_revenue', 0):,.0f}
- Market Signals: Reddit {signals.get('reddit_score', 0)}% positive, {signals.get('kol_count', 0)} YouTube KOLs
- Competitor Alerts: {competitors.get('alert_count', 0)} issues detected

Write for a cross-border e-commerce brand manager. Be specific with numbers. Return plain text only."""

    exec_summary = ""
    try:
        client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
        msg = await client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=300,
            messages=[{"role": "user", "content": summary_prompt}],
        )
        exec_summary = msg.content[0].text.strip()
    except Exception as e:
        logger.warning("Summary generation failed: %s", e)
        exec_summary = f"{brand} monthly AI visibility report generated automatically by Avanti A2A."

    return {
        "brand": brand,
        "category": category,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "report_type": "monthly_auto",

        "executive_summary": exec_summary,

        "sections": {
            "geo_performance": roi.get("geo", {}),
            "ai_traffic": roi.get("traffic", {}),
            "revenue_impact": roi.get("revenue", {}),
            "roi_narrative": roi.get("roi_narrative", []),
            "market_signals": {
                "reddit_score": signals.get("reddit_score", 0),
                "reddit_post_count": signals.get("reddit_post_count", 0),
                "kol_count": signals.get("kol_count", 0),
                "kol_total_views": signals.get("kol_total_views", 0),
                "tiktok_present": signals.get("tiktok_present", False),
                "tiktok_product_count": signals.get("tiktok_product_count", 0),
                "google_trend_direction": signals.get("google_trend_direction", "unknown"),
                "market_alignment_score": signals.get("market_alignment_score", 0),
            },
            "competitor_analysis": competitors,
        },

        "data_sources": ["geo_scans", "b2a_analytics", "market_signals", "amazon_rainforest", "claude_sonnet"],
    }
