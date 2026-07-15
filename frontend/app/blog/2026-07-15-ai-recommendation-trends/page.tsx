import Link from "next/link";

export const metadata = {
  title: "AI Trends: Top Product Categories in Cross-Border Ecom | Avanti",
  description: "Discover the latest AI recommendation trends in cross-border e-commerce this week.",
};

export default function BlogPost20260715AiRecommendationTrends() {
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
          <span className="text-xs" style={{ color: "#7070a0" }}>July 15, 2026 · 5 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI Trends: Top Product Categories in Cross-Border Ecom
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          This week, AI models like ChatGPT, Claude, Gemini, and Perplexity highlighted a surge in electronics and fashion recommendations for cross-border sellers. With electronics showing a 45% increase in AI-driven Share of Voice (SOV), sellers need to align quickly.
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Electronics category saw a 45% boost in SOV.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Fashion recommendations increased by 32%.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Perplexity led in recommending home goods at 27% SOV.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Overall, AI-driven sales in cross-border commerce rose by 22%.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Electronics Dominate AI Recommendations</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Electronics, particularly laptops and smartphones, have seen a significant 45% rise in SOV due to AI models such as ChatGPT and Gemini. These models have increasingly prioritized electronics in their recommendation algorithms, signaling that sellers should focus on optimizing listings and improving competitive pricing to capitalize on this trend.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Fashion: A Growing Trend in AI Models</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Fashion items experienced a 32% increase in AI recommendations, largely driven by Claude and ChatGPT models emphasizing new seasonal trends and sustainable fashion lines. Sellers should consider highlighting eco-friendly materials and standout design elements in their product descriptions to align with these AI preferences.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Home Goods and AI’s Unexpected Bet</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Perplexity focused its recommendations on home goods, leading with a 27% share. This category includes smart home devices and sustainability-oriented products, which have been flagged for growth. Sellers in this space are advised to augment product visuals and utilize detailed attribute descriptions to align with these AI trends.
        </p>
      </div>

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>July 15, 2026 · Avanti Platform Data</p>
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
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Capitalize on increased AI-driven SOV.</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Fashion</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>32%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Consider eco-friendly product lines.</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Home Goods</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>27%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Augment product visuals for better alignment.</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Beauty Products</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>19%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Focus on natural ingredients.</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Toys</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>11%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>AVOID</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Demand is currently low.</td>
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
