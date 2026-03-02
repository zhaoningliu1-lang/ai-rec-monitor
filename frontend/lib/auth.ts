const TOKEN_KEY = "avanti_token";
const TIER_KEY  = "avanti_tier";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TIER_KEY);
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
  return data;
}

export async function login(email: string, password: string) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.access_token);
  return data;
}

export async function fetchMe(): Promise<UserProfile> {
  const profile = await apiFetch("/auth/me");
  saveTierFromProfile(profile);
  return profile;
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

export function logout() {
  clearToken();
  window.location.href = "/";
}
