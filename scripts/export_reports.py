#!/usr/bin/env python3
"""
Export HTML reports for all completed runs in runs_summary.csv.

Saves each report to exports/<brand_slug>/<run_id>.html.
Optionally takes Playwright screenshots (PNG) alongside each HTML file.

Usage:
    python scripts/export_reports.py                        # HTML only
    python scripts/export_reports.py --screenshots          # HTML + PNG
    python scripts/export_reports.py --csv scripts/runs_summary.csv --out exports/
    python scripts/export_reports.py --base-url http://localhost:8001
"""
import argparse
import asyncio
import csv
import re
import sys
from pathlib import Path

import httpx

DEFAULT_CSV = Path(__file__).parent / "runs_summary.csv"
DEFAULT_OUT = Path(__file__).parent.parent / "exports"
DEFAULT_BASE_URL = "http://localhost:8001"


def _slug(name: str) -> str:
    """Convert brand name to a filesystem-safe slug."""
    return re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")


async def fetch_html(client: httpx.AsyncClient, report_url: str) -> str:
    resp = await client.get(report_url, timeout=30)
    resp.raise_for_status()
    return resp.text


async def screenshot_page(report_url: str, out_path: Path) -> None:
    """Take a full-page Playwright screenshot. Requires: pip install playwright && playwright install chromium."""
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        print("    ⚠ playwright not installed — skipping screenshot")
        print("      Install with: pip install playwright && playwright install chromium")
        return

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1280, "height": 900})
        await page.goto(report_url, wait_until="networkidle")
        await page.screenshot(path=str(out_path), full_page=True)
        await browser.close()


async def export_run(
    client: httpx.AsyncClient,
    row: dict,
    out_dir: Path,
    base_url: str,
    do_screenshots: bool,
) -> bool:
    """Export a single run. Returns True on success."""
    run_id = row["run_id"].strip()
    brand_name = row["brand_name"].strip()
    status = row["status"].strip()

    if status != "done":
        print(f"  skip  {brand_name} ({status})")
        return False

    if not run_id:
        print(f"  skip  {brand_name} (no run_id)")
        return False

    # Build paths
    brand_dir = out_dir / _slug(brand_name)
    brand_dir.mkdir(parents=True, exist_ok=True)
    html_path = brand_dir / f"{run_id}.html"
    png_path = brand_dir / f"{run_id}.png"

    # Use the stored report_url if valid, else construct from base_url + run_id
    report_url = row.get("report_url", "").strip()
    if not report_url:
        report_url = f"{base_url}/runs/{run_id}/report"

    # Fetch HTML
    try:
        html = await fetch_html(client, report_url)
        html_path.write_text(html, encoding="utf-8")
        print(f"  ✓  {brand_name:30s}  → {html_path.relative_to(out_dir.parent)}")
    except Exception as exc:
        print(f"  ✗  {brand_name}: HTML fetch failed — {exc}")
        return False

    # Optional screenshot
    if do_screenshots:
        try:
            await screenshot_page(report_url, png_path)
            print(f"       screenshot → {png_path.relative_to(out_dir.parent)}")
        except Exception as exc:
            print(f"       ⚠ screenshot failed: {exc}")

    return True


async def main(csv_path: Path, out_dir: Path, base_url: str, do_screenshots: bool) -> None:
    if not csv_path.exists():
        print(f"✗ CSV not found: {csv_path}")
        print("  Run batch_runs.py first to generate it.")
        sys.exit(1)

    rows = []
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    done_rows = [r for r in rows if r.get("status", "").strip() == "done"]
    print(f"Found {len(rows)} rows in CSV, {len(done_rows)} with status=done")
    print(f"Exporting to {out_dir}/\n")

    out_dir.mkdir(parents=True, exist_ok=True)

    async with httpx.AsyncClient() as client:
        # Verify server
        try:
            r = await client.get(f"{base_url}/health", timeout=5)
            r.raise_for_status()
        except Exception as exc:
            print(f"✗ Cannot reach {base_url}: {exc}")
            sys.exit(1)

        success = 0
        for row in rows:
            ok = await export_run(client, row, out_dir, base_url, do_screenshots)
            if ok:
                success += 1

    print(f"\n{'─'*60}")
    print(f"✓ Exported {success}/{len(done_rows)} reports to {out_dir}/")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export HTML reports from runs_summary.csv")
    parser.add_argument(
        "--csv", type=Path, default=DEFAULT_CSV,
        help="Path to runs_summary.csv (default: scripts/runs_summary.csv)",
    )
    parser.add_argument(
        "--out", type=Path, default=DEFAULT_OUT,
        help="Output directory for exports (default: exports/)",
    )
    parser.add_argument(
        "--base-url", default=DEFAULT_BASE_URL,
        help="API base URL (default: http://localhost:8001)",
    )
    parser.add_argument(
        "--screenshots", action="store_true",
        help="Also take Playwright full-page screenshots (requires: pip install playwright && playwright install chromium)",
    )
    args = parser.parse_args()
    asyncio.run(main(args.csv, args.out, args.base_url, args.screenshots))
