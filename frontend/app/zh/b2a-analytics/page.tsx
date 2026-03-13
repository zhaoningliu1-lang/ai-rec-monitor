import type { Metadata } from "next";
import B2AView from "@/components/views/B2AView";

export const metadata: Metadata = {
  title: "B2A 分析 — AI 流量归因 | 阿凡提 GEO",
  description: "追踪哪些 AI 引擎推荐你的品牌，并衡量它们带来的流量。唯一能从 AI 可见度到购买归因形成闭环的平台。",
};

export default function ZhB2AAnalyticsPage() {
  return <B2AView lang="zh" />;
}
