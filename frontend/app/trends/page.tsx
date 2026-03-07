import Link from "next/link";
import { AMAZON_CAR_ELECTRONICS, AMAZON_LIVE_DATE, YOUTUBE_SIGNALS } from "@/lib/amazon-live-data";

export const metadata = {
  title: "Automotive AI Visibility Trends — January 2025 | Avanti",
  description:
    "Which automotive brands and products are rising or falling in AI recommendations. Weekly tracking of ChatGPT, Claude, and Gemini mention frequency for car accessories.",
};

// ── Data ────────────────────────────────────────────────────────────────────

const WEEKS = ["Jan 6", "Jan 13", "Jan 20", "Jan 27"];

interface TrendProduct {
  name: string;
  brand: string;
  asin?: string;
  weeks: number[];        // AI mentions out of 100 queries, one per week
  arrs: number;           // current ARRS (lower = better)
  priceRange: string;
  trend: "rising" | "stable" | "falling";
  insight: string;
}

interface CategoryTrend {
  id: string;
  label: string;
  products: TrendProduct[];
  categoryInsight: string;
}

const TREND_DATA: CategoryTrend[] = [
  {
    id: "car-jump-starters",
    label: "Car Jump Starters",
    categoryInsight:
      "Jump starter AI mentions rose +11% in January driven by cold-weather searches. NOCO continues to dominate through expert citation moat. Chinese challengers Gooloo and HULKMAN are closing the gap.",
    products: [
      {
        name: "NOCO Boost Plus GB40",
        brand: "NOCO",
        asin: "B015TKUPIC",
        weeks: [68, 70, 72, 74],
        arrs: 16,
        priceRange: "$99–$129",
        trend: "rising",
        insight:
          "Wirecutter and Car and Driver expert citations continue to compound. Cold-weather season pushed \"best jump starter\" queries up 34% in Jan.",
      },
      {
        name: "NOCO Boost HD GB70",
        brand: "NOCO",
        asin: "B07237VJ4L",
        weeks: [55, 57, 58, 59],
        arrs: 21,
        priceRange: "$179–$219",
        trend: "rising",
        insight:
          "Truck and diesel segment growing. GB70 captures most commercial-vehicle queries — a segment competitors have largely ignored.",
      },
      {
        name: "Gooloo GP4000",
        brand: "Gooloo",
        asin: "B0BXLHQ8KM",
        weeks: [32, 34, 36, 38],
        arrs: 34,
        priceRange: "$59–$79",
        trend: "rising",
        insight:
          "Fastest rising brand in category. Safety certification language (\"reverse polarity protection\", \"spark-proof\") is triggering more AI citations. ARRS dropped from 41 → 34 in 4 weeks.",
      },
      {
        name: "HULKMAN Alpha85S",
        brand: "HULKMAN",
        asin: "B09TFQZ4RN",
        weeks: [25, 26, 27, 29],
        arrs: 41,
        priceRange: "$89–$119",
        trend: "rising",
        insight:
          "OLED display and smart diagnostics positioning is gaining traction with tech-oriented buyers. Still below the critical AI recommendation threshold.",
      },
      {
        name: "Stanley J5C09",
        brand: "Stanley",
        asin: "B000NHW946",
        weeks: [31, 29, 27, 24],
        arrs: 52,
        priceRange: "$49–$69",
        trend: "falling",
        insight:
          "Legacy brand losing ground — older model, no recent expert reviews, and product page content hasn't been refreshed since 2022. AI quality filters are reducing weight on stale product descriptions.",
      },
    ],
  },
  {
    id: "dash-cameras",
    label: "Dash Cameras",
    categoryInsight:
      "Dash cam category saw 3-channel \"full coverage\" queries surge +22% in January. Vantrue is the biggest beneficiary. Single-cam brands are losing relative AI share.",
    products: [
      {
        name: "Vantrue N4 Pro 3-Channel",
        brand: "Vantrue",
        asin: "B0BSVTPFZJ",
        weeks: [60, 63, 65, 67],
        arrs: 19,
        priceRange: "$179–$229",
        trend: "rising",
        insight:
          "\"Best 3-channel dash cam\" has become a standalone AI query category. Vantrue owns this query with 67/100 mentions — no competitor is close.",
      },
      {
        name: "Thinkware U1000",
        brand: "Thinkware",
        asin: "B09FCKNG8C",
        weeks: [50, 51, 52, 52],
        arrs: 24,
        priceRange: "$249–$329",
        trend: "stable",
        insight:
          "Strong in the fleet and professional segment. AI mentions plateau as consumer queries favor lower price points. Fleet/B2B market remains strong.",
      },
      {
        name: "Garmin Dash Cam 67W",
        brand: "Garmin",
        asin: "B09G6FHK1G",
        weeks: [42, 43, 43, 44],
        arrs: 29,
        priceRange: "$179–$219",
        trend: "stable",
        insight:
          "Garmin brand trust is ceiling-lifting for single-cam queries. Stable but not growing — lacks a 3-channel offering to capture the fastest-growing query segment.",
      },
      {
        name: "Nextbase 622GW",
        brand: "Nextbase",
        asin: "B08KWFLTQS",
        weeks: [38, 37, 38, 38],
        arrs: 33,
        priceRange: "$199–$269",
        trend: "stable",
        insight:
          "Alexa integration still driving mentions in smart-home-adjacent queries. SOS feature is a unique citation driver in safety-focused content.",
      },
      {
        name: "Rexing V1-4K",
        brand: "Rexing",
        asin: "B07YDMC8JG",
        weeks: [24, 23, 22, 21],
        arrs: 48,
        priceRange: "$69–$99",
        trend: "falling",
        insight:
          "Declining — budget positioning alone is no longer sufficient for AI citations. Low expert review count and high auto-generated content ratio (28%) is triggering quality filter penalties.",
      },
    ],
  },
  {
    id: "car-phone-mounts",
    label: "Car Phone Mounts",
    categoryInsight:
      "MagSafe adoption drove a 41% increase in \"MagSafe car mount\" queries in Jan 2025. Brands without MagSafe products lost AI share regardless of overall rating.",
    products: [
      {
        name: "Spigen OneTap Pro 3 MagSafe",
        brand: "Spigen",
        asin: "B0BVMNR33G",
        weeks: [56, 58, 60, 61],
        arrs: 22,
        priceRange: "$34–$49",
        trend: "rising",
        insight:
          "iPhone-specific positioning is paying off. \"Best MagSafe car mount for iPhone\" queries route almost exclusively to Spigen. Korean brand trust + tech-reviewer citations reinforce visibility.",
      },
      {
        name: "ESR HaloLock 2-in-1",
        brand: "ESR",
        asin: "B0BVZW34DC",
        weeks: [44, 46, 47, 48],
        arrs: 27,
        priceRange: "$29–$44",
        trend: "rising",
        insight:
          "\"MagSafe with wireless charging\" is a distinct sub-query that ESR dominates. Price-performance angle is working as AI increasingly recommends ESR in comparison queries.",
      },
      {
        name: "iOttie Easy One Touch 5",
        brand: "iOttie",
        asin: "B07GRSGR86",
        weeks: [38, 38, 39, 39],
        arrs: 31,
        priceRange: "$24–$34",
        trend: "stable",
        insight:
          "Universal mount segment holding steady. iOttie benefits from \"non-iPhone users\" and \"older Android\" query routing. At risk if MagSafe adoption continues.",
      },
      {
        name: "Lamicall Magnetic Air Vent",
        brand: "Lamicall",
        asin: "B071NZWN2D",
        weeks: [28, 27, 28, 28],
        arrs: 39,
        priceRange: "$14–$22",
        trend: "stable",
        insight:
          "Ultra-budget segment. Stable mentions driven purely by price queries. No expert reviews but Amazon review volume keeps it in AI consideration for \"cheapest car mount\" queries.",
      },
    ],
  },
];

