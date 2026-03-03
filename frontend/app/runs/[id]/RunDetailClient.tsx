"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ResponseExplorer from "./ResponseExplorer";
import { Lang, tx } from "@/lib/i18n";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";
const CALENDLY = "https://calendly.com/qw2379/geo-chat";

interface BrandRow {
  name: string;
  is_primary: boolean;
  sov: number;
  sov_high: number;
  sov_comp: number;
  sov_info: number;
  weighted_sov: number;
  mention_rate: number;
  mention_count: number;
}

interface IntentSection {
  intent_type: string;
  label: string;
  weight: number;
  count: number;
  brand_table: BrandRow[];
}

interface ProviderSection {
  provider: string;
  total: number;
  brand_table: BrandRow[];
  arrs: number;
  arrs_band: string;
  arrs_explain: string;
}

interface Metrics {
  total: number;
  arrs: number;
  arrs_band: string;
  arrs_explain: string;
  brand_table: BrandRow[];
  providers_used: string[];
  failed_count: number;
  intent_sections?: IntentSection[];
  provider_sections?: ProviderSection[];
}

interface SourceDomain {
  domain: string;
  citation_count: number;
  brand_mentioned: number;
  competitors_mentioned: Record<string, number>;
}

interface SourceOpportunity {
  domain: string;
  citation_count: number;
  top_competitor: string;
  competitor_mentions: number;
}

interface Sources {
  domains: SourceDomain[];
  opportunities: SourceOpportunity[];
  total_unique_domains: number;
}

