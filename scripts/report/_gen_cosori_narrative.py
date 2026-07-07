#!/usr/bin/env python3
"""Generate extended narrative for Cosori GEO report using Claude API."""
import json, os, re, sys
import anthropic

DATA_PATH = "scripts/report/cosori-report_data.json"

with open(DATA_PATH) as f:
    d = json.load(f)

api_key = os.environ.get("ANTHROPIC_API_KEY", "")
if not api_key:
    print("ERROR: ANTHROPIC_API_KEY not set", file=sys.stderr)
    sys.exit(1)

client = anthropic.Anthropic(api_key=api_key)

def ask(prompt: str, max_tokens: int = 5000) -> dict | None:
    """Call Claude and return parsed JSON."""
    try:
        resp = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": prompt}]
        )
        text = resp.content[0].text.strip()
        # Strip markdown fences
        if text.startswith("```"):
            text = re.sub(r"^```[a-z]*\n?", "", text)
            text = re.sub(r"\n?```$", "", text.strip())
        return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"  JSON parse error: {e}\n  Response preview: {text[:300]}", file=sys.stderr)
        return None


# ── Part 1: Narrative analysis ─────────────────────────────────────────────
print("Generating Part 1 (narrative analysis)...")
p1_prompt = """
你是资深AI可见度策略顾问，为Cosori（厨房小家电，美国市场）撰写麦肯锡风格报告。

核心数据（真实扫描2026年3月，三引擎完整数据）：
- GEO Score: 80/100
- 提及率: 100%（ChatGPT+Claude+Gemini，60/60条全命中，三引擎均100%）
- Cosori平均引用位置: 第37字符
- Ninja: 第12字符 | Instant Pot: 第14字符 | Cuisinart: 第16字符
- Gemini: 100% 提及，20/20命中（2.5-flash，本次成功跑通）
- 三种意图（购买推荐/产品对比/品牌查询）在三个引擎均100%提及

返回JSON（key名严格匹配）：

{
  "executive_summary": "此处填500字执行摘要：核心悖论（100%提及但位置靠后）、三大紧急行动、量化目标",
  "diagnosis_narrative": "此处填800字诊断：①位置劣势根因（AI排序机制）②Gemini盲区风险③饱和品类从量到质的竞争转型",
  "engine_analysis": {
    "ChatGPT": "此处填200字：ChatGPT对Cosori的表现分析和机会点",
    "Claude": "此处填200字：Claude对Cosori的表现分析和机会点",
    "Gemini": "此处填200字：API异常说明、Gemini对厨房品类的重要性、补测紧迫性"
  },
  "intent_analysis": "此处填400字：购买推荐场景（Cosori vs Ninja首位竞争）、产品对比场景（差异化叙事机会）、品牌查询场景（存量用户服务）"
}

重要：JSON字段内的文字不要包含未转义的双引号，用中文书名号《》代替引用。
""".strip()

part1 = ask(p1_prompt, max_tokens=5000)
if not part1:
    print("Part 1 failed, aborting", file=sys.stderr)
    sys.exit(1)
print(f"  OK: {list(part1.keys())}")


