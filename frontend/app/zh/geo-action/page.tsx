"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type Run, type GeoPlan, type CitationHealth, type MarketSignals } from "@/lib/api";
import { getToken } from "@/lib/auth";
import {
  GEO_BRANDS,
  CATEGORY_CONFIG,
  PRIORITY_CONFIG,
  EFFORT_CONFIG,
  type ActionCategory,
  type ActionPriority,
  type GeoAction,
} from "@/lib/geo-action-data";

// ── 中文标签 ─────────────────────────────────────────────────────────────────

const PRIORITY_ZH: Record<ActionPriority, string> = { critical: "必须修复", high: "高优先级", medium: "中优先级" };
const CATEGORY_ZH: Record<ActionCategory, string> = { content: "内容优化", reddit: "Reddit", schema: "结构化标记", citations: "权威引用", social: "社会证明", reviews: "评价管理", tiktok: "TikTok", market_signals: "市场信号" };
const EFFORT_ZH: Record<"low" | "medium" | "high", string> = { low: "低投入", medium: "中投入", high: "高投入" };

type FilterPriority = "all" | ActionPriority;
type FilterCategory = "all" | ActionCategory;

interface PlanData {
  brand: string; category: string; currentGeoScore: number; projectedGeoScore: number;
  weaknesses: string[]; actions: GeoAction[];
}

function toPlanData(plan: GeoPlan): PlanData {
  return { brand: plan.brand_name, category: plan.category, currentGeoScore: plan.current_geo_score, projectedGeoScore: plan.projected_geo_score, weaknesses: plan.weaknesses, actions: plan.actions as GeoAction[] };
}

const STEPS_ZH = ["分析扫描指标...", "识别引用缺口...", "审查竞争损失...", "构建行动计划..."];

function GenerateButton({ onGenerate, generating }: { onGenerate: () => void; generating: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!generating) { setStep(0); return; }
    const t = setInterval(() => setStep(s => (s + 1) % STEPS_ZH.length), 2500);
    return () => clearInterval(t);
  }, [generating]);

  if (generating) {
    return (
      <div className="rounded-2xl p-12 text-center space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <div className="inline-block w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#ff6b35", borderTopColor: "transparent" }} />
        <p className="text-sm font-medium" style={{ color: "#f0f0f8" }}>{STEPS_ZH[step]}</p>
        <p className="text-xs" style={{ color: "#555580" }}>大约需要 10 秒</p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl p-12 text-center space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
      <div className="text-3xl mb-2">🎯</div>
      <p className="text-sm" style={{ color: "#9090b0" }}>此次扫描尚未生成计划。基于扫描数据生成定制 GEO 行动计划。</p>
      <button onClick={onGenerate} className="px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85" style={{ background: "#ff6b35", color: "#fff" }}>
        生成 GEO 行动计划
      </button>
      <p className="text-xs" style={{ color: "#555580" }}>消耗 2 Credits · 约 10 秒</p>
    </div>
  );
}

// ── Score gauge ──────────────────────────────────────────────────────────────

function ScoreGauge({ score, color }: { score: number; color: string }) {
  const r = 40; const circ = 2 * Math.PI * r; const dash = (score / 100) * circ;
  return (
    <svg width={100} height={100} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={r} fill="none" stroke="#1a1a2e" strokeWidth={10} />
      <circle cx={50} cy={50} r={r} fill="none" stroke={color} strokeWidth={10}
        strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ / 4}
        strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease" }} />
      <text x={50} y={50} textAnchor="middle" dominantBaseline="central" fill="#f0f0f8" fontSize={18} fontWeight={700}>{score}</text>
      <text x={50} y={65} textAnchor="middle" fill="#7070a0" fontSize={8} fontWeight={500}>/100</text>
    </svg>
  );
}

// ── Citation Health panel (中文) ─────────────────────────────────────────────

const RISK_ZH = {
  critical: { label: "必须修复", color: "#ff4d6d", bg: "rgba(255,77,109,0.08)", border: "rgba(255,77,109,0.3)", desc: "AI 引用来源质量极低，面临被清洗风险" },
  warning:  { label: "警告",     color: "#f5a623", bg: "rgba(245,166,35,0.08)", border: "rgba(245,166,35,0.3)", desc: "引用质量趋于风险区，需密切关注" },
  healthy:  { label: "健康",     color: "#22c55e", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.3)",  desc: "引用来源质量良好" },
};

