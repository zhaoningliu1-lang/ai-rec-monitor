#!/usr/bin/env python3
"""
Apollo.io contact lookup for missing/incomplete contacts.

Two modes:
1. Enrich by email → get LinkedIn URL (for Echo/Erica/Jenny)
2. Company search → find new contacts (for Nekteck/Lion Energy)
"""
import json
import os
import time
from pathlib import Path

import httpx
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")
API_KEY = os.environ["APOLLO_API_KEY"]
BASE = "https://api.apollo.io/v1"
HEADERS = {"Content-Type": "application/json", "Cache-Control": "no-cache"}


def enrich_by_email(email: str) -> dict:
    """Look up a person by email → returns name, title, linkedin_url."""
    resp = httpx.post(
        f"{BASE}/people/match",
        headers=HEADERS,
        json={"api_key": API_KEY, "email": email, "reveal_personal_emails": False},
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json().get("person") or {}


def search_company(company_name: str, titles: list[str], limit: int = 5) -> list[dict]:
    """Search Apollo for people at a company by title keywords."""
    resp = httpx.post(
        f"{BASE}/mixed_people/search",
        headers=HEADERS,
        json={
            "api_key": API_KEY,
            "q_organization_name": company_name,
            "person_titles": titles,
            "per_page": limit,
        },
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json().get("people") or []


def fmt(person: dict) -> str:
    name     = f"{person.get('first_name','')} {person.get('last_name','')}".strip()
    title    = person.get("title") or person.get("headline") or "—"
    email    = person.get("email") or "—"
    linkedin = person.get("linkedin_url") or "—"
    return f"  {name or '—':25s}  {title:40s}  {email:35s}  {linkedin}"


# ── 1. Enrich existing contacts by email (get LinkedIn) ──────────────────────

ENRICH_TARGETS = [
    ("Echo Deng",  "Renogy",  "echo.deng@renogy.com"),
    ("Erica You",  "Ugreen",  "erica.you@ugreen.com"),
    ("Jenny Huang","Jackery", "jenny@jackery.com"),
    ("Shaun Stirland","Lion Energy","shaun@lionenergy.com"),
]

print("\n── Enriching existing contacts by email ─────────────────────────────")
print(f"  {'Name':25s}  {'Title':40s}  {'Email':35s}  LinkedIn")
print("  " + "─"*140)

for name, brand, email in ENRICH_TARGETS:
    try:
        p = enrich_by_email(email)
        if p:
            print(f"[{brand}] {fmt(p)}")
        else:
            print(f"[{brand}] No match for {email}")
    except Exception as e:
        print(f"[{brand}] Error: {e}")
    time.sleep(0.5)

# ── 2. Search Nekteck for marketing contacts ──────────────────────────────────

print("\n── Nekteck — searching for marketing/ops contacts ───────────────────")
NEKTECK_TITLES = ["marketing", "growth", "ecommerce", "brand", "director", "manager", "ceo", "founder"]
try:
    people = search_company("Nekteck", NEKTECK_TITLES, limit=8)
    if people:
        print(f"  {'Name':25s}  {'Title':40s}  {'Email':35s}  LinkedIn")
        print("  " + "─"*140)
        for p in people:
            print(f"  {fmt(p)}")
    else:
        print("  No results found for Nekteck.")
except Exception as e:
    print(f"  Error: {e}")

# ── 3. Also search Lion Energy for broader team ───────────────────────────────

print("\n── Lion Energy — broader team search ────────────────────────────────")
LION_TITLES = ["marketing", "growth", "brand", "vp", "director", "cmo"]
try:
    people = search_company("Lion Energy", LION_TITLES, limit=5)
    if people:
        print(f"  {'Name':25s}  {'Title':40s}  {'Email':35s}  LinkedIn")
        print("  " + "─"*140)
        for p in people:
            print(f"  {fmt(p)}")
    else:
        print("  No results found for Lion Energy.")
except Exception as e:
    print(f"  Error: {e}")

print()
