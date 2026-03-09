import Link from "next/link";

export const metadata = {
  title: "Helium 10 vs Avanti: Traditional Product Research vs AI Visibility | Avanti",
  description:
    "Helium 10 tells you what sold last month. Avanti tells you what AI is recommending today. Here's when you need each — and why serious cross-border sellers need both.",
};

export default function Helium10VsAvantiPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            Tool Comparison
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>March 2026 · 5 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          Helium 10 vs Avanti: Traditional Product Research vs AI Visibility Monitoring
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          Helium 10 is built for the Amazon algorithm. Avanti is built for the AI recommendation
          layer. They answer different questions. Here&apos;s an honest breakdown of when you need each —
          and why the smartest sellers are using both.
        </p>
      </div>

      {/* TL;DR */}
      <div
        className="rounded-xl p-5 space-y-3"
        style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.3)" }}
      >
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          TL;DR
        </div>
        <ul className="space-y-2 text-xs" style={{ color: "#f0f0f8" }}>
          <li className="flex items-start gap-2">
            <span style={{ color: "#ff6b35" }}>→</span>
            Helium 10: tracks historical demand signals on Amazon (BSR, search volume, reviews)
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: "#ff6b35" }}>→</span>
            Avanti: tracks where AI models are sending future buyers right now
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: "#ff6b35" }}>→</span>
            Helium 10 tells you what worked. Avanti tells you what&apos;s coming.
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: "#ff6b35" }}>→</span>
            Neither replaces the other — they&apos;re measuring different layers of the buying funnel.
          </li>
        </ul>
      </div>

      {/* The core difference */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">The Core Difference: Past vs Future Demand</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Both tools help cross-border sellers make smarter decisions — but they&apos;re looking at
          fundamentally different data sources.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="rounded-xl p-5 space-y-3"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="font-bold text-sm">Helium 10</div>
            <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
              Reads Amazon&apos;s platform data — search volume, BSR rank history, review velocity,
              competitor sales estimates. Everything is based on what buyers have done on Amazon
              in the past 30–90 days.
            </p>
            <div className="text-xs font-semibold" style={{ color: "#22c55e" }}>
              Answers: &ldquo;What did buyers search for and buy?&rdquo;
            </div>
          </div>
          <div
            className="rounded-xl p-5 space-y-3"
            style={{ background: "#0f0f17", border: "1px solid #ff6b35" }}
          >
            <div className="font-bold text-sm">Avanti</div>
            <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
              Queries ChatGPT, Claude, Gemini, and Perplexity with buyer questions, then analyzes
              which brands and categories the AI recommends. This is forward-looking — it captures
              where intent is being directed before it shows up in Amazon data.
            </p>
            <div className="text-xs font-semibold" style={{ color: "#ff6b35" }}>
              Answers: &ldquo;What is AI telling buyers to buy right now?&rdquo;
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Feature Comparison</h2>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <th className="text-left p-4 font-medium" style={{ color: "#7070a0" }}>Feature</th>
                <th className="text-center p-4 font-medium">Helium 10</th>
                <th className="text-center p-4 font-bold" style={{ color: "#ff6b35" }}>Avanti</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Data source", h10: "Amazon platform", av: "ChatGPT, Claude, Gemini, Perplexity" },
                { feature: "Signal type", h10: "Historical (30–90 days lag)", av: "Real-time AI recommendations" },
                { feature: "BSR / rank tracking", h10: "✓", av: "—" },
                { feature: "Keyword search volume", h10: "✓", av: "—" },
                { feature: "Review monitoring", h10: "✓", av: "—" },
                { feature: "Listing optimization", h10: "✓", av: "—" },
                { feature: "AI brand visibility (GEO Score)", h10: "—", av: "✓" },
                { feature: "AI Share of Voice (SOV)", h10: "—", av: "✓" },
                { feature: "Competitor AI benchmarking", h10: "—", av: "✓" },
                { feature: "AI selection intelligence", h10: "—", av: "✓ (which categories AI is pushing)" },
                { feature: "GEO optimization guidance", h10: "—", av: "✓" },
                { feature: "Pricing", h10: "$99–$279/mo", av: "$79–$499/mo" },
                { feature: "Best for", h10: "Amazon listing ops", av: "AI-era brand strategy" },
              ].map((row, i) => (
                <tr
                  key={row.feature}
                  style={{
                    background: i % 2 === 0 ? "#0a0a10" : "#0f0f17",
                    borderBottom: "1px solid #25253f",
                  }}
                >
                  <td className="p-4" style={{ color: "#f0f0f8" }}>{row.feature}</td>
                  <td className="p-4 text-center" style={{ color: row.h10 === "—" ? "#3a3a5c" : "#f0f0f8" }}>
                    {row.h10}
                  </td>
                  <td className="p-4 text-center" style={{ color: row.av === "—" ? "#3a3a5c" : "#f0f0f8" }}>
                    {row.av}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* When to use which */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">When to Use Each</h2>
        <div className="space-y-4">
          <div
            className="rounded-xl p-5 space-y-3"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="font-semibold text-sm">Use Helium 10 when...</div>
            <ul className="space-y-1.5 text-xs" style={{ color: "#7070a0" }}>
              <li className="flex items-start gap-2">
                <span style={{ color: "#22c55e" }}>✓</span>
                Optimizing your existing Amazon listing for search ranking
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#22c55e" }}>✓</span>
                Researching competitor sales velocity and pricing
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#22c55e" }}>✓</span>
                Finding high-volume, low-competition keywords
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#22c55e" }}>✓</span>
                Monitoring review health and listing hijacks
              </li>
            </ul>
          </div>

          <div
            className="rounded-xl p-5 space-y-3"
            style={{ background: "#0f0f17", border: "1px solid #ff6b35" }}
          >
            <div className="font-semibold text-sm">Use Avanti when...</div>
            <ul className="space-y-1.5 text-xs" style={{ color: "#7070a0" }}>
              <li className="flex items-start gap-2">
                <span style={{ color: "#ff6b35" }}>✓</span>
                Evaluating whether to enter a new category (does AI recommend it?)
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#ff6b35" }}>✓</span>
                Benchmarking your brand&apos;s AI visibility against competitors
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#ff6b35" }}>✓</span>
                Building a content strategy that gets cited by AI models
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#ff6b35" }}>✓</span>
                Monitoring for AI hallucinations about your brand (wrong specs, wrong pricing)
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#ff6b35" }}>✓</span>
                Identifying which sub-niches have no dominant AI recommendation yet
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* The gap Helium 10 misses */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">The Gap Helium 10 Cannot See</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Here&apos;s the fundamental problem with relying solely on Helium 10 in 2026:
          it measures Amazon&apos;s historical data. But the buying decision is increasingly happening
          before the buyer ever reaches Amazon.
        </p>
        <div
          className="rounded-xl p-5 space-y-4"
          style={{ background: "#0f0f17", border: "1px solid #25253f" }}
        >
          <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
            Consider this scenario: A buyer searches ChatGPT for &ldquo;best wireless earbuds for working
            out under $150.&rdquo; ChatGPT recommends Sony, Jabra, and Anker. The buyer searches for
            those brands on Amazon. Your brand — which has an 4.5-star rating and a Helium 10
            Opportunity Score of 8 — is never even considered.
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
            Helium 10 can&apos;t tell you this is happening. It will still show you &ldquo;high search volume&rdquo;
            because searches for Sony and Jabra are high — but those searches are going to your
            competitors, not to you.
          </p>
          <p className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>
            Avanti shows you the AI layer — where the consideration set is formed before Amazon
            search begins.
          </p>
        </div>
      </div>

      {/* Verdict */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">The Verdict: Complementary, Not Competing</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Serious cross-border sellers should use both. Think of Helium 10 as your Amazon
          operations layer (listing performance, PPC, keyword coverage) and Avanti as your
          strategic intelligence layer (where demand is going, which brands AI is building,
          where to enter next).
        </p>
        <div
          className="rounded-xl p-5 space-y-3"
          style={{ background: "#0f0f17", border: "1px solid #25253f" }}
        >
          <div className="text-sm font-semibold">Combined stack for 2026</div>
          <div className="space-y-2 text-xs" style={{ color: "#7070a0" }}>
            <div className="flex items-start gap-2">
              <span style={{ color: "#22c55e" }}>Helium 10</span>
              <span>→ Amazon listing ops, keyword research, BSR tracking</span>
            </div>
            <div className="flex items-start gap-2">
              <span style={{ color: "#ff6b35" }}>Avanti</span>
              <span>→ AI visibility, brand benchmarking, selection intelligence, GEO strategy</span>
            </div>
            <div className="flex items-start gap-2">
              <span style={{ color: "#7070a0" }}>Avanti Cost Optimizer</span>
              <span>→ Free. Shows you how to fund both subscriptions from AI ops savings.</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        className="rounded-xl p-8 text-center space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="font-semibold text-lg">See where AI ranks your brand vs competitors</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          Free GEO Score audit. No credit card. Takes 2 minutes.
          See the data Helium 10 can&apos;t show you.
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
            href="/pricing"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            View Pricing →
          </Link>
        </div>
      </div>
    </div>
  );
}
