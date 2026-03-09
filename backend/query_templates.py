"""query_templates.py — 查询模板库
商业逻辑：意图权重越高，该查询对 GEO Score 的贡献越大
"""
from dataclasses import dataclass
from typing import List

@dataclass
class QueryTemplate:
    pattern: str         # 查询模板，{brand}/{category}/{usecase} 为占位符
    intent: str          # 意图类型
    weight: float        # 商业价值权重（买家决策意图越强越高）

# ── 权重定义 ─────────────────────────────────────────────
INTENT_WEIGHTS = {
    "best_for":      3.0,   # 最强购买意图
    "top_brands":    2.5,
    "vs_compare":    2.0,
    "recommend":     1.5,
    "problem_solve": 1.0,
}

# ── 核心模板库（50条，覆盖主流类目场景）─────────────────
BASE_TEMPLATES: List[QueryTemplate] = [
    # best_for — 最高权重（买家直接在问推荐）
    QueryTemplate("What is the best {category} to buy in 2025?",          "best_for", 3.0),
    QueryTemplate("Best {category} for {usecase}?",                        "best_for", 3.0),
    QueryTemplate("What {category} do experts recommend?",                 "best_for", 3.0),
    QueryTemplate("Top rated {category} right now?",                       "best_for", 3.0),
    QueryTemplate("Best budget {category} under $100?",                    "best_for", 3.0),
    QueryTemplate("Best premium {category} worth buying?",                 "best_for", 3.0),
    QueryTemplate("What {category} brand is most recommended by reviewers?", "best_for", 3.0),
    QueryTemplate("Best {category} for beginners?",                        "best_for", 3.0),
    QueryTemplate("Best {category} for professionals?",                    "best_for", 3.0),
    QueryTemplate("Which {category} brand has the best quality?",          "best_for", 3.0),

    # top_brands — 类目排名
    QueryTemplate("Top {category} brands in 2025",                         "top_brands", 2.5),
    QueryTemplate("Most popular {category} brands",                        "top_brands", 2.5),
    QueryTemplate("Which brands dominate the {category} market?",          "top_brands", 2.5),
    QueryTemplate("List the best {category} companies",                    "top_brands", 2.5),
    QueryTemplate("Who makes the best {category}?",                        "top_brands", 2.5),
    QueryTemplate("Leading {category} manufacturers",                      "top_brands", 2.5),
    QueryTemplate("{category} brand comparison",                           "top_brands", 2.5),
    QueryTemplate("Most trusted {category} brands",                        "top_brands", 2.5),
    QueryTemplate("{category} brands ranked by quality",                   "top_brands", 2.5),
    QueryTemplate("Reputable {category} brands",                           "top_brands", 2.5),

    # vs_compare — 竞品对比
    QueryTemplate("Is {brand} better than competitors?",                   "vs_compare", 2.0),
    QueryTemplate("{brand} vs other {category} brands",                   "vs_compare", 2.0),
    QueryTemplate("How does {brand} compare to {competitor}?",             "vs_compare", 2.0),
    QueryTemplate("{brand} alternatives worth considering",               "vs_compare", 2.0),
    QueryTemplate("Should I buy {brand} or something else?",              "vs_compare", 2.0),
    QueryTemplate("{brand} competitors in the {category} space",          "vs_compare", 2.0),
    QueryTemplate("Best {category} that is not {brand}",                  "vs_compare", 2.0),
    QueryTemplate("{brand} {category} review",                            "vs_compare", 2.0),
    QueryTemplate("Is {brand} worth buying in 2025?",                     "vs_compare", 2.0),
    QueryTemplate("{brand} pros and cons",                                "vs_compare", 2.0),

    # recommend — 推荐场景
    QueryTemplate("Recommend a {category} for everyday use",               "recommend", 1.5),
    QueryTemplate("What {category} should I buy as a gift?",               "recommend", 1.5),
    QueryTemplate("Suggest a reliable {category} brand",                   "recommend", 1.5),
    QueryTemplate("What {category} do most people buy?",                   "recommend", 1.5),
    QueryTemplate("Good {category} that lasts long",                       "recommend", 1.5),
    QueryTemplate("Affordable {category} with good quality",               "recommend", 1.5),
    QueryTemplate("What {category} does Amazon best seller list?",         "recommend", 1.5),
    QueryTemplate("Popular {category} on Amazon",                          "recommend", 1.5),
    QueryTemplate("Highly reviewed {category} brand",                      "recommend", 1.5),
    QueryTemplate("What {category} is everyone talking about?",            "recommend", 1.5),

    # problem_solve — 场景解决
    QueryTemplate("What {category} works best for cold weather?",          "problem_solve", 1.0),
    QueryTemplate("{category} that is safe for kids",                      "problem_solve", 1.0),
    QueryTemplate("Best eco-friendly {category}",                          "problem_solve", 1.0),
    QueryTemplate("{category} for heavy duty use",                         "problem_solve", 1.0),
    QueryTemplate("Quiet {category} for home use",                         "problem_solve", 1.0),
    QueryTemplate("Compact {category} for travel",                         "problem_solve", 1.0),
    QueryTemplate("{category} with longest warranty",                      "problem_solve", 1.0),
    QueryTemplate("Easy to use {category} for seniors",                    "problem_solve", 1.0),
    QueryTemplate("{category} with best customer support",                 "problem_solve", 1.0),
    QueryTemplate("{category} made in USA",                                "problem_solve", 1.0),
]

# ── 位置权重（AI 回答里提到品牌的位置）────────────────────
POSITION_WEIGHTS = {
    1: 1.00,
    2: 0.65,
    3: 0.40,
    4: 0.25,
    5: 0.15,
}
DEFAULT_POSITION_WEIGHT = 0.0  # 没被提及
