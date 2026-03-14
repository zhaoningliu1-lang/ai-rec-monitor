import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


ProviderName = Literal["openai", "gemini", "claude"]


class CreateRunRequest(BaseModel):
    brand_name: str = Field(..., min_length=1, max_length=255)
    competitor_names: list[str] = Field(default_factory=list, max_length=20)
    category: str = Field(..., min_length=1, max_length=255)
    region: Literal["US", "UK", "DE"]
    num_prompts: int = Field(default=60, ge=1, le=200)
    providers: list[ProviderName] = Field(default_factory=lambda: ["openai"])
    price_band: str | None = Field(default=None, max_length=50)


class RunResponse(BaseModel):
    id: uuid.UUID
    run_code: str | None
    brand_name: str
    competitor_names: list[str]
    category: str
    region: str
    num_prompts: int
    providers: list[str]
    price_band: str | None
    status: str
    created_at: datetime
    started_at: datetime | None
    finished_at: datetime | None
    progress_total: int
    progress_done: int
    error_message: str | None

    model_config = {"from_attributes": True}


class PromptResultResponse(BaseModel):
    id: uuid.UUID
    run_id: uuid.UUID
    prompt_text: str
    raw_response: str
    brand_mentioned: bool
    brand_mention_position: int | None
    competitors_data: dict
    brand_sentiment: str
    processed_at: datetime

    model_config = {"from_attributes": True}


class PromptResultDetailResponse(PromptResultResponse):
    """Extended response that includes provider and intent classification."""
    provider: str | None = None
    intent_type: str | None = None
    cited_urls: list[str] = []


class CategoryLeaderboardEntry(BaseModel):
    brand_name: str
    weighted_sov: float
    sov_high: float
    sov_comparison: float
    sov_info: float
    arrs: float
    mention_count: int
    total_prompts: int
    snapshot_at: datetime

    model_config = {"from_attributes": True}


class EnrichedLeaderboardEntry(BaseModel):
    brand_name: str
    weighted_sov: float
    sov_high: float
    sov_comparison: float
    sov_info: float
    arrs: float
    mention_count: int
    total_prompts: int
    snapshot_at: datetime
    sparkline: list[float]
    trend_direction: str  # "rising" | "stable" | "falling"
    sov_change: float


class TrendsLeaderboardResponse(BaseModel):
    entries: list[EnrichedLeaderboardEntry]
    limited: bool = False  # True when non-logged-in user sees only top 3
    credits_remaining: int | None = None  # null for anonymous / paid
    credit_cost: int = 0  # how many credits this request consumed


# ── ScheduledRun ──────────────────────────────────────────────────────────────

class CreateScheduleRequest(BaseModel):
    brand_name: str = Field(..., min_length=1, max_length=255)
    competitor_names: list[str] = Field(default_factory=list)
    category: str = Field(..., min_length=1, max_length=255)
    region: Literal["US", "UK", "DE"]
    providers: list[ProviderName] = Field(default_factory=lambda: ["openai", "claude"])
    price_band: str | None = None
    cron_expr: str = Field(default="0 9 * * 1", description="Cron expression (e.g. '0 9 * * 1' = Mondays 9am UTC)")
    num_prompts: int = Field(default=60, ge=1, le=200)


class ScheduleResponse(BaseModel):
    id: uuid.UUID
    brand_name: str
    competitor_names: list[str]
    category: str
    region: str
    providers: list[str]
    price_band: str | None
    cron_expr: str
    num_prompts: int
    enabled: bool
    last_run_at: datetime | None
    next_run_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


# ── RunSnapshot / Trends ──────────────────────────────────────────────────────

class RunSnapshotResponse(BaseModel):
    id: uuid.UUID
    run_id: uuid.UUID
    brand_name: str
    sov_overall: float
    sov_high: float
    sov_comparison: float
    sov_info: float
    weighted_sov: float
    arrs: float
    mention_count: int
    total_prompts: int
    snapshot_at: datetime

    model_config = {"from_attributes": True}


# ── Prompt Library ────────────────────────────────────────────────────────────

class PromptLibraryResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID | None
    category: str
    region: str
    prompt_text: str
    intent_type: str
    status: str
    source: str
    usage_count: int
    created_at: datetime

    model_config = {"from_attributes": True}


class PromptCreateIn(BaseModel):
    category: str = Field(..., min_length=1, max_length=255)
    region: Literal["US", "UK", "DE"]
    prompt_text: str = Field(..., min_length=10, max_length=2000)
    intent_type: Literal["high", "comparison", "info"] = "high"


class PromptUpdateIn(BaseModel):
    status: Literal["active", "inactive", "suggested"] | None = None
    intent_type: Literal["high", "comparison", "info"] | None = None
    prompt_text: str | None = Field(default=None, min_length=10, max_length=2000)


class PromptSuggestIn(BaseModel):
    category: str = Field(..., min_length=1, max_length=255)
    region: Literal["US", "UK", "DE"]
    brand_name: str = Field(..., min_length=1, max_length=255)
    count: int = Field(default=8, ge=1, le=20)


# ── Recommendations ───────────────────────────────────────────────────────────

class RecommendationItem(BaseModel):
    title: str
    description: str
    priority: Literal["high", "medium", "low"]


class RecommendationResponse(BaseModel):
    id: uuid.UUID
    run_id: uuid.UUID
    brand_name: str
    items: list[dict]
    generated_at: datetime
    model_used: str

    model_config = {"from_attributes": True}


# ── GEO Action Plan ──────────────────────────────────────────────────────────

class GeoActionItem(BaseModel):
    id: str
    category: Literal["content", "reddit", "schema", "citations", "social", "reviews"]
    priority: Literal["critical", "high", "medium"]
    title: str
    why: str
    how: str
    impact: str
    effort: Literal["low", "medium", "high"]


class GeoPlanResponse(BaseModel):
    id: uuid.UUID
    run_id: uuid.UUID
    brand_name: str
    category: str
    current_geo_score: int
    projected_geo_score: int
    weaknesses: list[str]
    actions: list[dict]
    generated_at: datetime
    model_used: str

    model_config = {"from_attributes": True}


# ── Selection Intelligence ──────────────────────────────────────────────────

class SelectionBrandEntry(BaseModel):
    name: str
    sov: float
    arrs: float


class SelectionCategoryEntry(BaseModel):
    id: str
    category: str
    category_zh: str
    section: str
    section_zh: str
    brand_count: int
    top_brands: list[SelectionBrandEntry]
    trend: Literal["up", "stable", "down"]
    trend_pts: str
    seller_signal: Literal["strong_buy", "watch", "avoid"]
    seller_note: str
    seller_note_zh: str
    platforms: list[str]
    google_trends_delta: float | None = None
    reddit_posts: int | None = None
    youtube_kols: int | None = None


class SelectionIntelligenceResponse(BaseModel):
    categories: list[SelectionCategoryEntry]
    total: int
    limited: bool = False
    credits_remaining: int | None = None
    credit_cost: int = 0


class SelectionDetailRedditPost(BaseModel):
    title: str
    url: str
    subreddit: str
    score: int
    sentiment: str
    age_days: int


class SelectionDetailKol(BaseModel):
    channel_name: str
    video_title: str
    video_url: str
    views: int
    subscribers: int
    tier: str


class SelectionCategoryDetailResponse(BaseModel):
    category: str
    leaderboard: list[dict]
    reddit_posts: list[SelectionDetailRedditPost]
    youtube_kols: list[SelectionDetailKol]
    google_trends: dict
    credits_remaining: int | None = None
    credit_cost: int = 0
