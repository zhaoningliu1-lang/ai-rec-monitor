# Avanti GEO 品牌报告 — 标准工作流

> 适用场景：为任何跨境卖家/品牌方交付一份 McKinsey 风格的 AI 可见度品牌诊断报告
> 参考实战：Olayks 品牌，2026-03-17～18，成果：53 页报告，3 市场 × 4 品类 × 1,200 次 AI 查询
> 负责人：Avanti Intelligence · avantia2a.com

---

## 整体流程图

```
客户 Onboarding
      ↓
Phase 0: 品牌摸底（1-2小时）
      ↓
Phase 1: 平台数据采集（2-4小时）
      ↓
Phase 2: GEO Runs 提交 & 等待（30-60分钟）
      ↓
Phase 3: 数据汇总 & 分析（1-2小时）
      ↓
Phase 4: 报告生成（30分钟）
      ↓
交付 PDF + 简报
```

---

## Phase 0：客户 Onboarding（问卷 + 摸底）

### 0.1 收集客户基本信息

必须拿到：
- **品牌英文名**（精确拼写，含大小写）
- **主力销售平台**：Amazon US/UK/DE/JP / Shopee TH/MY/ID / Lazada TH / TikTok Shop TH / 其他
- **主要市场国家**：确认主力消费者语言（关键！影响 GEO Runs 语言配置）
- **核心产品类目**（最多 4 个）：例如 electric hot pot / baby pillow / breast pump
- **主要竞品**（3-5 个）：**必须是在目标市场实际销售的竞品**，不要用全球品牌替代本地品牌
- **价格段**：budget (<$50) / mid ($50-150) / premium (>$150)
- **主要店铺 URL**（Shopee店/Lazada店/Amazon Store/TikTok Shop，至少提供一个）

### 0.1.5 ⚠️ 东南亚市场补充确认（SEA 客户必做）

如果主力市场是 TH / MY / ID / VN / PH：

```
□ Shopee 店铺 URL（Shopee TH/MY/ID 等）
□ Lazada 店铺 URL
□ TikTok Shop 店铺 URL
□ 主力竞品是本地品牌还是国际品牌？（泰国婴儿用品竞品：Iflin Baby, Airy, STEVENS 等本地品牌）
□ 品牌在 mybest.th / theAsianparent / productnation.co/th 等本地编辑媒体有收录吗？
□ Pantip.com 上有没有品牌提及？（Google: site:pantip.com <品牌名>）
□ GEO Runs 语言分配确认：泰语 ≥50% / 英语 35% / 其他 15%
```

问卷模板：`/docs/Avanti-品牌信息收集表.docx`

### 0.2 快速背景调研（人工，15分钟）

```bash
# Google 搜索确认品牌存在感
"<品牌名> review" → 有无编辑媒体覆盖？
"site:reddit.com <品牌名>" → Reddit 存在感？
"site:quora.com <品牌名>" → Quora 存在感？
"<品牌名> Amazon" → 主力 ASIN 确认
```

记录到：`/tmp/<brand>_onboarding_notes.md`

---

## Phase 1：平台数据采集

> 所有脚本均可调用已有的采集工具，结果保存到 `/tmp/<brand>_*.json`

### 1.1 Amazon 产品数据

**工具**：Amazon PA-API 或 Scrapling

采集内容：
- 每个 ASIN 的完整标题（title）
- Bullet Points（feature_bullets，至少 5 条）
- 评分（rating）
- 评价数（ratings_total）
- 价格（price）
- 产品图片 URL

```python
# 参考脚本：scripts/scrape_bestsellers.py
# 或直接用 MCP avanti-geo: get_products_by_brand
```

保存：`/tmp/amazon_<brand>_products_final.json`

**立即做的分析**：
1. 标题前 3 个词是否包含品牌名？（品牌名位置 = AI 权重核心）
2. Bullet Points 中是否存在品牌错误（如 Brecious → Olayks）？
3. 信任语言词汇计数：warranty / durability / certified / tested / guarantee
4. 演示语言词汇计数：easy to clean / smooth operation / good for daily use

### 1.2 Amazon 客户评价

