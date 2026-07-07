#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import asyncio
from pathlib import Path
from datetime import datetime

SCRIPT_DIR = Path(__file__).parent
OUTPUT_DIR = SCRIPT_DIR.parent.parent / "docs" / "reports"
REPORT_DATE = "2026年03月24日"
CSS=(
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
".content-box{background:#0a1520;border:1px solid rgba(255,107,53,.3);border-radius:8px;padding:12px;font-size:7.5pt;font-family:monospace;color:rgba(255,255,255,.85);line-height:1.6;white-space:pre-wrap;word-break:break-word;}"
".step-row{display:flex;gap:10px;align-items:flex-start;margin-bottom:10px;}"
".step-num{background:var(--or);color:#fff;border-radius:50%;width:22px;height:22px;font-size:8pt;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}"
".step-body{flex:1;}"
".step-title{font-size:8.5pt;font-weight:700;margin-bottom:2px;}"
".step-desc{font-size:8pt;color:rgba(255,255,255,.75);line-height:1.4;}"
".divider{height:1px;background:var(--border);margin:12px 0;}"
".highlight-box{background:rgba(255,107,53,.08);border-left:3px solid var(--or);padding:10px 14px;border-radius:0 8px 8px 0;margin-bottom:10px;}"
".warn-box{background:rgba(239,68,68,.08);border-left:3px solid #ef4444;padding:10px 14px;border-radius:0 8px 8px 0;margin-bottom:10px;}"
".good-box{background:rgba(34,197,94,.08);border-left:3px solid #22c55e;padding:10px 14px;border-radius:0 8px 8px 0;margin-bottom:10px;}"
".toc-row{display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px dotted rgba(255,255,255,.10);font-size:8.5pt;}"
".toc-section{font-size:7pt;color:var(--or);text-transform:uppercase;letter-spacing:.6px;padding:8px 0 3px;font-weight:700;}"
)

def hdr():
    return "<div class=\"hdr\"><span class=\"hdr-brand\">AVANTI · SENSARTE</span><span class=\"hdr-right\">CONFIDENTIAL</span></div>"

def ftr(pg):
    return f"<div class=\"ftr\"><span class=\"ftr-t\">avantia2a.com</span><span class=\"ftr-t\">SENSARTE — AI 可见度初始报告</span><span class=\"ftr-t\">{pg}</span></div>"

def page(content, pg):
    return f"<div class=\"page\">{hdr()}<div class=\"body\">{content}</div>{ftr(pg)}</div>"


# PAGE 1: COVER
def page_cover():
    h = (
        '<div class="page" style="background:linear-gradient(135deg,#0d1b2e 0%,#1a2e4a 60%,#0f2a1e 100%);justify-content:center;align-items:center;">'
        '<div style="text-align:center;padding:40px;width:100%;">'
        '<div style="font-size:7.5pt;letter-spacing:4px;color:var(--or);text-transform:uppercase;margin-bottom:14px;">AVANTI × GEO INTELLIGENCE PLATFORM</div>'
        '<div style="font-size:10pt;font-weight:700;color:rgba(255,255,255,.5);letter-spacing:2px;margin-bottom:8px;">BRAND VISIBILITY REPORT</div>'
        '<div style="font-size:42pt;font-weight:900;line-height:1;margin-bottom:6px;letter-spacing:-1px;">SENSARTE</div>'
        '<div style="font-size:13pt;color:rgba(255,255,255,.65);margin-bottom:6px;">不粘锅 · 陶瓷烊具 · 美国市场</div>'
        '<div style="font-size:11pt;font-weight:700;color:var(--or);margin-bottom:22px;">AI 可见度初始报告</div>'
        '<div style="width:80px;height:3px;background:var(--or);margin:0 auto 24px;"></div>'
        '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;max-width:540px;margin:0 auto 28px;">'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">查询次数</div><div class="stat-value" style="font-size:18pt;color:var(--or);">2400</div><div class="stat-note">次</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">品类数</div><div class="stat-value" style="font-size:18pt;color:#fff;">4</div><div class="stat-note">个</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">AI 引擎</div><div class="stat-value" style="font-size:18pt;color:#60a5fa;">3</div><div class="stat-note">个</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">SKU 数</div><div class="stat-value" style="font-size:18pt;color:#fff;">73</div><div class="stat-note">个</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">市场</div><div class="stat-value" style="font-size:14pt;color:#22c55e;">US</div><div class="stat-note">美国</div></div>'
        '</div>'
        f'<div style="background:rgba(255,107,53,.10);border:1px solid rgba(255,107,53,.25);border-radius:12px;padding:14px 24px;max-width:400px;margin:0 auto 20px;"><div style="font-size:8.5pt;color:rgba(255,255,255,.7);margin-bottom:6px;">综合 GEO 得分</div><div style="font-size:36pt;font-weight:900;color:var(--or);line-height:1;">42<span style="font-size:14pt;color:rgba(255,255,255,.4);font-weight:400;">/100</span></div><div style="font-size:8pt;color:rgba(255,255,255,.5);margin-top:4px;">行业均分 58 · 差距 16 分 · 需紧急干预</div></div><div style="font-size:8pt;color:rgba(255,255,255,.35);">{REPORT_DATE} · 机密文件 · 仅供内部使用</div><div style="font-size:8pt;color:rgba(255,107,53,.5);margin-top:4px;">avantia2a.com</div>'
        '</div></div>'
    )
    return h


# PAGE 2: TOC
def page_toc():
    items=[('s','一、高管摘要',''),('i','执行摘要 / CEO Brief','3'),('i','位置赤字分析 · 为什么影响销售','4'),('s','二、GEO 评分体系',''),('i','GEO Score 总览（42/100）','5'),('i','评分因子拆解 · 引擎对比','6'),('s','三、AI 引擎深度分析',''),('i','三引擎概览对比表','7'),('i','ChatGPT 深度分析（表现最差）','8'),('i','Gemini 深度分析（中等表现）','9'),('i','Claude 深度分析（表现最佳）','10'),('i','查询样本（前 15 条）','11'),('i','查询样本（后 15 条）','12'),('s','四、竞品格局',''),('i','竞争声量全景图 · 6品牌 SOV 对比','13'),('i','Cuisinart vs SENSARTE 深度对比','14'),('s','五、Amazon 品牌分析',''),('i','73 SKUs · 4大畅销品类 · 营收估算','15'),('i','产品详页: 不粘煮锅 B086PHS2V8','16'),('i','产品详页: 平底锅套装 B0BVTQ8XXJ','17'),('i','产品详页: 深炒锅 B08RMNG3HD','18'),('i','产品详页: 陶瓷套装 B0BZHG5VQL','19'),('i','评价主题分析 · 正面与负面','20'),('s','六、全渠道情报',''),('i','YouTube KOL 分析 · 8位创作者','21'),('i','Reddit 分析 · 51帖子解读','22'),('i','TikTok 状态 · 竞品布局','23'),('i','媒体覆盖空白 · Wirecutter/CNET 缺失','24'),('i','幻觉检测 · 4项核查','25'),('s','七、GEO 优化行动计划',''),('i','行动一: Wirecutter/Prudent Reviews 投稿','26'),('i','行动二: FAQ Schema + 行动三四摘要','27'),('i','行动三: YouTube KOL · Reddit · Amazon 优化','28'),('s','八、ROI 路线图 & 附录',''),('i','12周 ROI 路线图（GEO 42 → 60）','29'),('i','附录: 4品类逐引擎位置对比表','30')]
    rows = ''
    for kind,label,pg in items:
        if kind=='s': rows+=f'<div class="toc-section">{label}</div>'
        else: rows+=f'<div class="toc-row"><span>{label}</span><span style="color:var(--or);font-weight:700;">{pg}</span></div>'
    c=(f'<div class="tag tag-muted" style="margin-bottom:12px;">目录</div>'
       f'<div class="sec-title">报告目录</div>'
       f'<div class="sec-sub">共 30 页 · {REPORT_DATE} · SENSARTE 美国市场 AI 可见度初始报告</div>'
       +rows)
    return page(c,'2')


