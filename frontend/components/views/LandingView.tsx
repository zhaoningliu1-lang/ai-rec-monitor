"use client";

import Link from "next/link";
import { Lang, tx } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const CALENDLY = "https://calendly.com/brivesubscription/30min";

const reveal = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

interface Props {
  lang: Lang;
}

/* ─── Animated counter ─── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = to / 60;
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [to]);
  return <>{val}{suffix}</>;
}

/* ─── GEO Score ring ─── */
function ScoreRing({ score, color = "#ff6b35" }: { score: number; color?: string }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#1e1e30" strokeWidth="5" />
      <circle
        cx="40" cy="40" r={r} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
        style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
      />
      <text x="40" y="45" textAnchor="middle" fontSize="14" fontWeight="900" fill="#f0f0f8">{score}</text>
    </svg>
  );
}

/* ─── Bracket decoration (nexspark-inspired) ─── */
function SectionBracket({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="text-xs font-black tracking-[0.2em] px-2 py-1 rounded"
        style={{
          color: "#ff6b35",
          border: "1px solid rgba(255,107,53,0.4)",
          background: "rgba(255,107,53,0.06)",
          fontFamily: "monospace",
        }}
      >
        {num}
      </div>
      <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#555580" }}>
        {label}
      </div>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, #25253f, transparent)" }} />
    </div>
  );
}

