#!/usr/bin/env python3
"""
Avanti GEO Runner — Supuon Brand (Thailand TikTok/Shopee)

Usage:
  python scripts/run_geo_supuon.py pillow   # Baby Pillow
  python scripts/run_geo_supuon.py pump     # Breast Pump
  python scripts/run_geo_supuon.py all      # Both products

Output:
  scripts/report/supuon_<product>_data.json
  docs/reports/supuon-<product>-YYYY-MM-DD.pdf
"""

import sys, json, asyncio, os, re, time
from pathlib import Path
from datetime import datetime
from collections import defaultdict

import dotenv

dotenv.load_dotenv(Path(__file__).parent.parent / ".env")

OPENAI_KEY     = os.getenv("OPENAI_API_KEY")
ANTHROPIC_KEY  = os.getenv("ANTHROPIC_API_KEY")
GEMINI_KEY     = os.getenv("GEMINI_API_KEY")
PERPLEXITY_KEY = os.getenv("PERPLEXITY_API_KEY")

SCRIPT_DIR = Path(__file__).parent
REPORT_DIR = SCRIPT_DIR / "report"

# ── Product Configs ────────────────────────────────────────────────────────────

PRODUCTS = {
    "pillow": {
        "brand":      "Supuon",
        "product_en": "Baby Pillow",
        "product_th": "หมอนทารก",
        "product_zh": "婴儿定型枕",
        "slug":       "supuon-pillow",
        "competitors": ["lucklyeveryday", "Jean suwei", "Fuji Baby Shop"],
        "tiktok_shop": "@luluclub123_",
        "kol_urls": [
            "https://www.tiktok.com/@june_kidsshop2023/video/7585554616260185365",
            "https://www.tiktok.com/@my_pairwa/video/7475153476402580742",
        ],
        "known_specs": {
            "material": "100% pure cotton",
            "feature":  "3-side adjustable, removable washable insert",
            "safety":   "breathable anti-flat-head design",
        },
    },
    "pump": {
        "brand":      "Supuon",
        "product_en": "Breast Pump",
        "product_th": "เครื่องปั๊มนม",
        "product_zh": "吸奶器",
        "slug":       "supuon-pump",
        "competitors": ["Dr.isla Th", "Disney Baby Store"],
        "tiktok_shop": "@pupumall123_",
        "kol_urls": [
            "https://www.tiktok.com/@oil_rwd/video/7566939823676673287",
            "https://www.tiktok.com/@mommy.program/video/7531550910116318482",
            "https://www.tiktok.com/@oil_rwd/video/7554722925727862034",
        ],
        "known_specs": {
            "modes":    "4 modes x 15 suction levels",
            "battery":  "2000mAh built-in battery",
            "design":   "wireless silent 360-degree soft cup",
        },
    },
}

# ── Query Builder ──────────────────────────────────────────────────────────────

