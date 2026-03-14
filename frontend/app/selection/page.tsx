"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  SELECTION_DATA, SECTIONS, PRODUCT_DATA,
  type SellerSignal, type Platform,
} from "@/lib/selection-data";
import { api, type SelectionCategoryEntry, type SelectionCategoryDetailResponse } from "@/lib/api";

/* ── Style helpers ──────────────────────────────────────────────────────── */

const ARRS_COLOR = (arrs: number) =>
  arrs < 30 ? "#22c55e" : arrs < 50 ? "#f5a623" : "#ff4d6d";

const SIGNAL_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  strong_buy: { label: "STRONG BUY", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  watch:      { label: "WATCH",      color: "#f5a623", bg: "rgba(245,166,35,0.1)" },
  avoid:      { label: "AVOID",      color: "#7070a0", bg: "rgba(112,112,160,0.08)" },
};

const TREND_ICON: Record<string, string> = { up: "\u2191", stable: "\u2192", down: "\u2193" };
const TREND_COLOR: Record<string, string> = { up: "#22c55e", stable: "#7070a0", down: "#ff4d6d" };

const PLATFORM_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  Amazon:  { label: "Amazon",  color: "#f5a623", bg: "rgba(245,166,35,0.12)" },
  TikTok:  { label: "TikTok",  color: "#f0f0f8", bg: "rgba(240,240,248,0.08)" },
  Shopee:  { label: "Shopee",  color: "#ff6b35", bg: "rgba(255,107,53,0.10)" },
  DTC:     { label: "DTC",     color: "#60a5fa", bg: "rgba(96,165,250,0.10)" },
  All:     { label: "All",     color: "#22c55e", bg: "rgba(34,197,94,0.10)" },
};

const HAS_PRODUCT_DATA = new Set(Object.keys(PRODUCT_DATA));
const FREE_LIMIT = 9;

/* ── Types ──────────────────────────────────────────────────────────────── */

interface CategoryCard {
  id: string;
  category: string;
  categoryZh: string;
  parentSection: string;
  parentSectionZh: string;
  trend: string;
  trendPts: string;
  topBrands: { name: string; sov: number; arrs: number }[];
  sellerSignal: string;
  sellerNote: string;
  platforms: string[];
  googleTrendsDelta: number | null;
  redditPosts: number | null;
  youtubeKols: number | null;
}

/** Convert API response to our card format */
function apiToCard(c: SelectionCategoryEntry): CategoryCard {
  return {
    id: c.id,
    category: c.category,
    categoryZh: c.category_zh,
    parentSection: c.section,
    parentSectionZh: c.section_zh,
    trend: c.trend,
    trendPts: c.trend_pts,
    topBrands: c.top_brands.map(b => ({ name: b.name, sov: b.sov, arrs: b.arrs })),
    sellerSignal: c.seller_signal,
    sellerNote: c.seller_note,
    platforms: c.platforms,
    googleTrendsDelta: c.google_trends_delta,
    redditPosts: c.reddit_posts,
    youtubeKols: c.youtube_kols,
  };
}

/** Convert static SELECTION_DATA to our card format */
function demoToCard(c: typeof SELECTION_DATA[number]): CategoryCard {
  return {
    id: c.id,
    category: c.category,
    categoryZh: c.categoryZh,
    parentSection: c.parentSection,
    parentSectionZh: c.parentSectionZh,
    trend: c.trend,
    trendPts: c.trendPts,
    topBrands: c.topBrands,
    sellerSignal: c.sellerSignal,
    sellerNote: c.sellerNote,
    platforms: c.platforms,
    googleTrendsDelta: null,
    redditPosts: null,
    youtubeKols: null,
  };
}

/* ── Skeleton shimmer ───────────────────────────────────────────────────── */

function SkeletonCard() {
  return (
    <div className="rounded-xl p-5 space-y-4 animate-pulse"
      style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
      <div className="h-4 rounded w-2/3" style={{ background: "#25253f" }} />
      <div className="h-3 rounded w-1/3" style={{ background: "#1e1e30" }} />
      <div className="h-6 rounded w-1/4" style={{ background: "#1e1e30" }} />
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-2 rounded-full" style={{ background: "#25253f", width: `${80 - i * 15}%` }} />
        ))}
      </div>
      <div className="h-8 rounded" style={{ background: "#1e1e30" }} />
    </div>
  );
}

/* ── Detail panel ───────────────────────────────────────────────────────── */

