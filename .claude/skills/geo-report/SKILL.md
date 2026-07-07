---
name: geo-report
description: Generate a weekly GEO visibility report (HTML+PDF) for a brand's product in a specific market. Queries the database, compiles data, generates report, and opens PDF.
argument-hint: <brand> <product> <country-code>
user-invocable: true
---

# GEO Report Generator

生成品牌 AI 可见度周报。输入品牌名、产品名和国家代码，自动从数据库拉取数据，生成专业 HTML+PDF 报告。

## 输入参数

从 `$ARGUMENTS` 解析三个参数：
- **品牌名**: 第一个词 (e.g., Supuon, Baseus, Ugreen)
- **产品名**: 第二个词 (e.g., pillow, charger)
- **国家代码**: 第三个词 (e.g., th, us, cn)

如果参数不完整，询问用户补充。

## 快速执行路径

直接运行两个命令即可（project root = `/Users/johnsonliu/Desktop/claude code/ai-rec-monitor`）：

```bash
cd "/Users/johnsonliu/Desktop/claude code/ai-rec-monitor"

# Step 1: 从数据库编译报告数据 JSON
python3 scripts/report/compile_report_data.py --brand <brand> --product <product> --region <country-code>

# Step 2: 用编译好的 JSON 生成 HTML + PDF
python3 scripts/report/gen_report.py scripts/report/<brand>-<product>_data.json

# Step 3: 打开 PDF
open docs/reports/<brand>-<product>-<date>.pdf
```

其中 `<brand>` 和 `<product>` 小写，`<date>` 格式为 `YYYY-MM-DD`。

## 高级路径（需要自定义数据时）

如果用户需要手动添加/修改数据（如 KOL 信息、自定义行动计划），使用 MCP avanti-geo tools：

1. **`list_brands`** — 确认品牌名拼写
2. **`get_runs`** — 找到最新完成的 run
3. **`get_run_detail`** — 获取完整 run 详情
4. **`get_competitor_comparison`** — 竞品对比
5. **`get_prompt_results`** — prompt 级别结果

然后手动编辑 JSON 数据文件，再运行 `gen_report.py`。

## 报告质量检查清单

生成后自动检查：
- 核心结论快照是否有具体数字
- KOL 徽章颜色是否与文本一致
- 行动计划是否具体可执行（包含关键词、达人名、平台）
- 竞品 SOV 总和是否合理
- 页码是否正确

## 输出

完成后告知用户：
1. PDF 文件路径
2. 关键指标摘要（GEO Score, SOV, 首要竞品, 首要行动）
3. 如需微调 → 编辑同目录 `.html` 文件，再用 Playwright 重新生成 PDF
