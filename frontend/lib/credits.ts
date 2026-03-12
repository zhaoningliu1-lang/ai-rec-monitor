/**
 * @deprecated — Credit system has moved to server-side (User.credit_balance).
 * Use `fetchCredits()` from "@/lib/auth" instead.
 * This file is kept only to avoid build errors from stale imports.
 */

export function getCredits(): number { return 0; }
export function setCredits(_n: number): void {}
export function initCredits(): void {}
export function useCredit(): boolean { return false; }
export function hasCredits(): boolean { return false; }
export const MAX_FREE_CREDITS = 0;
