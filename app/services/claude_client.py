"""Async Anthropic/Claude client with rate limiting and retry logic."""
import asyncio
import logging

from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.config import settings
from app.services.providers import BaseProvider

logger = logging.getLogger(__name__)

_semaphore = asyncio.Semaphore(settings.claude_max_concurrency)


class ClaudeProvider(BaseProvider):
    name = "claude"

    def __init__(self):
        if not settings.anthropic_api_key:
            raise ValueError(
                "ANTHROPIC_API_KEY is not set. Add it to .env to use the Claude provider."
            )
        import anthropic
        self._client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=10),
        retry=retry_if_exception_type(Exception),
        reraise=True,
    )
    async def ask(self, prompt: str) -> str:
        """Send a single prompt to Claude and return the response text."""
        async with _semaphore:
            logger.debug("Querying Claude for prompt: %s...", prompt[:60])
            msg = await self._client.messages.create(
                model=settings.claude_model,
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}],
            )
            text = msg.content[0].text if msg.content else ""
            logger.debug("Got Claude response (%d chars)", len(text))
            return text
