import Link from "next/link";

export const metadata = {
  title: "AI Trends in Cross-Border E-commerce: Top Categories | Avanti",
  description: "Discover the latest AI-driven product recommendations in cross-border e-commerce and their implications for sellers.",
};

export default function BlogPost20260820AiRecommendationTrends() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            AI Trends
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>August 20, 2026 · 5 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI Trends in Cross-Border E-commerce: Top Categories
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          AI models are reshaping cross-border e-commerce with 58% of product recommendations in tech, fashion, and beauty. ChatGPT leads with a 49.5% share of voice (SOV) in AI-driven suggestions.
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Tech, fashion, and beauty account for 58% of AI recommendations.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>ChatGPT holds a 49.5% SOV in AI product suggestions.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Claude&apos;s recommendations led to a 27% uplift in beauty product sales.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Gemini focuses 35% of its recommendations on sustainable products.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Dominant Product Categories</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Technology, fashion, and beauty are leading the pack, collectively making up 58% of the recommendations from AI models. Specifically, tech products comprise 22% of suggestions, fashion 20%, and beauty 16%. Sellers in these categories are advised to enhance their product listings to capitalize on this trend.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Brand SOV Insights</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Regarding SOV, ChatGPT remains dominant at 49.5%, with significant influence in tech and beauty. Claude holds a 32% SOV, proving particularly impactful in the beauty sector with a reported 27% increase in sales for recommended products. The competitive edge lies in understanding and leveraging these SOV metrics to optimize product visibility.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Seller Implications</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          For sellers, the actionable move is clear: optimize product listings in the key recommended categories by AI models. Emphasis should be on sustainability, as highlighted by Gemini&apos;s 35% focus, potentially capturing eco-conscious consumers. Furthermore, aligning with AI-driven trends can significantly boost visibility and sales.
        </p>
      </div>

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>August 20, 2026 · Avanti Platform Data</p>
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
                <td className="p-4 font-medium text-sm">Technology</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>22%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Significant AI focus; optimize listings.</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Fashion</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>20%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Consistent demand but competitive.</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Beauty</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>16%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Sales uplift through AI recommendations.</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Sustainable Products</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>35%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>High AI recommendation focus; tap into eco-market.</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Home Appliances</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>12%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>AVOID</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Limited AI-driven interest this week.</td>
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
