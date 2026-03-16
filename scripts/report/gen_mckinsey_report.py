#!/usr/bin/env python3
"""
Avanti GEO — McKinsey-Style 30+ Page Report Generator

Usage:
  python scripts/report/gen_mckinsey_report.py scripts/report/supuon_pump_data.json
  python scripts/report/gen_mckinsey_report.py scripts/report/supuon_pillow_data.json

Output:
  docs/reports/<slug>-YYYY-MM-DD.html
  docs/reports/<slug>-YYYY-MM-DD.pdf
"""

import sys, json, asyncio, html as html_mod
from pathlib import Path
from datetime import datetime
from textwrap import dedent

SCRIPT_DIR = Path(__file__).parent
OUTPUT_DIR = SCRIPT_DIR.parent.parent / "docs" / "reports"

# ── Styles (shared across all pages) ─────────────────────────────────────────

CSS = """
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:210mm;background:#0d1b2e;color:#fff;
  font-family:'Arial','-apple-system','Noto Sans SC','sans-serif';font-size:10pt;}

.page{width:210mm;min-height:297mm;overflow:hidden;
  page-break-after:always;position:relative;
  background:#0d1b2e;display:flex;flex-direction:column;}
.page:last-child{page-break-after:avoid;}

:root{
  --or:#FF6B35;--or2:#e85e2c;
  --navy:#0d1b2e;--navy2:#152238;--navy3:#1e3050;
  --muted:rgba(255,255,255,.50);--border:rgba(255,255,255,.10);
}

.hdr{height:40px;background:var(--navy2);
  border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 28px;flex-shrink:0;}
.hdr-brand{font-size:8pt;font-weight:700;color:var(--or);letter-spacing:1px;}
.hdr-right{font-size:7.5pt;color:var(--muted);}

.ftr{height:32px;background:var(--navy2);border-top:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 28px;flex-shrink:0;margin-top:auto;}
.ftr-text{font-size:7pt;color:rgba(255,255,255,.35);}

.body{flex:1;padding:20px 28px;}
.tag{display:inline-block;padding:3px 10px;border-radius:20px;
  font-size:7.5pt;font-weight:700;letter-spacing:.5px;text-transform:uppercase;}
.tag-or{background:rgba(255,107,53,.18);color:var(--or);}
.tag-green{background:rgba(34,197,94,.15);color:#22c55e;}
.tag-red{background:rgba(239,68,68,.15);color:#ef4444;}
.tag-blue{background:rgba(96,165,250,.15);color:#60a5fa;}
.tag-muted{background:rgba(255,255,255,.08);color:rgba(255,255,255,.6);}

.sec-title{font-size:12pt;font-weight:700;margin-bottom:3px;}
.sec-sub{font-size:8pt;color:var(--muted);margin-bottom:10px;}
.card{background:var(--navy2);border:1px solid var(--border);border-radius:10px;padding:14px;}
.card-title{font-size:8.5pt;font-weight:700;margin-bottom:6px;color:var(--or);}
.narrative{font-size:9pt;line-height:1.5;color:rgba(255,255,255,.85);}
.narrative p{margin-bottom:10px;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
.four-col{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}

.stat-card{background:var(--navy2);border:1px solid var(--border);border-radius:10px;
  padding:12px;}
.stat-label{font-size:6.5pt;color:var(--muted);margin-bottom:4px;text-transform:uppercase;
  letter-spacing:.4px;}
.stat-value{font-size:22pt;font-weight:700;line-height:1;}
.stat-value.or{color:var(--or);}
.stat-value.green{color:#22c55e;}
.stat-value.blue{color:#60a5fa;}
.stat-value.white{color:#fff;}
.stat-value.red{color:#ef4444;}

.prog-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
.prog-label{width:110px;font-size:7.5pt;flex-shrink:0;}
.prog-track{flex:1;height:7px;background:rgba(255,255,255,.08);border-radius:4px;overflow:hidden;}
.prog-fill{height:100%;border-radius:4px;}
.prog-val{width:36px;text-align:right;font-size:7.5pt;font-weight:700;flex-shrink:0;}

.tbl{width:100%;border-collapse:collapse;font-size:8pt;}
.tbl th{background:rgba(255,255,255,.06);padding:6px 10px;text-align:left;
  font-size:7pt;letter-spacing:.3px;text-transform:uppercase;color:var(--muted);}
.tbl td{padding:6px 10px;border-bottom:1px solid var(--border);}
.tbl tr:last-child td{border-bottom:none;}

.badge-strong{color:#22c55e;font-weight:700;}
.badge-mid{color:#fbbf24;font-weight:700;}
.badge-weak{color:#ef4444;font-weight:700;}

.conf-badge{font-size:6.5pt;letter-spacing:1.5px;text-transform:uppercase;
  color:rgba(255,107,53,.6);border:1px solid rgba(255,107,53,.25);
  padding:2px 7px;border-radius:4px;}

.divider{height:1px;background:var(--border);margin:10px 0;}

.action-item{display:flex;gap:10px;margin-bottom:8px;
  background:var(--navy2);border:1px solid var(--border);
  border-radius:10px;padding:10px 12px;}
.action-num{font-size:16pt;font-weight:700;color:var(--or);width:24px;
  flex-shrink:0;line-height:1;}
.action-title{font-size:8.5pt;font-weight:700;margin-bottom:2px;}
.action-desc{font-size:8pt;color:var(--muted);line-height:1.5;}

.quote-box{background:rgba(255,107,53,.06);border-left:3px solid var(--or);
  padding:10px 14px;border-radius:0 8px 8px 0;margin:8px 0;}
.quote-text{font-size:8pt;font-style:italic;color:rgba(255,255,255,.75);line-height:1.5;}

.insight-box{background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.2);
  border-radius:8px;padding:10px 12px;margin-bottom:6px;}
.warn-box{background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.2);
  border-radius:8px;padding:10px 12px;margin-bottom:6px;}

.response-sample{background:var(--navy2);border:1px solid var(--border);
  border-radius:8px;padding:10px 12px;margin-bottom:8px;font-size:7pt;
  color:rgba(255,255,255,.7);line-height:1.45;white-space:pre-wrap;
  overflow:hidden;max-height:120px;}

.toc-row{display:flex;align-items:center;justify-content:space-between;
  padding:6px 12px;border-bottom:1px solid rgba(255,255,255,.06);}
.toc-row:last-child{border-bottom:none;}
.toc-section{font-size:6.5pt;font-weight:700;color:var(--muted);
  text-transform:uppercase;letter-spacing:.5px;padding:8px 12px 4px;}
.toc-num{width:26px;font-size:8pt;font-weight:700;color:var(--or);flex-shrink:0;}
.toc-title{flex:1;font-size:8pt;}
.toc-dots{flex:1;border-bottom:1px dotted rgba(255,255,255,.15);margin:0 8px;height:10px;}
.toc-page{font-size:7.5pt;color:var(--muted);flex-shrink:0;}

@media print{*{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
"""


# ── Helper: escape HTML ──────────────────────────────────────────────────────

def esc(text):
    if text is None:
        return ""
    return html_mod.escape(str(text))


def trunc(text, max_len=8000):
    """Truncate text. Default limit is very high — only use small limits for table cells/titles."""
    if not text:
        return ""
    s = str(text)
    # Clean AI artifacts: stray *, \", etc.
    s = s.replace('*"', '"').replace('"*', '"').replace('*\\', '').replace('\\*', '')
    s = s.replace('\\"', '"').replace('\\n', '\n')
    # Remove leading/trailing asterisks
    s = s.strip('*').strip()
    return s[:max_len] + "..." if len(s) > max_len else s


def score_color(score):
    if score >= 60:
        return "#22c55e"
    if score >= 30:
        return "#fbbf24"
    return "#ef4444"


def level_badge(pct):
    if pct >= 20:
        return "badge-strong"
    if pct >= 10:
        return "badge-mid"
    return "badge-weak"


def bar_color(name):
    colors = {"ChatGPT": "#22c55e", "Perplexity": "#60a5fa",
              "Claude": "#a78bfa", "Gemini": "#fbbf24"}
    return colors.get(name, "#60a5fa")


def _sentiment_color(sentiment):
    return {"positive": "#22c55e", "mixed": "#fbbf24", "negative": "#ef4444"}.get(sentiment, "#fbbf24")


# ── Page wrapper ─────────────────────────────────────────────────────────────

def page(brand, date, page_num, body_html, bg_extra=""):
    return f"""
<div class="page" style="{bg_extra}">
  <div class="hdr">
    <span class="hdr-brand">{esc(brand)} · AI 可见度深度分析报告</span>
    <span class="hdr-right">{esc(date)}</span>
  </div>
  <div class="body">
    {body_html}
  </div>
  <div class="ftr">
    <span class="ftr-text">Avanti Intelligence · avantia2a.com · 仅限内部使用</span>
    <span class="ftr-text">{page_num}</span>
  </div>
</div>"""


def _split_text(text, limit):
    """Split long text into chunks at sentence boundaries (。；！？\\n).
    Returns list of strings, each ≤ limit chars."""
    if not text or len(text) <= limit:
        return [text or ""]
    import re
    # Split at Chinese sentence endings or newlines
    sentences = re.split(r'(?<=[。；！？\n])', text)
    chunks, current = [], ""
    for s in sentences:
        if len(current) + len(s) > limit and current:
            chunks.append(current.strip())
            current = s
        else:
            current += s
    if current.strip():
        chunks.append(current.strip())
    return chunks if chunks else [text]


def _narrative_overflow_pages(brand, date, tag_text, title, subtitle, narrative_text,
                              first_page_limit=1200, cont_page_limit=2400,
                              card_title=None, header_html="", footer_html=""):
    """Render narrative text, auto-splitting into multiple pages if content is too long.
    Returns list of page HTML strings."""
    text = trunc(narrative_text) if narrative_text else ""
    if not text:
        body = f"""
        <div class="tag tag-or" style="margin-bottom:8px;">{esc(tag_text)}</div>
        <div class="sec-title">{esc(title)}</div>
        <div class="sec-sub">{esc(subtitle)}</div>
        {header_html}
        <div class="card">
          {f'<div class="card-title">{esc(card_title)}</div>' if card_title else ''}
          <div class="narrative"><p>暂无数据</p></div>
        </div>
        {footer_html}"""
        return [page(brand, date, 0, body)]

    chunks = _split_text(text, first_page_limit)
    pages_out = []

    # First page: has header_html (stats/tables) + first chunk of narrative
    first_chunk = chunks[0]
    remaining = chunks[1:]
    narrative_html = _format_numbered_text(first_chunk)
    body = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">{esc(tag_text)}</div>
    <div class="sec-title">{esc(title)}</div>
    <div class="sec-sub">{esc(subtitle)}</div>
    {header_html}
    <div class="card">
      {f'<div class="card-title">{esc(card_title)}</div>' if card_title else ''}
      <div class="narrative">{narrative_html}</div>
    </div>
    {footer_html}"""
    pages_out.append(page(brand, date, 0, body))

    # Continuation pages for remaining text
    if remaining:
        # Check if remaining text is too short to warrant a separate page
        rest_text = "".join(remaining)
        if len(rest_text) < 300:
            # Remaining text too short - append to first page instead
            # Rebuild first page with full text
            full_text = text  # Use original untruncated text
            narrative_html = _format_numbered_text(full_text)
            body = f"""
            <div class="tag tag-or" style="margin-bottom:8px;">{esc(tag_text)}</div>
            <div class="sec-title">{esc(title)}</div>
            <div class="sec-sub">{esc(subtitle)}</div>
            {header_html}
            <div class="card">
              {f'<div class="card-title">{esc(card_title)}</div>' if card_title else ''}
              <div class="narrative">{narrative_html}</div>
            </div>
            {footer_html}"""
            pages_out = [page(brand, date, 0, body)]
            return pages_out
        
        # Normal continuation pages
        cont_chunks = _split_text(rest_text, cont_page_limit)
        for chunk in cont_chunks:
            cont_html = _format_numbered_text(chunk)
            cont_body = f"""
            <div class="tag tag-muted" style="margin-bottom:8px;">续</div>
            <div class="sec-title">{esc(title)}（续）</div>
            <div class="card">
              <div class="narrative">{cont_html}</div>
            </div>"""
            pages_out.append(page(brand, date, 0, cont_body))

    return pages_out


# ══════════════════════════════════════════════════════════════════════════════
#   PAGE GENERATORS
# ══════════════════════════════════════════════════════════════════════════════

def page_cover(d):
    return f"""
