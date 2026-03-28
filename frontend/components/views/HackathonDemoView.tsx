"use client";

import Link from "next/link";

type Lang = "en" | "zh";
const t = (en: string, zh: string, lang: Lang) => (lang === "zh" ? zh : en);

function getSections(lang: Lang, h: (path: string) => string) {
  return [
    {
      id: "vision",
      badge: "VISION",
      badgeColor: "bg-[#ff6b35]/15 text-[#ff6b35]",
      title: t("A2A Commerce Protocol", "A2A 商业协议", lang),
      subtitle: t("Watch buyer agents and seller agents negotiate in real time", "实时观看买方代理与卖方代理协商交易", lang),
      description: t(
        "Three-column live animation: ChatGPT Buyer Agent ↔ A2A Protocol Layer ↔ Avanti Seller Agent. From 'best rice cooker' search → AI signal detection → 1688 supplier match → listing generation → Costco auto-procurement → ROI attribution. Full closed loop in 4.2 minutes.",
        "三栏实时动画：ChatGPT 买方代理 ↔ A2A 协议层 ↔ Avanti 卖方代理。从 'best rice cooker' 搜索 → AI 信号检测 → 1688 供应商匹配 → Listing 生成 → Costco 自动采购 → ROI 归因。4.2 分钟完成完整闭环。",
        lang,
      ),
      href: h("/a2a-demo"),
      cta: t("▶ Launch A2A Demo", "▶ 启动 A2A 演示", lang),
      stats: [
        { label: t("Total Time", "总耗时", lang), value: "4.2 min" },
        { label: t("Human Touchpoints", "人工介入", lang), value: "1" },
        { label: t("Revenue Potential", "潜在收入", lang), value: "$189K" },
        { label: t("GEO → Revenue ROI", "GEO → 收入 ROI", lang), value: "78.7x" },
      ],
    },
    {
      id: "product",
      badge: t("PRODUCT", "核心产品", lang),
      badgeColor: "bg-green-500/15 text-green-400",
      title: t("Opportunity Engine", "商机引擎", lang),
      subtitle: t("AI signal → supplier match → cost calculator → optimized listing", "AI 信号 → 供应商匹配 → 成本计算 → 优化 Listing", lang),
      description: t(
        "4-step wizard powered by 7 real APIs running in parallel: Rainforest (Amazon), Reddit PRAW, YouTube KOL, TikTok Shop, Google Trends, PostgreSQL historical data, and Claude Sonnet. Features brand product dedup, ChatGPT Feed Score (ACP spec compliance), and 29 HS code tariff calculations.",
        "4 步向导流程，7 个真实 API 并行获取：Rainforest (Amazon)、Reddit PRAW、YouTube KOL、TikTok Shop、Google Trends、PostgreSQL 历史数据、Claude Sonnet。支持品牌已有产品去重、ChatGPT Feed 评分（ACP 规范合规检查）、29 个 HS 编码关税计算。",
        lang,
      ),
      href: h("/opportunity-engine?demo=true"),
      hrefReal: h("/opportunity-engine"),
      cta: t("🚀 Demo Mode (instant)", "🚀 演示模式（秒出）", lang),
      ctaReal: t("⚡ Real Mode (20-30s, live APIs)", "⚡ 真实模式（20-30秒，实时 API）", lang),
      stats: [
        { label: t("Data Sources", "数据源", lang), value: t("7 APIs", "7 个 API", lang) },
        { label: t("Tariff Codes", "关税编码", lang), value: "29 HS" },
        { label: t("Feed Fields", "Feed 字段", lang), value: t("16 scored", "16 项评分", lang) },
        { label: t("Suppliers", "供应商", lang), value: "Alibaba.com" },
      ],
    },
    {
      id: "loop",
      badge: t("CLOSED LOOP", "闭环", lang),
      badgeColor: "bg-blue-500/15 text-blue-400",
      title: t("ROI Attribution Engine", "ROI 归因引擎", lang),
      subtitle: t(
        "GEO Score → AI Traffic → Revenue — the metric that makes clients renew",
        "GEO Score → AI 流量 → 收入——让客户续费的核心指标",
        lang,
      ),
      description: t(
        "Connects GEO Score improvements to actual business impact. Tracks AI-referred traffic via B2A Analytics, estimates revenue with industry benchmarks (2.8% conversion, $42 AOV), and generates the narrative: 'Your GEO Score ↑25pp → AI traffic ↑340% → Est. revenue ↑$189K'.",
        "将 GEO Score 改善与实际业务影响关联。通过 B2A Analytics 追踪 AI 来源流量，用行业基准（2.8% 转化率、$42 客单价）估算收入，生成叙述：'你的 GEO Score ↑25pp → AI 流量 ↑340% → 预估收入 ↑$189K'。",
        lang,
      ),
      endpoints: [
        { method: "GET", path: "/opportunity-engine/roi?brand=Sensarte", label: t("ROI Dashboard", "ROI 仪表盘", lang) },
        { method: "GET", path: "/opportunity-engine/competitor-alerts?brand=Sensarte", label: t("Competitor Alerts", "竞品告警", lang) },
        { method: "GET", path: "/opportunity-engine/auto-report?brand=Sensarte&category=Cookware", label: t("Auto Report", "自动月报", lang) },
      ],
      stats: [
        { label: t("GEO → Traffic", "GEO → 流量", lang), value: t("Correlated", "已关联", lang) },
        { label: t("Traffic → Revenue", "流量 → 收入", lang), value: t("Estimated", "已估算", lang) },
        { label: t("Competitor Alerts", "竞品告警", lang), value: t("Real-time", "实时", lang) },
        { label: t("Auto Reports", "自动报告", lang), value: t("One-click", "一键生成", lang) },
      ],
    },
    {
      id: "shopify",
      badge: t("INFRASTRUCTURE", "基础设施", lang),
      badgeColor: "bg-purple-500/15 text-purple-400",
      title: t("Shopify MCP + Shadow Store", "Shopify MCP + 影子店铺", lang),
      subtitle: t(
        "Let AI agents discover your products — even if you only sell on Amazon",
        "让 AI 代理发现你的产品——即使你只在 Amazon 上卖",
        lang,
      ),
      description: t(
        "Full Shopify Storefront API + Admin API + MCP integration. Shadow Store concept: sync Amazon catalog → Shopify store → AI agents (ChatGPT, Gemini, Perplexity) discover products via Shopify MCP. Products tagged with ASIN for cross-platform tracking.",
        "完整接入 Shopify Storefront API + Admin API + MCP 协议。影子店铺概念：Amazon 产品目录同步 → Shopify 店铺 → AI 代理（ChatGPT、Gemini、Perplexity）通过 Shopify MCP 发现产品。产品以 ASIN 打标实现跨平台追踪。",
        lang,
      ),
      endpoints: [
        { method: "GET", path: "/opportunity-engine/shopify/agent-readiness?shop=allbirds.com", label: t("Agent Readiness Check", "Agent 就绪检查", lang) },
        { method: "GET", path: "/opportunity-engine/shopify/mcp/tools?shop=allbirds.com", label: t("MCP Tool Discovery", "MCP 工具发现", lang) },
      ],
      stats: [
        { label: "Storefront API", value: t("✓ Connected", "✓ 已连接", lang) },
        { label: "Admin API", value: t("✓ Sync Ready", "✓ 同步就绪", lang) },
        { label: "MCP Protocol", value: "✓ JSON-RPC" },
        { label: t("Shadow Store", "影子店铺", lang), value: t("✓ Auto-sync", "✓ 自动同步", lang) },
      ],
    },
    {
      id: "feed",
      badge: "ChatGPT SHOPPING",
      badgeColor: "bg-yellow-500/15 text-yellow-400",
      title: t("ChatGPT Feed Optimizer", "ChatGPT Feed 优化器", lang),
      subtitle: t(
        "Score your product data against OpenAI's Agentic Commerce Protocol spec",
        "基于 OpenAI Agentic Commerce Protocol 规范为你的产品数据打分",
        lang,
      ),
      description: t(
        "Analyzes brand's Amazon product data against ChatGPT's ACP feed specification (16 fields scored). Identifies critical missing fields (descriptions, categories, barcodes), generates optimization tips, and outputs ACP-compatible feed JSON ready for chatgpt.com/merchants submission.",
        "对比 ChatGPT 的 ACP Feed 规范（16 个字段评分），分析品牌的 Amazon 产品数据。识别关键缺失字段（描述、类目、条形码），生成优化建议，输出可直接提交到 chatgpt.com/merchants 的 ACP 兼容 feed JSON。",
        lang,
      ),
      endpoints: [
        { method: "GET", path: "/opportunity-engine/feed-score?brand=Sensarte", label: "Feed Score (Sensarte)" },
        { method: "GET", path: "/opportunity-engine/feed-score?brand=Olayks", label: "Feed Score (Olayks)" },
      ],
      stats: [
        { label: t("Fields Scored", "评分字段", lang), value: "16" },
        { label: t("Grade System", "评级系统", lang), value: "A-F" },
        { label: t("Feed Output", "Feed 输出", lang), value: "ACP JSON" },
        { label: t("Submission", "提交平台", lang), value: "chatgpt.com" },
      ],
    },
  ];
}

