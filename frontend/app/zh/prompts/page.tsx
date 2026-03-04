import PromptsClient from "@/app/prompts/PromptsClient";

export const metadata = { title: "提示词库 | 阿凡提" };

export default function ZhPromptsPage() {
  return <PromptsClient lang="zh" />;
}
