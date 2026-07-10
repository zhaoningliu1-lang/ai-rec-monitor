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

    # Methodology note: the prompt is a REAL buyer question and must be answered
    # exactly as Claude would answer a real user — concrete product/brand
    # recommendations by name. The old "AI visibility analyst" system prompt
    # leaked the measurement intent into the measured response, corrupting the
    # sample. Keep this system neutral.
    _SYSTEM = (
        "You are a helpful assistant answering a shopper's or buyer's question. "
        "Answer as you normally would for a real user: recommend specific products, "
        "brands, or tools by name, with brief reasons. Be concrete and direct."
    )

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
                system=[{
                    "type": "text",
                    "text": self._SYSTEM,
                    "cache_control": {"type": "ephemeral"},
                }],
                messages=[{"role": "user", "content": prompt}],
            )
            # Adaptive-thinking models (claude-fable-5) may emit a thinking block
            # first — content[0] is then NOT the answer. Join only text blocks.
            text = "\n".join(
                b.text for b in (msg.content or []) if getattr(b, "type", "") == "text"
            ).strip()
            logger.debug("Got Claude response (%d chars)", len(text))
            return text
