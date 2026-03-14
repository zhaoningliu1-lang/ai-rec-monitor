"""Selection Intelligence — aggregates leaderboard + cross-platform signals."""

import asyncio
import logging
from collections import defaultdict
from datetime import datetime, timezone

from sqlalchemy import func, select, distinct
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Run, RunSnapshot

logger = logging.getLogger(__name__)

# ── Category metadata (seeded from frontend selection-data.ts) ──────────────

CATEGORY_META: dict[str, dict] = {
    "portable power stations": {
        "id": "portable-power", "zh": "便携储能",
        "section": "Consumer Electronics", "section_zh": "消费电子",
        "platforms": ["Amazon", "DTC"],
    },
    "usb-c chargers & cables": {
        "id": "usb-c-chargers", "zh": "USB-C 充电器 & 数据线",
        "section": "Consumer Electronics", "section_zh": "消费电子",
        "platforms": ["Amazon", "Shopee"],
    },
    "wireless earbuds": {
        "id": "wireless-earbuds", "zh": "真无线耳机",
        "section": "Consumer Electronics", "section_zh": "消费电子",
        "platforms": ["Amazon", "TikTok", "Shopee"],
    },
    "action cameras": {
        "id": "action-cameras", "zh": "运动相机",
        "section": "Consumer Electronics", "section_zh": "消费电子",
        "platforms": ["Amazon", "DTC"],
    },
    "phone cases & accessories": {
        "id": "phone-accessories", "zh": "手机壳 & 配件",
        "section": "Consumer Electronics", "section_zh": "消费电子",
        "platforms": ["Amazon", "TikTok", "Shopee"],
    },
    "camping & hiking gear": {
        "id": "camping-gear", "zh": "露营户外装备",
        "section": "Outdoor & Sports", "section_zh": "运动户外",
        "platforms": ["Amazon", "DTC"],
    },
    "portable solar panels": {
        "id": "solar-panels", "zh": "便携太阳能板",
        "section": "Outdoor & Sports", "section_zh": "运动户外",
        "platforms": ["Amazon", "DTC"],
    },
    "home fitness equipment": {
        "id": "fitness-equipment", "zh": "家用健身器材",
        "section": "Outdoor & Sports", "section_zh": "运动户外",
        "platforms": ["Amazon", "TikTok"],
    },
    "smart home devices": {
        "id": "smart-home", "zh": "智能家居设备",
        "section": "Home & Kitchen", "section_zh": "家居厨房",
        "platforms": ["Amazon", "DTC"],
    },
    "small kitchen appliances": {
        "id": "kitchen-appliances", "zh": "厨房小家电",
        "section": "Home & Kitchen", "section_zh": "家居厨房",
        "platforms": ["Amazon", "TikTok", "Shopee"],
    },
    "air purifiers & humidifiers": {
        "id": "air-purifiers", "zh": "空气净化器 & 加湿器",
        "section": "Home & Kitchen", "section_zh": "家居厨房",
        "platforms": ["Amazon", "Shopee"],
    },
    "skincare devices": {
        "id": "skincare", "zh": "美容仪器",
        "section": "Beauty & Care", "section_zh": "美妆个护",
        "platforms": ["Amazon", "DTC", "TikTok"],
    },
    "hair care tools": {
        "id": "hair-care-tools", "zh": "美发工具",
        "section": "Beauty & Care", "section_zh": "美妆个护",
        "platforms": ["Amazon", "TikTok"],
    },
    "viral skincare & beauty": {
        "id": "tiktok-viral-beauty", "zh": "TikTok 爆款美妆",
        "section": "TikTok Trending", "section_zh": "TikTok 热卖",
        "platforms": ["TikTok", "Amazon"],
    },
    "trending home & kitchen gadgets": {
        "id": "tiktok-home-gadgets", "zh": "TikTok 家居好物",
        "section": "TikTok Trending", "section_zh": "TikTok 热卖",
        "platforms": ["TikTok", "Amazon", "Shopee"],
    },
    "athletic & activewear": {
        "id": "athletic-apparel", "zh": "运动服饰",
        "section": "TikTok Trending", "section_zh": "TikTok 热卖",
        "platforms": ["TikTok", "DTC"],
    },
    "baby & toddler gear": {
        "id": "baby-gear", "zh": "婴幼儿用品",
        "section": "Family & Kids", "section_zh": "母婴亲子",
        "platforms": ["Amazon", "Shopee"],
    },
    "pet care & accessories": {
        "id": "pet-products", "zh": "宠物用品",
        "section": "Family & Kids", "section_zh": "母婴亲子",
        "platforms": ["Amazon", "TikTok"],
    },
    "dash cameras": {
        "id": "dash-cameras", "zh": "行车记录仪",
        "section": "Automotive", "section_zh": "汽车配件",
        "platforms": ["Amazon"],
    },
    "car phone mounts": {
        "id": "car-phone-mounts", "zh": "手机车载支架",
        "section": "Automotive", "section_zh": "汽车配件",
        "platforms": ["Amazon", "Shopee"],
    },
    "car jump starters": {
        "id": "car-jump-starters", "zh": "汽车启动电源",
        "section": "Automotive", "section_zh": "汽车配件",
        "platforms": ["Amazon"],
    },
    "car interior accessories": {
        "id": "car-accessories-interior", "zh": "汽车内饰配件",
        "section": "Automotive", "section_zh": "汽车配件",
        "platforms": ["Amazon"],
    },
    "women's casual dresses": {
        "id": "womens-dresses", "zh": "女装休闲连衣裙",
        "section": "Apparel & Fashion", "section_zh": "服装时尚",
        "platforms": ["Amazon", "TikTok", "Shopee"],
    },
    "athleisure & loungewear": {
        "id": "athleisure", "zh": "运动休闲 & 居家服",
        "section": "Apparel & Fashion", "section_zh": "服装时尚",
        "platforms": ["TikTok", "Amazon", "DTC"],
    },
    "men's everyday basics": {
        "id": "mens-basics", "zh": "男装基础款",
        "section": "Apparel & Fashion", "section_zh": "服装时尚",
        "platforms": ["DTC", "Amazon"],
    },
    "sustainable & eco fashion": {
        "id": "sustainable-fashion", "zh": "可持续环保服装",
        "section": "Apparel & Fashion", "section_zh": "服装时尚",
        "platforms": ["DTC", "Amazon"],
    },
}

