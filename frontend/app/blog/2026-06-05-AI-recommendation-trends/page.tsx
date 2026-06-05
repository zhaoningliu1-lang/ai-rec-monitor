import Link from "next/link";

export const metadata = {
  title: "AI Recommends: Trends in Cross-Border eCommerce This Week | Avanti",
  description: "Discover which product categories leading AIs prefer, and seller insights.",
};

export default function BlogPost20260605AiRecommendationTrends() {
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
          <span className="text-xs" style={{ color: "#7070a0" }}>June 5, 2026 · 5 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI Recommends: Trends in Cross-Border eCommerce This Week
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          This week, AI models like ChatGPT and Claude are promoting electronics and apparel, favoring brands like Samsung and Nike. A deep dive into share of voice (SOV) data reveals crucial insights for eCommerce sellers.
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Electronics lead recommendations with 40% SOV.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Samsung holds a 15% SOV in AI-driven suggestions.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Apparel sees a 30% increase in recommendations.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Nike garners a 12.5% SOV among apparel brands.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Electronics Dominate AI Recommendations</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          This week, the electronics category commands a 40% share of voice (SOV) in AI recommendations, with ChatGPT and Claude frequently suggesting high-tech products. Leading the charge is Samsung, which captures 15% of these suggestions. Brands like Apple and Sony are also gaining traction, indicating a strong consumer interest mediated by AI trends.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Rise of Apparel in AI Preferences</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          The apparel category has seen a 30% surge in AI recommendations this week. Nike stands out with a 12.5% SOV, followed closely by Adidas. This increase is partly due to the seasonal trends and new product launches that AI models like Gemini highlight. Sellers in this space should consider enhancing their product visibility to capitalize on this momentum.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Models and Their Brand Preferences</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          AI models like Perplexity significantly influence brand visibility, favoring those that maintain consistent engagement and innovative marketing strategies. The current AI analytics show a preference for brands that excel in customer experience and sustainability, an important factor for sellers to integrate into their strategy.
        </p>
      </div>

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>June 5, 2026 · Avanti Platform Data</p>
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
                <td className="p-4 font-medium text-sm">Samsung</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>15%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>High SOV in electronics.</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Apple</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>10%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Moderate increase in AI mentions.</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Nike</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>12.5%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Leading apparel brand in recommendations.</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Sony</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>8%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Growing interest detected.</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Adidas</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>7%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Stable recommendation rate this week.</td>
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
