"use client";

import { useState } from "react";
import Link from "next/link";
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
const TABS: { id: Tab; label: string }[] = [
  { id: "geo",       label: "GEO Visibility Diagnosis" },
  { id: "selection", label: "AI Selection Intelligence" },
  { id: "optimizer", label: "Cost Optimizer" },
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
    <div className="space-y-8 py-12">

      {/* ── Page header ── */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-block text-xs px-3 py-1 rounded-full font-medium"
          style={{ background:"rgba(255,107,53,.12)", color:"#ff6b35" }}>
          Avanti Products
        </div>
        <h1 className="text-3xl font-bold">Three tools. One unfair advantage.</h1>
        <p className="text-sm leading-relaxed" style={{ color:"#7070a0" }}>
          Know where AI ranks your brand. Know what AI is telling buyers to purchase.
          Find the budget to fund it all. Sign up free to unlock every tool.
        </p>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex justify-center gap-2 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="text-sm px-5 py-2 rounded-full font-medium transition-colors"
            style={tab === t.id
              ? { background:"#ff6b35", color:"#fff" }
              : { background:"#0f0f17", border:"1px solid #25253f", color:"#7070a0" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════ TAB: GEO ══════════════════════ */}
      {tab === "geo" && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6 items-start">

            {/* Left: explanation */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold">
                When buyers ask AI what to buy,<br />
                <span style={{ color:"#ff6b35" }}>is your brand in the answer?</span>
              </h2>
              <p className="text-sm leading-relaxed" style={{ color:"#7070a0" }}>
                Avanti runs 20+ queries across ChatGPT, Claude, Gemini, and Perplexity —
                then tells you your ARRS score, your Share of Voice against every
                competitor, and exactly why the gap exists.
              </p>
              <ul className="space-y-2 text-sm" style={{ color:"#7070a0" }}>
                {["AI Recommendation Ranking Score (ARRS)", "Share of Voice vs every competitor", "Query-level breakdown by intent", "Citation source analysis", "3-step action plan to close the gap"].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span style={{ color:"#ff6b35" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className="inline-block text-sm font-medium px-6 py-3 rounded-lg transition-opacity hover:opacity-80"
                style={{ background:"#ff6b35", color:"#fff", boxShadow:"0 0 24px rgba(255,107,53,.3)" }}>
                Sign up — Run your free audit →
              </Link>
            </div>

            {/* Right: demo card */}
            <div className="rounded-2xl p-6 space-y-5"
              style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ color:"#7070a0" }}>
                Sample Report — ChargeFast
              </div>

              {/* ARRS */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black shrink-0"
                  style={{ background:"rgba(245,166,35,.12)", border:"2px solid #f5a623", color:"#f5a623" }}>
                  42
                </div>
                <div>
                  <div className="text-sm font-semibold">ARRS Score</div>
                  <div className="text-xs mt-1" style={{ color:"#7070a0" }}>
                    Moderate visibility — competitors are winning AI shelf space
                  </div>
                </div>
              </div>

              {/* SOV bars */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-widest" style={{ color:"#7070a0" }}>
                  AI Share of Voice
                </div>
                {[
                  { name:"ChargeFast", sov:18.4, isYou:true },
                  { name:"Anker",      sov:41.2, isYou:false },
                  { name:"Ugreen",     sov:22.1, isYou:false },
                ].map(b => (
                  <div key={b.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: b.isYou ? "#ff6b35" : "#f0f0f8" }}>
                        {b.name} {b.isYou && "(you)"}
                      </span>
                      <span style={{ color:"#7070a0" }}>{b.sov}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background:"#25253f" }}>
                      <div className="h-full rounded-full"
                        style={{ width:`${(b.sov/50)*100}%`, background: b.isYou ? "#ff6b35" : "#25253f", border: b.isYou ? "none" : "1px solid #3a3a5f" }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs pt-2" style={{ color:"#7070a0", borderTop:"1px solid #25253f" }}>
                Sign up to see your brand's real numbers →
              </div>
            </div>
          </div>

          {/* Research link */}
          <div className="text-center">
            <Link href="/blog/insta360-vs-dji"
              className="text-sm transition-colors hover:text-white"
              style={{ color:"#7070a0" }}>
              See a real GEO report: Insta360 vs DJI →
            </Link>
          </div>
        </div>
      )}

      {/* ══════════════════════ TAB: SELECTION ══════════════════════ */}
      {tab === "selection" && (
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-xl font-bold">What AI Is Telling Buyers to Purchase</h2>
            <p className="text-sm" style={{ color:"#7070a0" }}>
              Track AI recommendation patterns across 4 engines. Know which categories
              are heating up — before your competitors stock them.
            </p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setFilter(s.id)}
                className="text-xs px-4 py-1.5 rounded-full transition-colors font-medium"
                style={filter === s.id
                  ? { background:"#ff6b35", color:"#fff" }
                  : { background:"#0f0f17", border:"1px solid #25253f", color:"#7070a0" }}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(cat => {
              const sig = SIGNAL_CFG[cat.sellerSignal];
              const max = cat.topBrands[0].sov;
              return (
                <div key={cat.id} className="rounded-xl p-5 space-y-4 flex flex-col"
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
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="rounded-xl p-6 text-center space-y-3"
            style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
            <p className="font-semibold">Is your brand on any of these lists?</p>
            <p className="text-sm" style={{ color:"#7070a0" }}>
              Sign up to track your brand&apos;s position and get alerts when AI rankings shift.
            </p>
            <Link href="/signup"
              className="inline-block text-sm font-medium px-6 py-2.5 rounded-lg transition-opacity hover:opacity-80"
              style={{ background:"#ff6b35", color:"#fff" }}>
              Sign up free — Track your brand →
            </Link>
          </div>
        </div>
      )}

      {/* ══════════════════════ TAB: OPTIMIZER ══════════════════════ */}
      {tab === "optimizer" && (
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-xl font-bold">Find the Budget to Fund Your GEO</h2>
            <p className="text-sm" style={{ color:"#7070a0" }}>
              Calculate how much AI can save on ops — then see how many months
              of GEO monitoring that funds.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 items-start">
            {/* Inputs */}
            <div className="lg:col-span-3 space-y-5">
              {/* Rate */}
              <div className="rounded-xl p-5 space-y-4"
                style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Team hourly rate</span>
                  <span className="font-bold" style={{ color:"#ff6b35" }}>${rate}/hr</span>
                </div>
                <input type="range" min={8} max={50} value={rate}
                  onChange={e => setRate(Number(e.target.value))}
                  className="w-full accent-orange-500" />
                <div className="flex justify-between text-xs" style={{ color:"#7070a0" }}>
                  <span>$8</span><span>$50</span>
                </div>
              </div>

              {OPS.map(item => {
                const hrs  = moHrs(item);
                const cost = hrs * rate;
                const save = cost * item.pct;
                return (
                  <div key={item.id} className="rounded-xl p-5 space-y-3"
                    style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs mt-0.5" style={{ color:"#7070a0" }}>
                          AI replaces {Math.round(item.pct*100)}% of this work
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{vals[item.id]} {item.unit}</div>
                        <div className="text-xs" style={{ color:"#7070a0" }}>${cost.toFixed(0)}/mo</div>
                      </div>
                    </div>
                    <input type="range" min={0} max={item.max} value={vals[item.id]}
                      onChange={e => setVals(p => ({ ...p, [item.id]:Number(e.target.value) }))}
                      className="w-full accent-orange-500" />
                    <div className="flex justify-between text-xs">
                      <span style={{ color:"#7070a0" }}>0 hrs</span>
                      <span style={{ color:"#22c55e" }}>AI saves: ${save.toFixed(0)}/mo</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Result card */}
            <div className="lg:col-span-2 lg:sticky lg:top-20 space-y-4">
              <div className="rounded-xl p-6 space-y-5"
                style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
                <div className="text-sm font-semibold">Monthly Savings</div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span style={{ color:"#7070a0" }}>Current cost</span>
                    <span>${total.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color:"#7070a0" }}>After AI</span>
                    <span>${(total-saved).toFixed(0)}</span>
                  </div>
                  <div className="h-px" style={{ background:"#25253f" }} />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Monthly savings</span>
                    <span className="text-2xl font-black" style={{ color:"#ff6b35" }}>
                      ${saved.toFixed(0)}
                    </span>
                  </div>
                </div>
                {saved > 0 && (
                  <div className="rounded-lg p-4 space-y-1"
                    style={{ background:"rgba(255,107,53,.08)", border:"1px solid rgba(255,107,53,.2)" }}>
                    <div className="text-xs font-semibold" style={{ color:"#ff6b35" }}>What this funds</div>
                    <p className="text-sm" style={{ color:"#f0f0f8" }}>
                      {geoMos > 0
                        ? <><strong>{geoMos} month{geoMos!==1?"s":""}</strong> of Avanti GEO monitoring — every month.</>
                        : "Increase hours above to see GEO months funded."}
                    </p>
                    {geoMos >= 1 && <div className="text-xs" style={{ color:"#7070a0" }}>Avanti Scale = ${GEO_PLAN}/mo</div>}
                  </div>
                )}
                <Link href="/signup"
                  className="block text-center text-sm font-medium px-4 py-2.5 rounded-lg transition-opacity hover:opacity-80"
                  style={{ background:"#ff6b35", color:"#fff" }}>
                  Sign up — Start Saving + GEO →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
