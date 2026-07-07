---
name: client-update
description: Update a client's GEO tracking file with latest scan results or action progress. Maintains cross-session memory for experiment tracking.
argument-hint: <brand> [action-note]
user-invocable: true
---

# Client Experiment Tracker

更新客户的 GEO 追踪文件。可以记录新的扫描结果、行动进展、或添加备注。

## 输入

- **品牌名**: $ARGUMENTS 的第一个词
- **备注（可选）**: $ARGUMENTS 剩余部分 — 如果提供了，直接作为行动备注记录

## 执行流程

### 1. 查找客户文件

文件位于 `~/.claude/projects/-Users-johnsonliu/memory/clients/<brand-slug>.md`

如果文件不存在，从数据库创建新文件：
```
1. 使用 MCP avanti-geo list_brands 确认品牌名
2. 使用 get_runs 查找最新 run
3. 使用 get_run_detail 获取 metrics
4. 创建新的 .md 文件（参考 clients/README.md 模板）
```

### 2. 更新 GEO Score 时间线

从数据库查询最新 run：
```
get_runs(brand=<brand>, status=done, limit=1)
get_sov_metrics(run_id)
```

在时间线表格中添加新行，与上次对比计算变化：
- GEO Score 升了多少
- SOV 变了多少
- 关键变化是什么

### 3. 记录行动进展

如果用户提供了 action-note，添加到"执行的行动"部分。
如果之前的 TODO 完成了，标记为 ✅。

### 4. 更新下次行动

基于最新数据，更新"下次行动"列表。
删除已完成的项目，添加新的建议。

## 输出

更新完成后，输出：
1. GEO Score 变化摘要（本次 vs 上次）
2. 已完成的行动数
3. 下一步建议

## 示例用法

```
/client-update Supuon                           # 用最新数据更新时间线
/client-update Supuon 完成了泰语关键词优化        # 记录行动进展
/client-update Baseus 开始 Reddit 内容投放       # 记录新行动
```
