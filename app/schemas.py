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
