import CompanyDashboardView from "@/components/views/CompanyDashboardView";

export default async function ZhCompanyDemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CompanyDashboardView slug={slug} lang="zh" />;
}
