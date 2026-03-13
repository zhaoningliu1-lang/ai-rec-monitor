"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CategoryEntry, EnrichedLeaderboardEntry, GoogleTrendsData, TrendsLeaderboardResponse, api } from "@/lib/api";
import { Lang, tx } from "@/lib/i18n";
import { fetchMe } from "@/lib/auth";
import { YOUTUBE_SIGNALS, AMAZON_CAR_ELECTRONICS, AMAZON_LIVE_DATE } from "@/lib/amazon-live-data";

/* ── Sparkline ────────────────────────────────────────────────────────────── */
function Sparkline({ data, trend }: { data: number[]; trend: string }) {
  if (data.length < 2) return <span style={{ color: "#4a4a6a", fontSize: 11 }}>—</span>;
  const w = 80, h = 28, pad = 2;
  const mn = Math.min(...data), mx = Math.max(...data);
  const range = mx - mn || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - 2 * pad);
    const y = h - pad - ((v - mn) / range) * (h - 2 * pad);
    return `${x},${y}`;
  });
  const color = trend === "rising" ? "#22c55e" : trend === "falling" ? "#ff4d6d" : "#f5a623";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(",")[0]} cy={pts[pts.length - 1].split(",")[1]} r={2.5} fill={color} />
    </svg>
  );
}

/* ── Trend badge ──────────────────────────────────────────────────────────── */
function TrendBadge({ direction, change, lang }: { direction: string; change: number; lang: Lang }) {
  const cfg = {
    rising:  { icon: "↑", color: "#22c55e", bg: "rgba(34,197,94,0.12)", label: tx("trends", "rising", lang) },
    falling: { icon: "↓", color: "#ff4d6d", bg: "rgba(255,77,109,0.12)", label: tx("trends", "falling", lang) },
    stable:  { icon: "→", color: "#f5a623", bg: "rgba(245,166,35,0.12)", label: tx("trends", "stable", lang) },
  }[direction] ?? { icon: "→", color: "#f5a623", bg: "rgba(245,166,35,0.12)", label: "—" };

  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.icon} {change !== 0 ? `${change > 0 ? "+" : ""}${change}` : cfg.label}
    </span>
  );
}

