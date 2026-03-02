"""Generate buyer-intent prompts for a given category, region, and intent type."""
import random
from typing import Literal, Optional

Region = Literal["US", "UK", "DE"]

_DEFAULT_PRICE_BANDS: dict[str, str] = {
    "US": "under $100",
    "UK": "under £80",
    "DE": "unter 100 Euro",
}

# ── US Templates ──────────────────────────────────────────────────────────────

_US_HIGH_INTENT = [
    "I want to buy a {category} {price_band} — which brand should I choose?",
    "What's the best {category} brand for {price_band} on Amazon?",
    "I'm ready to order a {category} today — top recommendation {price_band}?",
    "Which {category} brand gives the best value for {price_band}?",
    "I need a reliable {category} {price_band} — what do you recommend?",
    "What's the top-rated {category} available {price_band} right now?",
    "I'm buying a {category} this weekend — best pick {price_band}?",
    "Quick recommendation: best {category} brand {price_band} for everyday use?",
    "Which {category} should I add to my cart today? Budget: {price_band}.",
    "What {category} brand do most Americans buy {price_band}?",
    "I want to order a {category} on Amazon Prime — best option {price_band}?",
    "What's the most popular {category} brand in the US {price_band}?",
    "Which {category} brand has the best reviews {price_band}?",
    "I need a durable {category} — which brand lasts longest {price_band}?",
    "Recommend a gift-worthy {category} {price_band} for an American buyer.",
    "Best {category} brand for home use {price_band}?",
    "Which {category} brand do you trust most for a {price_band} purchase?",
    "What's your #1 {category} recommendation {price_band}?",
    "I have {price_band} to spend on a {category} — what should I get?",
    "Which {category} brand would you buy yourself for {price_band}?",
    "Top {category} pick {price_band} with fast Amazon shipping?",
    "Best {category} deal {price_band} available in the US right now?",
    "Which {category} brand offers the best warranty {price_band}?",
    "Ready to buy a {category} — recommend a brand {price_band}.",
    "What {category} brand do tech reviewers recommend {price_band}?",
    "I want a first-class {category} {price_band} — your top suggestion?",
    "Best {category} for a budget-conscious US shopper — {price_band}?",
    "Which {category} would you gift someone for {price_band}?",
    "What's the safest {category} brand to buy online for {price_band}?",
    "Top-selling {category} brand in America {price_band}?",
]

_US_COMPARISON_INTENT = [
    "Compare the top {category} brands for US buyers.",
    "What's the difference between the leading {category} brands?",
    "How does the best {category} brand compare to its competitors?",
    "Which {category} brand has the edge — quality vs price in the US?",
    "Side-by-side: which {category} brand wins for US Amazon shoppers?",
    "Can you rank the top {category} brands available in the US?",
    "Which {category} brand offers more for the money — give me a comparison.",
    "What are the pros and cons of the top {category} brands?",
    "Which {category} brand beats the others in customer satisfaction?",
    "Compare {category} brands for durability and value in the US market.",
    "What separates the best {category} brand from the rest?",
    "Which {category} brand has the best ratings vs price ratio?",
    "Give me a comparison of {category} options for US shoppers.",
    "How do the top-selling {category} brands stack up against each other?",
    "Which {category} brand consistently outperforms competitors?",
]

_US_INFORMATIONAL_INTENT = [
    "What should I look for when buying a {category}?",
    "What features matter most in a {category}?",
    "How do I choose the right {category} brand?",
    "What are the most trusted {category} brands among US consumers?",
    "What makes a {category} brand reliable?",
    "How do {category} brands differ in quality?",
    "What do experts say about {category} brands in 2024?",
    "Which {category} brands have the best reputation in the US?",
    "What certifications should a good {category} brand have?",
    "How long do {category} products typically last?",
    "What are common complaints about {category} brands?",
    "Which {category} brands have the best after-sales support?",
    "What should I know before buying a {category}?",
    "How do {category} prices compare across different brands?",
    "What are the trending {category} brands among American buyers?",
]

# ── UK Templates ──────────────────────────────────────────────────────────────

