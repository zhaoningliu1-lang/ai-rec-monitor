from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str
    database_url: str  # postgresql+asyncpg://user:pass@host/db
    openai_model: str = "gpt-4o-mini"
    openai_max_concurrency: int = 5
    openai_timeout: int = 30
    openai_max_retries: int = 3

    # Gemini (optional — only required when "gemini" is in a run's providers list)
    gemini_api_key: str | None = None
    gemini_model: str = "gemini-1.5-flash"

    # Anthropic/Claude (optional — required when "claude" is in a run's providers list)
    anthropic_api_key: str | None = None
    claude_model: str = "claude-haiku-4-5-20251001"
    claude_max_concurrency: int = 5

    # Notion (optional — required for Notion report export)
    notion_token: str | None = None
    notion_database_id: str | None = None

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
