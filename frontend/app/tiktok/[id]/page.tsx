import { TikTokDetailView } from "@/components/views/TikTokWorkflowView";

export const metadata = { title: "Workflow Detail" };

export default async function WorkflowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TikTokDetailView workflowId={id} />;
}
