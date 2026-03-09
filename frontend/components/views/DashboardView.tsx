"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Run, api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Lang, tx } from "@/lib/i18n";

interface Props {
  lang: Lang;
}

function StatusBadge({ status, lang }: { status: Run["status"]; lang: Lang }) {
  const styles: Record<Run["status"], { bg: string; color: string }> = {
    done:    { bg: "rgba(34,197,94,0.12)",  color: "#22c55e" },
    running: { bg: "rgba(255,107,53,0.12)", color: "#ff6b35" },
    queued:  { bg: "rgba(245,166,35,0.12)", color: "#f5a623" },
    failed:  { bg: "rgba(255,77,109,0.12)", color: "#ff4d6d" },
  };
  const s = styles[status];
  const labelMap: Record<Run["status"], "statusDone" | "statusRun" | "statusQueue" | "statusFail"> = {
    done: "statusDone", running: "statusRun", queued: "statusQueue", failed: "statusFail",
  };
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      {tx("dashboard", labelMap[status], lang)}
    </span>
  );
}

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#25253f" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#ff6b35" }} />
      </div>
      <span className="text-xs w-10 text-right" style={{ color: "#7070a0" }}>{pct}%</span>
    </div>
  );
}

function BrandPill({ brand, lang }: { brand: string; lang: Lang }) {
  return (
    <Link
      href={`${lang === "zh" ? "/zh" : ""}/brands/${encodeURIComponent(brand)}`}
      className="text-xs rounded-full px-3 py-1 shrink-0 transition-colors hover:text-white"
      style={{ background: "#0f0f17", border: "1px solid #25253f", color: "#7070a0" }}
    >
      {brand}
    </Link>
  );
}

export default function DashboardView({ lang }: Props) {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const newRunPath = lang === "zh" ? "/zh/runs/new" : "/runs/new";

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    api.listRuns()
      .then(setRuns)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const brands = Array.from(new Set(runs.map((r) => r.brand_name))).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-sm animate-pulse" style={{ color: "#7070a0" }}>
          {lang === "zh" ? "加载中…" : "Loading…"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{tx("dashboard", "title", lang)}</h1>
          <p className="text-sm mt-1" style={{ color: "#7070a0" }}>{tx("dashboard", "subtitle", lang)}</p>
        </div>
        <Link
          href={newRunPath}
          className="text-sm font-medium px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          {tx("dashboard", "newRun", lang)}
        </Link>
      </div>

      {/* Brand pills — marquee if >5 */}
      {brands.length > 0 && (
        brands.length > 5 ? (
          <div className="marquee-container">
            <div className="marquee-track">
              {brands.map((b) => <BrandPill key={b} brand={b} lang={lang} />)}
              {brands.map((b) => <BrandPill key={`dup-${b}`} brand={b} lang={lang} />)}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {brands.map((b) => <BrandPill key={b} brand={b} lang={lang} />)}
          </div>
        )
      )}

      {error && (
        <div className="rounded-lg p-4 text-sm" style={{ background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)", color: "#ff4d6d" }}>
          {tx("dashboard", "apiError", lang)} {error}
        </div>
      )}

      {!getToken() && !error && (
        <div className="rounded-xl p-12 text-center" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <p className="text-sm mb-4" style={{ color: "#7070a0" }}>
            {lang === "zh" ? "请登录以查看你的分析记录" : "Sign in to view your runs"}
          </p>
          <Link
            href={lang === "zh" ? "/zh/login" : "/login"}
            className="text-sm font-medium px-4 py-2 rounded-lg"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            {lang === "zh" ? "立即登录" : "Sign in"}
          </Link>
        </div>
      )}

      {getToken() && runs.length === 0 && !error && (
        <div className="rounded-xl p-12 text-center" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <p className="text-sm mb-4" style={{ color: "#7070a0" }}>{tx("dashboard", "noRuns", lang)}</p>
          <Link href={newRunPath} className="text-sm underline" style={{ color: "#ff6b35" }}>
            {tx("dashboard", "createFirst", lang)}
          </Link>
        </div>
      )}

      {runs.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wide" style={{ background: "#161625", color: "#7070a0" }}>
              <tr>
                <th className="text-left px-4 py-3">{tx("dashboard", "colBrand", lang)}</th>
                <th className="text-left px-4 py-3">{tx("dashboard", "colCategory", lang)}</th>
                <th className="text-left px-4 py-3">{tx("dashboard", "colProviders", lang)}</th>
                <th className="text-left px-4 py-3">{tx("dashboard", "colStatus", lang)}</th>
                <th className="text-left px-4 py-3">{tx("dashboard", "colProgress", lang)}</th>
                <th className="text-left px-4 py-3">{tx("dashboard", "colDate", lang)}</th>
                <th className="text-right px-4 py-3">{tx("dashboard", "colRunId", lang)}</th>
              </tr>
            </thead>
            <tbody style={{ background: "#0f0f17" }}>
              {runs.map((run) => (
                <tr key={run.id} className="transition-colors" style={{ borderTop: "1px solid #25253f" }}>
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`${lang === "zh" ? "/zh" : ""}/brands/${encodeURIComponent(run.brand_name)}`}
                      className="hover:underline"
                      style={{ color: "#ff6b35" }}
                    >
                      {run.brand_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3" style={{ color: "#7070a0" }}>{run.category}</td>
                  <td className="px-4 py-3" style={{ color: "#7070a0" }}>{run.providers.join(", ")}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={run.status} lang={lang} />
                  </td>
                  <td className="px-4 py-3 w-32">
                    <ProgressBar done={run.progress_done} total={run.progress_total} />
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#7070a0" }}>
                    {new Date(run.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`${lang === "zh" ? "/zh" : ""}/runs/${run.id}`}
                      className="text-xs underline transition-colors hover:text-white"
                      style={{ color: "#7070a0" }}
                    >
                      {run.run_code ?? run.id.slice(0, 8) + "…"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* B2A Analytics — Coming Soon Teaser */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-base font-bold" style={{ color: "#f0f0f8" }}>
            {lang === "zh"
              ? "B2A Analytics — AI 流量智能（即将推出）"
              : "B2A Analytics — AI Traffic Intelligence (Coming Soon)"}
          </h3>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}
          >
            Beta
          </span>
        </div>

        {/* Blurred mock bar chart */}
        <div className="relative mb-5">
          <div style={{ filter: "blur(4px)" }} className="pointer-events-none select-none">
            <div className="flex items-end gap-3 h-32 px-4">
              {[
                { label: "ChatGPT", h: "80%", color: "#22c55e" },
                { label: "Perplexity", h: "45%", color: "#3b82f6" },
                { label: "Gemini", h: "30%", color: "#f5a623" },
                { label: "Claude", h: "15%", color: "#a78bfa" },
              ].map((bar) => (
                <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg"
                    style={{ height: bar.h, background: bar.color, minHeight: 8 }}
                  />
                  <span className="text-[10px]" style={{ color: "#555580" }}>
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="text-xs font-semibold px-4 py-2 rounded-full"
              style={{ background: "rgba(15,15,23,0.9)", border: "1px solid #25253f", color: "#7070a0" }}
            >
              {lang === "zh" ? "🔒 解锁后可查看完整数据" : "🔒 Unlock to view full data"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://calendly.com/brivesubscription/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            {lang === "zh" ? "加入 Beta 等待名单 →" : "Join Beta Waitlist →"}
          </a>
          <span className="text-xs" style={{ color: "#555580" }}>
            {lang === "zh" ? "抢先体验 AI 流量归因" : "Early access to AI traffic attribution"}
          </span>
        </div>
      </div>
    </div>
  );
}
