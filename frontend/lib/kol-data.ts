// KOL Source Tracking — demo data
// Tracks which KOL / YouTube / influencer content AI models cite for brand queries

export type KolPlatform = "YouTube" | "TikTok" | "Instagram" | "Blog";
export type KolSentiment = "positive" | "negative" | "mixed";
export type KolTier = "mega" | "macro" | "micro";  // by subscriber count

export interface KolProfile {
  id: string;
  name: string;
  platform: KolPlatform;
  tier: KolTier;
  subscribers: number;    // total channel subscribers
  avgViews: number;       // average views per video
  niche: string;
  sentiment: KolSentiment;
  aiCitations: number;    // # times AI cited this creator for this brand
  keyVideo: {
    title: string;
    views: number;
    publishedMonthsAgo: number;
    verdict: string;      // The creator's bottom-line verdict on the brand
  };
  collab: boolean;        // Did this creator do a sponsored post?
  roi: "high" | "medium" | "low" | "negative"; // estimated GEO ROI if partnered
}

export interface BrandKolProfile {
  id: string;
  brand: string;
  category: string;
  kolScore: number;       // 0–100: how strong is the KOL backing for AI citation
  totalAiKolCitations: number;
  kols: KolProfile[];
}

export const PLATFORM_CONFIG: Record<KolPlatform, { icon: string; color: string }> = {
  YouTube:   { icon: "▶", color: "#ff4d6d" },
  TikTok:    { icon: "♪", color: "#e879f9" },
  Instagram: { icon: "◉", color: "#f5a623" },
  Blog:      { icon: "✍", color: "#60a5fa" },
};

export const TIER_CONFIG: Record<KolTier, { label: string; color: string; range: string }> = {
  mega:  { label: "Mega",  color: "#f5a623", range: "1M+" },
  macro: { label: "Macro", color: "#60a5fa", range: "100K–1M" },
  micro: { label: "Micro", color: "#22c55e", range: "10K–100K" },
};

export const ROI_CONFIG: Record<"high" | "medium" | "low" | "negative", { label: string; color: string }> = {
  high:     { label: "High ROI",     color: "#22c55e" },
  medium:   { label: "Medium ROI",   color: "#60a5fa" },
  low:      { label: "Low ROI",      color: "#f5a623" },
  negative: { label: "Avoid",        color: "#ff4d6d" },
};

