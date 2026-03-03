import Link from "next/link";
import { api, Run, Recommendation } from "@/lib/api";
import RunDetailClient from "@/app/runs/[id]/RunDetailClient";

interface Metrics {
  total: number;
  arrs: number;
  arrs_band: string;
  arrs_explain: string;
  brand_table: Array<{
    name: string;
    is_primary: boolean;
    sov: number;
    sov_high: number;
    sov_comp: number;
    sov_info: number;
    weighted_sov: number;
    mention_rate: number;
    mention_count: number;
  }>;
  providers_used: string[];
  failed_count: number;
}

export default async function ZhRunDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let run: Run;
  try {
    run = await api.getRun(id);
  } catch {
    return (
      <div className="text-center py-24" style={{ color: "#7070a0" }}>
        未找到该分析报告。{" "}
        <Link href="/zh/dashboard" className="underline" style={{ color: "#ff6b35" }}>
          ← 返回看板
        </Link>
      </div>
    );
  }

  const [metrics, recommendations, sources] = await Promise.allSettled([
    run.status === "done" ? api.getMetrics(id) : Promise.reject(),
    run.status === "done" ? api.getRecommendations(id) : Promise.reject(),
    run.status === "done" ? api.getRunSources(id) : Promise.reject(),
  ]);

  return (
    <RunDetailClient
      id={id}
      initialRun={run}
      lang="zh"
      initialMetrics={
        metrics.status === "fulfilled" ? (metrics.value as unknown as Metrics) : null
      }
      initialRecommendations={
        recommendations.status === "fulfilled"
          ? (recommendations.value as Recommendation)
          : null
      }
      initialSources={
        sources.status === "fulfilled" ? (sources.value as Record<string, unknown>) : null
      }
    />
  );
}
