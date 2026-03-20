"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lang } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const CALENDLY = "https://calendly.com/brivesubscription/30min";
const MONO = `'JetBrains Mono','Fira Code','Cascadia Code','Courier New',monospace`;

interface Props { lang: Lang; }

/* ─── Typewriter ─── */
function useTypewriter(text: string, speed = 30, delay = 0) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    if (!text) return;
    const t = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => { i++; setN(i); if (i >= text.length) clearInterval(iv); }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, speed, delay]);
  return { out: text.slice(0, n), done: n >= text.length && text.length > 0 };
}

/* ─── Terminal chrome ─── */
function Term({ title, children, style: s }: { title: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#050508", border: "1px solid #1a1a2e", borderRadius: "12px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.7)", ...s }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderBottom: "1px solid #111120", background: "#080810" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: 0.85 }} />
        ))}
        <span style={{ fontFamily: MONO, fontSize: "12px", color: "#252540", marginLeft: "8px" }}>{title}</span>
      </div>
      <div style={{ fontFamily: MONO, fontSize: "13px", lineHeight: "1.8", padding: "18px 20px" }}>{children}</div>
    </div>
  );
}

const $ = ({ cmd, cursor }: { cmd: string; cursor?: boolean }) => (
  <div style={{ display: "flex", gap: "10px" }}>
    <span style={{ color: "#ff6b35", userSelect: "none" }}>$</span>
    <span style={{ color: "#e0e0f5" }}>
      {cmd}{cursor && <span style={{ color: "#ff6b35", animation: "blink 1s step-end infinite" }}>▋</span>}
    </span>
  </div>
);

const Out = ({ children, color = "#555580" }: { children: React.ReactNode; color?: string }) => (
  <div style={{ color, paddingLeft: "22px" }}>{children}</div>
);

const Sep = ({ len = 46 }: { len?: number }) => (
  <div style={{ color: "#181828", paddingLeft: "22px" }}>{"─".repeat(len)}</div>
);

