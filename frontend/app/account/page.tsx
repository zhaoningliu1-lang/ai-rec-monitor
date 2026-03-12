"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createCheckout, createPortal, fetchMe, fetchCredits, logout, type UserProfile } from "@/lib/auth";

const TIERS = [
  {
    id: "free" as const,
    label: "Starter",
    price: "$0",
    period: "",
    features: ["1 free audit / month", "3 AI models", "PDF report"],
    cta: "Current plan",
    disabled: true,
  },
  {
    id: "growth" as const,
    label: "Growth",
    price: "$99",
    period: "/mo",
    features: ["Unlimited audits", "Weekly monitoring", "3 brands", "Trend charts", "Email alerts"],
    cta: "Upgrade to Growth →",
    disabled: false,
    accent: true,
  },
  {
    id: "scale" as const,
    label: "Scale",
    price: "$199",
    period: "/mo",
    features: ["Everything in Growth", "10 brands", "GEO Playbook", "Priority support", "Notion export"],
    cta: "Upgrade to Scale →",
    disabled: false,
  },
];

function tierLabel(tier: string) {
  return TIERS.find((t) => t.id === tier)?.label ?? tier;
}

function tierColor(tier: string) {
  if (tier === "scale") return "#a855f7";
  if (tier === "growth") return "#ff6b35";
  return "#7070a0";
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const [creditBalance, setCreditBalance] = useState<number | null>(null);

  useEffect(() => {
    fetchMe()
      .then((u) => { setUser(u); setCreditBalance(u.credit_balance); })
      .catch(() => router.push("/login?next=/account"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleUpgrade(tier: "growth" | "scale") {
    setCheckoutLoading(tier);
    try {
      const origin = window.location.origin;
      const { checkout_url } = await createCheckout(
        tier,
        `${origin}/account?upgraded=1`,
        `${origin}/account`,
      );
      window.location.href = checkout_url;
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Could not start checkout");
    } finally {
      setCheckoutLoading(null);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const { portal_url } = await createPortal(window.location.href);
      window.location.href = portal_url;
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Could not open portal");
    } finally {
      setPortalLoading(false);
    }
  }

  if (loading) {
    return <div style={{ color: "#7070a0", paddingTop: 80, textAlign: "center" }}>Loading…</div>;
  }

  if (!user) return null;

  const isPaid = user.subscription_tier !== "free";

  return (
    <div className="max-w-3xl mx-auto" style={{ paddingTop: 32 }}>
      {/* Account header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f0f0f8", marginBottom: 4 }}>
            {user.full_name ?? user.email}
          </h1>
          <p style={{ color: "#7070a0", fontSize: 14 }}>{user.email}</p>
          {user.company_name && <p style={{ color: "#7070a0", fontSize: 14 }}>{user.company_name}</p>}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {isPaid && (
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              style={{ background: "transparent", border: "1px solid #25253f", color: "#7070a0", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}
            >
              {portalLoading ? "Opening…" : "Manage billing"}
            </button>
          )}
          <button
            onClick={logout}
            style={{ background: "transparent", border: "1px solid #25253f", color: "#7070a0", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Profile info card */}
      <div
        style={{
          background: "#12121e", border: "1px solid #25253f", borderRadius: 12,
          padding: "20px 24px", marginBottom: 16,
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
        }}
      >
        <div>
          <p style={{ fontSize: 12, color: "#7070a0", marginBottom: 4 }}>注册日期 / Joined</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#f0f0f8" }}>
            {user.subscription_current_period_end
              ? new Date(user.subscription_current_period_end).toLocaleDateString()
              : "–"}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 12, color: "#7070a0", marginBottom: 4 }}>订阅计划 / Plan</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: tierColor(user.subscription_tier) }}>
            {tierLabel(user.subscription_tier)}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 12, color: "#7070a0", marginBottom: 4 }}>剩余 Credits</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: isPaid ? "#22c55e" : (creditBalance ?? 0) > 0 ? "#f0f0f8" : "#ff4d6d" }}>
            {isPaid ? "Unlimited" : `${creditBalance ?? 0} credits`}
          </p>
        </div>
      </div>

      {/* Current plan badge */}
      <div style={{ background: "#12121e", border: "1px solid #25253f", borderRadius: 12, padding: "20px 24px", marginBottom: 32, display: "flex", alignItems: "center", gap: 16 }}>
        <div>
          <p style={{ fontSize: 12, color: "#7070a0", marginBottom: 4 }}>Current plan</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: tierColor(user.subscription_tier) }}>
            {tierLabel(user.subscription_tier)}
          </p>
          {user.subscription_status !== "none" && (
            <p style={{ fontSize: 12, color: "#7070a0", marginTop: 4 }}>
              Status: {user.subscription_status}
              {user.subscription_current_period_end && (
                <> · Renews {new Date(user.subscription_current_period_end).toLocaleDateString()}</>
              )}
            </p>
          )}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Link
            href="/audit"
            style={{ background: "#1a1a2e", border: "1px solid #25253f", color: "#f0f0f8", borderRadius: 8, padding: "8px 16px", fontSize: 13, textDecoration: "none" }}
          >
            Run audit →
          </Link>
        </div>
      </div>

      {/* Pricing cards */}
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f0f0f8", marginBottom: 16 }}>
        {isPaid ? "Change plan" : "Upgrade your plan"}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {TIERS.map((tier) => {
          const isCurrent = user.subscription_tier === tier.id;
          return (
            <div
              key={tier.id}
              style={{
                background: tier.accent ? "#1a0e06" : "#12121e",
                border: `1px solid ${isCurrent ? "#ff6b35" : tier.accent ? "#ff6b3540" : "#25253f"}`,
                borderRadius: 12,
                padding: "24px 20px",
                position: "relative",
              }}
            >
              {tier.accent && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#ff6b35", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 99, padding: "3px 12px" }}>
                  MOST POPULAR
                </div>
              )}
              <p style={{ fontSize: 14, fontWeight: 700, color: "#f0f0f8", marginBottom: 4 }}>{tier.label}</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#f0f0f8" }}>
                {tier.price}<span style={{ fontSize: 14, fontWeight: 400, color: "#7070a0" }}>{tier.period}</span>
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
                {tier.features.map((f) => (
                  <li key={f} style={{ fontSize: 13, color: "#a0a0c0", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#22c55e", fontSize: 12 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <div style={{ textAlign: "center", fontSize: 13, color: "#ff6b35", fontWeight: 600, paddingTop: 8 }}>
                  ✓ Current plan
                </div>
              ) : tier.disabled ? (
                <div style={{ textAlign: "center", fontSize: 13, color: "#3a3a5c" }}>–</div>
              ) : (
                <button
                  onClick={() => handleUpgrade(tier.id as "growth" | "scale")}
                  disabled={!!checkoutLoading}
                  style={{
                    width: "100%",
                    background: tier.accent ? "#ff6b35" : "#1a1a2e",
                    border: tier.accent ? "none" : "1px solid #25253f",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "10px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: checkoutLoading ? "not-allowed" : "pointer",
                    opacity: checkoutLoading ? 0.7 : 1,
                  }}
                >
                  {checkoutLoading === tier.id ? "Redirecting…" : tier.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p style={{ color: "#3a3a5c", fontSize: 12, textAlign: "center", marginTop: 24 }}>
        Enterprise? <a href="mailto:hello@avantia2a.com" style={{ color: "#7070a0" }}>Contact us</a> for custom pricing.
      </p>
    </div>
  );
}
