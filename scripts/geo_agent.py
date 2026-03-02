#!/usr/bin/env python3
"""
geo_agent.py — Avanti GEO Cold Outreach Automation Agent

Full pipeline from product category → personalized email drafts.
You intervene at exactly 2 checkpoints.

Phases:
  1. [AUTO]        Brand discovery — Claude suggests top brands + competitors
  2. [AUTO]        AI visibility audit — runs 60 prompts per brand, collects ARRS/SOV
  3. [CHECKPOINT]  You confirm/cut target brands (~30 sec)
  4. [AUTO]        Contact finder — Hunter.io domain search for decision-makers
  5. [AUTO]        Email drafting — Claude writes personalized emails with real metrics
  6. [CHECKPOINT]  You review drafts + open .eml files in Mail.app
  7. [AUTO]        Log leads to session BD tracker CSV

Usage:
    python3 scripts/geo_agent.py --category "robot vacuums"
    python3 scripts/geo_agent.py --category "baby monitors" --hunter-key YOUR_KEY
    python3 scripts/geo_agent.py --category "air purifiers" --num-prompts 30 --num-brands 8
    python3 scripts/geo_agent.py --category "robot vacuums" --session scripts/sessions/2026-02-26_robot_vacuums
"""

import argparse
import asyncio
import csv
import json
import os
import subprocess
import sys
import time
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid
from pathlib import Path
from typing import Optional

import httpx
from anthropic import Anthropic

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env")
except ImportError:
    pass

# ── Config ────────────────────────────────────────────────────────────────────

BASE_URL      = "http://localhost:8001"
SESSIONS_DIR  = Path(__file__).parent / "sessions"
FROM_NAME     = "Johnson Liu | Avanti Growth Lab"
FROM_ADDR     = "johnsonliu@hks.harvard.edu"

HUNTER_PRIORITY_TITLES = [
    "chief marketing", "cmo",
    "vp marketing", "vp of marketing",
    "director of marketing", "marketing director",
    "head of marketing",
    "vp ecommerce", "director ecommerce", "head of ecommerce",
    "vp brand", "director brand",
    "growth", "demand generation",
    "founder", "co-founder", "ceo", "chief executive",
    "general manager",
]

# Chinese cross-border brands: add bilingual summary to emails
CHINESE_BRANDS = {"ugreen", "anker", "baseus", "aukey", "xiaomi", "oneplus", "realme",
                  "tozo", "mpow", "ravpower", "choetech", "iniu", "veger", "voltme"}


# ── Terminal helpers ──────────────────────────────────────────────────────────

def banner(title: str) -> None:
    w = 62
    print(f"\n{'═' * w}")
    print(f"  {title}")
    print(f"{'═' * w}")

def step(msg: str) -> None:
    print(f"\n▶  {msg}")

def indent(msg: str) -> None:
    print(f"   {msg}")


# ── Utility ───────────────────────────────────────────────────────────────────

def title_rank(title: str) -> int:
    if not title:
        return 99
    t = title.lower()
    for i, kw in enumerate(HUNTER_PRIORITY_TITLES):
        if kw in t:
            return i
    return 99


def is_chinese_brand(name: str) -> bool:
    return name.lower().strip() in CHINESE_BRANDS


def strip_markdown_json(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0]
    return text.strip()


# ── Phase 1: Brand Discovery ──────────────────────────────────────────────────

