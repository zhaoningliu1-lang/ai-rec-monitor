# OpenClaw 修复 Prompt — GEO 报告排版和内容截断

## 任务
修复两份 GEO 报告中剩余的排版和内容截断问题。报告通过 Python 脚本（HTML → Playwright PDF）生成。你只需修改模板代码，然后重新生成两份 PDF。

## 参考 PDF（当前版本，有问题的）
- Pillow: `/Users/johnsonliu/Desktop/claude code/ai-rec-monitor/docs/reports/supuon-pillow-2026-03-15.pdf`
- Pump: `/Users/johnsonliu/Desktop/claude code/ai-rec-monitor/docs/reports/supuon-pump-2026-03-15.pdf`

请先打开这两份 PDF 逐页审阅，找到所有问题，然后一次性修复。

## 核心文件
- **模板代码**: `/Users/johnsonliu/Desktop/claude code/ai-rec-monitor/scripts/report/gen_mckinsey_report.py`
- **Pillow 数据**: `/Users/johnsonliu/Desktop/claude code/ai-rec-monitor/scripts/report/supuon_pillow_data.json`
- **Pump 数据**: `/Users/johnsonliu/Desktop/claude code/ai-rec-monitor/scripts/report/supuon_pump_data.json`
- **独立重新生成脚本**: `/Users/johnsonliu/Desktop/claude code/ai-rec-monitor/scripts/report/add_deliverables.py`

## 已知问题清单

### 问题 1: 优化路线图页面显示原始 Markdown（# ## ### **）
**位置**: `page_actions_roadmap()` 调用 `_format_playbook()` 函数
**原因**: 数据中的 `optimization_playbook` 字段使用 Markdown 格式（`# 标题`、`## 章节`、`### 1. 子项`、`**加粗**`），但 `_format_playbook()` 只识别"立即执行/短期优化/中期战略/Phase/阶段"这几个固定关键词，不处理 Markdown 语法。
**修复**: 在 `_format_playbook()` 中添加 Markdown 到 HTML 的转换：
```python
# 在 _format_playbook() 函数开头，清理 AI artifacts 之后，添加：
import re
# Convert markdown headers to styled HTML
s = re.sub(r'^#{3}\s*(\d+[\.\、]?\s*)', r'<NUMBERED_ITEM>\1', s, flags=re.MULTILINE)
s = re.sub(r'^#{1,3}\s*(.+)$',
           r'<div style="font-size:9pt;font-weight:700;color:var(--or);margin:12px 0 6px 0;">\1</div>',
           s, flags=re.MULTILINE)
# Convert **bold** to <b>
s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
# Then split remaining text into paragraphs...
```
注意：这个函数返回的 HTML 中不能用 `esc()` 处理已经转换好的 HTML 标签，需要分段处理。

### 问题 2: 标杆学习页面显示 JSON dict 格式
**位置**: `page_best_in_class_learn()` 函数
**原因**: `what_client_can_learn` 和 `category_trends_2025` 数据实际是 `[{title, content}, ...]` 格式的 dict 列表，但代码用 `_clean_json_key_text()` 处理每个 item，这个函数只能处理简单的 `{'key': 'value'}` 格式，不能处理多字段 dict。结果就是整个 dict 的 `str()` 表示被显示出来。
**修复**:
```python
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
                    items.append((title, content))
                elif isinstance(item, str):
                    items.append(('', _clean_json_key_text(item)))
        elif isinstance(raw, dict):
            for v in raw.values():
                if isinstance(v, dict):
                    items.append((v.get('title',''), v.get('content','')))
                else:
                    items.append(('', _clean_json_key_text(str(v))))
        return items

    lessons = _extract_items(lessons_raw)
    trends = _extract_items(trends_raw)

    lessons_html = ""
    for i, (title, content) in enumerate(lessons[:5]):
        lessons_html += f"""<div class="action-item">
          <div class="action-num">{i+1}</div>
          <div>
            {"<div style='font-size:8pt;font-weight:700;margin-bottom:3px;'>" + esc(title) + "</div>" if title else ""}
            <div class="action-desc">{esc(content or title)}</div>
          </div>
        </div>"""

    trends_html = ""
    for i, (title, content) in enumerate(trends[:5]):
        trends_html += f"""<div class="insight-box">
          {"<div style='font-size:8pt;font-weight:600;margin-bottom:3px;'>" + esc(title) + "</div>" if title else ""}
          <div style="font-size:8pt;color:rgba(255,255,255,.85);line-height:1.5;">{esc(content or title)}</div>
        </div>"""
    # ... 后面不变
```
**注意**: 内容可能很长（每条 200-400 字），如果 5 条 lessons + 5 条 trends 放不下一页，需要考虑截断 content 或者将此页改为多页返回（类似 `_narrative_overflow_pages`）。建议每条 content 截断到 120 字以保证一页放得下。

