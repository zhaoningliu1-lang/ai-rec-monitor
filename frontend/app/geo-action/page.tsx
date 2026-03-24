"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type Run, type GeoPlan, type CitationHealth, type MarketSignals } from "@/lib/api";
import { getToken } from "@/lib/auth";
import {
  GEO_BRANDS,
  CATEGORY_CONFIG,
  PRIORITY_CONFIG,
  EFFORT_CONFIG,
  type ActionCategory,
  type ActionPriority,
  type GeoAction,
} from "@/lib/geo-action-data";

// ── Types ────────────────────────────────────────────────────────────────────

type FilterPriority = "all" | ActionPriority;
type FilterCategory = "all" | ActionCategory;

interface PlanData {
  brand: string;
  category: string;
  currentGeoScore: number;
  projectedGeoScore: number;
  weaknesses: string[];
  actions: GeoAction[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function toPlanData(plan: GeoPlan): PlanData {
  return {
    brand: plan.brand_name,
    category: plan.category,
    currentGeoScore: plan.current_geo_score,
    projectedGeoScore: plan.projected_geo_score,
    weaknesses: plan.weaknesses,
    actions: plan.actions as GeoAction[],
  };
}

// ── Generate button with loading animation ───────────────────────────────────

const PROGRESS_STEPS = [
  "Analyzing scan metrics...",
  "Identifying citation gaps...",
  "Reviewing competitive losses...",
  "Building action plan...",
];

function GenerateButton({ onGenerate, generating }: { onGenerate: () => void; generating: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!generating) { setStep(0); return; }
    const timer = setInterval(() => setStep(s => (s + 1) % PROGRESS_STEPS.length), 2500);
    return () => clearInterval(timer);
  }, [generating]);

