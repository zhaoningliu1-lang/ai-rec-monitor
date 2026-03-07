"use client";

import { useState } from "react";
import Link from "next/link";
import {
  KOL_BRANDS,
  PLATFORM_CONFIG,
  TIER_CONFIG,
  ROI_CONFIG,
  type KolPlatform,
  type KolTier,
  type KolSentiment,
} from "@/lib/kol-data";

// ── Config（中文标签）────────────────────────────────────────────────────────

const SENTIMENT_CONFIG: Record<KolSentiment, { label: string; color: string; bg: string }> = {
  positive: { label: "正面",   color: "#22c55e", bg: "rgba(34,197,94,0.10)" },
  negative: { label: "负面",   color: "#ff4d6d", bg: "rgba(255,77,109,0.10)" },
  mixed:    { label: "褒贬不一", color: "#f5a623", bg: "rgba(245,166,35,0.10)" },
};

const ROI_LABEL_ZH: Record<"high" | "medium" | "low" | "negative", string> = {
  high:     "高 ROI",
  medium:   "中 ROI",
  low:      "低 ROI",
  negative: "避免合作",
};

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

type FilterPlatform = "all" | KolPlatform;
type FilterTier = "all" | KolTier;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function KolZhPage() {
  const [selectedBrandId, setSelectedBrandId] = useState(KOL_BRANDS[0].id);
  const [filterPlatform, setFilterPlatform] = useState<FilterPlatform>("all");
  const [filterTier, setFilterTier] = useState<FilterTier>("all");

  const brand = KOL_BRANDS.find(b => b.id === selectedBrandId)!;

  const filteredKols = brand.kols.filter(k => {
    if (filterPlatform !== "all" && k.platform !== filterPlatform) return false;
    if (filterTier !== "all" && k.tier !== filterTier) return false;
    return true;
  }).sort((a, b) => b.aiCitations - a.aiCitations);

  const totalPositive = brand.kols.filter(k => k.sentiment === "positive").length;
  const totalNegative = brand.kols.filter(k => k.sentiment === "negative").length;
  const partnered = brand.kols.filter(k => k.collab).length;

  const kolScoreColor = brand.kolScore >= 70 ? "#22c55e" : brand.kolScore >= 45 ? "#f5a623" : "#ff4d6d";
  const kolScoreBorder = brand.kolScore >= 70 ? "rgba(34,197,94,0.25)" : brand.kolScore >= 45 ? "rgba(245,166,35,0.25)" : "rgba(255,77,109,0.25)";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: "rgba(232,121,249,0.12)", color: "#e879f9", border: "1px solid rgba(232,121,249,0.25)" }}
          >
            KOL 来源追踪
          </div>
          <div
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,107,53,0.08)", color: "#ff6b35" }}
          >
            由 Avanti 提供支持
          </div>
        </div>
        <h1 className="text-3xl font-black">哪些创作者正在塑造 AI 对你品牌的判断？</h1>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "#9090b0" }}>
          AI 模型在回答产品问题时，会引用 YouTube 评测、博客文章和病毒式 TikTok 内容。我们追踪哪些创作者对你品牌的 AI 引用影响力最大——让你知道该与谁合作，以及哪些负面内容需要优先应对。
        </p>
      </div>

      {/* Brand selector */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>
          选择品牌
        </div>
        <div className="flex gap-2 flex-wrap">
          {KOL_BRANDS.map(b => {
            const c = b.kolScore >= 70 ? "#22c55e" : b.kolScore >= 45 ? "#f5a623" : "#ff4d6d";
            const active = b.id === selectedBrandId;
            return (
              <button
                key={b.id}
                onClick={() => { setSelectedBrandId(b.id); setFilterPlatform("all"); setFilterTier("all"); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-colors"
                style={
                  active
                    ? { background: "#1a1a2e", border: "1px solid #ff6b35", color: "#f0f0f8" }
                    : { background: "#0f0f17", border: "1px solid #25253f", color: "#7070a0" }
                }
              >
                <span>{b.brand}</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color: c, background: c + "18" }}>
                  {b.kolScore}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Score card */}
      <div
        className="rounded-2xl p-6 grid md:grid-cols-4 gap-6"
        style={{ background: "#0f0f17", border: `1px solid ${kolScoreBorder}` }}
      >
        <div className="md:col-span-1 flex flex-col justify-center">
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>
            KOL 影响力评分
          </div>
          <div className="text-6xl font-black mb-1" style={{ color: kolScoreColor }}>
            {brand.kolScore}
          </div>
          <div className="text-xs" style={{ color: "#555580" }}>AI 引用强度</div>
        </div>

        <div className="md:col-span-2 grid grid-cols-3 gap-4">
          {[
            { label: "AI 引用数",  value: brand.totalAiKolCitations, color: "#ff6b35" },
            { label: "正面 KOL",   value: totalPositive,             color: "#22c55e" },
            { label: "负面 KOL",   value: totalNegative,             color: "#ff4d6d" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "#161625" }}>
              <div className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: "#7070a0" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="md:col-span-1 flex flex-col justify-center gap-2">
          <div className="rounded-xl p-3" style={{ background: "#161625" }}>
            <div className="text-xs mb-1" style={{ color: "#7070a0" }}>追踪创作者数</div>
            <div className="text-xl font-black" style={{ color: "#f0f0f8" }}>{brand.kols.length}</div>
          </div>
          <div className="rounded-xl p-3" style={{ background: "#161625" }}>
            <div className="text-xs mb-1" style={{ color: "#7070a0" }}>当前合作数</div>
            <div className="text-xl font-black" style={{ color: "#f5a623" }}>{partnered}</div>
          </div>
        </div>
      </div>

      {/* KOL list */}
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex gap-3 flex-wrap items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs self-center" style={{ color: "#555580" }}>平台：</span>
            {(["all", "YouTube", "TikTok", "Instagram", "Blog"] as const).map(p => (
              <button
                key={p}
                onClick={() => setFilterPlatform(p)}
                className="text-xs px-3 py-1 rounded-lg border transition-colors"
                style={
                  filterPlatform === p
                    ? { background: "#e879f922", color: "#e879f9", border: "1px solid #e879f955" }
                    : { background: "#0f0f17", color: "#7070a0", border: "1px solid #25253f" }
                }
              >
                {p === "all" ? "全部" : `${PLATFORM_CONFIG[p as KolPlatform].icon} ${p}`}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs self-center" style={{ color: "#555580" }}>量级：</span>
            {([
              { key: "all",   label: "全部量级" },
              { key: "mega",  label: `头部 (${TIER_CONFIG.mega.range})` },
              { key: "macro", label: `腰部 (${TIER_CONFIG.macro.range})` },
              { key: "micro", label: `尾部 (${TIER_CONFIG.micro.range})` },
            ] as { key: FilterTier; label: string }[]).map(t => (
              <button
                key={t.key}
                onClick={() => setFilterTier(t.key)}
                className="text-xs px-3 py-1 rounded-lg border transition-colors"
                style={
                  filterTier === t.key
                    ? { background: "#1a1a2e", color: "#f0f0f8", border: "1px solid #25253f" }
                    : { background: "transparent", color: "#7070a0", border: "1px solid transparent" }
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        {filteredKols.length === 0 ? (
          <div className="text-sm text-center py-8" style={{ color: "#555580" }}>
            当前筛选条件下没有创作者。
          </div>
        ) : (
          <div className="space-y-3">
            {filteredKols.map(kol => {
              const pConfig = PLATFORM_CONFIG[kol.platform];
              const tConfig = TIER_CONFIG[kol.tier];
              const sConfig = SENTIMENT_CONFIG[kol.sentiment];
              const rConfig = ROI_CONFIG[kol.roi];

              return (
                <div
                  key={kol.id}
                  className="rounded-2xl p-5 space-y-4"
                  style={{ background: "#0f0f17", border: "1px solid #1a1a2e" }}
                >
                  {/* Top row */}
                  <div className="flex items-start gap-4">
                    <div
                      className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                      style={{ background: pConfig.color + "18", color: pConfig.color }}
                    >
                      {pConfig.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-sm" style={{ color: "#f0f0f8" }}>{kol.name}</span>
                        {kol.collab && (
                          <span
                            className="text-xs px-2 py-0.5 rounded"
                            style={{ background: "rgba(245,166,35,0.12)", color: "#f5a623" }}
                          >
                            ★ 合作中
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs" style={{ color: pConfig.color }}>{kol.platform}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#161625", color: tConfig.color }}>
                          {tConfig.label}
                        </span>
                        {kol.subscribers > 0 && (
                          <span className="text-xs" style={{ color: "#7070a0" }}>
                            {fmtNum(kol.subscribers)} 粉丝
                          </span>
                        )}
                        <span className="text-xs" style={{ color: "#7070a0" }}>
                          ~{fmtNum(kol.avgViews)} 均次播放
                        </span>
                        <span className="text-xs" style={{ color: "#555580" }}>{kol.niche}</span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-lg font-black" style={{ color: "#ff6b35" }}>{kol.aiCitations}</div>
                      <div className="text-xs" style={{ color: "#555580" }}>次 AI 引用</div>
                    </div>
                  </div>

                  {/* Top video */}
                  <div className="space-y-2">
                    <div className="text-xs leading-snug font-semibold" style={{ color: "#9090b0" }}>
                      &ldquo;{kol.keyVideo.title}&rdquo;
                      <span className="font-normal ml-2" style={{ color: "#555580" }}>
                        · {fmtNum(kol.keyVideo.views)} 播放 · {kol.keyVideo.publishedMonthsAgo} 个月前
                      </span>
                    </div>
                    <div
                      className="text-xs italic leading-relaxed px-3 py-2.5 rounded-xl"
                      style={{ background: "#161625", color: "#9090b0", borderLeft: "2px solid #e879f940" }}
                    >
                      <span className="text-xs not-italic font-semibold mr-2" style={{ color: "#e879f9" }}>AI 引用：</span>
                      {kol.keyVideo.verdict}
                    </div>
                  </div>

                  {/* Badge row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded"
                      style={{ color: sConfig.color, background: sConfig.bg }}
                    >
                      {sConfig.label}
                    </span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded"
                      style={{ color: rConfig.color, background: rConfig.color + "15" }}
                    >
                      {ROI_LABEL_ZH[kol.roi]}
                    </span>
                    {!kol.collab && kol.roi === "high" && (
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}
                      >
                        → 合作机会
                      </span>
                    )}
                    {kol.roi === "negative" && (
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ background: "rgba(255,77,109,0.08)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.2)" }}
                      >
                        → 需优先应对
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Why KOLs matter */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          KOL 内容如何驱动 AI 引用
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: "🎬",
              title: "AI 引用视频文字稿",
              desc: "AI 模型从视频文字稿和字幕中提取关键声明。头部创作者的评测结论，在视频发布后数年内仍会被逐字引用。",
            },
            {
              icon: "📊",
              title: "高权威创作者 = 高 AI 权重",
              desc: "Wirecutter 和 Project Farm 的评测被 AI 视为高权威来源。来自他们的一次提及，胜过 100 个小型引用。",
            },
            {
              icon: "🤝",
              title: "战略合作能快速扭转叙事",
              desc: "与已有高 AI 引用量的创作者合作，是将准确正面内容注入 AI 参考池最快速的方式。",
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
          <div className="font-semibold mb-1">查看哪些 KOL 正在影响 AI 对你品牌的认知</div>
          <p className="text-sm" style={{ color: "#9090b0" }}>
            免费审计，识别你的顶级引用来源，并获取合作候选人名单以最大化 GEO 评分。
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
            href="/zh/geo-action"
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ border: "1px solid #25253f", color: "#f0f0f8" }}
          >
            查看 GEO 行动计划 →
          </Link>
        </div>
      </div>

    </div>
  );
}
