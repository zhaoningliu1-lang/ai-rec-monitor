"""scorer.py — GEO Score 计算引擎"""
from dataclasses import dataclass, field
from typing import Dict, List, Optional
import re

from query_templates import POSITION_WEIGHTS, DEFAULT_POSITION_WEIGHT


@dataclass
class MentionResult:
    query: str
    intent: str
    weight: float           # intent 权重
    brand_position: int     # 0 = 未提及
    competitors_mentioned: List[str] = field(default_factory=list)
    raw_response: str = ""


@dataclass
class GEOReport:
    brand: str
    category: str
    geo_score: float                    # 0-100，越高越好
    sov: float                          # Share of Voice %
    total_queries: int
    brand_mentions: int
    avg_position: float                 # 平均提及位置
    intent_breakdown: Dict[str, dict]   # 按意图拆分
    top_competitors: List[dict]         # 竞品及其 SOV
    strengths: List[str]               # AI 是在哪些方面提及该品牌
    gaps: List[str]                    # AI 在哪些方面遗漏该品牌
    action_plan: List[str]             # 优先级行动计划


def extract_brand_position(response: str, brand: str) -> int:
    """
    从 AI 回答中找到品牌被提及的位置。
    返回 0 表示未提及。
    """
    brand_lower = brand.lower()
    lines = response.lower().split("
")

    # 方法 1：对于编号列表类型回答（1. Brand xxx  2. Other xxx）
    for i, line in enumerate(lines):
        if brand_lower in line:
            # 尝试从行首数字判断位置
            match = re.match(r"^\s*(\d+)[.\)]", line)
            if match:
                return int(match.group(1))
            # 如果没有编号，用行索引作为位置估算
            return i + 1

    return 0  # 未提及


def extract_competitors(response: str, brand: str, known_competitors: List[str]) -> List[str]:
    """从 AI 回答中提取竞品名称"""
    found = []
    response_lower = response.lower()
    for comp in known_competitors:
        if comp.lower() in response_lower and comp.lower() != brand.lower():
            found.append(comp)
    return found


def calculate_geo_score(results: List[MentionResult], brand: str) -> GEOReport:
    """
    核心计算逻辑：设计哲学是“充分考虑购买意图”
    """
    # 找出可能的类目
    category = results[0].query.split() [-1] if results else "unknown"

    # ── 计算原始分数 ──
    total_weighted_score = 0.0
    max_possible_score = 0.0
    brand_mentions = 0
    total_competitor_mentions: Dict[str, int] = {}
    intent_stats: Dict[str, dict] = {}
    all_positions = []
    strengths = []
    gaps = []

    for r in results:
        pos_weight = POSITION_WEIGHTS.get(r.brand_position, DEFAULT_POSITION_WEIGHT)
        score_contribution = r.weight * pos_weight
        total_weighted_score += score_contribution
        max_possible_score += r.weight * POSITION_WEIGHTS[1]  # 如果每次都是第一

        if r.brand_position > 0:
            brand_mentions += 1
            all_positions.append(r.brand_position)

            # 收集优势
            if r.brand_position == 1:
                strengths.append(f"Top mention for: "{r.query}"")
        else:
            # 收集短板
            gaps.append(f"Not mentioned for: "{r.query}"")

        # 意图分类统计
        if r.intent not in intent_stats:
            intent_stats[r.intent] = {"queries": 0, "mentions": 0, "score": 0.0}
        intent_stats[r.intent]["queries"] += 1
        intent_stats[r.intent]["score"] += score_contribution
        if r.brand_position > 0:
            intent_stats[r.intent]["mentions"] += 1

        # 竞品计数
        for comp in r.competitors_mentioned:
            total_competitor_mentions[comp] = total_competitor_mentions.get(comp, 0) + 1

    # ── GEO Score ──
    geo_score = round((total_weighted_score / max_possible_score * 100) if max_possible_score > 0 else 0, 1)

    # ── SOV ──
    total_mentions = brand_mentions + sum(total_competitor_mentions.values())
    sov = round((brand_mentions / total_mentions * 100) if total_mentions > 0 else 0, 1)

    # ── 平均位置 ──
    avg_position = round(sum(all_positions) / len(all_positions), 1) if all_positions else 0.0

    # ── 竞品排序 ──
    top_competitors = [
        {"name": c, "mentions": n, "sov": round(n / len(results) * 100, 1)}
        for c, n in sorted(total_competitor_mentions.items(), key=lambda x: -x[1])[:5]
    ]

    # ── 行动计划（简版，实际用 GPT-4 生成详细版） ──
    action_plan = _generate_action_hints(geo_score, intent_stats, top_competitors)

    return GEOReport(
        brand=brand,
        category=category,
        geo_score=geo_score,
        sov=sov,
        total_queries=len(results),
        brand_mentions=brand_mentions,
        avg_position=avg_position,
        intent_breakdown=intent_stats,
        top_competitors=top_competitors,
        strengths=strengths[:3],
        gaps=gaps[:3],
        action_plan=action_plan,
    )


def _generate_action_hints(geo_score: float, intent_stats: dict, competitors: list) -> List[str]:
    """基于得分和短板生成不过 5 条的优先行动"""
    actions = []

    if geo_score < 20:
        actions.append("Priority: Get cited by 2-3 authority review sites (Wirecutter, Tom's Guide) — this alone can add 15-25 GEO points")

    best_for_score = intent_stats.get("best_for", {}).get("score", 0)
    if best_for_score < 5:
        actions.append("Optimize product pages for 'best X for Y' queries — highest buying intent, currently weakest category")

    if competitors:
        top_comp = competitors[0]["name"]
        actions.append(f"Study {top_comp}'s citation sources — they dominate this category and their playbook is replicable")

    actions.append("Add structured FAQ schema to product pages targeting your weakest query types")
    actions.append("Pitch a product review unit to the top 3 YouTube reviewers in your category")

    return actions[:5]