# Lowercase lookup
_META_LOOKUP: dict[str, dict] = {k.lower(): v for k, v in CATEGORY_META.items()}

# Pre-compute word sets for fuzzy matching
_STOP_WORDS = {"and", "for", "the", "of", "in", "with", "a", "an", "&"}
_META_WORDS: dict[str, set[str]] = {
    k: set(w for w in k.split() if w not in _STOP_WORDS)
    for k in _META_LOOKUP
}


def _find_meta(category: str) -> dict | None:
    """Find category metadata by word-level Jaccard similarity.

    Matching strategy (highest confidence first):
    1. Exact match
    2. Word overlap ≥ 60% (Jaccard similarity)
    """
    cat_lower = category.lower()

    # 1. Exact match
    if cat_lower in _META_LOOKUP:
        return _META_LOOKUP[cat_lower]

    # 2. Word-level Jaccard similarity
    cat_words = set(w for w in cat_lower.split() if w not in _STOP_WORDS)
    if not cat_words:
        return None

    best_score = 0.0
    best_meta = None
    for key, key_words in _META_WORDS.items():
        if not key_words:
            continue
        intersection = cat_words & key_words
        union = cat_words | key_words
        jaccard = len(intersection) / len(union)
        if jaccard > best_score:
            best_score = jaccard
            best_meta = _META_LOOKUP[key]

    return best_meta if best_score >= 0.5 else None


# ── In-memory cache ─────────────────────────────────────────────────────────

_intel_cache: dict | None = None
_intel_cache_at: float = 0.0
_INTEL_CACHE_TTL = 3600  # 1 hour


# ── Seller signal algorithm ─────────────────────────────────────────────────

