---
name: geo-deep-analysis
description: Deep multi-agent GEO analysis — launches parallel sub-agents for competitive intelligence, action plan generation, and quality assurance. Use when a standard /geo-report needs deeper strategic insights.
argument-hint: <brand> [product] [country-code]
user-invocable: true
---

# GEO Deep Analysis (Sub-Agent Architecture)

对品牌的 AI 可见度数据进行深度分析。与 `/geo-report` 不同，这个命令启动**多个并行子代理**，每个负责一个专业维度，最终汇总为一份高质量的战略报告。

## 输入参数

从 `$ARGUMENTS` 解析：
- **品牌名**: 必填 (e.g., Supuon, Baseus)
- **产品名**: 可选 (e.g., pillow, charger)
- **国家代码**: 可选 (e.g., th, us — 默认从最新 run 推断)

## 执行流程

### Phase 1: 数据获取（串行）

使用 MCP avanti-geo tools 拉取原始数据：

```
1. list_brands → 确认品牌名
2. get_runs(brand=<brand>, status=done) → 找最新 run
3. get_run_detail(run_id) → 完整 run 数据
4. get_prompt_results(run_id, limit=200) → 所有 prompt 结果
5. get_competitor_comparison(run_id) → 竞品数据
```

将数据保存为临时变量供下面的子代理使用。

### Phase 2: 并行子代理分析（使用 Task tool）

**同时启动以下 4 个子代理**（使用 Task tool，全部并行）：

#### Agent 1: 数据洞察分析师
```
Prompt: 分析以下 GEO 监控数据，提供 3-5 个关键洞察：
- 品牌在哪些 intent 类型表现最好/最差？
- 哪个 AI 引擎最友好/最不友好？
- 语言维度：本地语言 vs 英语的差距有多大？
- 时间趋势：是否有改善/恶化的迹象？
数据：[粘贴 run detail + SOV metrics]
```

#### Agent 2: 竞品情报分析师
```
Prompt: 分析竞品数据，回答：
- 最大竞品的 AI 可见度策略是什么？（从 cited_urls 推断）
- 竞品在哪些维度领先？（intent, 语言, 引擎）
- 品牌的最大差距在哪里？具体到可量化的百分点
- 用 SOV 数据计算：如果品牌做到 X，可以从竞品手里抢多少份额？
数据：[粘贴 competitor comparison + prompt results where competitors mentioned]
```

#### Agent 3: 行动计划生成器
```
Prompt: 基于以下数据，生成 3 个具体可执行的 GEO 优化行动：
每个行动必须包含：
- 具体做什么（不是"提高质量"，而是"在 TikTok Shop listing 的标题中加入这5个关键词：..."）
- 在哪个平台/渠道执行
- 预期影响（量化：SOV 提升 X%）
- 时间线和成本估算
- 验证方法（下次 GEO 扫描时检查什么指标）
数据：[粘贴 run detail + competitor comparison + recommendations]
```

#### Agent 4: 质量检查员
```
Prompt: 检查以下 GEO 数据的质量和一致性：
- SOV 总和是否在合理范围（80%-120%）？
- 是否有矛盾数据（如 KOL 标记为"已引用"但文本说"No evidence"）？
- 引用的 URL 是否有效？
- 是否有明显的幻觉（AI 生成了不存在的品牌/产品信息）？
数据：[粘贴 prompt results with cited_urls + raw_response samples]
```

### Phase 3: 汇总与输出

收集 4 个子代理的结果，整合成一份**战略分析摘要**：

1. **数据概览** — 来自 Agent 1 的关键洞察
2. **竞品态势** — 来自 Agent 2 的竞争情报
3. **行动计划** — 来自 Agent 3 的具体行动（已被 Agent 4 校验）
4. **数据质量注记** — 来自 Agent 4 的质量问题（如有）

将摘要以 Markdown 格式输出给用户，同时保存到 `docs/analysis/<brand>-<date>-deep-analysis.md`。

### Phase 4（可选）: 生成报告

如果用户要求，调用 `/geo-report` 的流程，使用 Agent 3 的行动计划替换默认行动计划，生成更高质量的 PDF 报告。

## 输出格式

```markdown
# [品牌] GEO Deep Analysis — [日期]

## 核心发现
- ...

## 竞品情报
- ...

## 行动计划
### Action 1: [具体标题]
- 做什么：...
- 平台：...
- 预期影响：SOV +X%
- 时间线：...
- 验证方法：...

### Action 2: ...

## 数据质量
- ...
```

## 何时使用

- 新客户首次 onboarding 时 → `/geo-deep-analysis Supuon pillow th`
- 客户要求更详细的竞品分析时
- 准备 QBR（季度回顾）时
- 行动计划需要更高精度时

普通周报 → 用 `/geo-report`
深度分析 → 用 `/geo-deep-analysis`