/* ── SOV bar ──────────────────────────────────────────────────────────────── */
function SovBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "#25253f" }}>
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, value)}%`, background: "#ff6b35" }} />
      </div>
      <span className="text-xs font-mono" style={{ color: "#f0f0f8" }}>{value.toFixed(1)}%</span>
    </div>
  );
}

/* ── Upgrade Modal ────────────────────────────────────────────────────────── */
function UpgradeModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const h = (path: string) => lang === "zh" ? `/zh${path}` : path;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="rounded-2xl p-8 max-w-sm text-center space-y-4" style={{ background: "#12121e", border: "1px solid #25253f" }} onClick={e => e.stopPropagation()}>
        <div className="text-3xl">0</div>
        <h3 className="text-lg font-bold" style={{ color: "#f0f0f8" }}>
          {tx("trends", "creditsExhausted", lang)}
        </h3>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          {tx("trends", "upgradeToView", lang)}
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link href={h("/account")} className="px-5 py-2 rounded-xl text-sm font-semibold" style={{ background: "#ff6b35", color: "#fff" }}>
            {tx("trends", "upgradeCta", lang)}
          </Link>
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-sm" style={{ background: "#1a1a2e", color: "#7070a0", border: "1px solid #25253f" }}>
            {lang === "zh" ? "关闭" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */
interface TrendsViewProps {
  categories: CategoryEntry[];
  lang: Lang;
}

export default function TrendsView({ categories, lang }: TrendsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [leaderboard, setLeaderboard] = useState<EnrichedLeaderboardEntry[]>([]);
  const [loadingLb, setLoadingLb] = useState(false);
  const [googleTrends, setGoogleTrends] = useState<GoogleTrendsData | null>(null);
  const [loadingGt, setLoadingGt] = useState(false);

  // Credit state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = checking
  const [isPaid, setIsPaid] = useState(false);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [limited, setLimited] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const viewedCategories = useRef(new Set<string>());

  // Check auth status on mount
  useEffect(() => {
    fetchMe()
      .then((u) => {
        setIsLoggedIn(true);
        setCreditsRemaining(u.credit_balance);
        const tier = u.subscription_tier;
        setIsPaid(tier === "growth" || tier === "scale" || tier === "enterprise");
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  // Auto-select first category if available
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].category);
    }
  }, [categories, selectedCategory]);

  // Fetch data when category changes
  useEffect(() => {
    if (!selectedCategory) return;

    // Skip API call if already viewed this category in this session (saves credits)
    if (viewedCategories.current.has(selectedCategory)) {
      return;
    }

    setLoadingLb(true);
    api.getCategoryLeaderboardWithTrends(selectedCategory, 5)
      .then((resp: TrendsLeaderboardResponse) => {
        setLeaderboard(resp.entries);
        setLimited(resp.limited);
        if (resp.credits_remaining !== null) {
          setCreditsRemaining(resp.credits_remaining);
        }
        viewedCategories.current.add(selectedCategory);
      })
      .catch((err) => {
        if (err instanceof Error && err.message.startsWith("429")) {
          setShowUpgradeModal(true);
        }
        setLeaderboard([]);
      })
      .finally(() => setLoadingLb(false));

    setLoadingGt(true);
    api.getGoogleTrends(selectedCategory)
      .then(setGoogleTrends)
      .catch(() => setGoogleTrends(null))
      .finally(() => setLoadingGt(false));
  }, [selectedCategory]);

  const filteredCategories = categories.filter(c =>
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const h = (path: string) => lang === "zh" ? `/zh${path}` : path;

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-10" style={{ paddingTop: 32, paddingBottom: 64 }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#f0f0f8" }}>
            {tx("trends", "title", lang)}
          </h1>
          <p className="text-sm" style={{ color: "#7070a0", maxWidth: 600 }}>
            {tx("trends", "subtitle", lang)}
          </p>
        </div>
        {/* Credit indicator */}
        {isLoggedIn !== null && (
          <div className="shrink-0 text-right">
            {isLoggedIn ? (
              isPaid ? (
                <span className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
                  {tx("trends", "unlimited", lang)}
                </span>
              ) : (
                <div className="space-y-1">
                  <span className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}>
                    {creditsRemaining ?? 0} {tx("trends", "creditsRemaining", lang)}
                  </span>
                  <p className="text-xs" style={{ color: "#4a4a6a" }}>
                    {tx("trends", "creditCost", lang)}
                  </p>
                </div>
              )
            ) : (
              <Link href={h("/login?next=" + encodeURIComponent(lang === "zh" ? "/zh/trends" : "/trends"))}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-opacity hover:opacity-80"
                style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}>
                {tx("trends", "loginToUnlock", lang)}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Category search + pills */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder={tx("trends", "searchPlaceholder", lang)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
          style={{ background: "#0f0f17", border: "1px solid #25253f", color: "#f0f0f8" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#ff6b35")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#25253f")}
        />
        <div className="flex flex-wrap gap-2">
          {filteredCategories.map((c) => (
            <button
              key={c.category}
              onClick={() => setSelectedCategory(c.category)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: selectedCategory === c.category ? "rgba(255,107,53,0.15)" : "#0f0f17",
                color: selectedCategory === c.category ? "#ff6b35" : "#9090b0",
                border: `1px solid ${selectedCategory === c.category ? "rgba(255,107,53,0.4)" : "#25253f"}`,
              }}
            >
              {c.category} <span style={{ color: "#4a4a6a" }}>({c.brand_count})</span>
            </button>
          ))}
          {filteredCategories.length === 0 && (
            <p className="text-xs" style={{ color: "#4a4a6a" }}>
              {tx("trends", "noData", lang)}
            </p>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      {selectedCategory && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #25253f" }}>
            <h2 className="text-sm font-bold" style={{ color: "#f0f0f8" }}>
              {tx("trends", "leaderboardTitle", lang)} — {selectedCategory}
            </h2>
            <span className="text-xs" style={{ color: "#4a4a6a" }}>
              {leaderboard.length} {tx("trends", "brandsTracked", lang)}
            </span>
          </div>

          {loadingLb ? (
            <div className="px-5 py-10 text-center text-sm" style={{ color: "#7070a0" }}>
              {tx("trends", "loading", lang)}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm" style={{ color: "#4a4a6a" }}>
              {tx("trends", "noData", lang)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1a1a2e" }}>
                    <th className="px-5 py-2.5 text-left text-xs font-semibold" style={{ color: "#7070a0" }}>#</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold" style={{ color: "#7070a0" }}>{tx("trends", "colBrand", lang)}</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold" style={{ color: "#7070a0" }}>{tx("trends", "colSov", lang)}</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold" style={{ color: "#7070a0" }}>{tx("trends", "colTrend", lang)}</th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold" style={{ color: "#7070a0" }}>{tx("trends", "colArrs", lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, i) => (
                    <tr key={entry.brand_name} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: "1px solid #1a1a2e" }}>
                      <td className="px-5 py-3 text-xs font-mono" style={{ color: "#4a4a6a" }}>{i + 1}</td>
                      <td className="px-3 py-3">
                        <Link href={h(`/brands/${encodeURIComponent(entry.brand_name)}`)} className="text-sm font-semibold hover:underline" style={{ color: "#f0f0f8" }}>
                          {entry.brand_name}
                        </Link>
                      </td>
                      <td className="px-3 py-3">
                        <SovBar value={entry.weighted_sov} />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Sparkline data={entry.sparkline} trend={entry.trend_direction} />
                          <TrendBadge direction={entry.trend_direction} change={entry.sov_change} lang={lang} />
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-xs font-bold px-2 py-1 rounded-lg"
                          style={{
                            background: entry.arrs >= 60 ? "rgba(34,197,94,0.12)" : entry.arrs >= 30 ? "rgba(245,166,35,0.12)" : "rgba(255,77,109,0.12)",
                            color: entry.arrs >= 60 ? "#22c55e" : entry.arrs >= 30 ? "#f5a623" : "#ff4d6d",
                          }}>
                          {entry.arrs.toFixed(0)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Limited preview banner for anonymous users */}
          {limited && (
            <div className="px-5 py-4 text-center" style={{ borderTop: "1px solid #25253f", background: "rgba(255,107,53,0.04)" }}>
              <p className="text-sm mb-3" style={{ color: "#9090b0" }}>
                {tx("trends", "limitedPreview", lang)}
              </p>
              <Link href={h("/login?next=" + encodeURIComponent(lang === "zh" ? "/zh/trends" : "/trends"))}
                className="px-5 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 inline-block"
                style={{ background: "#ff6b35", color: "#fff" }}>
                {tx("trends", "signupToUnlock", lang)}
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Google Trends section */}
      {selectedCategory && (
        <div className="rounded-2xl p-5 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div>
            <h2 className="text-sm font-bold mb-1" style={{ color: "#f0f0f8" }}>{tx("trends", "googleTitle", lang)}</h2>
            <p className="text-xs" style={{ color: "#7070a0" }}>{tx("trends", "googleSub", lang)}</p>
          </div>
          {loadingGt ? (
            <div className="text-xs" style={{ color: "#4a4a6a" }}>{tx("trends", "loading", lang)}</div>
          ) : !googleTrends || Object.keys(googleTrends.keywords).length === 0 ? (
            <div className="text-xs" style={{ color: "#4a4a6a" }}>
              {lang === "zh" ? "Google Trends 数据暂不可用" : "Google Trends data unavailable"}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Keyword scores */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(googleTrends.keywords).map(([kw, score]) => {
                  const delta = googleTrends.delta_4w_pct[kw] ?? 0;
                  return (
                    <div key={kw} className="rounded-xl p-3" style={{ background: "#12121e", border: "1px solid #1a1a2e" }}>
                      <div className="text-xs font-medium mb-1 truncate" style={{ color: "#f0f0f8" }}>{kw}</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold" style={{ color: "#ff6b35" }}>{score}</span>
                        <span className="text-xs" style={{ color: delta > 0 ? "#22c55e" : delta < 0 ? "#ff4d6d" : "#7070a0" }}>
                          {delta > 0 ? "+" : ""}{delta}% <span style={{ color: "#4a4a6a" }}>{tx("trends", "fourWeekChange", lang)}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Rising queries */}
              {googleTrends.rising_queries.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold mb-2" style={{ color: "#7070a0" }}>{tx("trends", "risingQueries", lang)}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {googleTrends.rising_queries.map((q) => (
                      <span key={q} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* YouTube Citation Intelligence */}
      <div className="rounded-2xl p-5 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <div>
          <h2 className="text-sm font-bold mb-1" style={{ color: "#f0f0f8" }}>{tx("trends", "youtubeTitle", lang)}</h2>
          <p className="text-xs" style={{ color: "#7070a0" }}>{tx("trends", "youtubeSub", lang)}</p>
        </div>
        <div className="space-y-4">
          {YOUTUBE_SIGNALS.map((signal) => (
            <div key={signal.query}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: "#f0f0f8" }}>&quot;{signal.query}&quot;</span>
                <span className="text-xs" style={{ color: "#4a4a6a" }}>{(signal.totalViews / 1000).toFixed(0)}K views</span>
              </div>
              <div className="space-y-1">
                {signal.allVideos.slice(0, 3).map((v) => (
                  <a key={v.url} href={v.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between py-1.5 px-3 rounded-lg transition-colors hover:bg-white/[0.03]"
                    style={{ color: "#9090b0" }}>
                    <span className="text-xs truncate flex-1 mr-2">{v.title}</span>
                    <span className="text-xs shrink-0" style={{ color: "#4a4a6a" }}>{v.uploader} · {(v.views / 1000).toFixed(0)}K</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amazon Bestsellers */}
      <div className="rounded-2xl p-5 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold mb-1" style={{ color: "#f0f0f8" }}>{tx("trends", "amazonTitle", lang)}</h2>
            <p className="text-xs" style={{ color: "#7070a0" }}>{tx("trends", "amazonSub", lang)}</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}>
            {AMAZON_LIVE_DATE}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1a1a2e" }}>
                <th className="px-3 py-2 text-left" style={{ color: "#7070a0" }}>#</th>
                <th className="px-3 py-2 text-left" style={{ color: "#7070a0" }}>{lang === "zh" ? "产品" : "Product"}</th>
                <th className="px-3 py-2 text-left" style={{ color: "#7070a0" }}>{lang === "zh" ? "品牌" : "Brand"}</th>
                <th className="px-3 py-2 text-right" style={{ color: "#7070a0" }}>{lang === "zh" ? "价格" : "Price"}</th>
                <th className="px-3 py-2 text-right" style={{ color: "#7070a0" }}>{lang === "zh" ? "评分" : "Rating"}</th>
              </tr>
            </thead>
            <tbody>
              {AMAZON_CAR_ELECTRONICS.slice(0, 10).map((item) => (
                <tr key={item.rank} className="hover:bg-white/[0.02]" style={{ borderBottom: "1px solid #1a1a2e" }}>
                  <td className="px-3 py-2 font-mono" style={{ color: "#4a4a6a" }}>{item.rank}</td>
                  <td className="px-3 py-2 truncate" style={{ color: "#f0f0f8", maxWidth: 250 }}>{item.shortTitle}</td>
                  <td className="px-3 py-2" style={{ color: "#9090b0" }}>{item.brand}</td>
                  <td className="px-3 py-2 text-right font-mono" style={{ color: "#ff6b35" }}>{item.price}</td>
                  <td className="px-3 py-2 text-right" style={{ color: "#f5a623" }}>{item.rating} ★</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl p-8 text-center" style={{ background: "linear-gradient(135deg, #1a0e06, #12121e)", border: "1px solid rgba(255,107,53,0.2)" }}>
        <h2 className="text-lg font-bold mb-2" style={{ color: "#f0f0f8" }}>{tx("trends", "ctaTitle", lang)}</h2>
        <p className="text-sm mb-5" style={{ color: "#7070a0", maxWidth: 400, margin: "0 auto 20px" }}>{tx("trends", "ctaSub", lang)}</p>
        <div className="flex gap-3 justify-center">
          <Link href={h("/audit")} className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85" style={{ background: "#ff6b35", color: "#fff" }}>
            {tx("trends", "ctaAudit", lang)}
          </Link>
        </div>
      </div>

      {/* Upgrade modal */}
      {showUpgradeModal && <UpgradeModal lang={lang} onClose={() => setShowUpgradeModal(false)} />}
    </div>
  );
}
