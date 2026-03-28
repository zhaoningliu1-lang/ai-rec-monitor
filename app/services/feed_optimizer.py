"""ChatGPT Product Feed Optimizer — analyze brand's product data against ACP Feed Spec.

Scores product data completeness against OpenAI's Agentic Commerce Protocol feed spec,
identifies missing/weak fields, and generates an optimized feed JSON ready for submission.

Reference: https://developers.openai.com/commerce/specs/feed/
"""

import logging
from dataclasses import dataclass, field, asdict
from typing import Any

logger = logging.getLogger(__name__)

# ── ACP Feed Spec Field Definitions ────────────────────────────────────────

# Fields and their weights for scoring (higher = more important for ranking)
FEED_FIELDS = {
    # Product-level
    "id": {"required": True, "weight": 10, "category": "identity", "tip": "Stable unique identifier (ASIN works)"},
    "title": {"required": False, "weight": 9, "category": "content", "tip": "Concise, factual product title. Include brand, key feature, size/quantity"},
    "description": {"required": False, "weight": 8, "category": "content", "tip": "Plain text or markdown. Factual, not marketing-heavy. Include specs, materials, certifications"},
    "url": {"required": False, "weight": 7, "category": "identity", "tip": "Canonical product URL with utm_medium=feed tracking"},
    "media": {"required": False, "weight": 8, "category": "media", "tip": "At least 1 high-res image. Multiple angles recommended. Alt text required"},
    # Variant-level
    "variant_id": {"required": True, "weight": 10, "category": "identity", "tip": "Unique variant ID, stable over time"},
    "variant_title": {"required": True, "weight": 9, "category": "content", "tip": "Variant-specific title (e.g., 'Blue, 12-inch')"},
    "price": {"required": False, "weight": 9, "category": "pricing", "tip": "Active sale price in ISO 4217 minor units (e.g., 3499 = $34.99 USD)"},
    "list_price": {"required": False, "weight": 5, "category": "pricing", "tip": "Original MSRP before discount. Shows savings to AI"},
    "availability": {"required": False, "weight": 8, "category": "availability", "tip": "in_stock / out_of_stock / preorder / backorder"},
    "categories": {"required": False, "weight": 7, "category": "taxonomy", "tip": "Specific categories (e.g., 'Kitchen > Cookware > Woks' not just 'Kitchen')"},
    "condition": {"required": False, "weight": 3, "category": "metadata", "tip": "'new' or 'secondhand'"},
    "variant_options": {"required": False, "weight": 6, "category": "variants", "tip": "Color, size, material dimensions for each variant"},
    "barcodes": {"required": False, "weight": 6, "category": "identity", "tip": "UPC/EAN/GTIN — helps AI identify exact products"},
    "seller_name": {"required": False, "weight": 5, "category": "seller", "tip": "Consistent seller/brand name across all products"},
    "seller_policies": {"required": False, "weight": 4, "category": "seller", "tip": "Links to privacy policy, refund policy, shipping policy, FAQ"},
}

MAX_SCORE = sum(f["weight"] for f in FEED_FIELDS.values())


@dataclass
class FeedFieldScore:
    field_name: str
    status: str  # "present" | "missing" | "weak"
    score: int  # 0 to weight
    max_score: int
    tip: str
    category: str
    current_value: str = ""


@dataclass
class FeedOptimizationResult:
    brand: str
    total_score: int
    max_score: int
    score_pct: float
    grade: str  # A/B/C/D/F
    field_scores: list[FeedFieldScore] = field(default_factory=list)
    missing_critical: list[str] = field(default_factory=list)
    missing_recommended: list[str] = field(default_factory=list)
    optimization_tips: list[str] = field(default_factory=list)
    feed_json: dict | None = None  # Generated ACP-compatible feed
    product_count: int = 0

    def to_dict(self) -> dict:
        d = asdict(self)
        d["field_scores"] = [asdict(f) for f in self.field_scores]
        return d


def _grade(pct: float) -> str:
    if pct >= 90:
        return "A"
    if pct >= 75:
        return "B"
    if pct >= 60:
        return "C"
    if pct >= 40:
        return "D"
    return "F"