async def phase1_discover(
    claude: Anthropic,
    category: str,
    region: str,
    num_brands: int,
    num_prompts: int,
    session_dir: Path,
) -> list[dict]:
    """Ask Claude to suggest top brands + competitors for a category."""
    out = session_dir / "brands.json"
    if out.exists():
        step(f"Phase 1: Resuming — loaded from {out.name}")
        brands = json.loads(out.read_text())
        for b in brands:
            indent(f"• {b['brand_name']} vs {', '.join(b['competitor_names'])}")
        return brands

    step(f"Phase 1: Discovering top {num_brands} brands in \"{category}\" ({region})")

    prompt = f"""You are a market research expert for Amazon/DTC brands.

For the product category "{category}" in region {region}:
1. List the top {num_brands} consumer brands (mix of market leaders and mid-tier challengers)
2. For each brand, name their 2–3 closest direct competitors
3. Suggest a realistic price band (e.g. "under $50" or "$100-$300")

Rules:
- Exclude Apple, Samsung, Sony (decision chains too long for cold outreach)
- Include Chinese cross-border brands if present (Anker, Ugreen, Baseus, etc.) — at least 2-3 if relevant
- Focus on brands with meaningful Amazon/DTC presence
- Mid-tier brands (not #1 in category) are better sales targets than absolute leaders

Respond ONLY with valid JSON — no markdown, no explanation:
{{
  "{category.lower().replace(' ', '_')}": [
    {{
      "brand_name": "BrandName",
      "competitor_names": ["Comp1", "Comp2"],
      "category": "{category}",
      "region": "{region}",
      "num_prompts": {num_prompts},
      "price_band": "under $X",
      "providers": ["openai"]
    }}
  ]
}}"""

    response = claude.messages.create(
        model="claude-opus-4-6",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}],
    )
    raw = strip_markdown_json(response.content[0].text)
    data = json.loads(raw)

    brands: list[dict] = []
    for group in data.values():
        brands.extend(group)

    out.write_text(json.dumps(brands, indent=2, ensure_ascii=False))
    indent(f"✓ {len(brands)} brands → {out.name}")
    for b in brands:
        indent(f"  • {b['brand_name']} vs {', '.join(b['competitor_names'])}")
    return brands


# ── Phase 2: AI Visibility Audit ──────────────────────────────────────────────

