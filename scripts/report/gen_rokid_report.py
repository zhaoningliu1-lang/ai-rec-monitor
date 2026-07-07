#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rokid AR Glasses — AI 可见度初始报告 (McKinsey style, ~24 pages)"""
import subprocess
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
OUTPUT_DIR = SCRIPT_DIR.parent.parent / "docs" / "reports"
REPORT_DATE = "2026年03月31日"
BRAND = "ROKID"

CSS = (
"*{margin:0;padding:0;box-sizing:border-box;}"
"html,body{width:210mm;background:#0d1b2e;color:#fff;font-family:Arial,sans-serif;font-size:10pt;}"
".page{width:210mm;min-height:297mm;overflow:hidden;page-break-after:always;background:#0d1b2e;display:flex;flex-direction:column;}"
".page:last-child{page-break-after:avoid;}"
":root{--or:#FF6B35;--navy:#0d1b2e;--navy2:#152238;--navy3:#1e3050;--muted:rgba(255,255,255,.50);--border:rgba(255,255,255,.10);--green:#22c55e;--red:#ef4444;--blue:#60a5fa;}"
".hdr{height:40px;background:var(--navy2);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 28px;flex-shrink:0;}"
".hdr-brand{font-size:8pt;font-weight:700;color:var(--or);letter-spacing:1px;}"
".hdr-right{font-size:7.5pt;color:var(--muted);}"
".ftr{height:32px;background:var(--navy2);border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 28px;flex-shrink:0;margin-top:auto;}"
".ftr-t{font-size:7pt;color:rgba(255,255,255,.35);}"
".body{flex:1;padding:20px 28px;}"
".tag{display:inline-block;padding:3px 10px;border-radius:20px;font-size:7.5pt;font-weight:700;text-transform:uppercase;}"
".tag-or{background:rgba(255,107,53,.18);color:var(--or);}"
".tag-green{background:rgba(34,197,94,.15);color:#22c55e;}"
".tag-red{background:rgba(239,68,68,.15);color:#ef4444;}"
".tag-blue{background:rgba(96,165,250,.15);color:#60a5fa;}"
".tag-muted{background:rgba(255,255,255,.08);color:rgba(255,255,255,.6);}"
".sec-title{font-size:12pt;font-weight:700;margin-bottom:3px;}"
".sec-sub{font-size:8pt;color:var(--muted);margin-bottom:12px;}"
".card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);border-radius:10px;padding:14px;}"
".card-title{font-size:8.5pt;font-weight:700;margin-bottom:6px;color:var(--or);}"
".narrative{font-size:9pt;line-height:1.5;color:rgba(255,255,255,.85);}"
".narrative p{margin-bottom:8px;}"
".two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px;}"
".three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}"
".four-col{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}"
".stat-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);border-radius:10px;padding:12px;}"
".stat-label{font-size:6.5pt;color:var(--muted);margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px;}"
".stat-value{font-size:22pt;font-weight:700;line-height:1;}"
".stat-note{font-size:7pt;color:var(--muted);margin-top:3px;}"
".bar-bg{background:rgba(255,255,255,.08);border-radius:4px;height:8px;}"
".bar-fill{height:8px;border-radius:4px;}"
".bar-or{background:var(--or);}"
".bar-gr{background:#22c55e;}"
".bar-re{background:#ef4444;}"
".bar-ye{background:#fbbf24;}"
".bar-bl{background:#60a5fa;}"
"table{width:100%;border-collapse:collapse;font-size:8.5pt;}"
"th{background:var(--navy3);color:rgba(255,255,255,.7);padding:6px 10px;text-align:left;font-size:7.5pt;}"
"td{padding:6px 10px;border-bottom:1px solid var(--border);}"
"tr:last-child td{border-bottom:none;}"
".highlight-box{background:rgba(255,107,53,.08);border-left:3px solid var(--or);padding:10px 14px;border-radius:0 8px 8px 0;margin-bottom:10px;}"
".warn-box{background:rgba(239,68,68,.08);border-left:3px solid #ef4444;padding:10px 14px;border-radius:0 8px 8px 0;margin-bottom:10px;}"
".good-box{background:rgba(34,197,94,.08);border-left:3px solid #22c55e;padding:10px 14px;border-radius:0 8px 8px 0;margin-bottom:10px;}"
".toc-row{display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px dotted rgba(255,255,255,.10);font-size:8.5pt;}"
".toc-section{font-size:7pt;color:var(--or);text-transform:uppercase;letter-spacing:.6px;padding:8px 0 3px;font-weight:700;}"
".step-row{display:flex;gap:10px;align-items:flex-start;margin-bottom:10px;}"
".step-num{background:var(--or);color:#fff;border-radius:50%;width:22px;height:22px;font-size:8pt;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}"
".step-body{flex:1;}"
".step-title{font-size:8.5pt;font-weight:700;margin-bottom:2px;}"
".step-desc{font-size:8pt;color:rgba(255,255,255,.75);line-height:1.4;}"
".divider{height:1px;background:var(--border);margin:12px 0;}"
".query-row{display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid var(--border);font-size:8pt;}"
".query-num{color:var(--or);font-weight:700;min-width:20px;text-align:right;}"
".query-text{flex:1;color:rgba(255,255,255,.85);line-height:1.4;}"
".query-tag{font-size:6.5pt;padding:2px 6px;border-radius:10px;white-space:nowrap;}"
)

def hdr():
    return '<div class="hdr"><span class="hdr-brand">AVANTI · ROKID</span><span class="hdr-right">CONFIDENTIAL</span></div>'

def ftr(pg):
    return f'<div class="ftr"><span class="ftr-t">avantia2a.com</span><span class="ftr-t">ROKID — AI 可见度初始报告</span><span class="ftr-t">{pg}</span></div>'

def page(content, pg):
    return f'<div class="page">{hdr()}<div class="body">{content}</div>{ftr(pg)}</div>'

def stat(label, value, note="", color="var(--or)"):
    return f'<div class="stat-card"><div class="stat-label">{label}</div><div class="stat-value" style="color:{color};">{value}</div><div class="stat-note">{note}</div></div>'


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 1: COVER
# ═══════════════════════════════════════════════════════════════════════════════
def page_cover():
    return (
        '<div class="page" style="background:linear-gradient(135deg,#0d1b2e 0%,#1a2e4a 60%,#0f2a1e 100%);justify-content:center;align-items:center;">'
        '<div style="text-align:center;padding:40px;width:100%;">'
        '<div style="font-size:7pt;color:var(--or);letter-spacing:3px;text-transform:uppercase;margin-bottom:30px;">AVANTI × GEO INTELLIGENCE PLATFORM</div>'
        '<div style="font-size:7pt;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-bottom:20px;">BRAND VISIBILITY REPORT</div>'
        '<div style="font-size:32pt;font-weight:900;letter-spacing:2px;margin-bottom:8px;">ROKID</div>'
        '<div style="font-size:10pt;color:var(--muted);margin-bottom:40px;">AR 智能眼镜 · 美国市场<br/>AI 可见度初始报告</div>'
        '<div class="four-col" style="max-width:500px;margin:0 auto 30px;">'
        + stat("查询次数", "1,200 次", "4 品类 × 3 引擎")
        + stat("品类数", "4 个", "AR/AI/Gaming/替代")
        + stat("AI 引擎", "3 个", "ChatGPT · Claude · Gemini")
        + stat("Amazon SKU", "10+ 个", "显示型 + AI 智能")
        + '</div>'
        '<div class="two-col" style="max-width:360px;margin:0 auto 30px;">'
        + stat("市场", "US 美国", "")
        + stat("综合 GEO 得分", "35", "行业均分 52 · 差距 17 分 · 需持续优化", "#fbbf24")
        + '</div>'
        f'<div style="font-size:7.5pt;color:var(--muted);margin-top:20px;">{REPORT_DATE} · 机密文件 · 仅供内部使用</div>'
        '</div>'
        f'{ftr("1")}'
        '</div>'
    )


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 2: TABLE OF CONTENTS
# ═══════════════════════════════════════════════════════════════════════════════
def page_toc():
    sections = [
        ("一、高管摘要", [("执行摘要 / CEO Brief", 3), ("认知断层分析 · 为什么媒体覆盖没转化为AI推荐", 4)]),
        ("二、GEO 评分体系", [("GEO Score 总览（35/100）", 5), ("评分因子拆解 · 引擎对比", 6)]),
        ("三、AI 引擎深度分析", [("三引擎概览对比表", 7), ("查询样本展示 · 前 15 条", 8), ("查询样本展示 · 后 15 条", 9), ("ChatGPT 深度分析", 10), ("Gemini 深度分析", 11), ("Claude 深度分析", 12)]),
        ("四、竞品格局", [("竞争声量全景图 · 5品牌对比", 13), ("Meta Ray-Ban vs Rokid 深度对比", 14)]),
        ("五、Amazon 品牌分析", [("5 大产品线 · 636 条评价", 15), ("旗舰产品: Rokid Max 2 / AI Style", 16), ("评价主题分析", 17)]),
        ("六、全渠道情报", [("YouTube KOL 分析 · 2.7M 播放量", 18), ("Reddit + TikTok 分析", 19), ("媒体覆盖分析 · 7 家已覆盖 / 4 家缺失", 20)]),
        ("七、GEO 优化行动计划", [("行动一: CNET / The Verge 投稿", 21), ("行动二: FAQ Schema + 结构化数据", 22), ("行动三: Reddit 有机增长 + Amazon 优化", 23)]),
        ("八、ROI 路线图", [("12周 ROI 路线图（GEO 35 → 55）", 24)]),
    ]
    rows = ""
    for sec_title, items in sections:
        rows += f'<div class="toc-section">{sec_title}</div>'
        for name, pg in items:
            rows += f'<div class="toc-row"><span>{name}</span><span style="color:var(--muted);">{pg}</span></div>'
    h = (
        '<div class="tag tag-or" style="margin-bottom:10px;">报告目录</div>'
        '<div class="sec-title">目录</div>'
        f'<div class="sec-sub">共 24 页 · {REPORT_DATE} · ROKID 美国市场 AI 可见度初始报告</div>'
        + rows
    )
    return page(h, "2")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 3: CEO BRIEF
