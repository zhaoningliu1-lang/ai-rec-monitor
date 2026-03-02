import ExecutionPlaybookView from "@/components/views/ExecutionPlaybookView";

export default async function ZhExecutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ExecutionPlaybookView slug={slug} lang="zh" />;
}
