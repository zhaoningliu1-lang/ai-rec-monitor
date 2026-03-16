"""Generate rich AI Visibility Plans from run data using Claude Sonnet."""
import asyncio
import json
import logging
import random
import uuid
from datetime import datetime, timezone
from urllib.parse import urlparse

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.config import settings
from app.models import GeoPlan, PromptResult, Run

logger = logging.getLogger(__name__)

_GEO_PLAN_SYSTEM = """\
You are an elite AI Visibility Strategist.
Given a brand's AI visibility data, generate a comprehensive action plan.

You will receive:
- Brand metrics (SOV, ARRS, intent breakdown)
- Source/citation gap analysis (domains where competitors outrank the brand)
- Competitive loss examples (queries where competitors win but brand loses)

Return ONLY a valid JSON object with this exact structure:
{
  "current_geo_score": <int 0-100>,
  "projected_geo_score": <int, current + sum of critical+high action impacts>,
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "actions": [
    {
      "id": "a1",
      "category": "content|reddit|schema|citations|social|reviews|tiktok|market_signals",
      "priority": "critical|high|medium",
      "title": "Short action title",
      "why": "Why this matters for AI citation (reference specific data points)",
      "how": "Concrete step-by-step implementation instructions",
      "impact": "+N AI visibility score",
      "effort": "low|medium|high"
    }
  ]
}

Rules:
1. Generate 6-10 actions. At least 2 critical, 2-3 high, rest medium.
2. Each "why" MUST reference specific data (e.g., "SOV is 23% vs competitor's 45%").
3. Each "how" must be specific enough to execute immediately.
4. Impact scores: critical = +5 to +12, high = +3 to +8, medium = +1 to +4.
5. current_geo_score = round(weighted_sov * 0.7 + (100 - arrs) * 0.3). Adjust for source coverage.
6. Use ALL available categories across the plan (content, reddit, schema, citations, social, reviews, tiktok, market_signals).
7. effort: schema markup = low, content creation = medium, press/outreach = high.
8. Return ONLY valid JSON, no markdown, no explanation.
9. If market_signals data is provided, reference SPECIFIC platform data in your actions:
   - Reddit: cite sentiment score and discussion volume
   - YouTube: reference KOL count and coverage tier
   - TikTok: note product presence/trending status on TikTok Shop
   - Google: cite search demand direction
10. "tiktok" and "market_signals" are valid action categories. Use them when market data warrants.
11. Cross-reference AI visibility with market signals — if Reddit sentiment is high but SOV is low, that's a gap to exploit.
"""


def _classify_domain(domain: str) -> str:
    """Classify a domain into a type category."""
    d = domain.lower()
    if any(k in d for k in ("review", "reviews", "rating", "compare", "wirecutter", "rtings")):
        return "Review"
    if any(k in d for k in ("reddit",)):
        return "Forum"
    if any(k in d for k in ("news", "times", "post", "daily", "verge", "techcrunch")):
        return "News"
    if any(k in d for k in ("blog", "guide", "tips", "how-to", "medium.com")):
        return "Blog"
    if any(k in d for k in ("amazon", "shop", "store", "buy", "walmart", "ebay")):
        return "E-commerce"
    if any(k in d for k in ("youtube",)):
        return "Video"
    return "Media"