### 问题 3: 续页（续）大量空白、文字太少
**位置**: `_narrative_overflow_pages()` 以及调用它的页面函数
**原因**: `first_page_limit` 值太小（1000-1100），导致第一页显示少量文字就溢出到续页；而续页有大量空间但文字很少。
**修复**: 增大 `first_page_limit`（在有 header_html 的页面设为 1400-1600，纯文字页面设为 2000+），并减小 `cont_page_limit` 到 2000，让文字分布更均匀。具体：
```python
# page_language(): first_page_limit=1400 (有统计卡和表格)
# page_intent(): first_page_limit=1400
# page_cross_platform_overview(): first_page_limit=1400
# page_competitor_beat() weaknesses: first_page_limit=2000 (标题占的空间小)
# page_competitor_beat() beat: first_page_limit=1800
```
**更好的方案**: 如果续页只有 1-3 行短文本（< 200 字），就不要生成续页，而是把文字放在第一页。修改 `_narrative_overflow_pages()` 的逻辑：
```python
# 在生成 continuation pages 之前，检查剩余文字量
if remaining:
    rest_text = "".join(remaining)
    if len(rest_text) < 300:
        # 剩余文字太少，不值得单独一页，合并回第一页
        # 重新生成第一页，使用完整 text
        narrative_html = _format_numbered_text(text)
        body = f"""...(同上但用完整 narrative_html)..."""
        pages_out = [page(brand, date, 0, body)]
    else:
        # 正常分页
        cont_chunks = _split_text(rest_text, cont_page_limit)
        ...
```

### 问题 4: page_best_in_class 中文字截断
**位置**: `page_best_in_class()` 函数
**原因**: 使用了小的 trunc 限制 `trunc(..., 1500)` 和 `trunc(..., 1200)`
**修复**: 改为默认值（不传第二个参数），或者将此页改为多页函数（返回 list），当内容太长时自动分页。简单方案：把 1500 改为 3000，1200 改为 2500。更好的方案是做 auto-split 分页。

### 问题 5: Pump 报告幻觉分析总结被截断
**位置**: `page_hallucination_overview()` 中 `ha.get('summary', '')`
**原因**: 这不是模板代码的问题，而是 **数据本身**（`supuon_pump_data.json`）中 `hallucination_analysis.summary` 字段在 "声称其为" 处就结束了，文本在 Claude API 生成时就被截断了。
**修复**: 需要重新运行幻觉分析生成，或手动在 JSON 中补充完整文本。模板代码层面无需修改。

### 问题 6: 路线图页面可能需要分页
**位置**: `page_actions_roadmap()` 返回单页
**原因**: optimization_playbook 文本通常很长（2000-4000 字），一页放不下会被 overflow:hidden 截断。
**修复**: 将 `page_actions_roadmap()` 改为返回 list（多页），类似 `page_competitor_beat()` 的做法：
```python
def page_actions_roadmap(d):
    en = d.get("extended_narrative", {})
    playbook = en.get("optimization_playbook", "")
    brand = d['brand']
    date = d.get('report_date', '')

    # 用 _format_playbook 转换为 HTML
    playbook_html = _format_playbook(playbook)

    # 如果内容太长，需要分页
    # 由于 _format_playbook 返回 HTML，不能直接用 _split_text
    # 简单方案：先分割原始文本，每段分别调用 _format_playbook
    chunks = _split_text(playbook, 2000)
    pages_out = []

    for i, chunk in enumerate(chunks):
        chunk_html = _format_playbook(chunk)
        if i == 0:
            body = f"""
            <div class="tag tag-or" style="margin-bottom:8px;">优化路线图</div>
            <div class="sec-title">分阶段执行路线图</div>
            <div class="sec-sub">立即执行(1-3天) → 短期优化(1-4周) → 中期战略(1-3月)</div>
            <div class="card">
              <div class="narrative">{chunk_html}</div>
            </div>"""
        else:
            body = f"""
            <div class="tag tag-muted" style="margin-bottom:8px;">续</div>
            <div class="sec-title">执行路线图（续）</div>
            <div class="card">
              <div class="narrative">{chunk_html}</div>
            </div>"""
        pages_out.append(page(brand, date, 0, body))

    return pages_out if pages_out else [page(brand, date, 23, '...')]
```
**注意**：改为返回 list 后，在 `build_report_html()` 中要用 `*page_actions_roadmap(data)` 解包。

