"""
KOL Intelligence API — YouTube creator search, cross-validation, category discovery.
"""

import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Run, RunSnapshot, User
from app.routers.auth import get_current_user, get_current_user_optional
from app.services.youtube_scraper import (
    search_kols,
    search_category_kols,
    get_category_search_terms,
    CATEGORY_SEARCH_TERMS,
    basic_sentiment,
)

router = APIRouter(prefix="/kol", tags=["kol"])
logger = logging.getLogger(__name__)

_PAID_TIERS = {"growth", "scale", "enterprise"}


def _user_tier(user: User) -> str:
    return user.subscription_tier.value if hasattr(user.subscription_tier, "value") else str(user.subscription_tier)


# ── Live KOL Search ────────────────────────────────────────────────────────

@router.get("/search")
async def kol_search(
    q: str = Query(..., min_length=2, max_length=100, description="Brand or keyword to search"),
    category: str | None = Query(default=None, description="Product category for targeted search"),
    limit: int = Query(default=10, ge=1, le=25),
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """
    Search YouTube for KOLs discussing a brand/keyword.
    Free users: 1 credit per search. Paid: unlimited. Anonymous: limited to 3 results.
    """
    limited = False
    credit_cost = 0

    if user is None:
        limited = True
    else:
        tier = _user_tier(user)
        if tier not in _PAID_TIERS:
            credit_cost = 1
            if user.credit_balance < credit_cost:
                raise HTTPException(status_code=429, detail={
                    "code": "credits_exhausted",
                    "balance": user.credit_balance,
                    "cost": credit_cost,
                    "message": "Credits exhausted. Upgrade to search KOLs.",
                })

    # Fetch YouTube data
    kols = await search_kols(q, category=category, limit=limit)

    # Deduct credit
    if credit_cost > 0 and user:
        user.credit_balance -= credit_cost
        await db.commit()
        await db.refresh(user)

    # Limit for anonymous
    if limited:
        kols = kols[:3]

    return {
        "kols": kols,
        "total": len(kols),
        "limited": limited,
        "credits_remaining": user.credit_balance if user else None,
        "credit_cost": credit_cost,
        "query": q,
        "category": category,
        "api_available": bool(search_kols.__module__ and True),  # always True but signals backend readiness
    }


# ── Cross-Validation: KOL influence vs AI visibility ──────────────────────

@router.get("/cross-validate/{brand}")
async def kol_cross_validate(
    brand: str,
    category: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Cross-validate KOL presence for a brand:
    - YouTube creator coverage (live search)
    - AI visibility (from RunSnapshot data)
    - Generate insights about KOL-AI alignment

    Costs 2 credits for free users.
    """
    tier = _user_tier(user)
    credit_cost = 0 if tier in _PAID_TIERS else 2

    if credit_cost > 0 and user.credit_balance < credit_cost:
        raise HTTPException(status_code=429, detail={
            "code": "credits_exhausted",
            "balance": user.credit_balance,
            "cost": credit_cost,
            "message": "Credits exhausted. Upgrade for KOL cross-validation.",
        })

    # 1. YouTube KOL data
    kols = await search_kols(brand, category=category, limit=10)

    # Analyze KOL sentiment distribution
    sentiments = [k.get("sentiment", "mixed") for k in kols]
    pos_count = sentiments.count("positive")
    neg_count = sentiments.count("negative")
    total = len(sentiments) or 1
    kol_positive_pct = round((pos_count / total) * 100)

    # Calculate average metrics
    total_views = sum(k.get("views", 0) for k in kols)
    total_subs = sum(k.get("subscribers", 0) for k in kols)
    mega_count = sum(1 for k in kols if k.get("tier") == "mega")
    macro_count = sum(1 for k in kols if k.get("tier") == "macro")
    micro_count = sum(1 for k in kols if k.get("tier") == "micro")

    # 2. AI visibility from our DB
    ai_data = None
    snapshot_stmt = (
        select(RunSnapshot)
        .join(Run, RunSnapshot.run_id == Run.id)
        .where(func.lower(RunSnapshot.brand_name) == brand.lower())
        .order_by(RunSnapshot.snapshot_at.desc())
        .limit(1)
    )
    result = await db.execute(snapshot_stmt)
    snapshot = result.scalar_one_or_none()
    if snapshot:
        ai_data = {
            "weighted_sov": round(snapshot.weighted_sov, 1),
            "arrs": round(snapshot.arrs, 1),
            "mention_count": snapshot.mention_count,
            "total_prompts": snapshot.total_prompts,
            "snapshot_at": snapshot.snapshot_at.isoformat(),
        }

    # 3. Generate cross-validation insights
    insights = []

    if ai_data:
        sov = ai_data["weighted_sov"]

        # KOL coverage vs AI visibility alignment
        if len(kols) >= 3 and kol_positive_pct >= 60 and sov >= 30:
            insights.append({
                "type": "aligned",
                "icon": "✓",
                "message_en": f"Strong KOL support ({len(kols)} creators, {kol_positive_pct}% positive) aligns with good AI visibility (SOV {sov}%).",
                "message_zh": f"KOL 支持强劲（{len(kols)} 位创作者，{kol_positive_pct}% 正面），与 AI 可见度一致（SOV {sov}%）。",
            })
        elif len(kols) >= 3 and kol_positive_pct >= 60 and sov < 20:
            insights.append({
                "type": "opportunity",
                "icon": "💡",
                "message_en": f"KOLs love your brand ({kol_positive_pct}% positive) but AI visibility is low (SOV {sov}%). Structured content could bridge this gap.",
                "message_zh": f"KOL 对你品牌评价正面（{kol_positive_pct}%），但 AI 可见度低（SOV {sov}%）。结构化内容可以弥合差距。",
            })
        elif neg_count > pos_count and sov >= 30:
            insights.append({
                "type": "risk",
                "icon": "⚠",
                "message_en": f"Negative KOL sentiment ({neg_count}/{total} negative) but AI still recommends you (SOV {sov}%). Risk: AI models may absorb negative reviews.",
                "message_zh": f"KOL 情感偏负面（{neg_count}/{total} 负面），但 AI 仍推荐你（SOV {sov}%）。风险：AI 可能吸收负面评测。",
            })
        elif len(kols) < 3 and sov < 20:
            insights.append({
                "type": "critical",
                "icon": "🔴",
                "message_en": f"Minimal KOL coverage ({len(kols)} creators) and low AI visibility (SOV {sov}%). Consider KOL partnerships to build citation sources.",
                "message_zh": f"KOL 覆盖极少（{len(kols)} 位创作者）且 AI 可见度低（SOV {sov}%）。建议通过 KOL 合作建立引用来源。",
            })

    # Mega creator insight
    if mega_count > 0:
        insights.append({
            "type": "mega_coverage",
            "icon": "⭐",
            "message_en": f"{mega_count} mega creator(s) (1M+ subs) have covered your brand. Their reviews carry highest AI citation weight.",
            "message_zh": f"{mega_count} 位头部创作者（100万+粉丝）提到了你的品牌。他们的评测对 AI 引用权重最高。",
        })

    # View count insight
    if total_views > 1_000_000:
        insights.append({
            "type": "high_reach",
            "icon": "🔥",
            "message_en": f"KOL content about your brand has {total_views:,.0f} total views. High-view videos are strong AI training signals.",
            "message_zh": f"关于你品牌的 KOL 内容共有 {total_views:,.0f} 次观看。高播放量视频是强力 AI 训练信号。",
        })

    # Negative KOL warning
    if neg_count >= 2:
        insights.append({
            "type": "negative_kols",
            "icon": "📉",
            "message_en": f"{neg_count} creators published negative reviews. These can directly harm AI recommendations.",
            "message_zh": f"{neg_count} 位创作者发布了负面评测。这些内容可能直接损害 AI 推荐。",
        })

    # Deduct credits
    if credit_cost > 0:
        user.credit_balance -= credit_cost
        await db.commit()
        await db.refresh(user)

    return {
        "brand": brand,
        "category": category,
        "kol_coverage": {
            "total_creators": len(kols),
            "positive_pct": kol_positive_pct,
            "negative_pct": round(neg_count / total * 100),
            "mixed_pct": round((total - pos_count - neg_count) / total * 100),
            "total_views": total_views,
            "total_subscribers": total_subs,
            "mega_count": mega_count,
            "macro_count": macro_count,
            "micro_count": micro_count,
            "top_kols": kols[:5],
        },
        "ai_visibility": ai_data,
        "insights": insights,
        "credits_remaining": user.credit_balance,
        "credit_cost": credit_cost,
    }


# ── Category KOL Discovery ────────────────────────────────────────────────

@router.get("/category/{category}")
async def category_kol_discovery(
    category: str,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """
    Discover top KOLs for a product category.
    Returns top creators by subscriber count, with search term suggestions.
    Free endpoint — no credit cost.
    """
    kols = await search_category_kols(category, limit=15)
    search_terms = get_category_search_terms(category)
    all_categories = list(CATEGORY_SEARCH_TERMS.keys())

    return {
        "category": category,
        "kols": kols,
        "total": len(kols),
        "search_terms": search_terms,
        "all_categories": all_categories,
        "api_available": bool(kols),  # True if YouTube API returned data
    }
