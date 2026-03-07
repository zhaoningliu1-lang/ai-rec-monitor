"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HALLUCINATION_BRANDS,
  computeHRS,
  type BrandHallucination,
  type ModelName,
  type ClaimStatus,
  type HrsLevel,
} from "@/lib/hallucination-data";

// ── Helpers ───────────────────────────────────────────────────────────────────

const HRS_CONFIG: Record<HrsLevel, { label: string; color: string; bg: string; border: string }> = {
  low:    { label: "低风险",   color: "#22c55e", bg: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.25)" },
  medium: { label: "中等风险", color: "#f5a623", bg: "rgba(245,166,35,0.08)", border: "rgba(245,166,35,0.25)" },
  high:   { label: "高风险",   color: "#ff4d6d", bg: "rgba(255,77,109,0.08)", border: "rgba(255,77,109,0.25)" },
};

const CLAIM_CONFIG: Record<ClaimStatus, { icon: string; label: string; color: string; bg: string }> = {
  accurate: { icon: "✓", label: "准确",     color: "#22c55e", bg: "rgba(34,197,94,0.08)" },
  wrong:    { icon: "✗", label: "幻觉错误", color: "#ff4d6d", bg: "rgba(255,77,109,0.08)" },
  partial:  { icon: "~", label: "部分错误", color: "#f5a623", bg: "rgba(245,166,35,0.08)" },
};

