"use client";

import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";

/* ── risk cards ─────────────────────────────────────── */
const RISKS = [
  {
    icon: "🎭",
    title: "Competitor Fabrication",
    desc: "Rivals are planting false product claims in AI training data. ChatGPT and Claude may already be repeating them as fact.",
    accent: "#ff4d6d",
  },
  {
    icon: "🤖",
    title: "AI Hallucination",
    desc: "AI models invent specs, prices, and features that don't exist. Your brand gets blamed for promises it never made.",
    accent: "#f5a623",
  },
  {
    icon: "📉",
    title: "Silent Reputation Damage",
    desc: "Negative sentiment is being amplified across AI engines without your knowledge. By the time you notice, it's too late.",
    accent: "#ff6b35",
  },
];

/* ── service cards ──────────────────────────────────── */
const SERVICES = [
  {
    icon: "🔍",
    title: "Hallucination Scan",
    desc: "We query ChatGPT, Claude, Gemini, and Perplexity about your brand and flag every incorrect claim — wrong specs, fabricated reviews, outdated pricing.",
    tag: "4 AI Engines",
  },
  {
    icon: "🕵️",
    title: "Competitor Poisoning Detection",
    desc: "Compare your AI presence vs top competitors. Detect suspicious patterns where rivals appear to be manipulating AI outputs.",
    tag: "Competitive Intel",
  },
  {
    icon: "✅",
    title: "Cross-Platform Verification",
    desc: "Validate what AI says against real data from Reddit, YouTube, TikTok, and Google Trends. Separate truth from hallucination.",
    tag: "5+ Sources",
  },
  {
    icon: "📊",
    title: "AI Visibility Baseline",
    desc: "Establish your current AI Visibility Score across all engines. Know exactly where you stand before optimizing.",
    tag: "Benchmark",
  },
];

/* ── steps ──────────────────────────────────────────── */
const STEPS = [
  {
    n: "01",
    title: "Tell Us Your Brand",
    desc: "Provide your brand name, product line, and target market. Takes 30 seconds.",
  },
  {
    n: "02",
    title: "We Scan AI Engines",
    desc: "Our system runs automated queries across 4+ AI engines in 3 languages (English, Chinese, Indonesian). Hundreds of queries, zero manual work.",
  },
  {
    n: "03",
    title: "Get Your Audit Report",
    desc: "Receive a comprehensive report with every finding, risk level, and a prioritized action plan to fix what's broken.",
  },
];

