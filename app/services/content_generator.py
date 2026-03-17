"""Content generator service — uses Claude Sonnet to create platform-optimised content."""
import json
import logging
from typing import Any

import anthropic

from app.config import settings

logger = logging.getLogger(__name__)

# Use a more capable model for content generation
_CONTENT_MODEL = "claude-sonnet-4-5"

# Platform-specific system prompts
_PLATFORM_SYSTEM: dict[str, str] = {
    "reddit": (
        "You are an expert Reddit marketer who writes authentic, community-first posts. "
        "You never sound promotional. Posts read like genuine user experiences."
    ),
    "amazon": (
        "You are an Amazon listing optimization expert. You write keyword-rich, conversion-focused "
        "listings that rank well and convert browsers into buyers."
    ),
    "blog": (
        "You are a professional content writer specializing in SEO-optimized blog articles "
        "that naturally incorporate brand mentions and rank on Google."
    ),
    "x": (
        "You are a social media expert who writes punchy, engaging X/Twitter posts "
        "that drive engagement and naturally mention brands without being spammy."
    ),
    "linkedin": (
        "You are a B2B content strategist who writes professional LinkedIn posts "
        "that establish thought leadership while subtly promoting brands."
    ),
    "tiktok": (
        "You are a TikTok content creator who writes engaging video scripts "
        "with strong hooks, authentic storytelling, and viral potential."
    ),
}

# Platform-specific user prompts
_PLATFORM_USER_TMPL: dict[str, str] = {
    "reddit": """Create a Reddit post for brand "{brand}" ({product}) targeting the {market} market.

GEO Visibility Gaps to address:
{geo_gaps_text}

Keywords to naturally include: {keywords_text}
Language: {language}

Write an authentic-feeling review/discussion post. Include:
- A compelling title (not salesy)
- Post body (200-400 words) that reads like a genuine user experience
- Suggested subreddit (e.g., r/BudgetKitchen, r/HomeImprovement)
- 3-5 relevant tags/flairs

Return as JSON:
{{
  "title": "post title",
  "body": "post body text",
  "subreddit": "r/...",
  "hashtags": ["tag1", "tag2"],
  "metadata": {{"word_count": 300, "tone": "casual", "cta": "..."}}
}}""",

    "amazon": """Create an Amazon product listing for brand "{brand}" ({product}) for the {market} market.

GEO Visibility Gaps to address:
{geo_gaps_text}

Keywords to rank for: {keywords_text}
Language: {language}

Write an optimized Amazon listing. Include:
- Product title (under 200 characters, keyword-rich)
- 5 bullet points (each starting with ALL CAPS benefit)
- Product description (250-500 words)
- Backend keywords suggestion

Return as JSON:
{{
  "title": "product title",
  "body": "formatted listing with bullets and description",
  "hashtags": ["keyword1", "keyword2"],
  "metadata": {{"bullet_count": 5, "char_count": 180, "primary_keyword": "..."}}
}}""",

    "blog": """Write a blog article for brand "{brand}" ({product}) targeting the {market} market.

GEO Visibility Gaps to address:
{geo_gaps_text}

SEO keywords to target: {keywords_text}
Language: {language}

Write a complete blog article. Include:
- SEO-optimized headline (H1)
- Introduction (100 words)
- 3-4 sections with H2 headings (150-200 words each)
- Conclusion with CTA (100 words)
- FAQ schema (3 questions)

Return as JSON:
{{
  "title": "H1 headline",
  "body": "full article markdown",
  "hashtags": ["tag1", "tag2"],
  "metadata": {{"word_count": 800, "reading_time": "4 min", "primary_keyword": "..."}}
}}""",

    "x": """Create X/Twitter content for brand "{brand}" ({product}) for the {market} market.

GEO Visibility Gaps to address:
{geo_gaps_text}

Keywords/hashtags to use: {keywords_text}
Language: {language}

Write a thread (3-5 tweets) or a single viral tweet. Include:
- Main tweet (≤280 characters)
- Thread continuation (optional, 2-4 tweets)
- Hashtags (3-5)

Return as JSON:
{{
  "title": "main tweet text",
  "body": "full thread with all tweets numbered",
  "hashtags": ["#tag1", "#tag2"],
  "metadata": {{"char_count": 240, "thread_length": 3, "format": "thread"}}
}}""",

    "linkedin": """Create a LinkedIn post for brand "{brand}" ({product}) for the {market} market.

GEO Visibility Gaps to address:
{geo_gaps_text}

Keywords to include: {keywords_text}
Language: {language}

Write a professional LinkedIn post. Include:
- Hook line (first 2 lines visible before "see more")
- Main content (300-500 words) with line breaks for readability
- Call to action
- 3-5 hashtags

Return as JSON:
{{
  "title": "hook line",
  "body": "full post content",
  "hashtags": ["#tag1", "#tag2"],
  "metadata": {{"word_count": 400, "tone": "professional", "cta": "..."}}
}}""",

    "tiktok": """Create a TikTok video script for brand "{brand}" ({product}) for the {market} market.

GEO Visibility Gaps to address:
{geo_gaps_text}

Keywords/trends to use: {keywords_text}
Language: {language}

Write a 30-60 second video script. Include:
- Hook (first 3 seconds — must stop scroll)
- Main content (20-40 seconds)
- CTA (5-10 seconds)
- Suggested audio/trend
- Video concept/visual directions in [brackets]

Return as JSON:
{{
  "title": "hook text",
  "body": "full video script with timing markers",
  "hashtags": ["#trend1", "#tag2"],
  "metadata": {{"duration_sec": 45, "format": "tutorial", "suggested_audio": "..."}}
}}""",
}