# ═══════════════════════════════════════════════════════════════════════════════
def page_ceo_brief():
    h = (
        '<div class="tag tag-red" style="margin-bottom:10px;">高管摘要</div>'
        '<div class="sec-title">执行摘要 — CEO Brief</div>'
        '<div class="narrative">'
        '<p><b>核心诊断: 75% 提及率意味着 AI 已经认识 Rokid，但始终将其排在竞品之后。差距在于权威信号，而非认知度。</b>'
        '在 1,200 次跨品类 AI 查询中，Rokid 平均提及率达 75.0%，平均位置 79.5，综合 SOV 16.5%。相比之下，Meta Ray-Ban 提及率 99.2%、位置 18.8。'
        '差距约 60 个位置——AI 知道 Rokid，但不优先推荐它。</p>'
        '</div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card"><div class="card-title">发现一: 媒体覆盖 ≠ AI 可见度</div>'
        '<div class="narrative"><p>Rokid 拥有 Tom\'s Guide ("best Meta Ray-Ban alternative")、TechRadar、Gizmodo、Laptop Mag 等 <b>7 家</b>科技媒体报道。'
        'YouTube 覆盖达 <b>2.7M 播放量</b>（含 iJustine 350K、ShortCircuit 324K）。</p>'
        '<p>但 AI 推荐位置排名 <b>5/5 垫底</b>——甚至不如没有 AI 功能的 Viture。<b>媒体认知和 AI 认知之间存在巨大断层。</b></p></div></div>'
        '<div class="card"><div class="card-title">发现二: 提及率 75% 但位置靠后</div>'
        '<div class="narrative"><p>与 v1 扫描（Claude 引擎失败导致数据偏低）不同，v2 完整扫描显示 Rokid <b>提及率达 75%</b>——AI 确实知道这个品牌。</p>'
        '<p>核心问题不是"AI 不知道 Rokid"，而是"AI 不优先推荐 Rokid"。在 "Meta Ray-Ban alternative" 查询中，提及率 65.3% 但位置仅 60.6。<b>这是权威信号不足的典型表现。</b></p></div></div>'
        '</div>'
        '<div class="card" style="margin-bottom:12px;"><div class="card-title">发现三: 关键平台缺失</div>'
        '<div class="narrative"><p><b>Wirecutter、CNET、The Verge、Consumer Reports</b> 四大平台零覆盖。这四个平台是 ChatGPT 推荐排序权重最高的信息源。'
        'Xreal 近期获得 Google Android XR 合作背书，RayNeo 有 TCL 母公司品牌力。Rokid 在 AI 训练数据中的"权威信号"不足。</p></div></div>'
        '<div class="highlight-box"><b>紧急行动</b>: (1) CNET / The Verge 投稿 P21 (2) FAQ Schema P22 (3) Reddit 有机增长 P23。'
        'Month 1 目标: GEO 35→43</div>'
        '<div class="four-col">'
        + stat("GEO Score", "35", "行业均 52", "#fbbf24")
        + stat("平均位置", "79.5", "最佳竞品 18.8", "#ef4444")
        + stat("提及率", "75.0%", "Meta 99.2%", "#fbbf24")
        + stat("媒体覆盖", "7/11", "缺 4 关键平台", "#fbbf24")
        + '</div>'
    )
    return page(h, "3")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 4: COGNITIVE GAP ANALYSIS
# ═══════════════════════════════════════════════════════════════════════════════
def page_cognitive_gap():
    h = (
        '<div class="tag tag-red" style="margin-bottom:10px;">认知断层</div>'
        '<div class="sec-title">为什么 7 家媒体报道没有转化为 AI 推荐？</div>'
        '<div class="sec-sub">媒体覆盖 vs AI 训练数据的权重差异分析</div>'
        '<div class="narrative">'
        '<p>Rokid 是本次分析中最反直觉的案例：<b>品牌不缺媒体曝光，但 AI 推荐几乎忽略它。</b>'
        '这揭示了一个关键洞察——不是所有媒体覆盖对 AI 推荐的权重相同。</p>'
        '<p><b>Why-Analysis 核心发现：</b></p>'
        '<p>• "Rokid has near-zero training data presence in AI models"</p>'
        '<p>• "Rokid is not associated with \'mid-range\' positioning in AI knowledge bases"</p>'
        '<p>• "AI models default to brands with stronger semantic associations"</p>'
        '</div>'
        '<div class="two-col" style="margin:12px 0;">'
        '<div class="card"><div class="card-title" style="color:#22c55e;">Rokid 已有的媒体（权重中等）</div>'
        '<table>'
        '<tr><th>媒体</th><th>AI 训练权重</th></tr>'
        '<tr><td>Tom\'s Guide</td><td style="color:#fbbf24;">中高</td></tr>'
        '<tr><td>TechRadar</td><td style="color:#fbbf24;">中</td></tr>'
        '<tr><td>Gizmodo</td><td style="color:#fbbf24;">中</td></tr>'
        '<tr><td>Android Central</td><td style="color:#fbbf24;">中</td></tr>'
        '<tr><td>Laptop Mag</td><td style="color:var(--muted);">中低</td></tr>'
        '<tr><td>Engadget</td><td style="color:var(--muted);">中低（新闻向）</td></tr>'
        '<tr><td>XDA Developers</td><td style="color:var(--muted);">低</td></tr>'
        '</table></div>'
        '<div class="card"><div class="card-title" style="color:#ef4444;">Rokid 缺失的媒体（权重最高）</div>'
        '<table>'
        '<tr><th>媒体</th><th>AI 训练权重</th></tr>'
        '<tr><td style="color:#ef4444;font-weight:700;">Wirecutter</td><td style="color:#ef4444;">极高 — ChatGPT 首要参考</td></tr>'
        '<tr><td style="color:#ef4444;font-weight:700;">CNET</td><td style="color:#ef4444;">极高 — 三引擎共同参考</td></tr>'
        '<tr><td style="color:#ef4444;font-weight:700;">The Verge</td><td style="color:#ef4444;">极高 — 科技品类第一</td></tr>'
        '<tr><td style="color:#ef4444;font-weight:700;">Consumer Reports</td><td style="color:#fbbf24;">高 — 信任度信号</td></tr>'
        '</table></div>'
        '</div>'
        '<div class="warn-box"><b>关键洞察</b>: AI 引擎（尤其 ChatGPT）在推荐消费电子产品时，Wirecutter、CNET、The Verge 的权重远高于其他媒体。'
        '有 Tom\'s Guide 但没有这三家，等于"考试时只复习了选修课、漏掉了必修课"。竞品 Meta Ray-Ban 在这三家都有深度覆盖。</div>'
        '<div class="good-box"><b>积极信号</b>: Rokid 的 YouTube 覆盖（2.7M 播放量、iJustine 等头部 KOL）和现有媒体基础意味着品牌并非从零开始。'
        '一旦补齐 Wirecutter/CNET/The Verge，AI 训练数据中的信号将显著增强。预计 3-6 个月内可将位置从 80 降至 40-60 区间。</div>'
    )
    return page(h, "4")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 5: GEO SCORE OVERVIEW
# ═══════════════════════════════════════════════════════════════════════════════
def page_geo_score():
    h = (
        '<div class="tag tag-or" style="margin-bottom:10px;">GEO 评分</div>'
        '<div class="sec-title">GEO Score 总览</div>'
        '<div class="sec-sub">综合 4 品类 · 3 引擎 · 1,200 次查询 · 美国市场 · 0 失败</div>'
        '<div style="text-align:center;margin:15px 0;">'
        '<div style="font-size:48pt;font-weight:900;color:#fbbf24;">35</div>'
        '<div style="font-size:10pt;color:var(--muted);">/100</div>'
        '</div>'
        '<div class="narrative" style="text-align:center;margin-bottom:15px;">'
        '<p>0–30 — <b style="color:#ef4444;">高危区</b>: AI 很少提及或推荐<br/>'
        '31–50 — <b style="color:#fbbf24;">改善区</b>: AI 偶发提及<br/>'
        '51–70 — 竞争区: AI 定期推荐<br/>'
        '71–100 — 领导区: AI 首选推荐</p>'
        '<p style="color:#fbbf24;font-weight:700;">Rokid 当前 35 分 — 处于改善区下沿，AI 已认知但不优先推荐</p>'
        '</div>'
        '<div class="four-col" style="margin-bottom:12px;">'
        + stat("综合提及率", "75.0%", "vs Meta 99.2%", "#fbbf24")
        + stat("平均位置", "79.5", "竞品均 18-26", "#ef4444")
        + stat("最佳品类", "60.6", "Meta RB替代", "#fbbf24")
        + stat("最差品类", "96.9", "AR眼镜", "#ef4444")
        + '</div>'
        '<table>'
        '<tr><th>品类</th><th>Rokid SOV</th><th>Rokid 位置</th><th>提及率</th><th>ARRS</th><th>Trust</th><th>评级</th></tr>'
        '<tr><td>AR glasses</td><td>17.3%</td><td style="color:#ef4444;font-weight:700;">96.9</td><td>80.3%</td><td>14</td><td>6</td><td><span class="tag tag-red">高危</span></td></tr>'
        '<tr><td>Smart glasses with AI</td><td>16.4%</td><td style="color:#fbbf24;font-weight:700;">64.0</td><td>74.3%</td><td>20</td><td>1</td><td><span class="tag tag-muted">改善</span></td></tr>'
        '<tr><td>Smart glasses for gaming</td><td>17.4%</td><td style="color:#ef4444;font-weight:700;">96.5</td><td>80.0%</td><td>15</td><td>7</td><td><span class="tag tag-red">高危</span></td></tr>'
        '<tr><td>Meta Ray-Ban alternative</td><td>15.0%</td><td style="color:#fbbf24;font-weight:700;">60.6</td><td>65.3%</td><td>29</td><td>5</td><td><span class="tag tag-muted">改善</span></td></tr>'
        '</table>'
    )
    return page(h, "5")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 6: SCORE FACTORS
