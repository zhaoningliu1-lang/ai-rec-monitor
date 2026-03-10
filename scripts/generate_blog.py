#!/usr/bin/env python3
"""
Daily blog post generator for Avanti GEO platform.

Generates EN + ZH blog posts using Claude API (falls back to OpenAI).
Run by GitHub Actions cron daily at 6am UTC.

Usage:
    ANTHROPIC_API_KEY=... python scripts/generate_blog.py
"""

import os
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

# ─── Paths ────────────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).parent.parent
BLOG_DIR_EN = REPO_ROOT / "frontend" / "app" / "blog"
BLOG_DIR_ZH = REPO_ROOT / "frontend" / "app" / "zh" / "blog"
BLOG_INDEX_EN = BLOG_DIR_EN / "page.tsx"
BLOG_INDEX_ZH = BLOG_DIR_ZH / "page.tsx"

# ─── Date ─────────────────────────────────────────────────────────────────────
TODAY = datetime.now(timezone.utc)
DATE_EN = TODAY.strftime("%B %-d, %Y")      # "March 10, 2026"
DATE_ZH = TODAY.strftime("%Y年%-m月%-d日")   # "2026年3月10日"
SLUG_DATE = TODAY.strftime("%Y-%m-%d")

# ─── Topic rotation ───────────────────────────────────────────────────────────
TOPICS = [
    {
        "type": "ai_trend",
        "prompt": (
            "AI recommendation trends in cross-border ecommerce this week — "
            "which product categories are AI models (ChatGPT, Claude, Gemini, Perplexity) "
            "recommending most, with brand-level SOV data and seller implications"
        ),
        "tag_en": "AI Trend Report",
        "tag_zh": "AI 趋势报告",
    },
    {
        "type": "geo_update",
        "prompt": (
            "GEO (Generative Engine Optimization) industry update — "
            "new strategies brands are using to improve AI visibility, "
            "recent shifts in how AI models cite brands, and practical tactics for Amazon sellers"
        ),
        "tag_en": "GEO Industry Update",
        "tag_zh": "GEO 行业动态",
    },
    {
        "type": "seller_insight",
        "prompt": (
            "Cross-border ecommerce AI intelligence for Chinese Amazon sellers — "
            "how to use AI recommendation data to identify sourcing opportunities before competitors, "
            "with specific category examples and GEO Score benchmarks"
        ),
        "tag_en": "Seller Intelligence",
        "tag_zh": "卖家情报",
    },
    {
        "type": "category_spotlight",
        "prompt": (
            "Category spotlight: deep analysis of AI recommendations in one specific product category "
            "(pick a trending cross-border ecommerce category like smart home, outdoor gear, "
            "beauty tech, or portable electronics) — which brands dominate AI citations and why"
        ),
        "tag_en": "Category Spotlight",
        "tag_zh": "品类聚焦",
    },
]

