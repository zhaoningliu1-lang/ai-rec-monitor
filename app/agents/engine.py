"""Avanti Growth Agent Engine — 4-agent autonomous loop.

Pipeline: Monitor → Analyst → Strategist → Experiment
Built on LangGraph for agent orchestration.
"""

import asyncio
import json
import logging
import uuid
from datetime import datetime, timezone
from typing import TypedDict

from langgraph.graph import END, StateGraph
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.database import async_session_factory
from app.models import (
    AgentCycle,
    CycleStatus,
    PromptResult,
    Run,
    RunSnapshot,
    RunStatus,
)
from app.services.providers import get_provider

logger = logging.getLogger(__name__)


# ── State schema ───────────────────────────────────────────────────────────────

class GrowthState(TypedDict):
    cycle_id: str
    brand_name: str
    category: str
    region: str
    competitors: list[str]
    providers: list[str]
    monitor_output: dict
    analyst_output: dict
    strategist_output: dict
    experiment_output: dict


# ── Helpers ────────────────────────────────────────────────────────────────────

async def _update_cycle(cycle_id: str, **kwargs):
    """Update AgentCycle fields in the database."""
    async with async_session_factory() as db:
        cycle = await db.get(AgentCycle, uuid.UUID(cycle_id))
        if cycle:
            for k, v in kwargs.items():
                setattr(cycle, k, v)
            await db.commit()


async def _ask_claude(prompt: str) -> str:
    """Query Claude for agent reasoning."""
    from app.services.claude_client import ClaudeProvider
    provider = ClaudeProvider()
    return await provider.ask(prompt)


# ── Node: Monitor ──────────────────────────────────────────────────────────────

async def monitor_node(state: GrowthState) -> dict:
    """Analyze recent monitoring data and detect signals."""
    cycle_id = state["cycle_id"]
    brand = state["brand_name"]

    await _update_cycle(cycle_id, status=CycleStatus.monitoring)

    async with async_session_factory() as db:
        result = await db.execute(
            select(RunSnapshot)
            .where(RunSnapshot.brand_name == brand)
            .order_by(desc(RunSnapshot.snapshot_at))
            .limit(10)
        )
        snapshots = result.scalars().all()

    signals = []
    baseline = {}
    trend = []

    if not snapshots:
        signals.append({
            "type": "no_data",
            "severity": "info",
            "message": f"No historical data for {brand}. Running initial assessment.",
        })
    else:
        latest = snapshots[0]
        baseline = {
            "sov_overall": latest.sov_overall,
            "sov_high": latest.sov_high,
            "sov_comparison": latest.sov_comparison,
            "sov_info": latest.sov_info,
            "weighted_sov": latest.weighted_sov,
            "arrs": latest.arrs,
            "mention_count": latest.mention_count,
            "total_prompts": latest.total_prompts,
            "snapshot_at": latest.snapshot_at.isoformat(),
        }
        trend = [
            {
                "sov_overall": s.sov_overall,
                "weighted_sov": s.weighted_sov,
                "arrs": s.arrs,
                "snapshot_at": s.snapshot_at.isoformat(),
            }
            for s in snapshots
        ]

        if latest.weighted_sov < 20:
            signals.append({
                "type": "low_sov",
                "severity": "high",
                "message": f"Weighted SOV critically low at {latest.weighted_sov:.1f}%",
            })

        if latest.arrs >= 60:
            signals.append({
                "type": "high_risk",
                "severity": "high",
                "message": f"ARRS {latest.arrs:.0f}/100 — high competitive displacement risk",
            })
        elif latest.arrs >= 30:
            signals.append({
                "type": "moderate_risk",
                "severity": "medium",
                "message": f"ARRS {latest.arrs:.0f}/100 — moderate competitive pressure",
            })

        if latest.sov_high < latest.sov_info:
            signals.append({
                "type": "intent_gap",
                "severity": "medium",
                "message": (
                    f"High-intent SOV ({latest.sov_high:.1f}%) < informational "
                    f"({latest.sov_info:.1f}%) — losing at purchase moment"
                ),
            })

        if len(snapshots) >= 2:
            prev = snapshots[1]
            delta = latest.weighted_sov - prev.weighted_sov
            if delta < -5:
                signals.append({
                    "type": "sov_decline",
                    "severity": "high",
                    "message": f"SOV dropped {abs(delta):.1f}pp since last check",
                })
            elif delta > 5:
                signals.append({
                    "type": "sov_growth",
                    "severity": "info",
                    "message": f"SOV improved +{delta:.1f}pp — positive momentum",
                })

    if not signals:
        signals.append({
            "type": "stable",
            "severity": "info",
            "message": f"Performance stable. SOV: {baseline.get('weighted_sov', 0):.1f}%",
        })

    output = {
        "signals": signals,
        "baseline_metrics": baseline,
        "trend": trend,
        "snapshots_analyzed": len(snapshots),
    }
    await _update_cycle(cycle_id, monitor_output=output)
    return {"monitor_output": output}


