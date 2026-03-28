import { Metadata } from "next";
import ReportViewer from "./ReportViewer";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  try {
    const res = await fetch(`${API}/reports/${token}/meta`, { cache: "no-store" });
    if (res.ok) {
      const meta = await res.json();
      const title = meta.title || "Report";
      const brand = meta.brand_name ? ` — ${meta.brand_name}` : "";
      return {
        title: `${title} | Avanti`,
        description: `AI Visibility Report${brand} by Avanti Intelligence`,
        openGraph: {
          title: `${title}${brand}`,
          description: "AI Visibility Report by Avanti Intelligence — avantia2a.com",
          siteName: "Avanti",
        },
      };
    }
  } catch {
    /* fallback */
  }
  return { title: "Report | Avanti" };
}

export default async function ReportPage({ params }: Props) {
  const { token } = await params;
  return <ReportViewer token={token} />;
}
