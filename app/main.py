import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import select, update

from app.database import Base, async_session_factory, engine
from app.models import Run, RunStatus, ScheduledRun
from app.routers import reports, runs, schedules
from app.routers import agents as agents_router
from app.routers import auth as auth_router
from app.routers import billing as billing_router
from app.routers import prompts as prompts_router
from app.routers import trends as trends_router
from app.routers import reddit as reddit_router
from app.routers import kol as kol_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

_STUCK_THRESHOLD_MINUTES = 30


async def _recover_stuck_runs() -> None:
    """Mark any runs that have been in 'running' for >30 minutes as failed."""
    cutoff = datetime.now(timezone.utc) - timedelta(minutes=_STUCK_THRESHOLD_MINUTES)
    async with async_session_factory() as db:
        stmt = select(Run).where(
            Run.status == RunStatus.running,
            Run.started_at < cutoff,
        )
        result = await db.execute(stmt)
        stuck = result.scalars().all()
        if stuck:
            ids = [str(r.id) for r in stuck]
            logger.warning("Recovering %d stuck run(s): %s", len(stuck), ids)
            await db.execute(
                update(Run)
                .where(Run.id.in_([r.id for r in stuck]))
                .values(
                    status=RunStatus.failed,
                    error_message="stuck run recovery",
                    finished_at=datetime.now(timezone.utc),
                )
            )
            await db.commit()


async def _tick_schedules() -> None:
    """Fire any ScheduledRun entries whose next_run_at is due."""
    import asyncio
    from croniter import croniter
    from app.models import Run as RunModel
    from app.services.job_runner import run_job

    now = datetime.now(timezone.utc)
    async with async_session_factory() as db:
        stmt = select(ScheduledRun).where(
            ScheduledRun.enabled == True,  # noqa: E712
            ScheduledRun.next_run_at <= now,
        )
        result = await db.execute(stmt)
        due = result.scalars().all()

    for sched in due:
        try:
            async with async_session_factory() as db:
                run = RunModel(
                    brand_name=sched.brand_name,
                    competitor_names=sched.competitor_names,
                    category=sched.category,
                    region=sched.region,
                    num_prompts=sched.num_prompts,
                    providers=sched.providers,
                    price_band=sched.price_band,
                    progress_total=sched.num_prompts * len(sched.providers),
                    progress_done=0,
                )
                db.add(run)
                await db.commit()
                await db.refresh(run)
                run_id = run.id

                # Update schedule timestamps
                s = await db.get(ScheduledRun, sched.id)
                if s:
                    s.last_run_at = now
                    it = croniter(s.cron_expr, now)
                    s.next_run_at = it.get_next(datetime)
                    await db.commit()

            asyncio.create_task(run_job(run_id, async_session_factory))
            logger.info(
                "Scheduled run triggered brand=%s schedule=%s",
                sched.brand_name, sched.id,
            )
        except Exception as exc:
            logger.error("Failed to fire scheduled run %s: %s", sched.id, exc)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Creating database tables if not exists…")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        # Idempotent column migrations for new fields
        from sqlalchemy import text
        await conn.execute(text(
            "ALTER TABLE prompt_results ADD COLUMN IF NOT EXISTS cited_urls JSON DEFAULT '[]'"
        ))
        await conn.execute(text(
            "ALTER TABLE runs ADD COLUMN IF NOT EXISTS name_aliases JSON DEFAULT '{}'"
        ))
        await conn.execute(text(
            "ALTER TABLE runs ADD COLUMN IF NOT EXISTS run_code VARCHAR(50)"
        ))
        await conn.execute(text(
            "ALTER TABLE runs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL"
        ))
        await conn.execute(text(
            "CREATE INDEX IF NOT EXISTS ix_runs_run_code ON runs (run_code)"
        ))
        await conn.execute(text(
            "CREATE INDEX IF NOT EXISTS ix_runs_user_id ON runs (user_id)"
        ))
        # Prompt library table
        await conn.execute(text("""
            CREATE TABLE IF NOT EXISTS prompt_library (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                category VARCHAR(255) NOT NULL,
                region VARCHAR(10) NOT NULL,
                prompt_text TEXT NOT NULL,
                intent_type VARCHAR(50) NOT NULL DEFAULT 'high',
                status VARCHAR(20) NOT NULL DEFAULT 'active',
                source VARCHAR(20) NOT NULL DEFAULT 'user',
                usage_count INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        """))
        await conn.execute(text(
            "CREATE INDEX IF NOT EXISTS ix_prompt_library_user_id ON prompt_library (user_id)"
        ))
        await conn.execute(text(
            "CREATE INDEX IF NOT EXISTS ix_prompt_library_category ON prompt_library (category)"
        ))
        # Password reset columns
        await conn.execute(text(
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(64) UNIQUE"
        ))
        await conn.execute(text(
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMPTZ"
        ))
        # Agent cycle language column
        await conn.execute(text(
            "ALTER TABLE agent_cycles ADD COLUMN IF NOT EXISTS language VARCHAR(10) NOT NULL DEFAULT 'en'"
        ))
        # Credit balance for users
        await conn.execute(text(
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS credit_balance INTEGER NOT NULL DEFAULT 40"
        ))
    logger.info("Database ready.")
    await _recover_stuck_runs()

    # Start APScheduler — checks for due scheduled runs every 5 minutes
    from apscheduler.schedulers.asyncio import AsyncIOScheduler
    scheduler = AsyncIOScheduler()
    scheduler.add_job(_tick_schedules, "interval", minutes=5, id="tick_schedules")
    scheduler.start()
    logger.info("Scheduler started (interval=5min).")

    yield

    scheduler.shutdown(wait=False)
    await engine.dispose()


app = FastAPI(
    title="AI Recommendation Monitor",
    description="Track how often AI assistants mention your brand vs competitors.",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS — allow localhost dev + Vercel + any extra origins from env
_extra_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "https://avantia2a.com",
        "https://www.avantia2a.com",
        *_extra_origins,
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(runs.router)
app.include_router(reports.router)
app.include_router(schedules.router)
app.include_router(agents_router.router)
app.include_router(auth_router.router)
app.include_router(billing_router.router)
app.include_router(prompts_router.router)
app.include_router(trends_router.router)
app.include_router(reddit_router.router)
app.include_router(kol_router.router)


# Global exception handler — ensures CORS headers survive unhandled 500s
@app.exception_handler(Exception)
async def _global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