def score_product(product: dict, brand: str) -> tuple[list[FeedFieldScore], int]:
    """Score a single Amazon product against ACP feed spec."""
    scores: list[FeedFieldScore] = []
    total = 0

    title = product.get("title", "")
    description = ""  # Amazon API doesn't return full description
    price = product.get("price", 0)
    rating = product.get("rating", 0)
    reviews = product.get("reviews", 0)
    asin = product.get("asin", "")
    url = product.get("url", "")

    # id
    f = FEED_FIELDS["id"]
    if asin:
        scores.append(FeedFieldScore("id", "present", f["weight"], f["weight"], f["tip"], f["category"], asin))
        total += f["weight"]
    else:
        scores.append(FeedFieldScore("id", "missing", 0, f["weight"], f["tip"], f["category"]))

    # title
    f = FEED_FIELDS["title"]
    if title and len(title) > 10:
        # Check quality: does it include brand name?
        has_brand = brand.lower() in title.lower()
        sc = f["weight"] if has_brand and len(title) > 30 else int(f["weight"] * 0.6)
        status = "present" if has_brand else "weak"
        scores.append(FeedFieldScore("title", status, sc, f["weight"], f["tip"], f["category"], title[:80]))
        total += sc
    else:
        scores.append(FeedFieldScore("title", "missing", 0, f["weight"], f["tip"], f["category"]))

    # description
    f = FEED_FIELDS["description"]
    # Amazon Rainforest API doesn't return description, so this is always "missing"
    scores.append(FeedFieldScore("description", "missing", 0, f["weight"],
                                 "Amazon API doesn't provide descriptions. Add manually or generate with AI.", f["category"]))

    # url
    f = FEED_FIELDS["url"]
    if url:
        has_tracking = "utm_" in url
        sc = f["weight"] if has_tracking else int(f["weight"] * 0.7)
        scores.append(FeedFieldScore("url", "present" if has_tracking else "weak", sc, f["weight"], f["tip"], f["category"], url[:60]))
        total += sc
    else:
        scores.append(FeedFieldScore("url", "missing", 0, f["weight"], f["tip"], f["category"]))

    # media (image)
    f = FEED_FIELDS["media"]
    # Amazon products always have images, but we don't get them from search_brand
    scores.append(FeedFieldScore("media", "weak", int(f["weight"] * 0.5), f["weight"],
                                 "Amazon images exist but need direct URLs. Include alt_text for AI accessibility.", f["category"]))
    total += int(f["weight"] * 0.5)

    # variant_id
    f = FEED_FIELDS["variant_id"]
    if asin:
        scores.append(FeedFieldScore("variant_id", "present", f["weight"], f["weight"], f["tip"], f["category"], asin))
        total += f["weight"]
    else:
        scores.append(FeedFieldScore("variant_id", "missing", 0, f["weight"], f["tip"], f["category"]))

    # variant_title
    f = FEED_FIELDS["variant_title"]
    if title:
        scores.append(FeedFieldScore("variant_title", "present", f["weight"], f["weight"], f["tip"], f["category"], title[:50]))
        total += f["weight"]
    else:
        scores.append(FeedFieldScore("variant_title", "missing", 0, f["weight"], f["tip"], f["category"]))

    # price
    f = FEED_FIELDS["price"]
    if price and price > 0:
        scores.append(FeedFieldScore("price", "present", f["weight"], f["weight"], f["tip"], f["category"], f"${price}"))
        total += f["weight"]
    else:
        scores.append(FeedFieldScore("price", "missing", 0, f["weight"], f["tip"], f["category"]))

    # list_price (MSRP)
    f = FEED_FIELDS["list_price"]
    scores.append(FeedFieldScore("list_price", "missing", 0, f["weight"],
                                 "Add original MSRP to show savings. AI uses this for 'best deal' recommendations.", f["category"]))

    # availability
    f = FEED_FIELDS["availability"]
    # Assume in-stock if product is listed
    scores.append(FeedFieldScore("availability", "present", f["weight"], f["weight"], f["tip"], f["category"], "in_stock"))
    total += f["weight"]

    # categories
    f = FEED_FIELDS["categories"]
    scores.append(FeedFieldScore("categories", "missing", 0, f["weight"],
                                 "Add specific taxonomy (e.g., 'Home & Kitchen > Cookware > Woks'). Use Google Product Category taxonomy.", f["category"]))

    # condition
    f = FEED_FIELDS["condition"]
    scores.append(FeedFieldScore("condition", "present", f["weight"], f["weight"], f["tip"], f["category"], "new"))
    total += f["weight"]

    # variant_options
    f = FEED_FIELDS["variant_options"]
    scores.append(FeedFieldScore("variant_options", "missing", 0, f["weight"],
                                 "Add color, size, material options. AI uses these for filtering recommendations.", f["category"]))

    # barcodes
    f = FEED_FIELDS["barcodes"]
    scores.append(FeedFieldScore("barcodes", "missing", 0, f["weight"],
                                 "Add UPC/EAN/GTIN. Helps AI match exact products across platforms.", f["category"]))

    # seller_name
    f = FEED_FIELDS["seller_name"]
    scores.append(FeedFieldScore("seller_name", "present", f["weight"], f["weight"], f["tip"], f["category"], brand))
    total += f["weight"]

    # seller_policies
    f = FEED_FIELDS["seller_policies"]
    scores.append(FeedFieldScore("seller_policies", "missing", 0, f["weight"],
                                 "Add links to privacy policy, refund policy, FAQ. Builds trust with AI engines.", f["category"]))

    return scores, total


