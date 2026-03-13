import type { Metadata } from "next";
import SchedulesClient from "@/app/schedules/SchedulesClient";

export const metadata: Metadata = {
  title: "自动监控 — 阿凡提 GEO",
  description: "定时自动执行的 AI 可见度分析任务。",
};

export default function ZhSchedulesPage() {
  return <SchedulesClient lang="zh" />;
}
