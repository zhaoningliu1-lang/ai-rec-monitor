import type { Metadata } from "next";
import { api, CategoryEntry } from "@/lib/api";
import TrendsView from "@/components/views/TrendsView";

export const metadata: Metadata = {
  title: "AI Visibility Trends | Avanti GEO",
  description:
    "Real-time tracking of brand AI visibility across categories. See which brands are rising or falling in ChatGPT, Claude, and Gemini recommendations.",
};

export default async function TrendsPage() {
  let categories: CategoryEntry[] = [];
  try {
    categories = await api.listCategories();
  } catch {
    // API may not be available during build
  }
  return <TrendsView categories={categories} lang="en" />;
}
