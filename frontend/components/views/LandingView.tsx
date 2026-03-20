"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lang } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const CALENDLY = "https://calendly.com/brivesubscription/30min";
const MONO = `'JetBrains Mono','Fira Code','Cascadia Code','Courier New',monospace`;

interface Props { lang: Lang; }

/* ─── Typewriter hook ─── */
function useTypewriter(text: string, speed = 32, startDelay = 0) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    if (!text) return;
    const t0 = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setN(i);
        if (i >= text.length) clearInterval(iv);
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(t0);
  }, [text, speed, startDelay]);
  return { out: text.slice(0, n), done: n >= text.length && text.length > 0 };
}

/* ─── Terminal chrome ─── */
function Term({
  title,
  children,
  className = "",
  style: extraStyle,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        background: "#050508",
        border: "1px solid #1a1a2e",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.02)",
        ...extraStyle,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "10px 16px",
          borderBottom: "1px solid #111120",
          background: "#080810",
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div
            key={c}
            style={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: 0.85 }}
          />
        ))}
        <span style={{ fontFamily: MONO, fontSize: "12px", color: "#252540", marginLeft: "8px" }}>
          {title}
        </span>
      </div>
      {/* Body */}
      <div style={{ fontFamily: MONO, fontSize: "13px", lineHeight: "1.8", padding: "18px 20px" }}>
        {children}
      </div>
    </div>
  );
}

/* ─── CLI primitives ─── */
function Prompt({ cmd, cursor }: { cmd: string; cursor?: boolean }) {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
      <span style={{ color: "#ff6b35", userSelect: "none", flexShrink: 0 }}>$</span>
      <span style={{ color: "#e0e0f5" }}>
        {cmd}
        {cursor && (
          <span
            style={{ color: "#ff6b35", marginLeft: "1px", animation: "blink 1s step-end infinite" }}
          >
            ▋
          </span>
        )}
      </span>
    </div>
  );
}

function Out({
  children,
  color = "#555580",
  indent = true,
}: {
  children: React.ReactNode;
  color?: string;
  indent?: boolean;
}) {
  return (
    <div style={{ color, paddingLeft: indent ? "22px" : 0 }}>{children}</div>
  );
}

function Sep({ len = 46 }: { len?: number }) {
  return (
    <div style={{ color: "#181828", paddingLeft: "22px", userSelect: "none" }}>
      {"─".repeat(len)}
    </div>
  );
}

