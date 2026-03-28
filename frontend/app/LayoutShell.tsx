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

  if (isReportViewer) {
    // Report viewer: no main wrapper, no footer — just raw children
    return <>{children}</>;
  }

  return (
    <>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      {footer}
    </>
  );
}
