"""
fetch_youtube_trends.py
Fetches YouTube trending data for automotive + apparel product categories.
Uses yt-dlp (Agent Reach core) — no API key required.

Usage:
    pip install yt-dlp
    python fetch_youtube_trends.py

Output:
    data/youtube_trends_YYYY-MM-DD.json
"""

import json
import logging
import subprocess
import time
from datetime import date
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# YouTube search queries — automotive + apparel (cross-border seller focus)
# ---------------------------------------------------------------------------
SEARCH_QUERIES = [
    # Automotive — review/buying guide content
    "best car jump starter 2026 review",
    "best dash cam 2026 review",
    "best magsafe car mount review 2026",
    "NOCO boost review 2026",
    # Apparel — try-on haul content
    "amazon fashion haul 2026",
    "best athletic leggings review 2026",
    "amazon workout clothes try on",
    "best budget hiking jacket review",
    # Trend signals
    "tiktok car accessories 2026",
    "amazon must haves 2026 fashion",
]

MAX_RESULTS_PER_QUERY = 5


def search_youtube(query: str) -> list[dict]:
    """Use yt-dlp to search YouTube and get video metadata."""
    cmd = [
        "yt-dlp",
        f"ytsearch{MAX_RESULTS_PER_QUERY}:{query}",
        "--print", '%(id)s\t%(title)s\t%(uploader)s\t%(view_count)s\t%(like_count)s\t%(upload_date)s\t%(duration)s',
        "--no-download",
        "--no-warnings",
        "--quiet",
        "--socket-timeout", "10",
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        videos = []
        for line in result.stdout.strip().split("\n"):
            if not line.strip():
                continue
            parts = line.split("\t")
            if len(parts) < 7:
                continue
            vid_id, title, uploader, views, likes, upload_date, duration = parts[:7]
            videos.append({
                "video_id":    vid_id,
                "title":       title,
                "uploader":    uploader,
                "view_count":  int(views) if views.isdigit() else 0,
                "like_count":  int(likes) if likes.isdigit() else 0,
                "upload_date": upload_date,
                "duration_s":  int(duration) if duration.isdigit() else 0,
                "url":         f"https://www.youtube.com/watch?v={vid_id}",
            })
        log.info("  '%s' -> %d videos", query, len(videos))
        return videos
    except subprocess.TimeoutExpired:
        log.warning("  '%s' -> timeout", query)
        return []
    except Exception as e:
        log.error("  '%s' -> %s", query, e)
        return []


def extract_brand_signals(videos: list[dict], query: str) -> dict:
    """Extract which brands appear most in video titles for this query."""
    brand_keywords = [
        "NOCO", "Jackery", "EcoFlow", "Bluetti", "Vantrue", "Garmin", "Nextbase",
        "Spigen", "ESR", "iOttie", "Anker", "HULKMAN", "Gooloo",
        "Columbia", "Under Armour", "Nike", "Lululemon", "CRZ", "Halara",
        "Amazon Basics", "Colorfulkoala", "ODODOS",
    ]
    brand_counts: dict[str, int] = {}
    for video in videos:
        title_upper = video["title"].upper()
        for brand in brand_keywords:
            if brand.upper() in title_upper:
                brand_counts[brand] = brand_counts.get(brand, 0) + 1

    top_brands = sorted(brand_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    total_views = sum(v["view_count"] for v in videos)
    return {
        "query":       query,
        "top_brands":  [{"brand": b, "mentions": c} for b, c in top_brands],
        "total_views": total_views,
        "avg_views":   total_views // len(videos) if videos else 0,
    }


def main() -> None:
    log.info("=== YouTube Trend Fetch (via yt-dlp) ===")
    all_results = []

    for query in SEARCH_QUERIES:
        log.info("Searching: '%s'", query)
        videos = search_youtube(query)
        signals = extract_brand_signals(videos, query)
        all_results.append({
            "query":   query,
            "signals": signals,
            "videos":  videos,
        })
        time.sleep(1.5)

    # Save
    today    = date.today().isoformat()
    out_dir  = Path(__file__).parent / "data"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"youtube_trends_{today}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"date": today, "results": all_results}, f, ensure_ascii=False, indent=2)
    log.info("Saved -> %s", out_path)

    # Summary
    print("\n=== YOUTUBE BRAND SIGNAL SUMMARY ===")
    brand_total: dict[str, int] = {}
    for r in all_results:
        for b in r["signals"]["top_brands"]:
            brand_total[b["brand"]] = brand_total.get(b["brand"], 0) + b["mentions"]

    ranked = sorted(brand_total.items(), key=lambda x: x[1], reverse=True)
    print("\nBrand mentions across all queries (YouTube review content):")
    for brand, count in ranked[:15]:
        bar = "█" * count
        print(f"  {brand:<20} {bar} ({count})")

    print("\nTop videos by views:")
    all_videos = [(v, r["query"]) for r in all_results for v in r["videos"]]
    all_videos.sort(key=lambda x: x[0]["view_count"], reverse=True)
    for v, q in all_videos[:10]:
        views_m = v["view_count"] / 1_000_000
        print(f"  [{q[:25]:<25}] {views_m:.1f}M views — {v['title'][:55]}")
        print(f"    {v['url']}")


if __name__ == "__main__":
    main()
