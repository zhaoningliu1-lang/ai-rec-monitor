"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { fetchCredits } from "@/lib/auth";

const PROVIDER_OPTIONS = ["openai", "claude"] as const;
const REGION_OPTIONS = ["US", "UK", "DE"] as const;

type AnalysisType = "brand" | "seller" | "sku";

const TYPE_CONFIG: Record<AnalysisType, { label: string; placeholder: string; hint: string }> = {
  brand:  { label: "Brand name",            placeholder: "e.g. JumpStart Pro, Vantrue, NOCO",              hint: "Track brand-level AI visibility across all products" },
  seller: { label: "Seller / Company name", placeholder: "e.g. NOCO Company, Vantrue Electronics",         hint: "See how this seller's product portfolio appears in AI buyer recommendations" },
  sku:    { label: "Product / SKU name",    placeholder: "e.g. NOCO Boost Plus GB40 1000A, Vantrue N4 Pro", hint: "Track a specific product model's AI ranking vs competing SKUs" },
};

export default function NewRunPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisType, setAnalysisType] = useState<AnalysisType>("brand");
  const [creditBalance, setCreditBalance] = useState<number | null>(null);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    fetchCredits()
      .then((c) => { setCreditBalance(c.balance); setIsPaidUser(c.is_paid); })
      .catch(() => { /* not logged in — backend will reject anyway */ });
  }, []);

  const [form, setForm] = useState({
    brand_name: "",
    competitor_names: "",
    category: "",
    region: "US" as "US" | "UK" | "DE",
    num_prompts: 60,
    providers: ["openai", "claude"] as string[],
    price_band: "",
  });

  const toggleProvider = (p: string) => {
    setForm((f) => ({
      ...f,
      providers: f.providers.includes(p)
        ? f.providers.filter((x) => x !== p)
        : [...f.providers, p],
    }));
  };

  const creditCost = Math.max(1, Math.floor(form.num_prompts / 5));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Pre-check: if free user with insufficient credits, show upgrade modal
    if (!isPaidUser && creditBalance !== null && creditBalance < creditCost) {
      setShowUpgrade(true);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const run = await api.createRun({
        brand_name: form.brand_name.trim(),
        competitor_names: form.competitor_names
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        category: form.category.trim(),
        region: form.region,
        num_prompts: form.num_prompts,
        providers: form.providers,
        price_band: form.price_band.trim() || undefined,
      });
      // Refresh credit balance from server
      if (!isPaidUser) {
        fetchCredits()
          .then((c) => setCreditBalance(c.balance))
          .catch(() => {});
      }
      router.push(`/runs/${run.id}`);
    } catch (err: unknown) {
      // Handle 429 credits_exhausted from backend
      const msg = String(err);
      if (msg.includes("credits_exhausted") || msg.includes("Credits exhausted")) {
        setShowUpgrade(true);
      } else {
        setError(msg);
      }
      setLoading(false);
    }
  };

  const inputCls = "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors";
  const inputStyle = { background: "#161625", border: "1px solid #25253f", color: "#f0f0f8" };

  return (
    <div className="max-w-xl space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-sm transition-colors hover:text-white" style={{ color: "#7070a0" }}>
          ← Dashboard
        </Link>
        <span style={{ color: "#25253f" }}>/</span>
        <h1 className="text-xl font-bold">New Run</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-6 space-y-5"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        {/* Analysis type selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>
            Analyzing
          </label>
          <div className="flex gap-2 flex-wrap">
            {(["brand", "seller", "sku"] as AnalysisType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setAnalysisType(t)}
                className="text-sm px-3 py-1.5 rounded-lg border transition-colors capitalize"
                style={
                  analysisType === t
                    ? { background: "#ff6b35", color: "#fff", border: "1px solid #ff6b35" }
                    : { background: "#161625", color: "#7070a0", border: "1px solid #25253f" }
                }
              >
                {t === "sku" ? "SKU / Product" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">{TYPE_CONFIG[analysisType].label} *</label>
          <input
            className={inputCls}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#ff6b35")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#25253f")}
            placeholder={TYPE_CONFIG[analysisType].placeholder}
            value={form.brand_name}
            onChange={(e) => setForm((f) => ({ ...f, brand_name: e.target.value }))}
            required
          />
          <p className="text-xs mt-1.5" style={{ color: "#555580" }}>{TYPE_CONFIG[analysisType].hint}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Competitors <span className="font-normal" style={{ color: "#7070a0" }}>(comma separated)</span>
          </label>
          <input
            className={inputCls}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#ff6b35")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#25253f")}
            placeholder="e.g. Anker, Spigen, Belkin"
            value={form.competitor_names}
            onChange={(e) => setForm((f) => ({ ...f, competitor_names: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Category *</label>
          <input
            className={inputCls}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#ff6b35")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#25253f")}
            placeholder="e.g. USB-C chargers"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Region</label>
            <select
              className={inputCls}
              style={inputStyle}
              value={form.region}
              onChange={(e) => setForm((f) => ({ ...f, region: e.target.value as "US" | "UK" | "DE" }))}
            >
              {REGION_OPTIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Prompts</label>
            <input
              type="number"
              min={1}
              max={200}
              className={inputCls}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#ff6b35")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#25253f")}
              value={form.num_prompts}
              onChange={(e) => setForm((f) => ({ ...f, num_prompts: parseInt(e.target.value) || 60 }))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Price band <span className="font-normal" style={{ color: "#7070a0" }}>(optional)</span>
          </label>
          <input
            className={inputCls}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#ff6b35")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#25253f")}
            placeholder="e.g. $20-$40"
            value={form.price_band}
            onChange={(e) => setForm((f) => ({ ...f, price_band: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Providers</label>
          <div className="flex gap-3">
            {PROVIDER_OPTIONS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => toggleProvider(p)}
                className="text-sm px-4 py-1.5 rounded-xl border transition-colors"
                style={
                  form.providers.includes(p)
                    ? { background: "#ff6b35", color: "#fff", border: "1px solid #ff6b35" }
                    : { background: "#161625", color: "#7070a0", border: "1px solid #25253f" }
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div
            className="rounded p-3 text-sm"
            style={{ background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)", color: "#ff4d6d" }}
          >
            {error}
          </div>
        )}

        {/* Credits indicator for free users */}
        {!isPaidUser && creditBalance !== null && (
          <div className="flex items-center justify-between text-xs" style={{ color: "#7070a0" }}>
            <span>Credits: {creditBalance} (this run costs {creditCost})</span>
            {creditBalance <= 5 && creditBalance > 0 && (
              <Link href="/pricing" style={{ color: "#f5a623" }}>Low credits — upgrade →</Link>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || form.providers.length === 0}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          {loading ? "Starting run…" : "Start run"}
        </button>
      </form>

      {/* Upgrade modal */}
      {showUpgrade && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
          }}
          onClick={() => setShowUpgrade(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-2xl p-8 max-w-md w-full text-center space-y-4"
            style={{ background: "#12121e", border: "1px solid #25253f" }}
          >
            <div style={{ fontSize: 40 }}>{creditBalance ?? 0} credits</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f0f0f8" }}>
              Credits exhausted
            </h2>
            <p style={{ color: "#7070a0", fontSize: 14 }}>
              Add a payment method to continue using Avanti. Paid plans include unlimited analyses.
            </p>
            <div className="flex gap-3 justify-center" style={{ paddingTop: 8 }}>
              <Link
                href="/pricing"
                className="px-6 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "#ff6b35", color: "#fff" }}
              >
                View plans →
              </Link>
              <button
                onClick={() => setShowUpgrade(false)}
                className="px-6 py-2.5 rounded-xl text-sm"
                style={{ background: "#161625", color: "#7070a0", border: "1px solid #25253f" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
