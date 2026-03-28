import { Suspense } from "react";
import OpportunityEngineView from "@/components/views/OpportunityEngineView";

export const metadata = {
  title: "商机引擎 — Avanti A2A",
  description: "发现 AI 即将推荐的产品，抢先一步。",
};

export default function OpportunityEnginePageZh() {
  return (
    <Suspense>
      <OpportunityEngineView lang="zh" />
    </Suspense>
  );
}
