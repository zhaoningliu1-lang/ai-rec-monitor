import type { Metadata } from "next";
import { api, CategoryEntry } from "@/lib/api";
import TrendsView from "@/components/views/TrendsView";

export const metadata: Metadata = {
  title: "AI 可见度趋势 | 阿凡提 GEO",
  description:
    "实时追踪各品牌在 AI 推荐中的可见度变化。查看哪些品牌在 ChatGPT、Claude、Gemini 中上升或下降。",
};

export default async function ZhTrendsPage() {
  let categories: CategoryEntry[] = [];
  try {
    categories = await api.listCategories();
  } catch {
    // API may not be available during build
  }
  return <TrendsView categories={categories} lang="zh" />;
}