### 问题 7: 视频脚本页面内容可能溢出
**位置**: `page_exec_video_scripts()`
**原因**: 5 条英文脚本在一页内可能放不下（每条包含 title、hook、key_points、subtitle_text、CTA）
**修复**: 英文脚本只显示前 3 条，中文脚本也只显示前 3 条。或者将每页改为动态分页。简单方案：`scripts[:3]` 而非 `scripts[:5]`。

## 重新生成 PDF 的方法

修改完 `gen_mckinsey_report.py` 后，不需要重新跑 AI 引擎扫描。直接运行：

```bash
cd "/Users/johnsonliu/Desktop/claude code/ai-rec-monitor"
python scripts/report/add_deliverables.py pillow
python scripts/report/add_deliverables.py pump
```

**注意**: `add_deliverables.py` 会先调用 Claude API 生成 execution deliverables（关键词、视频脚本等），然后生成 PDF。如果只想重新生成 PDF 而不重新生成 deliverables，可以跳过 deliverables 生成步骤。

更简单的方式 — 只重新生成 PDF（不调 API）：
```python
# 在项目根目录运行
python -c "
import asyncio, json, sys
sys.path.insert(0, 'scripts/report')
from gen_mckinsey_report import build_report_html, html_to_pdf, OUTPUT_DIR
from pathlib import Path
from datetime import datetime

async def regen(product_key):
    data_path = Path(f'scripts/report/supuon_{product_key}_data.json')
    data = json.loads(data_path.read_text(encoding='utf-8'))
    name_slug = data.get('report_slug') or data['brand'].lower().replace(' ', '-')
    date_slug = datetime.now().strftime('%Y-%m-%d')
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output = OUTPUT_DIR / f'{name_slug}-{date_slug}.pdf'
    html = build_report_html(data)
    output.with_suffix('.html').write_text(html, encoding='utf-8')
    await html_to_pdf(html, output)
    print(f'Done: {output}')

asyncio.run(regen('pillow'))
asyncio.run(regen('pump'))
"
```

## 重要约束

1. **不要删除 `overflow:hidden`** — CSS `.page{overflow:hidden}` 是页面排版的基础，删掉会导致页码跑到页面中间。解决内容溢出的正确方法是分页，不是去掉 overflow。
2. **不要重跑 AI 引擎扫描** — 数据已经有了，只需修改模板代码重新渲染。
3. **所有文字必须使用中文**（除了直接引用的英文原文）。
4. **保持麦肯锡风格** — 深色背景 (#0d1b2e)、橙色强调 (#FF6B35)、白色正文、A4 固定页面。
5. **修改后运行 `python -c "from scripts.report.gen_mckinsey_report import build_report_html; print('OK')"` 确认语法无误**。
6. **生成完 PDF 后打开检查**，确保没有新的排版问题。

## build_report_html() 中的页面组装顺序（改为 list 返回的函数需要 * 解包）

```python
pages = [
    page_cover(data),
    page_toc(data),
    page_executive_summary(data),
    page_geo_score(data),
    *page_engine_pages(data),          # 已经是 list
    *page_language(data),              # 已经是 list
    *page_intent(data),                # 已经是 list
    *page_cross_platform_overview(data), # 已经是 list
    page_reddit(data),
    page_youtube(data),
    page_tiktok_google(data),
    page_competitor_overview(data),
    page_competitor_strengths(data),
    *page_competitor_beat(data),        # 已经是 list
    page_best_in_class(data),
    page_best_in_class_learn(data),
    page_market_size(data),
    page_market_ecommerce(data),
    page_hallucination_overview(data),
    page_hallucination_detail(data),
    page_actions_immediate(data),
    *page_actions_roadmap(data),        # 改为 list ← 需要修改
    page_exec_keywords(data),
    page_exec_keywords_p2(data),
    *page_exec_video_scripts(data),     # 已经是 list
    *page_exec_comparison_faq(data),    # 已经是 list
    page_actions_short(data),
    page_actions_mid(data),
    page_roi(data),
    page_response_samples(data, 26, 0, 3),
    page_query_matrix(data),
    page_methodology(data),
    page_about(data),
]
```
