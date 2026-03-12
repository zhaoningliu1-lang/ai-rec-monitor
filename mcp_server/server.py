"""
Avanti GEO — MCP Server
Connects Claude Code to the ai-rec-monitor PostgreSQL database.
Exposes read-only tools for querying GEO metrics, runs, SOV data, and brand analysis.
"""

import json
import os
import sys
from datetime import datetime
from typing import Any

import psycopg2
import psycopg2.extras
from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

# Load .env from project root (one level up from mcp_server/)
# Note: load_dotenv won't overwrite env vars already set by MCP client
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(PROJECT_ROOT, ".env"))

# Build psycopg2-compatible connection string
RAW_URL = os.environ.get("MCP_DATABASE_URL") or os.environ.get("DATABASE_URL", "")
DB_URL = RAW_URL.replace("postgresql+asyncpg://", "postgresql://")

# Remap Docker internal hostname to localhost for host-side access
if "@db:" in DB_URL:
    import re
    DB_URL = re.sub(r"@db:\d+/", "@localhost:5433/", DB_URL)


def get_conn():
    """Get a new psycopg2 connection."""
    return psycopg2.connect(DB_URL, cursor_factory=psycopg2.extras.RealDictCursor)


def _serialize(rows: list[dict]) -> list[dict]:
    """JSON-safe serialization of query results."""
    out = []
    for row in rows:
        clean = {}
        for k, v in row.items():
            if isinstance(v, datetime):
                clean[k] = v.isoformat()
            elif isinstance(v, (dict, list)):
                clean[k] = v
            else:
                clean[k] = v
        out.append(clean)
    return out


def query(sql: str, params: tuple = ()) -> list[dict]:
    """Execute a read-only query and return results as list of dicts."""
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            return _serialize([dict(r) for r in cur.fetchall()])
    finally:
        conn.close()


# ---------------------------------------------------------------------------
# MCP Server
# ---------------------------------------------------------------------------

mcp = FastMCP("avanti-geo")


@mcp.tool()
def list_brands(limit: int = 50) -> str:
    """List all brands that have been monitored, with run counts and latest run date.
    Returns brand_name, run_count, latest_run, latest_status."""
    rows = query(
        """
        SELECT brand_name,
               COUNT(*) AS run_count,
               MAX(created_at) AS latest_run,
               (SELECT status FROM runs r2 WHERE r2.brand_name = r.brand_name ORDER BY created_at DESC LIMIT 1) AS latest_status
        FROM runs r
        GROUP BY brand_name
        ORDER BY MAX(created_at) DESC
        LIMIT %s
        """,
        (limit,),
    )
    return json.dumps(rows, ensure_ascii=False, indent=2)


@mcp.tool()
def get_runs(
    brand: str | None = None,
    category: str | None = None,
    region: str | None = None,
    status: str | None = None,
    limit: int = 20,
) -> str:
    """Get monitoring runs, optionally filtered by brand/category/region/status.
    Returns id, brand_name, category, region, status, num_prompts, created_at, run_code."""
    conditions = []
    params: list[Any] = []
    if brand:
        conditions.append("LOWER(brand_name) LIKE LOWER(%s)")
        params.append(f"%{brand}%")
    if category:
        conditions.append("LOWER(category) LIKE LOWER(%s)")
        params.append(f"%{category}%")
    if region:
        conditions.append("region = %s")
        params.append(region)
    if status:
        conditions.append("status = %s")
        params.append(status)

    where = "WHERE " + " AND ".join(conditions) if conditions else ""
    params.append(limit)

    rows = query(
        f"""
        SELECT id, brand_name, category, region, status, num_prompts,
               providers, price_band, run_code,
               created_at, started_at, finished_at,
               progress_total, progress_done, error_message
        FROM runs
        {where}
        ORDER BY created_at DESC
        LIMIT %s
        """,
        tuple(params),
    )
    return json.dumps(rows, ensure_ascii=False, indent=2)


