export interface DemoBrand {
  name: string;
  category: string;
  arrs: number;
  weighted_sov: number;
  sov_high: number;
  trend: "up" | "down" | "stable";
  trendDelta: string;
  lastRun: string;
  competitors: string[];
  // Topify-inspired metrics
  geo_score: number;          // 0–100 composite GEO score
  citation_rate: number;      // % of AI responses that cite a source
  sentiment: { positive: number; neutral: number; negative: number };
  by_model: { chatgpt: number; claude: number; perplexity: number }; // weighted SOV per model
}

export interface DemoCompany {
  slug: string;
  name: string;
  plan: string;
  planColor: string;
  avgArrs: number;
  brandsImproving: number;
  nextScheduledRun: string;
  brands: DemoBrand[];
}

export type ContentStatus = "draft" | "published" | "measuring";

export interface ContentBrief {
  id: string;
  title: string;
  targetKeyword: string;
  aiFormat: string;
  status: ContentStatus;
  brand: string;
  dueDate: string;
}

export interface CitationTarget {
  id: string;
  publication: string;
  domainAuthority: number;
  relevance: "high" | "medium";
  status: "not started" | "outreach sent" | "in negotiation" | "published";
  targetBrands: string[];
  notes: string;
}

export interface OKR {
  id: string;
  objective: string;
  keyResult: string;
  current: number;
  target: number;
  startVal: number; // original value (for lower-is-better OKRs)
  unit: string;
  lowerIsBetter: boolean;
  dueDate: string;
  status: "on track" | "at risk" | "achieved";
}

export type ActionPriority = "urgent" | "high" | "medium";

export interface NextAction {
  id: string;
  title: string;
  description: string;
  priority: ActionPriority;
  assignee: string;
  dueDate: string;
  relatedBrand: string;
  done: boolean;
}

export interface ExecutionPlaybook {
  contentBriefs: ContentBrief[];
  citationTargets: CitationTarget[];
  okrs: OKR[];
  nextActions: NextAction[];
}

// ── Seed Data ─────────────────────────────────────────────────────────────────

export const DEMO_COMPANIES: Record<string, DemoCompany> = {
  "techvision-pro": {
    slug: "techvision-pro",
    name: "TechVision Pro",
    plan: "Execution Tier",
    planColor: "#f5a623",
    avgArrs: 38,
    brandsImproving: 2,
    nextScheduledRun: "2026-03-03T09:00:00Z",
    brands: [
      {
        name: "VoltEdge",
        category: "Portable Power Stations",
        arrs: 42,
        weighted_sov: 18.4,
        sov_high: 22.1,
        trend: "up",
        trendDelta: "+4.2 pts this month",
        lastRun: "2026-02-24T08:00:00Z",
        competitors: ["Jackery", "EcoFlow", "Bluetti"],
        geo_score: 64,
        citation_rate: 41,
        sentiment: { positive: 58, neutral: 31, negative: 11 },
        by_model: { chatgpt: 21.3, claude: 16.8, perplexity: 17.1 },
      },
      {
        name: "LumaPulse",
        category: "Smart Home Devices",
        arrs: 61,
        weighted_sov: 9.7,
        sov_high: 7.3,
        trend: "down",
        trendDelta: "−2.1 pts this month",
        lastRun: "2026-02-24T08:00:00Z",
        competitors: ["Philips Hue", "LIFX", "Nanoleaf"],
        geo_score: 31,
        citation_rate: 18,
        sentiment: { positive: 34, neutral: 41, negative: 25 },
        by_model: { chatgpt: 11.2, claude: 8.4, perplexity: 9.5 },
      },
      {
        name: "ChargeFast",
        category: "USB-C Chargers",
        arrs: 11,
        weighted_sov: 31.8,
        sov_high: 38.5,
        trend: "up",
        trendDelta: "+7.9 pts this month",
        lastRun: "2026-02-24T08:00:00Z",
        competitors: ["Anker", "Belkin", "Spigen"],
        geo_score: 82,
        citation_rate: 67,
        sentiment: { positive: 79, neutral: 17, negative: 4 },
        by_model: { chatgpt: 34.2, claude: 29.7, perplexity: 31.5 },
      },
    ],
  },
};

