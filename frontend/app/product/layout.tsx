import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Visibility Platform for Cross-Border Sellers | Avanti GEO",
  description:
    "Diagnose, monitor, and optimize your brand's AI recommendation visibility across ChatGPT, Claude, Gemini, and Perplexity.",
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