def compute_seller_signal(
    sov_trend: str,
    google_delta: float | None,
    brand_count: int,
) -> tuple[str, str, str]:
    """
    Compute seller signal from AI trend + Google Trends + competition density.
    Returns (signal, note_en, note_zh).
    """
    score = 0

    # AI visibility trend
    if sov_trend == "rising":
        score += 2
    elif sov_trend == "falling":
        score -= 2

    # Google Trends momentum
    if google_delta is not None:
        if google_delta > 10:
            score += 2
        elif google_delta > 0:
            score += 1
        elif google_delta < -10:
            score -= 2
        elif google_delta < 0:
            score -= 1

    # Competition density
    if brand_count <= 3:
        score += 1  # low competition = opportunity
    elif brand_count >= 8:
        score -= 1  # saturated

    if score >= 3:
        note_en = "Rising AI visibility with growing search demand. Strong entry opportunity."
        note_zh = "AI 可见度上升，搜索需求增长，入场机会好。"
        return "strong_buy", note_en, note_zh
    elif score >= 1:
        note_en = "Moderate AI visibility with stable demand. Watch for trend confirmation."
        note_zh = "AI 可见度适中，需求稳定，关注趋势确认。"
        return "watch", note_en, note_zh
    else:
        note_en = "Declining AI visibility or saturated competition. Consider alternatives."
        note_zh = "AI 可见度下降或竞争饱和，建议考虑替代品类。"
        return "avoid", note_en, note_zh


# ── Main aggregation ────────────────────────────────────────────────────────

