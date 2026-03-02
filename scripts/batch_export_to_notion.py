"""
Batch-export all completed runs to Notion.
Usage:
    python3 scripts/batch_export_to_notion.py
"""
import json
import subprocess
import urllib.error
import urllib.request

API_BASE = "http://localhost:8001"
COMPOSE_DIR = "/Users/johnsonliu/Desktop/claude code/ai-rec-monitor"

# ── 1. Get all done run IDs from the DB ──────────────────────────────────────
print("Querying database for completed runs…")
result = subprocess.run(
    [
        "docker", "compose", "exec", "-T", "db",
        "psql", "-U", "postgres", "-d", "ai_rec_monitor",
        "-t", "-A", "-c",
        "SELECT id, brand_name FROM runs WHERE status = 'done' ORDER BY created_at DESC;",
    ],
    capture_output=True,
    text=True,
    cwd=COMPOSE_DIR,
)

if result.returncode != 0:
    print("DB query failed:", result.stderr)
    exit(1)

rows = [line.strip() for line in result.stdout.strip().splitlines() if "|" in line]
if not rows:
    print("No completed runs found.")
    exit(0)

print(f"Found {len(rows)} completed run(s).\n")

# ── 2. Export each run ────────────────────────────────────────────────────────
ok = 0
fail = 0
for row in rows:
    run_id, brand = row.split("|", 1)
    run_id = run_id.strip()
    brand = brand.strip()
    print(f"  {brand:<20} {run_id}  … ", end="", flush=True)

    req = urllib.request.Request(
        f"{API_BASE}/runs/{run_id}/export/notion",
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
            url = data.get("page_url", "")
            print(f"✓  {url}")
            ok += 1
    except urllib.error.HTTPError as exc:
        try:
            detail = json.loads(exc.read()).get("detail", str(exc))
        except Exception:
            detail = str(exc)
        print(f"✗  {detail}")
        fail += 1
    except Exception as exc:
        print(f"✗  {exc}")
        fail += 1

print(f"\nDone — {ok} exported, {fail} failed.")