/* ── pricing tiers ──────────────────────────────────── */
const TIERS = [
  {
    name: "Free Scan",
    price: "$0",
    period: "forever",
    desc: "Quick snapshot of your AI presence",
    features: [
      "1 brand, 1 product",
      "2 AI engines (ChatGPT + Claude)",
      "English only",
      "Basic hallucination check",
      "Summary report",
    ],
    cta: "Start Free Audit",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Full Audit",
    price: "$199",
    period: "one-time",
    desc: "Comprehensive safety assessment",
    features: [
      "1 brand, all products",
      "4 AI engines",
      "3 languages (EN / ZH / ID)",
      "Cross-platform verification",
      "Competitor poisoning detection",
      "Detailed report + action plan",
      "Included in Growth & Agency plans",
    ],
    cta: "Get Full Audit",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "monthly",
    desc: "Ongoing monitoring + dedicated support",
    features: [
      "Unlimited brands & products",
      "Custom AI engine scope",
      "All languages",
      "Ongoing weekly monitoring",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    href: "/book-demo",
    highlight: false,
  },
];

export default function BrandSafetyPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0e1a" }}>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ paddingTop: 80, paddingBottom: 80 }}>
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute w-96 h-96 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #ff4d6d 0%, transparent 70%)", top: "-8%", left: "20%", filter: "blur(80px)" }} />
          <div className="absolute w-80 h-80 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #f5a623 0%, transparent 70%)", bottom: "5%", right: "15%", filter: "blur(100px)" }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <AnimateIn>
            <div className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full font-bold uppercase tracking-wider mb-8"
              style={{ background: "rgba(255,77,109,0.10)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.25)" }}>
              <span>315 Response</span>
              <span style={{ opacity: 0.4 }}>|</span>
              <span>AI Brand Protection</span>
            </div>
          </AnimateIn>

          <AnimateIn delay={80}>
            <h1 style={{ fontSize: 52, fontWeight: 900, color: "#f0f0f8", lineHeight: 1.1, marginBottom: 20 }}>
              AI Brand Safety Audit
            </h1>
          </AnimateIn>

          <AnimateIn delay={160}>
            <p style={{ fontSize: 24, fontWeight: 600, color: "#ff4d6d", marginBottom: 20, lineHeight: 1.3 }}>
              Is AI telling the truth about your brand?
            </p>
          </AnimateIn>

          <AnimateIn delay={240}>
            <p style={{ fontSize: 17, color: "#7070a0", maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.7 }}>
              The 315 Gala exposed how fake data is being fed to AI models.
              Competitors may already be poisoning your brand's AI presence.
              Find out before your customers do.
            </p>
          </AnimateIn>

          <AnimateIn delay={320}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup"
                className="text-base font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #ff4d6d, #ff6b35)", color: "#fff", boxShadow: "0 8px 32px rgba(255,77,109,0.3)" }}>
                Start Free Audit
              </Link>
              <Link href="/book-demo"
                className="text-base font-medium px-8 py-3.5 rounded-xl transition-colors hover:text-white"
                style={{ color: "#ff6b35", border: "1px solid rgba(255,107,53,0.35)" }}>
                Book a Demo
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── Problem Statement ─────────────────────────── */}
      <section style={{ paddingTop: 60, paddingBottom: 80 }}>
        <div className="max-w-5xl mx-auto px-6">
          <AnimateIn>
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#ff4d6d" }}>The Problem</p>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: "#f0f0f8", lineHeight: 1.15 }}>
                Your brand is under attack<br />in AI search — and you don't know it
              </h2>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {RISKS.map((r, i) => (
              <AnimateIn key={r.title} delay={i * 100}>
                <div className="h-full rounded-2xl p-7 transition-all hover:translate-y-[-2px]"
                  style={{ background: "#12121e", border: `1px solid ${r.accent}25`, boxShadow: `0 0 40px ${r.accent}08` }}>
                  <div style={{ fontSize: 36, marginBottom: 16 }}>{r.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f8", marginBottom: 10 }}>{r.title}</h3>
                  <p style={{ fontSize: 14, color: "#7070a0", lineHeight: 1.7 }}>{r.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Audit ─────────────────────────────── */}
      <section style={{ paddingTop: 60, paddingBottom: 80, background: "rgba(18,18,30,0.5)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <AnimateIn>
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#f5a623" }}>What We Audit</p>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: "#f0f0f8", lineHeight: 1.15 }}>
                Four layers of AI brand protection
              </h2>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SERVICES.map((s, i) => (
              <AnimateIn key={s.title} delay={i * 80}>
                <div className="h-full rounded-2xl p-7 transition-all hover:translate-y-[-2px]"
                  style={{ background: "#0d0d19", border: "1px solid #25253f" }}>
                  <div className="flex items-start justify-between mb-4">
                    <div style={{ fontSize: 32 }}>{s.icon}</div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(245,166,35,0.10)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.20)" }}>
                      {s.tag}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f8", marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "#7070a0", lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────── */}
      <section style={{ paddingTop: 60, paddingBottom: 80 }}>
        <div className="max-w-4xl mx-auto px-6">
          <AnimateIn>
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#22c55e" }}>How It Works</p>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: "#f0f0f8", lineHeight: 1.15 }}>
                Three steps. Under 48 hours.
              </h2>
            </div>
          </AnimateIn>

          <div className="space-y-6">
            {STEPS.map((s, i) => (
              <AnimateIn key={s.n} delay={i * 100}>
                <div className="flex items-start gap-6 rounded-2xl p-7"
                  style={{ background: "#12121e", border: "1px solid #25253f" }}>
                  <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-xl font-black text-lg"
                    style={{ background: "rgba(34,197,94,0.10)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.20)" }}>
                    {s.n}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f8", marginBottom: 8 }}>{s.title}</h3>
                    <p style={{ fontSize: 14, color: "#7070a0", lineHeight: 1.7 }}>{s.desc}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────── */}
      <section style={{ paddingTop: 60, paddingBottom: 80, background: "rgba(18,18,30,0.5)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <AnimateIn>
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#ff6b35" }}>Pricing</p>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: "#f0f0f8", lineHeight: 1.15 }}>
                Start free. Scale when you're ready.
              </h2>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIERS.map((t, i) => (
              <AnimateIn key={t.name} delay={i * 100}>
                <div className="h-full flex flex-col rounded-2xl p-7 transition-all hover:translate-y-[-2px]"
                  style={{
                    background: t.highlight ? "#14101e" : "#12121e",
                    border: t.highlight ? "1px solid rgba(255,107,53,0.4)" : "1px solid #25253f",
                    boxShadow: t.highlight ? "0 0 60px rgba(255,107,53,0.08)" : "none",
                  }}>
                  {t.highlight && (
                    <div className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full self-start mb-4"
                      style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}>
                      Most Popular
                    </div>
                  )}
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f0f8", marginBottom: 4 }}>{t.name}</h3>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span style={{ fontSize: 40, fontWeight: 900, color: t.highlight ? "#ff6b35" : "#f0f0f8" }}>{t.price}</span>
                    <span style={{ fontSize: 13, color: "#555580" }}>{t.period}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#7070a0", marginBottom: 20 }}>{t.desc}</p>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "#a0a0c0" }}>
                        <span style={{ color: "#22c55e", marginTop: 2, flexShrink: 0 }}>&#10003;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={t.href}
                    className="block text-center text-sm font-bold py-3 rounded-xl transition-all hover:opacity-90"
                    style={t.highlight
                      ? { background: "linear-gradient(135deg, #ff4d6d, #ff6b35)", color: "#fff" }
                      : { color: "#ff6b35", border: "1px solid rgba(255,107,53,0.35)" }
                    }>
                    {t.cta}
                  </Link>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────── */}
      <section style={{ paddingTop: 80, paddingBottom: 100 }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimateIn>
            <div style={{ fontSize: 56, marginBottom: 20 }}>&#x1F6E1;&#xFE0F;</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: "#f0f0f8", lineHeight: 1.15, marginBottom: 16 }}>
              Don't wait for the damage to show up<br />in your sales numbers.
            </h2>
            <p style={{ fontSize: 17, color: "#7070a0", maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7 }}>
              Run your free AI Brand Safety Audit today. See exactly what AI is telling your customers about you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup"
                className="text-base font-bold px-10 py-4 rounded-xl transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #ff4d6d, #ff6b35)", color: "#fff", boxShadow: "0 8px 32px rgba(255,77,109,0.3)" }}>
                Start Free Audit
              </Link>
              <Link href="/book-demo"
                className="text-base font-medium px-8 py-3.5 rounded-xl transition-colors hover:text-white"
                style={{ color: "#ff6b35", border: "1px solid rgba(255,107,53,0.35)" }}>
                Book a Demo
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
