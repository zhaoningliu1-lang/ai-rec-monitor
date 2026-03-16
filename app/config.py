from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
    openai_api_key: str
    database_url: str  # postgresql+asyncpg://user:pass@host/db

    @field_validator("database_url", mode="before")
    @classmethod
    def fix_asyncpg_scheme(cls, v: str) -> str:
        # Railway injects postgresql:// but SQLAlchemy async needs postgresql+asyncpg://
        if v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v
    openai_model: str = "gpt-4o-mini"
    openai_max_concurrency: int = 5
    openai_timeout: int = 30
    openai_max_retries: int = 3

    # Gemini (optional — only required when "gemini" is in a run's providers list)
    gemini_api_key: str | None = None
    gemini_model: str = "gemini-2.5-flash"

    # Anthropic/Claude (optional — required when "claude" is in a run's providers list)
    anthropic_api_key: str | None = None
    claude_model: str = "claude-haiku-4-5-20251001"
    claude_max_concurrency: int = 5

    # Perplexity (optional — required when "perplexity" is in a run's providers list)
    perplexity_api_key: str | None = None
    perplexity_model: str = "llama-3.1-sonar-large-128k-online"

    # Notion (optional — required for Notion report export)
    notion_token: str | None = None
    notion_database_id: str | None = None

    # Auth — JWT
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 30  # 30 days

    # Stripe
    stripe_secret_key: str | None = None
    stripe_webhook_secret: str | None = None
    stripe_price_starter: str | None = None   # STRIPE_PRICE_STARTER — Starter $99/mo
    stripe_price_monitor: str | None = None   # STRIPE_PRICE_MONITOR — Growth $249/mo
    stripe_price_pro: str | None = None       # STRIPE_PRICE_PRO — Agency $999/mo

    # Email (Resend)
    resend_api_key: str | None = None
    from_email: str = "Avanti <hello@avantia2a.com>"
    site_url: str = "https://avantia2a.com"
    admin_email: str = "hello@avantia2a.com"

    # Slack admin notifications
    slack_webhook_url: str | None = None

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