@mcp.tool()
def get_run_detail(run_id: str) -> str:
    """Get full detail for a single run including snapshot metrics and recommendation.
    Provide the UUID of the run."""
    # Run basic info
    run_rows = query("SELECT * FROM runs WHERE id = %s", (run_id,))
    if not run_rows:
        return json.dumps({"error": f"Run {run_id} not found"})

    run = run_rows[0]

    # Snapshot metrics
    snap = query("SELECT * FROM run_snapshots WHERE run_id = %s", (run_id,))
    run["snapshot"] = snap[0] if snap else None

    # Recommendation
    rec = query("SELECT * FROM recommendations WHERE run_id = %s", (run_id,))
    run["recommendation"] = rec[0] if rec else None

    # Summary stats from prompt_results
    stats = query(
        """
        SELECT COUNT(*) AS total_prompts,
               SUM(CASE WHEN brand_mentioned THEN 1 ELSE 0 END) AS brand_mentions,
               ROUND(AVG(CASE WHEN brand_mentioned THEN 1.0 ELSE 0.0 END) * 100, 1) AS mention_rate_pct,
               COUNT(DISTINCT provider) AS providers_used
        FROM prompt_results
        WHERE run_id = %s
        """,
        (run_id,),
    )
    run["prompt_stats"] = stats[0] if stats else None

    return json.dumps(run, ensure_ascii=False, indent=2, default=str)


@mcp.tool()
def get_sov_metrics(run_id: str) -> str:
    """Get Share-of-Voice (SOV) breakdown for a run.
    Returns overall SOV, high-intent SOV, comparison SOV, informational SOV, weighted SOV, and ARRS."""
    rows = query(
        """
        SELECT rs.*, r.brand_name, r.category, r.region, r.created_at AS run_date
        FROM run_snapshots rs
        JOIN runs r ON r.id = rs.run_id
        WHERE rs.run_id = %s
        """,
        (run_id,),
    )
    if not rows:
        return json.dumps({"error": f"No snapshot found for run {run_id}"})
    return json.dumps(rows[0], ensure_ascii=False, indent=2, default=str)


@mcp.tool()
def get_brand_trend(brand: str, limit: int = 10) -> str:
    """Get SOV trend over time for a brand (across multiple runs).
    Useful for tracking GEO improvement over weeks."""
    rows = query(
        """
        SELECT r.id AS run_id, r.brand_name, r.created_at, r.run_code,
               rs.sov_overall, rs.sov_high, rs.sov_comparison, rs.sov_info,
               rs.weighted_sov, rs.arrs, rs.mention_count, rs.total_prompts
        FROM runs r
        JOIN run_snapshots rs ON rs.run_id = r.id
        WHERE LOWER(r.brand_name) LIKE LOWER(%s)
          AND r.status = 'done'
        ORDER BY r.created_at DESC
        LIMIT %s
        """,
        (f"%{brand}%", limit),
    )
    return json.dumps(rows, ensure_ascii=False, indent=2, default=str)


@mcp.tool()
def get_prompt_results(
    run_id: str,
    brand_mentioned_only: bool = False,
    intent_type: str | None = None,
    provider: str | None = None,
    limit: int = 50,
) -> str:
    """Get individual prompt results for a run.
    Each result contains the prompt text, AI response, brand mention status, sentiment, and cited URLs.
    Use brand_mentioned_only=True to see only prompts where the brand was mentioned."""
    conditions = ["run_id = %s"]
    params: list[Any] = [run_id]

    if brand_mentioned_only:
        conditions.append("brand_mentioned = TRUE")
    if intent_type:
        conditions.append("intent_type = %s")
        params.append(intent_type)
    if provider:
        conditions.append("provider = %s")
        params.append(provider)

    params.append(limit)
    where = " AND ".join(conditions)

    rows = query(
        f"""
        SELECT id, prompt_text, brand_mentioned, brand_mention_position,
               brand_sentiment, competitors_data, intent_type, provider,
               cited_urls, error,
               LEFT(raw_response, 500) AS response_preview,
               processed_at
        FROM prompt_results
        WHERE {where}
        ORDER BY processed_at DESC
        LIMIT %s
        """,
        tuple(params),
    )
    return json.dumps(rows, ensure_ascii=False, indent=2, default=str)