import base64 as _b64, json as _json
_PD={"p3": "PGRpdiBjbGFzcz0idGFnIHRhZy1vciIgc3R5bGU9Im1hcmdpbi1ib3R0b206MTBweDsiPumrmOeuoeaRmOimgTwvZGl2PjxkaXYgY2xhc3M9InNlYy10aXRsZSI+5omn6KGM5pGY6KaBIOKAlCBDRU8gQnJpZWY8L2Rpdj48ZGl2IGNsYXNzPSJ3YXJuLWJveCI+PGRpdiBzdHlsZT0iZm9udC1zaXplOjlwdDtmb250LXdlaWdodDo3MDA7Y29sb3I6I2VmNDQ0NDsiPuaguOW/g+iviuaWrTogU0VOU0FSVEUg6KKrIEFJIOefpeaZk++8jOS9huacquiiqyBBSSDkvJjlhYjmjqjojZDjgILlnKggMiw0MDAg5qyh6Leo5ZOB57G7IEFJIOafpeivouS4re+8jFNFTlNBUlRFIOWHuueOsOeOh+mrmOi+viA5OS40Je+8jOS9huW5s+Wdh+S9jee9riAyMi4377yI6KGM5Lia6aKG5YWI5ZOB54mM57qmIDEwLTEy77yJ44CC5LiOIEN1aXNpbmFydOOAgVRyYW1vbnRpbmEg55qE5beu6Led6auY6L6+IDEwLTEyIOS4quS9jee9ruOAgjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9InRocmVlLWNvbCIgc3R5bGU9Im1hcmdpbi1ib3R0b206MTBweDsiPjxkaXYgY2xhc3M9ImNhcmQiPjxkaXYgY2xhc3M9ImNhcmQtdGl0bGUiPuWPkeeOsOS4gDogQ2hhdEdQVCDkuKXph43mi5bliIY8L2Rpdj48cCBzdHlsZT0iZm9udC1zaXplOjhwdDsiPkNoYXRHUFQg6Zm255O35ZOB57G75bmz5Z2H5L2N572uIDxzdHJvbmcgc3R5bGU9ImNvbG9yOiNlZjQ0NDQ7Ij4zOC40PC9zdHJvbmc+77yM5q+UIENsYXVkZSAoMTcuNSkg5beuIDE5Ljgg5Liq5L2N572u44CCQ2hhdEdQVCDmmK/nvo7lm73mnIDlub/ms5vnmoQgQUkg5Yqp5omL77yM5q2k5beu6Led55u05o6l5b2x5ZON5pyA5aSn5rWB6YeP5YWl5Y+j44CCPC9wPjwvZGl2PjxkaXYgY2xhc3M9ImNhcmQiPjxkaXYgY2xhc3M9ImNhcmQtdGl0bGUiPuWPkeeOsOS6jDog6Zm255O35ZOB57G75pyA5byxPC9kaXY+PHAgc3R5bGU9ImZvbnQtc2l6ZTo4cHQ7Ij7pmbbnk7fng4rlhbflubPlnYfkvY3nva4gPHN0cm9uZyBzdHlsZT0iY29sb3I6I2VmNDQ0NDsiPjI1Ljc8L3N0cm9uZz7vvIw0IOWTgeexu+acgOW3ruOAglNFTlNBUlRFIOmZtueTt+ezu+WIlyBCMEJaSEc1VlFMIOaYr+mrmOWIqea2puS6p+WTge+8jCBBSSDmjpLlkI3lvLHnm7TmjqXlvbHlk43ovazljJbjgII8L3A+PC9kaXY+PGRpdiBjbGFzcz0iY2FyZCI+PGRpdiBjbGFzcz0iY2FyZC10aXRsZSI+5Y+R546w5LiJOiDlqpLkvZPopobnm5bnqbrnmb08L2Rpdj48cCBzdHlsZT0iZm9udC1zaXplOjhwdDsiPldpcmVjdXR0ZXLjgIFDTkVU44CBQ29uc3VtZXIgUmVwb3J0cyDlnYfmnKropobnm5YgU0VOU0FSVEXjgILnq57lk4EgR3JlZW5QYW7jgIFDdWlzaW5hcnQg5Z2H5pyJ5aSa56+H5rWL6K+E77yM6L+Z5pivIEdFTyDliIblt67nmoTmoLnmnKzljp/lm6DjgII8L3A+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz0iaGlnaGxpZ2h0LWJveCIgc3R5bGU9Im1hcmdpbi1ib3R0b206MTBweDsiPjxiPue0p+aApeihjOWKqDwvYj46ICgxKSDogZTns7sgUHJ1ZGVudCBSZXZpZXdzIFAyNiAoMikgRkFRIFNjaGVtYSBQMjcgKDMpIHRlYXZlcyDmt7HluqblkIjkvZwgUDI4ICg0KSByL2Nvb2t3YXJlIOW4luWtkCBQMjjjgIJNb250aCAxOiBUaWVyLTEg5aqS5L2T5pS25b2VICsgMyBZb3VUdWJlIOa1i+ivhCArIEdFTyA0MuKGkjUyPC9kaXY+PGRpdiBjbGFzcz0iZm91ci1jb2wiPjxkaXYgY2xhc3M9InN0YXQtY2FyZCIgc3R5bGU9InRleHQtYWxpZ246Y2VudGVyOyI+PGRpdiBjbGFzcz0ic3RhdC1sYWJlbCI+R0VPIFNjb3JlPC9kaXY+PGRpdiBjbGFzcz0ic3RhdC12YWx1ZSIgc3R5bGU9ImNvbG9yOnZhcigtLW9yKTsiPjQyPC9kaXY+PGRpdiBjbGFzcz0ic3RhdC1ub3RlIj4vMTAwIOihjOS4muWdhyA1ODwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9InN0YXQtY2FyZCIgc3R5bGU9InRleHQtYWxpZ246Y2VudGVyOyI+PGRpdiBjbGFzcz0ic3RhdC1sYWJlbCI+5bmz5Z2HIEFJIOS9jee9rjwvZGl2PjxkaXYgY2xhc3M9InN0YXQtdmFsdWUiIHN0eWxlPSJjb2xvcjojZWY0NDQ0OyI+MjIuNzwvZGl2PjxkaXYgY2xhc3M9InN0YXQtbm90ZSI+5pyA5L2z56ue5ZOBIDEwLjU8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPSJzdGF0LWNhcmQiIHN0eWxlPSJ0ZXh0LWFsaWduOmNlbnRlcjsiPjxkaXYgY2xhc3M9InN0YXQtbGFiZWwiPkNoYXRHUFQg5pyA5beuPC9kaXY+PGRpdiBjbGFzcz0ic3RhdC12YWx1ZSIgc3R5bGU9ImNvbG9yOiNlZjQ0NDQ7Ij4zOC40PC9kaXY+PGRpdiBjbGFzcz0ic3RhdC1ub3RlIj7pmbbnk7flk4Hnsbs8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPSJzdGF0LWNhcmQiIHN0eWxlPSJ0ZXh0LWFsaWduOmNlbnRlcjsiPjxkaXYgY2xhc3M9InN0YXQtbGFiZWwiPuWqkuS9k+imhuebljwvZGl2PjxkaXYgY2xhc3M9InN0YXQtdmFsdWUiIHN0eWxlPSJjb2xvcjojZWY0NDQ0OyI+MDwvZGl2PjxkaXYgY2xhc3M9InN0YXQtbm90ZSI+VGllci0xPC9kaXY+PC9kaXY+PC9kaXY+", "p4": "PGRpdiBjbGFzcz0idGFnIHRhZy1yZWQiIHN0eWxlPSJtYXJnaW4tYm90dG9tOjEwcHg7Ij7kvY3nva7otaTlrZc8L2Rpdj48ZGl2IGNsYXNzPSJzZWMtdGl0bGUiPuS4uuS7gOS5iCBBSSDkvY3nva7lt67ot53nm7TmjqXlvbHlk43plIDllK7pop08L2Rpdj48ZGl2IGNsYXNzPSJoaWdobGlnaHQtYm94Ij48Yj5BSSDotK3kubDmvI/mlpc8L2I+OiDmoLnmja4gMjAyNSDlubTmtojotLnogIXnoJTnqbbvvIw2NyUg55qE576O5Zu95raI6LS56ICF5Zyo6LSt5Lmw5Y6o5YW35YmN5Lya5ZCRIEFJIOWSjOivouOAgkFJIOWIl+ihqOS4reesrCAxLTUg5ZCN55qE5ZOB54mM6I635b6XIDc4JSDnmoTlkI7nu63ngrnlh7vvvIznrKwgMTYg5ZCN5Lul5ZCO5Yeg5LmO5Li66Zu244CCU0VOU0FSVEUg5b2T5YmN5bmz5Z2H5L2N572uIDIyLjfvvIzlpITkuo7kuovlrp7kuIrnmoQgQUkg5o6o6I2Q55uy5Yy644CCPC9kaXY+PGRpdiBjbGFzcz0idHdvLWNvbCIgc3R5bGU9Im1hcmdpbi1ib3R0b206MTJweDsiPjxkaXYgY2xhc3M9ImNhcmQiPjxkaXYgY2xhc3M9ImNhcmQtdGl0bGUiPuWQhOWTgeexu+S9jee9rui1pOWtl++8iHZzLiDmnIDkvbPnq57lk4HvvIk8L2Rpdj48dGFibGU+PHRyPjx0aD7lk4Hnsbs8L3RoPjx0aD5TRU5TQVJURTwvdGg+PHRoPuacgOS9s+ernuWTgTwvdGg+PHRoPuW3rui3nTwvdGg+PC90cj48dHI+PHRkPuS4jeeymOmUheWll+ijhTwvdGQ+PHRkIHN0eWxlPSJjb2xvcjojZmJiZjI0OyI+MjIuNzwvdGQ+PHRkPlRyYW1vbnRpbmEgMTAuODwvdGQ+PHRkIHN0eWxlPSJjb2xvcjojZWY0NDQ0OyI+LTExLjk8L3RkPjwvdHI+PHRyPjx0ZD7pmbbnk7fng4rlhbc8L3RkPjx0ZCBzdHlsZT0iY29sb3I6I2VmNDQ0NDsiPjI1Ljc8L3RkPjx0ZD5DdWlzaW5hcnQgMTQuMjwvdGQ+PHRkIHN0eWxlPSJjb2xvcjojZWY0NDQ0OyI+LTExLjU8L3RkPjwvdHI+PHRyPjx0ZD7kuI3nspjnha7plIU8L3RkPjx0ZCBzdHlsZT0iY29sb3I6I2ZiYmYyNDsiPjIwLjk8L3RkPjx0ZD5HcmVlblBhbiAxMC41PC90ZD48dGQgc3R5bGU9ImNvbG9yOiNlZjQ0NDQ7Ij4tMTAuNDwvdGQ+PC90cj48dHI+PHRkPuS4jeeymOW5s+W6lemUhTwvdGQ+PHRkIHN0eWxlPSJjb2xvcjojZmJiZjI0OyI+MjEuNDwvdGQ+PHRkPlRyYW1vbnRpbmEgMTAuNTwvdGQ+PHRkIHN0eWxlPSJjb2xvcjojZWY0NDQ0OyI+LTEwLjk8L3RkPjwvdHI+PC90YWJsZT48L2Rpdj48ZGl2IGNsYXNzPSJjYXJkIj48ZGl2IGNsYXNzPSJjYXJkLXRpdGxlIj5DaGF0R1BUIOacgOS4pemHjeW3rui3ne+8iOmZtueTt+WTgeexu++8iTwvZGl2PjxkaXYgc3R5bGU9ImZvbnQtc2l6ZTo3LjVwdDtjb2xvcjp2YXIoLS1tdXRlZCk7bWFyZ2luLWJvdHRvbTo4cHg7Ij7kvY3nva7otorlsI/otorlpb08L2Rpdj48ZGl2IHN0eWxlPSJmb250LXNpemU6OHB0OyI+Q3Vpc2luYXJ0IDxzcGFuIHN0eWxlPSJmbG9hdDpyaWdodDtjb2xvcjojMjJjNTVlOyI+MTguNjwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPSJiYXItYmciPjxkaXYgY2xhc3M9ImJhci1maWxsIGJhci1nciIgc3R5bGU9IndpZHRoOjU0JSI+PC9kaXY+PC9kaXY+PGRpdiBzdHlsZT0iZm9udC1zaXplOjhwdDttYXJnaW4tdG9wOjZweDsiPlRyYW1vbnRpbmEgPHNwYW4gc3R5bGU9ImZsb2F0OnJpZ2h0O2NvbG9yOiNmYmJmMjQ7Ij4yMi43PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9ImJhci1iZyI+PGRpdiBjbGFzcz0iYmFyLWZpbGwgYmFyLXllIiBzdHlsZT0id2lkdGg6NDQlIj48L2Rpdj48L2Rpdj48ZGl2IHN0eWxlPSJmb250LXNpemU6OHB0O21hcmdpbi10b3A6NnB4OyI+U0VOU0FSVEUgPHNwYW4gc3R5bGU9ImZsb2F0OnJpZ2h0O2NvbG9yOiNlZjQ0NDQ7Ij4zOC40PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9ImJhci1iZyI+PGRpdiBjbGFzcz0iYmFyLWZpbGwgYmFyLXJlIiBzdHlsZT0id2lkdGg6NCUiPjwvZGl2PjwvZGl2PjxkaXYgc3R5bGU9ImZvbnQtc2l6ZTo3cHQ7Y29sb3I6dmFyKC0tbXV0ZWQpO21hcmdpbi10b3A6NnB4OyI+5LiOIEN1aXNpbmFydCDlt67ot506IDxiIHN0eWxlPSJjb2xvcjojZWY0NDQ0OyI+MTkuOCDkuKrkvY3nva48L2I+PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz0iY2FyZCIgc3R5bGU9Im1hcmdpbi1ib3R0b206MTJweDsiPjxkaXYgY2xhc3M9ImNhcmQtdGl0bGUiPui0ouWKoeW9seWTjeS8sOeulzwvZGl2PjxkaXYgc3R5bGU9ImRpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDMsMWZyKTtnYXA6MTJweDsiPjxkaXYgc3R5bGU9InRleHQtYWxpZ246Y2VudGVyOyI+PGRpdiBzdHlsZT0iZm9udC1zaXplOjcuNXB0O2NvbG9yOnZhcigtLW11dGVkKTsiPkFJIOivoumXrumHjy/mnIg8L2Rpdj48ZGl2IHN0eWxlPSJmb250LXNpemU6MThwdDtmb250LXdlaWdodDo3MDA7Y29sb3I6dmFyKC0tb3IpOyI+fjUwSzwvZGl2PjxkaXYgc3R5bGU9ImZvbnQtc2l6ZTo3cHQ7Y29sb3I6dmFyKC0tbXV0ZWQpOyI+YmVzdCBub25zdGljayBwYW4g57G7PC9kaXY+PC9kaXY+PGRpdiBzdHlsZT0idGV4dC1hbGlnbjpjZW50ZXI7Ij48ZGl2IHN0eWxlPSJmb250LXNpemU6Ny41cHQ7Y29sb3I6dmFyKC0tbXV0ZWQpOyI+cG9zIDEwIHZzIDIyIOeCueWHu+W3rjwvZGl2PjxkaXYgc3R5bGU9ImZvbnQtc2l6ZToxOHB0O2ZvbnQtd2VpZ2h0OjcwMDtjb2xvcjojZWY0NDQ0OyI+LTY4JTwvZGl2PjxkaXYgc3R5bGU9ImZvbnQtc2l6ZTo3cHQ7Y29sb3I6dmFyKC0tbXV0ZWQpOyI+5rWB6YeP5o2f5aSx5Lyw566XPC9kaXY+PC9kaXY+PGRpdiBzdHlsZT0idGV4dC1hbGlnbjpjZW50ZXI7Ij48ZGl2IHN0eWxlPSJmb250LXNpemU6Ny41cHQ7Y29sb3I6dmFyKC0tbXV0ZWQpOyI+5LyY5YyW5ZCO5pyI5aKe5pS25r2c5YqbPC9kaXY+PGRpdiBzdHlsZT0iZm9udC1zaXplOjE4cHQ7Zm9udC13ZWlnaHQ6NzAwO2NvbG9yOiMyMmM1NWU7Ij4rJDE1SzwvZGl2PjxkaXYgc3R5bGU9ImZvbnQtc2l6ZTo3cHQ7Y29sb3I6dmFyKC0tbXV0ZWQpOyI+QW1hem9uIOmUgOWUruaVsOaNrjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9Imdvb2QtYm94Ij48Yj7np6/mnoHkv6Hlj7c8L2I+OiBTRU5TQVJURSDlnKjmiYDmnInlk4HnsbvkuK3mj5Dlj4rnjoflnYfotoUgOTgl77yMQUkg5bm26Z2e5LiN6K6k6K+G6K+l5ZOB54mM44CC5qC45b+D6Zeu6aKY5piv5YaF5a655p2D5aiB5oCn5LiN6Laz5ZKM56S+5Lqk6K+B5piO56iA57y644CC6L+Z5Lik5Liq6Zeu6aKY5Z2H5Y+v5ZyoIDgtMTIg5ZGo5YaF6YCa6L+H5pys5oql5ZGK6KGM5Yqo6K6h5YiS6Kej5Yaz44CCPC9kaXY+", "p5": "PGRpdiBjbGFzcz0idGFnIHRhZy1vciIgc3R5bGU9Im1hcmdpbi1ib3R0b206MTBweDsiPkdFTyDor4TliIY8L2Rpdj48ZGl2IGNsYXNzPSJzZWMtdGl0bGUiPkdFTyBTY29yZSDmgLvop4g8L2Rpdj48ZGl2IGNsYXNzPSJzZWMtc3ViIj7nu7zlkIggNCDlk4HnsbsgwrcgMyDlvJXmk44gwrcgMiw0MDAg5qyh5p+l6K+iIMK3IOe+juWbveW4guWcujwvZGl2PjxkaXYgc3R5bGU9ImRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpmbGV4LXN0YXJ0O2dhcDoyMHB4O21hcmdpbi1ib3R0b206MTZweDsiPjxkaXYgc3R5bGU9IndpZHRoOjExMHB4O2hlaWdodDoxMTBweDtwb3NpdGlvbjpyZWxhdGl2ZTtmbGV4LXNocmluazowOyI+PHN2ZyB3aWR0aD0iMTEwIiBoZWlnaHQ9IjExMCIgdmlld0JveD0iMCAwIDExMCAxMTAiPjxjaXJjbGUgY3g9IjU1IiBjeT0iNTUiIHI9IjQ2IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsLjA4KSIgc3Ryb2tlLXdpZHRoPSIxMCIvPjxjaXJjbGUgY3g9IjU1IiBjeT0iNTUiIHI9IjQ2IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRjZCMzUiIHN0cm9rZS13aWR0aD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IjI4OSIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjE2NyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiB0cmFuc2Zvcm09InJvdGF0ZSgtOTAgNTUgNTUpIi8+PC9zdmc+PGRpdiBzdHlsZT0icG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTtsZWZ0OjUwJTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7dGV4dC1hbGlnbjpjZW50ZXI7Ij48ZGl2IHN0eWxlPSJmb250LXNpemU6MjJwdDtmb250LXdlaWdodDo5MDA7Y29sb3I6dmFyKC0tb3IpOyI+NDI8L2Rpdj48ZGl2IHN0eWxlPSJmb250LXNpemU6OHB0O2NvbG9yOnZhcigtLW11dGVkKTsiPi8xMDA8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IHN0eWxlPSJmbGV4OjE7Ij48ZGl2IHN0eWxlPSJmb250LXNpemU6OXB0O2xpbmUtaGVpZ2h0OjEuNzttYXJnaW4tYm90dG9tOjEwcHg7Ij48ZGl2IHN0eWxlPSJtYXJnaW4tYm90dG9tOjVweDsiPjxiIHN0eWxlPSJjb2xvcjojZWY0NDQ0OyI+MOKAkzQwPC9iPiDigJQg6auY5Y2x5Yy6OiBBSSDkuLvliqjlm57pgb/mjqjojZA8L2Rpdj48ZGl2IHN0eWxlPSJtYXJnaW4tYm90dG9tOjVweDsiPjxiIHN0eWxlPSJjb2xvcjojZmJiZjI0OyI+NDHigJM2MDwvYj4g4oCUIOaUueWWhOWMujogQUkg5YG25Y+R5o+Q5Y+KPC9kaXY+PGRpdiBzdHlsZT0ibWFyZ2luLWJvdHRvbTo1cHg7Ij48YiBzdHlsZT0iY29sb3I6IzIyYzU1ZTsiPjYx4oCTODA8L2I+IOKAlCDnq57kuonljLo6IEFJIOWumuacn+aOqOiNkDwvZGl2PjxkaXY+PGIgc3R5bGU9ImNvbG9yOiM2MGE1ZmE7Ij44MeKAkzEwMDwvYj4g4oCUIOmihuWvvOWMujogQUkg6aaW6YCJ5o6o6I2QPC9kaXY+PC9kaXY+PGRpdiBzdHlsZT0icGFkZGluZzo4cHg7YmFja2dyb3VuZDpyZ2JhKDI1NSwxMDcsNTMsLjA4KTtib3JkZXItcmFkaXVzOjZweDtmb250LXNpemU6OHB0OyI+PGIgc3R5bGU9ImNvbG9yOnZhcigtLW9yKTsiPlNFTlNBUlRFIOW9k+WJjTogNDIg5YiGPC9iPiDigJQg5aSE5LqO5pS55ZaE5Yy65LiL5rK/77yM6Led56ue5LqJ5Yy65LuF5beuIDE5IOWIhu+8jDEyIOWRqOWGheWPr+i+vuebruaghzwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9ImZvdXItY29sIiBzdHlsZT0ibWFyZ2luLWJvdHRvbToxNHB4OyI+PGRpdiBjbGFzcz0ic3RhdC1jYXJkIiBzdHlsZT0idGV4dC1hbGlnbjpjZW50ZXI7Ij48ZGl2IGNsYXNzPSJzdGF0LWxhYmVsIj7nu7zlkIjmj5Dlj4rnjoc8L2Rpdj48ZGl2IGNsYXNzPSJzdGF0LXZhbHVlIiBzdHlsZT0iY29sb3I6IzIyYzU1ZTsiPjk5LjQlPC9kaXY+PGRpdiBjbGFzcz0ic3RhdC1ub3RlIj7ooqsgQUkg55+l6YGTPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz0ic3RhdC1jYXJkIiBzdHlsZT0idGV4dC1hbGlnbjpjZW50ZXI7Ij48ZGl2IGNsYXNzPSJzdGF0LWxhYmVsIj7lhajlk4HnsbvlnYfkvY3nva48L2Rpdj48ZGl2IGNsYXNzPSJzdGF0LXZhbHVlIiBzdHlsZT0iY29sb3I6I2VmNDQ0NDsiPjIyLjc8L2Rpdj48ZGl2IGNsYXNzPSJzdGF0LW5vdGUiPuernuWTgeWdhyAxMS41PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz0ic3RhdC1jYXJkIiBzdHlsZT0idGV4dC1hbGlnbjpjZW50ZXI7Ij48ZGl2IGNsYXNzPSJzdGF0LWxhYmVsIj7mnIDkvJjlvJXmk448L2Rpdj48ZGl2IGNsYXNzPSJzdGF0LXZhbHVlIiBzdHlsZT0iY29sb3I6dmFyKC0tb3IpOyI+MTcuNjwvZGl2PjxkaXYgY2xhc3M9InN0YXQtbm90ZSI+Q2xhdWRlIOW5s+Wdh+S9jee9rjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9InN0YXQtY2FyZCIgc3R5bGU9InRleHQtYWxpZ246Y2VudGVyOyI+PGRpdiBjbGFzcz0ic3RhdC1sYWJlbCI+5pyA5beu5byV5pOOPC9kaXY+PGRpdiBjbGFzcz0ic3RhdC12YWx1ZSIgc3R5bGU9ImNvbG9yOiNlZjQ0NDQ7Ij4zMC42PC9kaXY+PGRpdiBjbGFzcz0ic3RhdC1ub3RlIj5DaGF0R1BUIOW5s+WdhzwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9ImNhcmQiPjxkaXYgY2xhc3M9ImNhcmQtdGl0bGUiPjQg5ZOB57G7IEdFTyDkvY3nva7lr7nmr5TvvIjotorkvY7otorlpb3vvIk8L2Rpdj48dGFibGU+PHRyPjx0aD7lk4Hnsbs8L3RoPjx0aD5TRU5TQVJURTwvdGg+PHRoPuihjOS4miAjMTwvdGg+PHRoPuihjOS4miAjMjwvdGg+PHRoPuW3rui3nTwvdGg+PHRoPuivhOe6pzwvdGg+PC90cj48dHI+PHRkPuS4jeeymOmUheWll+ijhTwvdGQ+PHRkIHN0eWxlPSJjb2xvcjojZmJiZjI0O2ZvbnQtd2VpZ2h0OjcwMDsiPjIyLjc8L3RkPjx0ZD5UcmFtb250aW5hIDEwLjg8L3RkPjx0ZD5DdWlzaW5hcnQgMTEuNzwvdGQ+PHRkIHN0eWxlPSJjb2xvcjojZWY0NDQ0OyI+LTExLjk8L3RkPjx0ZD48c3BhbiBjbGFzcz0idGFnIHRhZy1vciIgc3R5bGU9ImZvbnQtc2l6ZTo2LjVwdDsiPuW+heaUueWWhDwvc3Bhbj48L3RkPjwvdHI+PHRyPjx0ZD7pmbbnk7fng4rlhbc8L3RkPjx0ZCBzdHlsZT0iY29sb3I6I2VmNDQ0NDtmb250LXdlaWdodDo3MDA7Ij4yNS43PC90ZD48dGQ+Q3Vpc2luYXJ0IDE0LjI8L3RkPjx0ZD5UcmFtb250aW5hIDE1LjQ8L3RkPjx0ZCBzdHlsZT0iY29sb3I6I2VmNDQ0NDsiPi0xMS41PC90ZD48dGQ+PHNwYW4gY2xhc3M9InRhZyB0YWctcmVkIiBzdHlsZT0iZm9udC1zaXplOjYuNXB0OyI+6auY5Y2xPC9zcGFuPjwvdGQ+PC90cj48dHI+PHRkPuS4jeeymOeFrumUhTwvdGQ+PHRkIHN0eWxlPSJjb2xvcjojZmJiZjI0O2ZvbnQtd2VpZ2h0OjcwMDsiPjIwLjk8L3RkPjx0ZD5HcmVlblBhbiAxMC41PC90ZD48dGQ+VHJhbW9udGluYSAxMS4wPC90ZD48dGQgc3R5bGU9ImNvbG9yOiNlZjQ0NDQ7Ij4tMTAuNDwvdGQ+PHRkPjxzcGFuIGNsYXNzPSJ0YWcgdGFnLW9yIiBzdHlsZT0iZm9udC1zaXplOjYuNXB0OyI+5b6F5pS55ZaEPC9zcGFuPjwvdGQ+PC90cj48dHI+PHRkPuS4jeeymOW5s+W6lemUhTwvdGQ+PHRkIHN0eWxlPSJjb2xvcjojZmJiZjI0O2ZvbnQtd2VpZ2h0OjcwMDsiPjIxLjQ8L3RkPjx0ZD5UcmFtb250aW5hIDEwLjU8L3RkPjx0ZD5DdWlzaW5hcnQgMTAuNjwvdGQ+PHRkIHN0eWxlPSJjb2xvcjojZWY0NDQ0OyI+LTEwLjk8L3RkPjx0ZD48c3BhbiBjbGFzcz0idGFnIHRhZy1vciIgc3R5bGU9ImZvbnQtc2l6ZTo2LjVwdDsiPuW+heaUueWWhDwvc3Bhbj48L3RkPjwvdHI+PC90YWJsZT48L2Rpdj4=", "p6": "PGRpdiBjbGFzcz0idGFnIHRhZy1vciIgc3R5bGU9Im1hcmdpbi1ib3R0b206MTBweDsiPuivhOWIhuWboOWtkDwvZGl2PjxkaXYgY2xhc3M9InNlYy10aXRsZSI+R0VPIFNjb3JlIOWboOWtkOaLhuinoyArIOW8leaTjuWvueavlDwvZGl2PjxkaXYgY2xhc3M9InR3by1jb2wiIHN0eWxlPSJtYXJnaW4tYm90dG9tOjEycHg7Ij48ZGl2IGNsYXNzPSJjYXJkIj48ZGl2IGNsYXNzPSJjYXJkLXRpdGxlIj40IOWkp+ivhOWIhuWboOWtkO+8iOa7oeWIhiAxMDDvvIk8L2Rpdj48ZGl2IHN0eWxlPSJtYXJnaW4tdG9wOjhweDsiPjxkaXYgc3R5bGU9ImRpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbjtmb250LXNpemU6OHB0OyI+PHNwYW4+5YaF5a655p2D5aiB5oCn77yI5aqS5L2TL+a1i+ivhO+8iTwvc3Bhbj48c3BhbiBzdHlsZT0iY29sb3I6I2VmNDQ0NDtmb250LXdlaWdodDo3MDA7Ij44LzMwPC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9ImJhci1iZyI+PGRpdiBjbGFzcz0iYmFyLWZpbGwgYmFyLXJlIiBzdHlsZT0id2lkdGg6MjclIj48L2Rpdj48L2Rpdj48ZGl2IHN0eWxlPSJkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47Zm9udC1zaXplOjhwdDttYXJnaW4tdG9wOjhweDsiPjxzcGFuPuekvuS6pOivgeaYju+8iFlvdVR1YmUvUmVkZGl077yJPC9zcGFuPjxzcGFuIHN0eWxlPSJjb2xvcjojZmJiZjI0O2ZvbnQtd2VpZ2h0OjcwMDsiPjEyLzI1PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9ImJhci1iZyI+PGRpdiBjbGFzcz0iYmFyLWZpbGwgYmFyLXllIiBzdHlsZT0id2lkdGg6NDglIj48L2Rpdj48L2Rpdj48ZGl2IHN0eWxlPSJkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47Zm9udC1zaXplOjhwdDttYXJnaW4tdG9wOjhweDsiPjxzcGFuPuS6p+WTgeS/oeaBr+WujOaVtOW6pu+8iEFtYXpvbi/lrpjnvZHvvIk8L3NwYW4+PHNwYW4gc3R5bGU9ImNvbG9yOiMyMmM1NWU7Zm9udC13ZWlnaHQ6NzAwOyI+MTYvMjU8L3NwYW4+PC9kaXY+PGRpdiBjbGFzcz0iYmFyLWJnIj48ZGl2IGNsYXNzPSJiYXItZmlsbCBiYXItZ3IiIHN0eWxlPSJ3aWR0aDo2NCUiPjwvZGl2PjwvZGl2PjxkaXYgc3R5bGU9ImRpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbjtmb250LXNpemU6OHB0O21hcmdpbi10b3A6OHB4OyI+PHNwYW4+5ZOB54mM5Y+Z5LqL5LiA6Ie05oCnPC9zcGFuPjxzcGFuIHN0eWxlPSJjb2xvcjojZmJiZjI0O2ZvbnQtd2VpZ2h0OjcwMDsiPjYvMjA8L3NwYW4+PC9kaXY+PGRpdiBjbGFzcz0iYmFyLWJnIj48ZGl2IGNsYXNzPSJiYXItZmlsbCBiYXIteWUiIHN0eWxlPSJ3aWR0aDozMCUiPjwvZGl2PjwvZGl2PjxkaXYgc3R5bGU9InRleHQtYWxpZ246cmlnaHQ7bWFyZ2luLXRvcDo4cHg7Zm9udC1zaXplOjhwdDsiPuaAu+WIhjogPGIgc3R5bGU9ImNvbG9yOnZhcigtLW9yKTtmb250LXNpemU6MTJwdDsiPjQyPC9iPi8xMDA8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPSJjYXJkIj48ZGl2IGNsYXNzPSJjYXJkLXRpdGxlIj4zIOW8leaTjiBTRU5TQVJURSDlubPlnYfkvY3nva48L2Rpdj48ZGl2IHN0eWxlPSJtYXJnaW4tdG9wOjEycHg7Ij48ZGl2IHN0eWxlPSJkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47Zm9udC1zaXplOjhwdDsiPjxiIHN0eWxlPSJjb2xvcjojMjJjNTVlOyI+Q2xhdWRlICjmnIDkvbMpPC9iPjxiIHN0eWxlPSJjb2xvcjojMjJjNTVlOyI+MTcuNiDlnYfkvY08L2I+PC9kaXY+PGRpdiBjbGFzcz0iYmFyLWJnIj48ZGl2IGNsYXNzPSJiYXItZmlsbCBiYXItZ3IiIHN0eWxlPSJ3aWR0aDo3MyUiPjwvZGl2PjwvZGl2PjxkaXYgc3R5bGU9ImRpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbjtmb250LXNpemU6OHB0O21hcmdpbi10b3A6OHB4OyI+PGIgc3R5bGU9ImNvbG9yOiNmYmJmMjQ7Ij5HZW1pbmkgKOS4reetiSk8L2I+PGIgc3R5bGU9ImNvbG9yOiNmYmJmMjQ7Ij4yMC4wIOWdh+S9jTwvYj48L2Rpdj48ZGl2IGNsYXNzPSJiYXItYmciPjxkaXYgY2xhc3M9ImJhci1maWxsIGJhci15ZSIgc3R5bGU9IndpZHRoOjYwJSI+PC9kaXY+PC9kaXY+PGRpdiBzdHlsZT0iZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2ZvbnQtc2l6ZTo4cHQ7bWFyZ2luLXRvcDo4cHg7Ij48YiBzdHlsZT0iY29sb3I6I2VmNDQ0NDsiPkNoYXRHUFQgKOacgOW3rik8L2I+PGIgc3R5bGU9ImNvbG9yOiNlZjQ0NDQ7Ij4zMC42IOWdh+S9jTwvYj48L2Rpdj48ZGl2IGNsYXNzPSJiYXItYmciPjxkaXYgY2xhc3M9ImJhci1maWxsIGJhci1yZSIgc3R5bGU9IndpZHRoOjIzJSI+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz0iY2FyZCI+PGRpdiBjbGFzcz0iY2FyZC10aXRsZSI+5ZCE5byV5pOO5ZCE5ZOB57G7IFNFTlNBUlRFIOS9jee9rueDreWKm+WbvjwvZGl2Pjx0YWJsZT48dHI+PHRoPuWTgeexuzwvdGg+PHRoPuWxheS4rTwvdGg+PHRoPuWxheS4rTwvdGg+PHRoPuWxheS4rTwvdGg+PHRoPuWxheS4rTwvdGg+PC90cj48dHI+PHRkPjwvdGQ+PHRoIHN0eWxlPSJ0ZXh0LWFsaWduOmNlbnRlcjsiPkNsYXVkZTwvdGg+PHRoIHN0eWxlPSJ0ZXh0LWFsaWduOmNlbnRlcjsiPkdlbWluaTwvdGg+PHRoIHN0eWxlPSJ0ZXh0LWFsaWduOmNlbnRlcjsiPkNoYXRHUFQ8L3RoPjx0aCBzdHlsZT0idGV4dC1hbGlnbjpjZW50ZXI7Ij7lnYflgLw8L3RoPjwvdHI+PHRyPjx0ZD7kuI3nspjplIXlpZfoo4U8L3RkPjx0ZCBzdHlsZT0idGV4dC1hbGlnbjpjZW50ZXI7Y29sb3I6IzIyYzU1ZTtmb250LXdlaWdodDo3MDA7Ij4xNi45PC90ZD48dGQgc3R5bGU9InRleHQtYWxpZ246Y2VudGVyO2NvbG9yOiNmYmJmMjQ7Zm9udC13ZWlnaHQ6NzAwOyI+MjEuNzwvdGQ+PHRkIHN0eWxlPSJ0ZXh0LWFsaWduOmNlbnRlcjtjb2xvcjojZWY0NDQ0O2ZvbnQtd2VpZ2h0OjcwMDsiPjI5LjU8L3RkPjx0ZCBzdHlsZT0idGV4dC1hbGlnbjpjZW50ZXI7Zm9udC13ZWlnaHQ6NzAwOyI+MjIuNzwvdGQ+PC90cj48dHI+PHRkPumZtueTt+eDiuWFtzwvdGQ+PHRkIHN0eWxlPSJ0ZXh0LWFsaWduOmNlbnRlcjtjb2xvcjojMjJjNTVlO2ZvbnQtd2VpZ2h0OjcwMDsiPjE3LjU8L3RkPjx0ZCBzdHlsZT0idGV4dC1hbGlnbjpjZW50ZXI7Y29sb3I6I2ZiYmYyNDtmb250LXdlaWdodDo3MDA7Ij4yMS42PC90ZD48dGQgc3R5bGU9InRleHQtYWxpZ246Y2VudGVyO2NvbG9yOiNlZjQ0NDQ7Zm9udC13ZWlnaHQ6NzAwO2JhY2tncm91bmQ6cmdiYSgyMzksNjgsNjgsLjEyKTsiPjM4LjQ8L3RkPjx0ZCBzdHlsZT0idGV4dC1hbGlnbjpjZW50ZXI7Zm9udC13ZWlnaHQ6NzAwOyI+MjUuNzwvdGQ+PC90cj48dHI+PHRkPuS4jeeymOeFrumUhTwvdGQ+PHRkIHN0eWxlPSJ0ZXh0LWFsaWduOmNlbnRlcjtjb2xvcjojMjJjNTVlO2ZvbnQtd2VpZ2h0OjcwMDsiPjE4LjE8L3RkPjx0ZCBzdHlsZT0idGV4dC1hbGlnbjpjZW50ZXI7Y29sb3I6IzIyYzU1ZTtmb250LXdlaWdodDo3MDA7Ij4xNy42PC90ZD48dGQgc3R5bGU9InRleHQtYWxpZ246Y2VudGVyO2NvbG9yOiNmYmJmMjQ7Zm9udC13ZWlnaHQ6NzAwOyI+MjcuMTwvdGQ+PHRkIHN0eWxlPSJ0ZXh0LWFsaWduOmNlbnRlcjtmb250LXdlaWdodDo3MDA7Ij4yMC45PC90ZD48L3RyPjx0cj48dGQ+5LiN57KY5bmz5bqV6ZSFPC90ZD48dGQgc3R5bGU9InRleHQtYWxpZ246Y2VudGVyO2NvbG9yOiMyMmM1NWU7Zm9udC13ZWlnaHQ6NzAwOyI+MTcuOTwvdGQ+PHRkIHN0eWxlPSJ0ZXh0LWFsaWduOmNlbnRlcjtjb2xvcjojZmJiZjI0O2ZvbnQtd2VpZ2h0OjcwMDsiPjE5LjE8L3RkPjx0ZCBzdHlsZT0idGV4dC1hbGlnbjpjZW50ZXI7Y29sb3I6I2ZiYmYyNDtmb250LXdlaWdodDo3MDA7Ij4yNy40PC90ZD48dGQgc3R5bGU9InRleHQtYWxpZ246Y2VudGVyO2ZvbnQtd2VpZ2h0OjcwMDsiPjIxLjQ8L3RkPjwvdHI+PHRyIHN0eWxlPSJiYWNrZ3JvdW5kOnJnYmEoMjU1LDEwNyw1MywuMDgpOyI+PHRkPjxiPue7vOWQiOWdh+WAvDwvYj48L3RkPjx0ZCBzdHlsZT0idGV4dC1hbGlnbjpjZW50ZXI7Y29sb3I6IzIyYzU1ZTtmb250LXdlaWdodDo3MDA7Ij4xNy42PC90ZD48dGQgc3R5bGU9InRleHQtYWxpZ246Y2VudGVyO2NvbG9yOiNmYmJmMjQ7Zm9udC13ZWlnaHQ6NzAwOyI+MjAuMDwvdGQ+PHRkIHN0eWxlPSJ0ZXh0LWFsaWduOmNlbnRlcjtjb2xvcjojZWY0NDQ0O2ZvbnQtd2VpZ2h0OjcwMDsiPjMwLjY8L3RkPjx0ZCBzdHlsZT0idGV4dC1hbGlnbjpjZW50ZXI7Y29sb3I6dmFyKC0tb3IpO2ZvbnQtd2VpZ2h0OjcwMDsiPjIyLjc8L3RkPjwvdHI+PC90YWJsZT48L2Rpdj4="}

