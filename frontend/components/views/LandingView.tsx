import Link from "next/link";
import { Lang, tx } from "@/lib/i18n";
import ScrollReveal from "@/components/ui/ScrollReveal";

const CALENDLY = "https://calendly.com/brivesubscription/30min";

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

  const stats = [
    { val: tx("landing", "stat1Val", lang), label: tx("landing", "stat1Label", lang) },
    { val: tx("landing", "stat2Val", lang), label: tx("landing", "stat2Label", lang) },
    { val: tx("landing", "stat3Val", lang), label: tx("landing", "stat3Label", lang) },
    { val: tx("landing", "stat4Val", lang), label: tx("landing", "stat4Label", lang) },
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
      <ScrollReveal />

      {/* Hero */}
      <section className="pt-16 pb-8 text-center relative overflow-hidden">
        {/* Background orbs */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none animate-orb"
          style={{ background: "radial-gradient(ellipse at center, rgba(255,107,53,0.18) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div
          className="absolute top-16 left-1/4 w-72 h-72 pointer-events-none animate-orb delay-400"
          style={{ background: "radial-gradient(circle at center, rgba(245,166,35,0.12) 0%, transparent 70%)", filter: "blur(50px)" }}
        />
        <div className="max-w-3xl mx-auto relative z-10">
          <div
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6 animate-fade-up"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.25)" }}
          >
            {tx("landing", "pill", lang)}
          </div>
          <h1 className="text-6xl font-black tracking-tight leading-none mb-4 animate-fade-up delay-200" style={{ color: "#f0f0f8" }}>
            {tx("landing", "heroLine1", lang)}<br />
            <span className="shimmer-text">{tx("landing", "heroAccent", lang)}</span>
          </h1>
          <p className="text-base mb-3 max-w-xl mx-auto font-semibold tracking-wide animate-fade-up delay-300" style={{ color: "#7070a0" }}>
            {lang === "zh" ? "被引用。被信任。成为答案。" : "Be Cited. Be Trusted. Be the Answer."}
          </p>
          <p className="text-lg mb-10 max-w-xl mx-auto animate-fade-up delay-400" style={{ color: "#7070a0" }}>
            {tx("landing", "subheadline", lang)}
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap animate-fade-up delay-500">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-85"
              style={{ background: "#ff6b35", color: "#fff", boxShadow: "0 0 24px rgba(255,107,53,0.35)" }}
            >
              {lang === "zh" ? "预约免费策略通话 →" : "Book a Free Strategy Call →"}
            </a>
            <Link
              href={auditPath}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium transition-colors hover:text-white"
              style={{ border: "1px solid #25253f", color: "#7070a0" }}
            >
              {lang === "zh" ? "先免费自助诊断" : "Start Free Audit"}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section
        className="reveal rounded-2xl px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        {stats.map((s) => (
          <div key={s.label} className="group">
            <div className="text-3xl font-black mb-1 transition-all duration-500 hover:text-white" style={{ color: "#ff6b35" }}>{s.val}</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* AI Shift urgency banner */}
      <section
        className="reveal rounded-2xl p-8 transition-all duration-700 hover:[box-shadow:0_0_30px_rgba(245,166,35,0.1)]"
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
            className="reveal-left rounded-2xl p-6 transition-all duration-300 hover:scale-[1.015] hover:[box-shadow:0_4px_24px_rgba(0,0,0,0.4)]"
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
            className="reveal-right rounded-2xl p-6 transition-all duration-300 hover:scale-[1.015] hover:[box-shadow:0_4px_24px_rgba(0,0,0,0.4)]"
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
          ].map((p, i) => (
            <div
              key={p.num}
              className={`reveal card-hover rounded-2xl p-7 flex flex-col delay-${i * 200} transition-all duration-300 hover:[box-shadow:0_0_20px_rgba(255,107,53,0.15)]`}
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

      {/* AI Quality Cleanup Warning */}
      <section className="space-y-6">
        {/* Warning banner */}
        <div
          className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-5"
          style={{ background: "rgba(255,77,109,0.06)", border: "1px solid rgba(255,77,109,0.25)" }}
        >
          <div className="text-3xl shrink-0 animate-pulse">⚠</div>
          <div className="flex-1">
            <div className="font-bold text-base mb-1" style={{ color: "#ff4d6d" }}>
              {lang === "zh"
                ? "AI 大清洗正在发生：30% 品牌一夜消失"
                : "AI Quality Cleanup: 30% of brands disappeared overnight"}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#9090b0" }}>
              {lang === "zh"
                ? "DeepSeek、ChatGPT 等主流 AI 已完成质量过滤升级——靠批量自动生成内容冲上 AI 推荐位的品牌，正在被系统性清洗。你的品牌引用来自权威评测，还是低质自动内容？"
                : "DeepSeek and ChatGPT have upgraded their quality filters. Brands that relied on auto-generated content spam are being systematically removed. Do you know the quality of your AI citations?"}
            </p>
          </div>
          <a
            href={lang === "zh" ? "/zh/audit" : "/audit"}
            className="shrink-0 text-sm font-semibold px-5 py-2.5 rounded-xl transition-opacity hover:opacity-85 whitespace-nowrap"
            style={{ background: "#ff4d6d", color: "#fff" }}
          >
            {lang === "zh" ? "检测我的内容健康度 →" : "Check My Citation Health →"}
          </a>
        </div>

        {/* Three pillars of healthy GEO */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#ff6b35" }}>
            {lang === "zh" ? "良性 GEO 的三真标准" : "The Three Standards of Healthy GEO"}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: "①",
                title: lang === "zh" ? "真专家" : "Real Experts",
                desc: lang === "zh"
                  ? "内容由领域专家署名并校验，非 AI 自动生成。AI 优先引用有专家背书的内容。"
                  : "Content authored or verified by domain experts — not AI-generated. AI models heavily favor expert-attributed content.",
                color: "#22c55e",
              },
              {
                icon: "②",
                title: lang === "zh" ? "真数据" : "Real Data",
                desc: lang === "zh"
                  ? "技术参数有可公开验证的测试来源（PDF 报告/认证）。AI 偏爱有数据支撑的事实陈述。"
                  : "Technical specs with publicly verifiable test sources. AI strongly prefers factual claims backed by data.",
                color: "#f5a623",
              },
              {
                icon: "③",
                title: lang === "zh" ? "真结构" : "Real Structure",
                desc: lang === "zh"
                  ? "内容按用户决策旅程布局（需求→对比→结论），而非关键词堆砌。AI 的 RAG 系统更容易提取完整答案。"
                  : "Content structured around buyer decision journeys (need → compare → conclude). AI RAG systems extract this easily.",
                color: "#3b82f6",
              },
            ].map((p) => (
              <div
                key={p.icon}
                className="rounded-xl p-5 space-y-3 transition-all duration-300 hover:scale-[1.02] hover:[box-shadow:0_4px_20px_rgba(0,0,0,0.3)]"
                style={{ background: "#0f0f17", border: `1px solid ${p.color}25` }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black" style={{ color: p.color }}>{p.icon}</span>
                  <span className="font-bold text-sm">{p.title}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{p.desc}</p>
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
              className="rounded-2xl p-6 flex flex-col transition-all duration-300 hover:scale-[1.02] hover:[box-shadow:0_0_20px_rgba(255,107,53,0.12)]"
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
        <div className="reveal-scale">
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
        <div className="reveal-scale rounded-2xl p-8 text-center" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="text-7xl font-black mb-2" style={{ color: "#ff6b35" }}>前进</div>
          <div className="text-sm font-medium mb-6" style={{ color: "#7070a0" }}>{tx("landing", "storyCharLabel", lang)}</div>
          <p className="italic text-sm leading-relaxed" style={{ color: "#7070a0" }}>{tx("landing", "storyQuote", lang)}</p>
          <p className="text-xs mt-3" style={{ color: "#25253f" }}>{tx("landing", "storyQuoteAttr", lang)}</p>
        </div>
      </section>

      {/* CTA banner */}
      <section
        className="rounded-2xl p-10 text-center"
        style={{ background: "linear-gradient(135deg, #0f0f17 0%, #161625 100%)", border: "1px solid rgba(255,107,53,0.25)" }}
      >
        <h2 className="text-2xl font-black mb-2">{tx("landing", "ctaBannerH2", lang)}</h2>
        <p className="text-sm mb-8" style={{ color: "#7070a0" }}>{tx("landing", "ctaBannerSub", lang)}</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-500 hover:opacity-85 hover:[box-shadow:0_0_40px_rgba(255,107,53,0.5)]"
            style={{ background: "#ff6b35", color: "#fff", boxShadow: "0 0 24px rgba(255,107,53,0.35)" }}
          >
            {lang === "zh" ? "预约免费策略通话 →" : "Book a Free Strategy Call →"}
          </a>
          <Link
            href={auditPath}
            className="text-sm font-medium transition-colors hover:text-white"
            style={{ color: "#7070a0" }}
          >
            {lang === "zh" ? "或先免费自助诊断 →" : "or start free audit →"}
          </Link>
        </div>
      </section>
    </div>
  );
}
