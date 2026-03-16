"""
Standalone script: Load existing report data JSON, generate execution deliverables
via Claude API, merge them in, and re-generate the PDF.
No engine re-scanning needed.
"""
import sys, json, asyncio, os
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent

# Add project root to path so we can import from scripts/
sys.path.insert(0, str(PROJECT_ROOT / "scripts"))

from run_geo_supuon import generate_execution_deliverables, PRODUCTS

ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY", "")


async def add_deliverables_to(product_key: str):
    cfg = PRODUCTS[product_key]
    data_path = SCRIPT_DIR / f"supuon_{product_key}_data.json"

    if not data_path.exists():
        print(f"  ERROR: {data_path} not found")
        return

    print(f"\n  Loading {data_path.name}...")
    data = json.loads(data_path.read_text(encoding="utf-8"))

    # Build minimal scores dict from existing data
    scores = {
        "overall_geo": data.get("geo_score", 6),
        "comp_table": data.get("competitors", []),
        "engine_scores": {},
    }
    for eng in data.get("engine_details", []):
        scores["engine_scores"][eng["name"]] = eng

    actions = data.get("extended_narrative", {}).get("actions", data.get("actions", []))
    competitor_dive = data.get("competitor_deep_dive", {})
    best_in_class = data.get("best_in_class", {})

    print(f"  Generating execution deliverables ({len(actions)} actions)...")
    deliverables = await generate_execution_deliverables(
        cfg, scores, actions, competitor_dive, best_in_class
    )
    print(f"  Generated {len(deliverables)} deliverable sections")

    # Merge into data
    data["execution_deliverables"] = deliverables

    # Save updated JSON
    data_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  Updated: {data_path}")

    # Re-generate PDF
    print(f"  Generating PDF...")
    from gen_mckinsey_report import build_report_html, html_to_pdf, OUTPUT_DIR
    from datetime import datetime as _dt

    name_slug = data.get("report_slug") or data["brand"].lower().replace(" ", "-")
    date_slug = _dt.now().strftime("%Y-%m-%d")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OUTPUT_DIR / f"{name_slug}-{date_slug}.pdf"

    html_content = build_report_html(data)
    debug_html = output_path.with_suffix(".html")
    debug_html.write_text(html_content, encoding="utf-8")
    print(f"  HTML preview: {debug_html}")

    await html_to_pdf(html_content, output_path)
    print(f"  PDF saved: {output_path}")


async def main():
    target = sys.argv[1] if len(sys.argv) > 1 else "all"

    if target == "all":
        keys = list(PRODUCTS.keys())
    elif target in PRODUCTS:
        keys = [target]
    else:
        print(f"Unknown: {target}. Use: {', '.join(PRODUCTS)} or all")
        sys.exit(1)

    for key in keys:
        await add_deliverables_to(key)

    print("\nDone.")


if __name__ == "__main__":
    asyncio.run(main())
