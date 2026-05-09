import Link from "next/link";

export const metadata = {
  title: "研究报告与卖家指南 — 阿凡提",
  description: "阿凡提 发布的 AI 可见度审计报告、选品情报分析与跨境卖家策略指南，每月更新。",
};

const POSTS = [
  {
    slug: "2026-05-09-geo-industry-update",
    tag: "GEO优化",
    title: "新GEO趋势：提升亚马逊AI可见性",
    excerpt:
      "了解新的GEO策略、AI品牌引用及亚马逊技巧。",
    date: "2026年5月9日",
    readTime: "8 分钟阅读",
  },
  {
    slug: "2026-05-08-ai-recommendation-trends",
    tag: "AI趋势",
    title: "AI趋势：本周跨境电商中AI推荐的热门产品",
    excerpt:
      "探索本周AI推荐的热门产品类别及其对品牌SOV的影响。",
    date: "2026年5月8日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-05-07-smart-home-ai-trends",
    tag: "智能家居AI",
    title: "智能家居AI主导：品牌与趋势深度解析",
    excerpt:
      "探讨智能家居技术中的AI趋势，聚焦顶级品牌及其策略。",
    date: "2026年5月7日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-05-06-cross-border-ecommerce-ai-intelligence",
    tag: "电商, AI",
    title: "通过AI提前发现竞争前的采购机会",
    excerpt:
      "了解中国亚马逊卖家如何利用AI推荐数据来盈利采购。",
    date: "2026年5月6日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-05-05-geo-industry-update",
    tag: "电商分析",
    title: "GEO 行业更新：提升AI可见性的全新策略",
    excerpt:
      "了解品牌提升AI可见性的最新GEO策略。",
    date: "2026年5月5日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-05-04-ai-recommendation-trends-cross-border-ecommerce-weekly",
    tag: "每周GEO情报",
    title: "AI推荐趋势周报：哪些品牌正在赢得AI曝光份额？",
    excerpt:
      "每周监测ChatGPT、Claude、Gemini、Perplexity四大AI模型的跨境电商品牌推荐份额与品类趋势。",
    date: "2026年5月4日",
    readTime: "7 分钟阅读",
  },
  {
    slug: "2026-05-03-beauty-tech-ai-recommendations",
    tag: "美妆科技",
    title: "美妆科技的AI崛起：哪家品牌主导？",
    excerpt:
      "探寻哪些美妆科技品牌在AI推荐中领先及其原因。",
    date: "2026年5月3日",
    readTime: "7 分钟阅读",
  },
  {
    slug: "2026-05-02-cross-border-ecommerce-ai-chinese-sellers",
    tag: "电商",
    title: "AI推动中国卖家抢先一步：使用GEO数据获取商机",
    excerpt:
      "利用AI分析帮助中国亚马逊卖家发现电商机会，使用GEO数据见解。",
    date: "2026年5月2日",
    readTime: "6分钟阅读",
  },
  {
    slug: "2026-05-01-geo-strategies-ai-visibility",
    tag: "GEO策略",
    title: "提升品牌在AI中的可见度：新的GEO时代",
    excerpt:
      "探讨最新GEO趋势及策略，如何在AI中提升品牌可见度。",
    date: "2026年5月1日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-04-30-AI-recommendation-trends",
    tag: "AI趋势",
    title: "AI趋势：跨境电商中的热门产品类别",
    excerpt:
      "探索本周AI推荐趋势和热门产品类别。",
    date: "2026年4月30日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "2026-04-29-smart-home-device-ai-trends",
    tag: "智能家居",
    title: "智能家居设备：AI趋势和顶级品牌",
    excerpt:
      "分析顶级智能家居品牌：了解在2026年AI推荐中占主导地位的是哪些品牌",
    date: "2026年4月29日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "2026-04-28-cross-border-ecommerce-ai-intelligence",
    tag: "电商",
    title: "利用AI在亚马逊上寻找采购机会",
    excerpt:
      "发现AI趋势，帮助中国卖家通过数据洞察超越竞争对手。",
    date: "2026年4月28日",
    readTime: "7 分钟阅读",
  },
  {
    slug: "2026-04-27-geo-industry-update",
    tag: "GEO策略",
    title: "提升品牌可见性的新GEO策略",
    excerpt:
      "探索提升AI可见性和品牌引用的新GEO策略。",
    date: "2026年4月27日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "2026-04-26-ai-recommendation-trends",
    tag: "AI趋势",
    title: "在线卖家必看：AI驱动的热门产品类别推荐",
    excerpt:
      "了解最新的AI推荐趋势，关注主要产品类别和品牌。",
    date: "2026年4月26日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-04-25-portable-electronics-ai-recommendations",
    tag: "便携电子产品洞察",
    title: "2026年便携电子产品的AI推荐分析",
    excerpt:
      "探索便携电子产品领域的AI推荐：顶级品牌、洞察和市场趋势。",
    date: "2026年4月25日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-04-24-cross-border-ecommerce-ai-intelligence",
    tag: "电商智能",
    title: "利用AI识别跨境电商机会",
    excerpt:
      "了解中国卖家如何使用AI见解在亚马逊上获得竞争优势。",
    date: "2026年4月24日",
    readTime: "7分钟阅读",
  },
  {
    slug: "2026-04-23-geo-industry-update",
    tag: "AI可见性",
    title: "新GEO策略：提升AI可见性",
    excerpt:
      "探索最新GEO策略，提升亚马逊品牌和卖家的AI可见性。",
    date: "2026年4月23日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "2026-04-22-ai-recommendation-trends-ecommerce",
    tag: "AI趋势",
    title: "AI趋势：跨境电商中的热门产品类别",
    excerpt:
      "探索最新的AI驱动产品推荐及其对跨境电商策略的影响。",
    date: "2026年4月22日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "2026-04-21-ai-recommendations-smart-home",
    tag: "AI推荐",
    title: "智能家居AI趋势：揭示领先品牌",
    excerpt:
      "探索智能家居技术中的AI引用趋势，重点介绍领先品牌。",
    date: "2026年4月21日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-04-20-ai-recommendation-sourcing-opportunities",
    tag: "AI采购",
    title: "利用AI提前锁定盈利商品",
    excerpt:
      "通过AI洞察及GEO评分优化中国卖家的采购决策。",
    date: "2026年4月20日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-04-19-geo-industry-update",
    tag: "GEO策略",
    title: "提升AI可见性：2026年GEO策略",
    excerpt:
      "探讨提升品牌可见性的关键GEO策略和亚马逊的AI引用变化。",
    date: "2026年4月19日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-04-18-ai-recommendation-trends",
    tag: "AI电商趋势",
    title: "AI提升科技与服装卖家可见度",
    excerpt:
      "了解AI如何影响跨境电商及关键品牌趋势。",
    date: "2026年4月18日",
    readTime: "7 分钟阅读",
  },
  {
    slug: "2026-04-17-category-spotlight-beauty-tech",
    tag: "美容科技分析",
    title: "AI主导的美容科技：主要品牌与见解",
    excerpt:
      "通过数据驱动的见解探索AI如何影响美容科技。",
    date: "2026年4月17日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-04-16-cross-border-ecommerce-ai-intelligence",
    tag: "AI与电子商务",
    title: "利用AI：率先发现采购机会",
    excerpt:
      "如何利用AI推荐帮助中国卖家在竞争对手之前发现采购机会。",
    date: "2026年4月16日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "2026-04-15-geo-industry-update",
    tag: "GEO策略",
    title: "GEO 最新动态：提升品牌AI可见性策略",
    excerpt:
      "在2026年，探索提高品牌AI可见性的策略。",
    date: "2026年4月15日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-04-14-ai-recommendation-trends-cross-border-ecommerce",
    tag: "电商趋势",
    title: "跨境电商中的AI推荐趋势",
    excerpt:
      "了解亚马逊卖家AI推荐的热门品类及品牌可见度。",
    date: "2026年4月14日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "2026-04-13-smart-home-trends",
    tag: "智能家居",
    title: "智能家居科技：AI驱动的品牌主导力",
    excerpt:
      "探索智能家居科技中的AI推荐和领先品牌。",
    date: "2026年4月13日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-04-12-cross-border-ai-intelligence",
    tag: "电商",
    title: "利用AI提升跨境电商中的采购机会",
    excerpt:
      "利用AI工具在亚马逊上抢占采购先机。",
    date: "2026年4月12日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-04-11-geo-industry-update",
    tag: "GEO策略",
    title: "提升品牌AI可见性的新GEO策略",
    excerpt:
      "了解通过AI模型提升品牌可见性的策略。",
    date: "2026年4月11日",
    readTime: "7 分钟阅读",
  },
  {
    slug: "2026-04-10-ai-recommendation-trends",
    tag: "AI趋势",
    title: "AI推荐：本周热门商品类别",
    excerpt:
      "了解本周电商中AI推荐的热门商品类别。",
    date: "2026年4月10日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "2026-04-09-smart-home-ai-recommendations",
    tag: "电商趋势",
    title: "智能家居引领AI推荐潮流",
    excerpt:
      "探索智能家居类别中的AI推荐趋势，了解哪些品牌领先及原因。",
    date: "2026年4月9日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-04-08-ai-intelligence-chinese-sellers",
    tag: "AI趋势",
    title: "利用AI数据赢取跨境采购先机",
    excerpt:
      "通过AI洞察在电商中发现采购机会，为中国亚马逊卖家提供数据驱动的策略。",
    date: "2026年4月8日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-04-07-geo-industry-update",
    tag: "GEO策略",
    title: "GEO行业更新：提升AI可见性的新策略",
    excerpt:
      "探索品牌如何提升AI可见性的新策略，学习适用于亚马逊卖家的实用战术。",
    date: "2026年4月7日",
    readTime: "4 分钟阅读",
  },
  {
    slug: "2026-04-06-ai-recommendation-trends",
    tag: "AI趋势",
    title: "本周AI推荐的跨境电商热门品类及品牌SOV数据",
    excerpt:
      "深入了解AI推荐的品类及品牌SOV数据，以帮助卖家。",
    date: "2026年4月6日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-04-05-smart-home-ai-recommendations",
    tag: "智能家居",
    title: "智能家居：AI推荐趋势深度分析",
    excerpt:
      "了解在智能家居领域占据主导地位的品牌及其AI推荐。",
    date: "2026年4月5日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "2026-04-04-cross-border-ecommerce-ai-intelligence",
    tag: "电商见解",
    title: "利用AI在采购中超越竞争对手",
    excerpt:
      "发现中国卖家如何利用AI数据在亚马逊上找到采购机会。",
    date: "2026年4月4日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-04-03-geo-industry-update",
    tag: "AI与电商",
    title: "GEO更新：提升品牌可见性的新AI策略",
    excerpt:
      "探索通过AI提升亚马逊品牌可见性的最新趋势。",
    date: "2026年4月3日",
    readTime: "8 分钟阅读",
  },
  {
    slug: "2026-04-02-ai-recommendation-trends-cross-border-ecommerce",
    tag: "AI洞察",
    title: "AI趋势：跨境电商中的产品推荐",
    excerpt:
      "发现本周AI驱动的产品推荐和跨境电商中的卖家机会。",
    date: "2026年4月2日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "2026-04-01-portable-electronics-ai-recommendations",
    tag: "AI驱动趋势",
    title: "AI 洞察：便携电子产品品牌观察",
    excerpt:
      "深入分析AI驱动的便携电子产品趋势，重点品牌解析。",
    date: "2026年4月1日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-03-31-cross-border-ecommerce-ai-intelligence",
    tag: "人工智能与电商",
    title: "人工智能助力中国卖家抢先发现采购机会",
    excerpt:
      "了解中国亚马逊卖家如何利用AI识别采购机会与GEO数据。",
    date: "2026年3月31日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "2026-03-30-geo-industry-update",
    tag: "GEO策略",
    title: "通过GEO提升品牌知名度的新策略",
    excerpt:
      "探索通过GEO提升品牌和亚马逊卖家AI可见度的新策略。",
    date: "2026年3月30日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-03-29-ai-recommendation-trends-cross-border-ecommerce-weekly",
    tag: "每周AI趋势",
    title: "AI推荐周报：四大AI模型本周最推荐哪些品类和品牌？",
    excerpt:
      "基于ChatGPT、Claude、Gemini和Perplexity的跨境电商AI推荐趋势周报，含品牌SOV数据与卖家行动建议。",
    date: "2026年3月29日",
    readTime: "7 分钟阅读",
  },
  {
    slug: "2026-03-28-smart-home-ai-recommendations",
    tag: "AI趋势",
    title: "智能家居领域的AI推荐：谁是领军者？",
    excerpt:
      "了解哪些品牌在智能家居设备AI推荐中占据主导地位。",
    date: "2026年3月28日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-03-27-ai-recommendation-ecommerce",
    tag: "AI智能",
    title: "利用AI数据在电商采购中抢占先机",
    excerpt:
      "了解中国亚马逊卖家如何利用AI数据发现采购机会。",
    date: "2026年3月27日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-03-26-geo-industry-update-strategies",
    tag: "AI策略",
    title: "2026年提升AI可见性的GEO新策略",
    excerpt:
      "探索2026年亚马逊卖家利用AI提升品牌可见性的最新GEO策略。",
    date: "2026年3月26日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-03-25-ai-recommendation-trends-cross-border-ecommerce-weekly",
    tag: "每周AI趋势",
    title: "AI推荐趋势周报：哪些品类正在赢得AI模型的推荐份额？",
    excerpt:
      "基于42,000+条AI购物回复的跨境电商品类与品牌SOV数据分析，含ChatGPT、Claude、Gemini、Perplexity四大模型。",
    date: "2026年3月25日",
    readTime: "7 分钟阅读",
  },
  {
    slug: "2026-03-24-category-spotlight-smart-home",
    tag: "智能家居",
    title: "智能家居AI：哪些品牌主导推荐？",
    excerpt:
      "了解哪些智能家居品牌在AI推荐中领先，以及它们成功的原因。",
    date: "2026年3月24日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "2026-03-23-ai-recommendation-china-sourcing",
    tag: "AI与采购",
    title: "借助AI提升跨境电商采购：针对中国卖家的顶级建议",
    excerpt:
      "了解AI战术，帮助中国卖家在亚马逊上抢先发现采购机会。",
    date: "2026年3月23日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-03-22-GEO-industry-update",
    tag: "AI策略",
    title: "GEO行业更新：增强AI可见性的最新策略",
    excerpt:
      "了解品牌提升AI可见性的最新GEO策略以及AI如何引用品牌的新变化对亚马逊卖家的影响。",
    date: "2026年3月22日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "2026-03-21-ai-recommendation-trends",
    tag: "AI趋势",
    title: "跨境电商中的AI推荐趋势",
    excerpt:
      "了解AI推荐最新趋势对跨境销售的影响。",
    date: "2026年3月21日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-03-20-ai-recommendations-beauty-tech",
    tag: "美容科技",
    title: "AI在美容科技市场的影响",
    excerpt:
      "探索AI对美容科技品牌和推荐的影响。",
    date: "2026年3月20日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-03-19-cross-border-ecommerce-ai-intelligence",
    tag: "AI电子商务",
    title: "使用AI数据发掘亚马逊选品良机",
    excerpt:
      "利用AI数据，帮助中国卖家在亚马逊上发现选品机会。",
    date: "2026年3月19日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "2026-03-18-geo-industry-update",
    tag: "AI策略",
    title: "提升AI可见性的GEO新策略",
    excerpt:
      "探索提升品牌在AI聚光灯下存在感的最新GEO策略。",
    date: "2026年3月18日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "2026-03-17-ai-recommendation-trends",
    tag: "AI趋势",
    title: "跨境电商中的AI推荐趋势",
    excerpt:
      "本周顶级AI推荐产品类别与品牌见解。",
    date: "2026年3月17日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "ai-poisoning-vs-visibility",
    tag: "行业立场",
    title: "AI 投毒 vs AI 可见度管理：阿凡提的立场",
    excerpt:
      "2026 年央视 3.15 晚会曝光了 AI 数据投毒灰产。我们做监测，不做操纵。了解 AI 投毒与正当 AI 可见度管理的本质区别。",
    date: "2026年3月15日",
    readTime: "8 分钟阅读",
  },
  {
    slug: "2026-03-14-geo-industry-update",
    tag: "AI推荐趋势",
    title: "提升品牌AI可见性的GEO新策略",
    excerpt:
      "探索最新GEO策略如何提升亚马逊卖家的AI可见性。",
    date: "2026年3月14日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-03-13-ai-recommendation-trends",
    tag: "AI趋势",
    title: "AI为跨境电商产品推荐趋势分析",
    excerpt:
      "了解AI模型如何影响跨境电商的发展趋势。",
    date: "2026年3月13日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "2026-03-12-category-spotlight-beauty-tech",
    tag: "美妆科技",
    title: "美妆科技AI推荐表现：谁是主导者？",
    excerpt:
      "深入分析在美妆科技领域中，哪些品牌引领AI推荐及其原因。",
    date: "2026年3月12日",
    readTime: "6 分钟阅读",
  },
  {
    slug: "2026-03-11-ai-recommendation-sourcing-opportunities",
    tag: "跨境AI",
    title: "中国亚马逊卖家如何利用AI优化选品",
    excerpt:
      "通过AI推荐及数据分析来抢占跨境电商选品先机。",
    date: "2026年3月11日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "2026-03-10-geo-industry-update",
    tag: "电商",
    title: "2026年GEO趋势：提升亚马逊的AI可见性",
    excerpt:
      "探索品牌提升AI可见性和增长亚马逊销售的最新策略。",
    date: "2026年3月10日",
    readTime: "5 分钟阅读",
  },
  {
    slug: "insta360-vs-dji",
    tag: "GEO 案例分析",
    title: "Insta360 vs DJI：消费者向 AI 询问相机推荐时，谁赢了？",
    excerpt:
      "我们在 ChatGPT、Claude、Gemini 和 Perplexity 上运行了 47 个查询。DJI 的 AI 可见度是 Insta360 的 2.3 倍——但差距可以弥补。这是完整分析。",
    date: "2026年3月",
    readTime: "8 分钟",
  },
  {
    slug: "portable-power-ai-ranking",
    tag: "AI 选品报告",
    title: "ChatGPT 正在推荐这些便携储能品牌——2025 卖家选品报告",
    excerpt:
      "200+ 次查询覆盖 4 个 AI 引擎。EcoFlow 以 34% SOV 主导，Jackery 保持 28.7%。完整排名及机会空白在哪里。",
    date: "2026年3月",
    readTime: "7 分钟",
  },
  {
    slug: "why-ai-ignores-your-brand",
    tag: "GEO 入门指南",
    title: "为什么 AI 不提你的品牌：跨境卖家 GEO 入门指南",
    excerpt:
      "你的品牌在亚马逊有 4.4 分和 2000 条评论。ChatGPT 还是推荐了你的竞争对手。5 个原因，以及你现在能做什么。",
    date: "2026年3月",
    readTime: "6 分钟",
  },
  {
    slug: "helium10-vs-avanti",
    tag: "工具对比",
    title: "Helium 10 vs 阿凡提：传统选品工具 vs AI 可见度监控",
    excerpt:
      "Helium 10 告诉你上个月卖了什么。阿凡提 告诉你 AI 今天正在推荐什么。诚实的对比——以及每种工具适合什么场景。",
    date: "2026年3月",
    readTime: "5 分钟",
  },
  {
    slug: "ai-cost-guide-2025",
    tag: "运营指南",
    title: "2025 跨境卖家省钱指南：5 个 AI 现在就能替代的运营环节",
    excerpt:
      "大多数品牌每月花 800–2000 美元雇人做 AI 几秒钟搞定的事。以下是具体怎么省——以及如何把节省的钱投入 GEO。",
    date: "2026年3月",
    readTime: "6 分钟",
  },
];

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  "行业立场":      { bg: "rgba(255,68,77,0.12)",  color: "#ff4d6d" },
  "GEO 案例分析":  { bg: "rgba(255,107,53,0.12)", color: "#ff6b35" },
  "AI 选品报告":   { bg: "rgba(34,197,94,0.10)",  color: "#22c55e" },
  "GEO 入门指南":  { bg: "rgba(245,166,35,0.10)", color: "#f5a623" },
  "工具对比":      { bg: "rgba(112,112,160,0.12)", color: "#9090c0" },
  "运营指南":      { bg: "rgba(96,165,250,0.10)",  color: "#60a5fa" },
};

