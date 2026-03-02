"""Async Gemini provider using google-generativeai."""
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


class GeminiProvider(BaseProvider):
    name = "gemini"

    def __init__(self) -> None:
        if not settings.gemini_api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is not set. "
                "Add it to .env or remove 'gemini' from the providers list."
            )
        # Lazy import so google-generativeai is only required when actually used
        import google.generativeai as genai  # type: ignore[import]

        genai.configure(api_key=settings.gemini_api_key)
        self._model = genai.GenerativeModel(settings.gemini_model)
        # Share the same concurrency cap as OpenAI to avoid hammering both APIs
        self._semaphore = asyncio.Semaphore(settings.openai_max_concurrency)

    async def ask(self, prompt: str) -> str:
        @retry(
            stop=stop_after_attempt(settings.openai_max_retries),
            wait=wait_exponential(multiplier=1, min=1, max=10),
            retry=retry_if_exception_type(Exception),
            reraise=True,
        )
        async def _ask() -> str:
            async with self._semaphore:
                logger.debug("Querying Gemini for prompt: %s...", prompt[:60])
                response = await self._model.generate_content_async(
                    prompt,
                    generation_config={"temperature": 0.7},
                )
                text: str = response.text or ""
                logger.debug("Gemini response (%d chars)", len(text))
                return text

        return await _ask()