# ── Part 2: Actions and summary ────────────────────────────────────────────
print("Generating Part 2 (actions and summary)...")
p2_prompt = """
你是资深AI可见度策略顾问，为Cosori（厨房小家电，美国市场）制定优化行动方案。

背景：GEO Score 80，100%被ChatGPT+Claude+Gemini三引擎全部提及（60/60），但位置排在Ninja之后（Cosori第37字符 vs Ninja第12字符），这是当前最核心的问题。

返回JSON（key名严格匹配，字段内文字避免使用双引号）：

{
  "optimization_playbook": {
    "immediate": [
      {
        "title": "立即优化Amazon产品标题和A+内容",
        "description": "在亚马逊所有ASIN的标题、bullet points和A+内容中植入AI高频搜索词，目标将AI引用位置从第37字符提升到20字符以内",
        "steps": ["审查主力ASIN标题，添加award-winning和best-seller等强信号词", "在A+内容中加入与Ninja的直接功能对比参数表", "在问答区预置AI高频搜索词的标准答案"]
      },
      {
        "title": "紧急补测Gemini AI可见度",
        "description": "Gemini本次API全部异常，Google AI Overview影响美国65%的厨房搜索流量，是最大盲区",
        "steps": ["手动测试20条厨房电器查询在Google Gemini中的结果", "记录Cosori的出现位置和被引用的表述方式", "联系Avanti团队确认Gemini API修复时间并安排补测"]
      },
      {
        "title": "在Reddit建立品牌内容据点",
        "description": "r/airfryer、r/Cooking等社区是ChatGPT和Claude训练语料的高权重来源，直接影响AI引用排名",
        "steps": ["在r/airfryer发布详细的产品使用体验帖（非广告风格）", "回答近30天所有关于空气炸锅推荐的问题", "建立每周维护计划保持社区存在感"]
      },
      {
        "title": "申请Wirecutter等权威媒体评测",
        "description": "The Wirecutter和Good Housekeeping的评测是AI引用最高频的第三方权威来源",
        "steps": ["联系The Wirecutter编辑提交最新旗舰空气炸锅评测申请", "向Good Housekeeping和Consumer Reports提供产品样品", "准备详细的产品技术规格对比文档辅助评测"]
      },
      {
        "title": "完善官网产品页面Schema结构化数据",
        "description": "JSON-LD结构化数据帮助AI更精准地解析和引用Cosori产品信息",
        "steps": ["为所有产品页面添加完整的Product和FAQ的JSON-LD Schema", "在FAQ Schema中写入针对AI高频搜索词的标准问答", "确保页面og:title和meta description包含核心品类关键词"]
      }
    ],
    "short_term": [
      {
        "title": "构建YouTube厨房品类权威内容矩阵",
        "description": "YouTube是Gemini和ChatGPT的重要语料来源，系统性内容创作可直接提升AI引用质量",
        "steps": ["制作Cosori vs Ninja深度对比系列视频（3-5条）", "发布产品使用教程和食谱内容提高品牌专业形象", "联系5位厨房KOL合作独立评测内容并跨平台分发"]
      },
      {
        "title": "Quora专业答主内容策略",
        "description": "Quora是ChatGPT训练数据的重要来源，高质量回答可直接提升AI引用的品牌权重",
        "steps": ["创建Cosori品牌Professional账号", "系统回答前100个厨房电器相关高流量问题", "每个回答提供具体使用场景数据和与竞品的客观比较"]
      },
      {
        "title": "媒体公关和第三方背书提升",
        "description": "AI引用的品牌权重很大程度来自第三方媒体的引用频率和权威性",
        "steps": ["聘请美国本土PR公司，目标CNET、TechCrunch、Wired", "推广Cosori独特技术卖点（VeSync App智能联动、精准温控）", "争取在厨房电器年终十佳榜单中获得靠前排名"]
      },
      {
        "title": "打造差异化品牌叙事锚点",
        "description": "在AI饱和品类中，唯一的突破口是建立Cosori的独特品类锚定认知",
        "steps": ["提炼Cosori有别于Ninja的核心差异化（智能互联生态）", "在所有内容中统一强化这一差异化叙事", "在专业厨师和美食博主群体中建立专业背书"]
      },
      {
        "title": "用户评价质量和数量双提升",
        "description": "Amazon评分和评价数量是AI评估品牌可信度的重要信号",
        "steps": ["启动用户评价激励计划提升4星和5星评价密度", "对已购用户进行结构化问卷收集使用体验数据", "将真实用户故事转化为UGC内容在各平台传播"]
      }
    ],
    "mid_term": [
      {
        "title": "建立AI可见度月度监控机制",
        "description": "将GEO监控纳入月度营销KPI，持续追踪AI引用位置和竞品动态",
        "steps": ["设置每月三引擎（ChatGPT+Claude+Gemini）GEO扫描", "建立AI引用位置变化预警机制（阈值触发报告）", "根据数据调整内容策略和投入分配"]
      },
      {
        "title": "多品类AI可见度系统性扩展",
        "description": "Cosori的脱水机、咖啡机等产品线需要独立的AI可见度策略",
        "steps": ["对脱水机和咖啡机品类进行独立GEO扫描", "识别各品类的头部AI引用竞品和差距", "制定品类差异化内容策略并分配专项预算"]
      },
      {
        "title": "建立可持续的内容生态运营体系",
        "description": "AI训练数据是持续更新的，需要建立长期内容生产能力",
        "steps": ["组建或外包Cosori美国内容团队", "建立内容生产流水线：每月4-6篇AI优化文章", "年度目标：在best air fryer核心查询中进入AI首位提及"]
      }
    ]
  },
  "conclusion": "此处填250字结论：核心发现总结、Cosori优势确认、最终行动号召",
  "summary_headline": "Cosori在ChatGPT、Claude、Gemini三大AI中均100%被提及——但首位缺席是本季最大增长机会",
  "key_insights": [
    "ChatGPT、Claude、Gemini三大AI引擎全部100%提及Cosori（60/60），是美国厨房品类AI可见度最强的品牌之一",
    "Ninja首提位置（第12字符）比Cosori（第37字符）快3倍，AI推荐中的首位效应正在系统性流失高意向购买用户",
    "三种意图（购买推荐/产品对比/品牌查询）全部100%命中，说明Cosori品牌认知度已建立，问题是排名优先级而非知名度",
    "品类竞争已从能否被提及转向能否排第一，Cosori现在需要从品牌存在感转型到AI首推地位的主动争夺"
  ],
  "next_week_focus": "聚焦首位竞争：更新Amazon旗舰ASIN的A+内容和标题植入AI高频词（3天），在r/airfryer发布高质量内容建立权威据点（3天），申请Wirecutter产品评测（1天）"
}

重要：JSON字段内避免双引号，用书名号或括号替代。
""".strip()

