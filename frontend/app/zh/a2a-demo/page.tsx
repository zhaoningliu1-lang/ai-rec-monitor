import { Suspense } from "react";
import A2ADemoView from "@/components/views/A2ADemoView";

export const metadata = {
  title: "A2A 商业演示 — Avanti",
  description: "Agent-to-Agent 商业：买方代理与卖方代���实时对话。",
};

export default function A2ADemoPageZh() {
  return (
    <Suspense>
      <A2ADemoView lang="zh" />
    </Suspense>
  );
}