# ═══════════════════════════════════════════════════════════════════════════════
def page_score_factors():
    h = (
        '<div class="tag tag-or" style="margin-bottom:10px;">评分因子</div>'
        '<div class="sec-title">GEO Score 因子拆解 + 引擎对比</div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card"><div class="card-title">4 大评分因子（满分 100）</div>'
        '<div style="margin-bottom:8px;"><span style="font-size:8pt;">内容权威性（媒体/测评）</span><div class="bar-bg"><div class="bar-fill bar-ye" style="width:37%;"></div></div><span style="font-size:7pt;color:var(--muted);">11/30 — 有 Tom\'s Guide 但缺 Wirecutter/CNET/Verge</span></div>'
        '<div style="margin-bottom:8px;"><span style="font-size:8pt;">社交证明（YouTube/Reddit）</span><div class="bar-bg"><div class="bar-fill bar-gr" style="width:60%;"></div></div><span style="font-size:7pt;color:var(--muted);">15/25 — YouTube 2.7M 很强，Reddit 偏弱</span></div>'
        '<div style="margin-bottom:8px;"><span style="font-size:8pt;">产品信息完整度</span><div class="bar-bg"><div class="bar-fill bar-ye" style="width:28%;"></div></div><span style="font-size:7pt;color:var(--muted);">7/25 — Amazon 评价仅 636 条（vs Meta 万级）</span></div>'
        '<div style="margin-bottom:8px;"><span style="font-size:8pt;">品牌叙事一致性</span><div class="bar-bg"><div class="bar-fill bar-re" style="width:15%;"></div></div><span style="font-size:7pt;color:var(--muted);">3/20 — 产品线分散，AI 难以建立统一认知</span></div>'
        '<div style="font-size:9pt;font-weight:700;color:var(--or);margin-top:8px;">总分: 36 / 100</div>'
        '</div>'
        '<div class="card"><div class="card-title">5 品牌竞品排名</div>'
        '<table>'
        '<tr><th>#</th><th>品牌</th><th>均位</th><th>SOV</th><th>提及率</th></tr>'
        '<tr><td>1</td><td style="color:#22c55e;font-weight:700;">Meta Ray-Ban</td><td>18.8</td><td>21.9%</td><td>99.2%</td></tr>'
        '<tr><td>2</td><td>Xreal</td><td>25.0</td><td>21.6%</td><td>97.8%</td></tr>'
        '<tr><td>3</td><td>RayNeo</td><td>25.7</td><td>21.6%</td><td>97.8%</td></tr>'
        '<tr><td>4</td><td>Viture</td><td>67.0</td><td>18.4%</td><td>83.3%</td></tr>'
        '<tr><td style="color:#ef4444;">5</td><td style="color:#ef4444;font-weight:700;">Rokid</td><td style="color:#ef4444;">79.5</td><td style="color:#ef4444;">16.5%</td><td style="color:#ef4444;">75.0%</td></tr>'
        '</table>'
        '</div>'
        '</div>'
        '<div class="warn-box"><b>关键发现</b>: Rokid 在所有 4 个品类中均排名最后，但与 v1 数据相比差距已大幅缩小（位置从 121.5 降至 79.5）。'
        '提及率 75% 说明 AI 已认知 Rokid，核心问题是缺乏权威信号让 AI 将其排在前列。补齐 Wirecutter/CNET/The Verge 是最高 ROI 行动。</div>'
    )
    return page(h, "6")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 7: ENGINE OVERVIEW
# ═══════════════════════════════════════════════════════════════════════════════
def page_engine_overview():
    h = (
        '<div class="tag tag-blue" style="margin-bottom:10px;">引擎对比</div>'
        '<div class="sec-title">三引擎概览 · Rokid 各品类位置</div>'
        '<div class="sec-sub">ChatGPT · Gemini · Claude × 4 品类 · 提及率 + 位置 + SOV · 0 失败</div>'
        '<table>'
        '<tr><th>品类</th><th>Rokid SOV</th><th>提及率</th><th>位置</th><th>ARRS</th><th>Trust</th><th>评级</th></tr>'
        '<tr><td>AR glasses</td><td>17.3%</td><td>80.3%</td><td style="color:#ef4444;">96.9</td><td>14</td><td>6</td><td><span class="tag tag-red">高危</span></td></tr>'
        '<tr><td>Smart glasses AI</td><td>16.4%</td><td>74.3%</td><td style="color:#fbbf24;">64.0</td><td>20</td><td>1</td><td><span class="tag tag-muted">改善</span></td></tr>'
        '<tr><td>Gaming glasses</td><td>17.4%</td><td>80.0%</td><td style="color:#ef4444;">96.5</td><td>15</td><td>7</td><td><span class="tag tag-red">高危</span></td></tr>'
        '<tr><td>Meta RB alternative</td><td>15.0%</td><td>65.3%</td><td style="color:#fbbf24;">60.6</td><td>29</td><td>5</td><td><span class="tag tag-muted">改善</span></td></tr>'
        '</table>'
        '<div class="divider"></div>'
        '<div class="narrative">'
        '<p><b>关键发现</b>: v2 扫描（3 引擎全部成功，0 失败）显示 Rokid 的实际表现比 v1 数据好得多。提及率 75%（vs v1 的 40.8%）意味着 AI 已经认知 Rokid，但一致性地将其排在竞品之后。</p>'
        '<p><b>最佳表现</b>: "Meta Ray-Ban alternative" 品类（位置 60.6），这与 Tom\'s Guide "best Meta Ray-Ban alternative" 的背书直接相关。ARRS 29 分也是全品类最高。</p>'
        '<p><b>最差表现</b>: "AR glasses" 品类（位置 96.9），此品类中 Meta、Xreal、RayNeo 三巨头占据了 AI 推荐的绝大部分份额。</p>'
        '</div>'
        '<div class="highlight-box"><b>积极信号</b>: Rokid 是 5 家竞品中唯一同时拥有显示型 AR 和 AI 智能眼镜两条产品线的公司。v2 数据证实 AI 已知道 Rokid，优化重点应从"让 AI 认识 Rokid"转向"让 AI 优先推荐 Rokid"。</div>'
    )
    return page(h, "7")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 8: QUERY SAMPLES (1-15)
# ═══════════════════════════════════════════════════════════════════════════════
def page_query_samples_1():
    queries = [
        ("1", "Best AR glasses brand for home use mid?", "HIGH", "tag-red"),
        ("2", "Top AR glasses pick mid with fast Amazon shipping?", "HIGH", "tag-red"),
        ("3", "Best AR glasses deal mid available in the US right now?", "HIGH", "tag-red"),
        ("4", "Most recommended AR glasses for Gen Z buyers — mid?", "HIGH", "tag-red"),
        ("5", "Which AR glasses brand has the best reviews mid?", "HIGH", "tag-red"),
        ("6", "Ready to buy a AR glasses — recommend a brand mid", "HIGH", "tag-red"),
        ("7", "Best smart glasses with AI for everyday use?", "HIGH", "tag-red"),
        ("8", "Top-selling smart glasses brand in America?", "HIGH", "tag-red"),
        ("9", "Quick recommendation: best gaming glasses for Steam Deck?", "HIGH", "tag-red"),
        ("10", "Best Meta Ray-Ban alternative under $300?", "HIGH", "tag-red"),
        ("11", "Which smart glasses brand is trending — I keep seeing it everywhere?", "HIGH", "tag-red"),
        ("12", "I want first-class AR glasses — your top suggestion?", "HIGH", "tag-red"),
        ("13", "Compare the top AR glasses brands for US buyers", "COMPARE", "tag-blue"),
        ("14", "Side-by-side: which AR glasses brand wins for US Amazon shoppers?", "COMPARE", "tag-blue"),
        ("15", "What's the difference between the leading smart glasses brands?", "COMPARE", "tag-blue"),
    ]
    rows = ""
    for num, text, intent, tag_cls in queries:
        rows += f'<div class="query-row"><span class="query-num">{num}</span><span class="query-text">{text}</span><span class="query-tag {tag_cls}">{intent}</span></div>'

    h = (
        '<div class="tag tag-or" style="margin-bottom:10px;">查询样本</div>'
        '<div class="sec-title">GEO 查询样本 · 前 15 条</div>'
        '<div class="sec-sub">1,200 次查询中的代表性 prompt · 覆盖 4 品类 · 3 引擎</div>'
        '<div class="two-col" style="margin-bottom:10px;">'
        '<div class="card"><div class="card-title">查询类型分布</div>'
        '<div style="margin-bottom:6px;"><span style="font-size:8pt;">High Purchase Intent</span><div class="bar-bg"><div class="bar-fill bar-re" style="width:40%;"></div></div><span style="font-size:7pt;color:var(--muted);">40%</span></div>'
        '<div style="margin-bottom:6px;"><span style="font-size:8pt;">Informational</span><div class="bar-bg"><div class="bar-fill bar-bl" style="width:25%;"></div></div><span style="font-size:7pt;color:var(--muted);">25%</span></div>'
        '<div style="margin-bottom:6px;"><span style="font-size:8pt;">Comparison</span><div class="bar-bg"><div class="bar-fill bar-ye" style="width:20%;"></div></div><span style="font-size:7pt;color:var(--muted);">20%</span></div>'
        '<div style="margin-bottom:6px;"><span style="font-size:8pt;">Specialized</span><div class="bar-bg"><div class="bar-fill bar-gr" style="width:15%;"></div></div><span style="font-size:7pt;color:var(--muted);">15%</span></div>'
        '</div>'
        '<div class="card"><div class="card-title">品类覆盖</div>'
        '<div class="narrative">'
        '<p>• <b>AR glasses</b> — 通用 AR 眼镜查询</p>'
        '<p>• <b>Smart glasses with AI</b> — AI 智能眼镜</p>'
        '<p>• <b>Smart glasses for gaming</b> — 游戏场景</p>'
        '<p>• <b>Meta Ray-Ban alternative</b> — 竞品替代</p>'
        '</div></div>'
        '</div>'
        + rows
    )
    return page(h, "8")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 9: QUERY SAMPLES (16-30)