async def phase2_audit(
    brands: list[dict],
    base_url: str,
    session_dir: Path,
) -> list[dict]:
    """Submit one run per brand, poll to completion, collect ARRS + SOV metrics."""
    out = session_dir / "runs_summary.csv"
    if out.exists():
        step(f"Phase 2: Resuming — loaded from {out.name}")
        with open(out) as f:
            return list(csv.DictReader(f))

    step(f"Phase 2: AI visibility audit — {len(brands)} brands × {brands[0].get('num_prompts', 60)} prompts")
    eta = len(brands) * 5
    indent(f"ETA: ~{eta} min  (polling every 10s)\n")

    async with httpx.AsyncClient() as http:
        try:
            r = await http.get(f"{base_url}/health", timeout=5)
            r.raise_for_status()
            indent("✓ Backend healthy")
        except Exception as e:
            indent(f"✗ Cannot reach {base_url}: {e}")
            indent("→ Run: docker compose up --build -d")
            sys.exit(1)

        results: list[dict] = []
        for i, brand in enumerate(brands, 1):
            name = brand["brand_name"]
            print(f"\n   [{i}/{len(brands)}] {name}")

            # ── Submit ─────────────────────────────────────────────────────
            payload = {
                "brand_name": brand["brand_name"],
                "competitor_names": brand.get("competitor_names", []),
                "category": brand["category"],
                "region": brand.get("region", "US"),
                "num_prompts": brand.get("num_prompts", 60),
                "providers": brand.get("providers", ["openai"]),
            }
            if brand.get("price_band"):
                payload["price_band"] = brand["price_band"]

            try:
                resp = await http.post(f"{base_url}/runs", json=payload, timeout=30)
                resp.raise_for_status()
                run_id = resp.json()["id"]
                indent(f"run_id: {run_id}")
            except Exception as e:
                indent(f"✗ Submit failed: {e}")
                results.append({"brand_name": name, "run_id": "", "status": "submit_error",
                                 "arrs": "", "weighted_sov": "", "high_sov": "",
                                 "sov_comp": "", "sov_info": "", "mention_rate": "",
                                 "arrs_explain": "", "competitors_json": "[]",
                                 "category": brand.get("category", "")})
                continue

            # ── Poll ───────────────────────────────────────────────────────
            status = "timeout"
            deadline = time.monotonic() + 900
            while time.monotonic() < deadline:
                await asyncio.sleep(10)
                try:
                    r = await http.get(f"{base_url}/runs/{run_id}", timeout=15)
                    data = r.json()
                    s = data["status"]
                    done_n = data.get("progress_done", 0)
                    total_n = data.get("progress_total", 1)
                    print(f"      ↻ {done_n}/{total_n} {s}   ", end="\r", flush=True)
                    if s in ("done", "failed"):
                        status = s
                        print()
                        break
                except Exception:
                    pass

            # ── Metrics ────────────────────────────────────────────────────
            arrs = weighted_sov = high_sov = sov_comp = sov_info = mention_rate = ""
            arrs_explain = ""
            competitors_json = "[]"

            if status == "done":
                try:
                    r = await http.get(f"{base_url}/runs/{run_id}/metrics", timeout=30)
                    m = r.json()
                    arrs = m.get("arrs", "")
                    arrs_explain = m.get("arrs_explain", "")
                    primary = next((b for b in m.get("brand_table", []) if b.get("is_primary")), {})
                    weighted_sov  = primary.get("weighted_sov", "")
                    high_sov      = primary.get("sov_high", "")
                    sov_comp      = primary.get("sov_comp", "")
                    sov_info      = primary.get("sov_info", "")
                    mention_rate  = primary.get("mention_rate", "")
                    competitors   = [b for b in m.get("brand_table", []) if not b.get("is_primary")]
                    competitors_json = json.dumps(competitors)
                    indent(f"arrs={arrs}  wsov={weighted_sov}  high={high_sov}")
                except Exception as e:
                    indent(f"⚠ Metrics fetch failed: {e}")

            results.append({
                "brand_name":     name,
                "category":       brand.get("category", ""),
                "price_band":     brand.get("price_band", ""),
                "run_id":         run_id,
                "status":         status,
                "arrs":           arrs,
                "weighted_sov":   weighted_sov,
                "high_sov":       high_sov,
                "sov_comp":       sov_comp,
                "sov_info":       sov_info,
                "mention_rate":   mention_rate,
                "arrs_explain":   arrs_explain,
                "competitors_json": competitors_json,
            })

    fields = ["brand_name", "category", "price_band", "run_id", "status",
              "arrs", "weighted_sov", "high_sov", "sov_comp", "sov_info",
              "mention_rate", "arrs_explain", "competitors_json"]
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(results)

    indent(f"✓ Audit complete → {out.name}")
    return results


# ── Checkpoint 1: Select Targets ──────────────────────────────────────────────

def checkpoint1_select(results: list[dict]) -> list[dict]:
    banner("CHECKPOINT 1 — Select Target Brands")
    print("  ARRS > 60 = high priority  |  30–60 = medium  |  < 30 = low/defensive\n")

    done = [r for r in results if r.get("status") == "done" and r.get("arrs")]
    done.sort(key=lambda r: float(r.get("arrs") or 0), reverse=True)

    if not done:
        print("  No completed runs. Check that the backend is running and retry.")
        sys.exit(1)

    print(f"  {'#':<3} {'Brand':<22} {'ARRS':>6} {'W-SOV':>8} {'H-SOV':>8}  Tier")
    print(f"  {'─'*3} {'─'*22} {'─'*6} {'─'*8} {'─'*8}  {'─'*12}")
    for i, r in enumerate(done, 1):
        arrs = float(r.get("arrs") or 0)
        wsov = float(r.get("weighted_sov") or 0)
        hsov = float(r.get("high_sov") or 0)
        tier = "HIGH   🔴" if arrs > 60 else "MEDIUM 🟡" if arrs > 30 else "LOW    🟢"
        print(f"  {i:<3} {r['brand_name']:<22} {arrs:>6.1f} {wsov:>7.1f}% {hsov:>7.1f}%  {tier}")

    print(f"\n  Enter numbers to target (e.g. 1,2,4)  |  'all' = all HIGH+MEDIUM  |  'high' = only HIGH")
    choice = input("  > ").strip().lower()

    if choice == "all":
        selected = [r for r in done if float(r.get("arrs") or 0) > 30]
    elif choice == "high":
        selected = [r for r in done if float(r.get("arrs") or 0) > 60]
    else:
        try:
            indices = [int(x.strip()) - 1 for x in choice.split(",")]
            selected = [done[i] for i in indices if 0 <= i < len(done)]
        except (ValueError, IndexError):
            print("  Invalid — selecting all HIGH+MEDIUM by default")
            selected = [r for r in done if float(r.get("arrs") or 0) > 30]

    if not selected:
        print("  No targets selected. Exiting.")
        sys.exit(0)

    print(f"\n  ✓ Targeting: {', '.join(r['brand_name'] for r in selected)}")
    return selected


