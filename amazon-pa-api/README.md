# Amazon Product Advertising API (PA-API) 接入指南

## 第一步：申请 Amazon Associates（联盟账号）

访问 [associates.amazon.com](https://associates.amazon.com) 免费注册。

**注意事项：**
- 需要填写一个网站 URL，可以直接填写 Vercel 部署地址（例如 `https://ai-rec-monitor.vercel.app`）
- 选择与选品分析相关的内容类别即可
- 审核通常 1-3 个工作日

---

## 第二步：完成资格要求

Associates 账号批准后，需在 **180 天内产生 3 笔有效销售**，账号才会正式激活。

- 在此之前可使用 **Developer Mode** 进行接口测试（返回模拟数据）
- 如暂无销售，可通过自购或朋友购买满足条件

---

## 第三步：获取 PA-API 凭证

Associates 账号激活后，前往以下地址申请 API 权限：

👉 [affiliate-program.amazon.com/gp/advertising/api/detail/main.html](https://affiliate-program.amazon.com/gp/advertising/api/detail/main.html)

获取以下三项凭证：

| 字段 | 说明 |
|------|------|
| `Access Key` | API 访问密钥 ID |
| `Secret Key` | API 访问密钥（保密，勿提交到 git） |
| `Partner Tag` | 联盟跟踪标签，格式如 `your-tag-20` |

---

## Endpoints（各站点）

| 市场 | Endpoint |
|------|----------|
| 美国 | `webservices.amazon.com` |
| 日本 | `webservices.amazon.co.jp` |
| 英国 | `webservices.amazon.co.uk` |
| 德国 | `webservices.amazon.de` |
| 加拿大 | `webservices.amazon.ca` |

---

## 主要 API 接口

| 接口 | 用途 |
|------|------|
| `SearchItems` | 按关键词/节点搜索商品，支持排序和过滤 |
| `GetBrowseNodes` | 获取类目树节点信息 |
| `GetItems` | 按 ASIN 批量获取商品详情（最多 10 个/次）|

---

## 速率限制

- 默认：**1 请求/秒**
- 可申请提升至 **5 TPS**（需证明有效流量，联系 Associates 支持团队）

---

## 可获取的数据字段

| 字段 | PA-API Resource |
|------|----------------|
| ASIN | 商品唯一标识 |
| 标题 | `ItemInfo.Title` |
| 品牌 | `ItemInfo.ByLineInfo` |
| 价格 | `Offers.Listings.Price` |
| BSR 排名 | `BrowseNodeInfo.BrowseNodes` |
| 评论数量 | `CustomerReviews.Count` |
| 评分 | `CustomerReviews.StarRating` |
| 类目 | `SearchRefinements.Refinements` |

---

## 快速安装

```bash
pip install python-amazon-paapi
```

详见 `scrape_bestsellers.py` 获取使用示例。
