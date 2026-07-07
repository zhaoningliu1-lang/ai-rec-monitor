"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Music, Globe, Store, Check } from "lucide-react";

const CALENDLY = "https://cal.com/johnson-liu-avanti/30min";

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const TIERS = [
  {
    name: "Free",
    price: 0,
    annual: 0,
    description: "For brands just getting started with AI visibility tracking.",
    cta: "Try Free",
    href: "/signup",
    highlight: false,
    badge: null as string | null,
    features: [
      "1 brand tracked",
      "Basic GEO Score",
      "Monthly report",
      "2 AI engines (ChatGPT, Claude)",
    ],
    notIncluded: [
      "Full SOV breakdown",
      "Gemini & Perplexity",
      "Bi-weekly reports",
      "Selection intelligence",
    ],
  },
  {
    name: "Starter",
    price: 99,
    annual: 79,
    description: "For startups and solo founders tracking their AI presence. B2B SaaS, DTC brands, or consumer products.",
    cta: "Start free",
    href: "/signup",
    highlight: false,
    badge: null as string | null,
    features: [
      "1 brand tracked",
      "Monthly GEO report",
      "4 AI engines (ChatGPT, Claude, Gemini, Perplexity)",
      "GEO Score + SOV breakdown",
      "Selection intelligence: top 3 categories (read-only)",
      "Email delivery",
    ],
    notIncluded: [
      "Full selection intelligence",
      "PDF export",
      "API access",
    ],
  },
  {
    name: "Growth",
    price: 249,
    annual: 199,
    description: "For scaling brands that compete on AI visibility. Our most popular plan.",
    cta: "Start free",
    href: "/signup",
    highlight: true,
    badge: "Most Popular",
    features: [
      "3 brands tracked",
      "Bi-weekly GEO reports",
      "4 AI engines",
      "GEO Score + SOV + competitor benchmarking",
      "Full selection intelligence (all categories + filter)",
      "Cost optimizer",
      "PDF export",
      "Priority email support",
    ],
    notIncluded: [
      "API access",
      "Custom category tracking",
    ],
  },
  {
    name: "Agency",
    price: 999,
    annual: 799,
    description: "For agencies and service providers managing multiple client brands with white-label reporting.",
    cta: "Start free",
    href: "/signup",
    highlight: false,
    badge: null as string | null,
    features: [
      "20 brands tracked",
      "Weekly GEO reports",
      "4 AI engines + custom query sets",
      "Full selection intelligence",
      "White-label PDF reports",
      "Client-ready dashboards",
      "API access",
      "Custom category tracking",
      "Reseller / sub-account management",
      "Priority Slack support",
    ],
    notIncluded: [],
  },
  {
    name: "Enterprise",
    price: 0,
    annual: 0,
    description: "Unlimited brands. Custom AI engine coverage. Dedicated strategist. For large operators.",
    cta: "Book a call",
    href: CALENDLY,
    highlight: false,
    badge: null as string | null,
    features: [
      "Unlimited brands",
      "Custom report cadence",
      "Custom AI engine + language coverage",
      "White-label + API access",
      "Dedicated GEO strategist",
      "SLA + enterprise security",
    ],
    notIncluded: [],
  },
];

const COMPARISON = [
  { feature: "Brands tracked",               free: "1",        starter: "1",     growth: "3",     agency: "20",     enterprise: "Unlimited" },
  { feature: "Report frequency",             free: "Monthly",  starter: "Monthly", growth: "Bi-weekly", agency: "Weekly", enterprise: "Custom" },
  { feature: "AI engines covered",           free: "2",        starter: "4",     growth: "4",     agency: "4 + custom", enterprise: "Custom" },
  { feature: "GEO Score",                    free: true,       starter: true,    growth: true,    agency: true,     enterprise: true },
  { feature: "SOV breakdown",                free: false,      starter: true,    growth: true,    agency: true,     enterprise: true },
  { feature: "Competitor benchmarking",      free: false,      starter: false,   growth: true,    agency: true,     enterprise: true },
  { feature: "Selection intelligence (full)",free: false,      starter: false,   growth: true,    agency: true,     enterprise: true },
  { feature: "Cost optimizer",               free: false,      starter: false,   growth: true,    agency: true,     enterprise: true },
  { feature: "PDF export",                   free: false,      starter: false,   growth: true,    agency: true,     enterprise: true },
  { feature: "White-label reports",          free: false,      starter: false,   growth: false,   agency: true,     enterprise: true },
  { feature: "API access",                   free: false,      starter: false,   growth: false,   agency: true,     enterprise: true },
  { feature: "Custom category tracking",     free: false,      starter: false,   growth: false,   agency: true,     enterprise: true },
  { feature: "Sub-account / reseller",       free: false,      starter: false,   growth: false,   agency: true,     enterprise: true },
  { feature: "Dedicated strategist",         free: false,      starter: false,   growth: false,   agency: false,    enterprise: true },
];

