#!/usr/bin/env python3
"""
Generate .eml files for Avanti cold outreach emails.

Each .eml file opens directly in Outlook / Mail.app with To/Subject/Body
pre-filled. You review, then click Send. Nothing is auto-sent.

Usage:
    python3 scripts/send_emails.py --dry-run         # preview in terminal
    python3 scripts/send_emails.py                   # write .eml files to exports/outreach/
    python3 scripts/send_emails.py --brand Spigen    # single brand only
    python3 scripts/send_emails.py --open            # write AND open all in Mail.app
"""
import argparse
import subprocess
import sys
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid
from pathlib import Path

# Load .env if python-dotenv is available, otherwise fall back to os.environ
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env")
except ImportError:
    pass  # assume env vars are already set

FROM_NAME = "Johnson Liu | Avanti Growth Lab"
FROM_ADDR = "johnsonliu@hks.harvard.edu"

OUTPUT_DIR = Path(__file__).parent.parent / "exports" / "outreach"

# ── Email templates ─────────────────────────────────────────────────────────
# Each entry: brand → {to, subject, body}
# Body rules: 100–140 words, one CTA only, no links, no ARRS/internal terms.

EMAILS: dict[str, dict] = {

    "Nekteck": {
        "to": "bella@nekteck.com",
        "subject": "Nekteck barely shows up in AI product recommendations",
        "body": """\
Hi,

I ran an AI recommendation audit on the USB-C charger market last week — tracking which brands appear when people ask ChatGPT and Perplexity for product advice.

Nekteck's visibility came back at the bottom of the category. When someone asks "best USB-C charger under $30," Anker shows up consistently. Nekteck almost never does. The gap is significant — not a rounding error.

My read: this isn't a product problem. It's a content signal problem. AI models pull from reviews, articles, and structured content across the web — and right now, the signals point elsewhere.

I put together a one-page breakdown with the exact gaps and a two-week fix list.

Should I send it over?

Johnson Liu
Avanti Growth Lab""",
    },

    "Spigen": {
        "to": "vkim@spigen.com",
        "subject": "Quick question about Spigen's AI search visibility",
        "body": """\
Hi Vincent,

I ran an AI recommendation analysis on the USB-C charger space — querying ChatGPT and Perplexity hundreds of times the way a real buyer would.

Spigen's numbers surprised me. Your Amazon reviews are strong, but in AI comparison queries — "Spigen vs Anker USB-C charger" type searches — Anker is winning by a wide margin. Spigen showed up in fewer than 15% of comparison queries where Anker appeared in 60%+.

That gap matters more than it used to. AI assistants are increasingly where buying decisions start, before someone even opens Amazon.

I made a one-page snapshot of where the gap is and what's driving it.

Should I send it over?

Johnson Liu
Avanti Growth Lab""",
    },

    "Renogy": {
        "to": "echo.deng@renogy.com",
        "subject": "Renogy's AI search visibility vs EcoFlow/Jackery",
        "body": """\
Hi Echo,

Given your ecommerce focus, here's a channel worth looking at more closely.

I ran an AI recommendation audit on the portable power station market — querying ChatGPT hundreds of times the way a buyer would. Renogy's share of AI recommendations is running about 56 points behind EcoFlow on comparable queries. In high-intent searches ("best portable power station for camping"), EcoFlow and Jackery show up together. Renogy appears inconsistently.

This is separate from SEO — different mechanism, different fix. The good news is the gaps are specific and addressable.

I have a one-page breakdown ready.

Should I send it over?

Johnson Liu
Avanti Growth Lab""",
    },

    "Ugreen": {
        "to": "erica.you@ugreen.com",
        "subject": "Ugreen's AI recommendation gap vs Anker — and how it affects your affiliate channel",
        "body": """\
Hi Erica,

Given your affiliate marketing role, this might be relevant: AI assistants are increasingly shaping which products affiliates feature and recommend.

I ran an AI recommendation audit on the USB-C charger market — tracking which brands actually get recommended by ChatGPT, Perplexity, and others. Ugreen has a meaningful gap vs Anker on weighted AI visibility. When someone asks "best USB-C charger for fast charging," Anker shows up in 65%+ of responses. Ugreen appears in under 30%.

The mechanism is different from paid search or affiliate links — and the fix is different too. I put together a one-page breakdown showing exactly where the gap sits.

Should I send it over?

Johnson Liu
Avanti Growth Lab

---

中文摘要：

我做了一个 AI 推荐可见度分析，追踪 ChatGPT 等工具在 USB-C 充电器类目里真实推荐哪些品牌。数据显示 Ugreen 与 Anker 存在显著的可见度差距——这会直接影响到用 AI 辅助选品的用户和推广渠道。如果有兴趣，我可以把详细数据发给您看看。""",
    },

    "Goal Zero": {
        "to": "felipe.soares@goalzero.com",
        "subject": "Goal Zero's AI recommendation visibility in portable power stations",
        "body": """\
Hi Felipe,

I built a tool that tracks brand visibility in AI recommendation queries — what ChatGPT actually suggests when someone searches for portable power stations the way a real buyer would.

I ran Goal Zero against EcoFlow, Jackery, and Anker across hundreds of queries. Your ecommerce presence is strong, but AI recommendation visibility is a separate signal — and Goal Zero's score shows a meaningful gap vs EcoFlow specifically in high-intent queries.

With AI assistants increasingly being the first stop for product research (especially for higher-ticket items like power stations), that gap is worth knowing.

I have a one-page breakdown ready.

Should I send it over?

Johnson Liu
Avanti Growth Lab""",
    },

    "Lion Energy": {
        "to": "shaun@lionenergy.com",
        "subject": "Lion Energy's AI recommendation data — a few specific gaps worth seeing",
        "body": """\
Hi Shaun,

I track how brands show up in AI recommendation queries — the results when buyers ask ChatGPT "what's the best lithium power station for home backup?" rather than a Google search.

Lion Energy's overall score is solid for your category. But there are specific query types — particularly comparison and home-backup use cases — where EcoFlow consistently appears and Lion Energy doesn't. That's a fixable gap, and it's narrow enough to close.

I put together a one-page snapshot with the specific query patterns and a two-week action list.

Should I send it over?

Johnson Liu
Avanti Growth Lab""",
    },

    "EcoFlow": {
        "to": "alexandra.holub@ecoflow.com",
        "subject": "EcoFlow's AI recommendation position — and where competitors are catching up",
        "body": """\
Hi Alexandra,

I ran a broad AI recommendation audit on the portable power station market last week — tracking what ChatGPT and Perplexity actually suggest when buyers are researching products.

EcoFlow's numbers are strong. You're the most consistently recommended brand in the category across high-intent queries. But a couple areas caught my eye: Jackery is closing the gap on informational queries, and Goal Zero is showing stronger numbers in outdoor-use comparisons than you might expect.

Worth knowing if you're planning marketing investment this quarter. I have a full breakdown with the specific query types and competitor positions.

Should I send it over?

Johnson Liu
Avanti Growth Lab""",
    },

    "Jackery": {
        "to": "jenny@jackery.com",
        "subject": "Jackery's AI search position — one area worth watching",
        "body": """\
Hi Jenny,

I built a tool to track brand visibility in AI recommendation queries — what ChatGPT actually suggests when someone searches for portable power stations before buying.

Jackery's overall position is strong. You rank consistently in high-intent queries. But in comparison searches — the moment when a buyer is deciding between brands — EcoFlow is capturing more of the conversation than the Amazon rankings would suggest. My read: your AI search position is solid but not untouchable.

I have a one-page breakdown of where you're leading and where the gap is narrowest.

Should I send it over?

Johnson Liu
Avanti Growth Lab""",
    },

    # ── Chinese 3C brands (Feb 2026 audit) ──────────────────────────────────

    "ROMOSS": {
        "to": "marketingteam@romoss.com",
        "subject": "ROMOSS's AI recommendation gap vs Anker — power bank category",
        "body": """\
Hi,

I ran an AI recommendation audit on the power bank market last week — querying ChatGPT and Perplexity hundreds of times the way a real buyer would.

ROMOSS's numbers stood out. In high-intent searches like "best power bank for travel" and "portable charger under $30," Anker captures the top slot consistently. ROMOSS's weighted AI visibility came in at 18% — the lowest in the category I tested. Anker and Mophie together account for over 80% of recommendations on comparable queries.

This is separate from Amazon rankings. AI assistants pull from reviews, editorial content, and structured signals across the web — and right now, those signals point elsewhere.

I have a one-page breakdown with the specific query gaps and a two-week fix list.

Should I send it over?

Johnson Liu
Avanti Growth Lab

---

中文摘要：

我做了一个 AI 推荐可见度分析，追踪 ChatGPT 等工具在移动电源类目里真实推荐哪些品牌。数据显示 ROMOSS 的 AI 加权可见度只有 18%，在同类品牌中差距最为明显。如果有兴趣了解具体差距和改善方向，我可以把详细报告发给您。""",
    },

    "QCY": {
        "to": "pr@qcyearphone.com",
        "subject": "QCY's AI search visibility gap in wireless earbuds",
        "body": """\
Hi,

I built a tool that tracks brand visibility in AI recommendation queries — what ChatGPT actually suggests when someone asks for wireless earbuds before buying.

I ran QCY against Tozo and EarFun across 60 queries. QCY's weighted AI visibility came in at 23.5%, trailing both competitors in high-intent queries like "best wireless earbuds under $50." In direct comparison searches — "QCY vs Tozo" type queries — the gap widens further.

Your Amazon presence is strong. But AI assistants are increasingly the first stop for product research, and the content signals they pull from are different from what drives Amazon rankings.

I have a one-page breakdown showing the exact query types where the gap is biggest.

Should I send it over?

Johnson Liu
Avanti Growth Lab

---

中文摘要：

我做了一个 AI 推荐可见度分析，追踪 ChatGPT 等工具在真无线耳机类目里的品牌推荐情况。数据显示 QCY 的 AI 加权可见度为 23.5%，在与 Tozo、EarFun 的对比查询中差距明显。如感兴趣可将详细报告发给您参考。""",
    },

    "Mpow": {
        "to": "peter@xmpow.com",
        "subject": "Mpow's AI recommendation position vs Jabra and Soundcore",
        "body": """\
Hi Peter,

I track how brands appear in AI recommendation queries — what ChatGPT suggests when buyers search for Bluetooth headsets rather than going straight to Amazon.

I ran Mpow against Jabra and Soundcore across 60 queries in the Bluetooth headset category. Mpow's weighted AI visibility came in at 24.6%. In high-intent queries — "best Bluetooth headset for calls" and "wireless headset under $50" — Jabra and Soundcore consistently appear together. Mpow appears inconsistently.

The mechanism is different from paid search or affiliate channels, and the fix is specific and addressable. I put together a one-page breakdown of where the gap is and what's driving it.

Should I send it over?

Johnson Liu
Avanti Growth Lab

---

中文摘要：

我做了一个 AI 推荐可见度分析，追踪 ChatGPT 在蓝牙耳机类目里真实推荐哪些品牌。Mpow 的 AI 加权可见度为 24.6%，在高意向查询中落后于 Jabra 和 Soundcore。如有兴趣，可将具体分析报告发给您。""",
    },

    "Choetech": {
        "to": "kelly@choetech.com",
        "subject": "Choetech's AI visibility gap in wireless charging — vs Anker and Belkin",
        "body": """\
Hi Kelly,

I ran an AI recommendation audit on the wireless charging pad market — tracking what ChatGPT and Perplexity actually suggest when buyers are researching products.

Choetech's weighted AI visibility came in at 28.6% on comparable queries. In high-intent searches like "best wireless charging pad for iPhone" and "Qi charger under $30," Anker and Belkin appear together consistently. Choetech appears in some queries but not others — particularly weak in comparison searches.

With AI assistants increasingly shaping which products end up on review sites and buying guides, that inconsistency is worth addressing.

I have a one-page breakdown with the specific query gaps and a short action list.

Should I send it over?

Johnson Liu
Avanti Growth Lab

---

中文摘要：

我做了一个 AI 推荐可见度分析，追踪 ChatGPT 在无线充电类目里的品牌推荐情况。Choetech 的 AI 加权可见度为 28.6%，在与 Anker、Belkin 的对比查询中表现不稳定。如有兴趣，可发送详细报告给您参考。""",
    },

    "Meross": {
        "to": "eric.wang@meross.com",
        "subject": "Meross's AI recommendation visibility vs Kasa and Wemo",
        "body": """\
Hi Eric,

I ran an AI recommendation audit on the smart home plug market — querying ChatGPT hundreds of times the way a buyer would when researching before purchase.

Meross's weighted AI visibility came in at 30.5% on comparable queries. In high-intent searches like "best smart plug for home automation" and "HomeKit-compatible smart switch," Kasa and Wemo show up together consistently. Meross appears in a number of queries, but the comparison and use-case searches show a clear gap.

Given Meross's strong product lineup and Amazon presence, the gap looks more like a content signal issue than a product issue — which means it's fixable.

I have a one-page breakdown ready.

Should I send it over?

Johnson Liu
Avanti Growth Lab

---

中文摘要：

我做了一个 AI 推荐可见度分析，追踪 ChatGPT 在智能插座/开关类目里的品牌推荐情况。Meross 的 AI 加权可见度为 30.5%，在高意向查询中落后于 Kasa 和 Wemo。如有兴趣，可将详细报告发给您。""",
    },
}


