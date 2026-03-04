"use client";

import { useState } from "react";
import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";
import { SELECTION_DATA, SECTIONS, type SellerSignal } from "@/lib/selection-data";

/* ── shared colours ─────────────────────────────────── */
const ARRS_COLOR = (v: number) => v < 30 ? "#22c55e" : v < 50 ? "#f5a623" : "#ff4d6d";
const SIGNAL_CFG: Record<SellerSignal, { label: string; color: string; bg: string }> = {
  strong_buy: { label: "STRONG BUY", color: "#22c55e", bg: "rgba(34,197,94,.10)" },
  watch:      { label: "WATCH",      color: "#f5a623", bg: "rgba(245,166,35,.10)" },
  avoid:      { label: "AVOID",      color: "#7070a0", bg: "rgba(112,112,160,.08)" },
};
const TREND_ICON: Record<string, string>  = { up:"↑", stable:"→", down:"↓" };
const TREND_CLR:  Record<string, string>  = { up:"#22c55e", stable:"#7070a0", down:"#ff4d6d" };

/* ── cost-optimizer config ───────────────────────────── */
const GEO_PLAN = 199;
interface OpItem { id:string; label:string; unit:string; pct:number; def:number; max:number; weekly?:boolean }
const OPS: OpItem[] = [
  { id:"cs",   label:"Customer Service",           unit:"hrs/week",  pct:.70, def:20, max:80,  weekly:true },
  { id:"res",  label:"Product Research & Sourcing",unit:"hrs/month", pct:.60, def:15, max:60 },
  { id:"tr",   label:"Translation & Localization", unit:"hrs/month", pct:.80, def:10, max:40 },
  { id:"data", label:"Data Entry & Reporting",     unit:"hrs/month", pct:.75, def:20, max:80 },
];

/* ── tabs ────────────────────────────────────────────── */
type Tab = "geo" | "selection" | "optimizer";
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "geo",       label: "GEO Visibility Diagnosis", icon: "◎" },
  { id: "selection", label: "AI Selection Intelligence", icon: "◈" },
  { id: "optimizer", label: "Cost Optimizer",            icon: "◐" },
];

/* ── stats ticker ────────────────────────────────────── */
const STATS = [
  { label: "AI engines monitored", value: "4" },
  { label: "query types tracked",  value: "200+" },
  { label: "categories covered",   value: "12" },
  { label: "data freshness",       value: "Monthly" },
  { label: "cross-border markets", value: "14" },
  { label: "avg ARRS gap closed",  value: "18 pts" },
];

