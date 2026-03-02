import { api, Run } from "@/lib/api";
import DashboardView from "@/components/views/DashboardView";

export const metadata = {
  title: "数据看板 — Avanti",
  description: "全部 AI 可见度分析",
};

export default async function ZhDashboardPage() {
  let runs: Run[] = [];
  let error = "";
  try {
    runs = await api.listRuns();
  } catch (e) {
    error = String(e);
  }

  return <DashboardView runs={runs} error={error} lang="zh" />;
}