# ── Phase 3: Contact Finder ───────────────────────────────────────────────────

def phase3_contacts(
    targets: list[dict],
    hunter_key: Optional[str],
    session_dir: Path,
) -> list[dict]:
    out = session_dir / "contacts.csv"
    if out.exists():
        step(f"Phase 3: Resuming — loaded from {out.name}")
        with open(out) as f:
            return list(csv.DictReader(f))

    if not hunter_key:
        step("Phase 3: Skipped — no Hunter.io key (--hunter-key or HUNTER_API_KEY)")
        indent("Add contacts manually to session/contacts.csv and re-run with --session")
        return []

    step(f"Phase 3: Finding contacts for {len(targets)} brands via Hunter.io")

    contacts: list[dict] = []
    for r in targets:
        name = r["brand_name"]
        domain = name.lower().replace(" ", "").replace("-", "") + ".com"
        print(f"   Searching {domain}...", end=" ", flush=True)
        try:
            resp = httpx.get(
                "https://api.hunter.io/v2/domain-search",
                params={"domain": domain, "api_key": hunter_key, "limit": 10, "type": "personal"},
                timeout=15,
            )
            resp.raise_for_status()
            data = resp.json()
            emails = data.get("data", {}).get("emails", [])
            if not emails:
                print("none found")
                contacts.append({"brand": name, "name": "—", "title": "—",
                                  "email": "—", "linkedin": "", "confidence": "", "rank": 99})
            else:
                print(f"{len(emails)} found")
                for c in emails:
                    full_name = f"{c.get('first_name', '')} {c.get('last_name', '')}".strip()
                    contacts.append({
                        "brand":      name,
                        "name":       full_name,
                        "title":      c.get("position", ""),
                        "email":      c.get("value", ""),
                        "linkedin":   c.get("linkedin", ""),
                        "confidence": c.get("confidence", ""),
                        "rank":       title_rank(c.get("position", "")),
                    })
        except Exception as e:
            print(f"✗ {e}")
        time.sleep(0.6)

    contacts.sort(key=lambda c: (c["brand"], int(c.get("rank") or 99)))

    fields = ["brand", "name", "title", "email", "linkedin", "confidence", "rank"]
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        w.writeheader()
        w.writerows(contacts)

    indent(f"✓ Contacts saved → {out.name}")
    print()
    seen: set = set()
    for c in contacts:
        if c["brand"] not in seen and c.get("email") not in ("—", "", None):
            seen.add(c["brand"])
            indent(f"{c['brand']:20s}  {c['name']:22s}  {c.get('title',''):30s}  {c.get('email','')}")
    return contacts


# ── Phase 4: Email Generation ─────────────────────────────────────────────────