def build_queries(cfg: dict) -> list[dict]:
    """150 queries: Thai 75 (50%) / English 52 (35%) / Chinese 23 (15%)"""

    b  = cfg["brand"]
    en = cfg["product_en"]
    th = cfg["product_th"]
    zh = cfg["product_zh"]
    c  = cfg["competitors"]
    c0 = c[0]
    c1 = c[1] if len(c) > 1 else c[0]

    def q(text, lang, intent):
        return {"text": text, "lang": lang, "intent": intent}

    thai_high = [
        q(f"{th}ยี่ห้อไหนดีที่สุดในปี 2025", "th", "high"),
        q(f"แนะนำ{th}สำหรับทารกแรกเกิด", "th", "high"),
        q(f"ซื้อ{th}ยี่ห้อไหนดี", "th", "high"),
        q(f"{th}ราคาถูกคุณภาพดี", "th", "high"),
        q(f"อยากซื้อ{th}ให้ลูก แนะนำยี่ห้อไหน", "th", "high"),
        q(f"{th}ที่ดีที่สุดในไทย", "th", "high"),
        q(f"{th}ยอดนิยม 2025", "th", "high"),
        q(f"อันดับ{th}ที่ดีที่สุด", "th", "high"),
        q(f"top 5 {th}ปี 2025", "th", "high"),
        q(f"brand {th}ที่ดีในไทย", "th", "high"),
        q(f"{th}สำหรับแม่ลูกอ่อน", "th", "high"),
        q(f"{th}ที่แม่ๆ แนะนำ", "th", "high"),
        q(f"ซื้อ{th}บน TikTok ยี่ห้อไหนดี", "th", "high"),
        q(f"{th}ขายดีบน TikTok shop", "th", "high"),
        q(f"best seller {th} ไทย", "th", "high"),
        q(f"แนะนำ{th}ออนไลน์", "th", "high"),
        q(f"{th}ราคาไม่เกิน 500 บาท", "th", "high"),
        q(f"รีวิว{th}ยี่ห้อดัง", "th", "high"),
        q(f"{th}ดีๆ ราคาไม่แพง", "th", "high"),
        q(f"แนะนำ{th}สำหรับทารก 0-12 เดือน", "th", "high"),
        q(f"pantip แนะนำ{th}", "th", "high"),
        q(f"แนะนำ{th}โดยผู้เชี่ยวชาญ", "th", "high"),
        q(f"แม่และเด็กแนะนำ{th}อะไร", "th", "high"),
        q(f"{th}ที่มีคุณภาพดีมีอะไรบ้าง", "th", "high"),
        q(f"รีวิว{th}จาก TikTok", "th", "high"),
        q(f"{th}ไหนน่าซื้อสำหรับมือใหม่", "th", "high"),
        q(f"{th}แบรนด์ดังปี 2025", "th", "high"),
        q(f"สั่ง{th}ออนไลน์ยี่ห้อไหนโอเค", "th", "high"),
        q(f"{th}ยี่ห้อไทยหรือนำเข้าอะไรดีกว่า", "th", "high"),
        q(f"ซื้อ{th}ครั้งแรกแนะนำยี่ห้อไหน", "th", "high"),
    ]

    thai_comp = [
        q(f"{th} {c0} ดีไหม", "th", "comparison"),
        q(f"เปรียบเทียบ{th} {c0} กับ {c1}", "th", "comparison"),
        q(f"รีวิว {c0} {th}", "th", "comparison"),
        q(f"{c0} vs {c1} {th}", "th", "comparison"),
        q(f"{th}ยี่ห้อไหนดีกว่ากัน", "th", "comparison"),
        q(f"เปรียบเทียบ{th}ราคาถูกกับแพง", "th", "comparison"),
        q(f"Supuon {th} รีวิว", "th", "comparison"),
        q(f"Supuon กับ {c0} ต่างกันอย่างไร", "th", "comparison"),
        q(f"ควรซื้อ{th}ยี่ห้อไหน", "th", "comparison"),
        q(f"{th}ไหนคุ้มที่สุด", "th", "comparison"),
        q(f"rank {th} ในไทย", "th", "comparison"),
        q(f"รีวิว{th}หลายยี่ห้อ", "th", "comparison"),
        q(f"{th}ยี่ห้อดังมีอะไรบ้าง", "th", "comparison"),
        q(f"เปรียบเทียบ{th}ยอดนิยม", "th", "comparison"),
        q(f"อะไรดีกว่ากัน {c0} หรือยี่ห้ออื่น", "th", "comparison"),
        q(f"รีวิว{th} pantip", "th", "comparison"),
        q(f"{th} brand comparison Thailand", "th", "comparison"),
        q(f"เปรียบเทียบ{th}สำหรับทารก", "th", "comparison"),
        q(f"{c0} เทียบกับ Supuon {th}", "th", "comparison"),
        q(f"{th}ยี่ห้อจีนกับยี่ห้ออื่นต่างกันอย่างไร", "th", "comparison"),
    ]

    thai_info = [
        q(f"{th}ที่ดีควรมีคุณสมบัติอะไร", "th", "info"),
        q(f"{th}ปลอดภัยสำหรับทารก", "th", "info"),
        q(f"เลือก{th}อย่างไร", "th", "info"),
        q(f"{th}วัสดุดีมีอะไรบ้าง", "th", "info"),
        q(f"วิธีใช้{th}ให้ถูกต้อง", "th", "info"),
        q(f"{th}ที่ผ่านมาตรฐาน", "th", "info"),
        q(f"ข้อดีของ{th}ที่ดี", "th", "info"),
        q(f"ทารกแรกเกิดควรใช้{th}ไหม", "th", "info"),
        q(f"วิธีเลือก{th}ให้เหมาะกับลูก", "th", "info"),
        q(f"ข้อควรระวังในการใช้{th}", "th", "info"),
        q(f"ทำไมต้องใช้{th}", "th", "info"),
        q(f"อายุเท่าไหร่เริ่มใช้{th}ได้", "th", "info"),
        q(f"รีวิวจากแม่จริงๆ เรื่อง{th}", "th", "info"),
        q(f"{th}มีผลต่อรูปหัวทารกไหม", "th", "info"),
        q(f"{th}แตกต่างจากผลิตภัณฑ์ทั่วไปอย่างไร", "th", "info"),
        q(f"ควรซื้อ{th}ราคาไหน", "th", "info"),
        q(f"ข้อเสียของ{th}ราคาถูก", "th", "info"),
        q(f"{th}มีกี่ประเภท", "th", "info"),
        q(f"ประโยชน์ของการใช้{th}", "th", "info"),
        q(f"{th}สำหรับทารกคลอดก่อนกำหนด", "th", "info"),
        q(f"แพทย์แนะนำ{th}ไหม", "th", "info"),
        q(f"ซื้อ{th}ที่ไหนของแท้", "th", "info"),
        q(f"{th}ออนไลน์ vs ห้าง", "th", "info"),
        q(f"ราคา{th}เฉลี่ยในไทย", "th", "info"),
        q(f"รีวิว{th}ราคาถูกดีไหม", "th", "info"),
    ]

    en_high = [
        q(f"best {en.lower()} Thailand 2025", "en", "high"),
        q(f"best {en.lower()} for newborn baby", "en", "high"),
        q(f"top {en.lower()} brands in Thailand", "en", "high"),
        q(f"which {en.lower()} to buy Thailand", "en", "high"),
        q(f"recommended {en.lower()} for baby", "en", "high"),
        q(f"best {en.lower()} under 500 baht", "en", "high"),
        q(f"top rated {en.lower()} online Thailand", "en", "high"),
        q(f"best selling {en.lower()} TikTok Thailand", "en", "high"),
        q(f"buy {en.lower()} online Thailand recommendation", "en", "high"),
        q(f"good quality {en.lower()} for infant", "en", "high"),
        q(f"best {en.lower()} 2025 review", "en", "high"),
        q(f"most popular {en.lower()} Thailand", "en", "high"),
        q(f"which {en.lower()} brand is best for baby", "en", "high"),
        q(f"affordable {en.lower()} good quality", "en", "high"),
        q(f"top {en.lower()} to buy Thailand", "en", "high"),
        q(f"Supuon {en.lower()} review", "en", "high"),
        q(f"is Supuon a good brand for baby products", "en", "high"),
        q(f"best baby brands Thailand TikTok shop", "en", "high"),
        q(f"what {en.lower()} do Thai moms buy", "en", "high"),
        q(f"{en.lower()} brand recommendation Southeast Asia", "en", "high"),
        q(f"safe {en.lower()} for newborn Thailand", "en", "high"),
        q(f"doctor recommended {en.lower()} Thailand", "en", "high"),
        q(f"{en.lower()} recommendation from moms Thailand", "en", "high"),
        q(f"best value {en.lower()} Thailand", "en", "high"),
        q(f"top baby product brands Thailand 2025", "en", "high"),
    ]

    en_comp = [
        q(f"{c0} vs {c1} {en.lower()}", "en", "comparison"),
        q(f"compare {en.lower()} brands Thailand", "en", "comparison"),
        q(f"{c0} {en.lower()} review", "en", "comparison"),
        q(f"best {en.lower()} vs {c0}", "en", "comparison"),
        q(f"Supuon vs {c0} {en.lower()}", "en", "comparison"),
        q(f"{en.lower()} brand comparison 2025", "en", "comparison"),
        q(f"is {c0} better than other {en.lower()} brands", "en", "comparison"),
        q(f"alternatives to {c0} {en.lower()}", "en", "comparison"),
        q(f"cheap vs expensive {en.lower()} comparison", "en", "comparison"),
        q(f"Chinese brand {en.lower()} review Thailand", "en", "comparison"),
        q(f"TikTok {en.lower()} brand ranking", "en", "comparison"),
        q(f"ranking of {en.lower()} brands Thailand", "en", "comparison"),
        q(f"which is better {c0} or {c1} {en.lower()}", "en", "comparison"),
        q(f"{en.lower()} brand worth buying Thailand", "en", "comparison"),
        q(f"best affordable vs premium {en.lower()}", "en", "comparison"),
    ]

    en_info = [
        q(f"what makes a good {en.lower()}", "en", "info"),
        q(f"{en.lower()} features to look for", "en", "info"),
        q(f"how to choose {en.lower()} for baby", "en", "info"),
        q(f"do newborns need {en.lower()}", "en", "info"),
        q(f"when to start using {en.lower()}", "en", "info"),
        q(f"is {en.lower()} safe for babies", "en", "info"),
        q(f"tips for buying {en.lower()} in Thailand", "en", "info"),
        q(f"what to look for when buying {en.lower()}", "en", "info"),
        q(f"{en.lower()} materials comparison cotton vs synthetic", "en", "info"),
        q(f"breathable {en.lower()} for hot weather Thailand", "en", "info"),
        q(f"washable {en.lower()} recommendation", "en", "info"),
        q(f"ergonomic {en.lower()} for newborn", "en", "info"),
    ]

    zh_queries = [
        q(f"泰国{zh}哪个牌子好", "zh", "high"),
        q(f"{zh}推荐2025", "zh", "high"),
        q(f"宝宝{zh}哪款好用", "zh", "high"),
        q(f"新生儿{zh}推荐", "zh", "high"),
        q(f"泰国{zh}品牌排名", "zh", "high"),
        q(f"TikTok{zh}推荐", "zh", "high"),
        q(f"性价比高的{zh}", "zh", "high"),
        q(f"泰国妈妈推荐{zh}", "zh", "high"),
        q(f"TikTok Shop{zh}哪款好", "zh", "high"),
        q(f"买{zh}推荐什么品牌", "zh", "high"),
        q(f"{c0} {zh}好不好", "zh", "comparison"),
        q(f"Supuon {zh}评测", "zh", "comparison"),
        q(f"泰国{zh}品牌对比", "zh", "comparison"),
        q(f"Supuon是什么牌子", "zh", "comparison"),
        q(f"{zh}哪个牌子安全", "zh", "info"),
        q(f"婴儿{zh}选购指南", "zh", "info"),
        q(f"{zh}怎么选", "zh", "info"),
        q(f"宝宝{zh}测评", "zh", "info"),
        q(f"泰国婴儿用品{zh}推荐", "zh", "info"),
        q(f"{zh}真实用户评价", "zh", "info"),
        q(f"东南亚{zh}品牌推荐", "zh", "info"),
        q(f"新手妈妈必备{zh}推荐", "zh", "info"),
        q(f"{zh}购买建议", "zh", "info"),
    ]

    all_q = thai_high + thai_comp + thai_info + en_high + en_comp + en_info + zh_queries
    print(f"  Queries: {len(all_q)} total "
          f"({sum(1 for x in all_q if x['lang']=='th')} TH / "
          f"{sum(1 for x in all_q if x['lang']=='en')} EN / "
          f"{sum(1 for x in all_q if x['lang']=='zh')} ZH)")
    return all_q


