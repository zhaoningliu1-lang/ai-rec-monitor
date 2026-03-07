"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken, isPaid, logout } from "@/lib/auth";

export default function NavBar() {
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");
  const [loggedIn, setLoggedIn] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setLoggedIn(!!getToken());
      setPaid(isPaid());
    };
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const switchHref = isZh
    ? pathname.replace(/^\/zh/, "") || "/"
    : `/zh${pathname === "/" ? "" : pathname}`;

  const demoHref = isZh ? "/zh/company/techvision-pro" : "/company/techvision-pro";
  const homeHref = isZh ? "/zh" : "/";

  const isActive = (href: string) =>
    pathname === href || (href.length > 3 && pathname.startsWith(href));

  // Always visible
  const publicLinks = isZh
    ? [
        { href: "/zh/product",       label: "产品" },
        { href: "/zh/selection",     label: "选品情报" },
        { href: "/zh/trends",        label: "行业趋势" },
        { href: "/zh/optimizer",     label: "成本优化" },
        { href: "/zh/hallucination", label: "幻觉检测" },
        { href: "/zh/categories",    label: "行业指数" },
        { href: "/zh/blog",          label: "研究报告" },
      ]
    : [
        { href: "/product",       label: "Product" },
        { href: "/selection",     label: "Selection" },
        { href: "/trends",        label: "Trends" },
        { href: "/optimizer",     label: "Optimizer" },
        { href: "/hallucination", label: "Accuracy" },
        { href: "/categories",    label: "Index" },
        { href: "/blog",          label: "Research" },
      ];

  // Logged-in (any tier)
  const userLinks = isZh
    ? [{ href: "/zh/dashboard", label: "数据看板" }]
    : [{ href: "/dashboard",    label: "Dashboard" }];

  // Paid only
  const paidLinks = isZh
    ? [
        { href: "/zh/history",   label: "历史报告" },
        { href: "/zh/schedules", label: "自动监控" },
        { href: "/zh/prompts",   label: "提示词库" },
      ]
    : [
        { href: "/history",   label: "History" },
        { href: "/schedules", label: "Auto Monitor" },
        { href: "/prompts",   label: "Prompts" },
      ];

  return (
    <nav
      style={{ background: "#09090b", borderBottom: "1px solid #25253f" }}
      className="px-6 py-3 flex items-center gap-6 sticky top-0 z-10"
    >
      <Link href={homeHref} className="font-black text-xl tracking-tight mr-4" style={{ color: "#ff6b35" }}>
        AVANTI
      </Link>

      {/* Public links — always visible */}
      {publicLinks.map((l) => {
        const active = isActive(l.href);
        return (
          <Link
            key={l.href} href={l.href}
            className="text-sm transition-colors hover:text-white relative pb-0.5"
            style={{
              color: active ? "#f0f0f8" : "#7070a0",
              fontWeight: active ? 500 : 400,
              borderBottom: active ? "2px solid #ff6b35" : "2px solid transparent",
            }}
          >
            {l.label}
          </Link>
        );
      })}

      {/* Logged-in links */}
      {loggedIn && userLinks.map((l) => {
        const active = isActive(l.href);
        return (
          <Link key={l.href} href={l.href}
            className="text-sm transition-colors hover:text-white pb-0.5"
            style={{
              color: active ? "#f0f0f8" : "#7070a0",
              fontWeight: active ? 500 : 400,
              borderBottom: active ? "2px solid #ff6b35" : "2px solid transparent",
            }}>
            {l.label}
          </Link>
        );
      })}

      {/* Paid-only links */}
      {paid && paidLinks.map((l) => {
        const active = isActive(l.href);
        return (
          <Link key={l.href} href={l.href}
            className="text-sm transition-colors hover:text-white pb-0.5"
            style={{
              color: active ? "#f0f0f8" : "#7070a0",
              fontWeight: active ? 500 : 400,
              borderBottom: active ? "2px solid #ff6b35" : "2px solid transparent",
            }}>
            {l.label}
          </Link>
        );
      })}

      {/* Book Demo — always visible, highlighted */}
      <Link
        href={isZh ? "/zh/book-demo" : "/book-demo"}
        className="text-sm font-medium px-3 py-1 rounded-lg transition-colors hover:opacity-90"
        style={{ color: "#ff6b35", border: "1px solid #ff6b3560" }}
      >
        {isZh ? "预约演示" : "Book Demo"}
      </Link>

      {/* Language toggle */}
      <Link
        href={switchHref}
        className="text-xs px-2 py-1 rounded transition-colors hover:text-white"
        style={{ color: "#7070a0", border: "1px solid #25253f" }}
      >
        {isZh ? "EN" : "中文"}
      </Link>

      {/* Demo portal — visible amber pill */}
      <Link
        href={demoHref}
        className="text-xs font-medium px-3 py-1 rounded-lg transition-opacity hover:opacity-80"
        style={{ background: "rgba(245,166,35,0.12)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.25)" }}
      >
        {isZh ? "演示 Demo" : "Live Demo"}
      </Link>

      {/* Auth + New Run */}
      <div className="ml-auto flex items-center gap-3">
        {loggedIn ? (
          <>
            <Link href={isZh ? "/zh/account" : "/account"}
              className="text-sm transition-colors hover:text-white" style={{ color: "#7070a0" }}>
              {isZh ? "账户" : "Account"}
            </Link>
            <button onClick={() => { logout(); setLoggedIn(false); setPaid(false); }}
              className="text-sm transition-colors hover:text-white"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#7070a0", padding: 0 }}>
              {isZh ? "退出" : "Sign out"}
            </button>
            <Link href={isZh ? "/zh/runs/new" : "/runs/new"}
              className="text-sm font-medium px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80"
              style={{ background: "#1a1a2e", border: "1px solid #25253f", color: "#f0f0f8" }}>
              {isZh ? "+ 新建分析" : "+ New Run"}
            </Link>
          </>
        ) : (
          <>
            <Link href={isZh ? "/zh/login" : "/login"}
              className="text-sm transition-colors hover:text-white" style={{ color: "#7070a0" }}>
              {isZh ? "登录" : "Sign in"}
            </Link>
            <Link href={isZh ? "/zh/signup" : "/signup"}
              className="text-sm font-medium px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80"
              style={{ background: "#ff6b35", color: "#fff" }}>
              {isZh ? "免费开始 →" : "Start free →"}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