export const DEMO_PLAYBOOKS: Record<string, ExecutionPlaybook> = {
  "techvision-pro": {
    contentBriefs: [
      {
        id: "cb-1",
        title: "VoltEdge vs Jackery 1000: Which Portable Power Station Wins in 2026?",
        targetKeyword: "best portable power station comparison",
        aiFormat: "Comparison listicle with spec table",
        status: "published",
        brand: "VoltEdge",
        dueDate: "2026-02-10",
      },
      {
        id: "cb-2",
        title: "How to Choose a Portable Power Station for Camping (2026 Buyer's Guide)",
        targetKeyword: "portable power station camping guide",
        aiFormat: "Long-form buyer's guide with FAQ",
        status: "measuring",
        brand: "VoltEdge",
        dueDate: "2026-02-17",
      },
      {
        id: "cb-3",
        title: "VoltEdge 500: Best-in-Class for Weekend Overlanders",
        targetKeyword: "best power station for overlanding",
        aiFormat: "Use-case narrative + specs",
        status: "draft",
        brand: "VoltEdge",
        dueDate: "2026-03-05",
      },
      {
        id: "cb-4",
        title: "Smart Lights That Actually Work: LumaPulse Honest Review",
        targetKeyword: "best smart home lights review",
        aiFormat: "Review article + setup tutorial",
        status: "draft",
        brand: "LumaPulse",
        dueDate: "2026-03-08",
      },
      {
        id: "cb-5",
        title: "ChargeFast 140W GaN Charger: Why It's the Top Pick for MacBook Users",
        targetKeyword: "best USB-C charger for MacBook",
        aiFormat: "Product spotlight + benchmark data",
        status: "published",
        brand: "ChargeFast",
        dueDate: "2026-01-28",
      },
      {
        id: "cb-6",
        title: "GaN vs Silicon: Which USB-C Charger Technology Should You Buy?",
        targetKeyword: "GaN charger vs silicon charger explained",
        aiFormat: "Educational explainer + recommendation",
        status: "measuring",
        brand: "ChargeFast",
        dueDate: "2026-02-14",
      },
    ],

    citationTargets: [
      {
        id: "ct-1",
        publication: "Wirecutter / NYT",
        domainAuthority: 91,
        relevance: "high",
        status: "outreach sent",
        targetBrands: ["VoltEdge", "ChargeFast"],
        notes: "Editor covers power & charging. Sent press kit 2026-02-20.",
      },
      {
        id: "ct-2",
        publication: "Tom's Guide",
        domainAuthority: 87,
        relevance: "high",
        status: "in negotiation",
        targetBrands: ["VoltEdge"],
        notes: "Review unit shipped. Follow up due 2026-03-01.",
      },
      {
        id: "ct-3",
        publication: "PCMag",
        domainAuthority: 85,
        relevance: "high",
        status: "published",
        targetBrands: ["ChargeFast"],
        notes: "ChargeFast 140W named 'Editor's Choice' Feb 2026.",
      },
      {
        id: "ct-4",
        publication: "TechRadar",
        domainAuthority: 82,
        relevance: "high",
        status: "not started",
        targetBrands: ["LumaPulse"],
        notes: "Smart home roundup published quarterly. Next one in April.",
      },
      {
        id: "ct-5",
        publication: "CNET",
        domainAuthority: 89,
        relevance: "high",
        status: "outreach sent",
        targetBrands: ["VoltEdge", "LumaPulse"],
        notes: "Reached out to two editors. No response yet.",
      },
      {
        id: "ct-6",
        publication: "Outdoor Gear Lab",
        domainAuthority: 73,
        relevance: "medium",
        status: "in negotiation",
        targetBrands: ["VoltEdge"],
        notes: "Perfect audience for camping/overlanding use case.",
      },
      {
        id: "ct-7",
        publication: "Rtings.com",
        domainAuthority: 76,
        relevance: "medium",
        status: "not started",
        targetBrands: ["LumaPulse"],
        notes: "Adding smart lights category in Q2 2026.",
      },
      {
        id: "ct-8",
        publication: "AndroidCentral",
        domainAuthority: 80,
        relevance: "medium",
        status: "published",
        targetBrands: ["ChargeFast"],
        notes: "Featured in 'Best USB-C Chargers' roundup Jan 2026.",
      },
    ],

    okrs: [
      {
        id: "okr-1",
        objective: "Dominate USB-C Charger category in AI recommendations",
        keyResult: "ChargeFast reaches 45% weighted SOV in USB-C Chargers",
        current: 31.8,
        target: 45,
        startVal: 23.9,
        unit: "% SOV",
        lowerIsBetter: false,
        dueDate: "2026-03-31",
        status: "on track",
      },
      {
        id: "okr-2",
        objective: "Rescue LumaPulse AI visibility",
        keyResult: "LumaPulse ARRS score drops below 40 (from 61)",
        current: 61,
        target: 40,
        startVal: 61,
        unit: "ARRS",
        lowerIsBetter: true,
        dueDate: "2026-03-31",
        status: "at risk",
      },
      {
        id: "okr-3",
        objective: "Establish VoltEdge as the go-to camping power brand",
        keyResult: "3 top-10 DA publications cite VoltEdge in camping/overlanding content",
        current: 1,
        target: 3,
        startVal: 0,
        unit: "citations",
        lowerIsBetter: false,
        dueDate: "2026-03-31",
        status: "on track",
      },
    ],

    nextActions: [
      {
        id: "na-1",
        title: "Ship LumaPulse review unit to TechRadar",
        description: "TechRadar's smart home roundup is in April — get on their radar now.",
        priority: "urgent",
        assignee: "Marketing",
        dueDate: "2026-03-01",
        relatedBrand: "LumaPulse",
        done: false,
      },
      {
        id: "na-2",
        title: "Publish VoltEdge overlanding content brief (cb-3)",
        description: "Brief is drafted — needs final review and publish to official blog.",
        priority: "high",
        assignee: "Content",
        dueDate: "2026-03-05",
        relatedBrand: "VoltEdge",
        done: false,
      },
      {
        id: "na-3",
        title: "Follow up with Tom's Guide on VoltEdge review unit",
        description: "Unit shipped 2 weeks ago. Send a polite follow-up with updated spec sheet.",
        priority: "high",
        assignee: "PR",
        dueDate: "2026-03-01",
        relatedBrand: "VoltEdge",
        done: false,
      },
      {
        id: "na-4",
        title: "Add product FAQ schema to ChargeFast product pages",
        description: "AI models frequently cite FAQ-structured pages. 5 key questions identified.",
        priority: "high",
        assignee: "Engineering",
        dueDate: "2026-03-03",
        relatedBrand: "ChargeFast",
        done: true,
      },
      {
        id: "na-5",
        title: "Reach out to CNET smart home editor (LumaPulse)",
        description: "Follow up on the initial outreach. Offer a 30-min product demo call.",
        priority: "medium",
        assignee: "PR",
        dueDate: "2026-03-07",
        relatedBrand: "LumaPulse",
        done: false,
      },
    ],
  },
};
