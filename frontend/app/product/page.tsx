"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import { SELECTION_DATA, SECTIONS, type SellerSignal } from "@/lib/selection-data";
import { getToken } from "@/lib/auth";

/* ── shared colours ─────────────────────────────────── */
const ARRS_COLOR = (v: number) => v < 30 ? "#22c55e" : v < 50 ? "#f5a623" : "#ff4d6d";
const SIGNAL_CFG: Record<SellerSignal, { label: string; color: string; bg: string }> = {
  strong_buy: { label: "STRONG BUY", color: "#22c55e", bg: "rgba(34,197,94,.10)" },
  watch:      { label: "WATCH",      color: "#f5a623", bg: "rgba(245,166,35,.10)" },
  avoid:      { label: "AVOID",      color: "#7070a0", bg: "rgba(112,112,160,.08)" },
};
const TREND_ICON: Record<string, string> = { up:"↑", stable:"→", down:"↓" };
const TREND_CLR:  Record<string, string> = { up:"#22c55e", stable:"#7070a0", down:"#ff4d6d" };

/* ── cost-optimizer config ───────────────────────────── */
const GEO_PLAN = 199;
interface OpItem { id:string; label:string; unit:string; pct:number; def:number; max:number; weekly?:boolean }
const OPS: OpItem[] = [
  { id:"cs",   label:"Customer Service",            unit:"hrs/week",  pct:.70, def:20, max:80, weekly:true },
  { id:"res",  label:"Product Research & Sourcing", unit:"hrs/month", pct:.60, def:15, max:60 },
  { id:"tr",   label:"Translation & Localization",  unit:"hrs/month", pct:.80, def:10, max:40 },
  { id:"data", label:"Data Entry & Reporting",      unit:"hrs/month", pct:.75, def:20, max:80 },
];

/* ── stats ticker ────────────────────────────────────── */
const STATS = [
  { label: "AI engines monitored", value: "4" },
  { label: "query types tracked",  value: "200+" },
  { label: "categories covered",   value: "12" },
  { label: "data freshness",       value: "Monthly" },
  { label: "cross-border markets", value: "14" },
  { label: "avg AI Visibility Score gap closed",  value: "18 pts" },
];

/* ── step divider ────────────────────────────────────── */
function StepHeader({ n, label, sub, color = "#ff6b35" }: { n: string; label: string; sub: string; color?: string }) {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-3 pt-16 pb-2">
      <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider"
        style={{ background: `${color}14`, color, border: `1px solid ${color}30` }}>
        <span style={{ opacity: 0.6 }}>Step {n}</span>
        <span>·</span>
        <span>{label}</span>
      </div>
      <p className="text-sm" style={{ color: "#7070a0" }}>{sub}</p>
    </div>
  );
}