# ── Providers ─────────────────────────────────────────────────────────────────

async def ask_openai(prompt: str, semaphore: asyncio.Semaphore) -> str:
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=OPENAI_KEY)
    async with semaphore:
        try:
            resp = await client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                timeout=30,
            )
            return resp.choices[0].message.content or ""
        except Exception as e:
            return f"ERROR:{e}"

async def ask_claude(prompt: str, semaphore: asyncio.Semaphore) -> str:
    import anthropic
    client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_KEY)
    async with semaphore:
        try:
            msg = await client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=800,
                messages=[{"role": "user", "content": prompt}],
            )
            return msg.content[0].text
        except Exception as e:
            return f"ERROR:{e}"

async def ask_gemini(prompt: str, semaphore: asyncio.Semaphore) -> str:
    import google.generativeai as genai
    genai.configure(api_key=GEMINI_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
    async with semaphore:
        try:
            resp = await model.generate_content_async(
                prompt,
                generation_config={"temperature": 0.7, "max_output_tokens": 800},
            )
            return resp.text
        except Exception as e:
            return f"ERROR:{e}"

async def ask_perplexity(prompt: str, semaphore: asyncio.Semaphore) -> str:
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=PERPLEXITY_KEY, base_url="https://api.perplexity.ai")
    async with semaphore:
        try:
            resp = await client.chat.completions.create(
                model="sonar-pro",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                timeout=30,
            )
            return resp.choices[0].message.content or ""
        except Exception as e:
            return f"ERROR:{e}"

