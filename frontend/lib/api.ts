const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

export interface PromptResultDetail {
  id: string;
  run_id: string;
  prompt_text: string;
  raw_response: string;
  brand_mentioned: boolean;
  brand_mention_position: number | null;
  competitors_data: Record<string, { mentioned: boolean; position: number | null }>;
  brand_sentiment: string;
  provider: string | null;
  intent_type: string | null;
  processed_at: string;
}

export interface CategoryEntry {
  category: string;
  brand_count: number;
}

export interface LeaderboardEntry {
  brand_name: string;
  weighted_sov: number;
  sov_high: number;
  sov_comparison: number;
  sov_info: number;
  arrs: number;
  mention_count: number;
  total_prompts: number;
  snapshot_at: string;
}

export type RunStatus = "queued" | "running" | "done" | "failed";

export interface Run {
  id: string;
  run_code: string | null;
  brand_name: string;
  competitor_names: string[];
  category: string;
  region: string;
  num_prompts: number;
  providers: string[];
  price_band: string | null;
  status: RunStatus;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  progress_total: number;
  progress_done: number;
  error_message: string | null;
}

export interface RunSnapshot {
  id: string;
  run_id: string;
  brand_name: string;
  sov_overall: number;
  sov_high: number;
  sov_comparison: number;
  sov_info: number;
  weighted_sov: number;
  arrs: number;
  mention_count: number;
  total_prompts: number;
  snapshot_at: string;
}

export interface RecommendationItem {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

export interface Recommendation {
  id: string;
  run_id: string;
  brand_name: string;
  items: RecommendationItem[];
  generated_at: string;
  model_used: string;
}

export interface Schedule {
  id: string;
  brand_name: string;
  competitor_names: string[];
  category: string;
  region: string;
  providers: string[];
  price_band: string | null;
  cron_expr: string;
  num_prompts: number;
  enabled: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  created_at: string;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${path}`);
  return res.json();
}

/** GET with optional Bearer token (reads from localStorage). */
async function getAuth<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("avanti_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, { cache: "no-store", headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${path}`);
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${path}`);
  return res.json();
}

async function postAuth<T>(path: string, body: unknown): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("avanti_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, { method: "POST", headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${path}`);
  return res.json();
}

async function patchAuth<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("avanti_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, { method: "PATCH", headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${path}`);
  return res.json();
}

