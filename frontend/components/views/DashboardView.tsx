"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Run, Schedule, api } from "@/lib/api";
import { getToken, isPaid, fetchCredits } from "@/lib/auth";
import { Lang, tx } from "@/lib/i18n";

interface Props {
  lang: Lang;
}

type StatusFilter = "all" | "done" | "running" | "failed";

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

function CreditsBar({ lang }: { lang: Lang }) {
  const [credits, setCredits] = useState<number | null>(null);
  const [paidUser, setPaidUser] = useState(false);

  useEffect(() => {
    fetchCredits()
      .then((c) => { setCredits(c.balance); setPaidUser(c.is_paid); })
      .catch(() => {});
  }, []);

  if (paidUser || credits === null) return null;

  const pct = Math.min(100, Math.round((credits / 40) * 100));

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "#0f0f17", border: "1px solid #25253f" }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium" style={{ color: "#f0f0f8" }}>
          {lang === "zh" ? `剩余 Credits: ${credits}` : `Credits remaining: ${credits}`}
        </span>
        {credits === 0 && (
          <Link
            href={lang === "zh" ? "/zh/pricing" : "/pricing"}
            className="text-xs font-semibold px-3 py-1 rounded-lg"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            {lang === "zh" ? "升级计划 →" : "Upgrade →"}
          </Link>
        )}
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "#25253f" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: credits === 0 ? "#ff4d6d" : credits <= 5 ? "#f5a623" : "#22c55e",
          }}
        />
      </div>
      {credits === 0 && (
        <p className="text-xs mt-2" style={{ color: "#ff4d6d" }}>
          {lang === "zh"
            ? "Credits 已用完，添加付款方式以继续使用"
            : "Credits exhausted — add a payment method to continue"}
        </p>
      )}
    </div>
  );
}

function SchedulesSummary({ lang }: { lang: Lang }) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loaded, setLoaded] = useState(false);
  const h = (p: string) => (lang === "zh" ? `/zh${p}` : p);
  const d = (k: string) => tx("dashboard", k as never, lang);

  useEffect(() => {
    api.listSchedules()
      .then(setSchedules)
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  const active = schedules.filter((s) => s.enabled);
  const lastRun = schedules
    .filter((s) => s.last_run_at)
    .sort((a, b) => new Date(b.last_run_at!).getTime() - new Date(a.last_run_at!).getTime())[0];

  if (schedules.length === 0) {
    return (
      <div
        className="rounded-2xl p-6"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <h3 className="text-base font-bold mb-2" style={{ color: "#f0f0f8" }}>
          {d("schedTitle")}
        </h3>
        <p className="text-sm mb-4" style={{ color: "#7070a0" }}>
          {d("schedSetupDesc")}
        </p>
        <Link
          href={h("/schedules")}
          className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-opacity hover:opacity-85"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          {d("schedSetupBtn")}
        </Link>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "#0f0f17", border: "1px solid #25253f" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold" style={{ color: "#f0f0f8" }}>
          {d("schedTitle")}
        </h3>
        <Link
          href={h("/schedules")}
          className="text-xs font-medium transition-colors hover:text-white"
          style={{ color: "#ff6b35" }}
        >
          {d("schedManage")}
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <div>
          <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>{active.length}</div>
          <div className="text-xs" style={{ color: "#7070a0" }}>{d("schedActive")}</div>
        </div>
        {lastRun?.last_run_at && (
          <div>
            <div className="text-sm font-medium" style={{ color: "#f0f0f8" }}>
              {new Date(lastRun.last_run_at).toLocaleDateString()}
            </div>
            <div className="text-xs" style={{ color: "#7070a0" }}>{d("schedLastRun")}</div>
          </div>
        )}
      </div>
    </div>
  );
}

const FILTERS: { key: StatusFilter; i18nKey: string }[] = [
  { key: "all",     i18nKey: "filterAll" },
  { key: "done",    i18nKey: "filterDone" },
  { key: "running", i18nKey: "filterRunning" },
  { key: "failed",  i18nKey: "filterFailed" },
];

export default function DashboardView({ lang }: Props) {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
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

  const filtered = filter === "all"
    ? runs
    : runs.filter((r) => r.status === filter);

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

      {/* Credits bar (free users only) */}
      {getToken() && <CreditsBar lang={lang} />}

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
        <>
          {/* Status filter tabs */}
          <div className="flex items-center gap-1">
            {FILTERS.map((f) => {
              const count = f.key === "all" ? runs.length : runs.filter((r) => r.status === f.key).length;
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    background: active ? "rgba(255,107,53,0.15)" : "transparent",
                    color: active ? "#ff6b35" : "#7070a0",
                    border: active ? "1px solid rgba(255,107,53,0.3)" : "1px solid transparent",
                    cursor: "pointer",
                  }}
                >
                  {tx("dashboard", f.i18nKey as never, lang)} ({count})
                </button>
              );
            })}
          </div>

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
                {filtered.map((run) => (
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
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-xs" style={{ color: "#7070a0" }}>
                      {lang === "zh" ? "无匹配记录" : "No matching runs"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Schedules summary */}
      {getToken() && <SchedulesSummary lang={lang} />}
    </div>
  );
}
