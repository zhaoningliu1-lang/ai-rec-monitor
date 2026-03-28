import { Suspense } from "react";
import OpportunityEngineView from "@/components/views/OpportunityEngineView";

export const metadata = {
  title: "Opportunity Engine — Avanti A2A",
  description: "Discover what AI will recommend next and get there first.",
};

export default function OpportunityEnginePage() {
  return (
    <Suspense>
      <OpportunityEngineView lang="en" />
    </Suspense>
  );
}
