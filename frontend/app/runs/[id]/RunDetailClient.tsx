"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ResponseExplorer from "./ResponseExplorer";
import { Lang, tx } from "@/lib/i18n";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";
const CALENDLY = "https://calendly.com/brivesubscription/30min";

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
  domain_type: string;
  citation_count: number;
  brand_mentioned: number;
  competitors_data: Record<string, number>;
  top_competitor: string;
  competitor_mentions: number;
  competitor_total: number;
  gap: number;
  opportunity_score: number;
  priority: "high" | "medium" | "low";
  is_pure_gap: boolean;
}

interface Sources {
  domains: SourceDomain[];
  opportunities: SourceOpportunity[];
  total_unique_domains: number;
  gap_count: number;
  pure_gap_count: number;
}

interface RecommendationItem {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface TrendPoint {
  snapshot_at: string;
  arrs: number;
  weighted_sov: number;
}

interface WhyAnalysis {
  top_reasons: string[];
  competitor_advantages: { competitor: string; edge: string }[];
  brand_gaps: string[];
  quick_wins: string[];
  sample_size: number;
  total_losses: number;
  error?: string;
  message?: string;
}

interface ContentBrief {
  domain: string;
  content_type: string;
  headline: string;
  draft_intro: string;
  key_points: string[];
  effort: string;
  impact: string;
  rationale: string;
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
  run_code: string | null;
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

const oppPriorityConfig = {
  high:   { border: "#ff4d6d44", badge: { bg: "rgba(255,77,109,0.15)", color: "#ff4d6d" }, label: { en: "HIGH",   zh: "高优先" } },
  medium: { border: "#f5a62344", badge: { bg: "rgba(245,166,35,0.15)", color: "#f5a623" }, label: { en: "MEDIUM", zh: "中优先" } },
  low:    { border: "#25253f",   badge: { bg: "rgba(112,112,160,0.15)", color: "#7070a0" }, label: { en: "LOW",    zh: "低优先" } },
} as const;

function GapBar({
  brandName, brandCount, competitorsData, maxVal,
}: {
  brandName: string;
  brandCount: number;
  competitorsData: Record<string, number>;
  maxVal: number;
}) {
  const scale = Math.max(maxVal, 1);
  return (
    <div className="space-y-1.5 mt-3">
      <div className="flex items-center gap-2">
        <span className="text-xs w-20 truncate text-right shrink-0" style={{ color: "#ff6b35" }}>{brandName}</span>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#25253f" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${(brandCount / scale) * 100}%`, background: brandCount > 0 ? "#ff6b35" : "transparent" }}
          />
        </div>
        <span className="text-xs w-5 text-right shrink-0" style={{ color: brandCount > 0 ? "#ff6b35" : "#3a3a5c" }}>
          {brandCount}
        </span>
      </div>
      {Object.entries(competitorsData).sort(([, a], [, b]) => b - a).map(([name, count]) => (
        <div key={name} className="flex items-center gap-2">
          <span className="text-xs w-20 truncate text-right shrink-0" style={{ color: "#7070a0" }}>{name}</span>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#25253f" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${(count / scale) * 100}%`, background: "#7070a0" }}
            />
          </div>
          <span className="text-xs w-5 text-right shrink-0" style={{ color: "#7070a0" }}>{count}</span>
        </div>
      ))}
    </div>
  );
}

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
  // User tier for SaaS gating
  const [userTier, setUserTier] = useState<string>("guest");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  // Phase 4 — Actionable Intelligence
  const [trendData, setTrendData] = useState<TrendPoint[] | null>(null);
  const [whyAnalysis, setWhyAnalysis] = useState<WhyAnalysis | null>(null);
  const [contentBriefs, setContentBriefs] = useState<ContentBrief[] | null>(null);
  const [whyLoading, setWhyLoading] = useState(false);
  const [briefsLoading, setBriefsLoading] = useState(false);

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
        if (mRes.status === "fulfilled" && mRes.value.ok) {
          const m = await mRes.value.json();
          setMetrics(m);
          // Fetch trend data once we know the brand name
          fetch(`${BASE}/brands/${encodeURIComponent(updated.brand_name)}/trends?days=180`, { cache: "no-store" })
            .then((r) => r.ok ? r.json() : null)
            .then((data) => { if (data?.length > 1) setTrendData(data); })
            .catch(() => null);
        }
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

