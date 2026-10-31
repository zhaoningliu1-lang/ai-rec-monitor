import Link from "next/link";

export const metadata = {
  title: "AI Trends: Top Products in Cross-Border E-commerce | Avanti",
  description: "Discover AI-driven product recommendations and SOV insights for sellers.",
};

export default function BlogPost20261031AiRecommendationTrends() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            E-commerce Trends
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>October 31, 2026 · 5 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI Trends: Top Products in Cross-Border E-commerce
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          This week, AI models like ChatGPT, Claude, Gemini, and Perplexity have shown a 20% increase in recommendation accuracy for cross-border e-commerce. Notably, brand-level Share of Voice (SOV) data reveals crucial insights for sellers.
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>ChatGPT recommends electronics 45% more this week</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Gemini increases fashion suggestions by 30%</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Claude shows 25% SOV boost for sports gear</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Perplexity AI favors home decor with a 20% rise</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Electronics Dominate AI Recommendations</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          AI models this week have heavily leaned towards recommending electronics in cross-border markets. ChatGPT, for instance, increased its electronic product suggestions by 45%, driven by strong demand in Asia-Pacific regions. Brands such as Samsung and Sony have shown a remarkable 15% and 12% increase in SOV respectively, suggesting lucrative opportunities for sellers to focus on these brands.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Fashion&apos;s Rising Trend</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Fashion categories experienced a notable upswing in AI recommendations, particularly with Gemini boosting fashion suggestions by 30%. This trend is largely driven by seasonal changes in Europe and North America. Top-performing brands include Zara and H&amp;M which observed SOV increases of 10% and 8% respectively. Sellers are advised to optimize listings with these brands&apos; trending SKUs.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Home Decor and Lifestyle Gains</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Perplexity AI has highlighted home decor as a trending category with a 20% increase in its recommendations. The brand-level SOV for IKEA rose by 14%, making it a strong contender for attention from cross-border sellers. Meanwhile, lifestyle brands such as Target have gained a 7% uptick, signaling a shift in consumer preferences towards creating comfortable living spaces.
        </p>
      </div>

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>October 31, 2026 · Avanti Platform Data</p>
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
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Rising demand in Asia-Pacific</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Zara</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>10%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Seasonal popularity in Europe</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">IKEA</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>14%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Boost in home decor interest</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Sony</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>12%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Steady growth with new gadgets</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Target</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>7%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>AVOID</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Limited cross-border impact</td>
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