export default function ProductPage() {
  const [filter, setFilter] = useState("all");
  const [vals, setVals]     = useState<Record<string, number>>(
    Object.fromEntries(OPS.map(i => [i.id, i.def]))
  );
  const [rate, setRate] = useState(15);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, []);

  // Smart CTA: different text + href based on login state
  const primaryCta = loggedIn
    ? { href: "/runs/new",   label: "Run New Analysis →" }
    : { href: "/signup",     label: "Start free — no credit card →" };
  const auditCta = loggedIn
    ? { href: "/runs/new",   label: "Run a New Analysis →" }
    : { href: "/signup",     label: "Sign up — Run your free audit →" };
  const selectionCta = loggedIn
    ? { href: "/dashboard",  label: "Go to Dashboard →" }
    : { href: "/signup",     label: "Sign up free — Track your brand →" };
  const optimizerCta = loggedIn
    ? { href: "/runs/new",   label: "Start AI Visibility Monitoring →" }
    : { href: "/signup",     label: "Sign up — Start Saving + AI Visibility →" };
  const bottomCta = loggedIn
    ? { href: "/dashboard",  label: "Go to Dashboard →" }
    : { href: "/signup",     label: "Start free →" };

  const moHrs  = (item: OpItem) => item.weekly ? vals[item.id]*4.33 : vals[item.id];
  const total  = OPS.reduce((s,i) => s + moHrs(i)*rate, 0);
  const saved  = OPS.reduce((s,i) => s + moHrs(i)*rate*i.pct, 0);
  const geoMos = Math.floor(saved / GEO_PLAN);

  const filtered = filter === "all" ? SELECTION_DATA
    : SELECTION_DATA.filter(c => c.parentSection === filter);

  return (
    <div className="space-y-0 pb-20">

      {/* ── Hero ──────────────────────────────────────── */}
      <div className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="animate-orb absolute w-96 h-96 rounded-full opacity-20"
            style={{ background:"radial-gradient(circle, #ff6b35 0%, transparent 70%)", top:"-10%", left:"15%", filter:"blur(60px)" }} />
          <div className="animate-orb absolute w-80 h-80 rounded-full opacity-10 delay-400"
            style={{ background:"radial-gradient(circle, #f5a623 0%, transparent 70%)", bottom:"10%", right:"10%", filter:"blur(80px)" }} />
        </div>

        <div className="relative text-center space-y-6 max-w-3xl mx-auto">
          <div className="animate-fade-up inline-block text-xs px-3 py-1 rounded-full font-medium"
            style={{ background:"rgba(255,107,53,.12)", color:"#ff6b35", border:"1px solid rgba(255,107,53,.2)" }}>
            Avanti Platform
          </div>

          <h1 className="animate-fade-up delay-100 text-4xl sm:text-5xl font-black leading-tight tracking-tight">
            The complete AI playbook<br />
            <span className="shimmer-text">for cross-border sellers.</span>
          </h1>

          <p className="animate-fade-up delay-200 text-base leading-relaxed max-w-2xl mx-auto" style={{ color:"#7070a0" }}>
            ChatGPT, Claude, and Perplexity are already directing buyer decisions.
            Avanti gives you the full loop: diagnose your AI rank, monitor weekly shifts,
            discover what AI is pushing buyers to buy next, and fund it all by cutting AI-replaceable ops costs.
          </p>

          <div className="animate-fade-up delay-300 flex justify-center gap-3 flex-wrap">
            <Link href={primaryCta.href}
              className="text-sm font-semibold px-6 py-3 rounded-lg transition-opacity hover:opacity-80 animate-pulse-ring"
              style={{ background:"#ff6b35", color:"#fff" }}>
              {primaryCta.label}
            </Link>
            <Link href="/company/techvision-pro"
              className="text-sm font-medium px-6 py-3 rounded-lg transition-colors hover:text-white"
              style={{ border:"1px solid #25253f", color:"#7070a0" }}>
              See live demo →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats ticker ─────────────────────────────── */}
      <div className="py-4 border-y" style={{ borderColor:"#25253f" }}>
        <div className="flex justify-center flex-wrap gap-x-8 gap-y-2 px-6">
          {STATS.map((s, i) => (
            <div key={s.label} className={`text-center animate-fade-up delay-${(i+1)*100}`}>
              <div className="text-xl font-black" style={{ color:"#ff6b35" }}>{s.value}</div>
              <div className="text-xs" style={{ color:"#7070a0" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ STEP 1: DIAGNOSE ═══════════════ */}
      <div className="px-4">
        <AnimateIn>
          <StepHeader
            n="1" label="Diagnose"
            sub="Find out exactly where your brand stands in AI-generated answers — right now."
          />
        </AnimateIn>

        <div className="space-y-16 pb-8 mt-8">
          {/* Problem statement */}
          <AnimateIn className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-block text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background:"rgba(255,77,109,.1)", color:"#ff4d6d", border:"1px solid rgba(255,77,109,.2)" }}>
              The problem
            </div>
            <p className="text-xl font-semibold leading-snug">
              Right now, a buyer is asking ChatGPT:{" "}
              <span style={{ color:"#7070a0" }}>&ldquo;What&apos;s the best car jump starter for cold weather?&rdquo;</span>
            </p>
            <p className="text-sm leading-relaxed" style={{ color:"#7070a0" }}>
              ChatGPT names NOCO, Tacklife, and AVAPOW. Your brand — which has 4.6 stars and
              8,000 Amazon reviews — is not mentioned at all. The buyer goes to Amazon and searches
              for one of those three brands. You never had a chance.
            </p>
            <p className="text-sm font-medium" style={{ color:"#f0f0f8" }}>
              This is happening across every category, every day. Avanti measures it.
            </p>
          </AnimateIn>

          {/* How it works */}
          <div className="max-w-4xl mx-auto">
            <AnimateIn className="text-center mb-8">
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"#7070a0" }}>How it works</div>
              <h2 className="text-2xl font-bold">Three steps to knowing your AI rank</h2>
            </AnimateIn>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { n:"01", title:"We simulate buyer queries", body:"We run 200+ natural-language queries across ChatGPT, Claude, Gemini, and Perplexity — the same questions real buyers are asking right now." },
                { n:"02", title:"We score every mention", body:"Every brand mention is logged, weighted by query intent and AI engine authority, and combined into your AI Visibility Score and SOV ranking." },
                { n:"03", title:"You get an action plan", body:"Not just a score — a prioritized list of why competitors rank above you and exactly what content and citation moves will close the gap." },
              ].map((step, i) => (
                <AnimateIn key={step.n} delay={i * 120} direction="scale"
                  className="card-hover rounded-xl p-6 space-y-3"
                  style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
                  <div className="text-2xl font-black" style={{ color:"rgba(255,107,53,.35)" }}>{step.n}</div>
                  <div className="font-semibold text-sm">{step.title}</div>
                  <p className="text-xs leading-relaxed" style={{ color:"#7070a0" }}>{step.body}</p>
                </AnimateIn>
              ))}
            </div>
          </div>

          {/* Demo card + features */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 items-start">
            <AnimateIn direction="left" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold leading-tight">
                  When buyers ask AI what to buy,<br/>
                  <span style={{ color:"#ff6b35" }}>is your brand in the answer?</span>
                </h2>
                <p className="text-sm leading-relaxed mt-3" style={{ color:"#7070a0" }}>
                  Avanti runs 200+ queries across the four AI engines actively directing buyer decisions —
                  then gives you a complete picture of where you stand, why competitors outrank you,
                  and the exact moves that change your score within 90 days.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  ["AI Visibility Score", "Your proprietary visibility score across 4 engines"],
                  ["Share of Voice vs every competitor", "See exactly how much AI attention your brand captures"],
                  ["Query-level breakdown by buyer intent", "Know which query types you win and which you lose"],
                  ["Citation source analysis", "Understand which third-party sources are driving competitor rankings"],
                  ["90-day AI visibility plan", "Prioritized steps to improve your AI Visibility Score — not vague advice"],
                ].map(([title, desc]) => (
                  <div key={title} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 shrink-0" style={{ color:"#ff6b35" }}>✓</span>
                    <div>
                      <div className="font-medium">{title}</div>
                      <div className="text-xs mt-0.5" style={{ color:"#7070a0" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Link href={auditCta.href}
                  className="inline-block text-sm font-semibold px-6 py-3 rounded-lg transition-opacity hover:opacity-80"
                  style={{ background:"#ff6b35", color:"#fff", boxShadow:"0 0 24px rgba(255,107,53,.3)" }}>
                  {auditCta.label}
                </Link>
                <div>
                  <Link href="/company/techvision-pro"
                    className="text-xs transition-colors hover:text-white" style={{ color:"#7070a0" }}>
                    See a real client dashboard: AutoCore Global →
                  </Link>
                </div>
              </div>
            </AnimateIn>

            {/* Demo card — JumpStart Pro */}
            <AnimateIn direction="right"
              className="rounded-2xl p-6 space-y-5 animate-border-glow"
              style={{ background:"#0f0f17", border:"1px solid rgba(255,107,53,.25)" }}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-widest" style={{ color:"#7070a0" }}>
                  Sample Report — JumpStart Pro
                </div>
                <div className="text-xs px-2 py-0.5 rounded" style={{ background:"rgba(245,166,35,.1)", color:"#f5a623" }}>
                  Car Jump Starters
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black shrink-0 animate-pulse-ring"
                  style={{ background:"rgba(34,197,94,.12)", border:"2px solid #22c55e", color:"#22c55e" }}>
                  68
                </div>
                <div>
                  <div className="text-sm font-semibold">AI Visibility Score: 68 / 100</div>
                  <div className="text-xs mt-1" style={{ color:"#7070a0" }}>
                    Strong visibility — #2 in AI recommendations. Playbook execution working.
                  </div>
                  <div className="text-xs mt-2 font-medium" style={{ color:"#22c55e" }}>
                    Target: 80+ to dominate cold-weather category
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-widest" style={{ color:"#7070a0" }}>
                  AI Share of Voice — Car Jump Starters
                </div>
                {[
                  { name:"NOCO",        sov:38.4, arrs:19, isYou:false },
                  { name:"JumpStart Pro", sov:19.3, arrs:41, isYou:true },
                  { name:"TACKLIFE",    sov:14.7, arrs:53, isYou:false },
                  { name:"AVAPOW",      sov:10.2, arrs:64, isYou:false },
                ].map(b => (
                  <div key={b.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: b.isYou ? "#ff6b35" : "#f0f0f8" }}>
                        {b.name} {b.isYou && <span style={{ color:"#ff6b35" }}>(you)</span>}
                      </span>
                      <div className="flex items-center gap-2">
                        <span style={{ color:"#7070a0" }}>{b.sov}% SOV</span>
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded"
                          style={{ background:`${ARRS_COLOR(b.arrs)}18`, color:ARRS_COLOR(b.arrs) }}>
                          {b.arrs}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background:"#25253f" }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width:`${(b.sov/50)*100}%`, background: b.isYou ? "#ff6b35" : "#3a3a5f" }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg p-3 text-xs space-y-1"
                style={{ background:"rgba(255,107,53,.06)", border:"1px solid rgba(255,107,53,.15)" }}>
                <div className="font-semibold" style={{ color:"#ff6b35" }}>AI Insight</div>
                <p style={{ color:"#7070a0" }}>
                  NOCO&apos;s dominance is driven by Project Farm (1.14M YouTube views) + 280+ Wirecutter-tier citations.
                  JumpStart Pro has 1 Tom&apos;s Guide mention in negotiation — closing this gap could
                  add ~12 SOV points within 90 days.
                </p>
              </div>

              <div className="text-xs pt-1" style={{ color:"#7070a0", borderTop:"1px solid #25253f" }}>
                Sign up to see your brand&apos;s real numbers →
              </div>
            </AnimateIn>
          </div>

          {/* AI engine trust strip */}
          <AnimateIn className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "ChatGPT",    sub: "GPT-4o" },
                { label: "Claude",     sub: "Anthropic" },
                { label: "Gemini",     sub: "Google" },
                { label: "Perplexity", sub: "Answer engine" },
              ].map(e => (
                <div key={e.label} className="rounded-xl p-4 text-center card-hover"
                  style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
                  <div className="font-bold text-sm">{e.label}</div>
                  <div className="text-xs mt-0.5" style={{ color:"#7070a0" }}>{e.sub}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs mt-3" style={{ color:"#7070a0" }}>
              Every query is run live across all four engines — not sampled or estimated.
            </p>
          </AnimateIn>
        </div>
      </div>

      {/* ═══════════════ STEP 2: MONITOR ═══════════════ */}
      <div className="px-4 border-t" style={{ borderColor:"#1a1a2e" }}>
        <AnimateIn>
          <StepHeader
            n="2" label="Monitor"
            sub="Track how your AI visibility changes week over week — and see the exact impact of every content and citation move."
            color="#f5a623"
          />
        </AnimateIn>

        <div className="max-w-5xl mx-auto mt-10 grid md:grid-cols-2 gap-6">
          {/* Trend chart mock */}
          <AnimateIn direction="left" className="rounded-2xl p-6 space-y-5"
            style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">AI Visibility Score Trend — AutoCore Global</div>
              <span className="text-xs px-2 py-0.5 rounded" style={{ background:"rgba(34,197,94,.1)", color:"#22c55e" }}>
                Live tracking
              </span>
            </div>

            {[
              { brand:"JumpStart Pro", scores:[52,56,60,65,68], color:"#22c55e" },
              { brand:"MagDrive Pro",  scores:[18,20,21,22,24], color:"#f5a623" },
              { brand:"DriveSafe Pro", scores:[38,33,27,22,18], color:"#ff4d6d" },
            ].map(({ brand, scores, color }) => {
              const delta = scores[scores.length-1] - scores[0];
              const W = 120, H = 32;
              const min = Math.min(...scores) - 3;
              const max = Math.max(...scores) + 3;
              const range = max - min || 1;
              const pts = scores.map((v,i) => {
                const x = (i/(scores.length-1))*W;
                const y = H - ((v-min)/range)*H;
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              }).join(" ");
              return (
                <div key={brand} className="flex items-center gap-4">
                  <div className="w-28 shrink-0">
                    <div className="text-xs font-medium">{brand}</div>
                    <div className="text-xs mt-0.5" style={{ color }}>
                      {scores[scores.length-1]} pts {delta > 0 ? `(+${delta})` : `(${delta})`}
                    </div>
                  </div>
                  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="shrink-0">
                    <polyline points={pts} fill="none" stroke={color}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              );
            })}

            <div className="flex gap-4 text-xs pt-2" style={{ borderTop:"1px solid #1a1a2e", color:"#7070a0" }}>
              <span>Week 1</span>
              <span className="ml-auto">Week 5 (now)</span>
            </div>
          </AnimateIn>

          {/* What monitoring tells you */}
          <AnimateIn direction="right" className="space-y-4">
            <h3 className="text-xl font-bold">
              See what moves the needle,<br/>
              <span style={{ color:"#f5a623" }}>week by week.</span>
            </h3>
            <p className="text-sm leading-relaxed" style={{ color:"#7070a0" }}>
              Publishing a new piece of content? Getting a Wirecutter citation? Avanti tracks your
              AI Visibility Score every week so you can attribute exactly which actions drove which changes —
              and double down on what works.
            </p>
            <div className="space-y-3">
              {[
                { event:"JumpStart Pro: Tom's Guide review unit shipped", impact:"AI Visibility +8 pts (3 weeks later)", color:"#22c55e" },
                { event:"DriveSafe Pro: 46% auto-generated content flagged", impact:"AI Visibility −20 pts (AI quality filter)", color:"#ff4d6d" },
                { event:"MagDrive Pro: FAQ schema added to product pages", impact:"AI Visibility +4 pts (2 weeks later)", color:"#f5a623" },
              ].map(({ event, impact, color }) => (
                <div key={event} className="rounded-xl p-4 space-y-1"
                  style={{ background:"#0a0a14", border:`1px solid ${color}20` }}>
                  <div className="text-xs" style={{ color:"#a0a0c8" }}>{event}</div>
                  <div className="text-sm font-semibold" style={{ color }}>{impact}</div>
                </div>
              ))}
            </div>
            <Link href="/company/techvision-pro"
              className="inline-block text-sm font-medium transition-colors hover:text-white"
              style={{ color:"#7070a0" }}>
              See a full client dashboard with live trends →
            </Link>
          </AnimateIn>
        </div>
      </div>

      {/* ═══════════════ STEP 3: DISCOVER ═══════════════ */}
      <div className="px-4 border-t mt-16" style={{ borderColor:"#1a1a2e" }}>
        <AnimateIn>
          <StepHeader
            n="3" label="Discover"
            sub="Before you decide what to sell, find out what AI is already recommending to buyers — 6–8 weeks before it shows up as sales data."
            color="#22c55e"
          />
        </AnimateIn>

        <div className="space-y-10 mt-10">
          <AnimateIn className="max-w-4xl mx-auto grid md:grid-cols-3 gap-4">
            {[
              { icon:"📡", title:"Real-time AI tracking", body:"200+ queries/month across ChatGPT, Claude, Gemini, and Perplexity — continuously updated." },
              { icon:"🏷️", title:"Seller signals", body:"Each category gets a STRONG BUY / WATCH / AVOID rating based on AI recommendation velocity and competitive density." },
              { icon:"📊", title:"SOV breakdown", body:"See exactly which brands own AI mindshare in each category — and where the gaps are that you can enter." },
            ].map((item, i) => (
              <div key={item.title}
                className={`card-hover rounded-xl p-5 space-y-2 animate-fade-up delay-${(i+1)*150}`}
                style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
                <div className="text-2xl">{item.icon}</div>
                <div className="font-semibold text-sm">{item.title}</div>
                <p className="text-xs leading-relaxed" style={{ color:"#7070a0" }}>{item.body}</p>
              </div>
            ))}
          </AnimateIn>

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setFilter(s.id)}
                className="text-xs px-4 py-1.5 rounded-full transition-all font-medium"
                style={filter === s.id
                  ? { background:"#ff6b35", color:"#fff", boxShadow:"0 0 12px rgba(255,107,53,.3)" }
                  : { background:"#0f0f17", border:"1px solid #25253f", color:"#7070a0" }}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((cat, i) => {
              const sig = SIGNAL_CFG[cat.sellerSignal];
              const max = cat.topBrands[0].sov;
              return (
                <AnimateIn key={cat.id} delay={i * 60} direction="scale"
                  className="card-hover rounded-xl p-5 space-y-4 flex flex-col"
                  style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-sm">{cat.category}</div>
                      <div className="text-xs mt-0.5" style={{ color:"#7070a0" }}>{cat.parentSection}</div>
                    </div>
                    <div className="text-xs font-bold shrink-0" style={{ color:TREND_CLR[cat.trend] }}>
                      {TREND_ICON[cat.trend]} {cat.trendPts} pts
                    </div>
                  </div>
                  <div className="text-xs font-bold px-2.5 py-1 rounded-full self-start"
                    style={{ background:sig.bg, color:sig.color }}>{sig.label}</div>
                  <div className="space-y-2">
                    {cat.topBrands.map(b => (
                      <div key={b.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span style={{ color:"#f0f0f8" }}>{b.name}</span>
                          <div className="flex items-center gap-2">
                            <span style={{ color:"#7070a0" }}>{b.sov}% SOV</span>
                            <span className="text-xs font-medium px-1.5 py-0.5 rounded"
                              style={{ background:`${ARRS_COLOR(b.arrs)}18`, color:ARRS_COLOR(b.arrs) }}>
                              {b.arrs}
                            </span>
                          </div>
                        </div>
                        <div className="h-1 rounded-full" style={{ background:"#25253f" }}>
                          <div className="h-full rounded-full"
                            style={{ width:`${(b.sov/max)*100}%`, background:"#ff6b35" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed mt-auto" style={{ color:"#7070a0" }}>
                    {cat.sellerNote}
                  </p>
                </AnimateIn>
              );
            })}
          </div>

          <AnimateIn className="max-w-2xl mx-auto rounded-xl p-5 space-y-3"
            style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
            <div className="font-semibold text-sm">How to read this data</div>
            <div className="space-y-1.5 text-xs" style={{ color:"#7070a0" }}>
              <div><span style={{ color:"#22c55e" }}>AI Visibility Score &lt; 30</span> — AI consistently recommends this brand. Very hard to displace.</div>
              <div><span style={{ color:"#f5a623" }}>AI Visibility Score 30–49</span> — Moderate AI presence. Room for a focused challenger to gain share.</div>
              <div><span style={{ color:"#ff4d6d" }}>AI Visibility Score ≥ 50</span> — Weak AI visibility. New entrants can establish dominance quickly.</div>
              <div className="pt-1">SOV (Share of Voice) — percentage of all AI mentions in this category captured by this brand.</div>
            </div>
          </AnimateIn>
        </div>
      </div>

      {/* ═══════════════ STEP 4: OPTIMIZE & FUND ═══════════════ */}
      <div className="px-4 border-t mt-16" style={{ borderColor:"#1a1a2e" }}>
        <AnimateIn>
          <StepHeader
            n="4" label="Optimize & Fund"
            sub="Cut AI-replaceable ops costs first. Reinvest the savings into AI visibility — the flywheel that compounds."
            color="#60a5fa"
          />
        </AnimateIn>

        <div className="space-y-12 mt-10">
          {/* Flywheel visual */}
          <AnimateIn className="max-w-2xl mx-auto rounded-xl p-6"
            style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-4 text-center" style={{ color:"#7070a0" }}>
              The Compounding Flywheel
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label:"AI saves you $800–$2,000/mo in ops costs", color:"#22c55e" },
                { label:"Reinvest → Avanti AI Visibility monitoring ($199/mo)", color:"#ff6b35" },
                { label:"AI recommends your brand more frequently", color:"#f5a623" },
                { label:"More organic AI-driven buyer demand arrives", color:"#22c55e" },
                { label:"Customer acquisition cost drops", color:"#60a5fa" },
                { label:"More budget freed for AI visibility expansion", color:"#ff6b35" },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-3 text-sm">
                  <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background:`${step.color}20`, color:step.color }}>
                    {i + 1}
                  </div>
                  <span style={{ color:"#f0f0f8" }}>{step.label}</span>
                  {i < 5 && <div className="ml-auto text-xs" style={{ color:"#3a3a5c" }}>↓</div>}
                </div>
              ))}
            </div>
          </AnimateIn>

          {/* Calculator */}
          <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-6 items-start">
            <div className="lg:col-span-3 space-y-5">
              <div className="text-sm font-semibold" style={{ color:"#f0f0f8" }}>Enter your team&apos;s actual numbers:</div>

              <div className="rounded-xl p-5 space-y-4 card-hover"
                style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Team hourly rate</span>
                    <div className="text-xs mt-0.5" style={{ color:"#7070a0" }}>All-in cost per hour including benefits</div>
                  </div>
                  <span className="font-black text-lg" style={{ color:"#ff6b35" }}>${rate}/hr</span>
                </div>
                <input type="range" min={8} max={50} value={rate}
                  onChange={e => setRate(Number(e.target.value))}
                  className="w-full accent-orange-500" />
                <div className="flex justify-between text-xs" style={{ color:"#7070a0" }}>
                  <span>$8/hr (factory area)</span><span>$50/hr (coastal city)</span>
                </div>
              </div>

              {OPS.map((item, i) => {
                const hrs  = moHrs(item);
                const cost = hrs * rate;
                const save = cost * item.pct;
                return (
                  <AnimateIn key={item.id} delay={i * 80}
                    className="rounded-xl p-5 space-y-3 card-hover"
                    style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs mt-0.5" style={{ color:"#7070a0" }}>
                          AI replaces {Math.round(item.pct*100)}% · saves ${save.toFixed(0)}/mo
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{vals[item.id]} {item.unit}</div>
                        <div className="text-xs" style={{ color:"#7070a0" }}>${cost.toFixed(0)}/mo cost</div>
                      </div>
                    </div>
                    <input type="range" min={0} max={item.max} value={vals[item.id]}
                      onChange={e => setVals(p => ({ ...p, [item.id]:Number(e.target.value) }))}
                      className="w-full accent-orange-500" />
                    <div className="flex justify-between text-xs">
                      <span style={{ color:"#7070a0" }}>0 hrs</span>
                      <span className="font-medium" style={{ color:"#22c55e" }}>AI saves: ${save.toFixed(0)}/mo</span>
                    </div>
                  </AnimateIn>
                );
              })}
            </div>

            {/* Result card */}
            <div className="lg:col-span-2 lg:sticky lg:top-20 space-y-4">
              <div className="rounded-xl p-6 space-y-5 animate-border-glow"
                style={{ background:"#0f0f17", border:"1px solid rgba(255,107,53,.3)" }}>
                <div className="text-sm font-semibold">Your Monthly Savings</div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span style={{ color:"#7070a0" }}>Current monthly cost</span>
                    <span className="font-medium">${total.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color:"#7070a0" }}>After AI handles it</span>
                    <span className="font-medium">${(total-saved).toFixed(0)}</span>
                  </div>
                  <div className="h-px" style={{ background:"#25253f" }} />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Monthly savings</span>
                    <span className="text-3xl font-black" style={{ color:"#ff6b35" }}>
                      ${saved.toFixed(0)}
                    </span>
                  </div>
                </div>

                {saved > 0 && (
                  <div className="rounded-lg p-4 space-y-2"
                    style={{ background:"rgba(255,107,53,.08)", border:"1px solid rgba(255,107,53,.2)" }}>
                    <div className="text-xs font-semibold" style={{ color:"#ff6b35" }}>What this funds</div>
                    <p className="text-sm" style={{ color:"#f0f0f8" }}>
                      {geoMos > 0
                        ? <><strong>{geoMos} month{geoMos!==1?"s":""}</strong> of Avanti AI Visibility monitoring —
                            every month, automatically funded by your AI savings.</>
                        : "Increase your hours above to see how many AI Visibility months are funded."}
                    </p>
                    {geoMos >= 1 && (
                      <div className="text-xs" style={{ color:"#7070a0" }}>
                        Avanti Growth Plan = ${GEO_PLAN}/mo · {geoMos >= 2 ? `${geoMos}× ROI per saved dollar` : "fully covered"}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Link href={optimizerCta.href}
                    className="block text-center text-sm font-semibold px-4 py-2.5 rounded-lg transition-opacity hover:opacity-80"
                    style={{ background:"#ff6b35", color:"#fff" }}>
                    {optimizerCta.label}
                  </Link>
                  <a href="https://calendly.com/brivesubscription/30min"
                    target="_blank" rel="noopener noreferrer"
                    className="block text-center text-sm font-medium px-4 py-2.5 rounded-lg transition-colors hover:text-white"
                    style={{ border:"1px solid #25253f", color:"#7070a0" }}>
                    Book Free Strategy Call
                  </a>
                </div>
              </div>

              <div className="rounded-xl p-5 space-y-3 card-hover"
                style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
                <div className="text-xs font-semibold uppercase tracking-widest" style={{ color:"#7070a0" }}>
                  What AI handles right now
                </div>
                <ul className="space-y-2 text-xs" style={{ color:"#7070a0" }}>
                  {[
                    "Customer inquiry routing & draft replies (70% reduction)",
                    "Amazon listing translation & localization (80% reduction)",
                    "Competitor price & BSR monitoring (fully automated)",
                    "Weekly reporting & data aggregation (75% reduction)",
                    "Product research from AI trend signals (60% reduction)",
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="shrink-0 mt-0.5" style={{ color:"#22c55e" }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA strip ─────────────────────────────── */}
      <AnimateIn className="mt-16 mx-4 rounded-2xl p-10 text-center space-y-4 max-w-4xl lg:mx-auto"
        style={{ background:"linear-gradient(135deg, #0f0f17 0%, #1a1020 100%)", border:"1px solid #25253f" }}>
        <p className="text-2xl font-bold">The AI race is already happening.<br/>Start with a free audit.</p>
        <p className="text-sm leading-relaxed max-w-xl mx-auto" style={{ color:"#7070a0" }}>
          See your AI Visibility Score, how you compare to every competitor in your category,
          and the exact actions that move your rank — before committing to a paid plan.
        </p>
        <div className="flex justify-center gap-3 pt-2 flex-wrap">
          <Link href={bottomCta.href}
            className="text-sm font-semibold px-8 py-3 rounded-lg transition-opacity hover:opacity-80"
            style={{ background:"#ff6b35", color:"#fff", boxShadow:"0 0 32px rgba(255,107,53,.4)" }}>
            {bottomCta.label}
          </Link>
          <Link href="/pricing"
            className="text-sm font-medium px-8 py-3 rounded-lg transition-colors hover:text-white"
            style={{ border:"1px solid #25253f", color:"#7070a0" }}>
            See pricing
          </Link>
          <a href="https://calendly.com/brivesubscription/30min"
            target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium px-8 py-3 rounded-lg transition-colors hover:text-white"
            style={{ border:"1px solid #25253f", color:"#7070a0" }}>
            Book a demo
          </a>
        </div>
      </AnimateIn>

    </div>
  );
}
