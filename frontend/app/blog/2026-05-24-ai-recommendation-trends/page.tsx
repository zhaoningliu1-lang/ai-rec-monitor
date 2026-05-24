import Link from "next/link";

export const metadata = {
  title: "AI Trends: Cross-Border Ecom Recos This Week | Avanti",
  description: "Explore AI-driven product recommendation trends in eCommerce, focusing on brand visibility and category insights.",
};

export default function BlogPost20260524AiRecommendationTrends() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            AI &amp; E-commerce
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>May 24, 2026 · 5 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI Trends: Cross-Border Ecom Recos This Week
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          This week, AI models like ChatGPT, Claude, Gemini, and Perplexity are influencing cross-border e-commerce by enhancing brand visibility. Our data highlights a 45% increase in AI-driven product ranks among top categories.
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>ChatGPT drove a 20% increase in fashion product recommendations.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Gemini&apos;s AI boosted electronic category visibility by 17%.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Claude improved home appliance brand SOV by 25%.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Perplexity reduced miscellaneous category visibility by 12%.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Fashion Category Insights</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          ChatGPT played a pivotal role, boosting fashion product recommendations by 20%. Brands like Zara saw significant SOV improvements, utilizing AI-driven features to enhance recommendation algorithms. The trend signifies a shift towards personalized shopping experiences, with fashion e-commerce expected to capitalize on this for upcoming seasons.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Electronics and AI-driven Visibility</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Gemini&apos;s strong focus on electronics led to a 17% increase in product visibility. Brands such as Sony and Samsung benefited from this surge, with AI models targeting specific consumer preferences. This aligns with a broader industry trend where tech-driven e-commerce gains traction as more consumers seek advanced gadgets.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Home Appliances and Brand SOV</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Claude&apos;s impact was most noticeable in home appliances, boosting brand SOV by 25%. Companies like Philips leveraged AI to refocus user recommendations effectively. Such strategies underline the importance of adaptive technologies that cater to evolving consumer demands in home electronics.
        </p>
      </div>

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>May 24, 2026 · Avanti Platform Data</p>
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
                <td className="p-4 font-medium text-sm">Fashion</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>20%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>High demand for AI-driven fashion recos.</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Electronics</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>17%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Increased visibility through Gemini AI.</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Home Appliances</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>25%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Significant gains in brand SOV with Claude.</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Miscellaneous</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>-12%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>AVOID</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Reduced visibility through Perplexity AI.</td>
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
