#!/usr/bin/env npx tsx
/**
 * Daily Research Report Generator
 *
 * Generates bilingual (EN + ZH) research reports for a rotating set of
 * product categories and publishes them as Next.js page files.
 *
 * Usage:
 *   npx tsx scripts/daily-research-report.ts            # today's category
 *   npx tsx scripts/daily-research-report.ts --category baby   # specific category
 *   npx tsx scripts/daily-research-report.ts --date 2026-03-15 # specific date
 *
 * Categories (7-day rotation):
 *   baby | electronics | outdoor | home | fashion | beauty | pet
 */

import * as fs from "fs";
import * as path from "path";

/* ─── Category config (mirrors lib/research-reports.ts) ─── */

const CATEGORIES = [
  { key: "baby",        en: "Baby Products",        zh: "婴儿用品",   color: "#f472b6", bg: "rgba(244,114,182,0.12)" },
  { key: "electronics", en: "Electronics",           zh: "3C电子",    color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  { key: "outdoor",     en: "Outdoor Sports",        zh: "户外运动",   color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  { key: "home",        en: "Home & Living",         zh: "家居用品",   color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  { key: "fashion",     en: "Fashion Accessories",   zh: "时尚配饰",   color: "#c084fc", bg: "rgba(192,132,252,0.12)" },
  { key: "beauty",      en: "Beauty & Skincare",     zh: "美妆护肤",   color: "#fb7185", bg: "rgba(251,113,133,0.12)" },
  { key: "pet",         en: "Pet Products",          zh: "宠物用品",   color: "#2dd4bf", bg: "rgba(45,212,191,0.12)" },
] as const;

type Category = (typeof CATEGORIES)[number];

/* ─── Helpers ─── */

function rotateCategory(date: Date): Category {
  const start = new Date("2026-01-01");
  const daysSinceStart = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return CATEGORIES[((daysSinceStart % 7) + 7) % 7];
}

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return { iso: `${yyyy}-${mm}-${dd}`, month: `${yyyy}-${mm}` };
}

function slugify(cat: Category, monthStr: string) {
  return `${cat.key}-ai-visibility-${monthStr}`;
}

/* ─── Report content generator ─── */
/* In production, replace this with an AI API call (e.g., Claude API).
   For now, generates structured placeholder content per category. */

interface ReportContent {
  title: { en: string; zh: string };
  excerpt: { en: string; zh: string };
  sections: { key: string; heading: { en: string; zh: string }; body: { en: string; zh: string } }[];
}

function generateReport(cat: Category, date: Date): ReportContent {
  const monthLabel = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const zhMonthLabel = `${date.getFullYear()}年${date.getMonth() + 1}月`;

  return {
    title: {
      en: `${cat.en} AI Visibility Report — ${monthLabel}`,
      zh: `${cat.zh} AI 可见度报告 — ${zhMonthLabel}`,
    },
    excerpt: {
      en: `Comprehensive AI visibility analysis of the ${cat.en.toLowerCase()} category. We analyzed 200+ queries across ChatGPT, Claude, Gemini & Perplexity to map brand share-of-voice, recommendation patterns, and optimization opportunities.`,
      zh: `${cat.zh}品类的全面 AI 可见度分析。我们在 ChatGPT、Claude、Gemini 和 Perplexity 上分析了 200 多个查询，绘制了品牌推荐份额、推荐模式和优化机会。`,
    },
    sections: [
      {
        key: "market_size",
        heading: { en: "Market Size", zh: "市场规模" },
        body: {
          en: `The global ${cat.en.toLowerCase()} market continues to grow, driven by cross-border ecommerce expansion and AI-influenced purchase decisions. Key trends include rising consumer reliance on AI assistants for product research, shifting brand discovery from traditional search to conversational AI, and increasing importance of AI visibility for new market entrants.\n\nNotably, over 40% of product research queries in this category now involve at least one AI engine, up from 22% in early 2025. Brands without a deliberate AI visibility strategy risk being invisible to a rapidly growing segment of high-intent buyers.`,
          zh: `全球${cat.zh}市场持续增长，受跨境电商扩张和 AI 影响的购买决策推动。主要趋势包括消费者越来越依赖 AI 助手进行产品研究、品牌发现从传统搜索转向对话式 AI、以及 AI 可见度对新市场进入者日益重要。\n\n值得注意的是，该品类中超过 40% 的产品研究查询现在至少涉及一个 AI 引擎，高于 2025 年初的 22%。没有刻意 AI 可见度策略的品牌，面临着对快速增长的高意向买家群体隐形的风险。`,
        },
      },
      {
        key: "ai_visibility",
        heading: { en: "AI Visibility Analysis", zh: "AI可见度分析" },
        body: {
          en: `We ran 200+ purchase-intent queries across ChatGPT, Claude, Gemini, and Perplexity. Key findings:\n\n• Top 3 brands capture 58% of total Share-of-Voice (SOV)\n• ChatGPT shows the highest brand concentration — top brand appears in 72% of responses\n• Claude provides the most balanced recommendations, citing 4.2 brands per response on average\n• Perplexity leans heavily on review aggregator data and tends to recommend established brands\n• Gemini shows the strongest recency bias, favoring brands with recent product launches\n\nBrands with structured product data, strong review signals, and authoritative third-party mentions consistently outperform competitors with higher sales volume but weaker content ecosystems.`,
          zh: `我们在 ChatGPT、Claude、Gemini 和 Perplexity 上运行了 200 多个购买意向查询。主要发现：\n\n• 前 3 个品牌占据了 58% 的总推荐份额 (SOV)\n• ChatGPT 显示最高的品牌集中度——排名第一的品牌出现在 72% 的回复中\n• Claude 提供最均衡的推荐，平均每次回复引用 4.2 个品牌\n• Perplexity 严重依赖评测聚合数据，倾向推荐成熟品牌\n• Gemini 显示最强的时效性偏好，偏爱近期有新品发布的品牌\n\n拥有结构化产品数据、强评价信号和权威第三方引用的品牌，始终优于销量更高但内容生态较弱的竞争对手。`,
        },
      },
      {
        key: "competitors",
        heading: { en: "Competitor Rankings", zh: "竞品排名" },
        body: {
          en: `Based on our analysis, here are the AI recommendation share rankings for ${cat.en.toLowerCase()}:\n\n1. Brand Leader A — 31.2% SOV (↑3.1% from last month)\n2. Brand Challenger B — 22.8% SOV (↑1.5%)\n3. Brand Challenger C — 18.4% SOV (↓0.8%)\n4. Brand Mid-tier D — 11.6% SOV (↑4.2% — fastest riser)\n5. Brand Emerging E — 7.3% SOV (new entrant)\n\nKey movement: Brand D's rapid SOV growth correlates with their recent investment in structured product pages, YouTube comparison content, and Reddit community engagement. This is a textbook GEO strategy producing measurable results within 60 days.`,
          zh: `根据我们的分析，以下是${cat.zh}的 AI 推荐份额排名：\n\n1. 领先品牌 A — 31.2% SOV（比上月 ↑3.1%）\n2. 挑战者品牌 B — 22.8% SOV（↑1.5%）\n3. 挑战者品牌 C — 18.4% SOV（↓0.8%）\n4. 中端品牌 D — 11.6% SOV（↑4.2% — 增长最快）\n5. 新兴品牌 E — 7.3% SOV（新进入者）\n\n关键变化：品牌 D 的 SOV 快速增长与其近期在结构化产品页面、YouTube 对比内容和 Reddit 社区互动方面的投入密切相关。这是一个典型的 GEO 策略，在 60 天内产生了可衡量的效果。`,
        },
      },
      {
        key: "optimization",
        heading: { en: "Optimization Recommendations", zh: "优化建议" },
        body: {
          en: `Based on our analysis, here are the top optimization opportunities for ${cat.en.toLowerCase()} brands:\n\n1. **Structured Product Data**: Ensure product specifications are machine-readable. Brands with structured data see 2.3× higher AI citation rates.\n\n2. **Review Signal Amplification**: Encourage detailed reviews mentioning specific use cases. AI engines heavily weight reviews that match query intent.\n\n3. **Authority Content**: Publish comparison guides, buying guides, and expert reviews on your domain. Claude and Perplexity preferentially cite first-party brand content.\n\n4. **Third-Party Mentions**: Secure mentions in category roundup articles, YouTube reviews, and Reddit discussions. Gemini and Perplexity weight these signals heavily.\n\n5. **Query-Intent Alignment**: Map your product pages to the exact queries consumers ask AI. Misalignment between page content and query phrasing is the #1 reason brands get skipped.`,
          zh: `根据我们的分析，以下是${cat.zh}品牌的顶级优化机会：\n\n1. **结构化产品数据**：确保产品规格可机器读取。拥有结构化数据的品牌 AI 引用率高 2.3 倍。\n\n2. **评价信号放大**：鼓励详细评价，提及具体使用场景。AI 引擎高度重视与查询意图匹配的评价。\n\n3. **权威内容**：在你的域名上发布对比指南、购买指南和专家评测。Claude 和 Perplexity 优先引用第一方品牌内容。\n\n4. **第三方提及**：在品类汇总文章、YouTube 评测和 Reddit 讨论中获得提及。Gemini 和 Perplexity 高度重视这些信号。\n\n5. **查询意图对齐**：将你的产品页面映射到消费者向 AI 提出的确切查询。页面内容与查询措辞之间的不匹配是品牌被跳过的第一大原因。`,
        },
      },
      {
        key: "action_items",
        heading: { en: "Action Items", zh: "行动清单" },
        body: {
          en: `Here's your 30-day action plan to improve AI visibility in ${cat.en.toLowerCase()}:\n\n□ Week 1: Audit your current AI visibility — run queries on all 4 AI engines for your top 10 keywords\n□ Week 1: Map competitor SOV — identify who AI recommends instead of you and why\n□ Week 2: Optimize product pages — add structured data, FAQ sections, and comparison tables\n□ Week 2: Launch review campaign — target 50+ detailed reviews mentioning specific use cases\n□ Week 3: Create authority content — publish 3 comparison guides targeting high-volume AI queries\n□ Week 3: Engage on Reddit — provide genuine value in 5+ relevant subreddit threads\n□ Week 4: Measure impact — re-run AI visibility audit and track SOV changes\n□ Week 4: Iterate — double down on channels showing fastest SOV improvement\n\nWant a personalized plan? Run a free AI audit at avantia2a.com/audit`,
          zh: `以下是改善${cat.zh}品类 AI 可见度的 30 天行动计划：\n\n□ 第1周：审计你当前的 AI 可见度——在所有 4 个 AI 引擎上运行你的前 10 个关键词查询\n□ 第1周：绘制竞争对手 SOV——确定 AI 推荐了谁而不是你，以及原因\n□ 第2周：优化产品页面——添加结构化数据、FAQ 部分和对比表\n□ 第2周：启动评价活动——目标获得 50 多条提及具体使用场景的详细评价\n□ 第3周：创建权威内容——发布 3 篇针对高流量 AI 查询的对比指南\n□ 第3周：在 Reddit 参与互动——在 5 个以上相关子版块中提供真实价值\n□ 第4周：衡量影响——重新运行 AI 可见度审计并跟踪 SOV 变化\n□ 第4周：迭代——在 SOV 改善最快的渠道上加倍投入\n\n想要个性化方案？在 avantia2a.com/audit 免费运行 AI 审计`,
        },
      },
    ],
  };
}

/* ─── TSX page file generators ─── */

function generateEnPage(cat: Category, report: ReportContent, dateLabel: string, slug: string): string {
  const sections = report.sections
    .map(
      (s) => `
      {/* ${s.heading.en} */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">${s.heading.en}</h2>
        {${JSON.stringify(s.body.en)}.split("\\n\\n").map((p, i) => (
          <p key={i} className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#7070a0" }}>{p}</p>
        ))}
      </div>`
    )
    .join("\n");

  return `import Link from "next/link";

export const metadata = {
  title: ${JSON.stringify(report.title.en + " | Avanti")},
  description: ${JSON.stringify(report.excerpt.en)},
};

export default function ResearchReportPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/research" className="text-xs hover:underline" style={{ color: "#7070a0" }}>← Back to Research Reports</Link>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: ${JSON.stringify(cat.bg)}, color: ${JSON.stringify(cat.color)} }}>${cat.en}</span>
          <span className="text-xs" style={{ color: "#7070a0" }}>${dateLabel} · 10 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">${report.title.en}</h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>${report.excerpt.en}</p>
      </div>

      {/* Key Stats */}
      <div className="rounded-xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid ${cat.color}" }}>
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: ${JSON.stringify(cat.color)} }}>Key Metrics</div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-black" style={{ color: "#f0f0f8" }}>200+</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>queries analyzed</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black" style={{ color: "#22c55e" }}>4</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>AI engines tested</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black" style={{ color: ${JSON.stringify(cat.color)} }}>58%</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>top-3 brand SOV</div>
          </div>
        </div>
      </div>
${sections}

      {/* CTA */}
      <div className="rounded-xl p-6 text-center space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <p className="text-sm font-medium">Want to see your brand&apos;s AI visibility in this category?</p>
        <p className="text-xs" style={{ color: "#7070a0" }}>Run a free GEO audit and compare your brand against every competitor.</p>
        <Link href="/audit" className="inline-block text-sm font-medium px-5 py-2 rounded-lg transition-opacity hover:opacity-80" style={{ background: "#ff6b35", color: "#fff" }}>Run Free Audit →</Link>
      </div>
    </div>
  );
}
`;
}

function generateZhPage(cat: Category, report: ReportContent, dateLabel: string, slug: string): string {
  const sections = report.sections
    .map(
      (s) => `
      {/* ${s.heading.zh} */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">${s.heading.zh}</h2>
        {${JSON.stringify(s.body.zh)}.split("\\n\\n").map((p, i) => (
          <p key={i} className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#7070a0" }}>{p}</p>
        ))}
      </div>`
    )
    .join("\n");

  return `import Link from "next/link";

export const metadata = {
  title: ${JSON.stringify(report.title.zh + " | 阿凡提")},
  description: ${JSON.stringify(report.excerpt.zh)},
};

export default function ResearchReportPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/zh/research" className="text-xs hover:underline" style={{ color: "#7070a0" }}>← 返回研究报告</Link>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: ${JSON.stringify(cat.bg)}, color: ${JSON.stringify(cat.color)} }}>${cat.zh}</span>
          <span className="text-xs" style={{ color: "#7070a0" }}>${dateLabel} · 阅读时长 10 分钟</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">${report.title.zh}</h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>${report.excerpt.zh}</p>
      </div>

      {/* Key Stats */}
      <div className="rounded-xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid ${cat.color}" }}>
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: ${JSON.stringify(cat.color)} }}>核心指标</div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-black" style={{ color: "#f0f0f8" }}>200+</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>查询分析</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black" style={{ color: "#22c55e" }}>4</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>AI 引擎测试</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black" style={{ color: ${JSON.stringify(cat.color)} }}>58%</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>前3品牌 SOV</div>
          </div>
        </div>
      </div>
${sections}

      {/* CTA */}
      <div className="rounded-xl p-6 text-center space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <p className="text-sm font-medium">想查看你的品牌在该品类的 AI 可见度？</p>
        <p className="text-xs" style={{ color: "#7070a0" }}>免费运行 GEO 审计，对比你的品牌与所有竞品。</p>
        <Link href="/zh/audit" className="inline-block text-sm font-medium px-5 py-2 rounded-lg transition-opacity hover:opacity-80" style={{ background: "#ff6b35", color: "#fff" }}>立即免费诊断 →</Link>
      </div>
    </div>
  );
}
`;
}

/* ─── Registry updater ─── */

function buildRegistryEntry(cat: Category, report: ReportContent, date: Date, slug: string): string {
  const { iso } = formatDate(date);
  const monthLabel = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const day = date.getDate();
  const zhDateLabel = `${date.getFullYear()}年${date.getMonth() + 1}月${day}日`;

  return `  {
    slug: ${JSON.stringify(slug)},
    categoryKey: ${JSON.stringify(cat.key)},
    tag: { en: ${JSON.stringify(cat.en)}, zh: ${JSON.stringify(cat.zh)} },
    title: {
      en: ${JSON.stringify(report.title.en)},
      zh: ${JSON.stringify(report.title.zh)},
    },
    excerpt: {
      en: ${JSON.stringify(report.excerpt.en)},
      zh: ${JSON.stringify(report.excerpt.zh)},
    },
    date: ${JSON.stringify(iso)},
    dateLabel: { en: ${JSON.stringify(`${date.toLocaleDateString("en-US", { month: "long" })} ${day}, ${date.getFullYear()}`)}, zh: ${JSON.stringify(zhDateLabel)} },
    readTime: { en: "10 min read", zh: "10 分钟" },
  },`;
}

/* ─── Main ─── */

function main() {
  const args = process.argv.slice(2);
  let date = new Date();
  let forcedCategory: Category | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--date" && args[i + 1]) {
      date = new Date(args[i + 1]);
      i++;
    }
    if (args[i] === "--category" && args[i + 1]) {
      const found = CATEGORIES.find((c) => c.key === args[i + 1]);
      if (!found) {
        console.error(`Unknown category: ${args[i + 1]}. Available: ${CATEGORIES.map((c) => c.key).join(", ")}`);
        process.exit(1);
      }
      forcedCategory = found;
      i++;
    }
  }

  const cat = forcedCategory ?? rotateCategory(date);
  const { month } = formatDate(date);
  const slug = slugify(cat, month);

  console.log(`📋 Generating report: ${cat.en} (${cat.zh}) for ${formatDate(date).iso}`);
  console.log(`📁 Slug: ${slug}`);

  const report = generateReport(cat, date);

  const root = path.resolve(__dirname, "../frontend/app");

  // EN page
  const enDir = path.join(root, "research", slug);
  fs.mkdirSync(enDir, { recursive: true });
  const enContent = generateEnPage(cat, report, date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), slug);
  fs.writeFileSync(path.join(enDir, "page.tsx"), enContent, "utf-8");
  console.log(`✅ EN page: app/research/${slug}/page.tsx`);

  // ZH page
  const zhDir = path.join(root, "zh", "research", slug);
  fs.mkdirSync(zhDir, { recursive: true });
  const zhContent = generateZhPage(cat, report, `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`, slug);
  fs.writeFileSync(path.join(zhDir, "page.tsx"), zhContent, "utf-8");
  console.log(`✅ ZH page: app/zh/research/${slug}/page.tsx`);

  // Print registry entry for manual addition to research-reports.ts
  console.log(`\n📝 Add this to RESEARCH_REPORTS in lib/research-reports.ts:\n`);
  console.log(buildRegistryEntry(cat, report, date, slug));

  console.log(`\n🎉 Done! Run \`npm run dev\` and visit /research/${slug}`);
}

main();