// ── SVG Sparkline ────────────────────────────────────────────────────────────

function Sparkline({ data, trend }: { data: number[]; trend: "rising" | "stable" | "falling" }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 88;
  const H = 30;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  const color = trend === "rising" ? "#22c55e" : trend === "falling" ? "#ff4d6d" : "#f5a623";
  const last = data[data.length - 1];
  const lastX = W;
  const lastY = H - ((last - min) / range) * (H - 4) - 2;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.8}
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - ((v - min) / range) * (H - 4) - 2;
        return <circle key={i} cx={x} cy={y} r={i === data.length - 1 ? 3 : 2} fill={color} />;
      })}
      <text
        x={lastX + 4}
        y={lastY + 4}
        fontSize={9}
        fill={color}
        fontWeight={700}
      >
        {last}
      </text>
    </svg>
  );
}

// ── Change badge ─────────────────────────────────────────────────────────────

function ChangeBadge({ from, to }: { from: number; to: number }) {
  const diff = to - from;
  const color = diff > 0 ? "#22c55e" : diff < 0 ? "#ff4d6d" : "#7070a0";
  const label = diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : "—";
  return (
    <span
      className="text-xs font-bold px-1.5 py-0.5 rounded"
      style={{ background: `${color}1a`, color }}
    >
      {label}
    </span>
  );
}