async def get_selection_intelligence(db: AsyncSession) -> list[dict]:
    """
    Aggregate all category data from DB + cross-platform signals.
    Returns list of category dicts ready for SelectionCategoryEntry schema.
    """
    global _intel_cache, _intel_cache_at

    now = datetime.now(timezone.utc).timestamp()
    if _intel_cache is not None and (now - _intel_cache_at) < _INTEL_CACHE_TTL:
        return _intel_cache

    # ── 1. Get all categories with brand counts from DB ─────────────────────
    cat_stmt = (
        select(Run.category, func.count(distinct(Run.brand_name)).label("brand_count"))
        .where(Run.status == "done")
        .group_by(Run.category)
        .order_by(func.count(distinct(Run.brand_name)).desc())
    )
    cat_rows = await db.execute(cat_stmt)
    db_categories = {r.category: r.brand_count for r in cat_rows}

    # ── 2. Group DB categories by meta id (merge variants) ──────────────────
    # Multiple DB category names may map to the same CATEGORY_META entry
    # (e.g. "true wireless earbuds", "wireless earbuds and Bluetooth headphones"
    #  both match meta "wireless earbuds"). Merge them into one card.
    matched_meta_keys: set[str] = set()
    # meta_id → list of (cat_name, brand_count)
    meta_groups: dict[str, list[tuple[str, int]]] = defaultdict(list)
    # DB categories with no meta match
    unmatched_cats: list[tuple[str, int]] = []

    for cat_name, brand_count in db_categories.items():
        meta = _find_meta(cat_name)
        if meta:
            meta_groups[meta["id"]].append((cat_name, brand_count))
            for k, v in _META_LOOKUP.items():
                if v is meta:
                    matched_meta_keys.add(k)
                    break
        else:
            unmatched_cats.append((cat_name, brand_count))

    categories_data: list[dict] = []

    # ── 2a. Build cards for merged meta groups ───────────────────────────────
    for meta_id, group in meta_groups.items():
        # Find meta by id
        meta = next(v for v in CATEGORY_META.values() if v["id"] == meta_id)
        total_brand_count = sum(bc for _, bc in group)
        all_cat_names = [cn for cn, _ in group]

        # Query brands across all variant category names
        conditions = [func.lower(Run.category) == cn.lower() for cn in all_cat_names]
        from sqlalchemy import or_
        subq = (
            select(
                RunSnapshot.brand_name,
                RunSnapshot.weighted_sov,
                RunSnapshot.arrs,
                RunSnapshot.snapshot_at,
                func.row_number()
                .over(partition_by=RunSnapshot.brand_name, order_by=RunSnapshot.snapshot_at.desc())
                .label("rn"),
            )
            .join(Run, RunSnapshot.run_id == Run.id)
            .where(or_(*conditions))
            .subquery()
        )
        stmt = (
            select(subq)
            .where(subq.c.rn == 1)
            .order_by(subq.c.weighted_sov.desc())
            .limit(5)
        )
        rows = (await db.execute(stmt)).all()
        top_brands = [
            {"name": r.brand_name, "sov": round(r.weighted_sov, 1), "arrs": round(r.arrs, 1)}
            for r in rows[:3]
        ]

        # Use the primary (most brands) category name for trend
        primary_cat = max(group, key=lambda x: x[1])[0]
        trend, trend_pts = await _compute_category_trend(db, primary_cat)
        google_delta = await _get_google_delta(primary_cat)
        signal, note_en, note_zh = compute_seller_signal(trend, google_delta, total_brand_count)

        # Find canonical key for display name
        canon_key = next((k for k in CATEGORY_META if CATEGORY_META[k]["id"] == meta_id), None)

        categories_data.append({
            "id": meta_id,
            "category": canon_key.title() if canon_key else primary_cat,
            "category_zh": meta["zh"],
            "section": meta["section"],
            "section_zh": meta["section_zh"],
            "brand_count": total_brand_count,
            "top_brands": top_brands,
            "trend": trend,
            "trend_pts": trend_pts,
            "seller_signal": signal,
            "seller_note": note_en,
            "seller_note_zh": note_zh,
            "platforms": meta["platforms"],
            "google_trends_delta": google_delta,
            "reddit_posts": None,
            "youtube_kols": None,
        })

    # ── 2b. Build cards for unmatched DB categories ──────────────────────────
    for cat_name, brand_count in unmatched_cats:
        subq = (
            select(
                RunSnapshot.brand_name,
                RunSnapshot.weighted_sov,
                RunSnapshot.arrs,
                RunSnapshot.snapshot_at,
                func.row_number()
                .over(partition_by=RunSnapshot.brand_name, order_by=RunSnapshot.snapshot_at.desc())
                .label("rn"),
            )
            .join(Run, RunSnapshot.run_id == Run.id)
            .where(func.lower(Run.category) == cat_name.lower())
            .subquery()
        )
        stmt = (
            select(subq)
            .where(subq.c.rn == 1)
            .order_by(subq.c.weighted_sov.desc())
            .limit(5)
        )
        rows = (await db.execute(stmt)).all()
        top_brands = [
            {"name": r.brand_name, "sov": round(r.weighted_sov, 1), "arrs": round(r.arrs, 1)}
            for r in rows[:3]
        ]

        trend, trend_pts = await _compute_category_trend(db, cat_name)
        google_delta = await _get_google_delta(cat_name)
        signal, note_en, note_zh = compute_seller_signal(trend, google_delta, brand_count)

        cat_id = cat_name.lower().replace(" ", "-").replace("&", "").replace("'", "")
        categories_data.append({
            "id": cat_id,
            "category": cat_name,
            "category_zh": cat_name,
            "section": "Other",
            "section_zh": "其他",
            "brand_count": brand_count,
            "top_brands": top_brands,
            "trend": trend,
            "trend_pts": trend_pts,
            "seller_signal": signal,
            "seller_note": note_en,
            "seller_note_zh": note_zh,
            "platforms": ["Amazon"],
            "google_trends_delta": google_delta,
            "reddit_posts": None,
            "youtube_kols": None,
        })

    # ── 3. Add CATEGORY_META entries not in DB (as empty shells) ────────────
    for cat_key, meta in CATEGORY_META.items():
        if cat_key.lower() not in matched_meta_keys:
            google_delta = await _get_google_delta(cat_key)
            signal, note_en, note_zh = compute_seller_signal("stable", google_delta, 0)
            categories_data.append({
                "id": meta["id"],
                "category": cat_key.title(),
                "category_zh": meta["zh"],
                "section": meta["section"],
                "section_zh": meta["section_zh"],
                "brand_count": 0,
                "top_brands": [],
                "trend": "stable",
                "trend_pts": "0.0",
                "seller_signal": signal,
                "seller_note": note_en,
                "seller_note_zh": note_zh,
                "platforms": meta["platforms"],
                "google_trends_delta": google_delta,
                "reddit_posts": None,
                "youtube_kols": None,
            })

    # Sort: categories with data first (by brand_count desc), then empty ones
    categories_data.sort(key=lambda c: (-c["brand_count"], c["category"]))

    _intel_cache = categories_data
    _intel_cache_at = now
    return categories_data


