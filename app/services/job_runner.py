"""Orchestrates a full test run: generate prompts → query providers → parse → store."""
import asyncio
import logging
import uuid
from datetime import datetime, timezone

from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.models import PromptResult, Run, RunSnapshot, RunStatus, Sentiment
from app.services.parser import parse_response
from app.services.prompt_generator import generate_prompts
from app.services.providers import BaseProvider, get_provider

logger = logging.getLogger(__name__)

_FAILURE_THRESHOLD = 0.20  # >20% failed → mark whole run failed


async def _process_single_prompt(
    run_id: uuid.UUID,
    brand_name: str,
    competitor_names: list[str],
    prompt_text: str,
    intent_type: str,
    provider: BaseProvider,
    session_factory: async_sessionmaker[AsyncSession],
    name_aliases: dict[str, list[str]] | None = None,
) -> bool:
    """
    Query one provider for one prompt, parse, persist, increment progress_done.
    Returns True on success, False on failure.
    Failures are stored on the PromptResult row so nothing is silently lost.
    """
    error_msg: str | None = None
    raw_response = ""
    parsed: dict = {
        "brand_mentioned": False,
        "brand_mention_position": None,
        "brand_sentiment": "neutral",
        "competitors_data": {},
        "cited_urls": [],
    }

    try:
        raw_response = await provider.ask(prompt_text)
        parsed = parse_response(raw_response, brand_name, competitor_names, name_aliases)
    except Exception as exc:
        error_msg = str(exc)
        logger.warning("Prompt failed [%s] for run %s: %s", provider.name, run_id, exc)

    result = PromptResult(
        run_id=run_id,
        prompt_text=prompt_text,
        raw_response=raw_response,
        brand_mentioned=parsed["brand_mentioned"],
        brand_mention_position=parsed["brand_mention_position"],
        competitors_data=parsed["competitors_data"],
        brand_sentiment=Sentiment(parsed["brand_sentiment"]),
        cited_urls=parsed["cited_urls"],
        provider=provider.name,
        intent_type=intent_type,
        error=error_msg,
    )

    async with session_factory() as db:
        db.add(result)
        # Atomic SQL increment — safe under concurrent gather()
        await db.execute(
            update(Run)
            .where(Run.id == run_id)
            .values(progress_done=Run.progress_done + 1)
        )
        await db.commit()

    return error_msg is None


