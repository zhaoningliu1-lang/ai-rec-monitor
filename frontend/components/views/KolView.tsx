"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { type Lang, tx } from "@/lib/i18n";
import { api, type KolSearchResult, type KolCrossValidationResponse, type CrossValidationInsight } from "@/lib/api";
import { fetchMe, useCredits } from "@/lib/auth";
import {
  KOL_BRANDS,
  PLATFORM_CONFIG,
  TIER_CONFIG,
  ROI_CONFIG,
  type KolPlatform,
  type KolTier,
  type KolSentiment,
  type BrandKolProfile,
} from "@/lib/kol-data";

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

const SENTIMENT_CFG: Record<KolSentiment, { en: string; zh: string; color: string; bg: string }> = {
  positive: { en: "Positive", zh: "正面",     color: "#22c55e", bg: "rgba(34,197,94,0.10)" },
  negative: { en: "Negative", zh: "负面",     color: "#ff4d6d", bg: "rgba(255,77,109,0.10)" },
  mixed:    { en: "Mixed",    zh: "褒贬不一", color: "#f5a623", bg: "rgba(245,166,35,0.10)" },
};

const ROI_LABELS: Record<string, { en: string; zh: string }> = {
  high:     { en: "High ROI",   zh: "高 ROI" },
  medium:   { en: "Medium ROI", zh: "中 ROI" },
  low:      { en: "Low ROI",    zh: "低 ROI" },
  negative: { en: "Avoid",      zh: "避免合作" },
};

const TIER_LABELS: Record<KolTier, { en: string; zh: string; range: string }> = {
  mega:  { en: "Mega",  zh: "头部", range: "1M+" },
  macro: { en: "Macro", zh: "腰部", range: "100K–1M" },
  micro: { en: "Micro", zh: "尾部", range: "10K–100K" },
};

type FilterPlatform = "all" | KolPlatform;
type FilterTier = "all" | KolTier;

// ── Component ────────────────────────────────────────────────────────────────