# ═══════════════════════════════════════════════════════════════════════════════
def page_query_samples_2():
    queries = [
        ("16", "Can you rank the top AR glasses brands available in the US?", "COMPARE", "tag-blue"),
        ("17", "Rokid vs Xreal vs Meta — which is best for my needs?", "COMPARE", "tag-blue"),
        ("18", "DTC vs Amazon: which is better for buying smart glasses?", "COMPARE", "tag-blue"),
        ("19", "Which AR glasses brands have been recommended by Consumer Reports?", "INFO", "tag-muted"),
        ("20", "What makes a AR glasses brand reliable?", "INFO", "tag-muted"),
        ("21", "Which smart glasses brands offer the best after-sales service?", "INFO", "tag-muted"),
        ("22", "What do experts say about AR glasses brands in 2024?", "INFO", "tag-muted"),
        ("23", "How do I choose a smart glasses brand that's actually ethical?", "INFO", "tag-muted"),
        ("24", "Which AR glasses brands are actually sustainable?", "INFO", "tag-muted"),
        ("25", "What are the trending AR glasses brands among American buyers?", "INFO", "tag-muted"),
        ("26", "Best AR glasses for gaming with Switch and PS5?", "SPEC", "tag-green"),
        ("27", "Which smart glasses have ChatGPT built in?", "SPEC", "tag-green"),
        ("28", "Best lightweight smart glasses for all-day wear?", "SPEC", "tag-green"),
        ("29", "AR glasses with prescription lens support — recommendations?", "SPEC", "tag-green"),
        ("30", "Best alternative to Meta Ray-Ban smart glasses 2026?", "SPEC", "tag-green"),
    ]
    rows = ""
    for num, text, intent, tag_cls in queries:
        rows += f'<div class="query-row"><span class="query-num">{num}</span><span class="query-text">{text}</span><span class="query-tag {tag_cls}">{intent}</span></div>'

    h = (
        '<div class="tag tag-or" style="margin-bottom:10px;">查询样本</div>'
        '<div class="sec-title">GEO 查询样本 · 后 15 条</div>'
        '<div class="sec-sub">Comparison / Informational / Specialized 查询类型</div>'
        + rows
        + '<div class="divider"></div>'
        '<div class="highlight-box"><b>查询设计说明</b>: 30 条代表性 prompt 覆盖了美国消费者在 AI 助手中搜索 AR/智能眼镜的典型场景。'
        'HIGH 类型模拟即将购买的用户，COMPARE 模拟货比三家的用户，INFO 模拟了解品类的用户，SPEC 模拟有特定需求的用户。'
        '实际扫描使用 100 条 prompt × 4 品类 × 3 引擎 = 1,200 次查询。</div>'
        '<div class="two-col">'
        '<div class="card"><div class="card-title">Rokid 最佳表现查询</div>'
        '<div class="narrative">'
        '<p>• "Best Meta Ray-Ban alternative under $300?" — 位置 ~60</p>'
        '<p>• "Which smart glasses have ChatGPT built in?" — 多引擎提及</p>'
        '<p>• "Best lightweight smart glasses for all-day wear?" — 38.5g 优势</p>'
        '</div></div>'
        '<div class="card"><div class="card-title">Rokid 最差表现查询</div>'
        '<div class="narrative">'
        '<p>• "Best AR glasses brand for home use?" — 位置 ~97</p>'
        '<p>• "Consumer Reports recommended?" — 零覆盖导致缺席</p>'
        '<p>• "Top-selling smart glasses brand?" — 销量信号不足</p>'
        '</div></div>'
        '</div>'
    )
    return page(h, "9")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGES 10-12: ENGINE DEEP DIVES (combined into 3 pages)
# ═══════════════════════════════════════════════════════════════════════════════
def page_chatgpt():
    h = (
        '<div class="tag tag-red" style="margin-bottom:10px;">引擎分析 · ChatGPT</div>'
        '<div class="sec-title">ChatGPT 深度分析 — 表现最需关注</div>'
        '<div class="sec-sub">美国用户最常用 AI 助手 · 月活 2 亿+</div>'
        '<div class="narrative">'
        '<p>ChatGPT 是美国消费者最广泛使用的 AI 助手。在 smart glasses 品类中，ChatGPT 高度依赖 Wirecutter、CNET、The Verge 的测评数据来排序推荐。'
        'Rokid 在这三个平台零覆盖，直接导致 ChatGPT 在推荐时将 Rokid 排在靠后位置。</p>'
        '</div>'
        '<div class="card" style="margin:10px 0;"><div class="card-title">ChatGPT 低排名原因分析</div>'
        '<div class="narrative">'
        '<p><b>1. Wirecutter/CNET/The Verge 零覆盖</b>: ChatGPT 在消费电子品类中将这三家视为"黄金信号源"。Meta Ray-Ban 在三家都有深度测评，形成了不可逾越的信号优势。</p>'
        '<p><b>2. 品牌叙事碎片化</b>: Rokid 有 Max（显示）、Max 2、AR Spatial（空间计算）、AI Style（AI智能）、Joy Pack 等多条产品线。AI 难以建立统一的品牌定位——它不确定 Rokid 到底是"显示设备"还是"AI 助手"还是"游戏配件"。</p>'
        '<p><b>3. Amazon 评价量偏低</b>: 636 条总评价 vs Meta Ray-Ban 数万条。ChatGPT 将评价量视为"市场验证"信号，评价少 = 小众品牌。</p>'
        '</div></div>'
        '<div class="highlight-box"><b>优先行动</b>: 争取 CNET 和 The Verge 测评收录，预计可将 ChatGPT 排名从 80+ 提升至 40-60 区间。'
        '同时建议 Rokid 聚焦一条产品线（推荐 AI Glasses Style）建立清晰的品牌叙事。</div>'
    )
    return page(h, "10")

def page_gemini():
    h = (
        '<div class="tag tag-blue" style="margin-bottom:10px;">引擎分析 · Gemini</div>'
        '<div class="sec-title">Gemini 深度分析 — Google 生态入口</div>'
        '<div class="sec-sub">集成于搜索、Android、Chrome · 覆盖数十亿用户</div>'
        '<div class="narrative">'
        '<p>Gemini 作为 Google 的 AI 助手，直接集成于 Google 搜索和 Android 系统。值得注意的是，Google 已与 Xreal 合作 Android XR 平台（Project Aura），这意味着 Xreal 在 Gemini 中可能获得额外的算法偏好。</p>'
        '</div>'
        '<div class="card" style="margin:10px 0;"><div class="card-title">Gemini 对 Rokid 的偏好分析</div>'
        '<div class="narrative">'
        '<p><b>1. Google Shopping 数据联动</b>: Gemini 能直接调取 Google Shopping 产品数据。Rokid 在 Google Shopping 上有一定存在感（多款产品有 listing），这可能是 Rokid 在 Gemini 上表现略好于 ChatGPT 的原因。</p>'
        '<p><b>2. Xreal 的 Android XR 优势</b>: Google 官方宣布与 Xreal 合作 Android XR 平台。这种官方合作关系在 Gemini 的推荐中权重极高——Xreal 在 Gemini 中的位置预计将持续领先。</p>'
        '<p><b>3. YouTube 内容权重</b>: Gemini 对 YouTube 内容的索引最为全面。Rokid 的 2.7M YouTube 播放量是一个积极信号，但需要更多结构化的"对比测评"视频（vs 开箱/演示类内容）。</p>'
        '</div></div>'
        '<div class="good-box"><b>策略方向</b>: 聚焦 YouTube 结构化内容（"Rokid vs Xreal vs Meta 对比"类视频）+ Google Shopping listing 优化 + sensarte.com FAQ Schema 适用于 Rokid 官网。</div>'
    )
    return page(h, "11")