# ─── AI content schema (Claude system prompt) ─────────────────────────────────
SYSTEM_PROMPT = """You are a senior analyst at Avanti, a GEO (Generative Engine Optimization) monitoring platform for cross-border e-commerce sellers. You write data-driven research reports about AI recommendation trends and brand visibility.

Your writing style: specific, data-driven (concrete percentages, brand names, numbers), practical and actionable for Amazon sellers. No fluff.

Generate blog content as a JSON object with EXACTLY this schema:
{
  "slug": "YYYY-MM-DD-topic-keyword",
  "en": {
    "title": "Compelling headline (max 80 chars)",
    "description": "SEO meta description (max 155 chars)",
    "tag": "category tag",
    "readTime": "X min read",
    "intro": "2-3 sentence intro paragraph with specific data",
    "keyFindings": ["finding with data", "finding with data", "finding with data", "finding with data"],
    "sections": [
      {"title": "Section heading", "content": "2-3 paragraphs of section content with specific data points"},
      {"title": "Section heading", "content": "..."},
      {"title": "Section heading", "content": "..."}
    ],
    "dataRows": [
      {"label": "Brand/Category name", "metric": "34.2%", "signal": "STRONG BUY", "insight": "one-line insight", "colorKey": "green"},
      {"label": "...", "metric": "...", "signal": "WATCH", "insight": "...", "colorKey": "orange"},
      {"label": "...", "metric": "...", "signal": "AVOID", "insight": "...", "colorKey": "red"}
    ]
  },
  "zh": {
    "title": "中文标题（不超过40字）",
    "description": "中文SEO描述（不超过80字）",
    "tag": "中文标签",
    "readTime": "X 分钟阅读",
    "intro": "中文介绍段落，包含具体数据",
    "keyFindings": ["中文发现1", "中文发现2", "中文发现3", "中文发现4"],
    "sections": [
      {"title": "中文章节标题", "content": "中文内容，包含具体数据"},
      {"title": "...", "content": "..."},
      {"title": "...", "content": "..."}
    ],
    "dataRows": [
      {"label": "品牌/品类", "metric": "34.2%", "signal": "强势买入", "insight": "一行洞察", "colorKey": "green"},
      {"label": "...", "metric": "...", "signal": "观望", "insight": "...", "colorKey": "orange"},
      {"label": "...", "metric": "...", "signal": "回避", "insight": "...", "colorKey": "red"}
    ]
  }
}

Rules:
- colorKey MUST be "green", "orange", or "red" only
- Include 4-6 dataRows
- Include exactly 3 sections
- Include exactly 4 keyFindings
- slug must start with today's date prefix
- Output ONLY valid JSON, no markdown fences, no explanation"""


# ─── Helpers ──────────────────────────────────────────────────────────────────
COLOR_MAP = {
    "green":  "#22c55e",
    "orange": "#f5a623",
    "red":    "#ff4d6d",
}


def jsx_e(text: str) -> str:
    """Escape text for safe use in JSX text nodes."""
    return (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&apos;")
    )


def fn_name(slug: str) -> str:
    """Convert slug to a valid React component function name."""
    return "".join(w.capitalize() for w in slug.replace("-", " ").split())


# ─── LLM call ─────────────────────────────────────────────────────────────────
def generate_content(topic: dict) -> dict:
    """Call Claude API (fallback: OpenAI) and return parsed JSON."""
    user_msg = (
        f"Generate a blog post about: {topic['prompt']}\n\n"
        f"Today's date (EN): {DATE_EN}\n"
        f"Today's date (ZH): {DATE_ZH}\n"
        f"Slug must start with: {SLUG_DATE}-"
    )

    anthropic_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if anthropic_key:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=anthropic_key)
            resp = client.messages.create(
                model="claude-opus-4-6",
                max_tokens=4096,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user_msg}],
            )
            return json.loads(resp.content[0].text)
        except Exception as exc:
            print(f"[warn] Claude API failed: {exc} — falling back to OpenAI", file=sys.stderr)

    openai_key = os.environ.get("OPENAI_API_KEY", "")
    if openai_key:
        import openai
        client = openai.OpenAI(api_key=openai_key)
        resp = client.chat.completions.create(
            model="gpt-4o",
            max_tokens=4096,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_msg},
            ],
        )
        return json.loads(resp.choices[0].message.content)

    raise RuntimeError("No API key found. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.")


# ─── TSX templates ────────────────────────────────────────────────────────────
_EN_TEMPLATE = r"""import Link from "next/link";

export const metadata = {
  title: ">>>TITLE<<< | Avanti",
  description: ">>>DESC<<<",
};

export default function BlogPost>>>FNNAME<<<() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            >>>TAG<<<
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>>>>DATE<<< · >>>READTIME<<<</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          >>>TITLE<<<
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          >>>INTRO<<<
        </p>
      </div>

      {/* Key Findings */}
      <div
        className="rounded-xl p-6 space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #ff6b35" }}
      >
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          Key Findings
        </div>
        <ul className="space-y-2 text-sm" style={{ color: "#f0f0f8" }}>
>>>FINDINGS<<<
        </ul>
      </div>

>>>SECTIONS<<<

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>>>>DATE<<< · Avanti Platform Data</p>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <th className="text-left p-4 font-medium" style={{ color: "#7070a0" }}>Brand / Category</th>
                <th className="text-center p-4 font-medium" style={{ color: "#7070a0" }}>AI Metric</th>
                <th className="text-center p-4 font-medium" style={{ color: "#7070a0" }}>Signal</th>
                <th className="text-left p-4 font-medium" style={{ color: "#7070a0" }}>Insight</th>
              </tr>
            </thead>
            <tbody>
>>>ROWS<<<
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div
        className="rounded-xl p-8 text-center space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="font-semibold text-lg">Track your brand&apos;s AI visibility</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          Run a free GEO Score audit — see your AI mention rate and share of voice
          across ChatGPT, Claude, Gemini, and Perplexity.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/signup"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            Run Free Audit →
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            More Reports →
          </Link>
        </div>
      </div>
    </div>
  );
}
"""

