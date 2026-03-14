// GEO Knowledge Base Action Plan — demo data
// Provides brand-specific action items to improve AI citation visibility

export type ActionPriority = "critical" | "high" | "medium";
export type ActionStatus = "todo" | "in_progress" | "done";
export type ActionCategory =
  | "content"
  | "reddit"
  | "schema"
  | "citations"
  | "social"
  | "reviews"
  | "tiktok"
  | "market_signals";

export interface GeoAction {
  id: string;
  category: ActionCategory;
  priority: ActionPriority;
  title: string;
  why: string;       // Why this matters for AI citation
  how: string;       // Concrete implementation step
  impact: string;    // Expected GEO score lift
  effort: "low" | "medium" | "high";
}

export interface BrandGeoProfile {
  id: string;
  brand: string;
  category: string;
  currentGeoScore: number;
  projectedGeoScore: number;  // if all critical + high actions done
  weaknesses: string[];       // What's holding down the GEO score
  actions: GeoAction[];
}

export const CATEGORY_CONFIG: Record<ActionCategory, { label: string; icon: string; color: string }> = {
  content:   { label: "Content",       icon: "📝", color: "#60a5fa" },
  reddit:    { label: "Reddit",         icon: "🧵", color: "#ff6b35" },
  schema:    { label: "Schema Markup",  icon: "🏷",  color: "#a78bfa" },
  citations: { label: "Citations",      icon: "🔗", color: "#22c55e" },
  social:    { label: "Social Proof",   icon: "⭐", color: "#f5a623" },
  reviews:        { label: "Reviews",        icon: "💬", color: "#e879f9" },
  tiktok:         { label: "TikTok",         icon: "🎵", color: "#25f4ee" },
  market_signals: { label: "Market Signal",  icon: "📊", color: "#a78bfa" },
};

