import { api, Run } from "@/lib/api";
import DashboardView from "@/components/views/DashboardView";

export default async function DashboardPage() {
  let runs: Run[] = [];
  let error = "";
  try {
    runs = await api.listRuns();
  } catch (e) {
    error = String(e);
  }

  return <DashboardView runs={runs} error={error} lang="en" />;
}
