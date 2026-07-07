import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class RunStatus(str, enum.Enum):
    queued = "queued"
    running = "running"
    done = "done"
    failed = "failed"


class Sentiment(str, enum.Enum):
    positive = "positive"
    neutral = "neutral"
    negative = "negative"


class Run(Base):
    __tablename__ = "runs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    brand_name: Mapped[str] = mapped_column(String(255), nullable=False)
    competitor_names: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    category: Mapped[str] = mapped_column(String(255), nullable=False)
    region: Mapped[str] = mapped_column(String(10), nullable=False)
    num_prompts: Mapped[int] = mapped_column(Integer, nullable=False, default=100)
    status: Mapped[RunStatus] = mapped_column(
        Enum(RunStatus), nullable=False, default=RunStatus.queued
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    finished_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    progress_total: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    progress_done: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    providers: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    price_band: Mapped[str | None] = mapped_column(String(50), nullable=True)
    # Maps each brand/competitor name to its list of aliases (e.g. {"绿联": ["绿联", "UGREEN"]})
    name_aliases: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    # Human-readable run code, e.g. "20260302-UGRE-0001"
    run_code: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)
    # Owning user (nullable — anonymous audit runs have no user)
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )

    results: Mapped[list["PromptResult"]] = relationship(
        "PromptResult", back_populates="run", cascade="all, delete-orphan"
    )
    snapshot: Mapped["RunSnapshot | None"] = relationship(
        "RunSnapshot", back_populates="run", uselist=False, cascade="all, delete-orphan"
    )
    recommendation: Mapped["Recommendation | None"] = relationship(
        "Recommendation", back_populates="run", uselist=False, cascade="all, delete-orphan"
    )
    geo_plan: Mapped["GeoPlan | None"] = relationship(
        "GeoPlan", back_populates="run", uselist=False, cascade="all, delete-orphan"
    )


class PromptResult(Base):
    __tablename__ = "prompt_results"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    run_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("runs.id", ondelete="CASCADE"), nullable=False
    )
    prompt_text: Mapped[str] = mapped_column(Text, nullable=False)
    raw_response: Mapped[str] = mapped_column(Text, nullable=False)
    brand_mentioned: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    brand_mention_position: Mapped[int | None] = mapped_column(Integer, nullable=True)
    competitors_data: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    brand_sentiment: Mapped[Sentiment] = mapped_column(
        Enum(Sentiment), nullable=False, default=Sentiment.neutral
    )
    cited_urls: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    provider: Mapped[str] = mapped_column(String(50), nullable=False, default="openai")
    intent_type: Mapped[str] = mapped_column(String(50), nullable=False, default="high_intent")
    # Consumer generation cohort (gen_z / millennial / gen_x / boomer / general)
    generation: Mapped[str | None] = mapped_column(String(20), nullable=True)
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    processed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    run: Mapped["Run"] = relationship("Run", back_populates="results")


# ── Scheduled recurring runs ──────────────────────────────────────────────────

class ScheduledRun(Base):
    __tablename__ = "scheduled_runs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    brand_name: Mapped[str] = mapped_column(String(255), nullable=False)
    competitor_names: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    category: Mapped[str] = mapped_column(String(255), nullable=False)
    region: Mapped[str] = mapped_column(String(10), nullable=False)
    providers: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    price_band: Mapped[str | None] = mapped_column(String(50), nullable=True)
    cron_expr: Mapped[str] = mapped_column(String(100), nullable=False, default="0 9 * * 1")
    num_prompts: Mapped[int] = mapped_column(Integer, nullable=False, default=60)
    enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    last_run_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    next_run_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ── Per-run metrics snapshot (for trend charts) ───────────────────────────────