async def generate_geo_plan(
    run_id: uuid.UUID,
    session_factory: async_sessionmaker[AsyncSession],
) -> GeoPlan:
    """Generate and store a full AI Visibility Plan for a completed run."""
    from app.routers.reports import _compute_metrics

    # ── Load run data ────────────────────────────────────────────────────────
    async with session_factory() as db:
        run = await db.get(Run, run_id)
        if not run:
            raise ValueError(f"Run {run_id} not found")

        stmt = select(PromptResult).where(PromptResult.run_id == run_id)
        rows = await db.execute(stmt)
        results = list(rows.scalars().all())

    brand_name = run.brand_name
    competitor_names = run.competitor_names or []

    # ── 1. Compute metrics ───────────────────────────────────────────────────
    metrics = _compute_metrics(results, brand_name, competitor_names)

    # ── 2. Compute source gaps ───────────────────────────────────────────────
    domain_stats: dict[str, dict] = {}
    for r in results:
        domains_seen: set[str] = set()
        for url in (r.cited_urls or []):
            try:
                domain = urlparse(url).netloc.lower().lstrip("www.")
            except Exception:
                continue
            if not domain or domain in domains_seen:
                continue
            domains_seen.add(domain)
            if domain not in domain_stats:
                domain_stats[domain] = {
                    "domain": domain,
                    "citation_count": 0,
                    "brand_mentioned": 0,
                    "competitors_mentioned": 0,
                }
            s = domain_stats[domain]
            s["citation_count"] += 1
            if r.brand_mentioned:
                s["brand_mentioned"] += 1
            for comp in competitor_names:
                if (r.competitors_data or {}).get(comp, {}).get("mentioned"):
                    s["competitors_mentioned"] += 1

    opportunities = []
    for d in domain_stats.values():
        if d["competitors_mentioned"] > d["brand_mentioned"]:
            score = round(
                (d["competitors_mentioned"] * d["citation_count"])
                / max(d["brand_mentioned"] + 0.5, 1),
                1,
            )
            opportunities.append({
                "domain": d["domain"],
                "type": _classify_domain(d["domain"]),
                "citations": d["citation_count"],
                "brand": d["brand_mentioned"],
                "competitors": d["competitors_mentioned"],
                "score": score,
            })
    opportunities.sort(key=lambda x: x["score"], reverse=True)

    # ── 3. Sample competitive losses ─────────────────────────────────────────
    competitive_losses = [
        r for r in results
        if not r.brand_mentioned
        and any(
            (r.competitors_data or {}).get(c, {}).get("mentioned")
            for c in competitor_names
        )
    ]
    sample = random.sample(competitive_losses, min(8, len(competitive_losses))) if competitive_losses else []

    # ── 4. Build Claude context ──────────────────────────────────────────────
    primary_row = next((r for r in metrics.get("brand_table", []) if r.get("is_primary")), {})
    comp_rows = [r for r in metrics.get("brand_table", []) if not r.get("is_primary")]

    data_context = {
        "brand": brand_name,
        "category": run.category,
        "region": run.region,
        "competitors": competitor_names,
        "metrics": {
            "weighted_sov": primary_row.get("weighted_sov", 0),
            "sov_high": primary_row.get("sov_high", 0),
            "sov_comparison": primary_row.get("sov_comp", 0),
            "sov_info": primary_row.get("sov_info", 0),
            "arrs": metrics.get("arrs", 0),
            "arrs_band": metrics.get("arrs_band", ""),
            "mention_rate": primary_row.get("mention_rate", 0),
            "sentiment": primary_row.get("sentiment", {}),
        },
        "top_competitors": [
            {
                "name": r["name"],
                "weighted_sov": r.get("weighted_sov", 0),
                "sov_high": r.get("sov_high", 0),
                "mention_rate": r.get("mention_rate", 0),
            }
            for r in sorted(comp_rows, key=lambda x: x.get("weighted_sov", 0), reverse=True)[:5]
        ],
        "source_gaps": opportunities[:8],
        "competitive_losses": {
            "total": len(competitive_losses),
            "samples": [
                {
                    "query": r.prompt_text[:200],
                    "competitors_mentioned": [
                        c for c in competitor_names
                        if (r.competitors_data or {}).get(c, {}).get("mentioned")
                    ],
                    "response_preview": r.raw_response[:250],
                }
                for r in sample
            ],
        },
    }

    # ── 4b. Fetch cross-platform market signals (non-blocking) ──────────────
    try:
        from app.services.market_signals import fetch_market_signals

        signals = await asyncio.wait_for(
            fetch_market_signals(brand_name, run.category or ""),
            timeout=20,
        )
        data_context["market_signals"] = signals.to_dict()
    except Exception as e:
        logger.debug("Market signals fetch failed for GEO plan: %s", e)

    prompt = (
        f"{_GEO_PLAN_SYSTEM}\n\n"
        f"Brand data:\n{json.dumps(data_context, indent=2, ensure_ascii=False)}\n\n"
        f"Generate the AI Visibility Plan JSON."
    )

    # ── 5. Call Claude Sonnet ────────────────────────────────────────────────
    import anthropic

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    message = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}],
    )
    text = message.content[0].text.strip()

    # Strip markdown fences if present
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    plan_data = json.loads(text.strip())

    # ── 6. Store in DB ───────────────────────────────────────────────────────
    geo_plan = GeoPlan(
        run_id=run_id,
        brand_name=brand_name,
        category=run.category,
        current_geo_score=plan_data["current_geo_score"],
        projected_geo_score=plan_data["projected_geo_score"],
        weaknesses=plan_data["weaknesses"],
        actions=plan_data["actions"],
        generated_at=datetime.now(timezone.utc),
        model_used="claude-sonnet-4-20250514",
    )

    async with session_factory() as db:
        db.add(geo_plan)
        await db.commit()
        await db.refresh(geo_plan)

    logger.info("GeoPlan stored for run %s (%d actions)", run_id, len(plan_data["actions"]))
    return geo_plan
