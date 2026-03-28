"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Lang = "en" | "zh";
const t = (en: string, zh: string, lang: Lang) => (lang === "zh" ? zh : en);

// ── Timeline script: each step is a phase of the A2A flow ───────────────────

interface TimelineStep {
  id: string;
  side: "buyer" | "protocol" | "seller";
  delay: number; // ms after previous step
  type: "search" | "thinking" | "result" | "signal" | "data" | "action" | "match" | "listing" | "order" | "confirmation";
  title: string;
  titleZh: string;
  content: string;
  contentZh: string;
  highlight?: boolean;
}

const TIMELINE: TimelineStep[] = [
  // Phase 1: Buyer searches
  {
    id: "b1", side: "buyer", delay: 0, type: "search",
    title: "User Query", titleZh: "用户查询",
    content: "\"What's the best rice cooker for a family of 4 under $80?\"",
    contentZh: "\"4口之家80美元以下最好的电饭煲是什么？\"",
  },
  {
    id: "b2", side: "buyer", delay: 1200, type: "thinking",
    title: "ChatGPT Processing", titleZh: "ChatGPT 处理中",
    content: "Analyzing 2,847 reviews, 14 expert articles, Reddit r/Cooking, r/BuyItForLife...",
    contentZh: "正在分析 2,847 条评论、14 篇专业文章、Reddit r/Cooking、r/BuyItForLife...",
  },
  // Protocol: signal detected
  {
    id: "p1", side: "protocol", delay: 800, type: "signal",
    title: "A2A Signal Detected", titleZh: "A2A 信号捕获",
    content: "rice cooker · family size · budget segment · high purchase intent",
    contentZh: "电饭煲 · 家庭装 · 中端价位 · 高购买意向",
    highlight: true,
  },
  // Seller responds
  {
    id: "s1", side: "seller", delay: 600, type: "signal",
    title: "Trend Alert", titleZh: "趋势预警",
    content: "\"rice cooker\" queries ↑ 340% this week across ChatGPT, Claude, Perplexity. Family-size segment is the fastest growing.",
    contentZh: "本周 \"rice cooker\" 查询量在 ChatGPT、Claude、Perplexity 上增长 340%。家庭装是增长最快的细分市场。",
  },
  // Buyer gets AI response
  {
    id: "b3", side: "buyer", delay: 1000, type: "result",
    title: "AI Recommendation", titleZh: "AI 推荐结果",
    content: "Top picks: 1) Zojirushi NS-TSC10 ($185) 2) Instant Pot Duo ($79) 3) Aroma ARC-5000 ($45) — No Chinese brand in top 5.",
    contentZh: "推荐: 1) 象印 NS-TSC10 ($185) 2) Instant Pot Duo ($79) 3) Aroma ARC-5000 ($45) — 前5无中国品牌。",
  },
  // Protocol: structured data exchange
  {
    id: "p2", side: "protocol", delay: 600, type: "data",
    title: "Structured Data Exchange", titleZh: "结构化数据交换",
    content: "{ category: \"rice_cooker\", intent: \"purchase\", budget: \"$40-80\", size: \"family\", gap: \"no_chinese_brand_visible\" }",
    contentZh: "{ category: \"电饭煲\", intent: \"购买\", budget: \"$40-80\", size: \"家庭装\", gap: \"中国品牌不可见\" }",
    highlight: true,
  },
  // Seller: opportunity detection
  {
    id: "s2", side: "seller", delay: 800, type: "action",
    title: "Opportunity Detected", titleZh: "商机识别",
    content: "Gap: No Chinese brand in AI recommendations for family rice cookers $40-80. Market size: ~$2.3B. AI visibility score for this segment: 0%.",
    contentZh: "缺口：家庭电饭煲 $40-80 段无中国品牌被 AI 推荐。市场规模约 $23 亿。该细分 AI 可见度：0%。",
  },
  // Seller: supplier match
  {
    id: "s3", side: "seller", delay: 1000, type: "match",
    title: "1688 Supplier Match", titleZh: "1688 供应商匹配",
    content: "佛山市顺德美的生活电器 — $12.50/unit, MOQ 500, FDA certified. Landed cost: $28.40. Suggested retail: $59.99. Margin: 52.6%.",
    contentZh: "佛山市顺德美的生活电器 — $12.50/件, MOQ 500, FDA 认证。到岸成本: $28.40。建议零售: $59.99。毛利: 52.6%。",
  },
  // Protocol: listing data
  {
    id: "p3", side: "protocol", delay: 600, type: "data",
    title: "AI-Optimized Listing Data", titleZh: "AI 优化 Listing 数据",
    content: "Generating listing with FAQ Schema, structured specs, competitor comparison — optimized for AI citation...",
    contentZh: "正在生成包含 FAQ Schema、结构化参数、竞品对比的 Listing——针对 AI 引用优化...",
    highlight: true,
  },
  // Seller: listing generated
  {
    id: "s4", side: "seller", delay: 1200, type: "listing",
    title: "Listing Generated & Published", titleZh: "Listing 生成并上架",
    content: "\"Smart Family Rice Cooker 5.5L, 11 Cooking Programs, Fuzzy Logic Technology, FDA Certified\" — Published to Amazon with AI-optimized FAQ Schema.",
    contentZh: "\"智能家庭电饭煲 5.5L, 11种烹饪程序, 模糊逻辑技术, FDA认证\" — 已发布至 Amazon，含 AI 优化 FAQ Schema。",
  },
  // Phase 2: Costco buyer agent
  {
    id: "b4", side: "buyer", delay: 1500, type: "search",
    title: "Costco Buyer Agent", titleZh: "Costco 采购代理",
    content: "\"Procurement alert: rice cooker demand forecasted +280% in Pacific Northwest for Q2. Source 10,000 units, budget $15-25/unit.\"",
    contentZh: "\"采购预警：太平洋西北地区 Q2 电饭煲需求预测增长 280%。采购 10,000 台，预算 $15-25/台。\"",
  },
  // Protocol: B2B signal
  {
    id: "p4", side: "protocol", delay: 600, type: "signal",
    title: "B2B Procurement Signal", titleZh: "B2B 采购信号",
    content: "{ buyer: \"Costco\", quantity: 10000, product: \"rice_cooker\", budget_per_unit: \"$15-25\", region: \"US-PNW\", urgency: \"Q2\" }",
    contentZh: "{ buyer: \"Costco\", quantity: 10000, product: \"电饭煲\", budget_per_unit: \"$15-25\", region: \"美国西北\", urgency: \"Q2\" }",
    highlight: true,
  },
  // Seller: auto-respond to Costco
  {
    id: "s5", side: "seller", delay: 800, type: "order",
    title: "Auto-Quote Generated", titleZh: "自动报价生成",
    content: "Quote for Costco: 10,000× Smart Rice Cooker @ $18.90/unit (FOB Shenzhen). Lead time: 35 days. Certifications: FDA, ETL, FCC. Customizable branding.",
    contentZh: "发送 Costco 报价: 10,000× 智能电饭煲 @ $18.90/台 (FOB 深圳)。交期: 35 天。认证: FDA, ETL, FCC。可定制品牌。",
  },
  // Protocol: confirmation
  {
    id: "p5", side: "protocol", delay: 800, type: "data",
    title: "Transaction Initiated", titleZh: "交易启动",
    content: "Buyer Agent ↔ Seller Agent negotiation complete. PO draft generated. Awaiting human confirmation.",
    contentZh: "买方代理 ↔ 卖方代理谈判完成。PO 草案已生成。等待人工确认。",
    highlight: true,
  },
  {
    id: "s6", side: "seller", delay: 600, type: "confirmation",
    title: "Deal Summary", titleZh: "交易摘要",
    content: "Signal → Supplier → Listing → Costco PO — Total time: 4.2 minutes. Human touchpoints: 1 (final approval). Revenue potential: $189,000.",
    contentZh: "信号 → 供应商 → 上架 → Costco PO — 总耗时: 4.2 分钟。人工介入: 1 次（最终审批）。潜在收入: $189,000。",
  },
];

