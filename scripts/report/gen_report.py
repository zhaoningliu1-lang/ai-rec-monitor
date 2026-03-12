#!/usr/bin/env python3
"""
Avanti Weekly AI Visibility Report Generator
Usage:
  python scripts/report/gen_report.py                         # use sample data
  python scripts/report/gen_report.py path/to/data.json       # use custom data
Output:
  docs/reports/<brand>-<date>.pdf
"""

import sys
import json
import asyncio
from pathlib import Path
from datetime import datetime
from jinja2 import Environment, FileSystemLoader

SCRIPT_DIR = Path(__file__).parent
TEMPLATE_FILE = SCRIPT_DIR / "template.html"
OUTPUT_DIR = Path(__file__).parent.parent.parent / "docs" / "reports"


def load_data(data_path: Path | None = None) -> dict:
    if data_path is None:
        data_path = SCRIPT_DIR / "sample_data.json"
    return json.loads(data_path.read_text(encoding="utf-8"))


def render_html(data: dict) -> str:
    env = Environment(
        loader=FileSystemLoader(str(SCRIPT_DIR)),
        autoescape=False,
    )
    template = env.get_template("template.html")
    return template.render(**data)


async def html_to_pdf(html: str, output_path: Path):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_content(html, wait_until="networkidle")
        await page.pdf(
            path=str(output_path),
            format="A4",
            print_background=True,
            margin={"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"},
        )
        await browser.close()


def generate_report(data_path: str | None = None) -> Path:
    data = load_data(Path(data_path) if data_path else None)

    # Build output filename (use report_slug if present for multi-product brands)
    name_slug = data.get("report_slug") or data["brand"].lower().replace(" ", "-")
    date_slug = datetime.now().strftime("%Y-%m-%d")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OUTPUT_DIR / f"{name_slug}-{date_slug}.pdf"

    print(f"Generating report for: {data['brand']}")
    html = render_html(data)

    # Optionally save HTML for debugging
    debug_html = output_path.with_suffix(".html")
    debug_html.write_text(html, encoding="utf-8")
    print(f"  HTML preview: {debug_html}")

    asyncio.run(html_to_pdf(html, output_path))
    print(f"  ✓ PDF saved:  {output_path}")
    return output_path


if __name__ == "__main__":
    data_arg = sys.argv[1] if len(sys.argv) > 1 else None
    generate_report(data_arg)
