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

async function patch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { method: "PATCH" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${path}`);
  return res.json();
}

async function del(path: string): Promise<void> {
  const res = await fetch(`${BASE}${path}`, { method: "DELETE" });
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

export interface GoogleTrendsData {
  keywords: Record<string, number>;
  delta_4w_pct: Record<string, number>;
  rising_queries: string[];
}

export const api = {
  // Runs
  listRuns: (brand?: string) =>
    get<Run[]>(`/runs${brand ? `?brand=${encodeURIComponent(brand)}` : ""}`),
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

  // Sources / citation analysis
  getRunSources: (runId: string) => get<Record<string, unknown>>(`/runs/${runId}/sources`),

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

  // Schedules
  listSchedules: () => get<Schedule[]>("/schedules"),
  createSchedule: (body: {
    brand_name: string;
    competitor_names: string[];
    category: string;
    region: string;
    providers: string[];
    price_band?: string;
    cron_expr: string;
    num_prompts: number;
  }) => post<Schedule>("/schedules", body),
  enableSchedule: (id: string) => patch<Schedule>(`/schedules/${id}/enable`),
  disableSchedule: (id: string) => patch<Schedule>(`/schedules/${id}/disable`),
  deleteSchedule: (id: string) => del(`/schedules/${id}`),

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
};
