"""
Cross-platform Market Signal Engine — aggregates ALL signal sources in parallel.

Fetches Reddit, YouTube KOL, TikTok Shop, and Google Trends data for a brand+category,
computes a unified Market-AI Alignment Score, and returns structured signals.
Results cached 1 hour.
"""

import asyncio
import hashlib
import logging
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any

logger = logging.getLogger(__name__)

# ── In-memory cache (1-hour TTL) ────────────────────────────────────────────
_cache: dict[str, tuple[float, Any]] = {}
_CACHE_TTL = 3600


def _cache_key(brand: str, category: str) -> str:
    raw = f"ms:{brand.lower()}:{category.lower()}"
    return hashlib.md5(raw.encode()).hexdigest()


def _get_cached(key: str) -> Any | None:
    if key in _cache:
        ts, data = _cache[key]
        if datetime.now(timezone.utc).timestamp() - ts < _CACHE_TTL:
            return data
        del _cache[key]
    return None


def _set_cache(key: str, data: Any) -> None:
    _cache[key] = (datetime.now(timezone.utc).timestamp(), data)


# ── Data structure ──────────────────────────────────────────────────────────

@dataclass
class MarketSignals:
    """Unified market signals for a brand + category combination."""
    brand: str
    category: str

    # Reddit
    reddit_score: int = 0           # 0-100 positive sentiment %
    reddit_post_count: int = 0
    reddit_sentiment: str = "unknown"  # positive/negative/mixed/unknown
    reddit_top_posts: list = field(default_factory=list)

    # YouTube KOL
    kol_count: int = 0
    kol_total_views: int = 0
    kol_positive_pct: int = 0
    kol_top_creators: list = field(default_factory=list)
    kol_tier_breakdown: dict = field(default_factory=dict)

    # TikTok Shop
    tiktok_present: bool = False
    tiktok_product_count: int = 0
    tiktok_avg_rating: float = 0.0
    tiktok_trending: bool = False
    tiktok_top_products: list = field(default_factory=list)

    # Google Trends
    google_delta: float | None = None
    google_trend_direction: str = "unknown"

    # Composite
    market_alignment_score: int = 0
    alignment_label: str = "unknown"  # strong/moderate/weak/divergent

    def to_dict(self) -> dict:
        return asdict(self)


# ── Individual source fetchers ──────────────────────────────────────────────

async def _fetch_reddit(brand: str, category: str) -> dict:
    """Fetch Reddit signals for a brand."""
    try:
        from app.services.reddit_scraper import (
            basic_sentiment,
            search_brand_across_subreddits,
        )

        posts = await search_brand_across_subreddits(brand, category=category, limit_per_sub=5)
        sentiments = [basic_sentiment(f"{p['title']} {p.get('selftext_snippet', '')}") for p in posts]
        pos = sentiments.count("positive")
        neg = sentiments.count("negative")
        total = len(sentiments) or 1
        score = round((pos / total) * 100)

        dominant = "mixed"
        if score >= 60:
            dominant = "positive"
        elif score <= 30:
            dominant = "negative"

        return {
            "reddit_score": score,
            "reddit_post_count": len(posts),
            "reddit_sentiment": dominant,
            "reddit_top_posts": [
                {"title": p["title"], "url": p.get("url", ""), "score": p.get("score", 0)}
                for p in posts[:3]
            ],
        }
    except Exception as e:
        logger.debug("Reddit signal fetch failed: %s", e)
        return {}


async def _fetch_kol(brand: str, category: str) -> dict:
    """Fetch YouTube KOL signals for a brand."""
    try:
        from app.services.youtube_scraper import search_kols

        kols = await search_kols(f"{brand} {category} review", limit=10)

        tier_counts = {"mega": 0, "macro": 0, "micro": 0}
        total_views = 0
        positive = 0
        for k in kols:
            tier = k.get("tier", "micro")
            tier_counts[tier] = tier_counts.get(tier, 0) + 1
            total_views += k.get("views", 0)
            if k.get("sentiment") == "positive":
                positive += 1

        return {
            "kol_count": len(kols),
            "kol_total_views": total_views,
            "kol_positive_pct": round((positive / max(len(kols), 1)) * 100),
            "kol_top_creators": [
                {
                    "channel_name": k.get("channel_name", ""),
                    "video_title": k.get("title", ""),
                    "views": k.get("views", 0),
                    "tier": k.get("tier", "micro"),
                }
                for k in kols[:3]
            ],
            "kol_tier_breakdown": tier_counts,
        }
    except Exception as e:
        logger.debug("KOL signal fetch failed: %s", e)
        return {}


async def _fetch_tiktok(brand: str, category: str) -> dict:
    """Fetch TikTok Shop signals for a brand."""
    try:
        from app.services.tiktok_shop import search_brand_on_tiktok

        result = await search_brand_on_tiktok(brand, category)
        return {
            "tiktok_present": result.get("present", False),
            "tiktok_product_count": result.get("product_count", 0),
            "tiktok_avg_rating": result.get("avg_rating", 0.0),
            "tiktok_trending": result.get("product_count", 0) >= 5,
            "tiktok_top_products": [
                {"title": p.get("title", ""), "price": p.get("price", ""), "sales": p.get("sales", 0)}
                for p in result.get("top_products", [])[:3]
            ],
        }
    except Exception as e:
        logger.debug("TikTok signal fetch failed: %s", e)
        return {}


