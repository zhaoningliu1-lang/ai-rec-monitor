import Link from "next/link";
import { Lang, tx } from "@/lib/i18n";

const CALENDLY = "https://calendly.com/qw2379/geo-chat";

interface Props {
  lang: Lang;
}

function GeoScoreRing({ score }: { score: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#25253f" strokeWidth="5" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke="#ff6b35" strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
      />
      <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="800" fill="#f0f0f8">{score}</text>
    </svg>
  );
}

export default function LandingView({ lang }: Props) {
  const auditPath = lang === "zh" ? "/zh/audit" : "/audit";
  const dashboardPath = lang === "zh" ? "/zh/dashboard" : "/dashboard";

  const stats = [
    { val: tx("landing", "stat1Val", lang), label: tx("landing", "stat1Label", lang) },
    { val: tx("landing", "stat2Val", lang), label: tx("landing", "stat2Label", lang) },
    { val: tx("landing", "stat3Val", lang), label: tx("landing", "stat3Label", lang) },
    { val: tx("landing", "stat4Val", lang), label: tx("landing", "stat4Label", lang) },
  ];

  const features = [
    { icon: "◎", titleKey: "feature1Title" as const, descKey: "feature1Desc" as const, accent: "#ff6b35" },
    { icon: "⊕", titleKey: "feature2Title" as const, descKey: "feature2Desc" as const, accent: "#f5a623" },
    { icon: "◑", titleKey: "feature4Title" as const, descKey: "feature4Desc" as const, accent: "#22c55e" },
    { icon: "↻", titleKey: "feature3Title" as const, descKey: "feature3Desc" as const, accent: "#f5a623" },
    { icon: "▶", titleKey: "feature5Title" as const, descKey: "feature5Desc" as const, accent: "#ff6b35" },
  ];

  const plans = [
    {
      nameKey: "planFree" as const,
      priceKey: "planFreePrice" as const,
      perKey: null as null,
      descKey: "planFreeDesc" as const,
      ctaKey: "planCtaFree" as const,
      ctaHref: auditPath,
      external: false,
      featureKeys: ["freeF1", "freeF2", "freeF3", "freeF4"] as const,
      highlight: false,
    },
    {
      nameKey: "planGrowth" as const,
      priceKey: "planGrowthPrice" as const,
      perKey: "planGrowthPer" as const,
      descKey: "planGrowthDesc" as const,
      ctaKey: "planCta" as const,
      ctaHref: auditPath,
      external: false,
      featureKeys: ["growthF1", "growthF2", "growthF3", "growthF4", "growthF5"] as const,
      highlight: false,
    },
    {
      nameKey: "planScale" as const,
      priceKey: "planScalePrice" as const,
      perKey: "planGrowthPer" as const,
      descKey: "planScaleDesc" as const,
      ctaKey: "planCta" as const,
      ctaHref: auditPath,
      external: false,
      featureKeys: ["scaleF1", "scaleF2", "scaleF3", "scaleF4", "scaleF5"] as const,
      highlight: true,
    },
    {
      nameKey: "planEnterprise" as const,
      priceKey: "planEntPrice" as const,
      perKey: null as null,
      descKey: "planEntDesc" as const,
      ctaKey: "planCtaEnt" as const,
      ctaHref: CALENDLY,
      external: true,
      featureKeys: ["entF1", "entF2", "entF3", "entF4", "entF5"] as const,
      highlight: false,
    },
  ];

  return (
    <div className="space-y-24 pb-24">

      {/* Hero */}
      <section className="pt-16 pb-8 text-center max-w-3xl mx-auto">
        <div
          className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.25)" }}
        >
          {tx("landing", "pill", lang)}
        </div>
        <h1 className="text-6xl font-black tracking-tight leading-none mb-4" style={{ color: "#f0f0f8" }}>
          {tx("landing", "heroLine1", lang)}<br />
          <span style={{ color: "#ff6b35" }}>{tx("landing", "heroAccent", lang)}</span>
        </h1>
        <p className="text-base mb-3 max-w-xl mx-auto font-semibold tracking-wide" style={{ color: "#7070a0" }}>
          {lang === "zh" ? "被引用。被信任。成为答案。" : "Be Cited. Be Trusted. Be the Answer."}
        </p>
        <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "#7070a0" }}>
          {tx("landing", "subheadline", lang)}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href={auditPath}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            {tx("landing", "ctaPrimary", lang)}
          </Link>
          <Link
            href={dashboardPath}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            {tx("landing", "ctaSecondary", lang)}
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section
        className="rounded-2xl px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-3xl font-black mb-1" style={{ color: "#ff6b35" }}>{s.val}</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* AI Shift urgency banner */}
      <section
        className="rounded-2xl p-8"
        style={{ background: "linear-gradient(135deg, #100a06 0%, #0f0f17 100%)", border: "1px solid rgba(245,166,35,0.25)" }}
      >
        <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#f5a623" }}>
          {tx("landing", "shiftLabel", lang)}
        </div>
        <h2 className="text-2xl font-black mb-3 leading-tight">
          {tx("landing", "shiftHeadline", lang)}
        </h2>
        <p className="text-sm leading-relaxed mb-8 max-w-2xl" style={{ color: "#7070a0" }}>
          {tx("landing", "shiftSub", lang)}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { val: tx("landing", "shiftStat1Val", lang), lab: tx("landing", "shiftStat1Lab", lang), color: "#ff4d6d" },
            { val: tx("landing", "shiftStat2Val", lang), lab: tx("landing", "shiftStat2Lab", lang), color: "#f5a623" },
            { val: tx("landing", "shiftStat3Val", lang), lab: tx("landing", "shiftStat3Lab", lang), color: "#22c55e" },
            { val: tx("landing", "shiftStat4Val", lang), lab: tx("landing", "shiftStat4Lab", lang), color: "#22c55e" },
          ].map((s) => (
            <div key={s.val}>
              <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.val}</div>
              <div className="text-xs leading-snug" style={{ color: "#7070a0" }}>{s.lab}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO vs GEO comparison */}
      <section>
        <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#ff6b35" }}>
          {tx("landing", "vsLabel", lang)}
        </div>
        <h2 className="text-3xl font-black mb-3">{tx("landing", "vsHeadline", lang)}</h2>
        <p className="text-sm mb-10 max-w-xl" style={{ color: "#7070a0" }}>{tx("landing", "vsSub", lang)}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {/* SEO column */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "#0f0f17", border: "1px solid #25253f", opacity: 0.7 }}
          >
            <div
              className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-5 uppercase tracking-widest"
              style={{ background: "#1a1a2e", color: "#7070a0", border: "1px solid #25253f" }}
            >
              {tx("landing", "seoLabel", lang)}
            </div>
            <ul className="space-y-3">
              {(["seoR1", "seoR2", "seoR3", "seoR4", "seoR5"] as const).map((k) => (
                <li key={k} className="flex items-start gap-2.5 text-sm" style={{ color: "#7070a0" }}>
                  <span style={{ color: "#ff4d6d", flexShrink: 0 }}>✕</span>
                  {tx("landing", k, lang)}
                </li>
              ))}
            </ul>
          </div>
          {/* GEO column */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "linear-gradient(135deg, #0f1a0f 0%, #0f0f17 100%)", border: "1px solid rgba(34,197,94,0.3)" }}
          >
            <div
              className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-5 uppercase tracking-widest"
              style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}
            >
              {tx("landing", "geoLabel", lang)}
            </div>
            <ul className="space-y-3">
              {(["geoR1", "geoR2", "geoR3", "geoR4", "geoR5"] as const).map((k) => (
                <li key={k} className="flex items-start gap-2.5 text-sm" style={{ color: "#a0a0c8" }}>
                  <span style={{ color: "#22c55e", flexShrink: 0 }}>✓</span>
                  {tx("landing", k, lang)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How GEO works — 3 principles */}
      <section>
        <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7070a0" }}>
          {tx("landing", "howLabel", lang)}
        </div>
        <h2 className="text-3xl font-black mb-3">{tx("landing", "howHeadline", lang)}</h2>
        <p className="text-sm mb-10 max-w-xl" style={{ color: "#7070a0" }}>{tx("landing", "howSub", lang)}</p>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { num: "01", titleKey: "how1Title" as const, descKey: "how1Desc" as const, color: "#ff6b35" },
            { num: "02", titleKey: "how2Title" as const, descKey: "how2Desc" as const, color: "#f5a623" },
            { num: "03", titleKey: "how3Title" as const, descKey: "how3Desc" as const, color: "#22c55e" },
          ].map((p) => (
            <div
              key={p.num}
              className="rounded-2xl p-7 flex flex-col"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div className="text-4xl font-black mb-5 opacity-20" style={{ color: p.color }}>{p.num}</div>
              <h3 className="text-lg font-bold mb-3" style={{ color: p.color }}>
                {tx("landing", p.titleKey, lang)}
              </h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "#7070a0" }}>
                {tx("landing", p.descKey, lang)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features — 2+3 asymmetric */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-8" style={{ color: "#7070a0" }}>
          {tx("landing", "whatWeDoLabel", lang)}
        </h2>
        <div className="grid md:grid-cols-5 gap-5">
          <div
            className="md:col-span-2 rounded-2xl p-8 flex flex-col justify-between min-h-48"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="text-3xl mb-6" style={{ color: features[0].accent }}>{features[0].icon}</div>
            <div>
              <h3 className="text-lg font-bold mb-2">{tx("landing", features[0].titleKey, lang)}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>{tx("landing", features[0].descKey, lang)}</p>
            </div>
          </div>
          <div className="md:col-span-3 flex flex-col gap-5">
            {features.slice(1, 3).map((f) => (
              <div
                key={f.titleKey}
                className="rounded-2xl p-6 flex gap-5 items-start"
                style={{ background: "#0f0f17", border: "1px solid #25253f" }}
              >
                <div className="text-2xl mt-0.5 shrink-0" style={{ color: f.accent }}>{f.icon}</div>
                <div>
                  <h3 className="font-bold mb-1">{tx("landing", f.titleKey, lang)}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>{tx("landing", f.descKey, lang)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5 mt-5">
          {features.slice(3).map((f) => (
            <div
              key={f.titleKey}
              className="rounded-2xl p-6 flex gap-5 items-start"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div className="text-2xl mt-0.5 shrink-0" style={{ color: f.accent }}>{f.icon}</div>
              <div>
                <h3 className="font-bold mb-1">{tx("landing", f.titleKey, lang)}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>{tx("landing", f.descKey, lang)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live product preview */}
      <section className="rounded-2xl p-8" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>
            {lang === "zh" ? "产品预览 · ChargeFast / USB-C Chargers" : "Product Preview · ChargeFast / USB-C Chargers"}
          </div>
          <Link
            href={lang === "zh" ? "/zh/company/techvision-pro" : "/company/techvision-pro"}
            className="text-xs underline transition-colors hover:text-white"
            style={{ color: "#7070a0" }}
          >
            {lang === "zh" ? "查看完整 Demo →" : "View full demo →"}
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {/* GEO Score */}
          <div className="rounded-xl p-5 text-center" style={{ background: "#161625", border: "1px solid #25253f" }}>
            <GeoScoreRing score={82} />
            <div className="text-sm font-semibold mt-2">{lang === "zh" ? "GEO 评分" : "GEO Score"}</div>
            <div className="text-xs mt-1" style={{ color: "#7070a0" }}>
              {lang === "zh" ? "综合可见度指数" : "Composite visibility index"}
            </div>
          </div>
          {/* Sentiment */}
          <div className="rounded-xl p-5" style={{ background: "#161625", border: "1px solid #25253f" }}>
            <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7070a0" }}>
              {lang === "zh" ? "情感分析" : "Sentiment"}
            </div>
            {[
              { label: lang === "zh" ? "正面" : "Positive", pct: 79, color: "#22c55e" },
              { label: lang === "zh" ? "中性" : "Neutral",  pct: 17, color: "#f5a623" },
              { label: lang === "zh" ? "负面" : "Negative", pct: 4,  color: "#ff4d6d" },
            ].map((s) => (
              <div key={s.label} className="mb-2.5">
                <div className="flex justify-between text-xs mb-1" style={{ color: "#7070a0" }}>
                  <span>{s.label}</span><span style={{ color: s.color }}>{s.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#25253f" }}>
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
          {/* SOV by model */}
          <div className="rounded-xl p-5" style={{ background: "#161625", border: "1px solid #25253f" }}>
            <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7070a0" }}>
              {lang === "zh" ? "各模型 SOV" : "SOV by AI Model"}
            </div>
            {[
              { label: "ChatGPT",    val: 34.2 },
              { label: "Claude",     val: 29.7 },
              { label: "Perplexity", val: 31.5 },
            ].map((m) => (
              <div key={m.label} className="mb-2.5">
                <div className="flex justify-between text-xs mb-1" style={{ color: "#7070a0" }}>
                  <span>{m.label}</span><span style={{ color: "#f5a623" }}>{m.val}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#25253f" }}>
                  <div className="h-full rounded-full" style={{ width: `${m.val * 2.5}%`, background: "#f5a623" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing">
        <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#ff6b35" }}>
          {tx("landing", "pricingLabel", lang)}
        </div>
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-black">{tx("landing", "pricingTitle", lang)}</h2>
            <p className="text-sm mt-1" style={{ color: "#7070a0" }}>{tx("landing", "pricingSubtitle", lang)}</p>
          </div>
          <div
            className="text-xs px-3 py-1.5 rounded-full font-semibold"
            style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }}
          >
            {tx("landing", "pricingAnnual", lang)}
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.nameKey}
              className="rounded-2xl p-6 flex flex-col"
              style={{
                background: plan.highlight ? "linear-gradient(135deg, #1a1025 0%, #0f0f17 100%)" : "#0f0f17",
                border: plan.highlight ? "1px solid rgba(255,107,53,0.4)" : "1px solid #25253f",
              }}
            >
              {plan.highlight && (
                <div
                  className="text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full self-start mb-4"
                  style={{ background: "rgba(255,107,53,0.15)", color: "#ff6b35" }}
                >
                  {lang === "zh" ? "推荐" : "Popular"}
                </div>
              )}
              <div className="mb-1 font-bold">{tx("landing", plan.nameKey, lang)}</div>
              <div className="flex items-baseline gap-0.5 mb-1">
                <span className="text-3xl font-black" style={{ color: plan.highlight ? "#ff6b35" : "#f0f0f8" }}>
                  {tx("landing", plan.priceKey, lang)}
                </span>
                {plan.perKey && (
                  <span className="text-sm" style={{ color: "#7070a0" }}>{tx("landing", plan.perKey, lang)}</span>
                )}
              </div>
              <div className="text-xs mb-5" style={{ color: "#7070a0" }}>{tx("landing", plan.descKey, lang)}</div>
              <ul className="space-y-2 flex-1 mb-6">
                {plan.featureKeys.map((fk) => (
                  <li key={fk} className="flex items-start gap-2 text-xs" style={{ color: "#7070a0" }}>
                    <span style={{ color: "#22c55e", flexShrink: 0 }}>✓</span>
                    {tx("landing", fk, lang)}
                  </li>
                ))}
              </ul>
              {plan.external ? (
                <a
                  href={plan.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-center py-2 rounded-xl transition-opacity hover:opacity-80"
                  style={{ background: "#25253f", color: "#f0f0f8" }}
                >
                  {tx("landing", plan.ctaKey, lang)}
                </a>
              ) : (
                <Link
                  href={plan.ctaHref}
                  className="text-sm font-semibold text-center py-2 rounded-xl transition-opacity hover:opacity-80"
                  style={
                    plan.highlight
                      ? { background: "#ff6b35", color: "#fff" }
                      : { background: "#161625", color: "#f0f0f8", border: "1px solid #25253f" }
                  }
                >
                  {tx("landing", plan.ctaKey, lang)}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Brand story */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#ff6b35" }}>
            {tx("landing", "ourNameLabel", lang)}
          </div>
          <h2 className="text-3xl font-black mb-4 leading-tight">
            {tx("landing", "storyHeadline1", lang)}<br />
            <span style={{ color: "#f5a623" }}>{tx("landing", "storyAccent", lang)}</span>
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#7070a0" }}>{tx("landing", "storyP1", lang)}</p>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#7070a0" }}>{tx("landing", "storyP2", lang)}</p>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-75"
            style={{ color: "#ff6b35" }}
          >
            {tx("landing", "bookCall", lang)}
          </a>
        </div>
        <div className="rounded-2xl p-8 text-center" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="text-7xl font-black mb-2" style={{ color: "#ff6b35" }}>前进</div>
          <div className="text-sm font-medium mb-6" style={{ color: "#7070a0" }}>{tx("landing", "storyCharLabel", lang)}</div>
          <p className="italic text-sm leading-relaxed" style={{ color: "#7070a0" }}>{tx("landing", "storyQuote", lang)}</p>
          <p className="text-xs mt-3" style={{ color: "#25253f" }}>{tx("landing", "storyQuoteAttr", lang)}</p>
        </div>
      </section>

      {/* CTA banner */}
      <section
        className="rounded-2xl p-10 text-center"
        style={{ background: "linear-gradient(135deg, #0f0f17 0%, #161625 100%)", border: "1px solid #25253f" }}
      >
        <h2 className="text-2xl font-black mb-2">{tx("landing", "ctaBannerH2", lang)}</h2>
        <p className="text-sm mb-8" style={{ color: "#7070a0" }}>{tx("landing", "ctaBannerSub", lang)}</p>
        <Link
          href={auditPath}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          {tx("landing", "ctaBannerBtn", lang)}
        </Link>
      </section>
    </div>
  );
}
