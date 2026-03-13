"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, Run } from "@/lib/api";
import { Lang, tx } from "@/lib/i18n";

function StatusDot({ status }: { status: Run["status"] }) {
  const color =
    status === "done"    ? "#22c55e" :
    status === "running" ? "#ff6b35" :
    status === "failed"  ? "#ff4d6d" : "#f5a623";
  return (
    <span
      className="inline-block w-2 h-2 rounded-full mr-2"
      style={{ background: color }}
    />
  );
}

export default function HistoryView({ lang }: { lang: Lang }) {
  const s = (k: keyof typeof import("@/lib/i18n").t.history) => tx("history", k, lang);
  const h = (p: string) => (lang === "zh" ? `/zh${p}` : p);

  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listRuns()
      .then(setRuns)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const done = runs.filter((r) => r.status === "done" || r.status === "failed");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{s("title")}</h1>
        <p className="text-sm mt-1" style={{ color: "#7070a0" }}>
          {s("subtitle")}
        </p>
      </div>

      {loading && (
        <div className="rounded-xl p-12 text-center" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <p className="text-sm" style={{ color: "#7070a0" }}>{s("loading")}</p>
        </div>
      )}

      {!loading && done.length === 0 && (
        <div
          className="rounded-xl p-12 text-center"
          style={{ background: "#0f0f17", border: "1px solid #25253f" }}
        >
          <p className="text-sm mb-4" style={{ color: "#7070a0" }}>{s("empty")}</p>
          <Link href={h("/audit")} className="text-sm underline" style={{ color: "#ff6b35" }}>
            {s("runAudit")}
          </Link>
        </div>
      )}

      {!loading && done.length > 0 && (
        <div className="grid gap-3">
          {done.map((run) => (
            <Link
              key={run.id}
              href={h(`/runs/${run.id}`)}
              className="flex items-center gap-4 rounded-xl p-5 transition-colors group"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusDot status={run.status} />
                  <span className="font-semibold group-hover:underline" style={{ color: "#ff6b35" }}>
                    {run.brand_name}
                  </span>
                </div>
                <div className="text-xs" style={{ color: "#7070a0" }}>
                  {run.category} · {run.region} · {run.providers.join(", ")}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs mb-1" style={{ color: "#7070a0" }}>
                  {run.finished_at
                    ? new Date(run.finished_at).toLocaleDateString()
                    : new Date(run.created_at).toLocaleDateString()}
                </div>
                <div className="text-xs" style={{ color: "#7070a0" }}>
                  {run.num_prompts} {s("prompts")}
                </div>
              </div>
              <div className="text-lg ml-2" style={{ color: "#25253f" }}>→</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