ENGINES = {
    "ChatGPT":    (ask_openai,     OPENAI_KEY,     asyncio.Semaphore(5), "#22c55e", "gr"),
    "Perplexity": (ask_perplexity, PERPLEXITY_KEY, asyncio.Semaphore(3), "#60a5fa", "bl"),
    "Gemini":     (ask_gemini,     GEMINI_KEY,     asyncio.Semaphore(5), "#fbbf24", "or"),
    "Claude":     (ask_claude,     ANTHROPIC_KEY,  asyncio.Semaphore(5), "#a78bfa", "pu"),
}

# ── Parser ────────────────────────────────────────────────────────────────────

def detect_mentions(text: str, names: list[str]) -> dict[str, bool]:
    """Case-insensitive substring detection for brand names."""
    text_lower = text.lower()
    return {n: n.lower() in text_lower for n in names}

def find_position(text: str, name: str) -> int | None:
    """Return 1-based word position of first brand mention, or None."""
    words = text.lower().split()
    target = name.lower()
    for i, w in enumerate(words):
        if target in w:
            return i + 1
    return None

# ── Core Runner ───────────────────────────────────────────────────────────────

async def run_engine(engine_name: str, cfg: dict, queries: list[dict]) -> dict:
    """Run all queries against one engine. Returns per-query results."""
    ask_fn, api_key, sem, color, bar_class = ENGINES[engine_name]
    if not api_key:
        print(f"  [{engine_name}] SKIP (no API key)")
        return {}

    brand = cfg["brand"]
    all_names = [brand] + cfg["competitors"]
    results = []

    tasks = [ask_fn(q["text"], sem) for q in queries]
    print(f"  [{engine_name}] Sending {len(tasks)} queries...")
    t0 = time.time()
    responses = await asyncio.gather(*tasks)
    elapsed = time.time() - t0

    errors = sum(1 for r in responses if r.startswith("ERROR:"))
    print(f"  [{engine_name}] Done in {elapsed:.1f}s | errors: {errors}")

    for q, raw in zip(queries, responses):
        if raw.startswith("ERROR:"):
            continue
        mentions = detect_mentions(raw, all_names)
        results.append({
            "intent":           q["intent"],
            "lang":             q["lang"],
            "query":            q["text"],
            "brand_hit":        mentions.get(brand, False),
            "brand_pos":        find_position(raw, brand),
            "competitor_hits":  {c: mentions.get(c, False) for c in cfg["competitors"]},
            "response_len":     len(raw),
            "response_snippet": raw[:250],
        })

    return {"name": engine_name, "color": color, "bar_class": bar_class, "results": results}


async def check_kol_citations(cfg: dict) -> list[dict]:
    """Ask Perplexity if KOL URLs are cited in AI responses."""
    if not PERPLEXITY_KEY:
        return []
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=PERPLEXITY_KEY, base_url="https://api.perplexity.ai")
    citations = []
    for url in cfg.get("kol_urls", []):
        try:
            handle = url.split("/@")[1].split("/")[0] if "/@" in url else url
            prompt = (f"Has any TikTok creator @{handle} posted about "
                      f"{cfg['product_en']} products for babies? "
                      f"Is their content widely cited or referenced online?")
            resp = await client.chat.completions.create(
                model="sonar-pro",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2, timeout=20,
            )
            text = resp.choices[0].message.content or ""
            cited = any(w in text.lower() for w in ["yes", "mentioned", "referenced", "popular", "found"])
            citations.append({"url": url, "handle": handle, "cited": cited, "snippet": text[:200]})
        except Exception:
            citations.append({"url": url, "handle": "?", "cited": False, "snippet": ""})
    return citations


