import type { Metadata } from "next";
import HallucinationView from "@/components/views/HallucinationView";

export const metadata: Metadata = {
  title: "AI 幻觉检测器 — 事实核查 AI 声明 | 阿凡提 GEO",
  description:
    "查看 ChatGPT、Claude、Gemini 对你的产品说了什么错话。事实核查 AI 关于规格、价格、功能的声明。",
};

export default function ZhHallucinationPage() {
  return <HallucinationView lang="zh" />;
}