export default function LandingView({ lang: _lang }: Props) {
  const lang = _lang;
  const auditPath = lang === "zh" ? "/zh/audit" : "/audit";
  const p = (en: string, zh: string) => (lang === "zh" ? zh : en);

  const [heroTab, setHeroTab] = useState<"score" | "traffic">("score");

  const mockBrands = [
    { name: "Anker",                    score: 78, color: "#22c55e" },
    { name: p("Your Brand", "你的品牌"), score: 34, color: "#ff4d6d" },
    { name: "NOCO",                     score: 61, color: "#f5a623" },
  ];

  return (
    <div className="pb-32 space-y-28 max-w-5xl mx-auto">

      {/* ═══════════════════════════════════
          HERO
      ═══════════════════════════════════ */}
      <section className="pt-20 relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute -top-20 left-1/3 w-[700px] h-[500px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255,107,53,0.14) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative z-10 grid md:grid-cols-[58fr_42fr] gap-12 items-center">
          {/* Left — copy */}
          <motion.div {...reveal}>
            {/* Pill */}
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-8"
              style={{ background: "rgba(255,107,53,0.1)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.25)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {p("AI Recommendation Visibility Platform", "AI 推荐可见度监控平台")}
            </div>

            {/* Headline */}
            <h1
              className="font-black tracking-tight leading-[1.02] mb-5"
              style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", color: "#f0f0f8" }}
            >
              {lang === "zh" ? (
                <><span style={{ color: "#ff6b35" }}>AI 在推荐</span><br />你的品牌吗？</>
              ) : (
                <>Is your brand<br /><span style={{ color: "#ff6b35" }}>visible to AI?</span></>
              )}
            </h1>

            <p className="text-lg leading-relaxed mb-3 max-w-lg" style={{ color: "#7070a0" }}>
              {p(
                "When buyers ask ChatGPT, Claude, or Gemini for product recommendations — is your brand in the answer?",
                "当消费者向 ChatGPT、Claude、Gemini 询问产品推荐时——你的品牌出现在答案里了吗？"
              )}
            </p>
            <p className="text-sm font-semibold mb-8 max-w-lg" style={{ color: "#555580" }}>
              {p(
                "Avanti measures, diagnoses, and helps you fix your AI visibility — before your competitors do.",
                "Avanti 帮你量化、诊断并提升 AI 可见度——在竞争对手之前。"
              )}
            </p>

            {/* CTA */}
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href={auditPath}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-black transition-all duration-300 hover:opacity-90 hover:translate-y-[-1px]"
                style={{
                  background: "#ff6b35",
                  color: "#fff",
                  boxShadow: "0 0 28px rgba(255,107,53,0.4), 0 4px 16px rgba(255,107,53,0.25)",
                  letterSpacing: "0.02em",
                }}
              >
                {p("Get Free GEO Diagnosis →", "免费诊断我的品牌 →")}
              </Link>
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-colors hover:text-white"
                style={{ color: "#555580" }}
              >
                {p("or book a strategy call", "或预约策略通话")}
              </a>
            </div>

            {/* Trust micro-stat */}
            <div className="flex items-center gap-6 mt-8 flex-wrap">
              {[
                { val: "4", label: p("AI engines tracked", "AI 引擎实时追踪") },
                { val: "+693%", label: p("AI-driven retail traffic YoY", "AI 零售流量年增") },
                { val: "5 min", label: p("to your first GEO Score", "获得首份 GEO 评分") },
              ].map((s) => (
                <div key={s.val}>
                  <div className="text-base font-black" style={{ color: "#ff6b35" }}>{s.val}</div>
                  <div className="text-xs" style={{ color: "#555580" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — product preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "#0b0b14", border: "1px solid #25253f", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}
            >
              {/* Window bar */}
              <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: "1px solid #1e1e30" }}>
                {["#ff4d6d", "#f5a623", "#22c55e"].map((c) => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
                ))}
                <div className="ml-3 text-xs font-mono" style={{ color: "#555580" }}>avantia2a.com — AI Visibility</div>
              </div>

              <div className="p-5 space-y-4">
                {/* Tab bar */}
                <div className="flex gap-1 p-0.5 rounded-lg" style={{ background: "#161625" }}>
                  {[
                    { key: "score" as const, label: p("GEO Score", "GEO 评分") },
                    { key: "traffic" as const, label: p("AI Traffic +693%", "AI 流量 +693%"), badge: true },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setHeroTab(t.key)}
                      className="flex-1 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors flex items-center justify-center gap-1.5"
                      style={{
                        background: heroTab === t.key ? "#25253f" : "transparent",
                        color: heroTab === t.key ? "#f0f0f8" : "#555580",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {t.label}
                      {t.badge && heroTab === t.key && (
                        <span className="text-[9px] px-1 py-0.5 rounded-full font-bold"
                          style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>LIVE</span>
                      )}
                    </button>
                  ))}
                </div>

                {heroTab === "score" ? (
                  <div className="space-y-2.5">
                    {mockBrands.map((b) => (
                      <div
                        key={b.name}
                        className="flex items-center gap-3 rounded-xl px-4 py-3"
                        style={{ background: "#161625", border: "1px solid #1e1e30" }}
                      >
                        <ScoreRing score={b.score} color={b.color} />
                        <div className="flex-1">
                          <div className="text-sm font-bold mb-0.5" style={{ color: "#f0f0f8" }}>{b.name}</div>
                          <div className="text-xs" style={{ color: "#555580" }}>
                            {p("AI Visibility Score", "AI 可见度评分")}
                          </div>
                        </div>
                        <div className="text-2xl font-black" style={{ color: b.color }}>{b.score}</div>
                      </div>
                    ))}
                    <div className="text-[11px] text-center pt-1" style={{ color: "#333355" }}>
                      {p("Simulated · For illustration only", "模拟数据 · 仅供展示")}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {[
                      { engine: "ChatGPT",    sessions: 412, color: "#22c55e", pct: 100 },
                      { engine: "Perplexity", sessions: 187, color: "#3b82f6", pct: 45 },
                      { engine: "Gemini",     sessions:  94, color: "#f5a623", pct: 23 },
                      { engine: "Claude",     sessions:  31, color: "#a78bfa", pct:  8 },
                    ].map((row) => (
                      <div
                        key={row.engine}
                        className="flex items-center gap-3 rounded-xl px-4 py-3"
                        style={{ background: "#161625", border: "1px solid #1e1e30" }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold mb-1" style={{ color: "#f0f0f8" }}>{row.engine}</div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#25253f" }}>
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${row.pct}%`, background: row.color }} />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-lg font-black" style={{ color: row.color }}>{row.sessions}</div>
                          <div className="text-[11px]" style={{ color: "#555580" }}>{p("sessions/wk", "会话/周")}</div>
                        </div>
                      </div>
                    ))}
                    <div className="text-[11px] text-center pt-1" style={{ color: "#333355" }}>
                      {p("Simulated · For illustration only", "模拟数据 · 仅供展示")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          THE SHIFT
      ═══════════════════════════════════ */}
      <motion.section {...reveal}>
        <SectionBracket num="00" label={p("The AI Shift", "AI 搜索变局")} />
        <div className="grid md:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          {[
            { val: "47%",   color: "#ff4d6d", label: p("of online shoppers now use AI for purchase decisions",        "的线上购物者已用 AI 辅助购买决策") },
            { val: "+693%", color: "#f5a623", label: p("AI-driven retail traffic growth in 2025 (Adobe Analytics)",  "AI 驱动零售流量 2025 年同比增长（Adobe）") },
            { val: "0",     color: "#ff4d6d", label: p("brands out of 50 we tested score above 60 on first audit",   "首次诊断品牌中超过 60 分的比例极低") },
            { val: "3×",    color: "#22c55e", label: p("higher conversion when AI recommends your brand by name",     "AI 点名推荐时，转化率提升幅度") },
          ].map((s, i) => (
            <div
              key={i}
              className="px-8 py-8"
              style={{ background: "#0b0b14" }}
            >
              <div className="text-4xl font-black mb-2" style={{ color: s.color }}>{s.val}</div>
              <div className="text-xs leading-relaxed" style={{ color: "#555580" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <p className="text-[11px] mt-2.5" style={{ color: "#2a2a45" }}>
          * {p("Adobe Analytics Holiday Report 2025", "Adobe Analytics 2025 假日季报告")}
        </p>
      </motion.section>

      {/* ═══════════════════════════════════
          3-LAYER FRAMEWORK
      ═══════════════════════════════════ */}
      <motion.section {...reveal}>
        <SectionBracket num="01" label={p("How Avanti Works", "Avanti 如何工作")} />
        <h2
          className="font-black tracking-tight mb-3 leading-tight"
          style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", color: "#f0f0f8" }}
        >
          {lang === "zh" ? (
            <>量化。诊断。<span style={{ color: "#ff6b35" }}>执行。</span></>
          ) : (
            <>Measure. Diagnose. <span style={{ color: "#ff6b35" }}>Execute.</span></>
          )}
        </h2>
        <p className="text-sm mb-12 max-w-xl" style={{ color: "#7070a0" }}>
          {p(
            "Most brands don't know they're invisible to AI. We built a three-layer system to fix that.",
            "大多数品牌不知道自己在 AI 里是隐形的。我们构建了三层系统来解决这个问题。"
          )}
        </p>

        <div className="space-y-4">
          {[
            {
              num: "01",
              phase: p("Measure", "量化"),
              title: p("Know Your GEO Score", "了解你的 GEO 评分"),
              desc: p(
                "Run queries across ChatGPT, Claude, Gemini, and Perplexity. Get your brand's mention rate, Share of Voice, and ARRS benchmark — your baseline for everything.",
                "跨 ChatGPT、Claude、Gemini、Perplexity 执行查询。获得品牌提及率、声量份额和 ARRS 基准——你所有优化的起点。"
              ),
              color: "#ff6b35",
              cta: null,
            },
            {
              num: "02",
              phase: p("Diagnose", "诊断"),
              title: p("Understand Why You're Invisible", "诊断你隐形的原因"),
              desc: p(
                "Reddit citation audit, YouTube KOL coverage, Amazon listing GEO score, E-E-A-T check, hallucination detection. We surface every root cause, not just symptoms.",
                "Reddit 引用审计、YouTube KOL 覆盖、Amazon Listing GEO 评分、E-E-A-T 检测、幻觉检测。我们找出每一个根本原因，而不仅仅是症状。"
              ),
              color: "#f5a623",
              cta: null,
            },
            {
              num: "03",
              phase: p("Execute", "执行"),
              title: p("Generate Content That Gets Cited", "生成能被 AI 引用的内容"),
              desc: p(
                "Content Studio turns your diagnosis into action: AI-powered blog posts, Amazon listings, and social copy optimized for GEO. Auto-publish on schedule. Track results.",
                "Content Studio 将诊断转化为行动：AI 驱动的博客文章、Amazon Listing 和社交文案，全部针对 GEO 优化。按计划自动发布，追踪效果。"
              ),
              color: "#22c55e",
              cta: { href: auditPath, label: p("Start with a free diagnosis →", "从免费诊断开始 →") },
            },
          ].map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-6 rounded-2xl p-7 transition-all duration-300 hover:[box-shadow:0_0_24px_rgba(0,0,0,0.4)]"
              style={{ background: "#0b0b14", border: `1px solid ${step.color}22` }}
            >
              {/* Number */}
              <div
                className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm"
                style={{ background: `${step.color}12`, color: step.color, border: `1px solid ${step.color}30`, fontFamily: "monospace" }}
              >
                {step.num}
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: step.color }}>
                  {step.phase}
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: "#f0f0f8" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>{step.desc}</p>
                {step.cta && (
                  <Link
                    href={step.cta.href}
                    className="inline-block mt-4 text-sm font-semibold transition-opacity hover:opacity-75"
                    style={{ color: step.color }}
                  >
                    {step.cta.label}
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          CASE STUDY
      ═══════════════════════════════════ */}
      <motion.section {...reveal}>
        <SectionBracket num="02" label={p("Case Study", "客户案例")} />
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "#0b0b14", border: "1px solid rgba(255,107,53,0.2)" }}
        >
          <div className="px-8 py-7">
            <h2 className="text-xl font-black mb-1" style={{ color: "#f0f0f8" }}>
              {p("DriveX: From AI Invisible to #2 Recommended", "DriveX：从 AI 隐形到第 2 位推荐")}
            </h2>
            <p className="text-sm" style={{ color: "#555580" }}>
              {p("Automotive accessories · Shopee SEA / Amazon US · 90-day program", "汽车配件 · Shopee 东南亚 / Amazon 美国 · 90 天计划")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px" style={{ background: "#25253f" }}>
            {[
              {
                brand: "JumpStart Pro",
                cat: p("Jump Starters", "汽车启动电源"),
                metric: p("High-Intent SOV", "高意图 SOV"),
                before: "0%", after: "23.7%",
                color: "#22c55e",
                note: p("AI rank: Not listed → #2", "AI 排名：未上榜 → 第 2 位"),
              },
              {
                brand: "MagDrive Pro",
                cat: p("Car Phone Mounts", "车载手机支架"),
                metric: p("Weighted SOV", "加权 SOV"),
                before: "0%", after: "7.8%",
                color: "#f5a623",
                note: p("Won PCMag Editor's Choice", "获 PCMag 编辑推荐"),
              },
              {
                brand: "DriveSafe Pro",
                cat: p("Dash Cameras", "行车记录仪"),
                metric: p("Weighted SOV", "加权 SOV"),
                before: "0%", after: "5.2%",
                color: "#ff4d6d",
                note: p("Root cause: Zero English reviews", "根因：零英文评测"),
              },
            ].map((item) => (
              <div key={item.brand} className="p-6" style={{ background: "#0b0b14" }}>
                <div className="text-sm font-bold mb-0.5" style={{ color: "#f0f0f8" }}>{item.brand}</div>
                <div className="text-xs mb-4" style={{ color: "#555580" }}>{item.cat}</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xs line-through" style={{ color: "#333355" }}>{item.before}</span>
                  <span className="text-2xl font-black" style={{ color: item.color }}>{item.after}</span>
                  <span className="text-xs" style={{ color: "#555580" }}>{item.metric}</span>
                </div>
                <div
                  className="text-xs px-2.5 py-1 rounded-lg inline-block"
                  style={{ background: `${item.color}10`, color: item.color, border: `1px solid ${item.color}20` }}
                >
                  {item.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          PRICING
      ═══════════════════════════════════ */}
      <motion.section {...reveal} id="pricing">
        <SectionBracket num="03" label={p("Pricing", "定价")} />
        <h2
          className="font-black mb-2 tracking-tight"
          style={{ fontSize: "clamp(1.8rem, 3vw, 2.2rem)", color: "#f0f0f8" }}
        >
          {p("Simple, transparent pricing", "简单透明的定价")}
        </h2>
        <p className="text-sm mb-10" style={{ color: "#7070a0" }}>
          {p("Start free. Scale when you see results.", "免费开始，见效后升级。")}
        </p>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            {
              name: p("Free", "免费版"),
              price: "$0",
              per: null,
              desc: p("One-time GEO diagnosis", "一次性 GEO 诊断"),
              highlight: false,
              features: [
                p("1 brand audit", "1 次品牌诊断"),
                p("GEO Score report", "GEO 评分报告"),
                p("Top 3 competitors", "前 3 名竞品对比"),
                p("Basic recommendations", "基础优化建议"),
              ],
              cta: p("Start Free →", "免费开始 →"),
              href: auditPath,
              external: false,
            },
            {
              name: p("Starter", "入门版"),
              price: "$49",
              per: p("/mo", "/月"),
              desc: p("Monthly monitoring", "每月监控"),
              highlight: false,
              features: [
                p("Weekly GEO scans", "每周 GEO 扫描"),
                p("4 AI engines tracked", "4 大 AI 引擎追踪"),
                p("Competitor benchmarking", "竞品基准对比"),
                p("Reddit + KOL signals", "Reddit + KOL 信号"),
                p("Email alerts", "邮件预警"),
              ],
              cta: p("Get Started →", "立即开始 →"),
              href: auditPath,
              external: false,
            },
            {
              name: p("Growth", "成长版"),
              price: "$149",
              per: p("/mo", "/月"),
              desc: p("Monitor + Execute", "监控 + 执行"),
              highlight: true,
              features: [
                p("Everything in Starter", "入门版全部功能"),
                p("Content Studio (50 posts/mo)", "Content Studio（50 篇/月）"),
                p("Auto-publish to social", "自动发布到社交平台"),
                p("GEO-scored Amazon listings", "Amazon Listing GEO 评分"),
                p("Priority support", "优先支持"),
              ],
              cta: p("Start Growth →", "开始成长版 →"),
              href: auditPath,
              external: false,
            },
            {
              name: p("Agency", "代理版"),
              price: "$799",
              per: p("/mo", "/月"),
              desc: p("Unlimited brands", "不限品牌数"),
              highlight: false,
              features: [
                p("Everything in Growth", "成长版全部功能"),
                p("Up to 20 brands", "最多 20 个品牌"),
                p("White-label reports", "白标报告"),
                p("API access", "API 接入"),
                p("Dedicated account manager", "专属客户经理"),
              ],
              cta: p("Book Demo →", "预约演示 →"),
              href: CALENDLY,
              external: true,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className="rounded-2xl p-6 flex flex-col transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: plan.highlight ? "linear-gradient(135deg, #140e08 0%, #0b0b14 100%)" : "#0b0b14",
                border: plan.highlight ? "1px solid rgba(255,107,53,0.45)" : "1px solid #25253f",
                boxShadow: plan.highlight ? "0 0 40px rgba(255,107,53,0.08)" : "none",
              }}
            >
              {plan.highlight && (
                <div
                  className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full self-start mb-4"
                  style={{ background: "rgba(255,107,53,0.15)", color: "#ff6b35" }}
                >
                  {p("Most Popular", "最受欢迎")}
                </div>
              )}
              <div className="font-bold text-sm mb-1" style={{ color: "#a0a0c8" }}>{plan.name}</div>
              <div className="flex items-baseline gap-0.5 mb-0.5">
                <span className="text-3xl font-black" style={{ color: plan.highlight ? "#ff6b35" : "#f0f0f8" }}>
                  {plan.price}
                </span>
                {plan.per && <span className="text-sm" style={{ color: "#555580" }}>{plan.per}</span>}
              </div>
              <div className="text-xs mb-5" style={{ color: "#555580" }}>{plan.desc}</div>
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#7070a0" }}>
                    <span style={{ color: "#22c55e", flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              {plan.external ? (
                <a
                  href={plan.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-center py-2.5 rounded-xl transition-opacity hover:opacity-80"
                  style={{ background: "#1e1e30", color: "#f0f0f8" }}
                >
                  {plan.cta}
                </a>
              ) : (
                <Link
                  href={plan.href}
                  className="text-sm font-semibold text-center py-2.5 rounded-xl transition-opacity hover:opacity-80"
                  style={
                    plan.highlight
                      ? { background: "#ff6b35", color: "#fff" }
                      : { background: "#161625", color: "#f0f0f8", border: "1px solid #25253f" }
                  }
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          FINAL CTA BANNER
      ═══════════════════════════════════ */}
      <motion.section {...reveal}>
        <div
          className="rounded-2xl p-12 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f0a06 0%, #0b0b14 60%, #060e0f 100%)",
            border: "1px solid rgba(255,107,53,0.25)",
          }}
        >
          {/* Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,107,53,0.12) 0%, transparent 60%)" }}
          />
          <div className="relative z-10">
            <div
              className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6"
              style={{ background: "rgba(255,107,53,0.1)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.3)" }}
            >
              {p("Free — No Credit Card Required", "免费 · 无需信用卡")}
            </div>
            <h2
              className="font-black mb-3 tracking-tight"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#f0f0f8" }}
            >
              {lang === "zh" ? (
                <>现在就知道你的位置<br /><span style={{ color: "#ff6b35" }}>在竞争对手之前。</span></>
              ) : (
                <>Find out where you stand<br /><span style={{ color: "#ff6b35" }}>before your competitors do.</span></>
              )}
            </h2>
            <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "#555580" }}>
              {p(
                "5-minute free GEO diagnosis. See your score across 4 AI engines instantly.",
                "5 分钟免费 GEO 诊断。立刻查看你在 4 大 AI 引擎中的评分。"
              )}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href={auditPath}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-sm font-black transition-all duration-300 hover:opacity-90 hover:translate-y-[-2px]"
                style={{
                  background: "#ff6b35",
                  color: "#fff",
                  boxShadow: "0 0 40px rgba(255,107,53,0.45)",
                  letterSpacing: "0.02em",
                }}
              >
                {p("Get Free GEO Diagnosis →", "免费诊断我的品牌 →")}
              </Link>
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-colors hover:text-white"
                style={{ color: "#555580" }}
              >
                {p("or book strategy call →", "或预约策略通话 →")}
              </a>
            </div>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