def page_claude():
    h = (
        '<div class="tag tag-green" style="margin-bottom:10px;">引擎分析 · Claude</div>'
        '<div class="sec-title">Claude 深度分析 — 技术型用户偏好</div>'
        '<div class="sec-sub">Anthropic · 偏重技术细节和产品参数</div>'
        '<div class="narrative">'
        '<p>Claude 的训练数据更重视产品技术规格、专业评测和结构化信息。v2 扫描中 Claude 引擎正常运行（v1 曾全部失败），提供了完整的数据基线。</p>'
        '</div>'
        '<div class="card" style="margin:10px 0;"><div class="card-title">Claude 对 Rokid 的理解</div>'
        '<div class="narrative">'
        '<p><b>1. 技术差异化被识别</b>: Claude 能准确提取 "Micro-OLED"、"120Hz"、"600 nits"、"50° FOV" 等 Rokid Max 的技术参数，在回答中引用频率较高。</p>'
        '<p><b>2. 产品线多样性被认知</b>: Claude 知道 Rokid 既有显示型（Max 系列）也有 AI 型（Style），在不同查询中能匹配到正确的产品线。</p>'
        '<p><b>3. 排名仍然靠后</b>: 尽管技术信息被正确识别，Claude 仍然将 Meta Ray-Ban 和 Xreal 排在前面，原因是这两家在 Claude 训练数据中的"共识信号"更强（更多独立测评、更多用户讨论）。</p>'
        '</div></div>'
        '<div class="highlight-box"><b>Claude 优化策略</b>: 在品牌官网和 Amazon listing 中强化结构化技术参数（JSON-LD Schema），Claude 对此类数据的响应度最高。'
        '同时，增加 Reddit 等社区的技术讨论帖，Claude 将这些视为"真实用户验证"信号。</div>'
    )
    return page(h, "12")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 13: COMPETITIVE LANDSCAPE
# ═══════════════════════════════════════════════════════════════════════════════
def page_competitive():
    h = (
        '<div class="tag tag-or" style="margin-bottom:10px;">竞争格局</div>'
        '<div class="sec-title">竞争声量全景图 · 5 品牌对比</div>'
        '<div class="sec-sub">4 品类综合均位 · 跨引擎加权 · 1,200 次查询</div>'
        '<table style="margin-bottom:12px;">'
        '<tr><th>#</th><th>品牌</th><th>均位</th><th>SOV</th><th>提及率</th><th>状态</th></tr>'
        '<tr><td>1</td><td style="color:#22c55e;font-weight:700;">Meta Ray-Ban</td><td style="color:#22c55e;">18.8</td><td>21.9%</td><td>99.2%</td><td><span class="tag tag-green">领先</span></td></tr>'
        '<tr><td>2</td><td>Xreal</td><td>25.0</td><td>21.6%</td><td>97.8%</td><td><span class="tag tag-green">领先</span></td></tr>'
        '<tr><td>3</td><td>RayNeo</td><td>25.7</td><td>21.6%</td><td>97.8%</td><td><span class="tag tag-green">领先</span></td></tr>'
        '<tr><td>4</td><td>Viture</td><td>67.0</td><td>18.4%</td><td>83.3%</td><td><span class="tag tag-muted">中等</span></td></tr>'
        '<tr><td style="color:#ef4444;">5</td><td style="color:#ef4444;font-weight:700;">Rokid</td><td style="color:#ef4444;">79.5</td><td style="color:#ef4444;">16.5%</td><td style="color:#ef4444;">75.0%</td><td><span class="tag tag-red">高危</span></td></tr>'
        '</table>'
        '<div class="two-col">'
        '<div class="card"><div class="card-title">第一梯队: Meta + Xreal + RayNeo</div>'
        '<div class="narrative"><p>三家品牌均位 18-26，SOV 21-22%，形成了 AI 推荐的"核心推荐圈"。共同特征：</p>'
        '<p>• Meta: Wirecutter/CNET/Verge 全覆盖 + 自有 AI 生态</p>'
        '<p>• Xreal: Google Android XR 官方合作 + CNET 测评</p>'
        '<p>• RayNeo: TCL 母公司品牌力 + 价格梯度覆盖</p></div></div>'
        '<div class="card"><div class="card-title">Rokid 的差异化机会</div>'
        '<div class="narrative"><p>Rokid 是 5 家中唯一同时拥有：</p>'
        '<p>• <b>显示型 AR</b>（Max/Spatial — 360" Micro-OLED）</p>'
        '<p>• <b>AI 智能眼镜</b>（Style — ChatGPT + DeepSeek 双引擎）</p>'
        '<p>• <b>空间计算</b>（Spatial — 三屏多任务）</p>'
        '<p>这种全产品线覆盖在当前 AI 训练数据中没有被有效传达。</p></div></div>'
        '</div>'
    )
    return page(h, "13")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 14: META VS ROKID
# ═══════════════════════════════════════════════════════════════════════════════
def page_meta_vs_rokid():
    h = (
        '<div class="tag tag-or" style="margin-bottom:10px;">竞品深度对比</div>'
        '<div class="sec-title">Meta Ray-Ban vs Rokid · 逐维度拆解</div>'
        '<div class="sec-sub">行业 #1 vs Rokid · 媒体 · 产品 · 社交全面对比</div>'
        '<table style="margin-bottom:12px;">'
        '<tr><th>维度</th><th>Meta Ray-Ban</th><th>Rokid</th><th>差距</th></tr>'
        '<tr><td>AI 均位</td><td style="color:#22c55e;">18.8</td><td style="color:#ef4444;">79.5</td><td style="color:#ef4444;">-60.7</td></tr>'
        '<tr><td>SOV</td><td style="color:#22c55e;">21.9%</td><td style="color:#ef4444;">16.5%</td><td style="color:#ef4444;">-5.4%</td></tr>'
        '<tr><td>提及率</td><td style="color:#22c55e;">99.2%</td><td style="color:#ef4444;">75.0%</td><td style="color:#ef4444;">-24.2%</td></tr>'
        '<tr><td>Wirecutter</td><td style="color:#22c55e;">深度测评</td><td style="color:#ef4444;">零覆盖</td><td style="color:#ef4444;">致命</td></tr>'
        '<tr><td>CNET / The Verge</td><td style="color:#22c55e;">多篇</td><td style="color:#ef4444;">零覆盖</td><td style="color:#ef4444;">致命</td></tr>'
        '<tr><td>Tom\'s Guide</td><td style="color:#22c55e;">多篇</td><td style="color:#22c55e;">有（"best alternative"）</td><td style="color:#22c55e;">持平</td></tr>'
        '<tr><td>YouTube 头部 KOL</td><td style="color:#22c55e;">MKBHD 等</td><td style="color:#22c55e;">iJustine, ShortCircuit</td><td style="color:#22c55e;">接近</td></tr>'
        '<tr><td>Amazon 评价</td><td style="color:#22c55e;">数万条</td><td style="color:#fbbf24;">636 条</td><td style="color:#ef4444;">严重</td></tr>'
        '<tr><td>AI 引擎支持</td><td>Meta AI only</td><td style="color:#22c55e;">ChatGPT + Gemini + DeepSeek</td><td style="color:#22c55e;">优势</td></tr>'
        '<tr><td>显示能力</td><td style="color:#ef4444;">无显示屏</td><td style="color:#22c55e;">360" Micro-OLED</td><td style="color:#22c55e;">独有优势</td></tr>'
        '<tr><td>重量</td><td>~49g</td><td style="color:#22c55e;">38.5g (Style)</td><td style="color:#22c55e;">轻 22%</td></tr>'
        '<tr><td>价格</td><td>$299-$379</td><td style="color:#22c55e;">$279 (Style)</td><td style="color:#22c55e;">便宜 $20</td></tr>'
        '</table>'
        '<div class="warn-box"><b>核心结论</b>: Rokid 在产品力上有多个维度领先 Meta（多 AI 引擎、有显示屏、更轻、更便宜），但在 AI 训练数据的"权威信号"上全面落后。'
        'Meta 的优势不是产品更好，而是"AI 更了解 Meta"。这正是 GEO 优化可以改变的。</div>'
    )
    return page(h, "14")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 15: AMAZON OVERVIEW
# ═══════════════════════════════════════════════════════════════════════════════
def page_amazon():
    h = (
        '<div class="tag tag-or" style="margin-bottom:10px;">Amazon 品牌分析</div>'
        '<div class="sec-title">Amazon 5 大产品线 · 636 条评价</div>'
        '<div class="sec-sub">双产品线覆盖: 显示型 AR + AI 智能眼镜 · $279-$698</div>'
        '<div class="four-col" style="margin-bottom:12px;">'
        + stat("总 SKU", "10+", "活跃产品")
        + stat("价格区间", "$279-698", "中高端定位")
        + stat("总评价", "636", "vs Meta 万级")
        + stat("平均评分", "3.86★", "中等偏上")
        + '</div>'
        '<table>'
        '<tr><th>产品</th><th>ASIN</th><th>价格</th><th>评分</th><th>评价数</th><th>类型</th></tr>'
        '<tr><td>Rokid AR Joy Pack</td><td>B0CHFJ3D6M</td><td>$299</td><td>3.8★</td><td style="font-weight:700;">306</td><td>显示AR+TV</td></tr>'
        '<tr><td>Rokid Max 2</td><td>B0DKX1WSQ3</td><td>$359</td><td style="color:#22c55e;">4.0★</td><td>145</td><td>显示AR</td></tr>'
        '<tr><td>Rokid Max</td><td>B0CML7V7FX</td><td>$698</td><td>3.9★</td><td>113</td><td>显示AR</td></tr>'
        '<tr><td style="color:var(--or);">Rokid AI Glasses Style</td><td>B0FWRR787L</td><td style="color:var(--or);">$279</td><td style="color:#22c55e;">4.0★</td><td>51</td><td>AI智能</td></tr>'
        '<tr><td>Rokid AR Spatial</td><td>B0FH6X6K2P</td><td>$698</td><td>3.6★</td><td>21</td><td>空间计算</td></tr>'
        '</table>'
        '<div class="divider"></div>'
        '<div class="narrative">'
        '<p><b>产品矩阵优势</b>: Rokid 是唯一同时覆盖"看"（显示型 Max）和"用"（AI Style）两大场景的品牌。但这也导致了 AI 训练数据中的品牌定位模糊。</p>'
        '<p><b>评价量短板</b>: 636 条总评价远低于 Meta Ray-Ban（万级）和 Xreal（千级）。AI 引擎将评价量视为"市场验证"信号，评价少 = 小众/新兴品牌 = 推荐优先级低。</p>'
        '<p><b>关注点</b>: AI Glasses Style 是 CES 2026 新品（$279, 4.0★），评价量仅 51 条。随着用户增长，评价量提升将直接改善 AI 可见度。</p>'
        '</div>'
    )
    return page(h, "15")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 16: FLAGSHIP PRODUCTS
