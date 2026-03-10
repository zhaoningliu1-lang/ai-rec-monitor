import { getToken } from "./auth";

const CREDITS_KEY = "avanti_credits";
const FREE_CREDITS = 3;

export function getCredits(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(CREDITS_KEY);
  if (stored === null) return FREE_CREDITS;
  return parseInt(stored, 10);
}

export function setCredits(n: number): void {
  localStorage.setItem(CREDITS_KEY, String(Math.max(0, n)));
}

export function initCredits(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(CREDITS_KEY) === null) {
    setCredits(FREE_CREDITS);
  }
}

export function useCredit(): boolean {
  const c = getCredits();
  if (c <= 0) return false;
  setCredits(c - 1);
  return true;
}

export function hasCredits(): boolean {
  return getCredits() > 0;
}

export const MAX_FREE_CREDITS = FREE_CREDITS;
