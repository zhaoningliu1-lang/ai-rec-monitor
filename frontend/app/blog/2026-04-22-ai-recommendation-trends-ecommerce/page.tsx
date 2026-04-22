import Link from "next/link";

export const metadata = {
  title: "AI Trends: Top Product Categories in Cross-Border E-commerce | Avanti",
  description: "Explore the latest AI-driven product recommendations and their impact on cross-border e-commerce strategies.",
};

export default function BlogPost20260422AiRecommendationTrendsEcommerce() {
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
          <span className="text-xs" style={{ color: "#7070a0" }}>April 22, 2026 · 5 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI Trends: Top Product Categories in Cross-Border E-commerce
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          This week, AI models from ChatGPT to Perplexity are showing a 15% preference for electronics in cross-border e-commerce. Meanwhile, fashion items are seeing a 10% lower recommendation rate compared to last month.
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Electronics category shows a 15% increase in AI model recommendations.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Fashion recommendations have decreased by 10% month-on-month.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Gemini&apos;s AI favors home goods, with a 25% increase in SOV.</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Cross-border fitness product visibility has surged by 18% due to AI trends.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Electronics Lead AI Model Preferences</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          AI models like ChatGPT are increasingly recommending electronics, especially in high-demand categories such as accessories and wearables. Samsung and Apple have seen a 20% rise in SOV, indicating strong consumer interest.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Shifts in Fashion Category Dynamics</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Fashion, traditionally a stronghold in e-commerce, is witnessing a shift. Claude AI shows a 10% reduction in recommending fast fashion brands. Brands like Zara are advised to re-evaluate their cross-border strategies, as consumer preferences lean more towards sustainable fashion.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Rising Interest in Home Goods and Fitness</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Gemini&apos;s AI model highlights a 25% increase in recommendations for home goods. Companies like IKEA are capitalizing on this trend. Additionally, fitness products have seen an 18% rise in cross-border visibility, driven by heightened interest in home fitness solutions.
        </p>
      </div>

      {/* Data Snapshot */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Recommendation Snapshot</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>April 22, 2026 · Avanti Platform Data</p>
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
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>35.7%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Rising SOV in electronics</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Apple</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>34.8%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>High recommendation rate for wearables</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Zara</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>14.9%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>WATCH</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Declining fast fashion interest</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">IKEA</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>25.4%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>STRONG BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Increase in home goods interest</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Adidas</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>18.5%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>BUY</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Growing fitness product visibility</td>
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