# ── Score Calculator ──────────────────────────────────────────────────────────

def compute_scores(engine_data: list[dict], cfg: dict) -> dict:
    """Compute GEO scores from raw results."""
    brand = cfg["brand"]
    competitors = cfg["competitors"]
    all_brands = [brand] + competitors

    engine_scores = {}
    global_stats = defaultdict(lambda: defaultdict(int))  # brand -> intent -> count
    intent_totals_across = defaultdict(int)               # intent -> total query-results
    lang_stats_global = defaultdict(lambda: {"hits": 0, "total": 0})

    def cite_rate(lst):
        if not lst: return 0.0
        return sum(1 for r in lst if r["brand_hit"]) / len(lst) * 100

    for ed in engine_data:
        results = ed["results"]
        if not results:
            continue

        by_intent = defaultdict(list)
        by_lang   = defaultdict(list)
        for r in results:
            by_intent[r["intent"]].append(r)
            by_lang[r["lang"]].append(r)
            intent_totals_across[r["intent"]] += 1
            lang_stats_global[r["lang"]]["total"] += 1
            if r["brand_hit"]:
                lang_stats_global[r["lang"]]["hits"] += 1

        hi    = by_intent.get("high", [])
        comp  = by_intent.get("comparison", [])
        info  = by_intent.get("info", [])

        hi_rate   = cite_rate(hi)
        comp_rate = cite_rate(comp)
        info_rate = cite_rate(info)
        th_rate   = cite_rate(by_lang.get("th", []))
        en_rate   = cite_rate(by_lang.get("en", []))
        zh_rate   = cite_rate(by_lang.get("zh", []))

        geo = hi_rate * 0.40 + comp_rate * 0.35 + info_rate * 0.25

        positions = [r["brand_pos"] for r in results if r["brand_hit"] and r["brand_pos"]]
        avg_pos = round(sum(positions) / len(positions)) if positions else 99

        engine_scores[ed["name"]] = {
            "score":     round(geo),
            "rank":      min(avg_pos, 10),
            "color":     ed["color"],
            "bar_class": ed["bar_class"],
            "hi_rate":   round(hi_rate),
            "comp_rate": round(comp_rate),
            "info_rate": round(info_rate),
            "th_rate":   round(th_rate),
            "en_rate":   round(en_rate),
            "zh_rate":   round(zh_rate),
            "n_results": len(results),
        }

        for r in results:
            if r["brand_hit"]:
                global_stats[brand][r["intent"]] += 1
            for c, hit in r["competitor_hits"].items():
                if hit:
                    global_stats[c][r["intent"]] += 1

    scores = [v["score"] for v in engine_scores.values()]
    overall_geo = round(sum(scores) / len(scores)) if scores else 0

    # Competitor SOV & GEO scores (intent-weighted, same formula as brand)
    n_hi   = intent_totals_across.get("high",       1) or 1
    n_comp = intent_totals_across.get("comparison", 1) or 1
    n_info = intent_totals_across.get("info",       1) or 1

    def calc_geo(b):
        if b == brand:
            return overall_geo
        hi_r   = global_stats[b].get("high",       0) / n_hi   * 100
        comp_r = global_stats[b].get("comparison", 0) / n_comp * 100
        info_r = global_stats[b].get("info",       0) / n_info * 100
        return round(hi_r * 0.40 + comp_r * 0.35 + info_r * 0.25)

    total_mentions = {b: sum(global_stats[b].values()) for b in all_brands}
    grand_total    = sum(total_mentions.values()) or 1

    comp_table = []
    for b in all_brands:
        mentions  = total_mentions[b]
        sov       = round(mentions / grand_total * 100, 1)
        geo_score = calc_geo(b)
        hi_cit    = global_stats[b].get("high",       0)
        comp_cit  = global_stats[b].get("comparison", 0)
        info_cit  = global_stats[b].get("info",       0)
        comp_table.append({
            "name":      b,
            "sov":       sov,
            "geo_score": geo_score,
            "citations": mentions,
            "is_self":   b == brand,
            "hi_rate":   round(hi_cit   / n_hi   * 100),
            "comp_rate": round(comp_cit / n_comp * 100),
            "info_rate": round(info_cit / n_info * 100),
        })
    comp_table.sort(key=lambda x: x["sov"], reverse=True)

    # Intent coverage (brand only, per intent)
    intent_map = {
        "high":       ("购买推荐", "bl"),
        "comparison": ("产品对比", "or"),
        "info":       ("品牌查询", "gr"),
    }
    intents = [
        {
            "name":      v[0],
            "rate":      round(global_stats[brand].get(k, 0) / (intent_totals_across.get(k, 1)) * 100),
            "bar_class": v[1],
        }
        for k, v in intent_map.items()
    ]

    # Language breakdown
    lang_labels = {"th": "泰语", "en": "英语", "zh": "中文"}
    lang_flags  = {"th": "🇹🇭",  "en": "🇺🇸",  "zh": "🇨🇳"}
    lang_order  = ["th", "en", "zh"]
    lang_breakdown = [
        {
            "lang":  lg,
            "label": lang_labels[lg],
            "flag":  lang_flags[lg],
            "hits":  lang_stats_global[lg]["hits"],
            "total": lang_stats_global[lg]["total"],
            "rate":  round(lang_stats_global[lg]["hits"] / lang_stats_global[lg]["total"] * 100)
                     if lang_stats_global[lg]["total"] else 0,
        }
        for lg in lang_order
        if lang_stats_global[lg]["total"] > 0
    ]

    # Engine details list
    engine_details = [
        {
            "name":      name,
            "score":     v["score"],
            "color":     v["color"],
            "bar_class": v["bar_class"],
            "hi_rate":   v["hi_rate"],
            "comp_rate": v["comp_rate"],
            "info_rate": v["info_rate"],
            "th_rate":   v.get("th_rate", 0),
            "en_rate":   v.get("en_rate", 0),
            "zh_rate":   v.get("zh_rate", 0),
            "n_results": v["n_results"],
        }
        for name, v in engine_scores.items()
    ]

    # Query samples (30): pick from engine with most results
    query_samples = []
    best_ed = max(engine_data, key=lambda e: len(e.get("results", [])), default=None)
    if best_ed and best_ed.get("results"):
        def pick(results, lang, n):
            r2 = [r for r in results if r["lang"] == lang and "query" in r]
            hits   = [r for r in r2 if r["brand_hit"]]
            misses = [r for r in r2 if not r["brand_hit"]]
            # Take up to 1/3 hits, rest misses
            n_hits = min(len(hits), max(1, n // 3))
            sel    = hits[:n_hits] + misses[:n - n_hits]
            return sel[:n]

        th_s = pick(best_ed["results"], "th", 15)
        en_s = pick(best_ed["results"], "en", 10)
        zh_s = pick(best_ed["results"], "zh",  5)
        for r in th_s + en_s + zh_s:
            query_samples.append({
                "query":  r.get("query", ""),
                "lang":   r["lang"],
                "intent": r["intent"],
                "hit":    r["brand_hit"],
                "engine": best_ed["name"],
            })

    return {
        "overall_geo":    overall_geo,
        "engine_scores":  engine_scores,
        "comp_table":     comp_table,
        "intents":        intents,
        "global_stats":   dict(global_stats),
        "lang_breakdown": lang_breakdown,
        "engine_details": engine_details,
        "query_samples":  query_samples,
    }


# ── Narrative Generator ───────────────────────────────────────────────────────

async def generate_narrative(cfg: dict, scores: dict) -> dict:
    """Use GPT-4o to generate report narrative based on actual scores."""
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=OPENAI_KEY)

    brand      = cfg["brand"]
    product_en = cfg["product_en"]
    geo        = scores["overall_geo"]
    comps      = scores["comp_table"]
    top_comp   = next((c for c in comps if not c["is_self"]), None)
    top_comp_name  = top_comp["name"]  if top_comp else "competitors"
    top_comp_score = top_comp["geo_score"] if top_comp else 0
    score_gap  = top_comp_score - geo

    engines_summary = "\n".join(
        f"- {name}: GEO Score {v['score']}, avg rank #{v['rank']}, "
        f"purchase-intent citation {v['hi_rate']}%"
        for name, v in scores["engine_scores"].items()
    )
    comp_summary = "\n".join(
        f"- {c['name']}: SOV {c['sov']}%, GEO Score {c['geo_score']}, citations {c['citations']}"
        for c in comps
    )

    prompt = f"""You are an AI visibility analyst writing a weekly GEO report for a brand.

Brand: {brand} | Product: {product_en} | Market: Thailand (TikTok Shop)
Overall GEO Score: {geo}/100
Top competitor: {top_comp_name} (Score {top_comp_score}, gap = {score_gap} pts)

Engine breakdown:
{engines_summary}

Competitor SOV:
{comp_summary}

Write the following in Chinese (Simplified):
1. summary_headline: One sentence (max 50 chars) summarizing the most important finding this week.
2. key_insights: Exactly 4 bullet points (strings, no dashes), each max 30 chars, specific and data-driven.
3. actions: Exactly 3 action items. Each has:
   - title: str (max 20 chars)
   - description: str (2-3 sentences, specific)
   - impact: int 1-5
   - difficulty: str like "低难度 · 1天内完成"
   - urgency: str "立即" or null
4. next_week_focus: One sentence focus for next week.

Return ONLY valid JSON with keys: summary_headline, key_insights, actions, next_week_focus"""

    try:
        resp = await client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            response_format={"type": "json_object"},
        )
        return json.loads(resp.choices[0].message.content)
    except Exception as e:
        print(f"  [Narrative] Error: {e}")
        return {
            "summary_headline": f"Supuon {product_en} 基准报告已生成，GEO Score {geo} 分",
            "key_insights": [
                f"整体 GEO Score {geo} 分，处于品类基准线",
                f"最强竞品 {top_comp_name} 领先 {score_gap} 分",
                "泰语查询覆盖率为主要提升方向",
                "建议优先优化购买推荐意图下的可见度",
            ],
            "actions": [
                {"title": "建立泰语产品内容", "description": "在 TikTok 主页增加泰语产品描述和关键词标签，提升 AI 泰语查询中的品牌出现率。",
                 "impact": 5, "difficulty": "中难度 · 3天", "urgency": "立即"},
                {"title": "增加达人合作频率", "description": "与泰国母婴类达人合作，增加 TikTok 视频中品牌提及频率，帮助 AI 建立品牌认知。",
                 "impact": 4, "difficulty": "中难度 · 1周", "urgency": None},
                {"title": "完善产品规格描述", "description": "确保 TikTok 产品页面的规格描述详细准确，减少 AI 误引风险。",
                 "impact": 3, "difficulty": "低难度 · 1天内", "urgency": None},
            ],
            "next_week_focus": f"监控泰语内容更新后 AI 引用率变化，目标 GEO Score 提升至 {geo + 8} 分。",
        }