采集：近期 20-50 条评价，含评分和文本

```bash
# 参考：Scrapling PlayWrightFetcher 抓取 Amazon 评价页
```

保存：`/tmp/amazon_<brand>_reviews_final.json`

关注：
- 1-2 星差评中提到的产品缺陷
- 5 星好评中的具体使用场景描述（可作为 Quora Q&A 素材）

### 1.3 YouTube 视频数据

```bash
# 使用 yt-dlp 搜索品牌名相关视频
yt-dlp --flat-playlist --dump-json "ytsearch50:<品牌名> juicer review" > /tmp/yt_raw.json

# 提取关键字段
python3 -c "
import json, sys
with open('/tmp/yt_raw.json') as f:
    lines = f.readlines()
videos = []
for line in lines:
    d = json.loads(line)
    videos.append({
        'id': d.get('id'),
        'title': d.get('title'),
        'uploader': d.get('uploader'),
        'view_count': d.get('view_count', 0),
        'upload_date': d.get('upload_date'),
        'url': d.get('webpage_url'),
        'description': d.get('description', '')[:300],
    })
with open('/tmp/<brand>_youtube.json', 'w') as f:
    json.dump(videos, f, indent=2)
"
```

分析维度：
- 总视频数 & 总播放量
- 语言分布（EN / DE / JP / 其他）
- 内容类型：演示型 / 评测型 / 对比型
- Top 5 视频创作者 & 播放量
- **关键判断**：有无"品牌对比评测"类长视频（AI 引用率最高的格式）

保存：`/tmp/<brand>_youtube_all.json`

### 1.4 TikTok 视频数据

```bash
# 同样用 yt-dlp
yt-dlp --flat-playlist --dump-json "https://www.tiktok.com/search?q=<品牌名>" > /tmp/tt_raw.json
```

分析维度：
- 总视频数 & 总播放量 & 总点赞数
- Top 5 视频（播放量最高）
- 内容类型：演示 / 开箱 / 食谱 / 推广
- **关键判断**：TikTok 视频内容≠AI 训练数据，但帖子文字描述可被索引

保存：`/tmp/<brand>_tiktok_all.json`

### 1.5 Reddit 数据

```bash
# 方法 1：Google 索引检查
搜索: site:reddit.com <品牌名>
结果数 = Google 认为有价值的 Reddit 提及数量

# 方法 2：直接 Reddit 搜索（用 Avanti 平台的 Reddit 工具）
# MCP: search_brand_across_subreddits(brand=<品牌名>)
```

分析：
- Google 索引的 Reddit 帖数（0 = 严重缺口）
- 相关 Subreddits：r/<品类> 社区规模
- 有机帖 vs 推广帖比例
- 真实用户投诉（差评）提取

保存：`/tmp/<brand>_reddit_summary.json`

### 1.6 Google SERP 分析

```bash
# 搜索: "<品牌名> <产品> review"
# 记录前 10 条自然结果的来源
```

检查项：
- 品牌词搜索：有无编辑评测（Wirecutter / CNET / Spruce Eats / Tom's Guide）？
- 泛品类词（如"best cold press juicer"）：品牌是否出现？
- 付费广告：品牌词和品类词有无竞价？

保存：`/tmp/<brand>_google_serp.json`

### 1.7 媒体覆盖（Wirecutter / CNET / Spruce Eats 等）

```bash
# 检查各大媒体站内搜索
# Wirecutter: https://www.nytimes.com/wirecutter/search/?q=<品牌名>
# CNET: https://www.cnet.com/search/?query=<品牌名>
# Spruce Eats: site:thespruceeats.com <品牌名>
```

关键结论：有 / 无覆盖，及竞品在哪些媒体有覆盖

### 1.8 Quora & Pinterest

```bash
# Quora: Google 搜索 site:quora.com <品牌名>
# Pinterest: 直接搜索 <品牌名> 计数
```

### 1.8 ⚠️ Avantia 平台工具调用（必做，所有市场）

> **这是最容易被遗忘但内容量最大的步骤。** avantia2a.com 平台已内置 6 个分析工具，必须全部跑一遍并把结果截图/数据存档，作为报告独立章节的素材来源。

