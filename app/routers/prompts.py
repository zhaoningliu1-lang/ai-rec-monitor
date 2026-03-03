"""Prompt Library — CRUD + AI-suggest endpoints."""
import logging
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import PromptLibrary, PromptStatus
from app.routers.auth import get_current_user
from app.models import User
from app.schemas import (
    PromptCreateIn,
    PromptLibraryResponse,
    PromptSuggestIn,
    PromptUpdateIn,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/prompts", tags=["prompts"])


# ── List ──────────────────────────────────────────────────────────────────────

@router.get("", response_model=list[PromptLibraryResponse])
async def list_prompts(
    category: str | None = Query(default=None),
    region: str | None = Query(default=None),
    status: str | None = Query(default=None),
    intent_type: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    stmt = (
        select(PromptLibrary)
        .where(PromptLibrary.user_id == user.id)
        .order_by(PromptLibrary.created_at.desc())
        .limit(limit)
    )
    if category:
        stmt = stmt.where(PromptLibrary.category == category)
    if region:
        stmt = stmt.where(PromptLibrary.region == region)
    if status:
        stmt = stmt.where(PromptLibrary.status == status)
    if intent_type:
        stmt = stmt.where(PromptLibrary.intent_type == intent_type)
    result = await db.execute(stmt)
    return result.scalars().all()


# ── Create ────────────────────────────────────────────────────────────────────

@router.post("", response_model=PromptLibraryResponse, status_code=201)
async def create_prompt(
    body: PromptCreateIn,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    prompt = PromptLibrary(
        user_id=user.id,
        category=body.category,
        region=body.region,
        prompt_text=body.prompt_text,
        intent_type=body.intent_type,
        status=PromptStatus.active,
        source="user",
    )
    db.add(prompt)
    await db.commit()
    await db.refresh(prompt)
    return prompt


# ── Update ────────────────────────────────────────────────────────────────────

@router.patch("/{prompt_id}", response_model=PromptLibraryResponse)
async def update_prompt(
    prompt_id: uuid.UUID,
    body: PromptUpdateIn,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    prompt = await db.get(PromptLibrary, prompt_id)
    if not prompt or prompt.user_id != user.id:
        raise HTTPException(status_code=404, detail="Prompt not found")
    if body.status is not None:
        prompt.status = PromptStatus(body.status)
    if body.intent_type is not None:
        prompt.intent_type = body.intent_type
    if body.prompt_text is not None:
        prompt.prompt_text = body.prompt_text
    await db.commit()
    await db.refresh(prompt)
    return prompt


# ── Delete ────────────────────────────────────────────────────────────────────

@router.delete("/{prompt_id}", status_code=204)
async def delete_prompt(
    prompt_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    prompt = await db.get(PromptLibrary, prompt_id)
    if not prompt or prompt.user_id != user.id:
        raise HTTPException(status_code=404, detail="Prompt not found")
    await db.delete(prompt)
    await db.commit()


# ── AI Suggest ────────────────────────────────────────────────────────────────

@router.post("/suggest", response_model=list[PromptLibraryResponse], status_code=201)
async def suggest_prompts(
    body: PromptSuggestIn,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Use Claude Haiku to generate new prompts and save them as 'suggested'."""
    try:
        import anthropic
        client = anthropic.AsyncAnthropic()

        system = (
            "You are an expert in AI recommendation research. Generate search prompts that "
            "buyers/consumers would ask an AI assistant when shopping. Each prompt must be "
            "prefixed with [high], [comparison], or [info] based on intent:\n"
            "  [high] = purchase-intent (e.g. 'best X to buy', 'top X for Y')\n"
            "  [comparison] = comparing brands/products\n"
            "  [info] = informational (e.g. 'how does X work', 'what is Y')\n"
            "Output one prompt per line, no numbering, no extra commentary."
        )

        user_msg = (
            f"Generate {body.count} search prompts for the category '{body.category}' "
            f"in the {body.region} market. The brand being tracked is '{body.brand_name}'. "
            f"Mix intent types: roughly 50% [high], 25% [comparison], 25% [info]. "
            f"Prompts should be natural, specific, and varied. Do NOT mention '{body.brand_name}' "
            f"directly in the prompts — they should be generic category queries."
        )

        message = await client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            messages=[{"role": "user", "content": user_msg}],
            system=system,
        )
        raw = message.content[0].text.strip()

    except Exception as exc:
        logger.error("AI suggest failed: %s", exc)
        raise HTTPException(status_code=502, detail=f"AI generation failed: {exc}")

    # Parse lines
    _INTENT_MAP = {"high": "high", "comparison": "comparison", "info": "info"}
    saved: list[PromptLibrary] = []

    for line in raw.splitlines():
        line = line.strip()
        if not line:
            continue
        intent = "high"
        for tag, val in _INTENT_MAP.items():
            if line.lower().startswith(f"[{tag}]"):
                intent = val
                line = line[len(f"[{tag}]"):].strip()
                break
        if len(line) < 10:
            continue
        prompt = PromptLibrary(
            user_id=user.id,
            category=body.category,
            region=body.region,
            prompt_text=line,
            intent_type=intent,
            status=PromptStatus.suggested,
            source="ai_suggested",
        )
        db.add(prompt)
        saved.append(prompt)

    if not saved:
        raise HTTPException(status_code=502, detail="AI returned no usable prompts")

    await db.commit()
    for p in saved:
        await db.refresh(p)
    return saved
