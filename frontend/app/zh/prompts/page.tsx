import PromptsClient from "@/app/prompts/PromptsClient";

export const metadata = { title: "提示词库 | Avanti" };

export default function ZhPromptsPage() {
  return <PromptsClient lang="zh" />;
}