def _generate_feed_json(brand: str, products: list[dict]) -> dict:
    """Generate ACP-compatible feed JSON from Amazon product data."""
    feed_products = []
    for p in products:
        asin = p.get("asin", "")
        title = p.get("title", "")
        price = p.get("price", 0)
        url = p.get("url", "")

        if not asin or not title:
            continue

        price_minor = int(price * 100) if price else 0

        feed_products.append({
            "id": asin,
            "title": title,
            "url": f"{url}{'&' if '?' in url else '?'}utm_medium=feed&utm_source=chatgpt" if url else None,
            "variants": [{
                "id": asin,
                "title": title,
                "price": {"amount": price_minor, "currency": "USD"} if price_minor > 0 else None,
                "availability": {"available": True, "status": "in_stock"},
                "condition": ["new"],
            }],
        })

    return {
        "_spec": "ACP Product Feed (draft)",
        "_generated_by": "Avanti A2A Feed Optimizer",
        "_note": "Submit to chatgpt.com/merchants or via ACP API",
        "header": {
            "feed_id": f"avanti-{brand.lower().replace(' ', '-')}",
            "target_country": "US",
        },
        "products": feed_products,
    }


async def analyze_brand_feed(brand: str) -> FeedOptimizationResult:
    """Analyze a brand's Amazon products against ChatGPT ACP feed spec.

    Returns a scored assessment with optimization tips and generated feed JSON.
    """
    from app.services.amazon_service import search_brand

    try:
        data = await search_brand(brand)
    except Exception as e:
        logger.error("Failed to fetch brand data: %s", e)
        return FeedOptimizationResult(brand=brand, total_score=0, max_score=MAX_SCORE, score_pct=0, grade="F")

    if not data or not data.get("top_products"):
        return FeedOptimizationResult(brand=brand, total_score=0, max_score=MAX_SCORE, score_pct=0, grade="F",
                                      optimization_tips=["No products found on Amazon. Submit products to chatgpt.com/merchants manually."])

    products = data["top_products"]

    # Score each product
    all_scores: list[FeedFieldScore] = []
    total_score = 0
    for p in products[:10]:  # Score up to 10 products
        pscores, ptotal = score_product(p, brand)
        all_scores.extend(pscores)
        total_score += ptotal

    # Average score across products
    product_count = min(len(products), 10)
    avg_score = total_score // product_count if product_count > 0 else 0
    score_pct = round(avg_score / MAX_SCORE * 100, 1)

    # Identify missing fields
    field_summary: dict[str, list[str]] = {}
    for fs in all_scores:
        if fs.field_name not in field_summary:
            field_summary[fs.field_name] = []
        field_summary[fs.field_name].append(fs.status)

    missing_critical = []
    missing_recommended = []
    for fname, statuses in field_summary.items():
        missing_count = statuses.count("missing") + statuses.count("weak")
        if missing_count > product_count * 0.5:
            fdef = FEED_FIELDS.get(fname, {})
            if fdef.get("weight", 0) >= 7:
                missing_critical.append(fname)
            else:
                missing_recommended.append(fname)

    # Generate optimization tips
    tips = []
    if "description" in missing_critical:
        tips.append("CRITICAL: Add product descriptions. ChatGPT uses descriptions to generate recommendations. Use AI to generate factual, spec-rich descriptions from your Amazon listings.")
    if "categories" in missing_critical or "categories" in missing_recommended:
        tips.append("Add specific product categories using Google Product Taxonomy. 'Home & Kitchen > Cookware > Woks' ranks better than just 'Cookware'.")
    if "barcodes" in missing_recommended:
        tips.append("Add UPC/EAN barcodes. Helps ChatGPT match your products across platforms and verify authenticity.")
    if "variant_options" in missing_recommended:
        tips.append("Add variant options (color, size, material). ChatGPT uses these for filtering: 'show me the 12-inch version in blue'.")
    if "seller_policies" in missing_recommended:
        tips.append("Add seller policy links (refund, shipping, FAQ). Builds trust score with AI engines.")
    if "list_price" in missing_recommended:
        tips.append("Add original MSRP (list_price). ChatGPT uses price comparison for 'best deal' recommendations.")
    if "media" in missing_critical:
        tips.append("Ensure all products have high-res images with alt_text. AI uses alt_text for accessibility and matching.")

    if score_pct >= 75:
        tips.append(f"Your feed scores {score_pct}% — good foundation. Focus on adding descriptions and categories to reach 90%+.")
    elif score_pct >= 50:
        tips.append(f"Your feed scores {score_pct}% — needs improvement. Add descriptions, categories, and barcodes to be competitive.")
    else:
        tips.append(f"Your feed scores {score_pct}% — significant gaps. Many fields missing. Start with descriptions and categories.")

    tips.append("Submit your optimized feed at chatgpt.com/merchants — it's free and Shopify stores are auto-enrolled.")

    # Generate feed JSON
    feed_json = _generate_feed_json(brand, products)

    # Deduplicate field scores to per-field summary
    summary_scores: list[FeedFieldScore] = []
    seen = set()
    for fs in all_scores:
        if fs.field_name not in seen:
            seen.add(fs.field_name)
            summary_scores.append(fs)

    return FeedOptimizationResult(
        brand=brand,
        total_score=avg_score,
        max_score=MAX_SCORE,
        score_pct=score_pct,
        grade=_grade(score_pct),
        field_scores=summary_scores,
        missing_critical=missing_critical,
        missing_recommended=missing_recommended,
        optimization_tips=tips,
        feed_json=feed_json,
        product_count=product_count,
    )
