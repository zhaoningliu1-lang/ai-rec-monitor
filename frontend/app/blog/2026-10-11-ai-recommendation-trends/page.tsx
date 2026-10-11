import Link from "next/link";

export const metadata = {
  title: "AI Boosts E-commerce: Top Recommended Categories | Avanti",
  description: "Explore the latest AI recommendations in cross-border e-commerce and understand brand SOV.",
};

export default function BlogPost20261011AiRecommendationTrends() {
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
          <span className="text-xs" style={{ color: "#7070a0" }}>October 11, 2026 · 7 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI Boosts E-commerce: Top Recommended Categories
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          This week, AI models like ChatGPT and Claude show a 15% increase in recommendation activity for electronics. Brand-level SOV analysis indicates strong support for Apple and Samsung.
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Electronics have a 15% increase in AI recommendations.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Apple sees a 25% higher Share of Voice (SOV) in AI mentions.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Home &amp; kitchen items recommended by Perplexity increased by 12%.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Fashion, despite high turnover, sees a drop in AI preference by 5%.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Models and Category Recommendations</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          ChatGPT and Claude are focusing heavily on electronics this week, with a surge of 15% in recommendation frequency. This trend aligns with a rise in new product launches from major brands. Sellers in this category should optimize their listings to align with AI-curated suggestions, potentially enhancing visibility.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Spotlight on Brand Share of Voice</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Apple dominates the conversation with a 25% higher Share of Voice in AI model outputs. Samsung follows closely with 18%, suggesting these brands are leveraging AI effectively for market dominance. Sellers aligned with these brands could experience increased traction in their listings.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Category Divergence: Home &amp; Kitchen vs. Fashion</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Perplexity AI shows a 12% increase in recommendations for home &amp; kitchen products. In contrast, the fashion category us seeing a decrease of 5% in AI-driven visibility. This suggests a strategic shift sellers should note, possibly focusing more on consistent performers like home &amp; kitchen.
        </p>
      </div>

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>October 11, 2026 · Avanti Platform Data</p>
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
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>15%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Optimizing listings could enhance visibility.</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Home &amp; Kitchen</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>12%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Increasing relevance in AI recommendations.</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Fashion</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>-5%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Dropping AI preference, monitor closely.</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Apple</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>25%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Dominates Share of Voice.</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Samsung</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>18%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>High AI model visibility.</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Furniture</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>2%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>AVOID</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Minimal current AI interest.</td>
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