def phase4_emails(
    claude: Anthropic,
    targets: list[dict],
    contacts: list[dict],
    session_dir: Path,
) -> list[dict]:
    out = session_dir / "email_drafts.json"
    if out.exists():
        step(f"Phase 4: Resuming — loaded from {out.name}")
        return json.loads(out.read_text())

    step(f"Phase 4: Generating personalized email drafts for {len(targets)} brands")

    # Top contact per brand
    top: dict[str, dict] = {}
    for c in sorted(contacts, key=lambda x: int(x.get("rank") or 99)):
        b = c["brand"]
        if b not in top and c.get("email") not in ("—", "", None):
            top[b] = c

    drafts: list[dict] = []
    for r in targets:
        brand = r["brand_name"]
        contact = top.get(brand, {})
        to_email = contact.get("email", "")
        contact_first = (contact.get("name") or "").split()[0] if contact.get("name") else ""
        contact_title = contact.get("title", "")

        try:
            comps = json.loads(r.get("competitors_json") or "[]")
        except Exception:
            comps = []
        top_comp = sorted(comps, key=lambda x: float(x.get("weighted_sov") or 0), reverse=True)
        comp_name = top_comp[0]["name"] if top_comp else "the category leader"
        comp_wsov = float(top_comp[0].get("weighted_sov") or 0) if top_comp else 0

        arrs      = float(r.get("arrs") or 0)
        wsov      = float(r.get("weighted_sov") or 0)
        high_sov  = float(r.get("high_sov") or 0)
        sov_comp  = float(r.get("sov_comp") or 0)
        explain   = r.get("arrs_explain", "")

        bilingual_note = ""
        if is_chinese_brand(brand):
            bilingual_note = (
                "\n10. Add a bilingual section: full English email first, then '---' separator, "
                "then 3–4 sentence Chinese summary (professional tone, no marketing clichés)."
            )

        print(f"   Drafting: {brand}...", end=" ", flush=True)

        prompt = f"""You write cold outreach emails for Avanti Growth Lab — a firm that helps brands improve AI recommendation visibility (GEO: Generative Engine Optimization).

Brand: {brand}
Category: {r.get('category', '')}
Contact: {contact_first or 'Hi'} ({contact_title or 'team'})

REAL METRICS (use these exact numbers — do NOT invent data):
- Brand weighted SOV: {wsov:.1f}%
- High-intent query SOV: {high_sov:.1f}%
- Comparison-query SOV: {sov_comp:.1f}%
- Top competitor: {comp_name} — weighted SOV: {comp_wsov:.1f}%
- Analyst note: {explain}

RULES:
1. 100–140 words max (body only)
2. Open with what you analyzed (1 sentence)
3. ONE concrete number hook: e.g. "{brand} appeared in {wsov:.0f}% of comparison queries vs {comp_name}'s {comp_wsov:.0f}%"
4. Why it matters: AI recs ≠ SEO, different mechanism (1–2 sentences)
5. Offer: "one-page breakdown + two-week action list" (1 sentence)
6. Soft CTA only: "Should I send it over?"
7. Sign off: Johnson Liu / Avanti Growth Lab
8. No links, no attachments, no guarantees, no ARRS acronym, no internal scoring terms
9. Short sentences. Conversational, not corporate.{bilingual_note}

Subject line: specific to this brand's gap — not generic.

Return ONLY valid JSON, no markdown fences:
{{"subject": "...", "body": "..."}}"""

        try:
            response = claude.messages.create(
                model="claude-opus-4-6",
                max_tokens=900,
                messages=[{"role": "user", "content": prompt}],
            )
            raw = strip_markdown_json(response.content[0].text)
            draft = json.loads(raw)
            draft.update({"brand": brand, "to": to_email,
                          "contact_name": contact_first, "run_id": r.get("run_id", ""),
                          "arrs": arrs})
            drafts.append(draft)
            print("✓")
        except Exception as e:
            print(f"✗ {e}")
            drafts.append({
                "brand": brand, "to": to_email, "contact_name": contact_first,
                "subject": f"AI recommendation visibility — {brand}",
                "body": f"Hi {contact_first or 'team'},\n\n[Draft failed: {e}]\n\nJohnson Liu\nAvanti Growth Lab",
                "run_id": r.get("run_id", ""), "arrs": arrs,
            })

    out.write_text(json.dumps(drafts, indent=2, ensure_ascii=False))
    indent(f"✓ {len(drafts)} drafts saved → {out.name}")
    return drafts


