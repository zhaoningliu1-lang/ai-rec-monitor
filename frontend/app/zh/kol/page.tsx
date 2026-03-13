import type { Metadata } from "next";
import KolView from "@/components/views/KolView";

export const metadata: Metadata = {
  title: "KOL 来源追踪 — 创作者 AI 引用分析 | 阿凡提 GEO",
  description:
    "追踪哪些 YouTube、TikTok 和博客创作者正在通过引用影响 AI 对你品牌的判断。",
};

export default function ZhKolPage() {
  return <KolView lang="zh" />;
}
