"""
YouTube KOL scraper — fetches creator/video data for brand monitoring.

Uses YouTube Data API v3 when YOUTUBE_API_KEY is set (free: 10K units/day).
Falls back to demo data otherwise. Results cached 1 hour.
"""

import asyncio
import hashlib
import logging
import os
from datetime import datetime, timezone
from typing import Any

import httpx

logger = logging.getLogger(__name__)

# ── In-memory cache (1-hour TTL) ────────────────────────────────────────────
_cache: dict[str, tuple[float, Any]] = {}
_CACHE_TTL = 3600  # 1 hour

_YT_API_KEY = os.getenv("YOUTUBE_API_KEY", "")
_YT_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
_YT_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos"
_YT_CHANNELS_URL = "https://www.googleapis.com/youtube/v3/channels"

# ── Category → search terms mapping ────────────────────────────────────────
CATEGORY_SEARCH_TERMS: dict[str, list[str]] = {
    "consumer electronics": ["best tech review", "gadget comparison", "tech accessories review"],
    "car jump starters": ["best jump starter review", "car jump starter test", "portable jump starter comparison"],
    "dash cameras": ["best dash cam review", "dashcam comparison", "dash camera test"],
    "car phone mounts": ["best car phone mount", "phone holder review", "car mount comparison"],
    "portable power": ["best power station review", "portable power station test", "solar generator comparison"],
    "portable chargers": ["best portable charger review", "power bank comparison", "USB charger test"],
    "beauty": ["skincare review", "beauty product comparison", "makeup tutorial review"],
    "pet supplies": ["pet product review", "best dog food review", "pet gear comparison"],
    "home fitness": ["home gym equipment review", "fitness equipment comparison", "workout gear test"],
    "smart home": ["smart home review", "home automation comparison", "smart device test"],
    "outdoor gear": ["camping gear review", "outdoor equipment test", "hiking gear comparison"],
    "baby products": ["baby product review", "best baby gear", "baby safety product comparison"],
    "kitchen appliances": ["kitchen appliance review", "best kitchen gadget", "cooking equipment test"],
}

# Tier classification by subscriber count
def _classify_tier(subscribers: int) -> str:
    if subscribers >= 1_000_000:
        return "mega"
    if subscribers >= 100_000:
        return "macro"
    return "micro"


def _cache_key(prefix: str, *args: str) -> str:
    raw = f"{prefix}:" + ":".join(args)
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


def basic_sentiment(text: str) -> str:
    """Basic sentiment analysis based on keyword matching."""
    text_lower = text.lower()
    pos_words = {"love", "great", "best", "amazing", "excellent", "perfect", "recommend",
                 "reliable", "solid", "fantastic", "worth", "impressed", "quality",
                 "winner", "favorite", "top", "awesome"}
    neg_words = {"worst", "terrible", "awful", "avoid", "broken", "junk", "scam", "waste",
                 "cheap", "disappointing", "fail", "garbage", "regret", "refund", "defective",
                 "overrated", "overpriced", "problem", "issue", "don't buy"}

    pos_count = sum(1 for w in pos_words if w in text_lower)
    neg_count = sum(1 for w in neg_words if w in text_lower)

    if pos_count > neg_count:
        return "positive"
    if neg_count > pos_count:
        return "negative"
    return "mixed"


# ── YouTube Data API v3 ─────────────────────────────────────────────────────

async def _yt_search(query: str, max_results: int = 10) -> list[dict]:
    """Search YouTube via Data API v3. Returns raw items."""
    if not _YT_API_KEY:
        return []

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(_YT_SEARCH_URL, params={
                "part": "snippet",
                "q": query,
                "type": "video",
                "maxResults": max_results,
                "order": "relevance",
                "key": _YT_API_KEY,
            })
            resp.raise_for_status()
            data = resp.json()
            return data.get("items", [])
    except Exception as exc:
        logger.warning("YouTube search failed for q=%s: %s", query, exc)
        return []


async def _yt_video_stats(video_ids: list[str]) -> dict[str, dict]:
    """Fetch view counts and other stats for videos."""
    if not _YT_API_KEY or not video_ids:
        return {}

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(_YT_VIDEOS_URL, params={
                "part": "statistics",
                "id": ",".join(video_ids[:50]),
                "key": _YT_API_KEY,
            })
            resp.raise_for_status()
            data = resp.json()
            return {
                item["id"]: item.get("statistics", {})
                for item in data.get("items", [])
            }
    except Exception as exc:
        logger.warning("YouTube video stats failed: %s", exc)
        return {}


async def _yt_channel_stats(channel_ids: list[str]) -> dict[str, dict]:
    """Fetch subscriber counts for channels."""
    if not _YT_API_KEY or not channel_ids:
        return {}

    try:
        unique_ids = list(set(channel_ids))
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(_YT_CHANNELS_URL, params={
                "part": "statistics,snippet",
                "id": ",".join(unique_ids[:50]),
                "key": _YT_API_KEY,
            })
            resp.raise_for_status()
            data = resp.json()
            return {
                item["id"]: {
                    "title": item.get("snippet", {}).get("title", ""),
                    "subscribers": int(item.get("statistics", {}).get("subscriberCount", 0)),
                }
                for item in data.get("items", [])
            }
    except Exception as exc:
        logger.warning("YouTube channel stats failed: %s", exc)
        return {}


