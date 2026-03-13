"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Lang, tx } from "@/lib/i18n";
import { fetchMe, useCredits } from "@/lib/auth";
import {
  REDDIT_BRANDS,
  computeRedditSentimentColor,
  computeRedditLevel,
  type BrandRedditProfile,
  type RedditSentiment,
  type RedditThread,
} from "@/lib/reddit-data";
import { api, type RedditPost, type CrossValidationResponse } from "@/lib/api";

/* ── Configs ──────────────────────────────────────────────────────────────── */
const SENTIMENT_CFG: Record<RedditSentiment, { color: string; bg: string }> = {
  positive: { color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  negative: { color: "#ff4d6d", bg: "rgba(255,77,109,0.12)" },
  mixed:    { color: "#f5a623", bg: "rgba(245,166,35,0.12)" },
};

const IMPACT_ICONS: Record<string, string> = { boost: "↑", damage: "↓", neutral: "→" };

/* ── Upgrade Modal ────────────────────────────────────────────────────────── */
function UpgradeModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const h = (p: string) => lang === "zh" ? `/zh${p}` : p;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="rounded-2xl p-8 max-w-sm text-center space-y-4" style={{ background: "#12121e", border: "1px solid #25253f" }} onClick={e => e.stopPropagation()}>
        <div className="text-3xl">0</div>
        <h3 className="text-lg font-bold" style={{ color: "#f0f0f8" }}>{tx("reddit", "creditsExhausted", lang)}</h3>
        <p className="text-sm" style={{ color: "#7070a0" }}>{tx("reddit", "upgradeToView", lang)}</p>
        <div className="flex gap-3 justify-center pt-2">
          <Link href={h("/account")} className="px-5 py-2 rounded-xl text-sm font-semibold" style={{ background: "#ff6b35", color: "#fff" }}>
            {tx("reddit", "upgradeCta", lang)}
          </Link>
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-sm" style={{ background: "#1a1a2e", color: "#7070a0", border: "1px solid #25253f" }}>
            {lang === "zh" ? "关闭" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────────────────── */
interface Props { lang: Lang }
type SortKey = "citations" | "upvotes" | "newest";

export default function RedditView({ lang }: Props) {
  // Demo brand state
  const [selectedBrandId, setSelectedBrandId] = useState(REDDIT_BRANDS[0].id);
  const [sentimentFilter, setSentimentFilter] = useState<RedditSentiment | "all">("all");
  const [sortBy, setSortBy] = useState<SortKey>("citations");

  // Auth + credits
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const viewedBrands = useRef(new Set<string>());

  // Live search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [livePosts, setLivePosts] = useState<RedditPost[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Cross-validation state
  const [crossData, setCrossData] = useState<CrossValidationResponse | null>(null);
  const [crossLoading, setCrossLoading] = useState(false);

  useEffect(() => {
    fetchMe()
      .then((u) => {
        setIsLoggedIn(true);
        setCreditsRemaining(u.credit_balance);
        const tier = u.subscription_tier;
        setIsPaid(tier === "growth" || tier === "scale" || tier === "enterprise");
        viewedBrands.current.add(REDDIT_BRANDS[0].id);
      })
      .catch(() => {
        setIsLoggedIn(false);
        viewedBrands.current.add(REDDIT_BRANDS[0].id);
      });
  }, []);

  async function handleSelectBrand(brandId: string) {
    if (viewedBrands.current.has(brandId)) {
      setSelectedBrandId(brandId);
      setSentimentFilter("all");
      return;
    }
    if (!isLoggedIn) return;
    if (isPaid) {
      viewedBrands.current.add(brandId);
      setSelectedBrandId(brandId);
      setSentimentFilter("all");
      return;
    }
    try {
      const result = await useCredits(1, "reddit");
      setCreditsRemaining(result.balance);
      viewedBrands.current.add(brandId);
      setSelectedBrandId(brandId);
      setSentimentFilter("all");
    } catch {
      setShowUpgradeModal(true);
    }
  }

  // Live Reddit search
  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchError(null);
    setCrossData(null);
    try {
      const resp = await api.searchReddit(searchQuery.trim(), searchCategory || undefined);
      setLivePosts(resp.posts);
      if (resp.credits_remaining !== null) setCreditsRemaining(resp.credits_remaining);
      if (resp.limited && !isLoggedIn) {
        setSearchError(lang === "zh" ? "登录查看更多结果" : "Log in to see more results");
      }
    } catch (err) {
      if (err instanceof Error && err.message.startsWith("429")) {
        setShowUpgradeModal(true);
      } else {
        setSearchError(lang === "zh" ? "搜索失败，请稍后重试" : "Search failed. Please try again.");
      }
      setLivePosts([]);
    } finally {
      setSearchLoading(false);
    }
  }

  // Cross-validation
  async function handleCrossValidate() {
    if (!searchQuery.trim()) return;
    setCrossLoading(true);
    try {
      const resp = await api.crossValidate(searchQuery.trim(), searchCategory || undefined);
      setCrossData(resp);
      if (resp.credits_remaining !== null) setCreditsRemaining(resp.credits_remaining);
    } catch (err) {
      if (err instanceof Error && err.message.startsWith("429")) {
        setShowUpgradeModal(true);
      }
    } finally {
      setCrossLoading(false);
    }
  }

  const brand = REDDIT_BRANDS.find(b => b.id === selectedBrandId)!;
  const scoreColor = computeRedditSentimentColor(brand.redditScore);
  const level = computeRedditLevel(brand.redditScore);
  const levelLabel = level === "strong" ? tx("reddit", "strong", lang) : level === "mixed" ? tx("reddit", "mixedSignals", lang) : tx("reddit", "weak", lang);

  let threads: RedditThread[] = brand.threads;
  if (sentimentFilter !== "all") threads = threads.filter(t => t.sentiment === sentimentFilter);
  threads = [...threads].sort((a, b) => {
    if (sortBy === "citations") return b.aiCitations - a.aiCitations;
    if (sortBy === "upvotes") return b.upvotes - a.upvotes;
    return a.monthsAgo - b.monthsAgo;
  });

  const h = (path: string) => lang === "zh" ? `/zh${path}` : path;

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-8" style={{ paddingTop: 32, paddingBottom: 64 }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#f0f0f8" }}>{tx("reddit", "title", lang)}</h1>
          <p className="text-sm" style={{ color: "#7070a0", maxWidth: 560 }}>{tx("reddit", "subtitle", lang)}</p>
        </div>
        {isLoggedIn !== null && (
          <div className="shrink-0 text-right">
            {isLoggedIn ? (
              isPaid ? (
                <span className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
                  {tx("reddit", "unlimited", lang)}
                </span>
              ) : (
                <div className="space-y-1">
                  <span className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}>
                    {creditsRemaining ?? 0} {tx("reddit", "creditsRemaining", lang)}
                  </span>
                  <p className="text-xs" style={{ color: "#4a4a6a" }}>{tx("reddit", "creditCost", lang)}</p>
                </div>
              )
            ) : (
              <Link href={h("/login?next=" + encodeURIComponent(lang === "zh" ? "/zh/reddit" : "/reddit"))}
                className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}>
                {tx("reddit", "loginToUnlock", lang)}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* ═══ LIVE SEARCH SECTION ═══ */}
      <div className="rounded-2xl p-5 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <div>
          <h2 className="text-sm font-bold mb-1" style={{ color: "#f0f0f8" }}>{tx("reddit", "liveSearchTitle", lang)}</h2>
          <p className="text-xs" style={{ color: "#7070a0" }}>{tx("reddit", "liveSearchSub", lang)}</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={tx("reddit", "searchBrand", lang)}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{ background: "#12121e", border: "1px solid #25253f", color: "#f0f0f8" }}
          />
          <input
            type="text"
            placeholder={lang === "zh" ? "品类（可选）" : "Category (optional)"}
            value={searchCategory}
            onChange={e => setSearchCategory(e.target.value)}
            className="w-40 rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{ background: "#12121e", border: "1px solid #25253f", color: "#f0f0f8" }}
          />
          <button
            onClick={handleSearch}
            disabled={searchLoading || !searchQuery.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity"
            style={{ background: "#ff6b35", color: "#fff", opacity: searchLoading ? 0.6 : 1 }}
          >
            {searchLoading ? tx("reddit", "searching", lang) : tx("reddit", "searchBtn", lang)}
          </button>
        </div>

        {/* Live results */}
        {livePosts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: "#7070a0" }}>
                {livePosts.length} {tx("reddit", "livePosts", lang)}
              </span>
              {isLoggedIn && !isPaid && livePosts.length > 0 && (
                <button
                  onClick={handleCrossValidate}
                  disabled={crossLoading}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity"
                  style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", opacity: crossLoading ? 0.6 : 1 }}
                >
                  {crossLoading ? tx("reddit", "crossRunning", lang) : `${tx("reddit", "crossBtn", lang)} (${tx("reddit", "crossCost", lang)})`}
                </button>
              )}
              {isPaid && livePosts.length > 0 && (
                <button
                  onClick={handleCrossValidate}
                  disabled={crossLoading}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity"
                  style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", opacity: crossLoading ? 0.6 : 1 }}
                >
                  {crossLoading ? tx("reddit", "crossRunning", lang) : tx("reddit", "crossBtn", lang)}
                </button>
              )}
            </div>
            {livePosts.map((post, i) => {
              const sCfg = SENTIMENT_CFG[post.sentiment];
              return (
                <a key={i} href={post.url} target="_blank" rel="noopener noreferrer"
                  className="block rounded-xl p-3 transition-colors hover:bg-white/[0.02]"
                  style={{ background: "#12121e", border: "1px solid #1a1a2e" }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: "#1a1a2e", color: "#7070a0" }}>r/{post.subreddit}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: sCfg.bg, color: sCfg.color }}>{post.sentiment}</span>
                    <span className="text-xs ml-auto" style={{ color: "#4a4a6a" }}>{post.age_days} {tx("reddit", "daysAgo", lang)}</span>
                  </div>
                  <p className="text-sm font-medium mb-1" style={{ color: "#f0f0f8" }}>{post.title}</p>
                  {post.selftext_snippet && (
                    <p className="text-xs line-clamp-2" style={{ color: "#7070a0" }}>{post.selftext_snippet}</p>
                  )}
                  <div className="flex gap-3 mt-2 text-xs" style={{ color: "#4a4a6a" }}>
                    <span>↑ {post.score.toLocaleString()}</span>
                    <span>{post.num_comments} {tx("reddit", "comments", lang)}</span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
        {searchError && <p className="text-xs" style={{ color: "#f5a623" }}>{searchError}</p>}
        {!searchLoading && livePosts.length === 0 && searchQuery && !searchError && (
          <p className="text-xs" style={{ color: "#4a4a6a" }}>{tx("reddit", "noResults", lang)}</p>
        )}
      </div>

      {/* ═══ CROSS-VALIDATION RESULTS ═══ */}
      {crossData && (
        <div className="rounded-2xl p-5 space-y-4" style={{ background: "#0f0f17", border: "1px solid #ff6b3530" }}>
          <div>
            <h2 className="text-sm font-bold mb-1" style={{ color: "#f0f0f8" }}>{tx("reddit", "crossTitle", lang)} — {crossData.brand}</h2>
            <p className="text-xs" style={{ color: "#7070a0" }}>{tx("reddit", "crossSub", lang)}</p>
          </div>

          {/* Metrics comparison */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ background: "#12121e", border: "1px solid #1a1a2e" }}>
              <p className="text-xs mb-1" style={{ color: "#7070a0" }}>{tx("reddit", "redditSentiment", lang)}</p>
              <div className="text-2xl font-bold" style={{ color: computeRedditSentimentColor(crossData.reddit.score) }}>
                {crossData.reddit.score}%
              </div>
              <p className="text-xs" style={{ color: "#4a4a6a" }}>{crossData.reddit.total_posts} posts</p>
            </div>
            {crossData.ai_visibility ? (
              <>
                <div className="rounded-xl p-3 text-center" style={{ background: "#12121e", border: "1px solid #1a1a2e" }}>
                  <p className="text-xs mb-1" style={{ color: "#7070a0" }}>{tx("reddit", "sovLabel", lang)}</p>
                  <div className="text-2xl font-bold" style={{ color: "#ff6b35" }}>
                    {crossData.ai_visibility.weighted_sov}%
                  </div>
                  <p className="text-xs" style={{ color: "#4a4a6a" }}>{tx("reddit", "aiVisibility", lang)}</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: "#12121e", border: "1px solid #1a1a2e" }}>
                  <p className="text-xs mb-1" style={{ color: "#7070a0" }}>{tx("reddit", "geoScoreLabel", lang)}</p>
                  <div className="text-2xl font-bold" style={{ color: crossData.ai_visibility.arrs >= 60 ? "#22c55e" : crossData.ai_visibility.arrs >= 30 ? "#f5a623" : "#ff4d6d" }}>
                    {crossData.ai_visibility.arrs}
                  </div>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: "#12121e", border: "1px solid #1a1a2e" }}>
                  <p className="text-xs mb-1" style={{ color: "#7070a0" }}>{tx("reddit", "totalMentions", lang)}</p>
                  <div className="text-2xl font-bold" style={{ color: "#f0f0f8" }}>
                    {crossData.ai_visibility.mention_count}/{crossData.ai_visibility.total_prompts}
                  </div>
                </div>
              </>
            ) : (
              <div className="col-span-3 rounded-xl p-4 text-center" style={{ background: "#12121e", border: "1px solid #1a1a2e" }}>
                <p className="text-xs" style={{ color: "#4a4a6a" }}>{tx("reddit", "noAiData", lang)}</p>
              </div>
            )}
          </div>

          {/* Insights */}
          {crossData.insights.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold" style={{ color: "#7070a0" }}>{tx("reddit", "insightsTitle", lang)}</h3>
              {crossData.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl p-3" style={{
                  background: insight.type === "critical" ? "rgba(255,77,109,0.06)" : insight.type === "risk" ? "rgba(245,166,35,0.06)" : insight.type === "opportunity" ? "rgba(96,165,250,0.06)" : "rgba(34,197,94,0.06)",
                  border: `1px solid ${insight.type === "critical" ? "rgba(255,77,109,0.15)" : insight.type === "risk" ? "rgba(245,166,35,0.15)" : insight.type === "opportunity" ? "rgba(96,165,250,0.15)" : "rgba(34,197,94,0.15)"}`,
                }}>
                  <span className="text-lg shrink-0">{insight.icon}</span>
                  <p className="text-sm" style={{ color: "#d0d0e0" }}>
                    {lang === "zh" ? insight.message_zh : insight.message_en}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ DEMO BRANDS (existing data) ═══ */}
      <div className="pt-2">
        <h2 className="text-sm font-bold mb-3" style={{ color: "#f0f0f8" }}>
          {lang === "zh" ? "示例品牌分析" : "Sample Brand Analysis"}
        </h2>

        {/* Brand pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {REDDIT_BRANDS.map((b) => {
            const isSelected = b.id === selectedBrandId;
            const isLocked = !viewedBrands.current.has(b.id) && !isLoggedIn;
            const isUnlockable = !viewedBrands.current.has(b.id) && isLoggedIn && !isPaid;
            const sc = computeRedditSentimentColor(b.redditScore);
            return (
              <button
                key={b.id}
                onClick={() => handleSelectBrand(b.id)}
                disabled={isLocked}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: isSelected ? "rgba(255,107,53,0.12)" : isLocked ? "#0a0a14" : "#0f0f17",
                  border: `1px solid ${isSelected ? "rgba(255,107,53,0.4)" : "#25253f"}`,
                  color: isLocked ? "#3a3a5c" : isSelected ? "#ff6b35" : "#9090b0",
                  cursor: isLocked ? "not-allowed" : "pointer",
                  opacity: isLocked ? 0.6 : 1,
                }}
              >
                {isLocked && <span style={{ fontSize: 11 }}>🔒</span>}
                {b.brand}
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${sc}18`, color: sc }}>{b.redditScore}</span>
                {isUnlockable && !isSelected && <span className="text-xs" style={{ color: "#4a4a6a" }}>1 cr</span>}
              </button>
            );
          })}
        </div>

        {/* Anonymous banner */}
        {isLoggedIn === false && (
          <div className="rounded-xl p-4 text-center mb-6" style={{ background: "rgba(255,107,53,0.04)", border: "1px solid rgba(255,107,53,0.15)" }}>
            <p className="text-sm mb-2" style={{ color: "#9090b0" }}>{tx("reddit", "lockedPreview", lang)}</p>
            <Link href={h("/signup")} className="px-5 py-2 rounded-xl text-sm font-semibold inline-block" style={{ background: "#ff6b35", color: "#fff" }}>
              {lang === "zh" ? "免费注册 →" : "Sign Up Free →"}
            </Link>
          </div>
        )}

        {/* Score card */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: "#0f0f17", border: `1px solid ${scoreColor}30` }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <div className="text-center">
              <p className="text-xs font-semibold mb-2" style={{ color: "#7070a0" }}>{tx("reddit", "presenceScore", lang)}</p>
              <div className="text-5xl font-black" style={{ color: scoreColor }}>{brand.redditScore}</div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full mt-2 inline-block" style={{ background: `${scoreColor}18`, color: scoreColor }}>{levelLabel}</span>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold mb-3" style={{ color: "#7070a0" }}>{tx("reddit", "sentimentBreak", lang)}</p>
              {(["positive", "negative", "mixed"] as RedditSentiment[]).map(s => (
                <div key={s} className="flex items-center justify-between text-xs">
                  <span style={{ color: SENTIMENT_CFG[s].color }}>{tx("reddit", s, lang)}</span>
                  <span style={{ color: "#f0f0f8" }}>{brand[s]}%</span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold mb-2" style={{ color: "#7070a0" }}>{tx("reddit", "totalMentions", lang)}</p>
              <div className="text-3xl font-bold" style={{ color: "#f0f0f8" }}>{brand.totalMentions.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold mb-2" style={{ color: "#7070a0" }}>{tx("reddit", "trackedThreads", lang)}</p>
              <div className="text-3xl font-bold" style={{ color: "#f0f0f8" }}>{brand.threads.length}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex gap-1.5">
            {(["all", "positive", "negative", "mixed"] as (RedditSentiment | "all")[]).map(f => {
              const isActive = sentimentFilter === f;
              const bgActive = f === "all" ? "rgba(255,107,53,0.12)" : SENTIMENT_CFG[f as RedditSentiment].bg;
              const colorActive = f === "all" ? "#ff6b35" : SENTIMENT_CFG[f as RedditSentiment].color;
              return (
                <button key={f} onClick={() => setSentimentFilter(f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background: isActive ? bgActive : "#0f0f17", color: isActive ? colorActive : "#7070a0", border: `1px solid ${isActive ? "transparent" : "#25253f"}` }}>
                  {f === "all" ? tx("reddit", "filterAll", lang) : tx("reddit", f as RedditSentiment, lang)}
                </button>
              );
            })}
          </div>
          <div className="flex gap-1.5">
            {([
              { key: "citations" as SortKey, label: tx("reddit", "sortCitations", lang) },
              { key: "upvotes" as SortKey, label: tx("reddit", "sortUpvotes", lang) },
              { key: "newest" as SortKey, label: tx("reddit", "sortNewest", lang) },
            ]).map(({ key, label }) => (
              <button key={key} onClick={() => setSortBy(key)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: sortBy === key ? "#1a1a2e" : "#0f0f17", color: sortBy === key ? "#f0f0f8" : "#4a4a6a", border: `1px solid ${sortBy === key ? "#25253f" : "#1a1a2e"}` }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Thread cards */}
        <div className="space-y-3">
          {threads.map(thread => {
            const sCfg = SENTIMENT_CFG[thread.sentiment];
            return (
              <div key={thread.id} className="rounded-xl p-4 space-y-2 transition-colors hover:bg-white/[0.01]" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: "#1a1a2e", color: "#7070a0" }}>r/{thread.subreddit}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: sCfg.bg, color: sCfg.color }}>{tx("reddit", thread.sentiment, lang)}</span>
                  <span className="text-xs" style={{ color: SENTIMENT_CFG[thread.brandImpact === "boost" ? "positive" : thread.brandImpact === "damage" ? "negative" : "mixed"].color }}>
                    {IMPACT_ICONS[thread.brandImpact]} {tx("reddit", thread.brandImpact === "boost" ? "boost" : thread.brandImpact === "damage" ? "damage" : "neutral", lang)}
                  </span>
                  <span className="text-xs ml-auto" style={{ color: "#4a4a6a" }}>{thread.monthsAgo} {tx("reddit", "monthsAgo", lang)}</span>
                </div>
                <p className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>{thread.title}</p>
                <p className="text-xs italic px-3 py-2 rounded-lg" style={{ background: "#12121e", color: "#9090b0", borderLeft: "3px solid #ff6b35" }}>
                  &quot;{thread.keyQuote}&quot;
                </p>
                <div className="flex items-center gap-4 text-xs" style={{ color: "#4a4a6a" }}>
                  <span style={{ color: "#ff6b35" }}>{tx("reddit", "aiCited", lang)} {thread.aiCitations} {tx("reddit", "times", lang)}</span>
                  <span>↑ {thread.upvotes.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why this matters */}
      <div className="rounded-2xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <h3 className="text-sm font-bold" style={{ color: "#f0f0f8" }}>{tx("reddit", "whyTitle", lang)}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {([
            { icon: "📊", key: "whyTraining" as const },
            { icon: "⚡", key: "whyFresh" as const },
            { icon: "💬", key: "whyCitations" as const },
          ]).map(({ icon, key }) => (
            <div key={key} className="rounded-xl p-3" style={{ background: "#12121e", border: "1px solid #1a1a2e" }}>
              <span className="text-lg">{icon}</span>
              <p className="text-xs mt-2" style={{ color: "#9090b0" }}>{tx("reddit", key, lang)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl p-8 text-center" style={{ background: "linear-gradient(135deg, #1a0e06, #12121e)", border: "1px solid rgba(255,107,53,0.2)" }}>
        <h2 className="text-lg font-bold mb-2" style={{ color: "#f0f0f8" }}>{tx("reddit", "ctaTitle", lang)}</h2>
        <p className="text-sm mb-5" style={{ color: "#7070a0", maxWidth: 400, margin: "0 auto 20px" }}>{tx("reddit", "ctaSub", lang)}</p>
        <div className="flex gap-3 justify-center">
          <Link href={h("/audit")} className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85" style={{ background: "#ff6b35", color: "#fff" }}>
            {tx("reddit", "ctaAudit", lang)}
          </Link>
          <Link href={h("/hallucination")} className="px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-85" style={{ background: "#1a1a2e", color: "#f0f0f8", border: "1px solid #25253f" }}>
            {lang === "zh" ? "查看幻觉检测 →" : "Check Hallucination Score →"}
          </Link>
        </div>
      </div>

      {showUpgradeModal && <UpgradeModal lang={lang} onClose={() => setShowUpgradeModal(false)} />}
    </div>
  );
}
