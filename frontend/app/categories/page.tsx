import { api, CategoryEntry } from "@/lib/api";
import CategoriesView from "@/components/views/CategoriesView";

export const metadata = {
  title: "AI Visibility Index — Avanti",
  description: "Category-level AI brand visibility rankings across all tracked industries.",
};

export default async function CategoriesPage() {
  let categories: CategoryEntry[] = [];
  try {
    categories = await api.listCategories();
  } catch {
    // API may not be available
  }

  return <CategoriesView categories={categories} lang="en" />;
}
