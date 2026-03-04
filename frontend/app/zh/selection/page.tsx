"use client";

import { useState } from "react";
import Link from "next/link";
import { SELECTION_DATA, SECTIONS, type SellerSignal } from "@/lib/selection-data";

const ARRS_COLOR = (arrs: number) =>
  arrs < 30 ? "#22c55e" : arrs < 50 ? "#f5a623" : "#ff4d6d";

const SIGNAL_CONFIG: Record<SellerSignal, { label: string; color: string; bg: string }> = {
  strong_buy: { label: "强烈推荐入场", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  watch:      { label: "观望",         color: "#f5a623", bg: "rgba(245,166,35,0.1)" },
  avoid:      { label: "暂缓",         color: "#7070a0", bg: "rgba(112,112,160,0.08)" },
};

const TREND_ICON: Record<string, string> = { up: "↑", stable: "→", down: "↓" };
const TREND_COLOR: Record<string, string> = { up: "#22c55e", stable: "#7070a0", down: "#ff4d6d" };

export default function ZhSelectionPage() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? SELECTION_DATA
    : SELECTION_DATA.filter((c) => c.parentSection === filter);

  return (
    <div className="space-y-10 py-12">
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
          这些是 AI 正在引导买家购买的品类和品牌——每月更新。
        </p>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cat) => {
          const sig = SIGNAL_CONFIG[cat.sellerSignal];
          const maxSov = cat.topBrands[0].sov;
          return (
            <div
              key={cat.id}
              className="rounded-xl p-5 space-y-4 flex flex-col"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-sm">{cat.categoryZh}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#7070a0" }}>{cat.parentSectionZh}</div>
                </div>
                <div className="text-xs font-bold shrink-0" style={{ color: TREND_COLOR[cat.trend] }}>
                  {TREND_ICON[cat.trend]} {cat.trendPts} pts
                </div>
              </div>

              <div
                className="text-xs font-bold px-2.5 py-1 rounded-full self-start"
                style={{ background: sig.bg, color: sig.color }}
              >
                {sig.label}
              </div>

              <div className="space-y-2">
                {cat.topBrands.map((b) => (
                  <div key={b.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: "#f0f0f8" }}>{b.name}</span>
                      <div className="flex items-center gap-2">
                        <span style={{ color: "#7070a0" }}>{b.sov}% SOV</span>
                        <span
                          className="text-xs font-medium px-1.5 py-0.5 rounded"
                          style={{ background: `${ARRS_COLOR(b.arrs)}18`, color: ARRS_COLOR(b.arrs) }}
                        >
                          {b.arrs}
                        </span>
                      </div>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: "#25253f" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(b.sov / maxSov) * 100}%`, background: "#ff6b35" }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs leading-relaxed mt-auto" style={{ color: "#7070a0" }}>
                {cat.sellerNoteZh}
              </p>
            </div>
          );
        })}
      </div>

      <div
        className="rounded-xl p-5 max-w-2xl mx-auto text-sm space-y-2"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <div className="font-semibold">如何解读数据</div>
        <div className="space-y-1 text-xs" style={{ color: "#7070a0" }}>
          <div><span style={{ color: "#22c55e" }}>ARRS &lt; 30</span> = 该品牌经常被 AI 推荐</div>
          <div><span style={{ color: "#f5a623" }}>ARRS 30–49</span> = AI 存在感中等</div>
          <div><span style={{ color: "#ff4d6d" }}>ARRS ≥ 50</span> = AI 可见度弱——有入场空间</div>
          <div className="pt-1">SOV（声量份额）= 该品牌在此品类 AI 提及中所占的百分比</div>
        </div>
      </div>

      <div
        className="rounded-xl p-8 text-center space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="font-semibold">你的品牌在这份榜单里吗？</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          免费诊断，查看你的 ARRS 评分，以及与同品类所有竞品的 SOV 对比。
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/zh/audit"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            立即免费诊断 →
          </Link>
          <a
            href="https://calendly.com/brivesubscription/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            预约策略通话
          </a>
        </div>
      </div>
    </div>
  );
}