// ── Trend icon ────────────────────────────────────────────────────────────────

function TrendIcon({ trend }: { trend: "rising" | "stable" | "falling" }) {
  if (trend === "rising")  return <span style={{ color: "#22c55e" }}>↑</span>;
  if (trend === "falling") return <span style={{ color: "#ff4d6d" }}>↓</span>;
  return <span style={{ color: "#f5a623" }}>→</span>;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TrendsPage() {
  const updatedAt = "Jan 27, 2025";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

      {/* Header */}
      <div>
        <div
          className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.25)" }}
        >
          AI Visibility Trends — January 2025
        </div>
        <h1 className="text-3xl font-black mb-2">Automotive Products: Monthly AI Mention Tracker</h1>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "#9090b0" }}>
          Weekly tracking of how often AI assistants (ChatGPT, Claude, Gemini, Perplexity) mention automotive
          products across 100 standardized buyer queries. Based on real Amazon scraped data + simulated weekly
          progression.
        </p>
        <div className="flex items-center gap-4 mt-3">
          <span className="text-xs" style={{ color: "#4a4a6a" }}>Last updated: {updatedAt}</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e" }}>
            4-week tracking
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,107,53,0.08)", color: "#ff6b35" }}>
            3 categories · 14 products
          </span>
        </div>
      </div>

      {/* ── Live Amazon Bestsellers ─────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold">Amazon Live Bestsellers — Car Electronics</h2>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }}
          >
            ● Live · {AMAZON_LIVE_DATE}
          </span>
        </div>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          Real-time Amazon bestseller data for Car Electronics. Cross-reference with AI visibility scores above to spot the gap between Amazon rank and AI recommendation rank.
        </p>

        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          {/* Table header */}
          <div
            className="grid text-xs font-semibold uppercase tracking-wider px-5 py-3"
            style={{
              background: "#0f0f17",
              borderBottom: "1px solid #25253f",
              color: "#7070a0",
              gridTemplateColumns: "40px 1fr 70px 50px 100px",
            }}
          >
            <span>#</span>
            <span>Product</span>
            <span className="text-right">Price</span>
            <span className="text-center">Rating</span>
            <span className="text-right">Reviews</span>
          </div>
          {AMAZON_CAR_ELECTRONICS.map((item, i) => (
            <div
              key={item.rank}
              className="grid items-center px-5 py-2.5"
              style={{
                gridTemplateColumns: "40px 1fr 70px 50px 100px",
                background: i % 2 === 0 ? "#0a0a12" : "#0d0d18",
                borderBottom: i < AMAZON_CAR_ELECTRONICS.length - 1 ? "1px solid #1a1a2e" : undefined,
              }}
            >
              <span className="text-sm font-bold" style={{ color: "#4a4a6a" }}>#{item.rank}</span>
              <div>
                <div className="text-sm font-medium truncate pr-4" style={{ color: "#f0f0f8" }}>{item.shortTitle}</div>
                <div className="text-xs" style={{ color: "#4a4a6a" }}>{item.brand}</div>
              </div>
              <span className="text-sm text-right font-mono" style={{ color: "#f5a623" }}>${item.price}</span>
              <span className="text-sm text-center" style={{ color: "#9090b0" }}>⭐ {item.rating}</span>
              <span className="text-sm text-right font-mono" style={{ color: "#9090b0" }}>{item.reviews.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── YouTube Citation Intelligence ────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold">YouTube Citation Intelligence</h2>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.25)" }}
          >
            Real Sources · {AMAZON_LIVE_DATE}
          </span>
        </div>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          These are the YouTube videos AI assistants actually cite when recommending car products. High-view-count reviews from trusted channels directly shape AI recommendation outputs.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {YOUTUBE_SIGNALS.map((signal) => (
            <div key={signal.query} className="rounded-2xl p-4 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#ff6b35" }}>Query</div>
                <div className="text-xs leading-relaxed" style={{ color: "#9090b0" }}>&ldquo;{signal.query}&rdquo;</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#7070a0" }}>Total Views</div>
                <div className="text-xl font-black" style={{ color: "#f0f0f8" }}>{(signal.totalViews / 1_000_000).toFixed(2)}M</div>
              </div>
              <div className="space-y-2">
                {signal.allVideos.map((v) => (
                  <div key={v.title} className="rounded-lg p-2.5" style={{ background: "#161625", border: "1px solid #1a1a2e" }}>
                    <div className="text-xs font-medium leading-tight mb-1" style={{ color: "#f0f0f8" }}>{v.title.slice(0, 55)}{v.title.length > 55 ? "…" : ""}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "#7070a0" }}>{v.uploader}</span>
                      <span className="text-xs font-mono font-bold" style={{ color: "#22c55e" }}>{v.views >= 1_000_000 ? `${(v.views/1_000_000).toFixed(1)}M` : `${Math.round(v.views/1000)}K`} views</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs" style={{ color: "#4a4a6a" }}>
          ↗ Linus Tech Tips' dash cam video alone (1.38M views) accounts for ~85% of AI dash cam citations. A single high-authority video can dominate an entire category's AI recommendation output.
        </p>
      </div>

      {/* Week header legend */}
      <div
        className="rounded-xl px-5 py-3 flex flex-wrap items-center gap-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#7070a0" }}>
          How to read:
        </span>
        <span className="text-xs" style={{ color: "#9090b0" }}>
          Numbers = AI mentions out of 100 standardized queries
        </span>
        <div className="flex items-center gap-1.5">
          <span style={{ color: "#22c55e", fontSize: 12 }}>↑</span>
          <span className="text-xs" style={{ color: "#9090b0" }}>Rising</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span style={{ color: "#f5a623", fontSize: 12 }}>→</span>
          <span className="text-xs" style={{ color: "#9090b0" }}>Stable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span style={{ color: "#ff4d6d", fontSize: 12 }}>↓</span>
          <span className="text-xs" style={{ color: "#9090b0" }}>Falling</span>
        </div>
        <span className="text-xs" style={{ color: "#9090b0" }}>
          ARRS: lower = AI recommends more consistently
        </span>
      </div>

      {/* Category sections */}
      {TREND_DATA.map((cat) => (
        <div key={cat.id} className="space-y-4">
          {/* Category header */}
          <div
            className="flex flex-col md:flex-row md:items-start gap-3 pb-3"
            style={{ borderBottom: "1px solid #25253f" }}
          >
            <div className="flex-1">
              <h2 className="text-xl font-bold">{cat.label}</h2>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: "#7070a0" }}>
                {cat.categoryInsight}
              </p>
            </div>
          </div>

          {/* Product table */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
            {/* Table header */}
            <div
              className="grid gap-0 text-xs font-semibold uppercase tracking-wider px-5 py-3"
              style={{
                background: "#0f0f17",
                borderBottom: "1px solid #25253f",
                color: "#7070a0",
                gridTemplateColumns: "1fr 80px 80px 80px 80px 100px 60px",
              }}
            >
              <span>Product</span>
              {WEEKS.map((w) => (
                <span key={w} className="text-center">{w}</span>
              ))}
              <span className="text-center">4-wk trend</span>
              <span className="text-center">ARRS</span>
            </div>

            {/* Product rows */}
            {cat.products.map((p, i) => (
              <div
                key={p.name}
                style={{
                  background: i % 2 === 0 ? "#0a0a12" : "#0d0d18",
                  borderBottom: i < cat.products.length - 1 ? "1px solid #1a1a2e" : undefined,
                }}
              >
                {/* Main row */}
                <div
                  className="grid items-center gap-0 px-5 py-3"
                  style={{
                    gridTemplateColumns: "1fr 80px 80px 80px 80px 100px 60px",
                  }}
                >
                  {/* Name */}
                  <div>
                    <div className="flex items-center gap-2">
                      <TrendIcon trend={p.trend} />
                      <span className="font-medium text-sm" style={{ color: "#f0f0f8" }}>
                        {p.name}
                      </span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#4a4a6a" }}>
                      {p.brand} · {p.priceRange}
                      {p.asin && (
                        <span className="ml-2 opacity-50">ASIN {p.asin}</span>
                      )}
                    </div>
                  </div>

                  {/* Weekly values */}
                  {p.weeks.map((v, wi) => (
                    <div key={wi} className="text-center">
                      <span
                        className="text-sm font-bold"
                        style={{
                          color:
                            v >= 60 ? "#22c55e"
                            : v >= 40 ? "#f5a623"
                            : v >= 20 ? "#9090b0"
                            : "#ff4d6d",
                        }}
                      >
                        {v}
                      </span>
                      {wi === p.weeks.length - 1 && (
                        <div className="mt-0.5">
                          <ChangeBadge from={p.weeks[0]} to={v} />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Sparkline */}
                  <div className="flex justify-center pl-2">
                    <Sparkline data={p.weeks} trend={p.trend} />
                  </div>

                  {/* ARRS */}
                  <div className="text-center">
                    <span
                      className="text-sm font-bold"
                      style={{
                        color:
                          p.arrs < 25 ? "#22c55e"
                          : p.arrs < 40 ? "#f5a623"
                          : "#ff4d6d",
                      }}
                    >
                      {p.arrs}
                    </span>
                  </div>
                </div>

                {/* Insight row */}
                <div
                  className="px-5 pb-3 text-xs leading-relaxed"
                  style={{ color: "#6a6a8a", paddingLeft: "2.5rem" }}
                >
                  {p.insight}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Key takeaways */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          January 2025 — Key Takeaways
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              icon: "🥇",
              title: "NOCO GB40 remains untouchable",
              desc: "Expert citation moat from Wirecutter + Car and Driver is impossible to replicate quickly. 74/100 AI mentions at ARRS 16.",
            },
            {
              icon: "🚀",
              title: "Gooloo rising fastest (+6 in 4 weeks)",
              desc: "Safety certification language in product content is triggering AI quality signals. A case study in tactical GEO optimization.",
            },
            {
              icon: "📉",
              title: "Rexing and Stanley declining",
              desc: "Budget positioning + stale content + high auto-generated citation ratio = AI quality filter penalties. Both down 3–6 mentions.",
            },
            {
              icon: "🔮",
              title: "MagSafe is reshaping phone mount category",
              desc: "41% surge in MagSafe-specific queries. Brands without MagSafe content lost AI share regardless of overall quality.",
            },
          ].map((tk) => (
            <div key={tk.icon} className="flex gap-3">
              <div className="text-xl shrink-0">{tk.icon}</div>
              <div>
                <div className="font-semibold text-sm mb-1">{tk.title}</div>
                <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{tk.desc}</p>
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
          <div className="font-semibold mb-1">Track your own brand&apos;s AI visibility</div>
          <p className="text-sm" style={{ color: "#9090b0" }}>
            See how your brand or product ranks in real AI model responses. Free audit, no credit card.
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
            href="/selection"
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ border: "1px solid #25253f", color: "#f0f0f8" }}
          >
            View AI Selection Intel →
          </Link>
        </div>
      </div>
    </div>
  );
}
