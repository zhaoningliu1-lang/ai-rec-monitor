"""
fetch_tiktok_playwright.py
Uses Playwright (real browser) to scrape TikTok Creative Center trend data.
Bypasses the API blocks that raw requests encounter.

Usage:
    pip install playwright
    python -m playwright install chromium
    python fetch_tiktok_playwright.py

Output:
    data/tiktok_playwright_YYYY-MM-DD.json

Note: Opens a visible browser window. Do not close it until script finishes.
"""

import asyncio
import json
import logging
import time
from datetime import date
from pathlib import Path

from playwright.async_api import async_playwright, TimeoutError as PwTimeout

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

CATEGORIES = [
    {
        "label": "Car Accessories",
        "url": "https://ads.tiktok.com/business/creativecenter/trend-discovery/hashtag/pc/en?period=30&industry=26850&country=US",
    },
    {
        "label": "Women's Apparel",
        "url": "https://ads.tiktok.com/business/creativecenter/trend-discovery/hashtag/pc/en?period=30&industry=26702&country=US",
    },
    {
        "label": "Sportswear",
        "url": "https://ads.tiktok.com/business/creativecenter/trend-discovery/hashtag/pc/en?period=30&industry=26703&country=US",
    },
]

SEARCH_HASHTAGS = [
    "caraccessories", "dashcam", "jumpstarter", "carphoneMount",
    "amazonfinds", "athleticwear", "gymoutfit", "ootd",
]


async def scrape_tiktok_trends() -> dict:
    results = {"date": date.today().isoformat(), "categories": [], "hashtags": []}

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=False,  # visible window — helps avoid bot detection
            args=["--no-sandbox", "--disable-blink-features=AutomationControlled"],
        )
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1440, "height": 900},
            locale="en-US",
        )
        page = await context.new_page()

        # 1. Trending categories
        for cat in CATEGORIES:
            log.info("Fetching: %s", cat["label"])
            try:
                await page.goto(cat["url"], wait_until="networkidle", timeout=20000)
                await asyncio.sleep(3)  # wait for JS to render

                # Try to extract hashtag cards
                hashtag_items = await page.query_selector_all("[class*='hashtag-card'], [class*='trend-item'], [data-testid='hashtag-item']")
                tags = []
                for item in hashtag_items[:10]:
                    try:
                        name = await item.query_selector("[class*='hashtag-name'], [class*='name']")
                        volume = await item.query_selector("[class*='volume'], [class*='count'], [class*='views']")
                        tags.append({
                            "hashtag": await name.inner_text() if name else "",
                            "volume":  await volume.inner_text() if volume else "",
                        })
                    except Exception:
                        pass

                results["categories"].append({
                    "category": cat["label"],
                    "hashtags": tags,
                    "screenshot": f"tiktok_{cat['label'].replace(' ', '_')}.png",
                })
                log.info("  -> %d hashtags found", len(tags))

                # Take screenshot as backup
                out_dir = Path(__file__).parent / "data"
                out_dir.mkdir(parents=True, exist_ok=True)
                await page.screenshot(
                    path=str(out_dir / f"tiktok_{cat['label'].replace(' ', '_')}_{date.today().isoformat()}.png"),
                    full_page=False,
                )

            except PwTimeout:
                log.warning("  %s -> timeout", cat["label"])
                results["categories"].append({"category": cat["label"], "hashtags": [], "error": "timeout"})
            except Exception as e:
                log.error("  %s -> %s", cat["label"], e)
                results["categories"].append({"category": cat["label"], "hashtags": [], "error": str(e)})

            await asyncio.sleep(2)

        # 2. Individual hashtag search
        log.info("\nSearching individual hashtags...")
        for tag in SEARCH_HASHTAGS:
            url = f"https://ads.tiktok.com/business/creativecenter/trend-discovery/hashtag/pc/en?keyword={tag}&country=US"
            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=15000)
                await asyncio.sleep(2)
                # Grab any visible numeric stats
                stats = await page.query_selector_all("[class*='stat'], [class*='count'], [class*='views']")
                volumes = []
                for s in stats[:3]:
                    txt = await s.inner_text()
                    if any(c.isdigit() for c in txt):
                        volumes.append(txt.strip())
                results["hashtags"].append({"hashtag": tag, "volumes": volumes})
                log.info("  #%s -> %s", tag, volumes[:2] if volumes else "no data")
            except Exception as e:
                log.warning("  #%s -> %s", tag, e)
                results["hashtags"].append({"hashtag": tag, "volumes": [], "error": str(e)})
            await asyncio.sleep(1.5)

        await browser.close()

    return results


def main() -> None:
    log.info("Starting Playwright TikTok scraper (Chromium)...")
    results = asyncio.run(scrape_tiktok_trends())

    out_dir  = Path(__file__).parent / "data"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"tiktok_playwright_{date.today().isoformat()}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    log.info("Saved -> %s", out_path)

    print("\n=== TIKTOK PLAYWRIGHT RESULTS ===")
    for cat in results["categories"]:
        tags = cat.get("hashtags", [])
        print(f"\n[{cat['category']}] — {len(tags)} hashtags")
        for t in tags[:5]:
            print(f"  #{t.get('hashtag', '')}  {t.get('volume', '')}")

    print("\n[Hashtag volumes]")
    for h in results["hashtags"]:
        vols = ", ".join(h.get("volumes", [])[:2]) or "no data"
        print(f"  #{h['hashtag']}: {vols}")

    print(f"\nScreenshots saved to: {out_dir}/tiktok_*.png")


if __name__ == "__main__":
    main()