# ── .eml builder ────────────────────────────────────────────────────────────

def build_mime(from_addr: str, to_addr: str, subject: str, body: str) -> MIMEMultipart:
    msg = MIMEMultipart("alternative")
    msg["From"] = f"{FROM_NAME} <{from_addr}>"
    msg["To"] = to_addr
    msg["Subject"] = subject
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid()
    msg.attach(MIMEText(body, "plain", "utf-8"))
    return msg


def write_eml(brand: str, entry: dict) -> Path:
    """Write a single .eml file; return the path."""
    msg = build_mime(FROM_ADDR, entry["to"], entry["subject"], entry["body"])
    slug = brand.lower().replace(" ", "_")
    path = OUTPUT_DIR / f"{slug}.eml"
    path.write_bytes(msg.as_bytes())
    return path


def preview(brand: str, entry: dict) -> None:
    sep = "─" * 60
    print(f"\n{sep}")
    print(f"  Brand   : {brand}")
    print(f"  To      : {entry['to']}")
    print(f"  Subject : {entry['subject']}")
    print(sep)
    print(entry["body"])


# ── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Generate .eml outreach files for Avanti")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print emails to terminal, do not write files")
    parser.add_argument("--brand", metavar="NAME",
                        help="Single brand only (e.g. 'Spigen')")
    parser.add_argument("--open", action="store_true",
                        help="Open each .eml in Mail.app after writing")
    args = parser.parse_args()

    # Select brands
    if args.brand:
        if args.brand not in EMAILS:
            print(f"✗ Brand '{args.brand}' not found. Available: {', '.join(EMAILS)}")
            sys.exit(1)
        brands = {args.brand: EMAILS[args.brand]}
    else:
        brands = EMAILS

    # Dry-run: just print
    if args.dry_run:
        print(f"\n{'═'*60}")
        print("  DRY-RUN — no files written")
        print(f"{'═'*60}")
        for brand, entry in brands.items():
            preview(brand, entry)
        print(f"\n✓ {len(brands)} email(s) previewed.\n")
        return

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"\nWriting .eml files to {OUTPUT_DIR}/\n")

    written = []
    for brand, entry in brands.items():
        path = write_eml(brand, entry)
        print(f"  ✓ {brand:15s} → {path.name}")
        written.append(path)

    print(f"\n{'─'*50}")
    print(f"✓ {len(written)} .eml file(s) ready.")
    print(f"  Folder: {OUTPUT_DIR}")
    print("\n  To send: double-click any .eml → opens in Outlook/Mail → click Send.\n")

    if args.open:
        for path in written:
            subprocess.run(["open", str(path)])


if __name__ == "__main__":
    main()