export const GEO_BRANDS: BrandGeoProfile[] = [
  {
    id: "noco-gb40",
    brand: "NOCO Boost GB40",
    category: "Car Jump Starters",
    currentGeoScore: 74,
    projectedGeoScore: 91,
    weaknesses: [
      "Pricing hallucination not corrected on owned channels",
      "Diesel engine spec missing from FAQ pages",
      "No Reddit presence defending warranty facts",
    ],
    actions: [
      {
        id: "a1",
        category: "content",
        priority: "critical",
        title: "Publish a corrective FAQ: Pricing, Warranty & Compatibility",
        why: "AI models hallucinate $79 pricing and a 3-year warranty. A clearly structured FAQ with schema markup gives AI a trusted source to cite instead.",
        how: "Add a product FAQ section to your Amazon listing and product page: Q: What is the current price? A: $99.95. Q: What is the warranty? A: 1-year limited warranty. Q: Is it diesel-compatible? A: Up to 3.0L diesel engines.",
        impact: "+7 GEO score",
        effort: "low",
      },
      {
        id: "a2",
        category: "schema",
        priority: "critical",
        title: "Add Product Schema with authoritative pricing",
        why: "Without schema markup, AI scrapes your price from third-party listicles that are often outdated. Schema pins the correct price to your domain.",
        how: "Add JSON-LD Product schema to the GB40 product page with: @type: Product, name, offers.price: 99.95, offers.priceCurrency: USD, offers.availability: InStock.",
        impact: "+5 GEO score",
        effort: "medium",
      },
      {
        id: "a3",
        category: "reddit",
        priority: "high",
        title: "Post a 'PSA: Correct warranty info' thread on r/MechanicAdvice",
        why: "AI cites r/MechanicAdvice heavily. A pinned or highly upvoted correction thread directly competes with the misleading 3-year warranty claim AI repeats.",
        how: "Post as a NOCO community account: 'PSA for GB40 owners: Our warranty is 1 year (not 3 as some AI tools claim). Here's how to register and claim.' Get community upvotes.",
        impact: "+4 GEO score",
        effort: "low",
      },
      {
        id: "a4",
        category: "citations",
        priority: "high",
        title: "Get a Wirecutter / Consumer Reports mention",
        why: "AI models assign high trust to Wirecutter and Consumer Reports. A single mention elevates citation probability by 30–40% across all AI models.",
        how: "Send a review unit to Wirecutter (thewirecutter.com/about/press/) and follow up with their car accessories editor. Highlight the 124K+ Amazon reviews as a proof point.",
        impact: "+8 GEO score",
        effort: "high",
      },
      {
        id: "a5",
        category: "content",
        priority: "medium",
        title: "Create a comparison page: GB40 vs GB70 vs GB150",
        why: "Comparison queries are the #2 highest-intent question type. AI pulls from comparison pages when answering 'which NOCO should I buy.'",
        how: "Publish /compare on your product site with a table: model, peak amps, gas engine max, diesel engine max, price, weight. Include schema Table markup.",
        impact: "+3 GEO score",
        effort: "medium",
      },
      {
        id: "a6",
        category: "reviews",
        priority: "medium",
        title: "Surface the top 10 5-star reviews in a 'Customer Stories' section",
        why: "AI often quotes review content verbatim. Curating your best reviews as structured content (not just star ratings) increases the odds AI pulls positive quotes.",
        how: "Add a 'What customers say' section to your product page. Quote reviews that mention specific use cases: cold weather, diesel engines, long-term durability.",
        impact: "+2 GEO score",
        effort: "low",
      },
    ],
  },
  {
    id: "jackery-1000-pro",
    brand: "Jackery Explorer 1000 Pro",
    category: "Portable Power Stations",
    currentGeoScore: 62,
    projectedGeoScore: 85,
    weaknesses: [
      "Battery degradation thread on r/camping getting AI citations",
      "No authoritative comparison page (EcoFlow vs Jackery)",
      "Bluetooth bug thread has 2K upvotes and no official response",
    ],
    actions: [
      {
        id: "b1",
        category: "reddit",
        priority: "critical",
        title: "Officially respond to the battery degradation thread on r/camping",
        why: "This 2,100-upvote thread is being cited by AI 33 times per month. An official Jackery response with accurate cycle data will modify what AI quotes from the thread.",
        how: "Reply as u/JackeryOfficial: 'We've seen this thread and want to address it directly. The 1000 Pro is rated for 1,000 cycles to 80% capacity. If you're seeing earlier degradation, please contact support@jackery.com — we'll replace any unit that underperforms spec.'",
        impact: "+9 GEO score",
        effort: "low",
      },
      {
        id: "b2",
        category: "content",
        priority: "critical",
        title: "Publish 'Jackery vs EcoFlow: Honest Comparison' on your blog",
        why: "The most-cited Reddit thread comparing Jackery and EcoFlow is neutral/negative. Publishing an authoritative, fact-based comparison on your domain gives AI a higher-trust source to prefer.",
        how: "Write a 1,500-word comparison covering: charging speed, cycle life, app quality, warranty, price. Be honest about EcoFlow's faster charging — AI will trust honest comparisons more.",
        impact: "+7 GEO score",
        effort: "medium",
      },
      {
        id: "b3",
        category: "schema",
        priority: "high",
        title: "Add Product schema with accurate cycle life and warranty data",
        why: "AI hallucinations about Jackery specs originate from schema-less pages. Structured data pins correct values.",
        how: "Add JSON-LD to the 1000 Pro product page. Include: batteryLife: '1000 cycles to 80% capacity', warranty: '24-month limited warranty', weight, dimensions, wattage.",
        impact: "+5 GEO score",
        effort: "medium",
      },
      {
        id: "b4",
        category: "content",
        priority: "high",
        title: "Create a 'Van Life Setup Guide' featuring the 1000 Pro",
        why: "r/vandwellers and r/SolarDIY are your highest AI citation sources. Long-form setup guides get linked from those communities and cited by AI for months.",
        how: "Publish a guide on jackery.com/van-life-guide. Include wiring diagrams, solar panel pairing, real power consumption data. Submit to r/vandwellers and r/SolarDIY.",
        impact: "+4 GEO score",
        effort: "medium",
      },
      {
        id: "b5",
        category: "social",
        priority: "high",
        title: "Address the iOS Bluetooth bug publicly and publish a fix timeline",
        why: "The Bluetooth thread (891 upvotes) is being cited by AI as a product flaw. A public fix timeline transforms a negative citation into evidence of responsive support.",
        how: "Post in the original thread and publish a blog post: 'iOS Bluetooth Update — We Hear You.' Include the firmware version, release date, and interim workaround.",
        impact: "+3 GEO score",
        effort: "low",
      },
      {
        id: "b6",
        category: "citations",
        priority: "medium",
        title: "Pitch to OutdoorGearLab and CleanEnergyReviews",
        why: "Jackery has van life community coverage but lacks expert review site citations. OutdoorGearLab reviews are heavily cited by AI for outdoor gear queries.",
        how: "Contact OutdoorGearLab editorial team. Provide a 1000 Pro for extended testing. Highlight the 1,000-cycle rating and solar compatibility as test criteria.",
        impact: "+6 GEO score",
        effort: "high",
      },
    ],
  },
  {
    id: "anker-powercore",
    brand: "Anker PowerCore 26800",
    category: "Portable Chargers",
    currentGeoScore: 88,
    projectedGeoScore: 95,
    weaknesses: [
      "Laptop charging limitation not clearly communicated (no USB-C PD)",
      "2026 comparison pages showing newer competitors",
      "Missing FAQ on airline carry-on rules for 26800mAh",
    ],
    actions: [
      {
        id: "c1",
        category: "content",
        priority: "critical",
        title: "Add a 'Laptop Compatibility' warning to the product page",
        why: "The most-cited negative thread (1,893 upvotes, 28 AI citations) is about slow laptop charging. Proactively addressing this on your page changes the AI narrative from 'surprise limitation' to 'known spec.'",
        how: "Add to the product description: 'Note: The 26800 does not support USB-C Power Delivery. For MacBook or USB-C laptop charging, see Anker 737 or Anker Prime.' This turns a complaint into a helpful cross-sell.",
        impact: "+3 GEO score",
        effort: "low",
      },
      {
        id: "c2",
        category: "content",
        priority: "high",
        title: "Publish 'Best Power Bank in 2026: Anker 26800 vs Newer Rivals'",
        why: "Mixed Reddit threads questioning 26800's relevance in 2026 are gaining AI citations. A brand-published comparison anchors the narrative around the 26800's strengths.",
        how: "Publish a comparison post on the Anker blog. Highlight: 5-year longevity track record, 93%+ capacity retention, warranty replacement (the 5-year BuyItForLife thread is your strongest asset).",
        impact: "+2 GEO score",
        effort: "medium",
      },
      {
        id: "c3",
        category: "schema",
        priority: "high",
        title: "Add FAQ schema for airline carry-on rules",
        why: "A top travel query AI answers is 'can I bring a power bank on a plane.' At 26800mAh, the 26800 is within TSA limits — but AI often gives vague answers. Owning this query lifts GEO.",
        how: "Add FAQ schema: Q: Can I bring the Anker 26800 on an airplane? A: Yes. At 99Wh (below the 100Wh TSA limit), the Anker PowerCore 26800 is permitted in carry-on bags on most airlines.",
        impact: "+4 GEO score",
        effort: "low",
      },
      {
        id: "c4",
        category: "reviews",
        priority: "medium",
        title: "Feature the '5-year BuyItForLife' reviews on the product page",
        why: "The 3,487-upvote BuyItForLife thread is your strongest GEO asset. Pulling that narrative onto your product page creates a second, higher-authority source AI can cite.",
        how: "Add a 'Built to Last' section quoting verified long-term customer reviews (with permission). Mention: 5 years of use, 500+ charge cycles, warranty replacement. Use Review schema markup.",
        impact: "+1 GEO score",
        effort: "low",
      },
    ],
  },
  {
    id: "drivesafe-pro",
    brand: "DriveSafe Pro",
    category: "Dash Cameras",
    currentGeoScore: 18,
    projectedGeoScore: 54,
    weaknesses: [
      "4K claim on product page is false — Reddit exposed it with 3K upvotes",
      "No GPS creates a legal liability narrative AI repeats",
      "Zero authoritative review site citations",
      "Android-only app is undisclosed on product page",
    ],
    actions: [
      {
        id: "d1",
        category: "content",
        priority: "critical",
        title: "Immediately correct the 4K resolution claim on all listings",
        why: "The 3,241-upvote Reddit thread exposing the 4K falsification is your #1 GEO killer (44 AI citations/month). Correcting the spec on your product page is the only way to begin recovery.",
        how: "Update Amazon listing, product page, and all marketing: change '4K UHD' to '1080p Full HD.' Add a line: 'DriveSafe Pro records crisp 1920×1080 Full HD footage.' False spec claims also create legal exposure.",
        impact: "+12 GEO score",
        effort: "low",
      },
      {
        id: "d2",
        category: "content",
        priority: "critical",
        title: "Publish a transparent 'What DriveSafe Pro Does and Doesn't Do' page",
        why: "AI is citing negative threads because there's no authoritative source stating the honest spec sheet. Transparent spec pages are cited over Reddit complaints by AI — honesty is a GEO strategy.",
        how: "Create /drivesafe-pro/full-specs: Resolution: 1080p Full HD. GPS: Not included (use phone GPS app for route logging). App: Android only (iOS in development). Parking mode: Yes. Wide angle: 160°.",
        impact: "+8 GEO score",
        effort: "low",
      },
      {
        id: "d3",
        category: "reddit",
        priority: "critical",
        title: "Respond officially to the 4K thread and the legal advice thread",
        why: "Both high-upvote threads (3.2K and 2.1K) are shaping AI's output with no brand voice. A humble, corrective response changes the thread's net AI citation impact.",
        how: "Post as u/DriveSafeProOfficial on both threads. Acknowledge the error, apologize, announce the spec correction, and offer replacement units to anyone who purchased based on the 4K claim.",
        impact: "+7 GEO score",
        effort: "low",
      },
      {
        id: "d4",
        category: "citations",
        priority: "high",
        title: "Pitch to a mid-tier review site (DashCamTalk, The Drive)",
        why: "DriveSafe Pro has zero expert review citations. AI defaults to Reddit when no authoritative reviews exist. Even one positive review from a credible site breaks the negative loop.",
        how: "Contact DashCamTalk (dashcamtalk.com/forum) and The Drive editorial. Position DriveSafe Pro as a value option: honest 1080p, parking mode, $89 price. Don't oversell — reviewers will verify.",
        impact: "+6 GEO score",
        effort: "medium",
      },
      {
        id: "d5",
        category: "reviews",
        priority: "high",
        title: "Respond to and resolve all 1-star Amazon reviews",
        why: "AI uses Amazon review sentiment as a signal. A cluster of unresolved 1-star reviews on GPS and resolution issues reinforces the negative Reddit narrative.",
        how: "Respond to every 1-star review mentioning GPS or 4K: 'We've updated our listings to accurately reflect the 1080p resolution and no-GPS spec. We'd like to make this right — please email support@drivesafe.com.'",
        impact: "+3 GEO score",
        effort: "medium",
      },
    ],
  },
];

export const PRIORITY_CONFIG: Record<ActionPriority, { label: string; color: string; bg: string; border: string }> = {
  critical: { label: "Critical",  color: "#ff4d6d", bg: "rgba(255,77,109,0.10)", border: "rgba(255,77,109,0.25)" },
  high:     { label: "High",      color: "#f5a623", bg: "rgba(245,166,35,0.10)", border: "rgba(245,166,35,0.25)" },
  medium:   { label: "Medium",    color: "#60a5fa", bg: "rgba(96,165,250,0.10)", border: "rgba(96,165,250,0.25)" },
};

export const EFFORT_CONFIG: Record<"low" | "medium" | "high", { label: string; color: string }> = {
  low:    { label: "Low effort",    color: "#22c55e" },
  medium: { label: "Medium effort", color: "#f5a623" },
  high:   { label: "High effort",   color: "#ff4d6d" },
};
