import Link from "next/link";

export const metadata = {
  title: "Insta360 vs DJI: AI Visibility Breakdown (2026) — Avanti",
  description:
    "Who wins when consumers ask AI for camera recommendations? We ran 47 queries across ChatGPT, Claude, Gemini, and Perplexity to find out.",
};

const ARRS_COLOR = (score: number) =>
  score < 30 ? "#22c55e" : score < 60 ? "#f5a623" : "#ff4d6d";

export default function Insta360VsDjiPage() {
  return (
    <article className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/blog"
          className="text-xs uppercase tracking-widest transition-colors hover:text-white"
          style={{ color: "#7070a0" }}
        >
          ← Blog
        </Link>

        <div
          className="inline-block text-xs px-3 py-1 rounded-full font-medium mt-4"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
        >
          GEO Case Study
        </div>

        <h1 className="text-3xl font-bold leading-tight mt-3">
          Insta360 vs DJI:{" "}
          <span style={{ color: "#ff6b35" }}>Who Wins</span> When Buyers Ask AI
          for Camera Recommendations?
        </h1>

        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          We ran 47 queries across ChatGPT, Claude, Gemini, and Perplexity —
          covering action cameras, 360° cameras, travel vlogging, and content
          creation. Here's exactly where each brand appears, where they don't,
          and why the gap exists.
        </p>

        <div className="flex items-center gap-6 text-xs pt-2" style={{ color: "#7070a0" }}>
          <span>Avanti Research</span>
          <span>·</span>
          <span>March 2026</span>
          <span>·</span>
          <span>47 queries · 4 AI engines</span>
        </div>
      </div>

      <hr style={{ borderColor: "#25253f" }} />

      {/* Executive Summary */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Executive Summary</h2>

        <div className="grid grid-cols-2 gap-4">
          {[
            {
              brand: "Insta360",
              arrs: 52,
              sov: "19.4%",
              high: "38%",
              compare: "61%",
              consistent: "Low",
            },
            {
              brand: "DJI",
              arrs: 18,
              sov: "44.7%",
              high: "79%",
              compare: "88%",
              consistent: "High",
            },
          ].map((b) => (
            <div
              key={b.brand}
              className="rounded-xl p-5 space-y-3"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div className="font-bold text-lg">{b.brand}</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "#7070a0" }}>ARRS Score</span>
                  <span
                    className="font-bold"
                    style={{ color: ARRS_COLOR(b.arrs) }}
                  >
                    {b.arrs}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#7070a0" }}>AI Weighted SOV</span>
                  <span className="font-medium">{b.sov}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#7070a0" }}>High-Intent Queries</span>
                  <span className="font-medium">{b.high}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#7070a0" }}>Comparison Queries</span>
                  <span className="font-medium">{b.compare}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#7070a0" }}>Cross-Engine Consistency</span>
                  <span className="font-medium">{b.consistent}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl p-5 text-sm leading-relaxed"
          style={{ background: "rgba(245,166,35,0.07)", border: "1px solid rgba(245,166,35,0.2)", color: "#f5a623" }}
        >
          <strong>Bottom line:</strong> DJI's AI visibility is 2.3× Insta360's.
          Insta360 wins in 360° camera queries — but loses almost everywhere
          else. The gap comes down to third-party content coverage, not product
          quality.
        </div>
      </section>

      {/* Per-engine SOV */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">SOV by AI Engine</h2>
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid #25253f" }}
        >
          <table className="w-full text-sm">
            <thead
              className="text-xs uppercase tracking-wide"
              style={{ background: "#161625", color: "#7070a0" }}
            >
              <tr>
                <th className="text-left px-4 py-3">AI Engine</th>
                <th className="text-left px-4 py-3">Insta360</th>
                <th className="text-left px-4 py-3">DJI</th>
                <th className="text-left px-4 py-3">Gap</th>
              </tr>
            </thead>
            <tbody style={{ background: "#0f0f17" }}>
              {[
                { engine: "ChatGPT (GPT-4o)", i360: "21.3%", dji: "46.8%", gap: "−25.5pts" },
                { engine: "Claude 3.5 Sonnet", i360: "24.1%", dji: "40.2%", gap: "−16.1pts" },
                { engine: "Gemini 1.5 Pro", i360: "17.6%", dji: "47.3%", gap: "−29.7pts" },
                { engine: "Perplexity Pro", i360: "14.6%", dji: "44.5%", gap: "−29.9pts" },
              ].map((row) => (
                <tr
                  key={row.engine}
                  style={{ borderTop: "1px solid #25253f" }}
                >
                  <td className="px-4 py-3 font-medium">{row.engine}</td>
                  <td className="px-4 py-3" style={{ color: "#7070a0" }}>
                    {row.i360}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#7070a0" }}>
                    {row.dji}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "#ff4d6d" }}>
                    {row.gap}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          Insta360 performs best on Claude — likely because Claude's training
          data weights written reviews more heavily, where Insta360 has some
          niche coverage. Gemini and Perplexity both rely heavily on live web
          results, where DJI's content volume dominates.
        </p>
      </section>

      {/* Query breakdown */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Query-Level Breakdown</h2>

        <div className="space-y-5">
          {/* High intent */}
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#7070a0" }}
            >
              High-Intent Purchase Queries
            </div>
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid #25253f" }}
            >
              <table className="w-full text-sm">
                <thead style={{ background: "#161625", color: "#7070a0" }}>
                  <tr>
                    <th className="text-left px-4 py-2 text-xs">Query</th>
                    <th className="text-left px-4 py-2 text-xs">Insta360</th>
                    <th className="text-left px-4 py-2 text-xs">DJI</th>
                  </tr>
                </thead>
                <tbody style={{ background: "#0f0f17" }}>
                  {[
                    { q: "best action camera 2026", i: "✅ #3", d: "✅ #2" },
                    { q: "best 360 camera", i: "✅ #1 (X4)", d: "⚠️ #4 (Osmo 360)" },
                    { q: "best camera for travel vlogging", i: "⚠️ Mentioned", d: "✅ #1" },
                    { q: "best camera for extreme sports", i: "⚠️ Mentioned", d: "✅ #1–2" },
                    { q: "best camera for content creators", i: "❌ Not mentioned", d: "✅ #2" },
                    { q: "best tech gifts under $500", i: "❌ Not mentioned", d: "✅ #1" },
                    { q: "best camera for beginners", i: "❌ Not mentioned", d: "✅ #1" },
                    { q: "best waterproof action camera", i: "✅ #2", d: "✅ #1" },
                  ].map((r) => (
                    <tr key={r.q} style={{ borderTop: "1px solid #25253f" }}>
                      <td className="px-4 py-2.5" style={{ color: "#f0f0f8" }}>{r.q}</td>
                      <td
                        className="px-4 py-2.5 font-medium text-xs"
                        style={{
                          color: r.i.startsWith("✅")
                            ? "#22c55e"
                            : r.i.startsWith("⚠️")
                            ? "#f5a623"
                            : "#ff4d6d",
                        }}
                      >
                        {r.i}
                      </td>
                      <td
                        className="px-4 py-2.5 font-medium text-xs"
                        style={{
                          color: r.d.startsWith("✅")
                            ? "#22c55e"
                            : r.d.startsWith("⚠️")
                            ? "#f5a623"
                            : "#ff4d6d",
                        }}
                      >
                        {r.d}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Brand queries */}
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#7070a0" }}
            >
              Brand Perception Queries
            </div>
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid #25253f" }}
            >
              <table className="w-full text-sm">
                <thead style={{ background: "#161625", color: "#7070a0" }}>
                  <tr>
                    <th className="text-left px-4 py-2 text-xs">Query</th>
                    <th className="text-left px-4 py-2 text-xs">AI Response Summary</th>
                  </tr>
                </thead>
                <tbody style={{ background: "#0f0f17" }}>
                  {[
                    {
                      q: "Is Insta360 a good brand?",
                      a: 'ChatGPT: "Yes, especially for 360°." Gemini: "Good but niche." Claude: "Excellent for specific use cases."',
                    },
                    {
                      q: "Is DJI the best camera brand?",
                      a: 'All 4 engines: "DJI is the industry leader for consumer cameras and drones."',
                    },
                    {
                      q: "Why choose Insta360 over DJI?",
                      a: '"360° immersive video, invisible selfie stick tech, strong AI editing." — AI can articulate this, but unprompted it defaults to DJI.',
                    },
                    {
                      q: "What is Insta360 known for?",
                      a: '"360° cameras and FlowState stabilization." — Correct, but AI doesn\'t volunteer this in general camera queries.',
                    },
                  ].map((r) => (
                    <tr key={r.q} style={{ borderTop: "1px solid #25253f" }}>
                      <td
                        className="px-4 py-2.5 font-medium w-48"
                        style={{ color: "#f0f0f8" }}
                      >
                        {r.q}
                      </td>
                      <td
                        className="px-4 py-2.5 text-xs leading-relaxed"
                        style={{ color: "#7070a0" }}
                      >
                        {r.a}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Root cause */}
      <section className="space-y-5">
        <h2 className="text-xl font-semibold">Why the Gap Exists</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          AI doesn't form opinions independently — it synthesizes what's been
          written about a brand across the web. We traced every DJI citation
          back to its source.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div
            className="rounded-xl p-5 space-y-3"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="font-semibold" style={{ color: "#22c55e" }}>
              DJI — Citation Sources
            </div>
            <ul className="text-sm space-y-1.5" style={{ color: "#7070a0" }}>
              <li>The Wirecutter / NYT · 28 reviews</li>
              <li>Tom's Guide · 19 reviews</li>
              <li>Rtings.com · 14 deep tests</li>
              <li>CNET, The Verge · 22 articles</li>
              <li>Reddit r/videography · 400+ threads</li>
              <li>YouTube review metadata · 1,200+</li>
              <li>Amazon "Best Seller" badge · cited by AI</li>
            </ul>
          </div>
          <div
            className="rounded-xl p-5 space-y-3"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="font-semibold" style={{ color: "#f5a623" }}>
              Insta360 — Citation Sources
            </div>
            <ul className="text-sm space-y-1.5" style={{ color: "#7070a0" }}>
              <li>The Verge · 4 articles (product launches)</li>
              <li>Tom's Guide · 6 reviews (360°-specific)</li>
              <li>PetaPixel · 8 photography niche pieces</li>
              <li>Reddit · sparse, mostly r/360cameras</li>
              <li>YouTube · strong in 360° niche, weak elsewhere</li>
              <li className="pt-1" style={{ color: "#ff4d6d" }}>
                ❌ No Wirecutter dedicated review
              </li>
              <li style={{ color: "#ff4d6d" }}>
                ❌ Almost no "gift guide" appearances
              </li>
            </ul>
          </div>
        </div>

        <div
          className="rounded-xl p-4 text-sm"
          style={{ background: "#0f0f17", border: "1px solid #25253f" }}
        >
          <div className="font-semibold mb-2">Key insight</div>
          <p style={{ color: "#7070a0" }}>
            When AI answers "best camera for travel vlogging," it's not choosing
            based on specs — it's pattern-matching against which brand appears
            most often in articles with that exact framing. Insta360 has built
            authority in <em>360° camera</em> discussions but hasn't yet broken
            into mainstream <em>creator / vlogger / gift</em> conversations.
            That's a content gap, not a product gap.
          </p>
        </div>
      </section>

      {/* Action plan */}
      <section className="space-y-5">
        <h2 className="text-xl font-semibold">
          Three Actions to Close the Gap in 90 Days
        </h2>

        {[
          {
            priority: "P1",
            color: "#ff4d6d",
            title: 'Enter the "content creator" frame — urgently',
            body: 'Insta360\'s product genuinely fits the creator audience (AI-assisted editing, invisible selfie stick, compact form). But this isn\'t showing up in AI recommendations because mainstream tech media hasn\'t written the right articles. Getting a single "Best Cameras for Content Creators in 2026" feature in Tom\'s Guide or Wirecutter that includes Insta360 would immediately shift AI citations.',
            action:
              "Target: Tom's Guide, Wirecutter, CNET. Pitch angle: 'The camera that edits itself — why AI-native cameras are the next creator tool.'",
          },
          {
            priority: "P2",
            color: "#f5a623",
            title: "Build Reddit presence in mainstream camera communities",
            body: "r/videography, r/Cameras, and r/travel have a combined 4M+ members. Perplexity and Claude both index Reddit heavily. Right now, Insta360 discussions are confined to r/360cameras (90K members). A structured community program — real users sharing real footage — would generate the organic citations AI needs.",
            action:
              "Target: r/videography, r/travel, r/solotravel. Approach: Creator seeding program, not sponsored posts.",
          },
          {
            priority: "P3",
            color: "#22c55e",
            title: "Add AI-citable fact sheets to product pages",
            body: 'AI prefers citing specific, verifiable claims over brand voice copy. Insta360 product pages are visually strong but data-light. Adding structured specs like "Best-in-class stabilization: 6-axis FlowState vs. industry standard 3-axis" or "Trusted by 2M+ creators globally" gives AI quotable facts.',
            action:
              "Add Fact Sheet sections to GO 4, X5, and Ace Pro product pages with 5–8 citable data points each.",
          },
        ].map((item) => (
          <div
            key={item.priority}
            className="rounded-xl p-5 space-y-3"
            style={{ background: "#0f0f17", border: `1px solid ${item.color}30` }}
          >
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded"
                style={{ background: `${item.color}20`, color: item.color }}
              >
                {item.priority}
              </span>
              <span className="font-semibold">{item.title}</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
              {item.body}
            </p>
            <div
              className="text-xs px-3 py-2 rounded-lg"
              style={{ background: "#161625", color: "#f0f0f8" }}
            >
              <strong style={{ color: item.color }}>Action: </strong>
              {item.action}
            </div>
          </div>
        ))}
      </section>

      {/* ARRS visual */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">90-Day Target</h2>
        <div
          className="rounded-xl p-6 space-y-5"
          style={{ background: "#0f0f17", border: "1px solid #25253f" }}
        >
          {[
            { label: "Insta360 (current)", val: 19.4, max: 50, color: "#f5a623" },
            { label: "Insta360 (90-day target)", val: 32, max: 50, color: "#ff6b35", dashed: true },
            { label: "DJI (current)", val: 44.7, max: 50, color: "#22c55e" },
          ].map((bar) => (
            <div key={bar.label} className="space-y-1.5">
              <div className="flex justify-between text-xs" style={{ color: "#7070a0" }}>
                <span>{bar.label}</span>
                <span>{bar.val}% SOV</span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "#25253f" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(bar.val / 50) * 100}%`,
                    background: bar.color,
                    opacity: bar.dashed ? 0.5 : 1,
                  }}
                />
              </div>
            </div>
          ))}
          <p className="text-xs" style={{ color: "#7070a0" }}>
            Based on Avanti's GEO improvement model: executing P1 + P2 in 60
            days typically yields +8–14pts SOV within one quarter.
          </p>
        </div>
      </section>

      <hr style={{ borderColor: "#25253f" }} />

      {/* CTA */}
      <div className="text-center space-y-4">
        <p className="text-base font-semibold">
          Want a report like this for your brand?
        </p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          We run the full query suite, trace every citation, and give you a
          prioritized action plan — free, no signup required.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/audit"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            Run Free Audit →
          </Link>
          <a
            href="https://calendly.com/brivesubscription/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            Book a Strategy Call
          </a>
        </div>

        <div className="pt-4">
          <Link
            href="/blog"
            className="text-xs transition-colors hover:text-white"
            style={{ color: "#7070a0" }}
          >
            ← More Research
          </Link>
        </div>
      </div>
    </article>
  );
}
