#!/usr/bin/env python3
"""
Compile report data JSON from database.
Queries PostgreSQL directly and outputs the JSON format expected by gen_report.py.

Usage:
  python scripts/report/compile_report_data.py --brand Supuon --product pillow --region th
  python scripts/report/compile_report_data.py --run-id <uuid>

Output: scripts/report/<brand>-<product>_data.json
"""

import argparse
import asyncio
import json
import os
import re
import subprocess
import sys
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

import psycopg2
import psycopg2.extras

# ---------------------------------------------------------------------------
# Auto-load .env from project root (so RAINFOREST_API_KEY etc. are available)
# ---------------------------------------------------------------------------
# NOTE: must be before any amazon_service import so RAINFOREST_API_KEY is set
try:
    from dotenv import load_dotenv
    _env_path = Path(__file__).resolve().parents[2] / ".env"
    if _env_path.exists():
        load_dotenv(_env_path)
except ImportError:
    pass  # dotenv not installed, rely on shell environment

# ---------------------------------------------------------------------------
# KOL / YouTube via yt-dlp
# ---------------------------------------------------------------------------

_YTDLP = "/opt/anaconda3/bin/yt-dlp"


def fetch_kol_data(brand: str, product: str, region: str = "us", n: int = 8) -> list[dict]:
    """Search YouTube for KOL reviews using yt-dlp and return structured kol_details."""
    queries = [
        f"{brand} {product} review",
        f"{brand} review unboxing",
    ]
    seen_ids: set[str] = set()
    kols: list[dict] = []

    for q in queries:
        if len(kols) >= n:
            break
        try:
            cmd = [_YTDLP, "--flat-playlist", "--dump-json", f"ytsearch{n}:{q}"]
            out = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            for line in out.stdout.strip().split("\n"):
                if not line:
                    continue
                try:
                    v = json.loads(line)
                except json.JSONDecodeError:
                    continue
                vid_id = v.get("id", "")
                if not vid_id or vid_id in seen_ids:
                    continue
                seen_ids.add(vid_id)
                views = v.get("view_count") or 0
                uploader = v.get("uploader") or v.get("uploader_id") or "unknown"
                handle = v.get("uploader_id") or uploader
                if not handle.startswith("@"):
                    handle = f"@{handle}"
                kols.append({
                    "handle": handle,
                    "platform": "YouTube",
                    "market": region.upper() if len(region) == 2 else "US",
                    "product": product.title(),
                    "views": views,
                    "likes": v.get("like_count") or 0,
                    "badge_class": "hot" if views > 100_000 else "warm" if views > 10_000 else "cool",
                    "badge_label": "爆款" if views > 100_000 else "优质KOL" if views > 10_000 else "带货达人",
                    "note": (v.get("title") or "")[:80],
                    "cited": False,
                    "status_label": "待验证",
                    "status_color": "#94a3b8",
                    "citation_snippet": "",
                    "url": f"https://youtube.com/watch?v={vid_id}",
                    "upload_date": v.get("upload_date") or "",
                })
        except Exception as e:
            print(f"[KOL] yt-dlp failed for '{q}': {e}", file=sys.stderr)

    kols.sort(key=lambda x: -x["views"])
    result = kols[:n]
    print(f"[KOL] Found {len(result)} YouTube videos for '{brand} {product}'")
    return result

# Add project root to path for amazon_service import
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
try:
    from app.services.amazon_service import get_brand_amazon_summary, get_product
    _AMAZON_AVAILABLE = True
except ImportError:
    _AMAZON_AVAILABLE = False


# ---------------------------------------------------------------------------
# Amazon Brand Store scraper (Playwright — gets ALL SKUs, not just search hits)
# ---------------------------------------------------------------------------

