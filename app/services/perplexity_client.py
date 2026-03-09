"""Async Perplexity client using the OpenAI-compatible chat completions API."""
import asyncio
import logging

from openai import AsyncOpenAI
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.config import settings
from app.services.providers import BaseProvider

logger = logging.getLogger(__name__)

# Perplexity uses the same OpenAI SDK but different base_url
_client: AsyncOpenAI | None = None
_semaphore = asyncio.Semaphore(5)  # max 5 concurrent Perplexity calls


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        if not settings.perplexity_api_key:
            raise RuntimeError("PERPLEXITY_API_KEY is not set")
        _client = AsyncOpenAI(
            api_key=settings.perplexity_api_key,
            base_url="https://api.perplexity.ai",
        )
    return _client


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=10),
    retry=retry_if_exception_type(Exception),
    reraise=True,
)
async def query_prompt(prompt: str) -> str:
    """Send a single prompt to Perplexity and return the response text."""
    async with _semaphore:
        logger.debug("Querying Perplexity for prompt: %s...", prompt[:60])
        response = await _get_client().chat.completions.create(
            model="llama-3.1-sonar-large-128k-online",  # Perplexity's flagship search model
            messages=[{"role": "user", "content": prompt}],
            timeout=45,
            temperature=0.2,  # lower = more factual / grounded in search results
        )
        text = response.choices[0].message.content or ""
        logger.debug("Got Perplexity response (%d chars)", len(text))
        return text


class PerplexityProvider(BaseProvider):
    name = "perplexity"

    async def ask(self, prompt: str) -> str:
        return await query_prompt(prompt)