/* ─── Hero Terminal ─── */
function HeroTerminal({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const p = (en: string, zh: string) => lang === "zh" ? zh : en;

  const CMD = `avanti scan --brand "YourBrand" --engines all`;
  const { out: typed, done } = useTypewriter(phase >= 1 ? CMD : "", 28, 0);

  useEffect(() => { const t = setTimeout(() => setPhase(1), 600); return () => clearTimeout(t); }, []);
  useEffect(() => { if (!done) return; const t = setTimeout(() => setPhase(2), 300); return () => clearTimeout(t); }, [done]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    const path = lang === "zh" ? "/zh/audit" : "/audit";
    router.push(brand.trim() ? `${path}?brand=${encodeURIComponent(brand.trim())}` : path);
  };

  return (
    <Term title="avanti — ai-visibility v2.1">
      <$ cmd={typed} cursor={phase === 1 && !done} />
      {phase === 2 && (
        <>
          <Out color="#2a2a45">Scanning 4 AI engines...</Out>
          <Sep />
          {[
            { e: "ChatGPT",    q: "0/10", sov: " 0%", c: "#ff4d6d" },
            { e: "Perplexity", q: "0/8",  sov: " 0%", c: "#ff4d6d" },
            { e: "Gemini",     q: "1/10", sov: " 2%", c: "#f5a623" },
            { e: "Claude",     q: "0/8",  sov: " 0%", c: "#ff4d6d" },
          ].map((r) => (
            <Out key={r.e}>
              <span style={{ color: "#22c55e" }}>✓</span>{" "}
              <span style={{ color: "#888898", display: "inline-block", width: "92px" }}>{r.e}</span>
              <span style={{ color: "#2a2a45" }}>{r.q} queries   SOV: </span>
              <span style={{ color: r.c, fontWeight: "bold" }}>{r.sov}</span>
            </Out>
          ))}
          <Sep />
          <Out><span style={{ color: "#3a3a5c" }}>GEO_SCORE  </span><span style={{ color: "#ff4d6d", fontWeight: "bold" }}>34/100</span><span style={{ color: "#ff4d6d" }}>  [CRITICAL]</span></Out>
          <Out><span style={{ color: "#3a3a5c" }}>TOP_RIVAL  </span><span style={{ color: "#22c55e" }}>Anker 78/100</span><span style={{ color: "#2a2a45" }}>  // gap: -44pts</span></Out>
          <Out><span style={{ color: "#3a3a5c" }}>NEXT_STEP  </span><span style={{ color: "#f5a623" }}>$ avanti diagnose --find-root-causes</span></Out>
          <Sep />
        </>
      )}
      <form onSubmit={handleScan} style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
        <span style={{ color: "#ff6b35", userSelect: "none", flexShrink: 0 }}>$</span>
        <span style={{ color: "#2a2a45", flexShrink: 0 }}>brand:</span>
        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder={p("enter your brand name...", "输入品牌名...")}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#f0f0f8", caretColor: "#ff6b35", fontFamily: MONO, fontSize: "13px", minWidth: 0 }}
        />
        <button type="submit" style={{ background: "#ff6b35", color: "#fff", border: "none", padding: "5px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", fontFamily: MONO, flexShrink: 0, boxShadow: "0 0 16px rgba(255,107,53,0.4)" }}>
          → {p("Scan", "扫描")}
        </button>
      </form>
    </Term>
  );
}

/* ═══════════════════════════════════════
   MAIN
═══════════════════════════════════════ */
export default function LandingView({ lang: _lang }: Props) {
  const lang = _lang;
  const auditPath = lang === "zh" ? "/zh/audit" : "/audit";
  const p = (en: string, zh: string) => lang === "zh" ? zh : en;

  return (
    <>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
      <div className="pb-24 max-w-5xl mx-auto" style={{ fontFamily: MONO }}>

        {/* ══════════ HERO ══════════ */}
        <section className="pt-16 relative overflow-hidden">
          <div style={{ position: "absolute", top: "-60px", left: "25%", width: "600px", height: "380px", background: "radial-gradient(ellipse, rgba(255,107,53,0.1) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

          <div className="relative z-10 grid md:grid-cols-[52fr_48fr] gap-10 items-start">
            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ color: "#252540", fontSize: "12px", marginBottom: "14px" }}>
                {"// "}{p("the question every brand should be asking", "每个品牌都该问的问题")}
              </div>

              <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "999px", marginBottom: "20px", background: "rgba(255,107,53,0.07)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.18)", letterSpacing: "0.12em" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", animation: "blink 2s step-end infinite" }} />
                {p("AI VISIBILITY PLATFORM", "AI 可见度监控平台")}
              </div>

              <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", fontWeight: 900, color: "#f0f0f8", lineHeight: 1.05, letterSpacing: "-0.025em", marginBottom: "18px" }}>
                {p("Is your brand", "AI 在推荐")}
                <br />
                <span style={{ color: "#ff6b35" }}>{p("visible to AI?", "你的品牌吗？")}</span>
              </h1>

              <p style={{ color: "#6060a0", fontSize: "15px", lineHeight: 1.65, marginBottom: "24px", maxWidth: "420px", fontFamily: "system-ui,-apple-system,sans-serif" }}>
                {p(
                  "When buyers ask ChatGPT, Claude, or Gemini for recommendations — is your brand in the answer?",
                  "当消费者向 ChatGPT、Claude、Gemini 询问推荐时——你的品牌出现了吗？"
                )}
              </p>

              {/* CLI CTA */}
              <div style={{ background: "#080810", border: "1px solid rgba(255,107,53,0.22)", borderRadius: "10px", padding: "14px 16px", marginBottom: "20px", boxShadow: "0 0 28px rgba(255,107,53,0.05)" }}>
                <div style={{ color: "#1a1a30", fontSize: "11px", marginBottom: "10px" }}>
                  {"# "}{p("free GEO scan — no credit card required", "免费 GEO 扫描 · 无需信用卡")}
                </div>
                <Link href={auditPath} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", fontSize: "14px" }}>
                  <span style={{ color: "#ff6b35" }}>$</span>
                  <span style={{ color: "#2a2a45" }}>avanti scan</span>
                  <span style={{ color: "#f5a623" }}>--brand</span>
                  <span style={{ flex: 1, borderBottom: "1px solid #1e1e30", paddingBottom: "1px", color: "#ff6b35", animation: "blink 1s step-end infinite" }}>▋</span>
                  <span style={{ background: "#ff6b35", color: "#fff", padding: "7px 18px", borderRadius: "7px", fontSize: "12px", fontWeight: "bold", boxShadow: "0 0 20px rgba(255,107,53,0.45)", flexShrink: 0 }}>
                    {p("→ Start Free", "→ 免费开始")}
                  </span>
                </Link>
              </div>

              <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={{ color: "#252545", fontSize: "12px", textDecoration: "none" }}>
                {"// "}{p("or book a strategy call →", "或预约策略通话 →")}
              </a>
            </motion.div>

            {/* Right */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="hidden md:block">
              <HeroTerminal lang={lang} />
            </motion.div>
          </div>
        </section>

        {/* ══════════ PROVEN RESULTS ══════════ */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginTop: "72px" }}>
          <div style={{ color: "#252540", fontSize: "12px", marginBottom: "16px" }}>
            {"// "}{p("02 — proven results, real clients", "02 — 真实客户，可验证的成果")}
          </div>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, color: "#f0f0f8", letterSpacing: "-0.02em", marginBottom: "24px" }}>
            {p("Real brands. Real growth.", "真实品牌，真实增长。")}
          </h2>

          <Term title="avanti case-study --client DriveX --period 90d">
            <$ cmd="avanti case-study --client DriveX --category automotive --period 90d" />
            <Out color="#252540"> </Out>
            <Out color="#252540">{"BRAND           CATEGORY       SOV BEFORE → AFTER    RESULT"}</Out>
            <Sep len={64} />
            {[
              { brand: "JumpStart Pro", cat: p("Jump Starters","启动电源"), before: "0%", after: "23.7%", c: "#22c55e", note: p("AI rank: unlisted → #2","AI 排名 → 第 2 位") },
              { brand: "MagDrive Pro",  cat: p("Phone Mounts","车载支架"),  before: "0%", after: "7.8%",  c: "#f5a623", note: p("Won PCMag Editor's Choice","获 PCMag 编辑推荐") },
              { brand: "DriveSafe Pro", cat: p("Dash Cameras","行车记录仪"), before: "0%", after: "5.2%",  c: "#ff6b35", note: p("Root cause: zero reviews","根因：零英文评测") },
            ].map((r) => (
              <Out key={r.brand}>
                <span style={{ color: "#888898", display: "inline-block", width: "136px" }}>{r.brand}</span>
                <span style={{ color: "#3a3a5c", display: "inline-block", width: "112px" }}>{r.cat}</span>
                <span style={{ color: "#2a2a45", display: "inline-block", width: "32px" }}>{r.before}</span>
                <span style={{ color: "#555580" }}> → </span>
                <span style={{ color: r.c, fontWeight: "bold", display: "inline-block", width: "60px" }}>{r.after}</span>
                <span style={{ color: "#1a1a2e" }}>{"// "}{r.note}</span>
              </Out>
            ))}
            <Sep len={64} />
            <Out color="#1a1a2e">{"exit_code 0  // program completed in 90 days"}</Out>
          </Term>
        </motion.section>

        {/* ══════════ HOW IT WORKS ══════════ */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginTop: "72px" }}>
          <div style={{ color: "#252540", fontSize: "12px", marginBottom: "16px" }}>
            {"// "}{p("03 — how it works", "03 — 工作原理")}
          </div>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, color: "#f0f0f8", letterSpacing: "-0.02em", marginBottom: "24px" }}>
            <span style={{ color: "#ff6b35" }}>{p("Measure.", "量化。")}</span>
            {" "}{p("Diagnose.", "诊断。")}
            {" "}<span style={{ color: "#22c55e" }}>{p("Execute.", "执行。")}</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                num: "01", cmd: "avanti measure", color: "#ff6b35",
                outputs: [
                  { k: "GEO_SCORE",     v: p("0–100 scale","0–100 评分"), c: "#ff6b35" },
                  { k: "SHARE_OF_VOICE", v: p("vs 5 competitors","与 5 家竞品对比"), c: "#f5a623" },
                  { k: "ENGINES",       v: "ChatGPT / Claude / Gemini / Perplexity", c: "#555580" },
                ],
                cta: { href: auditPath, label: p("→ Run free scan", "→ 免费扫描") },
              },
              {
                num: "02", cmd: "avanti diagnose", color: "#f5a623",
                outputs: [
                  { k: "REDDIT",  v: p("citation audit","引用审计"), c: "#f5a623" },
                  { k: "KOL",     v: p("YouTube / TikTok coverage","KOL 覆盖"), c: "#555580" },
                  { k: "LISTING", v: p("Amazon GEO score","Amazon 优化评分"), c: "#555580" },
                  { k: "HALLUC",  v: p("hallucination detection","幻觉检测"), c: "#ff4d6d" },
                ],
                cta: null,
              },
              {
                num: "03", cmd: "avanti execute", color: "#22c55e",
                outputs: [
                  { k: "BLOG",    v: p("AI-optimized articles","AI 优化文章"), c: "#22c55e" },
                  { k: "LISTING", v: p("Amazon GEO rewrite","Amazon 改写"), c: "#555580" },
                  { k: "FAQ",     v: p("schema page generator","FAQ Schema 生成"), c: "#555580" },
                ],
                cta: { href: auditPath, label: p("→ Start Content Studio", "→ 打开内容工作室") },
              },
            ].map((step) => (
              <Term key={step.num} title={`[${step.num}]`}>
                <$ cmd={step.cmd} />
                <Sep len={34} />
                {step.outputs.map((o) => (
                  <Out key={o.k}>
                    <span style={{ color: "#252540", display: "inline-block", width: "64px" }}>{o.k}</span>
                    <span style={{ color: o.c }}> {o.v}</span>
                  </Out>
                ))}
                {step.cta && (
                  <>
                    <Sep len={34} />
                    <Out>
                      <Link href={step.cta.href} style={{ color: step.color, textDecoration: "none", fontWeight: "bold" }}>{step.cta.label}</Link>
                    </Out>
                  </>
                )}
              </Term>
            ))}
          </div>
        </motion.section>

        {/* ══════════ FINAL CTA ══════════ */}
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginTop: "72px" }}>
          <Term title="avanti — ready to start" style={{ border: "1px solid rgba(255,107,53,0.2)", boxShadow: "0 0 50px rgba(255,107,53,0.05), 0 20px 60px rgba(0,0,0,0.7)" }}>
            <Out color="#1a1a2e">{"/*"}</Out>
            <Out color="#1e1e35">{"  "}{p("Find out where you stand before your competitors do.", "在竞争对手之前了解你在 AI 里的位置。")}</Out>
            <Out color="#1a1a2e">{"  */"}</Out>
            <Out color="#252540"> </Out>
            <$ cmd="avanti scan --free --no-credit-card-required" />
            <Out color="#252540"> </Out>
            <div style={{ paddingLeft: "22px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ color: "#3a3a5c" }}>--brand</span>
              <Link href={auditPath} style={{ flex: 1, minWidth: "180px", display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", background: "#080812", border: "1px solid rgba(255,107,53,0.18)", borderRadius: "8px", padding: "10px 16px" }}>
                <span style={{ color: "#1e1e35", flex: 1 }}>{p('"YourBrand"', '"品牌名"')}</span>
                <span style={{ background: "#ff6b35", color: "#fff", padding: "7px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: "bold", flexShrink: 0, boxShadow: "0 0 24px rgba(255,107,53,0.5)" }}>
                  {p("→ Get Free GEO Score", "→ 免费获取 GEO 评分")}
                </span>
              </Link>
            </div>
            <Out color="#252540"> </Out>
            <Out color="#1a1a2e">{"// "}{p("or: ", "或: ")}<a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={{ color: "#252545", textDecoration: "none" }}>{p("book a strategy call →", "预约策略通话 →")}</a></Out>
          </Term>
        </motion.section>

      </div>
    </>
  );
}