#### 1.8.1 Hallucination Checker（AI 幻觉检测）

访问：`https://avantia2a.com/hallucination` 或 API：
```bash
curl "https://ai-rec-monitor-production.up.railway.app/hallucination/run" \
  -X POST -H "Content-Type: application/json" \
  -d '{"brand": "<品牌名>", "category": "<品类>", "num_checks": 20}'
```

记录：
- 总检查项数 / 通过数 / 告警数
- 告警内容：AI 错误引用了哪些事实（规格/价格/成分）
- 保存：`/tmp/<brand>_hallucination.json`

#### 1.8.2 Reddit 实时搜索 + 交叉验证

访问：`https://avantia2a.com/reddit` 或 API：
```bash
# 搜索
curl "https://ai-rec-monitor-production.up.railway.app/reddit/search?brand=<品牌名>&category=<品类>"
# 交叉验证（Reddit 情感 vs GEO SOV → 4类洞察）
curl "https://ai-rec-monitor-production.up.railway.app/reddit/cross-validate?brand=<品牌名>&run_id=<run_id>"
```

记录：
- 帖子总数 / 有机讨论数 / deal 帖数
- 情感分布：正面 / 中性 / 负面
- 与 GEO SOV 的对齐程度（aligned / opportunity / risk / critical）
- 保存：`/tmp/<brand>_reddit_xval.json`

#### 1.8.3 KOL 追踪（YouTube 数据）

访问：`https://avantia2a.com/kol` 或 API：
```bash
curl "https://ai-rec-monitor-production.up.railway.app/kol/search?brand=<品牌名>&category=<品类>"
curl "https://ai-rec-monitor-production.up.railway.app/kol/cross-validate?brand=<品牌名>&run_id=<run_id>"
```

记录：
- YouTube 视频总数 / 总播放量
- Top 5 创作者及播放量
- KOL-AI 交叉验证：KOL 视频是否被 AI 引用？
- 保存：`/tmp/<brand>_kol_data.json`

#### 1.8.4 TikTok 数据

```bash
curl "https://ai-rec-monitor-production.up.railway.app/tiktok/search?q=<品牌名>"
curl "https://ai-rec-monitor-production.up.railway.app/tiktok/brand?brand=<品牌名>"
```

记录：
- TikTok 商品数 / 总销量（若有 TikTok Shop 数据）
- 或注明"需登录验证，官方账号 @<handle> 状态"
- 保存：`/tmp/<brand>_tiktok.json`

#### 1.8.5 Google Trends

访问：`https://avantia2a.com/trends` 或直接用 pytrends：
```python
from pytrends.request import TrendReq
pt = TrendReq()
pt.build_payload(kw_list=['<品牌名>', '<竞品1>', '<竞品2>'], geo='US', timeframe='today 12-m')
df = pt.interest_over_time()
# 保存热度数据
```

记录：
- 过去 12 个月搜索热度趋势
- 与 Top 竞品对比指数
- 保存：`/tmp/<brand>_trends.json`

#### 1.8.6 Market Signals（综合信号）

访问：`https://avantia2a.com/market-signals` 或 API：
```bash
curl "https://ai-rec-monitor-production.up.railway.app/market-signals?brand=<品牌名>&category=<品类>"
```

记录：
- Market-AI Alignment Score（0-100）
- Reddit 情感得分 / KOL 覆盖 / TikTok 存在 / Google 趋势 / 一致性
- 保存：`/tmp/<brand>_market_signals.json`

**完成后检查清单：**
```
□ hallucination.json 已生成（含告警列表）
□ reddit_xval.json 已生成（含情感 + 交叉验证）
□ kol_data.json 已生成（含 YouTube 视频列表）
□ tiktok.json 已生成（或注明访问限制原因）
□ trends.json 已生成
□ market_signals.json 已生成
```

---

### 1.9 ⚠️ SEA 市场专项采集（东南亚客户必做）

#### 1.9.1 本地编辑媒体检查（AI 训练权重最高）