@mcp.tool()
def get_competitor_comparison(run_id: str) -> str:
    """Get competitor mention comparison for a specific run.
    Shows how often each competitor was mentioned vs. the target brand."""
    # Get brand info
    run_rows = query("SELECT brand_name, competitor_names FROM runs WHERE id = %s", (run_id,))
    if not run_rows:
        return json.dumps({"error": f"Run {run_id} not found"})

    brand = run_rows[0]["brand_name"]
    competitors = run_rows[0].get("competitor_names", [])

    # Brand mention stats
    brand_stats = query(
        """
        SELECT COUNT(*) AS total,
               SUM(CASE WHEN brand_mentioned THEN 1 ELSE 0 END) AS mentions,
               ROUND(AVG(CASE WHEN brand_mentioned THEN 1.0 ELSE 0.0 END) * 100, 1) AS mention_rate
        FROM prompt_results WHERE run_id = %s
        """,
        (run_id,),
    )

    result = {
        "brand": brand,
        "brand_stats": brand_stats[0] if brand_stats else {},
        "competitors": competitors,
        "competitor_stats": [],
    }

    # Parse competitor data from prompt_results
    comp_rows = query(
        "SELECT competitors_data FROM prompt_results WHERE run_id = %s AND competitors_data != '{}'",
        (run_id,),
    )

    comp_mentions: dict[str, int] = {}
    total = len(comp_rows) if comp_rows else 0
    for row in comp_rows:
        data = row.get("competitors_data", {})
        if isinstance(data, str):
            data = json.loads(data)
        for comp_name, comp_info in data.items():
            if comp_info.get("mentioned"):
                comp_mentions[comp_name] = comp_mentions.get(comp_name, 0) + 1

    for comp_name, count in sorted(comp_mentions.items(), key=lambda x: -x[1]):
        result["competitor_stats"].append({
            "name": comp_name,
            "mentions": count,
            "mention_rate": round(count / total * 100, 1) if total > 0 else 0,
        })

    return json.dumps(result, ensure_ascii=False, indent=2, default=str)


@mcp.tool()
def get_category_leaderboard(category: str, limit: int = 10) -> str:
    """Get brand leaderboard for a category based on latest run SOV.
    Shows which brands dominate AI recommendations in this category."""
    rows = query(
        """
        SELECT DISTINCT ON (r.brand_name)
               r.brand_name, r.region, r.created_at,
               rs.sov_overall, rs.weighted_sov, rs.arrs,
               rs.mention_count, rs.total_prompts
        FROM runs r
        JOIN run_snapshots rs ON rs.run_id = r.id
        WHERE LOWER(r.category) LIKE LOWER(%s)
          AND r.status = 'done'
        ORDER BY r.brand_name, r.created_at DESC
        """,
        (f"%{category}%",),
    )
    # Sort by weighted_sov descending
    rows.sort(key=lambda x: x.get("weighted_sov", 0) or 0, reverse=True)
    return json.dumps(rows[:limit], ensure_ascii=False, indent=2, default=str)


@mcp.tool()
def get_recommendations(run_id: str) -> str:
    """Get AI-generated GEO optimization recommendations for a run."""
    rows = query(
        """
        SELECT rec.*, r.brand_name, r.category, r.region
        FROM recommendations rec
        JOIN runs r ON r.id = rec.run_id
        WHERE rec.run_id = %s
        """,
        (run_id,),
    )
    if not rows:
        return json.dumps({"error": f"No recommendations for run {run_id}"})
    return json.dumps(rows[0], ensure_ascii=False, indent=2, default=str)


