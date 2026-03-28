"use client";

import Link from "next/link";

const SECTIONS = [
  {
    id: "vision",
    badge: "VISION",
    badgeColor: "bg-[#ff6b35]/15 text-[#ff6b35]",
    title: "A2A Commerce Protocol",
    subtitle: "Watch buyer agents and seller agents negotiate in real time",
    description: "Three-column live animation: ChatGPT Buyer Agent ↔ A2A Protocol Layer ↔ Avanti Seller Agent. From 'best rice cooker' search → AI signal detection → 1688 supplier match → listing generation → Costco auto-procurement → ROI attribution. Full closed loop in 4.2 minutes.",
    href: "/a2a-demo",
    cta: "▶ Launch A2A Demo",
    stats: [
      { label: "Total Time", value: "4.2 min" },
      { label: "Human Touchpoints", value: "1" },
      { label: "Revenue Potential", value: "$189K" },
      { label: "GEO → Revenue ROI", value: "78.7x" },
    ],
  },
  {
    id: "product",
    badge: "PRODUCT",
    badgeColor: "bg-green-500/15 text-green-400",
    title: "Opportunity Engine",
    subtitle: "AI signal → supplier match → cost calculator → optimized listing",
    description: "4-step wizard powered by 7 real APIs running in parallel: Rainforest (Amazon), Reddit PRAW, YouTube KOL, TikTok Shop, Google Trends, PostgreSQL historical data, and Claude Sonnet. Features brand product dedup, ChatGPT Feed Score (ACP spec compliance), and 29 HS code tariff calculations.",
    href: "/opportunity-engine?demo=true",
    hrefReal: "/opportunity-engine",
    cta: "🚀 Try Demo Mode (instant)",
    ctaReal: "⚡ Try Real Mode (20-30s, live APIs)",
    stats: [
      { label: "Data Sources", value: "7 APIs" },
      { label: "Tariff Codes", value: "29 HS" },
      { label: "Feed Fields", value: "16 scored" },
      { label: "Suppliers", value: "Alibaba.com" },
    ],
  },
  {
    id: "loop",
    badge: "CLOSED LOOP",
    badgeColor: "bg-blue-500/15 text-blue-400",
    title: "ROI Attribution Engine",
    subtitle: "GEO Score → AI Traffic → Revenue — the metric that makes clients renew",
    description: "Connects GEO Score improvements to actual business impact. Tracks AI-referred traffic via B2A Analytics, estimates revenue with industry benchmarks (2.8% conversion, $42 AOV), and generates the narrative: 'Your GEO Score ↑25pp → AI traffic ↑340% → Est. revenue ↑$189K'.",
    endpoints: [
      { method: "GET", path: "/opportunity-engine/roi?brand=Sensarte", label: "ROI Dashboard" },
      { method: "GET", path: "/opportunity-engine/competitor-alerts?brand=Sensarte", label: "Competitor Alerts" },
      { method: "GET", path: "/opportunity-engine/auto-report?brand=Sensarte&category=Cookware", label: "Auto Report" },
    ],
    stats: [
      { label: "GEO → Traffic", value: "Correlated" },
      { label: "Traffic → Revenue", value: "Estimated" },
      { label: "Competitor Alerts", value: "Real-time" },
      { label: "Auto Reports", value: "One-click" },
    ],
  },
  {
    id: "shopify",
    badge: "INFRASTRUCTURE",
    badgeColor: "bg-purple-500/15 text-purple-400",
    title: "Shopify MCP + Shadow Store",
    subtitle: "Let AI agents discover your products — even if you only sell on Amazon",
    description: "Full Shopify Storefront API + Admin API + MCP integration. Shadow Store concept: sync Amazon catalog → Shopify store → AI agents (ChatGPT, Gemini, Perplexity) discover products via Shopify MCP. Products tagged with ASIN for cross-platform tracking.",
    endpoints: [
      { method: "GET", path: "/opportunity-engine/shopify/agent-readiness?shop=allbirds.com", label: "Agent Readiness Check" },
      { method: "GET", path: "/opportunity-engine/shopify/mcp/tools?shop=allbirds.com", label: "MCP Tool Discovery" },
    ],
    stats: [
      { label: "Storefront API", value: "✓ Connected" },
      { label: "Admin API", value: "✓ Sync Ready" },
      { label: "MCP Protocol", value: "✓ JSON-RPC" },
      { label: "Shadow Store", value: "✓ Auto-sync" },
    ],
  },
  {
    id: "feed",
    badge: "ChatGPT SHOPPING",
    badgeColor: "bg-yellow-500/15 text-yellow-400",
    title: "ChatGPT Feed Optimizer",
    subtitle: "Score your product data against OpenAI's Agentic Commerce Protocol spec",
    description: "Analyzes brand's Amazon product data against ChatGPT's ACP feed specification (16 fields scored). Identifies critical missing fields (descriptions, categories, barcodes), generates optimization tips, and outputs ACP-compatible feed JSON ready for chatgpt.com/merchants submission.",
    endpoints: [
      { method: "GET", path: "/opportunity-engine/feed-score?brand=Sensarte", label: "Feed Score (Sensarte)" },
      { method: "GET", path: "/opportunity-engine/feed-score?brand=Olayks", label: "Feed Score (Olayks)" },
    ],
    stats: [
      { label: "Fields Scored", value: "16" },
      { label: "Grade System", value: "A-F" },
      { label: "Feed Output", value: "ACP JSON" },
      { label: "Submission", value: "chatgpt.com" },
    ],
  },
];

export default function HackathonDemoView() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-6" style={{ background: "#09090f" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl font-black" style={{ color: "#ff6b35" }}>AVANTI A2A</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#ff6b35]/15 text-[#ff6b35] font-bold uppercase tracking-wider">
              Hackathon 2026
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            The AI Commerce Operating System
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            From AI signal detection to shelf to revenue — the full closed loop for cross-border e-commerce brands.
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Pillar 2: Vertical AI — Converting cross-border e-commerce services into software-margin business
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <div
              key={section.id}
              className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-8 hover:border-slate-600/50 transition-all"
            >
              {/* Badge + Title */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${section.badgeColor}`}>
                    {section.badge}
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-2">{section.title}</h2>
                  <p className="text-sm text-[#ff6b35] mt-1">{section.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {section.description}
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {section.stats.map((stat) => (
                  <div key={stat.label} className="bg-slate-800/60 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase">{stat.label}</p>
                    <p className="text-sm font-bold text-white mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
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
          <h3 className="text-lg font-bold text-white mb-4">Complete Data Flow</h3>
          <div className="text-sm text-slate-300 font-mono leading-loose">
            <p>AI Engines (ChatGPT · Claude · Gemini · Perplexity)</p>
            <p className="text-[#ff6b35]">↓ GEO Scan (4 engines × 60+ queries)</p>
            <p>Signal Detection → Opportunity Cards → Supplier Match (1688/Alibaba)</p>
            <p className="text-[#ff6b35]">↓ Cost Calculator (tariff + 301 + FBA)</p>
            <p>AI-Optimized Listing → ChatGPT Feed (ACP spec) → Shopify MCP</p>
            <p className="text-[#ff6b35]">↓ B2A Traffic Tracking</p>
            <p>AI Traffic Attribution → Revenue Estimation → ROI Dashboard</p>
            <p className="text-green-400 font-bold mt-2">↻ Closed Loop — GEO Score ↑ → Revenue ↑ → Repeat</p>
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
