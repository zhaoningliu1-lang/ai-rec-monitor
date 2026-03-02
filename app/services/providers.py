"""Provider interface and factory for LLM backends."""
from abc import ABC, abstractmethod


class BaseProvider(ABC):
    """Common interface every LLM provider must implement."""

    name: str  # identifier stored in PromptResult.provider

    @abstractmethod
    async def ask(self, prompt: str) -> str:
        """Send a single prompt and return the response text."""
        raise NotImplementedError


def get_provider(name: str) -> BaseProvider:
    """Instantiate a provider by name. Fails fast if the required key is missing."""
    if name == "openai":
        from app.services.openai_client import OpenAIProvider
        return OpenAIProvider()
    if name == "gemini":
        from app.services.gemini_client import GeminiProvider
        return GeminiProvider()
    if name == "claude":
        from app.services.claude_client import ClaudeProvider
        return ClaudeProvider()
    raise ValueError(f"Unknown provider {name!r}. Valid choices: openai, gemini, claude")