_ZH_TEMPLATE = r"""import Link from "next/link";

export const metadata = {
  title: ">>>TITLE<<< | Avanti",
  description: ">>>DESC<<<",
};

export default function BlogPost>>>FNNAME<<<Zh() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* 头部 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            >>>TAG<<<
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>>>>DATE<<< · >>>READTIME<<<</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          >>>TITLE<<<
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          >>>INTRO<<<
        </p>
      </div>

      {/* 关键发现 */}
      <div
        className="rounded-xl p-6 space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #ff6b35" }}
      >
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          关键发现
        </div>
        <ul className="space-y-2 text-sm" style={{ color: "#f0f0f8" }}>
>>>FINDINGS<<<
        </ul>
      </div>

>>>SECTIONS<<<

      {/* 数据快照 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI 推荐数据快照</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>>>>DATE<<< · Avanti 平台数据</p>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <th className="text-left p-4 font-medium" style={{ color: "#7070a0" }}>品牌 / 品类</th>
                <th className="text-center p-4 font-medium" style={{ color: "#7070a0" }}>AI 指标</th>
                <th className="text-center p-4 font-medium" style={{ color: "#7070a0" }}>信号</th>
                <th className="text-left p-4 font-medium" style={{ color: "#7070a0" }}>洞察</th>
              </tr>
            </thead>
            <tbody>
>>>ROWS<<<
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div
        className="rounded-xl p-8 text-center space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="font-semibold text-lg">追踪你的品牌 AI 可见度</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          免费 GEO Score 诊断——查看你的品牌在 ChatGPT、Claude、Gemini、Perplexity
          的提及率与市场份额。
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/zh/signup"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            免费诊断 →
          </Link>
          <Link
            href="/zh/blog"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            更多报告 →
          </Link>
        </div>
      </div>
    </div>
  );
}
"""


# ─── Renderers ────────────────────────────────────────────────────────────────
def _render_findings(items: list) -> str:
    lines = []
    for item in items:
        lines.append(
            f'          <li className="flex items-start gap-2">'
            f'<span style={{{{ color: "#ff6b35" }}}}>→</span>'
            f"{jsx_e(item)}"
            f"</li>"
        )
    return "\n".join(lines)


def _render_sections(sections: list) -> str:
    parts = []
    for sec in sections:
        parts.append(
            f'      <div className="space-y-4">\n'
            f'        <h2 className="text-xl font-bold">{jsx_e(sec["title"])}</h2>\n'
            f'        <p className="text-sm leading-relaxed" style={{{{ color: "#7070a0" }}}}>\n'
            f"          {jsx_e(sec['content'])}\n"
            f"        </p>\n"
            f"      </div>"
        )
    return "\n\n".join(parts)


def _render_rows(rows: list) -> str:
    lines = []
    for i, r in enumerate(rows):
        bg = "#0a0a10" if i % 2 == 0 else "#0f0f17"
        color = COLOR_MAP.get(r.get("colorKey", "green"), "#22c55e")
        lines.append(
            f'              <tr style={{{{ background: "{bg}", borderBottom: "1px solid #25253f" }}}}>\n'
            f'                <td className="p-4 font-medium text-sm">{jsx_e(r["label"])}</td>\n'
            f'                <td className="p-4 text-center" style={{{{ color: "#f0f0f8" }}}}>{jsx_e(r["metric"])}</td>\n'
            f'                <td className="p-4 text-center">'
            f'<span className="text-xs font-bold px-2 py-0.5 rounded" style={{{{ background: "{color}18", color: "{color}" }}}}>'
            f'{jsx_e(r["signal"])}'
            f"</span></td>\n"
            f'                <td className="p-4 text-xs" style={{{{ color: "#7070a0" }}}}>{jsx_e(r["insight"])}</td>\n'
            f"              </tr>"
        )
    return "\n".join(lines)


