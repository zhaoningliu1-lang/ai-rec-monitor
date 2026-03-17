"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  dashboardApi,
  GeoAnalytics,
  GeoOpportunity,
} from "@/lib/api";

// ── Severity config ───────────────────────────────────────────────────────────
const SEVERITY_COLOR: Record<string, string> = {
  critical: "text-red-400 bg-red-400/10 border-red-400/30",
  high:     "text-orange-400 bg-orange-400/10 border-orange-400/30",
  medium:   "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  low:      "text-slate-400 bg-slate-400/10 border-slate-400/30",
};
const SEVERITY_DOT: Record<string, string> = {
  critical: "bg-red-400",
  high:     "bg-orange-400",
  medium:   "bg-yellow-400",
  low:      "bg-slate-400",
};

// ── GEO Score ring (SVG) ──────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const fill = circ * (1 - score / 100);
  const color = score >= 60 ? "#22c55e" : score >= 35 ? "#f97316" : "#ef4444";
  return (
    <svg width={110} height={110} className="mx-auto" viewBox="0 0 110 110">
      <circle cx={55} cy={55} r={r} fill="none" stroke="#1e293b" strokeWidth={10} />
      <circle
        cx={55} cy={55} r={r} fill="none"
        stroke={color} strokeWidth={10}
        strokeDasharray={circ}
        strokeDashoffset={fill}
        strokeLinecap="round"
        transform="rotate(-90 55 55)"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      <text x={55} y={50} textAnchor="middle" fill="white" fontSize={22} fontWeight={700}>{score}</text>
      <text x={55} y={67} textAnchor="middle" fill="#94a3b8" fontSize={10}>GEO Score</text>
    </svg>
  );
}