这是 SEA 品牌 GEO 低分的**最主要原因**：AI 训练时大量抓取编辑类产品推荐文章。

```bash
# 泰国市场关键站点（AI 训练权重 = 高）
# mybest.th：https://th.my-best.com/search?q=<品牌名>
# theAsianparent TH：https://th.theasianparent.com/?s=<品牌名>
# productnation.co/th：https://productnation.co/th/?s=<品牌名>
# bonnykids.com：https://www.bonnykids.com/search?q=<品牌名>

# 同类别前10推荐文章里的品牌 = 直接竞品（AI 会推荐这些品牌而不是你）
# 例：mybest.th "หมอนเด็ก" Top10 = Clevamama, Iflin Baby, Airy, STEVENS, Siamlatex
#     mybest.th "เครื่องปั๊มนม" Top10 = Spectra, Attitude mom, Medela, Youha Plus, Pigeon
```

检查项：
- [ ] 品牌是否出现在任何一篇"TOP 10 推荐"文章中？
- [ ] 同类别的 TOP 10 里有哪些真实竞品？（这些才是正确的 GEO Runs 竞品配置）
- [ ] 有哪些媒体站点可以联系争取收录？

#### 1.9.2 Shopee / Lazada 采集

```bash
# Shopee TH: https://shopee.co.th/search?keyword=<品牌名>
# 记录：店铺评分、评价数、Best Seller 标志、价格
# Lazada TH: https://www.lazada.co.th/catalog/?q=<品牌名>

# 用 Scrapling 或手动记录：
# - 品牌主店铺 URL
# - 主力 SKU 的评价数（泰语评价是 AI 训练数据来源）
# - 竞品在 Shopee 的排名位置
```

保存：`/tmp/<brand>_shopee_th.json`

#### 1.9.3 Pantip.com 社区检查

```bash
# Google: site:pantip.com <品牌名>
# 如果结果 = 0 条 → 严重缺口（填入报告红色警告）
# 如果有结果 → 记录帖子 URL、评论情感

# 相关版块（泰国妈妈最活跃）：
# 育儿版：https://pantip.com/forum/family
# 购物版：https://pantip.com/forum/buyingguide
```

**判断标准**：
- 0 条 Pantip 提及 = GEO 低分原因之一，列入行动计划
- 有负面帖 = 幻觉风险，标注在报告中
- 泰国市场 Pantip ≈ Reddit，AI 训练权重等同

#### 1.9.4 TikTok Shop Thailand 数据（已有 API）

```python
# 用现有 tiktok_shop.py 查品牌在 TikTok Shop TH 的数据
from app.services.tiktok_shop import search_products

products = await search_products(keyword='<品牌名>', region='TH')
# 记录：商品数、总评价数、总销量、价格区间
```

fastmoss.com 也可查 TikTok Shop 销售数据（无需 API）：
```
https://www.fastmoss.com/search/?keyword=<品牌名>&region=TH
```

---

## Phase 2：GEO Runs 提交

### 2.1 确定 Run 配置

| 参数 | 说明 | 示例 |
|------|------|------|
| brand_name | 品牌英文名（精确） | "Olayks" |
| category | 产品类目（英文） | "electric hot pot" |
| region | 市场 | US / UK / DE / JP |
| num_prompts | 每个 Run 的 AI 查询数 | 100（快速）/ 300（标准） |
| providers | AI 引擎 | ["openai", "gemini", "claude"] |
| competitor_names | 竞品列表 | ["Instant Pot", "Cuisinart", "Dash"] |
| price_band | 价格段 | "budget" / "mid" / "premium" |

**标准配置：4 品类 × 3 市场 = 12 Runs，每个 300 prompts，共 3,600 次查询**

### 2.2 批量提交脚本

