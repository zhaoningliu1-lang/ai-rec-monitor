import Link from "next/link";

export const metadata = {
  title: "2025 Cross-Border Seller Cost Savings Guide: 5 Operations AI Can Replace | Avanti",
  description:
    "Most cross-border brands are paying humans $800–$2,000/mo to do what AI handles in seconds. Here's exactly where to cut costs — and how to reinvest those savings into GEO.",
};

export default function AICostGuide2025Page() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            Operations Guide
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>March 2026 · 6 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          2025 Cross-Border Seller Cost Savings Guide: 5 Operations AI Can Handle Right Now
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          Most cross-border brands are paying humans $800–$2,000/month to do tasks that AI
          handles in seconds. Here&apos;s exactly where to cut costs — and how the savings can fund
          the GEO investment that compounds your AI visibility over time.
        </p>
      </div>

      {/* The math */}
      <div
        className="rounded-xl p-6 space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #ff6b35" }}
      >
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          The Math at a Glance
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-black" style={{ color: "#f0f0f8" }}>$910</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>avg. monthly savings</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black" style={{ color: "#22c55e" }}>68%</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>avg. AI replacement rate</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black" style={{ color: "#ff6b35" }}>4.5×</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>GEO months funded by savings</div>
          </div>
        </div>
        <p className="text-xs" style={{ color: "#7070a0" }}>
          Based on a typical cross-border brand with $15/hr team cost and standard operation hours.
          Calculate your own numbers →{" "}
          <Link href="/optimizer" style={{ color: "#ff6b35" }}>Cost Optimizer (free)</Link>
        </p>
      </div>

      {/* Intro */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Why This Matters More Than Ever in 2026</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Cross-border ecommerce margins are tighter than ever. Platform fees are rising, logistics
          costs are unpredictable, and ad CPCs keep climbing. Meanwhile, AI can now handle
          roughly 70% of the repetitive, language-dependent work that consumes most of your
          team&apos;s time.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          The brands winning in 2026 aren&apos;t just cutting costs — they&apos;re redirecting savings
          into AI visibility (GEO). The flywheel: AI saves you money → you invest in GEO →
          AI recommends you more → more organic demand → lower customer acquisition cost.
        </p>
      </div>

      {/* 5 operations */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">5 Operations AI Handles Better Than Your Team</h2>

        {[
          {
            num: "01",
            op: "Customer Service — 70% AI Replaceable",
            hours: "20 hrs/week typical",
            saving: "$390/mo at $15/hr",
            tools: "ChatGPT, Claude, Intercom AI, Tidio",
            what: "AI handles: FAQ responses, order status inquiries, return request triage, review response drafts, shipping delay notifications.",
            whatHuman: "Humans still needed for: complex disputes, refund approvals, escalations requiring empathy.",
            tip: "Set up AI to draft responses, human reviews and sends. This alone saves 60-70% of CS time without losing quality.",
          },
          {
            num: "02",
            op: "Product Research & Sourcing — 60% AI Replaceable",
            hours: "15 hrs/month typical",
            saving: "$135/mo at $15/hr",
            tools: "Avanti Selection Intel, Perplexity, Claude with web browsing",
            what: "AI handles: category trend analysis, competitor product research, supplier discovery on Alibaba/1688, spec comparison tables, MOQ research.",
            whatHuman: "Humans still needed for: supplier relationship building, factory audits, sample evaluation.",
            tip: "Use Avanti's Selection Intelligence to know which categories AI is pushing before you source. It's free signal for your sourcing decisions.",
          },
          {
            num: "03",
            op: "Translation & Localization — 80% AI Replaceable",
            hours: "10 hrs/month typical",
            saving: "$120/mo at $15/hr",
            tools: "Claude, GPT-4o, DeepL Pro",
            what: "AI handles: Amazon listing translation (title, bullets, description), A+ content, ad copy, customer emails, packaging text, marketplace-specific compliance copy.",
            whatHuman: "Humans still needed for: native speaker review of hero copy, cultural nuance checks.",
            tip: "Prompt Claude with: 'Translate this listing for Chinese buyers who shop on Amazon Japan. Keep the benefit-first structure, localize idioms.' Results are 90% ready-to-publish.",
          },
          {
            num: "04",
            op: "Data Entry & Reporting — 75% AI Replaceable",
            hours: "20 hrs/month typical",
            saving: "$225/mo at $15/hr",
            tools: "Claude with CSV uploads, Google Sheets AI, Notion AI",
            what: "AI handles: inventory reconciliation, weekly performance reports, BSR tracking summaries, ad spend analysis, competitor price monitoring.",
            whatHuman: "Humans still needed for: strategic interpretation of anomalies, board-level reporting.",
            tip: "Upload your Seller Central reports to Claude and ask: 'Summarize last week's performance, flag any SKUs with >10% BSR decline, and recommend which to restock first.'",
          },
          {
            num: "05",
            op: "Content Creation for GEO — New Opportunity",
            hours: "Variable",
            saving: "Replaces $500–$2,000/mo agency fees",
            tools: "Claude, Avanti GEO recommendations",
            what: "AI handles: citation-optimized blog posts, comparison articles, FAQ pages targeting natural-language buyer queries, product spec guides, Reddit-style Q&A content.",
            whatHuman: "Humans still needed for: content strategy, expert fact-checking, outreach to editorial sites.",
            tip: "Content created to answer AI queries is also SEO content. You're not choosing between SEO and GEO — a well-written comparison article serves both.",
          },
        ].map((item) => (
          <div
            key={item.num}
            className="rounded-xl p-6 space-y-4"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div
                  className="text-xs font-black mb-1"
                  style={{ color: "rgba(255,107,53,0.4)" }}
                >
                  {item.num}
                </div>
                <div className="font-bold text-sm">{item.op}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs" style={{ color: "#7070a0" }}>{item.hours}</div>
                <div className="text-sm font-bold" style={{ color: "#22c55e" }}>{item.saving}</div>
              </div>
            </div>
            <div className="space-y-2 text-xs" style={{ color: "#7070a0" }}>
              <div><span className="font-semibold" style={{ color: "#f0f0f8" }}>AI handles: </span>{item.what}</div>
              <div><span className="font-semibold" style={{ color: "#f0f0f8" }}>Still need humans: </span>{item.whatHuman}</div>
              <div><span className="font-semibold" style={{ color: "#f0f0f8" }}>Tools: </span>{item.tools}</div>
            </div>
            <div
              className="rounded-lg p-3 text-xs"
              style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.2)" }}
            >
              <span style={{ color: "#ff6b35" }}>Pro tip: </span>
              <span style={{ color: "#7070a0" }}>{item.tip}</span>
            </div>
          </div>
        ))}
      </div>

      {/* The flywheel */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">The Compounding Flywheel</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          The real opportunity isn&apos;t just cutting costs. It&apos;s what you do with the savings.
        </p>
        <div
          className="rounded-xl p-6 space-y-4"
          style={{ background: "#0f0f17", border: "1px solid #25253f" }}
        >
          <div className="flex flex-col gap-2 text-sm">
            {[
              { label: "AI saves you $910/mo in ops", color: "#22c55e" },
              { label: "You invest $199/mo into Avanti GEO monitoring", color: "#ff6b35" },
              { label: "AI starts recommending your brand more frequently", color: "#f5a623" },
              { label: "Organic AI-driven demand increases", color: "#22c55e" },
              { label: "Customer acquisition cost drops", color: "#f5a623" },
              { label: "More budget freed up for GEO expansion", color: "#ff6b35" },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: `${step.color}20`, color: step.color }}
                >
                  {i + 1}
                </div>
                <span style={{ color: "#f0f0f8" }}>{step.label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
            The brands who understand this flywheel in 2026 will have an AI visibility moat
            that&apos;s nearly impossible to dislodge by 2027.
          </p>
        </div>
      </div>

      {/* Calculator CTA */}
      <div
        className="rounded-xl p-6 space-y-4 text-center"
        style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.3)" }}
      >
        <div className="font-semibold">Calculate Your Exact Savings</div>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          Our free Cost Optimizer lets you plug in your team&apos;s actual hours and hourly rate.
          See exactly how many months of GEO monitoring your savings fund.
        </p>
        <Link
          href="/optimizer"
          className="inline-block text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          Open Cost Optimizer (Free) →
        </Link>
      </div>

      {/* Final CTA */}
      <div
        className="rounded-xl p-8 text-center space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="font-semibold text-lg">Start your AI visibility audit today</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          Free GEO Score, SOV breakdown, and competitor comparison. See where you stand
          in the AI recommendation layer — before your competitors do.
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
            View AI Selection Intel →
          </Link>
        </div>
      </div>
    </div>
  );
}
