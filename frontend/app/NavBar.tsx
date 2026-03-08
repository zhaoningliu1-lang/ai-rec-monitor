"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken, isPaid, logout } from "@/lib/auth";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function NavBar() {
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");
  const [loggedIn, setLoggedIn] = useState(false);
  const [paid, setPaid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const switchHref = isZh
    ? pathname.replace(/^\/zh/, "") || "/"
    : `/zh${pathname === "/" ? "" : pathname}`;

  const demoHref = isZh ? "/zh/company/techvision-pro" : "/company/techvision-pro";
  const homeHref = isZh ? "/zh" : "/";

  const isActive = (href: string) =>
    pathname === href || (href.length > 3 && pathname.startsWith(href));

  // Always visible -- marketing / conversion pages
  const publicLinks = isZh
    ? [
        { href: "/zh/product",       label: "产品" },
        { href: "/zh/categories",    label: "行业指数" },
        { href: "/zh/blog",          label: "研究报告" },
      ]
    : [
        { href: "/product",       label: "Product" },
        { href: "/categories",    label: "Index" },
        { href: "/blog",          label: "Research" },
      ];

  // Logged-in (any tier) -- core tool features
  const userLinks = isZh
    ? [
        { href: "/zh/dashboard",     label: "数据看板" },
        { href: "/zh/selection",     label: "选品情报" },
        { href: "/zh/trends",        label: "行业趋势" },
        { href: "/zh/optimizer",     label: "成本优化" },
        { href: "/zh/hallucination", label: "幻觉检测" },
        { href: "/zh/reddit",        label: "Reddit 引用" },
        { href: "/zh/geo-action",    label: "GEO 行动" },
        { href: "/zh/kol",           label: "KOL 追踪" },
        { href: "/zh/agents",        label: "增长引擎" },
      ]
    : [
        { href: "/dashboard",    label: "Dashboard" },
        { href: "/selection",     label: "Selection" },
        { href: "/trends",        label: "Trends" },
        { href: "/optimizer",     label: "Optimizer" },
        { href: "/hallucination", label: "Accuracy" },
        { href: "/reddit",        label: "Reddit" },
        { href: "/geo-action",    label: "GEO Plan" },
        { href: "/kol",           label: "KOL" },
        { href: "/agents",        label: "Growth Agent" },
      ];

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

  const allMobileLinks = [
    ...publicLinks,
    ...(loggedIn ? userLinks : []),
    ...(paid ? paidLinks : []),
  ];

  return (
    <>
      <nav
        className="sticky top-0 z-40 px-6 py-3 flex items-center gap-5"
        style={{
          background: "rgba(9,9,15,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid #25253f",
        }}
      >
        {/* Logo */}
        <Link
          href={homeHref}
          className="font-black text-xl tracking-tight shrink-0 mr-1"
          style={{ color: "#ff6b35" }}
        >
          AVANTI
        </Link>

        {/* Desktop: Public links in pill cluster */}
        <div
          className="hidden md:flex items-center gap-0.5 rounded-full px-1 py-0.5"
          style={{ background: "rgba(15,15,23,0.6)", border: "1px solid #25253f" }}
        >
          {publicLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm px-3 py-1.5 rounded-full transition-colors hover:text-white"
              style={
                isActive(l.href)
                  ? { color: "#f0f0f8", background: "rgba(255,107,53,0.12)" }
                  : { color: "#7070a0" }
              }
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop: Logged-in links (scrollable) */}
        {loggedIn && (
          <div className="hidden lg:flex items-center gap-3 overflow-x-auto scrollbar-none">
            {userLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm whitespace-nowrap transition-colors hover:text-white"
                style={{
                  color: isActive(l.href) ? "#f0f0f8" : "#7070a0",
                  fontWeight: isActive(l.href) ? 500 : 400,
                }}
              >
                {l.label}
              </Link>
            ))}
            {paid &&
              paidLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm whitespace-nowrap transition-colors hover:text-white"
                  style={{
                    color: isActive(l.href) ? "#f0f0f8" : "#7070a0",
                    fontWeight: isActive(l.href) ? 500 : 400,
                  }}
                >
                  {l.label}
                </Link>
              ))}
          </div>
        )}

        {/* Desktop: Right side actions */}
        <div className="hidden md:flex items-center gap-3 ml-auto shrink-0">
          {/* Language toggle */}
          <Link
            href={switchHref}
            className="text-xs px-2.5 py-1 rounded-lg transition-colors hover:text-white"
            style={{ color: "#7070a0", border: "1px solid #25253f" }}
          >
            {isZh ? "EN" : "中文"}
          </Link>

          {/* Demo portal */}
          <Link
            href={demoHref}
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
            style={{
              background: "rgba(245,166,35,0.12)",
              color: "#f5a623",
              border: "1px solid rgba(245,166,35,0.25)",
            }}
          >
            {isZh ? "演示 Demo" : "Live Demo"}
          </Link>

          {/* Book Demo */}
          <Link
            href={isZh ? "/zh/book-demo" : "/book-demo"}
            className="text-sm font-medium px-4 py-1.5 rounded-lg transition-opacity hover:opacity-90"
            style={{ color: "#ff6b35", border: "1px solid rgba(255,107,53,0.35)" }}
          >
            {isZh ? "预约演示" : "Book Demo"}
          </Link>

          {/* Auth */}
          {loggedIn ? (
            <>
              <Link
                href={isZh ? "/zh/account" : "/account"}
                className="text-sm transition-colors hover:text-white"
                style={{ color: "#7070a0" }}
              >
                {isZh ? "账户" : "Account"}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setLoggedIn(false);
                  setPaid(false);
                }}
                className="text-sm transition-colors hover:text-white"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#7070a0",
                  padding: 0,
                }}
              >
                {isZh ? "退出" : "Sign out"}
              </button>
              <Link
                href={isZh ? "/zh/runs/new" : "/runs/new"}
                className="text-sm font-medium px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                style={{
                  background: "#1a1a2e",
                  border: "1px solid #25253f",
                  color: "#f0f0f8",
                }}
              >
                {isZh ? "+ 新建分析" : "+ New Run"}
              </Link>
            </>
          ) : (
            <>
              <Link
                href={isZh ? "/zh/login" : "/login"}
                className="text-sm transition-colors hover:text-white"
                style={{ color: "#7070a0" }}
              >
                {isZh ? "登录" : "Sign in"}
              </Link>
              <Link
                href={isZh ? "/zh/signup" : "/signup"}
                className="text-sm font-medium px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                style={{ background: "#ff6b35", color: "#fff" }}
              >
                {isZh ? "免费开始 →" : "Start free →"}
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto p-1.5 rounded-lg transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          style={{ color: "#f0f0f8", background: "none", border: "none", cursor: "pointer" }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile slide-down drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="md:hidden fixed inset-x-0 z-30 overflow-y-auto"
            style={{
              top: 53,
              background: "rgba(9,9,15,0.96)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderBottom: "1px solid #25253f",
              maxHeight: "calc(100dvh - 53px)",
            }}
          >
            <div className="px-6 py-5 space-y-5">
              {/* Navigation links */}
              <div className="space-y-0.5">
                {allMobileLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block text-sm py-2 px-2 rounded-lg transition-colors hover:text-white"
                    style={{
                      color: isActive(l.href) ? "#f0f0f8" : "#7070a0",
                      background: isActive(l.href) ? "rgba(255,107,53,0.08)" : "transparent",
                    }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #25253f" }} />

              {/* Action links */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Link
                    href={switchHref}
                    className="text-xs px-2.5 py-1 rounded-lg transition-colors hover:text-white"
                    style={{ color: "#7070a0", border: "1px solid #25253f" }}
                  >
                    {isZh ? "EN" : "中文"}
                  </Link>
                  <Link
                    href={demoHref}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg"
                    style={{
                      background: "rgba(245,166,35,0.12)",
                      color: "#f5a623",
                      border: "1px solid rgba(245,166,35,0.25)",
                    }}
                  >
                    {isZh ? "演示 Demo" : "Live Demo"}
                  </Link>
                  <Link
                    href={isZh ? "/zh/book-demo" : "/book-demo"}
                    className="text-sm font-medium px-3 py-1.5 rounded-lg"
                    style={{ color: "#ff6b35", border: "1px solid rgba(255,107,53,0.35)" }}
                  >
                    {isZh ? "预约演示" : "Book Demo"}
                  </Link>
                </div>

                {loggedIn ? (
                  <>
                    <div className="flex items-center gap-4">
                      <Link
                        href={isZh ? "/zh/account" : "/account"}
                        className="text-sm transition-colors hover:text-white"
                        style={{ color: "#7070a0" }}
                      >
                        {isZh ? "账户" : "Account"}
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setLoggedIn(false);
                          setPaid(false);
                          setMobileOpen(false);
                        }}
                        className="text-sm transition-colors hover:text-white"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#7070a0",
                          padding: 0,
                        }}
                      >
                        {isZh ? "退出" : "Sign out"}
                      </button>
                    </div>
                    <Link
                      href={isZh ? "/zh/runs/new" : "/runs/new"}
                      className="block text-sm font-medium text-center px-4 py-2.5 rounded-lg transition-opacity hover:opacity-80"
                      style={{ background: "#ff6b35", color: "#fff" }}
                    >
                      {isZh ? "+ 新建分析" : "+ New Run"}
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href={isZh ? "/zh/login" : "/login"}
                      className="text-sm text-center py-2.5 rounded-lg transition-colors hover:text-white"
                      style={{ color: "#7070a0", border: "1px solid #25253f" }}
                    >
                      {isZh ? "登录" : "Sign in"}
                    </Link>
                    <Link
                      href={isZh ? "/zh/signup" : "/signup"}
                      className="text-sm font-medium text-center px-4 py-2.5 rounded-lg transition-opacity hover:opacity-80"
                      style={{ background: "#ff6b35", color: "#fff" }}
                    >
                      {isZh ? "免费开始 →" : "Start free →"}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
