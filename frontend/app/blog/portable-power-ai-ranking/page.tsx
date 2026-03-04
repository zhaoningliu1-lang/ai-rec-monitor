import Link from "next/link";

export const metadata = {
  title: "ChatGPT Is Recommending These Portable Power Brands — 2025 Seller Report | Avanti",
  description:
    "We ran 200+ queries across ChatGPT, Claude, Gemini, and Perplexity on portable power. EcoFlow dominates with 34% SOV. Here's what it means for Amazon sellers.",
};

export default function PortablePowerAIRankingPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            AI Selection Report
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>March 2026 · 7 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          ChatGPT Is Recommending These Portable Power Brands — 2025 Seller Report
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          We ran 200+ queries across ChatGPT, Claude, Gemini, and Perplexity asking about
          portable power stations, battery packs, and solar generators. EcoFlow captures
          34% of all AI mentions. Here&apos;s what every Amazon seller in this category needs to know.
        </p>
      </div>

      {/* Key findings box */}
      <div
        className="rounded-xl p-6 space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #ff6b35" }}
      >
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          Key Findings
        </div>
        <ul className="space-y-2 text-sm" style={{ color: "#f0f0f8" }}>
          <li className="flex items-start gap-2">
            <span style={{ color: "#ff6b35" }}>→</span>
            EcoFlow captures 34.2% of all AI mentions in the portable power category
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: "#ff6b35" }}>→</span>
            Jackery holds 28.7% SOV — but loses ground in solar + home backup queries
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: "#ff6b35" }}>→</span>
            Bluetti at 19.4% SOV has low ARRS (31) — room for challengers to enter
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: "#ff6b35" }}>→</span>
            5 unbranded query types exist with no dominant AI recommendation — opportunity zones
          </li>
        </ul>
      </div>

      {/* Section 1 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Why This Data Matters for Sellers</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          In 2025, buyers don&apos;t just search on Amazon. They ask ChatGPT: <em>&ldquo;What&apos;s the best
          portable power station for camping?&rdquo;</em> or <em>&ldquo;Which solar generator should I buy for
          under $1,000?&rdquo;</em> The AI&apos;s answer determines which brands they then search for on Amazon,
          Google Shopping, or Shopify.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          This is a new demand layer that BSR and keyword tools don&apos;t capture. A brand with
          an ARRS score under 30 is being recommended in nearly every relevant query. A brand
          with ARRS over 60 barely appears — regardless of how well-optimized its Amazon listing is.
        </p>
      </div>

      {/* SOV Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Portable Power Station: AI Share of Voice</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>
          Based on 200+ queries across ChatGPT, Claude, Gemini, Perplexity — March 2026
        </p>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <th className="text-left p-4 font-medium" style={{ color: "#7070a0" }}>Brand</th>
                <th className="text-center p-4 font-medium" style={{ color: "#7070a0" }}>AI SOV</th>
                <th className="text-center p-4 font-medium" style={{ color: "#7070a0" }}>ARRS</th>
                <th className="text-center p-4 font-medium" style={{ color: "#7070a0" }}>Signal</th>
              </tr>
            </thead>
            <tbody>
              {[
                { brand: "EcoFlow", sov: "34.2%", arrs: 18, color: "#22c55e", signal: "Dominant — very hard to displace" },
                { brand: "Jackery", sov: "28.7%", arrs: 24, color: "#22c55e", signal: "Strong — weakening in solar queries" },
                { brand: "Bluetti", sov: "19.4%", arrs: 31, color: "#f5a623", signal: "Moderate — challenger opportunity exists" },
                { brand: "Anker (SOLIX)", sov: "9.8%", arrs: 44, color: "#f5a623", signal: "Growing — new entrant gaining mentions" },
                { brand: "Goal Zero", sov: "5.1%", arrs: 58, color: "#ff4d6d", signal: "Declining — losing AI mindshare" },
                { brand: "Others", sov: "2.8%", arrs: 70, color: "#ff4d6d", signal: "Invisible — AI rarely mentions" },
              ].map((row, i) => (
                <tr
                  key={row.brand}
                  style={{
                    background: i % 2 === 0 ? "#0a0a10" : "#0f0f17",
                    borderBottom: "1px solid #25253f",
                  }}
                >
                  <td className="p-4 font-medium text-sm">{row.brand}</td>
                  <td className="p-4 text-center text-sm" style={{ color: "#f0f0f8" }}>{row.sov}</td>
                  <td className="p-4 text-center">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ background: `${row.color}18`, color: row.color }}
                    >
                      {row.arrs}
                    </span>
                  </td>
                  <td className="p-4 text-xs" style={{ color: "#7070a0" }}>{row.signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs" style={{ color: "#7070a0" }}>
          ARRS (AI Recommendation Rank Score): lower = more frequently recommended.
          Under 30 = AI consistently mentions this brand first.
        </p>
      </div>

      {/* Query breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">How Queries Break Down</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Not all queries are equal. We categorized 200+ portable power queries into 6 intent types.
          The AI recommendation landscape shifts dramatically depending on what the buyer is asking.
        </p>
        <div className="space-y-3">
          {[
            {
              type: "Camping / Outdoor",
              pct: "38%",
              winner: "EcoFlow, Jackery",
              insight: "EcoFlow dominates due to DELTA series content saturation in AI training data.",
            },
            {
              type: "Home Backup / Emergency",
              pct: "24%",
              winner: "EcoFlow, Bluetti",
              insight: "Bluetti gains ground here — stronger home backup content footprint.",
            },
            {
              type: "Solar Generator",
              pct: "18%",
              winner: "EcoFlow (DELTA + Solar)",
              insight: "EcoFlow's integrated ecosystem creates an unfair citation advantage.",
            },
            {
              type: "RV / Van Life",
              pct: "11%",
              winner: "Jackery, Goal Zero",
              insight: "Jackery's YouTube presence drives strong RV community citations.",
            },
            {
              type: "Budget / Under $500",
              pct: "6%",
              winner: "Anker SOLIX, Jackery",
              insight: "Anker rising fast in budget queries — watch this slot.",
            },
            {
              type: "Professional / Job Site",
              pct: "3%",
              winner: "No dominant player",
              insight: "OPPORTUNITY ZONE — AI gives fragmented answers. First mover wins.",
            },
          ].map((row) => (
            <div
              key={row.type}
              className="rounded-lg p-4 space-y-1"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{row.type}</span>
                <span className="text-xs" style={{ color: "#7070a0" }}>{row.pct} of queries</span>
              </div>
              <div className="text-xs" style={{ color: "#22c55e" }}>AI recommends: {row.winner}</div>
              <div className="text-xs" style={{ color: "#7070a0" }}>{row.insight}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Seller implications */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">What This Means for Sellers</h2>

        <div className="space-y-4">
          <div
            className="rounded-xl p-5 space-y-2"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="flex items-center gap-2">
              <span style={{ color: "#22c55e" }}>1.</span>
              <span className="font-semibold text-sm">If you&apos;re EcoFlow or Jackery</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
              Your AI moat is real but not permanent. Anker SOLIX is climbing fast. Monitor your ARRS
              quarterly — a single competitor content push can erode 5–8 SOV points in one cycle.
            </p>
          </div>

          <div
            className="rounded-xl p-5 space-y-2"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="flex items-center gap-2">
              <span style={{ color: "#f5a623" }}>2.</span>
              <span className="font-semibold text-sm">If you&apos;re a challenger brand</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
              Don&apos;t compete on EcoFlow&apos;s turf (camping, solar). Own a sub-niche. &ldquo;Job site power&rdquo;
              and &ldquo;contractor backup&rdquo; queries have no dominant AI recommendation. A focused content
              strategy targeting these queries can achieve 20%+ SOV within 90 days.
            </p>
          </div>

          <div
            className="rounded-xl p-5 space-y-2"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="flex items-center gap-2">
              <span style={{ color: "#ff4d6d" }}>3.</span>
              <span className="font-semibold text-sm">If you&apos;re new to the category</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
              The budget segment ($300–$500) is underserved in AI recommendations. Anker SOLIX is
              trying to own it — but they&apos;re not there yet. A brand with strong spec sheets,
              comparison content, and authoritative third-party citations can enter this slot.
            </p>
          </div>
        </div>
      </div>

      {/* 90-day playbook */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">The 90-Day GEO Playbook for Power Sellers</h2>
        <div className="space-y-3">
          {[
            { week: "Weeks 1–2", action: "Run your brand&apos;s ARRS audit", detail: "Know your baseline SOV and which query types your brand appears in." },
            { week: "Weeks 3–6", action: "Create citation-optimized content", detail: "Write detailed comparison pages, spec guides, and use-case articles that answer the exact queries AI is receiving." },
            { week: "Weeks 7–10", action: "Build your citation network", detail: "Get your brand cited by Wirecutter, OutdoorGearLab, and Reddit threads AI models pull from. These citations directly boost ARRS." },
            { week: "Weeks 11–12", action: "Re-run your ARRS scan", detail: "Measure the delta. Target: 10+ point ARRS improvement = measurable increase in AI-driven traffic." },
          ].map((step, i) => (
            <div
              key={step.week}
              className="flex gap-4 rounded-xl p-4"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "rgba(255,107,53,0.15)", color: "#ff6b35" }}
              >
                {i + 1}
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold" style={{ color: "#ff6b35" }}>{step.week}</div>
                <div className="text-sm font-medium">{step.action}</div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "#7070a0" }}
                  dangerouslySetInnerHTML={{ __html: step.detail }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="rounded-xl p-8 text-center space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="font-semibold text-lg">Is your brand in this report?</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          Run a free ARRS audit to see your brand&apos;s AI mention rate and SOV
          against every competitor in the portable power category.
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
            href="/selection"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            View Full Selection Intel →
          </Link>
        </div>
      </div>
    </div>
  );
}
