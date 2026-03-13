"""
Reddit scraper — fetches live Reddit data for brand monitoring.

Uses Reddit's public JSON API (no auth needed for read-only search).
Rate limited to ~10 req/min. Results cached 1 hour.
"""

import asyncio
import hashlib
import logging
from datetime import datetime, timezone
from typing import Any

import httpx

logger = logging.getLogger(__name__)

# ── In-memory cache (1-hour TTL) ────────────────────────────────────────────
_cache: dict[str, tuple[float, Any]] = {}
_CACHE_TTL = 3600  # 1 hour

_USER_AGENT = "AventiGEO/1.0 (AI Visibility Monitor; contact: hello@avantia2a.com)"

# ── Category → subreddit mapping ────────────────────────────────────────────
CATEGORY_SUBREDDITS: dict[str, list[str]] = {
    "consumer electronics": ["BuyItForLife", "gadgets", "technology", "techdeals"],
    "car jump starters": ["MechanicAdvice", "Cartalk", "cars", "AutoMechanic"],
    "dash cameras": ["Dashcam", "dashcams", "cars"],
    "car phone mounts": ["CarAV", "iphone", "Android"],
    "portable power": ["preppers", "camping", "overlanding", "vandwellers"],
    "beauty": ["SkincareAddiction", "MakeupAddiction", "beauty", "AsianBeauty"],
    "pet supplies": ["dogs", "cats", "pets", "DogFood"],
    "home fitness": ["homegym", "fitness", "bodyweightfitness"],
    "smart home": ["smarthome", "homeautomation", "googlehome", "amazonecho"],
    "outdoor gear": ["CampingGear", "ultralight", "hiking", "backpacking"],
    "baby products": ["BabyBumps", "beyondthebump", "NewParents"],
    "kitchen appliances": ["Cooking", "BuyItForLife", "KitchenConfidential"],
}


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


# ── Reddit JSON API ─────────────────────────────────────────────────────────

async def search_reddit(
    query: str,
    subreddit: str | None = None,
    sort: str = "relevance",
    time_filter: str = "year",
    limit: int = 10,
) -> list[dict]:
    """
    Search Reddit via public JSON API.
    Returns list of post dicts with: title, url, subreddit, score, num_comments,
    selftext_snippet, created_utc, permalink.
    """
    key = _cache_key("search", query, subreddit or "", sort, time_filter, str(limit))
    cached = _get_cached(key)
    if cached is not None:
        return cached

    if subreddit:
        url = f"https://www.reddit.com/r/{subreddit}/search.json"
        params = {"q": query, "sort": sort, "t": time_filter, "limit": limit, "restrict_sr": "on"}
    else:
        url = "https://www.reddit.com/search.json"
        params = {"q": query, "sort": sort, "t": time_filter, "limit": limit}

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(url, params=params, headers={"User-Agent": _USER_AGENT})
            resp.raise_for_status()
            data = resp.json()

        posts = []
        for child in data.get("data", {}).get("children", []):
            p = child.get("data", {})
            selftext = p.get("selftext", "")
            posts.append({
                "title": p.get("title", ""),
                "url": f"https://reddit.com{p.get('permalink', '')}",
                "subreddit": p.get("subreddit", ""),
                "score": p.get("score", 0),
                "num_comments": p.get("num_comments", 0),
                "selftext_snippet": selftext[:300] if selftext else "",
                "created_utc": p.get("created_utc", 0),
                "permalink": p.get("permalink", ""),
            })

        _set_cache(key, posts)
        return posts

    except Exception as exc:
        logger.warning("Reddit search failed for q=%s: %s", query, exc)
        return []


async def search_brand_across_subreddits(
    brand: str,
    category: str | None = None,
    limit_per_sub: int = 5,
) -> list[dict]:
    """
    Search for a brand across relevant subreddits for its category.
    Returns combined, deduplicated, score-sorted results.
    """
    key = _cache_key("brand", brand, category or "")
    cached = _get_cached(key)
    if cached is not None:
        return cached

    subreddits: list[str] = []
    if category:
        cat_lower = category.lower()
        for cat_key, subs in CATEGORY_SUBREDDITS.items():
            if cat_key in cat_lower or cat_lower in cat_key:
                subreddits = subs
                break

    # Always include a general search
    tasks = [search_reddit(brand, sort="relevance", time_filter="year", limit=limit_per_sub)]
    for sub in subreddits[:4]:  # max 4 subreddits to stay under rate limits
        tasks.append(search_reddit(brand, subreddit=sub, limit=limit_per_sub))

    results_lists = await asyncio.gather(*tasks)

    # Deduplicate by permalink
    seen = set()
    combined = []
    for results in results_lists:
        for post in results:
            if post["permalink"] not in seen:
                seen.add(post["permalink"])
                combined.append(post)

    # Sort by score desc
    combined.sort(key=lambda p: p["score"], reverse=True)
    result = combined[:15]  # cap at 15

    _set_cache(key, result)
    return result


def get_category_subreddits(category: str) -> list[str]:
    """Return relevant subreddits for a category."""
    cat_lower = category.lower()
    for cat_key, subs in CATEGORY_SUBREDDITS.items():
        if cat_key in cat_lower or cat_lower in cat_key:
            return subs
    return []


def basic_sentiment(text: str) -> str:
    """
    Very basic sentiment analysis based on keyword matching.
    Returns: "positive" | "negative" | "mixed"
    """
    text_lower = text.lower()
    pos_words = {"love", "great", "best", "amazing", "excellent", "perfect", "recommend",
                 "reliable", "solid", "fantastic", "worth", "impressed", "quality"}
    neg_words = {"worst", "terrible", "awful", "avoid", "broken", "junk", "scam", "waste",
                 "cheap", "disappointing", "fail", "garbage", "regret", "refund", "defective"}

    pos_count = sum(1 for w in pos_words if w in text_lower)
    neg_count = sum(1 for w in neg_words if w in text_lower)

    if pos_count > neg_count:
        return "positive"
    if neg_count > pos_count:
        return "negative"
    return "mixed"
