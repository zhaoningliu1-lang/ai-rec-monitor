import { Suspense } from "react";
import HackathonDemoView from "@/components/views/HackathonDemoView";

export const metadata = {
  title: "Hackathon 演示 — Avanti A2A",
  description: "完整产品演示：A2A 商业协议 + 商机引擎 + ROI 闭环",
};

export default function HackathonPageZh() {
  return (
    <Suspense>
      <HackathonDemoView lang="zh" />
    </Suspense>
  );
}
