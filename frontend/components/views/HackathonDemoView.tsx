"use client";

import { useState } from "react";
import Link from "next/link";

type Lang = "en" | "zh";
const p = (en: string, zh: string, lang: Lang) => (lang === "zh" ? zh : en);

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

// ── Interactive API demo component ──────────────────────────────────────────

function ApiDemo({ method, path, label, lang }: { method: string; path: string; label: string; lang: Lang }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const url = `${API}${path}`;
      const resp = await fetch(url, { method: method === "POST" ? "POST" : "GET", headers: { "Content-Type": "application/json" } });
      if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
      const json = await resp.json();
      setData(json);
    } catch (e: any) {
      setError(e.message || "Failed");
    }
    setLoading(false);
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 overflow-hidden">
      <button
        onClick={run}
        disabled={loading}
        className="w-full px-4 py-2.5 text-left flex items-center gap-2 hover:bg-slate-800/60 transition text-sm"
      >
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">{method}</span>
        <span className="text-white font-medium flex-1">{label}</span>
        {loading ? (
          <span className="w-4 h-4 border-2 border-[#ff6b35] border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className="text-[#ff6b35] text-xs">{data ? p("Refresh ↻", "刷新 ↻", lang) : p("Run →", "执行 →", lang)}</span>
        )}
      </button>

      {error && (
        <div className="px-4 py-2 bg-red-500/10 text-red-400 text-xs">{error}</div>
      )}

      {data && (
        <div className="border-t border-slate-700 p-4 max-h-80 overflow-y-auto">
          <ResultDisplay data={data} lang={lang} />
        </div>
      )}
    </div>
  );
}

// ── Smart result display (not raw JSON) ─────────────────────────────────────