```python
# 参考：/scripts/batch_runs.py 或手动提交

import httpx, json

BASE = 'https://ai-rec-monitor-production.up.railway.app'
BRAND = '<品牌名>'

configs = [
    {'category': '<品类1>', 'region': 'US'},
    {'category': '<品类1>', 'region': 'UK'},
    {'category': '<品类1>', 'region': 'DE'},
    # ... 重复 4 个品类
]

runs = []
for cfg in configs:
    payload = {
        'brand_name': BRAND,
        'category': cfg['category'],
        'region': cfg['region'],
        'num_prompts': 300,
        'providers': ['openai', 'gemini', 'claude'],
        'competitor_names': ['<竞品1>', '<竞品2>', '<竞品3>'],
        'price_band': 'budget',
    }
    r = httpx.post(f'{BASE}/runs', json=payload, timeout=30)
    if r.status_code in [200, 202]:
        run_data = r.json()
        runs.append({
            'id': run_data['id'],
            'code': run_data.get('code', ''),
            'category': cfg['category'],
            'region': cfg['region'],
        })
        print(f"✓ {cfg['category']} {cfg['region']}: {run_data['id']}")
    else:
        print(f"✗ {cfg['category']} {cfg['region']}: HTTP {r.status_code}")
        print(r.text[:200])

with open(f'/tmp/<brand>_runs.json', 'w') as f:
    json.dump(runs, f, indent=2)
print(f'共提交 {len(runs)} 个 Run')
```

**注意**：API 返回 HTTP 202 = 已接受/排队，不是错误。务必从 response body 提取 run ID。

### 2.3 监控进度（后台轮询）

```python
# /tmp/poll_runs.py — 每60秒检查一次，全部完成后保存 metrics
import httpx, json, time, sys

BASE = 'https://ai-rec-monitor-production.up.railway.app'
with open('/tmp/<brand>_runs.json') as f:
    runs = json.load(f)

while True:
    all_done = True
    for run in runs:
        r = httpx.get(f'{BASE}/runs/{run["id"]}', timeout=20)
        d = r.json()
        done = d.get('progress_done', 0)
        total = d.get('progress_total', 300)
        print(f"  {run['code']} {run['category'][:15]} {run['region']} {done/total*100:.0f}%")
        if d.get('status') != 'done':
            all_done = False

    if all_done:
        # 收集所有 metrics
        all_metrics = {}
        for run in runs:
            m = httpx.get(f'{BASE}/runs/{run["id"]}/metrics', timeout=30)
            key = f"{run['category']}_{run['region']}"
            all_metrics[key] = m.json()
        with open(f'/tmp/<brand>_metrics.json', 'w') as f:
            json.dump(all_metrics, f, indent=2, default=str)
        print('✓ ALL DONE — metrics saved')
        sys.exit(0)
    time.sleep(60)
```

等待时间：每个 Run 约 5-10 分钟，12 个 Run 并行约 30-40 分钟。

---

## Phase 3：数据汇总 & 分析

### 3.1 提取核心指标

```python
import json

with open('/tmp/<brand>_metrics.json') as f:
    metrics = json.load(f)

# 遍历所有 category × region
for key, data in metrics.items():
    bt = data.get('brand_table', [])
    olayks = next((b for b in bt if b.get('is_primary')), {})
    comps = [b for b in bt if not b.get('is_primary')]
    top_comp = min(comps, key=lambda x: x.get('avg_position', 999)) if comps else {}

    print(f"{key}:")
    print(f"  Olayks SOV={olayks.get('sov')}%  pos={olayks.get('avg_position')}  arrs={olayks.get('arrs')}")
    print(f"  Top Comp: {top_comp.get('name')} pos={top_comp.get('avg_position')} sov={top_comp.get('sov')}%")
```

关键指标汇总表：

| 指标 | 说明 | 警戒线 |
|------|------|--------|
| SOV (Share of Voice) | AI 推荐列表中品牌占比 | < 15% = 危险 |
| avg_position | 品牌在 AI 列表中的平均排名 | > 30 = 危险 |
| mention_rate | 300 次查询中被提及比例 | < 50% = 危险 |
| arrs | AI Recommendation Relevance Score | < 25 = 危险 |
| sov_high | 高购买意图查询中的 SOV | < 15% = 关键危险 |

### 3.2 首推率分析（First-Mention Analysis）