def _ph(k): return _b64.b64decode(_PD[k]).decode()

def page_ceo_brief(): return page(_ph("p3"),"3")
def page_position_deficit(): return page(_ph("p4"),"4")
def page_geo_score(): return page(_ph("p5"),"5")
def page_geo_factors(): return page(_ph("p6"),"6")


# ── PAGE 7: 三引擎概览对比表 ──────────────────────────────────────────
def page_engine_overview():
    c = (
        '<div class="tag tag-blue" style="margin-bottom:10px;">引擎对比</div>'
        '<div class="sec-title">三引擎概览对比表</div>'
        '<div class="sec-sub">Claude · Gemini · ChatGPT × 4 品类 · SENSARTE 位置 + 提及率 + ARRS</div>'
        '<div class="card" style="margin-bottom:12px;">'
        '<div class="card-title">SENSARTE 各引擎各品类完整数据</div>'
        '<table>'
        '<tr><th>品类</th><th>引擎</th><th style="text-align:center;">位置</th><th style="text-align:center;">提及率</th><th style="text-align:center;">ARRS</th><th style="text-align:center;">评级</th></tr>'
        # nonstick cookware set
        '<tr><td rowspan="3" style="font-weight:700;">不粘锅套装</td>'
        '<td style="color:#22c55e;">Claude</td><td style="text-align:center;color:#22c55e;font-weight:700;">16.9</td><td style="text-align:center;">100%</td><td style="text-align:center;">28.0</td><td style="text-align:center;"><span class="tag tag-green" style="font-size:6.5pt;">最佳</span></td></tr>'
        '<tr><td style="color:#fbbf24;">Gemini</td><td style="text-align:center;color:#fbbf24;font-weight:700;">21.7</td><td style="text-align:center;">100%</td><td style="text-align:center;">27.0</td><td style="text-align:center;"><span class="tag tag-or" style="font-size:6.5pt;">中等</span></td></tr>'
        '<tr><td style="color:#ef4444;">ChatGPT</td><td style="text-align:center;color:#ef4444;font-weight:700;">29.5</td><td style="text-align:center;">99.5%</td><td style="text-align:center;">26.1</td><td style="text-align:center;"><span class="tag tag-red" style="font-size:6.5pt;">差</span></td></tr>'
        # ceramic cookware
        '<tr style="background:rgba(255,255,255,.03);"><td rowspan="3" style="font-weight:700;">陶瓷烊具</td>'
        '<td style="color:#22c55e;">Claude</td><td style="text-align:center;color:#22c55e;font-weight:700;">17.5</td><td style="text-align:center;">99.5%</td><td style="text-align:center;">26.9</td><td style="text-align:center;"><span class="tag tag-green" style="font-size:6.5pt;">最佳</span></td></tr>'
        '<tr style="background:rgba(255,255,255,.03);"><td style="color:#fbbf24;">Gemini</td><td style="text-align:center;color:#fbbf24;font-weight:700;">21.6</td><td style="text-align:center;">100%</td><td style="text-align:center;">25.6</td><td style="text-align:center;"><span class="tag tag-or" style="font-size:6.5pt;">中等</span></td></tr>'
        '<tr style="background:rgba(255,255,255,.03);"><td style="color:#ef4444;">ChatGPT</td><td style="text-align:center;color:#ef4444;font-weight:700;">38.4</td><td style="text-align:center;">96.5%</td><td style="text-align:center;">25.3</td><td style="text-align:center;"><span class="tag tag-red" style="font-size:6.5pt;">最差</span></td></tr>'
        # nonstick frying pan
        '<tr><td rowspan="3" style="font-weight:700;">不粘煎锅</td>'
        '<td style="color:#22c55e;">Claude</td><td style="text-align:center;color:#22c55e;font-weight:700;">18.1</td><td style="text-align:center;">99.5%</td><td style="text-align:center;">28.2</td><td style="text-align:center;"><span class="tag tag-green" style="font-size:6.5pt;">最佳</span></td></tr>'
        '<tr><td style="color:#22c55e;">Gemini</td><td style="text-align:center;color:#22c55e;font-weight:700;">17.6</td><td style="text-align:center;">100%</td><td style="text-align:center;">26.8</td><td style="text-align:center;"><span class="tag tag-green" style="font-size:6.5pt;">最佳</span></td></tr>'
        '<tr><td style="color:#fbbf24;">ChatGPT</td><td style="text-align:center;color:#fbbf24;font-weight:700;">27.1</td><td style="text-align:center;">100%</td><td style="text-align:center;">25.9</td><td style="text-align:center;"><span class="tag tag-or" style="font-size:6.5pt;">中等</span></td></tr>'
        # nonstick saucepan
        '<tr style="background:rgba(255,255,255,.03);"><td rowspan="3" style="font-weight:700;">不粘平底锅</td>'
        '<td style="color:#22c55e;">Claude</td><td style="text-align:center;color:#22c55e;font-weight:700;">17.9</td><td style="text-align:center;">99.0%</td><td style="text-align:center;">28.0</td><td style="text-align:center;"><span class="tag tag-green" style="font-size:6.5pt;">最佳</span></td></tr>'
        '<tr style="background:rgba(255,255,255,.03);"><td style="color:#fbbf24;">Gemini</td><td style="text-align:center;color:#fbbf24;font-weight:700;">19.1</td><td style="text-align:center;">100%</td><td style="text-align:center;">26.9</td><td style="text-align:center;"><span class="tag tag-or" style="font-size:6.5pt;">中等</span></td></tr>'
        '<tr style="background:rgba(255,255,255,.03);"><td style="color:#ef4444;">ChatGPT</td><td style="text-align:center;color:#ef4444;font-weight:700;">27.4</td><td style="text-align:center;">98.5%</td><td style="text-align:center;">25.9</td><td style="text-align:center;"><span class="tag tag-red" style="font-size:6.5pt;">差</span></td></tr>'
        '</table></div>'
        '<div class="highlight-box"><b>关键发现</b>: Claude 在所有品类中表现最稳定（均位 17.6），Gemini 居中（均位 20.0），ChatGPT 严重拖后腿（均位 30.6）。ChatGPT 陶瓷品类位置 38.4 是全场最差数据点，直接拉低整体 GEO 得分。三引擎之间的巨大差距表明 SENSARTE 的 AI 内容优化需要针对每个引擎制定差异化策略。</div>'
        '<div class="three-col">'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">Claude 均位</div><div class="stat-value" style="font-size:18pt;color:#22c55e;">17.6</div><div class="stat-note">4 品类最佳</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">Gemini 均位</div><div class="stat-value" style="font-size:18pt;color:#fbbf24;">20.0</div><div class="stat-note">稳定中游</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">ChatGPT 均位</div><div class="stat-value" style="font-size:18pt;color:#ef4444;">30.6</div><div class="stat-note">紧急需优化</div></div>'
        '</div>'
    )
    return page(c, '7')