# ── Checkpoint 2: Review & Send ───────────────────────────────────────────────

def checkpoint2_send(drafts: list[dict], session_dir: Path) -> None:
    banner("CHECKPOINT 2 — Review Emails")

    eml_dir = session_dir / "outreach"
    eml_dir.mkdir(exist_ok=True)

    for i, d in enumerate(drafts, 1):
        print(f"\n{'─' * 62}")
        print(f"  [{i}] {d['brand']}  →  {d.get('to') or '(no email found)'}")
        print(f"  Subject: {d['subject']}")
        print(f"{'─' * 62}")
        print(d["body"])

    print(f"\n{'═' * 62}")
    print("  Enter numbers to open as .eml in Mail.app (e.g. 1,3)")
    print("  'all' = open all  |  'skip' = exit without sending")
    choice = input("  > ").strip().lower()

    if choice == "skip":
        indent("Skipped. .eml files not written.")
        return

    if choice == "all":
        selected = list(range(len(drafts)))
    else:
        try:
            selected = [int(x.strip()) - 1 for x in choice.split(",")
                        if 0 <= int(x.strip()) - 1 < len(drafts)]
        except ValueError:
            indent("Invalid input, skipping.")
            return

    for idx in selected:
        d = drafts[idx]
        if not d.get("to"):
            indent(f"⚠ {d['brand']}: no email address — skipping")
            continue
        msg = MIMEMultipart("alternative")
        msg["From"] = f"{FROM_NAME} <{FROM_ADDR}>"
        msg["To"] = d["to"]
        msg["Subject"] = d["subject"]
        msg["Date"] = formatdate(localtime=True)
        msg["Message-ID"] = make_msgid()
        msg.attach(MIMEText(d["body"], "plain", "utf-8"))

        slug = d["brand"].lower().replace(" ", "_")
        path = eml_dir / f"{slug}.eml"
        path.write_bytes(msg.as_bytes())
        subprocess.run(["open", str(path)], check=False)
        indent(f"✓ {d['brand']} — opened in Mail.app")

    print(f"\n  Review in Mail.app, then click Send for each.")


# ── Phase 5: Log to BD Tracker ────────────────────────────────────────────────

def phase5_tracker(
    targets: list[dict],
    contacts: list[dict],
    session_dir: Path,
) -> None:
    out = session_dir / "session_tracker.csv"

    top: dict[str, dict] = {}
    for c in sorted(contacts, key=lambda x: int(x.get("rank") or 99)):
        b = c["brand"]
        if b not in top and c.get("email") not in ("—", "", None):
            top[b] = c

    today = datetime.now().strftime("%Y-%m-%d")
    rows = []
    for r in targets:
        brand = r["brand_name"]
        contact = top.get(brand, {})
        arrs = float(r.get("arrs") or 0)
        tier = "HIGH" if arrs > 60 else "MEDIUM" if arrs > 30 else "LOW"
        rows.append({
            "contact_name":    contact.get("name", ""),
            "company":         brand,
            "channel":         "email",
            "status":          "eml_ready",
            "last_contact_date": today,
            "next_action":     "Send 3-day follow-up after initial email",
            "next_action_date": "",
            "priority":        tier,
            "suggested_role":  contact.get("title", ""),
            "arrs_score":      f"{arrs:.0f}",
            "notes":           (r.get("arrs_explain") or "")[:120],
            "reply_received":  "no",
        })

    fields = ["contact_name", "company", "channel", "status", "last_contact_date",
              "next_action", "next_action_date", "priority", "suggested_role",
              "arrs_score", "notes", "reply_received"]
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)

    step(f"Phase 5: BD tracker saved → {out.name}")
    indent(f"{len(rows)} leads logged.")


# ── Main ──────────────────────────────────────────────────────────────────────