```python
# 从 run results 中提取真实首推品牌
import httpx
from collections import Counter

run_id = '<juicer_US_run_id>'
r = httpx.get(f'{BASE}/runs/{run_id}/results?limit=300', timeout=60)
results = r.json()

brand_list = ['<品牌名>', '<竞品1>', '<竞品2>', '<竞品3>', '<竞品4>']
counter = Counter()
for res in results:
    resp = res.get('raw_response', '')
    positions = {}
    for b in brand_list:
        idx = resp.lower().find(b.lower())
        if idx >= 0:
            positions[b] = idx
    if positions:
        first = min(positions, key=positions.get)
        counter[first] += 1

print("首推分布:", counter.most_common(10))
```

### 3.3 幻觉检测

```python
# 检查 brand_mentioned=True 但品牌未在文本中出现的情况
false_positives = 0
true_positives = 0
for res in results:
    mentioned = res.get('brand_mentioned', False)
    in_text = '<品牌名小写>' in res.get('raw_response', '').lower()
    if mentioned and not in_text:
        false_positives += 1
    elif mentioned and in_text:
        true_positives += 1

print(f"False Positive: {false_positives}, True Positive: {true_positives}")

# 检查 AI 是否捏造不存在的品牌
# （检查回复中出现的品牌名是否都是真实存在的）
```

### 3.4 生成分析摘要 JSON

```python
summary = {
    '<region>_<brand>': {
        'name': '<品牌名>',
        'sov': <float>,
        'avg_position': <float>,
        'mention_count': <int>,
        'arrs': <float>,
    },
    '<region>_comps': [<竞品数据列表>],
    '<region>_first': [['竞品名', 次数], ...],  # 首推分布
    'yt_views': <int>,
    'tt_plays': <int>,
}
with open('/tmp/<brand>_analysis_summary.json', 'w') as f:
    json.dump(summary, f, indent=2)
```

---

## Phase 4：报告生成

### 4.1 数据文件清单（报告生成器依赖）

```
/tmp/<brand>_all_metrics.json        ← GEO runs 全量 metrics（所有品类+市场）
/tmp/<brand>_analysis_summary.json   ← 提炼后的核心指标
/tmp/amazon_<brand>_products_final.json  ← Amazon SKU 数据
/tmp/amazon_<brand>_reviews_final.json   ← 客户评价
/tmp/<brand>_youtube_all.json            ← YouTube 视频列表
/tmp/<brand>_tiktok_all.json             ← TikTok 视频列表
/tmp/<brand>_additional_platforms.json   ← Reddit/Google/Quora/Pinterest
/tmp/<brand>_media_coverage.json         ← 媒体覆盖情况
```

### 4.2 报告生成脚本

**⚠️ 重要：必须使用完整版报告生成器（30+ 页），不能用简化版 gen_report.py（8页）**

#### 选项 A：使用现有品牌报告作为模板（推荐）

```bash
# 以 SENSARTE 为例（最新完整版模板）
cp scripts/report/gen_sensarte_report.py scripts/report/gen_<品牌名>_report.py
# 修改头部变量：
```
```python
BRAND_NAME = "<品牌名>"
BRAND_ZH = "<品牌中文名>"
REPORT_DATE = "2026年X月X日"
NUM_QUERIES = <总查询数>   # 例：2400
NUM_CATEGORIES = <品类数>  # 例：4
NUM_ENGINES = 3            # openai/gemini/claude
NUM_SKUS = <SKU数>         # Amazon 在售 SKU 数
```

#### 选项 B：全新品牌从 gen_olayks_report.py 改

```bash
cp scripts/report/gen_olayks_report.py scripts/report/gen_<品牌名>_report.py
```

**报告必须包含的页面（目标 30-53 页）：**
```
□ 封面（1页）
□ 目录（1页）
□ CEO Brief / Executive Summary（2页）
□ GEO Score 概览 + 因素分解（2页）
□ 每个 AI 引擎深度分析（每个引擎1页 = 3页）
□ 查询样本展示（2页）
□ 竞品格局分析（2页）
□ Amazon 品牌概览（1页）
□ Amazon 旗舰 SKU 深度页（每个 SKU 1页，至少4页）
□ Amazon 评价情感分析（1页）
□ YouTube KOL 分析（2页）
□ Reddit 分析（2页）
□ TikTok 状态（1页）
□ 媒体覆盖缺口分析（1页）
□ Hallucination 检测结果（1页）
□ GEO 优化行动计划（3-4页，每个行动1/2页）
□ ROI Roadmap 12周路线图（1页）
□ 附录：品类基准对比（1页）
```