function CheckIcon() {
  return <Check size={14} style={{ color: "#22c55e" }} />;
}
function CrossMark() {
  return <span style={{ color: "#3a3a5c" }}>&mdash;</span>;
}

export default function PricingPage() {
  return (
    <div className="py-16 space-y-20 max-w-6xl mx-auto px-4">
      {/* Header -- left-aligned */}
      <motion.div {...reveal} className="space-y-4 max-w-2xl">
        <div
          className="inline-block text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
        >
          Pricing
        </div>
        <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Built for B2B SaaS companies, consumer brands, DTC sellers, and agencies
          serious about being visible in AI search. All plans include a 14-day free trial. No credit card required.
        </p>
      </motion.div>

      {/* Tier cards -- 4 columns */}
      <motion.div
        {...reveal}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-start"
      >
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-2xl p-5 space-y-5 flex flex-col relative${
              tier.highlight ? " shimmer-card" : ""
            }`}
            style={{
              background: tier.highlight ? "rgba(255,107,53,0.06)" : "#0f0f17",
              border: tier.highlight ? "2px solid #ff6b35" : "1px solid #25253f",
            }}
          >
            {tier.badge && (
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
                style={{ background: "#ff6b35", color: "#fff" }}
              >
                {tier.badge}
              </div>
            )}

            <div className="space-y-1">
              <div className="font-bold text-base">{tier.name}</div>
              <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
                {tier.description}
              </p>
            </div>

            <div>
              {tier.annual > 0 ? (
                <>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-black">${tier.annual}</span>
                    <span className="text-sm pb-1" style={{ color: "#7070a0" }}>/mo</span>
                  </div>
                  {tier.annual !== tier.price && (
                    <div className="text-xs mt-1" style={{ color: "#7070a0" }}>
                      ${tier.price}/mo monthly · save ${(tier.price - tier.annual) * 12}/yr
                    </div>
                  )}
                </>
              ) : (
                <div className="text-3xl font-black">Custom</div>
              )}
            </div>

            <Link
              href={tier.href}
              target={tier.href.startsWith("http") ? "_blank" : undefined}
              rel={tier.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="block text-center text-sm font-semibold px-4 py-2.5 rounded-lg transition-opacity hover:opacity-80"
              style={
                tier.highlight
                  ? { background: "#ff6b35", color: "#fff" }
                  : { border: "1px solid #25253f", color: "#f0f0f8" }
              }
            >
              {tier.cta}
            </Link>

            <div className="space-y-2 flex-1">
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>
                Includes
              </div>
              <ul className="space-y-1.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "#f0f0f8" }}>
                    <span className="shrink-0 mt-0.5"><Check size={12} style={{ color: "#22c55e" }} /></span>
                    {f}
                  </li>
                ))}
                {tier.notIncluded.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "#3a3a5c" }}>
                    <span style={{ flexShrink: 0 }}>&mdash;</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Who is this for -- seller type callout */}
      <motion.div
        {...reveal}
        className="rounded-xl p-6 space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ff6b35" }}>Who uses Avanti</div>
        <div className="grid md:grid-cols-4 gap-4 text-xs">
          {[
            { Icon: Globe, type: "B2B SaaS Companies", desc: "When buyers search AI for solutions in your category, are you in the answer? Track your AI recommendation share vs competitors." },
            { Icon: ShoppingCart, type: "Consumer & DTC Brands", desc: "Build brand authority in AI search. Earn citations in the AI answer layer that drives top-of-funnel discovery." },
            { Icon: Store, type: "Professional Services", desc: "Clients increasingly ask AI to recommend firms and consultants. Know if you appear — and fix it when you don't." },
            { Icon: Music, type: "Agencies", desc: "Manage AI visibility across all your client brands with white-label reporting and a single dashboard." },
          ].map((item) => (
            <div key={item.type} className="space-y-1.5">
              <item.Icon size={20} style={{ color: "#ff6b35" }} />
              <div className="font-semibold" style={{ color: "#f0f0f8" }}>{item.type}</div>
              <p style={{ color: "#7070a0" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Free tool callout */}
      <motion.div
        {...reveal}
        className="rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <div>
          <div className="font-semibold text-sm">Cost Optimizer -- Always Free</div>
          <p className="text-xs mt-1" style={{ color: "#7070a0" }}>
            Calculate exactly how much AI can save your ops -- and how many months of GEO that funds.
            No login, no credit card.
          </p>
        </div>
        <Link
          href="/optimizer"
          className="shrink-0 text-sm font-medium px-5 py-2 rounded-lg transition-colors hover:text-white"
          style={{ border: "1px solid #25253f", color: "#7070a0" }}
        >
          Calculate savings
        </Link>
      </motion.div>

      {/* Comparison table */}
      <motion.div {...reveal} className="space-y-4">
        <h2 className="text-xl font-bold">Full comparison</h2>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <th className="text-left p-4 font-medium text-xs" style={{ color: "#7070a0" }}>Feature</th>
                <th className="text-center p-4 font-medium text-xs">Free</th>
                <th className="text-center p-4 font-medium text-xs">Starter</th>
                <th className="text-center p-4 font-bold text-xs" style={{ color: "#ff6b35" }}>Growth</th>
                <th className="text-center p-4 font-medium text-xs">Agency</th>
                <th className="text-center p-4 font-medium text-xs">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr
                  key={row.feature}
                  style={{
                    background: i % 2 === 0 ? "#0a0a10" : "#0f0f17",
                    borderBottom: "1px solid #25253f",
                  }}
                >
                  <td className="p-3 text-xs" style={{ color: "#f0f0f8" }}>{row.feature}</td>
                  <td className="p-3 text-center text-xs">
                    {typeof row.free === "boolean"
                      ? row.free ? <CheckIcon /> : <CrossMark />
                      : <span style={{ color: "#f0f0f8" }}>{row.free}</span>}
                  </td>
                  <td className="p-3 text-center text-xs">
                    {typeof row.starter === "boolean"
                      ? row.starter ? <CheckIcon /> : <CrossMark />
                      : <span style={{ color: "#f0f0f8" }}>{row.starter}</span>}
                  </td>
                  <td className="p-3 text-center text-xs">
                    {typeof row.growth === "boolean"
                      ? row.growth ? <CheckIcon /> : <CrossMark />
                      : <span style={{ color: "#f0f0f8" }}>{row.growth}</span>}
                  </td>
                  <td className="p-3 text-center text-xs">
                    {typeof row.agency === "boolean"
                      ? row.agency ? <CheckIcon /> : <CrossMark />
                      : <span style={{ color: "#f0f0f8" }}>{row.agency}</span>}
                  </td>
                  <td className="p-3 text-center text-xs">
                    {typeof row.enterprise === "boolean"
                      ? row.enterprise ? <CheckIcon /> : <CrossMark />
                      : <span style={{ color: "#f0f0f8" }}>{row.enterprise}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div {...reveal} className="max-w-2xl space-y-6">
        <h2 className="text-xl font-bold">FAQ</h2>
        {[
          {
            q: "What counts as a \"brand\"?",
            a: "One brand = one entity we track across AI engines. If you sell under multiple brand names (e.g., your main brand + a sub-brand), each counts separately. Agencies tracking client brands count each client brand separately.",
          },
          {
            q: "What are the 4 AI engines you track?",
            a: "ChatGPT (GPT-4o), Claude, Gemini, and Perplexity -- the four engines actively directing buyer decisions. We run queries in both English and Chinese for cross-border brands. Custom language sets available on Agency and Enterprise.",
          },
          {
            q: "Does this work for TikTok Shop sellers and Shopee/Lazada brands?",
            a: "Yes. We track which brands AI engines recommend when buyers search for products in your category -- regardless of which platform they ultimately buy on. TikTok viral products often see AI pickup 2-3 weeks after initial virality. Shopee/Lazada sellers benefit from English-language AI queries that influence cross-border buyers.",
          },
          {
            q: "I'm an agency managing 20+ brands. Is Agency right for me?",
            a: "Yes. Agency includes white-label PDF reports you can deliver under your own branding, sub-account management so each client has their own view, and API access for custom integrations. For 20+ brands, contact us for volume pricing.",
          },
          {
            q: "Can I cancel anytime?",
            a: "Yes. No long-term contracts. Cancel from your account settings, effective at end of billing cycle.",
          },
          {
            q: "How is Avanti different from Helium 10 or Jungle Scout?",
            a: "Helium 10 and Jungle Scout track historical sales data, BSR, and keywords on Amazon. Avanti tracks where AI models are actively sending future buyers -- a fundamentally different signal about where demand is going, not where it has been.",
          },
        ].map(({ q, a }) => (
          <div key={q} className="space-y-2">
            <div className="font-semibold text-sm">{q}</div>
            <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{a}</p>
          </div>
        ))}
      </motion.div>

      {/* Bottom CTA -- full-width gradient banner */}
      <motion.div
        {...reveal}
        className="rounded-2xl p-10 text-center space-y-4 transition-all duration-500 hover:[box-shadow:0_0_40px_rgba(255,107,53,0.2)]"
        style={{
          background: "linear-gradient(135deg, #1a0f08 0%, #0f0f17 50%, #161625 100%)",
          border: "1px solid rgba(255,107,53,0.3)",
        }}
      >
        <p className="text-2xl font-bold">Start with a free audit</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          See your brand&apos;s GEO Score and SOV against every competitor -- before committing to a plan.
        </p>
        <div className="flex justify-center gap-3 pt-2 flex-wrap">
          <Link
            href="/signup"
            className="text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:opacity-90 hover:[box-shadow:0_0_24px_rgba(255,107,53,0.4)]"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            Start free
          </Link>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium px-6 py-3 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            Book a demo
          </a>
        </div>
      </motion.div>
    </div>
  );
}
