"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getToken, isPaid, logout } from "@/lib/auth";
import { Menu, X, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/* ─── tiny hook: close dropdown on outside click ─── */
function useOutsideClick(cb: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [cb]);
  return ref;
}

type DropdownItem = { href: string; label: string; desc?: string; badge?: string };

function NavDropdown({ label, items, isActive }: { label: string; items: DropdownItem[]; isActive: (h: string) => boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));
  const anyActive = items.some((i) => isActive(i.href));
  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-sm px-3 py-1.5 rounded-full transition-colors hover:text-white flex items-center gap-1"
        style={{ color: anyActive ? "#f0f0f8" : "#7070a0", background: anyActive ? "rgba(255,107,53,0.12)" : "transparent", border: "none", cursor: "pointer" }}
      >
        {label} <ChevronDown size={11} style={{ opacity: 0.5 }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.13 }}
            className="absolute left-0 top-full pt-2 w-56 z-50">
            <div className="rounded-xl p-1.5" style={{ background: "#0f0f17", border: "1px solid #25253f", boxShadow: "0 16px 48px rgba(0,0,0,0.6)" }}>
              {items.map((item) => (
                <Link key={item.href} href={item.href} className="block px-3 py-2 rounded-lg transition-colors hover:bg-white/5" onClick={() => setOpen(false)}>
                  <div className="text-xs font-semibold flex items-center gap-1.5" style={{ color: isActive(item.href) ? "#ff6b35" : "#f0f0f8" }}>
                    {item.label}
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>{item.badge}</span>
                    )}
                  </div>
                  {item.desc && <div className="text-xs mt-0.5" style={{ color: "#555580" }}>{item.desc}</div>}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");
  const [loggedIn, setLoggedIn] = useState(false);
  const [paid, setPaid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useOutsideClick(() => setAccountOpen(false));

  useEffect(() => {
    const refresh = () => { setLoggedIn(!!getToken()); setPaid(isPaid()); };
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener("focus", refresh); };
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const p = (en: string, zh: string) => (isZh ? zh : en);
  const h = (en: string) => (isZh ? `/zh${en}` : en);

  const isActive = (href: string) =>
    pathname === href || (href.length > 3 && pathname.startsWith(href));

  const switchHref = isZh ? pathname.replace(/^\/zh/, "") || "/" : `/zh${pathname === "/" ? "" : pathname}`;
  const homeHref = h("");

  /* ── LOGGED-OUT: marketing pill links ── */
  const productDropdown: DropdownItem[] = [
    { href: h("/brand-safety"),  label: p("Brand Safety",    "品牌安全"),       desc: p("AI brand safety audit — 315 response", "AI 品牌安全审计 — 315 专项"),  badge: "New" },
    { href: h("/audit"),         label: p("AI Audit",        "AI 品牌诊断"),    desc: p("See what AI says about your brand", "查询 AI 对你品牌的真实评价") },
    { href: h("/trends"),        label: p("Trend Monitor",   "行业趋势"),       desc: p("Monthly AI recommendation shifts",  "月度 AI 推荐热榜") },
    { href: h("/geo-action"),    label: p("AI Visibility Plan", "AI 可见度行动计划"),   desc: p("Step-by-step visibility playbook",  "分步提升 AI 可见度") },
    { href: h("/b2a-analytics"), label: p("B2A Analytics",   "B2A Analytics"), desc: p("Agent traffic you can't see in GA", "GA 看不到的 AI 来源流量"), badge: "Beta" },
  ];

  /* ── LOGGED-IN: app nav dropdowns ── */
  const diagnoseItems: DropdownItem[] = [
    { href: h("/runs/new"), label: p("New Analysis", "新建分析") },
  ];
  const monitorItems: DropdownItem[] = [
    { href: h("/trends"),        label: p("Trends",        "行业趋势") },
    { href: h("/hallucination"), label: p("Accuracy",      "幻觉检测") },
    { href: h("/reddit"),        label: p("Reddit",        "Reddit 引用") },
    { href: h("/kol"),           label: p("KOL",           "KOL 追踪") },
    { href: h("/b2a-analytics"), label: p("B2A Analytics", "B2A Analytics"), badge: "Beta" },
  ];
  const optimizeItems: DropdownItem[] = [
    { href: h("/geo-action"),     label: p("AI Visibility Plan", "AI 行动") },
    { href: h("/agents"),         label: p("Growth Agent",   "增长引擎") },
    { href: h("/selection"),      label: p("Selection",      "选品情报") },
  ];
  const workspaceItems: DropdownItem[] = [
    { href: h("/dashboard"),  label: p("Dashboard",    "数据看板") },
    { href: h("/schedules"),  label: p("Auto Monitor", "自动监控") },
    { href: h("/account"),    label: p("Account",      "账户设置") },
  ];

  /* ── mobile: flatten all links ── */
  const allMobileLinks = loggedIn
    ? [
        ...diagnoseItems,
        ...monitorItems,
        ...optimizeItems,
        ...workspaceItems,
      ]
    : [
        { href: h("/brand-safety"),  label: p("Brand Safety",   "品牌安全") },
        { href: h("/product"),       label: p("Product",        "产品") },
        { href: h("/categories"),    label: p("Index",          "行业指数") },
        { href: h("/selection"),     label: p("Selection",      "选品情报") },
        { href: h("/optimizer"),     label: p("Optimizer",      "成本优化") },
        { href: h("/blog"),          label: p("Research",       "研究报告") },
        { href: h("/b2a-analytics"), label: p("B2A Analytics",  "B2A Analytics") },
      ];

  return (
    <>
      <nav
        className="sticky top-0 z-40 px-6 py-3 flex items-center gap-4"
        style={{ background: "rgba(9,9,15,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid #25253f" }}
      >
        {/* Logo */}
        <Link href={homeHref} className="font-black text-xl tracking-tight shrink-0 mr-1" style={{ color: "#ff6b35" }}>AVANTI</Link>

        {/* ── LOGGED-OUT: marketing nav ── */}
        {!loggedIn && (
          <div className="hidden md:flex items-center gap-0.5 rounded-full px-1 py-0.5" style={{ background: "rgba(15,15,23,0.6)", border: "1px solid #25253f" }}>
            <NavDropdown label={p("Product", "产品")} items={productDropdown} isActive={isActive} />
            {[
              { href: h("/categories"), label: p("Index",     "行业指数") },
              { href: h("/selection"),  label: p("Selection", "选品情报") },
              { href: h("/optimizer"),  label: p("Optimizer", "成本优化") },
              { href: h("/blog"),       label: p("Research",  "研究报告") },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="text-sm px-3 py-1.5 rounded-full transition-colors hover:text-white"
                style={isActive(l.href) ? { color: "#f0f0f8", background: "rgba(255,107,53,0.12)" } : { color: "#7070a0" }}>
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* ── LOGGED-IN: app nav ── */}
        {loggedIn && (
          <div className="hidden md:flex items-center gap-1">
            <NavDropdown label={p("Diagnose",  "诊断")}  items={diagnoseItems}   isActive={isActive} />
            <NavDropdown label={p("Monitor",   "监测")}  items={monitorItems}    isActive={isActive} />
            <NavDropdown label={p("Optimize",  "优化")}  items={optimizeItems}   isActive={isActive} />
            <NavDropdown label={p("Workspace", "工作台")} items={workspaceItems}  isActive={isActive} />
          </div>
        )}

        {/* ── Right side ── */}
        <div className="hidden md:flex items-center gap-2.5 ml-auto shrink-0">
          {/* Language */}
          <Link href={switchHref} className="text-xs px-2.5 py-1 rounded-lg transition-colors hover:text-white"
            style={{ color: "#7070a0", border: "1px solid #25253f" }}>
            {isZh ? "EN" : "中文"}
          </Link>

          {/* Logged-out CTAs */}
          {!loggedIn && (
            <>
              <Link href={isZh ? "/zh/book-demo" : "/book-demo"}
                className="text-sm font-medium px-4 py-1.5 rounded-lg transition-opacity hover:opacity-90"
                style={{ color: "#ff6b35", border: "1px solid rgba(255,107,53,0.35)" }}>
                {p("Book Demo", "预约演示")}
              </Link>
              <Link href={isZh ? "/zh/login" : "/login"}
                className="text-sm transition-colors hover:text-white"
                style={{ color: "#7070a0" }}>
                {p("Sign in", "登录")}
              </Link>
              <Link href={isZh ? "/zh/signup" : "/signup"}
                className="text-sm font-medium px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                style={{ background: "#ff6b35", color: "#fff" }}>
                {p("Try Free", "免费试用")}
              </Link>
            </>
          )}

          {/* Logged-in CTAs */}
          {loggedIn && (
            <>
              {/* Account dropdown */}
              <div ref={accountRef} className="relative">
                <button onClick={() => setAccountOpen((v) => !v)}
                  className="text-sm flex items-center gap-1 transition-colors hover:text-white"
                  style={{ color: "#7070a0", background: "none", border: "none", cursor: "pointer" }}>
                  {p("Account", "账户")} <ChevronDown size={11} style={{ opacity: 0.5 }} />
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.13 }}
                      className="absolute right-0 top-full pt-2 w-36 z-50">
                      <div className="rounded-xl p-1.5" style={{ background: "#0f0f17", border: "1px solid #25253f", boxShadow: "0 16px 48px rgba(0,0,0,0.6)" }}>
                        <Link href={h("/account")} className="block px-3 py-2 rounded-lg text-xs hover:bg-white/5"
                          style={{ color: "#f0f0f8" }} onClick={() => setAccountOpen(false)}>
                          {p("Settings", "账户设置")}
                        </Link>
                        <button onClick={() => { logout(); setLoggedIn(false); setPaid(false); setAccountOpen(false); }}
                          className="w-full text-left block px-3 py-2 rounded-lg text-xs hover:bg-white/5"
                          style={{ color: "#7070a0", background: "none", border: "none", cursor: "pointer" }}>
                          {p("Sign out", "退出")}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden ml-auto p-1.5 rounded-lg transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          style={{ color: "#f0f0f8", background: "none", border: "none", cursor: "pointer" }}
          aria-label="Toggle menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="md:hidden fixed inset-x-0 z-30 overflow-y-auto"
            style={{ top: 53, background: "rgba(9,9,15,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid #25253f", maxHeight: "calc(100dvh - 53px)" }}>
            <div className="px-6 py-5 space-y-5">
              <div className="space-y-0.5">
                {allMobileLinks.map((l) => (
                  <Link key={l.href} href={l.href}
                    className="block text-sm py-2 px-2 rounded-lg transition-colors hover:text-white"
                    style={{ color: isActive(l.href) ? "#f0f0f8" : "#7070a0", background: isActive(l.href) ? "rgba(255,107,53,0.08)" : "transparent" }}>
                    {l.label}
                  </Link>
                ))}
              </div>
              <div style={{ borderTop: "1px solid #25253f" }} />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Link href={switchHref} className="text-xs px-2.5 py-1 rounded-lg" style={{ color: "#7070a0", border: "1px solid #25253f" }}>
                    {isZh ? "EN" : "中文"}
                  </Link>
                  {!loggedIn && (
                    <Link href={isZh ? "/zh/book-demo" : "/book-demo"} className="text-sm font-medium px-3 py-1.5 rounded-lg"
                      style={{ color: "#ff6b35", border: "1px solid rgba(255,107,53,0.35)" }}>
                      {p("Book Demo", "预约演示")}
                    </Link>
                  )}
                </div>
                {loggedIn ? (
                  <>
                    <Link href={h("/runs/new")} className="block text-sm font-medium text-center px-4 py-2.5 rounded-lg"
                      style={{ background: "#ff6b35", color: "#fff" }}>
                      {p("+ New Run", "+ 新建分析")}
                    </Link>
                    <div className="flex gap-4">
                      <Link href={h("/account")} className="text-sm" style={{ color: "#7070a0" }}>{p("Settings", "账户设置")}</Link>
                      <button onClick={() => { logout(); setLoggedIn(false); setPaid(false); setMobileOpen(false); }}
                        className="text-sm" style={{ color: "#7070a0", background: "none", border: "none", cursor: "pointer" }}>
                        {p("Sign out", "退出")}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href={isZh ? "/zh/login" : "/login"} className="text-sm text-center py-2.5 rounded-lg"
                      style={{ color: "#7070a0", border: "1px solid #25253f" }}>
                      {p("Sign in", "登录")}
                    </Link>
                    <Link href={isZh ? "/zh/signup" : "/signup"} className="text-sm font-medium text-center px-4 py-2.5 rounded-lg"
                      style={{ background: "#ff6b35", color: "#fff" }}>
                      {p("Try Free", "免费试用")}
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
