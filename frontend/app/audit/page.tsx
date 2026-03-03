import AuditView from "@/components/views/AuditView";

export const metadata = {
  title: "Free AI Visibility Audit",
  description:
    "See how often ChatGPT, Claude, and Gemini recommend your brand vs competitors. Free audit — results in under 2 minutes, no signup required.",
  openGraph: {
    title: "Free AI Visibility Audit — Avanti",
    description:
      "Instant AI brand visibility score. No signup, no credit card. See where you rank in seconds.",
  },
};

export default function AuditPage() {
  return <AuditView lang="en" />;
}