export default function HackathonDemoView({ lang = "en" }: { lang?: Lang }) {
  const h = (path: string) => (lang === "zh" ? `/zh${path}` : path);
  const sections = getSections(lang, h);

  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: "#09090f" }}>
      <div className="max-w-4xl mx-auto">
        {/* Language toggle */}
        <div className="flex justify-end mb-4">
          <Link
            href={lang === "zh" ? "/hackathon" : "/zh/hackathon"}
            className="text-xs px-3 py-1 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition"
          >
            {lang === "zh" ? "English" : "中文"}
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl font-black" style={{ color: "#ff6b35" }}>AVANTI A2A</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#ff6b35]/15 text-[#ff6b35] font-bold uppercase tracking-wider">
              Hackathon 2026
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            {t("The AI Commerce Operating System", "AI 商业操作系统", lang)}
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {t(
              "From AI signal detection to shelf to revenue — the full closed loop for cross-border e-commerce brands.",
              "从 AI 信号检测到上架到收入——为跨境电商品牌打造的完整闭环。",
              lang,
            )}
          </p>
          <p className="text-sm text-slate-500 mt-4">
            {t(
              "Pillar 2: Vertical AI — Converting cross-border e-commerce services into software-margin business",
              "Pillar 2: 垂直行业 AI——将跨境电商服务转化为软件利润率业务",
              lang,
            )}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div
              key={section.id}
              className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-8 hover:border-slate-600/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${section.badgeColor}`}>
                    {section.badge}
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-2">{section.title}</h2>
                  <p className="text-sm text-[#ff6b35] mt-1">{section.subtitle}</p>
                </div>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-6">{section.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {section.stats.map((stat) => (
                  <div key={stat.label} className="bg-slate-800/60 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase">{stat.label}</p>
                    <p className="text-sm font-bold text-white mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {section.href && (
                  <Link
                    href={section.href}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#ff6b35] to-[#ff8f35] text-white hover:opacity-90 transition shadow-lg shadow-orange-500/20"
                  >
                    {section.cta}
                  </Link>
                )}
                {section.hrefReal && (
                  <Link
                    href={section.hrefReal}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 transition"
                  >
                    {section.ctaReal}
                  </Link>
                )}
                {section.endpoints?.map((ep) => (
                  <a
                    key={ep.path}
                    href={`https://ai-rec-monitor-production.up.railway.app${ep.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-2"
                  >
                    <span className="text-[10px] font-mono text-slate-500">{ep.method}</span>
                    {ep.label} →
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Architecture diagram */}
        <div className="mt-12 rounded-2xl border border-[#ff6b35]/20 bg-[#ff6b35]/5 p-8 text-center">
          <h3 className="text-lg font-bold text-white mb-4">
            {t("Complete Data Flow", "完整数据流", lang)}
          </h3>
          <div className="text-sm text-slate-300 font-mono leading-loose">
            <p>{t("AI Engines", "AI 引擎", lang)} (ChatGPT · Claude · Gemini · Perplexity)</p>
            <p className="text-[#ff6b35]">↓ GEO Scan ({t("4 engines × 60+ queries", "4 引擎 × 60+ 查询", lang)})</p>
            <p>{t("Signal Detection → Opportunity Cards → Supplier Match", "信号检测 → 商机卡片 → 供应商匹配", lang)} (1688/Alibaba)</p>
            <p className="text-[#ff6b35]">↓ {t("Cost Calculator", "成本计算器", lang)} ({t("tariff", "关税", lang)} + 301 + FBA)</p>
            <p>{t("AI-Optimized Listing → ChatGPT Feed (ACP) → Shopify MCP", "AI 优化 Listing → ChatGPT Feed (ACP) → Shopify MCP", lang)}</p>
            <p className="text-[#ff6b35]">↓ B2A {t("Traffic Tracking", "流量追踪", lang)}</p>
            <p>{t("AI Traffic Attribution → Revenue Estimation → ROI Dashboard", "AI 流量归因 → 收入估算 → ROI 仪表盘", lang)}</p>
            <p className="text-green-400 font-bold mt-2">↻ {t("Closed Loop — GEO Score ↑ → Revenue ↑ → Repeat", "完整闭环 — GEO Score ↑ → 收入 ↑ → 持续循环", lang)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-600">
            Built with Next.js 16 · FastAPI · PostgreSQL · 7 live APIs · Claude Sonnet
          </p>
          <p className="text-xs text-slate-600 mt-1">
            avantia2a.com — Avanti Growth Labs LLC © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