**少于 20 页 = 不合格，不能交付给客户**

### 4.3 生成命令

```bash
cd /tmp
python3 gen_<brand>_report.py
# 输出：/tmp/<brand>_report_FINAL.html
#       /tmp/<brand>_report_FINAL.pdf
open /tmp/<brand>_report_FINAL.pdf
```

### 4.4 报告质量自检清单

生成后立即检查：

**内容层面**：
- [ ] 封面 5 指标（总查询数 / 品类数 / 市场数 / AI 引擎 / SKU 数）与实际数据一致
- [ ] CEO Brief 中品牌首推率数据来自真实首推分析（不是 brand_mentioned 字段）
- [ ] Amazon SKU 审计展示了所有真实 ASIN 和完整标题
- [ ] Brecious / 同类品牌名错误已被标红
- [ ] 平台数据使用了真实数字（不是估算）
- [ ] FAQ Schema 第 1-5 条为完整 JSON-LD，第 6-10 条已模糊处理

**设计层面**：
- [ ] TOC 页码靠右定格
- [ ] 所有页面背景为深色（#0d1b2e）
- [ ] 橙色强调色（#FF6B35）
- [ ] 页脚显示 avantia2a.com
- [ ] 无"麦肯锡风格"等字样出现在正文

**商业层面**：
- [ ] 数据合作/代为执行部分提及 hello@avantia2a.com
- [ ] FAQ 模糊部分包含解锁 CTA
- [ ] GEO Growth 套餐价格标注（$799/月）

---

## Phase 5：交付 + 客户行动说明

### 5.1 交付物

1. **PDF 报告**：`<品牌名>-geo-brand-report-<日期>.pdf`
2. **客户行动说明**（必须附带，见 5.3）：直接告诉客户接下来做什么
3. **下次扫描时间**：建议 4 周后重新跑 GEO Runs 对比变化

### 5.2 关键数字提炼（用于邮件/微信同步）

```
品牌：<品牌名>
报告日期：<日期>
核心发现：
  - GEO 评分：<X>/100（类别平均分：<Y>）
  - AI 首推率：<X>/300（主力市场最强品类）
  - 总体 SOV：约 <X>%（各品类平均）
  - 最大竞品：<竞品名>（avg_position <X>）
  - 立即行动（第一步）：<最高优先级单项行动>
```

### 5.3 客户行动说明模板（标准附件）

> **规则**：不要问客户"看完报告有什么问题吗"，直接告诉他们做三件事。
> 分析性内容放报告里，行动说明只讲 **做什么 → 在哪里做 → 结果是什么**。

---

**[品牌名] GEO 提升行动清单**

报告结论：GEO 评分 <X>/100，主要原因是 AI 训练数据中缺乏对品牌的权威引用。

**第一步（本周内）：修改产品 listing**
- 在 [Shopee/Lazada/Amazon] 产品详情页末尾加 FAQ 板块
- 5-8 个问答，格式：「<品牌名> <产品> 安全吗？」「有没有认证？」「和 <竞品> 比哪个好？」
- 每个问题用客户语言写（泰语/英语双语）
- 预期效果：4-6 周内 AI 开始引用 FAQ 内容

**第二步（未来 2-4 周）：KOL 合作**
- 目标：<市场> 育儿类 KOL，粉丝 1-5 万（腰部即可，不需要头部）
- 视频内容：真实使用测评，视频描述用产品名+使用场景+品牌名（关键词）
- 平台优先级：<TikTok/YouTube> → 其他
- 预期效果：8-12 周内 AI 搜到 KOL 内容并开始引用

**第三步（4-8 周）：媒体/社区提及**
- 目标站点（AI 训练权重最高）：
  - <mybest.th/theAsianparent/productnation.co/th>（编辑评测，发邮件申请送评）
  - <Pantip.com / Reddit r/XXX>（真实用户帖，不是广告）
