"""
keepa_fetch.py
Fetches BSR history and product data via Keepa API.
Free plan: 250 tokens/day (1 token ≈ 1 product with minimal resources).

Setup:
    1. Register at https://keepa.com/#!api → get your API key (free)
    2. pip install keepa
    3. Set KEEPA_API_KEY below or in environment variable

Usage:
    KEEPA_API_KEY=your_key python keepa_fetch.py

Output:
    data/keepa_YYYY-MM-DD.json
"""

import json
import logging
import os
from datetime import date
from pathlib import Path

log = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s", datefmt="%H:%M:%S")

KEEPA_API_KEY = os.getenv("KEEPA_API_KEY", "YOUR_KEEPA_API_KEY")

# ---------------------------------------------------------------------------
# ASINs to track — automotive + apparel bestsellers
# Update these with real ASINs from the Amazon Best Sellers scraper output
# ---------------------------------------------------------------------------
TRACKED_ASINS = {
    "Automotive": [
        "B07YFLMTQ1",  # NOCO Boost Plus GB40 (jump starter)
        "B07VFNTXH1",  # Vantrue N4 (dash cam)
        "B07X3NV7MH",  # Anker Wireless Car Charger
        "B08B4BQPYD",  # Autel MaxiScan MS309 OBD2
        "B07ZMG9JLG",  # Craftsman Jump Starter
    ],
    "Apparel": [
        "B07WFPMTBS",  # Champion Men's Jersey Tee
        "B082JSD4W8",  # CRZ YOGA Women's Leggings
        "B07VK9FL2N",  # Hanes Men's Jogger
        "B07PDHSPYD",  # Under Armour Tech Tee
        "B08BZS9NFW",  # Columbia Women's Jacket
    ],
}

# Flatten for API call (max 10 per request on free plan)
ALL_ASINS = [asin for asins in TRACKED_ASINS.values() for asin in asins]

CATEGORY_MAP = {asin: cat for cat, asins in TRACKED_ASINS.items() for asin in asins}


def fetch_keepa(asins: list[str]) -> list[dict]:
    """Fetch product data from Keepa for a list of ASINs."""
    try:
        import keepa
    except ImportError:
        log.error("keepa not installed. Run: pip install keepa")
        return []

    if KEEPA_API_KEY == "YOUR_KEEPA_API_KEY":
        log.error("Set KEEPA_API_KEY environment variable or edit this file.")
        return []

    log.info("Connecting to Keepa API...")
    api = keepa.Keepa(KEEPA_API_KEY)

    log.info("Fetching %d ASINs...", len(asins))
    products = api.query(
        asins,
        domain="US",
        history=True,       # include price/BSR history
        offers=20,          # top offers
        only_live_offers=True,
        rating=True,        # review history
    )

    results = []
    for p in products:
        asin = p.get("asin", "")
        category = CATEGORY_MAP.get(asin, "Unknown")

        # BSR history — list of (keepa_time, bsr_rank) pairs
        bsr_history = []
        if p.get("data", {}).get("SALES"):
            raw = p["data"]["SALES"]
            # Keepa encodes as [time1, val1, time2, val2, ...]
            pairs = [(raw[i], raw[i+1]) for i in range(0, len(raw)-1, 2) if raw[i+1] != -1]
            # Convert keepa time to approximate days ago
            bsr_history = [{"bsr": rank, "keepa_time": t} for t, rank in pairs[-30:]]  # last 30 datapoints

        current_bsr = bsr_history[-1]["bsr"] if bsr_history else None

        # Price history (NEW price)
        price_history = []
        if p.get("data", {}).get("NEW"):
            raw = p["data"]["NEW"]
            pairs = [(raw[i], raw[i+1]) for i in range(0, len(raw)-1, 2) if raw[i+1] != -1]
            price_history = [{"price_cents": v, "keepa_time": t} for t, v in pairs[-10:]]

        current_price = price_history[-1]["price_cents"] / 100 if price_history else None

        # Rating
        rating = None
        review_count = None
        if p.get("data", {}).get("RATING"):
            raw = p["data"]["RATING"]
            if raw:
                rating = raw[-1] / 10  # Keepa stores as 43 → 4.3
        if p.get("data", {}).get("COUNT_REVIEWS"):
            raw = p["data"]["COUNT_REVIEWS"]
            if raw:
                review_count = raw[-1]

        results.append({
            "asin":           asin,
            "title":          p.get("title", ""),
            "brand":          p.get("brand", ""),
            "category":       category,
            "current_bsr":    current_bsr,
            "current_price":  current_price,
            "rating":         rating,
            "review_count":   review_count,
            "bsr_history":    bsr_history,
            "price_history":  price_history,
        })
        log.info("  %s | BSR=%s | Price=$%s | ★%s (%s reviews)",
                 asin, current_bsr, current_price, rating, review_count)

    return results


def main() -> None:
    products = fetch_keepa(ALL_ASINS)

    today   = date.today().isoformat()
    out_dir = Path(__file__).parent / "data"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"keepa_{today}.json"

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"date": today, "products": products}, f, ensure_ascii=False, indent=2)

    log.info("Saved -> %s (%d products)", out_path, len(products))

    print("\n=== KEEPA SUMMARY ===")
    for p in products:
        print(f"  [{p['category']}] {p['asin']} | BSR #{p['current_bsr']} | ${p['current_price']} | ★{p['rating']} ({p['review_count']} reviews)")
        print(f"    {p['title'][:70]}")


if __name__ == "__main__":
    main()