const MODEL_COLORS: Record<ModelName, string> = {
  ChatGPT: "#22c55e",
  Claude:  "#ff6b35",
  Gemini:  "#60a5fa",
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HallucinationZhPage() {
  const [selectedBrandId, setSelectedBrandId] = useState(HALLUCINATION_BRANDS[0].id);
  const [selectedModel, setSelectedModel] = useState<ModelName>("ChatGPT");

  const brand = HALLUCINATION_BRANDS.find(b => b.id === selectedBrandId)!;
  const hrs = computeHRS(brand);
  const hrsConfig = HRS_CONFIG[hrs.level];
  const modelResponse = brand.responses.find(r => r.model === selectedModel)!;
  const modelList: ModelName[] = ["ChatGPT", "Claude", "Gemini"];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: "rgba(255,77,109,0.12)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.25)" }}
          >
            AI 幻觉检测器
          </div>
          <div
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,107,53,0.08)", color: "#ff6b35" }}
          >
            由 Avanti 提供支持
          </div>
        </div>
        <h1 className="text-3xl font-black">AI 在对你的品牌说什么错话？</h1>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "#9090b0" }}>
          AI 助手经常幻觉产品规格、定价和功能。我们对 ChatGPT、Claude 和 Gemini 的 AI 声明与真实产品数据进行事实核查——让你清楚知道 AI 在哪里向买家错误描述你的品牌。
        </p>
      </div>

      {/* Brand selector */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>
          选择品牌
        </div>
        <div className="flex gap-2 flex-wrap">
          {HALLUCINATION_BRANDS.map(b => {
            const bHrs = computeHRS(b);
            const bConfig = HRS_CONFIG[bHrs.level];
            const active = b.id === selectedBrandId;
            return (
              <button
                key={b.id}
                onClick={() => { setSelectedBrandId(b.id); setSelectedModel("ChatGPT"); }}
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
                  style={{ color: bConfig.color, background: bConfig.bg }}
                >
                  {bHrs.score}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* HRS Score card */}
      <div
        className="rounded-2xl p-6 grid md:grid-cols-4 gap-6"
        style={{ background: "#0f0f17", border: `1px solid ${hrsConfig.border}` }}
      >
        {/* Big score */}
        <div className="md:col-span-1 flex flex-col justify-center">
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>
            幻觉风险评分
          </div>
          <div className="text-6xl font-black mb-1" style={{ color: hrsConfig.color }}>
            {hrs.score}%
          </div>
          <div
            className="inline-block text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ color: hrsConfig.color, background: hrsConfig.bg, border: `1px solid ${hrsConfig.border}` }}
          >
            {hrsConfig.label}
          </div>
        </div>

        {/* Stats */}
        <div className="md:col-span-2 grid grid-cols-3 gap-4">
          {[
            { label: "准确",   value: hrs.accurate, color: "#22c55e" },
            { label: "幻觉",   value: hrs.wrong,    color: "#ff4d6d" },
            { label: "部分错误", value: hrs.partial,  color: "#f5a623" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "#161625" }}>
              <div className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: "#7070a0" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* GEO score + summary */}
        <div className="md:col-span-1 flex flex-col justify-center gap-2">
          <div className="rounded-xl p-3" style={{ background: "#161625" }}>
            <div className="text-xs mb-1" style={{ color: "#7070a0" }}>GEO 评分</div>
            <div
              className="text-xl font-black"
              style={{ color: brand.geoScore >= 50 ? "#22c55e" : brand.geoScore >= 30 ? "#f5a623" : "#ff4d6d" }}
            >
              {brand.geoScore}/100
            </div>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#555580" }}>
            共核查 {hrs.total} 条声明，覆盖 {brand.responses.length} 个 AI 模型
          </p>
        </div>
      </div>

      {/* Model tab selector */}
      <div className="space-y-4">
        <div className="flex gap-2">
          {modelList.map(m => (
            <button
              key={m}
              onClick={() => setSelectedModel(m)}
              className="text-sm px-4 py-1.5 rounded-xl border transition-colors font-medium"
              style={
                selectedModel === m
                  ? { background: MODEL_COLORS[m] + "22", color: MODEL_COLORS[m], border: `1px solid ${MODEL_COLORS[m]}55` }
                  : { background: "#161625", color: "#7070a0", border: "1px solid #25253f" }
              }
            >
              {m}
            </button>
          ))}
        </div>

        {/* Claims list */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <div
            className="px-5 py-3 text-xs font-semibold uppercase tracking-wider"
            style={{ background: "#0f0f17", borderBottom: "1px solid #25253f", color: "#7070a0" }}
          >
            {selectedModel} — 针对「{brand.brand}」检测到 {modelResponse.claims.length} 条声明
          </div>
          {modelResponse.claims.map((claim, i) => {
            const cfg = CLAIM_CONFIG[claim.status];
            return (
              <div
                key={i}
                className="px-5 py-4"
                style={{
                  background: i % 2 === 0 ? "#0a0a12" : "#0d0d18",
                  borderBottom: i < modelResponse.claims.length - 1 ? "1px solid #1a1a2e" : undefined,
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Status badge */}
                  <div
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mt-0.5"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {cfg.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    {/* Claim text */}
                    <p className="text-sm" style={{ color: "#f0f0f8" }}>
                      &ldquo;{claim.text}&rdquo;
                    </p>
                    {/* Status + correction */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded"
                        style={{ color: cfg.color, background: cfg.bg }}
                      >
                        {cfg.label}
                      </span>
                      {claim.correction && (
                        <span className="text-xs" style={{ color: "#7070a0" }}>
                          ↳ {claim.correction}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why this matters */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          为什么这很重要
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: "💸",
              title: "错误定价导致流失",
              desc: "当 AI 告诉买家你的产品售价 $79 而非 $99 时，他们在结账时会感到被欺骗——随即跳失。",
            },
            {
              icon: "🛠",
              title: "虚假规格损害信任",
              desc: "买家期待「4K」却收到「1080p」，会留下负面评价，进一步强化 AI 对低质内容的引用。",
            },
            {
              icon: "📉",
              title: "幻觉拉低 GEO 评分",
              desc: "AI 模型会随时间自我修正——经常出现错误 AI 内容的品牌，在未来推荐中会被降权。",
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
          <div className="font-semibold mb-1">为你的品牌做一次幻觉检测</div>
          <p className="text-sm" style={{ color: "#9090b0" }}>
            了解 ChatGPT、Claude 和 Gemini 正在对你的产品说什么——以及它们在哪里说错了。
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
            href="/zh/content-health"
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ border: "1px solid #25253f", color: "#f0f0f8" }}
          >
            查看引用健康度 →
          </Link>
        </div>
      </div>

    </div>
  );
}