# ═══════════════════════════════════════════════════════════════════════════════
def page_flagships():
    h = (
        '<div class="tag tag-or" style="margin-bottom:10px;">旗舰产品</div>'
        '<div class="sec-title">旗舰产品详页: Rokid Max 2 + AI Glasses Style</div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card">'
        '<div class="card-title">Rokid Max 2 — 显示型主力</div>'
        '<div class="four-col">'
        + stat("价格", "$359", "", "white")
        + stat("评分", "4.0★", "145 评价", "#22c55e")
        + '</div>'
        '<div class="narrative" style="margin-top:8px;">'
        '<p>• 215" Micro-OLED 虚拟屏幕</p>'
        '<p>• 120Hz 刷新率 + 600 nits 亮度</p>'
        '<p>• 50° FOV + 近视调节</p>'
        '<p>• USB-C 即插即用</p>'
        '<p>• 兼容 Steam Deck / Switch / PS5</p>'
        '</div>'
        '<div class="good-box" style="margin-top:8px;"><b>GEO 角度</b>: 显示型 AR 是 Rokid 技术最强的领域，但"AR glasses" 品类位置 96.9 仍然偏高。原因：Meta/Xreal 在此品类的 AI 信号太强。</div>'
        '</div>'
        '<div class="card">'
        '<div class="card-title">Rokid AI Glasses Style — AI 智能型新品</div>'
        '<div class="four-col">'
        + stat("价格", "$279", "", "white")
        + stat("评分", "4.0★", "51 评价", "#22c55e")
        + '</div>'
        '<div class="narrative" style="margin-top:8px;">'
        '<p>• 38.5g 超轻（比 Meta 轻 22%）</p>'
        '<p>• 12MP Sony 镜头（4K）</p>'
        '<p>• ChatGPT + Gemini + DeepSeek</p>'
        '<p>• 12 小时续航</p>'
        '<p>• 支持处方镜片</p>'
        '</div>'
        '<div class="highlight-box" style="margin-top:8px;"><b>GEO 突破口</b>: 这是最接近 Meta Ray-Ban 的直接竞品（更轻、更便宜、多 AI 引擎）。Tom\'s Guide 已称其为 "best Meta Ray-Ban alternative"。建议聚焦此产品做 GEO 优化。</div>'
        '</div>'
        '</div>'
    )
    return page(h, "16")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 17: REVIEW THEMES
# ═══════════════════════════════════════════════════════════════════════════════
def page_reviews():
    h = (
        '<div class="tag tag-or" style="margin-bottom:10px;">评价分析</div>'
        '<div class="sec-title">评价主题分析 · 正面与负面</div>'
        '<div class="sec-sub">基于 636 条 Amazon 评价 + 媒体测评 + Trustpilot 反馈</div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card"><div class="card-title" style="color:#22c55e;">正面评价主题 TOP 5</div>'
        '<div style="margin-bottom:6px;"><span style="font-size:8pt;">沉浸式显示体验（Micro-OLED）</span><div class="bar-bg"><div class="bar-fill bar-gr" style="width:92%;"></div></div></div>'
        '<div style="margin-bottom:6px;"><span style="font-size:8pt;">舒适轻巧可长时间佩戴</span><div class="bar-bg"><div class="bar-fill bar-gr" style="width:87%;"></div></div></div>'
        '<div style="margin-bottom:6px;"><span style="font-size:8pt;">游戏体验出色（Steam Deck/PS5）</span><div class="bar-bg"><div class="bar-fill bar-gr" style="width:78%;"></div></div></div>'
        '<div style="margin-bottom:6px;"><span style="font-size:8pt;">USB-C 即插即用便捷</span><div class="bar-bg"><div class="bar-fill bar-gr" style="width:74%;"></div></div></div>'
        '<div style="margin-bottom:6px;"><span style="font-size:8pt;">AI 功能感觉未来感十足</span><div class="bar-bg"><div class="bar-fill bar-gr" style="width:65%;"></div></div></div>'
        '</div>'
        '<div class="card"><div class="card-title" style="color:#ef4444;">负面评价主题 TOP 5</div>'
        '<div style="margin-bottom:6px;"><span style="font-size:8pt;">客服差 — 邮件无人回复</span><div class="bar-bg"><div class="bar-fill bar-re" style="width:35%;"></div></div></div>'
        '<div style="margin-bottom:6px;"><span style="font-size:8pt;">镜框反光/户外光线泄漏</span><div class="bar-bg"><div class="bar-fill bar-re" style="width:28%;"></div></div></div>'
        '<div style="margin-bottom:6px;"><span style="font-size:8pt;">磁吸充电线容易丢失</span><div class="bar-bg"><div class="bar-fill bar-re" style="width:22%;"></div></div></div>'
        '<div style="margin-bottom:6px;"><span style="font-size:8pt;">重量宣传有误导（不含镜片）</span><div class="bar-bg"><div class="bar-fill bar-re" style="width:18%;"></div></div></div>'
        '<div style="margin-bottom:6px;"><span style="font-size:8pt;">部分手机兼容性问题</span><div class="bar-bg"><div class="bar-fill bar-re" style="width:15%;"></div></div></div>'
        '</div>'
        '</div>'
        '<div class="warn-box"><b>AI 影响分析</b>: 负面评价中"客服差"是最突出主题，Trustpilot 上也有类似投诉。AI 引擎在推荐时会将售后服务质量作为信任度信号。'
        '建议 Rokid 优先改善客服响应速度，并在 Amazon Q&A 中主动回应常见投诉。同时，YouTube 上有一条 "Rokid LIED to You! AI Glasses SCAM" 视频（5.7K 播放），虽然播放量不高但标题极端，可能影响 AI 情感分析。</div>'
    )
    return page(h, "17")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 18: YOUTUBE KOL
# ═══════════════════════════════════════════════════════════════════════════════
def page_youtube():
    h = (
        '<div class="tag tag-green" style="margin-bottom:10px;">YouTube 分析</div>'
        '<div class="sec-title">YouTube KOL 分析 · 8 位创作者</div>'
        '<div class="sec-sub">30 个视频 · 总播放 ~2,739,015 · 有头部 KOL 覆盖</div>'
        '<div class="three-col" style="margin-bottom:12px;">'
        + stat("视频总数", "30", "个视频")
        + stat("总播放量", "2.7M", "次播放")
        + stat("头部 KOL", "2", "iJustine + ShortCircuit")
        + '</div>'
        '<table style="margin-bottom:12px;">'
        '<tr><th>#</th><th>创作者</th><th>播放量</th><th>内容类型</th><th>评估</th></tr>'
        '<tr><td>1</td><td>iJustine</td><td style="font-weight:700;">350,583</td><td>评测推荐</td><td><span class="tag tag-green">头部</span></td></tr>'
        '<tr><td>2</td><td>ShortCircuit (LTT)</td><td style="font-weight:700;">323,721</td><td>评测</td><td><span class="tag tag-green">头部</span></td></tr>'
        '<tr><td>3</td><td>Booredatwork.com</td><td>322,552</td><td>评测</td><td><span class="tag tag-blue">中腰部</span></td></tr>'
        '<tr><td>4</td><td>Cas and Chary XR</td><td>216,279</td><td>对比测评</td><td><span class="tag tag-blue">中腰部</span></td></tr>'
        '<tr><td>5</td><td>ben\'s gadget reviews</td><td>207,104</td><td>评测</td><td><span class="tag tag-blue">中腰部</span></td></tr>'
        '<tr><td>6</td><td>CJKnowsTECH</td><td>199,593</td><td>评测</td><td><span class="tag tag-blue">中腰部</span></td></tr>'
        '<tr><td>7</td><td>Jake Randall</td><td>103,740</td><td>推荐</td><td><span class="tag tag-blue">中腰部</span></td></tr>'
        '<tr><td>8</td><td>TechMagnet</td><td>65,977</td><td>评测</td><td><span class="tag tag-muted">小众</span></td></tr>'
        '</table>'
        '<div class="good-box"><b>积极信号</b>: YouTube 覆盖是 Rokid 最强的渠道资产。iJustine（700万+粉）和 ShortCircuit/LTT 网络（1500万+粉）是消费电子领域的顶级 KOL。'
        '这些视频内容是 AI 训练数据的优质来源，但目前 AI 还没充分吸收——可能因为视频发布时间较新（2025-2026），AI 训练数据存在时滞。</div>'
        '<div class="warn-box"><b>风险提示</b>: "Rokid LIED to You! AI Glasses SCAM Controversy" (Jake Does Stuff, 5.7K播放) — 标题极端的负面视频，虽播放量低但可能被 AI 情感分析捕获。</div>'
    )
    return page(h, "18")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 19: REDDIT + TIKTOK
