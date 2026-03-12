"""Google Trends proxy with server-side caching."""
import asyncio
import logging
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/trends", tags=["trends"])
logger = logging.getLogger(__name__)

# ── Category → keyword mapping ───────────────────────────────────────────────
CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "car electronics": ["car jump starter", "dash cam", "car phone mount", "car charger"],
    "portable power stations": ["portable power station", "solar generator", "battery backup"],
    "consumer electronics": ["usb c charger", "wireless earbuds", "bluetooth speaker"],
    "baby products": ["baby pillow", "baby monitor", "baby carrier", "baby stroller"],
    "home & kitchen": ["air purifier", "robot vacuum", "smart plug", "water filter"],
    "beauty & personal care": ["electric toothbrush", "hair dryer", "facial cleanser"],
    "sports & outdoors": ["hiking backpack", "camping tent", "fitness tracker"],
    "pet supplies": ["automatic pet feeder", "dog camera", "cat litter"],
}

# ── In-memory cache ──────────────────────────────────────────────────────────
_cache: dict[str, dict] = {}
_CACHE_TTL_SECONDS = 6 * 3600  # 6 hours


def _get_cached(category: str) -> dict | None:
    key = category.lower()
    entry = _cache.get(key)
    if not entry:
        return None
    age = (datetime.now(timezone.utc) - entry["fetched_at"]).total_seconds()
    return entry["data"] if age < _CACHE_TTL_SECONDS else None


def _set_cache(category: str, data: dict) -> None:
    _cache[category.lower()] = {"data": data, "fetched_at": datetime.now(timezone.utc)}


def _find_keywords(category: str) -> list[str]:
    """Find matching keywords for a category (case-insensitive partial match)."""
    cat_lower = category.lower()
    # Exact match first
    if cat_lower in CATEGORY_KEYWORDS:
        return CATEGORY_KEYWORDS[cat_lower]
    # Partial match
    for key, kws in CATEGORY_KEYWORDS.items():
        if key in cat_lower or cat_lower in key:
            return kws
    # Fallback: use category name itself as keyword
    return [category]


def _fetch_pytrends(keywords: list[str]) -> dict:
    """Synchronous pytrends fetch (run in thread executor)."""
    try:
        from pytrends.request import TrendReq

        pytrends = TrendReq(hl="en-US", tz=360)
        # pytrends accepts max 5 keywords at once
        kws = keywords[:5]
        pytrends.build_payload(kws, timeframe="today 3-m")

        # Interest over time
        interest = pytrends.interest_over_time()
        kw_scores: dict[str, int] = {}
        delta_4w: dict[str, float] = {}

        if not interest.empty:
            for kw in kws:
                if kw in interest.columns:
                    vals = interest[kw].tolist()
                    kw_scores[kw] = int(vals[-1]) if vals else 0
                    if len(vals) >= 4:
                        old = sum(vals[-8:-4]) / 4 if len(vals) >= 8 else vals[0]
                        new = sum(vals[-4:]) / 4
                        delta_4w[kw] = round((new - old) / max(old, 1) * 100, 1)
                    else:
                        delta_4w[kw] = 0.0

        # Related rising queries
        related = pytrends.related_queries()
        rising_queries: list[str] = []
        for kw in kws:
            if kw in related and related[kw].get("rising") is not None:
                df = related[kw]["rising"]
                if not df.empty:
                    rising_queries.extend(df["query"].head(5).tolist())

        return {
            "keywords": kw_scores,
            "delta_4w_pct": delta_4w,
            "rising_queries": rising_queries[:15],
        }
    except Exception as e:
        logger.warning("pytrends fetch failed: %s", e)
        return {"keywords": {}, "delta_4w_pct": {}, "rising_queries": []}


@router.get("/google/{category}")
async def get_google_trends(category: str):
    """Fetch Google Trends data for a category's keywords. Cached 6 hours."""
    cached = _get_cached(category)
    if cached:
        return cached

    keywords = _find_keywords(category)
    try:
        data = await asyncio.to_thread(_fetch_pytrends, keywords)
    except Exception:
        data = {"keywords": {}, "delta_4w_pct": {}, "rising_queries": []}

    _set_cache(category, data)
    return data