  // Fetch trend data on initial load if run is already done
  useEffect(() => {
    if (initialMetrics && initialRun.status === "done") {
      fetch(`${BASE}/brands/${encodeURIComponent(initialRun.brand_name)}/trends?days=180`, { cache: "no-store" })
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data?.length > 1) setTrendData(data); })
        .catch(() => null);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch user tier for SaaS gating
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("avanti_token") : null;
    if (!token) { setUserTier("guest"); return; }
    fetch(`${BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : null)
      .then((u) => setUserTier(u?.subscription_tier ?? "guest"))
      .catch(() => setUserTier("guest"));
  }, []);

  const canDownload = ["growth", "scale", "enterprise"].includes(userTier);
  const isGuest = userTier === "guest";

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
      {/* Print-only header with Avanti branding */}
      <div className="print-only print-header">
        <div>
          <div className="print-header-logo">AVANTI</div>
          <div className="print-header-sub">AI Visibility Report</div>
        </div>
        <div className="print-header-meta">
          <div style={{ fontWeight: 600 }}>{run.brand_name}</div>
          <div>{run.category} · {run.region}</div>
          <div>{run.run_code ?? id.slice(0, 8)}</div>
          <div>{run.finished_at ? new Date(run.finished_at).toLocaleDateString() : new Date(run.created_at).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Breadcrumb + Download button */}
      <div className="no-print flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={dashHref} className="text-sm transition-colors hover:text-white" style={{ color: "#7070a0" }}>
            {tx("runs", "breadcrumbDash", lang)}
          </Link>
          <span style={{ color: "#25253f" }}>/</span>
          <Link href={brandHref} className="text-sm transition-colors hover:text-white" style={{ color: "#7070a0" }}>
            {run.brand_name}
          </Link>
          <span style={{ color: "#25253f" }}>/</span>
          <span className="text-sm font-mono" style={{ color: "#7070a0" }}>
            {run.run_code ?? id.slice(0, 8) + "…"}
          </span>
        </div>
        {metrics && (
          canDownload ? (
            <button
              onClick={() => window.print()}
              className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
              style={{ background: "#161625", border: "1px solid #25253f", color: "#7070a0", cursor: "pointer" }}
            >
              {tx("runs", "downloadPdf", lang)}
            </button>
          ) : (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
              style={{ background: "#161625", border: "1px solid #25253f", color: "#7070a0", cursor: "pointer" }}
              title={lang === "zh" ? "升级后可下载干净 PDF" : "Upgrade to download clean PDF"}
            >
              {tx("runs", "downloadPdf", lang)} 🔒
            </button>
          )
        )}
      </div>

      {/* Upgrade modal */}
      {showUpgradeModal && (
        <div
          className="no-print fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(9,9,15,0.85)" }}
          onClick={() => setShowUpgradeModal(false)}
        >
          <div
            className="rounded-2xl p-8 max-w-md w-full mx-4 text-center"
            style={{ background: "#0f0f17", border: "1px solid #ff6b35" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-2xl mb-3">⬆️</div>
            <h2 className="text-lg font-bold mb-2">
              {lang === "zh" ? "升级解锁干净 PDF 下载" : "Upgrade for Clean PDF Download"}
            </h2>
            <p className="text-sm mb-6" style={{ color: "#7070a0" }}>
              {lang === "zh"
                ? "Growth 及以上套餐可下载无水印专业 PDF 报告。免费用户可在浏览器中查看完整数据。"
                : "Growth plan and above can download professional PDF reports with no watermark. Free users can view all data in browser."}
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href="/settings?tab=billing"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "#ff6b35", color: "#fff" }}
              >
                {lang === "zh" ? "查看套餐 →" : "View Plans →"}
              </a>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm"
                style={{ border: "1px solid #25253f", color: "#7070a0" }}
              >
                {lang === "zh" ? "关闭" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

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

          {/* ── Visibility Trend Chart ─────────────────────────────── */}
          {trendData && trendData.length > 1 && (
            <div className="rounded-xl p-5" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold">
                  {lang === "zh" ? "可见度趋势" : "Visibility Trend"}
                </h2>
                <span className="text-xs" style={{ color: "#7070a0" }}>
                  {lang === "zh" ? "近 180 天" : "Last 180 days"}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={trendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#25253f" />
                  <XAxis
                    dataKey="snapshot_at"
                    tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    tick={{ fontSize: 10, fill: "#7070a0" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "#7070a0" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#161625", border: "1px solid #25253f", borderRadius: 8, fontSize: 12 }}
                    labelFormatter={(v) => new Date(v).toLocaleDateString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="arrs"
                    stroke="#f5a623"
                    strokeWidth={2}
                    dot={false}
                    name="GEO Score"
                  />
                  <Line
                    type="monotone"
                    dataKey="weighted_sov"
                    stroke="#ff6b35"
                    strokeWidth={2}
                    dot={false}
                    name="Weighted SOV"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2">
                {[
                  { color: "#f5a623", label: "GEO Score" },
                  { color: "#ff6b35", label: "Weighted SOV" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 rounded-full" style={{ background: l.color }} />
                    <span className="text-xs" style={{ color: "#7070a0" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Brand comparison table with SOV bars */}
      {metrics && metrics.brand_table.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <div
            className="px-4 py-3 font-semibold text-sm flex items-center justify-between"
            style={{ background: "#161625", borderBottom: "1px solid #25253f" }}
          >
            <span>{tx("runs", "brandComparison", lang)}</span>
            {isGuest && (
              <a
                href="/login"
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.3)" }}
              >
                {lang === "zh" ? "登录查看竞品数据 →" : "Sign in to see competitor data →"}
              </a>
            )}
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
              {metrics.brand_table.map((row) => {
                const blur = isGuest && !row.is_primary;
                return (
                <tr
                  key={row.name}
                  style={{
                    borderTop: "1px solid #25253f",
                    background: row.is_primary ? "rgba(255,107,53,0.04)" : undefined,
                    filter: blur ? "blur(5px)" : undefined,
                    userSelect: blur ? "none" : undefined,
                    pointerEvents: blur ? "none" : undefined,
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
                );
              })}
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

      {/* ── Source Opportunity Panel (Phase 2) ─────────────────── */}
      {sources && sources.total_unique_domains > 0 && (
        <div className="space-y-5">

          {/* Section header + summary */}
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-base font-bold">
                {lang === "zh" ? "来源机会面板" : "Source Opportunity Panel"}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#7070a0" }}>
                {lang === "zh"
                  ? `AI 回复引用了 ${sources.total_unique_domains} 个域名 · 发现 ${sources.pure_gap_count ?? 0} 个零曝光缺口`
                  : `AI cited ${sources.total_unique_domains} domains · ${sources.pure_gap_count ?? 0} gap${sources.pure_gap_count !== 1 ? "s" : ""} where you're absent`}
              </p>
            </div>
            {sources.gap_count > 0 && (
              <span
                className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{ background: "rgba(255,77,109,0.12)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.25)" }}
              >
                {sources.gap_count} {lang === "zh" ? "个机会待抓取" : `opportunit${sources.gap_count !== 1 ? "ies" : "y"} found`}
              </span>
            )}
          </div>

