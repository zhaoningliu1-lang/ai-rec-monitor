import Link from "next/link";

export const metadata = {
  title: "AI Trends: Top-Recommended Products This Week | Avanti",
  description: "Discover weekly AI recommendations and brand share data for savvy sellers.",
};

export default function BlogPost20261108AiRecommendationTrends() {
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
          <span className="text-xs" style={{ color: "#7070a0" }}>November 8, 2026 · 5 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI Trends: Top-Recommended Products This Week
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          This week, AI models showed a 38% increase in product recommendations for consumer electronics in cross-border ecommerce. Brands such as Samsung and Sony have witnessed a notable surge in brand-level share of voice (SOV).
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Consumer electronics recommendations up 38%</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Samsung leads with 27% brand SOV</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Fashion items recommended 22% less</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>AI models increase travel gear visibility by 19%</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Electronics Dominate AI Recommendations</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          AI models like ChatGPT and Claude are increasingly favoring consumer electronics, leading to a 38% surge in their recommendations. Samsung commands a strong 27% brand SOV in this category, outpacing its closest competitor, Sony, which holds 19%. This trend presents a prime opportunity for electronics sellers to capitalize on the heightened demand by optimizing their listings and running targeted advertising.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Fashion Sees a Dip in Recommendations</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Contrary to the electronics boom, fashion items saw a 22% decline in AI-driven recommendations this week. Brands like Zara and H&amp;M are experiencing reduced visibility. For sellers in the fashion industry, this suggests a need to reassess AI integration strategies and potentially explore repositioning or diversifying their offerings to regain traction.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Rising Interest in Travel Gear</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          AI tools such as Gemini and Perplexity have increased their recommendation frequency for travel gear by 19%. Brands like Samsonite and Travelpro are benefiting from this uptick. Sellers should leverage this trend by highlighting travel-related use cases in product descriptions and expanding into related accessories to capture a share of the growing interest.
        </p>
      </div>

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>November 8, 2026 · Avanti Platform Data</p>
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
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>27%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Leading consumer electronics share of voice.</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Sony</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>19%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Strong performer in electronics.</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Zara</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>6%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>AVOID</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Declining visibility in fashion.</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Samsonite</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>15%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Growing interest in travel gear.</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Nike</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>12%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Variable interest in sportswear.</td>
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