interface RecommendationItem {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface Recommendation {
  id: string;
  run_id: string;
  brand_name: string;
  items: RecommendationItem[];
  generated_at: string;
  model_used: string;
}

interface Run {
  id: string;
  brand_name: string;
  competitor_names: string[];
  category: string;
  region: string;
  num_prompts: number;
  providers: string[];
  status: "queued" | "running" | "done" | "failed";
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  progress_total: number;
  progress_done: number;
  error_message: string | null;
}

const priorityStyle: Record<string, { bg: string; color: string }> = {
  high:   { bg: "rgba(255,77,109,0.12)",  color: "#ff4d6d" },
  medium: { bg: "rgba(245,166,35,0.12)",  color: "#f5a623" },
  low:    { bg: "rgba(34,197,94,0.12)",   color: "#22c55e" },
};

function statusStyle(s: string) {
  if (s === "done")    return { bg: "rgba(34,197,94,0.12)",  color: "#22c55e" };
  if (s === "running") return { bg: "rgba(255,107,53,0.12)", color: "#ff6b35" };
  if (s === "failed")  return { bg: "rgba(255,77,109,0.12)", color: "#ff4d6d" };
  return { bg: "rgba(245,166,35,0.12)", color: "#f5a623" };
}

function SovBar({ value, isPrimary, max = 100 }: { value: number; isPrimary: boolean; max?: number }) {
  const pct = Math.min(100, (value / Math.max(max, 1)) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ background: "#25253f" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: isPrimary ? "#ff6b35" : "#7070a0",
          }}
        />
      </div>
      <span className="text-xs w-10" style={{ color: isPrimary ? "#ff6b35" : "#7070a0" }}>
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

export default function RunDetailClient({
  id,
  initialRun,
  initialMetrics,
  initialRecommendations,
  initialSources,
  lang = "en",
}: {
  id: string;
  initialRun: Run;
  initialMetrics: Metrics | null;
  initialRecommendations: Recommendation | null;
  initialSources: Record<string, unknown> | null;
  lang?: Lang;
}) {
  const [run, setRun] = useState(initialRun);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [sources, setSources] = useState<Sources | null>(initialSources as Sources | null);

  const fetchAndUpdate = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/runs/${id}`, { cache: "no-store" });
      if (!res.ok) return;
      const updated: Run = await res.json();
      setRun(updated);

      if (updated.status === "done" && !metrics) {
        const [mRes, rRes, sRes] = await Promise.allSettled([
          fetch(`${BASE}/runs/${id}/metrics`, { cache: "no-store" }),
          fetch(`${BASE}/runs/${id}/recommendations`, { cache: "no-store" }),
          fetch(`${BASE}/runs/${id}/sources`, { cache: "no-store" }),
        ]);
        if (mRes.status === "fulfilled" && mRes.value.ok) setMetrics(await mRes.value.json());
        if (rRes.status === "fulfilled" && rRes.value.ok) setRecommendations(await rRes.value.json());
        if (sRes.status === "fulfilled" && sRes.value.ok) setSources(await sRes.value.json());
      }
    } catch {
      // ignore network errors during polling
    }
  }, [id, metrics]);

  useEffect(() => {
    if (run.status !== "running" && run.status !== "queued") return;
    const interval = setInterval(fetchAndUpdate, 3000);
    return () => clearInterval(interval);
  }, [run.status, fetchAndUpdate]);

  const primaryRow = metrics?.brand_table.find((r) => r.is_primary);
  const ss = statusStyle(run.status);
  const pct = run.progress_total > 0 ? Math.round((run.progress_done / run.progress_total) * 100) : 0;

  const maxSov = metrics
    ? Math.max(...metrics.brand_table.map((r) => r.weighted_sov), 1)
    : 100;

  const STATUS_LABEL: Record<string, string> = {
    done:    tx("runs", "statusDone",    lang),
    running: tx("runs", "statusRunning", lang),
    queued:  tx("runs", "statusQueued",  lang),
    failed:  tx("runs", "statusFailed",  lang),
  };

  const PRIORITY_LABEL: Record<string, string> = {
    high:   tx("runs", "priorityHigh",   lang),
    medium: tx("runs", "priorityMedium", lang),
    low:    tx("runs", "priorityLow",    lang),
  };

  const dashHref = lang === "zh" ? "/zh/dashboard" : "/dashboard";
  const brandHref = `${lang === "zh" ? "/zh" : ""}/brands/${encodeURIComponent(run.brand_name)}`;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href={dashHref} className="text-sm transition-colors hover:text-white" style={{ color: "#7070a0" }}>
          {tx("runs", "breadcrumbDash", lang)}
        </Link>
        <span style={{ color: "#25253f" }}>/</span>
        <Link href={brandHref} className="text-sm transition-colors hover:text-white" style={{ color: "#7070a0" }}>
          {run.brand_name}
        </Link>
        <span style={{ color: "#25253f" }}>/</span>
        <span className="text-sm font-mono" style={{ color: "#7070a0" }}>{id.slice(0, 8)}…</span>
      </div>

      {/* Run header */}
      <div className="rounded-xl p-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">{run.brand_name}</h1>
            <p className="text-sm mt-1" style={{ color: "#7070a0" }}>
              {run.category} · {run.region} · {run.providers.join(", ")}
            </p>
          </div>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: ss.bg, color: ss.color }}
          >
            {STATUS_LABEL[run.status] ?? run.status}
          </span>
        </div>

        {/* Live progress bar */}
        {(run.status === "running" || run.status === "queued") && (
          <div className="mt-5 space-y-2">
            <p className="text-sm font-medium" style={{ color: "#f0f0f8" }}>
              {lang === "zh"
                ? `正在向 AI 模型询问 ${run.brand_name}…`
                : `Asking AI models about ${run.brand_name}…`}
            </p>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "#25253f" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: "#ff6b35" }}
              />
            </div>
            <p className="text-xs" style={{ color: "#7070a0" }}>
              {pct}% · {run.progress_done} / {run.progress_total} {tx("runs", "queriesComplete", lang)}
            </p>
          </div>
        )}

        <div className="mt-5 grid grid-cols-3 gap-4 text-sm">
          {[
            { label: tx("runs", "labelPrompts",  lang), value: `${run.progress_done} / ${run.progress_total}` },
            { label: tx("runs", "labelStarted",  lang), value: run.started_at  ? new Date(run.started_at).toLocaleString()  : "—" },
            { label: tx("runs", "labelFinished", lang), value: run.finished_at ? new Date(run.finished_at).toLocaleString() : "—" },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-xs mb-0.5" style={{ color: "#7070a0" }}>{item.label}</div>
              <div className="font-medium">{item.value}</div>
            </div>
          ))}
        </div>

        {run.error_message && (
          <div
            className="mt-4 rounded p-3 text-sm"
            style={{ background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)", color: "#ff4d6d" }}
          >
            {run.error_message}
          </div>
        )}
      </div>

      {/* KPI cards */}
      {metrics && primaryRow && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl p-5" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="text-4xl font-black mb-1" style={{ color: "#f5a623" }}>
                {metrics.arrs}
              </div>
              <div className="text-sm font-semibold mb-0.5">{tx("runs", "arrsScore", lang)}</div>
              <div className="text-xs" style={{ color: "#7070a0" }}>{tx("runs", "arrsNote", lang)}</div>
            </div>
            {[
              { label: tx("runs", "weightedSov",   lang), value: `${primaryRow.weighted_sov.toFixed(1)}%`, note: tx("runs", "weightedSovNote",  lang) },
              { label: tx("runs", "highIntentSov", lang), value: `${primaryRow.sov_high.toFixed(1)}%`,    note: tx("runs", "highIntentSovNote", lang) },
              { label: tx("runs", "mentionRate",   lang), value: `${primaryRow.mention_rate.toFixed(1)}%`, note: tx("runs", "mentionRateNote",   lang) },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-xl p-5" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
                <div className="text-2xl font-bold mb-1">{kpi.value}</div>
                <div className="text-sm font-semibold mb-0.5">{kpi.label}</div>
                <div className="text-xs" style={{ color: "#7070a0" }}>{kpi.note}</div>
              </div>
            ))}
          </div>

          {metrics.arrs_explain && (
            <div className="rounded-xl p-4 text-sm" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <span className="font-semibold" style={{ color: "#f5a623" }}>{tx("runs", "insight", lang)} </span>
              <span style={{ color: "#7070a0" }}>{metrics.arrs_explain}</span>
            </div>
          )}
        </>
      )}

      {/* Brand comparison table with SOV bars */}
      {metrics && metrics.brand_table.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <div
            className="px-4 py-3 font-semibold text-sm"
            style={{ background: "#161625", borderBottom: "1px solid #25253f" }}
          >
            {tx("runs", "brandComparison", lang)}
          </div>
          <table className="w-full text-sm">
            <thead
              className="text-xs uppercase tracking-wide"
              style={{ background: "#161625", color: "#7070a0" }}
            >
              <tr>
                <th className="text-left px-4 py-2">{tx("runs", "colBrand",         lang)}</th>
                <th className="text-left px-4 py-2">{tx("runs", "colWeightedSov",   lang)}</th>
                <th className="text-left px-4 py-2">{tx("runs", "colHighIntent",    lang)}</th>
                <th className="text-left px-4 py-2">{tx("runs", "colComparison",    lang)}</th>
                <th className="text-left px-4 py-2">{tx("runs", "colInformational", lang)}</th>
              </tr>
            </thead>
            <tbody style={{ background: "#0f0f17" }}>
              {metrics.brand_table.map((row) => (
                <tr
                  key={row.name}
                  style={{
                    borderTop: "1px solid #25253f",
                    background: row.is_primary ? "rgba(255,107,53,0.04)" : undefined,
                  }}
                >
                  <td className="px-4 py-3 font-medium">
                    <span style={{ color: row.is_primary ? "#ff6b35" : "#f0f0f8" }}>
                      {row.name}
                    </span>
                    {row.is_primary && (
                      <span
                        className="text-xs ml-2 px-1.5 py-0.5 rounded font-medium"
                        style={{ background: "rgba(255,107,53,0.15)", color: "#ff6b35" }}
                      >
                        {tx("runs", "youBadge", lang)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <SovBar value={row.weighted_sov} isPrimary={row.is_primary} max={maxSov} />
                  </td>
                  <td className="px-4 py-3">
                    <SovBar value={row.sov_high} isPrimary={row.is_primary} max={maxSov} />
                  </td>
                  <td className="px-4 py-3">
                    <SovBar value={row.sov_comp} isPrimary={row.is_primary} max={maxSov} />
                  </td>
                  <td className="px-4 py-3">
                    <SovBar value={row.sov_info} isPrimary={row.is_primary} max={maxSov} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Intent breakdown */}
      {metrics?.intent_sections && metrics.intent_sections.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <div className="px-4 py-3 font-semibold text-sm" style={{ background: "#161625", borderBottom: "1px solid #25253f" }}>
            {tx("runs", "sovByIntent", lang)}
            <span className="text-xs ml-2 font-normal" style={{ color: "#7070a0" }}>
              {tx("runs", "intentWeightNote", lang)}
            </span>
          </div>
          <div className="grid md:grid-cols-3 divide-x" style={{ background: "#0f0f17", borderColor: "#25253f" }}>
            {metrics.intent_sections.map((section) => {
              const primary = section.brand_table.find((r) => r.is_primary);
              const topComp = section.brand_table
                .filter((r) => !r.is_primary)
                .sort((a, b) => b.weighted_sov - a.weighted_sov)[0];
              const gap = primary && topComp ? topComp.weighted_sov - primary.weighted_sov : null;
              return (
                <div key={section.intent_type} className="p-5" style={{ borderRight: "1px solid #25253f" }}>
                  <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7070a0" }}>
                    {section.label}
                    <span className="ml-1.5 font-normal normal-case">({section.count} {tx("runs", "queriesCount", lang)})</span>
                  </div>
                  {primary && (
                    <>
                      <div className="text-2xl font-black mb-0.5" style={{ color: "#ff6b35" }}>
                        {primary.weighted_sov.toFixed(1)}%
                      </div>
                      <div className="text-xs mb-3" style={{ color: "#7070a0" }}>{tx("runs", "yourWeightedSov", lang)}</div>
                      {topComp && (
                        <div className="text-xs">
                          <span style={{ color: "#7070a0" }}>{tx("runs", "vsTopComp", lang)} </span>
                          <span style={{ color: gap !== null && gap > 0 ? "#ff4d6d" : "#22c55e" }}>
                            {topComp.name}: {topComp.weighted_sov.toFixed(1)}%{" "}
                            {gap !== null && (gap > 0 ? `(−${gap.toFixed(1)}pp)` : `(+${Math.abs(gap).toFixed(1)}pp)`)}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Provider comparison */}
      {metrics?.provider_sections && metrics.provider_sections.length > 1 && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <div className="px-4 py-3 font-semibold text-sm" style={{ background: "#161625", borderBottom: "1px solid #25253f" }}>
            {tx("runs", "sovByProvider", lang)}
          </div>
          <div className="grid divide-x" style={{ gridTemplateColumns: `repeat(${metrics.provider_sections.length}, 1fr)`, background: "#0f0f17" }}>
            {metrics.provider_sections.map((ps) => {
              const primary = ps.brand_table.find((r) => r.is_primary);
              return (
                <div key={ps.provider} className="p-5" style={{ borderRight: "1px solid #25253f" }}>
                  <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7070a0" }}>
                    {ps.provider}
                    <span className="ml-1.5 font-normal normal-case">({ps.total} {tx("runs", "queriesCount", lang)})</span>
                  </div>
                  {primary && (
                    <>
                      <div className="text-2xl font-black mb-0.5" style={{ color: "#ff6b35" }}>
                        {primary.weighted_sov.toFixed(1)}%
                      </div>
                      <div className="text-xs mb-2" style={{ color: "#7070a0" }}>{tx("runs", "weightedSovLabel", lang)}</div>
                      <div className="text-xs" style={{ color: ps.arrs > 50 ? "#ff4d6d" : ps.arrs > 25 ? "#f5a623" : "#22c55e" }}>
                        {tx("runs", "arrsLabel", lang)} {ps.arrs}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Response Explorer */}
      {metrics && (
        <ResponseExplorer
          runId={id}
          brandName={run.brand_name}
          competitorNames={run.competitor_names ?? []}
        />
      )}

      {/* Source / Citation Analysis */}
      {sources && sources.total_unique_domains > 0 && (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
            <div className="px-4 py-3 font-semibold text-sm flex items-center justify-between" style={{ background: "#161625", borderBottom: "1px solid #25253f" }}>
              <span>{tx("runs", "citedSources", lang)}</span>
              <span className="text-xs font-normal" style={{ color: "#7070a0" }}>
                {sources.total_unique_domains}{" "}
                {tx("runs", sources.total_unique_domains !== 1 ? "uniqueDomainPlural" : "uniqueDomainSingular", lang)}
              </span>
            </div>
            <table className="w-full text-sm" style={{ background: "#0f0f17" }}>
              <thead className="text-xs uppercase tracking-wide" style={{ background: "#161625", color: "#7070a0" }}>
                <tr>
                  <th className="text-left px-4 py-2">{tx("runs", "colDomain",         lang)}</th>
                  <th className="text-right px-4 py-2">{tx("runs", "colCitations",      lang)}</th>
                  <th className="text-right px-4 py-2">{tx("runs", "colBrandMentioned", lang)}</th>
                </tr>
              </thead>
              <tbody>
                {sources.domains.slice(0, 10).map((d) => (
                  <tr key={d.domain} style={{ borderTop: "1px solid #25253f" }}>
                    <td className="px-4 py-2.5 font-mono text-xs">{d.domain}</td>
                    <td className="px-4 py-2.5 text-right text-xs" style={{ color: "#7070a0" }}>{d.citation_count}</td>
                    <td className="px-4 py-2.5 text-right">
                      {d.brand_mentioned > 0 ? (
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
                          ✓ {d.brand_mentioned}×
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: "#3a3a5c" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sources.opportunities.length > 0 && (
            <div className="rounded-xl p-5" style={{ background: "#0f0f17", border: "1px solid #f5a62333" }}>
              <div className="flex items-center gap-2 mb-4">
                <span style={{ color: "#f5a623" }}>⚡</span>
                <span className="font-semibold text-sm">{tx("runs", "contentOpps", lang)}</span>
                <span className="text-xs ml-1" style={{ color: "#7070a0" }}>
                  — {tx("runs", "contentOppsNote", lang)}
                </span>
              </div>
              <div className="space-y-2">
                {sources.opportunities.map((opp) => (
                  <div key={opp.domain} className="flex items-center justify-between rounded-lg px-4 py-2.5" style={{ background: "#161625" }}>
                    <div>
                      <span className="text-sm font-mono">{opp.domain}</span>
                      <span className="text-xs ml-3" style={{ color: "#7070a0" }}>
                        {lang === "zh"
                          ? `${opp.top_competitor} 被引用 ${opp.competitor_mentions}×`
                          : `${opp.top_competitor} cited ${opp.competitor_mentions}×`}
                      </span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(245,166,35,0.12)", color: "#f5a623" }}>
                      {opp.citation_count} {tx("runs", opp.citation_count !== 1 ? "citationPlural" : "citationSingular", lang)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.items.length > 0 && (
        <div className="rounded-xl p-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <h2 className="font-semibold mb-1">{tx("runs", "recTitle", lang)}</h2>
          <p className="text-xs mb-4" style={{ color: "#7070a0" }}>
            {lang === "zh"
              ? `由 ${recommendations.model_used} 生成 · ${new Date(recommendations.generated_at).toLocaleDateString()}`
              : `Generated by ${recommendations.model_used} · ${new Date(recommendations.generated_at).toLocaleDateString()}`}
          </p>
          <div className="space-y-3">
            {recommendations.items.map((item, i) => {
              const ps = priorityStyle[item.priority] ?? { bg: "rgba(112,112,160,0.12)", color: "#7070a0" };
              return (
                <div key={i} className="flex gap-3 p-4 rounded-xl" style={{ background: "#161625" }}>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium h-fit mt-0.5 shrink-0"
                    style={{ background: ps.bg, color: ps.color }}
                  >
                    {PRIORITY_LABEL[item.priority] ?? item.priority}
                  </span>
                  <div>
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs mt-1 leading-relaxed" style={{ color: "#7070a0" }}>
                      {item.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Book a call CTA */}
      {metrics && (
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: "linear-gradient(135deg, #0f0f17 0%, #161625 100%)",
            border: "1px solid #ff6b35",
          }}
        >
          <p className="font-bold text-lg mb-2">{tx("runs", "ctaTitle", lang)}</p>
          <p className="text-sm mb-6" style={{ color: "#7070a0" }}>
            {tx("runs", "ctaSub", lang)}
          </p>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            {tx("runs", "bookCall", lang)}
          </a>
        </div>
      )}
    </div>
  );
}