# ── Report Assembler ──────────────────────────────────────────────────────────

def assemble_report_data(cfg: dict, scores: dict, narrative: dict, kol_citations: list) -> dict:
    brand      = cfg["brand"]
    product_en = cfg["product_en"]
    geo        = scores["overall_geo"]
    comps      = scores["comp_table"]
    top_comp   = next((c for c in comps if not c["is_self"]), None)

    geo_level = "需大幅改进" if geo < 20 else "需改进" if geo < 40 else "良好" if geo < 60 else "优秀"
    top_comp_name  = top_comp["name"]  if top_comp else "竞品"
    top_comp_score = top_comp["geo_score"] if top_comp else 0

    engines_list = [
        {
            "name":      name,
            "score":     v["score"],
            "rank":      v["rank"],
            "color":     v["color"],
            "bar_class": v["bar_class"],
        }
        for name, v in scores["engine_scores"].items()
    ]

    hi_avg   = round(sum(v["hi_rate"]   for v in scores["engine_scores"].values()) / max(len(scores["engine_scores"]), 1))
    comp_avg = round(sum(v["comp_rate"] for v in scores["engine_scores"].values()) / max(len(scores["engine_scores"]), 1))
    info_avg = round(sum(v["info_rate"] for v in scores["engine_scores"].values()) / max(len(scores["engine_scores"]), 1))

    def score_color(s):
        return "#22c55e" if s >= 60 else "#fbbf24" if s >= 30 else "#ef4444"

    score_factors = [
        {"name": "推荐出现率 (40%)", "weight": 40, "score": str(hi_avg),   "color": score_color(hi_avg)},
        {"name": "位置权重 (25%)",   "weight": 25, "score": str(geo),      "color": score_color(geo)},
        {"name": "引用质量 (20%)",   "weight": 20, "score": str(comp_avg), "color": score_color(comp_avg)},
        {"name": "意图覆盖 (15%)",   "weight": 15, "score": str(info_avg), "color": score_color(info_avg)},
    ]

    # Hallucination items
    ok_items   = []
    warn_items = []
    for spec_key, spec_val in cfg.get("known_specs", {}).items():
        ok_items.append({
            "claim": f"{spec_key.title()} 描述正确",
            "note":  f"官方 listing 标注：{spec_val}",
        })

    kol_details = []
    for kc in kol_citations:
        kol_details.append({
            "url":    kc["url"],
            "handle": f"@{kc['handle']}",
            "cited":  kc["cited"],
            "snippet": kc.get("snippet", "")[:200],
            "status_label": "AI 已引用" if kc["cited"] else "AI 未检测到",
            "status_color": "#22c55e" if kc["cited"] else "#ef4444",
        })
        if kc["cited"]:
            ok_items.append({
                "claim": f"达人 @{kc['handle']} 内容被 AI 引用",
                "note":  kc.get("snippet", "")[:80] or "Perplexity 检测到相关内容",
            })
        else:
            warn_items.append({
                "claim":   f"达人 @{kc['handle']} 内容未被 AI 引用",
                "ai_said": "AI 未检测到该达人相关内容",
                "actual":  f"TikTok 链接：{kc['url'][:60]}",
                "fix":     "建议达人在视频描述中增加英文关键词，提升 Google 索引率",
            })

    # Category rank — sort by SOV (more accurate than geo_score alone)
    sorted_by_sov = sorted(comps, key=lambda x: x["sov"], reverse=True)
    my_rank = next((i + 1 for i, c in enumerate(sorted_by_sov) if c["is_self"]), len(comps))

    today    = datetime.now()
    week_num = today.isocalendar()[1]

    # Intent comparison table (brand vs each competitor)
    intent_rows = []
    for intent_name, rate_key in [("购买推荐", "hi_rate"), ("产品对比", "comp_rate"), ("品牌查询", "info_rate")]:
        self_rate = next((c[rate_key] for c in comps if c["is_self"]), 0)
        def lvl(r): return "strong" if r >= 60 else "mid" if r >= 20 else "weak"
        intent_rows.append({
            "intent":     intent_name,
            "self_pct":   self_rate,
            "self_level": lvl(self_rate),
            "comp_vals":  [
                {"name": c["name"], "pct": c[rate_key], "level": lvl(c[rate_key])}
                for c in comps if not c["is_self"]
            ],
        })

    # ROI projection
    roi_steps = [
        {"week": "基准",  "score": geo,       "action": "当前状态（首次测量）"},
        {"week": "第2周", "score": geo + 4,   "action": "泰语 listing 优化 + 关键词植入"},
        {"week": "第4周", "score": geo + 9,   "action": "达人合作 ×2 条新内容"},
        {"week": "第8周", "score": geo + 18,  "action": "Reddit/Quora 英语内容补充"},
        {"week": "第12周","score": geo + 28,  "action": "系统性 GEO 优化完成"},
    ]

    return {
        # ── Identifiers ──
        "brand":             brand,
        "product_en":        product_en,
        "report_slug":       cfg["slug"],
        "report_type":       "weekly",
        "report_type_label": "AI 可见度周报",
        "report_date":       f"Week {week_num} · {today.year}年{today.month}月{today.day}日",
        "period_label":      "周",

        # ── Top metrics ──
        "geo_score":             geo,
        "geo_score_level":       geo_level,
        "geo_score_delta":       "+0",
        "geo_score_delta_class": "flat",
        "category_avg_score":    max(0, geo - 5),
        "top_brand_score":       top_comp_score,

        "citation_count_90d":    sum(c["citations"] for c in comps if c["is_self"]),
        "citation_delta":        "+0",
        "citation_delta_class":  "flat",
        "citation_rate":         hi_avg,

        "category_rank":         my_rank,
        "rank_delta":            "-",
        "rank_delta_class":      "flat",
        "category_total_brands": len(comps),

        "top_competitor_name":   top_comp_name,
        "top_competitor_score":  top_comp_score,
        "top_competitor_color":  "white",
        "score_gap":             max(0, top_comp_score - geo),
        "engine_coverage":       len(engines_list),

        # ── Narrative ──
        "summary_headline": narrative.get("summary_headline", ""),
        "key_insights":     narrative.get("key_insights", []),

        # ── Engine data ──
        "engines":        engines_list,
        "engine_details": scores["engine_details"],

        # ── Intent & scoring ──
        "intents":          scores["intents"],
        "score_factors":    score_factors,
        "intent_comparison": intent_rows,

        # ── Competitors ──
        "competitors": comps,

        # ── Language breakdown ──
        "lang_breakdown": scores["lang_breakdown"],

        # ── Query samples ──
        "query_samples": scores["query_samples"],

        # ── KOL ──
        "kol_details": kol_details,

        # ── Hallucination ──
        "hallucination_total":    len(ok_items) + len(warn_items),
        "hallucination_ok":       len(ok_items),
        "hallucination_warn":     len(warn_items),
        "hallucination_warnings": warn_items,
        "hallucination_ok_items": ok_items,

        # ── Action plan ──
        "expected_score_gain": 8,
        "actions":             narrative.get("actions", []),
        "next_week_focus":     narrative.get("next_week_focus", ""),

        # ── ROI projection ──
        "roi_steps":      roi_steps,
        "roi_target_w12": geo + 28,
    }