          {/* Opportunity cards */}
          {sources.opportunities.length > 0 && (
            <div className="space-y-3">
              {sources.opportunities.map((opp) => {
                const pc = oppPriorityConfig[opp.priority];
                const maxMentions = Math.max(opp.competitor_total, opp.brand_mentioned, 1);
                return (
                  <div
                    key={opp.domain}
                    className="rounded-xl p-5"
                    style={{ background: "#0f0f17", border: `1px solid ${pc.border}` }}
                  >
                    {/* Card top row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="text-xs px-2 py-0.5 rounded font-bold tracking-widest"
                            style={{ background: pc.badge.bg, color: pc.badge.color }}
                          >
                            {pc.label[lang]}
                          </span>
                          <span
                            className="text-xs px-2 py-0.5 rounded font-medium"
                            style={{ background: "rgba(112,112,160,0.1)", color: "#7070a0" }}
                          >
                            {opp.domain_type}
                          </span>
                          {opp.is_pure_gap && (
                            <span
                              className="text-xs px-2 py-0.5 rounded font-medium"
                              style={{ background: "rgba(255,77,109,0.1)", color: "#ff4d6d" }}
                            >
                              {lang === "zh" ? "零曝光" : "Not present"}
                            </span>
                          )}
                        </div>
                        <div className="mt-1.5 text-sm font-bold font-mono">{opp.domain}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xl font-black" style={{ color: pc.badge.color }}>
                          {opp.opportunity_score}
                        </div>
                        <div className="text-xs" style={{ color: "#7070a0" }}>
                          {lang === "zh" ? "机会分" : "opp. score"}
                        </div>
                      </div>
                    </div>

                    {/* Gap visualization */}
                    <GapBar
                      brandName={run.brand_name}
                      brandCount={opp.brand_mentioned}
                      competitorsData={opp.competitors_data}
                      maxVal={maxMentions}
                    />

                    {/* Bottom row: citation count + gap summary + CTA */}
                    <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                      <p className="text-xs" style={{ color: "#7070a0" }}>
                        {lang === "zh"
                          ? `被引用 ${opp.citation_count} 次 · 竞品领先 ${opp.gap} 次提及`
                          : `Cited in ${opp.citation_count} response${opp.citation_count !== 1 ? "s" : ""} · competitors lead by ${opp.gap} mention${opp.gap !== 1 ? "s" : ""}`}
                      </p>
                      <a
                        href={`https://${opp.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80 shrink-0"
                        style={{ background: "#161625", border: "1px solid #25253f", color: "#7070a0" }}
                      >
                        {lang === "zh" ? "访问该域名 →" : "Visit domain →"}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {sources.opportunities.length === 0 && (
            <div
              className="rounded-xl p-6 text-center"
              style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}
            >
              <div className="text-2xl mb-2">✓</div>
              <p className="text-sm font-semibold" style={{ color: "#22c55e" }}>
                {lang === "zh" ? "暂无内容缺口" : "No content gaps detected"}
              </p>
              <p className="text-xs mt-1" style={{ color: "#7070a0" }}>
                {lang === "zh"
                  ? "你的品牌在所有被引用域名中都有出现"
                  : "Your brand appears across all cited domains"}
              </p>
            </div>
          )}

          {/* All cited domains — collapsible detail table */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
            <div className="px-4 py-3 text-sm flex items-center justify-between" style={{ background: "#161625", borderBottom: "1px solid #25253f" }}>
              <span className="font-semibold">{tx("runs", "citedSources", lang)}</span>
              <span className="text-xs font-normal" style={{ color: "#7070a0" }}>
                {sources.total_unique_domains}{" "}
                {tx("runs", sources.total_unique_domains !== 1 ? "uniqueDomainPlural" : "uniqueDomainSingular", lang)}
              </span>
            </div>
            <table className="w-full text-sm" style={{ background: "#0f0f17" }}>
              <thead className="text-xs uppercase tracking-wide" style={{ background: "#161625", color: "#7070a0" }}>
                <tr>
                  <th className="text-left px-4 py-2">{tx("runs", "colDomain", lang)}</th>
                  <th className="text-right px-4 py-2">{tx("runs", "colCitations", lang)}</th>
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
        </div>
      )}

      {/* ── Why You're Losing Analysis ─────────────────────────── */}
      {metrics && run.competitor_names.length > 0 && (
        <div className="no-print rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ background: "#161625", borderBottom: whyAnalysis ? "1px solid #25253f" : undefined }}
          >
            <div>
              <h2 className="text-sm font-semibold">
                {lang === "zh" ? "为什么被 AI 忽略？" : "Why is AI skipping you?"}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#7070a0" }}>
                {lang === "zh"
                  ? "分析 AI 优先推荐竞品而非你品牌的根本原因"
                  : "Root-cause analysis of why AI recommends competitors over you"}
              </p>
            </div>
            {!whyAnalysis && (
              <button
                onClick={async () => {
                  setWhyLoading(true);
                  try {
                    const r = await fetch(`${BASE}/runs/${id}/why-analysis`, { cache: "no-store" });
                    if (r.ok) setWhyAnalysis(await r.json());
                  } catch { /* ignore */ }
                  setWhyLoading(false);
                }}
                disabled={whyLoading}
                className="text-xs px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-80 disabled:opacity-50 shrink-0"
                style={{ background: "rgba(245,166,35,0.15)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.3)" }}
              >
                {whyLoading
                  ? (lang === "zh" ? "分析中…" : "Analyzing…")
                  : (lang === "zh" ? "✦ 生成分析" : "✦ Analyze")}
              </button>
            )}
          </div>

          {whyAnalysis && !whyAnalysis.error && (
            <div className="p-5 space-y-5" style={{ background: "#0f0f17" }}>
              <p className="text-xs" style={{ color: "#7070a0" }}>
                {lang === "zh"
                  ? `基于 ${whyAnalysis.sample_size} 个竞品被提及而你未被提及的样本分析`
                  : `Based on ${whyAnalysis.sample_size} examples where competitors were mentioned but you weren't`}
              </p>

              {/* Top reasons */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#ff4d6d" }}>
                  {lang === "zh" ? "被跳过的主要原因" : "Why you're being skipped"}
                </h3>
                <ul className="space-y-2">
                  {(whyAnalysis.top_reasons ?? []).map((r, i) => (
                    <li key={i} className="flex gap-2.5 text-sm">
                      <span className="shrink-0 mt-0.5" style={{ color: "#ff4d6d" }}>✗</span>
                      <span style={{ color: "#c0c0d8" }}>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Competitor edges */}
              {(whyAnalysis.competitor_advantages ?? []).length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#f5a623" }}>
                    {lang === "zh" ? "竞品被选中的原因" : "Why competitors get chosen"}
                  </h3>
                  <div className="space-y-1.5">
                    {whyAnalysis.competitor_advantages.map((ca, i) => (
                      <div key={i} className="flex gap-2 text-xs">
                        <span className="font-medium shrink-0" style={{ color: "#f5a623" }}>{ca.competitor}:</span>
                        <span style={{ color: "#7070a0" }}>{ca.edge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick wins */}
              <div className="rounded-xl p-4" style={{ background: "#161625", border: "1px solid #22c55e33" }}>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#22c55e" }}>
                  {lang === "zh" ? "立即可做的 3 件事" : "3 quick wins to start"}
                </h3>
                <ul className="space-y-2">
                  {(whyAnalysis.quick_wins ?? []).map((w, i) => (
                    <li key={i} className="flex gap-2.5 text-sm">
                      <span className="shrink-0 font-bold" style={{ color: "#22c55e" }}>{i + 1}.</span>
                      <span style={{ color: "#c0c0d8" }}>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brand gaps */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>
                  {lang === "zh" ? "需要填补的内容缺口" : "Content gaps to close"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(whyAnalysis.brand_gaps ?? []).map((g, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#161625", border: "1px solid #25253f", color: "#7070a0" }}>
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {whyAnalysis?.error && (
            <div className="p-5 text-sm text-center" style={{ color: "#7070a0", background: "#0f0f17" }}>
              {whyAnalysis.message ?? (lang === "zh" ? "暂无足够数据进行分析" : "Not enough data for analysis")}
            </div>
          )}
        </div>
      )}

      {/* ── Content Brief Generator ───────────────────────────────── */}
      {sources && sources.gap_count > 0 && (
        <div className="no-print rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ background: "#161625", borderBottom: contentBriefs ? "1px solid #25253f" : undefined }}
          >
            <div>
              <h2 className="text-sm font-semibold">
                {lang === "zh" ? "内容执行简报" : "Content Execution Briefs"}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#7070a0" }}>
                {lang === "zh"
                  ? "针对每个高优先级来源缺口，AI 生成可直接执行的内容方案"
                  : "For each high-priority gap, get a specific, publishable content plan"}
              </p>
            </div>
            {!contentBriefs && (
              <button
                onClick={async () => {
                  setBriefsLoading(true);
                  try {
                    const r = await fetch(`${BASE}/runs/${id}/content-briefs`, { cache: "no-store" });
                    if (r.ok) setContentBriefs(await r.json());
                  } catch { /* ignore */ }
                  setBriefsLoading(false);
                }}
                disabled={briefsLoading}
                className="text-xs px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-80 disabled:opacity-50 shrink-0"
                style={{ background: "rgba(255,107,53,0.15)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.3)" }}
              >
                {briefsLoading
                  ? (lang === "zh" ? "生成中…" : "Generating…")
                  : (lang === "zh" ? "✦ 生成内容简报" : "✦ Generate Briefs")}
              </button>
            )}
          </div>

          {contentBriefs && contentBriefs.length === 0 && (
            <div className="p-6 text-sm text-center" style={{ color: "#7070a0", background: "#0f0f17" }}>
              {lang === "zh" ? "没有找到高优先级的来源机会" : "No high-priority gap opportunities found"}
            </div>
          )}

          {contentBriefs && contentBriefs.length > 0 && (
            <div className="space-y-0" style={{ background: "#0f0f17" }}>
              {contentBriefs.map((brief, i) => {
                const effortColor = brief.effort === "low" ? "#22c55e" : brief.effort === "medium" ? "#f5a623" : "#ff4d6d";
                const impactColor = brief.impact === "high" ? "#ff6b35" : brief.impact === "medium" ? "#f5a623" : "#7070a0";
                return (
                  <div
                    key={i}
                    className="p-5"
                    style={{ borderBottom: i < contentBriefs.length - 1 ? "1px solid #1a1a2e" : undefined }}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "#161625", color: "#7070a0" }}>
                            {brief.domain}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: "rgba(255,107,53,0.1)", color: "#ff6b35" }}>
                            {brief.content_type}
                          </span>
                        </div>
                        <div className="font-semibold text-sm">{brief.headline}</div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.3)", color: effortColor, border: `1px solid ${effortColor}44` }}>
                          {lang === "zh" ? "工作量" : "effort"}: {brief.effort}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.3)", color: impactColor, border: `1px solid ${impactColor}44` }}>
                          {lang === "zh" ? "影响力" : "impact"}: {brief.impact}
                        </span>
                      </div>
                    </div>

                    {/* Draft intro */}
                    <div
                      className="rounded-lg p-3 text-xs leading-relaxed mb-3 italic"
                      style={{ background: "#161625", color: "#c0c0d8", borderLeft: "3px solid #ff6b35" }}
                    >
                      &ldquo;{brief.draft_intro}&rdquo;
                    </div>

                    {/* Key points */}
                    <ul className="space-y-1 mb-3">
                      {brief.key_points.map((pt, j) => (
                        <li key={j} className="flex gap-2 text-xs">
                          <span style={{ color: "#ff6b35" }}>→</span>
                          <span style={{ color: "#7070a0" }}>{pt}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Rationale */}
                    <p className="text-xs" style={{ color: "#4a4a6a" }}>
                      <span className="font-medium" style={{ color: "#555580" }}>
                        {lang === "zh" ? "AI 引用逻辑：" : "Why AI will cite you: "}
                      </span>
                      {brief.rationale}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Response Explorer — hidden in print (interactive only) */}
      {metrics && (
        <div className="no-print">
          <ResponseExplorer
            runId={id}
            brandName={run.brand_name}
            competitorNames={run.competitor_names ?? []}
          />
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

      {/* Print footer */}
      {metrics && (
        <div className="print-footer">
          <span style={{ color: "#ff6b35", fontWeight: 700 }}>AVANTI</span>
          <span>{tx("runs", "printGeneratedBy", lang)}</span>
        </div>
      )}

      {/* Book a call CTA — hidden in print */}
      {metrics && (
        <div
          className="no-print rounded-2xl p-8 text-center"
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