// ── Animated typing effect ──────────────────────────────────────────────────

function TypeWriter({ text, speed = 20 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    const timer = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <>{displayed}<span className="animate-pulse">|</span></>;
}

// ── Data flow animation (middle column particles) ───────────────────────────

function DataFlowParticle({ direction, active }: { direction: "left" | "right"; active: boolean }) {
  if (!active) return null;
  return (
    <div className={`absolute top-1/2 -translate-y-1/2 ${direction === "right" ? "animate-flow-right" : "animate-flow-left"}`}>
      <div className="w-2 h-2 rounded-full bg-[#ff6b35] shadow-lg shadow-[#ff6b35]/50" />
    </div>
  );
}

// ── Step card ───────────────────────────────────────────────────────────────

const TYPE_ICONS: Record<string, string> = {
  search: "🔍",
  thinking: "🧠",
  result: "📋",
  signal: "📡",
  data: "⚡",
  action: "🎯",
  match: "🏭",
  listing: "📝",
  order: "💰",
  confirmation: "✅",
};

const SIDE_COLORS = {
  buyer: { border: "border-blue-500/30", bg: "bg-blue-500/5", accent: "#3b82f6", label: "Buyer Agent" },
  protocol: { border: "border-[#ff6b35]/30", bg: "bg-[#ff6b35]/5", accent: "#ff6b35", label: "A2A Protocol" },
  seller: { border: "border-green-500/30", bg: "bg-green-500/5", accent: "#22c55e", label: "Seller Agent" },
};

function StepCard({ step, lang, isNew }: { step: TimelineStep; lang: Lang; isNew: boolean }) {
  const colors = SIDE_COLORS[step.side];
  const content = lang === "zh" ? step.contentZh : step.content;
  const title = lang === "zh" ? step.titleZh : step.title;

  return (
    <div
      className={`rounded-xl border ${colors.border} ${colors.bg} p-4 transition-all duration-500 ${
        isNew ? "animate-fade-slide-in" : ""
      } ${step.highlight ? "ring-1 ring-[#ff6b35]/40" : ""}`}
    >
      <div className="flex items-start gap-2 mb-2">
        <span className="text-lg">{TYPE_ICONS[step.type] ?? "📌"}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.accent }}>
            {title}
          </p>
        </div>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        {isNew ? <TypeWriter text={content} speed={15} /> : content}
      </p>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function A2ADemoView({ lang }: { lang: Lang }) {
  const [visibleSteps, setVisibleSteps] = useState<TimelineStep[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [latestId, setLatestId] = useState("");
  const idxRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stepsRef = useRef<TimelineStep[]>([]);

  const buyerRef = useRef<HTMLDivElement>(null);
  const protocolRef = useRef<HTMLDivElement>(null);
  const sellerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((side: "buyer" | "protocol" | "seller") => {
    const ref = side === "buyer" ? buyerRef : side === "protocol" ? protocolRef : sellerRef;
    if (ref.current) {
      ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
    }
  }, []);

  const addStep = useCallback((step: TimelineStep) => {
    stepsRef.current = [...stepsRef.current, step];
    setVisibleSteps([...stepsRef.current]);
    setLatestId(step.id);
    setTimeout(() => scrollToBottom(step.side), 100);
  }, [scrollToBottom]);

  const playNext = useCallback(() => {
    const idx = idxRef.current;
    if (idx >= TIMELINE.length) {
      setIsPlaying(false);
      return;
    }
    const step = TIMELINE[idx];
    idxRef.current = idx + 1;
    addStep(step);

    if (idx + 1 < TIMELINE.length) {
      const nextDelay = TIMELINE[idx + 1].delay;
      timeoutRef.current = setTimeout(() => playNext(), nextDelay + 800);
    } else {
      setIsPlaying(false);
    }
  }, [addStep]);

  const startDemo = useCallback(() => {
    stepsRef.current = [];
    idxRef.current = 0;
    setVisibleSteps([]);
    setIsPlaying(true);
    setLatestId("");
    timeoutRef.current = setTimeout(() => playNext(), 500);
  }, [playNext]);

  const resetDemo = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    stepsRef.current = [];
    idxRef.current = 0;
    setVisibleSteps([]);
    setIsPlaying(false);
    setLatestId("");
  }, []);

  // Filter steps by side
  const buyerSteps = visibleSteps.filter(s => s.side === "buyer");
  const protocolSteps = visibleSteps.filter(s => s.side === "protocol");
  const sellerSteps = visibleSteps.filter(s => s.side === "seller");

  const progress = visibleSteps.length / TIMELINE.length;

  return (
    <div className="min-h-screen flex flex-col pt-16" style={{ background: "#09090f" }}>
      {/* Custom animations */}
      <style jsx global>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide-in {
          animation: fadeSlideIn 0.5s ease-out;
        }
        @keyframes flowRight {
          0% { left: 0; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes flowLeft {
          0% { right: 0; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { right: 100%; opacity: 0; }
        }
        .animate-flow-right { animation: flowRight 1.5s ease-in-out infinite; }
        .animate-flow-left { animation: flowLeft 1.5s ease-in-out infinite; }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(255,107,53,0.3); }
          50% { box-shadow: 0 0 20px rgba(255,107,53,0.6); }
        }
        .animate-pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">
                {t("A2A Commerce Protocol", "A2A 商业协议", lang)}
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ff6b35]/15 text-[#ff6b35] font-semibold uppercase animate-pulse-glow">
                LIVE DEMO
              </span>
            </div>
            <div className="flex items-center gap-3">
              {!isPlaying && visibleSteps.length === 0 && (
                <button
                  onClick={startDemo}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#ff6b35] to-[#ff8f35] text-white hover:opacity-90 transition shadow-lg shadow-orange-500/25"
                >
                  {t("▶ Start Demo", "▶ 开始演示", lang)}
                </button>
              )}
              {isPlaying && (
                <span className="text-sm text-[#ff6b35] font-medium animate-pulse">
                  {t("Running...", "运行中...", lang)}
                </span>
              )}
              {visibleSteps.length > 0 && !isPlaying && (
                <button
                  onClick={startDemo}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 transition"
                >
                  {t("↻ Replay", "↻ 重播", lang)}
                </button>
              )}
              {(isPlaying || visibleSteps.length > 0) && (
                <button
                  onClick={resetDemo}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                >
                  {t("Reset", "重置", lang)}
                </button>
              )}
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-sm text-slate-500 mb-4">
            {t(
              "Watch buyer agents and seller agents negotiate in real time — from search query to purchase order.",
              "观看买方代理与卖方代理实时协商——从搜索查询到采购订单。",
              lang,
            )}
          </p>

          {/* Progress bar */}
          {visibleSteps.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-1 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#ff6b35] transition-all duration-700"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-500">{visibleSteps.length}/{TIMELINE.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex-1 px-6 pb-6">
        <div className="max-w-7xl mx-auto grid grid-cols-[1fr_200px_1fr] gap-4 h-[calc(100vh-260px)]">
          {/* Left: Buyer Agent */}
          <div className="flex flex-col rounded-2xl border border-blue-500/20 bg-blue-500/[0.02] overflow-hidden">
            <div className="px-4 py-3 border-b border-blue-500/20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-blue-400">
                {t("Buyer Agent", "买方代理", lang)}
              </span>
              <span className="text-[10px] text-slate-500 ml-auto">ChatGPT · Costco AI</span>
            </div>
            <div ref={buyerRef} className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
              {visibleSteps.length === 0 && (
                <div className="flex items-center justify-center h-full text-slate-600 text-sm">
                  {t("Waiting for demo to start...", "等待演示开始...", lang)}
                </div>
              )}
              {buyerSteps.map(s => (
                <StepCard key={s.id} step={s} lang={lang} isNew={s.id === latestId} />
              ))}
            </div>
          </div>

          {/* Middle: A2A Protocol */}
          <div className="flex flex-col rounded-2xl border border-[#ff6b35]/20 bg-[#ff6b35]/[0.02] overflow-hidden relative">
            <div className="px-3 py-3 border-b border-[#ff6b35]/20 text-center">
              <span className="text-sm font-semibold text-[#ff6b35]">
                {t("A2A Protocol", "A2A 协议", lang)}
              </span>
            </div>
            <div ref={protocolRef} className="flex-1 overflow-y-auto p-3 space-y-3 scroll-smooth">
              {visibleSteps.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-[#ff6b35]/20 flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <p className="text-[10px] text-slate-600">
                      {t("Data exchange layer", "数据交换层", lang)}
                    </p>
                  </div>
                </div>
              )}
              {protocolSteps.map(s => (
                <StepCard key={s.id} step={s} lang={lang} isNew={s.id === latestId} />
              ))}
            </div>

            {/* Flow indicators */}
            {isPlaying && (
              <>
                <div className="absolute left-0 top-1/3 w-full h-4 overflow-hidden pointer-events-none">
                  <div className="relative h-full">
                    <DataFlowParticle direction="right" active />
                  </div>
                </div>
                <div className="absolute left-0 top-2/3 w-full h-4 overflow-hidden pointer-events-none">
                  <div className="relative h-full">
                    <DataFlowParticle direction="left" active />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right: Seller Agent */}
          <div className="flex flex-col rounded-2xl border border-green-500/20 bg-green-500/[0.02] overflow-hidden">
            <div className="px-4 py-3 border-b border-green-500/20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-green-400">
                {t("Seller Agent", "卖方代理", lang)}
              </span>
              <span className="text-[10px] text-slate-500 ml-auto">Avanti A2A</span>
            </div>
            <div ref={sellerRef} className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
              {visibleSteps.length === 0 && (
                <div className="flex items-center justify-center h-full text-slate-600 text-sm">
                  {t("Waiting for signals...", "等待信号...", lang)}
                </div>
              )}
              {sellerSteps.map(s => (
                <StepCard key={s.id} step={s} lang={lang} isNew={s.id === latestId} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats bar (visible after demo completes) */}
      {!isPlaying && visibleSteps.length === TIMELINE.length && (
        <div className="px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-2xl border border-[#ff6b35]/30 bg-[#ff6b35]/5 p-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                {[
                  { label: t("Total Time", "总耗时", lang), value: "4.2 min", color: "#ff6b35" },
                  { label: t("Human Touchpoints", "人工介入", lang), value: "1", color: "#22c55e" },
                  { label: t("Supplier Matches", "供应商匹配", lang), value: "3", color: "#3b82f6" },
                  { label: t("Listings Generated", "Listing 生成", lang), value: "1", color: "#a78bfa" },
                  { label: t("Revenue Potential", "潜在收入", lang), value: "$189,000", color: "#fbbf24" },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-xl font-bold" style={{ color }}>{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="text-lg font-bold text-white mb-2">
                  {t(
                    "From search query to purchase order — fully automated, agent to agent.",
                    "从搜索查询到采购订单——全自动，代理对代理。",
                    lang,
                  )}
                </p>
                <p className="text-sm text-slate-400">
                  {t(
                    "Avanti A2A: We don't just show you what AI recommends. We close the deal.",
                    "Avanti A2A：我们不只是告诉你 AI 推荐什么。我们帮你成交。",
                    lang,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
