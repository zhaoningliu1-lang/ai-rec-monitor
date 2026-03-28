"use client";

import { usePathname } from "next/navigation";

export default function LayoutShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isReportViewer = pathname?.startsWith("/r/");
  const isFullWidth = pathname?.startsWith("/a2a-demo") || pathname?.startsWith("/opportunity-engine") || pathname?.startsWith("/zh/a2a-demo") || pathname?.startsWith("/zh/opportunity-engine");

  if (isReportViewer) {
    // Report viewer: no main wrapper, no footer — just raw children
    return <>{children}</>;
  }

  if (isFullWidth) {
    // Full-width pages: no max-width constraint, no padding, no footer
    return <main>{children}</main>;
  }

  return (
    <>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      {footer}
    </>
  );
}