// ── Left panel: Brand selector + score ───────────────────────────────────────
function BrandPanel({
  brands, brand, analytics, loading, onBrandChange, lang,
}: {
  brands: string[];
  brand: string;
  analytics: GeoAnalytics | null;
  loading: boolean;
  onBrandChange: (b: string) => void;
  lang: "en" | "zh";
}) {
  const router = useRouter();
  const p = (en: string, zh: string) => lang === "zh" ? zh : en;

  return (
    <aside className="flex flex-col gap-4 overflow-y-auto pr-1">
      {/* Brand selector */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
          {p("Brand", "品牌")}
        </label>
        <select
          value={brand}
          onChange={e => onBrandChange(e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
        >
          {brands.length === 0 && <option value="">{p("No brands yet", "暂无品牌")}</option>}
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Score ring */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-center">
        {loading ? (
          <div className="h-[110px] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ScoreRing score={analytics?.geo.score ?? 0} />
        )}
        {analytics && (
          <div className="mt-3 space-y-1 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>SOV Overall</span>
              <span className="text-white font-medium">{(analytics.geo.sov_overall * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>High-Intent SOV</span>
              <span className={`font-medium ${analytics.geo.sov_high < 0.2 ? "text-red-400" : "text-white"}`}>
                {(analytics.geo.sov_high * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>ARRS</span>
              <span className="text-white font-medium">{analytics.geo.arrs.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span>{p("Mentions", "提及次数")}</span>
              <span className="text-white font-medium">{analytics.geo.mention_count} / {analytics.geo.total_prompts}</span>
            </div>
          </div>
        )}
        {analytics?.scanned_at && (
          <p className="mt-3 text-[10px] text-slate-500">
            {p("Scanned", "扫描时间")}: {new Date(analytics.scanned_at).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Competitors */}
      {analytics && analytics.competitors.length > 0 && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">{p("Competitor SOV", "竞品 SOV")}</p>
          <div className="space-y-2">
            {analytics.competitors.slice(0, 5).map(c => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="text-xs text-slate-300 w-20 truncate">{c.name}</span>
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${Math.min(c.sov * 100 * 1.5, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 w-8 text-right">{(c.sov * 100).toFixed(0)}%</span>
              </div>
            ))}
            {/* Self */}
            {analytics && (
              <div className="flex items-center gap-2 pt-1 border-t border-slate-700">
                <span className="text-xs text-orange-400 w-20 truncate">{analytics.brand}</span>
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full"
                    style={{ width: `${Math.min(analytics.geo.sov_overall * 100 * 1.5, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-orange-400 w-8 text-right">{(analytics.geo.sov_overall * 100).toFixed(0)}%</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => router.push(lang === "zh" ? "/zh/audit" : "/audit")}
          className="w-full py-2 px-3 rounded-lg border border-orange-500/40 text-orange-400 text-sm hover:bg-orange-500/10 transition-colors"
        >
          {p("+ New Scan", "+ 新建扫描")}
        </button>
        <button
          onClick={() => router.push(lang === "zh" ? "/zh/content-studio" : "/content-studio")}
          className="w-full py-2 px-3 rounded-lg border border-slate-600 text-slate-300 text-sm hover:bg-slate-800 transition-colors"
        >
          {p("Content Studio", "内容工厂")}
        </button>
      </div>
    </aside>
  );
}

// ── Center panel: Analytics ───────────────────────────────────────────────────
function AnalyticsPanel({ analytics, loading, lang }: {
  analytics: GeoAnalytics | null;
  loading: boolean;
  lang: "en" | "zh";
}) {
  const p = (en: string, zh: string) => lang === "zh" ? zh : en;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">{p("Loading analytics…", "加载中…")}</p>
        </div>
      </div>
    );
  }
  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        {p("Select a brand to view analytics", "选择品牌查看数据")}
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-y-auto pr-1">
      {/* Header */}
      <div className="flex items-baseline gap-3">
        <h1 className="text-2xl font-bold text-white">{analytics.brand}</h1>
        <span className="text-xs text-slate-500 font-mono">{analytics.run_code}</span>
        {analytics.category && (
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{analytics.category}</span>
        )}
        {analytics.region && (
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full uppercase">{analytics.region}</span>
        )}
      </div>

      {/* Overall Visibility grid */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h2 className="text-sm text-slate-400 uppercase tracking-wider mb-4">{p("Overall Visibility", "整体可见度")}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MetricCard label={p("GEO Score", "GEO 评分")} value={String(analytics.geo.score)} unit="/100"
            color={analytics.geo.score >= 60 ? "text-green-400" : analytics.geo.score >= 35 ? "text-orange-400" : "text-red-400"} />
          <MetricCard label={p("Sentiment", "情感分")} value={(analytics.geo.sentiment * 100).toFixed(0)} unit="%" />
          <MetricCard label={p("Avg Position", "平均排名")}
            value={analytics.geo.avg_position !== null ? String(analytics.geo.avg_position) : "—"}
            unit={analytics.geo.avg_position !== null ? "" : ""} />
          <MetricCard label={p("Mentions", "提及次数")} value={String(analytics.geo.mention_count)}
            unit={`/ ${analytics.geo.total_prompts}`} />
        </div>
      </div>

      {/* Platform Status */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h2 className="text-sm text-slate-400 uppercase tracking-wider mb-4">{p("Platform Status", "平台状态")}</h2>
        {analytics.providers.length === 0 ? (
          <p className="text-slate-500 text-sm">{p("No provider data", "暂无平台数据")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs border-b border-slate-700">
                  <th className="pb-2 text-left">{p("Platform", "平台")}</th>
                  <th className="pb-2 text-right">{p("Score", "得分")}</th>
                  <th className="pb-2 text-right">{p("Mentions", "提及")}</th>
                  <th className="pb-2 text-right">{p("Avg Pos", "平均位")}</th>
                  <th className="pb-2 text-center">{p("Status", "状态")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {analytics.providers.map(prov => (
                  <tr key={prov.key} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 font-medium text-white">{prov.name}</td>
                    <td className="py-2.5 text-right">
                      <span className={prov.score >= 35 ? "text-green-400" : "text-red-400"}>
                        {prov.score}%
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-slate-300">{prov.mentions}/{prov.total}</td>
                    <td className="py-2.5 text-right text-slate-300">
                      {prov.avg_position !== null ? `#${prov.avg_position}` : "—"}
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        prov.status === "ok" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"
                      }`}>
                        {prov.status === "ok" ? "✓" : "⚠"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Score breakdown bar */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h2 className="text-sm text-slate-400 uppercase tracking-wider mb-4">{p("SOV Breakdown", "SOV 分类")}</h2>
        <div className="space-y-3">
          <SovBar label={p("Overall SOV", "整体 SOV")} value={analytics.geo.sov_overall} color="bg-orange-500" />
          <SovBar label={p("High-Intent SOV", "高意向 SOV")} value={analytics.geo.sov_high} color="bg-red-400"
            warn={analytics.geo.sov_high < 0.2} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, unit, color }: { label: string; value: string; unit: string; color?: string }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color ?? "text-white"}`}>{value}<span className="text-sm font-normal text-slate-400 ml-1">{unit}</span></p>
    </div>
  );
}

function SovBar({ label, value, color, warn }: { label: string; value: number; color: string; warn?: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className={warn ? "text-red-400 font-medium" : "text-white"}>{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${Math.min(value * 100, 100)}%` }} />
      </div>
    </div>
  );
}

// ── Right panel: Opportunity feed ─────────────────────────────────────────────
function OpportunityFeed({ opportunities, loading, lang }: {
  opportunities: GeoOpportunity[];
  loading: boolean;
  lang: "en" | "zh";
}) {
  const router = useRouter();
  const p = (en: string, zh: string) => lang === "zh" ? zh : en;

  const handleFix = (opp: GeoOpportunity) => {
    const { route, prefill } = opp.fix;
    const params = new URLSearchParams({
      prefill: "1",
      brand: prefill.brand,
      platform: prefill.platform,
    });
    if (prefill.product) params.set("product", prefill.product);
    if (prefill.keywords.length > 0) params.set("keywords", prefill.keywords.join(","));
    const base = lang === "zh" ? `/zh${route}` : route;
    router.push(`${base}?${params.toString()}`);
  };

  return (
    <aside className="flex flex-col gap-3 overflow-y-auto pr-1">
      <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
        {p("GEO Opportunities", "GEO 机会")}
      </h2>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && opportunities.length === 0 && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 text-center">
          <p className="text-slate-400 text-sm">{p("No opportunities found.", "暂无机会数据。")}</p>
        </div>
      )}

      {opportunities.map(opp => (
        <div
          key={opp.id}
          className={`rounded-xl border p-4 space-y-3 ${SEVERITY_COLOR[opp.severity] ?? "border-slate-700 bg-slate-900"}`}
        >
          {/* Header row */}
          <div className="flex items-start gap-2">
            <span className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full ${SEVERITY_DOT[opp.severity]}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70">
                  {opp.severity}
                </span>
                <span className="text-[10px] uppercase tracking-wider opacity-50">{opp.type.replace(/_/g, " ")}</span>
              </div>
              <p className="text-sm font-medium leading-snug line-clamp-2">{opp.title}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs opacity-70 leading-relaxed">{opp.description}</p>

          {/* Fix button */}
          <button
            onClick={() => handleFix(opp)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors text-xs font-medium border border-current/20"
          >
            <span>{opp.fix.label}</span>
            <span className="flex items-center gap-1 opacity-60">
              <span>{opp.credit_cost} cr</span>
              <span>→</span>
            </span>
          </button>
        </div>
      ))}
    </aside>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────
export default function GeoCMOView({ lang = "en" }: { lang?: "en" | "zh" }) {
  const [brands, setBrands] = useState<string[]>([]);
  const [brand, setBrand] = useState("");
  const [analytics, setAnalytics] = useState<GeoAnalytics | null>(null);
  const [opportunities, setOpportunities] = useState<GeoOpportunity[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [oppLoading, setOppLoading] = useState(false);
  const [error, setError] = useState("");

  // Load brands on mount
  useEffect(() => {
    dashboardApi.getBrands().then(res => {
      setBrands(res.brands);
      if (res.brands.length > 0) setBrand(res.brands[0]);
    }).catch(() => {});
  }, []);

  const loadData = useCallback(async (b: string) => {
    if (!b) return;
    setAnalyticsLoading(true);
    setOppLoading(true);
    setError("");
    setAnalytics(null);
    setOpportunities([]);

    // Parallel fetch
    const [analyticsResult, oppResult] = await Promise.allSettled([
      dashboardApi.getAnalytics(b),
      dashboardApi.getOpportunities(b),
    ]);
    setAnalyticsLoading(false);
    setOppLoading(false);

    if (analyticsResult.status === "fulfilled") {
      setAnalytics(analyticsResult.value);
    } else {
      setError(String((analyticsResult.reason as Error).message));
    }
    if (oppResult.status === "fulfilled") {
      setOpportunities(oppResult.value.opportunities);
    }
  }, []);

  useEffect(() => {
    if (brand) loadData(brand);
  }, [brand, loadData]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Page header */}
      <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">
            {lang === "zh" ? "GEO 指挥台" : "GEO Command Center"}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === "zh" ? "AI CMO 仪表盘 — 发现机会，一键执行" : "AI CMO dashboard — surface opportunities, execute in one click"}
          </p>
        </div>
        <button
          onClick={() => brand && loadData(brand)}
          className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors"
        >
          {lang === "zh" ? "刷新" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mx-6 mt-4 rounded-lg bg-red-400/10 border border-red-400/30 text-red-400 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_280px] gap-5 p-6 h-[calc(100vh-80px)]">
        <BrandPanel
          brands={brands}
          brand={brand}
          analytics={analytics}
          loading={analyticsLoading}
          onBrandChange={setBrand}
          lang={lang}
        />
        <AnalyticsPanel analytics={analytics} loading={analyticsLoading} lang={lang} />
        <OpportunityFeed opportunities={opportunities} loading={oppLoading} lang={lang} />
      </div>
    </div>
  );
}
