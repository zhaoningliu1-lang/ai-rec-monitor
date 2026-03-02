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

  // Category index
  listCategories: () => get<CategoryEntry[]>("/categories"),
  getCategoryLeaderboard: (category: string) =>
    get<LeaderboardEntry[]>(`/categories/${encodeURIComponent(category)}/leaderboard`),

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
};
