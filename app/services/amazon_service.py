"""
Amazon product intelligence via Rainforest API.

Provides brand search, product details, keyword search rankings,
and bestseller data for GEO report correlation analysis.

Results cached 6 hours to conserve free-tier quota (200 req/mo).
"""

import hashlib
import logging
import os
from datetime import datetime, timezone
from typing import Any

import httpx

logger = logging.getLogger(__name__)

_API_KEY = os.getenv("RAINFOREST_API_KEY", "")
_BASE_URL = "https://api.rainforestapi.com/request"
_AVAILABLE = bool(_API_KEY)

_cache: dict[str, tuple[float, Any]] = {}
_CACHE_TTL = 21600  # 6 hours — conserve free quota

if _AVAILABLE:
    logger.info("Rainforest API enabled (Amazon product intelligence)")
else:
    logger.info("Rainforest API not configured — RAINFOREST_API_KEY not set")


# ── Cache helpers ─────────────────────────────────────────────────────────────

def _cache_key(*args: str) -> str:
    return hashlib.md5(":".join(args).encode()).hexdigest()


def _get_cached(key: str) -> Any | None:
    if key in _cache:
        ts, data = _cache[key]
        if datetime.now(timezone.utc).timestamp() - ts < _CACHE_TTL:
            return data
        del _cache[key]
    return None


def _set_cache(key: str, data: Any) -> None:
    _cache[key] = (datetime.now(timezone.utc).timestamp(), data)


# ── Core request ──────────────────────────────────────────────────────────────

async def _request(params: dict[str, str]) -> dict | None:
    if not _AVAILABLE:
        return None
    params["api_key"] = _API_KEY
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.get(_BASE_URL, params=params)
            if resp.status_code == 200:
                return resp.json()
            logger.warning("Rainforest API HTTP %s: %s", resp.status_code, resp.text[:200])
    except Exception as e:
        logger.warning("Rainforest API error: %s", e)
    return None


# ── Public functions ──────────────────────────────────────────────────────────

async def search_brand(brand: str, domain: str = "amazon.com") -> dict:
    """
    Search Amazon for a brand and return presence summary.
    Returns: product_count, top_products (title/asin/bsr/rating/reviews/price), avg_rating
    """
    ck = _cache_key("amz_brand", brand, domain)
    cached = _get_cached(ck)
    if cached is not None:
        return cached

    data = await _request({
        "type": "search",
        "search_term": brand,
        "amazon_domain": domain,
        "sort_by": "featured",
    })

    result: dict = {
        "available": _AVAILABLE,
        "brand": brand,
        "product_count": 0,
        "top_products": [],
        "avg_rating": 0.0,
        "avg_reviews": 0,
    }

    if not data:
        return result

    products = data.get("search_results", [])
    brand_lower = brand.lower()
    matched = [
        p for p in products
        if brand_lower in (p.get("title", "") or "").lower()
        or brand_lower in (p.get("brand", "") or "").lower()
    ][:5]

    top = []
    for p in matched:
        top.append({
            "asin": p.get("asin", ""),
            "title": p.get("title", ""),
            "rating": p.get("rating", 0),
            "reviews": p.get("ratings_total", 0),
            "price": p.get("price", {}).get("value", 0) if isinstance(p.get("price"), dict) else 0,
            "bsr": p.get("bestseller_rank", None),
            "url": f"https://www.{domain}/dp/{p.get('asin', '')}",
        })

    ratings = [p["rating"] for p in top if p.get("rating")]
    result["product_count"] = len(matched)
    result["top_products"] = top
    result["avg_rating"] = round(sum(ratings) / len(ratings), 1) if ratings else 0.0
    result["avg_reviews"] = int(sum(p["reviews"] for p in top) / len(top)) if top else 0

    _set_cache(ck, result)
    logger.info("Amazon brand '%s' → %d products, avg %.1f★", brand, len(matched), result["avg_rating"])
    return result


async def get_product(asin: str, domain: str = "amazon.com") -> dict | None:
    """
    Fetch full product details by ASIN.
    Returns title, BSR, rating, review_count, price, category.
    """
    ck = _cache_key("amz_product", asin, domain)
    cached = _get_cached(ck)
    if cached is not None:
        return cached

    data = await _request({
        "type": "product",
        "asin": asin,
        "amazon_domain": domain,
    })

    if not data or "product" not in data:
        return None

    p = data["product"]
    bsr_list = p.get("bestsellers_rank", [])
    top_bsr = bsr_list[0] if bsr_list else {}

    result = {
        "asin": asin,
        "title": p.get("title", ""),
        "rating": p.get("rating", 0),
        "reviews": p.get("ratings_total", 0),
        "price": p.get("buybox_winner", {}).get("price", {}).get("value", 0),
        "bsr_rank": top_bsr.get("rank", None),
        "bsr_category": top_bsr.get("category", ""),
        "category": p.get("categories", [{}])[0].get("name", "") if p.get("categories") else "",
        "url": f"https://www.{domain}/dp/{asin}",
    }

    _set_cache(ck, result)
    return result


async def search_keyword_ranking(
    keyword: str, brand: str, domain: str = "amazon.com", pages: int = 1
) -> dict:
    """
    Search Amazon for a keyword and find brand's position in results.
    Returns rank (1-based), total_results, top_competitors.
    """
    ck = _cache_key("amz_kw", keyword, brand, domain)
    cached = _get_cached(ck)
    if cached is not None:
        return cached

    data = await _request({
        "type": "search",
        "search_term": keyword,
        "amazon_domain": domain,
    })

    result = {
        "keyword": keyword,
        "brand": brand,
        "brand_rank": None,
        "brand_products": [],
        "top_competitors": [],
        "total_results": 0,
    }

    if not data:
        return result

    products = data.get("search_results", [])
    brand_lower = brand.lower()
    result["total_results"] = data.get("search_information", {}).get("total_results", len(products))

    brand_found = []
    competitors = []

    for idx, p in enumerate(products, start=1):
        title = (p.get("title", "") or "").lower()
        p_brand = (p.get("brand", "") or "").lower()
        entry = {
            "rank": idx,
            "asin": p.get("asin", ""),
            "title": p.get("title", ""),
            "rating": p.get("rating", 0),
            "reviews": p.get("ratings_total", 0),
        }
        if brand_lower in title or brand_lower in p_brand:
            brand_found.append(entry)
            if result["brand_rank"] is None:
                result["brand_rank"] = idx
        else:
            if len(competitors) < 5:
                competitors.append(entry)

    result["brand_products"] = brand_found[:3]
    result["top_competitors"] = competitors[:5]

    _set_cache(ck, result)
    logger.info("Amazon keyword '%s' → brand '%s' rank: %s", keyword, brand, result["brand_rank"])
    return result


async def get_brand_amazon_summary(brand: str, keywords: list[str] | None = None, domain: str = "amazon.com") -> dict:
    """
    Full Amazon presence summary for a brand — used in GEO reports.
    Combines brand search + keyword rankings.
    """
    import asyncio

    kws = keywords or [brand]

    brand_data, *kw_results = await asyncio.gather(
        search_brand(brand, domain),
        *[search_keyword_ranking(kw, brand, domain) for kw in kws[:3]],
    )

    return {
        "available": _AVAILABLE,
        "brand": brand,
        "domain": domain,
        "presence": brand_data,
        "keyword_rankings": kw_results,
    }
