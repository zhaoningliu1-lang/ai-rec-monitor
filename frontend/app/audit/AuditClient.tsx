"use client";

import { useState } from "react";
import { Lang, tx } from "@/lib/i18n";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";
const CALENDLY = "https://calendly.com/brivesubscription/30min";

const CATEGORIES = [
  "Automotive accessories",
  "Consumer electronics",
  "Beauty & skincare",
  "Sports & outdoor",
  "Home & kitchen",
  "Pet supplies",
  "Baby & kids",
  "Health & wellness",
  "Apparel & fashion",
  "Food & beverage",
  "Software / SaaS",
  "Other",
];

type Phase = "idle" | "running" | "done" | "error";
type AnalysisType = "brand" | "seller" | "sku";

const TYPE_CONFIG: Record<AnalysisType, { label: Record<string, string>; placeholder: Record<string, string>; hint: Record<string, string> }> = {
  brand: {
    label:       { en: "Brand name", zh: "品牌名称" },
    placeholder: { en: "e.g. JumpStart Pro, Vantrue, NOCO", zh: "例如：JumpStart Pro、Vantrue、NOCO" },
    hint:        { en: "Track brand-level AI visibility across all products", zh: "追踪品牌整体在 AI 推荐中的曝光度" },
  },
  seller: {
    label:       { en: "Seller / Company name", zh: "卖家 / 公司名称" },
    placeholder: { en: "e.g. NOCO Company, Vantrue Electronics, Blackview", zh: "例如：NOCO Company、Vantrue Electronics" },
    hint:        { en: "See how this seller's portfolio appears in AI buyer recommendations", zh: "查看该卖家产品线在 AI 推荐中的整体表现" },
  },
  sku: {
    label:       { en: "Product / SKU name", zh: "产品 / SKU 名称" },
    placeholder: { en: "e.g. NOCO Boost Plus GB40 1000A, Vantrue N4 Pro", zh: "例如：NOCO GB40 1000A、Vantrue N4 Pro" },
    hint:        { en: "Track a specific product model's AI ranking vs competing SKUs", zh: "追踪具体型号在 AI 中的排名，对比竞品 SKU" },
  },
};

const TYPE_LABELS: Record<AnalysisType, Record<string, string>> = {
  brand:  { en: "Brand",   zh: "品牌" },
  seller: { en: "Seller",  zh: "卖家" },
  sku:    { en: "SKU / Product", zh: "具体产品" },
};

interface RunResult {
  arrs: number;
  sov: number;
  arrs_explain: string;
}

interface Props {
  lang?: Lang;
}

