"""
fetch_tiktok_trends.py
Fetches trending data from TikTok Creative Center (public, no auth required).
Focuses on automotive accessories + apparel trending hashtags and products.

Usage:
    python fetch_tiktok_trends.py

Output:
    data/tiktok_trends_YYYY-MM-DD.json

TikTok Creative Center: https://ads.tiktok.com/business/creativecenter
"""

import json
import logging
import time
from datetime import date
from pathlib import Path

import requests

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Headers — mimic a real browser visit to Creative Center
# ---------------------------------------------------------------------------
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://ads.tiktok.com/business/creativecenter/",
    "Origin": "https://ads.tiktok.com",
}

BASE_CC = "https://ads.tiktok.com/business/creativecenter/api/v1"

# ---------------------------------------------------------------------------
# Keyword groups for hashtag trend lookup
# ---------------------------------------------------------------------------
HASHTAG_QUERIES = [
    # Automotive
    "car accessories", "dashcam", "jump starter", "car phone mount", "car gadgets",
    # Apparel
    "outfit", "women fashion", "athleisure", "ootd amazon", "amazon fashion finds",
    # General cross-border seller signals
    "amazon must haves", "tiktok made me buy it",
]

# ---------------------------------------------------------------------------
# Fetch trending hashtags
# ---------------------------------------------------------------------------

def fetch_trending_hashtags(session: requests.Session, keyword: str) -> dict:
    """Search TikTok Creative Center for a keyword's hashtag trend."""
    url = f"{BASE_CC}/tools/trending_hashtags"
    params = {
        "lang": "en",
        "period": "30",         # last 30 days
        "country_code": "US",
        "keyword": keyword,
    }
    try:
        resp = session.get(url, headers=HEADERS, params=params, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            items = data.get("data", {}).get("list", []) or []
            return {"keyword": keyword, "results": items[:5], "status": "ok"}
        else:
            log.warning("  %s -> HTTP %s", keyword, resp.status_code)
            return {"keyword": keyword, "results": [], "status": f"http_{resp.status_code}"}
    except Exception as e:
        log.error("  %s -> %s", keyword, e)
        return {"keyword": keyword, "results": [], "status": "error"}


# ---------------------------------------------------------------------------
# Fetch top trending products (TikTok Shop Creative Center)
# ---------------------------------------------------------------------------

def fetch_top_products(session: requests.Session) -> list[dict]:
    """Fetch TikTok Shop trending products from Creative Center."""
    url = f"{BASE_CC}/tools/top_products"
    categories = [
        ("Automotive Accessories", "502"),
        ("Women's Clothing", "2078"),
        ("Men's Clothing", "2077"),
        ("Sports & Outdoors", "1399"),
    ]
    all_products = []
    for cat_label, cat_id in categories:
        params = {
            "lang": "en",
            "period": "30",
            "country_code": "US",
            "category_id": cat_id,
        }
        try:
            resp = session.get(url, headers=HEADERS, params=params, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                items = data.get("data", {}).get("products", []) or []
                for item in items[:10]:
                    all_products.append({
                        "category": cat_label,
                        "name": item.get("product_name", ""),
                        "sales_volume": item.get("sales_volume", 0),
                        "revenue": item.get("revenue", 0),
                        "price": item.get("price", ""),
                        "video_count": item.get("video_count", 0),
                    })
                log.info("  %s -> %d products", cat_label, len(items))
            else:
                log.warning("  %s -> HTTP %s", cat_label, resp.status_code)
        except Exception as e:
            log.error("  %s -> %s", cat_label, e)
        time.sleep(1)
    return all_products


# ---------------------------------------------------------------------------
# Alternative: keyword search via Creative Center search API
# ---------------------------------------------------------------------------

def fetch_keyword_insights(session: requests.Session, keywords: list[str]) -> list[dict]:
    """Use the keyword insight tool to get search volume trends on TikTok."""
    url = f"{BASE_CC}/tools/keyword_insights"
    results = []
    for kw in keywords:
        params = {
            "lang": "en",
            "country_code": "US",
            "keyword": kw,
            "period": "30",
        }
        try:
            resp = session.get(url, headers=HEADERS, params=params, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                results.append({
                    "keyword": kw,
                    "data": data.get("data", {}),
                    "status": "ok",
                })
                log.info("  '%s' -> ok", kw)
            else:
                results.append({"keyword": kw, "data": {}, "status": f"http_{resp.status_code}"})
        except Exception as e:
            results.append({"keyword": kw, "data": {}, "status": "error"})
        time.sleep(0.8)
    return results


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    session = requests.Session()

    output = {
        "date": date.today().isoformat(),
        "geo": "US",
        "period": "last_30_days",
        "trending_hashtags": [],
        "top_products": [],
        "keyword_insights": [],
    }

    # 1. Trending hashtags
    log.info("=== Fetching trending hashtags ===")
    for kw in HASHTAG_QUERIES:
        result = fetch_trending_hashtags(session, kw)
        output["trending_hashtags"].append(result)
        log.info("  '%s' -> %d results (status: %s)", kw, len(result["results"]), result["status"])
        time.sleep(1.2)

    # 2. Top products
    log.info("\n=== Fetching top products ===")
    output["top_products"] = fetch_top_products(session)

    # 3. Keyword insights for our specific categories
    log.info("\n=== Fetching keyword insights ===")
    category_keywords = [
        "car jump starter", "dash cam", "car phone holder",
        "women's joggers", "oversized hoodie", "biker shorts",
        "athletic set", "men's t-shirt",
    ]
    output["keyword_insights"] = fetch_keyword_insights(session, category_keywords)

    # Save
    out_dir  = Path(__file__).parent / "data"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"tiktok_trends_{date.today().isoformat()}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    log.info("\nSaved -> %s", out_path)

    # Print summary
    print("\n=== TIKTOK SUMMARY ===")

    ok_hashtags = [h for h in output["trending_hashtags"] if h["status"] == "ok" and h["results"]]
    print(f"\nHashtag results: {len(ok_hashtags)}/{len(HASHTAG_QUERIES)} keywords returned data")
    for h in ok_hashtags[:5]:
        print(f"  #{h['keyword']}: {len(h['results'])} trending tags")

    if output["top_products"]:
        print(f"\nTop products: {len(output['top_products'])} found")
        for p in output["top_products"][:5]:
            print(f"  [{p['category']}] {p['name'][:50]} — ${p['price']}")
    else:
        print("\nTop products: Creative Center returned no data (may need browser session)")
        print("  → Run the script with cookies (see below)")

    # If all failed, print fallback instructions
    all_failed = all(h["status"] != "ok" or not h["results"] for h in output["trending_hashtags"])
    if all_failed:
        print("\n⚠️  TikTok Creative Center is blocking automated requests.")
        print("   Fallback: open your browser, go to:")
        print("   https://ads.tiktok.com/business/creativecenter/trend-discovery/hashtag/pc/en")
        print("   → Search for: car accessories, women fashion, athleisure")
        print("   → Screenshot the trending hashtag volume data")
        print("\n   OR extract your browser cookies and add them to HEADERS above.")


if __name__ == "__main__":
    main()
