import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Visibility Plan — AI Visibility Playbook | Avanti",
  description:
    "Get a step-by-step playbook to improve your brand's AI recommendation visibility with prioritized actions.",
};

export default function GeoActionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