function DetailPanel({ detail }: { detail: SelectionCategoryDetailResponse }) {
  return (
    <div className="mt-3 space-y-4 border-t pt-3" style={{ borderColor: "#1e1e30" }}>
      {/* Leaderboard */}
      {detail.leaderboard.length > 0 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#555580" }}>
            Full Brand Leaderboard
          </div>
          <div className="space-y-2">
            {detail.leaderboard.map((b: Record<string, unknown>, i: number) => (
              <div key={i} className="flex justify-between text-xs items-center">
                <span style={{ color: "#f0f0f8" }}>{String(b.brand_name)}</span>
                <div className="flex items-center gap-2">
                  <span style={{ color: "#7070a0" }}>{Number(b.weighted_sov).toFixed(1)}% SOV</span>
                  <span className="px-1.5 py-0.5 rounded text-xs font-medium"
                    style={{ background: `${ARRS_COLOR(Number(b.arrs))}18`, color: ARRS_COLOR(Number(b.arrs)) }}>
                    {Number(b.arrs).toFixed(0)}
                  </span>
                  {typeof b.trend_direction === "string" && (
                    <span style={{ color: TREND_COLOR[b.trend_direction] || "#7070a0" }}>
                      {TREND_ICON[b.trend_direction] || ""}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reddit */}
      {detail.reddit_posts.length > 0 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#555580" }}>
            Reddit Signal
          </div>
          <div className="space-y-1.5">
            {detail.reddit_posts.map((p, i) => (
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                className="block rounded-lg p-2 hover:opacity-80 transition-opacity"
                style={{ background: "#0a0a14", border: "1px solid #1e1e30" }}>
                <div className="text-xs" style={{ color: "#f0f0f8" }}>{p.title}</div>
                <div className="text-xs flex items-center gap-2 mt-0.5" style={{ color: "#555580" }}>
                  <span>r/{p.subreddit}</span>
                  <span>{p.score} pts</span>
                  <span className="px-1 rounded" style={{
                    color: p.sentiment === "positive" ? "#22c55e" : p.sentiment === "negative" ? "#ff4d6d" : "#f5a623",
                  }}>{p.sentiment}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* YouTube KOLs */}
      {detail.youtube_kols.length > 0 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#555580" }}>
            YouTube Creators
          </div>
          <div className="space-y-1.5">
            {detail.youtube_kols.map((k, i) => (
              <a key={i} href={k.video_url} target="_blank" rel="noopener noreferrer"
                className="block rounded-lg p-2 hover:opacity-80 transition-opacity"
                style={{ background: "#0a0a14", border: "1px solid #1e1e30" }}>
                <div className="text-xs" style={{ color: "#f0f0f8" }}>{k.channel_name}</div>
                <div className="text-xs flex items-center gap-2 mt-0.5" style={{ color: "#555580" }}>
                  <span>{(k.subscribers / 1000).toFixed(0)}K subs</span>
                  <span>{(k.views / 1000).toFixed(0)}K views</span>
                  <span className="px-1 rounded" style={{
                    color: k.tier === "mega" ? "#ff6b35" : k.tier === "macro" ? "#f5a623" : "#7070a0",
                  }}>{k.tier}</span>
                </div>
                <div className="text-xs mt-0.5 truncate" style={{ color: "#3a3a5c" }}>{k.video_title}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Google Trends */}
      {detail.google_trends?.rising_queries?.length > 0 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#555580" }}>
            Rising Search Queries
          </div>
          <div className="flex flex-wrap gap-1.5">
            {detail.google_trends.rising_queries.slice(0, 8).map((q, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(96,165,250,0.10)", color: "#60a5fa" }}>
                {q}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────── */

export default function SelectionPage() {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const [detail, setDetail] = useState<Record<string, SelectionCategoryDetailResponse>>({});
  const [detailLoading, setDetailLoading] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resp = await api.getSelectionIntelligence();
        if (cancelled) return;
        const cards = resp.categories.map(apiToCard);
        // If API returned data, use it; otherwise fallback to demo
        if (cards.length > 0 && cards.some(c => c.topBrands.length > 0)) {
          setCategories(cards);
          setIsDemo(resp.limited);
          setIsLoggedIn(resp.credits_remaining !== null);
          setCreditsRemaining(resp.credits_remaining);
        } else {
          setCategories(SELECTION_DATA.map(demoToCard));
          setIsDemo(true);
        }
      } catch {
        // Auth error or network error → show demo
        if (cancelled) return;
        setCategories(SELECTION_DATA.map(demoToCard));
        setIsDemo(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Load detail when expanding
  const handleExpand = async (catId: string, catName: string) => {
    if (expanded === catId) {
      setExpanded(null);
      return;
    }
    setExpanded(catId);
    if (detail[catId]) return; // already loaded

    setDetailLoading(catId);
    try {
      const resp = await api.getSelectionCategoryDetail(catName);
      setDetail(prev => ({ ...prev, [catId]: resp }));
    } catch {
      // Silently fail — will show product data or nothing
    } finally {
      setDetailLoading(null);
    }
  };

  const q = search.trim().toLowerCase();

  // SKU search (demo data only — product-level)
  const skuMatches = q.length >= 2
    ? Object.entries(PRODUCT_DATA).flatMap(([catId, products]) => {
        const cat = categories.find(c => c.id === catId) ?? SELECTION_DATA.find(c => c.id === catId);
        return products
          .filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            (p.asin ?? "").toLowerCase().includes(q)
          )
          .map(p => ({ ...p, catId, catName: (cat as { category: string })?.category ?? catId }));
      })
    : [];

  // Category search / filter
  const filtered = q.length >= 2
    ? categories.filter(c =>
        c.category.toLowerCase().includes(q) ||
        c.categoryZh.includes(q) ||
        c.topBrands.some(b => b.name.toLowerCase().includes(q))
      )
    : filter === "all"
      ? categories
      : categories.filter(c => c.parentSection === filter);

  const freeItems = (q.length >= 2 || filter !== "all") ? filtered : filtered.slice(0, FREE_LIMIT);
  const lockedItems = (q.length >= 2 || filter !== "all") ? [] : filtered.slice(FREE_LIMIT);

  return (
    <div className="space-y-10 py-12">
      {/* Demo banner */}
      {isDemo && !loading && (
        <div className="mx-auto max-w-3xl rounded-xl px-5 py-3 text-center text-sm"
          style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)", color: "#ff6b35" }}>
          Showing sample data. <Link href="/login" className="underline font-medium">Sign in</Link> for live AI visibility data across all categories.
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-block text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}>
          AI Selection Intelligence
        </div>
        <h1 className="text-3xl font-bold">What AI Is Telling Buyers to Purchase</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          We track AI recommendation patterns across ChatGPT, Claude, Gemini, and Perplexity in real time.
          Categories, brands, and{" "}
          <strong style={{ color: "#f0f0f8" }}>specific products</strong>{" "}
          buyers are being sent to — updated from live scan data.
        </p>
        <div className="flex items-center justify-center gap-3 pt-1 text-xs" style={{ color: "#7070a0" }}>
          <span>{categories.length} categories</span><span>·</span>
          <span>4 AI engines</span><span>·</span>
          <span>Reddit + YouTube + Google Trends</span><span>·</span>
          <span style={{ color: "#22c55e" }}>{isDemo ? "Sample" : "\u25CF Live"}</span>
        </div>
      </div>

      {/* Search bar */}
      <div className="max-w-xl mx-auto px-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setFilter("all"); }}
            placeholder="Search brand, product, or ASIN (e.g. NOCO GB40, Vantrue N4, B015TKUPIC...)"
            className="w-full rounded-xl px-4 py-2.5 pl-9 text-sm outline-none transition-colors"
            style={{ background: "#0f0f17", border: "1px solid #25253f", color: "#f0f0f8" }}
            onFocus={e => (e.currentTarget.style.borderColor = "#ff6b35")}
            onBlur={e => (e.currentTarget.style.borderColor = "#25253f")}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#7070a0" }}>&#x25CE;</span>
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs hover:text-white transition-colors"
              style={{ color: "#7070a0" }}>&times;</button>
          )}
        </div>
        {q.length >= 2 && (
          <p className="text-xs mt-2 text-center" style={{ color: "#555580" }}>
            {skuMatches.length + freeItems.length} results for &ldquo;{q}&rdquo;
            {skuMatches.length > 0 && ` \u00b7 ${skuMatches.length} product-level matches`}
          </p>
        )}
      </div>

      {/* SKU search results */}
      {skuMatches.length > 0 && (
        <div className="space-y-3 max-w-4xl mx-auto px-4">
          <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#7070a0" }}>
            Product / SKU matches
          </div>
          {skuMatches.map((p, i) => (
            <div key={i} className="rounded-xl p-4 space-y-2"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>{p.name}</div>
                  <div className="text-xs mt-0.5 flex items-center gap-2" style={{ color: "#555580" }}>
                    <span>{p.brand}</span><span>&middot;</span>
                    <span>{p.priceRange}</span><span>&middot;</span>
                    <span style={{ color: "#7070a0" }}>{p.catName}</span>
                    {p.asin && <span style={{ color: "#3a3a5c" }}>ASIN: {p.asin}</span>}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-black" style={{ color: "#f5a623" }}>{p.aiMentions}/100</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>AI mentions</div>
                  <div className="text-xs px-1.5 py-0.5 rounded mt-1 font-medium"
                    style={{ background: `${ARRS_COLOR(p.arrs)}18`, color: ARRS_COLOR(p.arrs) }}>
                    GEO {p.arrs}
                  </div>
                </div>
              </div>
              <p className="text-xs leading-relaxed italic" style={{ color: "#555580" }}>{p.aiContext}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter bar */}
      {q.length < 2 && (
        <div className="flex flex-wrap justify-center gap-2">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setFilter(s.id)}
              className="text-xs px-4 py-1.5 rounded-full transition-colors font-medium"
              style={filter === s.id
                ? { background: "#ff6b35", color: "#fff" }
                : { background: "#0f0f17", border: "1px solid #25253f", color: "#7070a0" }
              }
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Category grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {freeItems.map(cat => {
            const sig = SIGNAL_CONFIG[cat.sellerSignal] ?? SIGNAL_CONFIG.watch;
            const maxSov = cat.topBrands.length > 0 ? cat.topBrands[0].sov : 1;
            const products = PRODUCT_DATA[cat.id] ?? [];
            const isExpanded = expanded === cat.id;
            const catDetail = detail[cat.id];
            const isDetailLoading = detailLoading === cat.id;

            return (
              <div key={cat.id} className="rounded-xl p-5 space-y-4 flex flex-col"
                style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
                {/* Title */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-sm">{cat.category}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#7070a0" }}>{cat.parentSection}</div>
                  </div>
                  <div className="text-xs font-bold shrink-0" style={{ color: TREND_COLOR[cat.trend] || "#7070a0" }}>
                    {TREND_ICON[cat.trend] || ""} {cat.trendPts} pts
                  </div>
                </div>

                {/* Signal + platforms + cross-platform chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <div className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: sig.bg, color: sig.color }}>
                    {sig.label}
                  </div>
                  {cat.platforms.map(p => {
                    const ps = PLATFORM_STYLE[p] ?? { label: p, color: "#7070a0", bg: "rgba(112,112,160,0.08)" };
                    return (
                      <span key={p} className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: ps.bg, color: ps.color }}>
                        {ps.label}
                      </span>
                    );
                  })}
                </div>

                {/* Cross-platform signal chips */}
                {(cat.googleTrendsDelta !== null || cat.redditPosts !== null || cat.youtubeKols !== null) && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {cat.googleTrendsDelta !== null && (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: cat.googleTrendsDelta > 0 ? "rgba(34,197,94,0.08)" : "rgba(255,77,109,0.08)",
                          color: cat.googleTrendsDelta > 0 ? "#22c55e" : "#ff4d6d",
                        }}>
                        {cat.googleTrendsDelta > 0 ? "\u2191" : "\u2193"} {cat.googleTrendsDelta > 0 ? "+" : ""}{cat.googleTrendsDelta}% (4w)
                      </span>
                    )}
                    {cat.redditPosts !== null && cat.redditPosts > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(255,107,53,0.08)", color: "#ff6b35" }}>
                        {cat.redditPosts} Reddit posts
                      </span>
                    )}
                    {cat.youtubeKols !== null && cat.youtubeKols > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(96,165,250,0.08)", color: "#60a5fa" }}>
                        {cat.youtubeKols} creators
                      </span>
                    )}
                  </div>
                )}

                {/* SOV bars */}
                {cat.topBrands.length > 0 ? (
                  <div className="space-y-2">
                    {cat.topBrands.map(b => (
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
                ) : (
                  <div className="text-xs py-4 text-center" style={{ color: "#3a3a5c" }}>
                    No scan data yet — <Link href="/scan" className="underline" style={{ color: "#ff6b35" }}>run a scan</Link> for this category
                  </div>
                )}

                {/* Notes */}
                <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{cat.sellerNote}</p>

                {/* Expand: detail panel OR product drill-down */}
                <div>
                  <button
                    onClick={() => handleExpand(cat.id, cat.category)}
                    className="text-xs font-medium transition-opacity hover:opacity-70 flex items-center gap-1"
                    style={{ color: "#ff6b35" }}
                  >
                    {isDetailLoading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : isExpanded ? (
                      "\u25B2 Hide details"
                    ) : (
                      `\u25BC View details${products.length > 0 ? ` + ${products.length} products` : ""}`
                    )}
                  </button>

                  {isExpanded && (
                    <>
                      {/* Cross-platform detail panel */}
                      {catDetail && <DetailPanel detail={catDetail} />}

                      {/* Product-level data (from demo) */}
                      {products.length > 0 && (
                        <div className="mt-3 space-y-2 border-t pt-3" style={{ borderColor: "#1e1e30" }}>
                          <div className="text-xs font-semibold uppercase tracking-widest mb-2"
                            style={{ color: "#555580" }}>
                            Products cited by AI (out of 100 queries)
                          </div>
                          {products.map(p => (
                            <div key={p.name} className="rounded-lg p-3 space-y-1.5"
                              style={{ background: "#0a0a14", border: "1px solid #1e1e30" }}>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="text-xs font-semibold" style={{ color: "#f0f0f8" }}>{p.name}</div>
                                  <div className="text-xs" style={{ color: "#555580" }}>{p.brand} &middot; {p.priceRange}</div>
                                </div>
                                <div className="shrink-0 text-right">
                                  <div className="text-xs font-bold" style={{ color: "#f5a623" }}>{p.aiMentions}/100</div>
                                  <div className="text-xs px-1.5 py-0.5 rounded mt-0.5"
                                    style={{ background: `${ARRS_COLOR(p.arrs)}18`, color: ARRS_COLOR(p.arrs) }}>
                                    GEO {p.arrs}
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs leading-relaxed" style={{ color: "#555580", fontStyle: "italic" }}>
                                {p.aiContext}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Locked categories */}
      {lockedItems.length > 0 && (
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            style={{ filter: "blur(3px)", pointerEvents: "none", userSelect: "none", opacity: 0.35 }}>
            {lockedItems.map(cat => (
              <div key={cat.id} className="rounded-xl p-5 space-y-4"
                style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-sm">{cat.category}</div>
                    <div className="text-xs" style={{ color: "#7070a0" }}>{cat.parentSection}</div>
                  </div>
                </div>
                <div className="h-5 rounded" style={{ background: "#25253f", width: "45%" }} />
                {cat.topBrands.map(b => (
                  <div key={b.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: "#f0f0f8" }}>{b.name}</span>
                      <span style={{ color: "#7070a0" }}>{b.sov}% SOV</span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: "#ff6b35", width: `${b.sov}%` }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl"
            style={{ background: "linear-gradient(to top, #090910 50%, rgba(9,9,16,0.85) 100%)" }}>
            <div className="text-center space-y-2 px-6 max-w-sm">
              <div className="text-sm font-bold" style={{ color: "#f0f0f8" }}>
                {lockedItems.length} more categories — including TikTok Trending &amp; SE Asia signals
              </div>
              <p className="text-xs" style={{ color: "#7070a0" }}>
                Full cross-platform intelligence: AI visibility, Reddit sentiment, YouTube creator coverage, and Google Trends momentum.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              {isLoggedIn ? (
                <Link href="/pricing"
                  className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
                  style={{ background: "#ff6b35", color: "#fff" }}>
                  Upgrade for full access &rarr;
                </Link>
              ) : (
                <>
                  <Link href="/signup"
                    className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
                    style={{ background: "#ff6b35", color: "#fff" }}>
                    Sign up free &rarr;
                  </Link>
                  <Link href="/pricing"
                    className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
                    style={{ border: "1px solid #25253f", color: "#7070a0" }}>
                    View pricing
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Explainer */}
      <div className="rounded-xl p-5 max-w-2xl mx-auto text-sm space-y-2"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <div className="font-semibold">How to read this</div>
        <div className="space-y-1 text-xs" style={{ color: "#7070a0" }}>
          <div><span style={{ color: "#22c55e" }}>GEO Score &lt; 30</span> = frequently recommended by AI</div>
          <div><span style={{ color: "#f5a623" }}>GEO Score 30&ndash;49</span> = moderate AI presence</div>
          <div><span style={{ color: "#ff4d6d" }}>GEO Score &ge; 50</span> = weak AI visibility — entry opportunity</div>
          <div><span style={{ color: "#f5a623" }}>X/100</span> = product cited in X out of 100 AI queries in this category</div>
          <div className="pt-1">SOV = Share of Voice — % of AI mentions captured by brand in category</div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl p-8 text-center space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <p className="font-semibold">Is your brand on any of these lists?</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          {isLoggedIn
            ? "Run an audit to check your GEO Score, SOV position, and which AI queries mention your brand."
            : "Run a free audit to see your GEO Score, SOV, and which specific AI queries mention you."}
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href={isLoggedIn ? "/audit" : "/signup"}
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}>
            {isLoggedIn ? "Run Audit →" : "Run Free Audit →"}
          </Link>
          <a href="https://calendly.com/brivesubscription/30min"
            target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}>
            Book Strategy Call
          </a>
        </div>
      </div>
    </div>
  );
}
