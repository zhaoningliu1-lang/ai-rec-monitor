"""One-off script: fix truncated narrative + generate UGC for pillow data."""
import asyncio, json, os, re, sys
from pathlib import Path
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
load_dotenv(PROJECT_ROOT / ".env")

import anthropic

client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

PROMPT = """你是泰国母婴品牌 Supuon 的营销策略顾问。品牌产品: Baby Pillow（婴儿定型枕），主要在泰国 TikTok Shop 销售。

请完成两个任务。

任务1: 补全以下截断的跨平台分析叙述。从截断处续写，保持语气风格，补 100-150 字完成段落。
截断文本最后: "搜索趋势数据直接反映消费者的搜索兴趣，而AI系统会将搜索热度作为信号来调整推荐权重。当前可预见Supuon在"

任务2: 生成 UGC 用户内容激励方案（针对泰国市场的婴儿定型枕）。

返回严格JSON，不要有```json标记或其他文字，直接以{开头:
{
  "narrative_completion": "当前可预见Supuon在...续写完整...",
  "ugc_campaign": {
    "campaign_name": "活动名称（含泰语标签）",
    "description": "Campaign description in English, around 200 words, explaining the UGC campaign for Supuon Baby Pillow in Thailand. Focus on authentic content from Thai mothers about baby head shaping, sleep quality, and infant development.",
    "reward_tiers": [
      {"tier": "Gold (Best Story)", "criteria": "15-30s video testimonial with clear before/after narrative", "reward": "5,000 THB cash + Supuon Premium Pillow Set + 3-month ambassador contract"},
      {"tier": "Silver (Strong Story)", "criteria": "10-20s video or photo carousel with personal insight", "reward": "2,000 THB cash + Supuon Standard Pillow + accessories"},
      {"tier": "Bronze (Story Entry)", "criteria": "5-10s video or 3-4 photo post with genuine feedback", "reward": "500 THB cash + Supuon travel pillow"}
    ],
    "content_guidelines": ["guideline1", "guideline2", "guideline3", "guideline4", "guideline5"],
    "hashtags": ["#SupuonBaby", "#หมอนเด็กSupuon", "#tag3", "#tag4", "#tag5"],
    "sample_post": "示范帖子文案（含emoji和泰语标签，展示婴儿使用定型枕的真实体验）"
  }
}"""


async def main():
    data_path = PROJECT_ROOT / "scripts/report/supuon_pillow_data.json"
    data = json.loads(data_path.read_text(encoding="utf-8"))

    truncated = data["extended_narrative"]["cross_platform_narrative"]

    resp = await client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=4000,
        messages=[{"role": "user", "content": PROMPT}],
    )

    raw = resp.content[0].text.strip()
    # Remove markdown code block if present
    if raw.startswith("```"):
        raw = re.sub(r"^```\w*\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw)
    result = json.loads(raw)

    # 1. Fix narrative
    completion = result["narrative_completion"]
    cut_idx = truncated.index("当前可预见Supuon在")
    full_narrative = truncated[:cut_idx] + completion
    if not full_narrative.endswith(("。", "！", "？")):
        full_narrative += "。"
    data["extended_narrative"]["cross_platform_narrative"] = full_narrative
    print(f"叙述补全: {len(truncated)} -> {len(full_narrative)} 字")
    print(f"结尾: ...{full_narrative[-100:]}")

    # 2. Write UGC
    data["execution_deliverables"]["ugc_campaign"] = result["ugc_campaign"]
    print(f"UGC: {result['ugc_campaign'].get('campaign_name', 'N/A')}")

    data_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print("pillow JSON 已更新")


if __name__ == "__main__":
    asyncio.run(main())
