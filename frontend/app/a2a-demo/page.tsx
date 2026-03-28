import { Suspense } from "react";
import A2ADemoView from "@/components/views/A2ADemoView";

export const metadata = {
  title: "A2A Commerce Demo — Avanti",
  description: "Agent-to-Agent commerce: buyer agents meet seller agents in real time.",
};

export default function A2ADemoPage() {
  return (
    <Suspense>
      <A2ADemoView lang="en" />
    </Suspense>
  );
}