def render_page(template: str, lang_data: dict, slug: str, date: str) -> str:
    return (
        template
        .replace(">>>FNNAME<<<", fn_name(slug))
        .replace(">>>TITLE<<<", jsx_e(lang_data["title"]))
        .replace(">>>DESC<<<", jsx_e(lang_data["description"]))
        .replace(">>>TAG<<<", jsx_e(lang_data["tag"]))
        .replace(">>>DATE<<<", jsx_e(date))
        .replace(">>>READTIME<<<", jsx_e(lang_data["readTime"]))
        .replace(">>>INTRO<<<", jsx_e(lang_data["intro"]))
        .replace(">>>FINDINGS<<<", _render_findings(lang_data["keyFindings"]))
        .replace(">>>SECTIONS<<<", _render_sections(lang_data["sections"]))
        .replace(">>>ROWS<<<", _render_rows(lang_data.get("dataRows", [])))
    )


# ─── Blog index update ────────────────────────────────────────────────────────
def update_index(index_path: Path, slug: str, tag: str, title: str,
                 excerpt: str, date: str, read_time: str) -> None:
    """Prepend a new entry to the POSTS array in blog/page.tsx."""
    content = index_path.read_text(encoding="utf-8")
    new_entry = (
        f"  {{\n"
        f'    slug: "{slug}",\n'
        f'    tag: "{jsx_e(tag)}",\n'
        f'    title: "{jsx_e(title)}",\n'
        f'    excerpt:\n'
        f'      "{jsx_e(excerpt)}",\n'
        f'    date: "{jsx_e(date)}",\n'
        f'    readTime: "{jsx_e(read_time)}",\n'
        f"  }},\n"
    )
    # Insert right after "const POSTS = [\n"
    marker = "const POSTS = [\n"
    if marker not in content:
        print(f"[warn] Could not find POSTS array in {index_path}", file=sys.stderr)
        return
    content = content.replace(marker, marker + new_entry, 1)
    index_path.write_text(content, encoding="utf-8")


# ─── Main ─────────────────────────────────────────────────────────────────────
def main() -> None:
    # Pick topic by day-of-year rotation
    day = TODAY.timetuple().tm_yday
    topic = TOPICS[day % len(TOPICS)]
    print(f"Topic: {topic['type']} ({DATE_EN})")

    # Generate content via AI
    data = generate_content(topic)
    slug = data["slug"]
    en = data["en"]
    zh = data["zh"]
    print(f"Slug: {slug}")

    # Ensure tag matches topic (fallback)
    en.setdefault("tag", topic["tag_en"])
    zh.setdefault("tag", topic["tag_zh"])

    # Render TSX
    en_tsx = render_page(_EN_TEMPLATE, en, slug, DATE_EN)
    zh_tsx = render_page(_ZH_TEMPLATE, zh, slug, DATE_ZH)

    # Write EN post
    en_dir = BLOG_DIR_EN / slug
    en_dir.mkdir(parents=True, exist_ok=True)
    (en_dir / "page.tsx").write_text(en_tsx, encoding="utf-8")
    print(f"Written: {en_dir}/page.tsx")

    # Write ZH post
    zh_dir = BLOG_DIR_ZH / slug
    zh_dir.mkdir(parents=True, exist_ok=True)
    (zh_dir / "page.tsx").write_text(zh_tsx, encoding="utf-8")
    print(f"Written: {zh_dir}/page.tsx")

    # Update EN index
    update_index(
        BLOG_INDEX_EN, slug,
        en["tag"], en["title"], en["description"],
        DATE_EN, en["readTime"],
    )
    print(f"Updated: {BLOG_INDEX_EN}")

    # Update ZH index
    update_index(
        BLOG_INDEX_ZH, slug,
        zh["tag"], zh["title"], zh["description"],
        DATE_ZH, zh["readTime"],
    )
    print(f"Updated: {BLOG_INDEX_ZH}")

    print("Done!")


if __name__ == "__main__":
    main()
