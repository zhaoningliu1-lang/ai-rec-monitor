import Link from "next/link";
import { Run } from "@/lib/api";
import { Lang, tx } from "@/lib/i18n";

interface Props {
  runs: Run[];
  error: string;
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

function BrandPill({ brand }: { brand: string }) {
  return (
    <Link
      href={`/brands/${encodeURIComponent(brand)}`}
      className="text-xs rounded-full px-3 py-1 shrink-0 transition-colors hover:text-white"
      style={{ background: "#0f0f17", border: "1px solid #25253f", color: "#7070a0" }}
    >
      {brand}
    </Link>
  );
}

export default function DashboardView({ runs, error, lang }: Props) {
  const brands = Array.from(new Set(runs.map((r) => r.brand_name))).sort();
  const newRunPath = "/runs/new";

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
              {brands.map((b) => <BrandPill key={b} brand={b} />)}
              {brands.map((b) => <BrandPill key={`dup-${b}`} brand={b} />)}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {brands.map((b) => <BrandPill key={b} brand={b} />)}
          </div>
        )
      )}

      {error && (
        <div className="rounded-lg p-4 text-sm" style={{ background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)", color: "#ff4d6d" }}>
          {tx("dashboard", "apiError", lang)} {error}
        </div>
      )}

      {runs.length === 0 && !error && (
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
                      href={`/brands/${encodeURIComponent(run.brand_name)}`}
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
    </div>
  );
}