async def _fetch_google(category: str) -> dict:
    """Fetch Google Trends signals for a category."""
    try:
        from app.services.selection_intelligence import _get_google_delta

        delta = await _get_google_delta(category)
        direction = "stable"
        if delta is not None:
            if delta > 10:
                direction = "up"
            elif delta > 0:
                direction = "slightly_up"
            elif delta < -10:
                direction = "down"
            elif delta < 0:
                direction = "slightly_down"

        return {
            "google_delta": delta,
            "google_trend_direction": direction,
        }
    except Exception as e:
        logger.debug("Google Trends signal fetch failed: %s", e)
        return {}


# ── Alignment score computation ─────────────────────────────────────────────

def _compute_alignment(signals: MarketSignals) -> tuple[int, str]:
    """
    Compute Market-AI Alignment Score (0-100).

    Scoring:
    - Reddit positive sentiment (0-25): reddit_score * 0.25
    - KOL coverage (0-25): min(kol_count / 5, 1.0) * 25
    - TikTok presence (0-15): present=10, trending=+5
    - Google Trends (0-15): up=15, slightly_up=12, stable=10, slightly_down=7, down=5
    - Signal consistency (0-20): bonus for multi-source agreement
    """
    score = 0

    # Reddit (0-25)
    score += round(signals.reddit_score * 0.25)

    # KOL (0-25)
    kol_factor = min(signals.kol_count / 5.0, 1.0)
    score += round(kol_factor * 25)

    # TikTok (0-15)
    if signals.tiktok_present:
        score += 10
        if signals.tiktok_trending:
            score += 5

    # Google (0-15)
    google_map = {"up": 15, "slightly_up": 12, "stable": 10, "slightly_down": 7, "down": 5, "unknown": 8}
    score += google_map.get(signals.google_trend_direction, 8)

    # Consistency bonus (0-20)
    positive_signals = 0
    total_signals = 0
    if signals.reddit_post_count > 0:
        total_signals += 1
        if signals.reddit_score >= 50:
            positive_signals += 1
    if signals.kol_count > 0:
        total_signals += 1
        if signals.kol_positive_pct >= 50:
            positive_signals += 1
    if signals.tiktok_present:
        total_signals += 1
        positive_signals += 1
    if signals.google_delta is not None:
        total_signals += 1
        if signals.google_delta >= 0:
            positive_signals += 1

    if total_signals >= 2:
        consistency = positive_signals / total_signals
        score += round(consistency * 20)

    score = min(100, max(0, score))

    # Label
    if score >= 75:
        label = "strong"
    elif score >= 50:
        label = "moderate"
    elif score >= 30:
        label = "weak"
    else:
        label = "divergent"

    return score, label


# ── Main entry point ────────────────────────────────────────────────────────

async def fetch_market_signals(brand: str, category: str) -> MarketSignals:
    """
    Fetch cross-platform market signals in parallel.
    Each source is independent — one failure never blocks others.
    """
    ck = _cache_key(brand, category)
    cached = _get_cached(ck)
    if cached is not None:
        return cached

    # Parallel fetch all sources
    reddit_result, kol_result, tiktok_result, google_result = await asyncio.gather(
        _fetch_reddit(brand, category),
        _fetch_kol(brand, category),
        _fetch_tiktok(brand, category),
        _fetch_google(category),
        return_exceptions=True,
    )

    # Merge results (handle exceptions gracefully)
    signals = MarketSignals(brand=brand, category=category)

    if isinstance(reddit_result, dict):
        signals.reddit_score = reddit_result.get("reddit_score", 0)
        signals.reddit_post_count = reddit_result.get("reddit_post_count", 0)
        signals.reddit_sentiment = reddit_result.get("reddit_sentiment", "unknown")
        signals.reddit_top_posts = reddit_result.get("reddit_top_posts", [])

    if isinstance(kol_result, dict):
        signals.kol_count = kol_result.get("kol_count", 0)
        signals.kol_total_views = kol_result.get("kol_total_views", 0)
        signals.kol_positive_pct = kol_result.get("kol_positive_pct", 0)
        signals.kol_top_creators = kol_result.get("kol_top_creators", [])
        signals.kol_tier_breakdown = kol_result.get("kol_tier_breakdown", {})

    if isinstance(tiktok_result, dict):
        signals.tiktok_present = tiktok_result.get("tiktok_present", False)
        signals.tiktok_product_count = tiktok_result.get("tiktok_product_count", 0)
        signals.tiktok_avg_rating = tiktok_result.get("tiktok_avg_rating", 0.0)
        signals.tiktok_trending = tiktok_result.get("tiktok_trending", False)
        signals.tiktok_top_products = tiktok_result.get("tiktok_top_products", [])

    if isinstance(google_result, dict):
        signals.google_delta = google_result.get("google_delta")
        signals.google_trend_direction = google_result.get("google_trend_direction", "unknown")

    # Compute composite score
    signals.market_alignment_score, signals.alignment_label = _compute_alignment(signals)

    _set_cache(ck, signals)
    logger.info(
        "Market signals for %s/%s: alignment=%d (%s), reddit=%d, kol=%d, tiktok=%s, google=%s",
        brand, category, signals.market_alignment_score, signals.alignment_label,
        signals.reddit_score, signals.kol_count, signals.tiktok_present,
        signals.google_trend_direction,
    )
    return signals
