export interface SampleQuery {
  query: string;
  brandPosition: number | null; // null = not mentioned
  snippet: string;              // what AI actually said about this brand
}

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
  by_model: { chatgpt: number; claude: number; perplexity: number; gemini: number };
  sampleQueries: SampleQuery[];
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
        by_model: { chatgpt: 21.3, claude: 16.8, perplexity: 17.1, gemini: 18.4 },
        sampleQueries: [
          {
            query: "What's the best portable power station for camping under $600?",
            brandPosition: 3,
            snippet: "VoltEdge 500 is a solid mid-range option — decent capacity and reliable LFP cells, though it trails EcoFlow on fast-charging speed.",
          },
          {
            query: "Best solar generator for van life 2026",
            brandPosition: null,
            snippet: "VoltEdge was not mentioned in this response. EcoFlow, Jackery, and Bluetti dominated.",
          },
        ],
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
        by_model: { chatgpt: 11.2, claude: 8.4, perplexity: 9.5, gemini: 10.1 },
        sampleQueries: [
          {
            query: "Best smart lights compatible with Apple HomeKit 2026",
            brandPosition: null,
            snippet: "LumaPulse was not mentioned. Philips Hue, Nanoleaf, and LIFX were recommended unanimously.",
          },
          {
            query: "Affordable smart home lighting for apartments",
            brandPosition: 4,
            snippet: "LumaPulse offers budget-friendly strips but setup reviews are mixed — pairing issues noted on Amazon.",
          },
        ],
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
        by_model: { chatgpt: 34.2, claude: 29.7, perplexity: 31.5, gemini: 32.1 },
        sampleQueries: [
          {
            query: "Best USB-C charger for MacBook Pro 2026",
            brandPosition: 1,
            snippet: "ChargeFast's 140W GaN charger is the top pick — compact, fast, and MFi-certified. Reviewers consistently praise the build quality.",
          },
          {
            query: "Fastest GaN charger under $50",
            brandPosition: 1,
            snippet: "ChargeFast 65W leads this category. ChatGPT cited PCMag's Editor's Choice award and the safety certifications as key differentiators.",
          },
        ],
      },
    ],
  },
};