export const KOL_BRANDS: BrandKolProfile[] = [
  {
    id: "noco-gb40",
    brand: "NOCO Boost GB40",
    category: "Car Jump Starters",
    kolScore: 79,
    totalAiKolCitations: 142,
    kols: [
      {
        id: "k1",
        name: "Project Farm",
        platform: "YouTube",
        tier: "mega",
        subscribers: 8200000,
        avgViews: 2400000,
        niche: "Product testing & comparisons",
        sentiment: "positive",
        aiCitations: 51,
        keyVideo: {
          title: "Don't Buy A Jump Starter Until You Watch This Review!",
          views: 11390000,
          publishedMonthsAgo: 18,
          verdict: "\"NOCO GB40 is the clear winner in our jump starter test — passed every cold-crank test.\"",
        },
        collab: false,
        roi: "high",
      },
      {
        id: "k2",
        name: "ChrisFix",
        platform: "YouTube",
        tier: "mega",
        subscribers: 9700000,
        avgViews: 3100000,
        niche: "Car repair & maintenance",
        sentiment: "positive",
        aiCitations: 38,
        keyVideo: {
          title: "How to Jump Start a Car (SAFELY!) — Best Jump Starters 2025",
          views: 4820000,
          publishedMonthsAgo: 12,
          verdict: "\"GB40 is my go-to recommendation for jump starters — reliable, safe, and worth the $99.\"",
        },
        collab: false,
        roi: "high",
      },
      {
        id: "k3",
        name: "Scotty Kilmer",
        platform: "YouTube",
        tier: "mega",
        subscribers: 5900000,
        avgViews: 890000,
        niche: "Car advice & reviews",
        sentiment: "mixed",
        aiCitations: 22,
        keyVideo: {
          title: "Best Portable Jump Starters (Don't Waste Your Money)",
          views: 1240000,
          publishedMonthsAgo: 9,
          verdict: "\"NOCO is good but overpriced. You can find comparable options for less.\"",
        },
        collab: false,
        roi: "low",
      },
      {
        id: "k4",
        name: "GarageGuide",
        platform: "YouTube",
        tier: "macro",
        subscribers: 420000,
        avgViews: 85000,
        niche: "Car accessories & tools",
        sentiment: "positive",
        aiCitations: 19,
        keyVideo: {
          title: "NOCO GB40 vs GB70 — Which One Do You Actually Need?",
          views: 312000,
          publishedMonthsAgo: 6,
          verdict: "\"GB40 is perfect for daily drivers. Diesel or truck? Go GB70. Clear winner at the price.\"",
        },
        collab: true,
        roi: "medium",
      },
      {
        id: "k5",
        name: "@carcare_tips",
        platform: "TikTok",
        tier: "macro",
        subscribers: 280000,
        avgViews: 140000,
        niche: "Car tips & hacks",
        sentiment: "positive",
        aiCitations: 12,
        keyVideo: {
          title: "This $99 device saved me from being stranded at 2am ✅",
          views: 892000,
          publishedMonthsAgo: 4,
          verdict: "\"NOCO GB40 — must have for every car. Game changer for dead batteries.\"",
        },
        collab: false,
        roi: "medium",
      },
    ],
  },
  {
    id: "jackery-1000-pro",
    brand: "Jackery Explorer 1000 Pro",
    category: "Portable Power Stations",
    kolScore: 71,
    totalAiKolCitations: 187,
    kols: [
      {
        id: "k6",
        name: "Van Life Sagas",
        platform: "YouTube",
        tier: "macro",
        subscribers: 680000,
        avgViews: 210000,
        niche: "Van life & travel",
        sentiment: "positive",
        aiCitations: 61,
        keyVideo: {
          title: "Our Jackery 1000 Pro Setup — 6 Months Living Off-Grid",
          views: 1840000,
          publishedMonthsAgo: 8,
          verdict: "\"Best power station for van life. The 1000W output handles everything we need.\"",
        },
        collab: true,
        roi: "high",
      },
      {
        id: "k7",
        name: "Hobotech",
        platform: "YouTube",
        tier: "macro",
        subscribers: 312000,
        avgViews: 95000,
        niche: "Power station deep-dives",
        sentiment: "mixed",
        aiCitations: 47,
        keyVideo: {
          title: "Jackery 1000 Pro vs EcoFlow Delta 2 — Full Technical Comparison",
          views: 728000,
          publishedMonthsAgo: 10,
          verdict: "\"Jackery wins on reliability, EcoFlow wins on charging speed. Depends what you prioritize.\"",
        },
        collab: false,
        roi: "medium",
      },
      {
        id: "k8",
        name: "Outdoor Gear Lab",
        platform: "Blog",
        tier: "macro",
        subscribers: 0,
        avgViews: 180000,
        niche: "Expert outdoor gear reviews",
        sentiment: "positive",
        aiCitations: 39,
        keyVideo: {
          title: "Best Portable Power Stations of 2026 — Tested & Ranked",
          views: 580000,
          publishedMonthsAgo: 3,
          verdict: "\"Jackery 1000 Pro earns our Editors' Choice for its balance of capacity, reliability, and value.\"",
        },
        collab: false,
        roi: "high",
      },
      {
        id: "k9",
        name: "Camping Tech Guy",
        platform: "YouTube",
        tier: "micro",
        subscribers: 74000,
        avgViews: 22000,
        niche: "Camping electronics",
        sentiment: "negative",
        aiCitations: 28,
        keyVideo: {
          title: "Jackery 1000 Pro Honest Review — The Battery Problem Nobody Talks About",
          views: 189000,
          publishedMonthsAgo: 7,
          verdict: "\"Battery degraded 18% after 200 cycles. Jackery claims 1000 cycles but I'm seeing different.\"",
        },
        collab: false,
        roi: "negative",
      },
      {
        id: "k10",
        name: "@solarvanlife",
        platform: "Instagram",
        tier: "micro",
        subscribers: 48000,
        avgViews: 12000,
        niche: "Solar van life",
        sentiment: "positive",
        aiCitations: 12,
        keyVideo: {
          title: "How I power my entire van with one Jackery 1000 Pro [setup tour]",
          views: 87000,
          publishedMonthsAgo: 5,
          verdict: "\"Powers my fridge, laptop, and lights all day. Couldn't do van life without it.\"",
        },
        collab: true,
        roi: "low",
      },
    ],
  },
  {
    id: "anker-powercore",
    brand: "Anker PowerCore 26800",
    category: "Portable Chargers",
    kolScore: 85,
    totalAiKolCitations: 231,
    kols: [
      {
        id: "k11",
        name: "Linus Tech Tips",
        platform: "YouTube",
        tier: "mega",
        subscribers: 16800000,
        avgViews: 2900000,
        niche: "Consumer tech reviews",
        sentiment: "positive",
        aiCitations: 74,
        keyVideo: {
          title: "Please Stop WASTING Money on CRAPPY Dashcams (and Power Banks)",
          views: 4210000,
          publishedMonthsAgo: 14,
          verdict: "\"Anker PowerCore is the benchmark. 5-year reliability data beats all competitors at this price.\"",
        },
        collab: false,
        roi: "high",
      },
      {
        id: "k12",
        name: "Wirecutter / NYT",
        platform: "Blog",
        tier: "mega",
        subscribers: 0,
        avgViews: 890000,
        niche: "Expert consumer product reviews",
        sentiment: "positive",
        aiCitations: 68,
        keyVideo: {
          title: "The Best Portable Charger (2026) — Our Expert Pick",
          views: 2100000,
          publishedMonthsAgo: 2,
          verdict: "\"Anker PowerCore 26800 is our top pick for most people. Proven reliability over 5+ years.\"",
        },
        collab: false,
        roi: "high",
      },
      {
        id: "k13",
        name: "Mrwhosetheboss",
        platform: "YouTube",
        tier: "mega",
        subscribers: 12300000,
        avgViews: 4200000,
        niche: "Smartphone & accessory reviews",
        sentiment: "mixed",
        aiCitations: 41,
        keyVideo: {
          title: "Every Power Bank Ranked (Is Anker Still the King?)",
          views: 3870000,
          publishedMonthsAgo: 5,
          verdict: "\"Anker is still great for phones but the 26800 lacks USB-C PD. In 2026 that's a notable gap.\"",
        },
        collab: false,
        roi: "medium",
      },
      {
        id: "k14",
        name: "Pack Hacker",
        platform: "Blog",
        tier: "macro",
        subscribers: 0,
        avgViews: 95000,
        niche: "Travel gear & packing",
        sentiment: "positive",
        aiCitations: 29,
        keyVideo: {
          title: "Best Travel Power Banks — Tested Across 50+ Countries",
          views: 410000,
          publishedMonthsAgo: 7,
          verdict: "\"Anker 26800 is our #1 travel power bank. TSA-compliant at 99Wh, holds 4+ phone charges.\"",
        },
        collab: false,
        roi: "high",
      },
      {
        id: "k15",
        name: "@techtravel_daily",
        platform: "TikTok",
        tier: "micro",
        subscribers: 92000,
        avgViews: 65000,
        niche: "Travel tech hacks",
        sentiment: "positive",
        aiCitations: 19,
        keyVideo: {
          title: "The power bank that's been in my bag for 5 years 🔋",
          views: 1240000,
          publishedMonthsAgo: 3,
          verdict: "\"Anker 26800 — still going strong. Never buy cheap power banks.\"",
        },
        collab: false,
        roi: "medium",
      },
    ],
  },
  {
    id: "drivesafe-pro",
    brand: "DriveSafe Pro",
    category: "Dash Cameras",
    kolScore: 22,
    totalAiKolCitations: 89,
    kols: [
      {
        id: "k16",
        name: "Vortex Radar",
        platform: "YouTube",
        tier: "macro",
        subscribers: 390000,
        avgViews: 78000,
        niche: "Dash cams & radar detectors",
        sentiment: "negative",
        aiCitations: 37,
        keyVideo: {
          title: "DriveSafe Pro Review — Marketing Lies Exposed",
          views: 412000,
          publishedMonthsAgo: 4,
          verdict: "\"Advertised as 4K, tested at 1080p. No GPS. Android-only. Save your money.\"",
        },
        collab: false,
        roi: "negative",
      },
      {
        id: "k17",
        name: "DashCamTalk Forum",
        platform: "Blog",
        tier: "macro",
        subscribers: 0,
        avgViews: 42000,
        niche: "Dash cam community & reviews",
        sentiment: "negative",
        aiCitations: 28,
        keyVideo: {
          title: "DriveSafe Pro Community Review Thread [Megathread]",
          views: 184000,
          publishedMonthsAgo: 6,
          verdict: "\"Community consensus: avoid. Resolution mislabeled. GPS not present despite listing claims.\"",
        },
        collab: false,
        roi: "negative",
      },
      {
        id: "k18",
        name: "Budget Dash Cams",
        platform: "YouTube",
        tier: "micro",
        subscribers: 31000,
        avgViews: 8500,
        niche: "Affordable dash cam reviews",
        sentiment: "mixed",
        aiCitations: 14,
        keyVideo: {
          title: "DriveSafe Pro — Best Budget Dash Cam Under $100?",
          views: 67000,
          publishedMonthsAgo: 5,
          verdict: "\"OK footage for the price if you know it's 1080p. Just ignore their marketing claims.\"",
        },
        collab: false,
        roi: "low",
      },
      {
        id: "k19",
        name: "@dashcam_reviews",
        platform: "TikTok",
        tier: "micro",
        subscribers: 28000,
        avgViews: 18000,
        niche: "Dash cam TikTok reviews",
        sentiment: "negative",
        aiCitations: 10,
        keyVideo: {
          title: "DriveSafe Pro: the dash cam that lied about 4K 🚗❌",
          views: 340000,
          publishedMonthsAgo: 3,
          verdict: "\"4K on the box, 1080p in real life. Don't fall for it.\"",
        },
        collab: false,
        roi: "negative",
      },
    ],
  },
];
