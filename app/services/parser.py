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


def find_mention_position(text: str, brand: str, aliases: list[str] | None = None) -> int | None:
    """
    Return the word index of the first occurrence of `brand` (or any alias) in `text`.
    Case-insensitive substring match. Returns the earliest position found across all names.

    `aliases` should include the original brand name plus any alternate forms
    (e.g. ["绿联", "UGREEN"]).
    """
    all_names = aliases if aliases else [brand]
    words = text.lower().split()
    best: int | None = None
    for name in all_names:
        name_lower = name.lower()
        for i, word in enumerate(words):
            clean_word = word.strip(".,;:!?\"'()-[]")
            if name_lower in clean_word or clean_word in name_lower:
                if best is None or i < best:
                    best = i
                break  # found earliest for this name; check next name
    return best


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
    name_aliases: dict[str, list[str]] | None = None,
) -> dict:
    """
    Parse a single AI response and return a structured result dict.

    `name_aliases` maps each brand/competitor name to a list of all its known
    forms, e.g. {"绿联": ["绿联", "UGREEN"], "安克": ["安克", "Anker"]}.
    This ensures Chinese brand names are matched even when AI responds in English.

    Returns:
        {
            "brand_mentioned": bool,
            "brand_mention_position": int | None,
            "brand_sentiment": "positive" | "neutral" | "negative",
            "competitors_data": {
                "<competitor>": {"mentioned": bool, "position": int | None}
            },
            "cited_urls": list[str],
        }
    """
    aliases = name_aliases or {}
    brand_aliases = aliases.get(brand_name, [brand_name])

    brand_pos = find_mention_position(response_text, brand_name, brand_aliases)
    brand_mentioned = brand_pos is not None
    # For sentiment, use the alias that was actually found in text
    effective_brand = next(
        (a for a in brand_aliases if find_mention_position(response_text, a, [a]) is not None),
        brand_name,
    )
    brand_sentiment = score_sentiment(response_text, effective_brand) if brand_mentioned else "neutral"

    competitors_data: dict[str, dict] = {}
    for comp in competitor_names:
        comp_aliases = aliases.get(comp, [comp])
        comp_pos = find_mention_position(response_text, comp, comp_aliases)
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