- 具体行动：向 mybest.th 编辑发送产品样品申请评测收录
- 预期效果：3-6 个月后 GEO 评分提升 15-30 分

---

下次复查：<日期+4周> 重新跑扫描，用数据对比三步动作的效果。

---

## 数据文件命名规范

```
amazon_<brand>_products_final.json    ← Amazon SKU
amazon_<brand>_reviews_final.json     ← 评价
<brand>_youtube_all.json              ← YouTube
<brand>_tiktok_all.json               ← TikTok
<brand>_additional_platforms.json     ← 多平台
<brand>_media_coverage.json           ← 媒体
<brand>_analysis_summary.json         ← 核心指标摘要
<brand>_runs.json                     ← Run ID 记录
<brand>_all_metrics.json              ← 全量 metrics
```

所有文件存于 `/tmp/` 目录（临时）或 `/scripts/report/<brand>_data.json`（长期存档）。

---

## 常见问题 & 解决方案

| 问题 | 原因 | 解决 |
|------|------|------|
| API 返回 HTTP 202 | 正常，202 = 已接受/排队 | 从 response body 提取 run ID |
| brand_mentioned=True 但品牌不在文本中 | 平台检测算法 false positive | 做首推分析 + 在报告中注明 |
| 某个 Run 卡住不动 | 后台任务异常 | 等 5 分钟，重新提交 |
| Playwright PDF 生成失败 | 依赖问题 | `playwright install chromium` |
| 报告某页文字溢出 | 内容过多 | 在页面函数中减少 padding 或字体 |
| 数据文件不存在 | Phase 1 未完成 | 按 Phase 1 顺序重新采集 |

---

## 时间估算

| 阶段 | 说明 | 时间 |
|------|------|------|
| Phase 0 | 客户 onboarding | 30-60 分钟 |
| Phase 1 | 平台数据采集 | 2-4 小时（首次）/ 1-2 小时（熟练后）|
| Phase 2 | GEO Runs 提交 + 等待 | 40-60 分钟 |
| Phase 3 | 数据分析汇总 | 1-2 小时 |
| Phase 4 | 报告生成 | 30-60 分钟 |
| **合计** | | **约 6-9 小时** |

随着经验积累和工具自动化，目标压缩到 **4-5 小时**。

---

## 参考文件

- **SENSARTE 完整版报告生成器（最新模板）**：`scripts/report/gen_sensarte_report.py`（~2000行，30+页）
- Olayks 报告生成器：`scripts/report/gen_olayks_report.py`（1157行）
- 旧版简化报告（仅8页，不建议）：`scripts/report/gen_report.py` + `template.html`
- Supuon 实战数据：`scripts/report/supuon_pillow_data.json`

## avantia2a.com 平台功能对应表

| 功能 | 网址 | API 端点 | 报告章节 |
|------|------|---------|---------|
| GEO Monitor | /monitor | /runs | GEO Score + 引擎分析 |
| Hallucination Checker | /hallucination | /hallucination/run | 幻觉检测页 |
| Reddit Search | /reddit | /reddit/search | Reddit 分析页 |
| KOL Tracker | /kol | /kol/search | YouTube KOL 页 |
| TikTok Data | /tiktok | /tiktok/search | TikTok 状态页 |
| Market Signals | /market-signals | /market-signals | 市场信号综合页 |
| Google Trends | /trends | /trends | 趋势分析页 |

---

*文档版本：v1.2 · 2026-03-24 · Avanti Intelligence*
*v1.2 更新：新增 Phase 1.8 Avantia 平台工具调用（6个工具全流程），更新 Phase 4.2 报告模板（SENSARTE 版本取代旧 Olayks /tmp 路径），增加报告最低页数要求（30页）*
*v1.1 更新：补充 Phase 5 客户行动说明模板 + Phase 0.1.5 SEA 专项 checklist + Phase 1.9 东南亚采集步骤*
*实战来源：Supuon（泰国，2026-03-19）+ SENSARTE（美国，2026-03-24）*