<div class="page" style="background:linear-gradient(160deg,#0d1b2e 60%,#1a2e50);">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:22px 30px 0;">
    <div style="display:flex;align-items:center;gap:10px;">
      <svg width="34" height="34" viewBox="0 0 34 34">
        <rect width="34" height="34" rx="8" fill="#FF6B35"/>
        <polygon points="17,7 28,27 6,27" fill="white"/>
        <rect x="11.5" y="21" width="11" height="2.5" rx="1" fill="#FF6B35"/>
      </svg>
      <span style="font-size:11pt;font-weight:700;letter-spacing:2px;color:#fff;opacity:.9;">AVANTI</span>
    </div>
    <div class="conf-badge">CONFIDENTIAL</div>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 30px;">
    <div class="tag tag-or" style="margin-bottom:14px;font-size:8pt;">
      AI 可见度深度分析报告
    </div>
    <div style="font-size:11pt;color:rgba(255,255,255,.5);margin-bottom:4px;
      text-transform:uppercase;letter-spacing:1px;">{esc(d.get('product_en',''))}</div>
    <div style="font-size:36pt;font-weight:700;line-height:1.05;margin-bottom:8px;
      letter-spacing:-0.5px;">{esc(d['brand'])}</div>
    <div style="font-size:13pt;color:rgba(255,255,255,.6);margin-bottom:4px;">
      AI 可见度深度诊断 · 竞品分析 · 优化方案
    </div>
    <div style="font-size:9.5pt;color:rgba(255,255,255,.35);">{esc(d.get('report_date',''))}</div>
    <div style="height:2px;width:56px;background:var(--or);margin:20px 0;border-radius:2px;"></div>
    <div style="display:flex;gap:28px;">
      <div>
        <div style="font-size:7pt;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">AI VISIBILITY SCORE</div>
        <div style="font-size:28pt;font-weight:700;color:var(--or);">{d.get('geo_score',0)}</div>
        <div style="font-size:7pt;color:rgba(255,255,255,.35);">/ 100</div>
      </div>
      <div>
        <div style="font-size:7pt;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">品类排名</div>
        <div style="font-size:28pt;font-weight:700;color:#fff;">#{d.get('category_rank','-')}</div>
        <div style="font-size:7pt;color:rgba(255,255,255,.35);">共 {d.get('category_total_brands',0)} 品牌</div>
      </div>
      <div>
        <div style="font-size:7pt;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">AI 引擎</div>
        <div style="font-size:28pt;font-weight:700;color:#fff;">{len(d.get('engines',[]))}</div>
        <div style="font-size:7pt;color:rgba(255,255,255,.35);">引擎数</div>
      </div>
      <div>
        <div style="font-size:7pt;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">查询总数</div>
        <div style="font-size:28pt;font-weight:700;color:#fff;">150</div>
        <div style="font-size:7pt;color:rgba(255,255,255,.35);">三语覆盖</div>
      </div>
    </div>
  </div>
  <div style="padding:14px 30px;border-top:1px solid rgba(255,255,255,.08);
    display:flex;align-items:center;justify-content:space-between;">
    <div style="font-size:7pt;color:rgba(255,255,255,.3);">Avanti Intelligence · avantia2a.com</div>
    <div style="font-size:7pt;color:rgba(255,255,255,.3);">仅限内部使用及授权客户</div>
  </div>
</div>"""


def page_toc(d):
    brand = d['brand']
    date = d.get('report_date', '')
    engine_names = [e['name'] for e in d.get('engines', [])]
    engine_count = len(engine_names)
    engine_label = ' / '.join(engine_names)

    # Build engine analysis TOC entries dynamically
    engine_toc = []
    if len(engine_names) >= 2:
        engine_toc.append((5, f"AI 引擎深度分析 · {engine_names[0]} / {engine_names[1]}"))
        if len(engine_names) >= 3:
            remaining = ' / '.join(engine_names[2:])
            engine_toc.append((6, f"AI 引擎深度分析 · {remaining}"))
    elif len(engine_names) == 1:
        engine_toc.append((5, f"AI 引擎深度分析 · {engine_names[0]}"))

    toc_items = [
        ("核心诊断", [
            (3, "执行摘要 · 核心发现与建议"),
            (4, "AI 可见度评分构成 · 评分因子分析"),
            *engine_toc,
            (5 + len(engine_toc), "多语言覆盖分析 · 泰语 / 英语 / 中文"),
            (6 + len(engine_toc), "搜索意图分析 · 购买 / 对比 / 品牌"),
        ]),
        ("跨平台验证", [
            (7 + len(engine_toc), "跨平台信号总览 · Market-AI Alignment"),
            (8 + len(engine_toc), "Reddit 社区洞察 · 用户真实讨论"),
            (9 + len(engine_toc), "YouTube KOL 分析 · 创作者生态"),
            (10 + len(engine_toc), "TikTok Shop & Google Trends"),
        ]),
        ("竞争情报", [
            (11 + len(engine_toc), "竞争格局 · AI Visibility Score & SOV 对比"),
            (12 + len(engine_toc), "头部竞品深度分析 · 优势解析"),
            (13 + len(engine_toc), "如何超越竞品 · 差距与策略"),
            (14 + len(engine_toc), "全球标杆品牌分析"),
            (15 + len(engine_toc), "标杆学习 · 可借鉴的策略"),
        ]),
        ("市场背景", [
            (16 + len(engine_toc), "市场规模与增长驱动力"),
            (17 + len(engine_toc), "电商生态与 AI 推荐趋势"),
        ]),
        ("信任与风险", [
            (18 + len(engine_toc), "AI 幻觉检测 · 信息准确性分析"),
            (19 + len(engine_toc), "AI 幻觉详情 · 逐条验证"),
        ]),
        ("优化方案", [
            (20 + len(engine_toc), "立即执行 · Week 1-2 行动计划"),
            (21 + len(engine_toc), "短期策略 · Month 1-2 优化方案"),
            (22 + len(engine_toc), "中期战略 · Month 3-6 系统升级"),
            (23 + len(engine_toc), "ROI 预测 · 12 周增长路径"),
        ]),
    ]

    rows = ""
    for section, items in toc_items:
        rows += f'<div class="toc-section">{section}</div>'
        for num, title in items:
            rows += f"""<div class="toc-row">
              <div class="toc-num">{num}</div>
              <div class="toc-title">{title}</div>
              <div class="toc-dots"></div>
              <div class="toc-page">P.{num}</div>
            </div>"""

    body = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">目录</div>
    <div class="sec-title">报告内容导览</div>
    <div class="sec-sub">150 条查询 · {engine_count} 大 AI 引擎（{engine_label}）· 泰语/英语/中文三语 · 跨平台验证</div>
    <div style="background:var(--navy2);border:1px solid var(--border);border-radius:12px;overflow:hidden;">
      {rows}
    </div>"""
    return page(brand, date, 2, body)


