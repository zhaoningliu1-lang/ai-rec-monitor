"""Content Studio — AI content generation and multi-platform publishing endpoints."""
import logging
import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import ContentDraft, User
from app.routers.auth import get_current_user_optional
from app.services.content_generator import generate_batch, generate_content

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/content", tags=["content-studio"])


# ── Pydantic schemas ──────────────────────────────────────────────────────────

class GenerateRequest(BaseModel):
    brand: str
    product: str
    platform: str  # reddit / x / linkedin / amazon / blog / tiktok
    market: str = "US"
    geo_gaps: dict[str, Any] | None = None
    keywords: list[str] | None = None
    language: str = "en"


class BatchGenerateItem(BaseModel):
    brand: str
    product: str
    platform: str
    market: str = "US"
    geo_gaps: dict[str, Any] | None = None
    keywords: list[str] | None = None
    language: str = "en"


class BatchGenerateRequest(BaseModel):
    items: list[BatchGenerateItem]


class DraftCreate(BaseModel):
    brand: str
    platform: str
    content_type: str
    title: str | None = None
    body: str
    keywords: list[str] = []
    status: str = "draft"
    scheduled_at: datetime | None = None


class DraftUpdate(BaseModel):
    title: str | None = None
    body: str | None = None
    keywords: list[str] | None = None
    status: str | None = None
    scheduled_at: datetime | None = None
    platform_url: str | None = None


