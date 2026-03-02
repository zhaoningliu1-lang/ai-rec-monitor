"""Async OpenAI client with rate limiting and retry logic."""
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

_client = AsyncOpenAI(api_key=settings.openai_api_key)
_semaphore = asyncio.Semaphore(settings.openai_max_concurrency)


@retry(
    stop=stop_after_attempt(settings.openai_max_retries),
    wait=wait_exponential(multiplier=1, min=1, max=10),
    retry=retry_if_exception_type(Exception),
    reraise=True,
)
async def query_prompt(prompt: str) -> str:
    """Send a single prompt to OpenAI and return the response text."""
    async with _semaphore:
        logger.debug("Querying OpenAI for prompt: %s...", prompt[:60])
        response = await _client.chat.completions.create(
            model=settings.openai_model,
            messages=[{"role": "user", "content": prompt}],
            timeout=settings.openai_timeout,
            temperature=0.7,
        )
        text = response.choices[0].message.content or ""
        logger.debug("Got response (%d chars)", len(text))
        return text


class OpenAIProvider(BaseProvider):
    name = "openai"

    async def ask(self, prompt: str) -> str:
        return await query_prompt(prompt)
