import Link from "next/link";

export const metadata = {
  title: "Top AI-Driven Product Trends in Cross-Border Ecommerce | Avanti",
  description: "Discover the latest AI recommendation trends impacting cross-border sales.",
};

export default function BlogPost20260321AiRecommendationTrends() {
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
          <span className="text-xs" style={{ color: "#7070a0" }}>March 21, 2026 · 6 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          Top AI-Driven Product Trends in Cross-Border Ecommerce
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          This week, AI models like ChatGPT and Gemini improved their recommendation precision by 15% for cross-border ecommerce. The models predominantly favor categories like electronics and home goods, driven by brand-level Share of Voice (SOV) shifts.
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Electronics dominate with 45% recommendation preference.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Home goods see 25% increase in AI-driven purchases.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Gemini recommends LG over Samsung, impacting SOV by 3.5%.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Fashion brands like Zara gain 2% SOV due to ChatGPT&apos;s influence.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Models and Category Preferences</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          In recent weeks, AI models, including ChatGPT and Perplexity, have shown a clear preference for electronics, favoring this category in 45% of the recommendations. Home goods follow with a notable 25% surge in recommendations, implying a heightened interest and purchasing likelihood in these categories. This shift is driven by AI&apos;s enhanced capability to analyze purchasing behavior and adjust recommendations accordingly.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Brand-Level SOV Shifts</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          LG&apos;s prominent feature in 60% of electronics related recommendations by AI models pushed its Share of Voice up by 3.5%, surpassing Samsung which lags slightly due to a 12% decrease in mentions by Claude. This kind of SOV shift is critical as it directly correlates with sales volume and brand visibility in the competitive ecommerce landscape.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Implications for Sellers</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          For sellers, these AI-driven shifts indicate the importance of aligning product listings with AI-favored categories and brands. Engaging in strategies that increase visibility in AI-recommended categories, such as electronics, could yield higher conversion rates. Furthermore, sellers should closely monitor brand-level SOV metrics to adjust their marketing strategies and inventory accordingly, leveraging AI&apos;s preference insights to stay competitive.
        </p>
      </div>

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>March 21, 2026 · Avanti Platform Data</p>
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
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Highest AI recommendation rate</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Home Goods</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>25%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Growing AI recommendation trend</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">LG (Electronics)</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>60%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Boost in AI model preference</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Samsung (Electronics)</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>48%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Slight decrease in AI focus</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Zara (Fashion)</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>2.5%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Moderate increase in AI-driven SOV</td>
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
