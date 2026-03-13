import BrandsView from "@/components/views/BrandsView";

export const metadata = {
  title: "Brand GEO Dashboard — Avanti GEO",
  description: "Track your brand's AI visibility across ChatGPT, Claude, Gemini, and Perplexity.",
};

export default function BrandsPage() {
  return <BrandsView lang="en" />;
}
