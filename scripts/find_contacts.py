#!/usr/bin/env python3
"""
Find brand contacts via Hunter.io domain search API.

Usage:
    python3 scripts/find_contacts.py --key YOUR_HUNTER_API_KEY
    python3 scripts/find_contacts.py --key YOUR_HUNTER_API_KEY --limit 5

Free tier: 25 searches/month — enough for all 8 target brands.
Get your API key at: https://hunter.io/api-keys
"""
import argparse
import csv
import json
import time
from pathlib import Path

import httpx

# ── Target brands ──────────────────────────────────────────────────────────────
TARGETS = [
    {"brand": "Spigen",      "domain": "spigen.com",       "category": "USB-C chargers"},
    {"brand": "Ugreen",      "domain": "ugreen.com",       "category": "USB-C chargers"},
    {"brand": "Nekteck",     "domain": "nekteck.com",      "category": "USB-C chargers"},
    {"brand": "Renogy",      "domain": "renogy.com",       "category": "portable power stations"},
    {"brand": "Lion Energy", "domain": "lionenergy.com",   "category": "portable power stations"},
    # replaced: Bluetti / Westinghouse / Rockpals (no contacts found)
    {"brand": "EcoFlow",     "domain": "ecoflow.com",      "category": "portable power stations"},
    {"brand": "Jackery",     "domain": "jackery.com",      "category": "portable power stations"},
    {"brand": "Goal Zero",   "domain": "goalzero.com",     "category": "portable power stations"},
]

# Job titles to prioritize (case-insensitive substring match)
PRIORITY_TITLES = [
    "chief marketing",
    "vp marketing", "vp of marketing",
    "director of marketing", "marketing director",
    "head of marketing",
    "vp ecommerce", "director ecommerce", "head of ecommerce",
    "vp brand", "director brand", "brand director",
    "growth", "demand generation",
    "founder", "co-founder", "ceo", "chief executive",
    "general manager", "gm",
]

OUTPUT_CSV = Path(__file__).parent / "contacts.csv"
CSV_FIELDS = [
    "brand", "category", "domain",
    "name", "title", "email", "confidence",
    "linkedin", "priority",
]


def title_priority(title: str) -> int:
    """Return priority rank (lower = higher priority). 99 = no match."""
    if not title:
        return 99
    t = title.lower()
    for i, kw in enumerate(PRIORITY_TITLES):
        if kw in t:
            return i
    return 99


def search_domain(api_key: str, domain: str, limit: int = 10) -> list[dict]:
    """Call Hunter.io domain search and return list of contacts."""
    url = "https://api.hunter.io/v2/domain-search"
    params = {
        "domain": domain,
        "api_key": api_key,
        "limit": limit,
        "type": "personal",  # personal emails only, not generic info@
    }
    resp = httpx.get(url, params=params, timeout=15)
    resp.raise_for_status()
    data = resp.json()

    if data.get("errors"):
        raise ValueError(data["errors"])

    emails = data.get("data", {}).get("emails", [])
    return emails


def main(api_key: str, limit: int) -> None:
    print(f"Hunter.io contact finder — {len(TARGETS)} brands\n")

    rows: list[dict] = []

    for t in TARGETS:
        brand = t["brand"]
        domain = t["domain"]
        print(f"  Searching {domain}...", end=" ", flush=True)

        try:
            contacts = search_domain(api_key, domain, limit=limit)
        except Exception as exc:
            print(f"✗ {exc}")
            rows.append({
                "brand": brand, "category": t["category"], "domain": domain,
                "name": "", "title": "ERROR", "email": str(exc),
                "confidence": "", "linkedin": "", "priority": 99,
            })
            time.sleep(1)
            continue

        if not contacts:
            print("no contacts found")
            rows.append({
                "brand": brand, "category": t["category"], "domain": domain,
                "name": "—", "title": "—", "email": "—",
                "confidence": "", "linkedin": "", "priority": 99,
            })
        else:
            print(f"{len(contacts)} found")
            for c in contacts:
                first = c.get("first_name") or ""
                last = c.get("last_name") or ""
                name = f"{first} {last}".strip()
                title = c.get("position") or ""
                email = c.get("value") or ""
                confidence = c.get("confidence") or ""
                linkedin = c.get("linkedin") or ""
                rows.append({
                    "brand": brand,
                    "category": t["category"],
                    "domain": domain,
                    "name": name,
                    "title": title,
                    "email": email,
                    "confidence": confidence,
                    "linkedin": linkedin,
                    "priority": title_priority(title),
                })

        time.sleep(0.6)  # be polite to the API

    # Sort: by brand, then by priority rank
    rows.sort(key=lambda r: (r["brand"], r["priority"]))

    # Write CSV
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\n✓ Saved to {OUTPUT_CSV}")

    # Print top pick per brand
    print("\n── Top contact per brand ─────────────────────────────────────────")
    seen = set()
    for r in rows:
        if r["brand"] not in seen and r["email"] not in ("—", ""):
            seen.add(r["brand"])
            print(
                f"  {(r['brand'] or ''):15s}  {(r['name'] or ''):25s}  {(r['title'] or ''):35s}  {r['email'] or ''}"
            )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Find brand contacts via Hunter.io")
    parser.add_argument("--key", required=True, help="Hunter.io API key")
    parser.add_argument("--limit", type=int, default=10,
                        help="Max contacts to fetch per domain (default: 10)")
    args = parser.parse_args()
    main(args.key, args.limit)
