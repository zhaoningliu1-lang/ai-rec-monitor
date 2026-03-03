"""
Brand name normalization: resolve CJK brand names to their English equivalents.

When users input Chinese/Japanese/Korean brand names (e.g. "绿联"),
AI models respond in English ("UGREEN"). This module detects CJK names and
resolves them to English via Claude Haiku so that parse_response can match both.
"""
import logging
import re

logger = logging.getLogger(__name__)

# CJK Unified Ideographs + Hiragana + Katakana + Hangul
_CJK_RE = re.compile(r"[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]")


def _contains_cjk(text: str) -> bool:
    return bool(_CJK_RE.search(text))


async def _resolve_to_english(name: str) -> str | None:
    """
    Call Claude Haiku to get the official English name for a CJK brand.
    Returns the English name string, or None if resolution fails or is not needed.
    """
    from app.config import settings

    if not settings.anthropic_api_key:
        return None

    try:
        import anthropic

        client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
        msg = await client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=30,
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"What is the official English brand name for '{name}'? "
                        "Reply with ONLY the English brand name (1-4 words). "
                        "If unknown or already English, reply with the original name."
                    ),
                }
            ],
        )
        result = msg.content[0].text.strip().strip('"').strip("'") if msg.content else None
        if result and result.lower() != name.lower():
            logger.info("Brand alias resolved: '%s' → '%s'", name, result)
            return result
    except Exception as exc:
        logger.warning("Brand alias resolution failed for '%s': %s", name, exc)

    return None


async def build_name_aliases(
    brand_name: str,
    competitor_names: list[str],
) -> dict[str, list[str]]:
    """
    Build a mapping of {original_name: [list_of_aliases]} for the brand and all
    competitors. Non-CJK names get a one-element list (just themselves).

    Example:
        {"绿联": ["绿联", "UGREEN"], "安克": ["安克", "Anker"], "Belkin": ["Belkin"]}
    """
    aliases: dict[str, list[str]] = {}

    all_names = [brand_name] + list(competitor_names)
    for name in all_names:
        if _contains_cjk(name):
            english = await _resolve_to_english(name)
            if english:
                aliases[name] = [name, english]
            else:
                aliases[name] = [name]
        else:
            aliases[name] = [name]

    return aliases