const HEALTH_LABEL_ZH: Record<string, string> = {
  "Expert Reviews & Media": "权威评测与媒体",
  "Community & Forums": "社区与论坛",
  "Retail & Listings": "电商平台",
  "Auto-Generated / SEO": "自动生成内容",
};

function CitationHealthPanel({ health, loading }: { health: CitationHealth | null; loading: boolean }) {
  if (loading) {
    return <div className="flex items-center justify-center py-16"><div className="text-sm animate-pulse" style={{ color: "#7070a0" }}>正在分析引用来源...</div></div>;
  }
  if (!health || health.total_citations === 0) {
    return (
      <div className="rounded-2xl p-12 text-center space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <p className="text-sm" style={{ color: "#9090b0" }}>此次扫描没有引用数据。</p>
        <p className="text-xs" style={{ color: "#555580" }}>引用健康度分析需要 AI 响应中包含来源 URL。</p>
      </div>
    );
  }
  const riskCfg = RISK_ZH[health.risk_level];
  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6" style={{ background: riskCfg.bg, border: `1px solid ${riskCfg.border}` }}>
        <ScoreGauge score={health.score} color={riskCfg.color} />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: riskCfg.bg, color: riskCfg.color, border: `1px solid ${riskCfg.border}` }}>{riskCfg.label}</span>
            <span className="text-xs" style={{ color: "#7070a0" }}>{riskCfg.desc}</span>
          </div>
          <p className="text-sm" style={{ color: "#9090b0" }}>基于此次扫描中 {health.total_citations} 个引用来源的引用健康度评分。</p>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
        <div className="px-6 py-4" style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
          <h3 className="font-semibold text-sm">引用来源构成</h3>
          <p className="text-xs mt-0.5" style={{ color: "#7070a0" }}>AI 模型从哪些类型的来源获取引用数据</p>
        </div>
        <div className="px-6 pt-5 pb-4" style={{ background: "#0a0a12" }}>
          <div className="flex rounded-lg overflow-hidden h-4 gap-0.5 mb-2">
            {health.breakdown.map(b => <div key={b.type} style={{ width: `${b.percent}%`, background: b.color, opacity: 0.85 }} title={`${HEALTH_LABEL_ZH[b.label] || b.label}: ${b.percent}%`} />)}
          </div>
          <div className="flex flex-wrap gap-3">
            {health.breakdown.map(b => (
              <div key={b.type} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: b.color }} />
                <span className="text-xs" style={{ color: "#7070a0" }}>{HEALTH_LABEL_ZH[b.label] || b.label} <strong style={{ color: "#f0f0f8" }}>{b.percent}%</strong></span>
              </div>
            ))}
          </div>
        </div>
        <div className="divide-y" style={{ borderTop: "1px solid #1a1a2e" }}>
          {health.breakdown.map(b => (
            <div key={b.type} className="px-6 py-4 flex items-start gap-4" style={{ background: "#0a0a12" }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>{HEALTH_LABEL_ZH[b.label] || b.label}</span>
                  {b.risk_tag && <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: b.risk_tag === "Critical" ? "rgba(255,77,109,0.12)" : "rgba(245,166,35,0.12)", color: b.risk_tag === "Critical" ? "#ff4d6d" : "#f5a623" }}>{b.risk_tag === "Critical" ? "危险" : "关注"}</span>}
                </div>
                <div className="text-xs" style={{ color: "#7070a0" }}>{b.examples.join(" \u00b7 ")}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-2xl font-black" style={{ color: b.color }}>{b.percent}%</div>
                <div className="w-16 h-1.5 rounded-full mt-1 overflow-hidden" style={{ background: "#1a1a2e" }}><div className="h-full rounded-full" style={{ width: `${b.percent}%`, background: b.color }} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#ff6b35" }}>AI 引用健康的三大标准</div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { n: "\u2460", title: "真实专家", desc: "由领域专家撰写或验证的内容。AI 模型对专家署名内容的引用权重是匿名来源的 4 倍。", color: "#22c55e" },
            { n: "\u2461", title: "真实数据", desc: "附有可验证测试来源的技术规格——PDF、实验室认证、独立基准测试。AI 优先引用有数据支撑的事实。", color: "#f5a623" },
            { n: "\u2462", title: "真实结构", desc: "遵循买家决策路径的内容——对比、使用场景、问题-解决方案。结构化内容获得 2.3 倍以上的 AI 引用。", color: "#ff6b35" },
          ].map(s => (
            <div key={s.n} className="space-y-2">
              <div className="text-2xl font-black" style={{ color: s.color }}>{s.n}</div>
              <div className="font-semibold text-sm">{s.title}</div>
              <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 市场信号面板 ───────────────────────────────────────────────────────────

const ALIGNMENT_ZH: Record<string, { label: string; color: string; bg: string }> = {
  strong:    { label: "强对齐",   color: "#22c55e", bg: "rgba(34,197,94,0.08)" },
  moderate:  { label: "中等对齐", color: "#f5a623", bg: "rgba(245,166,35,0.08)" },
  weak:      { label: "弱对齐",   color: "#ff6b35", bg: "rgba(255,107,53,0.08)" },
  divergent: { label: "信号分歧", color: "#ff4d6d", bg: "rgba(255,77,109,0.08)" },
};

const TREND_ARROW: Record<string, string> = { up: "↑", slightly_up: "↗", stable: "→", slightly_down: "↘", down: "↓", unknown: "–" };
const TREND_ZH: Record<string, string> = { up: "上升", slightly_up: "微升", stable: "稳定", slightly_down: "微降", down: "下降", unknown: "未知" };
const SENTIMENT_ZH: Record<string, string> = { positive: "正面", negative: "负面", mixed: "中性", unknown: "未知" };

function MarketSignalsPanel({ signals, loading }: { signals: MarketSignals | null; loading: boolean }) {
  if (loading) {
    return <div className="flex items-center justify-center py-16"><div className="text-sm animate-pulse" style={{ color: "#7070a0" }}>正在获取跨平台市场信号...</div></div>;
  }
  if (!signals) {
    return (
      <div className="rounded-2xl p-12 text-center space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <p className="text-sm" style={{ color: "#9090b0" }}>暂无市场信号数据。</p>
        <p className="text-xs" style={{ color: "#555580" }}>市场信号需要已完成的扫描数据（品牌 + 品类）。</p>
      </div>
    );
  }
  const alignment = ALIGNMENT_ZH[signals.alignment_label] ?? ALIGNMENT_ZH.moderate;
  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6" style={{ background: alignment.bg, border: `1px solid ${alignment.color}33` }}>
        <ScoreGauge score={signals.market_alignment_score} color={alignment.color} />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: alignment.bg, color: alignment.color, border: `1px solid ${alignment.color}44` }}>{alignment.label}</span>
          </div>
          <p className="text-sm" style={{ color: "#9090b0" }}>市场-AI 对齐度评分 — 真实市场信号与品牌 AI 可见度的匹配程度。</p>
          <p className="text-xs mt-1" style={{ color: "#555580" }}>基于 Reddit 口碑、YouTube KOL 覆盖、TikTok 商城存在度和 Google 搜索趋势。</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Reddit */}
        <div className="rounded-2xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="text-lg">🧵</span><span className="font-semibold text-sm">Reddit 口碑</span></div>
            <span className="text-2xl font-black" style={{ color: signals.reddit_score >= 60 ? "#22c55e" : signals.reddit_score >= 30 ? "#f5a623" : "#ff4d6d" }}>{signals.reddit_score}%</span>
          </div>
          <div className="flex gap-4 text-xs" style={{ color: "#7070a0" }}><span>{signals.reddit_post_count} 篇帖子</span><span>情绪: {SENTIMENT_ZH[signals.reddit_sentiment] ?? signals.reddit_sentiment}</span></div>
          {signals.reddit_top_posts.length > 0 && <div className="space-y-1.5">{signals.reddit_top_posts.map((p, i) => (
            <div key={i} className="text-xs truncate" style={{ color: "#9090b0" }}><span style={{ color: "#555580" }}>↑{p.score}</span>{" "}{p.url ? <a href={p.url} target="_blank" rel="noreferrer" className="hover:underline">{p.title}</a> : p.title}</div>
          ))}</div>}
        </div>
        {/* YouTube KOL */}
        <div className="rounded-2xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="text-lg">📹</span><span className="font-semibold text-sm">YouTube KOL 覆盖</span></div>
            <span className="text-2xl font-black" style={{ color: signals.kol_count >= 5 ? "#22c55e" : signals.kol_count >= 2 ? "#f5a623" : "#555580" }}>{signals.kol_count}</span>
          </div>
          <div className="flex gap-4 text-xs" style={{ color: "#7070a0" }}><span>{(signals.kol_total_views / 1000).toFixed(0)}K 播放量</span><span>{signals.kol_positive_pct}% 正面</span></div>
          {signals.kol_top_creators.length > 0 && <div className="space-y-1.5">{signals.kol_top_creators.map((k, i) => (
            <div key={i} className="text-xs truncate" style={{ color: "#9090b0" }}><span className="px-1.5 py-0.5 rounded text-xs" style={{ background: "#161625", color: "#7070a0" }}>{k.tier}</span>{" "}{k.channel_name} — {(k.views / 1000).toFixed(0)}K</div>
          ))}</div>}
        </div>
        {/* TikTok Shop */}
        <div className="rounded-2xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="text-lg">🎵</span><span className="font-semibold text-sm">TikTok 商城</span></div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={signals.tiktok_present ? { background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" } : { background: "#161625", color: "#555580" }}>
              {signals.tiktok_present ? (signals.tiktok_trending ? "热卖中" : "已上架") : "未上架"}
            </span>
          </div>
          <div className="flex gap-4 text-xs" style={{ color: "#7070a0" }}><span>{signals.tiktok_product_count} 件商品</span>{signals.tiktok_avg_rating > 0 && <span>均分: {signals.tiktok_avg_rating.toFixed(1)}</span>}</div>
          {signals.tiktok_top_products.length > 0 && <div className="space-y-1.5">{signals.tiktok_top_products.map((p, i) => (
            <div key={i} className="text-xs truncate" style={{ color: "#9090b0" }}>{p.title} — {p.price} · {p.sales} 单</div>
          ))}</div>}
        </div>
        {/* Google Trends */}
        <div className="rounded-2xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="text-lg">📈</span><span className="font-semibold text-sm">Google 搜索趋势</span></div>
            <span className="text-2xl font-black" style={{ color: signals.google_trend_direction.includes("up") ? "#22c55e" : signals.google_trend_direction.includes("down") ? "#ff4d6d" : "#f5a623" }}>
              {TREND_ARROW[signals.google_trend_direction] ?? "–"}
            </span>
          </div>
          <div className="flex gap-4 text-xs" style={{ color: "#7070a0" }}>
            <span>方向: {TREND_ZH[signals.google_trend_direction] ?? signals.google_trend_direction}</span>
            {signals.google_delta !== null && <span>4 周变化: {signals.google_delta > 0 ? "+" : ""}{signals.google_delta.toFixed(1)}%</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GeoActionZhPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [planNotFound, setPlanNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("all");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"actions" | "health" | "signals">("actions");
  const [citationHealth, setCitationHealth] = useState<CitationHealth | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [marketSignals, setMarketSignals] = useState<MarketSignals | null>(null);
  const [signalsLoading, setSignalsLoading] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setIsDemo(true);
      const d = GEO_BRANDS[0];
      setPlan({ brand: d.brand, category: d.category, currentGeoScore: d.currentGeoScore, projectedGeoScore: d.projectedGeoScore, weaknesses: d.weaknesses, actions: d.actions });
      setLoading(false);
      return;
    }
    api.listRuns()
      .then(all => { const c = all.filter(r => r.status === "done"); setRuns(c); if (c.length > 0) setSelectedRunId(c[0].id); else setLoading(false); })
      .catch(() => { setError("加载失败"); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!selectedRunId || isDemo) return;
    setLoading(true); setPlan(null); setPlanNotFound(false); setError(null);
    setFilterPriority("all"); setFilterCategory("all"); setExpandedId(null);
    setActiveTab("actions"); setCitationHealth(null); setMarketSignals(null);
    api.getGeoPlan(selectedRunId)
      .then(p => { setPlan(toPlanData(p)); setPlanNotFound(false); })
      .catch(e => { if (String(e).includes("404")) setPlanNotFound(true); else setError("加载计划失败"); })
      .finally(() => setLoading(false));
  }, [selectedRunId, isDemo]);

  const handleGenerate = async () => {
    if (!selectedRunId) return;
    setGenerating(true); setError(null);
    try { const p = await api.createGeoPlan(selectedRunId); setPlan(toPlanData(p)); setPlanNotFound(false); }
    catch (e) { setError(String(e)); }
    finally { setGenerating(false); }
  };

  const handleTabSwitch = async (tab: "actions" | "health" | "signals") => {
    setActiveTab(tab);
    if (tab === "health" && !citationHealth && selectedRunId && !isDemo) {
      setHealthLoading(true);
      try { const resp = await api.getRunSources(selectedRunId); setCitationHealth(resp.citation_health); }
      catch { /* noop */ }
      finally { setHealthLoading(false); }
    }
    if (tab === "signals" && !marketSignals && selectedRunId && !isDemo) {
      setSignalsLoading(true);
      try { const data = await api.getMarketSignals(selectedRunId); setMarketSignals(data); }
      catch { /* noop */ }
      finally { setSignalsLoading(false); }
    }
  };

  const scoreLift = plan ? plan.projectedGeoScore - plan.currentGeoScore : 0;
  const criticalCount = plan?.actions.filter(a => a.priority === "critical").length ?? 0;
  const highCount = plan?.actions.filter(a => a.priority === "high").length ?? 0;

  const filtered = plan ? plan.actions.filter(a => {
    if (filterPriority !== "all" && a.priority !== filterPriority) return false;
    if (filterCategory !== "all" && a.category !== filterCategory) return false;
    return true;
  }).sort((a, b) => ({ critical: 0, high: 1, medium: 2 }[a.priority] - { critical: 0, high: 1, medium: 2 }[b.priority])) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.25)" }}>
            GEO 行动计划
          </div>
          <div className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,107,53,0.08)", color: "#ff6b35" }}>
            由 Avanti 提供支持
          </div>
        </div>
        <h1 className="text-3xl font-black">你的 AI 可见度实战手册——逐步执行</h1>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "#9090b0" }}>
          知道 GEO 评分只是第一步。这份手册告诉你具体要修复什么、发布什么、说什么——让 AI 模型开始更准确、更频繁地引用你的品牌。
        </p>
      </div>

      {isDemo && (
        <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.2)" }}>
          <span className="text-lg">🔍</span>
          <div className="flex-1"><p className="text-sm font-medium" style={{ color: "#f0f0f8" }}>这是演示计划。登录并运行扫描以获取你的定制 GEO 行动计划。</p></div>
          <Link href="/zh/login" className="px-4 py-2 rounded-lg text-sm font-medium shrink-0" style={{ background: "#ff6b35", color: "#fff" }}>登录</Link>
        </div>
      )}

      {!isDemo && runs.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>选择扫描</div>
          <div className="flex gap-2 flex-wrap">
            {runs.slice(0, 8).map(r => (
              <button key={r.id} onClick={() => setSelectedRunId(r.id)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-colors"
                style={r.id === selectedRunId ? { background: "#1a1a2e", border: "1px solid #ff6b35", color: "#f0f0f8" } : { background: "#0f0f17", border: "1px solid #25253f", color: "#7070a0" }}>
                <span>{r.brand_name}</span>
                <span className="text-xs" style={{ color: "#555580" }}>{new Date(r.created_at).toLocaleDateString()}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {!isDemo && runs.length === 0 && !loading && (
        <div className="rounded-2xl p-12 text-center space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <p className="text-sm" style={{ color: "#9090b0" }}>运行你的第一次 AI 可见度扫描，获取定制 GEO 行动计划。</p>
          <Link href="/zh/audit" className="inline-block px-6 py-3 rounded-xl text-sm font-semibold" style={{ background: "#ff6b35", color: "#fff" }}>开始免费审计</Link>
        </div>
      )}

      {loading && <div className="flex items-center justify-center py-16"><div className="text-sm animate-pulse" style={{ color: "#7070a0" }}>加载中...</div></div>}
      {error && <div className="rounded-lg p-4 text-sm" style={{ background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)", color: "#ff4d6d" }}>{error}</div>}
      {planNotFound && !generating && <GenerateButton onGenerate={handleGenerate} generating={false} />}
      {generating && <GenerateButton onGenerate={handleGenerate} generating={true} />}

      {plan && !loading && !generating && (
        <>
          {/* Score card */}
          <div className="rounded-2xl p-6 grid md:grid-cols-3 gap-6" style={{ background: "#0f0f17", border: "1px solid rgba(96,165,250,0.25)" }}>
            <div className="flex flex-col justify-center">
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>当前 GEO 评分</div>
              <div className="text-6xl font-black mb-1" style={{ color: plan.currentGeoScore >= 70 ? "#22c55e" : plan.currentGeoScore >= 40 ? "#f5a623" : "#ff4d6d" }}>{plan.currentGeoScore}</div>
              <div className="text-xs" style={{ color: "#555580" }}>基于 AI 审计</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="text-3xl" style={{ color: "#7070a0" }}>→</div>
              <div className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }}>
                预计提升 +{scoreLift} 分
              </div>
              <div className="text-xs text-center" style={{ color: "#555580" }}>{criticalCount} 项必须修复 + {highCount} 项高优先级</div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>执行后预测评分</div>
              <div className="text-6xl font-black mb-1" style={{ color: "#22c55e" }}>{plan.projectedGeoScore}</div>
              <div className="text-xs" style={{ color: "#555580" }}>完成全部必须+高优先级行动后</div>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2">
            {(["actions", "health", "signals"] as const).map(tab => (
              <button key={tab} onClick={() => handleTabSwitch(tab)}
                className="text-sm px-5 py-2 rounded-xl font-medium transition-colors"
                style={activeTab === tab
                  ? { background: "#1a1a2e", color: "#f0f0f8", border: "1px solid #ff6b35" }
                  : { background: "transparent", color: "#7070a0", border: "1px solid #25253f" }
                }>
                {tab === "actions" ? "行动计划" : tab === "health" ? "引用健康度 · 1 cr" : "市场信号 · 2 cr"}
              </button>
            ))}
          </div>

          {/* Citation Health tab */}
          {activeTab === "health" && (
            <CitationHealthPanel health={citationHealth} loading={healthLoading} />
          )}

          {/* Market Signals tab */}
          {activeTab === "signals" && (
            <MarketSignalsPanel signals={marketSignals} loading={signalsLoading} />
          )}

          {/* Actions tab */}
          {activeTab === "actions" && (
          <>
          {/* Weaknesses */}
          {plan.weaknesses.length > 0 && (
            <div className="rounded-2xl p-5 space-y-3" style={{ background: "rgba(255,77,109,0.04)", border: "1px solid rgba(255,77,109,0.2)" }}>
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#ff4d6d" }}>拖低 GEO 评分的原因</div>
              <ul className="space-y-2">
                {plan.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#9090b0" }}>
                    <span style={{ color: "#ff4d6d" }} className="shrink-0 mt-0.5">✗</span>{w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setFilterPriority("all")} className="text-xs px-3 py-1 rounded-lg border transition-colors"
                  style={filterPriority === "all" ? { background: "#ff6b3522", color: "#ff6b35", border: "1px solid #ff6b3555" } : { background: "#0f0f17", color: "#7070a0", border: "1px solid #25253f" }}>全部</button>
                {(["critical", "high", "medium"] as ActionPriority[]).map(p => (
                  <button key={p} onClick={() => setFilterPriority(p)} className="text-xs px-3 py-1 rounded-lg border transition-colors"
                    style={filterPriority === p ? { background: PRIORITY_CONFIG[p].bg, color: PRIORITY_CONFIG[p].color, border: `1px solid ${PRIORITY_CONFIG[p].border}` } : { background: "#0f0f17", color: "#7070a0", border: "1px solid #25253f" }}>
                    {PRIORITY_ZH[p]}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setFilterCategory("all")} className="text-xs px-3 py-1 rounded-lg border transition-colors"
                  style={filterCategory === "all" ? { background: "#1a1a2e", color: "#f0f0f8", border: "1px solid #25253f" } : { background: "transparent", color: "#7070a0", border: "1px solid transparent" }}>全部类型</button>
                {(Object.keys(CATEGORY_CONFIG) as ActionCategory[]).map(cat => (
                  <button key={cat} onClick={() => setFilterCategory(cat)} className="text-xs px-3 py-1 rounded-lg border transition-colors"
                    style={filterCategory === cat ? { background: "#1a1a2e", color: "#f0f0f8", border: "1px solid #25253f" } : { background: "transparent", color: "#7070a0", border: "1px solid transparent" }}>
                    {CATEGORY_CONFIG[cat].icon} {CATEGORY_ZH[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
              <div className="text-sm text-center py-8" style={{ color: "#555580" }}>当前筛选条件下没有行动项。</div>
            ) : (
              <div className="space-y-3">
                {filtered.map((action, i) => {
                  const pC = PRIORITY_CONFIG[action.priority];
                  const catC = CATEGORY_CONFIG[action.category];
                  const isExp = expandedId === action.id;
                  return (
                    <div key={action.id} className="rounded-2xl overflow-hidden" style={{ background: "#0f0f17", border: `1px solid ${isExp ? pC.border : "#1a1a2e"}` }}>
                      <button className="w-full px-5 py-4 flex items-start gap-3 text-left" onClick={() => setExpandedId(isExp ? null : action.id)}>
                        <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mt-0.5" style={{ background: pC.bg, color: pC.color }}>{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: pC.color, background: pC.bg }}>{PRIORITY_ZH[action.priority]}</span>
                            <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#161625", color: "#9090b0" }}>{catC.icon} {CATEGORY_ZH[action.category]}</span>
                            <span className="text-xs font-semibold" style={{ color: "#22c55e" }}>{action.impact}</span>
                            <span className="text-xs ml-auto shrink-0" style={{ color: EFFORT_CONFIG[action.effort].color }}>{EFFORT_ZH[action.effort]}</span>
                          </div>
                          <p className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>{action.title}</p>
                        </div>
                        <span className="shrink-0 text-xs mt-1" style={{ color: "#555580" }}>{isExp ? "▲" : "▼"}</span>
                      </button>
                      {isExp && (
                        <div className="px-5 pb-5 space-y-3 border-t" style={{ borderColor: "#1a1a2e" }}>
                          <div className="pt-3 space-y-3">
                            <div>
                              <div className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "#7070a0" }}>为什么对 GEO 重要</div>
                              <p className="text-sm leading-relaxed" style={{ color: "#9090b0" }}>{action.why}</p>
                            </div>
                            <div className="rounded-xl p-4" style={{ background: "#161625", border: "1px solid #25253f" }}>
                              <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#60a5fa" }}>如何执行</div>
                              <p className="text-sm leading-relaxed" style={{ color: "#c0c0d8" }}>{action.how}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          </>
          )}
        </>
      )}

      {/* How GEO works */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: "#ff6b35" }}>GEO 优化的运作原理</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: "📡", title: "AI 抓取公开网络", desc: "ChatGPT、Claude 和 Gemini 从你的产品页面、Reddit、评测网站和新闻文章中提取内容。内容的质量和结构决定了它们的输出。" },
            { icon: "⚡", title: "结构胜过内容数量", desc: "一个带有结构化标记的 FAQ 页面，比 10 篇博文更有效。AI 是一个解析器——给它清晰、结构化的事实，它就会引用。" },
            { icon: "📈", title: "GEO 效果随时间叠加", desc: "每个行动都会强化下一个。修正产品页规格 + 回复 Reddit 帖子 + 获得一篇专家评测，形成的引用三角很难被取代。" },
          ].map(item => (
            <div key={item.icon} className="flex gap-3">
              <div className="text-xl shrink-0">{item.icon}</div>
              <div>
                <div className="font-semibold text-sm mb-1">{item.title}</div>
                <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-5" style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.2)" }}>
        <div className="flex-1">
          <div className="font-semibold mb-1">获取你品牌的定制 GEO 行动计划</div>
          <p className="text-sm" style={{ color: "#9090b0" }}>我们将审计你的 AI 可见度，找出引用瓶颈，并给你一份逐步修复的实战手册。</p>
        </div>
        <div className="flex gap-3 shrink-0 flex-wrap">
          <Link href="/zh/audit" className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85" style={{ background: "#ff6b35", color: "#fff" }}>免费审计 →</Link>
          <Link href="/zh/hallucination" className="px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80" style={{ border: "1px solid #25253f", color: "#f0f0f8" }}>查看幻觉检测 →</Link>
        </div>
      </div>
    </div>
  );
}
