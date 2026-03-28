"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  opportunityEngineApi,
  OETrendingProduct,
  OEScanResponse,
  OESupplier,
  OESupplierResponse,
  OELandedCost,
  OEListingResult,
  OERedditPost,
  OEYouTubeKol,
  OEFeedScore,
} from "@/lib/api";

type Lang = "en" | "zh";

const t = (en: string, zh: string, lang: Lang) => (lang === "zh" ? zh : en);

// ── Step indicator ──────────────────────────────────────────────────────────

const STEPS = [
  { en: "Scan", zh: "扫描" },
  { en: "Opportunities", zh: "商机" },
  { en: "Supplier & Cost", zh: "供应商 & 成本" },
  { en: "AI Listing", zh: "AI Listing" },
];

function StepBar({ step, lang, onStep }: { step: number; lang: Lang; onStep: (s: number) => void }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((s, i) => {
        const active = i + 1 === step;
        const done = i + 1 < step;
        return (
          <button
            key={i}
            onClick={() => i + 1 < step && onStep(i + 1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              active
                ? "bg-[#ff6b35] text-white shadow-lg shadow-orange-500/20"
                : done
                  ? "bg-slate-700 text-white cursor-pointer hover:bg-slate-600"
                  : "bg-slate-800/50 text-slate-500 cursor-default"
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              active ? "bg-white/20" : done ? "bg-green-500/30 text-green-400" : "bg-slate-700"
            }`}>
              {done ? "✓" : i + 1}
            </span>
            {lang === "zh" ? s.zh : s.en}
          </button>
        );
      })}
    </div>
  );
}

// ── Score ring (reused from GeoCMO) ─────────────────────────────────────────

function ScoreRing({ score, label, size = 90 }: { score: number; label: string; size?: number }) {
  const r = size * 0.4;
  const circ = 2 * Math.PI * r;
  const fill = circ * (1 - score / 100);
  const color = score >= 80 ? "#ef4444" : score >= 60 ? "#f97316" : score >= 40 ? "#eab308" : "#94a3b8";
  const half = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={half} cy={half} r={r} fill="none" stroke="#1e293b" strokeWidth={6} />
      <circle
        cx={half} cy={half} r={r} fill="none"
        stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={fill}
        strokeLinecap="round" transform={`rotate(-90 ${half} ${half})`}
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      <text x={half} y={half - 2} textAnchor="middle" fill="white" fontSize={size * 0.22} fontWeight={700}>{score}</text>
      <text x={half} y={half + size * 0.13} textAnchor="middle" fill="#94a3b8" fontSize={size * 0.09}>{label}</text>
    </svg>
  );
}

// ── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 border-3 border-[#ff6b35] border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 text-sm animate-pulse">{text}</p>
    </div>
  );
}

// ── Step 1: Scan Input ──────────────────────────────────────────────────────

const CATEGORIES = ["Cookware", "Baby", "Electronics", "Home", "Outdoor"];

function ScanStep({ lang, onScan, loading }: {
  lang: Lang;
  onScan: (brand: string, category: string) => void;
  loading: boolean;
}) {
  const [brand, setBrand] = useState("Sensarte");
  const [category, setCategory] = useState("Cookware");

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">
          {t("What will AI recommend next?", "AI 下一步会推荐什么？", lang)}
        </h2>
        <p className="text-slate-400 text-lg">
          {t(
            "Scan AI engines to discover trending products your brand is missing — before your competitors find them.",
            "扫描 AI 引擎，发现你的品牌尚未覆盖的趋势产品——在竞争对手之前抢占先机。",
            lang,
          )}
        </p>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-8 space-y-6">
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
            {t("Brand Name", "品牌名称", lang)}
          </label>
          <input
            value={brand}
            onChange={e => setBrand(e.target.value)}
            placeholder="e.g., Sensarte, Olayks, HexClad"
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6b35] transition"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
            {t("Product Category", "产品类目", lang)}
          </label>
          <div className="grid grid-cols-5 gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  category === c
                    ? "bg-[#ff6b35] text-white shadow-lg shadow-orange-500/20"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onScan(brand, category)}
          disabled={loading || !brand.trim()}
          className="w-full py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-[#ff6b35] to-[#ff8f35] text-white hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-orange-500/25"
        >
          {loading
            ? t("Scanning AI engines...", "正在扫描 AI 引擎...", lang)
            : t("🔍 Scan for AI Opportunities", "🔍 扫描 AI 商机", lang)}
        </button>
      </div>

      {/* Trust badges */}
      <div className="flex justify-center gap-6 mt-8 text-xs text-slate-500">
        <span>ChatGPT</span>
        <span>Claude</span>
        <span>Perplexity</span>
        <span>Gemini</span>
        <span>Reddit</span>
        <span>TikTok</span>
        <span>Google Trends</span>
      </div>
    </div>
  );
}

// ── Step 2: Opportunities ───────────────────────────────────────────────────

function OpportunitiesStep({ scan, lang, onSelect, feedScore }: {
  scan: OEScanResponse;
  lang: Lang;
  onSelect: (product: OETrendingProduct) => void;
  feedScore?: OEFeedScore | null;
}) {
  const ms = scan.market_signals;
  const alignment = (ms.market_alignment_score as number) ?? 0;
  const amazon = scan.amazon_data;
  const reddit = scan.reddit_posts;
  const kols = scan.youtube_kols;
  const tiktok = scan.tiktok_data;
  const sources = scan.data_sources || [];
  const trends = scan.ai_trend_data;
  const existingProducts = scan.brand_existing_products;

  return (
    <div className="space-y-6">
      {/* Data sources badge bar */}
      {sources.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase">{t("Live data from", "实时数据来源", lang)}:</span>
          {sources.map(s => (
            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
              ✓ {s.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      )}

      {/* Signal summary bar */}
      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              {scan.brand} — {scan.category}
            </h3>
            <p className="text-sm text-slate-400">
              {t("Cross-platform market signals", "跨平台市场信号", lang)}
            </p>
          </div>
          <ScoreRing score={alignment} label={t("Alignment", "匹配度", lang)} size={80} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Reddit", value: `${ms.reddit_score ?? 0}%`, sub: `${ms.reddit_post_count ?? 0} posts` },
            { label: "YouTube KOL", value: String(ms.kol_count ?? 0), sub: `${((ms.kol_total_views as number) ?? 0).toLocaleString()} views` },
            { label: "TikTok", value: ms.tiktok_trending ? "🔥 Trending" : "Active", sub: `${ms.tiktok_product_count ?? 0} products` },
            { label: "Google", value: ms.google_trend_direction === "up" ? "↑ Rising" : "→ Stable", sub: `${ms.google_delta ?? 0}% Δ` },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-slate-800/60 rounded-xl p-3 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
              <p className="text-sm font-bold text-white mt-1">{value}</p>
              <p className="text-[10px] text-slate-500">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Real data panels — Amazon + Reddit + YouTube + TikTok */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Amazon Competition */}
        {amazon?.keyword_ranking && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <p className="text-[10px] text-[#ff6b35] uppercase font-semibold mb-2">Amazon Competition (Live)</p>
            {amazon.keyword_ranking.brand_rank && (
              <p className="text-sm text-white mb-2">
                {scan.brand} rank: <span className="font-bold text-[#ff6b35]">#{amazon.keyword_ranking.brand_rank}</span>
                <span className="text-slate-500"> / {amazon.keyword_ranking.total_results} results</span>
              </p>
            )}
            {amazon.keyword_ranking.top_competitors?.slice(0, 3).map((c, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-t border-slate-800 text-xs">
                <span className="text-slate-300 truncate flex-1">#{c.rank} {c.title?.slice(0, 50)}</span>
                <span className="text-slate-400 ml-2">⭐{c.rating} ({c.reviews?.toLocaleString()})</span>
              </div>
            ))}
          </div>
        )}

        {/* Reddit Discussions */}
        {reddit && reddit.length > 0 && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <p className="text-[10px] text-orange-400 uppercase font-semibold mb-2">Reddit Discussions (Live)</p>
            {reddit.slice(0, 3).map((p, i) => (
              <div key={i} className="py-1.5 border-t border-slate-800 first:border-0">
                <p className="text-xs text-white truncate">{p.title}</p>
                <p className="text-[10px] text-slate-500">r/{p.subreddit} · ↑{p.score} · {p.num_comments} comments</p>
              </div>
            ))}
          </div>
        )}

        {/* YouTube KOLs */}
        {kols && kols.length > 0 && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <p className="text-[10px] text-red-400 uppercase font-semibold mb-2">YouTube KOLs (Live)</p>
            {kols.slice(0, 3).map((k, i) => (
              <div key={i} className="py-1.5 border-t border-slate-800 first:border-0">
                <p className="text-xs text-white truncate">{k.channel_name}</p>
                <p className="text-[10px] text-slate-500">
                  {k.views?.toLocaleString()} views ·
                  <span className={`ml-1 ${k.tier === "mega" ? "text-yellow-400" : k.tier === "macro" ? "text-blue-400" : "text-slate-400"}`}>
                    {k.tier}
                  </span>
                  {k.sentiment === "positive" && " · 👍"}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* TikTok Shop */}
        {tiktok?.present && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <p className="text-[10px] text-cyan-400 uppercase font-semibold mb-2">TikTok Shop (Live)</p>
            <p className="text-sm text-white mb-2">
              {tiktok.product_count} products · ⭐{tiktok.avg_rating?.toFixed(1)}
            </p>
            {tiktok.top_products?.slice(0, 3).map((p, i) => (
              <div key={i} className="py-1.5 border-t border-slate-800 first:border-0">
                <p className="text-xs text-white truncate">{p.title}</p>
                <p className="text-[10px] text-slate-500">{p.price} · {p.sales?.toLocaleString()} sold</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brand existing products (dedup) + AI Trend Gainers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brand's existing products (excluded from suggestions) */}
        {existingProducts && existingProducts.length > 0 && (
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4">
            <p className="text-[10px] text-slate-500 uppercase font-semibold mb-2">
              {t(`${scan.brand}'s Existing Products (excluded)`, `${scan.brand} 已有产品（已排除）`, lang)}
            </p>
            {existingProducts.slice(0, 5).map((title, i) => (
              <p key={i} className="text-xs text-slate-500 truncate py-0.5 line-through decoration-slate-700">
                {title}
              </p>
            ))}
            {existingProducts.length > 5 && (
              <p className="text-[10px] text-slate-600 mt-1">+{existingProducts.length - 5} more</p>
            )}
          </div>
        )}

        {/* AI Trend Gainers (brands rising in AI visibility) */}
        {trends?.gainers && trends.gainers.length > 0 && (
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
            <p className="text-[10px] text-green-400 uppercase font-semibold mb-2">
              {t("AI Visibility Gainers (from historical data)", "AI 可见度上升品牌（历史数据）", lang)}
            </p>
            {trends.gainers.slice(0, 4).map((g, i) => (
              <div key={i} className="flex items-center justify-between py-1 text-xs">
                <span className="text-white">{g.brand}</span>
                <span className="text-green-400 font-medium">
                  SOV {g.current_sov}% <span className="text-green-500">↑{g.sov_delta > 0 ? "+" : ""}{g.sov_delta}pp</span>
                </span>
              </div>
            ))}
            {trends.total_snapshots && (
              <p className="text-[10px] text-slate-600 mt-1">
                Based on {trends.total_snapshots} scans across {trends.total_brands_tracked} brands
              </p>
            )}
          </div>
        )}
      </div>

      {/* ChatGPT Feed Score */}
      {feedScore && (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">
                ChatGPT Shopping Feed Score
              </h3>
              <p className="text-sm text-slate-400">
                {t(
                  "How ready is your product data for ChatGPT Shopping?",
                  "你的产品数据是否已为 ChatGPT 购物做好准备？",
                  lang,
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ScoreRing score={Math.round(feedScore.score_pct)} label="Feed Score" size={80} />
              <span className={`text-3xl font-black ${
                feedScore.grade === "A" ? "text-green-400" :
                feedScore.grade === "B" ? "text-blue-400" :
                feedScore.grade === "C" ? "text-yellow-400" :
                "text-red-400"
              }`}>{feedScore.grade}</span>
            </div>
          </div>

          {/* Field status grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {feedScore.field_scores.map(f => (
              <div key={f.field_name} className={`rounded-lg p-2 text-xs ${
                f.status === "present" ? "bg-green-500/10 text-green-400" :
                f.status === "weak" ? "bg-yellow-500/10 text-yellow-400" :
                "bg-red-500/10 text-red-400"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{f.field_name}</span>
                  <span>{f.status === "present" ? "✓" : f.status === "weak" ? "⚠" : "✗"}</span>
                </div>
                <div className="text-[10px] opacity-60 mt-0.5">{f.score}/{f.max_score}</div>
              </div>
            ))}
          </div>

          {/* Optimization tips */}
          {feedScore.optimization_tips.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] text-[#ff6b35] uppercase font-semibold">
                {t("Optimization Tips", "优化建议", lang)}
              </p>
              {feedScore.optimization_tips.slice(0, 4).map((tip, i) => (
                <p key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                  <span className="text-[#ff6b35] flex-shrink-0">{i + 1}.</span>
                  {tip}
                </p>
              ))}
            </div>
          )}

          {/* Missing critical fields */}
          {feedScore.missing_critical.length > 0 && (
            <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <p className="text-[10px] text-red-400 uppercase font-semibold mb-1">
                {t("Critical Missing Fields", "关键缺失字段", lang)}
              </p>
              <div className="flex flex-wrap gap-1">
                {feedScore.missing_critical.map(f => (
                  <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">{f}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trending products */}
      <div>
        <h3 className="text-lg font-bold text-white mb-1">
          {t("AI-Detected Opportunities", "AI 发现的商机", lang)}
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          {t(
            "Products that AI engines are increasingly recommending — click to explore supplier & cost",
            "AI 引擎正在越来越多推荐的产品——点击查看供应商和成本",
            lang,
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scan.ai_trending_products.map((product, i) => {
            const score = product.ai_recommendation_score;
            const severity = score >= 85 ? "critical" : score >= 70 ? "high" : score >= 50 ? "medium" : "low";
            const borderColor = severity === "critical" ? "border-red-500/50" : severity === "high" ? "border-orange-500/50" : severity === "medium" ? "border-yellow-500/50" : "border-slate-700";
            const glowColor = severity === "critical" ? "shadow-red-500/10" : severity === "high" ? "shadow-orange-500/10" : "";

            return (
              <button
                key={i}
                onClick={() => onSelect(product)}
                className={`text-left rounded-2xl border ${borderColor} bg-slate-900/80 p-5 hover:bg-slate-800/80 transition-all hover:scale-[1.01] ${glowColor ? `shadow-lg ${glowColor}` : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-base leading-snug">
                      {product.product_name}
                    </h4>
                    <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${
                      product.search_volume_trend === "rising"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-slate-700 text-slate-400"
                    }`}>
                      {product.search_volume_trend === "rising" ? "↑ Rising" : "→ Stable"}
                    </span>
                  </div>
                  <ScoreRing score={score} label="AI Score" size={64} />
                </div>

                <p className="text-sm text-slate-400 mb-3 line-clamp-3">{product.why_trending}</p>

                <div className="bg-slate-800/60 rounded-lg p-2.5">
                  <p className="text-[10px] text-slate-500 uppercase mb-1">{t("Competitor Gap", "竞争缺口", lang)}</p>
                  <p className="text-xs text-slate-300">{product.competitor_gap}</p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">HS: {product.suggested_hs_code}</span>
                  <span className="text-xs text-[#ff6b35] font-medium">
                    {t("Explore →", "查看详情 →", lang)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Supplier & Cost ─────────────────────────────────────────────────

function SupplierCostStep({ product, lang, onGenerateListing }: {
  product: OETrendingProduct;
  lang: Lang;
  onGenerateListing: () => void;
}) {
  const [suppliers, setSuppliers] = useState<OESupplierResponse | null>(null);
  const [cost, setCost] = useState<OELandedCost | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<OESupplier | null>(null);
  const [quantity, setQuantity] = useState(1000);
  const [loading, setLoading] = useState(true);
  const [costLoading, setCostLoading] = useState(false);

  // Load suppliers on mount
  useState(() => {
    opportunityEngineApi
      .getSuppliers(product.suggested_category_keyword, product.suggested_hs_code)
      .then(data => {
        setSuppliers(data);
        setLoading(false);
        if (data.suppliers.length > 0) {
          selectSupplier(data.suppliers[0], data);
        }
      })
      .catch(() => setLoading(false));
  });

  const selectSupplier = async (supplier: OESupplier, suppData?: OESupplierResponse) => {
    setSelectedSupplier(supplier);
    setCostLoading(true);
    try {
      const result = await opportunityEngineApi.calculateCost({
        supplier_unit_cost: supplier.unit_price_usd,
        quantity,
        hs_code: product.suggested_hs_code,
        weight_kg: 1.0,
      });
      setCost(result);
    } catch {
      // ignore
    }
    setCostLoading(false);
  };

  const recalculate = async (qty: number) => {
    if (!selectedSupplier) return;
    setQuantity(qty);
    setCostLoading(true);
    try {
      const result = await opportunityEngineApi.calculateCost({
        supplier_unit_cost: selectedSupplier.unit_price_usd,
        quantity: qty,
        hs_code: product.suggested_hs_code,
        weight_kg: 1.0,
      });
      setCost(result);
    } catch {
      // ignore
    }
    setCostLoading(false);
  };

  if (loading) return <Spinner text={t("Finding suppliers on 1688...", "正在从 1688 匹配供应商...", lang)} />;

  return (
    <div className="space-y-6">
      {/* Product header */}
      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 flex items-center gap-4">
        <ScoreRing score={product.ai_recommendation_score} label="AI Score" size={70} />
        <div>
          <h3 className="text-lg font-bold text-white">{product.product_name}</h3>
          <p className="text-sm text-slate-400">{product.why_trending}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Suppliers */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
            {t("Suppliers", "供应商", lang)}
            {suppliers?.source_label && (
              <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                suppliers.source === "alibaba.com" ? "bg-[#ff6b35]/15 text-[#ff6b35]" : "bg-slate-700 text-slate-400"
              }`}>
                {suppliers.source_label}
              </span>
            )}
          </h4>
          {suppliers?.suppliers.map(s => (
            <button
              key={s.id}
              onClick={() => selectSupplier(s)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${
                selectedSupplier?.id === s.id
                  ? "border-[#ff6b35] bg-[#ff6b35]/5"
                  : "border-slate-700 bg-slate-900/60 hover:border-slate-500"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-medium text-sm">{s.name_en}</p>
                  <p className="text-slate-500 text-xs">{s.name}</p>
                  <p className="text-slate-400 text-xs mt-1">📍 {s.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#ff6b35]">${s.unit_price_usd.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-500">{t("per unit", "每件", lang)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                <span>MOQ: {s.min_order}</span>
                <span>⭐ {s.rating}</span>
                <span>{s.transactions.toLocaleString()} txns</span>
                <span>{s.lead_time_days}d</span>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {s.certifications.map(c => (
                  <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </button>
          ))}

          {suppliers?.tariff_preview && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-3">
              <p className="text-[10px] text-yellow-400 uppercase font-semibold mb-1">
                {t("Tariff Info", "关税信息", lang)}
              </p>
              <p className="text-xs text-slate-300">
                HS {suppliers.tariff_preview.hs_code}: {suppliers.tariff_preview.description}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Duty: {suppliers.tariff_preview.duty_rate_pct}% + Section 301: {suppliers.tariff_preview.section_301_pct}%
              </p>
              <p className="text-[10px] text-slate-500 mt-1">{suppliers.tariff_preview.notes}</p>
            </div>
          )}
        </div>

        {/* Right: Cost Calculator */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
            {t("Landed Cost Calculator", "到岸成本计算器", lang)}
          </h4>

          {/* Quantity slider */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">{t("Order Quantity", "订购数量", lang)}</span>
              <span className="text-sm font-bold text-white">{quantity.toLocaleString()} units</span>
            </div>
            <input
              type="range"
              min={100}
              max={5000}
              step={100}
              value={quantity}
              onChange={e => recalculate(Number(e.target.value))}
              className="w-full accent-[#ff6b35]"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>100</span>
              <span>5,000</span>
            </div>
          </div>

          {/* Cost waterfall */}
          {cost && !costLoading ? (
            <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 space-y-3">
              {[
                { label: t("Supplier Cost", "供应商成本", lang), value: cost.supplier_unit_cost, color: "#94a3b8" },
                { label: t("Shipping (Sea)", "海运运费", lang), value: cost.shipping_per_unit, color: "#60a5fa" },
                { label: `Duty (${cost.duty_pct}%)`, value: cost.duty_amount, color: "#fbbf24" },
                { label: `Section 301 (${cost.section_301_pct}%)`, value: cost.section_301_amount, color: "#f97316" },
                { label: t("FBA Fees", "FBA 费用", lang), value: cost.fba_fee, color: "#a78bfa" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-xs text-slate-400 flex-1">{label}</span>
                  <span className="text-sm font-medium text-white">${value.toFixed(2)}</span>
                </div>
              ))}

              <div className="border-t border-slate-700 pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{t("Total Landed Cost", "总到岸成本", lang)}</span>
                  <span className="text-xl font-bold text-white">${cost.total_landed_per_unit.toFixed(2)}</span>
                </div>
              </div>

              {/* Margin preview */}
              <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-3 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-green-400 font-medium">
                    {t("Suggested Retail", "建议零售价", lang)}
                  </span>
                  <span className="text-lg font-bold text-green-400">${cost.suggested_retail.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all"
                      style={{ width: `${Math.min(cost.estimated_margin_pct, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-green-400">{cost.estimated_margin_pct}%</span>
                </div>
                <p className="text-[10px] text-green-400/60 mt-1">{t("Estimated margin", "预估毛利率", lang)}</p>
              </div>

              {/* Total order cost */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">{t("Total Order Cost", "总订单成本", lang)}</p>
                <p className="text-2xl font-bold text-white">${cost.total_cost.toLocaleString()}</p>
              </div>
            </div>
          ) : costLoading ? (
            <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-8 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#ff6b35] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : null}

          {/* Generate listing button */}
          <button
            onClick={onGenerateListing}
            className="w-full py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-[#ff6b35] to-[#ff8f35] text-white hover:opacity-90 transition shadow-lg shadow-orange-500/25"
          >
            {t("⚡ Generate AI-Optimized Listing", "⚡ 生成 AI 优化 Listing", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Step 4: AI Listing ──────────────────────────────────────────────────────

function ListingStep({ listing, product, lang }: {
  listing: OEListingResult;
  product: OETrendingProduct;
  lang: Lang;
}) {
  const [copied, setCopied] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const copyAll = () => {
    const text = `${listing.title}\n\n${listing.bullet_points.map(b => `• ${b}`).join("\n")}\n\n${listing.description}\n\nKeywords: ${listing.backend_keywords.join(", ")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">
            {t("AI-Optimized Amazon Listing", "AI 优化 Amazon Listing", lang)}
          </h3>
          <p className="text-sm text-slate-400">{product.product_name}</p>
        </div>
        <button
          onClick={copyAll}
          className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white hover:bg-slate-700 transition"
        >
          {copied ? "✓ Copied!" : t("📋 Copy All", "📋 复制全部", lang)}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Main listing preview */}
        <div className="space-y-4">
          {/* Title */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-5">
            <p className="text-[10px] text-slate-500 uppercase mb-2">{t("Product Title", "产品标题", lang)}</p>
            <h2 className="text-white font-semibold text-lg leading-snug">{listing.title}</h2>
          </div>

          {/* Bullet points */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-5">
            <p className="text-[10px] text-slate-500 uppercase mb-3">{t("Key Features", "核心卖点", lang)}</p>
            <ul className="space-y-3">
              {listing.bullet_points.map((bp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#ff6b35]/15 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-xs mt-0.5">✓</span>
                  <span className="text-sm text-slate-300 leading-relaxed">{bp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-5">
            <p className="text-[10px] text-slate-500 uppercase mb-2">{t("Product Description", "产品描述", lang)}</p>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

          {/* FAQ Schema */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-5">
            <p className="text-[10px] text-slate-500 uppercase mb-3">FAQ Schema (AI Citation Boost)</p>
            <div className="space-y-2">
              {listing.faq_schema.map((faq, i) => (
                <div key={i} className="rounded-lg bg-slate-800/60 overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between"
                  >
                    <span className="text-sm text-white font-medium">{faq.question}</span>
                    <span className="text-slate-500 text-xs">{expandedFaq === i ? "▲" : "▼"}</span>
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 pb-3">
                      <p className="text-sm text-slate-400">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Backend keywords */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-5">
            <p className="text-[10px] text-slate-500 uppercase mb-3">{t("Backend Keywords", "后台关键词", lang)}</p>
            <div className="flex flex-wrap gap-2">
              {listing.backend_keywords.map(kw => (
                <span key={kw} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar: AI Optimization Notes */}
        <div className="space-y-4">
          <div className="rounded-xl border border-[#ff6b35]/30 bg-[#ff6b35]/5 p-5 sticky top-4">
            <p className="text-xs text-[#ff6b35] uppercase font-semibold mb-3">
              {t("AI Optimization Notes", "AI 优化说明", lang)}
            </p>
            <ul className="space-y-3">
              {listing.ai_optimization_notes.map((note, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-xs text-slate-300 leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* A2A value prop */}
          <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-center">
            <p className="text-xs text-green-400 font-semibold mb-1">Avanti A2A</p>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {t(
                "This listing is optimized for AI recommendation engines. AI assistants are 3x more likely to cite listings with structured FAQ, authoritative specs, and comparison data.",
                "此 Listing 已针对 AI 推荐引擎优化。具有结构化 FAQ、权威参数和对比数据的产品被 AI 助手引用的概率提高 3 倍。",
                lang,
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function OpportunityEngineView({ lang }: { lang: Lang }) {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true" || searchParams.get("demo") === "1";

  const [step, setStep] = useState(1);
  const [scanLoading, setScanLoading] = useState(false);
  const [listingLoading, setListingLoading] = useState(false);

  const [scanResult, setScanResult] = useState<OEScanResponse | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<OETrendingProduct | null>(null);
  const [listing, setListing] = useState<OEListingResult | null>(null);
  const [feedScore, setFeedScore] = useState<OEFeedScore | null>(null);

  const handleScan = async (brand: string, category: string) => {
    setScanLoading(true);
    setFeedScore(null);
    try {
      // Fetch scan + feed score in parallel
      const [result, feed] = await Promise.allSettled([
        opportunityEngineApi.scan({ brand, category }, isDemo),
        isDemo ? Promise.resolve(null) : opportunityEngineApi.feedScore(brand),
      ]);
      if (result.status === "fulfilled" && result.value) {
        setScanResult(result.value);
        setStep(2);
      }
      if (feed.status === "fulfilled" && feed.value) {
        setFeedScore(feed.value);
      }
    } catch (e) {
      console.error("Scan failed:", e);
    }
    setScanLoading(false);
  };

  const handleSelectProduct = (product: OETrendingProduct) => {
    setSelectedProduct(product);
    setStep(3);
  };

  const handleGenerateListing = async () => {
    if (!selectedProduct || !scanResult) return;
    setListingLoading(true);
    setStep(4);
    try {
      const result = await opportunityEngineApi.generateListing(
        {
          brand: scanResult.brand,
          product_name: selectedProduct.product_name,
          product_description: selectedProduct.why_trending,
          ai_signals: { ...selectedProduct },
        },
        isDemo,
      );
      setListing(result);
    } catch (e) {
      console.error("Listing generation failed:", e);
    }
    setListingLoading(false);
  };

  return (
    <div className="min-h-screen p-6 pt-20" style={{ background: "#09090f" }}>
      {/* Page header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-white">
            {t("Opportunity Engine", "商机引擎", lang)}
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ff6b35]/15 text-[#ff6b35] font-semibold uppercase">
            A2A
          </span>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          {t(
            "Discover what AI will recommend next — from signal to shelf in one click.",
            "发现 AI 即将推荐的产品——从信号到上架，一键搞定。",
            lang,
          )}
        </p>

        <StepBar step={step} lang={lang} onStep={setStep} />

        {/* Steps */}
        {step === 1 && (
          <ScanStep lang={lang} onScan={handleScan} loading={scanLoading} />
        )}

        {step === 2 && scanResult && (
          <OpportunitiesStep scan={scanResult} lang={lang} onSelect={handleSelectProduct} feedScore={feedScore} />
        )}

        {step === 3 && selectedProduct && (
          <SupplierCostStep
            product={selectedProduct}
            lang={lang}
            onGenerateListing={handleGenerateListing}
          />
        )}

        {step === 4 && listingLoading && (
          <Spinner text={t("Generating AI-optimized listing...", "正在生成 AI 优化 Listing...", lang)} />
        )}

        {step === 4 && listing && selectedProduct && (
          <ListingStep listing={listing} product={selectedProduct} lang={lang} />
        )}
      </div>
    </div>
  );
}
