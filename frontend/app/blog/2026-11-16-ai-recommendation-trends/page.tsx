import Link from "next/link";

export const metadata = {
  title: "AI Trends: Top Recommendations in Ecommerce | Avanti",
  description: "Explore the latest AI-driven product recommendations in cross-border ecommerce and their impact on Amazon sellers.",
};

export default function BlogPost20261116AiRecommendationTrends() {
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
          <span className="text-xs" style={{ color: "#7070a0" }}>November 16, 2026 · 5 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI Trends: Top Recommendations in Ecommerce
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          In the past week, AI models like ChatGPT, Claude, Gemini, and Perplexity have shown a 24% increase in recommendations for electronics, while fashion saw a 15% dip. These trends could significantly impact your brand&apos;s visibility in the cross-border ecommerce market.
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Electronics saw a 24% increase in AI-driven recommendations.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Fashion categories experienced a 15% decline in recommendations.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>ChatGPT&apos;s recommendations for home goods rose by 8.6%.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Brand Share of Voice (SOV) data shows Sony leads electronics at 35.4%.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Electronics Dominate AI Recommendations</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Over the past week, product recommendations by AI models such as ChatGPT and Gemini have highlighted electronics prominently, showing a 24% rise. This sector has seen Sony leading with a 35.4% SOV, pushing sellers towards heightened competition. Trends indicate that smart home devices are particularly favored, correlating with increased consumer interest in home automation.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Decline in Fashion Recommendations</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Contrary to the electronics boom, the fashion category has witnessed a 15% fall in AI model recommendations. Brands like Zara and H&amp;M have recognized a dip in their visibility. Sellers in the fashion space need to re-evaluate their strategies, potentially leveraging seasonal changes or focusing on unique product offerings to regain traction.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Mixed Signals in Home Goods</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Interestingly, ChatGPT has increased its recommendation for home goods by 8.6%, highlighting brands like IKEA. However, SOV analysis shows a spread with no single dominant player, suggesting opportunities for niche market penetration. Sellers in this category might benefit from focusing on sustainable products, aligning with consumer trends towards eco-friendly goods.
        </p>
      </div>

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>November 16, 2026 · Avanti Platform Data</p>
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
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>24%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Electronics are trending upwards with AI recommendations.</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Fashion</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>15%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>AVOID</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Fashion demands strategic changes due to decreased visibility.</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Home Goods</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>8.6%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Potential for growth in sustainable options.</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Sony</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>35.4%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Leading SOV in electronics.</td>
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