def _scrape_brand_store_asins(brand_name: str, domain: str = "amazon.com") -> list[str]:
    """
    Scrape the Amazon Brand Store page to get the definitive list of all ASINs.
    Uses Scrapling basic Fetcher to find the store URL, then Playwright to
    render the JS-heavy store pages and follow each category sub-page.
    Returns [] gracefully if Playwright is unavailable or scraping fails.
    """
    try:
        from playwright.sync_api import sync_playwright
        from scrapling.fetchers import Fetcher
    except ImportError:
        print("[Amazon Store] Playwright/Scrapling not available — skipping brand store scrape", file=sys.stderr)
        return []

    def _get_asins_from_html(html: str) -> list[str]:
        return list(dict.fromkeys(re.findall(r'/dp/([A-Z0-9]{10})', html)))

    def _render_page(pw_page, url: str, scroll_rounds: int = 6) -> str:
        pw_page.goto(url, wait_until="domcontentloaded", timeout=30000)
        pw_page.wait_for_timeout(2500)
        for _ in range(scroll_rounds):
            pw_page.evaluate("window.scrollBy(0, 700)")
            pw_page.wait_for_timeout(500)
        return pw_page.content()

    try:
        # ── Step 1: find brand store URL via product page ──────────────────
        fetcher = Fetcher(auto_match=False)
        brand_lower = brand_name.lower().replace(" ", "+")
        search_html = fetcher.get(
            f"https://www.{domain}/s?k={brand_lower}",
            headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                     "Accept-Language": "en-US,en;q=0.9"},
        )
        store_url: str | None = None

        # Try to find a product page link and extract brand store URL from it
        product_links = search_html.css("a[href*='/dp/']")
        for link in product_links[:5]:
            href = link.attrib.get("href", "")
            m = re.search(r'/dp/([A-Z0-9]{10})', href)
            if not m:
                continue
            asin = m.group(1)
            try:
                prod_page = fetcher.get(
                    f"https://www.{domain}/dp/{asin}",
                    headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"},
                )
                byline = prod_page.css("#bylineInfo")
                if byline:
                    byline_href = byline[0].attrib.get("href", "")
                    if "/stores/" in byline_href:
                        store_url = (
                            f"https://www.{domain}{byline_href}"
                            if byline_href.startswith("/")
                            else byline_href
                        )
                        break
            except Exception:
                continue

        if not store_url:
            print(f"[Amazon Store] Could not find brand store URL for '{brand_name}'", file=sys.stderr)
            return []

        print(f"[Amazon Store] Store URL: {store_url[:80]}")

        # ── Step 2: use Playwright to scrape store + all sub-pages ─────────
        all_asins: set[str] = set()
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True)
            ctx = browser.new_context(
                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                locale="en-US",
                viewport={"width": 1440, "height": 900},
            )
            pg = ctx.new_page()

            # Main store home page
            html0 = _render_page(pg, store_url)
            all_asins.update(_get_asins_from_html(html0))

            # Discover sub-pages from nav links
            subpage_ids = list(dict.fromkeys(
                re.findall(r'/stores/(?:[^/]+/)?page/([A-F0-9-]{36})', html0, re.IGNORECASE)
            ))
            main_id_m = re.search(r'/page/([A-F0-9-]{36})', store_url, re.IGNORECASE)
            main_id = main_id_m.group(1) if main_id_m else None

            for pid in subpage_ids:
                if pid == main_id:
                    continue
                sub_url = f"https://www.{domain}/stores/{brand_name.lower()}/page/{pid}"
                try:
                    sub_html = _render_page(pg, sub_url, scroll_rounds=5)
                    all_asins.update(_get_asins_from_html(sub_html))
                except Exception:
                    pass

            ctx.close()
            browser.close()

        result = list(all_asins)
        print(f"[Amazon Store] {len(result)} ASINs found across {len(subpage_ids) + 1} store pages")
        return result

    except Exception as e:
        print(f"[Amazon Store] scrape failed (non-fatal): {e}", file=sys.stderr)
        return []


