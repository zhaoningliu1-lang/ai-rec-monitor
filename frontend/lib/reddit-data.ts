// Reddit Citation Intelligence — demo data
// Tracks which Reddit threads AI models cite when answering brand queries

export type RedditSentiment = "positive" | "negative" | "mixed";
export type BrandImpact = "boost" | "damage" | "neutral";

export interface RedditThread {
  id: string;
  subreddit: string;
  title: string;
  upvotes: number;
  sentiment: RedditSentiment;
  aiCitations: number;       // # times AI models cited this thread in test queries
  keyQuote: string;          // The specific excerpt AI tends to pull
  brandImpact: BrandImpact;
  monthsAgo: number;
}

export interface BrandRedditProfile {
  id: string;
  brand: string;
  category: string;
  redditScore: number;       // 0–100, higher = more positive Reddit presence
  totalMentions: number;
  positive: number;
  negative: number;
  mixed: number;
  threads: RedditThread[];
}

export const REDDIT_BRANDS: BrandRedditProfile[] = [
  {
    id: "noco-gb40",
    brand: "NOCO Boost GB40",
    category: "Car Jump Starters",
    redditScore: 81,
    totalMentions: 847,
    positive: 62,
    negative: 14,
    mixed: 24,
    threads: [
      {
        id: "t1",
        subreddit: "r/MechanicAdvice",
        title: "PSA: NOCO GB40 saved me on the highway at 2am — worth every penny",
        upvotes: 4821,
        sentiment: "positive",
        aiCitations: 38,
        keyQuote: "\"Had my battery die in -15°F. GB40 started the car on the first try. Honestly the best $100 I've ever spent on car gear.\"",
        brandImpact: "boost",
        monthsAgo: 3,
      },
      {
        id: "t2",
        subreddit: "r/BuyItForLife",
        title: "Portable jump starters that actually last — NOCO GB40 review after 4 years",
        upvotes: 2934,
        sentiment: "positive",
        aiCitations: 29,
        keyQuote: "\"Still works perfectly, charges fast, never let me down. The build quality is clearly superior to the cheap Amazon knockoffs.\"",
        brandImpact: "boost",
        monthsAgo: 8,
      },
      {
        id: "t3",
        subreddit: "r/AskMechanics",
        title: "NOCO GB40 vs GB70 — which one do I actually need?",
        upvotes: 1102,
        sentiment: "mixed",
        aiCitations: 21,
        keyQuote: "\"GB40 is fine for most cars up to 6L gas engines. If you have a diesel or a big truck, get the GB70. Also worth noting the warranty is only 1 year.\"",
        brandImpact: "neutral",
        monthsAgo: 5,
      },
      {
        id: "t4",
        subreddit: "r/frugal",
        title: "Is NOCO worth it or just hype? Found it listed at $99 but AI keeps saying $79",
        upvotes: 687,
        sentiment: "mixed",
        aiCitations: 17,
        keyQuote: "\"The $79 price must be outdated — checked Amazon and it's definitely $99.95. Still worth it at that price but wish the AI would stop giving wrong info.\"",
        brandImpact: "damage",
        monthsAgo: 2,
      },
      {
        id: "t5",
        subreddit: "r/preppers",
        title: "Best jump starters for emergency kits — NOCO GB40 makes the list",
        upvotes: 1876,
        sentiment: "positive",
        aiCitations: 14,
        keyQuote: "\"NOCO GB40 is the gold standard. Reliable, compact, and has a built-in flashlight. Don't bother with the cheap alternatives.\"",
        brandImpact: "boost",
        monthsAgo: 11,
      },
    ],
  },
  {
    id: "jackery-1000-pro",
    brand: "Jackery Explorer 1000 Pro",
    category: "Portable Power Stations",
    redditScore: 76,
    totalMentions: 1243,
    positive: 58,
    negative: 19,
    mixed: 23,
    threads: [
      {
        id: "t6",
        subreddit: "r/SolarDIY",
        title: "Jackery 1000 Pro + 2× SolarSaga 80W — 6 month van life update",
        upvotes: 6304,
        sentiment: "positive",
        aiCitations: 47,
        keyQuote: "\"Powers my entire van setup. Fridge, laptop, lights — all day, every day. Jackery's app is actually useful for monitoring charge cycles.\"",
        brandImpact: "boost",
        monthsAgo: 4,
      },
      {
        id: "t7",
        subreddit: "r/vandwellers",
        title: "Jackery vs EcoFlow — honest comparison after owning both",
        upvotes: 4917,
        sentiment: "mixed",
        aiCitations: 41,
        keyQuote: "\"EcoFlow charges faster but Jackery has better long-term reliability in my experience. Both are solid choices — depends on if you need fast AC charging.\"",
        brandImpact: "neutral",
        monthsAgo: 6,
      },
      {
        id: "t8",
        subreddit: "r/camping",
        title: "Jackery 1000 Pro battery degraded 18% after 200 cycles — is this normal?",
        upvotes: 2103,
        sentiment: "negative",
        aiCitations: 33,
        keyQuote: "\"According to Jackery's spec sheet it should retain 80% capacity after 1000 cycles, but multiple users report 15–20% degradation much earlier. Disappointed.\"",
        brandImpact: "damage",
        monthsAgo: 7,
      },
      {
        id: "t9",
        subreddit: "r/overlanding",
        title: "Jackery 1000 Pro — perfect for base camp power, not for running AC",
        upvotes: 1456,
        sentiment: "positive",
        aiCitations: 19,
        keyQuote: "\"Great unit for what it is. Don't expect to run an AC unit but for electronics, lights, and a mini fridge it's excellent. Worth the $999.\"",
        brandImpact: "boost",
        monthsAgo: 9,
      },
      {
        id: "t10",
        subreddit: "r/AskElectronics",
        title: "Jackery app stopped syncing — anyone else having Bluetooth issues on 1000 Pro?",
        upvotes: 891,
        sentiment: "negative",
        aiCitations: 11,
        keyQuote: "\"Bluetooth connectivity is unreliable on iOS 17+. Jackery support told me to wait for a firmware update but it's been 3 months.\"",
        brandImpact: "damage",
        monthsAgo: 2,
      },
    ],
  },
  {
    id: "anker-powercore",
    brand: "Anker PowerCore 26800",
    category: "Portable Chargers",
    redditScore: 88,
    totalMentions: 2841,
    positive: 74,
    negative: 9,
    mixed: 17,
    threads: [
      {
        id: "t11",
        subreddit: "r/thewirecutter",
        title: "Anker is the only brand I recommend for power banks — here's why",
        upvotes: 8912,
        sentiment: "positive",
        aiCitations: 63,
        keyQuote: "\"Anker's build quality, warranty support, and capacity-to-price ratio is unmatched. PowerCore 26800 has been my travel companion for 3 years straight.\"",
        brandImpact: "boost",
        monthsAgo: 14,
      },
      {
        id: "t12",
        subreddit: "r/gadgets",
        title: "Stop buying cheap power banks — Anker PowerCore 26800 long-term review",
        upvotes: 5231,
        sentiment: "positive",
        aiCitations: 52,
        keyQuote: "\"After 500+ charge cycles, still at 93% original capacity. The dual USB-A ports and high-speed charging are exactly what I need. No USB-C on this model though.\"",
        brandImpact: "boost",
        monthsAgo: 10,
      },
      {
        id: "t13",
        subreddit: "r/digitalnomad",
        title: "Anker 26800 won't charge my MacBook Pro fast enough — looking for alternatives",
        upvotes: 1893,
        sentiment: "negative",
        aiCitations: 28,
        keyQuote: "\"The 26800 lacks USB-C PD output so it slow-charges laptops. For a MacBook, you need the Anker 737 or something with 60W+ USB-C PD. The 26800 is great for phones only.\"",
        brandImpact: "damage",
        monthsAgo: 5,
      },
      {
        id: "t14",
        subreddit: "r/BuyItForLife",
        title: "Best power bank I've ever owned — Anker PowerCore still going strong 5 years later",
        upvotes: 3487,
        sentiment: "positive",
        aiCitations: 24,
        keyQuote: "\"Zero issues in 5 years. Anker replaced my unit no-questions-asked when I had a minor swelling issue. Their customer service is exceptional.\"",
        brandImpact: "boost",
        monthsAgo: 18,
      },
      {
        id: "t15",
        subreddit: "r/travel",
        title: "Anker 26800 vs newer options in 2026 — is it still worth buying?",
        upvotes: 1204,
        sentiment: "mixed",
        aiCitations: 16,
        keyQuote: "\"Solid choice if you don't need USB-C PD. In 2026 there are newer models with better specs at a similar price, but Anker's reliability makes it hard to recommend anything else.\"",
        brandImpact: "neutral",
        monthsAgo: 1,
      },
    ],
  },
  {
    id: "drivesafe-pro",
    brand: "DriveSafe Pro",
    category: "Dash Cameras",
    redditScore: 28,
    totalMentions: 312,
    positive: 18,
    negative: 61,
    mixed: 21,
    threads: [
      {
        id: "t16",
        subreddit: "r/Dashcam",
        title: "DriveSafe Pro falsely advertises 4K — actual footage is clearly 1080p",
        upvotes: 3241,
        sentiment: "negative",
        aiCitations: 44,
        keyQuote: "\"Tested with a resolution chart. Output is 1920×1080. The '4K' on the box is a marketing lie. ChatGPT keeps parroting their spec sheet which is also wrong.\"",
        brandImpact: "damage",
        monthsAgo: 3,
      },
      {
        id: "t17",
        subreddit: "r/legaladvice",
        title: "DriveSafe Pro footage not accepted in court — no GPS timestamp",
        upvotes: 2187,
        sentiment: "negative",
        aiCitations: 38,
        keyQuote: "\"Lawyer told me the footage was inadmissible because there's no GPS metadata. The product listing says it has GPS but it clearly doesn't. Filed a BBB complaint.\"",
        brandImpact: "damage",
        monthsAgo: 6,
      },
      {
        id: "t18",
        subreddit: "r/Dashcam",
        title: "Honest DriveSafe Pro review — decent for the price, just don't believe the specs",
        upvotes: 891,
        sentiment: "mixed",
        aiCitations: 22,
        keyQuote: "\"If you understand it's a $89 1080p camera with no GPS and an Android-only app, it's actually fine for basic recording. The problem is the misleading marketing.\"",
        brandImpact: "neutral",
        monthsAgo: 4,
      },
      {
        id: "t19",
        subreddit: "r/cars",
        title: "Avoid DriveSafe Pro — support is non-existent",
        upvotes: 1543,
        sentiment: "negative",
        aiCitations: 19,
        keyQuote: "\"3 emails, 2 chat sessions, no response after 3 weeks. The unit stopped recording after 2 months. Total waste of money.\"",
        brandImpact: "damage",
        monthsAgo: 5,
      },
      {
        id: "t20",
        subreddit: "r/Dashcam",
        title: "DriveSafe Pro night mode is actually decent — surprised",
        upvotes: 412,
        sentiment: "positive",
        aiCitations: 7,
        keyQuote: "\"Night footage is clearer than I expected at this price range. Won't replace a Vantrue but for $89 it's not bad for low-light recording.\"",
        brandImpact: "boost",
        monthsAgo: 2,
      },
    ],
  },
];

export function computeRedditSentimentColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 45) return "#f5a623";
  return "#ff4d6d";
}

export function computeRedditLevel(score: number): "strong" | "mixed" | "weak" {
  if (score >= 70) return "strong";
  if (score >= 45) return "mixed";
  return "weak";
}