# Ask only for conclusion — playbook/summary/key_insights are pre-defined in prompt
# to avoid token overflow issues with large structured JSON
p2_conclusion_only = """
为Cosori（厨房小家电，美国市场，GEO Score 80，三引擎均100%提及，位置第37字符）写结论段落。
返回纯JSON：{"conclusion": "此处250-300字，总结三引擎全覆盖的优势、位置劣势的战略意义、以及行动号召"}
""".strip()
part2_conclusion = ask(p2_conclusion_only, max_tokens=1000)

# Build part2 with pre-defined content + generated conclusion
PLAYBOOK = {
    "immediate": [
        {"title": "立即优化Amazon产品标题和A+内容",
         "description": "在所有主力ASIN标题、bullet points和A+内容中植入AI高频搜索词，目标将AI引用位置从第37字符提升到20字符以内",
         "steps": ["审查主力ASIN标题，添加award-winning和best-seller等强信号词", "在A+内容中加入与Ninja的直接功能对比参数表", "在问答区预置AI高频搜索词的标准答案"]},
        {"title": "在Reddit建立品牌权威内容据点",
         "description": "r/airfryer、r/Cooking等社区是ChatGPT和Claude训练语料的高权重来源，直接影响AI引用排名",
         "steps": ["在r/airfryer发布详细产品使用体验帖（非广告风格）", "回答近30天所有关于空气炸锅推荐的问题", "建立每周维护计划保持社区存在感"]},
        {"title": "申请Wirecutter等权威媒体评测",
         "description": "The Wirecutter和Good Housekeeping的评测是AI引用最高频的第三方权威来源，直接影响AI排名权重",
         "steps": ["联系The Wirecutter编辑提交最新旗舰空气炸锅评测申请", "向Good Housekeeping和Consumer Reports提供产品样品", "准备详细产品技术规格对比文档辅助评测"]},
        {"title": "完善官网Schema结构化数据",
         "description": "JSON-LD结构化数据帮助AI更精准地解析和优先引用Cosori产品信息",
         "steps": ["为所有产品页面添加完整的Product和FAQ的JSON-LD Schema", "在FAQ Schema写入AI高频搜索词的标准问答对", "确保og:title和meta description包含核心品类关键词"]},
        {"title": "强化Cosori vs Ninja差异化内容",
         "description": "在AI饱和品类中，差异化叙事是争夺首位提及的核心策略",
         "steps": ["提炼Cosori独特卖点（VeSync智能互联、精准温控）", "在所有平台内容中统一强化这一差异化叙事", "创作Cosori独特功能的深度评测内容"]},
    ],
    "short_term": [
        {"title": "构建YouTube厨房品类权威内容矩阵",
         "description": "YouTube是Gemini和ChatGPT的重要语料来源，系统性内容创作可直接提升AI引用质量和位置",
         "steps": ["制作Cosori vs Ninja深度对比系列视频（3-5条）", "发布产品使用教程和食谱内容提高品牌专业形象", "联系5位厨房KOL合作独立评测内容并跨平台分发"]},
        {"title": "Quora专业答主内容策略",
         "description": "Quora是ChatGPT训练数据的重要来源，高质量回答可直接提升AI品牌引用权重",
         "steps": ["创建Cosori品牌Professional账号", "系统回答前100个厨房电器相关高流量问题", "每个回答提供具体使用场景数据和客观对比"]},
        {"title": "媒体公关和第三方背书提升",
         "description": "AI引用品牌权重很大程度来自第三方媒体引用频率，媒体背书是提升排名的最有效手段",
         "steps": ["聘请美国本土PR公司，目标CNET、TechCrunch、Wired", "推广Cosori独特技术卖点（VeSync App智能联动）", "争取在厨房电器年终十佳榜单中获得靠前排名"]},
        {"title": "Amazon评价质量和数量双提升",
         "description": "评分和评价数量是AI评估品牌可信度的重要信号，直接影响AI引用的首位竞争",
         "steps": ["启动用户评价激励计划提升4星5星评价密度", "对已购用户进行结构化问卷收集真实使用体验", "将真实用户故事转化为UGC内容跨平台传播"]},
        {"title": "打造差异化品类锚定叙事",
         "description": "建立Cosori独有的AI可识别标签，使AI在特定子品类查询中优先调用Cosori",
         "steps": ["确定Cosori的独特品类锚点（智能互联厨房生态）", "在所有内容中统一强化这一差异化定位", "在专业厨师和美食博主群体中建立专业背书"]},
    ],
    "mid_term": [
        {"title": "建立AI可见度月度监控机制",
         "description": "将GEO监控纳入月度营销KPI，持续追踪三引擎AI引用位置和竞品动态",
         "steps": ["设置每月ChatGPT+Claude+Gemini三引擎GEO扫描", "建立AI引用位置变化预警机制（阈值触发报告）"]},
        {"title": "多品类AI可见度系统性扩展",
         "description": "Cosori的脱水机、咖啡机等产品线需要独立的AI可见度策略",
         "steps": ["对脱水机和咖啡机品类进行独立GEO扫描", "制定品类差异化内容策略并分配专项预算"]},
        {"title": "建立可持续内容生态运营体系",
         "description": "AI训练数据持续更新，需要建立长期内容生产能力保持竞争优势",
         "steps": ["组建或外包Cosori美国内容团队", "年度目标：在best air fryer核心查询中进入AI首位提及"]},
    ],
}