export default function KolView({ lang }: { lang: Lang }) {
  const k = (key: string) => tx("kol", key as any, lang);
  const isZh = lang === "zh";
  const prefix = isZh ? "/zh" : "";

  // Auth
  const [me, setMe] = useState<any>(null);
  const viewedBrands = useRef(new Set<string>());
  useEffect(() => { fetchMe().then(setMe).catch(() => {}); }, []);
  const isPaid = me?.plan && me.plan !== "free";

  // Demo brands state
  const [selectedBrandId, setSelectedBrandId] = useState(KOL_BRANDS[0].id);
  const [filterPlatform, setFilterPlatform] = useState<FilterPlatform>("all");
  const [filterTier, setFilterTier] = useState<FilterTier>("all");

  // Live search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<KolSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchDone, setSearchDone] = useState(false);

  // Cross-validation state
  const [crossBrand, setCrossBrand] = useState("");
  const [crossData, setCrossData] = useState<KolCrossValidationResponse | null>(null);
  const [crossLoading, setCrossLoading] = useState(false);

  // Upgrade modal
  const [showUpgrade, setShowUpgrade] = useState(false);

  const brand = KOL_BRANDS.find(b => b.id === selectedBrandId)!;

  const filteredKols = brand.kols.filter(kol => {
    if (filterPlatform !== "all" && kol.platform !== filterPlatform) return false;
    if (filterTier !== "all" && kol.tier !== filterTier) return false;
    return true;
  }).sort((a, b) => b.aiCitations - a.aiCitations);

  const totalPositive = brand.kols.filter(k2 => k2.sentiment === "positive").length;
  const totalNegative = brand.kols.filter(k2 => k2.sentiment === "negative").length;
  const partnered = brand.kols.filter(k2 => k2.collab).length;

  const kolScoreColor = brand.kolScore >= 70 ? "#22c55e" : brand.kolScore >= 45 ? "#f5a623" : "#ff4d6d";
  const kolScoreBorder = brand.kolScore >= 70 ? "rgba(34,197,94,0.25)" : brand.kolScore >= 45 ? "rgba(245,166,35,0.25)" : "rgba(255,77,109,0.25)";

  // Brand selection with credit gating
  async function selectBrand(id: string) {
    if (!me && id !== KOL_BRANDS[0].id) return;
    if (me && !isPaid && !viewedBrands.current.has(id) && id !== KOL_BRANDS[0].id) {
      try {
        await useCredits(1, "kol");
        viewedBrands.current.add(id);
      } catch {
        setShowUpgrade(true);
        return;
      }
    }
    setSelectedBrandId(id);
    setFilterPlatform("all");
    setFilterTier("all");
  }

  // Live search
  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchDone(false);
    try {
      const res = await api.searchKols(searchQuery.trim());
      setSearchResults(res.kols);
      setSearchDone(true);
      if (me) setMe({ ...me, credit_balance: res.credits_remaining ?? me.credit_balance });
    } catch (err: any) {
      if (err?.message?.includes("429")) setShowUpgrade(true);
    } finally {
      setSearchLoading(false);
    }
  }

  // Cross-validation
  async function handleCrossValidate() {
    if (!crossBrand.trim()) return;
    setCrossLoading(true);
    try {
      const res = await api.crossValidateKol(crossBrand.trim());
      setCrossData(res);
      if (me) setMe({ ...me, credit_balance: res.credits_remaining ?? me.credit_balance });
    } catch (err: any) {
      if (err?.message?.includes("429")) setShowUpgrade(true);
    } finally {
      setCrossLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: "rgba(232,121,249,0.12)", color: "#e879f9", border: "1px solid rgba(232,121,249,0.25)" }}
          >
            {k("title")}
          </div>
          <div
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,107,53,0.08)", color: "#ff6b35" }}
          >
            {isZh ? "由 Avanti 提供支持" : "Powered by Avanti"}
          </div>
          {me && (
            <div className="text-xs px-2 py-0.5 rounded-full ml-auto" style={{ background: "#161625", color: "#7070a0" }}>
              {isPaid
                ? k("unlimited")
                : `${me.credit_balance} ${k("creditsRemaining")}`
              }
            </div>
          )}
        </div>
        <h1 className="text-3xl font-black">
          {isZh ? "哪些创作者正在塑造 AI 对你品牌的判断？" : "Which Creators Are Shaping AI\u2019s View of Your Brand?"}
        </h1>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "#9090b0" }}>
          {k("subtitle")}
        </p>
      </div>

      {/* ═══ Section 1: Live YouTube KOL Search ═══ */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <h2 className="font-bold text-sm uppercase tracking-widest" style={{ color: "#e879f9" }}>
          {k("liveSearchTitle")}
        </h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>{k("liveSearchSub")}</p>

        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder={k("searchBrand")}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-transparent border outline-none"
            style={{ borderColor: "#25253f", color: "#f0f0f8" }}
          />
          <button
            onClick={handleSearch}
            disabled={searchLoading || !searchQuery.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-40"
            style={{ background: "#e879f9", color: "#fff" }}
          >
            {searchLoading ? k("searching") : k("searchBtn")}
          </button>
        </div>

        {/* Search results */}
        {searchDone && searchResults.length === 0 && (
          <div className="text-sm text-center py-6" style={{ color: "#555580" }}>{k("noResults")}</div>
        )}
        {searchResults.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs" style={{ color: "#7070a0" }}>{searchResults.length} {k("liveCreators")}</div>
            {searchResults.map(kol => {
              const s = SENTIMENT_CFG[kol.sentiment];
              const tierLabel = TIER_LABELS[kol.tier];
              return (
                <div key={kol.video_id} className="rounded-xl p-4 flex gap-4" style={{ background: "#161625" }}>
                  {kol.thumbnail && (
                    <img src={kol.thumbnail} alt="" className="w-24 h-16 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0 space-y-1">
                    <a
                      href={kol.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold hover:underline block truncate"
                      style={{ color: "#f0f0f8" }}
                    >
                      {kol.video_title}
                    </a>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium" style={{ color: "#e879f9" }}>{kol.channel_name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#0f0f17", color: tierLabel ? (TIER_CONFIG[kol.tier]?.color ?? "#7070a0") : "#7070a0" }}>
                        {tierLabel ? tierLabel[lang] : kol.tier}
                      </span>
                      {kol.subscribers > 0 && (
                        <span className="text-xs" style={{ color: "#7070a0" }}>{fmtNum(kol.subscribers)} {k("subs")}</span>
                      )}
                      <span className="text-xs" style={{ color: "#555580" }}>{fmtNum(kol.views)} {k("views")}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-0.5 rounded" style={{ color: s.color, background: s.bg }}>
                        {s[lang]}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══ Section 2: KOL-AI Cross-Validation ═══ */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <h2 className="font-bold text-sm uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          {k("crossTitle")}
        </h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>{k("crossSub")}</p>

        <div className="flex gap-2">
          <input
            type="text"
            value={crossBrand}
            onChange={e => setCrossBrand(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleCrossValidate()}
            placeholder={k("searchBrand")}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-transparent border outline-none"
            style={{ borderColor: "#25253f", color: "#f0f0f8" }}
          />
          <button
            onClick={handleCrossValidate}
            disabled={crossLoading || !crossBrand.trim() || !me}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-40"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            {crossLoading ? k("crossRunning") : k("crossBtn")}
          </button>
        </div>
        {!me && (
          <div className="text-xs" style={{ color: "#555580" }}>
            {k("loginToUnlock")} · {k("crossCost")}
          </div>
        )}

        {/* Cross-validation results */}
        {crossData && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              {/* KOL coverage */}
              <div className="rounded-xl p-4" style={{ background: "#161625" }}>
                <div className="text-xs font-semibold uppercase mb-2" style={{ color: "#e879f9" }}>{k("kolCoverage")}</div>
                <div className="text-2xl font-black mb-1" style={{ color: "#f0f0f8" }}>{crossData.kol_coverage.total_creators}</div>
                <div className="text-xs" style={{ color: "#7070a0" }}>{k("creators")}</div>
                <div className="text-xs mt-2" style={{ color: "#7070a0" }}>
                  {fmtNum(crossData.kol_coverage.total_views)} {k("totalViews")}
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.10)", color: "#22c55e" }}>
                    {crossData.kol_coverage.positive_pct}% {k("positive")}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(255,77,109,0.10)", color: "#ff4d6d" }}>
                    {crossData.kol_coverage.negative_pct}% {k("negative")}
                  </span>
                </div>
              </div>

              {/* AI visibility */}
              <div className="rounded-xl p-4" style={{ background: "#161625" }}>
                <div className="text-xs font-semibold uppercase mb-2" style={{ color: "#ff6b35" }}>{k("aiVisibility")}</div>
                {crossData.ai_visibility ? (
                  <>
                    <div className="text-2xl font-black mb-1" style={{ color: "#f0f0f8" }}>{crossData.ai_visibility.weighted_sov}%</div>
                    <div className="text-xs" style={{ color: "#7070a0" }}>{k("sovLabel")}</div>
                    <div className="text-xs mt-2" style={{ color: "#7070a0" }}>
                      {k("geoScoreLabel")}: {crossData.ai_visibility.arrs}
                    </div>
                  </>
                ) : (
                  <div className="text-xs" style={{ color: "#555580" }}>{k("noAiData")}</div>
                )}
              </div>
            </div>

            {/* Insights */}
            {crossData.insights.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase" style={{ color: "#7070a0" }}>{k("insightsTitle")}</div>
                {crossData.insights.map((insight: CrossValidationInsight, i: number) => {
                  const colors: Record<string, string> = {
                    aligned: "#22c55e", opportunity: "#60a5fa", risk: "#f5a623", critical: "#ff4d6d",
                    mega_coverage: "#e879f9", high_reach: "#ff6b35", negative_kols: "#ff4d6d",
                  };
                  const c = colors[insight.type] ?? "#7070a0";
                  return (
                    <div key={i} className="rounded-xl px-4 py-3 flex gap-3" style={{ background: "#161625", borderLeft: `2px solid ${c}` }}>
                      <span className="text-sm shrink-0">{insight.icon}</span>
                      <span className="text-xs leading-relaxed" style={{ color: "#9090b0" }}>
                        {isZh ? insight.message_zh : insight.message_en}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══ Section 3: Demo Brands (existing KOL data) ═══ */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>
            {k("selectBrand")}
          </div>
          <div className="flex gap-2 flex-wrap">
            {KOL_BRANDS.map((b, idx) => {
              const c = b.kolScore >= 70 ? "#22c55e" : b.kolScore >= 45 ? "#f5a623" : "#ff4d6d";
              const active = b.id === selectedBrandId;
              const locked = !me && idx > 0;
              return (
                <button
                  key={b.id}
                  onClick={() => selectBrand(b.id)}
                  disabled={locked}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-colors disabled:opacity-40"
                  style={
                    active
                      ? { background: "#1a1a2e", border: "1px solid #ff6b35", color: "#f0f0f8" }
                      : { background: "#0f0f17", border: "1px solid #25253f", color: "#7070a0" }
                  }
                >
                  {locked && <span>🔒</span>}
                  <span>{b.brand}</span>
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color: c, background: c + "18" }}>
                    {b.kolScore}
                  </span>
                </button>
              );
            })}
          </div>
          {!me && (
            <div className="text-xs" style={{ color: "#555580" }}>{k("lockedPreview")}</div>
          )}
        </div>

        {/* Score card */}
        <div
          className="rounded-2xl p-6 grid md:grid-cols-4 gap-6"
          style={{ background: "#0f0f17", border: `1px solid ${kolScoreBorder}` }}
        >
          <div className="md:col-span-1 flex flex-col justify-center">
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>
              {k("kolScore")}
            </div>
            <div className="text-6xl font-black mb-1" style={{ color: kolScoreColor }}>
              {brand.kolScore}
            </div>
            <div className="text-xs" style={{ color: "#555580" }}>{k("citationStrength")}</div>
          </div>
          <div className="md:col-span-2 grid grid-cols-3 gap-4">
            {[
              { label: k("aiCitations"), value: brand.totalAiKolCitations, color: "#ff6b35" },
              { label: k("positiveKols"), value: totalPositive, color: "#22c55e" },
              { label: k("negativeKols"), value: totalNegative, color: "#ff4d6d" },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "#161625" }}>
                <div className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: "#7070a0" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="md:col-span-1 flex flex-col justify-center gap-2">
            <div className="rounded-xl p-3" style={{ background: "#161625" }}>
              <div className="text-xs mb-1" style={{ color: "#7070a0" }}>{k("trackedCreators")}</div>
              <div className="text-xl font-black" style={{ color: "#f0f0f8" }}>{brand.kols.length}</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: "#161625" }}>
              <div className="text-xs mb-1" style={{ color: "#7070a0" }}>{k("currentPartners")}</div>
              <div className="text-xl font-black" style={{ color: "#f5a623" }}>{partnered}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs self-center" style={{ color: "#555580" }}>{k("platform")}:</span>
            {(["all", "YouTube", "TikTok", "Instagram", "Blog"] as FilterPlatform[]).map(p => (
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
                {p === "all"
                  ? k("allPlatforms")
                  : `${PLATFORM_CONFIG[p as KolPlatform].icon} ${p}`}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs self-center" style={{ color: "#555580" }}>{k("tier")}:</span>
            {(["all", "mega", "macro", "micro"] as FilterTier[]).map(t2 => {
              const tl = t2 !== "all" ? TIER_LABELS[t2 as KolTier] : null;
              return (
                <button
                  key={t2}
                  onClick={() => setFilterTier(t2)}
                  className="text-xs px-3 py-1 rounded-lg border transition-colors"
                  style={
                    filterTier === t2
                      ? { background: "#1a1a2e", color: "#f0f0f8", border: "1px solid #25253f" }
                      : { background: "transparent", color: "#7070a0", border: "1px solid transparent" }
                  }
                >
                  {t2 === "all" ? k("allTiers") : `${tl![lang]} (${tl!.range})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* KOL Cards */}
        {filteredKols.length === 0 ? (
          <div className="text-sm text-center py-8" style={{ color: "#555580" }}>{k("noMatch")}</div>
        ) : (
          <div className="space-y-3">
            {filteredKols.map(kol => {
              const pConfig = PLATFORM_CONFIG[kol.platform];
              const tConfig = TIER_CONFIG[kol.tier];
              const sConfig = SENTIMENT_CFG[kol.sentiment];
              const rConfig = ROI_CONFIG[kol.roi];
              const roiLabel = ROI_LABELS[kol.roi];

              return (
                <div key={kol.id} className="rounded-2xl p-5 space-y-4" style={{ background: "#0f0f17", border: "1px solid #1a1a2e" }}>
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
                          <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(245,166,35,0.12)", color: "#f5a623" }}>
                            ★ {k("partner")}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs" style={{ color: pConfig.color }}>{kol.platform}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#161625", color: tConfig.color }}>
                          {tConfig.label}
                        </span>
                        {kol.subscribers > 0 && (
                          <span className="text-xs" style={{ color: "#7070a0" }}>{fmtNum(kol.subscribers)} {k("subs")}</span>
                        )}
                        <span className="text-xs" style={{ color: "#7070a0" }}>~{fmtNum(kol.avgViews)} {k("avgViews")}</span>
                        <span className="text-xs" style={{ color: "#555580" }}>{kol.niche}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-lg font-black" style={{ color: "#ff6b35" }}>{kol.aiCitations}</div>
                      <div className="text-xs" style={{ color: "#555580" }}>{isZh ? "次 AI 引用" : "AI citations"}</div>
                    </div>
                  </div>

                  {/* Key video */}
                  <div className="space-y-2">
                    <div className="text-xs leading-snug font-semibold" style={{ color: "#9090b0" }}>
                      &ldquo;{kol.keyVideo.title}&rdquo;
                      <span className="font-normal ml-2" style={{ color: "#555580" }}>
                        · {fmtNum(kol.keyVideo.views)} {k("views")} · {kol.keyVideo.publishedMonthsAgo} {k("monthsAgo")}
                      </span>
                    </div>
                    <div
                      className="text-xs italic leading-relaxed px-3 py-2.5 rounded-xl"
                      style={{ background: "#161625", color: "#9090b0", borderLeft: "2px solid #e879f940" }}
                    >
                      <span className="text-xs not-italic font-semibold mr-2" style={{ color: "#e879f9" }}>{k("verdict")}:</span>
                      {kol.keyVideo.verdict}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ color: sConfig.color, background: sConfig.bg }}>
                      {sConfig[lang]}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ color: rConfig.color, background: rConfig.color + "15" }}>
                      {roiLabel[lang]}
                    </span>
                    {!kol.collab && kol.roi === "high" && (
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
                        → {k("partnershipOpp")}
                      </span>
                    )}
                    {kol.roi === "negative" && (
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(255,77,109,0.08)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.2)" }}>
                        → {k("addressContent")}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Why KOLs Matter */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          {k("whyTitle")}
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: k("whyTranscripts"), desc: k("whyTranscriptsDesc") },
            { title: k("whyAuthority"), desc: k("whyAuthorityDesc") },
            { title: k("whyPartnership"), desc: k("whyPartnershipDesc") },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="text-xl shrink-0">{["🎬", "📊", "🤝"][i]}</div>
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
          <div className="font-semibold mb-1">{k("ctaTitle")}</div>
          <p className="text-sm" style={{ color: "#9090b0" }}>{k("ctaSub")}</p>
        </div>
        <div className="flex gap-3 shrink-0 flex-wrap">
          <Link
            href={`${prefix}/audit`}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            {k("ctaAudit")}
          </Link>
          <Link
            href={`${prefix}/geo-action`}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ border: "1px solid #25253f", color: "#f0f0f8" }}
          >
            {k("ctaGeoAction")}
          </Link>
        </div>
      </div>

      {/* Upgrade modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowUpgrade(false)}>
          <div className="bg-[#0f0f17] border border-[#25253f] rounded-2xl p-8 max-w-sm mx-4 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold">{k("creditsExhausted")}</h3>
            <p className="text-sm" style={{ color: "#9090b0" }}>{k("upgradeToView")}</p>
            <div className="flex gap-3">
              <Link href={`${prefix}/pricing`} className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "#ff6b35", color: "#fff" }}>
                {k("upgradeCta")}
              </Link>
              <button onClick={() => setShowUpgrade(false)} className="px-5 py-2.5 rounded-xl text-sm" style={{ border: "1px solid #25253f", color: "#f0f0f8" }}>
                {isZh ? "关闭" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
