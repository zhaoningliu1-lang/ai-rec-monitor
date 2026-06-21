import Link from "next/link";

export const metadata = {
  title: "AI Trends: Key E-commerce Product Recommendations | Avanti",
  description: "Discover AI-powered product category trends with brand SOV insights.",
};

export default function BlogPost20260621AiRecommendationTrends() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            ecommerce trends
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>June 21, 2026 · 4 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI Trends: Key E-commerce Product Recommendations
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          AI models dramatically influence e-commerce, with 67% of global recommendations in electronics and 24% in home goods. Understanding these trends can shift your AI strategy and boost sales.
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>67% of AI product recommendations focus on electronics.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>ChatGPT leads with 28% SOV in sporting goods.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Gemini&apos;s recommendations for fashion grew by 15% this week.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Home goods see a 24% recommendation rate from AI models.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI&apos;s Top Product Categories This Week</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Electronics remain a dominant category with AI models focusing 67% of product recommendations here. Brands like Samsung and Sony benefit significantly from this, capturing 34.2% and 29.5% of SOV respectively. Home goods have also gained traction, holding a 24% recommendation rate. This reflects shifting consumer priorities towards home enhancement products.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Brand-Level Share of Voice (SOV) Insights</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          ChatGPT dominates the sporting goods category with a 28% SOV. In contrast, Claude.ai has increased its focus on beauty products, achieving a 17% SOV. This information should guide sellers in optimizing their product listings and marketing strategies to align with these trends. Electronics brands are particularly advised to capitalize on this by investing in AI-driven marketing.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Seller Implications and Strategy Adjustments</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Understanding AI recommendation trends is crucial for maximizing sales. For instance, with 15% growth in Gemini&apos;s fashion recommendations, sellers in this category should enhance product visibility on platforms like Gemini. AI-driven insights should be integrated in decision-making processes, ensuring alignment with top-trending categories and maintaining competitive advantage.
        </p>
      </div>

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>June 21, 2026 · Avanti Platform Data</p>
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
                <td className="p-4 font-medium text-sm">Samsung (Electronics)</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>34.2%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>High SOV, priority investment area</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Sony (Electronics)</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>29.5%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Sustained demand, increase listings</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Adidas (Sporting Goods)</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>18%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Growing attention, stay alert</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Reebok (Sporting Goods)</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>10%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>AVOID</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Low interest currently</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">IKEA (Home Goods)</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>22%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>High recommendation rate</td>
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
