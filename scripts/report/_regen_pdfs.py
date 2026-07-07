"""Regenerate both PDFs from existing JSON data (no API calls)."""
import asyncio, json, sys
from pathlib import Path
from datetime import datetime

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from gen_mckinsey_report import build_report_html, html_to_pdf, OUTPUT_DIR


async def regen(product_key):
    data_path = SCRIPT_DIR / f"supuon_{product_key}_data.json"
    if not data_path.exists():
        print(f"  SKIP: {data_path} not found")
        return
    data = json.loads(data_path.read_text(encoding="utf-8"))
    name_slug = data.get("report_slug") or data["brand"].lower().replace(" ", "-")
    date_slug = datetime.now().strftime("%Y-%m-%d")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output = OUTPUT_DIR / f"{name_slug}-{date_slug}.pdf"

    html = build_report_html(data)
    output.with_suffix(".html").write_text(html, encoding="utf-8")
    print(f"  HTML: {output.with_suffix('.html')}")

    await html_to_pdf(html, output)
    print(f"  PDF: {output}")


async def main():
    for key in ["pillow", "pump"]:
        print(f"\n=== {key} ===")
        await regen(key)
    print("\nDone.")


if __name__ == "__main__":
    asyncio.run(main())