part2 = {
    "optimization_playbook": PLAYBOOK,
    "conclusion": part2_conclusion.get("conclusion", "") if part2_conclusion else "",
    "summary_headline": "Cosori在ChatGPT、Claude、Gemini三大AI中均100%被提及——但首位缺席是本季最大增长机会",
    "key_insights": [
        "ChatGPT、Claude、Gemini三大AI引擎全部100%提及Cosori（60/60），是美国厨房品类AI可见度最强的品牌之一",
        "Ninja首提位置（第12字符）比Cosori（第37字符）快3倍，AI推荐中的首位效应正在系统性流失高意向购买用户",
        "三种意图（购买推荐/产品对比/品牌查询）全部100%命中，说明Cosori品牌认知度已建立，核心问题是排名优先级",
        "品类竞争已从能否被提及转向能否排第一，Cosori需要从品牌存在感转型到AI首推地位的主动争夺",
    ],
    "next_week_focus": "聚焦首位竞争：更新Amazon旗舰ASIN的A+内容植入AI高频词（3天），在r/airfryer发布高质量内容建立权威据点（3天），申请Wirecutter产品评测（1天）",
}
print(f"  OK: {list(part2.keys())}")

# ── Merge and save ─────────────────────────────────────────────────────────
narrative = {**part1, **part2}
d["extended_narrative"] = narrative
if narrative.get("key_insights"):
    d["key_insights"] = narrative["key_insights"]
if narrative.get("summary_headline"):
    d["summary_headline"] = narrative["summary_headline"]
if narrative.get("next_week_focus"):
    d["next_week_focus"] = narrative["next_week_focus"]

with open(DATA_PATH, "w") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

print("✓ cosori-report_data.json updated with full narrative")
print()
print("=== Summary Headline ===")
print(narrative.get("summary_headline", ""))
print()
print("=== Key Insights ===")
for ki in narrative.get("key_insights", []):
    print(" -", ki)