async def _fetch_new_products(asins: list[str], domain: str) -> list[dict]:
    """Batch-fetch product details via Rainforest type=product for a list of ASINs."""
    raw = await asyncio.gather(*[get_product(asin, domain) for asin in asins])
    products = []
    for p in raw:
        if not p:
            continue
        products.append({
            "asin": p["asin"],
            "title": p.get("title", ""),
            "rating": p.get("rating", 0),
            "reviews": p.get("reviews", 0),
            "price": p.get("price", 0),
            "bsr": p.get("bsr_rank"),
            "url": p.get("url", ""),
        })
    return products

# ---------------------------------------------------------------------------
# DB connection
# ---------------------------------------------------------------------------

DB_URL = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:5433/ai_rec_monitor")
DB_URL = DB_URL.replace("postgresql+asyncpg://", "postgresql://")
if "@db:" in DB_URL:
    DB_URL = re.sub(r"@db:\d+/", "@localhost:5433/", DB_URL)


def query(sql, params=()):
    conn = psycopg2.connect(DB_URL, cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            return [dict(r) for r in cur.fetchall()]
    finally:
        conn.close()


# ---------------------------------------------------------------------------
# Country / language helpers
# ---------------------------------------------------------------------------

COUNTRY_LANG_MAP = {
    "th": {"primary": "th", "label": "泰语", "flag": "🇹🇭"},
    "us": {"primary": "en", "label": "英语", "flag": "🇺🇸"},
    "cn": {"primary": "zh", "label": "中文", "flag": "🇨🇳"},
    "id": {"primary": "id", "label": "印尼语", "flag": "🇮🇩"},
    "my": {"primary": "ms", "label": "马来语", "flag": "🇲🇾"},
    "jp": {"primary": "ja", "label": "日语", "flag": "🇯🇵"},
    "kr": {"primary": "ko", "label": "韩语", "flag": "🇰🇷"},
    "vn": {"primary": "vi", "label": "越南语", "flag": "🇻🇳"},
    "gb": {"primary": "en", "label": "英语", "flag": "🇬🇧"},
}

LANG_INFO = {
    "th": {"label": "泰语", "flag": "🇹🇭"},
    "en": {"label": "英语", "flag": "🇺🇸"},
    "zh": {"label": "中文", "flag": "🇨🇳"},
    "id": {"label": "印尼语", "flag": "🇮🇩"},
    "ms": {"label": "马来语", "flag": "🇲🇾"},
    "ja": {"label": "日语", "flag": "🇯🇵"},
    "ko": {"label": "韩语", "flag": "🇰🇷"},
    "vi": {"label": "越南语", "flag": "🇻🇳"},
}

ENGINE_COLORS = {
    "openai": {"name": "ChatGPT", "color": "#22c55e", "bar_class": "gr"},
    "perplexity": {"name": "Perplexity", "color": "#60a5fa", "bar_class": "bl"},
    "claude": {"name": "Claude", "color": "#a78bfa", "bar_class": "pu"},
    "gemini": {"name": "Gemini", "color": "#fbbf24", "bar_class": "yl"},
}


def detect_language(text: str) -> str:
    """Simple heuristic to detect language from prompt text."""
    if re.search(r"[\u0E00-\u0E7F]", text):
        return "th"
    if re.search(r"[\u4e00-\u9fff]", text):
        return "zh"
    if re.search(r"[\u3040-\u309F\u30A0-\u30FF]", text):
        return "ja"
    if re.search(r"[\uAC00-\uD7AF]", text):
        return "ko"
    return "en"


def score_level(score: int) -> str:
    if score >= 60:
        return "优秀"
    if score >= 40:
        return "良好"
    if score >= 20:
        return "需改进"
    return "需大幅改进"


def sov_level(pct: float) -> str:
    if pct >= 30:
        return "strong"
    if pct >= 15:
        return "mid"
    return "weak"


# ---------------------------------------------------------------------------
# Main compilation
# ---------------------------------------------------------------------------

def compile_data(run_id: str | None = None, brand: str | None = None,
                 product: str | None = None, region: str | None = None,
                 extra_run_ids: list[str] | None = None) -> dict:
    """Compile report data from database.

    extra_run_ids: additional run UUIDs whose prompt_results will be merged in
                   (useful for combining runs from different providers).
    """

    # Find run
    if run_id:
        runs = query("SELECT * FROM runs WHERE id = %s", (run_id,))
    else:
        runs = query(
            """SELECT * FROM runs
               WHERE LOWER(brand_name) LIKE LOWER(%s) AND status = 'done'
               ORDER BY created_at DESC LIMIT 1""",
            (f"%{brand}%",),
        )

    if not runs:
        print(f"ERROR: No completed run found for brand={brand}", file=sys.stderr)
        sys.exit(1)

    run = runs[0]
    run_id = str(run["id"])
    brand_name = run["brand_name"]
    region = region or run.get("region", "us")

    # Get snapshot (from primary run)
    snaps = query("SELECT * FROM run_snapshots WHERE run_id = %s", (run_id,))
    snap = snaps[0] if snaps else {}

    # Get all prompt results — primary run
    results = query("SELECT * FROM prompt_results WHERE run_id = %s", (run_id,))

    # Merge extra runs' prompt_results
    if extra_run_ids:
        for extra_id in extra_run_ids:
            extra_results = query("SELECT * FROM prompt_results WHERE run_id = %s", (extra_id,))
            if extra_results:
                results = results + extra_results
                print(f"  Merged {len(extra_results)} results from extra run {extra_id}")
            else:
                print(f"  WARNING: No results found for extra run {extra_id}", file=sys.stderr)

    # Get recommendation (from primary run)
    recs = query("SELECT * FROM recommendations WHERE run_id = %s", (run_id,))
    rec = recs[0] if recs else {}

    # --------------- Compute metrics ---------------
    total = len(results)
    mentions = sum(1 for r in results if r["brand_mentioned"])
    mention_rate = round(mentions / total * 100, 1) if total else 0

    # GEO score (weighted SOV × scaling)
    weighted_sov = snap.get("weighted_sov", 0) or 0
    geo_score = min(100, round(weighted_sov * 2))  # Scale: 50% SOV = 100 GEO

    # Engine breakdown
    by_engine: dict[str, list] = defaultdict(list)
    for r in results:
        by_engine[r["provider"]].append(r)

    engines = []
    engine_details = []
    for provider, rows in by_engine.items():
        info = ENGINE_COLORS.get(provider, {"name": provider, "color": "#94a3b8", "bar_class": "gr"})
        eng_mentions = sum(1 for r in rows if r["brand_mentioned"])
        eng_total = len(rows)
        eng_rate = round(eng_mentions / eng_total * 100, 1) if eng_total else 0

        # By intent
        intent_stats = {}
        for intent in ["high_intent", "comparison", "informational"]:
            intent_rows = [r for r in rows if r["intent_type"] == intent]
            if intent_rows:
                im = sum(1 for r in intent_rows if r["brand_mentioned"])
                intent_stats[intent] = round(im / len(intent_rows) * 100, 1)
            else:
                intent_stats[intent] = 0

        # By language
        lang_stats = {}
        for r in rows:
            lang = detect_language(r["prompt_text"])
            if lang not in lang_stats:
                lang_stats[lang] = {"hits": 0, "total": 0}
            lang_stats[lang]["total"] += 1
            if r["brand_mentioned"]:
                lang_stats[lang]["hits"] += 1

        engines.append({
            "name": info["name"],
            "score": round(eng_rate * 2 / 10),  # Scale to 0-10ish
            "rank": 0,  # Will compute later
            "color": info["color"],
            "bar_class": info["bar_class"],
        })

        detail = {
            "name": info["name"],
            "score": round(eng_rate * 2 / 10),
            "color": info["color"],
            "bar_class": info["bar_class"],
            "hi_rate": intent_stats.get("high_intent", 0),
            "comp_rate": intent_stats.get("comparison", 0),
            "info_rate": intent_stats.get("informational", 0),
            "n_results": eng_total,
            # Template expects these three fixed language rates
            "th_rate": 0,
            "en_rate": 0,
            "zh_rate": 0,
        }
        # Override with actual language rates
        for lang_code, stats in lang_stats.items():
            rate = round(stats["hits"] / stats["total"] * 100, 1) if stats["total"] else 0
            detail[f"{lang_code}_rate"] = rate
        engine_details.append(detail)

    # Intent breakdown
    intent_names = {"high_intent": "购买推荐", "comparison": "产品对比", "informational": "品牌查询"}
    intent_colors = {"high_intent": "bl", "comparison": "or", "informational": "gr"}
    intents = []
    for intent_key, intent_label in intent_names.items():
        intent_rows = [r for r in results if r["intent_type"] == intent_key]
        im = sum(1 for r in intent_rows if r["brand_mentioned"])
        rate = round(im / len(intent_rows) * 100, 1) if intent_rows else 0
        intents.append({"name": intent_label, "rate": rate, "bar_class": intent_colors[intent_key]})

    # Competitor data
    competitors_data = run.get("competitor_names", []) or []
    comp_mentions: dict[str, dict] = {}
    for r in results:
        cd = r.get("competitors_data", {}) or {}
        if isinstance(cd, str):
            cd = json.loads(cd)
        for cname, cinfo in cd.items():
            if cname not in comp_mentions:
                comp_mentions[cname] = {"total": 0, "mentions": 0, "hi": 0, "hi_total": 0, "comp": 0, "comp_total": 0, "info": 0, "info_total": 0}
            comp_mentions[cname]["total"] += 1
            if cinfo.get("mentioned"):
                comp_mentions[cname]["mentions"] += 1
                intent = r["intent_type"]
                if intent == "high_intent":
                    comp_mentions[cname]["hi"] += 1
                elif intent == "comparison":
                    comp_mentions[cname]["comp"] += 1
                else:
                    comp_mentions[cname]["info"] += 1
            intent = r["intent_type"]
            if intent == "high_intent":
                comp_mentions[cname]["hi_total"] += 1
            elif intent == "comparison":
                comp_mentions[cname]["comp_total"] += 1
            else:
                comp_mentions[cname]["info_total"] += 1

    total_all_mentions = mentions + sum(c["mentions"] for c in comp_mentions.values())
    competitors = []

    # Add self
    self_sov = round(mentions / total_all_mentions * 100, 1) if total_all_mentions else 0
    hi_rows = [r for r in results if r["intent_type"] == "high_intent"]
    comp_rows = [r for r in results if r["intent_type"] == "comparison"]
    info_rows = [r for r in results if r["intent_type"] == "informational"]

    competitors.append({
        "name": brand_name,
        "sov": self_sov,
        "geo_score": geo_score,
        "citations": mentions,
        "is_self": True,
        "hi_rate": round(sum(1 for r in hi_rows if r["brand_mentioned"]) / len(hi_rows) * 100, 1) if hi_rows else 0,
        "comp_rate": round(sum(1 for r in comp_rows if r["brand_mentioned"]) / len(comp_rows) * 100, 1) if comp_rows else 0,
        "info_rate": round(sum(1 for r in info_rows if r["brand_mentioned"]) / len(info_rows) * 100, 1) if info_rows else 0,
    })

    for cname, cstats in sorted(comp_mentions.items(), key=lambda x: -x[1]["mentions"]):
        csov = round(cstats["mentions"] / total_all_mentions * 100, 1) if total_all_mentions else 0
        competitors.append({
            "name": cname,
            "sov": csov,
            "geo_score": min(100, round(csov * 2)),
            "citations": cstats["mentions"],
            "is_self": False,
            "hi_rate": round(cstats["hi"] / cstats["hi_total"] * 100, 1) if cstats["hi_total"] else 0,
            "comp_rate": round(cstats["comp"] / cstats["comp_total"] * 100, 1) if cstats["comp_total"] else 0,
            "info_rate": round(cstats["info"] / cstats["info_total"] * 100, 1) if cstats["info_total"] else 0,
        })

    competitors.sort(key=lambda x: -x["sov"])
    top_comp = next((c for c in competitors if not c["is_self"]), {})

    # Language breakdown
    lang_groups: dict[str, dict] = {}
    for r in results:
        lang = detect_language(r["prompt_text"])
        if lang not in lang_groups:
            lang_groups[lang] = {"hits": 0, "total": 0}
        lang_groups[lang]["total"] += 1
        if r["brand_mentioned"]:
            lang_groups[lang]["hits"] += 1

    lang_breakdown = []
    for lang_code, stats in sorted(lang_groups.items(), key=lambda x: -x[1]["total"]):
        info = LANG_INFO.get(lang_code, {"label": lang_code, "flag": "🌐"})
        lang_breakdown.append({
            "lang": lang_code,
            "label": info["label"],
            "flag": info["flag"],
            "hits": stats["hits"],
            "total": stats["total"],
            "rate": round(stats["hits"] / stats["total"] * 100) if stats["total"] else 0,
        })

    # Query samples (top hits + some misses)
    query_samples = []
    hits = [r for r in results if r["brand_mentioned"]][:15]
    misses = [r for r in results if not r["brand_mentioned"]][:15]
    for r in hits + misses:
        query_samples.append({
            "query": r["prompt_text"],
            "lang": detect_language(r["prompt_text"]),
            "intent": r["intent_type"],
            "hit": r["brand_mentioned"],
            "engine": ENGINE_COLORS.get(r["provider"], {}).get("name", r["provider"]),
        })

    # Intent comparison
    intent_comparison = []
    for intent_key, intent_label in intent_names.items():
        self_rows = [r for r in results if r["intent_type"] == intent_key]
        self_rate = round(sum(1 for r in self_rows if r["brand_mentioned"]) / len(self_rows) * 100, 1) if self_rows else 0

        comp_vals = []
        for cname, cstats in sorted(comp_mentions.items(), key=lambda x: -x[1]["mentions"])[:3]:
            rate_key = {"high_intent": "hi", "comparison": "comp", "informational": "info"}[intent_key]
            total_key = f"{rate_key}_total"
            pct = round(cstats[rate_key] / cstats[total_key] * 100, 1) if cstats[total_key] else 0
            comp_vals.append({"name": cname, "pct": pct, "level": sov_level(pct)})

        intent_comparison.append({
            "intent": intent_label,
            "self_pct": self_rate,
            "self_level": sov_level(self_rate),
            "comp_vals": comp_vals,
        })

    # Score factors
    hi_rate = intents[0]["rate"] if intents else 0
    score_factors = [
        {"name": "推荐出现率 (40%)", "weight": 40, "score": str(round(mention_rate)),
         "color": "#22c55e" if mention_rate > 20 else "#ef4444"},
        {"name": "位置权重 (25%)", "weight": 25, "score": str(geo_score // 10),
         "color": "#22c55e" if geo_score > 30 else "#ef4444"},
        {"name": "引用质量 (20%)", "weight": 20, "score": str(round(hi_rate)),
         "color": "#22c55e" if hi_rate > 10 else "#ef4444"},
        {"name": "意图覆盖 (15%)", "weight": 15, "score": str(len([i for i in intents if i["rate"] > 0])),
         "color": "#22c55e" if sum(1 for i in intents if i["rate"] > 0) >= 2 else "#ef4444"},
    ]

    # Actions from recommendations or generated
    actions = []
    if rec and rec.get("items"):
        items = rec["items"] if isinstance(rec["items"], list) else json.loads(rec["items"])
        for item in items[:3]:
            actions.append({
                "title": item.get("title", ""),
                "description": item.get("description", ""),
                "impact": {"high": 5, "medium": 3, "low": 2}.get(item.get("priority", "medium"), 3),
                "difficulty": "中等难度 · 1周内完成",
                "urgency": "立即" if item.get("priority") == "high" else None,
            })

    if not actions:
        actions = [
            {"title": "优化 Listing 关键词", "description": "在产品标题和描述中植入 AI 搜索高频关键词",
             "impact": 4, "difficulty": "低难度 · 3天内完成", "urgency": "立即"},
            {"title": "达人内容跨平台分发", "description": "将 TikTok 达人内容发布到其他可被 AI 抓取的平台",
             "impact": 5, "difficulty": "中等难度 · 1周内完成", "urgency": None},
            {"title": "英语 SEO 内容矩阵", "description": "在 Reddit/Quora 等平台建立英语内容",
             "impact": 3, "difficulty": "中等难度 · 2周内完成", "urgency": None},
        ]

    # ROI steps
    roi_steps = [
        {"week": "基准", "score": geo_score, "action": "当前状态（首次测量）"},
        {"week": "第2周", "score": min(100, geo_score + 4), "action": "Listing 优化 + 关键词植入"},
        {"week": "第4周", "score": min(100, geo_score + 9), "action": "达人合作 ×2 条新内容"},
        {"week": "第8周", "score": min(100, geo_score + 18), "action": "英语内容矩阵补充"},
        {"week": "第12周", "score": min(100, geo_score + 28), "action": "系统性 GEO 优化完成"},
    ]

    # --------------- Amazon presence (search + brand store scrape) ---------------
    amazon_data: dict = {"available": False}
    if _AMAZON_AVAILABLE:
        try:
            category = (product or run.get("category", "")).lower()
            kw_extras = [f"{brand_name} {category}".strip()] if category else None
            amazon_domain = "amazon.com" if region in ("us", "gb", "ca", "au") else "amazon.com"

            # Phase 1: search-based discovery (3 pages, ~20 SKUs)
            amazon_data = asyncio.run(
                get_brand_amazon_summary(brand_name, kw_extras, amazon_domain)
            )
            n_search = amazon_data.get("presence", {}).get("product_count", 0)
            print(f"[Amazon] search → {n_search} SKUs")

            # Phase 2: brand store scrape for the definitive full SKU list
            store_asins = _scrape_brand_store_asins(brand_name, amazon_domain)
            if store_asins:
                existing_asins = {
                    p["asin"]
                    for p in amazon_data.get("presence", {}).get("top_products", [])
                    if p.get("asin")
                }
                new_asins = [a for a in store_asins if a not in existing_asins]
                if new_asins:
                    print(f"[Amazon] brand store → {len(new_asins)} additional ASINs, fetching details...")
                    new_products = asyncio.run(_fetch_new_products(new_asins, amazon_domain))
                    if new_products:
                        all_products = (
                            amazon_data.get("presence", {}).get("top_products", [])
                            + new_products
                        )
                        all_products.sort(key=lambda x: -(x.get("reviews") or 0))
                        amazon_data["presence"]["top_products"] = all_products
                        amazon_data["presence"]["product_count"] = len(all_products)
                        # Recompute averages
                        ratings = [p["rating"] for p in all_products if p.get("rating")]
                        amazon_data["presence"]["avg_rating"] = (
                            round(sum(ratings) / len(ratings), 1) if ratings else 0.0
                        )

            n_total = amazon_data.get("presence", {}).get("product_count", 0)
            print(f"[Amazon] brand '{brand_name}' — {n_total} SKUs total")
        except Exception as e:
            print(f"[Amazon] fetch failed (non-fatal): {e}", file=sys.stderr)

    # --------------- KOL data via yt-dlp ---------------
    product_label_for_kol = product or run.get("category", brand_name)
    kol_details = fetch_kol_data(brand_name, product_label_for_kol, region)

    # --------------- Assemble ---------------
    product_label = product or run.get("category", "Product")
    report_slug = f"{brand_name.lower()}-{(product or 'report').lower().replace(' ', '-')}"
    now = datetime.now()

    data = {
        "brand": brand_name,
        "product_en": product_label.title(),
        "report_slug": report_slug,
        "report_type": "weekly",
        "report_type_label": "AI 可见度周报",
        "report_date": f"Week {now.isocalendar()[1]} · {now.strftime('%Y年%-m月%-d日')}",
        "period_label": "周",
        "geo_score": geo_score,
        "geo_score_level": score_level(geo_score),
        "geo_score_delta": "+0",
        "geo_score_delta_class": "flat",
        "category_avg_score": max(1, round(sum(c["geo_score"] for c in competitors) / len(competitors))) if competitors else 0,
        "top_brand_score": max(c["geo_score"] for c in competitors) if competitors else 0,
        "citation_count_90d": mentions,
        "citation_delta": "+0",
        "citation_delta_class": "flat",
        "citation_rate": round(mention_rate),
        "category_rank": next((i + 1 for i, c in enumerate(competitors) if c["is_self"]), len(competitors)),
        "rank_delta": "-",
        "rank_delta_class": "flat",
        "category_total_brands": len(competitors),
        "top_competitor_name": top_comp.get("name", "N/A"),
        "top_competitor_score": top_comp.get("geo_score", 0),
        "top_competitor_color": "white",
        "score_gap": abs(geo_score - top_comp.get("geo_score", 0)),
        "engine_coverage": len(engines),
        "summary_headline": f"{brand_name} 在 {region.upper()} 市场{'落后于' if top_comp.get('sov', 0) > self_sov else '领先'} {top_comp.get('name', 'N/A')}",
        "key_insights": [
            f"{brand_name} 的 GEO 得分为 {geo_score}",
            f"{top_comp.get('name', 'N/A')} 的 SOV 达 {top_comp.get('sov', 0)}%",
            f"{brand_name} 的购买意图引用率为 {round(mention_rate)}%",
            f"覆盖 {len(engines)} 个 AI 引擎",
        ],
        "engines": engines,
        "engine_details": engine_details,
        "intents": intents,
        "score_factors": score_factors,
        "intent_comparison": intent_comparison,
        "competitors": competitors,
        "lang_breakdown": lang_breakdown,
        "query_samples": query_samples,
        "kol_details": kol_details,
        "hallucination_total": 0,
        "hallucination_ok": 0,
        "hallucination_warn": 0,
        "hallucination_warnings": [],
        "hallucination_ok_items": [],
        "expected_score_gain": min(30, max(5, 40 - geo_score)),
        "actions": actions,
        "next_week_focus": f"专注于提高 {brand_name} 的 GEO 得分和 SOV。",
        "roi_steps": roi_steps,
        "roi_target_w12": roi_steps[-1]["score"],
        "amazon": amazon_data,
    }

    return data


def main():
    parser = argparse.ArgumentParser(description="Compile GEO report data from database")
    parser.add_argument("--brand", help="Brand name to search for")
    parser.add_argument("--product", help="Product name (e.g., pillow)")
    parser.add_argument("--region", help="Country code (e.g., th, us)")
    parser.add_argument("--run-id", help="Specific run UUID to use")
    parser.add_argument("--extra-run-ids", nargs="+", help="Additional run UUIDs to merge results from")
    parser.add_argument("--output", help="Output JSON path (default: auto-generated)")
    args = parser.parse_args()

    if not args.run_id and not args.brand:
        parser.error("Either --brand or --run-id is required")

    data = compile_data(
        run_id=args.run_id,
        brand=args.brand,
        product=args.product,
        region=args.region,
        extra_run_ids=args.extra_run_ids,
    )

    # Write output
    script_dir = Path(__file__).parent
    slug = data["report_slug"]
    output_path = Path(args.output) if args.output else script_dir / f"{slug}_data.json"
    output_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Data compiled: {output_path}")
    print(f"  Brand: {data['brand']}, GEO Score: {data['geo_score']}, SOV: {data['competitors'][0]['sov'] if data['competitors'] else 0}%")

    return str(output_path)


if __name__ == "__main__":
    main()
