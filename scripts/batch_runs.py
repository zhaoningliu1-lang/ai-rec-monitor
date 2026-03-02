#!/usr/bin/env python3
"""
Batch runner for ai-rec-monitor.

Reads a brands JSON file, submits one run per entry, polls until done/failed,
and writes a summary CSV.

Usage:
    python scripts/batch_runs.py
    python scripts/batch_runs.py --json scripts/brands_phase1.json
    python scripts/batch_runs.py --base-url http://localhost:8001 --output scripts/runs_summary.csv
"""
import argparse
import asyncio
import csv
import json
import sys
import time
from pathlib import Path

import httpx

# ── Defaults ──────────────────────────────────────────────────────────────────
DEFAULT_JSON = Path(__file__).parent / "brands_phase1.json"
DEFAULT_OUTPUT = Path(__file__).parent / "runs_summary.csv"
DEFAULT_BASE_URL = "http://localhost:8001"

POLL_INTERVAL = 10   # seconds between status polls
POLL_TIMEOUT = 900   # 15-minute max per run

CSV_FIELDS = [
    "brand_name", "category", "price_band", "providers",
    "run_id", "status", "arrs", "weighted_sov", "high_sov", "report_url",
]


# ── API helpers ───────────────────────────────────────────────────────────────

async def submit_run(client: httpx.AsyncClient, base_url: str, brand: dict) -> str:
    """POST /runs and return run_id string."""
    payload = {
        "brand_name": brand["brand_name"],
        "competitor_names": brand.get("competitor_names", []),
        "category": brand["category"],
        "region": brand.get("region", "US"),
        "num_prompts": brand.get("num_prompts", 60),
        "providers": brand.get("providers", ["openai"]),
        "price_band": brand.get("price_band"),
    }
    resp = await client.post(f"{base_url}/runs", json=payload, timeout=30)
    resp.raise_for_status()
    return resp.json()["id"]


async def poll_run(client: httpx.AsyncClient, base_url: str, run_id: str) -> str:
    """Poll GET /runs/{run_id} until status is 'done' or 'failed'. Returns final status."""
    deadline = time.monotonic() + POLL_TIMEOUT
    while time.monotonic() < deadline:
        resp = await client.get(f"{base_url}/runs/{run_id}", timeout=15)
        resp.raise_for_status()
        data = resp.json()
        status = data["status"]
        done = data.get("progress_done", 0)
        total = data.get("progress_total", 0)
        pct = f"{done}/{total}" if total else "?"
        print(f"    ↻ [{pct}] {status}        ", end="\r", flush=True)
        if status in ("done", "failed"):
            print()  # clear \r line
            return status
        await asyncio.sleep(POLL_INTERVAL)
    print()
    return "timeout"


async def fetch_metrics(client: httpx.AsyncClient, base_url: str, run_id: str) -> dict:
    """Fetch metrics from the JSON endpoint."""
    resp = await client.get(f"{base_url}/runs/{run_id}/metrics", timeout=30)
    if resp.status_code != 200:
        return {"arrs": "", "weighted_sov": "", "high_sov": ""}
    data = resp.json()
    primary = next((b for b in data.get("brand_table", []) if b.get("is_primary")), {})
    return {
        "arrs": data.get("arrs", ""),
        "weighted_sov": primary.get("weighted_sov", ""),
        "high_sov": primary.get("sov_high", ""),
    }


# ── Per-brand orchestration ───────────────────────────────────────────────────

async def process_brand(
    client: httpx.AsyncClient,
    base_url: str,
    brand: dict,
    writer: csv.DictWriter,
    out_file,          # open file handle for immediate flush
    index: int,
    total: int,
) -> None:
    name = brand["brand_name"]
    providers_str = ",".join(brand.get("providers", ["openai"]))
    print(
        f"\n[{index}/{total}] ▶ {name}"
        f" | {brand['category']}"
        f" | {brand.get('price_band', '—')}"
        f" | [{providers_str}]"
    )

    base_row = {
        "brand_name": name,
        "category": brand["category"],
        "price_band": brand.get("price_band", ""),
        "providers": providers_str,
    }

    # ── Submit ────────────────────────────────────────────────────────────────
    try:
        run_id = await submit_run(client, base_url, brand)
        print(f"  → run_id: {run_id}")
    except Exception as exc:
        print(f"  ✗ submit failed: {exc}")
        writer.writerow({
            **base_row,
            "run_id": "", "status": "submit_error",
            "arrs": "", "weighted_sov": "", "high_sov": "", "report_url": "",
        })
        out_file.flush()
        return

    report_url = f"{base_url}/runs/{run_id}/report"

    # ── Poll ──────────────────────────────────────────────────────────────────
    try:
        status = await poll_run(client, base_url, run_id)
        print(f"  → final status: {status}")
    except Exception as exc:
        print(f"  ✗ poll error: {exc}")
        writer.writerow({
            **base_row,
            "run_id": run_id, "status": "poll_error",
            "arrs": "", "weighted_sov": "", "high_sov": "", "report_url": report_url,
        })
        out_file.flush()
        return

    # ── Metrics ───────────────────────────────────────────────────────────────
    metrics: dict = {"arrs": "", "weighted_sov": "", "high_sov": ""}
    if status == "done":
        try:
            metrics = await fetch_metrics(client, base_url, run_id)
            print(
                f"  → arrs={metrics['arrs']}"
                f"  weighted_sov={metrics['weighted_sov']}"
                f"  high_sov={metrics['high_sov']}"
            )
        except Exception as exc:
            print(f"  ⚠ metrics fetch failed: {exc}")

    writer.writerow({
        **base_row,
        "run_id": run_id,
        "status": status,
        **metrics,
        "report_url": report_url,
    })
    out_file.flush()


# ── Main ──────────────────────────────────────────────────────────────────────

async def main(json_path: Path, output_path: Path, base_url: str) -> None:
    # Load brands
    raw = json.loads(json_path.read_text())
    brands: list[dict] = []
    for group_key, group in raw.items():
        brands.extend(group)

    print(f"Loaded {len(brands)} brands from {json_path}")
    print(f"Output → {output_path}")
    print(f"API    → {base_url}")

    async with httpx.AsyncClient() as client:
        # Health-check
        try:
            r = await client.get(f"{base_url}/health", timeout=5)
            r.raise_for_status()
            print("✓ Server healthy\n")
        except Exception as exc:
            print(f"✗ Cannot reach {base_url}: {exc}")
            sys.exit(1)

        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
            writer.writeheader()
            f.flush()

            for i, brand in enumerate(brands, 1):
                try:
                    await process_brand(client, base_url, brand, writer, f, i, len(brands))
                except Exception as exc:
                    print(f"  ✗ unexpected error for {brand.get('brand_name')}: {exc}")

    print(f"\n{'─'*60}")
    print(f"✓ Done. Summary saved to {output_path}")
    print(f"  Run:  python scripts/export_reports.py")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Batch brand runner for ai-rec-monitor")
    parser.add_argument(
        "--json", type=Path, default=DEFAULT_JSON,
        help="Path to brands JSON (default: scripts/brands_phase1.json)",
    )
    parser.add_argument(
        "--output", type=Path, default=DEFAULT_OUTPUT,
        help="Output CSV path (default: scripts/runs_summary.csv)",
    )
    parser.add_argument(
        "--base-url", default=DEFAULT_BASE_URL,
        help="API base URL (default: http://localhost:8001)",
    )
    args = parser.parse_args()
    asyncio.run(main(args.json, args.output, args.base_url))
