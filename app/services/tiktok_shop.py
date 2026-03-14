"""
TikTok Shop API — fetches product/shop data for brand monitoring.

Uses TikTok Shop Open API when TIKTOK_APP_KEY is set.
Falls back to empty data otherwise. Results cached 1 hour.
"""

import hashlib
import hmac
import logging
import os
import time
from datetime import datetime, timezone
from typing import Any

import httpx

logger = logging.getLogger(__name__)

# ── In-memory cache (1-hour TTL) ────────────────────────────────────────────
_cache: dict[str, tuple[float, Any]] = {}
_CACHE_TTL = 3600  # 1 hour

# ── Token cache (2-hour TTL) ────────────────────────────────────────────────
_token_cache: dict[str, Any] = {"access_token": "", "expires_at": 0.0}

# ── Env config ──────────────────────────────────────────────────────────────
_APP_KEY = os.getenv("TIKTOK_APP_KEY", "")
_APP_SECRET = os.getenv("TIKTOK_APP_SECRET", "")
_AVAILABLE = bool(_APP_KEY and _APP_SECRET)

_BASE_URL = "https://open-api.tiktokglobalshop.com"
_AUTH_URL = "https://auth.tiktok-shops.com/api/v2/token/get"

if _AVAILABLE:
    logger.info("TikTok Shop API enabled (app_key=%s...)", _APP_KEY[:6])
else:
    logger.info("TikTok Shop API disabled — no TIKTOK_APP_KEY set")

# ── Category → TikTok search queries mapping ────────────────────────────────
CATEGORY_TIKTOK_QUERIES: dict[str, list[str]] = {
    "beauty": ["skincare", "makeup tools", "beauty device"],
    "consumer electronics": ["wireless earbuds", "phone accessories", "tech gadgets"],
    "home fitness": ["resistance bands", "yoga mat", "home gym"],
    "kitchen appliances": ["air fryer", "blender", "kitchen gadget"],
    "smart home": ["smart plug", "LED lights", "smart speaker"],
    "outdoor gear": ["camping gear", "hiking accessories", "outdoor tools"],
    "baby products": ["baby pillow", "baby monitor", "baby safety"],
    "pet supplies": ["pet toy", "dog leash", "cat accessories"],
    "car accessories": ["car phone mount", "dash cam", "car organizer"],
    "fashion": ["women dress", "athleisure", "streetwear"],
    "portable power": ["power bank", "portable charger", "solar charger"],
}


# ── Cache helpers (same pattern as reddit_scraper / youtube_scraper) ─────────

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


# ── Auth ─────────────────────────────────────────────────────────────────────

def _sign_request(path: str, params: dict[str, str]) -> str:
    """Generate HMAC-SHA256 signature for TikTok Shop API requests."""
    # Sort params alphabetically, concatenate key+value pairs
    sorted_params = "".join(f"{k}{v}" for k, v in sorted(params.items()))
    base_string = f"{path}{sorted_params}"
    sig = hmac.new(
        _APP_SECRET.encode(), base_string.encode(), hashlib.sha256
    ).hexdigest()
    return sig


async def _get_access_token() -> str:
    """Get app-level access token, cached for 2 hours."""
    now = time.time()
    if _token_cache["access_token"] and now < _token_cache["expires_at"]:
        return _token_cache["access_token"]

    if not _AVAILABLE:
        return ""

    try:
        params = {
            "app_key": _APP_KEY,
            "app_secret": _APP_SECRET,
            "grant_type": "authorized_code",
        }
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(_AUTH_URL, params=params)
            if resp.status_code == 200:
                data = resp.json()
                token = data.get("data", {}).get("access_token", "")
                if token:
                    _token_cache["access_token"] = token
                    # Expire 10 min before actual expiry (default 2h)
                    expire_in = data.get("data", {}).get("access_token_expire_in", 7200)
                    _token_cache["expires_at"] = now + expire_in - 600
                    logger.info("TikTok access token acquired (expires in %ds)", expire_in)
                    return token
                else:
                    logger.warning("TikTok token response missing access_token: %s", data)
            else:
                logger.warning("TikTok token request failed: HTTP %s", resp.status_code)
    except Exception as e:
        logger.warning("TikTok token request error: %s", e)

    return ""


# ── API helpers ──────────────────────────────────────────────────────────────

