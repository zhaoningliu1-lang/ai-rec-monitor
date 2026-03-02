"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");

  // Smart language switch: /zh/dashboard ↔ /dashboard, /zh ↔ /
  const switchHref = isZh
    ? pathname.replace(/^\/zh/, "") || "/"
    : `/zh${pathname === "/" ? "" : pathname}`;

  const demoHref = isZh ? "/zh/company/techvision-pro" : "/company/techvision-pro";
  const homeHref = isZh ? "/zh" : "/";

  const links = isZh
    ? [
        { href: "/zh/dashboard",  label: "数据看板" },
        { href: "/zh/audit",      label: "免费诊断" },
        { href: "/zh/categories", label: "行业指数" },
        { href: "/zh/history",    label: "历史报告" },
        { href: "/zh/schedules",  label: "定时任务" },
      ]
    : [
        { href: "/dashboard",  label: "Dashboard" },
        { href: "/audit",      label: "Free Audit" },
        { href: "/categories", label: "Index" },
        { href: "/history",    label: "History" },
        { href: "/schedules",  label: "Schedules" },
      ];

  return (
    <nav
      style={{ background: "#09090b", borderBottom: "1px solid #25253f" }}
      className="px-6 py-3 flex items-center gap-6 sticky top-0 z-10"
    >
      <Link href={homeHref} className="font-black text-xl tracking-tight mr-4" style={{ color: "#ff6b35" }}>
        AVANTI
      </Link>

      {links.map((l) => (
        <Link key={l.href} href={l.href} className="text-sm transition-colors hover:text-white" style={{ color: "#7070a0" }}>
          {l.label}
        </Link>
      ))}

      {/* Language toggle */}
      <Link
        href={switchHref}
        className="text-xs px-2 py-1 rounded transition-colors hover:text-white"
        style={{ color: "#7070a0", border: "1px solid #25253f" }}
      >
        {isZh ? "EN" : "中文"}
      </Link>

      {/* Demo portal — subtle */}
      <Link
        href={demoHref}
        className="text-xs transition-colors hover:text-white"
        style={{ color: "#25253f" }}
      >
        {isZh ? "演示门户" : "Demo Portal"}
      </Link>

      <Link
        href="/runs/new"
        className="ml-auto text-sm font-medium px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80"
        style={{ background: "#ff6b35", color: "#fff" }}
      >
        {isZh ? "+ 新建分析" : "+ New Run"}
      </Link>
    </nav>
  );
}
