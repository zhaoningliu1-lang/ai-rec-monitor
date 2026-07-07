"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lang } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useState, useRef } from "react";

const CALENDLY = "https://cal.com/johnson-liu-avanti/30min";
const MONO = `'JetBrains Mono','Fira Code','Cascadia Code','Courier New',monospace`;

interface Props { lang: Lang; }

/* ─── Terminal chrome (for lower sections) ─── */
function Term({ title, children, style: s }: {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      background: "#050508",
      border: "1px solid #1a1a2e",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
      ...s,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "6px",
        padding: "10px 16px", borderBottom: "1px solid #111120", background: "#080810",
      }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: 0.85 }} />
        ))}
        <span style={{ fontFamily: MONO, fontSize: "12px", color: "#252540", marginLeft: "8px" }}>{title}</span>
      </div>
      <div style={{ fontFamily: MONO, fontSize: "13px", lineHeight: "1.8", padding: "18px 20px" }}>
        {children}
      </div>
    </div>
  );
}

const TPrompt = ({ cmd }: { cmd: string }) => (
  <div style={{ display: "flex", gap: "10px" }}>
    <span style={{ color: "#ff6b35", userSelect: "none" }}>$</span>
    <span style={{ color: "#e0e0f5" }}>{cmd}</span>
  </div>
);

const TOut = ({ children, color = "#555580" }: { children: React.ReactNode; color?: string }) => (
  <div style={{ color, paddingLeft: "22px" }}>{children}</div>
);

const TSep = ({ len = 46 }: { len?: number }) => (
  <div style={{ color: "#181828", paddingLeft: "22px" }}>{"─".repeat(len)}</div>
);

