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
          <div key={s.label}>
            <div className="text-3xl font-black mb-1" style={{ color: "#ff6b35" }}>{s.val}</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* AI Shift urgency banner */}
      <section
        className="reveal rounded-2xl p-8"
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
            className="reveal-left rounded-2xl p-6"
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
            className="reveal-right rounded-2xl p-6"
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
              className={`reveal card-hover rounded-2xl p-7 flex flex-col delay-${i * 200}`}
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

      {/* Three Pillars */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-black">
            {lang === "zh" ? "一个平台，三项竞争优势。" : "One platform. Three competitive edges."}
          </h2>
          <p className="text-sm mt-2" style={{ color: "#7070a0" }}>
            {lang === "zh"
              ? "无论你是想提升品牌 AI 曝光，还是想先人一步知道该卖什么——Avanti 都有答案。"
              : "Whether you're a brand growing in AI or a seller deciding what to stock — Avanti gives you the edge."}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: "◎",
              color: "#ff6b35",
              title:    lang === "zh" ? "GEO 可见度监控" : "GEO Monitoring",
              desc:     lang === "zh"
                ? "追踪你的品牌在 ChatGPT、Claude、Gemini、Perplexity 中的 AI 推荐排名。知道你排第几，以及为什么。"
                : "Track your brand's AI recommendation ranking across ChatGPT, Claude, Gemini, and Perplexity. Know where you stand — and why.",
              cta:      lang === "zh" ? "免费诊断 →" : "Run Free Audit →",
              href:     lang === "zh" ? "/zh/audit" : "/audit",
            },
            {
              icon: "◈",
              color: "#f5a623",
              title:    lang === "zh" ? "AI 选品情报" : "Selection Intelligence",
              desc:     lang === "zh"
                ? "知道 AI 正在推荐哪些品类和品牌——比竞争对手先一步备货。数据每月更新。"
                : "Know what AI is recommending — before your competitors stock it. See which categories and brands buyers are being sent to.",
              cta:      lang === "zh" ? "查看你的选品机会 →" : "See your brand's opportunity →",
              href:     lang === "zh" ? "/zh/signup" : "/signup",
            },
            {
              icon: "◑",
              color: "#22c55e",
              title:    lang === "zh" ? "成本优化计算器" : "Cost Optimizer",
              desc:     lang === "zh"
                ? "计算你的运营成本中哪些可以用 AI 替代，省下来的钱直接投入 GEO 监控。"
                : "Find which ops costs AI can replace. Calculate your monthly savings — then reinvest them into GEO visibility.",
              cta:      lang === "zh" ? "计算节省额 →" : "Calculate Savings →",
              href:     lang === "zh" ? "/zh/optimizer" : "/optimizer",
            },
          ].map((p, i) => (
            <div
              key={p.title}
              className={`reveal-scale card-hover rounded-2xl p-6 flex flex-col gap-4 delay-${i * 200}`}
              style={{ background: "#0f0f17", border: `1px solid ${p.color}30` }}
            >
              <div className="text-2xl" style={{ color: p.color }}>{p.icon}</div>
              <div>
                <div className="font-bold text-base mb-2">{p.title}</div>
                <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>{p.desc}</p>
              </div>
              <a
                href={p.href}
                className="text-sm font-medium mt-auto transition-colors hover:opacity-80"
                style={{ color: p.color }}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Selection Intel Preview */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#f5a623" }}>
              {lang === "zh" ? "AI 选品情报" : "AI Selection Intelligence"}
            </div>
            <h2 className="text-xl font-bold">
              {lang === "zh" ? "AI 本月正在推荐什么" : "What AI Is Recommending Right Now"}
            </h2>
          </div>
          <a
            href={lang === "zh" ? "/zh/signup" : "/signup"}
            className="text-sm font-medium shrink-0 transition-colors hover:text-white"
            style={{ color: "#f5a623" }}
          >
            {lang === "zh" ? "查看全部品类 →" : "See all categories →"}
          </a>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { cat: lang === "zh" ? "便携储能" : "Portable Power Stations", signal: lang === "zh" ? "强烈推荐入场" : "STRONG BUY", signalColor: "#22c55e", signalBg: "rgba(34,197,94,0.1)", trend: "↑ +4.2pts", brands: ["EcoFlow 34.2%", "Jackery 28.7%", "Bluetti 19.4%"], tag: lang === "zh" ? "Amazon" : "Amazon" },
            { cat: lang === "zh" ? "TikTok 爆款美妆" : "Viral Skincare & Beauty", signal: lang === "zh" ? "强烈推荐入场" : "STRONG BUY", signalColor: "#22c55e", signalBg: "rgba(34,197,94,0.1)", trend: "↑ +8.4pts", brands: ["CeraVe 31.2%", "The Ordinary 22.7%", "Laneige 14.8%"], tag: "TikTok" },
            { cat: lang === "zh" ? "美容仪器" : "Skincare Devices", signal: lang === "zh" ? "强烈推荐入场" : "STRONG BUY", signalColor: "#22c55e", signalBg: "rgba(34,197,94,0.1)", trend: "↑ +6.3pts", brands: ["NuFace 28.4%", "Foreo 24.1%", "CurrentBody 17.8%"], tag: "DTC" },
          ].map((item) => (
            <div key={item.cat} className="rounded-xl p-4 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">{item.cat}</div>
                <div className="text-xs font-bold" style={{ color: "#22c55e" }}>{item.trend}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs font-bold px-2.5 py-1 rounded-full inline-block"
                  style={{ background: item.signalBg, color: item.signalColor }}>{item.signal}</div>
                <div className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,107,53,0.08)", color: "#ff6b35" }}>{item.tag}</div>
              </div>
              <div className="space-y-1">
                {item.brands.map((b) => (
                  <div key={b} className="text-xs" style={{ color: "#7070a0" }}>· {b} SOV</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cost Optimizer Preview */}
      <section>
        <div
          className="rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8"
          style={{ background: "linear-gradient(135deg, #0f0f17 0%, #0a0a12 100%)", border: "1px solid rgba(34,197,94,0.2)" }}
        >
          <div className="flex-1 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#22c55e" }}>
              {lang === "zh" ? "成本优化" : "Cost Optimizer"}
            </div>
            <h2 className="text-xl font-bold">
              {lang === "zh" ? "省下运营成本，投入 GEO" : "Cut ops costs. Fund your GEO."}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
              {lang === "zh"
                ? "客服、选品调研、翻译、数据录入——这些工作 AI 已经可以完成 60–80%。省下来的钱可以直接覆盖你的 GEO 监控成本。"
                : "Customer service, product research, translation, data entry — AI handles 60–80% of this. The savings fund your GEO monitoring."}
            </p>
            <a
              href={lang === "zh" ? "/zh/signup" : "/signup"}
              className="inline-block text-sm font-medium px-5 py-2 rounded-lg mt-2 transition-opacity hover:opacity-80"
              style={{ background: "#22c55e", color: "#0f0f17" }}
            >
              {lang === "zh" ? "计算我能省多少 →" : "Calculate my savings →"}
            </a>
          </div>
          <div className="shrink-0 rounded-xl p-5 space-y-2 min-w-48"
            style={{ background: "#161625", border: "1px solid #25253f" }}>
            <div className="text-xs" style={{ color: "#7070a0" }}>
              {lang === "zh" ? "示例：20人客服团队" : "Example: 20-hr/wk CS team"}
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span style={{ color: "#7070a0" }}>{lang === "zh" ? "当前" : "Current"}</span><span>$1,300<span style={{ color: "#7070a0" }}>/mo</span></span></div>
              <div className="flex justify-between"><span style={{ color: "#7070a0" }}>{lang === "zh" ? "AI 后" : "After AI"}</span><span>$390<span style={{ color: "#7070a0" }}>/mo</span></span></div>
              <div className="h-px my-1" style={{ background: "#25253f" }} />
              <div className="flex justify-between font-bold">
                <span style={{ color: "#22c55e" }}>{lang === "zh" ? "节省" : "Saved"}</span>
                <span style={{ color: "#22c55e" }}>$910/mo</span>
              </div>
            </div>
            <div className="text-xs mt-2 pt-2" style={{ color: "#7070a0", borderTop: "1px solid #25253f" }}>
              = {lang === "zh" ? "4个月 Avanti GEO 监控" : "4 months Avanti GEO monitoring"}
            </div>
          </div>
        </div>
      </section>

      {/* AI Quality Cleanup Warning — learned from GEO articles */}
      <section className="space-y-6">
        {/* Warning banner */}
        <div
          className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-5"
          style={{ background: "rgba(255,77,109,0.06)", border: "1px solid rgba(255,77,109,0.25)" }}
        >
          <div className="text-3xl shrink-0">⚠</div>
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
                className="rounded-xl p-5 space-y-3"
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

        {/* Citation source quality breakdown explainer */}
        <div
          className="rounded-xl p-5"
          style={{ background: "#0a0a14", border: "1px solid #25253f" }}
        >
          <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#7070a0" }}>
            {lang === "zh" ? "Avanti 如何衡量你的引用质量" : "How Avanti Measures Your Citation Quality"}
          </div>
          <div className="grid md:grid-cols-4 gap-3">
            {[
              { label: lang === "zh" ? "专家评测" : "Expert Review", pct: "65%", color: "#22c55e", note: lang === "zh" ? "最高权重" : "Highest weight" },
              { label: lang === "zh" ? "社区讨论" : "Community",     pct: "22%", color: "#3b82f6", note: lang === "zh" ? "中等权重" : "Medium weight" },
              { label: lang === "zh" ? "电商页面" : "Retailer Pages", pct: "10%", color: "#f5a623", note: lang === "zh" ? "低权重"  : "Low weight" },
              { label: lang === "zh" ? "自动生成" : "Auto-generated", pct: "3%",  color: "#ff4d6d", note: lang === "zh" ? "清洗风险" : "Cleanup risk" },
            ].map((s) => (
              <div key={s.label} className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-xs font-semibold" style={{ color: s.color }}>{s.pct}</span>
                  <span className="text-xs" style={{ color: "#7070a0" }}>{s.label}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: s.color, width: s.pct, maxWidth: "100%", opacity: 0.7 }} />
                <div className="text-xs" style={{ color: "#555570" }}>{s.note}</div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: "#555570" }}>
            {lang === "zh"
              ? "示例来自 ChargeFast（GEO 评分 82）。以上数据来自我们平台实时监控，不是估算。"
              : "Example from ChargeFast (GEO Score 82). This data comes from live platform monitoring, not estimates."}
          </p>
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

      {/* Case Study */}
      <section className="rounded-2xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
        <div className="px-8 py-6" style={{ borderBottom: "1px solid #25253f", background: "#0a0a13" }}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#f5a623" }}>
            {lang === "zh" ? "客户案例" : "Case Study"}
          </div>
          <h2 className="text-2xl font-black leading-tight">
            {lang === "zh"
              ? "ChargeFast：8 周内 ARRS 从 71 降至 28"
              : "ChargeFast: ARRS Dropped 71 → 28 in 8 Weeks"}
          </h2>
        </div>
        <div className="grid md:grid-cols-2" style={{ background: "#0f0f17" }}>
          {/* Story */}
          <div className="p-8" style={{ borderRight: "1px solid #25253f" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>
              {lang === "zh" ? "背景" : "Background"}
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#a0a0c0" }}>
              {lang === "zh"
                ? "ChargeFast 是一家 DTC 消费电子品牌，USB-C 充电器在亚马逊长期位居前三——但 AI 助手几乎从不提及它。品牌在 AI 推荐系统里几乎是隐形的。"
                : "ChargeFast is a DTC consumer electronics brand with top-3 Amazon rankings for USB-C chargers — yet AI assistants almost never mentioned them. Invisible to the AI recommendation layer."}
            </p>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7070a0" }}>
              {lang === "zh" ? "我们做了什么" : "What We Did"}
            </p>
            <ul className="space-y-2.5 text-sm mb-7" style={{ color: "#a0a0c0" }}>
              {(lang === "zh" ? [
                "识别出 12 个被竞品占据的高意向 AI 查询词",
                "发布 4 篇定向内容，聚焦安全认证与快充规格对比",
                "在 3 家权威科技媒体获得引用和提及",
              ] : [
                "Identified 12 high-intent AI queries dominated by competitors",
                "Published 4 targeted pieces on safety certs & fast-charging specs",
                "Earned citations in 3 authoritative tech publications",
              ]).map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span style={{ color: "#ff6b35", flexShrink: 0, fontWeight: 700 }}>→</span> {item}
                </li>
              ))}
            </ul>
            <blockquote
              className="rounded-xl p-4 text-sm italic leading-relaxed"
              style={{ background: "#161625", border: "1px solid #25253f", color: "#d0d0e8" }}
            >
              {lang === "zh"
                ? "\"Avanti 让我们第一次看清楚了 AI 是怎么看我们品牌的。8 周之后，我们开始出现在大多数 ChatGPT 推荐清单里了。\""
                : '"Avanti gave us the first clear picture of how AI sees our brand. Eight weeks later, we\'re showing up in most ChatGPT recommendation lists."'}
              <div className="text-xs mt-2 not-italic" style={{ color: "#7070a0" }}>
                {lang === "zh" ? "—— ChargeFast 联合创始人" : "— ChargeFast Co-founder"}
              </div>
            </blockquote>
          </div>
          {/* Metrics */}
          <div className="p-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#7070a0" }}>
              {lang === "zh" ? "8 周成果" : "8-Week Results"}
            </p>
            {/* ARRS */}
            <div className="mb-6">
              <div className="text-xs mb-3" style={{ color: "#7070a0" }}>
                ARRS {lang === "zh" ? "（越低越好）" : "(lower = better)"}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-xl p-4 text-center" style={{ background: "#161625", border: "1px solid rgba(255,77,109,0.25)" }}>
                  <div className="text-xs mb-1" style={{ color: "#7070a0" }}>{lang === "zh" ? "诊断前" : "Before"}</div>
                  <div className="text-4xl font-black" style={{ color: "#ff4d6d" }}>71</div>
                </div>
                <div className="text-xl font-light" style={{ color: "#3a3a5c" }}>→</div>
                <div className="flex-1 rounded-xl p-4 text-center" style={{ background: "#0f1a0f", border: "1px solid rgba(34,197,94,0.25)" }}>
                  <div className="text-xs mb-1" style={{ color: "#7070a0" }}>{lang === "zh" ? "8 周后" : "After 8 wks"}</div>
                  <div className="text-4xl font-black" style={{ color: "#22c55e" }}>28</div>
                </div>
              </div>
            </div>
            {/* SOV + Rank */}
            <div className="grid grid-cols-2 gap-3 mb-7">
              <div className="rounded-xl p-4" style={{ background: "#161625", border: "1px solid #25253f" }}>
                <div className="text-xs mb-1.5" style={{ color: "#7070a0" }}>Share of Voice</div>
                <div className="text-2xl font-black" style={{ color: "#22c55e" }}>
                  +23.7<span className="text-sm font-bold">pp</span>
                </div>
                <div className="text-xs mt-1" style={{ color: "#7070a0" }}>8.1% → 31.8%</div>
              </div>
              <div className="rounded-xl p-4" style={{ background: "#161625", border: "1px solid #25253f" }}>
                <div className="text-xs mb-1.5" style={{ color: "#7070a0" }}>ChatGPT {lang === "zh" ? "排名" : "Rank"}</div>
                <div className="text-2xl font-black" style={{ color: "#f5a623" }}>#1</div>
                <div className="text-xs mt-1" style={{ color: "#7070a0" }}>
                  {lang === "zh" ? "USB-C 充电器推荐" : "USB-C charger recs"}
                </div>
              </div>
            </div>
            <Link
              href={lang === "zh" ? "/zh/signup" : "/signup"}
              className="block text-center text-sm font-semibold py-3 rounded-xl transition-opacity hover:opacity-80"
              style={{ background: "#ff6b35", color: "#fff" }}
            >
              {lang === "zh" ? "免费为你的品牌做同样的事 →" : "Do the same for your brand — free →"}
            </Link>
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
        style={{ background: "linear-gradient(135deg, #0f0f17 0%, #161625 100%)", border: "1px solid rgba(255,107,53,0.25)" }}
      >
        <h2 className="text-2xl font-black mb-2">{tx("landing", "ctaBannerH2", lang)}</h2>
        <p className="text-sm mb-8" style={{ color: "#7070a0" }}>{tx("landing", "ctaBannerSub", lang)}</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-85"
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
