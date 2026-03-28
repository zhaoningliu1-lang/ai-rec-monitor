"""Client Report Portal — upload, share, and track report views."""

import secrets
import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel, Field
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session_factory, get_db
from app.models import ReportView, SharedReport, User
from app.routers.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["reports-portal"])

SITE_URL = "https://avantia2a.com"


# ── Schemas ──────────────────────────────────────────────────────────────────

class UploadReportRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    html_content: str = Field(..., min_length=10)
    brand_name: str | None = None
    slug: str | None = Field(None, min_length=3, max_length=100, pattern=r"^[a-zA-Z0-9\-]+$")


class SharedReportOut(BaseModel):
    id: str
    token: str
    title: str
    brand_name: str | None
    share_url: str
    view_count: int
    is_active: bool
    created_at: str


class ReportMetaOut(BaseModel):
    title: str
    brand_name: str | None
    created_at: str


class ReportViewOut(BaseModel):
    viewed_at: str
    ip_address: str | None
    user_agent: str | None


# ── Helpers ──────────────────────────────────────────────────────────────────

def _to_out(r: SharedReport) -> SharedReportOut:
    return SharedReportOut(
        id=str(r.id),
        token=r.token,
        title=r.title,
        brand_name=r.brand_name,
        share_url=f"{SITE_URL}/r/{r.token}",
        view_count=r.view_count,
        is_active=r.is_active,
        created_at=r.created_at.isoformat() if r.created_at else "",
    )


async def _record_view(report_id: uuid.UUID, ip: str | None, ua: str | None):
    """Record a view in the background (non-blocking)."""
    async with async_session_factory() as db:
        view = ReportView(report_id=report_id, ip_address=ip, user_agent=ua)
        db.add(view)
        await db.execute(
            update(SharedReport)
            .where(SharedReport.id == report_id)
            .values(view_count=SharedReport.view_count + 1)
        )
        await db.commit()


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/upload", response_model=SharedReportOut)
async def upload_report(
    body: UploadReportRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload report HTML and get a shareable link."""
    token = body.slug or secrets.token_urlsafe(9)

    # Check uniqueness
    existing = await db.execute(
        select(SharedReport.id).where(SharedReport.token == token)
    )
    if existing.scalar_one_or_none():
        if body.slug:
            raise HTTPException(status_code=409, detail=f"Slug '{body.slug}' already taken")
        token = secrets.token_urlsafe(9)  # retry once

    report = SharedReport(
        user_id=user.id,
        token=token,
        title=body.title,
        brand_name=body.brand_name,
        html_content=body.html_content,
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return _to_out(report)


@router.get("", response_model=list[SharedReportOut])
async def list_reports(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all reports owned by the current user."""
    result = await db.execute(
        select(SharedReport)
        .where(SharedReport.user_id == user.id, SharedReport.is_active == True)  # noqa: E712
        .order_by(SharedReport.created_at.desc())
    )
    return [_to_out(r) for r in result.scalars().all()]


@router.get("/{token}/html", response_class=HTMLResponse)
async def get_report_html(
    token: str,
    request: Request,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """Public endpoint — serve report HTML and track the view."""
    result = await db.execute(
        select(SharedReport).where(SharedReport.token == token, SharedReport.is_active == True)  # noqa: E712
    )
    report = result.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    # Track view in background
    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent")
    background_tasks.add_task(_record_view, report.id, ip, ua)

    return HTMLResponse(content=report.html_content)


@router.get("/{token}/meta", response_model=ReportMetaOut)
async def get_report_meta(
    token: str,
    db: AsyncSession = Depends(get_db),
):
    """Public endpoint — return report metadata (for OG tags, no HTML content)."""
    result = await db.execute(
        select(SharedReport.title, SharedReport.brand_name, SharedReport.created_at)
        .where(SharedReport.token == token, SharedReport.is_active == True)  # noqa: E712
    )
    row = result.one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="Report not found")
    return ReportMetaOut(
        title=row.title,
        brand_name=row.brand_name,
        created_at=row.created_at.isoformat() if row.created_at else "",
    )


@router.get("/{report_id}/analytics", response_model=list[ReportViewOut])
async def get_report_analytics(
    report_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """View detailed analytics for a report (owner only)."""
    report = await db.get(SharedReport, report_id)
    if not report or report.user_id != user.id:
        raise HTTPException(status_code=404, detail="Report not found")

    result = await db.execute(
        select(ReportView)
        .where(ReportView.report_id == report_id)
        .order_by(ReportView.viewed_at.desc())
        .limit(200)
    )
    return [
        ReportViewOut(
            viewed_at=v.viewed_at.isoformat() if v.viewed_at else "",
            ip_address=v.ip_address,
            user_agent=v.user_agent,
        )
        for v in result.scalars().all()
    ]


@router.delete("/{report_id}")
async def delete_report(
    report_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Soft-delete a report (owner only)."""
    report = await db.get(SharedReport, report_id)
    if not report or report.user_id != user.id:
        raise HTTPException(status_code=404, detail="Report not found")
    report.is_active = False
    await db.commit()
    return {"ok": True}
