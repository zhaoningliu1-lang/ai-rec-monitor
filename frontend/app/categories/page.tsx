import { api, CategoryEntry } from "@/lib/api";
import CategoriesView from "@/components/views/CategoriesView";

export const metadata = {
  title: "AI Visibility Index",
  description:
    "Category-level AI brand visibility rankings. See how brands rank in ChatGPT, Claude, and Gemini recommendations across Consumer Electronics, Beauty, Home & Kitchen, and more.",
  openGraph: {
    title: "AI Visibility Index — Avanti",
    description:
      "Brand ranking leaderboards across 20+ categories based on AI recommendation frequency.",
  },
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
