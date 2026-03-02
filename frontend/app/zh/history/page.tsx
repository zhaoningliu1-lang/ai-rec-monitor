import Link from "next/link";
import { api, Run } from "@/lib/api";

function StatusDot({ status }: { status: Run["status"] }) {
  const color =
    status === "done"    ? "#22c55e" :
    status === "running" ? "#ff6b35" :
    status === "failed"  ? "#ff4d6d" : "#f5a623";
  return (
    <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: color }} />
  );
}

export default async function ZhHistoryPage() {
  let runs: Run[] = [];
  try {
    runs = await api.listRuns();
  } catch {
    // ignore
  }

  const done = runs.filter((r) => r.status === "done" || r.status === "failed");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">历史报告</h1>
        <p className="text-sm mt-1" style={{ color: "#7070a0" }}>
          所有已完成的 AI 可见度报告
        </p>
      </div>

      {done.length === 0 && (
        <div
          className="rounded-xl p-12 text-center"
          style={{ background: "#0f0f17", border: "1px solid #25253f" }}
        >
          <p className="text-sm mb-4" style={{ color: "#7070a0" }}>暂无已完成的报告。</p>
          <Link href="/zh/audit" className="text-sm underline" style={{ color: "#ff6b35" }}>
            立即免费诊断 →
          </Link>
        </div>
      )}

      {done.length > 0 && (
        <div className="grid gap-3">
          {done.map((run) => (
            <Link
              key={run.id}
              href={`/runs/${run.id}`}
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
                    ? new Date(run.finished_at).toLocaleDateString("zh-CN")
                    : new Date(run.created_at).toLocaleDateString("zh-CN")}
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