_UK_HIGH_INTENT = [
    "I want to buy a {category} {price_band} — best brand in the UK?",
    "Which {category} brand ships reliably in the UK for {price_band}?",
    "I'm ordering a {category} from Amazon UK today — best pick {price_band}?",
    "Which {category} gives the best value for {price_band} in the UK?",
    "I need a {category} {price_band} that delivers quickly to the UK.",
    "Best {category} brand for a UK buyer with a budget of {price_band}?",
    "What {category} would UK shoppers recommend for {price_band}?",
    "Ready to buy a {category} on Amazon UK — top choice {price_band}?",
    "Which {category} brand do UK buyers trust most for {price_band}?",
    "I need a {category} gift {price_band} — what's best for a UK recipient?",
    "Best {category} brand in the UK right now for {price_band}?",
    "Which {category} has the best Amazon UK reviews for {price_band}?",
    "Top {category} recommendation {price_band} with UK warranty?",
    "Which {category} brand delivers to England fastest for {price_band}?",
    "I want a reliable {category} {price_band} for everyday UK use.",
    "What's the top-selling {category} on Amazon UK for {price_band}?",
    "Which UK {category} brand offers the best deal for {price_band}?",
    "Best {category} for a British buyer — budget: {price_band}.",
    "I'm buying a {category} in the UK this week — pick for {price_band}?",
    "Which {category} brand is worth the money in the UK for {price_band}?",
    "Top-rated {category} brand in the UK for {price_band}?",
    "Which {category} would you buy in the UK for {price_band}?",
    "Best {category} on Amazon UK {price_band} with fast delivery?",
    "What {category} brand do UK tech reviewers recommend for {price_band}?",
    "I need a durable {category} {price_band} shipped to the UK.",
    "Which {category} brand is most popular in the UK for {price_band}?",
    "Best value {category} brand for UK buyers — {price_band}?",
    "Which {category} should I order from Amazon UK today for {price_band}?",
    "Top {category} choice for a first-time UK buyer — {price_band}?",
    "Which {category} brand is trusted by UK reviewers for {price_band}?",
]

_UK_COMPARISON_INTENT = [
    "Compare the top {category} brands available in the UK.",
    "Which {category} brand has the best value for UK shoppers?",
    "How do the leading {category} brands compare for UK buyers?",
    "What are the pros and cons of the top {category} brands in the UK?",
    "Which {category} brand wins for quality vs price in the UK?",
    "Rank the best {category} brands sold on Amazon UK.",
    "Side-by-side: best {category} brands for British consumers.",
    "How does the top {category} brand compare to UK competitors?",
    "Which {category} brand consistently beats others in UK reviews?",
    "Compare {category} brands for durability in the UK market.",
    "Which {category} option is better value in the UK?",
    "What separates the best UK {category} brands from the rest?",
    "Which {category} brand has the highest UK customer satisfaction?",
    "How do UK {category} brand prices compare?",
    "Give me a comparison of {category} choices for UK buyers.",
]

_UK_INFORMATIONAL_INTENT = [
    "What should I look for when buying a {category} in the UK?",
    "What features matter most in a {category} for UK buyers?",
    "What are the most trusted {category} brands among UK consumers?",
    "How do I choose the right {category} brand as a UK shopper?",
    "What do British reviewers say about {category} brands?",
    "Which {category} brands have the best reputation in the UK?",
    "What certifications should a quality {category} have in the UK?",
    "What are common complaints about {category} brands from UK buyers?",
    "Which {category} brands have the best UK after-sales support?",
    "What should I know before buying a {category} in the UK?",
    "How do {category} prices vary across UK retailers?",
    "What are trending {category} brands among British buyers in 2024?",
    "Are there UK-specific {category} brands worth considering?",
    "What warranty laws protect UK {category} buyers?",
    "How long do popular {category} brands last according to UK users?",
]

# ── DE Templates ──────────────────────────────────────────────────────────────

_DE_HIGH_INTENT = [
    "Ich möchte heute eine {category} kaufen — beste Marke für {price_band}?",
    "Welche {category} Marke ist {price_band} auf Amazon.de empfehlenswert?",
    "Ich bestelle heute eine {category} — bestes Modell für {price_band}?",
    "Welche {category} bietet das beste Preis-Leistungs-Verhältnis für {price_band}?",
    "Ich brauche eine {category} {price_band} mit schnellem Versand in Deutschland.",
    "Beste {category} Marke für einen deutschen Käufer mit Budget {price_band}?",
    "Welche {category} Marke vertrauen deutsche Käufer am meisten für {price_band}?",
    "Ich kaufe dieses Wochenende eine {category} — Empfehlung für {price_band}?",
    "Top {category} Empfehlung für {price_band} mit deutschem Versand?",
    "Which {category} brand should I buy in Germany for {price_band}?",
    "Best {category} available on Amazon.de for {price_band}?",
    "I need a {category} {price_band} shipped within Germany — top pick?",
    "Which {category} brand do German buyers recommend for {price_band}?",
    "Top-rated {category} on Amazon.de for {price_band}?",
    "Best value {category} brand in Germany for {price_band}?",
    "I'm buying a {category} in Germany — best option for {price_band}?",
    "Which {category} brand is most trusted in Germany for {price_band}?",
    "What {category} would German tech reviewers recommend for {price_band}?",
    "I need a durable {category} {price_band} for the German market.",
    "Which {category} is best for a German buyer on a budget of {price_band}?",
    "Welche {category} Marke ist die beste Wahl für {price_band} in Deutschland?",
    "Ich suche eine {category} als Geschenk für {price_band} — was empfehlen Sie?",
    "Welche {category} Marke bekomme ich für {price_band} auf Amazon.de?",
    "Top {category} Kauf für {price_band} in Deutschland — Ihre Empfehlung?",
    "Which {category} brand offers the best German warranty for {price_band}?",
    "Best {category} deal in the DACH region for {price_band}?",
    "Which {category} to buy on Amazon.de today for {price_band}?",
    "I want a reliable {category} {price_band} — German market recommendation?",
    "Was kostet eine gute {category} in Deutschland und welche Marke lohnt sich für {price_band}?",
    "Top {category} brand for German online shoppers — {price_band}?",
]