async function delAuth(path: string): Promise<void> {
  const headers: Record<string, string> = {};
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("avanti_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, { method: "DELETE", headers });
  if (!res.ok && res.status !== 204) throw new Error(`${res.status}: ${path}`);
}

// Agent Growth Cycles
export type CycleStatus = "pending" | "monitoring" | "analyzing" | "strategizing" | "experimenting" | "completed" | "failed";

export interface AgentCycle {
  id: string;
  brand_name: string;
  category: string;
  region: string;
  competitor_names: string[];
  providers: string[];
  status: CycleStatus;
  monitor_output: Record<string, unknown> | null;
  analyst_output: Record<string, unknown> | null;
  strategist_output: Record<string, unknown> | null;
  experiment_output: Record<string, unknown> | null;
  created_at: string;
  completed_at: string | null;
}

export interface EnrichedLeaderboardEntry extends LeaderboardEntry {
  sparkline: number[];
  trend_direction: "rising" | "stable" | "falling";
  sov_change: number;
}

export interface TrendsLeaderboardResponse {
  entries: EnrichedLeaderboardEntry[];
  limited: boolean;
  credits_remaining: number | null;
  credit_cost: number;
}

// Reddit
export interface RedditPost {
  title: string;
  url: string;
  subreddit: string;
  score: number;
  num_comments: number;
  selftext_snippet: string;
  created_utc: number;
  sentiment: "positive" | "negative" | "mixed";
  age_days: number;
}

export interface RedditSearchResponse {
  posts: RedditPost[];
  total: number;
  limited: boolean;
  credits_remaining: number | null;
  credit_cost: number;
  query: string;
  category: string | null;
}

export interface CrossValidationInsight {
  type: string;
  icon: string;
  message_en: string;
  message_zh: string;
}

export interface CrossValidationResponse {
  brand: string;
  category: string | null;
  reddit: {
    score: number;
    positive_pct: number;
    negative_pct: number;
    mixed_pct: number;
    total_posts: number;
    top_posts: RedditPost[];
  };
  ai_visibility: {
    weighted_sov: number;
    arrs: number;
    mention_count: number;
    total_prompts: number;
    snapshot_at: string;
  } | null;
  insights: CrossValidationInsight[];
  credits_remaining: number;
  credit_cost: number;
}

// KOL
export interface KolSearchResult {
  channel_name: string;
  channel_id: string;
  video_id: string;
  video_title: string;
  video_url: string;
  thumbnail: string;
  views: number;
  subscribers: number;
  tier: "mega" | "macro" | "micro";
  sentiment: "positive" | "negative" | "mixed";
  published_at: string;
  description_snippet: string;
}

export interface KolSearchResponse {
  kols: KolSearchResult[];
  total: number;
  limited: boolean;
  credits_remaining: number | null;
  credit_cost: number;
  query: string;
  category: string | null;
  api_available: boolean;
}

export interface KolCrossValidationResponse {
  brand: string;
  category: string | null;
  kol_coverage: {
    total_creators: number;
    positive_pct: number;
    negative_pct: number;
    mixed_pct: number;
    total_views: number;
    total_subscribers: number;
    mega_count: number;
    macro_count: number;
    micro_count: number;
    top_kols: KolSearchResult[];
  };
  ai_visibility: {
    weighted_sov: number;
    arrs: number;
    mention_count: number;
    total_prompts: number;
    snapshot_at: string;
  } | null;
  insights: CrossValidationInsight[];
  credits_remaining: number;
  credit_cost: number;
}

// B2A Analytics types
export interface B2AEngineAttribution {
  engines: {
    engine: string;
    total_prompts: number;
    mentions: number;
    mention_rate: number;
    avg_position: number | null;
    share_of_mentions: number;
  }[];
  total_prompts: number;
  total_mentions: number;
  brand_filter: string | null;
  category_filter: string | null;
}

export interface B2ACompetitiveLandscape {
  category: string;
  brands: {
    brand: string;
    engines: Record<string, { sov: number; mentions: number; total: number }>;
    total_mentions: number;
  }[];
}

export interface B2ASourceIntelligence {
  sources: {
    domain: string;
    count: number;
    engines: string[];
    sample_urls: string[];
  }[];
  brand_filter: string | null;
  category_filter: string | null;
}

export interface B2ATrafficStats {
  period_days: number;
  total_visits: number;
  engines: {
    engine: string;
    visits: number;
    unique_visitors: number;
    pct: number;
  }[];
  daily: { date: string; visits: number }[];
  top_pages: { page: string; visits: number }[];
  site_filter: string | null;
}

export interface GoogleTrendsData {
  keywords: Record<string, number>;
  delta_4w_pct: Record<string, number>;
  rising_queries: string[];
}

// GEO Action Plan
export interface GeoActionItem {
  id: string;
  category: "content" | "reddit" | "schema" | "citations" | "social" | "reviews" | "tiktok" | "market_signals";
  priority: "critical" | "high" | "medium";
  title: string;
  why: string;
  how: string;
  impact: string;
  effort: "low" | "medium" | "high";
}

// Market Signals
export interface MarketSignalRedditPost {
  title: string;
  url: string;
  score: number;
}

export interface MarketSignalKol {
  channel_name: string;
  video_title: string;
  views: number;
  tier: string;
}

export interface MarketSignalTiktokProduct {
  title: string;
  price: string;
  sales: number;
}

export interface MarketSignals {
  brand: string;
  category: string;
  reddit_score: number;
  reddit_post_count: number;
  reddit_sentiment: string;
  reddit_top_posts: MarketSignalRedditPost[];
  kol_count: number;
  kol_total_views: number;
  kol_positive_pct: number;
  kol_top_creators: MarketSignalKol[];
  kol_tier_breakdown: Record<string, number>;
  tiktok_present: boolean;
  tiktok_product_count: number;
  tiktok_avg_rating: number;
  tiktok_trending: boolean;
  tiktok_top_products: MarketSignalTiktokProduct[];
  google_delta: number | null;
  google_trend_direction: string;
  market_alignment_score: number;
  alignment_label: string;
  credits_remaining: number | null;
  credit_cost: number;
}

export interface GeoPlan {
  id: string;
  run_id: string;
  brand_name: string;
  category: string;
  current_geo_score: number;
  projected_geo_score: number;
  weaknesses: string[];
  actions: GeoActionItem[];
  generated_at: string;
  model_used: string;
}

// Selection Intelligence
export interface SelectionBrandEntry {
  name: string;
  sov: number;
  arrs: number;
}

export interface SelectionCategoryEntry {
  id: string;
  category: string;
  category_zh: string;
  section: string;
  section_zh: string;
  brand_count: number;
  top_brands: SelectionBrandEntry[];
  trend: "up" | "stable" | "down";
  trend_pts: string;
  seller_signal: "strong_buy" | "watch" | "avoid";
  seller_note: string;
  seller_note_zh: string;
  platforms: string[];
  google_trends_delta: number | null;
  reddit_posts: number | null;
  youtube_kols: number | null;
}

export interface SelectionIntelligenceResponse {
  categories: SelectionCategoryEntry[];
  total: number;
  limited: boolean;
  credits_remaining: number | null;
  credit_cost: number;
}

export interface SelectionDetailRedditPost {
  title: string;
  url: string;
  subreddit: string;
  score: number;
  sentiment: string;
  age_days: number;
}

export interface SelectionDetailKol {
  channel_name: string;
  video_title: string;
  video_url: string;
  views: number;
  subscribers: number;
  tier: string;
}

export interface SelectionDetailTiktokProduct {
  title: string;
  price: string;
  sales: number;
}

export interface SelectionCategoryDetailResponse {
  category: string;
  leaderboard: Record<string, unknown>[];
  reddit_posts: SelectionDetailRedditPost[];
  youtube_kols: SelectionDetailKol[];
  google_trends: { keywords: Record<string, number>; delta_4w_pct: Record<string, number>; rising_queries: string[] };
  tiktok_trending: SelectionDetailTiktokProduct[];
  credits_remaining: number | null;
  credit_cost: number;
}

// ── Citation Health ──────────────────────────────────────────────────────────
export interface CitationHealthBreakdown {
  type: string;
  label: string;
  percent: number;
  count: number;
  examples: string[];
  color: string;
  risk_tag?: string;
}

export interface CitationHealth {
  score: number;
  risk_level: "critical" | "warning" | "healthy";
  total_citations: number;
  breakdown: CitationHealthBreakdown[];
}

export interface RunSourcesResponse {
  domains: Record<string, unknown>[];
  opportunities: Record<string, unknown>[];
  total_unique_domains: number;
  gap_count: number;
  pure_gap_count: number;
  citation_health: CitationHealth;
}

export const api = {
  // Runs
  listRuns: (brand?: string) =>
    getAuth<Run[]>(`/runs${brand ? `?brand=${encodeURIComponent(brand)}` : ""}`),
  getRun: (id: string) => get<Run>(`/runs/${id}`),
  createRun: (body: {
    brand_name: string;
    competitor_names: string[];
    category: string;
    region: string;
    num_prompts: number;
    providers: string[];
    price_band?: string;
  }) => post<Run>("/runs", body),

  // Metrics
  getMetrics: (runId: string) => get<Record<string, unknown>>(`/runs/${runId}/metrics`),

  // Individual prompt results
  getRunResults: (runId: string, params?: { intent?: string; provider?: string; mentioned?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.intent) q.set("intent", params.intent);
    if (params?.provider) q.set("provider", params.provider);
    if (params?.mentioned !== undefined) q.set("mentioned", String(params.mentioned));
    const qs = q.toString();
    return get<PromptResultDetail[]>(`/runs/${runId}/results${qs ? `?${qs}` : ""}`);
  },

  // Trends
  getBrandTrends: (brand: string, days?: number) =>
    get<RunSnapshot[]>(`/brands/${encodeURIComponent(brand)}/trends${days ? `?days=${days}` : ""}`),

  // Recommendations
  getRecommendations: (runId: string) => get<Recommendation>(`/runs/${runId}/recommendations`),

  // GEO Action Plan
  getGeoPlan: (runId: string) => getAuth<GeoPlan>(`/runs/${runId}/geo-plan`),
  createGeoPlan: (runId: string) => postAuth<GeoPlan>(`/runs/${runId}/geo-plan`, {}),

  // Sources / citation analysis
  getRunSources: (runId: string) => getAuth<RunSourcesResponse>(`/runs/${runId}/sources`),

  // Market Signals
  getMarketSignals: (runId: string) => getAuth<MarketSignals>(`/runs/${runId}/market-signals`),

  // TikTok Shop
  searchTiktok: (q: string, category?: string) =>
    getAuth<{ products: Record<string, unknown>[]; total: number; credits_remaining: number | null; credit_cost: number }>(
      `/tiktok/search?q=${encodeURIComponent(q)}${category ? `&category=${encodeURIComponent(category)}` : ""}`
    ),
  getTiktokTrending: (category: string) =>
    get<{ products: Record<string, unknown>[]; category: string }>(
      `/tiktok/trending/${encodeURIComponent(category)}`
    ),

  // Category index
  listCategories: () => get<CategoryEntry[]>("/categories"),
  getCategoryLeaderboard: (category: string) =>
    get<LeaderboardEntry[]>(`/categories/${encodeURIComponent(category)}/leaderboard`),
  getCategoryLeaderboardWithTrends: (category: string, sparklinePoints?: number) =>
    getAuth<TrendsLeaderboardResponse>(
      `/categories/${encodeURIComponent(category)}/leaderboard-with-trends${sparklinePoints ? `?sparkline_points=${sparklinePoints}` : ""}`
    ),
  getGoogleTrends: (category: string) =>
    get<GoogleTrendsData>(`/trends/google/${encodeURIComponent(category)}`),

  // Reddit intelligence
  searchReddit: (q: string, category?: string) =>
    getAuth<RedditSearchResponse>(
      `/reddit/search?q=${encodeURIComponent(q)}${category ? `&category=${encodeURIComponent(category)}` : ""}`
    ),
  crossValidate: (brand: string, category?: string) =>
    getAuth<CrossValidationResponse>(
      `/reddit/cross-validate/${encodeURIComponent(brand)}${category ? `?category=${encodeURIComponent(category)}` : ""}`
    ),

  // KOL intelligence
  searchKols: (q: string, category?: string) =>
    getAuth<KolSearchResponse>(
      `/kol/search?q=${encodeURIComponent(q)}${category ? `&category=${encodeURIComponent(category)}` : ""}`
    ),
  crossValidateKol: (brand: string, category?: string) =>
    getAuth<KolCrossValidationResponse>(
      `/kol/cross-validate/${encodeURIComponent(brand)}${category ? `?category=${encodeURIComponent(category)}` : ""}`
    ),

  // Schedules
  listSchedules: () => getAuth<Schedule[]>("/schedules"),
  createSchedule: (body: {
    brand_name: string;
    competitor_names: string[];
    category: string;
    region: string;
    providers: string[];
    price_band?: string;
    cron_expr: string;
    num_prompts: number;
  }) => postAuth<Schedule>("/schedules", body),
  enableSchedule: (id: string) => patchAuth<Schedule>(`/schedules/${id}/enable`),
  disableSchedule: (id: string) => patchAuth<Schedule>(`/schedules/${id}/disable`),
  deleteSchedule: (id: string) => delAuth(`/schedules/${id}`),

  // Agent Growth Cycles
  createCycle: (body: {
    brand_name: string;
    category: string;
    region?: string;
    competitor_names?: string[];
    providers?: string[];
    language?: string;
  }) => post<AgentCycle>("/agents/cycles", body),
  listCycles: (limit?: number) =>
    get<AgentCycle[]>(`/agents/cycles${limit ? `?limit=${limit}` : ""}`),
  getCycle: (id: string) => get<AgentCycle>(`/agents/cycles/${id}`),

  // B2A Analytics
  getEngineAttribution: (brand?: string, category?: string) => {
    const q = new URLSearchParams();
    if (brand) q.set("brand", brand);
    if (category) q.set("category", category);
    const qs = q.toString();
    return get<B2AEngineAttribution>(`/b2a/engine-attribution${qs ? `?${qs}` : ""}`);
  },
  getCompetitiveLandscape: (category: string, limit?: number) =>
    get<B2ACompetitiveLandscape>(
      `/b2a/competitive-landscape?category=${encodeURIComponent(category)}${limit ? `&limit=${limit}` : ""}`
    ),
  getSourceIntelligence: (brand?: string, category?: string) => {
    const q = new URLSearchParams();
    if (brand) q.set("brand", brand);
    if (category) q.set("category", category);
    const qs = q.toString();
    return get<B2ASourceIntelligence>(`/b2a/source-intelligence${qs ? `?${qs}` : ""}`);
  },
  getTrafficStats: (site?: string, days?: number) => {
    const q = new URLSearchParams();
    if (site) q.set("site", site);
    if (days) q.set("days", String(days));
    const qs = q.toString();
    return get<B2ATrafficStats>(`/b2a/traffic-stats${qs ? `?${qs}` : ""}`);
  },

  // Selection Intelligence
  getSelectionIntelligence: () =>
    getAuth<SelectionIntelligenceResponse>("/selection/intelligence"),
  getSelectionCategoryDetail: (category: string) =>
    getAuth<SelectionCategoryDetailResponse>(
      `/selection/categories/${encodeURIComponent(category)}/detail`
    ),
};