class RunSnapshot(Base):
    __tablename__ = "run_snapshots"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    run_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("runs.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    brand_name: Mapped[str] = mapped_column(String(255), nullable=False)
    sov_overall: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    sov_high: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    sov_comparison: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    sov_info: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    weighted_sov: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    arrs: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    mention_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    total_prompts: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    snapshot_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    run: Mapped["Run"] = relationship("Run", back_populates="snapshot")


# ── AI-generated recommendations ──────────────────────────────────────────────

class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    run_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("runs.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    brand_name: Mapped[str] = mapped_column(String(255), nullable=False)
    items: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    generated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    model_used: Mapped[str] = mapped_column(String(100), nullable=False, default="claude-fable-5")

    run: Mapped["Run"] = relationship("Run", back_populates="recommendation")


# ── GEO Action Plans ─────────────────────────────────────────────────────────

class GeoPlan(Base):
    __tablename__ = "geo_plans"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    run_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("runs.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    brand_name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(255), nullable=False)
    current_geo_score: Mapped[int] = mapped_column(Integer, nullable=False)
    projected_geo_score: Mapped[int] = mapped_column(Integer, nullable=False)
    weaknesses: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    actions: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    generated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    model_used: Mapped[str] = mapped_column(String(100), nullable=False)

    run: Mapped["Run"] = relationship("Run", back_populates="geo_plan")


# ── Prompt library ────────────────────────────────────────────────────────────

class PromptStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    suggested = "suggested"


class PromptLibrary(Base):
    __tablename__ = "prompt_library"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True
    )
    category: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    region: Mapped[str] = mapped_column(String(10), nullable=False)
    prompt_text: Mapped[str] = mapped_column(Text, nullable=False)
    intent_type: Mapped[str] = mapped_column(String(50), nullable=False, default="high")
    status: Mapped[PromptStatus] = mapped_column(
        Enum(PromptStatus), nullable=False, default=PromptStatus.active
    )
    source: Mapped[str] = mapped_column(String(20), nullable=False, default="user")
    usage_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ── User accounts & subscriptions ─────────────────────────────────────────────

# ── Agent growth cycles ───────────────────────────────────────────────────────

class CycleStatus(str, enum.Enum):
    pending = "pending"
    monitoring = "monitoring"
    analyzing = "analyzing"
    strategizing = "strategizing"
    experimenting = "experimenting"
    completed = "completed"
    failed = "failed"


class AgentCycle(Base):
    __tablename__ = "agent_cycles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    brand_name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(255), nullable=False)
    region: Mapped[str] = mapped_column(String(10), nullable=False, default="us")
    competitor_names: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    providers: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    language: Mapped[str] = mapped_column(String(10), nullable=False, default="en")
    status: Mapped[CycleStatus] = mapped_column(
        Enum(CycleStatus), nullable=False, default=CycleStatus.pending
    )
    monitor_output: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    analyst_output: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    strategist_output: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    experiment_output: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )


# ── User accounts & subscriptions ─────────────────────────────────────────────

class SubscriptionTier(str, enum.Enum):
    free = "free"
    growth = "growth"
    scale = "scale"
    enterprise = "enterprise"


class SubscriptionStatus(str, enum.Enum):
    active = "active"
    trialing = "trialing"
    past_due = "past_due"
    canceled = "canceled"
    none = "none"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    company_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    # Stripe
    stripe_customer_id: Mapped[str | None] = mapped_column(String(255), nullable=True, unique=True)
    stripe_subscription_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    subscription_tier: Mapped[SubscriptionTier] = mapped_column(
        Enum(SubscriptionTier), nullable=False, default=SubscriptionTier.free
    )
    subscription_status: Mapped[SubscriptionStatus] = mapped_column(
        Enum(SubscriptionStatus), nullable=False, default=SubscriptionStatus.none
    )
    subscription_current_period_end: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Credits (1 credit = 5 prompts; free tier starts with 40)
    credit_balance: Mapped[int] = mapped_column(Integer, nullable=False, default=40)

    # Password reset
    password_reset_token: Mapped[str | None] = mapped_column(String(64), nullable=True, unique=True)
    password_reset_expires: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class APIKey(Base):
    """API keys for programmatic / Agent-native access."""
    __tablename__ = "api_keys"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    key_prefix: Mapped[str] = mapped_column(String(12), nullable=False)
    key_hash: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    last_used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class B2AEvent(Base):
    """Tracks AI-referred visits detected by the B2A JavaScript snippet."""
    __tablename__ = "b2a_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    # Which client site sent this event (domain of the site embedding b2a.js)
    site_domain: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    # Which AI engine referred the visitor
    engine: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    # Full referrer URL
    referrer: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Page the visitor landed on
    page_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    # User agent string (for AI browser detection)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Visitor's country from IP (populated server-side)
    country: Mapped[str | None] = mapped_column(String(10), nullable=True)
    # Optional session/visitor ID (for dedup)
    visitor_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    # Timestamp from client
    event_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ── Content Studio Drafts ─────────────────────────────────────────────────────

class ContentDraft(Base):
    """AI-generated content drafts for multi-platform publishing."""
    __tablename__ = "content_drafts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    brand: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    # reddit / x / linkedin / amazon / blog / tiktok
    platform: Mapped[str] = mapped_column(String(50), nullable=False)
    # post / listing / article / script
    content_type: Mapped[str] = mapped_column(String(50), nullable=False)
    title: Mapped[str | None] = mapped_column(Text, nullable=True)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    keywords: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    # draft / scheduled / published
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="draft")
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    platform_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ── Shared Reports (Client Report Portal) ────────────────────────────────────

class SharedReport(Base):
    """A report shared via public token link for client viewing."""
    __tablename__ = "shared_reports"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    token: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    brand_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    html_content: Mapped[str] = mapped_column(Text, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    view_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    views: Mapped[list["ReportView"]] = relationship(
        "ReportView", back_populates="report", cascade="all, delete-orphan"
    )


class ReportView(Base):
    """Tracks each view of a shared report."""
    __tablename__ = "report_views"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    report_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("shared_reports.id", ondelete="CASCADE"), nullable=False, index=True
    )
    viewed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)

    report: Mapped["SharedReport"] = relationship("SharedReport", back_populates="views")