# ═══════════════════════════════════════════════════════════════════════════════
def page_reddit_tiktok():
    h = (
        '<div class="tag tag-blue" style="margin-bottom:10px;">社交平台</div>'
        '<div class="sec-title">Reddit + TikTok 分析</div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card">'
        '<div class="card-title">Reddit 社区分析</div>'
        '<div class="narrative">'
        '<p><b>估计帖数</b>: 20-40 条</p>'
        '<p><b>相关社区</b>: r/smartglasses, r/AR, r/augmentedreality, r/wearables</p>'
        '<p><b>情感分布</b>: 混合 — 技术面正面，客服面负面</p>'
        '</div>'
        '<div class="divider"></div>'
        '<div class="narrative">'
        '<p><b>讨论主题</b>:</p>'
        '<p>• Rokid Max 被视为"性价比之选"</p>'
        '<p>• 与 Meta Ray-Ban 的对比讨论较多</p>'
        '<p>• 客服投诉帖影响品牌信任度</p>'
        '<p>• 技术规格讨论（Micro-OLED、FOV）正面</p>'
        '</div>'
        '<div class="warn-box" style="margin-top:8px;"><b>差距</b>: Reddit 帖数远低于 Meta（数百条）和 Xreal（上百条）。AI 引擎将 Reddit 有机讨论视为"真实用户验证"信号。建议增加 5-10 条高质量有机讨论帖。</div>'
        '</div>'
        '<div class="card">'
        '<div class="card-title">TikTok 存在感评估</div>'
        '<div class="narrative">'
        '<p><b>官方账号</b>: @rokid_official</p>'
        '<p><b>粉丝数</b>: 3,200</p>'
        '<p><b>点赞数</b>: 3,300</p>'
        '</div>'
        '<div class="divider"></div>'
        '<div class="narrative">'
        '<p><b>竞品 TikTok 布局</b>:</p>'
        '<p>• <b>Meta Ray-Ban</b>: TikTok 营销先驱，大量 UGC</p>'
        '<p>• <b>Xreal</b>: 活跃官方账号</p>'
        '<p>• <b>Rokid</b>: 几乎无存在感（3.2K 粉）</p>'
        '</div>'
        '<div class="highlight-box" style="margin-top:8px;"><b>机会</b>: Rokid AI Glasses Style 支持直接录制 9:16 TikTok 格式视频。这是天然的 TikTok 内容创作工具——但品牌自身在 TikTok 上没有利用这一优势。</div>'
        '</div>'
        '</div>'
    )
    return page(h, "19")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 20: MEDIA COVERAGE
# ═══════════════════════════════════════════════════════════════════════════════
def page_media():
    h = (
        '<div class="tag tag-or" style="margin-bottom:10px;">媒体覆盖</div>'
        '<div class="sec-title">媒体覆盖分析 · 7 家已覆盖 / 4 家关键缺失</div>'
        '<div class="sec-sub">AI 推荐权重最高的 4 家平台全部缺失</div>'
        '<table style="margin-bottom:12px;">'
        '<tr><th>媒体</th><th>Meta Ray-Ban</th><th>Xreal</th><th>RayNeo</th><th>Rokid</th><th>AI 权重</th></tr>'
        '<tr><td style="font-weight:700;">Wirecutter</td><td style="color:#22c55e;">深度测评</td><td style="color:#ef4444;">无</td><td style="color:#ef4444;">无</td><td style="color:#ef4444;font-weight:700;">无</td><td style="color:#ef4444;">极高</td></tr>'
        '<tr><td style="font-weight:700;">CNET</td><td style="color:#22c55e;">多篇</td><td style="color:#22c55e;">有</td><td style="color:#ef4444;">无</td><td style="color:#ef4444;font-weight:700;">无</td><td style="color:#ef4444;">极高</td></tr>'
        '<tr><td style="font-weight:700;">The Verge</td><td style="color:#22c55e;">多篇</td><td style="color:#22c55e;">有</td><td style="color:#ef4444;">无</td><td style="color:#ef4444;font-weight:700;">无</td><td style="color:#ef4444;">极高</td></tr>'
        '<tr><td style="font-weight:700;">Consumer Reports</td><td style="color:#fbbf24;">提及</td><td style="color:#ef4444;">无</td><td style="color:#ef4444;">无</td><td style="color:#ef4444;font-weight:700;">无</td><td style="color:#fbbf24;">高</td></tr>'
        '<tr><td>Tom\'s Guide</td><td style="color:#22c55e;">多篇</td><td style="color:#22c55e;">有</td><td style="color:#fbbf24;">提及</td><td style="color:#22c55e;font-weight:700;">"best alternative"</td><td style="color:#fbbf24;">中高</td></tr>'
        '<tr><td>TechRadar</td><td style="color:#22c55e;">多篇</td><td style="color:#22c55e;">有</td><td style="color:#22c55e;">有</td><td style="color:#22c55e;font-weight:700;">预览+测评</td><td style="color:#fbbf24;">中</td></tr>'
        '<tr><td>Gizmodo</td><td style="color:#22c55e;">有</td><td style="color:#fbbf24;">提及</td><td style="color:#ef4444;">无</td><td style="color:#22c55e;font-weight:700;">深度测评</td><td style="color:#fbbf24;">中</td></tr>'
        '</table>'
        '<div class="warn-box"><b>核心差距</b>: Wirecutter、CNET、The Verge 是 AI 推荐消费电子产品时权重最高的三家媒体。Meta Ray-Ban 在三家全覆盖，Xreal 有 CNET + The Verge。'
        'Rokid 三家全部缺失。<b>这是 GEO Score 35 分（vs Meta 70+）的根本原因。</b></div>'
        '<div class="highlight-box"><b>突破路径</b>: 优先争取 CNET 测评收录（门槛低于 Wirecutter），以 Rokid AI Glasses Style ($279, "best Meta alternative" — Tom\'s Guide 已背书) 为投稿产品。预计单篇 CNET 测评可将 GEO Score 提升 8-12 分。</div>'
    )
    return page(h, "20")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 21: ACTION 1
# ═══════════════════════════════════════════════════════════════════════════════
def page_action1():
    h = (
        '<div class="tag tag-or" style="margin-bottom:10px;">行动计划</div>'
        '<div class="sec-title">行动一: CNET / The Verge 投稿</div>'
        '<div class="sec-sub">Tier-1 媒体突破 · 预估 GEO +8-12 分 · 最高 ROI 行动</div>'
        '<div class="step-row"><div class="step-num">1</div><div class="step-body">'
        '<div class="step-title">CNET 产品提交（Week 1-2）</div>'
        '<div class="step-desc">向 CNET 编辑团队提交 Rokid AI Glasses Style 测评申请。投稿角度："$279 的 AI 智能眼镜如何同时支持 ChatGPT、Gemini 和 DeepSeek — Meta Ray-Ban 做不到的事"。'
        '提供两副样品（一副带处方镜片、一副标准）。预算：$300 样品成本。</div>'
        '</div></div>'
        '<div class="step-row"><div class="step-num">2</div><div class="step-body">'
        '<div class="step-title">The Verge PR 通道（Week 2-4）</div>'
        '<div class="step-desc">通过 The Verge 的产品评测提交流程提交 AI Glasses Style。强调三个差异化点：'
        '(1) 开放 AI 生态（非 Meta 锁定）(2) 38.5g 全天佩戴 (3) $279 vs $299 价格优势。'
        '同时通过 LinkedIn 联系 The Verge 可穿戴设备编辑。</div>'
        '</div></div>'
        '<div class="step-row"><div class="step-num">3</div><div class="step-body">'
        '<div class="step-title">Wirecutter 长期跟进（Week 4-8）</div>'
        '<div class="step-desc">Wirecutter 审核周期最长。通过 wirecutter.com 产品提交表单提交。'
        '准备品牌 Media Kit：品牌故事（杭州→全球80国）、CES 2026 获奖、iJustine 背书、Tom\'s Guide 评价摘要。</div>'
        '</div></div>'
        '<div class="highlight-box"><b>预期 ROI</b>: CNET 收录 → GEO +8-12 分 | The Verge 收录 → GEO +10-15 分 | 总投入 $500-$1,000 | 预计回收周期 4-8 周</div>'
        '<div class="good-box"><b>投稿话术模板</b>:<br/>'
        'Subject: Pitch — $279 AI Glasses with ChatGPT + DeepSeek (Meta Ray-Ban Can\'t Do This)<br/><br/>'
        'Hi [Editor],<br/><br/>'
        'Rokid\'s AI Glasses Style ($279) is the only smart glasses that supports ChatGPT, Gemini, AND DeepSeek simultaneously — '
        'something Meta\'s $299 Ray-Ban can\'t do. At 38.5g, it\'s also 22% lighter. Tom\'s Guide called it "the best Meta Ray-Ban alternative." '
        'Happy to send samples for testing.</div>'
    )
    return page(h, "21")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 22: ACTION 2
# ═══════════════════════════════════════════════════════════════════════════════
def page_action2():
    h = (
        '<div class="tag tag-or" style="margin-bottom:10px;">行动计划</div>'
        '<div class="sec-title">行动二: FAQ Schema + 结构化数据</div>'
        '<div class="sec-sub">品牌官网优化 · 预估 GEO +3-5 分 · 2 周内可完成</div>'
        '<div class="narrative" style="margin-bottom:12px;">'
        '<p>FAQ Schema（结构化问答标记）让 AI 引擎能直接从品牌官网提取标准化答案。建议在 global.rokid.com 添加以下 10 组 FAQ：</p>'
        '</div>'
        '<table style="margin-bottom:12px;">'
        '<tr><th>#</th><th>问题</th><th>类型</th></tr>'
        '<tr><td>1</td><td>What AI assistants work with Rokid glasses?</td><td>核心差异化</td></tr>'
        '<tr><td>2</td><td>How does Rokid compare to Meta Ray-Ban?</td><td>竞品对比</td></tr>'
        '<tr><td>3</td><td>What is Micro-OLED display and why is it better?</td><td>技术解释</td></tr>'
        '<tr><td>4</td><td>Can I use Rokid glasses with prescription lenses?</td><td>使用场景</td></tr>'
        '<tr><td>5</td><td>Which Rokid glasses are best for gaming?</td><td>产品推荐</td></tr>'
        '<tr><td>6</td><td>How long does Rokid AI Glasses Style battery last?</td><td>规格问答</td></tr>'
        '<tr><td>7</td><td>Is Rokid compatible with iPhone and Android?</td><td>兼容性</td></tr>'
        '<tr><td>8</td><td>What is the difference between Rokid Max and Max 2?</td><td>产品对比</td></tr>'
        '<tr><td>9</td><td>Where is Rokid headquartered?</td><td>品牌透明</td></tr>'
        '<tr><td>10</td><td>Does Rokid offer warranty and customer support?</td><td>售后（回应投诉）</td></tr>'
        '</table>'
        '<div class="highlight-box"><b>实施方式</b>: 在 global.rokid.com 创建 /faq 页面，添加 JSON-LD Schema Markup。'
        '可使用 Avanti 平台的 FAQ Generator（avantia2a.com/faq-generator）一键生成 FAQ + JSON-LD 代码。预算：$0（自行实施）。</div>'
    )
    return page(h, "22")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 23: ACTION 3
