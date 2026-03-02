import { api, Schedule } from "@/lib/api";
import SchedulesClient from "./SchedulesClient";

export default async function SchedulesPage() {
  let schedules: Schedule[] = [];
  try {
    schedules = await api.listSchedules();
  } catch {
    // API may not be running; render empty state
  }
  return <SchedulesClient initial={schedules} />;
}