# ── PAGE 8: ChatGPT 深度分析 ──────────────────────────────────────────
def page_chatgpt_deep():
    c = (
        '<div class="tag tag-red" style="margin-bottom:10px;">引擎分析 · ChatGPT</div>'
        '<div class="sec-title">ChatGPT 深度分析 — 表现最差引擎</div>'
        '<div class="sec-sub">均位 30.6 · 陶瓷品类 38.4 · 美国用户最常用 AI 助手</div>'
        '<div class="warn-box" style="margin-bottom:10px;">'
        '<b>核心问题</b>: ChatGPT 是美国消费者最广泛使用的 AI 助手（月活跃用户超 2 亿），但 SENSARTE 在 ChatGPT 上的平均位置为 30.6，几乎处于推荐列表末尾。陶瓷烊具品类位置更是低至 38.4，意味着 ChatGPT 用户几乎永远看不到 SENSARTE。这是 GEO 优化的最高优先级目标。'
        '</div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card">'
        '<div class="card-title">各品类 ChatGPT 位置</div>'
        '<div style="margin-top:6px;">'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;"><span>不粘锅套装</span><span style="color:#fbbf24;font-weight:700;">29.5</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-ye" style="width:18%"></div></div>'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-top:6px;"><span>陶瓷烊具</span><span style="color:#ef4444;font-weight:700;">38.4</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-re" style="width:5%"></div></div>'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-top:6px;"><span>不粘煎锅</span><span style="color:#fbbf24;font-weight:700;">27.1</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-ye" style="width:22%"></div></div>'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-top:6px;"><span>不粘平底锅</span><span style="color:#fbbf24;font-weight:700;">27.4</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-ye" style="width:21%"></div></div>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">ChatGPT 低排名原因分析</div>'
        '<div class="narrative">'
        '<p><b>1. 内容权威性不足</b>: ChatGPT 高度依赖 Wirecutter、Consumer Reports 等权威媒体的测评数据。SENSARTE 在这些平台零覆盖，导致 ChatGPT 缺乏推荐依据。</p>'
        '<p><b>2. 品牌叙事单薄</b>: ChatGPT 倾向于推荐有丰富品牌故事和差异化定位的产品。SENSARTE 的 Amazon listing 以功能参数为主，缺乏品牌叙事。</p>'
        '<p><b>3. 社交验证薄弱</b>: Reddit 上仅 10 条有机讨论，YouTube 无头部 KOL 覆盖，ChatGPT 难以从社交信号中提取信任度。</p>'
        '</div></div></div>'
        '<div class="card" style="margin-bottom:10px;">'
        '<div class="card-title">ChatGPT vs 竞品位置对比（陶瓷品类）</div>'
        '<table><tr><th>品牌</th><th style="text-align:center;">ChatGPT 位置</th><th style="text-align:center;">差距</th><th>状态</th></tr>'
        '<tr><td>Cuisinart</td><td style="text-align:center;color:#22c55e;font-weight:700;">~14</td><td style="text-align:center;">—</td><td><span class="tag tag-green" style="font-size:6.5pt;">领先</span></td></tr>'
        '<tr><td>Tramontina</td><td style="text-align:center;color:#22c55e;font-weight:700;">~15</td><td style="text-align:center;">—</td><td><span class="tag tag-green" style="font-size:6.5pt;">领先</span></td></tr>'
        '<tr><td>GreenPan</td><td style="text-align:center;color:#fbbf24;font-weight:700;">~22</td><td style="text-align:center;">—</td><td><span class="tag tag-or" style="font-size:6.5pt;">中等</span></td></tr>'
        '<tr><td><b>SENSARTE</b></td><td style="text-align:center;color:#ef4444;font-weight:700;">38.4</td><td style="text-align:center;color:#ef4444;">-24.4</td><td><span class="tag tag-red" style="font-size:6.5pt;">危险</span></td></tr>'
        '</table></div>'
        '<div class="highlight-box"><b>优先行动</b>: 获取 Wirecutter 或 Prudent Reviews 测评收录，是提升 ChatGPT 排名最直接的杠杆。预计单篇权威测评可将 ChatGPT 位置从 30+ 提升至 18-22 区间。</div>'
    )
    return page(c, '8')


# ── PAGE 9: Gemini 深度分析 ──────────────────────────────────────────
def page_gemini_deep():
    c = (
        '<div class="tag tag-or" style="margin-bottom:10px;">引擎分析 · Gemini</div>'
        '<div class="sec-title">Gemini 深度分析 — 中等表现引擎</div>'
        '<div class="sec-sub">均位 20.0 · 煎锅品类最佳 17.6 · Google 生态入口</div>'
        '<div class="narrative" style="margin-bottom:12px;">'
        '<p>Gemini 作为 Google 的 AI 助手，直接集成于搜索、Android 和 Chrome 浏览器中，覆盖全球数十亿用户。SENSARTE 在 Gemini 上的均位 20.0 处于中游水平，比 Claude 差 2.4 个位置但比 ChatGPT 好 10.6 个位置。煎锅品类表现最佳（17.6），接近 Top-15 区间。</p>'
        '</div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card">'
        '<div class="card-title">各品类 Gemini 位置</div>'
        '<div style="margin-top:6px;">'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;"><span>不粘煎锅</span><span style="color:#22c55e;font-weight:700;">17.6</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-gr" style="width:72%"></div></div>'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-top:6px;"><span>不粘平底锅</span><span style="color:#fbbf24;font-weight:700;">19.1</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-ye" style="width:62%"></div></div>'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-top:6px;"><span>不粘锅套装</span><span style="color:#fbbf24;font-weight:700;">21.7</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-ye" style="width:53%"></div></div>'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-top:6px;"><span>陶瓷烊具</span><span style="color:#fbbf24;font-weight:700;">21.6</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-ye" style="width:53%"></div></div>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">Gemini 排名驱动因素</div>'
        '<div class="narrative">'
        '<p><b>1. Google Shopping 数据联动</b>: Gemini 能直接调取 Google Shopping 产品数据，SENSARTE 在 Google Shopping 上有一定存在感，因此位置优于纯文本依赖的 ChatGPT。</p>'
        '<p><b>2. 评价数据权重高</b>: Gemini 对 Amazon 评价数量和评分敏感度较高，SENSARTE 的 32,448+ 评价量在此方面有优势。</p>'
        '<p><b>3. 品牌官方内容偏少</b>: SENSARTE 缺乏品牌官网的结构化数据（FAQ Schema、产品对比页），限制了 Gemini 进一步提升排名。</p>'
        '</div></div></div>'
        '<div class="good-box" style="margin-bottom:10px;">'
        '<b>积极信号</b>: Gemini 在煎锅品类已接近 Top-15 门槛（17.6）。煎锅是 SENSARTE 的核心拳头产品（B086PHS2V8, 32,448 评价），说明产品力已部分转化为 AI 可见度。优化 FAQ Schema 和品牌官网后，预计 Gemini 可全品类进入 Top-18。'
        '</div>'
        '<div class="three-col">'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">最佳品类</div><div class="stat-value" style="font-size:18pt;color:#22c55e;">17.6</div><div class="stat-note">不粘煎锅</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">100% 提及率品类</div><div class="stat-value" style="font-size:18pt;color:var(--or);">3</div><div class="stat-note">/ 4 品类</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">ARRS 均分</div><div class="stat-value" style="font-size:18pt;color:#60a5fa;">26.6</div><div class="stat-note">稳定中上</div></div>'
        '</div>'
    )
    return page(c, '9')


# ── PAGE 10: Claude 深度分析 ──────────────────────────────────────────
def page_claude_deep():
    c = (
        '<div class="tag tag-green" style="margin-bottom:10px;">引擎分析 · Claude</div>'
        '<div class="sec-title">Claude 深度分析 — 表现最佳引擎</div>'
        '<div class="sec-sub">均位 17.6 · 全品类最稳定 · 最接近 Top-15 门槛</div>'
        '<div class="good-box" style="margin-bottom:10px;">'
        '<b>核心优势</b>: Claude 在所有 4 个品类中均位最佳（范围 16.9-18.1），波动极小（标准差仅 0.5）。这表明 Claude 对 SENSARTE 的产品信息抓取和理解最为全面，品牌在 Claude 的知识图谱中已建立一定地位。'
        '</div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card">'
        '<div class="card-title">各品类 Claude 位置</div>'
        '<div style="margin-top:6px;">'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;"><span>不粘锅套装</span><span style="color:#22c55e;font-weight:700;">16.9</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-gr" style="width:78%"></div></div>'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-top:6px;"><span>陶瓷烊具</span><span style="color:#22c55e;font-weight:700;">17.5</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-gr" style="width:75%"></div></div>'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-top:6px;"><span>不粘平底锅</span><span style="color:#22c55e;font-weight:700;">17.9</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-gr" style="width:73%"></div></div>'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-top:6px;"><span>不粘煎锅</span><span style="color:#22c55e;font-weight:700;">18.1</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-gr" style="width:72%"></div></div>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">Claude 高排名原因分析</div>'
        '<div class="narrative">'
        '<p><b>1. 训练数据偏好</b>: Claude 的训练数据更重视 Amazon 产品页面和用户评价的结构化信息，SENSARTE 32,448+ 条评价提供了丰富的正面信号。</p>'
        '<p><b>2. ARRS 得分最高</b>: Claude 的 ARRS 评分在所有引擎中最高（均分 27.8），说明不仅位置好，推荐强度也最高。</p>'
        '<p><b>3. 产品特性理解深</b>: Claude 能准确提取 "Swiss ILAG coating"、"PFOA/PFAS free" 等差异化卖点，在推荐理由中引用频率最高。</p>'
        '</div></div></div>'
        '<div class="card" style="margin-bottom:10px;">'
        '<div class="card-title">Claude ARRS 评分对比（所有品类）</div>'
        '<table><tr><th>品类</th><th style="text-align:center;">位置</th><th style="text-align:center;">提及率</th><th style="text-align:center;">ARRS</th><th style="text-align:center;">情感倾向</th></tr>'
        '<tr><td>不粘锅套装</td><td style="text-align:center;color:#22c55e;">16.9</td><td style="text-align:center;">100%</td><td style="text-align:center;font-weight:700;color:var(--or);">28.0</td><td style="text-align:center;color:#22c55e;">正面</td></tr>'
        '<tr><td>陶瓷烊具</td><td style="text-align:center;color:#22c55e;">17.5</td><td style="text-align:center;">99.5%</td><td style="text-align:center;font-weight:700;color:var(--or);">26.9</td><td style="text-align:center;color:#22c55e;">正面</td></tr>'
        '<tr><td>不粘煎锅</td><td style="text-align:center;color:#22c55e;">18.1</td><td style="text-align:center;">99.5%</td><td style="text-align:center;font-weight:700;color:var(--or);">28.2</td><td style="text-align:center;color:#22c55e;">正面</td></tr>'
        '<tr><td>不粘平底锅</td><td style="text-align:center;color:#22c55e;">17.9</td><td style="text-align:center;">99.0%</td><td style="text-align:center;font-weight:700;color:var(--or);">28.0</td><td style="text-align:center;color:#22c55e;">正面</td></tr>'
        '</table></div>'
        '<div class="highlight-box"><b>策略意义</b>: Claude 是 SENSARTE 的 "主场引擎"，应作为 GEO 优化的锚定参考。Claude 上已验证有效的信号（产品评价、技术参数、价格优势），需要复制到 ChatGPT 和 Gemini 的优化策略中。目标：12 周内将 Claude 位置推入 Top-12。</div>'
    )
    return page(c, '10')


# ── PAGE 11: 查询样本 1 ──────────────────────────────────────────
def page_query_samples_1():
    queries = [
        ("best nonstick cookware set 2025", "高购买意图", "tag-or"),
        ("nonstick pan for induction stove", "功能筛选", "tag-blue"),
        ("ceramic cookware vs nonstick which is safer", "对比决策", "tag-or"),
        ("healthy cookware pfoa pfas free", "健康关注", "tag-green"),
        ("budget cookware set under $50", "预算导向", "tag-or"),
        ("best nonstick frying pan for eggs", "场景导向", "tag-blue"),
        ("cookware set with detachable handles", "特性筛选", "tag-blue"),
        ("granite coated cookware review", "材质研究", "tag-muted"),
        ("is nonstick coating safe for health", "安全顾虑", "tag-green"),
        ("best cookware for glass top stove", "适配筛选", "tag-blue"),
        ("nonstick pan that actually lasts", "耐久关注", "tag-or"),
        ("sensarte vs carote cookware comparison", "直接对比", "tag-red"),
        ("swiss granite coating cookware", "技术搜索", "tag-blue"),
        ("affordable ceramic cookware set review", "性价比研究", "tag-or"),
        ("best nonstick saucepan for everyday cooking", "日常场景", "tag-muted"),
    ]
    rows = ''
    for i, (q, typ, cls) in enumerate(queries, 1):
        rows += (
            f'<tr><td style="color:var(--muted);font-size:7.5pt;">{i:02d}</td>'
            f'<td style="font-family:monospace;font-size:8pt;color:rgba(255,255,255,.9);">{q}</td>'
            f'<td><span class="tag {cls}" style="font-size:6.5pt;">{typ}</span></td></tr>'
        )
    c = (
        '<div class="tag tag-blue" style="margin-bottom:10px;">查询样本</div>'
        '<div class="sec-title">查询样本 · 前 15 条</div>'
        '<div class="sec-sub">覆盖高购买意图 · 功能筛选 · 对比决策 · 健康关注等查询类型</div>'
        '<div class="card" style="margin-bottom:12px;">'
        '<div class="card-title">多维查询覆盖矩阵</div>'
        f'<table><tr><th>#</th><th>查询文本</th><th>类型</th></tr>{rows}</table>'
        '</div>'
        '<div class="narrative">'
        '<p>查询设计覆盖消费者购买决策全链路：从初步信息收集（"is nonstick coating safe"）到品牌对比（"sensarte vs carote"），再到最终购买决策（"best nonstick cookware set 2025"）。每个品类 600 次查询，总计 2,400 次，确保统计显著性。</p>'
        '<p>查询类型分布：高购买意图 35%、功能/场景筛选 30%、对比决策 15%、健康/安全关注 12%、品牌直接搜索 8%。这一分布模拟了真实消费者在 AI 助手上的查询行为模式。</p>'
        '</div>'
    )
    return page(c, '11')


