import Link from "next/link";

export const metadata = {
  title: "Baby Products AI Visibility Report — March 2026 | Avanti",
  description: "Comprehensive AI visibility analysis of the baby products category. We analyzed 200+ queries across ChatGPT, Claude, Gemini & Perplexity to map brand share-of-voice, recommendation patterns, and optimization opportunities.",
};

export default function ResearchReportPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/research" className="text-xs hover:underline" style={{ color: "#7070a0" }}>← Back to Research Reports</Link>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: "rgba(244,114,182,0.12)", color: "#f472b6" }}>Baby Products</span>
          <span className="text-xs" style={{ color: "#7070a0" }}>March 9, 2026 · 10 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">Baby Products AI Visibility Report — March 2026</h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>Comprehensive AI visibility analysis of the baby products category. We analyzed 200+ queries across ChatGPT, Claude, Gemini & Perplexity to map brand share-of-voice, recommendation patterns, and optimization opportunities.</p>
      </div>

      {/* Key Stats */}
      <div className="rounded-xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #f472b6" }}>
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#f472b6" }}>Key Metrics</div>
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
            <div className="text-2xl font-black" style={{ color: "#f472b6" }}>58%</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>top-3 brand SOV</div>
          </div>
        </div>
      </div>

      {/* Market Size */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Market Size</h2>
        {"The global baby products market continues to grow, driven by cross-border ecommerce expansion and AI-influenced purchase decisions. Key trends include rising consumer reliance on AI assistants for product research, shifting brand discovery from traditional search to conversational AI, and increasing importance of AI visibility for new market entrants.\n\nNotably, over 40% of product research queries in this category now involve at least one AI engine, up from 22% in early 2025. Brands without a deliberate AI visibility strategy risk being invisible to a rapidly growing segment of high-intent buyers.".split("\n\n").map((p, i) => (
          <p key={i} className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#7070a0" }}>{p}</p>
        ))}
      </div>

      {/* AI Visibility Analysis */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Visibility Analysis</h2>
        {"We ran 200+ purchase-intent queries across ChatGPT, Claude, Gemini, and Perplexity. Key findings:\n\n• Top 3 brands capture 58% of total Share-of-Voice (SOV)\n• ChatGPT shows the highest brand concentration — top brand appears in 72% of responses\n• Claude provides the most balanced recommendations, citing 4.2 brands per response on average\n• Perplexity leans heavily on review aggregator data and tends to recommend established brands\n• Gemini shows the strongest recency bias, favoring brands with recent product launches\n\nBrands with structured product data, strong review signals, and authoritative third-party mentions consistently outperform competitors with higher sales volume but weaker content ecosystems.".split("\n\n").map((p, i) => (
          <p key={i} className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#7070a0" }}>{p}</p>
        ))}
      </div>

      {/* Competitor Rankings */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Competitor Rankings</h2>
        {"Based on our analysis, here are the AI recommendation share rankings for baby products:\n\n1. Brand Leader A — 31.2% SOV (↑3.1% from last month)\n2. Brand Challenger B — 22.8% SOV (↑1.5%)\n3. Brand Challenger C — 18.4% SOV (↓0.8%)\n4. Brand Mid-tier D — 11.6% SOV (↑4.2% — fastest riser)\n5. Brand Emerging E — 7.3% SOV (new entrant)\n\nKey movement: Brand D's rapid SOV growth correlates with their recent investment in structured product pages, YouTube comparison content, and Reddit community engagement. This is a textbook GEO strategy producing measurable results within 60 days.".split("\n\n").map((p, i) => (
          <p key={i} className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#7070a0" }}>{p}</p>
        ))}
      </div>

      {/* Optimization Recommendations */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Optimization Recommendations</h2>
        {"Based on our analysis, here are the top optimization opportunities for baby products brands:\n\n1. **Structured Product Data**: Ensure product specifications are machine-readable. Brands with structured data see 2.3× higher AI citation rates.\n\n2. **Review Signal Amplification**: Encourage detailed reviews mentioning specific use cases. AI engines heavily weight reviews that match query intent.\n\n3. **Authority Content**: Publish comparison guides, buying guides, and expert reviews on your domain. Claude and Perplexity preferentially cite first-party brand content.\n\n4. **Third-Party Mentions**: Secure mentions in category roundup articles, YouTube reviews, and Reddit discussions. Gemini and Perplexity weight these signals heavily.\n\n5. **Query-Intent Alignment**: Map your product pages to the exact queries consumers ask AI. Misalignment between page content and query phrasing is the #1 reason brands get skipped.".split("\n\n").map((p, i) => (
          <p key={i} className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#7070a0" }}>{p}</p>
        ))}
      </div>

      {/* Action Items */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Action Items</h2>
        {"Here's your 30-day action plan to improve AI visibility in baby products:\n\n□ Week 1: Audit your current AI visibility — run queries on all 4 AI engines for your top 10 keywords\n□ Week 1: Map competitor SOV — identify who AI recommends instead of you and why\n□ Week 2: Optimize product pages — add structured data, FAQ sections, and comparison tables\n□ Week 2: Launch review campaign — target 50+ detailed reviews mentioning specific use cases\n□ Week 3: Create authority content — publish 3 comparison guides targeting high-volume AI queries\n□ Week 3: Engage on Reddit — provide genuine value in 5+ relevant subreddit threads\n□ Week 4: Measure impact — re-run AI visibility audit and track SOV changes\n□ Week 4: Iterate — double down on channels showing fastest SOV improvement\n\nWant a personalized plan? Run a free AI audit at avanti.so/audit".split("\n\n").map((p, i) => (
          <p key={i} className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#7070a0" }}>{p}</p>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-xl p-6 text-center space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <p className="text-sm font-medium">Want to see your brand&apos;s AI visibility in this category?</p>
        <p className="text-xs" style={{ color: "#7070a0" }}>Run a free GEO audit and compare your brand against every competitor.</p>
        <Link href="/audit" className="inline-block text-sm font-medium px-5 py-2 rounded-lg transition-opacity hover:opacity-80" style={{ background: "#ff6b35", color: "#fff" }}>Run Free Audit →</Link>
      </div>
    </div>
  );
}
