"""
scrape_bestsellers.py
Fetches bestseller products across key Amazon categories using PA-API 5.0.
Outputs: data/bestsellers_{date}.json and data/bestsellers_{date}.csv

Usage:
    pip install python-amazon-paapi
    python scrape_bestsellers.py
"""

import csv
import json
import logging
import time
from datetime import date
from pathlib import Path

from amazon_paapi import AmazonApi

# ---------------------------------------------------------------------------
# Credentials — replace with real values; never commit to git
# ---------------------------------------------------------------------------
ACCESS_KEY  = "YOUR_ACCESS_KEY"
SECRET_KEY  = "YOUR_SECRET_KEY"
PARTNER_TAG = "your-tag-20"
COUNTRY     = "US"

# ---------------------------------------------------------------------------
# Browse node definitions: (node_id, human_label, search_keyword)
# ---------------------------------------------------------------------------
BROWSE_NODES = [
    # Electronics
    ("172282",      "Electronics",        "best seller electronics"),
    ("13900861",    "Portable Power",     "portable power bank"),
    ("7073960011",  "Wireless Earbuds",   "wireless earbuds"),
    ("2811119011",  "Car Electronics",    "car electronics gadgets"),
    # Outdoor
    ("3375251",     "Camping & Hiking",   "camping hiking gear"),
    ("706814011",   "Sports & Fitness",   "sports fitness equipment"),
    # Home
    ("1055398",     "Kitchen & Dining",   "kitchen gadgets"),
    ("2619526011",  "Smart Home",         "smart home devices"),
    # Beauty
    ("3760901",     "Beauty",             "beauty best sellers"),
    ("11059031",    "Hair Care",          "hair care products"),
    # Apparel
    ("1040660",     "Women's Clothing",   "women clothing top rated"),
    ("1040658",     "Men's Clothing",     "men clothing best sellers"),
    ("7141123011",  "Athletic Apparel",   "athletic workout clothes"),
    # Automotive
    ("15684181",    "Automotive",         "automotive accessories"),
    ("15690151",    "Car Electronics",    "car electronics accessories"),
    ("3405791",     "Car Accessories",    "car accessories best sellers"),
]

ITEMS_PER_NODE = 10

RESOURCES = [
    "ItemInfo.Title",
    "ItemInfo.ByLineInfo",
    "Offers.Listings.Price",
    "BrowseNodeInfo.BrowseNodes",
    "CustomerReviews.Count",
    "CustomerReviews.StarRating",
    "SearchRefinements.Refinements",
]

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def init_client() -> AmazonApi:
    return AmazonApi(ACCESS_KEY, SECRET_KEY, PARTNER_TAG, COUNTRY)


def parse_item(item, category: str, browse_node_id: str) -> dict:
    """Extract relevant fields from a PA-API item object."""
    asin  = getattr(item, "asin", None)
    title = None
    brand = None
    price = None
    review_count = None
    rating = None
    bsr_rank = None

    # Title
    try:
        title = item.item_info.title.display_value
    except AttributeError:
        pass

    # Brand
    try:
        brand = item.item_info.by_line_info.brand.display_value
    except AttributeError:
        pass

    # Price
    try:
        price = item.offers.listings[0].price.amount
    except (AttributeError, IndexError, TypeError):
        pass

    # Review count & rating
    try:
        review_count = item.customer_reviews.count
    except AttributeError:
        pass
    try:
        rating = item.customer_reviews.star_rating.display_value
    except AttributeError:
        pass

    # BSR rank from BrowseNodeInfo
    try:
        nodes = item.browse_node_info.browse_nodes
        if nodes:
            bsr_rank = getattr(nodes[0], "sales_rank", None)
    except AttributeError:
        pass

    return {
        "asin":          asin,
        "title":         title,
        "brand":         brand,
        "price":         price,
        "category":      category,
        "browse_node":   browse_node_id,
        "review_count":  review_count,
        "rating":        rating,
        "bsr_rank":      bsr_rank,
    }


def fetch_node(client: AmazonApi, node_id: str, label: str, keyword: str) -> list[dict]:
    """Fetch up to ITEMS_PER_NODE products for one browse node."""
    log.info("Fetching node %s (%s) — keyword: '%s'", node_id, label, keyword)
    try:
        response = client.search_items(
            keywords=keyword,
            browse_node_id=node_id,
            item_count=ITEMS_PER_NODE,
            sort_by="Relevance",
            resources=RESOURCES,
        )
        items = response.items or []
        parsed = [parse_item(it, label, node_id) for it in items]
        log.info("  -> %d products retrieved", len(parsed))
        return parsed
    except Exception as exc:
        log.error("  -> Error fetching node %s: %s", node_id, exc)
        return []


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------

def save_results(products: list[dict]) -> None:
    today = date.today().isoformat()
    out_dir = Path(__file__).parent / "data"
    out_dir.mkdir(parents=True, exist_ok=True)

    json_path = out_dir / f"bestsellers_{today}.json"
    csv_path  = out_dir / f"bestsellers_{today}.csv"

    # JSON
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    log.info("Saved JSON -> %s (%d records)", json_path, len(products))

    # CSV
    if products:
        fieldnames = list(products[0].keys())
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(products)
        log.info("Saved CSV  -> %s", csv_path)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    log.info("Initialising Amazon PA-API client (country=%s)", COUNTRY)
    client = AmazonApi(ACCESS_KEY, SECRET_KEY, PARTNER_TAG, COUNTRY)

    all_products: list[dict] = []

    for node_id, label, keyword in BROWSE_NODES:
        products = fetch_node(client, node_id, label, keyword)
        all_products.extend(products)
        time.sleep(1)  # respect 1 req/sec rate limit

    log.info("Total products collected: %d (target ~%d)",
             len(all_products), len(BROWSE_NODES) * ITEMS_PER_NODE)

    save_results(all_products)
    log.info("Done.")


if __name__ == "__main__":
    main()

# TODO: Cross-reference with AI mention data to compute ARRS score