async def _compute_category_trend(db: AsyncSession, category: str) -> tuple[str, str]:
    """Compute overall category trend from recent snapshots."""
    # Get last 2 snapshots per brand, compute average SOV change
    subq = (
        select(
            RunSnapshot.brand_name,
            RunSnapshot.weighted_sov,
            RunSnapshot.snapshot_at,
            func.row_number()
            .over(partition_by=RunSnapshot.brand_name, order_by=RunSnapshot.snapshot_at.desc())
            .label("rn"),
        )
        .join(Run, RunSnapshot.run_id == Run.id)
        .where(func.lower(Run.category) == category.lower())
        .subquery()
    )
    stmt = select(subq).where(subq.c.rn <= 2)
    rows = (await db.execute(stmt)).all()

    brands: dict[str, list[float]] = defaultdict(list)
    for r in rows:
        brands[r.brand_name].append(r.weighted_sov)

    if not brands:
        return "stable", "0.0"

    changes = []
    for sovs in brands.values():
        if len(sovs) >= 2:
            changes.append(sovs[0] - sovs[1])  # newest - oldest

    if not changes:
        return "stable", "0.0"

    avg_change = sum(changes) / len(changes)
    if avg_change > 3:
        return "up", f"+{avg_change:.1f}"
    elif avg_change < -3:
        return "down", f"{avg_change:.1f}"
    else:
        return "stable", f"{avg_change:+.1f}"


async def _get_google_delta(category: str) -> float | None:
    """Get average 4-week delta from Google Trends (uses existing cached endpoint)."""
    try:
        from app.routers.trends import _get_cached, _find_keywords, _fetch_pytrends, _set_cache

        cached = _get_cached(category)
        if cached:
            deltas = cached.get("delta_4w_pct", {})
            if deltas:
                return round(sum(deltas.values()) / len(deltas), 1)
            return None

        # Try to fetch (but don't block too long)
        keywords = _find_keywords(category)
        data = await asyncio.wait_for(
            asyncio.to_thread(_fetch_pytrends, keywords),
            timeout=10,
        )
        _set_cache(category, data)

        deltas = data.get("delta_4w_pct", {})
        if deltas:
            return round(sum(deltas.values()) / len(deltas), 1)
    except Exception as e:
        logger.debug("Google Trends fetch failed for %s: %s", category, e)
    return None


# ── Category detail ─────────────────────────────────────────────────────────

async def get_category_detail(category: str, db: AsyncSession) -> dict:
    """
    Full category detail: leaderboard + Reddit + YouTube + Google Trends.
    Cross-platform calls run concurrently.
    """
    # Run all data fetches in parallel
    leaderboard_task = _get_leaderboard(category, db)
    reddit_task = _get_reddit_posts(category)
    kol_task = _get_youtube_kols(category)
    google_task = _get_google_trends(category)

    leaderboard, reddit_posts, youtube_kols, google_trends = await asyncio.gather(
        leaderboard_task, reddit_task, kol_task, google_task,
        return_exceptions=True,
    )

    # Handle exceptions gracefully
    if isinstance(leaderboard, Exception):
        logger.warning("Leaderboard fetch failed: %s", leaderboard)
        leaderboard = []
    if isinstance(reddit_posts, Exception):
        logger.warning("Reddit fetch failed: %s", reddit_posts)
        reddit_posts = []
    if isinstance(youtube_kols, Exception):
        logger.warning("YouTube fetch failed: %s", youtube_kols)
        youtube_kols = []
    if isinstance(google_trends, Exception):
        logger.warning("Google Trends fetch failed: %s", google_trends)
        google_trends = {"keywords": {}, "delta_4w_pct": {}, "rising_queries": []}

    return {
        "category": category,
        "leaderboard": leaderboard,
        "reddit_posts": reddit_posts,
        "youtube_kols": youtube_kols,
        "google_trends": google_trends,
    }