def _build_geo_gaps_text(geo_gaps: dict[str, Any]) -> str:
    if not geo_gaps:
        return "No specific gaps provided — write general brand-positive content."
    lines = []
    gap_labels = {
        "purchase_rate": "Purchase intent rate",
        "mention_rate": "AI mention rate",
        "sentiment_score": "Brand sentiment",
        "competitor_gap": "Gap vs top competitor",
        "reddit_mentions": "Reddit mentions",
        "youtube_gap": "YouTube content gap",
    }
    for k, v in geo_gaps.items():
        label = gap_labels.get(k, k.replace("_", " ").title())
        lines.append(f"• {label}: {v}")
    return "\n".join(lines) if lines else "Focus on improving AI brand visibility."


async def generate_content(
    brand: str,
    product: str,
    platform: str,
    market: str = "US",
    geo_gaps: dict[str, Any] | None = None,
    keywords: list[str] | None = None,
    language: str = "en",
) -> dict[str, Any]:
    """
    Generate platform-optimised content using Claude Sonnet.

    Returns: {"title": str, "body": str, "hashtags": list, "metadata": dict}
    """
    if platform not in _PLATFORM_SYSTEM:
        raise ValueError(f"Unsupported platform: {platform}. Choose from: {list(_PLATFORM_SYSTEM)}")

    if not settings.anthropic_api_key:
        raise ValueError("ANTHROPIC_API_KEY is not configured.")

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    geo_gaps_text = _build_geo_gaps_text(geo_gaps or {})
    keywords_text = ", ".join(keywords) if keywords else f"{brand} {product}"

    user_prompt = _PLATFORM_USER_TMPL[platform].format(
        brand=brand,
        product=product,
        market=market,
        geo_gaps_text=geo_gaps_text,
        keywords_text=keywords_text,
        language=language,
    )

    logger.info("Generating %s content for %s/%s (lang=%s)", platform, brand, product, language)

    msg = await client.messages.create(
        model=_CONTENT_MODEL,
        max_tokens=2000,
        system=_PLATFORM_SYSTEM[platform],
        messages=[{"role": "user", "content": user_prompt}],
    )

    raw = msg.content[0].text if msg.content else "{}"

    # Extract JSON from response
    try:
        # Handle markdown code blocks
        if "```json" in raw:
            raw = raw.split("```json")[1].split("```")[0].strip()
        elif "```" in raw:
            raw = raw.split("```")[1].split("```")[0].strip()
        result = json.loads(raw)
    except (json.JSONDecodeError, IndexError):
        # Fallback: treat the whole response as body
        result = {
            "title": f"{brand} {product} — {platform.title()} Content",
            "body": raw,
            "hashtags": [f"#{brand.lower().replace(' ', '')}", f"#{product.lower().replace(' ', '')}"],
            "metadata": {"raw": True},
        }

    # Ensure required keys exist
    result.setdefault("title", f"{brand} — {platform}")
    result.setdefault("body", "")
    result.setdefault("hashtags", [])
    result.setdefault("metadata", {})

    logger.info("Generated %s content: title=%s, body_len=%d", platform, result["title"][:50], len(result["body"]))
    return result


async def generate_batch(
    items: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Batch-generate content for multiple items.
    Each item: {brand, product, platform, market, geo_gaps, keywords, language}
    Returns list of {index, result | error} dicts.
    """
    import asyncio

    async def _one(idx: int, item: dict) -> dict:
        try:
            result = await generate_content(**item)
            return {"index": idx, "result": result}
        except Exception as exc:
            logger.error("Batch item %d failed: %s", idx, exc)
            return {"index": idx, "error": str(exc)}

    tasks = [_one(i, item) for i, item in enumerate(items)]
    return await asyncio.gather(*tasks)