// ── ProPower Global — Chinese Amazon FBA seller demo ──────────────────────────
DEMO_COMPANIES["propower-global"] = {
  slug: "propower-global",
  name: "ProPower Global",
  plan: "Growth Plan",
  planColor: "#22c55e",
  avgArrs: 54,
  brandsImproving: 1,
  nextScheduledRun: "2026-03-07T09:00:00Z",
  brands: [
    {
      name: "UltraVolt",
      category: "Power Banks",
      arrs: 34,
      weighted_sov: 22.1,
      sov_high: 26.3,
      trend: "up",
      trendDelta: "+3.8 pts this month",
      lastRun: "2026-02-28T08:00:00Z",
      competitors: ["Anker", "INIU", "Baseus"],
      geo_score: 71,
      citation_rate: 48,
      sentiment: { positive: 69, neutral: 24, negative: 7 },
      by_model: { chatgpt: 24.8, claude: 20.3, perplexity: 22.1, gemini: 21.2 },
      sampleQueries: [
        {
          query: "Best power bank for international travel 2026",
          brandPosition: 2,
          snippet: "UltraVolt's 20000mAh model stands out for airline compliance and dual USB-C PD ports — a top pick for frequent flyers.",
        },
        {
          query: "Most reliable portable charger under $40",
          brandPosition: 1,
          snippet: "UltraVolt consistently tops this category across ChatGPT and Perplexity — cited for 2-year warranty and CE/FCC certifications.",
        },
      ],
    },
    {
      name: "DriveSafe Pro",
      category: "Dash Cameras",
      arrs: 78,
      weighted_sov: 5.2,
      sov_high: 4.1,
      trend: "down",
      trendDelta: "−5.3 pts this month",
      lastRun: "2026-02-28T08:00:00Z",
      competitors: ["Vantrue", "Garmin Dash Cam", "Nextbase", "BlackVue"],
      geo_score: 18,
      citation_rate: 9,
      sentiment: { positive: 28, neutral: 38, negative: 34 },
      by_model: { chatgpt: 5.1, claude: 4.8, perplexity: 5.6, gemini: 5.3 },
      sampleQueries: [
        {
          query: "Best 4K dash cam with parking mode 2026",
          brandPosition: null,
          snippet: "DriveSafe Pro was not mentioned. Vantrue, Garmin, and Nextbase dominated. AI cited missing night-vision benchmarks and limited third-party reviews as gaps.",
        },
        {
          query: "Reliable dash cam under $100 for rideshare drivers",
          brandPosition: null,
          snippet: "DriveSafe Pro absent. Vantrue N2 Pro and Garmin 47 were top picks. No English-language review site has benchmarked DriveSafe Pro in this use case.",
        },
      ],
    },
    {
      name: "CrispAir",
      category: "Air Purifiers",
      arrs: 51,
      weighted_sov: 12.4,
      sov_high: 15.2,
      trend: "stable",
      trendDelta: "+0.3 pts this month",
      lastRun: "2026-02-28T08:00:00Z",
      competitors: ["Levoit", "Coway", "Winix"],
      geo_score: 49,
      citation_rate: 27,
      sentiment: { positive: 54, neutral: 33, negative: 13 },
      by_model: { chatgpt: 13.1, claude: 11.8, perplexity: 12.7, gemini: 12.0 },
      sampleQueries: [
        {
          query: "Best HEPA air purifier for bedroom under $150",
          brandPosition: 3,
          snippet: "CrispAir H12 is a budget-friendly option with true HEPA filtration. However, AI notes that CADR ratings are not independently verified compared to Levoit and Coway.",
        },
        {
          query: "Quietest air purifier for nursery 2026",
          brandPosition: null,
          snippet: "CrispAir not mentioned. Levoit Core 300 and Coway AP-1512HH were recommended for independently verified noise levels below 24dB.",
        },
      ],
    },
  ],
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

  "propower-global": {
    contentBriefs: [
      {
        id: "pp-cb-1",
        title: "UltraVolt 20000mAh Review: The Best Travel Power Bank of 2026?",
        targetKeyword: "best power bank for travel 2026",
        aiFormat: "Product review + travel use-case narrative",
        status: "published",
        brand: "UltraVolt",
        dueDate: "2026-02-15",
      },
      {
        id: "pp-cb-2",
        title: "UltraVolt vs Anker PowerCore: Which Should You Buy?",
        targetKeyword: "UltraVolt vs Anker power bank comparison",
        aiFormat: "Head-to-head comparison with spec table",
        status: "measuring",
        brand: "UltraVolt",
        dueDate: "2026-02-22",
      },
      {
        id: "pp-cb-3",
        title: "4K Dash Cam Showdown: DriveSafe Pro vs Vantrue N4 Pro",
        targetKeyword: "best 4K dash cam comparison 2026",
        aiFormat: "Comparison review with night-vision benchmark data",
        status: "draft",
        brand: "DriveSafe Pro",
        dueDate: "2026-03-10",
      },
      {
        id: "pp-cb-4",
        title: "DriveSafe Pro D3: Setup Guide for Rideshare Drivers (Uber/Lyft)",
        targetKeyword: "best dash cam for rideshare drivers",
        aiFormat: "How-to guide + driver use-case",
        status: "draft",
        brand: "DriveSafe Pro",
        dueDate: "2026-03-14",
      },
      {
        id: "pp-cb-5",
        title: "CrispAir vs Levoit Core 300: CADR and Noise Level Compared",
        targetKeyword: "CrispAir vs Levoit air purifier",
        aiFormat: "Data-driven comparison with CADR table",
        status: "draft",
        brand: "CrispAir",
        dueDate: "2026-03-12",
      },
    ],

    citationTargets: [
      {
        id: "pp-ct-1",
        publication: "Wirecutter / NYT",
        domainAuthority: 91,
        relevance: "high",
        status: "not started",
        targetBrands: ["UltraVolt"],
        notes: "Wirecutter's power bank guide was last updated Oct 2025. Pitch UltraVolt's airline compliance and warranty.",
      },
      {
        id: "pp-ct-2",
        publication: "Tom's Guide",
        domainAuthority: 87,
        relevance: "high",
        status: "outreach sent",
        targetBrands: ["UltraVolt", "DriveSafe Pro"],
        notes: "Sent product samples for power bank and dash cam roundups. Follow up Mar 5.",
      },
      {
        id: "pp-ct-3",
        publication: "DashCamTalk.com",
        domainAuthority: 64,
        relevance: "high",
        status: "in negotiation",
        targetBrands: ["DriveSafe Pro"],
        notes: "Niche but high AI citation rate. Forum threads rank in Perplexity results.",
      },
      {
        id: "pp-ct-4",
        publication: "Indoor Air Quality Association",
        domainAuthority: 58,
        relevance: "high",
        status: "not started",
        targetBrands: ["CrispAir"],
        notes: "AI models cite IAQA for HEPA filter standards. Getting CrispAir tested and listed here is high leverage.",
      },
      {
        id: "pp-ct-5",
        publication: "RTINGS.com",
        domainAuthority: 76,
        relevance: "high",
        status: "not started",
        targetBrands: ["CrispAir"],
        notes: "RTINGS recently added air purifier testing. Submit CrispAir for independent CADR measurement.",
      },
    ],

    okrs: [
      {
        id: "pp-okr-1",
        objective: "Make UltraVolt the #1 AI-recommended travel power bank",
        keyResult: "UltraVolt reaches 38% weighted SOV in Power Banks (from 22.1%)",
        current: 22.1,
        target: 38,
        startVal: 18.4,
        unit: "% SOV",
        lowerIsBetter: false,
        dueDate: "2026-04-30",
        status: "on track",
      },
      {
        id: "pp-okr-2",
        objective: "Fix DriveSafe Pro's AI invisibility before Q2 peak season",
        keyResult: "DriveSafe Pro ARRS drops below 50 (from 78)",
        current: 78,
        target: 50,
        startVal: 78,
        unit: "ARRS",
        lowerIsBetter: true,
        dueDate: "2026-04-30",
        status: "at risk",
      },
      {
        id: "pp-okr-3",
        objective: "Earn independent certification for CrispAir to unlock AI citations",
        keyResult: "CrispAir listed on RTINGS.com with verified CADR score",
        current: 0,
        target: 1,
        startVal: 0,
        unit: "listing",
        lowerIsBetter: false,
        dueDate: "2026-05-31",
        status: "on track",
      },
    ],

    nextActions: [
      {
        id: "pp-na-1",
        title: "Submit DriveSafe Pro to DashCamTalk forum for community review",
        description: "DashCamTalk threads appear in Perplexity results for dash cam queries. Community credibility = AI citations.",
        priority: "urgent",
        assignee: "Marketing",
        dueDate: "2026-03-05",
        relatedBrand: "DriveSafe Pro",
        done: false,
      },
      {
        id: "pp-na-2",
        title: "Publish UltraVolt vs Anker comparison (pp-cb-2)",
        description: "Content is measured — check if Perplexity is citing it yet. If not, add more spec data and FAQ schema.",
        priority: "high",
        assignee: "Content",
        dueDate: "2026-03-06",
        relatedBrand: "UltraVolt",
        done: false,
      },
      {
        id: "pp-na-3",
        title: "Register CrispAir for RTINGS air purifier testing program",
        description: "RTINGS accepts sample submissions. Independent CADR score is the #1 gap blocking AI citations.",
        priority: "high",
        assignee: "Product",
        dueDate: "2026-03-08",
        relatedBrand: "CrispAir",
        done: false,
      },
      {
        id: "pp-na-4",
        title: "Add English night-vision benchmark page for DriveSafe Pro D3",
        description: "No English benchmark data exists. AI models skip the brand because there's nothing to cite.",
        priority: "urgent",
        assignee: "Engineering",
        dueDate: "2026-03-07",
        relatedBrand: "DriveSafe Pro",
        done: false,
      },
    ],
  },
};
