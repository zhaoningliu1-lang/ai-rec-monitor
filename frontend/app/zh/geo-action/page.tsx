"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GEO_BRANDS,
  CATEGORY_CONFIG,
  PRIORITY_CONFIG,
  EFFORT_CONFIG,
  type ActionCategory,
  type ActionPriority,
} from "@/lib/geo-action-data";

// ── Config（中文标签）────────────────────────────────────────────────────────

const PRIORITY_LABEL_ZH: Record<ActionPriority, string> = {
  critical: "必须修复",
  high:     "高优先级",
  medium:   "中优先级",
};

const CATEGORY_LABEL_ZH: Record<ActionCategory, string> = {
  content:   "内容优化",
  reddit:    "Reddit",
  schema:    "结构化标记",
  citations: "权威引用",
  social:    "社会证明",
  reviews:   "评价管理",
};

const EFFORT_LABEL_ZH: Record<"low" | "medium" | "high", string> = {
  low:    "低投入",
  medium: "中投入",
  high:   "高投入",
};

type FilterPriority = "all" | ActionPriority;
type FilterCategory = "all" | ActionCategory;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GeoActionZhPage() {
  const [selectedBrandId, setSelectedBrandId] = useState(GEO_BRANDS[0].id);
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("all");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const brand = GEO_BRANDS.find(b => b.id === selectedBrandId)!;
  const scoreLift = brand.projectedGeoScore - brand.currentGeoScore;

  const filteredActions = brand.actions.filter(a => {
    if (filterPriority !== "all" && a.priority !== filterPriority) return false;
    if (filterCategory !== "all" && a.category !== filterCategory) return false;
    return true;
  });

  const priorityOrder: Record<ActionPriority, number> = { critical: 0, high: 1, medium: 2 };
  filteredActions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const criticalCount = brand.actions.filter(a => a.priority === "critical").length;
  const highCount = brand.actions.filter(a => a.priority === "high").length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.25)" }}
          >
            GEO 行动计划
          </div>
          <div
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,107,53,0.08)", color: "#ff6b35" }}
          >
            由 Avanti 提供支持
          </div>
        </div>
        <h1 className="text-3xl font-black">你的 AI 可见度实战手册——逐步执行</h1>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "#9090b0" }}>
          知道 GEO 评分只是第一步。这份手册告诉你具体要修复什么、发布什么、说什么——让 AI 模型开始更准确、更频繁地引用你的品牌。
        </p>
      </div>

      {/* Brand selector */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>
          选择品牌
        </div>
        <div className="flex gap-2 flex-wrap">
          {GEO_BRANDS.map(b => {
            const lift = b.projectedGeoScore - b.currentGeoScore;
            const active = b.id === selectedBrandId;
            return (
              <button
                key={b.id}
                onClick={() => { setSelectedBrandId(b.id); setFilterPriority("all"); setFilterCategory("all"); setExpandedId(null); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-colors"
                style={
                  active
                    ? { background: "#1a1a2e", border: "1px solid #ff6b35", color: "#f0f0f8" }
                    : { background: "#0f0f17", border: "1px solid #25253f", color: "#7070a0" }
                }
              >
                <span>{b.brand}</span>
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{ color: "#22c55e", background: "rgba(34,197,94,0.12)" }}
                >
                  +{lift}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Score projection card */}
      <div
        className="rounded-2xl p-6 grid md:grid-cols-3 gap-6"
        style={{ background: "#0f0f17", border: "1px solid rgba(96,165,250,0.25)" }}
      >
        <div className="flex flex-col justify-center">
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>
            当前 GEO 评分
          </div>
          <div
            className="text-6xl font-black mb-1"
            style={{ color: brand.currentGeoScore >= 70 ? "#22c55e" : brand.currentGeoScore >= 40 ? "#f5a623" : "#ff4d6d" }}
          >
            {brand.currentGeoScore}
          </div>
          <div className="text-xs" style={{ color: "#555580" }}>基于 AI 审计</div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-3xl" style={{ color: "#7070a0" }}>→</div>
          <div
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }}
          >
            预计提升 +{scoreLift} 分
          </div>
          <div className="text-xs text-center" style={{ color: "#555580" }}>
            {criticalCount} 项必须修复 + {highCount} 项高优先级
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>
            执行后预测评分
          </div>
          <div className="text-6xl font-black mb-1" style={{ color: "#22c55e" }}>
            {brand.projectedGeoScore}
          </div>
          <div className="text-xs" style={{ color: "#555580" }}>完成全部必须+高优先级行动后</div>
        </div>
      </div>

      {/* Weaknesses */}
      <div
        className="rounded-2xl p-5 space-y-3"
        style={{ background: "rgba(255,77,109,0.04)", border: "1px solid rgba(255,77,109,0.2)" }}
      >
        <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#ff4d6d" }}>
          拖低 GEO 评分的原因
        </div>
        <ul className="space-y-2">
          {brand.weaknesses.map((w, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#9090b0" }}>
              <span style={{ color: "#ff4d6d" }} className="shrink-0 mt-0.5">✗</span>
              {w}
            </li>
          ))}
        </ul>
      </div>

      {/* Action list */}
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterPriority("all")}
              className="text-xs px-3 py-1 rounded-lg border transition-colors"
              style={
                filterPriority === "all"
                  ? { background: "#ff6b3522", color: "#ff6b35", border: "1px solid #ff6b3555" }
                  : { background: "#0f0f17", color: "#7070a0", border: "1px solid #25253f" }
              }
            >
              全部
            </button>
            {(["critical", "high", "medium"] as ActionPriority[]).map(p => {
              const cfg = PRIORITY_CONFIG[p];
              return (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className="text-xs px-3 py-1 rounded-lg border transition-colors"
                  style={
                    filterPriority === p
                      ? { background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }
                      : { background: "#0f0f17", color: "#7070a0", border: "1px solid #25253f" }
                  }
                >
                  {PRIORITY_LABEL_ZH[p]}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterCategory("all")}
              className="text-xs px-3 py-1 rounded-lg border transition-colors"
              style={
                filterCategory === "all"
                  ? { background: "#1a1a2e", color: "#f0f0f8", border: "1px solid #25253f" }
                  : { background: "transparent", color: "#7070a0", border: "1px solid transparent" }
              }
            >
              全部类型
            </button>
            {(Object.keys(CATEGORY_CONFIG) as ActionCategory[]).map(cat => {
              const cfg = CATEGORY_CONFIG[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className="text-xs px-3 py-1 rounded-lg border transition-colors"
                  style={
                    filterCategory === cat
                      ? { background: "#1a1a2e", color: "#f0f0f8", border: "1px solid #25253f" }
                      : { background: "transparent", color: "#7070a0", border: "1px solid transparent" }
                  }
                >
                  {cfg.icon} {CATEGORY_LABEL_ZH[cat]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards */}
        {filteredActions.length === 0 ? (
          <div className="text-sm text-center py-8" style={{ color: "#555580" }}>
            当前筛选条件下没有行动项。
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActions.map((action, i) => {
              const pConfig = PRIORITY_CONFIG[action.priority];
              const catConfig = CATEGORY_CONFIG[action.category];
              const isExpanded = expandedId === action.id;

              return (
                <div
                  key={action.id}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "#0f0f17", border: `1px solid ${isExpanded ? pConfig.border : "#1a1a2e"}` }}
                >
                  <button
                    className="w-full px-5 py-4 flex items-start gap-3 text-left"
                    onClick={() => setExpandedId(isExpanded ? null : action.id)}
                  >
                    <div
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mt-0.5"
                      style={{ background: pConfig.bg, color: pConfig.color }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{ color: pConfig.color, background: pConfig.bg }}
                        >
                          {PRIORITY_LABEL_ZH[action.priority]}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ background: "#161625", color: "#9090b0" }}
                        >
                          {catConfig.icon} {CATEGORY_LABEL_ZH[action.category]}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: "#22c55e" }}>
                          {action.impact}
                        </span>
                        <span className="text-xs ml-auto shrink-0" style={{ color: EFFORT_CONFIG[action.effort].color }}>
                          {EFFORT_LABEL_ZH[action.effort]}
                        </span>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>
                        {action.title}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs mt-1" style={{ color: "#555580" }}>
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-3 border-t" style={{ borderColor: "#1a1a2e" }}>
                      <div className="pt-3 space-y-3">
                        <div>
                          <div className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "#7070a0" }}>
                            为什么对 GEO 重要
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: "#9090b0" }}>
                            {action.why}
                          </p>
                        </div>
                        <div
                          className="rounded-xl p-4"
                          style={{ background: "#161625", border: "1px solid #25253f" }}
                        >
                          <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#60a5fa" }}>
                            如何执行
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: "#c0c0d8" }}>
                            {action.how}
                          </p>
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

      {/* How GEO works */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          GEO 优化的运作原理
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: "📡",
              title: "AI 抓取公开网络",
              desc: "ChatGPT、Claude 和 Gemini 从你的产品页面、Reddit、评测网站和新闻文章中提取内容。内容的质量和结构决定了它们的输出。",
            },
            {
              icon: "⚡",
              title: "结构胜过内容数量",
              desc: "一个带有结构化标记的 FAQ 页面，比 10 篇博文更有效。AI 是一个解析器——给它清晰、结构化的事实，它就会引用。",
            },
            {
              icon: "📈",
              title: "GEO 效果随时间叠加",
              desc: "每个行动都会强化下一个。修正产品页规格 + 回复 Reddit 帖子 + 获得一篇专家评测，形成的引用三角很难被取代。",
            },
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
      <div
        className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-5"
        style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.2)" }}
      >
        <div className="flex-1">
          <div className="font-semibold mb-1">获取你品牌的定制 GEO 行动计划</div>
          <p className="text-sm" style={{ color: "#9090b0" }}>
            我们将审计你的 AI 可见度，找出引用瓶颈，并给你一份逐步修复的实战手册。
          </p>
        </div>
        <div className="flex gap-3 shrink-0 flex-wrap">
          <Link
            href="/zh/audit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            免费审计 →
          </Link>
          <Link
            href="/zh/hallucination"
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ border: "1px solid #25253f", color: "#f0f0f8" }}
          >
            查看幻觉检测 →
          </Link>
        </div>
      </div>

    </div>
  );
}
