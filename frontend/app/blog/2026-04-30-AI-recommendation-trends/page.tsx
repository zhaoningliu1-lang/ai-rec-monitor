import Link from "next/link";

export const metadata = {
  title: "AI Trends: Top Product Categories in Cross-Border E-commerce | Avanti",
  description: "Explore AI recommendation trends and top product categories this week.",
};

export default function BlogPost20260430AiRecommendationTrends() {
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
          <span className="text-xs" style={{ color: "#7070a0" }}>April 30, 2026 · 5 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI Trends: Top Product Categories in Cross-Border E-commerce
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          This week, AI models like ChatGPT, Claude, and Gemini have shown increased preferences for certain product categories in cross-border e-commerce. Electronics lead with a 27% recommendation rate, followed by health supplements at 18%.
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Electronics dominate with 27% AI recommendation rate</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Health supplements see an 18% increase in AI preferences</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Fashion brands capture a 14% share of voice in AI models</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Home goods rise 11%, entering AI&apos;s top recommended categories</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Models Favor Electronics</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Electronics have consistently held the top spot in AI recommendations this week. With a 27% share, this category is primarily driven by consumer electronics brands like Samsung and Apple. ChatGPT and Claude showed a distinct preference due to these brands&apos; technological advancements and consumer demand metrics.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Health Supplements Gain Traction</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          AI models have increased their focus on health supplements, now accounting for 18% of recommendations. Brands such as Nature&apos;s Bounty and Optimum Nutrition are leading the charge. This trend reflects growing consumer awareness and demand for wellness products. Perplexity&apos;s recommendation engine has particularly emphasized these brands due to their high engagement rates.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Emerging Categories: Fashion and Home Goods</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Fashion and home goods are emerging categories with a noticeable increase in AI recommendations. Fashion holds a 14% share of voice, with brands like Nike and Zara leveraging AI algorithms for enhanced brand visibility. Home goods have entered the spotlight with an 11% rise, as ChatGPT and Gemini recognize the uptrend in consumer interest towards modern home aesthetics.
        </p>
      </div>

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>April 30, 2026 · Avanti Platform Data</p>
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
                <td className="p-4 font-medium text-sm">Consumer Electronics</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>27%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>High AI priority due to tech advancements</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Health Supplements</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>18%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Growing trend in wellness boosts potential</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Fashion</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>14%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Consider investments as AI focus grows</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Home Goods</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>11%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Increased consumer interest makes it appealing</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Toys &amp; Games</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>6%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>AVOID</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Decreasing interest in AI recommendations</td>
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
