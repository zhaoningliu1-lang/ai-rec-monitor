import Link from "next/link";

export const metadata = {
  title: "Research & GEO Reports — Avanti",
  description:
    "AI visibility audits, GEO case studies, brand benchmarking, and cross-border seller guides from Avanti.",
};

const POSTS = [
  {
    slug: "2026-03-28-smart-home-ai-recommendations",
    tag: "AI Trends",
    title: "AI Recommendations in Smart Home: Who Leads?",
    excerpt:
      "Explore which brands lead AI recommendations in smart home gear.",
    date: "March 28, 2026",
    readTime: "6 min read",
  },
  {
    slug: "2026-03-27-ai-recommendation-ecommerce",
    tag: "AI Intelligence",
    title: "Leverage AI Data for Sourcing Ahead in E-commerce",
    excerpt:
      "Discover how Chinese Amazon sellers use AI data to spot sourcing opportunities.",
    date: "March 27, 2026",
    readTime: "6 min read",
  },
  {
    slug: "2026-03-26-geo-industry-update-strategies",
    tag: "AI Strategy",
    title: "New GEO Strategies for Boosting AI Visibility in 2026",
    excerpt:
      "Explore the latest GEO tactics to enhance brand visibility using AI for Amazon sellers in 2026.",
    date: "March 26, 2026",
    readTime: "6 min read",
  },
  {
    slug: "2026-03-25-ai-recommendation-trends-cross-border-ecommerce-weekly",
    tag: "Weekly AI Trends",
    title: "AI Recommendation Trends: Which Categories Are Winning SOV This Week?",
    excerpt:
      "Weekly analysis of AI model recommendation trends across ChatGPT, Claude, Gemini &amp; Perplexity for cross-border ecommerce sellers with brand SOV data.",
    date: "March 25, 2026",
    readTime: "7 min read",
  },
  {
    slug: "2026-03-24-category-spotlight-smart-home",
    tag: "smart home",
    title: "Smart Home AI: Which Brands Dominate Recommendations?",
    excerpt:
      "Discover which smart home brands top AI recommendations and why they excel.",
    date: "March 24, 2026",
    readTime: "5 min read",
  },
  {
    slug: "2026-03-23-ai-recommendation-china-sourcing",
    tag: "AI &amp; Sourcing",
    title: "Leverage AI for Cross-Border Sourcing: Top Tips for Chinese Sellers",
    excerpt:
      "Discover AI tactics for Chinese sellers to find sourcing opportunities before competitors on Amazon.",
    date: "March 23, 2026",
    readTime: "6 min read",
  },
  {
    slug: "2026-03-22-GEO-industry-update",
    tag: "AI Strategy",
    title: "GEO Industry Update: Boost AI Visibility with New Strategies",
    excerpt:
      "Learn about the latest GEO strategies brands use to enhance AI visibility and how shifts in AI citations affect Amazon sellers.",
    date: "March 22, 2026",
    readTime: "5 min read",
  },
  {
    slug: "2026-03-21-ai-recommendation-trends",
    tag: "AI trends",
    title: "Top AI-Driven Product Trends in Cross-Border Ecommerce",
    excerpt:
      "Discover the latest AI recommendation trends impacting cross-border sales.",
    date: "March 21, 2026",
    readTime: "6 min read",
  },
  {
    slug: "2026-03-20-ai-recommendations-beauty-tech",
    tag: "beauty-tech",
    title: "AI&apos;s Impact in the Beauty Tech Market",
    excerpt:
      "Discover AI&apos;s influence on beauty tech brands and recommendations.",
    date: "March 20, 2026",
    readTime: "6 min read",
  },
  {
    slug: "2026-03-19-cross-border-ecommerce-ai-intelligence",
    tag: "AI E-commerce",
    title: "AI Tips: Spot Sourcing Opportunities on Amazon",
    excerpt:
      "Uncover sourcing opportunities with AI data for Chinese sellers on Amazon.",
    date: "March 19, 2026",
    readTime: "5 min read",
  },
  {
    slug: "2026-03-18-geo-industry-update",
    tag: "AI Strategies",
    title: "New GEO Strategies to Boost AI Visibility",
    excerpt:
      "Explore latest GEO strategies enhancing brand presence in AI&apos;s spotlight.",
    date: "March 18, 2026",
    readTime: "5 min read",
  },
  {
    slug: "2026-03-17-ai-recommendation-trends",
    tag: "AI Trends",
    title: "AI Recommendation Trends in Cross-Border Ecommerce",
    excerpt:
      "This week&apos;s top AI-recommended product categories with brand insights.",
    date: "March 17, 2026",
    readTime: "6 min read",
  },
  {
    slug: "ai-poisoning-vs-visibility",
    tag: "Industry Position",
    title: "AI Poisoning vs. AI Visibility Management: Our Position",
    excerpt:
      "The 2026 CCTV 315 Gala exposed AI data poisoning schemes. We explain the critical difference between manipulating AI and monitoring AI visibility. Avanti measures — we don't manipulate.",
    date: "March 15, 2026",
    readTime: "8 min read",
  },
  {
    slug: "2026-03-14-geo-industry-update",
    tag: "AI Recommendation Trends",
    title: "New GEO Strategies Boosting AI Visibility for Brands",
    excerpt:
      "Explore the latest GEO strategies enhancing AI visibility for Amazon sellers.",
    date: "March 14, 2026",
    readTime: "6 min read",
  },
  {
    slug: "2026-03-13-ai-recommendation-trends",
    tag: "AI Trends",
    title: "AI Trends: Top Product Categories in Cross-Border Ecommerce",
    excerpt:
      "Discover how AI models are shaping cross-border ecommerce with latest trends.",
    date: "March 13, 2026",
    readTime: "5 min read",
  },
  {
    slug: "2026-03-12-category-spotlight-beauty-tech",
    tag: "Beauty Tech",
    title: "AI Recommendations in Beauty Tech: Who Dominates?",
    excerpt:
      "Explore which brands lead AI-driven recommendations in the beauty tech category and why.",
    date: "March 12, 2026",
    readTime: "6 min read",
  },
  {
    slug: "2026-03-11-ai-recommendation-sourcing-opportunities",
    tag: "cross-border AI",
    title: "Maximize Sourcing with AI for Chinese Amazon Sellers",
    excerpt:
      "Discover early cross-border sourcing opportunities using AI recommendations.",
    date: "March 11, 2026",
    readTime: "5 min read",
  },
  {
    slug: "2026-03-10-geo-industry-update",
    tag: "E-commerce",
    title: "2026 GEO Trends: Boost AI Visibility on Amazon",
    excerpt:
      "Discover the latest strategies brands use to enhance AI visibility and boost sales on Amazon.",
    date: "March 10, 2026",
    readTime: "5 min read",
  },
  {
    slug: "insta360-vs-dji",
    tag: "GEO Case Study",
    title: "Insta360 vs DJI: Who Wins When Buyers Ask AI for Camera Recommendations?",
    excerpt:
      "We ran 47 queries across ChatGPT, Claude, Gemini, and Perplexity. DJI's AI visibility is 2.3× Insta360's — but the gap is closable. Here's the full breakdown.",
    date: "March 2026",
    readTime: "8 min read",
  },
  {
    slug: "portable-power-ai-ranking",
    tag: "AI Selection Report",
    title: "ChatGPT Is Recommending These Portable Power Brands — 2025 Seller Report",
    excerpt:
      "200+ queries across 4 AI engines. EcoFlow dominates at 34% SOV, Jackery holds 28.7%. Here's the full ranking — and where the opportunity gaps are.",
    date: "March 2026",
    readTime: "7 min read",
  },
  {
    slug: "why-ai-ignores-your-brand",
    tag: "GEO Guide",
    title: "Why AI Doesn't Mention Your Brand: A Guide for Cross-Border Sellers",
    excerpt:
      "Your brand has 4.4 stars and 2,000 reviews on Amazon. ChatGPT still recommends your competitor. Here are the 5 reasons why — and exactly what to do about it.",
    date: "March 2026",
    readTime: "6 min read",
  },
  {
    slug: "helium10-vs-avanti",
    tag: "Tool Comparison",
    title: "Helium 10 vs Avanti: Traditional Product Research vs AI Visibility Monitoring",
    excerpt:
      "Helium 10 tells you what sold last month. Avanti tells you what AI is recommending today. An honest comparison — and when you need each.",
    date: "March 2026",
    readTime: "5 min read",
  },
  {
    slug: "ai-cost-guide-2025",
    tag: "Operations Guide",
    title: "2025 Cross-Border Seller Cost Savings Guide: 5 Operations AI Can Handle Right Now",
    excerpt:
      "Most brands are paying humans $800–$2,000/mo to do what AI handles in seconds. Here's exactly where to cut — and how to reinvest in GEO.",
    date: "March 2026",
    readTime: "6 min read",
  },
];

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  "Industry Position":  { bg: "rgba(255,68,77,0.12)",  color: "#ff4d6d" },
  "GEO Case Study":     { bg: "rgba(255,107,53,0.12)", color: "#ff6b35" },
  "AI Selection Report":{ bg: "rgba(34,197,94,0.10)",  color: "#22c55e" },
  "GEO Guide":          { bg: "rgba(245,166,35,0.10)", color: "#f5a623" },
  "Tool Comparison":    { bg: "rgba(112,112,160,0.12)", color: "#9090c0" },
  "Operations Guide":   { bg: "rgba(96,165,250,0.10)", color: "#60a5fa" },
};

export default function BlogIndexPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      <div className="space-y-2">
        <div
          className="inline-block text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
        >
          Avanti Research
        </div>
        <h1 className="text-3xl font-bold mt-3">GEO Reports & Seller Guides</h1>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          Real AI visibility audits, selection intelligence reports, and cross-border
          strategy guides — updated monthly.
        </p>
      </div>

      <div className="space-y-4">
        {POSTS.map((post) => {
          const tagStyle = TAG_COLORS[post.tag] ?? { bg: "rgba(255,107,53,0.12)", color: "#ff6b35" };
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
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
                  <span>{post.readTime}</span>
                  <span
                    className="ml-auto font-medium group-hover:text-white transition-colors"
                    style={{ color: "#ff6b35" }}
                  >
                    Read report →
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
        <p className="text-sm font-medium">Want us to run a report for your brand?</p>
        <p className="text-xs" style={{ color: "#7070a0" }}>
          Free GEO Score audit. See your AI visibility score vs every competitor in your category.
        </p>
        <Link
          href="/signup"
          className="inline-block text-sm font-medium px-5 py-2 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          Run Free Audit →
        </Link>
      </div>
    </div>
  );
}