/* ═══════════════════════════════════════
   MAIN
═══════════════════════════════════════ */
export default function LandingView({ lang: _lang }: Props) {
  const lang = _lang;
  const router = useRouter();
  const auditPath = lang === "zh" ? "/zh/audit" : "/audit";
  const p = (en: string, zh: string) => lang === "zh" ? zh : en;

  const [brand, setBrand] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(brand.trim() ? `${auditPath}?brand=${encodeURIComponent(brand.trim())}` : auditPath);
  };

  return (
    <>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .scan-input::placeholder { color: #252545; }
        .scan-input:focus { outline: none; }
        .scan-wrap { transition: border-color 0.2s, box-shadow 0.2s; }
        .scan-wrap:focus-within {
          border-color: rgba(255,107,53,0.55) !important;
          box-shadow: 0 0 0 4px rgba(255,107,53,0.08), 0 0 60px rgba(255,107,53,0.15) !important;
        }
        .scan-btn { transition: opacity 0.15s, transform 0.15s; }
        .scan-btn:hover { opacity: 0.88; transform: translateX(2px); }
      `}</style>

      {/* ═══════════════════════════════════
          HERO — full-viewport, centered
      ═══════════════════════════════════ */}
      <section style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        padding: "60px 24px 80px",
        marginTop: "-32px", // cancel layout py-8
      }}>

        {/* Grid texture */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
          pointerEvents: "none",
          WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 40%, black 20%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 90% 90% at 50% 40%, black 20%, transparent 100%)",
        }} />

        {/* Ambient glow */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "500px",
          background: "radial-gradient(ellipse, rgba(255,107,53,0.1) 0%, transparent 65%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }} />

        <div className="relative z-10" style={{ width: "100%", maxWidth: "760px" }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.13em",
              padding: "5px 14px", borderRadius: "999px", marginBottom: "28px",
              background: "rgba(255,107,53,0.07)",
              color: "#ff6b35",
              border: "1px solid rgba(255,107,53,0.18)",
              fontFamily: MONO,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", animation: "blink 2s step-end infinite" }} />
            {p("AI VISIBILITY PLATFORM", "AI 可见度监控平台")}
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            style={{
              fontSize: "clamp(3rem, 7vw, 5.2rem)",
              fontWeight: 900,
              color: "#f0f0f8",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              marginBottom: "20px",
            }}
          >
            {p("Is your brand", "AI 在推荐")}<br />
            <span style={{ color: "#ff6b35" }}>{p("visible to AI?", "你的品牌吗？")}</span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              color: "#4a4a70",
              fontSize: "clamp(15px, 2vw, 18px)",
              lineHeight: 1.6,
              marginBottom: "40px",
              maxWidth: "520px",
              margin: "0 auto 40px",
              fontFamily: "system-ui,-apple-system,sans-serif",
            }}
          >
            {p(
              "When buyers ask ChatGPT, Claude, or Gemini — is your brand in the answer?",
              "当消费者向 ChatGPT、Claude、Gemini 询问推荐时——你的品牌出现了吗？"
            )}
          </motion.p>

          {/* ── BIG CENTERED INPUT ── */}
          <motion.form
            onSubmit={handleScan}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            style={{ width: "100%" }}
          >
            <div
              className="scan-wrap"
              style={{
                background: "#07070f",
                border: "1px solid rgba(255,107,53,0.28)",
                borderRadius: "14px",
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                boxShadow: "0 0 50px rgba(255,107,53,0.08), inset 0 1px 0 rgba(255,255,255,0.025)",
                cursor: "text",
              }}
              onClick={() => inputRef.current?.focus()}
            >
              {/* Prompt prefix */}
              <span style={{ color: "#ff6b35", fontFamily: MONO, fontSize: "18px", userSelect: "none", flexShrink: 0 }}>$</span>
              <span style={{ color: "#222238", fontFamily: MONO, fontSize: "14px", flexShrink: 0, whiteSpace: "nowrap" }}>
                avanti scan --brand
              </span>

              {/* Input */}
              <input
                ref={inputRef}
                className="scan-input"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder={p("enter brand name or website...", "输入品牌名或官网...")}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "#f0f0f8",
                  caretColor: "#ff6b35",
                  fontFamily: MONO,
                  fontSize: "16px",
                  minWidth: 0,
                }}
              />

              {/* Submit */}
              <button
                type="submit"
                className="scan-btn"
                style={{
                  background: "#ff6b35",
                  color: "#fff",
                  border: "none",
                  padding: "11px 24px",
                  borderRadius: "9px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontFamily: MONO,
                  flexShrink: 0,
                  boxShadow: "0 0 28px rgba(255,107,53,0.45)",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.02em",
                }}
              >
                → {p("Scan My Brand", "扫描品牌")}
              </button>
            </div>
          </motion.form>

          {/* Dot indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            style={{
              display: "flex",
              gap: "28px",
              marginTop: "18px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              p("4 AI engines", "4 大 AI 引擎"),
              p("free to start", "免费开始"),
              p("5min setup", "5 分钟配置"),
            ].map((label) => (
              <span
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#252545",
                  fontSize: "12px",
                  fontFamily: MONO,
                }}
              >
                <span style={{ color: "#ff6b35", fontSize: "8px" }}>●</span>
                {label}
              </span>
            ))}
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            style={{ marginTop: "56px", color: "#161625", fontSize: "11px", fontFamily: MONO }}
          >
            ↓ &nbsp; {p("proven results · how it works", "真实案例 · 工作原理")}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          PROVEN RESULTS
      ═══════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 72px", fontFamily: MONO }}
      >
        <div style={{ color: "#1e1e35", fontSize: "12px", marginBottom: "16px" }}>
          {"// "}{p("02 — proven results, real clients", "02 — 真实客户，可验证的成果")}
        </div>
        <h2 style={{
          fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
          fontWeight: 900, color: "#f0f0f8",
          letterSpacing: "-0.02em", marginBottom: "24px",
        }}>
          {p("What we found. What we fixed.", "我们发现了什么，我们解决了什么。")}
        </h2>

        <Term title="avanti scan --brand Jellyfish --category engineering-analytics">
          <TPrompt cmd={`avanti scan --brand Jellyfish --engines chatgpt,claude,perplexity,gemini`} />
          <TOut color="#1e1e35"> </TOut>
          <TOut color="#1e1e35">{"ENGINE          QUERY                          BRAND APPEARS   COMPETITOR"}</TOut>
          <TSep len={64} />
          {[
            { engine: "ChatGPT",    query: p("best engineering analytics","最佳工程分析平台"),  appears: false, competitor: "LinearB" },
            { engine: "Claude",     query: p("engineering intelligence tool","工程智能工具"),    appears: false, competitor: "Allstacks" },
            { engine: "Perplexity", query: p("DORA metrics platform","DORA 指标平台"),          appears: false, competitor: "Milestone" },
            { engine: "Gemini",     query: p("dev productivity analytics","开发效能分析"),      appears: false, competitor: "Waydev" },
          ].map((r) => (
            <TOut key={r.engine}>
              <span style={{ color: "#888898", display: "inline-block", width: "120px" }}>{r.engine}</span>
              <span style={{ color: "#2a2a45", display: "inline-block", width: "200px" }}>{r.query}</span>
              <span style={{ color: "#ff4d6d", fontWeight: "bold", display: "inline-block", width: "80px" }}>✗ missing</span>
              <span style={{ color: "#181828" }}>{"// "}{r.competitor}{p(" ranked instead"," 占据位置")}</span>
            </TOut>
          ))}
          <TSep len={64} />
          <TOut color="#ff6b35">{"GEO_SCORE: 0 / 100  // invisible across all 4 engines"}</TOut>
          <TOut color="#181828">{"→ "}{p("action plan generated: 8 steps to first citation","行动方案：8 步获得首次 AI 引用")}</TOut>
        </Term>
      </motion.section>

      {/* ═══════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 72px", fontFamily: MONO }}
      >
        <div style={{ color: "#1e1e35", fontSize: "12px", marginBottom: "16px" }}>
          {"// "}{p("03 — how it works", "03 — 工作原理")}
        </div>
        <h2 style={{
          fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
          fontWeight: 900, color: "#f0f0f8",
          letterSpacing: "-0.02em", marginBottom: "24px",
        }}>
          <span style={{ color: "#ff6b35" }}>{p("Measure.", "量化。")}</span>
          {" "}{p("Diagnose.", "诊断。")}
          {" "}<span style={{ color: "#22c55e" }}>{p("Execute.", "执行。")}</span>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
          {[
            {
              num: "01", cmd: "avanti measure", color: "#ff6b35",
              outputs: [
                { k: "GEO_SCORE",      v: p("0–100 scale","0–100 评分"),    c: "#ff6b35" },
                { k: "SHARE_OF_VOICE", v: p("vs competitors","对比竞品"),   c: "#f5a623" },
                { k: "ENGINES",        v: "ChatGPT · Claude · Gemini · Perplexity", c: "#555580" },
              ],
              cta: { href: auditPath, label: p("→ Run free scan", "→ 免费扫描") },
            },
            {
              num: "02", cmd: "avanti diagnose", color: "#f5a623",
              outputs: [
                { k: "REDDIT",   v: p("citation audit","引用审计"),            c: "#f5a623" },
                { k: "KOL",      v: p("YouTube / TikTok coverage","KOL 覆盖"), c: "#555580" },
                { k: "LISTING",  v: p("Amazon GEO score","Amazon 评分"),      c: "#555580" },
                { k: "HALLUC",   v: p("hallucination check","幻觉检测"),       c: "#ff4d6d" },
              ],
              cta: null,
            },
            {
              num: "03", cmd: "avanti execute", color: "#22c55e",
              outputs: [
                { k: "BLOG",    v: p("AI-optimized articles","AI 优化文章"),     c: "#22c55e" },
                { k: "LISTING", v: p("Amazon GEO rewrite","Amazon 改写"),       c: "#555580" },
                { k: "FAQ",     v: p("schema page generator","FAQ Schema"),     c: "#555580" },
              ],
              cta: { href: auditPath, label: p("→ Content Studio", "→ 内容工作室") },
            },
          ].map((step) => (
            <Term key={step.num} title={`[${step.num}]`}>
              <TPrompt cmd={step.cmd} />
              <TSep len={34} />
              {step.outputs.map((o) => (
                <TOut key={o.k}>
                  <span style={{ color: "#1e1e35", display: "inline-block", width: "64px" }}>{o.k}</span>
                  <span style={{ color: o.c }}> {o.v}</span>
                </TOut>
              ))}
              {step.cta && (
                <>
                  <TSep len={34} />
                  <TOut>
                    <Link href={step.cta.href} style={{ color: step.color, textDecoration: "none", fontWeight: "bold" }}>
                      {step.cta.label}
                    </Link>
                  </TOut>
                </>
              )}
            </Term>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 80px", fontFamily: MONO }}
      >
        <Term
          title="avanti — ready to start"
          style={{ border: "1px solid rgba(255,107,53,0.18)", boxShadow: "0 0 50px rgba(255,107,53,0.05), 0 20px 60px rgba(0,0,0,0.7)" }}
        >
          <TOut color="#181828">{"/*"}</TOut>
          <TOut color="#1e1e35">{"  "}{p("Find out where you stand before your competitors do.", "在竞争对手之前了解你的 AI 可见度。")}</TOut>
          <TOut color="#181828">{"  */"}</TOut>
          <TOut color="#1e1e35"> </TOut>
          <TPrompt cmd="avanti scan --free --no-credit-card-required" />
          <TOut color="#1e1e35"> </TOut>
          <div style={{ paddingLeft: "22px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ color: "#2a2a45" }}>--brand</span>
            <Link
              href={auditPath}
              style={{
                flex: 1, minWidth: "180px",
                display: "flex", alignItems: "center", gap: "10px",
                textDecoration: "none",
                background: "#080812",
                border: "1px solid rgba(255,107,53,0.18)",
                borderRadius: "8px",
                padding: "10px 16px",
              }}
            >
              <span style={{ color: "#1e1e35", flex: 1, fontFamily: MONO, fontSize: "13px" }}>
                {p('"YourBrand"', '"品牌名"')}
              </span>
              <span style={{
                background: "#ff6b35", color: "#fff",
                padding: "7px 20px", borderRadius: "6px",
                fontSize: "13px", fontWeight: "bold", flexShrink: 0,
                boxShadow: "0 0 24px rgba(255,107,53,0.5)",
              }}>
                {p("→ Get Free GEO Score", "→ 免费获取 GEO 评分")}
              </span>
            </Link>
          </div>
          <TOut color="#1e1e35"> </TOut>
          <TOut color="#181828">
            {"// "}{p("or: ", "或: ")}
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={{ color: "#252545", textDecoration: "none" }}>
              {p("book a strategy call →", "预约策略通话 →")}
            </a>
          </TOut>
        </Term>
      </motion.section>
    </>
  );
}