async def search_kols(
    brand: str,
    category: str | None = None,
    limit: int = 10,
) -> list[dict]:
    """
    Search YouTube for KOLs discussing a brand.
    Returns list of creator dicts with: channel_name, channel_id, video_title,
    video_url, views, subscribers, tier, sentiment, published_at.
    """
    key = _cache_key("kol_search", brand, category or "", str(limit))
    cached = _get_cached(key)
    if cached is not None:
        return cached

    if not _YT_API_KEY:
        logger.info("No YOUTUBE_API_KEY set — returning empty results for KOL search")
        return []

    # Build search queries
    queries = [f"{brand} review"]
    if category:
        queries.append(f"best {category} {brand}")

    # Run searches in parallel
    tasks = [_yt_search(q, max_results=limit) for q in queries]
    results_lists = await asyncio.gather(*tasks)

    # Flatten and deduplicate by video ID
    seen_videos = set()
    all_items = []
    for items in results_lists:
        for item in items:
            vid = item.get("id", {}).get("videoId", "")
            if vid and vid not in seen_videos:
                seen_videos.add(vid)
                all_items.append(item)

    if not all_items:
        _set_cache(key, [])
        return []

    # Fetch video stats and channel stats in parallel
    video_ids = [item["id"]["videoId"] for item in all_items]
    channel_ids = [item["snippet"]["channelId"] for item in all_items]

    video_stats, channel_stats = await asyncio.gather(
        _yt_video_stats(video_ids),
        _yt_channel_stats(channel_ids),
    )

    # Build enriched results
    kols = []
    for item in all_items:
        snippet = item.get("snippet", {})
        vid = item["id"]["videoId"]
        ch_id = snippet.get("channelId", "")
        ch_info = channel_stats.get(ch_id, {})
        v_stats = video_stats.get(vid, {})

        subscribers = ch_info.get("subscribers", 0)
        views = int(v_stats.get("viewCount", 0))
        title = snippet.get("title", "")
        description = snippet.get("description", "")

        kols.append({
            "channel_name": ch_info.get("title", snippet.get("channelTitle", "")),
            "channel_id": ch_id,
            "video_id": vid,
            "video_title": title,
            "video_url": f"https://www.youtube.com/watch?v={vid}",
            "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url", ""),
            "views": views,
            "subscribers": subscribers,
            "tier": _classify_tier(subscribers),
            "sentiment": basic_sentiment(f"{title} {description}"),
            "published_at": snippet.get("publishedAt", ""),
            "description_snippet": description[:200] if description else "",
        })

    # Sort by views descending
    kols.sort(key=lambda k: k["views"], reverse=True)
    result = kols[:limit]

    _set_cache(key, result)
    return result


async def search_category_kols(
    category: str,
    limit: int = 15,
) -> list[dict]:
    """
    Discover top KOLs for a product category (not brand-specific).
    Searches category-related terms and returns top creators by view count.
    """
    key = _cache_key("cat_kol", category, str(limit))
    cached = _get_cached(key)
    if cached is not None:
        return cached

    if not _YT_API_KEY:
        return []

    cat_lower = category.lower()
    search_terms = []
    for cat_key, terms in CATEGORY_SEARCH_TERMS.items():
        if cat_key in cat_lower or cat_lower in cat_key:
            search_terms = terms
            break

    if not search_terms:
        search_terms = [f"best {category} review", f"{category} comparison"]

    # Run searches in parallel (max 3 to save quota)
    tasks = [_yt_search(term, max_results=5) for term in search_terms[:3]]
    results_lists = await asyncio.gather(*tasks)

    # Flatten and deduplicate by channel (keep best video per channel)
    channel_best: dict[str, dict] = {}
    for items in results_lists:
        for item in items:
            vid = item.get("id", {}).get("videoId", "")
            ch_id = item.get("snippet", {}).get("channelId", "")
            if vid and ch_id and ch_id not in channel_best:
                channel_best[ch_id] = item

    all_items = list(channel_best.values())

    if not all_items:
        _set_cache(key, [])
        return []

    # Fetch stats
    video_ids = [item["id"]["videoId"] for item in all_items]
    channel_ids = [item["snippet"]["channelId"] for item in all_items]
    video_stats, channel_stats = await asyncio.gather(
        _yt_video_stats(video_ids),
        _yt_channel_stats(channel_ids),
    )

    kols = []
    for item in all_items:
        snippet = item.get("snippet", {})
        vid = item["id"]["videoId"]
        ch_id = snippet.get("channelId", "")
        ch_info = channel_stats.get(ch_id, {})
        v_stats = video_stats.get(vid, {})

        subscribers = ch_info.get("subscribers", 0)
        views = int(v_stats.get("viewCount", 0))

        kols.append({
            "channel_name": ch_info.get("title", snippet.get("channelTitle", "")),
            "channel_id": ch_id,
            "video_id": vid,
            "video_title": snippet.get("title", ""),
            "video_url": f"https://www.youtube.com/watch?v={vid}",
            "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url", ""),
            "views": views,
            "subscribers": subscribers,
            "tier": _classify_tier(subscribers),
            "published_at": snippet.get("publishedAt", ""),
        })

    kols.sort(key=lambda k: k["subscribers"], reverse=True)
    result = kols[:limit]

    _set_cache(key, result)
    return result


def get_category_search_terms(category: str) -> list[str]:
    """Return relevant YouTube search terms for a category."""
    cat_lower = category.lower()
    for cat_key, terms in CATEGORY_SEARCH_TERMS.items():
        if cat_key in cat_lower or cat_lower in cat_key:
            return terms
    return [f"best {category} review"]
