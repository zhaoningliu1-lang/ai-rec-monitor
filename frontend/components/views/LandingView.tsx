"use client";

import Link from "next/link";
import { Lang, tx } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useState } from "react";
import { Search, BarChart2, TrendingUp, Globe, Package } from "lucide-react";

const CALENDLY = "https://calendly.com/brivesubscription/30min";

const reveal = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

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
  const [heroTab, setHeroTab] = useState<"geo" | "traffic">("geo");
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

  const mockBrands = [
    { name: "Anker", score: 78, color: "#22c55e" },
    { name: lang === "zh" ? "你的品牌" : "Your Brand", score: 34, color: "#ff4d6d" },
    { name: "NOCO", score: 61, color: "#f5a623" },
  ];

  const howSteps = [
    {
      num: "01",
      titleKey: "how1Title" as const,
      descKey: "how1Desc" as const,
      color: "#ff6b35",
      Icon: Search,
    },
    {
      num: "02",
      titleKey: "how2Title" as const,
      descKey: "how2Desc" as const,
      color: "#f5a623",
      Icon: BarChart2,
    },
    {
      num: "03",
      titleKey: "how3Title" as const,
      descKey: "how3Desc" as const,
      color: "#22c55e",
      Icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero -- asymmetric split layout */}
      <section className="pt-16 pb-8 relative overflow-hidden">
        {/* Background orbs */}
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[400px] pointer-events-none animate-orb"
          style={{ background: "radial-gradient(ellipse at center, rgba(255,107,53,0.18) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div
          className="absolute top-16 left-[10%] w-72 h-72 pointer-events-none animate-orb delay-400"
          style={{ background: "radial-gradient(circle at center, rgba(245,166,35,0.12) 0%, transparent 70%)", filter: "blur(50px)" }}
        />

        <div className="relative z-10 grid md:grid-cols-[55fr_45fr] gap-10 items-center">
          {/* Left column -- text */}
          <motion.div {...reveal}>
            <div
              className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6"
              style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.25)" }}
            >
              {tx("landing", "pill", lang)}
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-4" style={{ color: "#f0f0f8" }}>
              {tx("landing", "heroLine1", lang)}<br />
              <span className="shimmer-text">{tx("landing", "heroAccent", lang)}</span>
            </h1>
            <p className="text-base mb-3 max-w-xl font-semibold tracking-wide" style={{ color: "#7070a0" }}>
              {lang === "zh" ? "被引用。被信任。成为答案。" : "Be Cited. Be Trusted. Be the Answer."}
            </p>
            <p className="text-lg mb-4 max-w-xl" style={{ color: "#7070a0" }}>
              {tx("landing", "subheadline", lang)}
            </p>
            {/* Social proof micro-stat -- NexSpark-inspired outcome-first */}
            <div
              className="inline-flex items-center gap-3 rounded-xl px-4 py-2.5 mb-8"
              style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
            >
              <span className="text-lg font-black" style={{ color: "#22c55e" }}>+5.1</span>
              <span className="text-xs leading-tight" style={{ color: "#9090b0" }}>
                {lang === "zh"
                  ? "厦门跨境卖家首月 GEO 分数提升"
                  : "GEO Score improvement for Xiamen seller in month 1"}
              </span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href={auditPath}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-85"
                style={{ background: "#ff6b35", color: "#fff", boxShadow: "0 0 24px rgba(255,107,53,0.35)" }}
              >
                {lang === "zh" ? "免费诊断我的品牌 →" : "Free Brand Diagnosis →"}
              </Link>
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium transition-colors hover:text-white"
                style={{ border: "1px solid #25253f", color: "#7070a0" }}
              >
                {lang === "zh" ? "或预约策略通话" : "or Book Strategy Call"}
              </a>
            </div>
          </motion.div>

          {/* Right column -- mock dashboard card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="hidden md:block"
          >
            <div
              className="rounded-2xl p-6 space-y-5"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>
                  {lang === "zh" ? "AI 可见性监控" : "AI Visibility Monitor"}
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: "#22c55e" }}
                  />
                  <span className="text-xs" style={{ color: "#22c55e" }}>
                    {lang === "zh" ? "实时" : "Live"}
                  </span>
                </div>
              </div>

              <div className="flex gap-1 rounded-lg p-0.5" style={{ background: "#161625" }}>
                <button
                  onClick={() => setHeroTab("geo")}
                  className="text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                  style={{
                    background: heroTab === "geo" ? "#25253f" : "transparent",
                    color: heroTab === "geo" ? "#f0f0f8" : "#555580",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {lang === "zh" ? "GEO 分数" : "GEO Score"}
                </button>
                <button
                  onClick={() => setHeroTab("traffic")}
                  className="text-xs font-semibold px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
                  style={{
                    background: heroTab === "traffic" ? "#25253f" : "transparent",
                    color: heroTab === "traffic" ? "#f0f0f8" : "#555580",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {lang === "zh" ? "AI 流量" : "AI Traffic"}
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}
                  >
                    +693%
                  </span>
                </button>
              </div>

              {heroTab === "traffic" ? (
                <>
                  {[
                    { engine: "ChatGPT", sessions: 412, color: "#22c55e", pct: 100 },
                    { engine: "Perplexity", sessions: 187, color: "#3b82f6", pct: 45 },
                    { engine: "Gemini", sessions: 94, color: "#f5a623", pct: 23 },
                    { engine: "Claude", sessions: 31, color: "#a78bfa", pct: 8 },
                  ].map((item) => (
                    <div
                      key={item.engine}
                      className="flex items-center gap-4 rounded-xl px-4 py-3"
                      style={{ background: "#161625", border: "1px solid #25253f" }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold mb-1" style={{ color: "#f0f0f8" }}>
                          {item.engine}
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#25253f" }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${item.pct}%`, background: item.color }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black" style={{ color: item.color }}>
                          {item.sessions}
                        </div>
                        <div className="text-xs" style={{ color: "#7070a0" }}>
                          {lang === "zh" ? "本周会话" : "sessions/wk"}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-xs text-center pt-1" style={{ color: "#555580" }}>
                    {lang === "zh" ? "模拟数据 · 仅供展示" : "Simulated data · For illustration"}
                  </div>
                </>
              ) : (
                <>
                  {mockBrands.map((brand) => (
                    <div
                      key={brand.name}
                      className="flex items-center gap-4 rounded-xl px-4 py-3"
                      style={{ background: "#161625", border: "1px solid #25253f" }}
                    >
                      <GeoScoreRing score={brand.score} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold mb-0.5" style={{ color: "#f0f0f8" }}>
                          {brand.name}
                        </div>
                        <div className="text-xs" style={{ color: "#7070a0" }}>
                          {lang === "zh" ? "GEO 分数" : "GEO Score"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black" style={{ color: brand.color }}>
                          {brand.score}
                        </div>
                        <div className="text-xs" style={{ color: "#7070a0" }}>/100</div>
                      </div>
                    </div>
                  ))}

                  <div className="text-xs text-center pt-1" style={{ color: "#555580" }}>
                    {lang === "zh" ? "4 AI 引擎 · 实时追踪" : "4 AI Engines · Real-time Tracking"}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <motion.section
        {...reveal}
        className="rounded-2xl px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        {stats.map((s) => (
          <div key={s.label} className="group">
            <div className="text-3xl font-black mb-1 transition-all duration-500 hover:text-white" style={{ color: "#ff6b35" }}>{s.val}</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>{s.label}</div>
          </div>
        ))}
      </motion.section>

      <div className="text-xs mt-3 text-center" style={{ color: "#555580" }}>
        {lang === "zh"
          ? "* Adobe Analytics：AI 驱动零售流量 2025 年假日季同比增长 +693%"
          : "* Adobe Analytics: AI-driven retail traffic grew +693% YoY in 2025 holiday season"}
      </div>

      {/* Case Study -- NexSpark-inspired client results section */}
      <motion.section
        {...reveal}
        className="rounded-2xl overflow-hidden"
        style={{ background: "#0f0f17", border: "1px solid rgba(255,107,53,0.2)" }}
      >
        <div className="px-8 pt-7 pb-2">
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#ff6b35" }}>
            {lang === "zh" ? "客户案例" : "CASE STUDY"}
          </div>
          <h2 className="text-2xl font-black mb-2 leading-tight">
            {lang === "zh"
              ? "厦门跨境卖家 DriveX：从 AI 隐身到被推荐"
              : "DriveX International: From AI Invisible to AI Recommended"}
          </h2>
          <p className="text-sm mb-6" style={{ color: "#7070a0" }}>
            {lang === "zh"
              ? "Shopee 东南亚 / Amazon 美国 · 汽车配件品类 · 3 个子品牌"
              : "Shopee SEA / Amazon US · Automotive Accessories · 3 Sub-brands"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px" style={{ background: "#25253f" }}>
          {[
            {
              brand: "JumpStart Pro",
              cat: lang === "zh" ? "汽车启动电源" : "Jump Starters",
              before: "0%",
              after: "23.7%",
              metric: lang === "zh" ? "高意图 SOV" : "High-Intent SOV",
              trend: "+5.1 pts/mo",
              color: "#22c55e",
              note: lang === "zh"
                ? "AI 推荐排名从未上榜 → 第 2 位"
                : "AI rank: Not listed → #2",
            },
            {
              brand: "MagDrive Pro",
              cat: lang === "zh" ? "车载手机支架" : "Car Phone Mounts",
              before: "0%",
              after: "7.8%",
              metric: lang === "zh" ? "加权 SOV" : "Weighted SOV",
              trend: lang === "zh" ? "优化中" : "Optimizing",
              color: "#f5a623",
              note: lang === "zh"
                ? "已获 PCMag 编辑推荐"
                : "Won PCMag Editor's Choice",
            },
            {
              brand: "DriveSafe Pro",
              cat: lang === "zh" ? "行车记录仪" : "Dash Cameras",
              before: "0%",
              after: "5.2%",
              metric: lang === "zh" ? "加权 SOV" : "Weighted SOV",
              trend: lang === "zh" ? "诊断完成" : "Diagnosed",
              color: "#ff4d6d",
              note: lang === "zh"
                ? "发现根因：零英文评测覆盖"
                : "Root cause: Zero English reviews",
            },
          ].map((item) => (
            <div key={item.brand} className="p-6 space-y-3" style={{ background: "#0f0f17" }}>
              <div>
                <div className="text-sm font-bold" style={{ color: "#f0f0f8" }}>{item.brand}</div>
                <div className="text-xs" style={{ color: "#7070a0" }}>{item.cat}</div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs line-through" style={{ color: "#555580" }}>{item.before}</span>
                <span className="text-xl font-black" style={{ color: item.color }}>{item.after}</span>
                <span className="text-xs" style={{ color: "#7070a0" }}>{item.metric}</span>
              </div>
              <div className="text-xs font-semibold" style={{ color: item.color }}>{item.trend}</div>
              <div
                className="text-xs px-3 py-1.5 rounded-lg"
                style={{ background: `${item.color}10`, color: item.color, border: `1px solid ${item.color}20` }}
              >
                {item.note}
              </div>
            </div>
          ))}
        </div>

        <div className="px-8 py-5 flex items-center justify-between flex-wrap gap-4" style={{ borderTop: "1px solid #25253f" }}>
          <p className="text-xs" style={{ color: "#7070a0" }}>
            {lang === "zh"
              ? "Avanti 为 DriveX 制定了完整的 90 天 GEO 行动计划，涵盖内容策略、媒体联系和 OKR 追踪。"
              : "Avanti built DriveX a full 90-day GEO Action Plan with content strategy, media outreach, and OKR tracking."}
          </p>
          <Link
            href={lang === "zh" ? "/zh/company/techvision-pro" : "/company/techvision-pro"}
            className="shrink-0 text-xs font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            {lang === "zh" ? "查看完整案例 →" : "See Full Case Study →"}
          </Link>
        </div>
      </motion.section>

      {/* AI Shift urgency banner */}
      <motion.section
        {...reveal}
        className="rounded-2xl p-8 transition-all duration-700 hover:[box-shadow:0_0_30px_rgba(245,166,35,0.1)]"
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
      </motion.section>

      {/* SEO vs GEO comparison */}
      <motion.section {...reveal}>
        <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#ff6b35" }}>
          {tx("landing", "vsLabel", lang)}
        </div>
        <h2 className="text-3xl font-black mb-3">{tx("landing", "vsHeadline", lang)}</h2>
        <p className="text-sm mb-10 max-w-xl" style={{ color: "#7070a0" }}>{tx("landing", "vsSub", lang)}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {/* SEO column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.015] hover:[box-shadow:0_4px_24px_rgba(0,0,0,0.4)]"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
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
                  <span style={{ color: "#ff4d6d", flexShrink: 0 }}>x</span>
                  {tx("landing", k, lang)}
                </li>
              ))}
            </ul>
          </motion.div>
          {/* GEO column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.015] hover:[box-shadow:0_4px_24px_rgba(0,0,0,0.4)]"
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
                  <span style={{ color: "#22c55e", flexShrink: 0 }}>&#10003;</span>
                  {tx("landing", k, lang)}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* How GEO works -- 2-column zigzag */}
      <motion.section {...reveal}>
        <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7070a0" }}>
          {tx("landing", "howLabel", lang)}
        </div>
        <h2 className="text-3xl font-black mb-3">{tx("landing", "howHeadline", lang)}</h2>
        <p className="text-sm mb-10 max-w-xl" style={{ color: "#7070a0" }}>{tx("landing", "howSub", lang)}</p>

        <div className="space-y-6">
          {howSteps.map((step, i) => {
            const isEven = i % 2 === 1;
            const textBlock = (
              <div className="flex-1 space-y-3">
                <div className="text-4xl font-black opacity-20" style={{ color: step.color }}>
                  {step.num}
                </div>
                <h3 className="text-lg font-bold" style={{ color: step.color }}>
                  {tx("landing", step.titleKey, lang)}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
                  {tx("landing", step.descKey, lang)}
                </p>
              </div>
            );
            const iconBlock = (
              <div
                className="flex items-center justify-center rounded-2xl w-full md:w-auto md:min-w-[200px] aspect-square max-w-[200px]"
                style={{ background: "#0f0f17", border: `1px solid ${step.color}30` }}
              >
                <step.Icon size={64} style={{ color: step.color }} strokeWidth={1.2} />
              </div>
            );

            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="grid md:grid-cols-[1fr_auto] gap-8 items-center rounded-2xl p-7"
                style={{
                  background: "#0f0f17",
                  border: "1px solid #25253f",
                  direction: isEven ? "rtl" : "ltr",
                }}
              >
                <div style={{ direction: "ltr" }}>{textBlock}</div>
                <div style={{ direction: "ltr" }}>{iconBlock}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Built for Cross-border Brands */}
      <motion.section {...reveal}>
        <div
          className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.25)" }}
        >
          {lang === "zh" ? "跨境卖家专区" : "CROSS-BORDER SELLERS"}
        </div>
        <h2 className="text-3xl font-black mb-3 leading-tight">
          {lang === "zh"
            ? "美国 60% 的电商产品来自亚洲。AI 能找到你吗？"
            : "60% of US e-commerce products come from Asia. Is yours visible to AI?"}
        </h2>
        <p className="text-sm mb-10 max-w-2xl" style={{ color: "#7070a0" }}>
          {lang === "zh"
            ? "你的竞争对手已经在 AI 里消失了。Avanti 帮你抢回曝光。"
            : "Your competitors are already invisible to ChatGPT. Avanti bridges the gap."}
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              Icon: Globe,
              title: lang === "zh" ? "AI 不识别蹩脚英语" : "AI doesn\u2019t speak broken English",
              desc: lang === "zh"
                ? "我们优化你在 AI 引擎面前的内容权威性"
                : "We optimize your AI-facing content for fluency and authority",
              color: "#ff6b35",
            },
            {
              Icon: Package,
              title: lang === "zh" ? "产品目录需要机器可读" : "Your catalog needs to be machine-readable",
              desc: lang === "zh"
                ? "ACP Feed 生成器让 AI Agent 发现并购买你的产品"
                : "ACP Feed Generator helps AI agents discover and buy your products",
              color: "#f5a623",
            },
            {
              Icon: BarChart2,
              title: lang === "zh" ? "Agent 流量对 GA 不可见" : "Agent traffic is invisible to GA",
              desc: lang === "zh"
                ? "B2A Analytics 揭示 GA 看不到的 AI 来源流量"
                : "B2A Analytics shows you what Google Analytics misses",
              color: "#22c55e",
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-6 space-y-3 transition-all duration-300 hover:scale-[1.02] hover:[box-shadow:0_4px_20px_rgba(0,0,0,0.3)]"
              style={{ background: "#0f0f17", border: `1px solid ${card.color}25` }}
            >
              <card.Icon size={28} style={{ color: card.color }} strokeWidth={1.5} />
              <h3 className="text-sm font-bold" style={{ color: "#f0f0f8" }}>
                {card.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* AI Quality Cleanup Warning */}
      <motion.section {...reveal} className="space-y-6">
        {/* Warning banner */}
        <div
          className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-5"
          style={{ background: "rgba(255,77,109,0.06)", border: "1px solid rgba(255,77,109,0.25)" }}
        >
          <div className="text-3xl shrink-0 animate-pulse" style={{ color: "#ff4d6d", fontWeight: 900 }}>!</div>
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
            href={lang === "zh" ? "/zh/content-health" : "/content-health"}
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
                num: "1",
                title: lang === "zh" ? "真专家" : "Real Experts",
                desc: lang === "zh"
                  ? "内容由领域专家署名并校验，非 AI 自动生成。AI 优先引用有专家背书的内容。"
                  : "Content authored or verified by domain experts -- not AI-generated. AI models heavily favor expert-attributed content.",
                color: "#22c55e",
              },
              {
                num: "2",
                title: lang === "zh" ? "真数据" : "Real Data",
                desc: lang === "zh"
                  ? "技术参数有可公开验证的测试来源（PDF 报告/认证）。AI 偏爱有数据支撑的事实陈述。"
                  : "Technical specs with publicly verifiable test sources. AI strongly prefers factual claims backed by data.",
                color: "#f5a623",
              },
              {
                num: "3",
                title: lang === "zh" ? "真结构" : "Real Structure",
                desc: lang === "zh"
                  ? "内容按用户决策旅程布局（需求 → 对比 → 结论），而非关键词堆砌。AI 的 RAG 系统更容易提取完整答案。"
                  : "Content structured around buyer decision journeys (need, compare, conclude). AI RAG systems extract this easily.",
                color: "#3b82f6",
              },
            ].map((p) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl p-5 space-y-3 transition-all duration-300 hover:scale-[1.02] hover:[box-shadow:0_4px_20px_rgba(0,0,0,0.3)]"
                style={{ background: "#0f0f17", border: `1px solid ${p.color}25` }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black" style={{ color: p.color }}>{p.num}</span>
                  <span className="font-bold text-sm">{p.title}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Pricing */}
      <motion.section {...reveal} id="pricing">
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
                    <span style={{ color: "#22c55e", flexShrink: 0 }}>&#10003;</span>
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
      </motion.section>

      {/* Brand story */}
      <motion.section {...reveal} className="grid md:grid-cols-2 gap-12 items-center">
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
      </motion.section>

      {/* CTA banner */}
      <motion.section
        {...reveal}
        className="rounded-2xl p-10 text-center"
        style={{ background: "linear-gradient(135deg, #0f0f17 0%, #161625 100%)", border: "1px solid rgba(255,107,53,0.25)" }}
      >
        <h2 className="text-2xl font-black mb-2">{tx("landing", "ctaBannerH2", lang)}</h2>
        <p className="text-sm mb-3" style={{ color: "#7070a0" }}>{tx("landing", "ctaBannerSub", lang)}</p>
        <p className="text-xs mb-8" style={{ color: "#555580" }}>
          {lang === "zh"
            ? "5 分钟免费诊断 · 无需信用卡 · 即刻查看你的品牌 AI 可见度"
            : "5-min free diagnosis · No credit card · See your brand\u2019s AI visibility instantly"}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href={auditPath}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-500 hover:opacity-85 hover:[box-shadow:0_0_40px_rgba(255,107,53,0.5)]"
            style={{ background: "#ff6b35", color: "#fff", boxShadow: "0 0 24px rgba(255,107,53,0.35)" }}
          >
            {lang === "zh" ? "免费诊断我的品牌 →" : "Free Brand Diagnosis →"}
          </Link>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors hover:text-white"
            style={{ color: "#7070a0" }}
          >
            {lang === "zh" ? "或预约策略通话 →" : "or book strategy call →"}
          </a>
        </div>
      </motion.section>
    </div>
  );
}
