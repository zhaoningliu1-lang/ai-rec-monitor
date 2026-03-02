"""Export a run's metrics as a structured Notion page."""
import logging
from datetime import datetime, timezone

from notion_client import AsyncClient

from app.config import settings

logger = logging.getLogger(__name__)


# ── Rich-text / block helpers ─────────────────────────────────────────────────

def _txt(content: str) -> list:
    return [{"type": "text", "text": {"content": content}}]


def _bold(content: str) -> list:
    return [{"type": "text", "text": {"content": content}, "annotations": {"bold": True}}]


def _h2(text: str) -> dict:
    return {"object": "block", "type": "heading_2", "heading_2": {"rich_text": _txt(text)}}


def _h3(text: str) -> dict:
    return {"object": "block", "type": "heading_3", "heading_3": {"rich_text": _txt(text)}}


def _paragraph(text: str) -> dict:
    return {"object": "block", "type": "paragraph", "paragraph": {"rich_text": _txt(text)}}


def _divider() -> dict:
    return {"object": "block", "type": "divider", "divider": {}}


def _callout(text: str, emoji: str, color: str) -> dict:
    return {
        "object": "block",
        "type": "callout",
        "callout": {
            "rich_text": _txt(text),
            "icon": {"emoji": emoji},
            "color": color,
        },
    }


# ── Formatters ────────────────────────────────────────────────────────────────

def _pct(v: float | None) -> str:
    return f"{v:.1f}%" if v is not None else "—"


def _num(v: float | None) -> str:
    return f"{v:.1f}" if v is not None else "—"


def _pos_rate(sentiment: dict) -> str:
    total = sum(sentiment.values())
    if not total:
        return "—"
    return f"{sentiment.get('positive', 0) / total * 100:.1f}%"


# ── Brand comparison table block ──────────────────────────────────────────────

_TABLE_HEADERS = ["Brand", "Mention Rate", "SOV", "Weighted SOV", "Avg Pos", "Pos Sent", "ARRS"]


def _brand_table_block(brand_table: list[dict]) -> dict | None:
    if not brand_table:
        return None

    rows = [
        {
            "object": "block",
            "type": "table_row",
            "table_row": {"cells": [_bold(h) for h in _TABLE_HEADERS]},
        }
    ]
    for row in brand_table:
        rows.append({
            "object": "block",
            "type": "table_row",
            "table_row": {
                "cells": [
                    _txt(row.get("name", "")),
                    _txt(_pct(row.get("mention_rate"))),
                    _txt(_pct(row.get("sov"))),
                    _txt(_pct(row.get("weighted_sov"))),
                    _txt(_num(row.get("avg_position"))),
                    _txt(_pos_rate(row.get("sentiment", {}))),
                    _txt(_num(row.get("arrs"))),
                ]
            },
        })

    return {
        "object": "block",
        "type": "table",
        "table": {
            "table_width": len(_TABLE_HEADERS),
            "has_column_header": True,
            "has_row_header": False,
            "children": rows,
        },
    }


# ── Main export function ──────────────────────────────────────────────────────

async def export_run_to_notion(run, metrics: dict) -> str:
    """
    Create a Notion page for the given run + metrics.
    Returns the URL of the created page.
    """
    notion = AsyncClient(auth=settings.notion_token)
    db_id = settings.notion_database_id

    date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    title = f"{run.brand_name} · {run.category} · {run.region} · {date_str}"

    primary = next((r for r in metrics["brand_table"] if r.get("is_primary")), None)

    blocks: list[dict] = []

    # ── Key stats callout ──────────────────────────────────────────────────────
    if primary:
        summary = (
            f"Mention Rate: {_pct(primary.get('mention_rate'))}  |  "
            f"SOV: {_pct(primary.get('sov'))}  |  "
            f"Weighted SOV: {_pct(primary.get('weighted_sov'))}  |  "
            f"ARRS: {_num(metrics.get('arrs'))} / 100  ({metrics.get('arrs_band', '').upper()})"
        )
        blocks.append(_callout(summary, "📊", "blue_background"))

    if metrics.get("arrs_explain"):
        blocks.append(_callout(metrics["arrs_explain"], "⚠️", "yellow_background"))

    # ── Brand comparison table ─────────────────────────────────────────────────
    blocks.append(_divider())
    blocks.append(_h2("Brand Comparison"))
    tbl = _brand_table_block(metrics["brand_table"])
    if tbl:
        blocks.append(tbl)

    # ── By intent type ─────────────────────────────────────────────────────────
    blocks.append(_divider())
    blocks.append(_h2("By Intent Type"))
    for section in metrics.get("intent_sections", []):
        itbl = _brand_table_block(section.get("brand_table", []))
        if itbl is None:
            continue
        label = section.get("label", section.get("intent_type", ""))
        weight = section.get("weight", "")
        count = section.get("count", 0)
        blocks.append(_h3(f"{label}  (n={count}, weight={weight}×)"))
        blocks.append(itbl)

    # ── By provider (only when >1 provider used) ───────────────────────────────
    if len(metrics.get("providers_used", [])) > 1:
        blocks.append(_divider())
        blocks.append(_h2("By Provider"))
        for psec in metrics.get("provider_sections", []):
            ptbl = _brand_table_block(psec.get("brand_table", []))
            if ptbl is None:
                continue
            pname = psec["provider"]
            parrs = psec.get("arrs", "—")
            blocks.append(_h3(f"{pname}  (n={psec['total']}, ARRS={parrs})"))
            blocks.append(ptbl)

    # ── Metadata footer ────────────────────────────────────────────────────────
    blocks.append(_divider())
    providers_str = ", ".join(metrics.get("providers_used", []))
    blocks.append(_paragraph(
        f"Run ID: {run.id}  |  "
        f"Prompts: {metrics.get('total', '?')}  |  "
        f"Providers: {providers_str}  |  "
        f"Failed: {metrics.get('failed_count', 0)}"
    ))

    resp = await notion.pages.create(
        parent={"database_id": db_id},
        properties={
            "Brand": {"title": [{"text": {"content": title}}]}
        },
        children=blocks,
    )

    page_id = resp["id"].replace("-", "")
    return f"https://www.notion.so/{page_id}"