/* ─── Hero terminal (interactive scan) ─── */
function HeroTerminal({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [phase, setPhase] = useState<0 | 1 | 2>(0); // 0=wait 1=typing 2=result
  const inputRef = useRef<HTMLInputElement>(null);
  const p = (en: string, zh: string) => (lang === "zh" ? zh : en);

  const CMD = `avanti scan --brand "YourBrand" --engines all`;
  const { out: typedCmd, done: cmdDone } = useTypewriter(
    phase >= 1 ? CMD : "",
    28,
    0
  );

  // Start animation shortly after mount
  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 700);
    return () => clearTimeout(t);
  }, []);

  // Show result after typing finishes
  useEffect(() => {
    if (!cmdDone) return;
    const t = setTimeout(() => setPhase(2), 300);
    return () => clearTimeout(t);
  }, [cmdDone]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    const path = lang === "zh" ? "/zh/audit" : "/audit";
    router.push(brand.trim() ? `${path}?brand=${encodeURIComponent(brand.trim())}` : path);
  };

  const engines = [
    { e: "ChatGPT",    q: "0/10", sov: " 0%", c: "#ff4d6d" },
    { e: "Perplexity", q: "0/8",  sov: " 0%", c: "#ff4d6d" },
    { e: "Gemini",     q: "1/10", sov: " 2%", c: "#f5a623" },
    { e: "Claude",     q: "0/8",  sov: " 0%", c: "#ff4d6d" },
  ];

  return (
    <Term title="avanti — ai-visibility v2.1">
      <Prompt cmd={typedCmd} cursor={phase === 1 && !cmdDone} />

      {cmdDone && phase < 2 && (
        <Out color="#2a2a45">Connecting to AI engines...</Out>
      )}

      {phase === 2 && (
        <>
          <Out color="#2a2a45">Scanning 4 AI engines...</Out>
          <Sep />
          {engines.map((r) => (
            <Out key={r.e}>
              <span style={{ color: "#22c55e" }}>✓</span>{" "}
              <span style={{ color: "#888898", display: "inline-block", width: "92px" }}>{r.e}</span>
              <span style={{ color: "#2a2a45" }}>{r.q} queries   SOV: </span>
              <span style={{ color: r.c, fontWeight: "bold" }}>{r.sov}</span>
            </Out>
          ))}
          <Sep />
          <Out>
            <span style={{ color: "#3a3a5c" }}>GEO_SCORE  </span>
            <span style={{ color: "#ff4d6d", fontWeight: "bold" }}>34/100</span>
            <span style={{ color: "#ff4d6d" }}>  [CRITICAL]</span>
          </Out>
          <Out>
            <span style={{ color: "#3a3a5c" }}>TOP_RIVAL  </span>
            <span style={{ color: "#22c55e" }}>Anker 78/100</span>
            <span style={{ color: "#2a2a45" }}>  // gap: -44pts</span>
          </Out>
          <Out>
            <span style={{ color: "#3a3a5c" }}>NEXT_STEP  </span>
            <span style={{ color: "#f5a623" }}>$ avanti diagnose --find-root-causes</span>
          </Out>
          <Sep />
        </>
      )}

      {/* Live brand input */}
      <form onSubmit={handleScan} style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
        <span style={{ color: "#ff6b35", userSelect: "none", flexShrink: 0 }}>$</span>
        <span style={{ color: "#2a2a45", flexShrink: 0 }}>brand:</span>
        <input
          ref={inputRef}
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder={p("enter your brand name...", "输入品牌名...")}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#f0f0f8",
            caretColor: "#ff6b35",
            fontFamily: MONO,
            fontSize: "13px",
            minWidth: 0,
          }}
        />
        <button
          type="submit"
          style={{
            background: "#ff6b35",
            color: "#fff",
            border: "none",
            padding: "5px 14px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            fontFamily: MONO,
            flexShrink: 0,
            boxShadow: "0 0 16px rgba(255,107,53,0.4)",
          }}
        >
          → {p("Scan", "扫描")}
        </button>
      </form>
    </Term>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════ */