export default function AuditClient({ lang = "en" }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType>("brand");

  const [form, setForm] = useState({
    brand_name: "",
    website: "",
    category: "",
    region: "US",
    competitors: "",
  });

  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhase("running");
    setError("");
    setProgress(0);

    try {
      const runRes = await fetch(`${BASE}/runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand_name: form.brand_name.trim(),
          competitor_names: form.competitors
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          category: form.category,
          region: form.region,
          num_prompts: 15,
          providers: ["openai"],
          price_band: undefined,
        }),
      });
      if (!runRes.ok) throw new Error(`Failed to start run: ${runRes.status}`);
      const run = await runRes.json();
      setRunId(run.id);

      let attempts = 0;
      while (attempts < 120) {
        await new Promise((r) => setTimeout(r, 3000));
        attempts++;

        const statusRes = await fetch(`${BASE}/runs/${run.id}`, { cache: "no-store" });
        if (!statusRes.ok) continue;
        const updated = await statusRes.json();

        const pct =
          updated.progress_total > 0
            ? Math.round((updated.progress_done / updated.progress_total) * 100)
            : 0;
        setProgress(pct);

        if (updated.status === "done") {
          const metricsRes = await fetch(`${BASE}/runs/${run.id}/metrics`, { cache: "no-store" });
          if (metricsRes.ok) {
            const metrics = await metricsRes.json();
            const primaryRow = (metrics.brand_table ?? []).find((r: { is_primary: boolean }) => r.is_primary);
            setResult({
              arrs: metrics.arrs ?? 0,
              sov: primaryRow?.weighted_sov ?? 0,
              arrs_explain: metrics.arrs_explain ?? "",
            });
          }
          setPhase("done");
          return;
        }

        if (updated.status === "failed") {
          throw new Error(updated.error_message ?? "Run failed");
        }
      }

      throw new Error("Timed out waiting for results.");
    } catch (err) {
      setError(String(err));
      setPhase("error");
    }
  };

  const arrsColor = (score: number) => (score >= 70 ? "#f5a623" : score >= 40 ? "#ff6b35" : "#ff4d6d");
  const arrsLabel = (score: number) =>
    score >= 70
      ? tx("audit", "arrsStrong", lang)
      : score >= 40
      ? tx("audit", "arrsModerate", lang)
      : tx("audit", "arrsWeak", lang);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center pt-4">
        <div
          className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.25)" }}
        >
          {tx("audit", "pill", lang)}
        </div>
        <h1 className="text-4xl font-black mb-3">{tx("audit", "title", lang)}</h1>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          {tx("audit", "subtitle", lang)}
        </p>
      </div>

      {/* Idle: form */}
      {phase === "idle" && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8 space-y-5"
          style={{ background: "#0f0f17", border: "1px solid #25253f" }}
        >
          {/* Analysis type selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>
              {lang === "zh" ? "分析类型" : "Analyzing"}
            </label>
            <div className="flex gap-2">
              {(["brand", "seller", "sku"] as AnalysisType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAnalysisType(t)}
                  className="text-sm px-3 py-1.5 rounded-lg border transition-colors"
                  style={
                    analysisType === t
                      ? { background: "#ff6b35", color: "#fff", border: "1px solid #ff6b35" }
                      : { background: "#161625", color: "#7070a0", border: "1px solid #25253f" }
                  }
                >
                  {TYPE_LABELS[t][lang] ?? TYPE_LABELS[t].en}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              {TYPE_CONFIG[analysisType].label[lang] ?? TYPE_CONFIG[analysisType].label.en} *
            </label>
            <input
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
              style={{ background: "#161625", border: "1px solid #25253f", color: "#f0f0f8" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#ff6b35")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#25253f")}
              placeholder={TYPE_CONFIG[analysisType].placeholder[lang] ?? TYPE_CONFIG[analysisType].placeholder.en}
              value={form.brand_name}
              onChange={(e) => setForm((f) => ({ ...f, brand_name: e.target.value }))}
              required
            />
            <p className="text-xs mt-1.5" style={{ color: "#555580" }}>
              {TYPE_CONFIG[analysisType].hint[lang] ?? TYPE_CONFIG[analysisType].hint.en}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              {tx("audit", "labelWebsite", lang)}{" "}
              <span style={{ color: "#7070a0" }} className="font-normal">{tx("audit", "optionalHint", lang)}</span>
            </label>
            <input
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
              style={{ background: "#161625", border: "1px solid #25253f", color: "#f0f0f8" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#ff6b35")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#25253f")}
              placeholder={tx("audit", "phWebsite", lang)}
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{tx("audit", "labelCategory", lang)}</label>
              <select
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                style={{ background: "#161625", border: "1px solid #25253f", color: form.category ? "#f0f0f8" : "#7070a0" }}
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                required
              >
                <option value="" disabled>{tx("audit", "phCategory", lang)}</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{tx("audit", "labelRegion", lang)}</label>
              <select
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                style={{ background: "#161625", border: "1px solid #25253f", color: "#f0f0f8" }}
                value={form.region}
                onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
              >
                <option>US</option>
                <option>UK</option>
                <option>DE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              {tx("audit", "labelCompetitors", lang)}{" "}
              <span style={{ color: "#7070a0" }} className="font-normal">{tx("audit", "commaHint", lang)}</span>
            </label>
            <input
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
              style={{ background: "#161625", border: "1px solid #25253f", color: "#f0f0f8" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#ff6b35")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#25253f")}
              placeholder={tx("audit", "phCompetitors", lang)}
              value={form.competitors}
              onChange={(e) => setForm((f) => ({ ...f, competitors: e.target.value }))}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            {tx("audit", "submit", lang)}
          </button>

          <p className="text-xs text-center" style={{ color: "#7070a0" }}>
            {tx("audit", "runningHint", lang)}
          </p>
        </form>
      )}

      {/* Running: progress */}
      {phase === "running" && (
        <div
          className="rounded-2xl p-10 text-center space-y-6"
          style={{ background: "#0f0f17", border: "1px solid #25253f" }}
        >
          <div className="text-4xl animate-pulse-ring inline-block">◎</div>
          <div>
            <p className="font-semibold mb-1">
              {tx("audit", "runningTitle", lang)} {form.brand_name}{tx("audit", "runningSuffix", lang)}
            </p>
            <p className="text-sm" style={{ color: "#7070a0" }}>{tx("audit", "runningSubtitle", lang)}</p>
          </div>
          <div className="space-y-2">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "#25253f" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: "#ff6b35" }}
              />
            </div>
            <p className="text-xs" style={{ color: "#7070a0" }}>{progress}{tx("audit", "progressLabel", lang)}</p>
          </div>
        </div>
      )}

      {/* Error */}
      {phase === "error" && (
        <div
          className="rounded-2xl p-8 text-center space-y-4"
          style={{ background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.3)" }}
        >
          <p className="font-semibold" style={{ color: "#ff4d6d" }}>{tx("audit", "errorTitle", lang)}</p>
          <p className="text-sm" style={{ color: "#7070a0" }}>{error}</p>
          <button
            onClick={() => setPhase("idle")}
            className="text-sm underline"
            style={{ color: "#ff6b35" }}
          >
            {tx("audit", "retry", lang)}
          </button>
        </div>
      )}

      {/* Done: teaser results */}
      {phase === "done" && result && (
        <div className="space-y-5 animate-fade-up">
          <div
            className="rounded-2xl p-8"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#7070a0" }}>
              {tx("audit", "scoreLabel", lang)} {form.brand_name}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-5xl font-black mb-1" style={{ color: arrsColor(result.arrs) }}>
                  {result.arrs.toFixed(0)}
                </div>
                <div className="text-sm font-medium mb-0.5">{tx("audit", "arrsLabel", lang)}</div>
                <div className="text-xs" style={{ color: arrsColor(result.arrs) }}>
                  {arrsLabel(result.arrs)}
                </div>
              </div>
              <div>
                <div className="text-5xl font-black mb-1" style={{ color: "#f5a623" }}>
                  {result.sov.toFixed(1)}%
                </div>
                <div className="text-sm font-medium mb-0.5">{tx("audit", "sovLabel", lang)}</div>
                <div className="text-xs" style={{ color: "#7070a0" }}>{tx("audit", "sovNote", lang)}</div>
              </div>
            </div>

            {result.arrs_explain && (
              <p className="text-sm p-4 rounded-xl" style={{ background: "#161625", color: "#7070a0" }}>
                {result.arrs_explain}
              </p>
            )}
          </div>

          {/* CTA */}
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "linear-gradient(135deg, #0f0f17 0%, #161625 100%)", border: "1px solid #ff6b35" }}
          >
            <p className="font-bold text-lg mb-2">{tx("audit", "ctaTitle", lang)}</p>
            <p className="text-sm mb-6" style={{ color: "#7070a0" }}>
              {tx("audit", "ctaSub", lang)}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
                style={{ background: "#ff6b35", color: "#fff" }}
              >
                {tx("audit", "bookCall", lang)}
              </a>
              {runId && (
                <a
                  href={`/runs/${runId}`}
                  className="px-6 py-3 rounded-xl text-sm font-medium transition-colors hover:text-white"
                  style={{ border: "1px solid #25253f", color: "#7070a0" }}
                >
                  {tx("audit", "viewReport", lang)}
                </a>
              )}
              <button
                onClick={() => { setPhase("idle"); setResult(null); setProgress(0); setRunId(null); }}
                className="px-6 py-3 rounded-xl text-sm font-medium transition-colors hover:text-white"
                style={{ border: "1px solid #25253f", color: "#7070a0" }}
              >
                {tx("audit", "auditAnother", lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
