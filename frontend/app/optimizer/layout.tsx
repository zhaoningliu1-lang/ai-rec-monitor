import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Cost Optimizer — Fund Your GEO Strategy | Avanti GEO",
  description:
    "Calculate how much your team can save by replacing manual ops with AI and reinvest savings into GEO monitoring.",
};

export default function OptimizerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
