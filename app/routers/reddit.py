"""
Reddit Intelligence API — live search, cross-validation, source intelligence.
"""

import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Run, RunSnapshot, User
from app.routers.auth import get_current_user, get_current_user_optional
from app.services.reddit_scraper import (
    basic_sentiment,
    get_category_subreddits,
    search_brand_across_subreddits,
    search_reddit,
    CATEGORY_SUBREDDITS,
)

router = APIRouter(prefix="/reddit", tags=["reddit"])
logger = logging.getLogger(__name__)

_PAID_TIERS = {"growth", "scale", "enterprise"}


def _user_tier(user: User) -> str:
    return user.subscription_tier.value if hasattr(user.subscription_tier, "value") else str(user.subscription_tier)


# ── Live Reddit Search ──────────────────────────────────────────────────────

@router.get("/search")
async def reddit_search(
    q: str = Query(..., min_length=2, max_length=100, description="Brand or keyword to search"),
    category: str | None = Query(default=None, description="Product category for targeted subreddit search"),
    limit: int = Query(default=10, ge=1, le=25),
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """
    Search Reddit for brand/keyword mentions.
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
                    "message": "Credits exhausted. Upgrade to search Reddit.",
                })

    # Fetch Reddit data
    if category:
        posts = await search_brand_across_subreddits(q, category=category, limit_per_sub=5)
    else:
        posts = await search_reddit(q, limit=limit)

    # Enrich with sentiment
    enriched = []
    for post in posts:
        text = f"{post['title']} {post['selftext_snippet']}"
        enriched.append({
            **post,
            "sentiment": basic_sentiment(text),
            "age_days": max(0, int((datetime.now(timezone.utc).timestamp() - post["created_utc"]) / 86400)),
        })

    # Deduct credit
    if credit_cost > 0 and user:
        user.credit_balance -= credit_cost
        await db.commit()
        await db.refresh(user)

    # Limit for anonymous
    if limited:
        enriched = enriched[:3]

    return {
        "posts": enriched,
        "total": len(enriched),
        "limited": limited,
        "credits_remaining": user.credit_balance if user else None,
        "credit_cost": credit_cost,
        "query": q,
        "category": category,
    }


# ── Cross-Validation ────────────────────────────────────────────────────────

@router.get("/cross-validate/{brand}")
async def cross_validate(
    brand: str,
    category: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Cross-validate a brand across data sources:
    - Reddit sentiment (live)
    - AI visibility (from our RunSnapshot data)
    - Amazon/YouTube signals (if available)

    Returns insights about signal alignment/divergence.
    Costs 2 credits for free users (richer analysis).
    """
    tier = _user_tier(user)
    credit_cost = 0 if tier in _PAID_TIERS else 2

    if credit_cost > 0 and user.credit_balance < credit_cost:
        raise HTTPException(status_code=429, detail={
            "code": "credits_exhausted",
            "balance": user.credit_balance,
            "cost": credit_cost,
            "message": "Credits exhausted. Upgrade for cross-validation.",
        })

    # 1. Reddit data
    reddit_posts = await search_brand_across_subreddits(brand, category=category)
    sentiments = [basic_sentiment(f"{p['title']} {p['selftext_snippet']}") for p in reddit_posts]
    pos_count = sentiments.count("positive")
    neg_count = sentiments.count("negative")
    total_sentiment = len(sentiments) or 1
    reddit_score = round((pos_count / total_sentiment) * 100)

    # 2. AI visibility from our DB (latest RunSnapshot)
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

    # Reddit vs AI alignment
    if ai_data:
        sov = ai_data["weighted_sov"]
        if reddit_score >= 60 and sov >= 30:
            insights.append({
                "type": "aligned",
                "icon": "✓",
                "message_en": f"Reddit sentiment ({reddit_score}% positive) aligns with strong AI visibility (SOV {sov}%)",
                "message_zh": f"Reddit 情感（{reddit_score}% 正面）与强 AI 可见度（SOV {sov}%）一致",
            })
        elif reddit_score >= 60 and sov < 20:
            insights.append({
                "type": "opportunity",
                "icon": "💡",
                "message_en": f"Reddit sentiment is positive ({reddit_score}%) but AI visibility is low (SOV {sov}%). GEO optimization could capture this goodwill.",
                "message_zh": f"Reddit 情感正面（{reddit_score}%）但 AI 可见度低（SOV {sov}%）。GEO 优化可利用这一好感度。",
            })
        elif reddit_score < 40 and sov >= 30:
            insights.append({
                "type": "risk",
                "icon": "⚠",
                "message_en": f"Reddit sentiment is negative ({reddit_score}% positive) but AI still recommends brand (SOV {sov}%). Risk: AI may update as negative threads gain traction.",
                "message_zh": f"Reddit 情感偏负面（{reddit_score}% 正面）但 AI 仍在推荐（SOV {sov}%）。风险：负面帖子扩散后 AI 可能降低推荐。",
            })
        elif reddit_score < 40 and sov < 20:
            insights.append({
                "type": "critical",
                "icon": "🔴",
                "message_en": f"Both Reddit ({reddit_score}% positive) and AI visibility (SOV {sov}%) are low. Brand needs urgent reputation repair.",
                "message_zh": f"Reddit（{reddit_score}% 正面）和 AI 可见度（SOV {sov}%）都很低。品牌需要紧急修复声誉。",
            })

    # Reddit volume insight
    if len(reddit_posts) > 0:
        avg_score = sum(p["score"] for p in reddit_posts) / len(reddit_posts)
        if avg_score > 500:
            insights.append({
                "type": "high_engagement",
                "icon": "🔥",
                "message_en": f"High Reddit engagement (avg {int(avg_score)} upvotes). These threads likely influence AI training data.",
                "message_zh": f"Reddit 互动量高（平均 {int(avg_score)} 赞）。这些帖子很可能影响 AI 训练数据。",
            })

    # Negative thread warning
    if neg_count > pos_count and len(reddit_posts) >= 3:
        insights.append({
            "type": "negative_dominant",
            "icon": "📉",
            "message_en": f"Negative sentiment dominates ({neg_count}/{total_sentiment} posts). AI models may cite these negative experiences.",
            "message_zh": f"负面情感占主导（{neg_count}/{total_sentiment} 篇帖子）。AI 模型可能引用这些负面经历。",
        })

    # Deduct credits
    if credit_cost > 0:
        user.credit_balance -= credit_cost
        await db.commit()
        await db.refresh(user)

    return {
        "brand": brand,
        "category": category,
        "reddit": {
            "score": reddit_score,
            "positive_pct": round(pos_count / total_sentiment * 100),
            "negative_pct": round(neg_count / total_sentiment * 100),
            "mixed_pct": round((total_sentiment - pos_count - neg_count) / total_sentiment * 100),
            "total_posts": len(reddit_posts),
            "top_posts": reddit_posts[:5],
        },
        "ai_visibility": ai_data,
        "insights": insights,
        "credits_remaining": user.credit_balance,
        "credit_cost": credit_cost,
    }


# ── Source Intelligence: Category Sources ────────────────────────────────────

@router.get("/sources/{category}")
async def category_sources(category: str):
    """
    Return relevant subreddits and source types for a product category.
    Free endpoint — no credit cost.
    """
    subreddits = get_category_subreddits(category)
    all_categories = list(CATEGORY_SUBREDDITS.keys())

    return {
        "category": category,
        "subreddits": subreddits,
        "source_types": [
            {"type": "reddit", "label": "Reddit Communities", "count": len(subreddits)},
            {"type": "youtube", "label": "YouTube Reviews", "available": True},
            {"type": "amazon", "label": "Amazon Listings", "available": True},
            {"type": "ai", "label": "AI Model Responses", "available": True},
        ],
        "all_categories": all_categories,
    }