  if (generating) {
    return (
      <div className="rounded-2xl p-12 text-center space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <div className="inline-block w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#ff6b35", borderTopColor: "transparent" }} />
        <p className="text-sm font-medium" style={{ color: "#f0f0f8" }}>{PROGRESS_STEPS[step]}</p>
        <p className="text-xs" style={{ color: "#555580" }}>This takes ~10 seconds</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-12 text-center space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
      <div className="text-3xl mb-2">🎯</div>
      <p className="text-sm" style={{ color: "#9090b0" }}>
        No plan generated yet for this scan. Generate a custom AI Visibility Plan based on your scan data.
      </p>
      <button
        onClick={onGenerate}
        className="px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
        style={{ background: "#ff6b35", color: "#fff" }}
      >
        Generate AI Visibility Plan
      </button>
      <p className="text-xs" style={{ color: "#555580" }}>Costs 2 credits · Takes ~10 seconds</p>
    </div>
  );
}

// ── Action card rendering ────────────────────────────────────────────────────

function ActionCards({
  actions, filterPriority, filterCategory, expandedId, setExpandedId,
}: {
  actions: GeoAction[];
  filterPriority: FilterPriority;
  filterCategory: FilterCategory;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}) {
  const filtered = actions.filter(a => {
    if (filterPriority !== "all" && a.priority !== filterPriority) return false;
    if (filterCategory !== "all" && a.category !== filterCategory) return false;
    return true;
  });

  const priorityOrder: Record<ActionPriority, number> = { critical: 0, high: 1, medium: 2 };
  filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  if (filtered.length === 0) {
    return <div className="text-sm text-center py-8" style={{ color: "#555580" }}>No actions match this filter.</div>;
  }

  return (
    <div className="space-y-3">
      {filtered.map((action, i) => {
        const pConfig = PRIORITY_CONFIG[action.priority];
        const catConfig = CATEGORY_CONFIG[action.category];
        const effortConfig = EFFORT_CONFIG[action.effort];
        const isExpanded = expandedId === action.id;

        return (
          <div
            key={action.id}
            className="rounded-2xl overflow-hidden"
            style={{ background: "#0f0f17", border: `1px solid ${isExpanded ? pConfig.border : "#1a1a2e"}` }}
          >
            <button
              className="w-full px-5 py-4 flex items-start gap-3 text-left"
              onClick={() => setExpandedId(isExpanded ? null : action.id)}
            >
              <div
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mt-0.5"
                style={{ background: pConfig.bg, color: pConfig.color }}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: pConfig.color, background: pConfig.bg }}>
                    {pConfig.label}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#161625", color: "#9090b0" }}>
                    {catConfig.icon} {catConfig.label}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: "#22c55e" }}>{action.impact}</span>
                  <span className="text-xs ml-auto shrink-0" style={{ color: effortConfig.color }}>{effortConfig.label}</span>
                </div>
                <p className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>{action.title}</p>
              </div>
              <span className="shrink-0 text-xs mt-1" style={{ color: "#555580" }}>{isExpanded ? "▲" : "▼"}</span>
            </button>

            {isExpanded && (
              <div className="px-5 pb-5 space-y-3 border-t" style={{ borderColor: "#1a1a2e" }}>
                <div className="pt-3 space-y-3">
                  <div>
                    <div className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "#7070a0" }}>
                      Why This Matters for AI Visibility
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#9090b0" }}>{action.why}</p>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: "#161625", border: "1px solid #25253f" }}>
                    <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#60a5fa" }}>
                      How to Implement
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#c0c0d8" }}>{action.how}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Score gauge (SVG) ─────────────────────────────────────────────────────────

function ScoreGauge({ score, color }: { score: number; color: string }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={100} height={100} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={r} fill="none" stroke="#1a1a2e" strokeWidth={10} />
      <circle cx={50} cy={50} r={r} fill="none" stroke={color} strokeWidth={10}
        strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ / 4}
        strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease" }} />
      <text x={50} y={50} textAnchor="middle" dominantBaseline="central" fill="#f0f0f8" fontSize={18} fontWeight={700}>{score}</text>
      <text x={50} y={65} textAnchor="middle" fill="#7070a0" fontSize={8} fontWeight={500}>/100</text>
    </svg>
  );
}

// ── Citation Health panel ─────────────────────────────────────────────────────

const RISK_CONFIG = {
  critical: { label: "CRITICAL", color: "#ff4d6d", bg: "rgba(255,77,109,0.08)", border: "rgba(255,77,109,0.3)", desc: "High risk of AI citation removal" },
  warning:  { label: "WARNING",  color: "#f5a623", bg: "rgba(245,166,35,0.08)", border: "rgba(245,166,35,0.3)", desc: "Monitor closely — trending toward risk" },
  healthy:  { label: "HEALTHY",  color: "#22c55e", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.3)",  desc: "Strong citation profile" },
};

function CitationHealthPanel({ health, loading }: { health: CitationHealth | null; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-sm animate-pulse" style={{ color: "#7070a0" }}>Analyzing citation sources...</div>
      </div>
    );
  }

  if (!health || health.total_citations === 0) {
    return (
      <div className="rounded-2xl p-12 text-center space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <p className="text-sm" style={{ color: "#9090b0" }}>No citation data available for this scan.</p>
        <p className="text-xs" style={{ color: "#555580" }}>Citation health requires AI responses that include source URLs.</p>
      </div>
    );
  }

  const riskCfg = RISK_CONFIG[health.risk_level];