def page_executive_summary(d):
    en = d.get("extended_narrative", {})
    summary = en.get("executive_summary", d.get("summary_headline", ""))
    insights = en.get("key_insights", d.get("key_insights", []))

    engines_html = ""
    for e in d.get("engines", []):
        c = bar_color(e["name"])
        engines_html += f"""<div class="stat-card">
          <div class="stat-label">{esc(e['name'])}</div>
          <div class="stat-value" style="color:{c};">{e['score']}</div>
          <div style="font-size:7pt;color:var(--muted);margin-top:3px;">排名 #{e.get('rank','-')}</div>
        </div>"""

    insights_html = ""
    for i, ins in enumerate(insights[:6]):
        insights_html += f"""<div class="insight-box">
          <div style="font-size:7.5pt;color:#22c55e;font-weight:700;">发现 {i+1}</div>
          <div style="font-size:8pt;color:rgba(255,255,255,.8);margin-top:2px;">{esc(ins)}</div>
        </div>"""

    body = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">第一部分 · 核心诊断</div>
    <div class="sec-title">执行摘要</div>
    <div class="sec-sub">Executive Summary · 本次分析核心发现</div>
    <div class="four-col" style="margin-bottom:14px;">
      <div class="stat-card">
        <div class="stat-label">综合 AI Visibility Score</div>
        <div class="stat-value or">{d.get('geo_score',0)}</div>
        <div style="font-size:7pt;color:var(--muted);margin-top:3px;">{esc(d.get('geo_score_level',''))}</div>
      </div>
      {engines_html}
    </div>
    <div class="card" style="margin-bottom:12px;">
      <div class="card-title">核心发现 Executive Summary</div>
      <div class="narrative"><p>{esc(summary)}</p></div>
    </div>
    <div class="two-col">
      <div>{insights_html[:len(insights_html)//2+200]}</div>
      <div>{insights_html[len(insights_html)//2+200:]}</div>
    </div>"""
    # Simpler approach: just output all insights
    body = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">第一部分 · 核心诊断</div>
    <div class="sec-title">执行摘要</div>
    <div class="sec-sub">Executive Summary · 本次分析核心发现</div>
    <div class="four-col" style="margin-bottom:14px;">
      <div class="stat-card">
        <div class="stat-label">综合 AI Visibility Score</div>
        <div class="stat-value or">{d.get('geo_score',0)}</div>
        <div style="font-size:7pt;color:var(--muted);margin-top:3px;">{esc(d.get('geo_score_level',''))}</div>
      </div>
      {engines_html}
    </div>
    <div class="card" style="margin-bottom:12px;">
      <div class="card-title">核心发现 Executive Summary</div>
      <div class="narrative"><p>{esc(summary)}</p></div>
    </div>
    {insights_html}"""
    return page(d['brand'], d.get('report_date',''), 3, body)


def page_geo_score(d):
    factors_html = ""
    for f in d.get("score_factors", []):
        w = f["weight"]
        s = f["score"]
        c = f.get("color", "#ef4444")
        factors_html += f"""<div class="prog-row">
          <div class="prog-label">{esc(f['name'])}</div>
          <div class="prog-track"><div class="prog-fill" style="width:{s}%;background:{c};"></div></div>
          <div class="prog-val" style="color:{c};">{s}%</div>
        </div>"""

    intent_rows = ""
    for ic in d.get("intent_comparison", []):
        cls = level_badge(ic["self_pct"])
        comp_cells = ""
        for cv in ic.get("comp_vals", []):
            ccls = level_badge(cv["pct"])
            comp_cells += f'<td><span class="{ccls}">{cv["pct"]}%</span></td>'
        intent_rows += f"""<tr>
          <td style="font-weight:700;">{esc(ic['intent'])}</td>
          <td><span class="{cls}">{ic['self_pct']}%</span></td>
          {comp_cells}
        </tr>"""

    comp_headers = ""
    for cv in (d.get("intent_comparison", [{}])[0] or {}).get("comp_vals", []):
        comp_headers += f'<th>{esc(cv["name"])}</th>'

    body = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">AI 可见度评分构成</div>
    <div class="sec-title">评分因子分析</div>
    <div class="sec-sub">AI Visibility Score = 推荐出现率(40%) + 位置权重(25%) + 引用质量(20%) + 意图覆盖(15%)</div>
    <div class="card" style="margin-bottom:14px;">
      <div class="card-title">评分因子明细</div>
      {factors_html}
    </div>
    <div class="card">
      <div class="card-title">意图覆盖率对比 — {esc(d['brand'])} vs 竞品</div>
      <table class="tbl">
        <tr><th>意图类型</th><th>{esc(d['brand'])}</th>{comp_headers}</tr>
        {intent_rows}
      </table>
    </div>"""
    return page(d['brand'], d.get('report_date',''), 4, body)


def _engine_card(name, details, en_analysis):
    """Render a single engine analysis card."""
    e = details.get(name, {})
    analysis = en_analysis.get(name, "暂无详细分析数据。")
    c = bar_color(name)
    return f"""<div class="card">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <div style="width:8px;height:8px;border-radius:50%;background:{c};"></div>
        <div class="card-title" style="margin-bottom:0;">{name}</div>
        <div style="font-size:20pt;font-weight:700;color:{c};margin-left:auto;">{e.get('score',0)}</div>
      </div>
      <div class="prog-row">
        <div class="prog-label">购买意图</div>
        <div class="prog-track"><div class="prog-fill" style="width:{e.get('hi_rate',0)}%;background:{c};"></div></div>
        <div class="prog-val">{e.get('hi_rate',0)}%</div>
      </div>
      <div class="prog-row">
        <div class="prog-label">产品对比</div>
        <div class="prog-track"><div class="prog-fill" style="width:{e.get('comp_rate',0)}%;background:{c};"></div></div>
        <div class="prog-val">{e.get('comp_rate',0)}%</div>
      </div>
      <div class="prog-row">
        <div class="prog-label">泰语覆盖</div>
        <div class="prog-track"><div class="prog-fill" style="width:{e.get('th_rate',0)}%;background:#60a5fa;"></div></div>
        <div class="prog-val">{e.get('th_rate',0)}%</div>
      </div>
      <div class="prog-row">
        <div class="prog-label">英语覆盖</div>
        <div class="prog-track"><div class="prog-fill" style="width:{e.get('en_rate',0)}%;background:#34d399;"></div></div>
        <div class="prog-val">{e.get('en_rate',0)}%</div>
      </div>
      <div class="prog-row">
        <div class="prog-label">中文覆盖</div>
        <div class="prog-track"><div class="prog-fill" style="width:{e.get('zh_rate',0)}%;background:#fbbf24;"></div></div>
        <div class="prog-val">{e.get('zh_rate',0)}%</div>
      </div>
      <div class="divider"></div>
      <div class="narrative"><p>{esc(trunc(analysis))}</p></div>
    </div>"""


def page_engine_pages(d):
    """Generate engine analysis pages dynamically — only for engines that were actually run.
    Returns a list of page HTML strings (1 or 2 pages depending on engine count)."""
    engine_names = [e['name'] for e in d.get('engines', [])]
    details = {e['name']: e for e in d.get('engine_details', [])}
    en = d.get("extended_narrative", {}).get("engine_analysis", {})
    brand = d['brand']
    date = d.get('report_date', '')
    pages = []

    if len(engine_names) == 0:
        return pages

    # Page 1: first 2 engines
    batch1 = engine_names[:2]
    title1 = ' & '.join(batch1)
    cards1 = ""
    if len(batch1) == 2:
        cards1 = f'<div class="two-col">{_engine_card(batch1[0], details, en)}{_engine_card(batch1[1], details, en)}</div>'
    else:
        cards1 = _engine_card(batch1[0], details, en)

    body1 = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">AI 引擎深度分析</div>
    <div class="sec-title">{title1}</div>
    <div class="sec-sub">各引擎的意图覆盖率、语言表现及分析解读</div>
    {cards1}"""
    pages.append(page(brand, date, 5, body1))

    # Page 2: remaining engines (if any)
    if len(engine_names) > 2:
        batch2 = engine_names[2:]
        title2 = ' & '.join(batch2)
        if len(batch2) == 2:
            cards2 = f'<div class="two-col">{_engine_card(batch2[0], details, en)}{_engine_card(batch2[1], details, en)}</div>'
        else:
            cards2 = _engine_card(batch2[0], details, en)
        body2 = f"""
        <div class="tag tag-or" style="margin-bottom:8px;">AI 引擎深度分析</div>
        <div class="sec-title">{title2}</div>
        <div class="sec-sub">各引擎的意图覆盖率、语言表现及分析解读</div>
        {cards2}"""
        pages.append(page(brand, date, 6, body2))

    return pages


def page_language(d):
    en = d.get("extended_narrative", {})
    lang_narrative = en.get("language_analysis", "")

    lang_bars = ""
    for lb in d.get("lang_breakdown", []):
        flag = lb.get("flag", "")
        lang_bars += f"""<div class="stat-card">
          <div class="stat-label">{flag} {esc(lb['label'])}</div>
          <div class="stat-value or">{lb['rate']}%</div>
          <div style="font-size:7pt;color:var(--muted);margin-top:3px;">{lb['hits']}/{lb['total']} 命中</div>
        </div>"""

    matrix_rows = ""
    for e in d.get("engine_details", []):
        c = bar_color(e["name"])
        matrix_rows += f"""<tr>
          <td style="font-weight:700;color:{c};">{e['name']}</td>
          <td>{e.get('th_rate',0)}%</td>
          <td>{e.get('en_rate',0)}%</td>
          <td>{e.get('zh_rate',0)}%</td>
          <td style="font-weight:700;">{e.get('score',0)}</td>
        </tr>"""

    header_html = f"""
    <div class="three-col" style="margin-bottom:14px;">
      {lang_bars}
    </div>
    <div class="card" style="margin-bottom:12px;">
      <div class="card-title">引擎 × 语言 覆盖矩阵</div>
      <table class="tbl">
        <tr><th>引擎</th><th>🇹🇭 泰语</th><th>🇺🇸 英语</th><th>🇨🇳 中文</th><th>AIV</th></tr>
        {matrix_rows}
      </table>
    </div>"""

    return _narrative_overflow_pages(
        d['brand'], d.get('report_date',''),
        "语言覆盖", "多语言覆盖分析",
        "泰语(50%) / 英语(35%) / 中文(15%) — 三语查询的引用率表现",
        lang_narrative, first_page_limit=1400, cont_page_limit=2200,
        card_title="语言分析解读", header_html=header_html)


def page_intent(d):
    en = d.get("extended_narrative", {})
    intent_narrative = en.get("intent_analysis", "")

    intent_bars = ""
    for it in d.get("intents", []):
        color = {"or": "#FF6B35", "bl": "#60a5fa", "gr": "#22c55e"}.get(it.get("bar_class","bl"), "#60a5fa")
        intent_bars += f"""<div class="stat-card">
          <div class="stat-label">{esc(it['name'])}</div>
          <div class="stat-value" style="color:{color};">{it['rate']}%</div>
        </div>"""

    header_html = f"""
    <div class="three-col" style="margin-bottom:14px;">
      {intent_bars}
    </div>"""

    footer_html = f"""
    <div class="quote-box">
      <div class="quote-text">购买意图引用率是最直接影响转化的指标。当用户问"推荐哪个品牌的{esc(d.get('product_en',''))}?"时，AI 是否推荐了 {esc(d['brand'])}？当前仅 {d.get('intents',[{}])[0].get('rate',0)}% 的购买意图查询提到了品牌，远低于行业优秀水平(30%+)。</div>
    </div>"""

    return _narrative_overflow_pages(
        d['brand'], d.get('report_date',''),
        "意图分析", "搜索意图分析",
        "购买推荐 / 产品对比 / 品牌查询 — 不同意图下的品牌引用率",
        intent_narrative, first_page_limit=1400, cont_page_limit=2200,
        card_title="意图分析深度解读", header_html=header_html, footer_html=footer_html)


def page_cross_platform_overview(d):
    cp = d.get("cross_platform", {})
    reddit_count = len(cp.get("reddit", {}).get("posts", []))
    kol_count = len(cp.get("youtube", {}).get("kols", []))
    tiktok = cp.get("tiktok", {})
    google = cp.get("google_trends", {})

    en = d.get("extended_narrative", {})
    cross_narrative = en.get("cross_platform_narrative", "")

    header_html = f"""
    <div class="four-col" style="margin-bottom:14px;">
      <div class="stat-card">
        <div class="stat-label">Reddit 讨论</div>
        <div class="stat-value blue">{reddit_count}</div>
        <div style="font-size:7pt;color:var(--muted);margin-top:3px;">相关帖子</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">YouTube KOL</div>
        <div class="stat-value green">{kol_count}</div>
        <div style="font-size:7pt;color:var(--muted);margin-top:3px;">创作者</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">TikTok Shop</div>
        <div class="stat-value white">{'有' if tiktok else '无'}</div>
        <div style="font-size:7pt;color:var(--muted);margin-top:3px;">商品数据</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Google Trends</div>
        <div class="stat-value white">{'有' if google else '无'}</div>
        <div style="font-size:7pt;color:var(--muted);margin-top:3px;">搜索趋势</div>
      </div>
    </div>"""

    return _narrative_overflow_pages(
        d['brand'], d.get('report_date',''),
        "第二部分 · 跨平台验证", "跨平台信号总览",
        "Market-AI Alignment — AI 推荐与真实市场信号的一致性",
        cross_narrative, first_page_limit=1400, cont_page_limit=2200,
        card_title="跨平台分析叙述", header_html=header_html)


def page_reddit(d):
    posts = d.get("cross_platform", {}).get("reddit", {}).get("posts", [])
    # Translate sentiment labels to Chinese
    _sentiment_zh = {"positive": "正面", "mixed": "中性", "negative": "负面"}

    posts_html = ""
    for p in posts[:5]:
        raw_sentiment = p.get("sentiment", "mixed")
        sentiment_color = {"positive": "#22c55e", "mixed": "#fbbf24", "negative": "#ef4444"}.get(raw_sentiment, "#fbbf24")
        sentiment_label = _sentiment_zh.get(raw_sentiment, raw_sentiment)
        posts_html += f"""<div class="card" style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <div style="font-size:8pt;font-weight:700;color:#60a5fa;">r/{esc(p.get('subreddit',''))}</div>
            <div style="display:flex;gap:8px;">
              <span style="font-size:7pt;color:var(--or);">⬆ {p.get('score',0)}</span>
              <span style="font-size:7pt;color:var(--muted);">💬 {p.get('num_comments',0)}</span>
              <span style="font-size:7pt;color:{sentiment_color};">{sentiment_label}</span>
            </div>
          </div>
          <div style="font-size:8pt;font-weight:700;margin-bottom:4px;">{esc(trunc(p.get('title',''), 100))}</div>
          <div style="font-size:7.5pt;color:var(--muted);line-height:1.5;">{esc(trunc(p.get('selftext_snippet',''), 200))}</div>
        </div>"""

    if not posts_html:
        posts_html = '<div class="card"><div class="narrative"><p>未找到与品牌直接相关的 Reddit 讨论。</p></div></div>'

    brand = esc(d['brand'])
    body = f"""
    <div class="tag tag-blue" style="margin-bottom:8px;">Reddit 社区</div>
    <div class="sec-title">Reddit 社区洞察</div>
    <div class="sec-sub">品类相关用户讨论 · 情感分析 · AI 可见度优化参考</div>
    {posts_html}
    <div class="card" style="margin-top:8px;">
      <div class="card-title">分析与建议</div>
      <div class="narrative">
        <p>以上内容为品类相关的 Reddit 讨论（非 {brand} 品牌直接讨论），反映了北美市场消费者对吸奶器品类的真实需求和偏好。这些用户反馈可作为 {brand} 产品优化和内容策略的参考素材。</p>
        <p>Reddit 是 ChatGPT、Perplexity 等 AI 引擎最重要的训练数据来源之一。品牌在 Reddit 上的讨论热度和情感倾向直接影响 AI 推荐结果。由于 {brand} 主要面向东南亚市场，Reddit 上自然缺乏品牌讨论，这属于正常情况。建议将 Reddit 上的品类洞察（如用户关注的功能点、痛点）融入 TikTok Shop 和 Shopee 等东南亚平台的产品描述优化中。</p>
      </div>
    </div>"""
    return page(d['brand'], d.get('report_date',''), 10, body)


def page_youtube(d):
    kols = d.get("cross_platform", {}).get("youtube", {}).get("kols", [])
    _sentiment_zh = {"positive": "正面", "mixed": "中性", "negative": "负面"}
    _tier_zh = {"mega": "超头部", "macro": "头部", "micro": "中腰部", "nano": "尾部"}

    kol_html = ""
    for k in kols[:4]:
        tier_colors = {"mega": "#FF6B35", "macro": "#22c55e", "micro": "#60a5fa", "nano": "#a78bfa"}
        tc = tier_colors.get(k.get("tier", "micro"), "#60a5fa")
        tier_label = _tier_zh.get(k.get("tier", "micro"), k.get("tier", ""))
        views = k.get("views", 0)
        views_str = f"{views/1_000_000:.1f}M" if views >= 1_000_000 else f"{views/1_000:.0f}K"
        subs = k.get("subscribers", 0)
        subs_str = f"{subs/1_000_000:.1f}M" if subs >= 1_000_000 else f"{subs/1_000:.0f}K"
        raw_sentiment = k.get("sentiment", "mixed")
        sentiment_label = _sentiment_zh.get(raw_sentiment, raw_sentiment)
        kol_html += f"""<div class="card" style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <div style="font-size:8pt;font-weight:700;">{esc(k.get('channel_name',''))}</div>
            <div class="tag" style="background:rgba(255,255,255,.08);color:{tc};font-size:6pt;">{tier_label}</div>
          </div>
          <div style="font-size:7.5pt;color:rgba(255,255,255,.7);margin-bottom:4px;">{esc(trunc(k.get('video_title',''), 80))}</div>
          <div style="display:flex;gap:16px;font-size:7pt;color:var(--muted);">
            <span>👁 {views_str} 观看</span>
            <span>👥 {subs_str} 订阅</span>
            <span style="color:{_sentiment_color(raw_sentiment)};">{sentiment_label}</span>
          </div>
        </div>"""

    if not kol_html:
        kol_html = '<div class="card"><div class="narrative"><p>未找到品类相关的 YouTube 创作者。</p></div></div>'

    brand = esc(d['brand'])
    body = f"""
    <div class="tag tag-red" style="margin-bottom:8px;">YouTube 创作者</div>
    <div class="sec-title">YouTube 创作者生态分析</div>
    <div class="sec-sub">品类相关创作者 · 影响力层级 · 内容覆盖</div>
    {kol_html}
    <div class="card" style="margin-top:8px;">
      <div class="card-title">分析与建议</div>
      <div class="narrative">
        <p>YouTube 内容对 AI 引擎（特别是 Google Gemini）有直接影响。以上为品类相关的全球 YouTube 创作者，{brand} 目前在 YouTube 上的品牌存在度较低。</p>
        <p>对于东南亚市场，建议优先与泰语母婴类创作者（10万-100万粉丝的头部层级）合作，产出高质量的产品评测和使用教程视频。YouTube 视频内容会被 AI 引擎索引和引用，是提升 AI 推荐中品牌提及率的有效途径。同时，可将 YouTube 视频内容剪辑为 TikTok 短视频，实现一鱼多吃的内容复用效果。</p>
      </div>
    </div>"""
    return page(d['brand'], d.get('report_date',''), 11, body)


def page_tiktok_google(d):
    cp = d.get("cross_platform", {})
    tiktok = cp.get("tiktok", {})
    google = cp.get("google_trends", {})
    mc = d.get("market_context", {})
    brand = esc(d['brand'])

    # TikTok section — use real client data
    tiktok_html = ""
    if tiktok.get("brand_present"):
        shop_handle = esc(tiktok.get("shop_handle", ""))
        product_url = esc(tiktok.get("product_url", ""))
        kol_count = len(tiktok.get("kol_collaborations", []))
        kol_list = ""
        for kol in tiktok.get("kol_collaborations", []):
            kol_list += f"<p>• 达人 {esc(kol.get('handle', ''))} — 已合作内容</p>"
        tiktok_html = f"""
          <p><b>店铺状态:</b> {brand} 已在 TikTok Shop 泰国区开店（{shop_handle}）</p>
          <p><b>在售商品:</b> 产品已上架 TikTok Shop 泰国站</p>
          <p><b>达人合作:</b> 已与 {kol_count} 位泰国本土达人合作推广内容</p>
          {kol_list}
          <p style="margin-top:8px;">{esc(trunc(mc.get('tiktok_shop_context', '')))}</p>"""
    else:
        tiktok_html = f"""
          <p>{brand} 尚未在 TikTok Shop 开店。TikTok Shop 是泰国母婴品类增长最快的电商渠道，建议尽快入驻。</p>
          <p style="margin-top:8px;">{esc(trunc(mc.get('tiktok_shop_context', '')))}</p>"""

    # Google Trends section — use real pytrends data
    trends_html = ""
    if google.get("keywords"):
        geo = google.get("geo", "TH")
        _direction_color = {"上升": "#22c55e", "稳定": "#fbbf24", "下降": "#ef4444"}
        trends_html += f'<p><b>数据来源:</b> Google Trends ({geo}，近 90 天)</p>'
        for kw, data in google["keywords"].items():
            direction = data.get("direction", "稳定")
            dc = _direction_color.get(direction, "#fbbf24")
            trends_html += f"""<div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
              <span style="font-size:8pt;min-width:160px;">{esc(kw)}</span>
              <div class="prog-track" style="flex:1;"><div class="prog-fill" style="width:{data.get('current_interest',0)}%;background:{dc};"></div></div>
              <span style="font-size:7.5pt;color:{dc};font-weight:700;min-width:60px;">{direction} {data.get('delta_pct',0):+.1f}%</span>
            </div>"""
        # Related queries
        rq = google.get("related_queries", [])
        if rq:
            trends_html += '<p style="margin-top:8px;"><b>相关搜索词:</b></p>'
            for q in rq[:5]:
                trends_html += f'<p>• {esc(q.get("query", ""))}</p>'
    else:
        trends_html = '<p>暂无 Google Trends 数据。请确认 pytrends 已正确安装。</p>'

    body = f"""
    <div class="tag tag-green" style="margin-bottom:8px;">TikTok & 搜索趋势</div>
    <div class="sec-title">TikTok Shop 与 Google 搜索趋势</div>
    <div class="sec-sub">品牌电商数据 · 达人合作 · 品类搜索热度</div>
    <div class="two-col">
      <div class="card">
        <div class="card-title">TikTok Shop 品牌数据</div>
        <div class="narrative">{tiktok_html}</div>
      </div>
      <div class="card">
        <div class="card-title">Google Trends 搜索趋势</div>
        <div class="narrative">{trends_html}</div>
      </div>
    </div>
    <div class="card" style="margin-top:12px;">
      <div class="card-title">AI 推荐与搜索趋势交叉分析</div>
      <div class="narrative"><p>品类在泰国 Google 搜索中的热度与 AI 推荐频率存在正相关性。搜索趋势上升的品类，AI 引擎更倾向于主动推荐。{brand} 需要确保在搜索热度高峰期前完成内容优化，以最大化 AI 推荐的转化价值。TikTok Shop 的销售数据和达人内容也会反哺 AI 引擎的推荐模型——高销量、好评多的商品更容易被 AI 推荐给消费者。</p></div>
    </div>"""
    return page(d['brand'], d.get('report_date',''), 12, body)


def page_competitor_overview(d):
    comp_rows = ""
    for c in d.get("competitors", []):
        is_self = c.get("is_self", False)
        name_style = 'color:var(--or);font-weight:700;' if is_self else 'font-weight:700;'
        comp_rows += f"""<tr>
          <td style="{name_style}">{esc(c['name'])}{'  ⬅' if is_self else ''}</td>
          <td style="font-weight:700;">{c.get('geo_score',0)}</td>
          <td>{c.get('sov',0):.1f}%</td>
          <td>{c.get('citations',0)}</td>
          <td>{c.get('hi_rate',0)}%</td>
          <td>{c.get('comp_rate',0)}%</td>
        </tr>"""

    # SOV bars
    sov_bars = ""
    for c in d.get("competitors", []):
        is_self = c.get("is_self", False)
        color = "var(--or)" if is_self else "rgba(255,255,255,.3)"
        sov_bars += f"""<div class="prog-row">
          <div class="prog-label" style="{'color:var(--or);font-weight:700;' if is_self else ''}">{esc(c['name'])}</div>
          <div class="prog-track"><div class="prog-fill" style="width:{c.get('sov',0)}%;background:{color};"></div></div>
          <div class="prog-val" style="{'color:var(--or);' if is_self else ''}">{c.get('sov',0):.1f}%</div>
        </div>"""

    brand = esc(d['brand'])
    geo = d.get('geo_score', 0)
    body = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">第三部分 · 竞争情报</div>
    <div class="sec-title">竞争格局总览 — AI Visibility Score & SOV</div>
    <div class="sec-sub">AI 可见度综合评分 · 推荐声量份额 · 引用率对比</div>
    <div class="two-col" style="margin-bottom:12px;">
      <div class="card">
        <div class="card-title">AI 可见度评分是什么？</div>
        <div class="narrative"><p>AI Visibility Score（AI 可见度评分）是衡量品牌在 AI 引擎推荐中综合表现的核心指标，满分 100。它综合考量四个维度：推荐出现率（40%）、推荐位置权重（25%）、引用质量（20%）和意图覆盖率（15%）。AI Visibility Score 越高，意味着消费者通过 AI 助手搜索时，品牌被推荐的概率越大、位置越靠前、描述越详细。{brand} 当前 AI Visibility Score 为 {geo}/100。</p></div>
      </div>
      <div class="card">
        <div class="card-title">SOV（推荐声量份额）是什么？</div>
        <div class="narrative"><p>SOV（Share of Voice）是品牌在 AI 推荐中占据的"声量份额"——即在所有品类相关查询中，AI 引擎提及该品牌的比例。如果 SOV 为 5%，意味着每 100 次品类查询中，AI 有 5 次提到了该品牌。SOV 与 AI Visibility Score 的区别在于：AI Visibility Score 是绝对质量评分（衡量推荐的深度和质量），SOV 是相对市场份额（衡量在竞品中的声量占比）。两者结合才能完整评估品牌的 AI 可见度竞争力。</p></div>
      </div>
    </div>
    <div class="card" style="margin-bottom:12px;">
      <div class="card-title">SOV 推荐声量份额</div>
      {sov_bars}
    </div>
    <div class="card">
      <div class="card-title">竞品全维度对比</div>
      <table class="tbl">
        <tr><th>品牌</th><th>AIV</th><th>SOV</th><th>引用</th><th>购买意图</th><th>对比引用</th></tr>
        {comp_rows}
      </table>
    </div>"""
    return page(d['brand'], d.get('report_date',''), 13, body)


def page_competitor_strengths(d):
    cd = d.get("competitor_deep_dive", {})

    body = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">竞品深度分析</div>
    <div class="sec-title">头部竞品优势解析</div>
    <div class="sec-sub">了解竞争对手在 AI 推荐中获胜的原因 · 各平台渠道的运营分析</div>
    <div class="card" style="margin-bottom:12px;">
      <div class="card-title">竞品核心优势</div>
      <div class="narrative"><p>{esc(trunc(cd.get('competitor_strengths', '暂无数据'), 4000))}</p></div>
    </div>
    <div class="card">
      <div class="card-title">AI 为何更推荐他们？</div>
      <div class="narrative"><p>{esc(trunc(cd.get('why_ai_recommends_them', '暂无数据'), 4000))}</p></div>
    </div>"""
    return page(d['brand'], d.get('report_date',''), 14, body)


def _format_numbered_text(text):
    """Convert text with inline numbered items (第一，第二，etc.) into separate paragraphs."""
    import re
    # Split on common Chinese numbered patterns
    parts = re.split(r'(?=第[一二三四五六七八九十]+[，,、])', text)
    if len(parts) <= 1:
        # Try splitting on numbered patterns like 1. 2. or 1、2、
        parts = re.split(r'(?=\d+[.、．]\s*)', text)
    if len(parts) <= 1:
        return f"<p>{esc(text)}</p>"
    html = ""
    for p in parts:
        p = p.strip()
        if p:
            html += f"<p>{esc(p)}</p>"
    return html


def page_competitor_beat(d):
    """Returns list of pages — weaknesses page + beat strategy page(s)."""
    cd = d.get("competitor_deep_dive", {})
    brand = d['brand']
    date = d.get('report_date', '')

    weaknesses_text = cd.get('competitor_weaknesses', '暂无数据')
    beat_text = cd.get('how_to_beat_them', '暂无数据')
    gap_summary = cd.get('gap_summary', '')

    # Page 1: Weaknesses
    weakness_pages = _narrative_overflow_pages(
        brand, date, "超越竞品", "竞品弱点分析",
        "竞品可攻击弱点 · 每个弱点都是 Supuon 的突破口",
        weaknesses_text, first_page_limit=1800, cont_page_limit=2200,
        card_title="竞品可攻击弱点")

    # Page 2: Beat strategy
    footer_html = f"""
    <div class="quote-box">
      <div class="quote-text">{esc(trunc(gap_summary))}</div>
    </div>""" if gap_summary else ""

    beat_pages = _narrative_overflow_pages(
        brand, date, "超越竞品", "超越策略",
        "针对竞品弱点的具体执行方案 · 指明执行平台",
        beat_text, first_page_limit=1600, cont_page_limit=2200,
        card_title="超越策略", footer_html=footer_html)

    return weakness_pages + beat_pages


def page_best_in_class(d):
    bic = d.get("best_in_class", {})
    leader = esc(bic.get('global_leader_name', ''))
    thai_leader = esc(bic.get('thai_market_leader_name', ''))

    body = f"""
    <div class="tag tag-green" style="margin-bottom:8px;">全球标杆</div>
    <div class="sec-title">全球品类标杆品牌分析：{leader}</div>
    <div class="sec-sub">产品力 · 品牌力 · 内容力 · 分销力 · AI 推荐策略</div>
    <div class="card" style="margin-bottom:12px;">
      <div class="card-title">为什么 {leader} 是全球标杆？</div>
      <div class="narrative"><p>{esc(trunc(bic.get('global_leader_why', '暂无数据'), 3000))}</p></div>
    </div>
    <div class="card" style="margin-bottom:12px;">
      <div class="card-title">{leader} 的 AI 推荐策略分析</div>
      <div class="narrative"><p>{esc(trunc(bic.get('global_leader_ai_strategy', '暂无数据'), 2500))}</p></div>
    </div>
    <div class="card">
      <div class="card-title">泰国市场领导者：{thai_leader}</div>
      <div class="narrative"><p>{esc(trunc(bic.get('thai_market_leader_analysis', '暂无数据'), 2500))}</p></div>
    </div>"""
    return page(d['brand'], d.get('report_date',''), 16, body)


def _clean_json_key_text(text):
    """Remove JSON key formatting like {'learning_1': '...'} — extract only the value text."""
    import re
    if not text:
        return ""
    s = str(text)
    # If the whole string looks like a JSON dict representation, extract value
    m = re.match(r"\{['\"]?\w+['\"]?\s*:\s*['\"](.+)['\"]?\}", s)
    if m:
        return m.group(1)
    # Also strip leading key patterns like "learning_1: "
    s = re.sub(r"^['\"]?\w+['\"]?\s*:\s*['\"]?", "", s)
    s = re.sub(r"['\"]?\s*$", "", s)
    return s


def page_best_in_class_learn(d):
    bic = d.get("best_in_class", {})
    lessons_raw = bic.get("what_client_can_learn", [])
    trends_raw = bic.get("category_trends_2025", [])

    # Handle list of dicts with {title, content} format
    def _extract_items(raw):
        items = []
        if isinstance(raw, list):
            for item in raw:
                if isinstance(item, dict):
                    title = item.get('title', '')
                    content = item.get('content', '')
                    # Truncate content to 120 chars to fit on page
                    if content and len(content) > 120:
                        content = content[:120] + "..."
                    items.append((title, content))
                elif isinstance(item, str):
                    items.append(('', _clean_json_key_text(item)))
        elif isinstance(raw, dict):
            for v in raw.values():
                if isinstance(v, dict):
                    title = v.get('title', '')
                    content = v.get('content', '')
                    if content and len(content) > 120:
                        content = content[:120] + "..."
                    items.append((title, content))
                else:
                    items.append(('', _clean_json_key_text(str(v))))
        return items

    lessons = _extract_items(lessons_raw)
    trends = _extract_items(trends_raw)

    lessons_html = ""
    for i, (title, content) in enumerate(lessons[:5]):
        if title or content:
            lessons_html += f"""<div class="action-item">
              <div class="action-num">{i+1}</div>
              <div>
                {"<div style='font-size:8pt;font-weight:700;margin-bottom:3px;color:var(--or);'>" + esc(title) + "</div>" if title else ""}
                <div class="action-desc">{esc(content or title)}</div>
              </div>
            </div>"""

    trends_html = ""
    for i, (title, content) in enumerate(trends[:5]):
        if title or content:
            trends_html += f"""<div class="insight-box">
              {"<div style='font-size:8pt;font-weight:600;margin-bottom:3px;color:#22c55e;'>" + esc(title) + "</div>" if title else ""}
              <div style="font-size:8pt;color:rgba(255,255,255,.85);line-height:1.5;">{esc(content or title)}</div>
            </div>"""

    body = f"""
    <div class="tag tag-green" style="margin-bottom:8px;">标杆学习</div>
    <div class="sec-title">客户可借鉴的策略</div>
    <div class="sec-sub">从全球标杆品牌 {esc(bic.get('global_leader_name', ''))} 学到的关键启示</div>
    <div style="margin-bottom:14px;">
      {lessons_html}
    </div>
    <div class="card">
      <div class="card-title">2025 品类趋势预测</div>
      {trends_html}
    </div>"""
    return page(d['brand'], d.get('report_date',''), 17, body)


def page_market_size(d):
    mc = d.get("market_context", {})
    drivers_raw = mc.get("growth_drivers", [])

    # Handle both list and dict
    if isinstance(drivers_raw, dict):
        drivers = list(drivers_raw.values())
    else:
        drivers = drivers_raw

    drivers_html = ""
    for i, dr in enumerate(drivers[:5]):
        drivers_html += f"""<div class="insight-box">
          <div style="font-size:8pt;color:rgba(255,255,255,.85);line-height:1.5;">{esc(_clean_json_key_text(str(dr)))}</div>
        </div>"""

    body = f"""
    <div class="tag tag-blue" style="margin-bottom:8px;">第四部分 · 市场背景</div>
    <div class="sec-title">市场规模与增长驱动力</div>
    <div class="sec-sub">了解 {esc(d.get('product_en',''))} 在泰国市场的宏观背景</div>
    <div class="card" style="margin-bottom:12px;">
      <div class="card-title">市场规模</div>
      <div class="narrative"><p>{esc(trunc(mc.get('market_size', '暂无市场规模数据'), 1200))}</p></div>
    </div>
    <div class="card" style="margin-bottom:12px;">
      <div class="card-title">增长驱动力</div>
      {drivers_html}
    </div>
    <div class="card">
      <div class="card-title">消费者行为</div>
      <div class="narrative"><p>{esc(trunc(mc.get('consumer_behavior', '暂无数据'), 1200))}</p></div>
    </div>"""
    return page(d['brand'], d.get('report_date',''), 18, body)


def page_market_ecommerce(d):
    mc = d.get("market_context", {})

    body = f"""
    <div class="tag tag-blue" style="margin-bottom:8px;">电商 & AI</div>
    <div class="sec-title">电商生态与 AI 推荐趋势</div>
    <div class="sec-sub">TikTok Shop · Shopee · Lazada · AI 购物推荐的崛起</div>
    <div class="card" style="margin-bottom:12px;">
      <div class="card-title">TikTok Shop 生态分析</div>
      <div class="narrative"><p>{esc(trunc(mc.get('tiktok_shop_context', '暂无数据'), 1500))}</p></div>
    </div>
    <div class="card" style="margin-bottom:12px;">
      <div class="card-title">AI 推荐购物趋势</div>
      <div class="narrative"><p>{esc(trunc(mc.get('ai_recommendation_landscape', '暂无数据'), 1500))}</p></div>
    </div>
    <div class="card">
      <div class="card-title">竞争格局总结</div>
      <div class="narrative"><p>{esc(trunc(mc.get('competitive_landscape_summary', '暂无数据'), 1500))}</p></div>
    </div>"""
    return page(d['brand'], d.get('report_date',''), 19, body)


def page_hallucination_overview(d):
    ha = d.get("hallucination_analysis", {})
    checks = ha.get("checks", [])
    total = len(checks)
    correct = sum(1 for c in checks if c.get("status") == "correct")
    unverifiable = sum(1 for c in checks if c.get("status") == "unverifiable")
    incorrect = sum(1 for c in checks if c.get("status") == "incorrect")
    risk = ha.get("risk_level", d.get("hallucination_analysis", {}).get("risk_level", "中风险"))
    risk_color = {"低风险": "#22c55e", "中风险": "#fbbf24", "高风险": "#ef4444"}.get(risk, "#fbbf24")

    recs_raw = ha.get("recommendations", [])
    # Handle recommendations that might be a JSON string instead of a list
    if isinstance(recs_raw, str):
        try:
            import json as _json
            recs = _json.loads(recs_raw)
        except Exception:
            recs = [recs_raw] if recs_raw.strip() else []
    else:
        recs = recs_raw if isinstance(recs_raw, list) else []
    recs_html = ""
    for r in recs[:5]:
        if isinstance(r, str):
            recs_html += f"""<div class="insight-box">
              <div style="font-size:7.5pt;color:rgba(255,255,255,.8);">{esc(r)}</div>
            </div>"""

    body = f"""
    <div class="tag tag-red" style="margin-bottom:8px;">第五部分 · 信任与风险</div>
    <div class="sec-title">AI 幻觉检测</div>
    <div class="sec-sub">验证 AI 引擎关于 {esc(d['brand'])} 的回答准确性</div>
    <div class="four-col" style="margin-bottom:14px;">
      <div class="stat-card">
        <div class="stat-label">检查总数</div>
        <div class="stat-value white">{total}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">验证正确</div>
        <div class="stat-value green">{correct}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">无法验证</div>
        <div class="stat-value" style="color:#fbbf24;">{unverifiable}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">风险等级</div>
        <div class="stat-value" style="color:{risk_color};font-size:16pt;">{esc(risk)}</div>
      </div>
    </div>
    <div class="card" style="margin-bottom:12px;">
      <div class="card-title">幻觉分析总结</div>
      <div class="narrative">{_format_numbered_text(trunc(ha.get('summary', '')))}</div>
    </div>
    <div class="card">
      <div class="card-title">风险管理建议</div>
      {recs_html if recs_html else '<div class="narrative"><p>暂无具体建议</p></div>'}
    </div>"""
    return page(d['brand'], d.get('report_date',''), 20, body)


def page_hallucination_detail(d):
    ha = d.get("hallucination_analysis", {})
    checks = ha.get("checks", [])

    checks_html = ""
    for c in checks[:10]:
        status = c.get("status", "")
        status_color = {"correct": "#22c55e", "unverifiable": "#fbbf24", "incorrect": "#ef4444"}.get(status, "#fbbf24")
        status_label = {"correct": "✓ 正确", "unverifiable": "? 无法验证", "incorrect": "✗ 不准确"}.get(status, status)
        severity_color = {"high": "#ef4444", "medium": "#fbbf24", "low": "var(--muted)"}.get(c.get("severity","low"), "var(--muted)")
        box_class = "insight-box" if status == "correct" else "warn-box"
        checks_html += f"""<div class="{box_class}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
            <span style="font-size:7pt;color:{status_color};font-weight:700;">{status_label}</span>
            <span style="font-size:6.5pt;color:{severity_color};">影响: {esc(c.get('severity',''))}</span>
          </div>
          <div style="font-size:7.5pt;font-weight:700;margin-bottom:2px;">{esc(c.get('engine',''))} — {esc(trunc(c.get('claim','')))}</div>
          <div style="font-size:7pt;color:var(--muted);">{esc(trunc(c.get('note','')))}</div>
        </div>"""

    # Also show old-format hallucination items
    old_ok = d.get("hallucination_ok_items", [])
    old_warn = d.get("hallucination_warnings", [])
    if not checks and (old_ok or old_warn):
        for item in old_ok[:5]:
            checks_html += f"""<div class="insight-box">
              <div style="font-size:7pt;color:#22c55e;font-weight:700;">✓ 正确</div>
              <div style="font-size:7.5pt;font-weight:700;margin-bottom:2px;">{esc(item.get('claim',''))}</div>
              <div style="font-size:7pt;color:var(--muted);">{esc(trunc(item.get('note',''), 150))}</div>
            </div>"""
        for item in old_warn[:5]:
            checks_html += f"""<div class="warn-box">
              <div style="font-size:7pt;color:#ef4444;font-weight:700;">⚠ 警告</div>
              <div style="font-size:7.5pt;font-weight:700;margin-bottom:2px;">{esc(item.get('claim',''))}</div>
              <div style="font-size:7pt;color:var(--muted);">{esc(trunc(item.get('fix',''), 150))}</div>
            </div>"""

    body = f"""
    <div class="tag tag-red" style="margin-bottom:8px;">幻觉详情</div>
    <div class="sec-title">逐条验证结果</div>
    <div class="sec-sub">AI 引擎回答中关于 {esc(d['brand'])} 的具体声明验证</div>
    {checks_html}"""
    return page(d['brand'], d.get('report_date',''), 21, body)


def _format_playbook(text):
    """Format playbook text: split by phase headers and numbered items, clean AI artifacts.
    Also converts Markdown headers (# ## ###) to styled HTML."""
    if not text:
        return "<p>暂无数据</p>"
    import re
    s = str(text)
    # Clean AI artifacts
    for ch in ['*"', '"*', '*\\', '\\*', '\\"', '**']:
        s = s.replace(ch, '')
    s = s.strip('*').strip()

    # Convert markdown headers to styled HTML - handle both ## and ### with Chinese text
    # First handle ### numbered items
    s = re.sub(r'^###\s*(\d+[\.\、]?\s*)', r'<NUMBERED_ITEM>\1', s, flags=re.MULTILINE)
    # Then handle ## headers with Chinese text (第一部分：立即执行)
    s = re.sub(r'^##\s*(.+)$',
        r'<div style="font-size:11pt;font-weight:700;color:var(--or);margin:16px 0 10px 0;border-left:4px solid var(--or);padding-left:12px;">\1</div>',
        s, flags=re.MULTILINE)
    # Then handle # headers
    s = re.sub(r'^#\s*(.+)$',
        r'<div style="font-size:12pt;font-weight:700;color:var(--or);margin:18px 0 12px 0;border-left:4px solid var(--or);padding-left:12px;">\1</div>',
        s, flags=re.MULTILINE)
    # Convert **bold** to <b>
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    # Convert numbered items marker back
    s = re.sub(r'<NUMBERED_ITEM>(\d+[\.\、]?\s*)', r'<div style="font-size:9pt;font-weight:700;color:var(--or);margin:10px 0 4px 0;">\1</div>', s)

    # Now the text is already formatted as HTML, just split into paragraphs
    # Split by double newlines to get paragraphs
    paragraphs = re.split(r'\n\n+', s)
    
    html_parts = []
    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        # Skip if it's already an HTML div
        if para.startswith('<div'):
            html_parts.append(para)
        else:
            html_parts.append(f'<p style="margin-bottom:10px;line-height:1.6;">{esc(para)}</p>')

    return "\n".join(html_parts) if html_parts else f"<p>{esc(s)}</p>"


def page_actions_immediate(d):
    en = d.get("extended_narrative", {})
    playbook = en.get("optimization_playbook", "")
    actions = en.get("actions", d.get("actions", []))

    # Show ALL actions, each on its own card
    actions_html = ""
    for i, a in enumerate(actions[:9]):
        desc = trunc(a.get('description', ''))
        actions_html += f"""<div class="action-item">
          <div class="action-num">{i+1}</div>
          <div style="flex:1;">
            <div class="action-title">{esc(a.get('title', ''))}</div>
            <div class="action-desc">{esc(desc)}</div>
          </div>
        </div>"""

    body = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">第六部分 · 优化方案</div>
    <div class="sec-title">优化行动计划</div>
    <div class="sec-sub">9 项行动 · 按优先级排列 — 预期提升 AI 可见度评分 +{d.get('expected_score_gain', 5)} 分</div>
    {actions_html}"""
    return page(d['brand'], d.get('report_date',''), 22, body)


def page_actions_roadmap(d):
    """Page 23: Full optimization roadmap with proper formatting.
    Returns list of pages if content is too long."""
    en = d.get("extended_narrative", {})
    playbook = en.get("optimization_playbook", "")
    brand = d['brand']
    date = d.get('report_date', '')

    # Split playbook into chunks if too long (roughly 2500 chars per page)
    chunks = _split_text(playbook, 2500)
    
    if len(chunks) <= 1:
        # Single page
        body = f"""
        <div class="tag tag-or" style="margin-bottom:8px;">优化路线图</div>
        <div class="sec-title">分阶段执行路线图</div>
        <div class="sec-sub">立即执行(1-3天) → 短期优化(1-4周) → 中期战略(1-3月)</div>
        <div class="card">
          <div class="narrative">{_format_playbook(playbook)}</div>
        </div>"""
        return page(brand, date, 23, body)
    
    # Multiple pages
    pages_out = []
    for i, chunk in enumerate(chunks):
        if i == 0:
            body = f"""
            <div class="tag tag-or" style="margin-bottom:8px;">优化路线图</div>
            <div class="sec-title">分阶段执行路线图</div>
            <div class="sec-sub">立即执行(1-3天) → 短期优化(1-4周) → 中期战略(1-3月)</div>
            <div class="card">
              <div class="narrative">{_format_playbook(chunk)}</div>
            </div>"""
        else:
            body = f"""
            <div class="tag tag-muted" style="margin-bottom:8px;">续</div>
            <div class="sec-title">执行路线图（第{i+1}部分）</div>
            <div class="card">
              <div class="narrative">{_format_playbook(chunk)}</div>
            </div>"""
        pages_out.append(page(brand, date, 23 + (i > 0), body))
    
    return pages_out


# ── Execution Deliverable Pages ─────────────────────────────────────────────

def page_exec_keywords(d):
    """Page: Multi-language keyword database & structured data template."""
    ed = d.get("execution_deliverables", {})
    brand = d["brand"]

    # Keywords table
    def _kw_rows(keywords, lang_label):
        if not keywords:
            return ""
        rows = ""
        for kw in keywords[:15]:
            if isinstance(kw, str):
                rows += f"<tr><td>{esc(kw)}</td><td>-</td><td>-</td><td>-</td></tr>"
            else:
                rows += f"""<tr>
                  <td style="font-weight:600;">{esc(kw.get('keyword',''))}</td>
                  <td>{esc(kw.get('intent',''))}</td>
                  <td>{esc(kw.get('volume_est',''))}</td>
                  <td style="font-size:7pt;">{esc(kw.get('usage_tip',''))}</td>
                </tr>"""
        return f"""<div style="margin-bottom:10px;">
          <div style="font-size:8pt;font-weight:700;color:var(--or);margin-bottom:4px;">{lang_label}</div>
          <table class="tbl" style="font-size:7pt;width:100%;">
            <tr><th>关键词</th><th>意图</th><th>搜索量</th><th>使用建议</th></tr>
            {rows}
          </table>
        </div>"""

    kw_html = _kw_rows(ed.get("keywords_thai", []), "泰语关键词 (Thai)")
    kw_html += _kw_rows(ed.get("keywords_english", []), "英语关键词 (English)")
    kw_html += _kw_rows(ed.get("keywords_chinese", []), "中文关键词 (Chinese)")

    # TikTok bio
    bio = ed.get("tiktok_bio_text", "")
    bio_html = f"""<div class="card" style="margin-top:8px;padding:8px 10px;">
      <div class="card-title" style="font-size:8pt;">TikTok 主页 Bio 优化文案</div>
      <div style="font-size:8pt;background:#0d0d1a;padding:8px;border-radius:4px;font-family:monospace;white-space:pre-wrap;">{esc(bio)}</div>
    </div>""" if bio else ""

    body = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">第七部分 · 执行交付物</div>
    <div class="sec-title">多语言关键词库</div>
    <div class="sec-sub">{brand} 三语言关键词 + 使用策略 — 可直接用于内容优化和AI数据投喂</div>
    <div class="card" style="padding:8px 10px;">
      {kw_html}
    </div>
    {bio_html}"""
    return page(brand, d.get('report_date',''), 24, body)


def page_exec_keywords_p2(d):
    """Page: Schema.org template (continued from keywords page)."""
    ed = d.get("execution_deliverables", {})
    brand = d["brand"]

    schema_html = f"""<div class="card" style="padding:8px 10px;">
          <div class="card-title" style="font-size:8pt;">Schema.org Product JSON-LD 模板</div>
          <div style="font-size:7.5pt;color:#c0c0d8;margin-bottom:6px;line-height:1.5;">
            Schema.org 是搜索引擎和 AI 引擎理解网页内容的国际标准格式。
            将结构化数据代码嵌入到官方网站每个产品页面的 &lt;script type="application/ld+json"&gt; 标签中，
            AI 模型（ChatGPT、Perplexity、Claude）在回答用户问题时就能准确读取品牌名称、价格、评价等关键信息，
            从而大幅提升 AI 推荐中的品牌准确出现率。这是 AI 可见度优化的基础工程之一。
          </div>
          <div style="font-size:9pt;background:#0d0d1a;padding:14px 16px;border-radius:6px;color:var(--or);font-weight:600;text-align:center;line-height:1.6;">
            我们已为 {esc(brand)} 定制了完整的 Schema.org JSON-LD 代码模板。<br>
            请联系阿凡提 (Avanti) 团队索取代码文件。<br>
            <span style="font-size:7.5pt;color:var(--muted);font-weight:400;">联系方式: avantia2a.com</span>
          </div>
        </div>"""

    # Medical checklist
    med = ed.get("medical_checklist", [])
    med_html = ""
    if med:
        items = ""
        for i, step in enumerate(med[:8]):
            if isinstance(step, str):
                items += f"""<div style="display:flex;gap:6px;margin-bottom:6px;">
                  <div style="min-width:18px;height:18px;background:var(--or);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:7pt;font-weight:700;color:#000;">{i+1}</div>
                  <div style="font-size:7.5pt;flex:1;">{esc(step)}</div>
                </div>"""
            else:
                items += f"""<div style="display:flex;gap:6px;margin-bottom:8px;">
                  <div style="min-width:18px;height:18px;background:var(--or);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:7pt;font-weight:700;color:#000;">{i+1}</div>
                  <div style="flex:1;">
                    <div style="font-size:7.5pt;font-weight:700;">{esc(step.get('step',''))}</div>
                    <div style="font-size:7pt;color:#a0a0c0;margin-top:2px;">{esc(step.get('detail',''))}</div>
                  </div>
                </div>"""
        med_html = f"""<div class="card" style="margin-top:10px;padding:8px 10px;">
          <div class="card-title" style="font-size:8pt;">医学认证行动清单</div>
          {items}
        </div>"""

    body = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">执行交付物（续）</div>
    <div class="sec-title">结构化数据 & 认证路径</div>
    <div class="sec-sub">Schema.org 模板 + 医学认证申请清单</div>
    {schema_html}
    {med_html}"""
    return page(brand, d.get('report_date',''), 25, body)


def page_exec_video_scripts(d):
    """Page: Video content scripts for EN + ZH.
    Shows only first 3 scripts per language to prevent overflow."""
    ed = d.get("execution_deliverables", {})
    brand = d["brand"]

    def _script_cards(scripts, lang_label):
        if not scripts:
            return ""
        cards = f'<div style="font-size:9pt;font-weight:700;color:var(--or);margin-bottom:6px;">{lang_label}</div>'
        # Show only first 3 scripts to prevent overflow
        for i, s in enumerate(scripts[:3]):
            if isinstance(s, str):
                cards += f'<div class="card" style="margin-bottom:6px;padding:6px 8px;"><div style="font-size:7.5pt;">{esc(s)}</div></div>'
                continue
            title = s.get("title", f"Video {i+1}")
            duration = s.get("duration", "30s")
            hook = s.get("hook", "")
            points = s.get("key_points", [])
            subtitle = s.get("subtitle_text", "")
            cta = s.get("cta", "")

            points_html = "".join(f'<li>{esc(p)}</li>' for p in points[:5]) if points else ""
            cards += f"""<div class="card" style="margin-bottom:6px;padding:6px 8px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <div style="font-size:8pt;font-weight:700;">#{i+1} {esc(title)}</div>
                <div style="font-size:7pt;color:var(--or);">{esc(duration)}</div>
              </div>
              <div style="font-size:7pt;color:#a0a0c0;margin-bottom:4px;"><b>Hook:</b> {esc(hook)}</div>
              {"<ul style='font-size:7pt;margin:0 0 4px 12px;padding:0;'>" + points_html + "</ul>" if points_html else ""}
              <div style="font-size:7pt;background:#0d0d1a;padding:6px 8px;border-radius:3px;margin-bottom:4px;white-space:pre-wrap;line-height:1.4;">字幕: {esc(subtitle)}</div>
              <div style="font-size:7pt;font-weight:600;color:#22c55e;">CTA: {esc(cta)}</div>
            </div>"""
        return cards

    en_html = _script_cards(ed.get("video_scripts_en", []), "英文视频脚本 (TikTok / YouTube)")
    zh_html = _script_cards(ed.get("video_scripts_zh", []), "中文视频脚本 (小红书 / 抖音 / 微博)")

    body = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">执行交付物（续）</div>
    <div class="sec-title">视频内容执行脚本</div>
    <div class="sec-sub">{brand} 6条视频的完整脚本（英文3条+中文3条）— 含标题、Hook、要点、字幕文本、CTA</div>
    {en_html}"""
    # If too much content, split EN and ZH into two pages
    page1 = page(brand, d.get('report_date',''), 26, body)

    body2 = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">执行交付物（续）</div>
    <div class="sec-title">中文视频内容脚本</div>
    <div class="sec-sub">5条中文短视频脚本 — 针对小红书、抖音、微博平台</div>
    {zh_html}"""
    page2 = page(brand, d.get('report_date',''), 27, body2)

    return [page1, page2]


def page_exec_comparison_faq(d):
    """Page: Brand comparison table + FAQ document."""
    ed = d.get("execution_deliverables", {})
    brand = d["brand"]
    top_comp = d.get("top_competitor_name", "竞品")

    # Comparison table
    comp_table = ed.get("comparison_table", [])
    comp_html = ""
    if comp_table:
        rows = ""
        for row in comp_table[:12]:
            if isinstance(row, str):
                rows += f"<tr><td colspan='4'>{esc(row)}</td></tr>"
                continue
            dim = row.get("dimension", "")
            bv = row.get("brand_value", "")
            cv = row.get("competitor_value", "")
            action = row.get("gap_action", "")
            rows += f"""<tr>
              <td style="font-weight:600;font-size:7pt;">{esc(dim)}</td>
              <td style="font-size:7pt;">{esc(bv)}</td>
              <td style="font-size:7pt;">{esc(cv)}</td>
              <td style="font-size:7pt;color:var(--or);">{esc(action)}</td>
            </tr>"""
        comp_html = f"""<div class="card" style="padding:8px 10px;margin-bottom:10px;">
          <div class="card-title" style="font-size:8pt;">{brand} vs {top_comp} 全维度对比</div>
          <table class="tbl" style="font-size:7pt;width:100%;">
            <tr><th>维度</th><th>{brand}</th><th>{top_comp}</th><th>差距行动</th></tr>
            {rows}
          </table>
        </div>"""

    # FAQ document (first page shows Thai+English FAQs)
    faq = ed.get("faq_document", [])
    faq_html = ""
    if faq:
        items = ""
        for i, qa in enumerate(faq[:8]):
            if isinstance(qa, str):
                items += f"<div style='margin-bottom:6px;font-size:7.5pt;'>{esc(qa)}</div>"
                continue
            lang_tag = {"th": "TH", "en": "EN", "zh": "ZH"}.get(qa.get("language", ""), "")
            items += f"""<div style="margin-bottom:8px;padding:10px 12px;background:#0d0d1a;border-radius:4px;">
              <div style="display:flex;gap:4px;align-items:center;margin-bottom:3px;">
                <span style="font-size:6pt;background:var(--or);color:#000;padding:1px 4px;border-radius:2px;font-weight:700;">{lang_tag}</span>
                <span style="font-size:7.5pt;font-weight:600;">Q: {esc(qa.get('question',''))}</span>
              </div>
              <div style="font-size:7pt;color:#c0c0d8;line-height:1.4;">A: {esc(qa.get('answer',''))}</div>
            </div>"""
        faq_html = f"""<div class="card" style="padding:8px 10px;">
          <div class="card-title" style="font-size:8pt;">AI友好FAQ文档（供AI引擎参考的标准问答）</div>
          {items}
        </div>"""

    body = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">执行交付物（续）</div>
    <div class="sec-title">品牌对比 & FAQ 文档</div>
    <div class="sec-sub">竞品全维度对比表 + 15条AI友好问答 — 上传至官网、FAQ页面、AI训练数据源</div>
    {comp_html}
    {faq_html}"""
    page1 = page(brand, d.get('report_date',''), 28, body)

    # Second part: remaining FAQs
    faq_rest = faq[8:] if len(faq) > 8 else []
    faq2_html = ""
    if faq_rest:
        items2 = ""
        for qa in faq_rest:
            if isinstance(qa, str):
                items2 += f"<div style='margin-bottom:6px;font-size:7.5pt;'>{esc(qa)}</div>"
                continue
            lang_tag = {"th": "TH", "en": "EN", "zh": "ZH"}.get(qa.get("language", ""), "")
            items2 += f"""<div style="margin-bottom:8px;padding:10px 12px;background:#0d0d1a;border-radius:4px;">
              <div style="display:flex;gap:4px;align-items:center;margin-bottom:3px;">
                <span style="font-size:6pt;background:var(--or);color:#000;padding:1px 4px;border-radius:2px;font-weight:700;">{lang_tag}</span>
                <span style="font-size:7.5pt;font-weight:600;">Q: {esc(qa.get('question',''))}</span>
              </div>
              <div style="font-size:7pt;color:#c0c0d8;line-height:1.4;">A: {esc(qa.get('answer',''))}</div>
            </div>"""
        faq2_html = f"""<div class="card" style="padding:8px 10px;">
          <div class="card-title" style="font-size:8pt;">FAQ 文档（续）</div>
          {items2}
        </div>"""

    # UGC campaign - make it a separate page with explanation
    ugc = ed.get("ugc_campaign", {})
    ugc_page = ""
    if ugc and isinstance(ugc, dict):
        campaign_name = ugc.get("campaign_name", "")
        description = ugc.get("description", "")
        tiers = ugc.get("reward_tiers", [])
        guidelines = ugc.get("content_guidelines", [])
        hashtags = ugc.get("hashtags", [])
        sample = ugc.get("sample_post", "")

        tiers_items = []
        for t in tiers[:3]:
            if isinstance(t, dict):
                tiers_items.append(f'{t.get("tier","")}: {t.get("reward","")}')
            else:
                tiers_items.append(str(t))
        tiers_html = "".join(f'<div style="font-size:7pt;margin-bottom:3px;">• {esc(ti)}</div>' for ti in tiers_items)
        guide_html = "".join(f'<div style="font-size:7pt;margin-bottom:2px;">• {esc(str(g))}</div>' for g in guidelines[:5])
        tags_html = " ".join(f'<span style="font-size:7pt;background:#1a1a2e;padding:2px 6px;border-radius:3px;margin-right:4px;">{esc(str(h))}</span>' for h in hashtags[:5])

        ugc_page = f"""
        <div class="card" style="margin-bottom:12px;">
          <div class="card-title" style="font-size:9pt;">UGC 激励活动方案: {esc(campaign_name)}</div>
          <div class="narrative" style="font-size:8.5pt;margin-bottom:8px;">
            <p><b>这是什么？</b> UGC（User Generated Content）用户生成内容激励活动是通过奖励机制激励消费者主动创建和分享品牌相关内容（如产品使用视频、评价图文）的营销策略。高质量的 UGC 内容不仅能直接提升品牌的社交证明和信任度，还会反哺 AI 引擎的推荐算法——当 AI 检测到大量真实用户讨论和正面评价时，会显著提升品牌在 AI 推荐结果中的排名和出现概率。</p>
            <p style="margin-top:6px;"><b>执行要点：</b> 1) 选择合适的奖励机制激励用户参与；2) 提供清晰的内容创作指南确保质量；3) 持续追踪活动效果并优化。</p>
          </div>
        </div>
        <div class="card" style="margin-bottom:12px;">
          <div class="card-title" style="font-size:8pt;">活动详情</div>
          <div style="font-size:8pt;margin-bottom:8px;">{esc(description)}</div>
          <div style="font-size:8pt;font-weight:600;margin-bottom:4px;">🎁 奖励等级:</div>
          {tiers_html}
        </div>
        <div class="card" style="margin-bottom:12px;">
          <div style="font-size:8pt;font-weight:600;margin-bottom:4px;">📝 内容创作指南:</div>
          {guide_html}
        </div>
        <div class="card" style="margin-bottom:12px;">
          <div style="font-size:8pt;font-weight:600;margin-bottom:4px;"># 话题标签:</div>
          <div style="margin-bottom:8px;">{tags_html}</div>
          <div style="font-size:8pt;font-weight:600;margin-bottom:4px;">📄 示范帖子:</div>
          <div style="font-size:7.5pt;background:#0d0d1a;padding:10px;border-radius:4px;white-space:pre-wrap;line-height:1.45;">{esc(sample)}</div>
        </div>"""

    # Return separate pages: FAQ continuation (page 28) + UGC page (page 29)
    faq2_html = ""
    if faq_rest:
        items2 = ""
        for qa in faq_rest:
            if isinstance(qa, str):
                items2 += f"<div style='margin-bottom:6px;font-size:7.5pt;'>{esc(qa)}</div>"
                continue
            lang_tag = {"th": "TH", "en": "EN", "zh": "ZH"}.get(qa.get("language", ""), "")
            items2 += f"""<div style="margin-bottom:8px;padding:10px 12px;background:#0d0d1a;border-radius:4px;">
              <div style="display:flex;gap:4px;align-items:center;margin-bottom:3px;">
                <span style="font-size:6pt;background:var(--or);color:#000;padding:1px 4px;border-radius:2px;font-weight:700;">{lang_tag}</span>
                <span style="font-size:7.5pt;font-weight:600;">Q: {esc(qa.get('question',''))}</span>
              </div>
              <div style="font-size:7pt;color:#c0c0d8;line-height:1.4;">A: {esc(qa.get('answer',''))}</div>
            </div>"""
        faq2_html = f"""<div class="card" style="padding:8px 10px;">
          <div class="card-title" style="font-size:8pt;">FAQ 文档（续）</div>
          {items2}
        </div>"""

    page_faq = page(brand, d.get('report_date',''), 28, f"""
    <div class="tag tag-or" style="margin-bottom:8px;">执行交付物（续）</div>
    <div class="sec-title">FAQ 文档</div>
    <div class="sec-sub">AI友好问答 — 上传至官网、FAQ页面、AI训练数据源</div>
    {faq2_html}
    """)

    page_ugc = page(brand, d.get('report_date',''), 29, f"""
    <div class="tag tag-or" style="margin-bottom:8px;">执行交付物（续）</div>
    <div class="sec-title">UGC 用户内容激励方案</div>
    <div class="sec-sub">通过奖励机制激励用户创建品牌内容，提升社交证明和AI推荐权重</div>
    {ugc_page}
    """)

    return [page1, page_faq, page_ugc]


def page_exec_outreach_monitor(d):
    """Page: AI company outreach email + weekly monitoring template."""
    ed = d.get("execution_deliverables", {})
    brand = d["brand"]

    # Outreach email
    email_raw = ed.get("outreach_email", "")
    email_html = ""
    if email_raw:
        if isinstance(email_raw, dict):
            email_subject = email_raw.get("subject", "")
            email_body = email_raw.get("body", "")
            email_text = f"Subject: {email_subject}\n\n{email_body}"
        else:
            email_text = str(email_raw)
        email_html = f"""<div class="card" style="padding:8px 10px;margin-bottom:10px;">
          <div class="card-title" style="font-size:8pt;">AI 公司合作提案邮件模板</div>
          <div style="font-size:7pt;color:#52526e;margin-bottom:4px;">发送至 ChatGPT / Perplexity / Claude 商务团队</div>
          <div style="font-size:7pt;background:#0d0d1a;padding:8px;border-radius:4px;white-space:pre-wrap;line-height:1.4;">{esc(email_text)}</div>
        </div>"""

    # Weekly monitor template
    monitor = ed.get("weekly_monitor_template", {})
    monitor_html = ""
    if monitor and isinstance(monitor, dict):
        checks = monitor.get("check_items", [])
        protocol = monitor.get("response_protocol", [])

        checks_html = ""
        for i, item in enumerate(checks[:10]):
            if isinstance(item, str):
                checks_html += f"""<tr><td style="font-size:7pt;">{i+1}</td><td style="font-size:7pt;">{esc(item)}</td><td style="font-size:7pt;">-</td></tr>"""
            else:
                checks_html += f"""<tr>
                  <td style="font-size:7pt;text-align:center;">{i+1}</td>
                  <td style="font-size:7pt;">{esc(item.get('check_item', item.get('item', str(item))))}</td>
                  <td style="font-size:7pt;color:var(--or);">{esc(item.get('expected_metric', item.get('metric', '')))}</td>
                </tr>"""

        protocol_html = ""
        for i, step in enumerate(protocol[:3]):
            protocol_html += f"""<div style="display:flex;gap:6px;margin-bottom:6px;">
              <div style="min-width:18px;height:18px;background:#ef4444;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:7pt;font-weight:700;color:#fff;">{i+1}</div>
              <div style="font-size:7.5pt;flex:1;">{esc(str(step))}</div>
            </div>"""

        monitor_html = f"""<div class="card" style="padding:8px 10px;">
          <div class="card-title" style="font-size:8pt;">周度 AI 可见度监控清单</div>
          <table class="tbl" style="font-size:7pt;width:100%;">
            <tr><th>#</th><th>检查项目</th><th>期望指标</th></tr>
            {checks_html}
          </table>
          <div style="font-size:8pt;font-weight:700;color:#ef4444;margin:10px 0 4px 0;">竞品反制应对流程</div>
          {protocol_html}
        </div>"""

    body = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">执行交付物（续）</div>
    <div class="sec-title">合作推广 & 监控体系</div>
    <div class="sec-sub">AI 公司合作邮件 + 每周监控清单 + 竞品反制流程</div>
    {email_html}
    {monitor_html}"""
    return page(brand, d.get('report_date',''), 30, body)


def page_actions_short(d):
    en = d.get("extended_narrative", {})
    diag = en.get("diagnosis_narrative", "")

    body = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">诊断分析</div>
    <div class="sec-title">AI 可见度诊断分析</div>
    <div class="sec-sub">{esc(d['brand'])} 的 AI 可见度危机根因解读</div>
    <div class="card">
      <div class="narrative">{_format_numbered_text(diag)}</div>
    </div>"""
    return page(d['brand'], d.get('report_date',''), 24, body)


def page_actions_mid(d):
    en = d.get("extended_narrative", {})
    conclusion = en.get("conclusion", "")
    next_focus = en.get("next_week_focus", d.get("next_week_focus", ""))

    body = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">总结与展望</div>
    <div class="sec-title">结论与下一步</div>
    <div class="sec-sub">核心发现总结 · 未来行动方向</div>
    <div class="card" style="margin-bottom:14px;">
      <div class="card-title">总结与展望</div>
      <div class="narrative"><p>{esc(trunc(conclusion))}</p></div>
    </div>
    <div class="quote-box">
      <div class="quote-text" style="font-size:9pt;">下一步重点：{esc(next_focus)}</div>
    </div>"""
    return page(d['brand'], d.get('report_date',''), 25, body)


def page_roi(d):
    roi = d.get("roi_steps", [])
    rows_html = ""
    for r in roi:
        rows_html += f"""<tr>
          <td style="font-weight:700;">{esc(r.get('week',''))}</td>
          <td style="font-weight:700;color:var(--or);">{r.get('score',0)}</td>
          <td>{esc(r.get('action',''))}</td>
        </tr>"""

    # Build a simple ASCII chart
    max_score = max((r.get("score", 0) for r in roi), default=100) or 1
    chart_bars = ""
    for r in roi:
        pct = min(r.get("score", 0) / max_score * 100, 100)
        chart_bars += f"""<div class="prog-row">
          <div class="prog-label">{esc(r.get('week',''))}</div>
          <div class="prog-track"><div class="prog-fill" style="width:{pct}%;background:var(--or);"></div></div>
          <div class="prog-val" style="color:var(--or);">{r.get('score',0)}</div>
        </div>"""

    body = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">ROI 预测</div>
    <div class="sec-title">12 周增长路径</div>
    <div class="sec-sub">AI 可见度目标: {d.get('geo_score',0)} → {d.get('roi_target_w12',30)}</div>
    <div class="card" style="margin-bottom:14px;">
      <div class="card-title">增长路径可视化</div>
      {chart_bars}
    </div>
    <div class="card">
      <div class="card-title">阶段性目标明细</div>
      <table class="tbl">
        <tr><th>阶段</th><th>目标 Score</th><th>关键动作</th></tr>
        {rows_html}
      </table>
    </div>"""
    return page(d['brand'], d.get('report_date',''), 25, body)


def page_response_samples(d, page_num, start_idx=0, count=3):
    samples = d.get("response_samples", [])
    batch = samples[start_idx:start_idx + count]

    samples_html = ""
    for s in batch:
        lang_color = {"th": "#60a5fa", "en": "#34d399", "zh": "#fbbf24"}.get(s.get("lang",""), "#60a5fa")
        engine_color = bar_color(s.get("engine", ""))
        resp_text = trunc(s.get("response", ""), 500)
        samples_html += f"""<div style="margin-bottom:10px;">
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:4px;">
            <span style="font-size:7pt;padding:2px 7px;border-radius:12px;background:rgba(255,255,255,.08);color:{engine_color};">{esc(s.get('engine',''))}</span>
            <span style="font-size:7pt;padding:2px 7px;border-radius:12px;background:rgba(255,255,255,.08);color:{lang_color};">{esc(s.get('lang',''))}</span>
            <span style="font-size:7pt;color:var(--muted);">{esc(s.get('intent',''))}</span>
          </div>
          <div style="font-size:7.5pt;font-weight:700;color:var(--or);margin-bottom:4px;">Q: {esc(trunc(s.get('query',''), 80))}</div>
          <div class="response-sample">{esc(resp_text)}</div>
        </div>"""

    if not samples_html:
        samples_html = '<div class="card"><div class="narrative"><p>暂无 AI 回复样本数据。</p></div></div>'

    label = {26: "(1)", 27: "(2)", 28: "(3)"}.get(page_num, "")
    body = f"""
    <div class="tag tag-muted" style="margin-bottom:8px;">附录</div>
    <div class="sec-title">AI 原始回复样本 {label}</div>
    <div class="sec-sub">各引擎对品牌相关查询的真实回复 — 用于验证 AI 推荐质量</div>
    {samples_html}"""
    return page(d['brand'], d.get('report_date',''), page_num, body)


def page_query_matrix(d):
    samples = d.get("query_samples", [])

    rows_html = ""
    for q in samples[:25]:
        lang_color = {"th": "#60a5fa", "en": "#34d399", "zh": "#fbbf24"}.get(q.get("lang",""), "#fff")
        intent_color = {"high": "#FF6B35", "comparison": "#a78bfa", "info": "var(--muted)"}.get(q.get("intent",""), "var(--muted)")
        hit_html = '<span style="color:#22c55e;font-weight:700;">✓</span>' if q.get("hit") else '<span style="color:#ef4444;">✗</span>'
        rows_html += f"""<tr>
          <td style="font-size:7pt;">{esc(trunc(q.get('query',''), 50))}</td>
          <td style="color:{lang_color};font-size:7pt;">{esc(q.get('lang',''))}</td>
          <td style="color:{intent_color};font-size:7pt;">{esc(q.get('intent',''))}</td>
          <td>{hit_html}</td>
          <td style="font-size:7pt;">{esc(q.get('engine',''))}</td>
        </tr>"""

    body = f"""
    <div class="tag tag-muted" style="margin-bottom:8px;">查询矩阵</div>
    <div class="sec-title">150 条查询覆盖明细</div>
    <div class="sec-sub">前 25 条查询 — 完整查询列表请参阅数据文件</div>
    <table class="tbl" style="font-size:7pt;">
      <tr><th>查询</th><th>语言</th><th>意图</th><th>命中</th><th>引擎</th></tr>
      {rows_html}
    </table>"""
    return page(d['brand'], d.get('report_date',''), 29, body)


def page_methodology(d):
    # List only engines that were actually used
    engine_names = [e['name'] for e in d.get('engines', [])]
    engine_models = {"ChatGPT": "GPT-4o", "Perplexity": "Sonar Pro", "Claude": "Haiku 4.5", "Gemini": "2.0 Flash"}
    engine_list = ' / '.join(f"{n} ({engine_models.get(n, n)})" for n in engine_names)

    body = f"""
    <div class="tag tag-muted" style="margin-bottom:8px;">研究方法</div>
    <div class="sec-title">研究方法论 · 数据来源</div>
    <div class="sec-sub">确保报告结论的科学性和可重复性</div>
    <div class="two-col">
      <div class="card">
        <div class="card-title">AI 引擎扫描</div>
        <div class="narrative">
          <p><b>查询数量:</b> 150 条 (泰语75 / 英语52 / 中文23)</p>
          <p><b>查询类型:</b> 购买推荐 / 产品对比 / 品牌查询</p>
          <p><b>本次使用引擎:</b> {engine_list}</p>
          <p><b>评分方法:</b> AI Visibility Score = 推荐出现率(40%) + 位置权重(25%) + 引用质量(20%) + 意图覆盖(15%)</p>
        </div>
      </div>
      <div class="card">
        <div class="card-title">跨平台数据</div>
        <div class="narrative">
          <p><b>Reddit:</b> 通过 Reddit API 搜索品类相关讨论，分析情感和品牌提及</p>
          <p><b>YouTube:</b> YouTube Data API v3 搜索品类创作者，分析影响力层级</p>
          <p><b>TikTok Shop:</b> TikTok Shop Open API 搜索品类商品和趋势</p>
          <p><b>Google Trends:</b> pytrends API 获取品类搜索趋势</p>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:12px;">
      <div class="card-title">幻觉检测方法</div>
      <div class="narrative">
        <p>AI 幻觉检测基于以下步骤：1) 提取 AI 回答中关于品牌的具体事实性声明；2) 与品牌官方数据（产品 listing、官网信息）进行逐条比对；3) 将声明分类为"正确"、"无法验证"或"不准确"；4) 综合评估风险等级。</p>
      </div>
    </div>"""
    return page(d['brand'], d.get('report_date',''), 30, body)


def page_about(d):
    body = f"""
    <div class="tag tag-or" style="margin-bottom:8px;">关于我们</div>
    <div class="sec-title">Avanti Intelligence</div>
    <div class="sec-sub">"Helium 10 tracks what's selling on Amazon. We track what AI is telling buyers to buy next."</div>
    <div class="card" style="margin-bottom:14px;">
      <div class="card-title">关于 Avanti</div>
      <div class="narrative">
        <p>Avanti 是全球首个 AI 推荐可见度监控平台（AI Visibility Management）。我们帮助品牌监测和优化其在 ChatGPT、Claude、Gemini、Perplexity 等 AI 引擎中的推荐表现。</p>
        <p style="margin-top:8px;">当消费者越来越多地通过 AI 助手获取购物建议时，品牌在 AI 引擎中的可见度将直接影响销售转化。Avanti 让品牌第一时间了解 AI 在推荐什么，并提供数据驱动的优化方案。</p>
      </div>
    </div>
    <div class="two-col">
      <div class="card">
        <div class="card-title">我们的服务</div>
        <div class="narrative">
          <p>• <b>AI 可见度诊断:</b> 4 大 AI 引擎 × 多语言查询 × 多意图覆盖</p>
          <p>• <b>竞品情报:</b> SOV 分析 + 竞品策略逆向工程</p>
          <p>• <b>跨平台验证:</b> Reddit + YouTube + TikTok + Google Trends</p>
          <p>• <b>AI 可见度优化:</b> 数据驱动的 AI 可见度提升方案</p>
          <p>• <b>持续监测:</b> 周报 + 月报 + 实时告警</p>
        </div>
      </div>
      <div class="card">
        <div class="card-title">下一步</div>
        <div class="narrative">
          <p>1. 实施本报告中的立即行动计划 (Week 1-2)</p>
          <p>2. 2 周后进行第二次 AI 可见度扫描，验证优化效果</p>
          <p>3. 建立月度监测机制，持续追踪品牌 AI 可见度</p>
          <p>4. 扩展至更多 AI 引擎和语言市场</p>
          <p style="margin-top:10px;"><b>联系我们:</b> avantia2a.com</p>
        </div>
      </div>
    </div>"""
    return page(d['brand'], d.get('report_date',''), 31, body)


# ══════════════════════════════════════════════════════════════════════════════
#   MAIN ASSEMBLY
# ══════════════════════════════════════════════════════════════════════════════

def build_report_html(data: dict) -> str:
    # Dynamic engine pages — only include engines that were actually run
    engine_pages = page_engine_pages(data)

    pages = [
        page_cover(data),                                  # 1
        page_toc(data),                                    # 2
        page_executive_summary(data),                      # 3
        page_geo_score(data),                              # 4
        *engine_pages,                                     # 5 (+6 if 3+ engines)
        *page_language(data),                              # auto-splits if long
        *page_intent(data),                                # auto-splits if long
        *page_cross_platform_overview(data),               # auto-splits if long
        page_reddit(data),
        page_youtube(data),
        page_tiktok_google(data),
        page_competitor_overview(data),
        page_competitor_strengths(data),
        *page_competitor_beat(data),                        # auto-splits if long
        page_best_in_class(data),
        page_best_in_class_learn(data),
        page_market_size(data),
        page_market_ecommerce(data),
        page_hallucination_overview(data),
        page_hallucination_detail(data),
        page_actions_immediate(data),
        *page_actions_roadmap(data),  # returns list if long
        # ── Execution deliverable pages (7 pages) ──
        page_exec_keywords(data),
        page_exec_keywords_p2(data),
        *page_exec_video_scripts(data),        # returns [page1, page2]
        *page_exec_comparison_faq(data),        # returns [page1, page2]
        # ── Diagnosis / Conclusion ──
        page_actions_short(data),
        page_actions_mid(data),
        page_roi(data),
        page_response_samples(data, 26, 0, 3),
        page_query_matrix(data),
        page_methodology(data),
        page_about(data),
    ]

    # Re-number pages
    renumbered = []
    for i, pg_html in enumerate(pages):
        # The cover page (i=0) doesn't use the page() wrapper, so skip it
        if i == 0:
            renumbered.append(pg_html)
        else:
            # Replace the page number in the footer
            import re
            pg_html = re.sub(r'(<span class="ftr-text">)\d+(<\/span>\s*<\/div>\s*<\/div>)$',
                            rf'\g<1>{i+1}\2', pg_html.rstrip())
            renumbered.append(pg_html)

    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<style>{CSS}</style>
</head>
<body>
{''.join(renumbered)}
</body>
</html>"""


async def html_to_pdf(html_content: str, output_path: Path):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        pg = await browser.new_page()
        await pg.set_content(html_content, wait_until="networkidle")
        await pg.pdf(
            path=str(output_path),
            format="A4",
            print_background=True,
            margin={"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"},
        )
        await browser.close()


def generate_report(data_path: str) -> Path:
    data = json.loads(Path(data_path).read_text(encoding="utf-8"))

    name_slug = data.get("report_slug") or data["brand"].lower().replace(" ", "-")
    date_slug = datetime.now().strftime("%Y-%m-%d")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OUTPUT_DIR / f"{name_slug}-{date_slug}.pdf"

    print(f"(McKinsey) Generating report for: {data['brand']} — {data.get('product_en','')}")
    html_content = build_report_html(data)

    debug_html = output_path.with_suffix(".html")
    debug_html.write_text(html_content, encoding="utf-8")
    print(f"  HTML preview: {debug_html}")

    asyncio.run(html_to_pdf(html_content, output_path))
    print(f"  ✓ PDF saved:  {output_path}")
    return output_path


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python gen_mckinsey_report.py <data.json>")
        sys.exit(1)
    generate_report(sys.argv[1])
