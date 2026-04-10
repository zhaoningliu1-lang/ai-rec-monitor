import Link from "next/link";

export const metadata = {
  title: "AI Recommends: Top Product Categories This Week | Avanti",
  description: "Discover top product categories recommended by AI models in e-commerce this week.",
};

export default function BlogPost20260410AiRecommendationTrends() {
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
          <span className="text-xs" style={{ color: "#7070a0" }}>April 10, 2026 · 5 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI Recommends: Top Product Categories This Week
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          This week, AI models like ChatGPT, Claude, Gemini, and Perplexity indicated a 25% increase in demand for eco-friendly products. Beauty and electronics topped recommendations with notable brand preference shifts.
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Eco-friendly products saw a 25% increase in AI recommendations.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>AI models recommend beauty products 19% more this week.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Electronics lead with 30% share of voice (SOV) among suggested categories.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Performance in supplements category rose by 12%, driven by AI visibility.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Eco-Friendly and Sustainability Influence</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          AI&apos;s emphasis on eco-friendly products surged by 25% this week, suggesting retailers prioritize sustainable packaging. Brands like Seventh Generation and The Honest Company have seen a strong SOV, with a 32% increase in mentions, likely due to shifting consumer preferences highlighted by these models.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Rising Star: Beauty Products</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Beauty products experienced a 19% uptick in AI recommendations, with skincare and cosmetics dominating. Estee Lauder and L&apos;Oreal were at the forefront, each gaining more than 5% in brand visibility. AI trends point to an expanding interest in organic and multi-functional products.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Electronics and AI Impact</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Electronics remain the top recommended category, capturing a 30% SOV. Brands like Sony and Samsung are favored, with 3% and 4% respective increases in visibility. This category&apos;s endurance is attributed to consistent innovation and AI-driven insights into consumer tech preferences.
        </p>
      </div>

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>April 10, 2026 · Avanti Platform Data</p>
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
                <td className="p-4 font-medium text-sm">Seventh Generation</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>32%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Eco-awareness boosts brand’s SOV</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">L&apos;Oreal</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>5.2%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Rising interest in organic beauty</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Sony</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>3%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Strong position due to tech innovation</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Amazon Basics</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>1.5%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>AVOID</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Decline in AI interest</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Fitbit</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>4.7%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Health tech&apos;s growing appeal</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">The Honest Company</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>12%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Boosted by sustainability trends</td>
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