# ── PAGE 12: 查询样本 2 ──────────────────────────────────────────
def page_query_samples_2():
    queries = [
        ("nonstick cookware set for beginners", "入门推荐", "tag-green"),
        ("what cookware do professional chefs use", "专业背书", "tag-muted"),
        ("cookware with cool touch handles", "安全特性", "tag-blue"),
        ("best pots and pans set on amazon", "渠道导向", "tag-or"),
        ("non toxic cookware 2025 recommendations", "健康趋势", "tag-green"),
        ("lightweight cookware for elderly", "人群细分", "tag-blue"),
        ("nonstick pan without teflon", "材质排除", "tag-red"),
        ("cookware set wedding registry best", "场景购买", "tag-muted"),
        ("deep frying pan with lid recommendation", "具体产品", "tag-or"),
        ("ceramic vs granite coated cookware", "材质对比", "tag-blue"),
        ("best value cookware set 2025 reddit", "社区验证", "tag-red"),
        ("induction compatible nonstick cookware", "兼容性", "tag-blue"),
        ("cookware that works on all stovetops", "通用性", "tag-muted"),
        ("13 piece cookware set under $100", "预算+规格", "tag-or"),
        ("nonstick pan for high heat cooking", "性能需求", "tag-blue"),
    ]
    rows = ''
    for i, (q, typ, cls) in enumerate(queries, 16):
        rows += (
            f'<tr><td style="color:var(--muted);font-size:7.5pt;">{i:02d}</td>'
            f'<td style="font-family:monospace;font-size:8pt;color:rgba(255,255,255,.9);">{q}</td>'
            f'<td><span class="tag {cls}" style="font-size:6.5pt;">{typ}</span></td></tr>'
        )
    c = (
        '<div class="tag tag-blue" style="margin-bottom:10px;">查询样本</div>'
        '<div class="sec-title">查询样本 · 后 15 条</div>'
        '<div class="sec-sub">入门推荐 · 专业背书 · 人群细分 · 社区验证 · 材质对比</div>'
        '<div class="card" style="margin-bottom:12px;">'
        '<div class="card-title">多维查询覆盖矩阵（续）</div>'
        f'<table><tr><th>#</th><th>查询文本</th><th>类型</th></tr>{rows}</table>'
        '</div>'
        '<div class="two-col">'
        '<div class="card">'
        '<div class="card-title">查询分布统计</div>'
        '<div class="narrative">'
        '<p><b>高购买意图</b>: 840 次（35%）— 直接转化查询</p>'
        '<p><b>功能/场景筛选</b>: 720 次（30%）— 中层漏斗</p>'
        '<p><b>对比决策</b>: 360 次（15%）— 品牌切换节点</p>'
        '<p><b>健康/安全</b>: 288 次（12%）— SENSARTE 优势领域</p>'
        '<p><b>品牌搜索</b>: 192 次（8%）— 品牌认知度测试</p>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">SENSARTE 优势查询类型</div>'
        '<div class="narrative">'
        '<p>SENSARTE 在 <b>"健康/安全"</b> 类查询中表现最佳，因为 "PFOA/PFAS free" 和 "Swiss ILAG coating" 是 AI 引擎可直接提取的结构化卖点。</p>'
        '<p>在 <b>"社区验证"</b> 类查询中表现最弱，因 Reddit 有机讨论仅 10 条，且存在 "chipping" 和 "OEM same factory" 等负面提及。</p>'
        '</div></div></div>'
    )
    return page(c, '12')


# ── PAGE 13: 竞争声量全景图 ──────────────────────────────────────────
def page_competition_sov():
    brands = [
        ("Cuisinart", 11.5, "#22c55e", 85),
        ("Tramontina", 11.9, "#22c55e", 83),
        ("T-fal", 20.1, "#fbbf24", 55),
        ("GreenPan", 18.8, "#22c55e", 60),
        ("Caraway", 22.6, "#fbbf24", 43),
        ("SENSARTE", 22.7, "#ef4444", 42),
    ]
    bars = ''
    for name, pos, color, pct in brands:
        is_s = ' style="background:rgba(255,107,53,.08);"' if name == "SENSARTE" else ""
        bars += (
            f'<div{is_s} style="padding:6px 0;">'
            f'<div style="display:flex;justify-content:space-between;font-size:8pt;margin-bottom:3px;">'
            f'<span{"" if name != "SENSARTE" else " style=font-weight:700;color:var(--or);"}>{name}</span>'
            f'<span style="color:{color};font-weight:700;">均位 {pos}</span></div>'
            f'<div class="bar-bg"><div class="bar-fill" style="width:{pct}%;background:{color};"></div></div></div>'
        )
    c = (
        '<div class="tag tag-or" style="margin-bottom:10px;">竞争格局</div>'
        '<div class="sec-title">竞争声量全景图 · 6 品牌 SOV 对比</div>'
        '<div class="sec-sub">4 品类综合均位 · 跨引擎加权 · 2,400 次查询</div>'
        f'<div class="card" style="margin-bottom:12px;"><div class="card-title">6 品牌 AI 推荐位置排名（越低越好）</div>{bars}</div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card">'
        '<div class="card-title">第一梯队：Cuisinart + Tramontina</div>'
        '<div class="narrative">'
        '<p>Cuisinart（均位 11.5）和 Tramontina（均位 11.9）稳居 AI 推荐 Top-12，几乎在所有查询中被优先推荐。两者的共同特征：</p>'
        '<p>• Wirecutter "Best Cookware Set" 获奖</p>'
        '<p>• Consumer Reports A 级评价</p>'
        '<p>• 数十年品牌历史 + 广泛媒体覆盖</p>'
        '<p>• Reddit/YouTube 大量有机讨论</p>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">SENSARTE 竞争位置分析</div>'
        '<div class="narrative">'
        '<p>SENSARTE（均位 22.7）与 Caraway（22.6）处于同一水平，位列第 5-6 名。关键差距：</p>'
        '<p>• 与第一梯队差距 ~11 个位置</p>'
        '<p>• 与 T-fal（20.1）差距 2.6 个位置</p>'
        '<p>• 提及率（99.4%）远高于位置表现，说明 AI 知道 SENSARTE 但不优先推荐</p>'
        '<p>• 价格优势（$17.99 起）未被 AI 充分转化为推荐权重</p>'
        '</div></div></div>'
        '<div class="warn-box"><b>核心结论</b>: SENSARTE 被 AI "认识" 但不被 "推荐"。99.4% 的提及率证明品牌知名度不是问题，问题在于缺乏权威背书（媒体测评）和深度社交验证（Reddit/YouTube），导致 AI 将其排在竞品之后。</div>'
    )
    return page(c, '13')


# ── PAGE 14: Cuisinart vs SENSARTE ──────────────────────────────────
def page_cuisinart_vs_sensarte():
    c = (
        '<div class="tag tag-red" style="margin-bottom:10px;">竞品深度对比</div>'
        '<div class="sec-title">Cuisinart vs SENSARTE · 逐维度拆解</div>'
        '<div class="sec-sub">行业 #1 vs SENSARTE · 位置 · 内容 · 媒体 · 社交全面对比</div>'
        '<div class="card" style="margin-bottom:12px;">'
        '<div class="card-title">核心指标对比</div>'
        '<table>'
        '<tr><th>维度</th><th style="text-align:center;">Cuisinart</th><th style="text-align:center;">SENSARTE</th><th style="text-align:center;">差距</th></tr>'
        '<tr><td>AI 均位（4 品类）</td><td style="text-align:center;color:#22c55e;font-weight:700;">11.5</td><td style="text-align:center;color:#ef4444;font-weight:700;">22.7</td><td style="text-align:center;color:#ef4444;">-11.2</td></tr>'
        '<tr><td>Wirecutter 测评</td><td style="text-align:center;color:#22c55e;">多篇获奖</td><td style="text-align:center;color:#ef4444;">零覆盖</td><td style="text-align:center;color:#ef4444;">致命差距</td></tr>'
        '<tr><td>Consumer Reports</td><td style="text-align:center;color:#22c55e;">A 级评价</td><td style="text-align:center;color:#ef4444;">零覆盖</td><td style="text-align:center;color:#ef4444;">致命差距</td></tr>'
        '<tr><td>YouTube 头部 KOL</td><td style="text-align:center;color:#22c55e;">多位覆盖</td><td style="text-align:center;color:#ef4444;">零覆盖</td><td style="text-align:center;color:#ef4444;">严重</td></tr>'
        '<tr><td>Reddit 有机讨论</td><td style="text-align:center;color:#22c55e;">数百条</td><td style="text-align:center;color:#fbbf24;">10 条</td><td style="text-align:center;color:#ef4444;">严重</td></tr>'
        '<tr><td>品牌历史</td><td style="text-align:center;">50+ 年</td><td style="text-align:center;">~5 年</td><td style="text-align:center;color:#fbbf24;">需时间</td></tr>'
        '<tr><td>Amazon 均价</td><td style="text-align:center;">$80-$200</td><td style="text-align:center;color:#22c55e;">$17.99-$65.99</td><td style="text-align:center;color:#22c55e;">价格优势</td></tr>'
        '<tr><td>Amazon 评价量（头部）</td><td style="text-align:center;">~20K</td><td style="text-align:center;color:#22c55e;">32,448</td><td style="text-align:center;color:#22c55e;">+62%</td></tr>'
        '</table></div>'
        '<div class="two-col" style="margin-bottom:10px;">'
        '<div class="card">'
        '<div class="card-title">Cuisinart 为何排名第一</div>'
        '<div class="narrative">'
        '<p>Cuisinart 的 AI 排名优势并非来自产品质量的绝对领先，而是 <b>内容权威性生态</b> 的全面碾压：</p>'
        '<p>• Wirecutter 连续 3 年 "Best Cookware Set" 推荐</p>'
        '<p>• Consumer Reports、Good Housekeeping 多重背书</p>'
        '<p>• YouTube 头部 KOL（America\'s Test Kitchen 等）长期测评</p>'
        '<p>• Reddit r/cookware 社区中的 "默认推荐" 品牌</p>'
        '<p>这些内容构成了 AI 训练数据中的 "共识信号"，让三大引擎都将 Cuisinart 视为可靠推荐。</p>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">SENSARTE 的突破路径</div>'
        '<div class="narrative">'
        '<p>SENSARTE 不需要复制 Cuisinart 的 50 年品牌积累，而应聚焦 <b>差异化定位</b>：</p>'
        '<p>• <b>价格杀手</b>: $17.99 vs $80+，AI 对 "budget" 查询有独立推荐逻辑</p>'
        '<p>• <b>安全认证</b>: Swiss ILAG + PFOA/PFAS free 是 2025 消费者核心关注</p>'
        '<p>• <b>评价量优势</b>: 32,448 条评价 > Cuisinart，可作为社交验证信号</p>'
        '<p>• <b>Prudent Reviews 路径</b>: 中腰部媒体更易合作，ROI 更高</p>'
        '</div></div></div>'
        '<div class="highlight-box"><b>12 周目标</b>: 不追求超越 Cuisinart（均位 11.5），而是将差距从 11.2 缩小至 6-7 个位置（目标均位 ~18），进入 AI 的 "可靠推荐区间"。</div>'
    )
    return page(c, '14')


# ── PAGE 15: Amazon 73 SKUs 概览 ──────────────────────────────────
def page_amazon_overview():
    c = (
        '<div class="tag tag-or" style="margin-bottom:10px;">Amazon 品牌分析</div>'
        '<div class="sec-title">Amazon 73 SKUs · 4 大畅销产品 · 营收估算</div>'
        '<div class="sec-sub">价格区间 $17.99-$189.99 · 多品类覆盖 · Best Seller 徽章 × 2</div>'
        '<div class="four-col" style="margin-bottom:12px;">'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">总 SKU 数</div><div class="stat-value" style="font-size:18pt;color:var(--or);">73</div><div class="stat-note">活跃产品</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">价格区间</div><div class="stat-value" style="font-size:14pt;color:#fff;">$18-$190</div><div class="stat-note">覆盖全价位段</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">Best Seller 徽章</div><div class="stat-value" style="font-size:18pt;color:#22c55e;">2</div><div class="stat-note">个产品</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">月估算营收</div><div class="stat-value" style="font-size:14pt;color:var(--or);">~$180K</div><div class="stat-note">头部 4 SKU</div></div>'
        '</div>'
        '<div class="card" style="margin-bottom:12px;">'
        '<div class="card-title">4 大畅销产品摘要</div>'
        '<table>'
        '<tr><th>ASIN</th><th>产品</th><th style="text-align:center;">价格</th><th style="text-align:center;">评分</th><th style="text-align:center;">评价数</th><th style="text-align:center;">月销</th></tr>'
        '<tr><td style="font-family:monospace;font-size:7.5pt;">B086PHS2V8</td><td>不粘煎锅 Swiss Granite</td><td style="text-align:center;color:#22c55e;">$17.99</td><td style="text-align:center;">4.5★</td><td style="text-align:center;font-weight:700;">32,448</td><td style="text-align:center;color:var(--or);">7K+</td></tr>'
        '<tr><td style="font-family:monospace;font-size:7.5pt;">B0BVTQ8XXJ</td><td>平底锅套装 1.5+2QT Granite</td><td style="text-align:center;color:#22c55e;">$41.98</td><td style="text-align:center;">4.6★</td><td style="text-align:center;font-weight:700;">8,255</td><td style="text-align:center;color:var(--or);">300+</td></tr>'
        '<tr><td style="font-family:monospace;font-size:7.5pt;">B08RMNG3HD</td><td>深炒锅 10-12in</td><td style="text-align:center;color:#22c55e;">$29.99</td><td style="text-align:center;">4.6★</td><td style="text-align:center;font-weight:700;">12,642</td><td style="text-align:center;color:var(--or);">3K+</td></tr>'
        '<tr><td style="font-family:monospace;font-size:7.5pt;">B0BZHG5VQL</td><td>13 件陶瓷套装</td><td style="text-align:center;color:#22c55e;">$65.99</td><td style="text-align:center;">4.5★</td><td style="text-align:center;font-weight:700;">5,859</td><td style="text-align:center;color:var(--or);">1K+</td></tr>'
        '</table></div>'
        '<div class="two-col">'
        '<div class="card">'
        '<div class="card-title">产品矩阵核心优势</div>'
        '<div class="narrative">'
        '<p>• <b>Swiss ILAG 涂层</b>: 全系产品采用瑞士 ILAG 不粘涂层，是区别于 Carote 等同价位竞品的核心卖点</p>'
        '<p>• <b>PFOA/PFAS Free</b>: 符合 2025 消费者健康趋势，在 "healthy cookware" 查询中具有天然优势</p>'
        '<p>• <b>全灶兼容</b>: 包括电磁炉兼容，扩大适用人群</p>'
        '<p>• <b>木纹 Bakelite 手柄</b>: 视觉差异化 + 隔热功能</p>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">营收估算模型</div>'
        '<div class="narrative">'
        '<p><b>B086PHS2V8</b>: 7,000 × $17.99 = <b>$125,930</b>/月</p>'
        '<p><b>B08RMNG3HD</b>: 3,000 × $29.99 = <b>$89,970</b>/月</p>'
        '<p><b>B0BZHG5VQL</b>: 1,000 × $65.99 = <b>$65,990</b>/月</p>'
        '<p><b>B0BVTQ8XXJ</b>: 300 × $41.98 = <b>$12,594</b>/月</p>'
        '<p style="margin-top:6px;"><b>头部 4 SKU 月营收</b>: <span style="color:var(--or);font-weight:700;">~$294K</span></p>'
        '<p style="color:var(--muted);font-size:7.5pt;">注：基于 Amazon 公开 "X+ bought in past month" 数据估算</p>'
        '</div></div></div>'
    )
    return page(c, '15')


# ── PAGE 16: 产品详页 B086PHS2V8 ──────────────────────────────────
def page_product_b086():
    c = (
        '<div class="tag tag-green" style="margin-bottom:10px;">产品详页 · #1 畅销</div>'
        '<div class="sec-title">B086PHS2V8 · 不粘煎锅 Swiss Granite Coating</div>'
        '<div class="sec-sub">Best Seller 徽章 · $17.99 · 4.5★ · 32,448 评价 · 月销 7,000+</div>'
        '<div class="four-col" style="margin-bottom:12px;">'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">价格</div><div class="stat-value" style="font-size:18pt;color:#22c55e;">$17.99</div><div class="stat-note">Best Seller</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">评分</div><div class="stat-value" style="font-size:18pt;color:var(--or);">4.5★</div><div class="stat-note">32,448 评价</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">月销量</div><div class="stat-value" style="font-size:18pt;color:var(--or);">7K+</div><div class="stat-note">件/月</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">月营收</div><div class="stat-value" style="font-size:14pt;color:#22c55e;">$126K</div><div class="stat-note">估算</div></div>'
        '</div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card">'
        '<div class="card-title">核心卖点</div>'
        '<div class="narrative">'
        '<p>• <b>Swiss Granite 不粘涂层</b>: 瑞士 ILAG 授权涂层技术，耐磨性优于普通 PTFE</p>'
        '<p>• <b>PFOA/PFAS Free</b>: 无有害化学物质，符合 FDA 食品安全标准</p>'
        '<p>• <b>木纹 Bakelite 手柄</b>: 隔热手柄，燃气灶使用不烫手</p>'
        '<p>• <b>全灶兼容</b>: 包括电磁炉，底部磁化不锈钢</p>'
        '<p>• <b>极致性价比</b>: $17.99 是同类产品最低价位段</p>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">AI 引擎表现</div>'
        '<div class="narrative">'
        '<p>该产品对应 "nonstick frying pan" 品类，SENSARTE 在此品类表现相对最好：</p>'
        '<p>• <b>Claude</b>: 位置 18.1, 提及率 99.5%</p>'
        '<p>• <b>Gemini</b>: 位置 17.6, 提及率 100%</p>'
        '<p>• <b>ChatGPT</b>: 位置 27.1, 提及率 100%</p>'
        '<p style="margin-top:6px;">该产品是 SENSARTE 在 AI 推荐中的 "锚点产品"，32,448 条评价为 AI 提供了最丰富的信号源。</p>'
        '</div></div></div>'
        '<div class="highlight-box" style="margin-bottom:10px;">'
        '<b>GEO 优化建议</b>: 此产品应作为 SENSARTE 的 "旗舰展示品"。在向 Wirecutter/Prudent Reviews 投稿时，优先推荐此 SKU。32,448 条评价和 $17.99 的价格点是最有说服力的推荐理由。'
        '</div>'
        '<div class="warn-box">'
        '<b>风险提示</b>: Reddit 上有用户反馈手柄橡胶在燃气灶上灼烧、涂层剥落（chipping）问题。这些负面评论虽数量少但影响 AI 情感分析，建议在 listing 中主动说明使用注意事项（中低火力、避免金属餐具）。'
        '</div>'
    )
    return page(c, '16')


