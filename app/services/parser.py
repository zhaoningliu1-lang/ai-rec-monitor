"""Parse OpenAI responses for brand mentions and sentiment."""
import re
from typing import Literal

# Matches numbered lists (1. / 1) or bullet lists (- / * / •)
_LIST_RE = re.compile(r"^\s*(\d+[\.\)]\s+|[-*•]\s+)", re.MULTILINE)

# Matches http/https URLs (including markdown link syntax)
_URL_RE = re.compile(r'https?://[^\s\)\]\>"\'<]+')


POSITIVE_WORDS = {
    "recommend", "love", "great", "best", "top", "excellent",
    "reliable", "trusted", "outstanding", "perfect", "fantastic",
    "superior", "quality", "solid", "amazing", "impressive",
}
NEGATIVE_WORDS = {
    "avoid", "bad", "poor", "overpriced", "cheap", "unreliable",
    "terrible", "worst", "disappointing", "inferior", "flimsy",
    "fragile", "defective", "broken", "useless", "waste",
}

Sentiment = Literal["positive", "neutral", "negative"]


def extract_cited_urls(text: str) -> list[str]:
    """Extract unique URLs from an AI response, cleaning trailing punctuation."""
    raw = _URL_RE.findall(text)
    cleaned = [u.rstrip(".,;:!?)]}") for u in raw]
    seen: set[str] = set()
    result: list[str] = []
    for u in cleaned:
        if u not in seen:
            seen.add(u)
            result.append(u)
    return result


def detect_list(text: str) -> bool:
    """Return True if the response contains a numbered or bulleted list."""
    return bool(_LIST_RE.search(text))


def find_mention_position(text: str, brand: str) -> int | None:
    """
    Return the word index of the first occurrence of `brand` in `text`,
    or None if not found. Case-insensitive substring match on each word.
    """
    words = text.lower().split()
    brand_lower = brand.lower()
    for i, word in enumerate(words):
        # Strip punctuation for cleaner matching
        clean_word = word.strip(".,;:!?\"'()-[]")
        if brand_lower in clean_word or clean_word in brand_lower:
            return i
    return None


def score_sentiment(text: str, brand: str) -> Sentiment:
    """
    Score sentiment toward `brand` in `text` using a keyword window.
    Extracts a 60-word window centered on the brand mention, then
    counts positive and negative keyword hits.
    """
    words = text.lower().split()
    position = find_mention_position(text, brand)

    if position is None:
        return "neutral"

    # Extract a window of ±30 words around the mention
    start = max(0, position - 30)
    end = min(len(words), position + 30)
    window = words[start:end]

    pos_count = sum(1 for w in window if w.strip(".,;:!?\"'()-[]") in POSITIVE_WORDS)
    neg_count = sum(1 for w in window if w.strip(".,;:!?\"'()-[]") in NEGATIVE_WORDS)

    if pos_count > neg_count:
        return "positive"
    if neg_count > pos_count:
        return "negative"
    return "neutral"


def parse_response(
    response_text: str,
    brand_name: str,
    competitor_names: list[str],
) -> dict:
    """
    Parse a single OpenAI response and return a structured result dict.

    Returns:
        {
            "brand_mentioned": bool,
            "brand_mention_position": int | None,
            "brand_sentiment": "positive" | "neutral" | "negative",
            "competitors_data": {
                "<competitor>": {"mentioned": bool, "position": int | None}
            }
        }
    """
    brand_pos = find_mention_position(response_text, brand_name)
    brand_mentioned = brand_pos is not None
    brand_sentiment = score_sentiment(response_text, brand_name) if brand_mentioned else "neutral"

    competitors_data: dict[str, dict] = {}
    for comp in competitor_names:
        comp_pos = find_mention_position(response_text, comp)
        competitors_data[comp] = {
            "mentioned": comp_pos is not None,
            "position": comp_pos,
        }

    return {
        "brand_mentioned": brand_mentioned,
        "brand_mention_position": brand_pos,
        "brand_sentiment": brand_sentiment,
        "competitors_data": competitors_data,
        "cited_urls": extract_cited_urls(response_text),
    }
