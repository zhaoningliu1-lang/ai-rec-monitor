import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GEO Action Plan — AI Visibility Playbook | Avanti GEO",
  description:
    "Get a step-by-step playbook to improve your brand's AI recommendation visibility with prioritized actions.",
};

export default function GeoActionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