# ── Node: Analyst ──────────────────────────────────────────────────────────────

async def analyst_node(state: GrowthState) -> dict:
    """Analyze root causes using AI reasoning."""
    cycle_id = state["cycle_id"]
    monitor = state["monitor_output"]

    await _update_cycle(cycle_id, status=CycleStatus.analyzing)

    prompt = f"""You are an AI Search Optimization Analyst for GEO (Generative Engine Optimization).

Brand: {state["brand_name"]}
Category: {state["category"]}
Region: {state["region"]}
Competitors: {", ".join(state["competitors"])}

Monitoring Signals:
{json.dumps(monitor["signals"], indent=2)}

Baseline Metrics:
{json.dumps(monitor.get("baseline_metrics", {}), indent=2)}

Trend (newest first):
{json.dumps(monitor.get("trend", [])[:5], indent=2)}

Analyze the brand's AI visibility. Return ONLY valid JSON:
{{"root_causes": ["cause1", "cause2"], "threats": ["threat1"], "opportunities": ["opp1", "opp2"], "executive_summary": "2-3 sentence summary"}}"""

    try:
        response = await _ask_claude(prompt)
        text = response.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        output = json.loads(text.strip())
    except Exception as exc:
        logger.warning("Analyst node failed: %s", exc)
        output = {
            "root_causes": ["Analysis unavailable"],
            "threats": [],
            "opportunities": [],
            "executive_summary": f"Analysis error: {exc}",
        }

    await _update_cycle(cycle_id, analyst_output=output)
    return {"analyst_output": output}


# ── Node: Strategist ──────────────────────────────────────────────────────────

async def strategist_node(state: GrowthState) -> dict:
    """Generate GEO optimization experiment hypotheses."""
    cycle_id = state["cycle_id"]
    analyst = state["analyst_output"]
    monitor = state["monitor_output"]

    await _update_cycle(cycle_id, status=CycleStatus.strategizing)

    prompt = f"""You are a GEO Strategist designing experiments to improve brand visibility in AI engines (ChatGPT, Claude, Gemini).

Brand: {state["brand_name"]}
Category: {state["category"]}
Competitors: {", ".join(state["competitors"])}
Metrics: {json.dumps(monitor.get("baseline_metrics", {}), indent=2)}

Analysis:
- Root Causes: {json.dumps(analyst.get("root_causes", []))}
- Threats: {json.dumps(analyst.get("threats", []))}
- Opportunities: {json.dumps(analyst.get("opportunities", []))}
- Summary: {analyst.get("executive_summary", "")}

Design 3 GEO optimization experiments. Return ONLY a valid JSON array:
[
  {{
    "id": 1,
    "hypothesis": "If we do X, AI will recommend us more because Y",
    "action": "Specific steps for this week",
    "expected_sov_lift": "+X%",
    "priority": "high",
    "timeframe": "X days",
    "metrics_to_track": ["metric1", "metric2"]
  }}
]"""

    try:
        response = await _ask_claude(prompt)
        text = response.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        experiments = json.loads(text.strip())
        if not isinstance(experiments, list):
            experiments = [experiments]
    except Exception as exc:
        logger.warning("Strategist node failed: %s", exc)
        experiments = [{
            "id": 1,
            "hypothesis": "Strategy generation failed",
            "action": str(exc),
            "expected_sov_lift": "N/A",
            "priority": "high",
            "timeframe": "N/A",
            "metrics_to_track": [],
        }]

    output = {"experiments": experiments, "selected_experiment": 0}
    await _update_cycle(cycle_id, strategist_output=output)
    return {"strategist_output": output}


# ── Node: Experiment ───────────────────────────────────────────────────────────

