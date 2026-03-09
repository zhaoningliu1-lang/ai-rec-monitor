"""
fetch_trends.py
Google Trends data fetcher via pytrends (no API key required).
Focuses on automotive parts + apparel — matching ProPower Global demo categories.

Usage:
    pip install pytrends
    python fetch_trends.py

Output:
    data/trends_YYYY-MM-DD.json
"""

import json
import time
import logging
from datetime import date
from pathlib import Path

from pytrends.request import TrendReq

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Keywords to track — grouped by category
# Each group is one pytrends comparison (max 5 keywords)
# ---------------------------------------------------------------------------
KEYWORD_GROUPS = [
    {
        "category": "Automotive Parts",
        "keywords": ["car jump starter", "dash cam", "car phone mount", "OBD2 scanner", "car air purifier"],
    },
    {
        "category": "Car Safety & Electronics",
        "keywords": ["blind spot mirror", "backup camera", "car battery charger", "tire inflator", "car vacuum cleaner"],
    },
    {
        "category": "Outdoor Apparel",
        "keywords": ["hiking pants", "waterproof jacket", "compression leggings", "running shorts", "fleece hoodie"],
    },
    {
        "category": "Casual Apparel",
        "keywords": ["oversized t-shirt", "cargo pants women", "athletic dress", "jogger pants", "biker shorts"],
    },
    {
        "category": "Portable Power",
        "keywords": ["portable power station", "solar generator", "power bank 20000mah", "car battery jump starter", "lifepo4 battery"],
    },
]

TIMEFRAME = "today 3-m"   # last 90 days
GEO       = "US"


def fetch_group(pytrends: TrendReq, group: dict) -> dict:
    """Fetch interest_over_time for one keyword group."""
    keywords = group["keywords"]
    category = group["category"]
    log.info("Fetching trends for category: %s — %s", category, keywords)

    pytrends.build_payload(keywords, cat=0, timeframe=TIMEFRAME, geo=GEO)
    df = pytrends.interest_over_time()

    if df.empty:
        log.warning("  -> No data returned for %s", category)
        return {"category": category, "keywords": {}, "rising": []}

    # Latest value (last week's index, 0-100)
    latest = {kw: int(df[kw].iloc[-1]) for kw in keywords if kw in df.columns}

    # 4-week delta: last week vs 4 weeks ago
    delta = {}
    if len(df) >= 4:
        for kw in keywords:
            if kw not in df.columns:
                continue
            now_val  = int(df[kw].iloc[-1])
            prev_val = int(df[kw].iloc[-4])
            if prev_val > 0:
                delta[kw] = round((now_val - prev_val) / prev_val * 100, 1)
            else:
                delta[kw] = 0.0

    # Rising queries
    try:
        related = pytrends.related_queries()
        rising = []
        for kw in keywords:
            if kw in related and related[kw]["rising"] is not None:
                top = related[kw]["rising"].head(3)["query"].tolist()
                rising.extend(top)
        rising = list(set(rising))[:10]
    except Exception:
        rising = []

    log.info("  -> Latest scores: %s", latest)
    return {
        "category": category,
        "keywords": latest,
        "delta_4w_pct": delta,
        "rising_queries": rising,
    }


def main() -> None:
    pytrends = TrendReq(hl="en-US", tz=360, timeout=(10, 25), retries=3, backoff_factor=1.5)

    results = []
    for group in KEYWORD_GROUPS:
        result = fetch_group(pytrends, group)
        results.append(result)
        time.sleep(3)  # avoid rate limiting

    # Save output
    today    = date.today().isoformat()
    out_dir  = Path(__file__).parent / "data"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"trends_{today}.json"

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"date": today, "geo": GEO, "timeframe": TIMEFRAME, "categories": results}, f, ensure_ascii=False, indent=2)

    log.info("Saved -> %s", out_path)

    # Print summary to console
    print("\n=== TREND SUMMARY ===")
    for r in results:
        print(f"\n[{r['category']}]")
        for kw, score in r.get("keywords", {}).items():
            delta = r.get("delta_4w_pct", {}).get(kw, 0)
            arrow = "↑" if delta > 5 else ("↓" if delta < -5 else "→")
            print(f"  {arrow} {kw:<35} score={score:>3}  4w_delta={delta:>+6.1f}%")
        if r.get("rising_queries"):
            print(f"  Rising: {', '.join(r['rising_queries'][:5])}")


if __name__ == "__main__":
    main()