export default function ZhBlogIndexPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      <div className="space-y-2">
        <div
          className="inline-block text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
        >
          阿凡提 研究
        </div>
        <h1 className="text-3xl font-bold mt-3">GEO 报告与卖家策略指南</h1>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          真实的 AI 可见度审计、选品情报分析与跨境运营策略指南——每月更新。
        </p>
      </div>

      <div className="space-y-4">
        {POSTS.map((post) => {
          const tagStyle = TAG_COLORS[post.tag] ?? { bg: "rgba(255,107,53,0.12)", color: "#ff6b35" };
          return (
            <Link
              key={post.slug}
              href={`/zh/blog/${post.slug}`}
              className="block rounded-xl p-6 transition-colors group"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div className="space-y-3">
                <div
                  className="inline-block text-xs px-2.5 py-0.5 rounded-full font-medium"
                  style={{ background: tagStyle.bg, color: tagStyle.color }}
                >
                  {post.tag}
                </div>
                <h2
                  className="text-lg font-semibold leading-snug group-hover:text-white transition-colors"
                  style={{ color: "#f0f0f8" }}
                >
                  {post.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
                  {post.excerpt}
                </p>
                <div
                  className="flex items-center gap-4 text-xs pt-1"
                  style={{ color: "#7070a0" }}
                >
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>阅读时长 {post.readTime}</span>
                  <span
                    className="ml-auto font-medium group-hover:text-white transition-colors"
                    style={{ color: "#ff6b35" }}
                  >
                    阅读报告 →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div
        className="rounded-xl p-6 text-center space-y-3"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="text-sm font-medium">想让我们为你的品牌出一份报告？</p>
        <p className="text-xs" style={{ color: "#7070a0" }}>
          免费 GEO 诊断，查看你在品类内的 AI 可见度 vs 所有竞品。
        </p>
        <Link
          href="/zh/signup"
          className="inline-block text-sm font-medium px-5 py-2 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          立即免费诊断 →
        </Link>
      </div>
    </div>
  );
}