async def _get_leaderboard(category: str, db: AsyncSession) -> list[dict]:
    """Get enriched leaderboard with sparklines."""
    subq = (
        select(
            RunSnapshot.brand_name,
            RunSnapshot.weighted_sov,
            RunSnapshot.sov_high,
            RunSnapshot.sov_comparison,
            RunSnapshot.sov_info,
            RunSnapshot.arrs,
            RunSnapshot.mention_count,
            RunSnapshot.total_prompts,
            RunSnapshot.snapshot_at,
            func.row_number()
            .over(partition_by=RunSnapshot.brand_name, order_by=RunSnapshot.snapshot_at.desc())
            .label("rn"),
        )
        .join(Run, RunSnapshot.run_id == Run.id)
        .where(func.lower(Run.category) == category.lower())
        .subquery()
    )
    stmt = (
        select(subq)
        .where(subq.c.rn <= 5)
        .order_by(subq.c.brand_name, subq.c.snapshot_at.asc())
    )
    rows = (await db.execute(stmt)).all()

    brands: dict[str, list] = defaultdict(list)
    for r in rows:
        brands[r.brand_name].append(r)

    entries = []
    for brand_name, snapshots in brands.items():
        latest = snapshots[-1]
        sparkline = [s.weighted_sov for s in snapshots]
        sov_change = sparkline[-1] - sparkline[0] if len(sparkline) > 1 else 0.0

        if len(sparkline) < 2:
            trend = "stable"
        elif sov_change > 5:
            trend = "rising"
        elif sov_change < -5:
            trend = "falling"
        else:
            trend = "stable"

        entries.append({
            "brand_name": brand_name,
            "weighted_sov": round(latest.weighted_sov, 1),
            "sov_high": round(latest.sov_high, 1),
            "sov_comparison": round(latest.sov_comparison, 1),
            "sov_info": round(latest.sov_info, 1),
            "arrs": round(latest.arrs, 1),
            "mention_count": latest.mention_count,
            "total_prompts": latest.total_prompts,
            "snapshot_at": latest.snapshot_at.isoformat() if latest.snapshot_at else None,
            "sparkline": [round(s, 1) for s in sparkline],
            "trend_direction": trend,
            "sov_change": round(sov_change, 1),
        })

    entries.sort(key=lambda e: e["weighted_sov"], reverse=True)
    return entries


async def _get_reddit_posts(category: str) -> list[dict]:
    """Fetch Reddit posts for a category."""
    try:
        from app.services.reddit_scraper import search_reddit
        posts = await search_reddit(category, limit=5)
        return [
            {
                "title": p.get("title", ""),
                "url": p.get("url", ""),
                "subreddit": p.get("subreddit", ""),
                "score": p.get("score", 0),
                "sentiment": p.get("sentiment", "mixed"),
                "age_days": p.get("age_days", 0),
            }
            for p in posts
        ]
    except Exception as e:
        logger.debug("Reddit search failed for category %s: %s", category, e)
        return []


async def _get_youtube_kols(category: str) -> list[dict]:
    """Fetch YouTube KOLs for a category."""
    try:
        from app.services.youtube_scraper import search_category_kols
        kols = await search_category_kols(category, limit=5)
        return [
            {
                "channel_name": k.get("channel_name", ""),
                "video_title": k.get("video_title", ""),
                "video_url": k.get("video_url", ""),
                "views": k.get("views", 0),
                "subscribers": k.get("subscribers", 0),
                "tier": k.get("tier", "micro"),
            }
            for k in kols
        ]
    except Exception as e:
        logger.debug("YouTube search failed for category %s: %s", category, e)
        return []


async def _get_google_trends(category: str) -> dict:
    """Fetch Google Trends data for a category."""
    try:
        from app.routers.trends import _get_cached, _find_keywords, _fetch_pytrends, _set_cache

        cached = _get_cached(category)
        if cached:
            return cached

        keywords = _find_keywords(category)
        data = await asyncio.wait_for(
            asyncio.to_thread(_fetch_pytrends, keywords),
            timeout=15,
        )
        _set_cache(category, data)
        return data
    except Exception as e:
        logger.debug("Google Trends failed for %s: %s", category, e)
        return {"keywords": {}, "delta_4w_pct": {}, "rising_queries": []}