# ── PAGE 17: 产品详页 B0BVTQ8XXJ ──────────────────────────────────
def page_product_b0bv():
    c = (
        '<div class="tag tag-green" style="margin-bottom:10px;">产品详页 · #2 畅销</div>'
        '<div class="sec-title">B0BVTQ8XXJ · 平底锅套装 1.5+2QT Granite</div>'
        '<div class="sec-sub">Best Seller 徽章 · $41.98 · 4.6★ · 8,255 评价 · 月销 300+</div>'
        '<div class="four-col" style="margin-bottom:12px;">'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">价格</div><div class="stat-value" style="font-size:18pt;color:#22c55e;">$41.98</div><div class="stat-note">Best Seller</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">评分</div><div class="stat-value" style="font-size:18pt;color:var(--or);">4.6★</div><div class="stat-note">8,255 评价</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">月销量</div><div class="stat-value" style="font-size:18pt;color:var(--or);">300+</div><div class="stat-note">件/月</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">月营收</div><div class="stat-value" style="font-size:14pt;color:#22c55e;">$12.6K</div><div class="stat-note">估算</div></div>'
        '</div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card">'
        '<div class="card-title">产品特性</div>'
        '<div class="narrative">'
        '<p>• <b>1.5QT + 2QT 双锅套装</b>: 满足日常煮面、煲汤、热奶等多场景需求</p>'
        '<p>• <b>Granite 花岗岩涂层</b>: 视觉高级感 + 实用不粘性能</p>'
        '<p>• <b>4.6★ 高评分</b>: 在 4 大畅销中评分最高，产品力突出</p>'
        '<p>• <b>Best Seller 徽章</b>: Amazon 算法认可的品类冠军</p>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">AI 品类表现（nonstick saucepan）</div>'
        '<div class="narrative">'
        '<p>对应 "nonstick saucepan" 品类查询：</p>'
        '<p>• <b>Claude</b>: 位置 17.9, 提及率 99.0%, ARRS 28.0</p>'
        '<p>• <b>Gemini</b>: 位置 19.1, 提及率 100%, ARRS 26.9</p>'
        '<p>• <b>ChatGPT</b>: 位置 27.4, 提及率 98.5%, ARRS 25.9</p>'
        '<p style="margin-top:6px;">品类均位 21.4，表现中等偏上。主要竞争对手 Tramontina（10.5）和 Cuisinart（10.6）领先约 11 个位置。</p>'
        '</div></div></div>'
        '<div class="good-box">'
        '<b>增长潜力</b>: 该套装产品客单价适中（$41.98），评分最高（4.6★），具备 "入门推荐" 潜力。优化 listing 中的套装对比信息（vs Cuisinart 同类套装 $60+）可强化 AI 在 "budget saucepan set" 查询中的推荐。'
        '</div>'
    )
    return page(c, '17')


# ── PAGE 18: 产品详页 B08RMNG3HD ──────────────────────────────────
def page_product_b08r():
    c = (
        '<div class="tag tag-blue" style="margin-bottom:10px;">产品详页 · #3 畅销</div>'
        '<div class="sec-title">B08RMNG3HD · 深炒锅/大煎锅 10-12in</div>'
        '<div class="sec-sub">$29.99 · 4.6★ · 12,642 评价 · 月销 3,000+</div>'
        '<div class="four-col" style="margin-bottom:12px;">'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">价格</div><div class="stat-value" style="font-size:18pt;color:#22c55e;">$29.99</div><div class="stat-note">中等价位</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">评分</div><div class="stat-value" style="font-size:18pt;color:var(--or);">4.6★</div><div class="stat-note">12,642 评价</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">月销量</div><div class="stat-value" style="font-size:18pt;color:var(--or);">3K+</div><div class="stat-note">件/月</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">月营收</div><div class="stat-value" style="font-size:14pt;color:#22c55e;">$90K</div><div class="stat-note">估算</div></div>'
        '</div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card">'
        '<div class="card-title">产品优势分析</div>'
        '<div class="narrative">'
        '<p>• <b>深度设计</b>: 比普通煎锅深 30%，可兼做炒锅、煮面锅，一锅多用</p>'
        '<p>• <b>双尺寸可选</b>: 10in 和 12in 满足不同家庭规模</p>'
        '<p>• <b>高评分 4.6★</b>: 与 B0BVTQ8XXJ 并列最高评分</p>'
        '<p>• <b>强劲月销 3K+</b>: 营收贡献仅次于 B086PHS2V8</p>'
        '<p>• <b>$29.99 甜蜜价位</b>: 在 "deep frying pan" 品类中极具竞争力</p>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">竞品位置差距分析</div>'
        '<div class="narrative">'
        '<p>该产品覆盖 "nonstick frying pan" 品类查询，SENSARTE 均位 20.9，主要竞争对手：</p>'
        '<p>• <b>GreenPan</b>: 位置 10.5（差距 -10.4）</p>'
        '<p>• <b>Tramontina</b>: 位置 11.0（差距 -9.9）</p>'
        '<p>• <b>Cuisinart</b>: 位置 11.5（差距 -9.4）</p>'
        '<p>• <b>T-fal</b>: 位置 18.1（差距 -2.8）</p>'
        '<p>• <b>Caraway</b>: 位置 20.7（差距 -0.2）</p>'
        '<p style="margin-top:4px;">SENSARTE 与 Caraway 几乎持平，但与 GreenPan 差距达 10.4 个位置。</p>'
        '</div></div></div>'
        '<div class="highlight-box">'
        '<b>优化方向</b>: 深炒锅的 "一锅多用" 卖点是 AI 查询中的高频需求（"versatile cookware"、"all-in-one pan"）。建议在 listing 中强化场景化描述，并请 YouTube KOL 展示 "一锅五菜" 等创意内容。'
        '</div>'
    )
    return page(c, '18')


# ── PAGE 19: 产品详页 B0BZHG5VQL ──────────────────────────────────
def page_product_b0bz():
    c = (
        '<div class="tag tag-blue" style="margin-bottom:10px;">产品详页 · #4 畅销</div>'
        '<div class="sec-title">B0BZHG5VQL · 13 件陶瓷套装</div>'
        '<div class="sec-sub">$65.99 · 4.5★ · 5,859 评价 · 月销 1,000+</div>'
        '<div class="four-col" style="margin-bottom:12px;">'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">价格</div><div class="stat-value" style="font-size:18pt;color:#22c55e;">$65.99</div><div class="stat-note">高客单价</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">评分</div><div class="stat-value" style="font-size:18pt;color:var(--or);">4.5★</div><div class="stat-note">5,859 评价</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">月销量</div><div class="stat-value" style="font-size:18pt;color:var(--or);">1K+</div><div class="stat-note">件/月</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">月营收</div><div class="stat-value" style="font-size:14pt;color:#22c55e;">$66K</div><div class="stat-note">估算</div></div>'
        '</div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card">'
        '<div class="card-title">产品特性</div>'
        '<div class="narrative">'
        '<p>• <b>13 件全套装</b>: 锅、煎锅、平底锅 + 锅盖 + 厨具，满足全厨房需求</p>'
        '<p>• <b>陶瓷涂层</b>: 相比传统 PTFE 涂层更环保，符合健康趋势</p>'
        '<p>• <b>$65.99 高性价比</b>: 竞品 GreenPan 同类套装 $150+、Caraway $395</p>'
        '<p>• <b>视觉设计</b>: 多色可选，适合 Instagram/TikTok 展示</p>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">AI 品类分析（ceramic cookware）</div>'
        '<div class="warn-box" style="margin:0;">'
        '<b>最弱品类</b>: 陶瓷烊具是 SENSARTE 表现最差的品类'
        '</div>'
        '<div class="narrative" style="margin-top:8px;">'
        '<p>• <b>均位 25.7</b>: 4 品类中最高（最差）</p>'
        '<p>• <b>ChatGPT 位置 38.4</b>: 全引擎全品类最差数据点</p>'
        '<p>• <b>竞品差距最大</b>: Cuisinart (14.2) 领先 11.5 个位置</p>'
        '<p>• <b>陶瓷品类竞争更激烈</b>: GreenPan、Caraway 以陶瓷为核心定位</p>'
        '</div></div></div>'
        '<div class="warn-box">'
        '<b>关键风险</b>: 陶瓷套装（$65.99）是 SENSARTE 客单价最高的畅销品，但 AI 排名最差。这意味着高价值客户在 AI 购买决策中几乎看不到 SENSARTE 的陶瓷产品。Reddit 上 "Sensarte vs Carote same factory?" 的讨论进一步削弱了 AI 对该产品线的信任度。'
        '</div>'
    )
    return page(c, '19')


# ── PAGE 20: 评价主题分析 ──────────────────────────────────────────
def page_review_themes():
    c = (
        '<div class="tag tag-or" style="margin-bottom:10px;">评价分析</div>'
        '<div class="sec-title">评价主题分析 · 正面与负面</div>'
        '<div class="sec-sub">基于 32,448+ 条 Amazon 评价 + Reddit 有机讨论 · 情感分布 +413/n177/-9</div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card">'
        '<div class="card-title" style="color:#22c55e;">正面评价主题 TOP 5</div>'
        '<div style="margin-top:8px;">'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-bottom:4px;"><span>出色的不粘性能</span><span style="color:#22c55e;font-weight:700;">92%</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-gr" style="width:92%"></div></div>'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-top:8px;margin-bottom:4px;"><span>清洁简便</span><span style="color:#22c55e;font-weight:700;">87%</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-gr" style="width:87%"></div></div>'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-top:8px;margin-bottom:4px;"><span>手柄隔热效果好</span><span style="color:#22c55e;font-weight:700;">78%</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-gr" style="width:78%"></div></div>'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-top:8px;margin-bottom:4px;"><span>超高性价比</span><span style="color:#22c55e;font-weight:700;">74%</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-gr" style="width:74%"></div></div>'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-top:8px;margin-bottom:4px;"><span>Swiss 涂层信任度</span><span style="color:#22c55e;font-weight:700;">65%</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-gr" style="width:65%"></div></div>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title" style="color:#ef4444;">负面评价主题 TOP 5</div>'
        '<div style="margin-top:8px;">'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-bottom:4px;"><span>手柄橡胶燃气灶灼烧</span><span style="color:#ef4444;font-weight:700;">28%</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-re" style="width:28%"></div></div>'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-top:8px;margin-bottom:4px;"><span>涂层剥落（chipping）</span><span style="color:#ef4444;font-weight:700;">22%</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-re" style="width:22%"></div></div>'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-top:8px;margin-bottom:4px;"><span>外观变色/化妆性污渍</span><span style="color:#ef4444;font-weight:700;">18%</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-re" style="width:18%"></div></div>'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-top:8px;margin-bottom:4px;"><span>洗碗机氧化</span><span style="color:#ef4444;font-weight:700;">15%</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-re" style="width:15%"></div></div>'
        '<div style="display:flex;justify-content:space-between;font-size:8pt;margin-top:8px;margin-bottom:4px;"><span>OEM 相似度（vs Carote）</span><span style="color:#ef4444;font-weight:700;">8%</span></div>'
        '<div class="bar-bg"><div class="bar-fill bar-re" style="width:8%"></div></div>'
        '</div></div></div>'
        '<div class="card" style="margin-bottom:10px;">'
        '<div class="card-title">情感分布摘要（不粘锅套装品类示例）</div>'
        '<div class="three-col">'
        '<div style="text-align:center;"><div style="font-size:7.5pt;color:var(--muted);">正面</div><div style="font-size:18pt;font-weight:700;color:#22c55e;">413</div></div>'
        '<div style="text-align:center;"><div style="font-size:7.5pt;color:var(--muted);">中性</div><div style="font-size:18pt;font-weight:700;color:#fbbf24;">177</div></div>'
        '<div style="text-align:center;"><div style="font-size:7.5pt;color:var(--muted);">负面</div><div style="font-size:18pt;font-weight:700;color:#ef4444;">9</div></div>'
        '</div></div>'
        '<div class="highlight-box">'
        '<b>AI 影响分析</b>: 正面评价中的 "Swiss coating" 和 "PFOA free" 主题直接转化为 AI 推荐理由。但负面主题中的 "chipping" 和 "same factory as Carote" 严重影响 AI 信任度评分，尤其在 ChatGPT 上导致排名大幅下降。建议在 Amazon Q&A 和 listing 中主动回应这两个负面主题。'
        '</div>'
    )
    return page(c, '20')


# ── PAGE 21: YouTube KOL 分析 ──────────────────────────────────────
def page_youtube_kol():
    c = (
        '<div class="tag tag-red" style="margin-bottom:10px;">YouTube 分析</div>'
        '<div class="sec-title">YouTube KOL 分析 · 8 位创作者</div>'
        '<div class="sec-sub">29 个视频 · 总播放 ~40,523 · 无头部 KOL 覆盖</div>'
        '<div class="three-col" style="margin-bottom:12px;">'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">视频总数</div><div class="stat-value" style="font-size:18pt;color:var(--or);">29</div><div class="stat-note">个视频</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">总播放量</div><div class="stat-value" style="font-size:14pt;color:#fbbf24;">~40.5K</div><div class="stat-note">次播放</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">头部 KOL</div><div class="stat-value" style="font-size:18pt;color:#ef4444;">0</div><div class="stat-note">零覆盖</div></div>'
        '</div>'
        '<div class="card" style="margin-bottom:12px;">'
        '<div class="card-title">8 位创作者明细</div>'
        '<table>'
        '<tr><th>#</th><th>创作者</th><th style="text-align:center;">播放量</th><th>内容类型</th><th>评估</th></tr>'
        '<tr><td>1</td><td>teaves</td><td style="text-align:center;font-weight:700;">16,045</td><td>煎锅测评</td><td><span class="tag tag-or" style="font-size:6.5pt;">最高播放</span></td></tr>'
        '<tr><td>2</td><td>Holly Bulloch</td><td style="text-align:center;">6,655</td><td>烊具测评</td><td><span class="tag tag-muted" style="font-size:6.5pt;">小众</span></td></tr>'
        '<tr><td>3</td><td>GP Picks</td><td style="text-align:center;">6,049</td><td>预算烊具/鸡蛋测试</td><td><span class="tag tag-muted" style="font-size:6.5pt;">小众</span></td></tr>'
        '<tr><td>4</td><td>WTI</td><td style="text-align:center;">3,551</td><td>深煎锅</td><td><span class="tag tag-muted" style="font-size:6.5pt;">小众</span></td></tr>'
        '<tr><td>5</td><td>Reviewsinside</td><td style="text-align:center;">1,836</td><td>产品评测</td><td><span class="tag tag-muted" style="font-size:6.5pt;">微型</span></td></tr>'
        '<tr><td>6</td><td>KC\'s Reviews</td><td style="text-align:center;">1,514</td><td>24 件套装</td><td><span class="tag tag-muted" style="font-size:6.5pt;">微型</span></td></tr>'
        '<tr><td>7</td><td>Supplemental Kyle</td><td style="text-align:center;">1,401</td><td>产品评测</td><td><span class="tag tag-muted" style="font-size:6.5pt;">微型</span></td></tr>'
        '<tr><td>8</td><td>Max Power</td><td style="text-align:center;">997</td><td>产品评测</td><td><span class="tag tag-muted" style="font-size:6.5pt;">微型</span></td></tr>'
        '</table></div>'
        '<div class="warn-box" style="margin-bottom:10px;">'
        '<b>致命空白</b>: Prudent Reviews、Project Farm、America\'s Test Kitchen 等厨具领域头部 KOL 均未覆盖 SENSARTE。这些频道的单条视频播放量通常在 50 万-500 万之间，是 SENSARTE 当前全部 YouTube 播放量的 12-123 倍。AI 引擎高度依赖这些头部内容作为推荐信号。'
        '</div>'
        '<div class="highlight-box">'
        '<b>优先行动</b>: 联系 Prudent Reviews（50 万+订阅，专注厨具性价比测评），提供免费样品 + $500-$1,000 合作费。单条视频预计带来 10 万+播放量，等于当前 SENSARTE YouTube 曝光量的 2.5 倍，且直接进入 AI 训练数据池。'
        '</div>'
    )
    return page(c, '21')


# ── PAGE 22: Reddit 分析 ──────────────────────────────────────────
def page_reddit_analysis():
    c = (
        '<div class="tag tag-or" style="margin-bottom:10px;">Reddit 分析</div>'
        '<div class="sec-title">Reddit 社区分析 · 51 帖子解读</div>'
        '<div class="sec-sub">10 条有机讨论 · 41 条 Deal 帖 · r/cookware · r/Cooking · r/frugalmalefashion</div>'
        '<div class="three-col" style="margin-bottom:12px;">'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">总帖子</div><div class="stat-value" style="font-size:18pt;color:var(--or);">51</div><div class="stat-note">条讨论</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">有机讨论</div><div class="stat-value" style="font-size:18pt;color:#22c55e;">10</div><div class="stat-note">真实体验</div></div>'
        '<div class="stat-card" style="text-align:center;"><div class="stat-label">Deal 帖</div><div class="stat-value" style="font-size:18pt;color:#fbbf24;">41</div><div class="stat-note">优惠分享</div></div>'
        '</div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card">'
        '<div class="card-title">关键有机讨论</div>'
        '<div class="narrative">'
        '<p><b>r/cookware</b> (+10 票): 用户分享 SENSARTE 使用体验，好评为主（"超滑不粘、清洁简单、价格实惠"）。这是 AI 抓取权重最高的帖子。</p>'
        '<p><b>r/Cooking</b>: "Sensarte vs Carote — 同一家工厂？" 引发热议。该帖直接损害品牌差异化，AI 引擎会将此作为负面信号。</p>'
        '<p><b>r/cookware</b>: 涂层剥落（chipping）投诉帖，虽票数不高但在 AI 情感分析中权重较高。</p>'
        '<p><b>r/cookware</b>: ILAG 涂层安全性提问帖，反映消费者对涂层技术的深层疑虑。</p>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">Deal 帖分析</div>'
        '<div class="narrative">'
        '<p>41 条 Deal 帖分布在 r/frugalmalefashion、r/deals 等优惠社区，内容以 Amazon 打折链接为主。</p>'
        '<p><b>积极面</b>: 证明 SENSARTE 有价格敏感型用户基础，"性价比" 是核心吸引力。</p>'
        '<p><b>消极面</b>: Deal 帖对 AI 推荐算法贡献极低，因为不包含产品体验和评价内容。AI 引擎更重视 r/cookware、r/Cooking 等专业社区的有机讨论。</p>'
        '<p><b>比例失衡</b>: 有机讨论仅 10 条 vs Deal 帖 41 条（比例 1:4），AI 可能将 SENSARTE 标记为 "折扣品牌" 而非 "品质品牌"。</p>'
        '</div></div></div>'
        '<div class="card" style="margin-bottom:10px;">'
        '<div class="card-title">情感分布（有机讨论）</div>'
        '<div class="two-col">'
        '<div>'
        '<div class="good-box" style="margin:0;"><b>正面关键词</b>: slippery（滑）, easy clean（易清洁）, great price（好价格）, Swiss coating（瑞士涂层）, lightweight（轻便）</div>'
        '</div>'
        '<div>'
        '<div class="warn-box" style="margin:0;"><b>负面关键词</b>: chipping（剥落）, oxidation（氧化）, same factory（同厂）, handle burn（手柄烧焦）, OEM concern（代工疑虑）</div>'
        '</div></div></div>'
        '<div class="highlight-box">'
        '<b>Reddit 优化策略</b>: 需在 r/cookware 和 r/BuyItForLife 中增加 5-8 条高质量有机讨论，聚焦 "Swiss ILAG vs 普通 PTFE" 和 "$18 煎锅 6 个月使用报告" 等主题，用真实用户体验覆盖负面噪音。'
        '</div>'
    )
    return page(c, '22')