async def run_job(run_id: uuid.UUID, session_factory: async_sessionmaker[AsyncSession]) -> None:
    """Background task: run the full test pipeline for a given run."""
    logger.info("Starting run %s", run_id)

    async with session_factory() as db:
        run = await db.get(Run, run_id)
        if run is None:
            logger.error("Run %s not found", run_id)
            return
        run.status = RunStatus.running
        run.started_at = datetime.now(timezone.utc)
        await db.commit()
        brand_name = run.brand_name
        competitor_names = run.competitor_names or []
        category = run.category
        region = run.region
        num_prompts = run.num_prompts
        price_band = run.price_band
        provider_names: list[str] = run.providers or ["openai"]
        existing_aliases: dict = run.name_aliases or {}

    # Instantiate providers up-front so misconfiguration fails before work starts
    try:
        providers = [get_provider(n) for n in provider_names]
    except Exception as exc:
        logger.error("Provider init failed for run %s: %s", run_id, exc)
        async with session_factory() as db:
            run = await db.get(Run, run_id)
            if run:
                run.status = RunStatus.failed
                run.error_message = f"Provider init error: {exc}"
                run.finished_at = datetime.now(timezone.utc)
                await db.commit()
        return

    # ── Resolve brand name aliases (CJK → English) ──────────────────────────
    try:
        from app.services.brand_normalizer import build_name_aliases
        name_aliases = await build_name_aliases(brand_name, competitor_names)
        # Persist resolved aliases so they survive re-runs and can be inspected
        async with session_factory() as db:
            await db.execute(
                update(Run).where(Run.id == run_id).values(name_aliases=name_aliases)
            )
            await db.commit()
        logger.info("Name aliases for run %s: %s", run_id, name_aliases)
    except Exception as exc:
        logger.warning("Alias resolution failed for run %s: %s — using original names", run_id, exc)
        name_aliases = existing_aliases or {
            brand_name: [brand_name],
            **{c: [c] for c in competitor_names},
        }

    try:
        prompt_dicts = generate_prompts(category, region, num_prompts, price_band)
        # Each prompt runs through every provider → total tasks = prompts × providers
        total = len(prompt_dicts) * len(providers)
        logger.info(
            "Generated %d prompts × %d provider(s) = %d tasks for run %s",
            len(prompt_dicts), len(providers), total, run_id,
        )

        async with session_factory() as db:
            await db.execute(
                update(Run).where(Run.id == run_id).values(progress_total=total)
            )
            await db.commit()

        outcomes: list[bool | BaseException] = await asyncio.gather(
            *[
                _process_single_prompt(
                    run_id, brand_name, competitor_names,
                    p["prompt"], p["intent_type"], provider, session_factory,
                    name_aliases=name_aliases,
                )
                for p in prompt_dicts
                for provider in providers
            ],
            return_exceptions=True,
        )

        fail_count = sum(
            1 for r in outcomes if r is False or isinstance(r, BaseException)
        )
        fail_rate = fail_count / total if total else 0

        async with session_factory() as db:
            run = await db.get(Run, run_id)
            run.finished_at = datetime.now(timezone.utc)
            if fail_rate > _FAILURE_THRESHOLD:
                run.status = RunStatus.failed
                run.error_message = (
                    f"{fail_count}/{total} tasks failed ({fail_rate:.0%}), "
                    f"exceeds {_FAILURE_THRESHOLD:.0%} threshold"
                )
                logger.error("Run %s marked failed: %s", run_id, run.error_message)
            else:
                run.status = RunStatus.done
                if fail_count:
                    logger.warning(
                        "Run %s done with %d/%d failures (within threshold)",
                        run_id, fail_count, total,
                    )
            await db.commit()

        logger.info("Run %s finished (status=%s)", run_id, run.status.value)

        # Post-run enrichment (snapshot + recommendations + Notion) on success
        if run.status == RunStatus.done:
            from sqlalchemy import select as _select
            from app.routers.reports import _compute_metrics

            # Load results once for all downstream processing
            async with session_factory() as _db:
                _rows = await _db.execute(
                    _select(PromptResult).where(PromptResult.run_id == run_id)
                )
                _results = _rows.scalars().all()
                _run = await _db.get(Run, run_id)

            _metrics = _compute_metrics(_results, brand_name, competitor_names)

            # ── Save RunSnapshot for trend tracking ────────────────────────
            try:
                _primary = next(
                    (r for r in _metrics.get("brand_table", []) if r.get("is_primary")), {}
                )
                _snap = RunSnapshot(
                    run_id=run_id,
                    brand_name=brand_name,
                    sov_overall=_primary.get("sov", 0.0),
                    sov_high=_primary.get("sov_high", 0.0),
                    sov_comparison=_primary.get("sov_comp", 0.0),
                    sov_info=_primary.get("sov_info", 0.0),
                    weighted_sov=_primary.get("weighted_sov", 0.0),
                    arrs=float(_metrics.get("arrs", 0)),
                    mention_count=_primary.get("mention_count", 0),
                    total_prompts=_metrics.get("total", 0),
                    snapshot_at=_run.finished_at,
                )
                async with session_factory() as _db:
                    _db.add(_snap)
                    await _db.commit()
                logger.info("RunSnapshot saved for run %s", run_id)
            except Exception as _exc:
                logger.warning("RunSnapshot failed for run %s: %s", run_id, _exc)

            # ── Generate Claude recommendations ────────────────────────────
            try:
                from app.services.recommendations import generate_recommendations
                await generate_recommendations(run_id, brand_name, _metrics, session_factory)
            except Exception as _exc:
                logger.warning("Recommendations generation failed for run %s: %s", run_id, _exc)

            # ── Auto-push to Notion if configured ─────────────────────────
            from app.config import settings
            if settings.notion_token and settings.notion_database_id:
                try:
                    from app.services.notion_export import export_run_to_notion
                    _url = await export_run_to_notion(_run, _metrics)
                    logger.info("Run %s auto-exported to Notion: %s", run_id, _url)
                except Exception as _exc:
                    logger.warning("Notion auto-export failed for run %s: %s", run_id, _exc)

    except Exception as exc:
        logger.error("Run %s crashed: %s", run_id, exc)
        async with session_factory() as db:
            run = await db.get(Run, run_id)
            if run:
                run.status = RunStatus.failed
                run.error_message = str(exc)
                run.finished_at = datetime.now(timezone.utc)
                await db.commit()