@mcp.tool()
def get_scheduled_runs(enabled_only: bool = True) -> str:
    """List scheduled (recurring) monitoring runs.
    Shows brand, schedule, last/next run time."""
    condition = "WHERE enabled = TRUE" if enabled_only else ""
    rows = query(
        f"""
        SELECT id, brand_name, category, region, competitor_names,
               providers, cron_expr, num_prompts, enabled,
               last_run_at, next_run_at, created_at
        FROM scheduled_runs
        {condition}
        ORDER BY next_run_at ASC
        """
    )
    return json.dumps(rows, ensure_ascii=False, indent=2, default=str)


@mcp.tool()
def query_sql(sql: str) -> str:
    """Execute a read-only SQL query against the Avanti database.
    Only SELECT statements are allowed. Use this for custom analyses
    that aren't covered by other tools.

    IMPORTANT: Only use SELECT queries. INSERT/UPDATE/DELETE will be rejected."""
    stripped = sql.strip().upper()
    if not stripped.startswith("SELECT") and not stripped.startswith("WITH"):
        return json.dumps({"error": "Only SELECT/WITH queries allowed for safety."})
    if any(kw in stripped for kw in ["INSERT ", "UPDATE ", "DELETE ", "DROP ", "ALTER ", "TRUNCATE ", "CREATE "]):
        return json.dumps({"error": "Write operations are not allowed."})

    try:
        rows = query(sql)
        return json.dumps({"row_count": len(rows), "rows": rows}, ensure_ascii=False, indent=2, default=str)
    except Exception as e:
        return json.dumps({"error": str(e)})


# ---------------------------------------------------------------------------
# Resources (context for Claude)
# ---------------------------------------------------------------------------

@mcp.resource("avanti://schema")
def get_schema() -> str:
    """Database schema reference for the Avanti GEO monitoring platform."""
    return """
# Avanti GEO Database Schema

## runs — Primary monitoring runs
- id (UUID PK), brand_name, competitor_names (JSON[]), category, region
- num_prompts, status (queued|running|done|failed), providers (JSON[])
- price_band, name_aliases (JSON{}), run_code
- created_at, started_at, finished_at, progress_total, progress_done, error_message

## prompt_results — Individual AI responses per prompt
- id (UUID PK), run_id (FK→runs), prompt_text, raw_response
- brand_mentioned (bool), brand_mention_position (int), brand_sentiment (pos/neu/neg)
- competitors_data (JSON{name: {mentioned, position}}), cited_urls (JSON[])
- provider, intent_type (high_intent|comparison|informational), processed_at

## run_snapshots — Aggregated metrics per run
- run_id (FK→runs, unique), brand_name
- sov_overall, sov_high, sov_comparison, sov_info, weighted_sov (all FLOAT %)
- arrs (FLOAT 0-100, AI Replacement Risk Score)
- mention_count, total_prompts, snapshot_at

## recommendations — AI-generated action items
- run_id (FK→runs, unique), brand_name
- items (JSON[{title, description, priority}])
- generated_at, model_used

## scheduled_runs — Recurring cron-based runs
- brand_name, competitor_names, category, region, providers
- cron_expr, num_prompts, enabled, last_run_at, next_run_at

## agent_cycles — Autonomous growth engine runs
- brand_name, category, region, competitor_names, providers, language
- status (pending|monitoring|analyzing|strategizing|experimenting|completed|failed)
- monitor_output, analyst_output, strategist_output, experiment_output (all JSON)

## users — Auth & subscription
- email, hashed_password, full_name, company_name
- stripe_customer_id, subscription_tier (free|growth|scale|enterprise)
- subscription_status (active|trialing|past_due|canceled|none)

## prompt_library — User prompt templates
- category, region, prompt_text, intent_type (high|comparison|info)
- status (active|inactive|suggested), source (user|ai_suggested), usage_count
"""


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    mcp.run(transport="stdio")
