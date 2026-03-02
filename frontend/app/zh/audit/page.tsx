import AuditView from "@/components/views/AuditView";

export const metadata = {
  title: "AI 可见度诊断 — Avanti",
  description: "查看 AI 助手推荐你品牌的频率。完全免费，无需注册。",
};

export default function ZhAuditPage() {
  return <AuditView lang="zh" />;
}
