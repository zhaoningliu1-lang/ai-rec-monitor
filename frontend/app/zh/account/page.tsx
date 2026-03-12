"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createCheckout, createPortal, fetchMe, logout, type UserProfile } from "@/lib/auth";

const TIERS = [
  {
    id: "free" as const,
    label: "入门版",
    price: "$0",
    period: "",
    features: ["每月 1 次免费诊断", "3 个 AI 模型", "PDF 报告"],
    cta: "当前套餐",
    disabled: true,
  },
  {
    id: "growth" as const,
    label: "监控版",
    price: "$99",
    period: "/月",
    features: ["无限次诊断", "每周自动监控", "3 个品牌", "趋势图表", "邮件提醒"],
    cta: "升级到监控版 →",
    disabled: false,
    accent: true,
  },
  {
    id: "scale" as const,
    label: "专业版",
    price: "$199",
    period: "/月",
    features: ["监控版全部功能", "10 个品牌", "GEO 执行手册", "优先支持", "Notion 导出"],
    cta: "升级到专业版 →",
    disabled: false,
  },
];

const TIER_LABEL: Record<string, string> = {
  free: "入门版", growth: "监控版", scale: "专业版", enterprise: "企业版",
};

function tierColor(tier: string) {
  if (tier === "scale") return "#a855f7";
  if (tier === "growth") return "#ff6b35";
  return "#7070a0";
}

export default function ZhAccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetchMe()
      .then(setUser)
      .catch(() => router.push("/zh/login?next=/zh/account"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleUpgrade(tier: "growth" | "scale") {
    setCheckoutLoading(tier);
    try {
      const origin = window.location.origin;
      const { checkout_url } = await createCheckout(tier, `${origin}/zh/account?upgraded=1`, `${origin}/zh/account`);
      window.location.href = checkout_url;
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "无法启动结账流程");
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
      alert(err instanceof Error ? err.message : "无法打开账单门户");
    } finally {
      setPortalLoading(false);
    }
  }

  if (loading) return <div style={{ color: "#7070a0", paddingTop: 80, textAlign: "center" }}>加载中…</div>;
  if (!user) return null;

  const isPaid = user.subscription_tier !== "free";

  return (
    <div className="max-w-3xl mx-auto" style={{ paddingTop: 32 }}>
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
            <button onClick={handlePortal} disabled={portalLoading}
              style={{ background: "transparent", border: "1px solid #25253f", color: "#7070a0", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
              {portalLoading ? "打开中…" : "管理账单"}
            </button>
          )}
          <button onClick={() => { logout(); }}
            style={{ background: "transparent", border: "1px solid #25253f", color: "#7070a0", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
            退出登录
          </button>
        </div>
      </div>

      <div style={{ background: "#12121e", border: "1px solid #25253f", borderRadius: 12, padding: "20px 24px", marginBottom: 32, display: "flex", alignItems: "center", gap: 16 }}>
        <div>
          <p style={{ fontSize: 12, color: "#7070a0", marginBottom: 4 }}>当前套餐</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: tierColor(user.subscription_tier) }}>
            {TIER_LABEL[user.subscription_tier] ?? user.subscription_tier}
          </p>
          {user.subscription_status !== "none" && (
            <p style={{ fontSize: 12, color: "#7070a0", marginTop: 4 }}>
              状态：{user.subscription_status}
              {user.subscription_current_period_end && (
                <> · 续费日期 {new Date(user.subscription_current_period_end).toLocaleDateString("zh-CN")}</>
              )}
            </p>
          )}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Link href="/zh/audit" style={{ background: "#1a1a2e", border: "1px solid #25253f", color: "#f0f0f8", borderRadius: 8, padding: "8px 16px", fontSize: 13, textDecoration: "none" }}>
            立即诊断 →
          </Link>
        </div>
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f0f0f8", marginBottom: 16 }}>
        {isPaid ? "更改套餐" : "升级套餐"}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {TIERS.map((tier) => {
          const isCurrent = user.subscription_tier === tier.id;
          return (
            <div key={tier.id} style={{ background: tier.accent ? "#1a0e06" : "#12121e", border: `1px solid ${isCurrent ? "#ff6b35" : tier.accent ? "#ff6b3540" : "#25253f"}`, borderRadius: 12, padding: "24px 20px", position: "relative" }}>
              {tier.accent && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#ff6b35", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 99, padding: "3px 12px" }}>
                  最受欢迎
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
                <div style={{ textAlign: "center", fontSize: 13, color: "#ff6b35", fontWeight: 600, paddingTop: 8 }}>✓ 当前套餐</div>
              ) : tier.disabled ? (
                <div style={{ textAlign: "center", fontSize: 13, color: "#3a3a5c" }}>–</div>
              ) : (
                <button onClick={() => handleUpgrade(tier.id as "growth" | "scale")} disabled={!!checkoutLoading}
                  style={{ width: "100%", background: tier.accent ? "#ff6b35" : "#1a1a2e", border: tier.accent ? "none" : "1px solid #25253f", color: "#fff", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 700, cursor: checkoutLoading ? "not-allowed" : "pointer", opacity: checkoutLoading ? 0.7 : 1 }}>
                  {checkoutLoading === tier.id ? "跳转中…" : tier.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p style={{ color: "#3a3a5c", fontSize: 12, textAlign: "center", marginTop: 24 }}>
        企业定制方案？<a href="mailto:hello@avantia2a.com" style={{ color: "#7070a0" }}>联系我们</a>
      </p>
    </div>
  );
}
