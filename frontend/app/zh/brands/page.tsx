import type { Metadata } from "next";
import BrandsView from "@/components/views/BrandsView";

export const metadata: Metadata = {
  title: "品牌 GEO 仪表盘 — 阿凡提 GEO",
  description: "追踪你的品牌在 AI 中的可见度。",
};

export default function ZhBrandsPage() {
  return <BrandsView lang="zh" />;
}