# ═══════════════════════════════════════════════════════════════════════════════
def page_action3():
    h = (
        '<div class="tag tag-or" style="margin-bottom:10px;">行动计划</div>'
        '<div class="sec-title">行动三: Reddit 有机增长 + Amazon 优化</div>'
        '<div class="sec-sub">社交验证 + 产品信息完善</div>'
        '<div class="two-col">'
        '<div class="card"><div class="card-title">Reddit 有机增长策略</div>'
        '<div class="step-row"><div class="step-num">1</div><div class="step-body">'
        '<div class="step-title">播种期（Week 1-2）</div>'
        '<div class="step-desc">在 r/smartglasses 发布 "Rokid AI Style vs Meta Ray-Ban: 1个月使用对比" 长帖。'
        '在 r/AR 回答 "best AR glasses for gaming" 问题时自然提及 Rokid Max。</div>'
        '</div></div>'
        '<div class="step-row"><div class="step-num">2</div><div class="step-body">'
        '<div class="step-title">增长期（Week 3-6）</div>'
        '<div class="step-desc">邀请 3 名 Amazon 好评用户在 Reddit 分享体验。'
        '发布 "Why I switched from Meta Ray-Ban to Rokid" 真实用户故事帖。</div>'
        '</div></div>'
        '<div class="step-row"><div class="step-num">3</div><div class="step-body">'
        '<div class="step-title">维护期（Week 7-12）</div>'
        '<div class="step-desc">持续在相关讨论中提供有价值回答。'
        '目标：12 周内增加 10+ 条高质量有机讨论。</div>'
        '</div></div>'
        '<div style="font-size:7.5pt;color:var(--muted);">预算：$0（有机增长）· 预期效果：GEO +2-3 分</div>'
        '</div>'
        '<div class="card"><div class="card-title">Amazon Listing 优化</div>'
        '<div class="narrative">'
        '<p><b>A+ Content 升级</b>:</p>'
        '<p>• 添加 "vs Meta Ray-Ban" 对比模块</p>'
        '<p>• 添加 "多 AI 引擎" 差异化模块（ChatGPT + Gemini + DeepSeek）</p>'
        '<p>• 添加 CES 2026 获奖标识</p>'
        '</div>'
        '<div class="divider"></div>'
        '<div class="narrative">'
        '<p><b>Q&A 主动管理</b>:</p>'
        '<p>• 回应 "客服差" 投诉：展示改进措施</p>'
        '<p>• 回应 "重量误导" 质疑：标注含镜片重量</p>'
        '<p>• 添加兼容设备完整列表</p>'
        '</div>'
        '<div class="divider"></div>'
        '<div class="narrative">'
        '<p><b>评价提升计划</b>:</p>'
        '<p>• 当前 636 条 → 目标 1,000+ 条</p>'
        '<p>• Amazon Vine 邀请 + 包装内好评引导</p>'
        '</div>'
        '</div>'
        '</div>'
    )
    return page(h, "23")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE 24: ROI ROADMAP
# ═══════════════════════════════════════════════════════════════════════════════
def page_roi():
    h = (
        '<div class="tag tag-or" style="margin-bottom:10px;">ROI 路线图</div>'
        '<div class="sec-title">12 周 ROI 路线图 · GEO 35 → 55</div>'
        '<div class="sec-sub">分阶段执行 · 每 4 周评估 · 目标 20 分提升</div>'
        '<table style="margin-bottom:12px;">'
        '<tr><th>阶段</th><th>周期</th><th>核心行动</th><th>GEO 目标</th><th>增幅</th></tr>'
        '<tr><td style="color:var(--or);font-weight:700;">Phase 1</td><td>Week 1-4</td><td>CNET 投稿 + FAQ Schema + Amazon Q&A</td><td>42</td><td>+7</td></tr>'
        '<tr><td style="color:var(--or);font-weight:700;">Phase 2</td><td>Week 5-8</td><td>The Verge 跟进 + Reddit 5 帖 + TikTok 启动</td><td>49</td><td>+7</td></tr>'
        '<tr><td style="color:var(--or);font-weight:700;">Phase 3</td><td>Week 9-12</td><td>媒体测评发布 + Amazon 评价提升 + 品牌叙事统一</td><td>55</td><td>+6</td></tr>'
        '</table>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card"><div class="card-title">投入产出预算</div>'
        '<div class="narrative">'
        '<p><b>Phase 1</b>: $300-$500（样品成本）</p>'
        '<p><b>Phase 2</b>: $500-$1,000（TikTok 内容制作）</p>'
        '<p><b>Phase 3</b>: $200-$500（Amazon Vine + 官网优化）</p>'
        '<p style="font-weight:700;color:var(--or);margin-top:8px;">总投入: $1,000-$2,000</p>'
        '</div></div>'
        '<div class="card"><div class="card-title">关键里程碑</div>'
        '<div class="narrative">'
        '<p><b>Week 4</b>: GEO 42（进入改善区中段）</p>'
        '<p><b>Week 8</b>: GEO 49（接近竞争区下沿）</p>'
        '<p><b>Week 12</b>: GEO 55（进入竞争区）</p>'
        '<p style="color:var(--muted);font-size:7.5pt;margin-top:8px;">每阶段结束后进行一次完整 GEO 扫描（1,200 次查询）验证效果。</p>'
        '</div></div>'
        '</div>'
        '<div class="good-box"><b>长期目标</b>: 6 个月内达到 GEO 60-65（竞争区中段），与 Viture 拉开差距。12 个月内达到 GEO 70+，挑战 RayNeo 的位置。'
        '核心杠杆：补齐 Wirecutter/CNET/The Verge 覆盖 + 统一品牌叙事（聚焦 AI Glasses Style 作为旗舰）。</div>'
    )
    return page(h, "24")


# ═══════════════════════════════════════════════════════════════════════════════
# ASSEMBLE & OUTPUT
# ═══════════════════════════════════════════════════════════════════════════════
def main():
    pages = [
        page_cover(),       # 1
        page_toc(),         # 2
        page_ceo_brief(),   # 3
        page_cognitive_gap(), # 4
        page_geo_score(),   # 5
        page_score_factors(), # 6
        page_engine_overview(), # 7
        page_query_samples_1(), # 8 (NEW)
        page_query_samples_2(), # 9 (NEW)
        page_chatgpt(),     # 10
        page_gemini(),      # 11
        page_claude(),      # 12
        page_competitive(), # 13
        page_meta_vs_rokid(), # 14
        page_amazon(),      # 15
        page_flagships(),   # 16
        page_reviews(),     # 17
        page_youtube(),     # 18
        page_reddit_tiktok(), # 19
        page_media(),       # 20
        page_action1(),     # 21
        page_action2(),     # 22
        page_action3(),     # 23
        page_roi(),         # 24
    ]

    html = f"<!DOCTYPE html><html><head><meta charset='utf-8'/><style>{CSS}</style></head><body>{''.join(pages)}</body></html>"

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    html_path = OUTPUT_DIR / "rokid-ar-glasses-2026-03-31.html"
    pdf_path  = OUTPUT_DIR / "rokid-ar-glasses-2026-03-31.pdf"
    desktop_pdf = Path.home() / "Desktop" / "rokid-ar-glasses-2026-03-31.pdf"

    html_path.write_text(html, encoding="utf-8")
    print(f"HTML saved: {html_path}")

    # Generate PDF
    try:
        subprocess.run([
            "npx", "puppeteer-html-to-pdf",
            "--input", str(html_path),
            "--output", str(pdf_path),
            "--format", "A4",
            "--margin-top", "0",
            "--margin-right", "0",
            "--margin-bottom", "0",
            "--margin-left", "0",
        ], check=True, timeout=60, capture_output=True)
        print(f"PDF saved: {pdf_path}")
    except Exception:
        # Fallback: use Chrome/Chromium --print-to-pdf
        try:
            for chrome in [
                "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                "/Applications/Chromium.app/Contents/MacOS/Chromium",
            ]:
                if Path(chrome).exists():
                    subprocess.run([
                        chrome, "--headless", "--disable-gpu",
                        f"--print-to-pdf={pdf_path}",
                        "--no-pdf-header-footer",
                        str(html_path),
                    ], check=True, timeout=60, capture_output=True)
                    print(f"PDF saved: {pdf_path}")
                    break
        except Exception as e2:
            print(f"PDF generation failed: {e2}")
            print("You can open the HTML file in Chrome and print to PDF manually.")

    # Copy to Desktop
    if pdf_path.exists():
        import shutil
        shutil.copy2(pdf_path, desktop_pdf)
        print(f"Desktop copy: {desktop_pdf}")


if __name__ == "__main__":
    main()
