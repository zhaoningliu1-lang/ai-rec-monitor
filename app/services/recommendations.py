"""Generate AI-powered optimization recommendations from run metrics using Claude."""
import json
import logging
import uuid
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.config import settings
from app.models import Recommendation

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = """\
You are an AI search optimization expert specializing in GEO (Generative Engine Optimization).
Given brand visibility metrics from AI recommendation queries, return a JSON array of 3-5
concrete, actionable items a brand can implement within 2 weeks.

Each item must follow this exact JSON structure:
{"title": "short action title", "description": "1-2 sentence explanation of what to do and why", "priority": "high|medium|low"}

Focus on: content gaps vs top competitors, review quantity/quality, structured product data,
comparison query presence, and FAQ/editorial content.

Return ONLY valid JSON array, no markdown, no explanation outside the array.
"""


async def generate_recommendations(
    run_id: uuid.UUID,
    brand_name: str,
    metrics: dict,
    session_factory: async_sessionmaker[AsyncSession],
) -> None:
    """
    Generate and store recommendations for a completed run.
    Called automatically by job_runner after a successful run.
    """
    try:
        from app.services.claude_client import ClaudeProvider
        provider = ClaudeProvider()
    except Exception as exc:
        logger.warning("Cannot generate recommendations — Claude unavailable: %s", exc)
        return

    # Build a compact metrics summary for Claude to reason over
    primary_row = next((r for r in metrics.get("brand_table", []) if r.get("is_primary")), {})
    comp_rows = [r for r in metrics.get("brand_table", []) if not r.get("is_primary")]

    summary = {
        "brand": brand_name,
        "arrs": metrics.get("arrs", 0),
        "arrs_band": metrics.get("arrs_band", ""),
        "arrs_explain": metrics.get("arrs_explain", ""),
        "sov_overall": primary_row.get("sov", 0),
        "sov_high": primary_row.get("sov_high", 0),
        "sov_comparison": primary_row.get("sov_comp", 0),
        "sov_info": primary_row.get("sov_info", 0),
        "weighted_sov": primary_row.get("weighted_sov", 0),
        "top_competitors": [
            {
                "name": r["name"],
                "sov_high": r.get("sov_high", 0),
                "sov_comp": r.get("sov_comp", 0),
                "sov_info": r.get("sov_info", 0),
            }
            for r in sorted(comp_rows, key=lambda x: x.get("weighted_sov", 0), reverse=True)[:3]
        ],
    }

    prompt = (
        f"{_SYSTEM_PROMPT}\n\n"
        f"Brand metrics:\n{json.dumps(summary, indent=2)}\n\n"
        f"Generate 3-5 action items as a JSON array."
    )

    try:
        response = await provider.ask(prompt)
        # Strip markdown code fences if present
        text = response.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        items = json.loads(text.strip())
        if not isinstance(items, list):
            raise ValueError("Expected a JSON array")
    except Exception as exc:
        logger.warning("Failed to parse recommendations for run %s: %s", run_id, exc)
        return

    async with session_factory() as db:
        rec = Recommendation(
            run_id=run_id,
            brand_name=brand_name,
            items=items,
            generated_at=datetime.now(timezone.utc),
            model_used=settings.claude_model,
        )
        db.add(rec)
        await db.commit()
        logger.info("Recommendations stored for run %s (%d items)", run_id, len(items))
