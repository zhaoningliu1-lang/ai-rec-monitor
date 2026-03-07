"use client";

import { useState } from "react";
import Link from "next/link";
import {
  REDDIT_BRANDS,
  computeRedditSentimentColor,
  computeRedditLevel,
  type RedditSentiment,
  type BrandImpact,
} from "@/lib/reddit-data";

// ── Config ────────────────────────────────────────────────────────────────────

const SENTIMENT_CONFIG: Record<RedditSentiment, { label: string; color: string; bg: string }> = {
  positive: { label: "Positive", color: "#22c55e", bg: "rgba(34,197,94,0.10)" },
  negative: { label: "Negative", color: "#ff4d6d", bg: "rgba(255,77,109,0.10)" },
  mixed:    { label: "Mixed",    color: "#f5a623", bg: "rgba(245,166,35,0.10)" },
};

const IMPACT_CONFIG: Record<BrandImpact, { label: string; color: string; icon: string }> = {
  boost:   { label: "Brand Boost",   color: "#22c55e", icon: "↑" },
  damage:  { label: "Brand Damage",  color: "#ff4d6d", icon: "↓" },
  neutral: { label: "Neutral",       color: "#7070a0", icon: "→" },
};

const LEVEL_CONFIG = {
  strong: { label: "STRONG PRESENCE", color: "#22c55e", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.25)" },
  mixed:  { label: "MIXED SIGNALS",   color: "#f5a623", bg: "rgba(245,166,35,0.08)", border: "rgba(245,166,35,0.25)" },
  weak:   { label: "WEAK PRESENCE",   color: "#ff4d6d", bg: "rgba(255,77,109,0.08)", border: "rgba(255,77,109,0.25)" },
};

