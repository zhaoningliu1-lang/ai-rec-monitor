"""
scrape_amazon_bs.py
Scrapes Amazon Best Sellers pages using requests + BeautifulSoup.
No API key required. Focuses on automotive + apparel categories.

Usage:
    pip install requests beautifulsoup4 lxml fake-useragent
    python scrape_amazon_bs.py

Output:
    data/bestsellers_bs_YYYY-MM-DD.json
    data/bestsellers_bs_YYYY-MM-DD.csv

Note: Adds 2-4s random delay between requests to be polite to Amazon's servers.
"""

import csv
import json
import logging
import random
import time
from datetime import date
from pathlib import Path

import requests
from bs4 import BeautifulSoup

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Categories to scrape — Amazon Best Sellers URL per category
# ---------------------------------------------------------------------------
CATEGORIES = [
    # Automotive
    {"label": "Automotive",           "url": "https://www.amazon.com/Best-Sellers-Automotive/zgbs/automotive/"},
    {"label": "Car Electronics",      "url": "https://www.amazon.com/Best-Sellers-Automotive-Car-Electronics/zgbs/automotive/15690151/"},
    {"label": "Car Accessories",      "url": "https://www.amazon.com/Best-Sellers-Automotive-Accessories-Supplies/zgbs/automotive/15684181/"},
    {"label": "Jump Starters",        "url": "https://www.amazon.com/Best-Sellers-Automotive-Jump-Starters/zgbs/automotive/15706231/"},
    {"label": "Dash Cameras",         "url": "https://www.amazon.com/Best-Sellers-Automotive-Dash-Cameras/zgbs/automotive/15707461/"},
    # Apparel
    {"label": "Women's Clothing",     "url": "https://www.amazon.com/Best-Sellers-Clothing-Shoes-Jewelry-Womens/zgbs/fashion/1040660/"},
    {"label": "Men's Clothing",       "url": "https://www.amazon.com/Best-Sellers-Clothing-Shoes-Jewelry-Mens/zgbs/fashion/1040658/"},
    {"label": "Athletic Apparel",     "url": "https://www.amazon.com/Best-Sellers-Sports-Outdoors-Sports-Fitness/zgbs/sporting-goods/3375251/"},
    # Bonus
    {"label": "Portable Power",       "url": "https://www.amazon.com/Best-Sellers-Electronics-Portable-Power-Stations/zgbs/electronics/17944869011/"},
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Connection": "keep-alive",
    "DNT": "1",
}

MAX_ITEMS_PER_CATEGORY = 20
DELAY_MIN = 2.0
DELAY_MAX = 4.5


def fetch_page(url: str, session: requests.Session) -> BeautifulSoup | None:
    try:
        resp = session.get(url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            return BeautifulSoup(resp.text, "lxml")
        log.warning("  HTTP %s for %s", resp.status_code, url)
        return None
    except Exception as e:
        log.error("  Request failed: %s", e)
        return None


def parse_bestsellers(soup: BeautifulSoup, category: str) -> list[dict]:
    products = []

    # Amazon Best Sellers grid items
    items = soup.select("div.zg-grid-general-faceout, li.zg-item-immersion")
    if not items:
        # Fallback selector for newer page layouts
        items = soup.select("[data-asin]")

    for rank, item in enumerate(items[:MAX_ITEMS_PER_CATEGORY], start=1):
        asin = item.get("data-asin", "")

        # Title
        title_el = (
            item.select_one("a.a-link-normal span") or
            item.select_one(".p13n-sc-truncated") or
            item.select_one("._cDEzb_p13n-sc-css-line-clamp-3_g3dy1") or
            item.select_one("span.a-text-normal")
        )
        title = title_el.get_text(strip=True) if title_el else ""

        # Brand (often embedded in title or a separate span)
        brand_el = item.select_one("span.a-color-secondary") or item.select_one(".a-row .a-color-secondary")
        brand = brand_el.get_text(strip=True) if brand_el else ""

        # Price
        price_el = (
            item.select_one("span.p13n-sc-price") or
            item.select_one("._cDEzb_p13n-sc-price_3mJ9Z") or
            item.select_one("span.a-price-whole")
        )
        price_raw = price_el.get_text(strip=True) if price_el else ""
        price = price_raw.replace("$", "").replace(",", "").strip()

        # Rating
        rating_el = item.select_one("span.a-icon-alt")
        rating = ""
        if rating_el:
            txt = rating_el.get_text(strip=True)
            if "out of" in txt:
                rating = txt.split(" out of")[0]

        # Review count
        review_el = item.select_one("span.a-size-small") or item.select_one("a[href*='customerReviews']")
        reviews_raw = review_el.get_text(strip=True) if review_el else ""
        reviews = reviews_raw.replace(",", "").replace("(", "").replace(")", "").strip()

        if not title:
            continue

        products.append({
            "rank":        rank,
            "asin":        asin,
            "title":       title,
            "brand":       brand,
            "price":       price,
            "rating":      rating,
            "reviews":     reviews,
            "category":    category,
        })

    return products


def scrape_category(cat: dict, session: requests.Session) -> list[dict]:
    label = cat["label"]
    url   = cat["url"]
    log.info("Scraping: %s", label)

    soup = fetch_page(url, session)
    if not soup:
        return []

    products = parse_bestsellers(soup, label)
    log.info("  -> %d products found", len(products))
    return products


def save_results(products: list[dict]) -> None:
    today   = date.today().isoformat()
    out_dir = Path(__file__).parent / "data"
    out_dir.mkdir(parents=True, exist_ok=True)

    json_path = out_dir / f"bestsellers_bs_{today}.json"
    csv_path  = out_dir / f"bestsellers_bs_{today}.csv"

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    log.info("Saved JSON -> %s (%d records)", json_path, len(products))

    if products:
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=list(products[0].keys()))
            writer.writeheader()
            writer.writerows(products)
        log.info("Saved CSV  -> %s", csv_path)


def main() -> None:
    session = requests.Session()
    all_products: list[dict] = []

    for cat in CATEGORIES:
        products = scrape_category(cat, session)
        all_products.extend(products)

        delay = random.uniform(DELAY_MIN, DELAY_MAX)
        log.info("  Waiting %.1fs before next request...", delay)
        time.sleep(delay)

    log.info("Total: %d products across %d categories", len(all_products), len(CATEGORIES))
    save_results(all_products)

    # Print top 5 per category
    print("\n=== TOP 5 PER CATEGORY ===")
    categories_seen: set[str] = set()
    current_cat = None
    count = 0
    for p in all_products:
        if p["category"] != current_cat:
            current_cat = p["category"]
            count = 0
            print(f"\n[{current_cat}]")
        if count < 5:
            print(f"  #{p['rank']}: {p['title'][:60]:<60}  ${p['price']:<8}  ★{p['rating']}")
            count += 1


if __name__ == "__main__":
    main()
