const TOKEN_KEY = "avanti_token";
const TIER_KEY  = "avanti_tier";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  // Set cookie for middleware auth check (30 days)
  document.cookie = `avanti_auth=1; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  // Notify NavBar in the same tab (storage event only fires cross-tab by default)
  window.dispatchEvent(new StorageEvent("storage", { key: TOKEN_KEY, newValue: token }));
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TIER_KEY);
  // Clear auth cookie
  document.cookie = `avanti_auth=; path=/; max-age=0`;
  window.dispatchEvent(new StorageEvent("storage", { key: TOKEN_KEY, newValue: null }));
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function getTier(): string {
  if (typeof window === "undefined") return "free";
  return localStorage.getItem(TIER_KEY) ?? "free";
}

export function isPaid(): boolean {
  const t = getTier();
  return t === "growth" || t === "scale" || t === "enterprise";
}

function saveTierFromProfile(profile: UserProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TIER_KEY, profile.subscription_tier);
  }
}

// ── API helpers ───────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  subscription_tier: string;
  subscription_status: string;
  subscription_current_period_end: string | null;
  credit_balance: number;
}

async function apiFetch(path: string, init: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Request failed");
  }
  return res.json();
}

export async function register(email: string, password: string, fullName?: string, companyName?: string) {
  const data = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, full_name: fullName, company_name: companyName }),
  });
  setToken(data.access_token);
  await fetchMe().catch(() => null); // store tier before redirect
  return data;
}

export async function login(email: string, password: string) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.access_token);
  await fetchMe().catch(() => null); // store tier before redirect
  return data;
}

export async function fetchMe(): Promise<UserProfile> {
  const profile = await apiFetch("/auth/me");
  saveTierFromProfile(profile);
  return profile;
}

export async function fetchCredits(): Promise<{ balance: number; tier: string; is_paid: boolean }> {
  return apiFetch("/auth/credits");
}

export async function useCredits(amount: number, reason: string): Promise<{ balance: number; deducted: number }> {
  return apiFetch("/auth/credits/use", {
    method: "POST",
    body: JSON.stringify({ amount, reason }),
  });
}

export async function createCheckout(tier: "growth" | "scale", successUrl: string, cancelUrl: string) {
  return apiFetch("/billing/checkout", {
    method: "POST",
    body: JSON.stringify({ tier, success_url: successUrl, cancel_url: cancelUrl }),
  });
}

export async function createPortal(returnUrl: string) {
  return apiFetch(`/billing/portal?return_url=${encodeURIComponent(returnUrl)}`, { method: "POST" });
}

export async function forgotPassword(email: string): Promise<void> {
  await fetch(`${BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  // Always resolves — backend never reveals if email exists
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const res = await fetch(`${BASE}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password: newPassword }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Reset failed");
  }
}

export function logout() {
  clearToken();
  window.location.href = "/";
}

// ── API Key Management ──────────────────────────────────────────────────────

export interface APIKeyInfo {
  id: string;
  name: string;
  key_prefix: string;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
}

export interface APIKeyCreated extends APIKeyInfo {
  raw_key: string;
}

export async function createApiKey(name: string): Promise<APIKeyCreated> {
  return apiFetch("/auth/api-keys", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function listApiKeys(): Promise<APIKeyInfo[]> {
  return apiFetch("/auth/api-keys");
}

export async function revokeApiKey(keyId: string): Promise<void> {
  await apiFetch(`/auth/api-keys/${keyId}`, { method: "DELETE" });
}