async def experiment_node(state: GrowthState) -> dict:
    """Run quick validation queries and compare with baseline."""
    cycle_id = state["cycle_id"]
    brand = state["brand_name"]
    category = state["category"]
    competitors = state["competitors"]
    monitor = state["monitor_output"]
    strategist = state["strategist_output"]

    await _update_cycle(cycle_id, status=CycleStatus.experimenting)

    test_prompts = [
        f"What is the best {category} brand to buy?",
        f"Compare {brand} vs {competitors[0] if competitors else 'others'} for {category}",
        f"I want to buy a {category}, which brand do you recommend?",
        f"What are the top {category} brands in 2026?",
        f"Should I buy {brand} {category} or are there better options?",
    ]

    provider_name = state["providers"][0] if state["providers"] else "openai"
    results = []

    try:
        provider = get_provider(provider_name)
        from app.services.parser import parse_response

        for prompt_text in test_prompts:
            try:
                response = await provider.ask(prompt_text)
                parsed = parse_response(response, brand, competitors)
                results.append({
                    "prompt": prompt_text,
                    "brand_mentioned": parsed["brand_mentioned"],
                    "brand_position": parsed["brand_mention_position"],
                    "brand_sentiment": parsed["brand_sentiment"],
                    "competitors_mentioned": {
                        c: parsed["competitors_data"].get(c, {}).get("mentioned", False)
                        for c in competitors
                    },
                    "response_preview": response[:300] + "..." if len(response) > 300 else response,
                })
            except Exception as exc:
                results.append({
                    "prompt": prompt_text,
                    "error": str(exc),
                    "brand_mentioned": False,
                })
    except Exception as exc:
        logger.error("Experiment provider init failed: %s", exc)

    total = len(results)
    mentioned = sum(1 for r in results if r.get("brand_mentioned"))
    fresh_sov = (mentioned / total * 100) if total else 0
    baseline_sov = monitor.get("baseline_metrics", {}).get("weighted_sov", 0)
    sov_delta = fresh_sov - baseline_sov

    experiment_plan = strategist.get("experiments", [{}])[0]

    try:
        conclusion_prompt = f"""You are an AI Growth Agent evaluating experiment results.

Brand: {brand}, Category: {category}
Baseline Weighted SOV: {baseline_sov:.1f}%
Fresh Experiment SOV: {fresh_sov:.1f}% ({mentioned}/{total} mentions)
Delta: {sov_delta:+.1f}pp

Test Results:
{json.dumps(results, indent=2)}

Top Strategy:
{json.dumps(experiment_plan, indent=2)}

Return ONLY valid JSON:
{{"conclusion": "2-3 sentences", "hypothesis_validated": true, "confidence": "high|medium|low", "next_actions": ["action1", "action2", "action3"], "key_insight": "one sentence"}}"""

        response = await _ask_claude(conclusion_prompt)
        text = response.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        conclusions = json.loads(text.strip())
    except Exception as exc:
        conclusions = {
            "conclusion": f"Fresh SOV: {fresh_sov:.1f}% vs baseline {baseline_sov:.1f}%",
            "hypothesis_validated": None,
            "confidence": "low",
            "next_actions": ["Re-run with more prompts", "Implement strategy", "Monitor weekly"],
            "key_insight": f"Brand mentioned in {mentioned}/{total} queries",
        }

    output = {
        "test_results": results,
        "fresh_sov": fresh_sov,
        "baseline_sov": baseline_sov,
        "sov_delta": sov_delta,
        "total_queries": total,
        "brand_mentions": mentioned,
        "conclusions": conclusions,
    }

    await _update_cycle(
        cycle_id,
        experiment_output=output,
        status=CycleStatus.completed,
        completed_at=datetime.now(timezone.utc),
    )
    return {"experiment_output": output}


# ── Build Graph ────────────────────────────────────────────────────────────────

def build_growth_graph():
    """Construct the LangGraph growth agent pipeline."""
    graph = StateGraph(GrowthState)
    graph.add_node("monitor", monitor_node)
    graph.add_node("analyst", analyst_node)
    graph.add_node("strategist", strategist_node)
    graph.add_node("experiment", experiment_node)

    graph.set_entry_point("monitor")
    graph.add_edge("monitor", "analyst")
    graph.add_edge("analyst", "strategist")
    graph.add_edge("strategist", "experiment")
    graph.add_edge("experiment", END)

    return graph.compile()


# Lazy-init to avoid import-time failures when langgraph isn't installed
_graph = None


def _get_graph():
    global _graph
    if _graph is None:
        _graph = build_growth_graph()
    return _graph


async def run_growth_cycle(
    cycle_id: str,
    brand_name: str,
    category: str,
    region: str,
    competitors: list[str],
    providers: list[str],
) -> None:
    """Execute a complete growth agent cycle."""
    initial_state: GrowthState = {
        "cycle_id": cycle_id,
        "brand_name": brand_name,
        "category": category,
        "region": region,
        "competitors": competitors,
        "providers": providers,
        "monitor_output": {},
        "analyst_output": {},
        "strategist_output": {},
        "experiment_output": {},
    }

    try:
        graph = _get_graph()
        await graph.ainvoke(initial_state)
    except Exception as exc:
        logger.error("Growth cycle %s failed: %s", cycle_id, exc)
        await _update_cycle(
            cycle_id,
            status=CycleStatus.failed,
            experiment_output={"error": str(exc)},
            completed_at=datetime.now(timezone.utc),
        )
