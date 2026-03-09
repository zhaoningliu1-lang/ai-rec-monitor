import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Hallucination Detector — Fact-Check AI Claims | Avanti GEO",
  description:
    "See what ChatGPT, Claude, and Gemini get wrong about your products. Fact-check AI claims on specs, pricing, and features.",
};

export default function HallucinationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
