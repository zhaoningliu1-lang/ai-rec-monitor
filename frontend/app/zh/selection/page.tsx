"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SELECTION_DATA, SECTIONS, PRODUCT_DATA,
  type SellerSignal, type Platform,
} from "@/lib/selection-data";

const PLATFORM_LABEL: Record<Platform, string> = {
  Amazon: "Amazon", TikTok: "TikTok", Shopee: "Shopee", DTC: "独立站", All: "全平台",
};
const PLATFORM_STYLE: Record<Platform, { color: string; bg: string }> = {
  Amazon: { color: "#f5a623", bg: "rgba(245,166,35,0.12)" },
  TikTok: { color: "#f0f0f8", bg: "rgba(240,240,248,0.08)" },
  Shopee: { color: "#ff6b35", bg: "rgba(255,107,53,0.10)" },
  DTC:    { color: "#60a5fa", bg: "rgba(96,165,250,0.10)" },
  All:    { color: "#22c55e", bg: "rgba(34,197,94,0.10)" },
};

const ARRS_COLOR = (arrs: number) =>
  arrs < 30 ? "#22c55e" : arrs < 50 ? "#f5a623" : "#ff4d6d";

const SIGNAL_CONFIG: Record<SellerSignal, { label: string; color: string; bg: string }> = {
  strong_buy: { label: "强烈推荐入场", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  watch:      { label: "观望",         color: "#f5a623", bg: "rgba(245,166,35,0.1)" },
  avoid:      { label: "暂缓",         color: "#7070a0", bg: "rgba(112,112,160,0.08)" },
};

const TREND_ICON: Record<string, string> = { up: "↑", stable: "→", down: "↓" };
const TREND_COLOR: Record<string, string> = { up: "#22c55e", stable: "#7070a0", down: "#ff4d6d" };

const HAS_PRODUCT_DATA = new Set(Object.keys(PRODUCT_DATA));
const FREE_LIMIT = 9;

export default function ZhSelectionPage() {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === "all"
    ? SELECTION_DATA
    : SELECTION_DATA.filter((c) => c.parentSection === filter);

  const freeItems = filter === "all" ? filtered.slice(0, FREE_LIMIT) : filtered;
  const lockedItems = filter === "all" ? filtered.slice(FREE_LIMIT) : [];

  return (
    <div className="space-y-10 py-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div
          className="inline-block text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
        >
          AI 选品情报
        </div>
        <h1 className="text-3xl font-bold">AI 正在告诉买家购买什么</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          我们实时追踪 ChatGPT、Claude、Gemini 和 Perplexity 的推荐规律。
          这些是 AI 正在引导买家购买的品类、品牌和{" "}
          <strong style={{ color: "#f0f0f8" }}>具体产品</strong>{" "}
          ——每月更新。
        </p>
        <div className="flex items-center justify-center gap-3 pt-1 text-xs" style={{ color: "#7070a0" }}>
          <span>16 个品类</span><span>·</span>
          <span>4 大 AI 引擎</span><span>·</span>
          <span>200+ 次查询/月</span><span>·</span>
          <span style={{ color: "#22c55e" }}>● 实时</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap justify-center gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setFilter(s.id)}
            className="text-xs px-4 py-1.5 rounded-full transition-colors font-medium"
            style={
              filter === s.id
                ? { background: "#ff6b35", color: "#fff" }
                : { background: "#0f0f17", border: "1px solid #25253f", color: "#7070a0" }
            }
          >
            {s.labelZh}
          </button>
        ))}
      </div>

      {/* Category grid — free items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {freeItems.map((cat) => {
          const sig = SIGNAL_CONFIG[cat.sellerSignal];
          const maxSov = cat.topBrands[0].sov;
          const products = PRODUCT_DATA[cat.id] ?? [];
          const isExpanded = expanded === cat.id;

          return (
            <div
              key={cat.id}
              className="rounded-xl p-5 space-y-4 flex flex-col"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              {/* Title */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-sm">{cat.categoryZh}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#7070a0" }}>{cat.parentSectionZh}</div>
                </div>
                <div className="text-xs font-bold shrink-0" style={{ color: TREND_COLOR[cat.trend] }}>
                  {TREND_ICON[cat.trend]} {cat.trendPts} pts
                </div>
              </div>

              {/* Signal + platforms */}
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: sig.bg, color: sig.color }}>
                  {sig.label}
                </div>
                {cat.platforms.map((p) => {
                  const ps = PLATFORM_STYLE[p];
                  return (
                    <span key={p} className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: ps.bg, color: ps.color }}>
                      {PLATFORM_LABEL[p]}
                    </span>
                  );
                })}
              </div>

              {/* SOV bars */}
              <div className="space-y-2">
                {cat.topBrands.map((b) => (
                  <div key={b.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: "#f0f0f8" }}>{b.name}</span>
                      <div className="flex items-center gap-2">
                        <span style={{ color: "#7070a0" }}>{b.sov}% SOV</span>
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded"
                          style={{ background: `${ARRS_COLOR(b.arrs)}18`, color: ARRS_COLOR(b.arrs) }}>
                          {b.arrs}
                        </span>
                      </div>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: "#25253f" }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${(b.sov / maxSov) * 100}%`, background: "#ff6b35" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{cat.sellerNoteZh}</p>
              {cat.platformNoteZh && (
                <p className="text-xs leading-relaxed" style={{ color: "#555580", fontStyle: "italic" }}>
                  ↳ {cat.platformNoteZh}
                </p>
              )}

              {/* Product drill-down */}
              {HAS_PRODUCT_DATA.has(cat.id) ? (
                <div>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : cat.id)}
                    className="text-xs font-medium transition-opacity hover:opacity-70 flex items-center gap-1"
                    style={{ color: "#ff6b35" }}
                  >
                    {isExpanded
                      ? "▲ 收起产品列表"
                      : `▼ 查看 AI 推荐的 ${products.length} 款产品`}
                  </button>
                  {isExpanded && (
                    <div className="mt-3 space-y-2 border-t pt-3" style={{ borderColor: "#1e1e30" }}>
                      <div className="text-xs font-semibold uppercase tracking-widest mb-2"
                        style={{ color: "#555580" }}>
                        AI 推荐产品（100 次查询中的被提及次数）
                      </div>
                      {products.map((p) => (
                        <div key={p.name} className="rounded-lg p-3 space-y-1.5"
                          style={{ background: "#0a0a14", border: "1px solid #1e1e30" }}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-xs font-semibold" style={{ color: "#f0f0f8" }}>{p.name}</div>
                              <div className="text-xs" style={{ color: "#555580" }}>{p.brand} · {p.priceRange}</div>
                            </div>
                            <div className="shrink-0 text-right">
                              <div className="text-xs font-bold" style={{ color: "#f5a623" }}>{p.aiMentions}/100</div>
                              <div className="text-xs px-1.5 py-0.5 rounded mt-0.5"
                                style={{ background: `${ARRS_COLOR(p.arrs)}18`, color: ARRS_COLOR(p.arrs) }}>
                                ARRS {p.arrs}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: "#555580", fontStyle: "italic" }}>
                            {p.aiContextZh}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/zh/signup"
                  className="text-xs transition-opacity hover:opacity-70 flex items-center gap-1"
                  style={{ color: "#3a3a5c" }}>
                  ▼ 注册后查看具体产品的 AI 提及数据 →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Locked categories — Kalodata style */}
      {lockedItems.length > 0 && (
        <div className="relative">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            style={{ filter: "blur(3px)", pointerEvents: "none", userSelect: "none", opacity: 0.35 }}
          >
            {lockedItems.map((cat) => (
              <div key={cat.id} className="rounded-xl p-5 space-y-4"
                style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-sm">{cat.categoryZh}</div>
                    <div className="text-xs" style={{ color: "#7070a0" }}>{cat.parentSectionZh}</div>
                  </div>
                  <div className="text-xs font-bold" style={{ color: TREND_COLOR[cat.trend] }}>
                    {TREND_ICON[cat.trend]} {cat.trendPts} pts
                  </div>
                </div>
                <div className="h-5 rounded" style={{ background: "#25253f", width: "45%" }} />
                {cat.topBrands.map((b) => (
                  <div key={b.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: "#f0f0f8" }}>{b.name}</span>
                      <span style={{ color: "#7070a0" }}>{b.sov}% SOV</span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: "#ff6b35", width: `${b.sov}%` }} />
                  </div>
                ))}
                <div className="h-10 rounded" style={{ background: "#25253f", width: "80%" }} />
              </div>
            ))}
          </div>

          {/* Unlock CTA overlay */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl"
            style={{ background: "linear-gradient(to top, #090910 50%, rgba(9,9,16,0.85) 100%)" }}
          >
            <div className="text-center space-y-2 px-6 max-w-sm">
              <div className="text-sm font-bold" style={{ color: "#f0f0f8" }}>
                还有 {lockedItems.length} 个品类待解锁，包括 TikTok 热卖和东南亚市场信号
              </div>
              <p className="text-xs" style={{ color: "#7070a0" }}>
                以及具体产品的 AI 提及数据：哪些产品被买家推荐，AI 给出了什么理由，提及频率多少。
              </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <Link href="/zh/signup"
                className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
                style={{ background: "#ff6b35", color: "#fff" }}>
                免费注册 →
              </Link>
              <Link href="/zh/pricing"
                className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
                style={{ border: "1px solid #25253f", color: "#7070a0" }}>
                查看定价
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Explainer */}
      <div className="rounded-xl p-5 max-w-2xl mx-auto text-sm space-y-2"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <div className="font-semibold">如何解读数据</div>
        <div className="space-y-1 text-xs" style={{ color: "#7070a0" }}>
          <div><span style={{ color: "#22c55e" }}>ARRS &lt; 30</span> = 该品牌经常被 AI 推荐</div>
          <div><span style={{ color: "#f5a623" }}>ARRS 30–49</span> = AI 存在感中等</div>
          <div><span style={{ color: "#ff4d6d" }}>ARRS ≥ 50</span> = AI 可见度弱——有入场空间</div>
          <div><span style={{ color: "#f5a623" }}>X/100</span> = 该产品在 100 次 AI 查询中被提及 X 次</div>
          <div className="pt-1">SOV（声量份额）= 该品牌在此品类 AI 提及中所占的百分比</div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl p-8 text-center space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <p className="font-semibold">你的品牌在这份榜单里吗？</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          免费诊断，查看你的 ARRS 评分、SOV 对比，以及哪些 AI 查询中提到了你。
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/zh/signup"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}>
            立即免费诊断 →
          </Link>
          <a href="https://calendly.com/brivesubscription/30min"
            target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}>
            预约策略通话
          </a>
        </div>
      </div>
    </div>
  );
}
