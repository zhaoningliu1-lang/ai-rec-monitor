/* ─── Research Report Data & Types ─── */

export interface ResearchReport {
  slug: string;
  categoryKey: string;
  tag: { en: string; zh: string };
  title: { en: string; zh: string };
  excerpt: { en: string; zh: string };
  date: string;       // ISO date string
  dateLabel: { en: string; zh: string };
  readTime: { en: string; zh: string };
}

export const CATEGORIES = [
  { key: "baby",        en: "Baby Products",        zh: "婴儿用品",   color: "#f472b6", bg: "rgba(244,114,182,0.12)" },
  { key: "electronics", en: "Electronics",           zh: "3C电子",    color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  { key: "outdoor",     en: "Outdoor Sports",        zh: "户外运动",   color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  { key: "home",        en: "Home & Living",         zh: "家居用品",   color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  { key: "fashion",     en: "Fashion Accessories",   zh: "时尚配饰",   color: "#c084fc", bg: "rgba(192,132,252,0.12)" },
  { key: "beauty",      en: "Beauty & Skincare",     zh: "美妆护肤",   color: "#fb7185", bg: "rgba(251,113,133,0.12)" },
  { key: "pet",         en: "Pet Products",          zh: "宠物用品",   color: "#2dd4bf", bg: "rgba(45,212,191,0.12)" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export function getCategoryByKey(key: string) {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];
}

/** Determine today's category based on a 7-day rotation */
export function rotateCategory(date: Date = new Date()): (typeof CATEGORIES)[number] {
  const start = new Date("2026-01-01");
  const daysSinceStart = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return CATEGORIES[((daysSinceStart % 7) + 7) % 7];
}

/** Section template for a research report */
export const REPORT_SECTIONS = [
  { key: "market_size",    en: "Market Size",                zh: "市场规模" },
  { key: "ai_visibility",  en: "AI Visibility Analysis",     zh: "AI可见度分析" },
  { key: "competitors",    en: "Competitor Rankings",         zh: "竞品排名" },
  { key: "optimization",   en: "Optimization Recommendations", zh: "优化建议" },
  { key: "action_items",   en: "Action Items",               zh: "行动清单" },
] as const;

/* ─── Published reports registry ─── */

export const RESEARCH_REPORTS: ResearchReport[] = [
  {
    slug: "baby-ai-visibility-2026-03",
    categoryKey: "baby",
    tag: { en: "Baby Products", zh: "婴儿用品" },
    title: {
      en: "Baby Products AI Visibility Report — March 2026",
      zh: "婴儿用品 AI 可见度报告 — 2026年3月",
    },
    excerpt: {
      en: "Which baby brands dominate AI recommendations? We analyzed 150+ queries across ChatGPT, Claude, Gemini & Perplexity. Graco leads with 31% SOV, but challengers are closing fast.",
      zh: "哪些婴儿品牌主导了 AI 推荐？我们在 ChatGPT、Claude、Gemini 和 Perplexity 上分析了 150 多个查询。Graco 以 31% SOV 领先，但挑战者正在迅速追赶。",
    },
    date: "2026-03-10",
    dateLabel: { en: "March 10, 2026", zh: "2026年3月10日" },
    readTime: { en: "10 min read", zh: "10 分钟" },
  },
  {
    slug: "electronics-ai-visibility-2026-03",
    categoryKey: "electronics",
    tag: { en: "Electronics", zh: "3C电子" },
    title: {
      en: "3C Electronics AI Visibility Report — March 2026",
      zh: "3C电子 AI 可见度报告 — 2026年3月",
    },
    excerpt: {
      en: "From earbuds to webcams — which electronics brands are AI engines recommending most? Anker dominates mid-range, but niche brands are gaining ground in specific queries.",
      zh: "从耳机到摄像头——哪些电子品牌被 AI 推荐最多？Anker 在中端市场占主导，但细分品牌在特定查询中正在崛起。",
    },
    date: "2026-03-09",
    dateLabel: { en: "March 9, 2026", zh: "2026年3月9日" },
    readTime: { en: "10 min read", zh: "10 分钟" },
  },
  {
    slug: "outdoor-ai-visibility-2026-03",
    categoryKey: "outdoor",
    tag: { en: "Outdoor Sports", zh: "户外运动" },
    title: {
      en: "Outdoor Sports AI Visibility Report — March 2026",
      zh: "户外运动 AI 可见度报告 — 2026年3月",
    },
    excerpt: {
      en: "Camping gear, hiking boots, action cameras — we mapped AI recommendation share across 200+ outdoor queries. The North Face and REI lead, but DTC brands are emerging.",
      zh: "露营装备、登山鞋、运动相机——我们在 200 多个户外查询中绘制了 AI 推荐份额。The North Face 和 REI 领先，但 DTC 品牌正在崛起。",
    },
    date: "2026-03-08",
    dateLabel: { en: "March 8, 2026", zh: "2026年3月8日" },
    readTime: { en: "10 min read", zh: "10 分钟" },
  },
];