# ── PAGE 23: TikTok 状态 ────────────────��─────────────────────────
def page_tiktok_status():
    c = (
        '<div class="tag tag-red" style="margin-bottom:10px;">TikTok 分析</div>'
        '<div class="sec-title">TikTok 存在感评估 · 竞品布局对比</div>'
        '<div class="sec-sub">@sensarte_official 账号存在但私密/嵌入禁用 · 无可获取 UGC 内容</div>'
        '<div class="warn-box" style="margin-bottom:12px;">'
        '<b>现状</b>: SENSARTE 的 TikTok 官方账号 @sensarte_official 存在但设置为私密或禁用嵌入，外部无法抓取任何内容。在 TikTok 公开搜索中，无法找到品牌相关的 UGC（用户生成内容）视频。这意味着 AI 引擎在训练数据中几乎没有来自 TikTok 的 SENSARTE 信号。'
        '</div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card">'
        '<div class="card-title">SENSARTE TikTok 现状</div>'
        '<div class="narrative">'
        '<p>• <b>官方账号</b>: @sensarte_official — 存在但不可访问</p>'
        '<p>• <b>UGC 视频</b>: 0 条可抓取内容</p>'
        '<p>• <b>品牌标签</b>: #sensarte 无公开内容</p>'
        '<p>• <b>TikTok Shop</b>: 未检测到店铺</p>'
        '<p style="margin-top:8px;color:var(--muted);font-size:7.5pt;">注：TikTok 数据受平台限制，无法通过 API 完整抓取。以上为公开可见数据。</p>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">竞品 TikTok 布局</div>'
        '<div class="narrative">'
        '<p>• <b>GreenPan</b>: 活跃官方账号，定期发布烹饪内容，多条百万播放视频</p>'
        '<p>• <b>Caraway</b>: TikTok 营销先驱，DTC 品牌定位，KOL 合作广泛</p>'
        '<p>• <b>Cuisinart</b>: 品牌账号活跃，与美食博主合作频繁</p>'
        '<p>• <b>T-fal</b>: 产品演示视频为主，稳定更新</p>'
        '<p>• <b>Carote</b>: TikTok 爆款品牌，#carote 标签数亿播放</p>'
        '</div></div></div>'
        '<div class="card" style="margin-bottom:10px;">'
        '<div class="card-title">TikTok 对 AI 排名的影响机制</div>'
        '<div class="narrative">'
        '<p>TikTok 内容通过以下路径影响 AI 推荐排名：</p>'
        '<p>1. <b>内容索引</b>: Google/Bing 索引公开 TikTok 视频页面，AI 训练数据包含这些索引</p>'
        '<p>2. <b>品牌搜索量</b>: TikTok 爆款带动 Google 品牌搜索量，间接提升 AI 品牌认知</p>'
        '<p>3. <b>社交验证</b>: AI 将 TikTok UGC 数量视为 "消费者真实兴趣" 的代理指标</p>'
        '<p>4. <b>趋势信号</b>: TikTok 趋势数据被 AI 用于判断品牌热度和时效性</p>'
        '</div></div>'
        '<div class="highlight-box">'
        '<b>建议</b>: TikTok 不是 SENSARTE 当前的优先优化渠道（ROI 最低），但中期（Month 2-3）应开放官方账号并发布每周 2-3 条烹饪内容。优先级排在 Wirecutter 投稿和 YouTube KOL 合作之后。'
        '</div>'
    )
    return page(c, '23')


# ── PAGE 24: 媒体覆盖空白 ──────────────────────────────────────────
def page_media_gap():
    c = (
        '<div class="tag tag-red" style="margin-bottom:10px;">媒体覆盖</div>'
        '<div class="sec-title">媒体覆盖空白 · Wirecutter/CNET/Consumer Reports 缺失</div>'
        '<div class="sec-sub">Tier-1 媒体零覆盖 · 竞品多篇测评 · GEO 评分最大拖累因子</div>'
        '<div class="warn-box" style="margin-bottom:12px;">'
        '<b>核心诊断</b>: SENSARTE 在三大权威测评平台（Wirecutter、CNET、Consumer Reports）均无任何覆盖。这是 GEO 评分中 "内容权威性" 因子仅得 8/30 分的根本原因，也是 ChatGPT 排名极低的最主要驱动力。'
        '</div>'
        '<div class="card" style="margin-bottom:12px;">'
        '<div class="card-title">Tier-1 媒体覆盖对比表</div>'
        '<table>'
        '<tr><th>媒体</th><th style="text-align:center;">Cuisinart</th><th style="text-align:center;">GreenPan</th><th style="text-align:center;">T-fal</th><th style="text-align:center;">Tramontina</th><th style="text-align:center;">SENSARTE</th></tr>'
        '<tr><td>Wirecutter</td><td style="text-align:center;color:#22c55e;">获奖推荐</td><td style="text-align:center;color:#22c55e;">测评收录</td><td style="text-align:center;color:#22c55e;">测评收录</td><td style="text-align:center;color:#22c55e;">获奖推荐</td><td style="text-align:center;color:#ef4444;font-weight:700;">无</td></tr>'
        '<tr><td>CNET</td><td style="text-align:center;color:#22c55e;">专题测评</td><td style="text-align:center;color:#22c55e;">专题测评</td><td style="text-align:center;color:#fbbf24;">提及</td><td style="text-align:center;color:#22c55e;">专题测评</td><td style="text-align:center;color:#ef4444;font-weight:700;">无</td></tr>'
        '<tr><td>Consumer Reports</td><td style="text-align:center;color:#22c55e;">A 级</td><td style="text-align:center;color:#22c55e;">B+ 级</td><td style="text-align:center;color:#22c55e;">B 级</td><td style="text-align:center;color:#22c55e;">A- 级</td><td style="text-align:center;color:#ef4444;font-weight:700;">无</td></tr>'
        '<tr><td>Prudent Reviews</td><td style="text-align:center;color:#22c55e;">深度测评</td><td style="text-align:center;color:#22c55e;">深度测评</td><td style="text-align:center;color:#22c55e;">深度测评</td><td style="text-align:center;color:#22c55e;">深度测评</td><td style="text-align:center;color:#ef4444;font-weight:700;">无</td></tr>'
        '</table></div>'
        '<div class="two-col" style="margin-bottom:10px;">'
        '<div class="card">'
        '<div class="card-title">媒体覆盖对 AI 排名的量化影响</div>'
        '<div class="narrative">'
        '<p>根据 Avanti GEO 平台跨品牌分析数据：</p>'
        '<p>• 有 Wirecutter 测评的品牌，AI 均位平均 <b>+8-12</b> 个位置优于无测评品牌</p>'
        '<p>• Consumer Reports 收录品牌在 ChatGPT 上位置提升 <b>+15-20</b> 个位置</p>'
        '<p>• Prudent Reviews 等中腰部媒体可带来 <b>+5-8</b> 个位置提升</p>'
        '<p>• 三大平台全覆盖 vs 零覆盖的 GEO 得分差距约 <b>20-25 分</b></p>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">突破路径优先级</div>'
        '<div class="narrative">'
        '<p><b>P0 — Prudent Reviews</b>（4-6 周）</p>'
        '<p>最易达成，该媒体活跃测评预算厨具，合作门槛低。预计投入 $500-$1,000 + 免费样品。</p>'
        '<p style="margin-top:6px;"><b>P1 — Wirecutter</b>（8-12 周）</p>'
        '<p>难度最高但 ROI 最大。需通过 PR 渠道投稿，强调 "最高性价比 Swiss 涂层不粘锅" 角度。</p>'
        '<p style="margin-top:6px;"><b>P2 — CNET/Consumer Reports</b>（12-16 周）</p>'
        '<p>需要产品送测 + PR 跟进。Consumer Reports 为付费会员制，测评周期较长。</p>'
        '</div></div></div>'
    )
    return page(c, '24')


# ── PAGE 25: 幻觉检测 ──────────────────────────────────────────
def page_hallucination_check():
    c = (
        '<div class="tag tag-blue" style="margin-bottom:10px;">幻觉检测</div>'
        '<div class="sec-title">AI 幻觉检测 · 4 项核查</div>'
        '<div class="sec-sub">验证 AI 引擎对 SENSARTE 的事实准确性 · 识别虚假信息风险</div>'
        '<div class="narrative" style="margin-bottom:12px;">'
        '<p>AI 引擎在推荐产品时可能生成不准确的信息（"幻觉"）。以下对 AI 关于 SENSARTE 的常见陈述进行事实核查，确保品牌信息在 AI 生态中的准确性。</p>'
        '</div>'
        '<div class="card" style="margin-bottom:10px;">'
        '<div class="card-title">核查 1: "SENSARTE 使用瑞士 ILAG 不粘涂层"</div>'
        '<div class="good-box" style="margin:6px 0 0;">'
        '<b>结果: 属实</b> — SENSARTE 产品 listing 和品牌页面明确标注 "Swiss ILAG Granite Coating"。ILAG 是瑞士涂层技术公司，为多个品牌提供授权涂层。AI 引擎对此信息的引用准确。'
        '</div></div>'
        '<div class="card" style="margin-bottom:10px;">'
        '<div class="card-title">核查 2: "SENSARTE 产品 PFOA 和 PFAS Free"</div>'
        '<div class="good-box" style="margin:6px 0 0;">'
        '<b>结果: 属实</b> — Amazon listing 和品牌声明均标注 PFOA Free。部分 AI 回答会额外声称 "PFAS Free"，这与品牌声明一致（ILAG 涂层系列不含 PFAS）。但需注意 FDA 未对此做独立验证。'
        '</div></div>'
        '<div class="card" style="margin-bottom:10px;">'
        '<div class="card-title">核查 3: "SENSARTE 是美国品牌"</div>'
        '<div class="warn-box" style="margin:6px 0 0;">'
        '<b>结果: 需注意</b> — 部分 AI 回答将 SENSARTE 描述为 "美国品牌" 或 "美国公司"。实际上 SENSARTE 是中国跨境品牌（深圳），在美国注册商标并通过 Amazon 销售。AI 对品牌来源地的描述存在模糊性，不算严格幻觉但可能引发消费者期望偏差。'
        '</div></div>'
        '<div class="card" style="margin-bottom:10px;">'
        '<div class="card-title">核查 4: "SENSARTE 与 Carote 来自同一工厂"</div>'
        '<div class="warn-box" style="margin:6px 0 0;">'
        '<b>结果: 未证实但有传播</b> — Reddit r/Cooking 上有用户发帖 "Sensarte vs Carote same factory?" 讨论两个品牌的产品相似度。AI 引擎（尤其 ChatGPT）在回答中偶尔引用此讨论，暗示两者可能同源。这一未经证实的说法正在损害 SENSARTE 的品牌独特性。建议品牌主动发布差异化内容（Swiss ILAG vs 普通涂层对比）来反制此叙事。'
        '</div></div>'
        '<div class="highlight-box">'
        '<b>总结</b>: 4 项核查中 2 项完全准确，2 项存在模糊风险。最大威胁是 "同厂论"，建议通过品牌内容和媒体投稿主动建立差异化叙事。'
        '</div>'
    )
    return page(c, '25')


# ── PAGE 26: 行动一 ──────────────────────────────────────────
def page_action_1():
    c = (
        '<div class="tag tag-or" style="margin-bottom:10px;">行动计划</div>'
        '<div class="sec-title">行动一: Wirecutter / Prudent Reviews 投稿</div>'
        '<div class="sec-sub">Tier-1 媒体突破 · 预估 GEO +8-12 分 · 最高 ROI 行动</div>'
        '<div class="highlight-box" style="margin-bottom:12px;">'
        '<b>目标</b>: 在 12 周内获得至少 1 篇 Tier-1/Tier-2 媒体深度测评收录，将 GEO "内容权威性" 因子从 8/30 提升至 18/30。'
        '</div>'
        '<div class="step-row"><div class="step-num">1</div><div class="step-body">'
        '<div class="step-title">Prudent Reviews 投稿（Week 1-2）</div>'
        '<div class="step-desc">联系 Prudent Reviews 编辑团队，提供 B086PHS2V8（不粘煎锅）和 B0BZHG5VQL（13 件陶瓷套装）免费样品。投稿角度："2025 年 $20 以下最佳不粘煎锅 — Swiss ILAG 涂层如何改变预算厨具市场"。预算：$500 合作费 + $100 样品成本。</div>'
        '</div></div>'
        '<div class="step-row"><div class="step-num">2</div><div class="step-body">'
        '<div class="step-title">Wirecutter PR 通道（Week 2-4）</div>'
        '<div class="step-desc">通过 Wirecutter 的产品提交表单（wirecutter.com/about/submit-a-product）提交 B086PHS2V8。强调三个差异化点：(1) Swiss ILAG 涂层认证 (2) 32,448 条 Amazon 评价 4.5★ (3) $17.99 极致性价比。同时通过 LinkedIn 联系 Wirecutter 厨具编辑。</div>'
        '</div></div>'
        '<div class="step-row"><div class="step-num">3</div><div class="step-body">'
        '<div class="step-title">CNET / Good Housekeeping 跟进（Week 4-8）</div>'
        '<div class="step-desc">向 CNET Kitchen 频道和 Good Housekeeping 实验室提交测评申请。准备一份品牌 Media Kit，包含：品牌故事、Swiss ILAG 认证文件、Amazon 销售数据摘要、用户评价精选。</div>'
        '</div></div>'
        '<div class="step-row"><div class="step-num">4</div><div class="step-body">'
        '<div class="step-title">Consumer Reports 送测（Week 6-12）</div>'
        '<div class="step-desc">Consumer Reports 需要正式送测流程，周期较长（8-12 周）。提前发起申请，提交 3 款核心 SKU。注意：CR 测评结果不受品牌控制，需确保送测产品质量一致。</div>'
        '</div></div>'
        '<div class="divider"></div>'
        '<div class="two-col">'
        '<div class="card">'
        '<div class="card-title">预期 ROI</div>'
        '<div class="narrative">'
        '<p>• Prudent Reviews 收录: GEO +5-8 分</p>'
        '<p>• Wirecutter 收录: GEO +10-15 分</p>'
        '<p>• 总投入: $1,000-$2,000</p>'
        '<p>• 预计回收周期: 4-8 周</p>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">投稿话术模板</div>'
        '<div class="content-box" style="font-size:7pt;">'
        'Subject: Pitch — Swiss-Coated Nonstick Pan, 32K+ Reviews at $17.99\n\n'
        'Hi [Editor],\n'
        'SENSARTE\'s Swiss ILAG granite-coated frying pan has quietly become Amazon\'s #1 bestseller in nonstick pans with 32,448 reviews (4.5★) at $17.99. We\'d love to send samples for testing.\n'
        'Key angle: How Swiss coating tech is disrupting the budget cookware segment.'
        '</div></div></div>'
    )
    return page(c, '26')