async def _api_get(path: str, params: dict[str, str] | None = None) -> dict | None:
    """Make an authenticated GET request to TikTok Shop API."""
    token = await _get_access_token()
    if not token:
        return None

    query_params = params or {}
    query_params["app_key"] = _APP_KEY
    query_params["timestamp"] = str(int(time.time()))
    query_params["access_token"] = token
    query_params["sign"] = _sign_request(path, query_params)

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(f"{_BASE_URL}{path}", params=query_params)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("code") == 0:
                    return data.get("data", {})
                else:
                    logger.debug("TikTok API error on %s: %s", path, data.get("message"))
            elif resp.status_code == 429:
                logger.warning("TikTok API rate limited on %s", path)
            else:
                logger.debug("TikTok API %s: HTTP %s", path, resp.status_code)
    except Exception as e:
        logger.debug("TikTok API request error on %s: %s", path, e)

    return None


# ── Public functions ─────────────────────────────────────────────────────────

async def search_products(
    keyword: str, category: str | None = None, limit: int = 20
) -> list[dict]:
    """Search TikTok Shop products by keyword. Returns empty list if unavailable."""
    if not _AVAILABLE:
        return []

    ck = _cache_key("tts_search", keyword, category or "", str(limit))
    cached = _get_cached(ck)
    if cached is not None:
        return cached

    data = await _api_get("/api/products/search", {
        "keyword": keyword,
        "page_size": str(min(limit, 50)),
    })

    products = []
    if data and "products" in data:
        for p in data["products"][:limit]:
            products.append({
                "title": p.get("title", p.get("product_name", "")),
                "price": p.get("price", {}).get("sale_price", ""),
                "sales": p.get("sales", p.get("sold_count", 0)),
                "rating": p.get("rating", 0),
                "shop_name": p.get("shop_name", ""),
                "product_url": p.get("product_url", ""),
            })

    _set_cache(ck, products)
    logger.info("TikTok search '%s' -> %d products", keyword, len(products))
    return products


async def get_category_trending(category: str, limit: int = 10) -> list[dict]:
    """Get trending products for a category. Uses keyword queries from mapping."""
    if not _AVAILABLE:
        return []

    ck = _cache_key("tts_trending", category, str(limit))
    cached = _get_cached(ck)
    if cached is not None:
        return cached

    # Find matching queries
    cat_lower = category.lower()
    queries = CATEGORY_TIKTOK_QUERIES.get(cat_lower, [])
    if not queries:
        # Fuzzy match
        for key, terms in CATEGORY_TIKTOK_QUERIES.items():
            if key in cat_lower or cat_lower in key:
                queries = terms
                break
    if not queries:
        queries = [category]  # fallback: use category name directly

    # Search with first query (best match)
    products = await search_products(queries[0], category, limit)
    _set_cache(ck, products)
    return products


async def search_brand_on_tiktok(
    brand: str, category: str | None = None
) -> dict:
    """Check brand presence on TikTok Shop. Returns summary dict."""
    if not _AVAILABLE:
        return {
            "present": False, "product_count": 0, "avg_rating": 0.0,
            "top_products": [], "available": False,
        }

    ck = _cache_key("tts_brand", brand, category or "")
    cached = _get_cached(ck)
    if cached is not None:
        return cached

    query = f"{brand} {category}" if category else brand
    products = await search_products(query, category, 20)

    # Filter products that mention the brand name
    brand_lower = brand.lower()
    brand_products = [
        p for p in products
        if brand_lower in p.get("title", "").lower()
        or brand_lower in p.get("shop_name", "").lower()
    ]

    if brand_products:
        ratings = [p["rating"] for p in brand_products if p.get("rating")]
        avg_rating = sum(ratings) / len(ratings) if ratings else 0.0
        result = {
            "present": True,
            "product_count": len(brand_products),
            "avg_rating": round(avg_rating, 1),
            "top_products": brand_products[:5],
            "available": True,
        }
    else:
        result = {
            "present": False,
            "product_count": 0,
            "avg_rating": 0.0,
            "top_products": products[:3],  # show category products even if brand not found
            "available": True,
        }

    _set_cache(ck, result)
    logger.info(
        "TikTok brand '%s' -> present=%s, %d products",
        brand, result["present"], result["product_count"],
    )
    return result
