import { api, Schedule } from "@/lib/api";
import SchedulesClient from "@/app/schedules/SchedulesClient";

export default async function ZhSchedulesPage() {
  let schedules: Schedule[] = [];
  try {
    schedules = await api.listSchedules();
  } catch {
    // API may not be running
  }
  return <SchedulesClient initial={schedules} />;
}