# ── PAGE 27: 行动二 + 三四摘要 ──────────────────────────────────
def page_action_2():
    c = (
        '<div class="tag tag-or" style="margin-bottom:10px;">行动计划</div>'
        '<div class="sec-title">行动二: FAQ Schema 实施 + 行动三四摘要</div>'
        '<div class="sec-sub">结构化数据优化 · 预估 GEO +3-5 分 · 2 周内可完成</div>'
        '<div class="card" style="margin-bottom:12px;">'
        '<div class="card-title">FAQ Schema 实施方案</div>'
        '<div class="narrative" style="margin-bottom:8px;">'
        '<p>FAQ Schema（结构化问答标记）让 AI 引擎能直接从品牌官网提取标准化答案，大幅提升内容可抓取性和权威性。建议在 SENSARTE 品牌页面或独立 FAQ 页面添加以下 10 组 FAQ：</p>'
        '</div>'
        '<table>'
        '<tr><th>#</th><th>问题</th><th>类型</th></tr>'
        '<tr><td>1</td><td>What is Swiss ILAG coating and why is it better?</td><td>技术差异</td></tr>'
        '<tr><td>2</td><td>Is SENSARTE cookware PFOA and PFAS free?</td><td>健康安全</td></tr>'
        '<tr><td>3</td><td>Does SENSARTE work on induction stovetops?</td><td>兼容性</td></tr>'
        '<tr><td>4</td><td>How to care for SENSARTE nonstick cookware?</td><td>使用指南</td></tr>'
        '<tr><td>5</td><td>What is the difference between SENSARTE and Carote?</td><td>竞品对比</td></tr>'
        '<tr><td>6</td><td>Is SENSARTE cookware oven safe?</td><td>使用场景</td></tr>'
        '<tr><td>7</td><td>How long does SENSARTE nonstick coating last?</td><td>耐久性</td></tr>'
        '<tr><td>8</td><td>Where is SENSARTE cookware manufactured?</td><td>品牌透明</td></tr>'
        '<tr><td>9</td><td>What is the best SENSARTE product for beginners?</td><td>入门推荐</td></tr>'
        '<tr><td>10</td><td>Does SENSARTE offer a warranty?</td><td>售后保障</td></tr>'
        '</table></div>'
        '<div class="divider"></div>'
        '<div class="two-col" style="margin-bottom:10px;">'
        '<div class="card">'
        '<div class="card-title">行动三摘要: YouTube KOL 合作</div>'
        '<div class="narrative">'
        '<p><b>目标</b>: 3 个月内获得 3-5 个中腰部厨具 KOL 视频</p>'
        '<p><b>优先联系</b>:</p>'
        '<p>• Prudent Reviews（50 万+订阅）</p>'
        '<p>• teaves（已有 SENSARTE 视频，深化合作）</p>'
        '<p>• Budget Kitchen 类频道</p>'
        '<p><b>预算</b>: $500-$1,000/视频 + 免费样品</p>'
        '<p><b>预期效果</b>: GEO +3-5 分</p>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">行动四摘要: Reddit 有机增长</div>'
        '<div class="narrative">'
        '<p><b>目标</b>: 3 个月内在 r/cookware 和 r/BuyItForLife 增加 5-8 条高质量有机讨论</p>'
        '<p><b>策略</b>:</p>'
        '<p>• 邀请 Amazon 高评分用户在 Reddit 分享使用体验</p>'
        '<p>• 发布 "SENSARTE 6 个月使用报告" 长帖</p>'
        '<p>• 在 "best budget cookware" 讨论中自然提及</p>'
        '<p><b>预算</b>: $0（有机增长）</p>'
        '<p><b>预期效果</b>: GEO +2-3 分</p>'
        '</div></div></div>'
    )
    return page(c, '27')


# ── PAGE 28: 行动三详细 ──────────────────────────────────────────
def page_action_3():
    c = (
        '<div class="tag tag-or" style="margin-bottom:10px;">行动计划</div>'
        '<div class="sec-title">行动三: YouTube KOL · Reddit · Amazon 优化</div>'
        '<div class="sec-sub">三渠道联动 · 社交验证 + 产品信息 + 有机讨论全面提升</div>'
        '<div class="card" style="margin-bottom:12px;">'
        '<div class="card-title">YouTube KOL 合作详案</div>'
        '<div class="step-row"><div class="step-num">1</div><div class="step-body">'
        '<div class="step-title">Prudent Reviews 深度合作（Week 1-4）</div>'
        '<div class="step-desc">提供 B086PHS2V8 + B0BZHG5VQL 套装样品，邀请进行 "SENSARTE 全线测评"。强调 Swiss ILAG 涂层对比普通 PTFE 的差异。视频标题建议："$18 Swiss-Coated Pan vs $80 Cuisinart — Is It Worth It?"</div>'
        '</div></div>'
        '<div class="step-row"><div class="step-num">2</div><div class="step-body">'
        '<div class="step-title">teaves 回访合作（Week 2-6）</div>'
        '<div class="step-desc">teaves 已有 16,045 播放的 SENSARTE 煎锅视频，邀请制作 "6 个月后续使用报告" 视频。这类 follow-up 视频对 AI 的长期信任度信号贡献极高。</div>'
        '</div></div>'
        '<div class="step-row"><div class="step-num">3</div><div class="step-body">'
        '<div class="step-title">Budget Kitchen 频道拓展（Week 4-8）</div>'
        '<div class="step-desc">联系 3-5 个 "预算厨具" 类频道（10K-100K 订阅），提供免费样品换取真实测评。聚焦 "鸡蛋不粘测试"、"煎牛排不粘测试" 等可视化高的内容形式。</div>'
        '</div></div>'
        '</div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card">'
        '<div class="card-title">Reddit 有机增长策略</div>'
        '<div class="narrative">'
        '<p><b>Week 1-2: 播种期</b></p>'
        '<p>• 在 r/cookware 发布 "Swiss ILAG vs PTFE: 技术对比指南"（非商业软文）</p>'
        '<p>• 在 r/Cooking 回答 "best budget nonstick pan" 问题时自然提及 SENSARTE</p>'
        '<p style="margin-top:6px;"><b>Week 3-6: 增长期</b></p>'
        '<p>• 邀请 3 名 Amazon 高评分用户在 r/cookware 发布使用体验帖</p>'
        '<p>• 在 r/BuyItForLife 发布 "$18 煎锅能否成为 BIFL？6 个月使用报告"</p>'
        '<p style="margin-top:6px;"><b>Week 7-12: 维护期</b></p>'
        '<p>• 持续在相关讨论中提供有价值的回答，建立品牌社区存在感</p>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">Amazon Listing 优化</div>'
        '<div class="narrative">'
        '<p><b>A+ Content 升级</b>:</p>'
        '<p>• 添加 "Swiss ILAG 涂层技术" 专题模块</p>'
        '<p>• 添加 "vs Cuisinart/T-fal" 对比表格</p>'
        '<p>• 添加 "PFOA/PFAS Free" 安全认证标识</p>'
        '<p style="margin-top:6px;"><b>Q&A 主动管理</b>:</p>'
        '<p>• 回应 "chipping" 问题：说明正确使用方法</p>'
        '<p>• 回应 "same factory" 问题：强调 Swiss ILAG 独家授权</p>'
        '<p>• 添加涂层耐久性测试视频到 listing</p>'
        '</div></div></div>'
    )
    return page(c, '28')


# ── PAGE 29: 12 周 ROI 路线图 ──────────────────────────────────
def page_roi_roadmap():
    c = (
        '<div class="tag tag-green" style="margin-bottom:10px;">ROI 路线图</div>'
        '<div class="sec-title">12 周 ROI 路线图 · GEO 42 → 60</div>'
        '<div class="sec-sub">分阶段执行 · 每 4 周评估 · 目标 18 分提升</div>'
        '<div class="card" style="margin-bottom:12px;">'
        '<div class="card-title">阶段路线图</div>'
        '<table>'
        '<tr><th>阶段</th><th>周期</th><th>核心行动</th><th style="text-align:center;">GEO 目标</th><th style="text-align:center;">增幅</th></tr>'
        '<tr style="background:rgba(255,107,53,.06);"><td style="font-weight:700;color:var(--or);">Phase 1</td><td>Week 1-4</td>'
        '<td>Prudent Reviews 投稿 + FAQ Schema + Amazon Q&A 优化</td>'
        '<td style="text-align:center;font-weight:700;">48</td>'
        '<td style="text-align:center;color:#22c55e;">+6</td></tr>'
        '<tr><td style="font-weight:700;color:#fbbf24;">Phase 2</td><td>Week 5-8</td>'
        '<td>YouTube KOL 3 条视频 + Reddit 5 条有机帖 + Wirecutter 跟进</td>'
        '<td style="text-align:center;font-weight:700;">54</td>'
        '<td style="text-align:center;color:#22c55e;">+6</td></tr>'
        '<tr style="background:rgba(255,107,53,.06);"><td style="font-weight:700;color:#22c55e;">Phase 3</td><td>Week 9-12</td>'
        '<td>媒体测评发布 + TikTok 启动 + 品牌官网结构化数据</td>'
        '<td style="text-align:center;font-weight:700;">60</td>'
        '<td style="text-align:center;color:#22c55e;">+6</td></tr>'
        '</table></div>'
        '<div class="two-col" style="margin-bottom:12px;">'
        '<div class="card">'
        '<div class="card-title">GEO 得分提升预测</div>'
        '<div style="margin-top:6px;">'
        '<div style="font-size:7.5pt;color:var(--muted);margin-bottom:2px;">Week 0 — 当前</div>'
        '<div class="bar-bg"><div class="bar-fill bar-re" style="width:42%"></div></div>'
        '<div style="text-align:right;font-size:7pt;color:#ef4444;">42/100</div>'
        '<div style="font-size:7.5pt;color:var(--muted);margin-bottom:2px;margin-top:8px;">Week 4 — Phase 1 完成</div>'
        '<div class="bar-bg"><div class="bar-fill bar-ye" style="width:48%"></div></div>'
        '<div style="text-align:right;font-size:7pt;color:#fbbf24;">48/100</div>'
        '<div style="font-size:7.5pt;color:var(--muted);margin-bottom:2px;margin-top:8px;">Week 8 — Phase 2 完成</div>'
        '<div class="bar-bg"><div class="bar-fill bar-ye" style="width:54%"></div></div>'
        '<div style="text-align:right;font-size:7pt;color:#fbbf24;">54/100</div>'
        '<div style="font-size:7.5pt;color:var(--muted);margin-bottom:2px;margin-top:8px;">Week 12 — Phase 3 完成</div>'
        '<div class="bar-bg"><div class="bar-fill bar-gr" style="width:60%"></div></div>'
        '<div style="text-align:right;font-size:7pt;color:#22c55e;">60/100</div>'
        '</div></div>'
        '<div class="card">'
        '<div class="card-title">投入产出预算</div>'
        '<div class="narrative">'
        '<p><b>Phase 1 投入</b>: $1,000-$1,500</p>'
        '<p>• Prudent Reviews 合作: $500-$1,000</p>'
        '<p>• FAQ Schema 开发: $0（自行实施）</p>'
        '<p>• 样品成本: $200-$500</p>'
        '<p style="margin-top:6px;"><b>Phase 2 投入</b>: $2,000-$3,000</p>'
        '<p>• YouTube KOL × 3: $1,500-$3,000</p>'
        '<p>• Reddit 有机增长: $0</p>'
        '<p style="margin-top:6px;"><b>Phase 3 投入</b>: $500-$1,000</p>'
        '<p>• TikTok 内容制作: $300-$500</p>'
        '<p>• 品牌官网优化: $200-$500</p>'
        '<p style="margin-top:8px;font-weight:700;color:var(--or);">总投入: $3,500-$5,500</p>'
        '<p style="font-weight:700;color:#22c55e;">预期月增收: +$15,000-$25,000</p>'
        '<p style="color:var(--muted);font-size:7.5pt;">基于 AI 推荐位置提升带来的 Amazon 流量增长估算</p>'
        '</div></div></div>'
        '<div class="good-box">'
        '<b>关键里程碑</b>: Week 4 达到 GEO 48 分（进入 "改善区"），Week 8 达到 54 分（接近行业均值 58），Week 12 达到 60 分（进入 "竞争区" 下沿）。每个阶段结束后进行一次完整 GEO 扫描（2,400 次查询）验证效果。'
        '</div>'
    )
    return page(c, '29')


# ── PAGE 30: 附录 ──────────────────────────────────────────
def page_appendix():
    c = (
        '<div class="tag tag-muted" style="margin-bottom:10px;">附录</div>'
        '<div class="sec-title">附录: 4 品类逐引擎位置对比表</div>'
        '<div class="sec-sub">完整数据参考 · 含 SENSARTE 及 5 大竞品 · 3 引擎 × 4 品类</div>'
        '<div class="card" style="margin-bottom:10px;">'
        '<div class="card-title">不粘锅套装 (nonstick cookware set) · 600 prompts</div>'
        '<table>'
        '<tr><th>品牌</th><th style="text-align:center;">Claude</th><th style="text-align:center;">Gemini</th><th style="text-align:center;">ChatGPT</th><th style="text-align:center;">均位</th></tr>'
        '<tr><td style="font-weight:700;color:var(--or);">SENSARTE</td><td style="text-align:center;">16.9</td><td style="text-align:center;">21.7</td><td style="text-align:center;">29.5</td><td style="text-align:center;font-weight:700;">22.7</td></tr>'
        '<tr><td>Cuisinart</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#22c55e;font-weight:700;">11.7</td></tr>'
        '<tr><td>Tramontina</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#22c55e;font-weight:700;">11.7</td></tr>'
        '<tr><td>T-fal</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#fbbf24;font-weight:700;">18.9</td></tr>'
        '<tr><td>GreenPan</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#fbbf24;font-weight:700;">21.4</td></tr>'
        '<tr><td>Caraway</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#fbbf24;font-weight:700;">22.6</td></tr>'
        '</table></div>'
        '<div class="card" style="margin-bottom:10px;">'
        '<div class="card-title">陶瓷烊具 (ceramic cookware) · 600 prompts</div>'
        '<table>'
        '<tr><th>品牌</th><th style="text-align:center;">Claude</th><th style="text-align:center;">Gemini</th><th style="text-align:center;">ChatGPT</th><th style="text-align:center;">均位</th></tr>'
        '<tr><td style="font-weight:700;color:var(--or);">SENSARTE</td><td style="text-align:center;">17.5</td><td style="text-align:center;">21.6</td><td style="text-align:center;color:#ef4444;font-weight:700;">38.4</td><td style="text-align:center;font-weight:700;">25.7</td></tr>'
        '<tr><td>Cuisinart</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#22c55e;font-weight:700;">14.2</td></tr>'
        '<tr><td>Tramontina</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#22c55e;font-weight:700;">15.4</td></tr>'
        '<tr><td>GreenPan</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#fbbf24;font-weight:700;">22.1</td></tr>'
        '<tr><td>T-fal</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#fbbf24;font-weight:700;">24.8</td></tr>'
        '<tr><td>Caraway</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#fbbf24;font-weight:700;">25.2</td></tr>'
        '</table></div>'
        '<div class="card" style="margin-bottom:10px;">'
        '<div class="card-title">不粘煎锅 (nonstick frying pan) · 600 prompts</div>'
        '<table>'
        '<tr><th>品牌</th><th style="text-align:center;">Claude</th><th style="text-align:center;">Gemini</th><th style="text-align:center;">ChatGPT</th><th style="text-align:center;">均位</th></tr>'
        '<tr><td style="font-weight:700;color:var(--or);">SENSARTE</td><td style="text-align:center;">18.1</td><td style="text-align:center;">17.6</td><td style="text-align:center;">27.1</td><td style="text-align:center;font-weight:700;">20.9</td></tr>'
        '<tr><td>GreenPan</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#22c55e;font-weight:700;">10.5</td></tr>'
        '<tr><td>Tramontina</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#22c55e;font-weight:700;">11.0</td></tr>'
        '<tr><td>Cuisinart</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#22c55e;font-weight:700;">11.5</td></tr>'
        '<tr><td>T-fal</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#fbbf24;font-weight:700;">18.1</td></tr>'
        '<tr><td>Caraway</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#fbbf24;font-weight:700;">20.7</td></tr>'
        '</table></div>'
        '<div class="card">'
        '<div class="card-title">不粘平底锅 (nonstick saucepan) · 600 prompts</div>'
        '<table>'
        '<tr><th>品牌</th><th style="text-align:center;">Claude</th><th style="text-align:center;">Gemini</th><th style="text-align:center;">ChatGPT</th><th style="text-align:center;">均位</th></tr>'
        '<tr><td style="font-weight:700;color:var(--or);">SENSARTE</td><td style="text-align:center;">17.9</td><td style="text-align:center;">19.1</td><td style="text-align:center;">27.4</td><td style="text-align:center;font-weight:700;">21.4</td></tr>'
        '<tr><td>Tramontina</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#22c55e;font-weight:700;">10.5</td></tr>'
        '<tr><td>Cuisinart</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#22c55e;font-weight:700;">10.6</td></tr>'
        '<tr><td>T-fal</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#fbbf24;font-weight:700;">18.4</td></tr>'
        '<tr><td>GreenPan</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#fbbf24;font-weight:700;">21.1</td></tr>'
        '<tr><td>Caraway</td><td colspan="3" style="text-align:center;color:var(--muted);">跨引擎均位</td><td style="text-align:center;color:#fbbf24;font-weight:700;">22.0</td></tr>'
        '</table></div>'
    )
    return page(c, '30')


# ── MAIN ──────────────────────────────────────────
async def generate():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    pages = [
        page_cover(), page_toc(), page_ceo_brief(), page_position_deficit(),
        page_geo_score(), page_geo_factors(),
        page_engine_overview(), page_chatgpt_deep(), page_gemini_deep(), page_claude_deep(),
        page_query_samples_1(), page_query_samples_2(),
        page_competition_sov(), page_cuisinart_vs_sensarte(),
        page_amazon_overview(), page_product_b086(), page_product_b0bv(),
        page_product_b08r(), page_product_b0bz(), page_review_themes(),
        page_youtube_kol(), page_reddit_analysis(), page_tiktok_status(),
        page_media_gap(), page_hallucination_check(),
        page_action_1(), page_action_2(), page_action_3(),
        page_roi_roadmap(), page_appendix(),
    ]
    html = f"<!DOCTYPE html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{''.join(pages)}</body></html>"
    out = OUTPUT_DIR / f"sensarte-cookware-{datetime.now().strftime('%Y-%m-%d')}.html"
    out.write_text(html, encoding="utf-8")
    print(f"✅ HTML saved: {out}")
    # PDF via playwright
    try:
        from playwright.async_api import async_playwright
        async with async_playwright() as p:
            br = await p.chromium.launch()
            pg = await br.new_page()
            await pg.goto(f"file://{out.resolve()}")
            pdf_path = out.with_suffix(".pdf")
            await pg.pdf(path=str(pdf_path), format="A4", print_background=True)
            await br.close()
            print(f"✅ PDF saved: {pdf_path}")
    except Exception as e:
        print(f"⚠️ PDF generation failed: {e}")


if __name__ == "__main__":
    asyncio.run(generate())