export default function ProductPage() {
  const [tab, setTab]       = useState<Tab>("geo");
  const [filter, setFilter] = useState("all");
  const [vals, setVals]     = useState<Record<string, number>>(
    Object.fromEntries(OPS.map(i => [i.id, i.def]))
  );
  const [rate, setRate] = useState(15);

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
        {/* Background orbs */}
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
            The AI layer your competitors<br />
            <span className="shimmer-text">don&apos;t know exists yet.</span>
          </h1>

          <p className="animate-fade-up delay-200 text-base leading-relaxed max-w-2xl mx-auto" style={{ color:"#7070a0" }}>
            ChatGPT, Claude, and Perplexity are already telling buyers what to purchase.
            Avanti shows you exactly where your brand stands in those answers —
            which categories AI is sending buyers to, and how to fund it all by cutting AI-replaceable ops costs.
          </p>

          <div className="animate-fade-up delay-300 flex justify-center gap-3 flex-wrap">
            <Link href="/signup"
              className="text-sm font-semibold px-6 py-3 rounded-lg transition-opacity hover:opacity-80 animate-pulse-ring"
              style={{ background:"#ff6b35", color:"#fff" }}>
              Start free — no credit card →
            </Link>
            <Link href="/pricing"
              className="text-sm font-medium px-6 py-3 rounded-lg transition-colors hover:text-white"
              style={{ border:"1px solid #25253f", color:"#7070a0" }}>
              View pricing
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

      {/* ── Tab bar ──────────────────────────────────── */}
      <div className="pt-12 pb-4 px-4">
        <div className="flex justify-center gap-2 flex-wrap">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="text-sm px-5 py-2.5 rounded-full font-medium transition-all"
              style={tab === t.id
                ? { background:"#ff6b35", color:"#fff", boxShadow:"0 0 20px rgba(255,107,53,.4)" }
                : { background:"#0f0f17", border:"1px solid #25253f", color:"#7070a0" }}>
              <span className="mr-1.5 opacity-70">{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════ TAB: GEO ═══════════════ */}
      {tab === "geo" && (
        <div className="space-y-16 px-4 pb-8">

          {/* Problem statement */}
          <AnimateIn className="max-w-3xl mx-auto text-center space-y-4 pt-4">
            <div className="inline-block text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background:"rgba(255,77,109,.1)", color:"#ff4d6d", border:"1px solid rgba(255,77,109,.2)" }}>
              The problem
            </div>
            <p className="text-xl font-semibold leading-snug">
              Right now, a buyer is asking ChatGPT:{" "}
              <span style={{ color:"#7070a0" }}>&ldquo;What&apos;s the best portable power station for camping?&rdquo;</span>
            </p>
            <p className="text-sm leading-relaxed" style={{ color:"#7070a0" }}>
              ChatGPT names EcoFlow, Jackery, and Bluetti. Your brand — which has 4.5 stars and
              1,800 Amazon reviews — is not mentioned at all. The buyer goes to Amazon and searches
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
                { n:"02", title:"We score every mention", body:"Every brand mention is logged, weighted by query intent and AI engine authority, and combined into your ARRS score and SOV ranking." },
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

          {/* Demo + features */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 items-start">
            {/* Left: features */}
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
                  ["AI Recommendation Rank Score (ARRS)", "Your proprietary visibility score across 4 engines"],
                  ["Share of Voice vs every competitor", "See exactly how much AI attention your brand captures"],
                  ["Query-level breakdown by buyer intent", "Know which query types you win and which you lose"],
                  ["Citation source analysis", "Understand which third-party sources are driving competitor rankings"],
                  ["90-day GEO action plan", "Prioritized steps to improve your ARRS — not vague advice"],
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
                <Link href="/signup"
                  className="inline-block text-sm font-semibold px-6 py-3 rounded-lg transition-opacity hover:opacity-80"
                  style={{ background:"#ff6b35", color:"#fff", boxShadow:"0 0 24px rgba(255,107,53,.3)" }}>
                  Sign up — Run your free audit →
                </Link>
                <div>
                  <Link href="/blog/insta360-vs-dji"
                    className="text-xs transition-colors hover:text-white" style={{ color:"#7070a0" }}>
                    See a real report: Insta360 vs DJI →
                  </Link>
                </div>
              </div>
            </AnimateIn>

            {/* Right: demo card */}
            <AnimateIn direction="right"
              className="rounded-2xl p-6 space-y-5 animate-border-glow"
              style={{ background:"#0f0f17", border:"1px solid rgba(255,107,53,.25)" }}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-widest" style={{ color:"#7070a0" }}>
                  Sample Report — ChargeFast
                </div>
                <div className="text-xs px-2 py-0.5 rounded" style={{ background:"rgba(245,166,35,.1)", color:"#f5a623" }}>
                  USB-C Chargers
                </div>
              </div>

              {/* ARRS gauge */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black shrink-0 animate-pulse-ring"
                  style={{ background:"rgba(245,166,35,.12)", border:"2px solid #f5a623", color:"#f5a623" }}>
                  42
                </div>
                <div>
                  <div className="text-sm font-semibold">ARRS Score</div>
                  <div className="text-xs mt-1" style={{ color:"#7070a0" }}>
                    Moderate visibility — competitors are winning AI shelf space
                  </div>
                  <div className="text-xs mt-2 font-medium" style={{ color:"#f5a623" }}>
                    Target: below 30 to dominate your category
                  </div>
                </div>
              </div>

              {/* SOV bars */}
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-widest" style={{ color:"#7070a0" }}>
                  AI Share of Voice — USB-C Chargers
                </div>
                {[
                  { name:"Anker", sov:41.2, arrs:19, isYou:false },
                  { name:"Ugreen", sov:22.1, arrs:27, isYou:false },
                  { name:"ChargeFast", sov:18.4, arrs:42, isYou:true },
                  { name:"Belkin", sov:11.8, arrs:51, isYou:false },
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
                  Anker&apos;s dominance is driven by 340+ third-party editorial mentions.
                  ChargeFast has zero Wirecutter citations — closing this gap alone could
                  add ~12 SOV points within 90 days.
                </p>
              </div>

              <div className="text-xs pt-1" style={{ color:"#7070a0", borderTop:"1px solid #25253f" }}>
                Sign up to see your brand&apos;s real numbers →
              </div>
            </AnimateIn>
          </div>

          {/* Trust strip */}
          <AnimateIn className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "ChatGPT", sub: "GPT-4o" },
                { label: "Claude",  sub: "Anthropic" },
                { label: "Gemini",  sub: "Google" },
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
      )}

      {/* ═══════════════ TAB: SELECTION ═══════════════ */}
      {tab === "selection" && (
        <div className="space-y-12 px-4 pb-8">

          {/* Intro */}
          <AnimateIn className="max-w-3xl mx-auto text-center space-y-4 pt-4">
            <div className="inline-block text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background:"rgba(34,197,94,.1)", color:"#22c55e", border:"1px solid rgba(34,197,94,.2)" }}>
              The opportunity
            </div>
            <h2 className="text-2xl font-bold leading-snug">
              AI isn&apos;t neutral. It has already decided<br/>
              <span style={{ color:"#22c55e" }}>which categories are worth recommending.</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color:"#7070a0" }}>
              AI models form strong opinions based on training data, citation patterns, and content authority.
              Some categories are pushed relentlessly. Others are barely mentioned.
              Our Selection Intelligence maps exactly which categories and brands are winning AI recommendations
              right now — so you can source and position ahead of the curve.
            </p>
          </AnimateIn>

          {/* Value props horizontal */}
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

          {/* Explainer legend */}
          <AnimateIn className="max-w-2xl mx-auto rounded-xl p-5 space-y-3"
            style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
            <div className="font-semibold text-sm">How to read this data</div>
            <div className="space-y-1.5 text-xs" style={{ color:"#7070a0" }}>
              <div><span style={{ color:"#22c55e" }}>ARRS &lt; 30</span> — AI consistently recommends this brand. Very hard to displace.</div>
              <div><span style={{ color:"#f5a623" }}>ARRS 30–49</span> — Moderate AI presence. Room for a focused challenger to gain share.</div>
              <div><span style={{ color:"#ff4d6d" }}>ARRS ≥ 50</span> — Weak AI visibility. New entrants can establish dominance quickly.</div>
              <div className="pt-1">SOV (Share of Voice) — percentage of all AI mentions in this category captured by this brand.</div>
            </div>
          </AnimateIn>

          {/* CTA */}
          <AnimateIn className="rounded-xl p-8 text-center space-y-4 max-w-2xl mx-auto"
            style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
            <p className="font-semibold text-lg">Is your brand on any of these lists?</p>
            <p className="text-sm" style={{ color:"#7070a0" }}>
              Sign up to see your brand&apos;s ARRS score, SOV breakdown, and how you compare
              to every competitor in your category. Updated every month.
            </p>
            <Link href="/signup"
              className="inline-block text-sm font-semibold px-6 py-3 rounded-lg transition-opacity hover:opacity-80"
              style={{ background:"#ff6b35", color:"#fff" }}>
              Sign up free — Track your brand →
            </Link>
          </AnimateIn>
        </div>
      )}

      {/* ═══════════════ TAB: OPTIMIZER ═══════════════ */}
      {tab === "optimizer" && (
        <div className="space-y-12 px-4 pb-8">

          {/* Intro */}
          <AnimateIn className="max-w-3xl mx-auto text-center space-y-4 pt-4">
            <div className="inline-block text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background:"rgba(96,165,250,.1)", color:"#60a5fa", border:"1px solid rgba(96,165,250,.2)" }}>
              The flywheel
            </div>
            <h2 className="text-2xl font-bold leading-snug">
              Your team is doing tasks that GPT-4o<br/>
              <span style={{ color:"#60a5fa" }}>completes in under 8 seconds.</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color:"#7070a0" }}>
              Most cross-border brands spend $800–$2,000/month on repetitive, language-dependent operations
              that AI now handles faster and cheaper. The brands winning in 2026 cut these costs first —
              then reinvest the savings into GEO monitoring, which drives more AI recommendations,
              which drives more organic demand.
            </p>
          </AnimateIn>

          {/* Flywheel visual */}
          <AnimateIn className="max-w-2xl mx-auto rounded-xl p-6"
            style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-4 text-center" style={{ color:"#7070a0" }}>
              The Compounding Flywheel
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label:"AI saves you $800–$2,000/mo in ops", color:"#22c55e" },
                { label:"Reinvest → Avanti GEO monitoring ($199/mo)", color:"#ff6b35" },
                { label:"AI recommends your brand more frequently", color:"#f5a623" },
                { label:"More organic AI-driven demand arrives", color:"#22c55e" },
                { label:"Customer acquisition cost drops", color:"#60a5fa" },
                { label:"More budget freed for GEO expansion", color:"#ff6b35" },
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
            {/* Inputs */}
            <div className="lg:col-span-3 space-y-5">
              <div className="text-sm font-semibold" style={{ color:"#f0f0f8" }}>Enter your team&apos;s actual numbers:</div>

              {/* Rate */}
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
                        ? <><strong>{geoMos} month{geoMos!==1?"s":""}</strong> of Avanti GEO monitoring —
                            every month, automatically funded by your AI savings.</>
                        : "Increase your hours above to see how many GEO months are funded."}
                    </p>
                    {geoMos >= 1 && (
                      <div className="text-xs" style={{ color:"#7070a0" }}>
                        Avanti Growth Plan = ${GEO_PLAN}/mo · {geoMos >= 2 ? `${geoMos}× ROI per saved dollar` : "fully covered"}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Link href="/signup"
                    className="block text-center text-sm font-semibold px-4 py-2.5 rounded-lg transition-opacity hover:opacity-80"
                    style={{ background:"#ff6b35", color:"#fff" }}>
                    Sign up — Start Saving + GEO →
                  </Link>
                  <a href="https://calendly.com/brivesubscription/30min"
                    target="_blank" rel="noopener noreferrer"
                    className="block text-center text-sm font-medium px-4 py-2.5 rounded-lg transition-colors hover:text-white"
                    style={{ border:"1px solid #25253f", color:"#7070a0" }}>
                    Book Free Strategy Call
                  </a>
                </div>
              </div>

              {/* What AI replaces */}
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
                <Link href="/blog/ai-cost-guide-2025"
                  className="text-xs transition-colors hover:text-white block pt-1" style={{ color:"#ff6b35" }}>
                  Read the full cost savings guide →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom CTA strip ─────────────────────────────── */}
      <AnimateIn className="mt-16 mx-4 rounded-2xl p-10 text-center space-y-4 max-w-4xl lg:mx-auto"
        style={{ background:"linear-gradient(135deg, #0f0f17 0%, #1a1020 100%)", border:"1px solid #25253f" }}>
        <p className="text-2xl font-bold">The AI race is already happening.<br/>Start with a free audit.</p>
        <p className="text-sm leading-relaxed max-w-xl mx-auto" style={{ color:"#7070a0" }}>
          See your ARRS score, how you compare to every competitor in your category,
          and the exact actions that move your rank — before committing to a paid plan.
        </p>
        <div className="flex justify-center gap-3 pt-2 flex-wrap">
          <Link href="/signup"
            className="text-sm font-semibold px-8 py-3 rounded-lg transition-opacity hover:opacity-80"
            style={{ background:"#ff6b35", color:"#fff", boxShadow:"0 0 32px rgba(255,107,53,.4)" }}>
            Start free →
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