export default function LandingView({ lang: _lang }: Props) {
  const lang = _lang;
  const auditPath = lang === "zh" ? "/zh/audit" : "/audit";
  const p = (en: string, zh: string) => (lang === "zh" ? zh : en);

  return (
    <>
      {/* Blink animation */}
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div
        className="pb-32 max-w-5xl mx-auto"
        style={{ fontFamily: MONO }}
      >

        {/* ══════════════════════════════
            HERO
        ══════════════════════════════ */}
        <section className="pt-20 relative overflow-hidden">
          {/* Ambient glow */}
          <div
            style={{
              position: "absolute",
              top: "-60px",
              left: "25%",
              width: "650px",
              height: "420px",
              background: "radial-gradient(ellipse, rgba(255,107,53,0.11) 0%, transparent 70%)",
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />

          <div className="relative z-10 grid md:grid-cols-[52fr_48fr] gap-12 items-start">

            {/* ── Left: copy ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Comment line */}
              <div
                style={{
                  color: "#252540",
                  fontSize: "12px",
                  marginBottom: "18px",
                  letterSpacing: "0.05em",
                }}
              >
                {"// "}{p("the question every brand should be asking", "每个品牌都应该问的问题")}
              </div>

              {/* Pill badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: "999px",
                  marginBottom: "22px",
                  background: "rgba(255,107,53,0.07)",
                  color: "#ff6b35",
                  border: "1px solid rgba(255,107,53,0.18)",
                  letterSpacing: "0.12em",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "currentColor",
                    animation: "blink 2s step-end infinite",
                  }}
                />
                {p("AI VISIBILITY PLATFORM", "AI 可见度监控平台")}
              </div>

              {/* Headline */}
              <h1
                style={{
                  fontSize: "clamp(2.2rem, 4.5vw, 3.3rem)",
                  fontWeight: 900,
                  color: "#f0f0f8",
                  lineHeight: 1.08,
                  letterSpacing: "-0.025em",
                  marginBottom: "20px",
                }}
              >
                {p("Is your brand", "AI 在推荐")}
                <br />
                <span style={{ color: "#ff6b35" }}>
                  {p("visible to AI?", "你的品牌吗？")}
                </span>
              </h1>

              {/* Subtext */}
              <p
                style={{
                  color: "#6060a0",
                  fontSize: "15px",
                  lineHeight: 1.65,
                  marginBottom: "6px",
                  maxWidth: "440px",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {p(
                  "When buyers ask ChatGPT, Claude, or Gemini for product recommendations — is your brand in the answer?",
                  "当消费者向 ChatGPT、Claude、Gemini 询问产品推荐时——你的品牌出现在答案里了吗？"
                )}
              </p>
              <p style={{ color: "#252540", fontSize: "12px", marginBottom: "28px" }}>
                {"// "}{p(
                  "Avanti: measure → diagnose → fix AI visibility",
                  "Avanti: 量化 → 诊断 → 修复 AI 可见度"
                )}
              </p>

              {/* CLI CTA box */}
              <div
                style={{
                  background: "#080810",
                  border: "1px solid rgba(255,107,53,0.25)",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  marginBottom: "24px",
                  boxShadow: "0 0 28px rgba(255,107,53,0.06)",
                }}
              >
                <div style={{ color: "#1e1e35", fontSize: "11px", marginBottom: "10px" }}>
                  {"# "}{p("free GEO scan — no credit card required", "免费 GEO 扫描 · 无需信用卡")}
                </div>
                <Link
                  href={auditPath}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  <span style={{ color: "#ff6b35" }}>$</span>
                  <span style={{ color: "#3a3a5c" }}>avanti diagnose</span>
                  <span style={{ color: "#f5a623" }}>--brand</span>
                  <span
                    style={{
                      flex: 1,
                      borderBottom: "1px solid #1e1e30",
                      paddingBottom: "1px",
                      color: "#ff6b35",
                      animation: "blink 1s step-end infinite",
                    }}
                  >
                    ▋
                  </span>
                  <span
                    style={{
                      background: "#ff6b35",
                      color: "#fff",
                      padding: "6px 16px",
                      borderRadius: "7px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      boxShadow: "0 0 18px rgba(255,107,53,0.45)",
                      flexShrink: 0,
                    }}
                  >
                    {p("→ Start Free", "→ 免费开始")}
                  </span>
                </Link>
              </div>

              {/* Trust stats */}
              <div style={{ display: "flex", gap: "28px", flexWrap: "wrap" }}>
                {[
                  { k: "ai_engines",    v: "4" },
                  { k: "traffic_yoy",   v: "+693%" },
                  { k: "setup",         v: "5min" },
                ].map((s) => (
                  <div key={s.k}>
                    <div style={{ color: "#ff6b35", fontSize: "16px", fontWeight: 900 }}>{s.v}</div>
                    <div style={{ color: "#1e1e35", fontSize: "11px" }}>{s.k}</div>
                  </div>
                ))}
              </div>

              {/* Calendly link */}
              <div style={{ marginTop: "16px" }}>
                <a
                  href={CALENDLY}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2a2a45", fontSize: "12px", textDecoration: "none" }}
                >
                  {"// "}{p("or book a strategy call →", "或预约策略通话 →")}
                </a>
              </div>
            </motion.div>

            {/* ── Right: interactive terminal ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block"
            >
              <HeroTerminal lang={lang} />
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════
            MARKET INTELLIGENCE (stats)
        ══════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginTop: "80px" }}
        >
          <Term title="avanti market-intelligence --region global">
            <Prompt cmd="avanti market-intelligence --region global --year 2025" />
            <Out color="#252540"> </Out>
            <Out color="#252540">
              {"SIGNAL                           VALUE      NOTE"}
            </Out>
            <Sep len={60} />
            {[
              {
                k: "ai_shoppers_pct",
                v: "47%   ",
                c: "#ff4d6d",
                note: p("use AI for purchase decisions", "消费者已用 AI 辅助决策"),
              },
              {
                k: "ai_retail_traffic_yoy",
                v: "+693%",
                c: "#f5a623",
                note: p("Adobe Analytics Holiday Report 2025", "Adobe Analytics 2025 假日报告"),
              },
              {
                k: "brands_scoring_60_plus",
                v: "0/50 ",
                c: "#ff4d6d",
                note: p("on first audit (out of 50 tested)", "首次诊断中超 60 分的品牌数"),
              },
              {
                k: "conversion_lift_ai_rec",
                v: "3×    ",
                c: "#22c55e",
                note: p("higher conversion when AI names you", "AI 点名推荐时转化率提升"),
              },
            ].map((row) => (
              <Out key={row.k}>
                <span style={{ color: "#3a3a5c", display: "inline-block", width: "210px" }}>
                  {row.k}
                </span>
                <span style={{ color: row.c, fontWeight: "bold", display: "inline-block", width: "65px" }}>
                  {row.v}
                </span>
                <span style={{ color: "#1e1e35" }}>{"// "}{row.note}</span>
              </Out>
            ))}
            <Sep len={60} />
            <Out color="#1a1a2e">
              {"// "}{p("Source: Adobe Analytics, Avanti internal data", "数据来源：Adobe Analytics + Avanti 内部数据")}
            </Out>
          </Term>
        </motion.section>

        {/* ══════════════════════════════
            HOW IT WORKS
        ══════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginTop: "80px" }}
        >
          <div style={{ color: "#252540", fontSize: "12px", marginBottom: "20px" }}>
            {"// "}{p("section_01 — how avanti works", "第 01 节 — Avanti 如何工作")}
          </div>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 900,
              color: "#f0f0f8",
              letterSpacing: "-0.02em",
              marginBottom: "32px",
              lineHeight: 1.1,
            }}
          >
            <span style={{ color: "#ff6b35" }}>{p("Measure.", "量化。")}</span>
            {" "}{p("Diagnose.", "诊断。")}
            {" "}<span style={{ color: "#22c55e" }}>{p("Execute.", "执行。")}</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                num: "01",
                cmd: "avanti measure",
                color: "#ff6b35",
                outputs: [
                  { k: "GEO_SCORE",    v: "0–100 scale",    c: "#ff6b35" },
                  { k: "SHARE_OF_VOICE", v: "vs competitors", c: "#f5a623" },
                  { k: "ENGINES",      v: "ChatGPT/Claude/Gemini/Perplexity", c: "#555580" },
                  { k: "ARRS",         v: "avg recommendation rank", c: "#555580" },
                ],
                cta: { href: auditPath, label: p("→ Run free scan", "→ 免费扫描") },
              },
              {
                num: "02",
                cmd: "avanti diagnose",
                color: "#f5a623",
                outputs: [
                  { k: "REDDIT",   v: "citation audit",         c: "#f5a623" },
                  { k: "KOL",      v: "YouTube/TikTok coverage", c: "#555580" },
                  { k: "LISTING",  v: "Amazon GEO score",        c: "#555580" },
                  { k: "EEAT",     v: "authority check",         c: "#555580" },
                  { k: "HALLUC",   v: "hallucination detection",  c: "#ff4d6d" },
                ],
                cta: null,
              },
              {
                num: "03",
                cmd: "avanti execute",
                color: "#22c55e",
                outputs: [
                  { k: "BLOG",     v: "AI-optimized articles",   c: "#22c55e" },
                  { k: "LISTING",  v: "Amazon rewrite",          c: "#555580" },
                  { k: "SOCIAL",   v: "GEO-ready copy",          c: "#555580" },
                  { k: "FAQ",      v: "schema page generator",   c: "#555580" },
                ],
                cta: { href: auditPath, label: p("→ Start Content Studio", "→ 打开内容工作室") },
              },
            ].map((step) => (
              <Term key={step.num} title={`[${step.num}]`}>
                <Prompt cmd={step.cmd} />
                <Sep len={34} />
                {step.outputs.map((o) => (
                  <Out key={o.k}>
                    <span style={{ color: "#252540", display: "inline-block", width: "64px" }}>
                      {o.k}
                    </span>
                    <span style={{ color: o.c }}> {o.v}</span>
                  </Out>
                ))}
                {step.cta && (
                  <>
                    <Sep len={34} />
                    <Out>
                      <Link
                        href={step.cta.href}
                        style={{ color: step.color, textDecoration: "none", fontWeight: "bold" }}
                      >
                        {step.cta.label}
                      </Link>
                    </Out>
                  </>
                )}
              </Term>
            ))}
          </div>
        </motion.section>

        {/* ══════════════════════════════
            CASE STUDY
        ══════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginTop: "80px" }}
        >
          <div style={{ color: "#252540", fontSize: "12px", marginBottom: "20px" }}>
            {"// "}{p("section_02 — case study", "第 02 节 — 客户案例")}
          </div>

          <Term title="avanti case-study --client DriveX --period 90d">
            <Prompt cmd="avanti case-study --client DriveX --category automotive --period 90d" />
            <Out color="#252540"> </Out>
            <Out color="#252540">
              {"BRAND           CATEGORY        METRIC        BEFORE    AFTER"}
            </Out>
            <Sep len={72} />
            {[
              {
                brand: "JumpStart Pro",
                cat: p("Jump Starters", "汽车启动电源"),
                metric: p("High-Intent SOV", "高意图 SOV"),
                before: "0%",
                after: "23.7%",
                c: "#22c55e",
                note: p("AI rank: unlisted → #2", "AI 排名：未上榜 → 第 2 位"),
              },
              {
                brand: "MagDrive Pro",
                cat: p("Phone Mounts", "车载手机支架"),
                metric: p("Weighted SOV", "加权 SOV"),
                before: "0%",
                after: "7.8%",
                c: "#f5a623",
                note: p("Won PCMag Editor's Choice", "获 PCMag 编辑推荐"),
              },
              {
                brand: "DriveSafe Pro",
                cat: p("Dash Cameras", "行车记录仪"),
                metric: p("Weighted SOV", "加权 SOV"),
                before: "0%",
                after: "5.2%",
                c: "#ff4d6d",
                note: p("Root cause: zero English reviews", "根因：零英文评测"),
              },
            ].map((row) => (
              <Out key={row.brand}>
                <span style={{ color: "#888898", display: "inline-block", width: "136px" }}>{row.brand}</span>
                <span style={{ color: "#3a3a5c", display: "inline-block", width: "120px" }}>{row.cat}</span>
                <span style={{ color: "#3a3a5c", display: "inline-block", width: "112px" }}>{row.metric}</span>
                <span style={{ color: "#2a2a45", display: "inline-block", width: "56px" }}>{row.before}</span>
                <span style={{ color: row.c, fontWeight: "bold", display: "inline-block", width: "64px" }}>{row.after}</span>
                <span style={{ color: "#1a1a2e" }}>{"// "}{row.note}</span>
              </Out>
            ))}
            <Sep len={72} />
            <Out color="#1a1a2e">
              exit_code {"0"} {"  // "}{p("program completed successfully in 90 days", "计划 90 天内成功完成")}
            </Out>
          </Term>
        </motion.section>

        {/* ══════════════════════════════
            PRICING
        ══════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginTop: "80px" }}
          id="pricing"
        >
          <div style={{ color: "#252540", fontSize: "12px", marginBottom: "20px" }}>
            {"// "}{p("section_03 — pricing", "第 03 节 — 定价")}
          </div>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.2rem)",
              fontWeight: 900,
              color: "#f0f0f8",
              letterSpacing: "-0.02em",
              marginBottom: "6px",
            }}
          >
            {p("Simple, transparent pricing", "简单透明的定价")}
          </h2>
          <p style={{ color: "#3a3a5c", fontSize: "13px", marginBottom: "28px" }}>
            {"// "}{p("start free. scale when you see results.", "免费开始，见效后升级。")}
          </p>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                name: p("free", "free"),
                price: "$0",
                per: null,
                badge: null,
                highlight: false,
                flags: [
                  "--scans 2/month",
                  "--exec-credits 50",
                  "--geo-score",
                  "--competitor-compare",
                ],
                cta: p("→ Start Free", "→ 免费开始"),
                href: auditPath,
                external: false,
              },
              {
                name: p("starter", "starter"),
                price: "$49",
                per: p("/mo", "/月"),
                badge: null,
                highlight: false,
                flags: [
                  "--scans unlimited",
                  "--exec-credits 300/mo",
                  "--engines 4",
                  "--reddit --kol",
                  "--hallucination-check",
                ],
                cta: p("→ Get Starter", "→ 立即开始"),
                href: auditPath,
                external: false,
              },
              {
                name: p("growth", "growth"),
                price: "$149",
                per: p("/mo", "/月"),
                badge: p("most popular", "最受欢迎"),
                highlight: true,
                flags: [
                  "--scans unlimited",
                  "--exec-credits 1500/mo",
                  "--content-studio",
                  "--amazon-listing-geo",
                  "--credits-rollover",
                ],
                cta: p("→ Start Growth", "→ 开始成长版"),
                href: auditPath,
                external: false,
              },
              {
                name: p("agency", "agency"),
                price: "$799",
                per: p("/mo", "/月"),
                badge: null,
                highlight: false,
                flags: [
                  "--brands 20",
                  "--exec-credits unlimited",
                  "--white-label",
                  "--api-access",
                  "--account-manager",
                ],
                cta: p("→ Book Demo", "→ 预约演示"),
                href: CALENDLY,
                external: true,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                style={{
                  background: plan.highlight
                    ? "linear-gradient(135deg, #0e0a06 0%, #080810 100%)"
                    : "#050508",
                  border: plan.highlight
                    ? "1px solid rgba(255,107,53,0.4)"
                    : "1px solid #1a1a2e",
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: MONO,
                  fontSize: "12px",
                  boxShadow: plan.highlight ? "0 0 40px rgba(255,107,53,0.07)" : "none",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {plan.badge && (
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: "#ff6b35",
                      marginBottom: "10px",
                    }}
                  >
                    {"# "}{plan.badge}
                  </div>
                )}
                <div style={{ color: "#555580", marginBottom: "4px" }}>
                  avanti {plan.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "3px", marginBottom: "18px" }}>
                  <span
                    style={{
                      fontSize: "28px",
                      fontWeight: 900,
                      color: plan.highlight ? "#ff6b35" : "#f0f0f8",
                    }}
                  >
                    {plan.price}
                  </span>
                  {plan.per && (
                    <span style={{ color: "#3a3a5c", fontSize: "12px" }}>{plan.per}</span>
                  )}
                </div>

                <div style={{ flex: 1, marginBottom: "16px" }}>
                  {plan.flags.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "5px" }}>
                      <span style={{ color: "#22c55e", flexShrink: 0 }}>✓</span>
                      <span style={{ color: "#3a3a5c" }}>{f}</span>
                    </div>
                  ))}
                </div>

                {plan.external ? (
                  <a
                    href={plan.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "9px",
                      borderRadius: "7px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      fontFamily: MONO,
                      textDecoration: "none",
                      background: "#1a1a2e",
                      color: "#f0f0f8",
                    }}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <Link
                    href={plan.href}
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "9px",
                      borderRadius: "7px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      fontFamily: MONO,
                      textDecoration: "none",
                      ...(plan.highlight
                        ? { background: "#ff6b35", color: "#fff", boxShadow: "0 0 20px rgba(255,107,53,0.35)" }
                        : { background: "#111120", color: "#f0f0f8", border: "1px solid #1a1a2e" }),
                    }}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Credits explainer */}
          <div
            style={{
              marginTop: "16px",
              background: "#050508",
              border: "1px solid #1a1a2e",
              borderRadius: "10px",
              padding: "14px 18px",
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "#ff6b35", fontWeight: 700, flexShrink: 0, fontSize: "11px", letterSpacing: "0.1em" }}>
              EXEC_CREDITS
            </span>
            <span style={{ color: "#2a2a45", fontSize: "12px", flex: 1, lineHeight: 1.6 }}>
              {"// "}{p(
                "scans and diagnostics are always free — credits only consumed when generating content. 1 piece = 10 credits.",
                "扫描和诊断工具永远免费——只有生成内容时才消耗 credits。1 篇 = 10 credits。"
              )}
            </span>
            <div style={{ display: "flex", gap: "20px", flexShrink: 0, flexWrap: "wrap" }}>
              {[
                { a: p("blog", "博客"), c: "10" },
                { a: p("amazon", "listing"), c: "10" },
                { a: p("reddit", "reddit"), c: "3" },
                { a: "faq", c: "5" },
              ].map((item) => (
                <div key={item.a} style={{ textAlign: "center" }}>
                  <div style={{ color: "#f0f0f8", fontSize: "13px", fontWeight: 900 }}>{item.c}</div>
                  <div style={{ color: "#1e1e35", fontSize: "10px" }}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ══════════════════════════════
            FINAL CTA
        ══════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginTop: "80px" }}
        >
          <Term
            title="avanti — ready to start"
            style={{ border: "1px solid rgba(255,107,53,0.2)", boxShadow: "0 0 60px rgba(255,107,53,0.06), 0 24px 64px rgba(0,0,0,0.7)" }}
          >
            {/* Comment header */}
            <Out color="#1a1a2e">
              {"/*"}
            </Out>
            <Out color="#1e1e35">
              {"  "}{p("Find out where you stand before your competitors do.", "在竞争对手之前了解你的位置。")}
            </Out>
            <Out color="#1e1e35">
              {"  "}{p("5-minute free GEO scan — no credit card required.", "5 分钟免费 GEO 扫描 · 无需信用卡。")}
            </Out>
            <Out color="#1a1a2e">{"  */"}</Out>
            <Out color="#252540"> </Out>

            <Prompt cmd="avanti diagnose --free --no-credit-card-required" />
            <Out color="#252540"> </Out>

            {/* Input row */}
            <div style={{ paddingLeft: "22px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ color: "#3a3a5c" }}>--brand</span>
              <Link
                href={auditPath}
                style={{
                  flex: 1,
                  minWidth: "180px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  textDecoration: "none",
                  background: "#080812",
                  border: "1px solid rgba(255,107,53,0.2)",
                  borderRadius: "8px",
                  padding: "10px 16px",
                }}
              >
                <span style={{ color: "#1e1e35", flex: 1 }}>
                  {p("\"YourBrand\"", "\"品牌名\"")}
                </span>
                <span
                  style={{
                    background: "#ff6b35",
                    color: "#fff",
                    padding: "7px 20px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: "bold",
                    flexShrink: 0,
                    boxShadow: "0 0 24px rgba(255,107,53,0.5)",
                  }}
                >
                  {p("→ Get Free GEO Score", "→ 免费获取 GEO 评分")}
                </span>
              </Link>
            </div>

            <Out color="#252540"> </Out>
            <Out color="#1a1a2e">
              {"// "}{p("or book a strategy call: ", "或预约策略通话：")}
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#252545", textDecoration: "none" }}
              >
                {CALENDLY.replace("https://", "")}
              </a>
            </Out>
          </Term>
        </motion.section>

      </div>
    </>
  );
}
