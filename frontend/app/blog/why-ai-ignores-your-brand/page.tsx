import Link from "next/link";

export const metadata = {
  title: "Why AI Doesn't Mention Your Brand: A GEO Guide for Cross-Border Sellers | Avanti",
  description:
    "ChatGPT is sending buyers to your competitors right now. Here are the 5 reasons AI ignores your brand — and exactly what to do about it.",
};

export default function WhyAIIgnoresYourBrandPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            GEO Guide
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>March 2026 · 6 min read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          Why AI Doesn&apos;t Mention Your Brand: A GEO Guide for Amazon Cross-Border Sellers
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          A buyer asks ChatGPT: &ldquo;What&apos;s the best wireless earbuds for sports?&rdquo;
          ChatGPT names Bose, Sony, and Jabra. Your brand — which has 4.4 stars and 2,000 reviews
          on Amazon — isn&apos;t mentioned at all. Here&apos;s why, and what you can do about it.
        </p>
      </div>

      {/* The shift */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">The Buying Journey Has Fundamentally Changed</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Until 2023, the funnel was simple: buyer types keywords into Google → finds your listing
          or ad → buys. Amazon BSR and keyword optimization governed everything.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Today, a growing portion of buyers — especially high-AOV, research-heavy purchases —
          start with an AI assistant. They describe their need in natural language and ask for a
          recommendation. The AI names 2–3 brands. The buyer then goes directly to Amazon or the
          brand&apos;s website to purchase.
        </p>
        <div
          className="rounded-xl p-5 space-y-3"
          style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.3)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "#ff6b35" }}>The new funnel</div>
          <div className="flex items-center gap-2 text-xs" style={{ color: "#f0f0f8" }}>
            <span className="px-2 py-1 rounded" style={{ background: "#1a1a2e" }}>Buyer has need</span>
            <span style={{ color: "#7070a0" }}>→</span>
            <span className="px-2 py-1 rounded" style={{ background: "#1a1a2e" }}>Asks ChatGPT</span>
            <span style={{ color: "#7070a0" }}>→</span>
            <span className="px-2 py-1 rounded" style={{ background: "#1a1a2e" }}>AI names brands</span>
            <span style={{ color: "#7070a0" }}>→</span>
            <span className="px-2 py-1 rounded" style={{ background: "#1a1a2e" }}>Buys</span>
          </div>
          <p className="text-xs" style={{ color: "#7070a0" }}>
            If you&apos;re not named by the AI, you don&apos;t exist in this buyer&apos;s consideration set —
            regardless of your BSR or review count.
          </p>
        </div>
      </div>

      {/* 5 Reasons */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">5 Reasons AI Doesn&apos;t Mention Your Brand</h2>

        {[
          {
            num: "01",
            title: "No authoritative third-party citations",
            body: "AI models don't cite Amazon reviews. They cite Wirecutter, CNET, Reddit, OutdoorGearLab, and specialized forums. If your brand has never been reviewed by these sources, the AI has no reason to trust it enough to recommend it. The #1 driver of AI visibility is third-party editorial coverage.",
            fix: "Get reviewed by 3–5 authoritative sources in your category. A Wirecutter mention alone can increase AI SOV by 8–12 points.",
          },
          {
            num: "02",
            title: "Your content doesn't answer the questions AI receives",
            body: 'AI models answer questions. If your website only has product pages with spec tables, you\'re not answering anything. The brands AI recommends have deep content libraries: "best for hiking vs. camping," "how to choose between X and Y," "which size is right for you." This content is what gets cited.',
            fix: "Write 10+ question-answer articles targeting the exact natural-language queries buyers ask AI. Target long-tail buyer intent queries, not keyword-stuffed titles.",
          },
          {
            num: "03",
            title: "Your brand name isn't memorable or distinct",
            body: "AI models favor brand names they've seen frequently across many different sources. A brand like 'VEATOOL' or 'GEEKPURE' is hard for AI to associate with quality signals — the name itself provides no context. Meanwhile, 'EcoFlow' appears in sustainability forums, outdoor blogs, and tech reviews.",
            fix: "Invest in brand-level content that ties your name to a specific positioning. Consistency across sources is what builds AI brand recognition.",
          },
          {
            num: "04",
            title: "You're optimizing for yesterday's funnel",
            body: "Helium 10 and Jungle Scout tell you what keywords people searched on Amazon last month. They can't tell you what AI is recommending today. These are fundamentally different signals. Sellers who only optimize for historical search data are building for a funnel that's shrinking.",
            fix: "Run a GEO Score audit to see where you stand in AI recommendations right now — not where you stood in keyword search last quarter.",
          },
          {
            num: "05",
            title: "Competitors are actively building their AI presence",
            body: "EcoFlow, Anker, and Jackery have content teams that, whether intentionally or not, are building massive citation networks. Every product comparison video, every Reddit thread their team engages in, every press release that gets picked up — this is the raw material AI models learn from.",
            fix: "Start building your GEO footprint now, before the gap widens. The brands that move first in each sub-niche will be hardest to displace.",
          },
        ].map((item) => (
          <div
            key={item.num}
            className="rounded-xl p-6 space-y-3"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="flex items-start gap-4">
              <div
                className="text-2xl font-black shrink-0"
                style={{ color: "rgba(255,107,53,0.3)" }}
              >
                {item.num}
              </div>
              <div className="space-y-3">
                <div className="font-semibold text-sm">{item.title}</div>
                <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{item.body}</p>
                <div
                  className="rounded-lg p-3 text-xs"
                  style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}
                >
                  <span style={{ color: "#22c55e" }}>Fix: </span>
                  <span style={{ color: "#7070a0" }}>{item.fix}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ARRS explanation */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">How We Measure AI Visibility: The GEO Score</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          The <strong>GEO Score</strong> measures how often your brand
          appears in AI-generated responses to buyer queries in your category. It&apos;s calculated
          across ChatGPT, Claude, Gemini, and Perplexity.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { range: "GEO Score < 30", label: "Dominant", color: "#22c55e", desc: "AI consistently recommends your brand in the top 2–3 positions." },
            { range: "GEO Score 30–59", label: "Moderate", color: "#f5a623", desc: "AI mentions your brand, but not in every relevant query." },
            { range: "GEO Score ≥ 60", label: "Invisible", color: "#ff4d6d", desc: "AI rarely or never recommends your brand. You have work to do." },
          ].map((tier) => (
            <div
              key={tier.range}
              className="rounded-xl p-4 space-y-2 text-center"
              style={{ background: "#0f0f17", border: `1px solid ${tier.color}30` }}
            >
              <div className="font-bold text-sm" style={{ color: tier.color }}>{tier.range}</div>
              <div className="text-xs font-semibold">{tier.label}</div>
              <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{tier.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What to do now */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Start Here: Your 3-Step GEO Action Plan</h2>
        <div className="space-y-3">
          {[
            {
              step: "1",
              action: "Get your GEO Score baseline",
              detail: "Run a free audit on Avanti. You'll see your current GEO Score, SOV against competitors, and which query types AI ignores you in.",
            },
            {
              step: "2",
              action: "Identify your opportunity queries",
              detail: "Every category has query types where AI gives fragmented answers. These are your entry points — where you can build dominance fastest.",
            },
            {
              step: "3",
              action: "Build citation-first content",
              detail: "Create content that answers the exact questions buyers are asking AI. Focus on getting that content cited by authoritative sources in your niche.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-4 rounded-xl p-5"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm"
                style={{ background: "#ff6b35", color: "#fff" }}
              >
                {item.step}
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-sm">{item.action}</div>
                <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{item.detail}</p>
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
        <p className="font-semibold text-lg">Find out where AI ranks your brand right now</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          Free audit. See your GEO Score and how you compare to every competitor in your category.
          Takes under 2 minutes.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/signup"
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
            Book Strategy Call
          </a>
        </div>
      </div>
    </div>
  );
}