function ResultDisplay({ data, lang }: { data: any; lang: Lang }) {
  // ROI Dashboard
  if (data.geo && data.traffic && data.revenue) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="GEO Score" value={`${data.geo.current_score}/100`} color={data.geo.trend === "improving" ? "text-green-400" : "text-white"} />
          <Stat label={p("AI Traffic", "AI 流量", lang)} value={`${data.traffic.total_ai_visits} visits`} color="text-blue-400" />
          <Stat label={p("Est. Revenue", "预估收入", lang)} value={`$${data.revenue.estimated_revenue?.toLocaleString()}`} color="text-yellow-400" />
        </div>
        {data.roi_narrative?.map((line: string, i: number) => (
          <p key={i} className="text-xs text-slate-300 leading-relaxed">{line}</p>
        ))}
        {data.traffic.engine_breakdown?.length > 0 && (
          <div>
            <p className="text-[10px] text-slate-500 uppercase mb-1">{p("Traffic by AI Engine", "按 AI 引擎分流量", lang)}</p>
            {data.traffic.engine_breakdown.map((e: any, i: number) => (
              <div key={i} className="flex justify-between text-xs py-0.5">
                <span className="text-slate-300">{e.engine}</span>
                <span className="text-white font-medium">{e.visits} visits</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Competitor Alerts
  if (data.alerts) {
    return (
      <div className="space-y-2">
        <div className="flex gap-3 text-xs">
          <span className="text-slate-400">{p("Brand", "品牌", lang)}: <span className="text-white">{data.brand}</span></span>
          <span className="text-slate-400">{p("Alerts", "告警", lang)}: <span className="text-[#ff6b35] font-bold">{data.alert_count}</span></span>
        </div>
        {data.alerts.slice(0, 5).map((a: any, i: number) => (
          <div key={i} className={`rounded-lg p-2.5 text-xs ${
            a.severity === "high" ? "bg-red-500/10 border border-red-500/20" :
            a.severity === "medium" ? "bg-yellow-500/10 border border-yellow-500/20" :
            "bg-slate-800/60 border border-slate-700"
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] uppercase font-bold ${
                a.severity === "high" ? "text-red-400" : a.severity === "medium" ? "text-yellow-400" : "text-slate-400"
              }`}>{a.severity}</span>
              <span className="text-white">{a.competitor}</span>
            </div>
            <p className="text-slate-300">{a.message}</p>
            <p className="text-slate-500 mt-1">{a.action}</p>
          </div>
        ))}
      </div>
    );
  }

  // Auto Report
  if (data.executive_summary && data.sections) {
    return (
      <div className="space-y-3">
        <div>
          <p className="text-[10px] text-[#ff6b35] uppercase font-bold mb-1">{p("Executive Summary", "摘要", lang)}</p>
          <p className="text-sm text-slate-300 leading-relaxed">{data.executive_summary}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Stat label="GEO Score" value={`${data.sections.geo_performance?.current_score ?? "N/A"}`} />
          <Stat label={p("AI Visits", "AI 访问", lang)} value={`${data.sections.ai_traffic?.total_ai_visits ?? 0}`} />
          <Stat label="Reddit" value={`${data.sections.market_signals?.reddit_score ?? 0}%`} />
          <Stat label="KOL" value={`${data.sections.market_signals?.kol_count ?? 0}`} />
        </div>
        <p className="text-[10px] text-slate-500">{p("Data sources", "数据源", lang)}: {data.data_sources?.join(", ")}</p>
      </div>
    );
  }

  // Feed Score
  if (data.grade && data.field_scores) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className={`text-3xl font-black ${
            data.grade === "A" ? "text-green-400" : data.grade === "B" ? "text-blue-400" :
            data.grade === "C" ? "text-yellow-400" : "text-red-400"
          }`}>{data.grade}</span>
          <div>
            <p className="text-white font-bold">{data.score_pct}% — {data.brand}</p>
            <p className="text-xs text-slate-400">{data.product_count} products scored</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {data.field_scores?.map((f: any) => (
            <span key={f.field_name} className={`text-[10px] px-1.5 py-0.5 rounded text-center ${
              f.status === "present" ? "bg-green-500/15 text-green-400" :
              f.status === "weak" ? "bg-yellow-500/15 text-yellow-400" :
              "bg-red-500/15 text-red-400"
            }`}>
              {f.field_name}
            </span>
          ))}
        </div>
        {data.optimization_tips?.slice(0, 3).map((tip: string, i: number) => (
          <p key={i} className="text-xs text-slate-300">{i + 1}. {tip}</p>
        ))}
      </div>
    );
  }

  // Agent readiness / MCP tools
  if (data.mcp_enabled !== undefined || data.tools) {
    const tools = data.tools || data.mcp_tools || [];
    return (
      <div className="space-y-2">
        {data.storefront_api !== undefined && (
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Storefront API" value={data.storefront_api ? "✓" : "✗"} color={data.storefront_api ? "text-green-400" : "text-red-400"} />
            <Stat label="MCP Enabled" value={data.mcp_enabled ? "✓" : "✗"} color={data.mcp_enabled ? "text-green-400" : "text-red-400"} />
          </div>
        )}
        {tools.length > 0 && (
          <div>
            <p className="text-[10px] text-slate-500 uppercase mb-1">MCP Tools ({tools.length})</p>
            {tools.map((tool: any, i: number) => (
              <p key={i} className="text-xs text-slate-300 font-mono py-0.5">{typeof tool === "string" ? tool : tool.name}</p>
            ))}
          </div>
        )}
        {tools.length === 0 && !data.storefront_api && (
          <p className="text-xs text-slate-400">{p("No MCP tools found on this store.", "该店铺未找到 MCP 工具。", lang)}</p>
        )}
      </div>
    );
  }

  // Fallback: pretty JSON
  return <pre className="text-[10px] text-slate-400 whitespace-pre-wrap">{JSON.stringify(data, null, 2).slice(0, 2000)}</pre>;
}

function Stat({ label, value, color = "text-white" }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-slate-800/60 rounded-lg p-2 text-center">
      <p className="text-[10px] text-slate-500">{label}</p>
      <p className={`text-sm font-bold ${color}`}>{value}</p>
    </div>
  );
}

// ── Section data ────────────────────────────────────────────────────────────

function getSections(lang: Lang, h: (path: string) => string) {
  return [
    {
      id: "vision",
      badge: "VISION",
      badgeColor: "bg-[#ff6b35]/15 text-[#ff6b35]",
      title: p("A2A Commerce Protocol", "A2A 商业协议", lang),
      subtitle: p("Watch buyer agents and seller agents negotiate in real time", "实时观看买方代理与卖方代理协商交易", lang),
      description: p(
        "Three-column live animation: ChatGPT Buyer Agent ↔ A2A Protocol Layer ↔ Avanti Seller Agent. From 'best rice cooker' search → AI signal detection → 1688 supplier match → listing generation → Costco auto-procurement → ROI attribution.",
        "三栏实时动画：ChatGPT 买方代理 ↔ A2A 协议层 ↔ Avanti 卖方代理。从搜索 → AI 信号检测 → 1688 供应商匹配 → Listing 生成 → Costco 自动采购 → ROI 归因。",
        lang,
      ),
      href: h("/a2a-demo"),
      cta: p("▶ Launch A2A Demo", "▶ 启动 A2A 演示", lang),
      stats: [
        { label: p("Total Time", "总耗时", lang), value: "4.2 min" },
        { label: p("Human Touchpoints", "人工介入", lang), value: "1" },
        { label: p("Revenue Potential", "潜在收入", lang), value: "$189K" },
        { label: "GEO → ROI", value: "78.7x" },
      ],
    },
    {
      id: "product",
      badge: p("PRODUCT", "核心产品", lang),
      badgeColor: "bg-green-500/15 text-green-400",
      title: p("Opportunity Engine", "商机引擎", lang),
      subtitle: p("AI signal → supplier → cost → listing", "AI 信号 → 供应商 → 成本 → Listing", lang),
      description: p(
        "4-step wizard: 7 real APIs in parallel (Amazon, Reddit, YouTube, TikTok, Google Trends, PostgreSQL, Claude). Brand product dedup, ChatGPT Feed Score, 29 tariff codes.",
        "4 步向导：7 个真实 API 并行（Amazon、Reddit、YouTube、TikTok、Google Trends、PostgreSQL、Claude）。品牌产品去重、ChatGPT Feed 评分、29 个关税编码。",
        lang,
      ),
      href: h("/opportunity-engine?demo=true"),
      hrefReal: h("/opportunity-engine"),
      cta: p("🚀 Demo Mode (instant)", "🚀 演示模式（秒出）", lang),
      ctaReal: p("⚡ Real Mode (live APIs)", "⚡ 真实模式（实时 API）", lang),
      stats: [
        { label: p("Data Sources", "数据源", lang), value: "7 APIs" },
        { label: p("Tariff Codes", "关税编码", lang), value: "29 HS" },
        { label: "Feed", value: p("16 fields", "16 项", lang) },
        { label: p("Suppliers", "供应商", lang), value: "Alibaba" },
      ],
    },
    {
      id: "loop",
      badge: p("CLOSED LOOP", "闭环", lang),
      badgeColor: "bg-blue-500/15 text-blue-400",
      title: p("ROI Attribution Engine", "ROI 归因引擎", lang),
      subtitle: p("GEO Score → AI Traffic → Revenue", "GEO Score → AI 流量 → 收入", lang),
      description: p(
        "Connects GEO Score to business impact. B2A traffic tracking, revenue estimation, competitor alerts, and one-click monthly reports.",
        "将 GEO Score 与业务影响关联。B2A 流量追踪、收入估算、竞品告警、一键月报。",
        lang,
      ),
      apis: [
        { method: "GET", path: "/opportunity-engine/roi?brand=Sensarte", label: p("ROI Dashboard", "ROI 仪表盘", lang) },
        { method: "GET", path: "/opportunity-engine/competitor-alerts?brand=Sensarte", label: p("Competitor Alerts", "竞品告警", lang) },
        { method: "GET", path: "/opportunity-engine/auto-report?brand=Sensarte&category=Cookware", label: p("Auto Report", "自动月报", lang) },
      ],
      stats: [
        { label: p("GEO → Traffic", "GEO → 流量", lang), value: p("Linked", "已关联", lang) },
        { label: p("Revenue", "收入", lang), value: p("Estimated", "已估算", lang) },
        { label: p("Alerts", "告警", lang), value: p("Real-time", "实时", lang) },
        { label: p("Reports", "报告", lang), value: p("One-click", "一键", lang) },
      ],
    },
    {
      id: "shopify",
      badge: p("INFRASTRUCTURE", "基础设施", lang),
      badgeColor: "bg-purple-500/15 text-purple-400",
      title: p("Shopify MCP + Shadow Store", "Shopify MCP + 影子店铺", lang),
      subtitle: p("Let AI agents discover your products", "让 AI 代理发现你的产品", lang),
      description: p(
        "Shopify Storefront + Admin API + MCP. Shadow Store: sync Amazon → Shopify → AI agents discover via MCP.",
        "Shopify Storefront + Admin API + MCP 集成。影子店铺：Amazon → Shopify → AI 代理通过 MCP 发现。",
        lang,
      ),
      apis: [
        { method: "GET", path: "/opportunity-engine/shopify/agent-readiness?shop=allbirds.com", label: p("Agent Readiness (Allbirds)", "Agent 就绪检查 (Allbirds)", lang) },
        { method: "GET", path: "/opportunity-engine/shopify/mcp/tools?shop=allbirds.com", label: p("MCP Tools (Allbirds)", "MCP 工具 (Allbirds)", lang) },
      ],
      stats: [
        { label: "Storefront", value: "✓" },
        { label: "Admin", value: "✓" },
        { label: "MCP", value: "✓ JSON-RPC" },
        { label: p("Shadow Store", "影子店铺", lang), value: "✓" },
      ],
    },
    {
      id: "feed",
      badge: "ChatGPT SHOPPING",
      badgeColor: "bg-yellow-500/15 text-yellow-400",
      title: p("ChatGPT Feed Optimizer", "ChatGPT Feed 优化器", lang),
      subtitle: p("ACP spec compliance scoring", "ACP 规范合规评分", lang),
      description: p(
        "Scores 16 feed fields against OpenAI's ACP spec. Identifies gaps, generates tips, outputs ready-to-submit feed JSON.",
        "对照 OpenAI ACP 规范评分 16 个字段。识别缺失项，生成优化建议，输出可直接提交的 feed JSON。",
        lang,
      ),
      apis: [
        { method: "GET", path: "/opportunity-engine/feed-score?brand=Sensarte", label: "Feed Score (Sensarte)" },
        { method: "GET", path: "/opportunity-engine/feed-score?brand=Olayks", label: "Feed Score (Olayks)" },
      ],
      stats: [
        { label: p("Fields", "字段", lang), value: "16" },
        { label: p("Grade", "评级", lang), value: "A-F" },
        { label: "Output", value: "ACP JSON" },
        { label: p("Submit to", "提交到", lang), value: "chatgpt.com" },
      ],
    },
  ];
}

// ── Main component ──────────────────────────────────────────────────────────

export default function HackathonDemoView({ lang = "en" }: { lang?: Lang }) {
  const h = (path: string) => (lang === "zh" ? `/zh${path}` : path);
  const sections = getSections(lang, h);

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: "#09090f" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <Link href={lang === "zh" ? "/hackathon" : "/zh/hackathon"}
            className="text-xs px-3 py-1 rounded-lg border border-slate-700 text-slate-400 hover:text-white transition">
            {lang === "zh" ? "English" : "中文"}
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl font-black" style={{ color: "#ff6b35" }}>AVANTI A2A</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#ff6b35]/15 text-[#ff6b35] font-bold uppercase">Hackathon 2026</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">{p("The AI Commerce Operating System", "AI 商业操作系统", lang)}</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {p("From AI signal to shelf to revenue — the full closed loop.", "从 AI 信号到上架到收入——完整闭环。", lang)}
          </p>
          <p className="text-sm text-slate-500 mt-3">
            Pillar 2: Vertical AI — {p("Cross-border e-commerce services → software-margin business", "跨境电商服务 → 软件利润率业务", lang)}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.id} className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-8 hover:border-slate-600/50 transition-all">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${section.badgeColor}`}>{section.badge}</span>
              <h2 className="text-2xl font-bold text-white mt-2">{section.title}</h2>
              <p className="text-sm text-[#ff6b35] mt-1 mb-3">{section.subtitle}</p>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">{section.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                {section.stats.map((s) => (
                  <div key={s.label} className="bg-slate-800/60 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-slate-500">{s.label}</p>
                    <p className="text-sm font-bold text-white">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Interactive buttons */}
              <div className="flex flex-wrap gap-3 mb-4">
                {section.href && (
                  <Link href={section.href}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#ff6b35] to-[#ff8f35] text-white hover:opacity-90 transition shadow-lg shadow-orange-500/20">
                    {section.cta}
                  </Link>
                )}
                {section.hrefReal && (
                  <Link href={section.hrefReal}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 transition">
                    {section.ctaReal}
                  </Link>
                )}
              </div>

              {/* API demos (interactive, not raw JSON links) */}
              {section.apis && (
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase">{p("Live API Demos (click to run)", "实时 API 演示（点击执行）", lang)}</p>
                  {section.apis.map((api) => (
                    <ApiDemo key={api.path} method={api.method} path={api.path} label={api.label} lang={lang} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Architecture */}
        <div className="mt-12 rounded-2xl border border-[#ff6b35]/20 bg-[#ff6b35]/5 p-8 text-center">
          <h3 className="text-lg font-bold text-white mb-4">{p("Complete Data Flow", "完整数据流", lang)}</h3>
          <div className="text-sm text-slate-300 font-mono leading-loose">
            <p>AI Engines (ChatGPT · Claude · Gemini · Perplexity)</p>
            <p className="text-[#ff6b35]">↓ GEO Scan (4 × 60+ queries)</p>
            <p>{p("Signal → Opportunities → Suppliers", "信号 → 商机 → 供应商", lang)} (1688/Alibaba)</p>
            <p className="text-[#ff6b35]">↓ {p("Cost", "成本", lang)} (tariff + 301 + FBA)</p>
            <p>Listing → ChatGPT Feed (ACP) → Shopify MCP</p>
            <p className="text-[#ff6b35]">↓ B2A Tracking</p>
            <p>{p("Traffic → Revenue → ROI", "流量 → 收入 → ROI", lang)}</p>
            <p className="text-green-400 font-bold mt-2">↻ {p("Closed Loop", "完整闭环", lang)}</p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-600">
          <p>Next.js 16 · FastAPI · PostgreSQL · 7 APIs · Claude Sonnet</p>
          <p className="mt-1">avantia2a.com — Avanti Growth Labs © 2026</p>
        </div>
      </div>
    </div>
  );
}