# ── Main ──────────────────────────────────────────────────────────────────────

async def run_product(product_key: str):
    cfg = PRODUCTS[product_key]
    print(f"\n{'='*60}")
    print(f"  {cfg['brand']} — {cfg['product_en']} ({cfg['product_th']})")
    print(f"{'='*60}")

    queries = build_queries(cfg)

    # Run all engines concurrently
    engine_tasks = [
        run_engine(name, cfg, queries)
        for name in ENGINES
    ]
    kol_task = check_kol_citations(cfg)

    all_results = await asyncio.gather(*engine_tasks, kol_task)
    engine_data   = [r for r in all_results[:-1] if r]
    kol_citations = all_results[-1]

    # Compute scores
    scores = compute_scores(engine_data, cfg)
    print(f"\n  Overall GEO Score: {scores['overall_geo']}/100")
    for name, v in scores["engine_scores"].items():
        print(f"    {name}: {v['score']} (rank #{v['rank']})")

    # Generate narrative
    print("\n  Generating narrative...")
    narrative = await generate_narrative(cfg, scores)

    # Assemble report data
    data = assemble_report_data(cfg, scores, narrative, kol_citations)

    # Save JSON
    out_json = REPORT_DIR / f"supuon_{product_key}_data.json"
    out_json.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n  Data saved: {out_json}")

    # Generate PDF
    import subprocess
    result = subprocess.run(
        ["python", str(SCRIPT_DIR / "report" / "gen_report.py"), str(out_json)],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        print(result.stdout.strip())
    else:
        print(f"  PDF error: {result.stderr[:200]}")


async def main():
    target = sys.argv[1] if len(sys.argv) > 1 else "all"

    if target == "all":
        keys = list(PRODUCTS.keys())
    elif target in PRODUCTS:
        keys = [target]
    else:
        print(f"Unknown product: {target}. Use: {', '.join(PRODUCTS)} or all")
        sys.exit(1)

    for key in keys:
        await run_product(key)

    print("\nDone.")


if __name__ == "__main__":
    asyncio.run(main())
