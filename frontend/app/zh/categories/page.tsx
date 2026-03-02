import { api, CategoryEntry } from "@/lib/api";
import CategoriesView from "@/components/views/CategoriesView";

export const metadata = {
  title: "品类排行榜 — Avanti",
  description: "各品类品牌在 AI 助手中的推荐可见度排名。",
};

export default async function ZhCategoriesPage() {
  let categories: CategoryEntry[] = [];
  try {
    categories = await api.listCategories();
  } catch {
    // API may not be available
  }

  return <CategoriesView categories={categories} lang="zh" />;
}
