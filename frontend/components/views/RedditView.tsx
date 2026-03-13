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

/* ── Sentiment config ─────────────────────────────────────────────────────── */
const SENTIMENT_CFG: Record<RedditSentiment, { color: string; bg: string }> = {
  positive: { color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  negative: { color: "#ff4d6d", bg: "rgba(255,77,109,0.12)" },
  mixed:    { color: "#f5a623", bg: "rgba(245,166,35,0.12)" },
};

const IMPACT_ICONS: Record<string, string> = {
  boost: "↑", damage: "↓", neutral: "→",
};

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
  const [selectedBrandId, setSelectedBrandId] = useState(REDDIT_BRANDS[0].id);
  const [sentimentFilter, setSentimentFilter] = useState<RedditSentiment | "all">("all");
  const [sortBy, setSortBy] = useState<SortKey>("citations");

  // Auth + credits
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const viewedBrands = useRef(new Set<string>());

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

  const brand = REDDIT_BRANDS.find(b => b.id === selectedBrandId)!;
  const scoreColor = computeRedditSentimentColor(brand.redditScore);
  const level = computeRedditLevel(brand.redditScore);
  const levelLabel = level === "strong" ? tx("reddit", "strong", lang) : level === "mixed" ? tx("reddit", "mixedSignals", lang) : tx("reddit", "weak", lang);

  // Filter + sort threads
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

      {/* Brand pills */}
      <div className="flex flex-wrap gap-2">
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
              <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${sc}18`, color: sc }}>
                {b.redditScore}
              </span>
              {isUnlockable && !isSelected && <span className="text-xs" style={{ color: "#4a4a6a" }}>1 cr</span>}
            </button>
          );
        })}
      </div>

      {/* Anonymous banner */}
      {isLoggedIn === false && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,107,53,0.04)", border: "1px solid rgba(255,107,53,0.15)" }}>
          <p className="text-sm mb-2" style={{ color: "#9090b0" }}>{tx("reddit", "lockedPreview", lang)}</p>
          <Link href={h("/signup")} className="px-5 py-2 rounded-xl text-sm font-semibold inline-block" style={{ background: "#ff6b35", color: "#fff" }}>
            {lang === "zh" ? "免费注册 →" : "Sign Up Free →"}
          </Link>
        </div>
      )}

      {/* Score card */}
      <div className="rounded-2xl p-6" style={{ background: "#0f0f17", border: `1px solid ${scoreColor}30` }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {/* Score */}
          <div className="text-center">
            <p className="text-xs font-semibold mb-2" style={{ color: "#7070a0" }}>{tx("reddit", "presenceScore", lang)}</p>
            <div className="text-5xl font-black" style={{ color: scoreColor }}>{brand.redditScore}</div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full mt-2 inline-block" style={{ background: `${scoreColor}18`, color: scoreColor }}>
              {levelLabel}
            </span>
          </div>
          {/* Sentiment */}
          <div className="text-center">
            <p className="text-xs font-semibold mb-3" style={{ color: "#7070a0" }}>{tx("reddit", "sentimentBreak", lang)}</p>
            <div className="space-y-1">
              {(["positive", "negative", "mixed"] as RedditSentiment[]).map(s => (
                <div key={s} className="flex items-center justify-between text-xs">
                  <span style={{ color: SENTIMENT_CFG[s].color }}>{tx("reddit", s, lang)}</span>
                  <span style={{ color: "#f0f0f8" }}>{brand[s]}%</span>
                </div>
              ))}
            </div>
          </div>
          {/* Mentions */}
          <div className="text-center">
            <p className="text-xs font-semibold mb-2" style={{ color: "#7070a0" }}>{tx("reddit", "totalMentions", lang)}</p>
            <div className="text-3xl font-bold" style={{ color: "#f0f0f8" }}>{brand.totalMentions.toLocaleString()}</div>
          </div>
          {/* Threads */}
          <div className="text-center">
            <p className="text-xs font-semibold mb-2" style={{ color: "#7070a0" }}>{tx("reddit", "trackedThreads", lang)}</p>
            <div className="text-3xl font-bold" style={{ color: "#f0f0f8" }}>{brand.threads.length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1.5">
          {(["all", "positive", "negative", "mixed"] as (RedditSentiment | "all")[]).map(f => {
            const isActive = sentimentFilter === f;
            const bgActive = f === "all" ? "rgba(255,107,53,0.12)" : SENTIMENT_CFG[f as RedditSentiment].bg;
            const colorActive = f === "all" ? "#ff6b35" : SENTIMENT_CFG[f as RedditSentiment].color;
            return (
              <button
                key={f}
                onClick={() => setSentimentFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: isActive ? bgActive : "#0f0f17",
                  color: isActive ? colorActive : "#7070a0",
                  border: `1px solid ${isActive ? "transparent" : "#25253f"}`,
                }}
              >
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
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: sortBy === key ? "#1a1a2e" : "#0f0f17",
                color: sortBy === key ? "#f0f0f8" : "#4a4a6a",
                border: `1px solid ${sortBy === key ? "#25253f" : "#1a1a2e"}`,
              }}
            >
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
                <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: "#1a1a2e", color: "#7070a0" }}>
                  r/{thread.subreddit}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: sCfg.bg, color: sCfg.color }}>
                  {tx("reddit", thread.sentiment, lang)}
                </span>
                <span className="text-xs" style={{ color: SENTIMENT_CFG[thread.brandImpact === "boost" ? "positive" : thread.brandImpact === "damage" ? "negative" : "mixed"].color }}>
                  {IMPACT_ICONS[thread.brandImpact]} {tx("reddit", thread.brandImpact === "boost" ? "boost" : thread.brandImpact === "damage" ? "damage" : "neutral", lang)}
                </span>
                <span className="text-xs ml-auto" style={{ color: "#4a4a6a" }}>
                  {thread.monthsAgo} {tx("reddit", "monthsAgo", lang)}
                </span>
              </div>
              <p className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>{thread.title}</p>
              <p className="text-xs italic px-3 py-2 rounded-lg" style={{ background: "#12121e", color: "#9090b0", borderLeft: "3px solid #ff6b35" }}>
                &quot;{thread.keyQuote}&quot;
              </p>
              <div className="flex items-center gap-4 text-xs" style={{ color: "#4a4a6a" }}>
                <span style={{ color: "#ff6b35" }}>
                  {tx("reddit", "aiCited", lang)} {thread.aiCitations} {tx("reddit", "times", lang)}
                </span>
                <span>↑ {thread.upvotes.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
        {threads.length === 0 && (
          <div className="text-center py-8 text-sm" style={{ color: "#4a4a6a" }}>
            {lang === "zh" ? "未找到匹配的帖子" : "No threads match the filter"}
          </div>
        )}
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
