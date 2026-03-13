"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Lang, tx } from "@/lib/i18n";
import { fetchMe, useCredits } from "@/lib/auth";
import {
  HALLUCINATION_BRANDS,
  computeHRS,
  type BrandHallucination,
  type ModelName,
  type ClaimStatus,
} from "@/lib/hallucination-data";

/* ── Config ───────────────────────────────────────────────────────────────── */
const HRS_CONFIG = {
  low:    { color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  medium: { color: "#f5a623", bg: "rgba(245,166,35,0.12)" },
  high:   { color: "#ff4d6d", bg: "rgba(255,77,109,0.12)" },
} as const;

const CLAIM_CONFIG: Record<ClaimStatus, { icon: string; color: string; bg: string }> = {
  accurate: { icon: "✓", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  wrong:    { icon: "✗", color: "#ff4d6d", bg: "rgba(255,77,109,0.12)" },
  partial:  { icon: "~", color: "#f5a623", bg: "rgba(245,166,35,0.12)" },
};

const MODEL_COLORS: Record<ModelName, string> = {
  ChatGPT: "#22c55e",
  Claude: "#ff6b35",
  Gemini: "#60a5fa",
};

/* ── Upgrade Modal ────────────────────────────────────────────────────────── */
function UpgradeModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const h = (p: string) => lang === "zh" ? `/zh${p}` : p;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="rounded-2xl p-8 max-w-sm text-center space-y-4" style={{ background: "#12121e", border: "1px solid #25253f" }} onClick={e => e.stopPropagation()}>
        <div className="text-3xl">0</div>
        <h3 className="text-lg font-bold" style={{ color: "#f0f0f8" }}>
          {tx("hallucination", "creditsExhausted", lang)}
        </h3>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          {tx("hallucination", "upgradeToView", lang)}
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link href={h("/account")} className="px-5 py-2 rounded-xl text-sm font-semibold" style={{ background: "#ff6b35", color: "#fff" }}>
            {tx("hallucination", "upgradeCta", lang)}
          </Link>
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-sm" style={{ background: "#1a1a2e", color: "#7070a0", border: "1px solid #25253f" }}>
            {lang === "zh" ? "关闭" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */
interface Props { lang: Lang }

export default function HallucinationView({ lang }: Props) {
  const [selectedBrandId, setSelectedBrandId] = useState(HALLUCINATION_BRANDS[0].id);
  const [selectedModel, setSelectedModel] = useState<ModelName>("ChatGPT");

  // Auth + credits
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const viewedBrands = useRef(new Set<string>());

  // Check auth on mount
  useEffect(() => {
    fetchMe()
      .then((u) => {
        setIsLoggedIn(true);
        setCreditsRemaining(u.credit_balance);
        const tier = u.subscription_tier;
        setIsPaid(tier === "growth" || tier === "scale" || tier === "enterprise");
        // First brand is free
        viewedBrands.current.add(HALLUCINATION_BRANDS[0].id);
      })
      .catch(() => {
        setIsLoggedIn(false);
        viewedBrands.current.add(HALLUCINATION_BRANDS[0].id);
      });
  }, []);

  // Handle brand selection with credit check
  async function handleSelectBrand(brandId: string) {
    // Already viewed — no cost
    if (viewedBrands.current.has(brandId)) {
      setSelectedBrandId(brandId);
      setSelectedModel("ChatGPT");
      return;
    }

    // Anonymous — block
    if (!isLoggedIn) {
      return; // locked brands show signup CTA
    }

    // Paid — free
    if (isPaid) {
      viewedBrands.current.add(brandId);
      setSelectedBrandId(brandId);
      setSelectedModel("ChatGPT");
      return;
    }

    // Free user — deduct credit
    try {
      const result = await useCredits(1, "hallucination");
      setCreditsRemaining(result.balance);
      viewedBrands.current.add(brandId);
      setSelectedBrandId(brandId);
      setSelectedModel("ChatGPT");
    } catch (err) {
      if (err instanceof Error && (err.message.includes("credits") || err.message.includes("429"))) {
        setShowUpgradeModal(true);
      }
    }
  }

  const brand = HALLUCINATION_BRANDS.find(b => b.id === selectedBrandId)!;
  const hrs = computeHRS(brand);
  const hrsStyle = HRS_CONFIG[hrs.level];
  const modelResponse = brand.responses.find(r => r.model === selectedModel);

  const h = (path: string) => lang === "zh" ? `/zh${path}` : path;

  const hrsLevelLabel = hrs.level === "low"
    ? tx("hallucination", "lowRisk", lang)
    : hrs.level === "medium"
    ? tx("hallucination", "mediumRisk", lang)
    : tx("hallucination", "highRisk", lang);

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-8" style={{ paddingTop: 32, paddingBottom: 64 }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#f0f0f8" }}>
            {tx("hallucination", "title", lang)}
          </h1>
          <p className="text-sm" style={{ color: "#7070a0", maxWidth: 560 }}>
            {tx("hallucination", "subtitle", lang)}
          </p>
        </div>
        {/* Credit indicator */}
        {isLoggedIn !== null && (
          <div className="shrink-0 text-right">
            {isLoggedIn ? (
              isPaid ? (
                <span className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
                  {tx("hallucination", "unlimited", lang)}
                </span>
              ) : (
                <div className="space-y-1">
                  <span className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}>
                    {creditsRemaining ?? 0} {tx("hallucination", "creditsRemaining", lang)}
                  </span>
                  <p className="text-xs" style={{ color: "#4a4a6a" }}>
                    {tx("hallucination", "creditCost", lang)}
                  </p>
                </div>
              )
            ) : (
              <Link href={h("/login?next=" + encodeURIComponent(lang === "zh" ? "/zh/hallucination" : "/hallucination"))}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-opacity hover:opacity-80"
                style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}>
                {tx("hallucination", "loginToUnlock", lang)}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Brand selector pills */}
      <div className="flex flex-wrap gap-2">
        {HALLUCINATION_BRANDS.map((b) => {
          const bHrs = computeHRS(b);
          const isSelected = b.id === selectedBrandId;
          const isLocked = !viewedBrands.current.has(b.id) && !isLoggedIn;
          const isUnlockable = !viewedBrands.current.has(b.id) && isLoggedIn && !isPaid;

          return (
            <button
              key={b.id}
              onClick={() => handleSelectBrand(b.id)}
              disabled={isLocked}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: isSelected ? "rgba(255,107,53,0.12)" : isLocked ? "#0a0a14" : "#0f0f17",
                border: `1px solid ${isSelected ? "rgba(255,107,53,0.4)" : "#25253f"}`,
                color: isLocked ? "#3a3a5c" : isSelected ? "#ff6b35" : "#9090b0",
                cursor: isLocked ? "not-allowed" : "pointer",
                opacity: isLocked ? 0.6 : 1,
              }}
            >
              {isLocked && <span style={{ fontSize: 11 }}>🔒</span>}
              {b.brand}
              <span className="text-xs px-1.5 py-0.5 rounded-full" style={{
                background: HRS_CONFIG[bHrs.level].bg,
                color: HRS_CONFIG[bHrs.level].color,
              }}>
                {bHrs.score}%
              </span>
              {isUnlockable && !isSelected && (
                <span className="text-xs" style={{ color: "#4a4a6a" }}>1 cr</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Anonymous signup banner */}
      {isLoggedIn === false && (
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,107,53,0.04)", border: "1px solid rgba(255,107,53,0.15)" }}>
          <p className="text-sm mb-2" style={{ color: "#9090b0" }}>
            {tx("hallucination", "lockedPreview", lang)}
          </p>
          <Link href={h("/signup")}
            className="px-5 py-2 rounded-xl text-sm font-semibold inline-block transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff" }}>
            {lang === "zh" ? "免费注册 →" : "Sign Up Free →"}
          </Link>
        </div>
      )}

      {/* HRS Score card */}
      <div className="rounded-2xl p-6" style={{ background: "#0f0f17", border: `1px solid ${hrsStyle.color}30` }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {/* Score */}
          <div className="text-center">
            <p className="text-xs font-semibold mb-2" style={{ color: "#7070a0" }}>
              {tx("hallucination", "hrsLabel", lang)}
            </p>
            <div className="text-5xl font-black" style={{ color: hrsStyle.color }}>
              {hrs.score}%
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full mt-2 inline-block" style={{ background: hrsStyle.bg, color: hrsStyle.color }}>
              {hrsLevelLabel}
            </span>
          </div>

          {/* Stats */}
          <div className="col-span-2 grid grid-cols-3 gap-3">
            {([
              { key: "accurate" as const, count: hrs.accurate, status: "accurate" as ClaimStatus },
              { key: "hallucinated" as const, count: hrs.wrong, status: "wrong" as ClaimStatus },
              { key: "partiallyWrong" as const, count: hrs.partial, status: "partial" as ClaimStatus },
            ]).map(({ key, count, status }) => (
              <div key={key} className="rounded-xl p-3 text-center" style={{ background: "#12121e", border: "1px solid #1a1a2e" }}>
                <div className="text-2xl font-bold" style={{ color: CLAIM_CONFIG[status].color }}>{count}</div>
                <div className="text-xs mt-1" style={{ color: "#7070a0" }}>
                  {tx("hallucination", key, lang)}
                </div>
              </div>
            ))}
          </div>

          {/* GEO Score */}
          <div className="text-center">
            <p className="text-xs font-semibold mb-2" style={{ color: "#7070a0" }}>
              {tx("hallucination", "geoScore", lang)}
            </p>
            <div className="text-4xl font-black" style={{ color: brand.geoScore >= 60 ? "#22c55e" : brand.geoScore >= 30 ? "#f5a623" : "#ff4d6d" }}>
              {brand.geoScore}
            </div>
            <p className="text-xs mt-1" style={{ color: "#4a4a6a" }}>
              {hrs.total} {tx("hallucination", "totalClaims", lang)}
            </p>
          </div>
        </div>
      </div>

      {/* Model tabs */}
      <div className="flex gap-2">
        {(["ChatGPT", "Claude", "Gemini"] as ModelName[]).map((model) => (
          <button
            key={model}
            onClick={() => setSelectedModel(model)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: selectedModel === model ? `${MODEL_COLORS[model]}18` : "#0f0f17",
              border: `1px solid ${selectedModel === model ? `${MODEL_COLORS[model]}50` : "#25253f"}`,
              color: selectedModel === model ? MODEL_COLORS[model] : "#7070a0",
            }}
          >
            {model}
          </button>
        ))}
      </div>

      {/* Claims list */}
      {modelResponse && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="px-5 py-3" style={{ borderBottom: "1px solid #1a1a2e" }}>
            <h3 className="text-sm font-bold" style={{ color: "#f0f0f8" }}>
              {selectedModel} — {brand.brand}
            </h3>
          </div>
          <div className="divide-y" style={{ borderColor: "#1a1a2e" }}>
            {modelResponse.claims.map((claim, i) => {
              const cfg = CLAIM_CONFIG[claim.status];
              return (
                <div key={i} className="px-5 py-4 flex items-start gap-3" style={{ borderBottom: i < modelResponse.claims.length - 1 ? "1px solid #1a1a2e" : "none" }}>
                  <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: "#f0f0f8" }}>&quot;{claim.text}&quot;</p>
                    {claim.correction && (
                      <p className="text-xs mt-1.5" style={{ color: cfg.color }}>
                        {tx("hallucination", "correction", lang)}: {claim.correction}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: cfg.bg, color: cfg.color }}>
                    {claim.status === "accurate"
                      ? tx("hallucination", "accurate", lang)
                      : claim.status === "wrong"
                      ? tx("hallucination", "hallucinated", lang)
                      : tx("hallucination", "partiallyWrong", lang)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Why This Matters */}
      <div className="rounded-2xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <h3 className="text-sm font-bold" style={{ color: "#f0f0f8" }}>
          {tx("hallucination", "whyTitle", lang)}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {([
            { icon: "💰", key: "whyPrice" as const },
            { icon: "📋", key: "whySpecs" as const },
            { icon: "📉", key: "whyGeo" as const },
          ]).map(({ icon, key }) => (
            <div key={key} className="rounded-xl p-3" style={{ background: "#12121e", border: "1px solid #1a1a2e" }}>
              <span className="text-lg">{icon}</span>
              <p className="text-xs mt-2" style={{ color: "#9090b0" }}>
                {tx("hallucination", key, lang)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl p-8 text-center" style={{ background: "linear-gradient(135deg, #1a0e06, #12121e)", border: "1px solid rgba(255,107,53,0.2)" }}>
        <h2 className="text-lg font-bold mb-2" style={{ color: "#f0f0f8" }}>
          {tx("hallucination", "ctaTitle", lang)}
        </h2>
        <p className="text-sm mb-5" style={{ color: "#7070a0", maxWidth: 400, margin: "0 auto 20px" }}>
          {tx("hallucination", "ctaSub", lang)}
        </p>
        <Link href={h("/audit")} className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 inline-block" style={{ background: "#ff6b35", color: "#fff" }}>
          {tx("hallucination", "ctaAudit", lang)}
        </Link>
      </div>

      {/* Upgrade modal */}
      {showUpgradeModal && <UpgradeModal lang={lang} onClose={() => setShowUpgradeModal(false)} />}
    </div>
  );
}
