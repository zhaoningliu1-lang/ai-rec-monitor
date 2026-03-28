import { Suspense } from "react";
import HackathonDemoView from "@/components/views/HackathonDemoView";

export const metadata = {
  title: "Hackathon Demo — Avanti A2A",
  description: "Full product demo: A2A Commerce Protocol + Opportunity Engine + ROI Loop",
};

export default function HackathonPage() {
  return (
    <Suspense>
      <HackathonDemoView lang="en" />
    </Suspense>
  );
}
