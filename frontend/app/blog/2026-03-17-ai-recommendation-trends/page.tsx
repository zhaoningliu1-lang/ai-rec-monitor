import Link from "next/link";

export const metadata = {
  title: "AI Recommendation Trends in Cross-Border Ecommerce | Avanti",
  description: "This week&apos;s top AI-recommended product categories with brand insights.",
};

export default function BlogPost20260317AiRecommendationTrends() {
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
          <span className="text-xs" style={{ color: "#7070a0" }}>March 17, 2026 · 6 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI Recommendation Trends in Cross-Border Ecommerce
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          This week, AI models like ChatGPT and Gemini favored electronics and apparel. Notably, electronics saw a 15% surge in recommendations, with Apple&apos;s SOV at 20.5%.
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>ChatGPT recommended electronics 15% more this week.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Gemini&apos;s top brand: Apple with 20.5% SOV.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Apparel saw a 12% increase in mentions by Claude.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Perplexity highlighted emerging brands in skincare.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Electronics Lead the AI Recommendations</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          ChatGPT&apos;s recommendation frequency for electronics increased by 15% this week, indicating a growing consumer interest or enhanced product visibility. Apple leads the category with a 20.5% share of voice (SOV), suggesting it&apos;s a strong performer in AI-driven platforms. Samsung follows closely at 18.7%. Sellers should consider boosting stock levels and marketing for these brands, especially if they&apos;re operating in regions with high digital adoption rates.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Apparel Category Gains Momentum</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Claude AI indicated a notable 12% increase in recommendations for apparel, citing brands like Nike and Adidas. Nike, with a 17.4% SOV, appears to be gaining traction among younger demographics. This shift opens up opportunities for sellers to tap into seasonal trends and rapidly changing fashion cycles, leveraging AI analytics to tailor their offerings.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Rising Stars in Skincare</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Perplexity AI brought attention to emerging skincare brands this week, a sector that saw an 8.5% rise in AI-driven discussions. Brands such as The Ordinary (14.9% SOV) and Drunk Elephant are becoming increasingly popular. For sellers, focusing on cruelty-free and organic products could align well with the preferences AI trends reveal, thus maximizing consumer engagement.
        </p>
      </div>

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>March 17, 2026 · Avanti Platform Data</p>
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
                <td className="p-4 font-medium text-sm">Apple (Electronics)</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>20.5%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Leading in SOV, continues to dominate recommendations.</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Nike (Apparel)</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>17.4%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Gaining popularity among youth, capitalize on trends.</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">The Ordinary (Skincare)</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>14.9%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Increasing interest, especially in clean beauty.</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Samsung (Electronics)</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>18.7%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>High SOV, remains competitive in tech.</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Adidas (Apparel)</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>16.2%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>AVOID</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Slight decline, may require marketing push.</td>
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
