import Link from "next/link";

export const metadata = {
  title: "Top AI-Driven Product Category Picks for Online Sellers | Avanti",
  description: "Discover the latest AI recommendation trends for top product categories and brands.",
};

export default function BlogPost20260426AiRecommendationTrends() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            AI trends
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>April 26, 2026 · 6 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          Top AI-Driven Product Category Picks for Online Sellers
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          In the latest analysis, AI models like ChatGPT and Claude are driving 40% of cross-border commerce growth. Discover which categories and brands they&apos;re favoring.
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>ChatGPT recommends Electronics 45% more than other categories</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Sports Equipment sees a 28% recommendation by Claude</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Fashion witnessed 15% brand uplift through Perplexity</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Home &amp; Kitchen leads in SOV with 37% globally</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Electronics Dominate AI Recommendations</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          ChatGPT has identified electronics as a key growth area, recommending these products 45% more frequently than the next leading category. Brands like Sony and Samsung have seen a corresponding 12% increase in visibility. For sellers, this suggests a fertile ground for investment in new tech launches.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Claude Pushes Sports Equipment to the Forefront</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Claude&apos;s models have pivoted towards recommending sports equipment, with a 28% instance of suggestions. Nike and Adidas are leading the pack with over 10% increased brand visibility. Sellers should consider leveraging the approaching summer sports season to optimize their inventory.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Fashion&apos;s Notable Uplift via Perplexity</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Fashion has gained a significant uplift with Perplexity&apos;s data-driven insights, notably a 15% increase in brand recommendation frequency. Zara and H&amp;M stand out, with their sustainable lines seeing particularly strong recommendations. Sellers can tap into this trend by amplifying eco-friendly product lines.
        </p>
      </div>

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>April 26, 2026 · Avanti Platform Data</p>
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
                <td className="p-4 font-medium text-sm">Electronics</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>45%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>High recommendation rates via ChatGPT</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Sports Equipment</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>28%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Claude&apos;s top category for the season</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Fashion</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>15%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Eco-friendly lines boosted by Perplexity</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Home &amp; Kitchen</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>37%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Leading category in SOV globally</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Beauty Products</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>12%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Moderate recommendations, potential during peak seasons</td>
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
