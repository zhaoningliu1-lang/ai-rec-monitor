import type { Metadata } from "next";
import LandingView from "@/components/views/LandingView";

export const metadata: Metadata = {
  title: "Avanti — AI Brand Visibility Platform",
  description:
    "When buyers ask AI assistants for product recommendations, is your brand in the answer? Avanti measures your AI visibility, benchmarks competitors, and maps a path to #1.",
  openGraph: {
    title: "Avanti — AI Brand Visibility Platform",
    description:
      "Know where your brand stands in AI recommendations. Free audit, instant score.",
  },
};

export default function LandingPage() {
  return <LandingView lang="en" />;
}
