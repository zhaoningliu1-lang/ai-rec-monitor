"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SELECTION_DATA, SECTIONS, PRODUCT_DATA,
  type SellerSignal, type Platform,
} from "@/lib/selection-data";

const ARRS_COLOR = (arrs: number) =>
  arrs < 30 ? "#22c55e" : arrs < 50 ? "#f5a623" : "#ff4d6d";

const SIGNAL_CONFIG: Record<SellerSignal, { label: string; color: string; bg: string }> = {
  strong_buy: { label: "STRONG BUY",  color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  watch:      { label: "WATCH",       color: "#f5a623", bg: "rgba(245,166,35,0.1)" },
  avoid:      { label: "AVOID",       color: "#7070a0", bg: "rgba(112,112,160,0.08)" },
};

const TREND_ICON: Record<string, string> = { up: "↑", stable: "→", down: "↓" };
const TREND_COLOR: Record<string, string> = { up: "#22c55e", stable: "#7070a0", down: "#ff4d6d" };

const PLATFORM_STYLE: Record<Platform, { label: string; color: string; bg: string }> = {
  Amazon:  { label: "Amazon",  color: "#f5a623", bg: "rgba(245,166,35,0.12)" },
  TikTok:  { label: "TikTok",  color: "#f0f0f8", bg: "rgba(240,240,248,0.08)" },
  Shopee:  { label: "Shopee",  color: "#ff6b35", bg: "rgba(255,107,53,0.10)" },
  DTC:     { label: "DTC",     color: "#60a5fa", bg: "rgba(96,165,250,0.10)" },
  All:     { label: "All",     color: "#22c55e", bg: "rgba(34,197,94,0.10)" },
};

const HAS_PRODUCT_DATA = new Set(Object.keys(PRODUCT_DATA));
const FREE_LIMIT = 9;

export default function SelectionPage() {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const q = search.trim().toLowerCase();

  // SKU search: find matching products across all PRODUCT_DATA
  const skuMatches = q.length >= 2
    ? Object.entries(PRODUCT_DATA).flatMap(([catId, products]) => {
        const cat = SELECTION_DATA.find(c => c.id === catId);
        return products
          .filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            (p.asin ?? "").toLowerCase().includes(q)
          )
          .map(p => ({ ...p, catId, catName: cat?.category ?? catId }));
      })
    : [];

  // Category search
  const filtered = (q.length >= 2
    ? SELECTION_DATA.filter(c =>
        c.category.toLowerCase().includes(q) ||
        c.categoryZh.includes(q) ||
        c.topBrands.some(b => b.name.toLowerCase().includes(q))
      )
    : filter === "all" ? SELECTION_DATA : SELECTION_DATA.filter(c => c.parentSection === filter)
  );

  const freeItems = (q.length >= 2 || filter !== "all") ? filtered : filtered.slice(0, FREE_LIMIT);
  const lockedItems = (q.length >= 2 || filter !== "all") ? [] : filtered.slice(FREE_LIMIT);

  return (
    <div className="space-y-10 py-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div
          className="inline-block text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
        >
          AI Selection Intelligence
        </div>
        <h1 className="text-3xl font-bold">What AI Is Telling Buyers to Purchase</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          We track AI recommendation patterns across ChatGPT, Claude, Gemini, and Perplexity in real time.
          Categories, brands, and{" "}
          <strong style={{ color: "#f0f0f8" }}>specific products</strong>{" "}
          buyers are being sent to — updated monthly.
        </p>
        <div className="flex items-center justify-center gap-3 pt-1 text-xs" style={{ color: "#7070a0" }}>
          <span>16 categories</span><span>·</span>
          <span>4 AI engines</span><span>·</span>
          <span>200+ queries/month</span><span>·</span>
          <span style={{ color: "#22c55e" }}>● Live</span>
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
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#7070a0" }}>◎</span>
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs hover:text-white transition-colors"
              style={{ color: "#7070a0" }}>✕</button>
          )}
        </div>
        {q.length >= 2 && (
          <p className="text-xs mt-2 text-center" style={{ color: "#555580" }}>
            {skuMatches.length + freeItems.length} results for &ldquo;{q}&rdquo;
            {skuMatches.length > 0 && ` · ${skuMatches.length} product-level matches`}
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
                    <span>{p.brand}</span>
                    <span>·</span>
                    <span>{p.priceRange}</span>
                    <span>·</span>
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

      {/* Filter bar — hidden during search */}
      {q.length < 2 && (
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
            {s.label}
          </button>
        ))}
      </div>
      )}

      {/* Category grid — free items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {freeItems.map((cat) => {
          const sig = SIGNAL_CONFIG[cat.sellerSignal];
          const maxSov = cat.topBrands[0].sov;
          const products = PRODUCT_DATA[cat.id] ?? [];
          const isExpanded = expanded === cat.id;

          return (
            <div
              key={cat.id}
              className="rounded-xl p-5 space-y-4 flex flex-col"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              {/* Title */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-sm">{cat.category}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#7070a0" }}>{cat.parentSection}</div>
                </div>
                <div className="text-xs font-bold shrink-0" style={{ color: TREND_COLOR[cat.trend] }}>
                  {TREND_ICON[cat.trend]} {cat.trendPts} pts
                </div>
              </div>

              {/* Signal + platforms */}
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: sig.bg, color: sig.color }}>
                  {sig.label}
                </div>
                {cat.platforms.map((p) => {
                  const ps = PLATFORM_STYLE[p];
                  return (
                    <span key={p} className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: ps.bg, color: ps.color }}>
                      {ps.label}
                    </span>
                  );
                })}
              </div>

              {/* SOV bars */}
              <div className="space-y-2">
                {cat.topBrands.map((b) => (
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

              {/* Notes */}
              <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{cat.sellerNote}</p>
              {cat.platformNote && (
                <p className="text-xs leading-relaxed" style={{ color: "#555580", fontStyle: "italic" }}>
                  ↳ {cat.platformNote}
                </p>
              )}

              {/* Product drill-down */}
              {HAS_PRODUCT_DATA.has(cat.id) ? (
                <div>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : cat.id)}
                    className="text-xs font-medium transition-opacity hover:opacity-70 flex items-center gap-1"
                    style={{ color: "#ff6b35" }}
                  >
                    {isExpanded
                      ? "▲ Hide products"
                      : `▼ See ${products.length} products AI recommends`}
                  </button>
                  {isExpanded && (
                    <div className="mt-3 space-y-2 border-t pt-3" style={{ borderColor: "#1e1e30" }}>
                      <div className="text-xs font-semibold uppercase tracking-widest mb-2"
                        style={{ color: "#555580" }}>
                        Products cited by AI (out of 100 queries)
                      </div>
                      {products.map((p) => (
                        <div key={p.name} className="rounded-lg p-3 space-y-1.5"
                          style={{ background: "#0a0a14", border: "1px solid #1e1e30" }}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-xs font-semibold" style={{ color: "#f0f0f8" }}>{p.name}</div>
                              <div className="text-xs" style={{ color: "#555580" }}>{p.brand} · {p.priceRange}</div>
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
                </div>
              ) : (
                <Link href="/signup"
                  className="text-xs transition-opacity hover:opacity-70 flex items-center gap-1"
                  style={{ color: "#3a3a5c" }}>
                  ▼ Sign up to see product-level AI mentions →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Locked categories — Kalodata style */}
      {lockedItems.length > 0 && (
        <div className="relative">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            style={{ filter: "blur(3px)", pointerEvents: "none", userSelect: "none", opacity: 0.35 }}
          >
            {lockedItems.map((cat) => (
              <div key={cat.id} className="rounded-xl p-5 space-y-4"
                style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-sm">{cat.category}</div>
                    <div className="text-xs" style={{ color: "#7070a0" }}>{cat.parentSection}</div>
                  </div>
                  <div className="text-xs font-bold" style={{ color: TREND_COLOR[cat.trend] }}>
                    {TREND_ICON[cat.trend]} {cat.trendPts} pts
                  </div>
                </div>
                <div className="h-5 rounded" style={{ background: "#25253f", width: "45%" }} />
                {cat.topBrands.map((b) => (
                  <div key={b.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: "#f0f0f8" }}>{b.name}</span>
                      <span style={{ color: "#7070a0" }}>{b.sov}% SOV</span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: "#ff6b35", width: `${b.sov}%` }} />
                  </div>
                ))}
                <div className="h-10 rounded" style={{ background: "#25253f", width: "80%" }} />
              </div>
            ))}
          </div>

          {/* Unlock CTA overlay */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl"
            style={{ background: "linear-gradient(to top, #090910 50%, rgba(9,9,16,0.85) 100%)" }}
          >
            <div className="text-center space-y-2 px-6 max-w-sm">
              <div className="text-sm font-bold" style={{ color: "#f0f0f8" }}>
                {lockedItems.length} more categories — including TikTok Trending &amp; SE Asia signals
              </div>
              <p className="text-xs" style={{ color: "#7070a0" }}>
                Plus product-level AI mention data: which exact products buyers are being recommended, with AI context and mention frequency.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <Link href="/signup"
                className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
                style={{ background: "#ff6b35", color: "#fff" }}>
                Sign up free →
              </Link>
              <Link href="/pricing"
                className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
                style={{ border: "1px solid #25253f", color: "#7070a0" }}>
                View pricing
              </Link>
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
          <div><span style={{ color: "#f5a623" }}>GEO Score 30–49</span> = moderate AI presence</div>
          <div><span style={{ color: "#ff4d6d" }}>GEO Score ≥ 50</span> = weak AI visibility — entry opportunity</div>
          <div><span style={{ color: "#f5a623" }}>X/100</span> = product cited in X out of 100 AI queries in this category</div>
          <div className="pt-1">SOV = Share of Voice — % of AI mentions captured by brand in category</div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl p-8 text-center space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <p className="font-semibold">Is your brand on any of these lists?</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          Run a free audit to see your GEO Score, SOV, and which specific AI queries mention you.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/signup"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}>
            Run Free Audit →
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
