"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GEO_BRANDS,
  CATEGORY_CONFIG,
  PRIORITY_CONFIG,
  EFFORT_CONFIG,
  type ActionCategory,
  type ActionPriority,
} from "@/lib/geo-action-data";

// ── Page ──────────────────────────────────────────────────────────────────────

type FilterPriority = "all" | ActionPriority;
type FilterCategory = "all" | ActionCategory;

export default function GeoActionPage() {
  const [selectedBrandId, setSelectedBrandId] = useState(GEO_BRANDS[0].id);
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("all");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const brand = GEO_BRANDS.find(b => b.id === selectedBrandId)!;
  const scoreLift = brand.projectedGeoScore - brand.currentGeoScore;

  const filteredActions = brand.actions.filter(a => {
    if (filterPriority !== "all" && a.priority !== filterPriority) return false;
    if (filterCategory !== "all" && a.category !== filterCategory) return false;
    return true;
  });

  // Sort: critical → high → medium
  const priorityOrder: Record<ActionPriority, number> = { critical: 0, high: 1, medium: 2 };
  filteredActions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const criticalCount = brand.actions.filter(a => a.priority === "critical").length;
  const highCount = brand.actions.filter(a => a.priority === "high").length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.25)" }}
          >
            GEO Action Plan
          </div>
          <div
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,107,53,0.08)", color: "#ff6b35" }}
          >
            Powered by Avanti
          </div>
        </div>
        <h1 className="text-3xl font-black">Your AI Visibility Playbook — Step by Step</h1>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "#9090b0" }}>
          Knowing your GEO score is only the start. This playbook tells you exactly what to fix, publish,
          and say — so AI models start citing your brand more accurately and more often.
        </p>
      </div>

      {/* Brand selector */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>
          Select Brand
        </div>
        <div className="flex gap-2 flex-wrap">
          {GEO_BRANDS.map(b => {
            const lift = b.projectedGeoScore - b.currentGeoScore;
            const active = b.id === selectedBrandId;
            return (
              <button
                key={b.id}
                onClick={() => { setSelectedBrandId(b.id); setFilterPriority("all"); setFilterCategory("all"); setExpandedId(null); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-colors"
                style={
                  active
                    ? { background: "#1a1a2e", border: "1px solid #ff6b35", color: "#f0f0f8" }
                    : { background: "#0f0f17", border: "1px solid #25253f", color: "#7070a0" }
                }
              >
                <span>{b.brand}</span>
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{ color: "#22c55e", background: "rgba(34,197,94,0.12)" }}
                >
                  +{lift}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Score projection card */}
      <div
        className="rounded-2xl p-6 grid md:grid-cols-3 gap-6"
        style={{ background: "#0f0f17", border: "1px solid rgba(96,165,250,0.25)" }}
      >
        {/* Current */}
        <div className="flex flex-col justify-center">
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>
            Current GEO Score
          </div>
          <div
            className="text-6xl font-black mb-1"
            style={{ color: brand.currentGeoScore >= 70 ? "#22c55e" : brand.currentGeoScore >= 40 ? "#f5a623" : "#ff4d6d" }}
          >
            {brand.currentGeoScore}
          </div>
          <div className="text-xs" style={{ color: "#555580" }}>Based on AI audit</div>
        </div>

        {/* Arrow + lift */}
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

        {/* Projected */}
        <div className="flex flex-col justify-center">
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>
            Projected After Plan
          </div>
          <div className="text-6xl font-black mb-1" style={{ color: "#22c55e" }}>
            {brand.projectedGeoScore}
          </div>
          <div className="text-xs" style={{ color: "#555580" }}>If all critical + high actions done</div>
        </div>
      </div>

      {/* Weaknesses */}
      <div
        className="rounded-2xl p-5 space-y-3"
        style={{ background: "rgba(255,77,109,0.04)", border: "1px solid rgba(255,77,109,0.2)" }}
      >
        <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#ff4d6d" }}>
          What&apos;s Holding Down Your GEO Score
        </div>
        <ul className="space-y-2">
          {brand.weaknesses.map((w, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#9090b0" }}>
              <span style={{ color: "#ff4d6d" }} className="shrink-0 mt-0.5">✗</span>
              {w}
            </li>
          ))}
        </ul>
      </div>

      {/* Action list */}
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-between items-center">
          {/* Priority filter */}
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
          {/* Category filter */}
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

        {/* Cards */}
        {filteredActions.length === 0 ? (
          <div className="text-sm text-center py-8" style={{ color: "#555580" }}>
            No actions match this filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActions.map((action, i) => {
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
                  {/* Header row — always visible */}
                  <button
                    className="w-full px-5 py-4 flex items-start gap-3 text-left"
                    onClick={() => setExpandedId(isExpanded ? null : action.id)}
                  >
                    {/* Step number */}
                    <div
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mt-0.5"
                      style={{ background: pConfig.bg, color: pConfig.color }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{ color: pConfig.color, background: pConfig.bg }}
                        >
                          {pConfig.label}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ background: "#161625", color: "#9090b0" }}
                        >
                          {catConfig.icon} {catConfig.label}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: "#22c55e" }}>
                          {action.impact}
                        </span>
                        <span className="text-xs ml-auto shrink-0" style={{ color: effortConfig.color }}>
                          {effortConfig.label}
                        </span>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>
                        {action.title}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs mt-1" style={{ color: "#555580" }}>
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Expanded body */}
                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-3 border-t" style={{ borderColor: "#1a1a2e" }}>
                      <div className="pt-3 space-y-3">
                        <div>
                          <div className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "#7070a0" }}>
                            Why This Matters for GEO
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: "#9090b0" }}>
                            {action.why}
                          </p>
                        </div>
                        <div
                          className="rounded-xl p-4"
                          style={{ background: "#161625", border: "1px solid #25253f" }}
                        >
                          <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#60a5fa" }}>
                            How to Implement
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: "#c0c0d8" }}>
                            {action.how}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* What is GEO */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          How GEO Optimization Works
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: "📡",
              title: "AI scrapes the open web",
              desc: "ChatGPT, Claude, and Gemini pull from your product pages, Reddit, review sites, and news articles. The quality and structure of that content determines what they say.",
            },
            {
              icon: "⚡",
              title: "Structure beats content volume",
              desc: "A single well-structured FAQ with schema markup outperforms 10 blog posts. AI is a parser — give it clean, structured facts and it will cite them.",
            },
            {
              icon: "📈",
              title: "GEO compounds over time",
              desc: "Each action reinforces the next. Correcting a spec on your product page + responding to a Reddit thread + getting one expert review creates a citation triangle that's hard to displace.",
            },
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
          <div className="font-semibold mb-1">Get a custom GEO action plan for your brand</div>
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
