import Link from "next/link";

export const metadata = {
  title: "AI Recommends: Top Cross-Border Ecommerce Trends | Avanti",
  description: "Explore AI&apos;s top recommended product categories in cross-border ecommerce.",
};

export default function BlogPost20260629AiRecommendationTrends() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            ecommerce
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>June 29, 2026 · 5 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI Recommends: Top Cross-Border Ecommerce Trends
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          In the past week, AI models have influenced the cross-border ecommerce market, with ChatGPT recommending a 42% increase in personal care products. Claude, Gemini, and Perplexity show shifts too.
        </p>
      </div>

      {/* Key Findings */}
      <div
        className="rounded-xl p-6 space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #ff6b35" }}
      >
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          Key Findings
        </div>
        <ul className="space-y-2 text-sm" style={{ color: "#f0f0f8" }}>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>ChatGPT recommends personal care, up by 42% in interest.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Claude sees a 38% rise in electronics SOV.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Gemini highlights fashion, increasing by 31%.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Perplexity suggests home kitchen, with a 29% surge.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">ChatGPT&apos;s Rise in Personal Care</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Over the last week, ChatGPT has driven a significant shift with a 42% increase in recommendations for personal care items. Brands like Olay and L&apos;Oreal are gaining traction among consumers. This trend offers Amazon sellers an opportunity to expand their range in skincare and cosmetics, capturing emerging demand.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Claude&apos;s Focus on Electronics</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Claude&apos;s data shows a remarkable 38% surge in Share of Voice (SOV) for electronics. Brands such as Samsung and Apple are prominently featured. Sellers should prioritize listing optimizations and stock updates in this category to leverage the increased visibility and consumer interest.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Gemini and Perplexity&apos;s Category Shifts</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Gemini pointed towards a 31% increase in fashion apparel recommendations, with brands like Zara seeing a spike. Meanwhile, Perplexity indicates a 29% growth in home kitchen products, spotlighting brands like Instant Pot. These insights suggest diversified selling strategies across these thriving categories.
        </p>
      </div>

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>June 29, 2026 · Avanti Platform Data</p>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <th className="text-left p-4 font-medium" style={{ color: "#7070a0" }}>Brand / Category</th>
                <th className="text-center p-4 font-medium" style={{ color: "#7070a0" }}>AI Metric</th>
                <th className="text-center p-4 font-medium" style={{ color: "#7070a0" }}>Signal</th>
                <th className="text-left p-4 font-medium" style={{ color: "#7070a0" }}>Insight</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Personal Care</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>42%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Boosted by ChatGPT recommendations</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Electronics</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>38%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Prominent in Claude&apos;s data</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Fashion Apparel</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>31%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Highlighted by Gemini</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Home Kitchen</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>29%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Notable growth in Perplexity&apos;s picks</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Toys &amp; Games</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>15%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>AVOID</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Low AI model recommendation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div
        className="rounded-xl p-8 text-center space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="font-semibold text-lg">Track your brand&apos;s AI visibility</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          Run a free GEO Score audit — see your AI mention rate and share of voice
          across ChatGPT, Claude, Gemini, and Perplexity.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/signup"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            Run Free Audit →
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            More Reports →
          </Link>
        </div>
      </div>
    </div>
  );
}