async def main() -> None:
    parser = argparse.ArgumentParser(
        description="Avanti GEO Cold Outreach Agent",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 scripts/geo_agent.py --category "robot vacuums"
  python3 scripts/geo_agent.py --category "baby monitors" --hunter-key YOURKEY --num-brands 8
  python3 scripts/geo_agent.py --category "air purifiers" --num-prompts 30
  python3 scripts/geo_agent.py --session scripts/sessions/2026-02-26_air_purifiers   (resume)
""",
    )
    parser.add_argument("--category",     required=True, help="Product category (e.g. 'robot vacuums')")
    parser.add_argument("--region",       default="US", choices=["US", "UK", "DE"])
    parser.add_argument("--num-brands",   type=int, default=10, help="Brands to discover (default: 10)")
    parser.add_argument("--num-prompts",  type=int, default=60, help="AI prompts per brand (default: 60)")
    parser.add_argument("--hunter-key",   default=os.getenv("HUNTER_API_KEY"), help="Hunter.io API key")
    parser.add_argument("--base-url",     default=BASE_URL, help=f"Backend URL (default: {BASE_URL})")
    parser.add_argument("--no-discovery", action="store_true",
                        help="Skip Phase 1 — use existing brands.json in session dir")
    parser.add_argument("--session",      help="Resume a previous session directory")
    args = parser.parse_args()

    # ── Session directory ──────────────────────────────────────────────────────
    if args.session:
        session_dir = Path(args.session)
    else:
        slug = args.category.lower().replace(" ", "_").replace("/", "_")
        ts   = datetime.now().strftime("%Y-%m-%d")
        session_dir = SESSIONS_DIR / f"{ts}_{slug}"
    session_dir.mkdir(parents=True, exist_ok=True)

    banner(f"Avanti GEO Agent  —  {args.category}  ({args.region})")
    indent(f"Session : {session_dir}")
    indent(f"Brands  : {args.num_brands}   Prompts/brand: {args.num_prompts}   Region: {args.region}")

    # ── Anthropic client ───────────────────────────────────────────────────────
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        indent("✗ ANTHROPIC_API_KEY not found in .env")
        sys.exit(1)
    claude = Anthropic(api_key=api_key)

    # ── Phase 1 ────────────────────────────────────────────────────────────────
    if args.no_discovery:
        brands_file = session_dir / "brands.json"
        if not brands_file.exists():
            indent(f"✗ --no-discovery set but {brands_file} not found")
            sys.exit(1)
        brands = json.loads(brands_file.read_text())
        step(f"Phase 1: Skipped — {len(brands)} brands from {brands_file.name}")
    else:
        brands = await phase1_discover(
            claude, args.category, args.region,
            args.num_brands, args.num_prompts, session_dir,
        )

    # ── Phase 2 ────────────────────────────────────────────────────────────────
    results = await phase2_audit(brands, args.base_url, session_dir)

    # ── Checkpoint 1 ──────────────────────────────────────────────────────────
    targets = checkpoint1_select(results)
    (session_dir / "targets.json").write_text(
        json.dumps(targets, indent=2, ensure_ascii=False)
    )

    # ── Phase 3 ────────────────────────────────────────────────────────────────
    contacts = phase3_contacts(targets, args.hunter_key, session_dir)

    # ── Phase 4 ────────────────────────────────────────────────────────────────
    drafts = phase4_emails(claude, targets, contacts, session_dir)

    # ── Checkpoint 2 ──────────────────────────────────────────────────────────
    checkpoint2_send(drafts, session_dir)

    # ── Phase 5 ────────────────────────────────────────────────────────────────
    phase5_tracker(targets, contacts, session_dir)

    banner("✓  GEO Agent Complete")
    indent(f"Session: {session_dir}/")
    indent("Files:  brands.json → runs_summary.csv → contacts.csv → email_drafts.json → session_tracker.csv")
    print()


if __name__ == "__main__":
    asyncio.run(main())