  return (
    <div className="space-y-6">
      {/* Risk header */}
      <div className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6"
        style={{ background: riskCfg.bg, border: `1px solid ${riskCfg.border}` }}>
        <ScoreGauge score={health.score} color={riskCfg.color} />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ background: riskCfg.bg, color: riskCfg.color, border: `1px solid ${riskCfg.border}` }}>
              {riskCfg.label}
            </span>
            <span className="text-xs" style={{ color: "#7070a0" }}>{riskCfg.desc}</span>
          </div>
          <p className="text-sm" style={{ color: "#9090b0" }}>
            Citation Health Score based on {health.total_citations} cited sources across all AI responses in this scan.
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
        <div className="px-6 py-4" style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
          <h3 className="font-semibold text-sm">Citation Source Breakdown</h3>
          <p className="text-xs mt-0.5" style={{ color: "#7070a0" }}>Where AI models are pulling citation data from</p>
        </div>

        {/* Visual bar */}
        <div className="px-6 pt-5 pb-4" style={{ background: "#0a0a12" }}>
          <div className="flex rounded-lg overflow-hidden h-4 gap-0.5 mb-2">
            {health.breakdown.map(b => (
              <div key={b.type} style={{ width: `${b.percent}%`, background: b.color, opacity: 0.85 }} title={`${b.label}: ${b.percent}%`} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {health.breakdown.map(b => (
              <div key={b.type} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: b.color }} />
                <span className="text-xs" style={{ color: "#7070a0" }}>{b.label} <strong style={{ color: "#f0f0f8" }}>{b.percent}%</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail rows */}
        <div className="divide-y" style={{ borderTop: "1px solid #1a1a2e" }}>
          {health.breakdown.map(b => (
            <div key={b.type} className="px-6 py-4 flex items-start gap-4" style={{ background: "#0a0a12" }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>{b.label}</span>
                  {b.risk_tag && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: b.risk_tag === "Critical" ? "rgba(255,77,109,0.12)" : "rgba(245,166,35,0.12)",
                        color: b.risk_tag === "Critical" ? "#ff4d6d" : "#f5a623",
                      }}>
                      {b.risk_tag}
                    </span>
                  )}
                </div>
                <div className="text-xs" style={{ color: "#7070a0" }}>{b.examples.join(" \u00b7 ")}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-2xl font-black" style={{ color: b.color }}>{b.percent}%</div>
                <div className="w-16 h-1.5 rounded-full mt-1 overflow-hidden" style={{ background: "#1a1a2e" }}>
                  <div className="h-full rounded-full" style={{ width: `${b.percent}%`, background: b.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Three Standards */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          The Three Standards of Healthy AI Citations
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { n: "\u2460", title: "Real Experts", desc: "Content authored or verified by domain experts. AI models weight expert-attributed content 4\u00d7 higher than anonymous sources.", color: "#22c55e" },
            { n: "\u2461", title: "Real Data", desc: "Technical specs with verifiable test sources \u2014 PDFs, lab certifications, independent benchmarks. AI prefers factual, data-backed claims.", color: "#f5a623" },
            { n: "\u2462", title: "Real Structure", desc: "Content following buyer decision journeys \u2014 comparison, use-case, problem-solution. Structured content gets 2.3\u00d7 more AI citations.", color: "#ff6b35" },
          ].map(s => (
            <div key={s.n} className="space-y-2">
              <div className="text-2xl font-black" style={{ color: s.color }}>{s.n}</div>
              <div className="font-semibold text-sm">{s.title}</div>
              <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Market Signals panel ───────────────────────────────────────────────────

const ALIGNMENT_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  strong:    { label: "Strong Alignment",    color: "#22c55e", bg: "rgba(34,197,94,0.08)" },
  moderate:  { label: "Moderate Alignment",  color: "#f5a623", bg: "rgba(245,166,35,0.08)" },
  weak:      { label: "Weak Alignment",      color: "#ff6b35", bg: "rgba(255,107,53,0.08)" },
  divergent: { label: "Divergent Signals",   color: "#ff4d6d", bg: "rgba(255,77,109,0.08)" },
};

const TREND_ARROW: Record<string, string> = { up: "↑", slightly_up: "↗", stable: "→", slightly_down: "↘", down: "↓", unknown: "–" };

function MarketSignalsPanel({ signals, loading }: { signals: MarketSignals | null; loading: boolean }) {
  if (loading) {
    return <div className="flex items-center justify-center py-16"><div className="text-sm animate-pulse" style={{ color: "#7070a0" }}>Fetching cross-platform market signals...</div></div>;
  }
  if (!signals) {
    return (
      <div className="rounded-2xl p-12 text-center space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <p className="text-sm" style={{ color: "#9090b0" }}>No market signal data available.</p>
        <p className="text-xs" style={{ color: "#555580" }}>Market signals require a completed scan with brand + category data.</p>
      </div>
    );
  }

  const alignment = ALIGNMENT_CONFIG[signals.alignment_label] ?? ALIGNMENT_CONFIG.moderate;

  return (
    <div className="space-y-6">
      {/* Alignment score header */}
      <div className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6"
        style={{ background: alignment.bg, border: `1px solid ${alignment.color}33` }}>
        <ScoreGauge score={signals.market_alignment_score} color={alignment.color} />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ background: alignment.bg, color: alignment.color, border: `1px solid ${alignment.color}44` }}>
              {alignment.label}
            </span>
          </div>
          <p className="text-sm" style={{ color: "#9090b0" }}>
            Market-AI Alignment Score — how well real market signals match this brand&apos;s AI visibility.
          </p>
          <p className="text-xs mt-1" style={{ color: "#555580" }}>
            Based on Reddit sentiment, YouTube KOL coverage, TikTok Shop presence, and Google search trends.
          </p>
        </div>
      </div>

      {/* 4 signal cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Reddit */}
        <div className="rounded-2xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧵</span>
              <span className="font-semibold text-sm">Reddit Sentiment</span>
            </div>
            <span className="text-2xl font-black" style={{ color: signals.reddit_score >= 60 ? "#22c55e" : signals.reddit_score >= 30 ? "#f5a623" : "#ff4d6d" }}>
              {signals.reddit_score}%
            </span>
          </div>
          <div className="flex gap-4 text-xs" style={{ color: "#7070a0" }}>
            <span>{signals.reddit_post_count} posts</span>
            <span>Sentiment: {signals.reddit_sentiment}</span>
          </div>
          {signals.reddit_top_posts.length > 0 && (
            <div className="space-y-1.5">
              {signals.reddit_top_posts.map((p, i) => (
                <div key={i} className="text-xs truncate" style={{ color: "#9090b0" }}>
                  <span style={{ color: "#555580" }}>↑{p.score}</span>{" "}
                  {p.url ? <a href={p.url} target="_blank" rel="noreferrer" className="hover:underline">{p.title}</a> : p.title}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* YouTube KOL */}
        <div className="rounded-2xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📹</span>
              <span className="font-semibold text-sm">YouTube KOL Coverage</span>
            </div>
            <span className="text-2xl font-black" style={{ color: signals.kol_count >= 5 ? "#22c55e" : signals.kol_count >= 2 ? "#f5a623" : "#555580" }}>
              {signals.kol_count}
            </span>
          </div>
          <div className="flex gap-4 text-xs" style={{ color: "#7070a0" }}>
            <span>{(signals.kol_total_views / 1000).toFixed(0)}K views</span>
            <span>{signals.kol_positive_pct}% positive</span>
          </div>
          {signals.kol_top_creators.length > 0 && (
            <div className="space-y-1.5">
              {signals.kol_top_creators.map((k, i) => (
                <div key={i} className="text-xs truncate" style={{ color: "#9090b0" }}>
                  <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: "#161625", color: "#7070a0" }}>{k.tier}</span>{" "}
                  {k.channel_name} — {(k.views / 1000).toFixed(0)}K views
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TikTok Shop */}
        <div className="rounded-2xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎵</span>
              <span className="font-semibold text-sm">TikTok Shop</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={signals.tiktok_present
                ? { background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }
                : { background: "#161625", color: "#555580" }
              }>
              {signals.tiktok_present ? (signals.tiktok_trending ? "Trending" : "Present") : "Not Found"}
            </span>
          </div>
          <div className="flex gap-4 text-xs" style={{ color: "#7070a0" }}>
            <span>{signals.tiktok_product_count} products</span>
            {signals.tiktok_avg_rating > 0 && <span>Avg rating: {signals.tiktok_avg_rating.toFixed(1)}</span>}
          </div>
          {signals.tiktok_top_products.length > 0 && (
            <div className="space-y-1.5">
              {signals.tiktok_top_products.map((p, i) => (
                <div key={i} className="text-xs truncate" style={{ color: "#9090b0" }}>
                  {p.title} — {p.price} · {p.sales} sales
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Google Trends */}
        <div className="rounded-2xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📈</span>
              <span className="font-semibold text-sm">Google Search Trend</span>
            </div>
            <span className="text-2xl font-black" style={{
              color: signals.google_trend_direction.includes("up") ? "#22c55e"
                : signals.google_trend_direction.includes("down") ? "#ff4d6d" : "#f5a623"
            }}>
              {TREND_ARROW[signals.google_trend_direction] ?? "–"}
            </span>
          </div>
          <div className="flex gap-4 text-xs" style={{ color: "#7070a0" }}>
            <span>Direction: {signals.google_trend_direction.replace("_", " ")}</span>
            {signals.google_delta !== null && <span>4-week delta: {signals.google_delta > 0 ? "+" : ""}{signals.google_delta.toFixed(1)}%</span>}
          </div>
        </div>
      </div>

      {/* Paid / Owned / Earned Media Triangle */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          Media Triangle: Earned vs Owned
        </div>
        <p className="text-xs" style={{ color: "#555580" }}>
          How your brand presence breaks down across media types (Paid data not yet available).
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Earned", score: signals.earned_score ?? 0, color: "#22c55e", sub: "Reddit + KOL + UGC" },
            { label: "Owned", score: signals.owned_score ?? 0, color: "#60a5fa", sub: "TikTok Shop + Brand Demand" },
            { label: "Paid", score: signals.paid_score ?? 0, color: "#7070a0", sub: "Coming soon" },
          ].map(m => (
            <div key={m.label} className="text-center p-4 rounded-xl" style={{ background: "#161625" }}>
              <div className="text-2xl font-black" style={{ color: m.color }}>{m.score}</div>
              <div className="text-xs font-semibold mt-1" style={{ color: m.color }}>{m.label}</div>
              <div className="text-[10px] mt-1" style={{ color: "#555580" }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Platform Consistency Audit */}
      {signals.consistency_signals && signals.consistency_signals.length > 0 && (
        <div className="rounded-2xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#f5a623" }}>
                Omnichannel Consistency Audit
              </div>
              <p className="text-xs mt-1" style={{ color: "#555580" }}>
                Are all platforms telling the same story about your brand?
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black" style={{
                color: signals.consistency_score >= 70 ? "#22c55e"
                  : signals.consistency_score >= 40 ? "#f5a623" : "#ff4d6d"
              }}>
                {signals.consistency_score}
              </div>
              <div className="text-[10px] uppercase" style={{ color: "#7070a0" }}>{signals.consistency_label}</div>
            </div>
          </div>
          <div className="space-y-2">
            {signals.consistency_signals.map((sig, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "#161625" }}>
                <div className="text-xs font-semibold w-24" style={{ color: "#c0c0d8" }}>{sig.source}</div>
                <div className="flex-1">
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "#25253f" }}>
                    <div className="h-full rounded-full" style={{
                      width: `${sig.score}%`,
                      background: sig.sentiment === "positive" ? "#22c55e"
                        : sig.sentiment === "negative" ? "#ff4d6d" : "#f5a623",
                    }} />
                  </div>
                </div>
                <div className="text-xs w-16 text-right" style={{
                  color: sig.sentiment === "positive" ? "#22c55e"
                    : sig.sentiment === "negative" ? "#ff4d6d" : "#f5a623",
                }}>
                  {sig.sentiment}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seasonal GEO Calendar */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#60a5fa" }}>
          US Promotional Calendar
        </div>
        <p className="text-xs" style={{ color: "#555580" }}>
          Key US shopping events — plan your GEO optimization 4-8 weeks ahead.
        </p>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {[
            { m: "Jan", e: "New Year", hot: false },
            { m: "Feb", e: "Valentine's", hot: false },
            { m: "Mar", e: "Spring", hot: false },
            { m: "Apr", e: "Easter", hot: false },
            { m: "May", e: "Mother's Day", hot: false },
            { m: "Jun", e: "Father's Day", hot: false },
            { m: "Jul", e: "Prime Day", hot: true },
            { m: "Aug", e: "Back to School", hot: false },
            { m: "Sep", e: "Labor Day", hot: false },
            { m: "Oct", e: "Halloween", hot: false },
            { m: "Nov", e: "Black Friday", hot: true },
            { m: "Dec", e: "Christmas", hot: true },
          ].map((month) => {
            const now = new Date();
            const monthIdx = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(month.m);
            const isCurrent = now.getMonth() === monthIdx;
            const isNext = now.getMonth() === (monthIdx - 1 + 12) % 12;
            return (
              <div key={month.m} className="text-center p-2 rounded-lg" style={{
                background: isCurrent ? "#ff6b3520" : isNext ? "#60a5fa15" : "#161625",
                border: isCurrent ? "1px solid #ff6b3550" : "1px solid transparent",
              }}>
                <div className="text-xs font-bold" style={{ color: isCurrent ? "#ff6b35" : isNext ? "#60a5fa" : "#9090b0" }}>
                  {month.m}
                </div>
                <div className="text-[9px] mt-0.5" style={{ color: "#555580" }}>
                  {month.e} {month.hot && "🔥"}
                </div>
                {isCurrent && <div className="text-[8px] mt-0.5" style={{ color: "#ff6b35" }}>NOW</div>}
                {isNext && <div className="text-[8px] mt-0.5" style={{ color: "#60a5fa" }}>PREP</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function GeoActionPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [planNotFound, setPlanNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // Filters
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("all");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Tabs: actions / health / signals
  const [activeTab, setActiveTab] = useState<"actions" | "health" | "signals">("actions");
  const [citationHealth, setCitationHealth] = useState<CitationHealth | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [marketSignals, setMarketSignals] = useState<MarketSignals | null>(null);
  const [signalsLoading, setSignalsLoading] = useState(false);

  // Load runs on mount
  useEffect(() => {
    if (!getToken()) {
      // No auth — show demo
      setIsDemo(true);
      const demo = GEO_BRANDS[0];
      setPlan({ brand: demo.brand, category: demo.category, currentGeoScore: demo.currentGeoScore, projectedGeoScore: demo.projectedGeoScore, weaknesses: demo.weaknesses, actions: demo.actions });
      setLoading(false);
      return;
    }
    api.listRuns()
      .then(allRuns => {
        const completed = allRuns.filter(r => r.status === "done");
        setRuns(completed);
        if (completed.length > 0) {
          setSelectedRunId(completed[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => { setError("Failed to load runs"); setLoading(false); });
  }, []);

  // Load plan when run selected
  useEffect(() => {
    if (!selectedRunId || isDemo) return;
    setLoading(true);
    setPlan(null);
    setPlanNotFound(false);
    setError(null);
    setFilterPriority("all");
    setFilterCategory("all");
    setExpandedId(null);
    setActiveTab("actions");
    setCitationHealth(null);
    setMarketSignals(null);
    api.getGeoPlan(selectedRunId)
      .then(p => { setPlan(toPlanData(p)); setPlanNotFound(false); })
      .catch(e => {
        if (String(e).includes("404")) setPlanNotFound(true);
        else setError("Failed to load plan");
      })
      .finally(() => setLoading(false));
  }, [selectedRunId, isDemo]);

  const handleGenerate = async () => {
    if (!selectedRunId) return;
    setGenerating(true);
    setError(null);
    try {
      const p = await api.createGeoPlan(selectedRunId);
      setPlan(toPlanData(p));
      setPlanNotFound(false);
    } catch (e) {
      setError(String(e));
    } finally {
      setGenerating(false);
    }
  };

  const handleTabSwitch = async (tab: "actions" | "health" | "signals") => {
    setActiveTab(tab);
    if (tab === "health" && !citationHealth && selectedRunId && !isDemo) {
      setHealthLoading(true);
      try {
        const resp = await api.getRunSources(selectedRunId);
        setCitationHealth(resp.citation_health);
      } catch {
        // Silently fail — panel will show "no data"
      } finally {
        setHealthLoading(false);
      }
    }
    if (tab === "signals" && !marketSignals && selectedRunId && !isDemo) {
      setSignalsLoading(true);
      try {
        const data = await api.getMarketSignals(selectedRunId);
        setMarketSignals(data);
      } catch {
        // Silently fail
      } finally {
        setSignalsLoading(false);
      }
    }
  };

  const scoreLift = plan ? plan.projectedGeoScore - plan.currentGeoScore : 0;
  const criticalCount = plan?.actions.filter(a => a.priority === "critical").length ?? 0;
  const highCount = plan?.actions.filter(a => a.priority === "high").length ?? 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.25)" }}
          >
            AI Visibility Plan
          </div>
          <div className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,107,53,0.08)", color: "#ff6b35" }}>
            Powered by Avanti
          </div>
        </div>
        <h1 className="text-3xl font-black">Your AI Visibility Playbook — Step by Step</h1>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "#9090b0" }}>
          Knowing your AI Visibility Score is only the start. This playbook tells you exactly what to fix, publish,
          and say — so AI models start citing your brand more accurately and more often.
        </p>
      </div>

      {/* Demo banner */}
      {isDemo && (
        <div
          className="rounded-xl p-4 flex items-center gap-4"
          style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.2)" }}
        >
          <span className="text-lg">🔍</span>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "#f0f0f8" }}>
              This is a demo plan. Sign in and run a scan to get your custom AI Visibility Plan.
            </p>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg text-sm font-medium shrink-0"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            Sign in
          </Link>
        </div>
      )}

      {/* Run selector (authenticated users with runs) */}
      {!isDemo && runs.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>
            Select Scan
          </div>
          <div className="flex gap-2 flex-wrap">
            {runs.slice(0, 8).map(r => {
              const active = r.id === selectedRunId;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRunId(r.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-colors"
                  style={
                    active
                      ? { background: "#1a1a2e", border: "1px solid #ff6b35", color: "#f0f0f8" }
                      : { background: "#0f0f17", border: "1px solid #25253f", color: "#7070a0" }
                  }
                >
                  <span>{r.brand_name}</span>
                  <span className="text-xs" style={{ color: "#555580" }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* No runs state */}
      {!isDemo && runs.length === 0 && !loading && (
        <div className="rounded-2xl p-12 text-center space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <p className="text-sm" style={{ color: "#9090b0" }}>
            Run your first AI visibility scan to get a custom AI Visibility Plan.
          </p>
          <Link
            href="/audit"
            className="inline-block px-6 py-3 rounded-xl text-sm font-semibold"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            Start Free Audit
          </Link>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-sm animate-pulse" style={{ color: "#7070a0" }}>Loading...</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg p-4 text-sm" style={{ background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)", color: "#ff4d6d" }}>
          {error}
        </div>
      )}

      {/* Plan not generated — show generate button */}
      {planNotFound && !generating && (
        <GenerateButton onGenerate={handleGenerate} generating={false} />
      )}

      {/* Generating in progress */}
      {generating && (
        <GenerateButton onGenerate={handleGenerate} generating={true} />
      )}

      {/* Plan loaded — render full UI */}
      {plan && !loading && !generating && (
        <>
          {/* Score projection card */}
          <div
            className="rounded-2xl p-6 grid md:grid-cols-3 gap-6"
            style={{ background: "#0f0f17", border: "1px solid rgba(96,165,250,0.25)" }}
          >
            <div className="flex flex-col justify-center">
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>
                Current AI Visibility Score
              </div>
              <div
                className="text-6xl font-black mb-1"
                style={{ color: plan.currentGeoScore >= 70 ? "#22c55e" : plan.currentGeoScore >= 40 ? "#f5a623" : "#ff4d6d" }}
              >
                {plan.currentGeoScore}
              </div>
              <div className="text-xs" style={{ color: "#555580" }}>Based on AI audit</div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="text-3xl" style={{ color: "#7070a0" }}>→</div>
              <div
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }}
              >
                +{scoreLift} points projected
              </div>
              <div className="text-xs text-center" style={{ color: "#555580" }}>
                {criticalCount} critical + {highCount} high priority actions
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>
                Projected After Plan
              </div>
              <div className="text-6xl font-black mb-1" style={{ color: "#22c55e" }}>
                {plan.projectedGeoScore}
              </div>
              <div className="text-xs" style={{ color: "#555580" }}>If all critical + high actions done</div>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2">
            {(["actions", "health", "signals"] as const).map(tab => (
              <button key={tab} onClick={() => handleTabSwitch(tab)}
                className="text-sm px-5 py-2 rounded-xl font-medium transition-colors"
                style={activeTab === tab
                  ? { background: "#1a1a2e", color: "#f0f0f8", border: "1px solid #ff6b35" }
                  : { background: "transparent", color: "#7070a0", border: "1px solid #25253f" }
                }>
                {tab === "actions" ? "Action Plan" : tab === "health" ? "Citation Health · 1 cr" : "Market Signals · 2 cr"}
              </button>
            ))}
          </div>

          {/* Citation Health tab */}
          {activeTab === "health" && (
            <CitationHealthPanel health={citationHealth} loading={healthLoading} />
          )}

          {/* Market Signals tab */}
          {activeTab === "signals" && (
            <MarketSignalsPanel signals={marketSignals} loading={signalsLoading} />
          )}

          {/* Actions tab */}
          {activeTab === "actions" && (
          <>
          {/* Weaknesses */}
          {plan.weaknesses.length > 0 && (
            <div
              className="rounded-2xl p-5 space-y-3"
              style={{ background: "rgba(255,77,109,0.04)", border: "1px solid rgba(255,77,109,0.2)" }}
            >
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#ff4d6d" }}>
                What&apos;s Holding Down Your AI Visibility Score
              </div>
              <ul className="space-y-2">
                {plan.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#9090b0" }}>
                    <span style={{ color: "#ff4d6d" }} className="shrink-0 mt-0.5">✗</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Filters + Action cards */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <div className="flex gap-2 flex-wrap">
                {(["all", "critical", "high", "medium"] as const).map(p => {
                  const cfg = p === "all" ? null : PRIORITY_CONFIG[p];
                  return (
                    <button
                      key={p}
                      onClick={() => setFilterPriority(p)}
                      className="text-xs px-3 py-1 rounded-lg border transition-colors capitalize"
                      style={
                        filterPriority === p
                          ? { background: cfg?.bg ?? "#ff6b3522", color: cfg?.color ?? "#ff6b35", border: `1px solid ${cfg?.border ?? "#ff6b3555"}` }
                          : { background: "#0f0f17", color: "#7070a0", border: "1px solid #25253f" }
                      }
                    >
                      {p === "all" ? "All" : cfg!.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterCategory("all")}
                  className="text-xs px-3 py-1 rounded-lg border transition-colors"
                  style={
                    filterCategory === "all"
                      ? { background: "#1a1a2e", color: "#f0f0f8", border: "1px solid #25253f" }
                      : { background: "transparent", color: "#7070a0", border: "1px solid transparent" }
                  }
                >
                  All types
                </button>
                {(Object.keys(CATEGORY_CONFIG) as ActionCategory[]).map(cat => {
                  const cfg = CATEGORY_CONFIG[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className="text-xs px-3 py-1 rounded-lg border transition-colors"
                      style={
                        filterCategory === cat
                          ? { background: "#1a1a2e", color: "#f0f0f8", border: "1px solid #25253f" }
                          : { background: "transparent", color: "#7070a0", border: "1px solid transparent" }
                      }
                    >
                      {cfg.icon} {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <ActionCards
              actions={plan.actions}
              filterPriority={filterPriority}
              filterCategory={filterCategory}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
            />
          </div>
          </>
          )}
        </>
      )}

      {/* How GEO Works — always show */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          How AI Visibility Optimization Works
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: "📡", title: "AI scrapes the open web", desc: "ChatGPT, Claude, and Gemini pull from your product pages, Reddit, review sites, and news articles. The quality and structure of that content determines what they say." },
            { icon: "⚡", title: "Structure beats content volume", desc: "A single well-structured FAQ with schema markup outperforms 10 blog posts. AI is a parser — give it clean, structured facts and it will cite them." },
            { icon: "📈", title: "AI visibility compounds over time", desc: "Each action reinforces the next. Correcting a spec on your product page + responding to a Reddit thread + getting one expert review creates a citation triangle that's hard to displace." },
          ].map(item => (
            <div key={item.icon} className="flex gap-3">
              <div className="text-xl shrink-0">{item.icon}</div>
              <div>
                <div className="font-semibold text-sm mb-1">{item.title}</div>
                <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-5"
        style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.2)" }}
      >
        <div className="flex-1">
          <div className="font-semibold mb-1">Get a custom AI visibility plan for your brand</div>
          <p className="text-sm" style={{ color: "#9090b0" }}>
            We&apos;ll audit your AI visibility, identify your top citation blockers, and give you a step-by-step playbook to fix them.
          </p>
        </div>
        <div className="flex gap-3 shrink-0 flex-wrap">
          <Link
            href="/audit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            Run Free Audit →
          </Link>
          <Link
            href="/hallucination"
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ border: "1px solid #25253f", color: "#f0f0f8" }}
          >
            Check Hallucination Score →
          </Link>
        </div>
      </div>
    </div>
  );
}
