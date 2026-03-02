import CompanyDashboardView from "@/components/views/CompanyDashboardView";

export default async function CompanyDemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CompanyDashboardView slug={slug} lang="en" />;
}