def _draft_out(d: ContentDraft) -> dict:
    return {
        "id": str(d.id),
        "user_id": str(d.user_id) if d.user_id else None,
        "brand": d.brand,
        "platform": d.platform,
        "content_type": d.content_type,
        "title": d.title,
        "body": d.body,
        "keywords": d.keywords or [],
        "status": d.status,
        "scheduled_at": d.scheduled_at.isoformat() if d.scheduled_at else None,
        "published_at": d.published_at.isoformat() if d.published_at else None,
        "platform_url": d.platform_url,
        "created_at": d.created_at.isoformat() if d.created_at else None,
    }


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/generate")
async def generate(
    req: GenerateRequest,
    current_user: User | None = Depends(get_current_user_optional),
) -> dict:
    """Generate content for a single platform using Claude Sonnet."""
    try:
        result = await generate_content(
            brand=req.brand,
            product=req.product,
            platform=req.platform,
            market=req.market,
            geo_gaps=req.geo_gaps,
            keywords=req.keywords,
            language=req.language,
        )
        # Determine content_type from platform
        content_type_map = {
            "reddit": "post",
            "x": "post",
            "linkedin": "post",
            "amazon": "listing",
            "blog": "article",
            "tiktok": "script",
        }
        return {
            **result,
            "platform": req.platform,
            "content_type": content_type_map.get(req.platform, "post"),
            "brand": req.brand,
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.exception("Content generation failed")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/generate/batch")
async def generate_batch_endpoint(
    req: BatchGenerateRequest,
    current_user: User | None = Depends(get_current_user_optional),
) -> dict:
    """Batch-generate content for multiple platform/keyword combos."""
    if len(req.items) > 20:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Max 20 items per batch.")
    try:
        items = [item.model_dump() for item in req.items]
        results = await generate_batch(items)
        return {"results": results, "total": len(results)}
    except Exception as e:
        logger.exception("Batch generation failed")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/drafts")
async def list_drafts(
    brand: str | None = Query(None),
    platform: str | None = Query(None),
    draft_status: str | None = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> dict:
    """List content drafts with optional filters."""
    stmt = select(ContentDraft).order_by(ContentDraft.created_at.desc())
    if brand:
        stmt = stmt.where(ContentDraft.brand.ilike(f"%{brand}%"))
    if platform:
        stmt = stmt.where(ContentDraft.platform == platform)
    if draft_status:
        stmt = stmt.where(ContentDraft.status == draft_status)
    if current_user:
        stmt = stmt.where(ContentDraft.user_id == current_user.id)

    result = await db.execute(stmt)
    drafts = result.scalars().all()
    return {"drafts": [_draft_out(d) for d in drafts], "total": len(drafts)}


@router.post("/drafts", status_code=status.HTTP_201_CREATED)
async def create_draft(
    body: DraftCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> dict:
    """Save a content draft to the database."""
    draft = ContentDraft(
        user_id=current_user.id if current_user else None,
        brand=body.brand,
        platform=body.platform,
        content_type=body.content_type,
        title=body.title,
        body=body.body,
        keywords=body.keywords,
        status=body.status,
        scheduled_at=body.scheduled_at,
    )
    db.add(draft)
    await db.commit()
    await db.refresh(draft)
    return _draft_out(draft)


@router.patch("/drafts/{draft_id}")
async def update_draft(
    draft_id: str,
    body: DraftUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> dict:
    """Update a content draft."""
    try:
        uid = uuid.UUID(draft_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid draft ID.")

    draft = await db.get(ContentDraft, uid)
    if not draft:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Draft not found.")

    if body.title is not None:
        draft.title = body.title
    if body.body is not None:
        draft.body = body.body
    if body.keywords is not None:
        draft.keywords = body.keywords
    if body.status is not None:
        draft.status = body.status
    if body.scheduled_at is not None:
        draft.scheduled_at = body.scheduled_at
    if body.platform_url is not None:
        draft.platform_url = body.platform_url

    await db.commit()
    await db.refresh(draft)
    return _draft_out(draft)


@router.delete("/drafts/{draft_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_draft(
    draft_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> None:
    """Delete a content draft."""
    try:
        uid = uuid.UUID(draft_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid draft ID.")

    draft = await db.get(ContentDraft, uid)
    if not draft:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Draft not found.")

    await db.delete(draft)
    await db.commit()


@router.post("/publish/{draft_id}")
async def publish_draft(
    draft_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> dict:
    """
    Publish a draft to its platform.
    - Reddit: posts via PRAW (if credentials configured)
    - Others: returns a draft URL for the user to publish manually
    """
    try:
        uid = uuid.UUID(draft_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid draft ID.")

    draft = await db.get(ContentDraft, uid)
    if not draft:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Draft not found.")

    platform = draft.platform
    now = datetime.now(timezone.utc)

    if platform == "reddit":
        result = await _publish_reddit(draft)
    elif platform == "x":
        result = _draft_url_x(draft)
    elif platform == "linkedin":
        result = _draft_url_linkedin(draft)
    elif platform == "amazon":
        result = {"status": "copy", "message": "Copy the listing and paste into Amazon Seller Central.", "url": None}
    elif platform == "blog":
        result = {"status": "copy", "message": "Copy the article and paste into your CMS.", "url": None}
    elif platform == "tiktok":
        result = {"status": "copy", "message": "Copy the script and record on TikTok.", "url": None}
    else:
        result = {"status": "copy", "message": f"Copy the content and publish on {platform}.", "url": None}

    if result.get("status") in ("published", "draft_url"):
        draft.status = "published" if result["status"] == "published" else "draft"
        draft.published_at = now if result["status"] == "published" else None
        if result.get("url"):
            draft.platform_url = result["url"]
        await db.commit()

    return {**result, "draft": _draft_out(draft)}


@router.post("/schedule/{draft_id}")
async def schedule_draft(
    draft_id: str,
    scheduled_at: datetime,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> dict:
    """Set a publish schedule for a draft."""
    try:
        uid = uuid.UUID(draft_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid draft ID.")

    draft = await db.get(ContentDraft, uid)
    if not draft:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Draft not found.")

    draft.scheduled_at = scheduled_at
    draft.status = "scheduled"
    await db.commit()
    await db.refresh(draft)
    return _draft_out(draft)


@router.get("/calendar")
async def get_calendar(
    brand: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> dict:
    """Return scheduled and published drafts for the calendar view."""
    stmt = select(ContentDraft).where(
        ContentDraft.status.in_(["scheduled", "published"])
    ).order_by(ContentDraft.scheduled_at.asc())

    if brand:
        stmt = stmt.where(ContentDraft.brand.ilike(f"%{brand}%"))
    if current_user:
        stmt = stmt.where(ContentDraft.user_id == current_user.id)

    result = await db.execute(stmt)
    drafts = result.scalars().all()
    return {"events": [_draft_out(d) for d in drafts], "total": len(drafts)}


# ── Platform publish helpers ───────────────────────────────────────────────────

async def _publish_reddit(draft: ContentDraft) -> dict:
    """Attempt to post to Reddit via PRAW. Falls back to draft URL if not configured."""
    from app.config import settings as cfg
    reddit_id = getattr(cfg, "reddit_client_id", None)
    reddit_secret = getattr(cfg, "reddit_client_secret", None)
    reddit_user = getattr(cfg, "reddit_username", None)
    reddit_pass = getattr(cfg, "reddit_password", None)

    if not all([reddit_id, reddit_secret, reddit_user, reddit_pass]):
        # No credentials — return copy instruction
        return {
            "status": "copy",
            "message": "Reddit credentials not configured. Copy the post and submit manually.",
            "url": "https://www.reddit.com/submit",
        }

    try:
        import asyncio
        import praw  # type: ignore

        def _post() -> str:
            r = praw.Reddit(
                client_id=reddit_id,
                client_secret=reddit_secret,
                username=reddit_user,
                password=reddit_pass,
                user_agent="Avanti Content Studio/1.0",
            )
            # Parse subreddit from title or metadata
            subreddit = "test"
            submission = r.subreddit(subreddit).submit(
                title=draft.title or "Post",
                selftext=draft.body,
            )
            return f"https://www.reddit.com{submission.permalink}"

        url = await asyncio.get_event_loop().run_in_executor(None, _post)
        return {"status": "published", "url": url, "message": "Posted to Reddit."}
    except Exception as exc:
        logger.error("Reddit publish failed: %s", exc)
        return {
            "status": "copy",
            "message": f"Reddit publish failed: {exc}. Copy and submit manually.",
            "url": "https://www.reddit.com/submit",
        }


def _draft_url_x(draft: ContentDraft) -> dict:
    """Generate an X/Twitter intent URL pre-filled with the tweet text."""
    import urllib.parse
    text = (draft.title or draft.body or "")[:280]
    url = f"https://twitter.com/intent/tweet?text={urllib.parse.quote(text)}"
    return {"status": "draft_url", "url": url, "message": "Open the link to post on X."}


def _draft_url_linkedin(draft: ContentDraft) -> dict:
    """Generate a LinkedIn share URL."""
    import urllib.parse
    text = (draft.body or "")[:1000]
    url = f"https://www.linkedin.com/sharing/share-offsite/?text={urllib.parse.quote(text)}"
    return {"status": "draft_url", "url": url, "message": "Open the link to post on LinkedIn."}
