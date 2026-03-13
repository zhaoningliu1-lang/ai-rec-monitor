import type { Metadata } from "next";
import HistoryView from "@/components/views/HistoryView";

export const metadata: Metadata = {
  title: "历史报告 — 阿凡提 GEO",
  description: "所有已完成的 AI 可见度报告。",
};

export default function ZhHistoryPage() {
  return <HistoryView lang="zh" />;
}