type SortKey = "aiCitations" | "upvotes" | "monthsAgo";
type FilterSentiment = "all" | RedditSentiment;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RedditPage() {
  const [selectedBrandId, setSelectedBrandId] = useState(REDDIT_BRANDS[0].id);
  const [sortBy, setSortBy] = useState<SortKey>("aiCitations");
  const [filterSentiment, setFilterSentiment] = useState<FilterSentiment>("all");

  const brand = REDDIT_BRANDS.find(b => b.id === selectedBrandId)!;
  const level = computeRedditLevel(brand.redditScore);
  const levelConfig = LEVEL_CONFIG[level];
  const scoreColor = computeRedditSentimentColor(brand.redditScore);

  const filteredThreads = brand.threads
    .filter(t => filterSentiment === "all" || t.sentiment === filterSentiment)
    .sort((a, b) => {
      if (sortBy === "aiCitations") return b.aiCitations - a.aiCitations;
      if (sortBy === "upvotes") return b.upvotes - a.upvotes;
      return a.monthsAgo - b.monthsAgo;
    });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.25)" }}
          >
            Reddit Citation Intelligence
          </div>
          <div
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,107,53,0.08)", color: "#ff6b35" }}
          >
            Powered by Avanti
          </div>
        </div>
        <h1 className="text-3xl font-black">Which Reddit Threads Are Shaping AI&apos;s View of Your Brand?</h1>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "#9090b0" }}>
          AI models treat Reddit as a trusted source. When ChatGPT, Claude, or Gemini answers a product question,
          it often pulls quotes from Reddit threads — positive or negative. We track exactly which posts are
          being cited, and what buyers are hearing as a result.
        </p>
      </div>

      {/* Brand selector */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>
          Select Brand
        </div>
        <div className="flex gap-2 flex-wrap">
          {REDDIT_BRANDS.map(b => {
            const bColor = computeRedditSentimentColor(b.redditScore);
            const active = b.id === selectedBrandId;
            return (
              <button
                key={b.id}
                onClick={() => { setSelectedBrandId(b.id); setFilterSentiment("all"); setSortBy("aiCitations"); }}
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
                  style={{ color: bColor, background: bColor + "18" }}
                >
                  {b.redditScore}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Score overview */}
      <div
        className="rounded-2xl p-6 grid md:grid-cols-4 gap-6"
        style={{ background: "#0f0f17", border: `1px solid ${levelConfig.border}` }}
      >
        {/* Reddit score */}
        <div className="md:col-span-1 flex flex-col justify-center">
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>
            Reddit Presence Score
          </div>
          <div className="text-6xl font-black mb-1" style={{ color: scoreColor }}>
            {brand.redditScore}
          </div>
          <div
            className="inline-block text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ color: levelConfig.color, background: levelConfig.bg, border: `1px solid ${levelConfig.border}` }}
          >
            {levelConfig.label}
          </div>
        </div>

        {/* Sentiment breakdown */}
        <div className="md:col-span-2 flex flex-col justify-center gap-3">
          <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>
            Sentiment Breakdown
          </div>
          {[
            { label: "Positive", value: brand.positive, color: "#22c55e" },
            { label: "Negative", value: brand.negative, color: "#ff4d6d" },
            { label: "Mixed",    value: brand.mixed,    color: "#f5a623" },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="text-xs w-14 text-right" style={{ color: s.color }}>{s.value}%</div>
              <div className="flex-1 h-1.5 rounded-full" style={{ background: "#25253f" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${s.value}%`, background: s.color }}
                />
              </div>
              <div className="text-xs w-14" style={{ color: "#7070a0" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="md:col-span-1 flex flex-col justify-center gap-2">
          <div className="rounded-xl p-3" style={{ background: "#161625" }}>
            <div className="text-xs mb-1" style={{ color: "#7070a0" }}>Total Mentions</div>
            <div className="text-xl font-black" style={{ color: "#f0f0f8" }}>{brand.totalMentions.toLocaleString()}</div>
          </div>
          <div className="rounded-xl p-3" style={{ background: "#161625" }}>
            <div className="text-xs mb-1" style={{ color: "#7070a0" }}>Tracked Threads</div>
            <div className="text-xl font-black" style={{ color: "#f0f0f8" }}>{brand.threads.length}</div>
          </div>
        </div>
      </div>

      {/* Thread list */}
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap justify-between">
          {/* Sentiment filter */}
          <div className="flex gap-2">
            {(["all", "positive", "negative", "mixed"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterSentiment(f)}
                className="text-xs px-3 py-1 rounded-lg border transition-colors capitalize"
                style={
                  filterSentiment === f
                    ? { background: "#ff6b3522", color: "#ff6b35", border: "1px solid #ff6b3555" }
                    : { background: "#0f0f17", color: "#7070a0", border: "1px solid #25253f" }
                }
              >
                {f === "all" ? "All" : SENTIMENT_CONFIG[f].label}
              </button>
            ))}
          </div>
          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "#7070a0" }}>Sort:</span>
            {([
              { key: "aiCitations", label: "AI Citations" },
              { key: "upvotes",     label: "Upvotes" },
              { key: "monthsAgo",   label: "Newest" },
            ] as { key: SortKey; label: string }[]).map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className="text-xs px-2.5 py-1 rounded-lg border transition-colors"
                style={
                  sortBy === opt.key
                    ? { background: "#1a1a2e", color: "#f0f0f8", border: "1px solid #25253f" }
                    : { background: "transparent", color: "#7070a0", border: "1px solid transparent" }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Threads */}
        <div className="space-y-3">
          {filteredThreads.length === 0 ? (
            <div className="text-sm text-center py-8" style={{ color: "#555580" }}>
              No threads match this filter.
            </div>
          ) : filteredThreads.map((thread, i) => {
            const sConfig = SENTIMENT_CONFIG[thread.sentiment];
            const iConfig = IMPACT_CONFIG[thread.brandImpact];
            return (
              <div
                key={thread.id}
                className="rounded-2xl p-5 space-y-3"
                style={{ background: "#0f0f17", border: "1px solid #1a1a2e" }}
              >
                {/* Top row */}
                <div className="flex items-start gap-3 flex-wrap">
                  {/* Subreddit */}
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded shrink-0"
                    style={{ background: "#1a1a2e", color: "#ff6b35" }}
                  >
                    {thread.subreddit}
                  </span>
                  {/* Sentiment */}
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded shrink-0"
                    style={{ color: sConfig.color, background: sConfig.bg }}
                  >
                    {sConfig.label}
                  </span>
                  {/* Impact */}
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded shrink-0"
                    style={{ color: iConfig.color, background: iConfig.color + "15" }}
                  >
                    {iConfig.icon} {iConfig.label}
                  </span>
                  <span className="text-xs ml-auto shrink-0" style={{ color: "#555580" }}>
                    {thread.monthsAgo}mo ago
                  </span>
                </div>

                {/* Title */}
                <p className="text-sm font-semibold leading-snug" style={{ color: "#f0f0f8" }}>
                  {thread.title}
                </p>

                {/* AI key quote */}
                <div
                  className="text-xs leading-relaxed px-3 py-2.5 rounded-xl italic"
                  style={{ background: "#161625", color: "#9090b0", borderLeft: "2px solid #ff6b3540" }}
                >
                  <span className="text-xs not-italic font-semibold mr-2" style={{ color: "#ff6b35" }}>AI pulls:</span>
                  {thread.keyQuote}
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#ff6b35" }} />
                    <span className="text-xs font-bold" style={{ color: "#ff6b35" }}>{thread.aiCitations}</span>
                    <span className="text-xs" style={{ color: "#555580" }}>AI citations</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs" style={{ color: "#7070a0" }}>▲</span>
                    <span className="text-xs font-semibold" style={{ color: "#9090b0" }}>{thread.upvotes.toLocaleString()}</span>
                    <span className="text-xs" style={{ color: "#555580" }}>upvotes</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why Reddit matters */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          Why Reddit Shapes AI Responses
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: "🧵",
              title: "AI trusts Reddit as social proof",
              desc: "ChatGPT, Claude, and Gemini treat upvoted Reddit comments as high-authority signals. A negative thread with 3K upvotes outweighs your product page.",
            },
            {
              icon: "🔁",
              title: "Cited threads amplify over time",
              desc: "Once an AI model cites a Reddit thread, that quote enters AI's training signal. Negative quotes get repeated to thousands of buyers asking similar questions.",
            },
            {
              icon: "🛡",
              title: "You can counter bad threads",
              desc: "Publishing accurate, detailed content on Reddit — and getting it upvoted — directly competes with negative threads for AI citation priority.",
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
          <div className="font-semibold mb-1">Track Reddit citations for your brand</div>
          <p className="text-sm" style={{ color: "#9090b0" }}>
            See which Reddit threads AI is citing about your products — and get an action plan to shift the narrative.
          </p>
        </div>
        <div className="flex gap-3 shrink-0 flex-wrap">
          <Link
            href="/audit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            Run Free Audit →
          </Link>
          <Link
            href="/hallucination"
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ border: "1px solid #25253f", color: "#f0f0f8" }}
          >
            Check Hallucination Score →
          </Link>
        </div>
      </div>

    </div>
  );
}