_DE_COMPARISON_INTENT = [
    "Vergleichen Sie die besten {category} Marken für deutsche Käufer.",
    "Welche {category} Marke bietet das beste Preis-Leistungs-Verhältnis in Deutschland?",
    "Wie unterscheiden sich die führenden {category} Marken in Deutschland?",
    "Compare the top {category} brands available in Germany.",
    "Which {category} brand wins for German shoppers — quality vs price?",
    "Rank the best {category} brands sold in Germany.",
    "Was sind die Vor- und Nachteile der top {category} Marken in Deutschland?",
    "How do the leading {category} brands compare for German buyers?",
    "Which {category} brand consistently outperforms others in Germany?",
    "Compare {category} brands for durability in the German market.",
    "Which {category} brand has the highest customer satisfaction in Germany?",
    "How do {category} brand prices compare in the DACH region?",
    "Side-by-side: best {category} options for German consumers.",
    "What separates the top {category} brands in Germany?",
    "Welche {category} Marke schlägt die Konkurrenz in Deutschland?",
]

_DE_INFORMATIONAL_INTENT = [
    "Worauf sollte ich beim Kauf einer {category} in Deutschland achten?",
    "Was sind die vertrauenswürdigsten {category} Marken in Deutschland?",
    "What should I know before buying a {category} in Germany?",
    "What do German reviewers say about {category} brands?",
    "Which {category} brands are most popular in Germany?",
    "Was sind häufige Beschwerden über {category} Marken in Deutschland?",
    "What certifications should a quality {category} have for the German market?",
    "Which {category} brands have the best after-sales support in Germany?",
    "How do {category} brand prices vary across German retailers?",
    "What are trending {category} brands among German buyers in 2024?",
    "Welche {category} Marken sind bei deutschen Verbrauchern am beliebtesten?",
    "Was macht eine gute {category} Marke auf dem deutschen Markt aus?",
    "How long do {category} products typically last according to German users?",
    "What are the top-selling {category} brands in the DACH region?",
    "Welche {category} Marke hat den besten Kundendienst in Deutschland?",
]

# ── Registry ──────────────────────────────────────────────────────────────────

_INTENT_WEIGHTS: dict[str, float] = {
    "high": 1.5,
    "comparison": 1.2,
    "info": 1.0,
}

_REGION_INTENT_TEMPLATES: dict[str, dict[str, list[str]]] = {
    "US": {
        "high": _US_HIGH_INTENT,
        "comparison": _US_COMPARISON_INTENT,
        "info": _US_INFORMATIONAL_INTENT,
    },
    "UK": {
        "high": _UK_HIGH_INTENT,
        "comparison": _UK_COMPARISON_INTENT,
        "info": _UK_INFORMATIONAL_INTENT,
    },
    "DE": {
        "high": _DE_HIGH_INTENT,
        "comparison": _DE_COMPARISON_INTENT,
        "info": _DE_INFORMATIONAL_INTENT,
    },
}


def _sample_cyclic(templates: list[str], n: int) -> list[str]:
    """Return n items by cycling through templates, then shuffling."""
    if not templates or n == 0:
        return []
    full_cycles = n // len(templates)
    remainder = n % len(templates)
    pool = templates * full_cycles + random.sample(templates, remainder)
    random.shuffle(pool)
    return pool


def generate_prompts(
    category: str,
    region: Region,
    num_prompts: int = 60,
    price_band: Optional[str] = None,
) -> list[dict]:
    """
    Return a list of `num_prompts` buyer-intent prompt dicts.

    Each dict has:
      - 'prompt': the rendered prompt string
      - 'intent_type': one of 'high', 'comparison', 'info'
      - 'weight': float (1.5 / 1.2 / 1.0)

    Distribution: 50% high, 25% comparison, 25% info.
    For the default of 60: 30 / 15 / 15.
    """
    band = price_band or _DEFAULT_PRICE_BANDS.get(region, "under $100")
    intent_map = _REGION_INTENT_TEMPLATES.get(region, _REGION_INTENT_TEMPLATES["US"])

    n_high = num_prompts // 2
    n_comp = num_prompts // 4
    n_info = num_prompts - n_high - n_comp  # absorbs any odd remainder

    results: list[dict] = []
    for intent_type, n in [
        ("high", n_high),
        ("comparison", n_comp),
        ("info", n_info),
    ]:
        templates = intent_map[intent_type]
        for tmpl in _sample_cyclic(templates, n):
            results.append({
                "prompt": tmpl.format(category=category, price_band=band),
                "intent_type": intent_type,
                "weight": _INTENT_WEIGHTS[intent_type],
            })

    random.shuffle(results)
    return results
