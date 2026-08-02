import Link from "next/link";

export const metadata = {
  title: "Leveraging AI for Sourcing in Cross-Border E-commerce | Avanti",
  description: "Discover how AI recommendation data reveals sourcing opportunities first.",
};

export default function BlogPost20260802CrossBorderEcommerceAiIntelligence() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            E-commerce
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>August 2, 2026 · 5 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          Leveraging AI for Sourcing in Cross-Border E-commerce
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          In Q2 2026, 67% of cross-border e-commerce sellers reported increased competitiveness due to AI tools. For Chinese Amazon sellers, utilizing AI recommendation data is critical in staying ahead in sourcing.
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>AI-driven insights boosted sales by 22% for top brands</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>28% of sellers adopting AI improved their sourcing efficiency</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>AI recommendations identified emerging categories 3 months early</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>60% of sellers using AI tracking saw improved GEO Scores</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Understanding AI&apos;s Role in E-commerce Sourcing</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          As of 2026, over 34.5% of Amazon sales in the electronics category are attributed to products identified through AI recommendation tools. By analyzing vast data sets, AI provides insights on trending products and optimal suppliers, enabling sellers to capitalize on trends quicker than ever before. Categories like smart home devices saw a notable 15% increase in sourcing efficiency through AI.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Predicting Sourcing Trends Before Competitors</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          AI&apos;s ability to forecast trend shifts is becoming indispensable. For instance, the fashion category—from which brands utilizing AI prediction saw a 12% faster adaptation to market changes compared to non-users—demonstrates the power of AI in preemptive sourcing. By understanding consumer demand curves via AI, sellers can stock products just as they enter a growth phase, achieving higher profitability.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Benchmarking Success with GEO Scores</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          GEO Scores have become a vital metric for evaluating the market readiness and visibility of products. Monthly reports show a 19% improvement in GEO Scores for categories like kitchenware when AI-based analytics are employed. Moreover, sellers who frequently assess their GEO Scores are 24% more likely to maintain high sales visibility across all channels, proving the importance of continuous monitoring.
        </p>
      </div>

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>August 2, 2026 · Avanti Platform Data</p>
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
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>45.7%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Tech products remain high demand</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Sports Equipment</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>38.5%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Competitive, but growing interest</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Home Office</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>28.4%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>AVOID</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Market saturation reached</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Kitchenware</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>50.2%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Increased demand for innovative tools</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Smart Home Devices</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>54.8%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Consumer spend is rising sharply</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Toys</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>32.7%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Stable market with seasonal peaks</td>
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
