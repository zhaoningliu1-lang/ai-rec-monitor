"use client";

import { useState, useEffect } from "react";
import { Lang, tx } from "@/lib/i18n";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";

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

/* Animated count-up number */
function CountUp({ target, color }: { target: number; color: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, target, { duration: 1.2, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [target, count, rounded]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-5xl font-black"
      style={{ color }}
    >
      {display}
    </motion.span>
  );
}

/* Animated count-up for decimal (SOV) */
function CountUpDecimal({ target, color }: { target: number; color: string }) {
  const count = useMotionValue(0);
  const formatted = useTransform(count, (v) => v.toFixed(1));
  const [display, setDisplay] = useState("0.0");

  useEffect(() => {
    const controls = animate(count, target, { duration: 1.2, ease: "easeOut" });
    const unsub = formatted.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [target, count, formatted]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-5xl font-black"
      style={{ color }}
    >
      {display}%
    </motion.span>
  );
}

const PROGRESS_STEPS = [
  { en: "Querying AI engines", zh: "查询 AI 引擎" },
  { en: "Analyzing responses", zh: "分析回复内容" },
  { en: "Calculating scores", zh: "计算分数" },
];

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

  const currentStep = progress < 33 ? 0 : progress < 66 ? 1 : 2;

  const whatYouGet = lang === "zh"
    ? [
        "GEO 可见性分数 + AI 引擎排名",
        "SOV 份额与竞品对比分析",
        "AI 引用来源质量评估",
        "改善建议和行动方案",
      ]
    : [
        "GEO visibility score + AI engine rankings",
        "SOV share vs competitor benchmarking",
        "AI citation source quality assessment",
        "Improvement recommendations and action plan",
      ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="pt-4">
        <div
          className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.25)" }}
        >
          {tx("audit", "pill", lang)}
        </div>
        <h1 className="text-4xl font-black mb-3">{tx("audit", "title", lang)}</h1>
        <p className="text-sm max-w-xl" style={{ color: "#7070a0" }}>
          {tx("audit", "subtitle", lang)}
        </p>
      </div>

      {/* Idle: two-column form */}
      {phase === "idle" && (
        <div className="grid md:grid-cols-[1fr_340px] gap-6">
          {/* Left: form */}
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

          {/* Right: What you get card */}
          <div
            className="rounded-2xl p-6 space-y-5 h-fit"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="text-sm font-bold" style={{ color: "#f0f0f8" }}>
              {lang === "zh" ? "你将获得" : "What you get"}
            </div>
            <ul className="space-y-3">
              {whatYouGet.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: "#7070a0" }}>
                  <Check size={16} className="shrink-0 mt-0.5" style={{ color: "#22c55e" }} />
                  {item}
                </li>
              ))}
            </ul>
            <div
              className="rounded-xl p-4 text-xs leading-relaxed"
              style={{ background: "#161625", color: "#555580" }}
            >
              {lang === "zh"
                ? "免费审计包含单品牌、单次分析。完整报告需注册账户。"
                : "Free audit includes single brand, one-time analysis. Full report requires account signup."}
            </div>
          </div>
        </div>
      )}

      {/* Running: 3-step progress */}
      {phase === "running" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl p-10 space-y-8"
          style={{ background: "#0f0f17", border: "1px solid #25253f" }}
        >
          <div className="text-center">
            <p className="font-semibold mb-1">
              {tx("audit", "runningTitle", lang)} {form.brand_name}{tx("audit", "runningSuffix", lang)}
            </p>
            <p className="text-sm" style={{ color: "#7070a0" }}>{tx("audit", "runningSubtitle", lang)}</p>
          </div>

          {/* 3-step indicator */}
          <div className="flex items-center justify-center gap-2">
            {PROGRESS_STEPS.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300${
                      i === currentStep ? " animate-pulse" : ""
                    }`}
                    style={{
                      background: i <= currentStep ? "rgba(255,107,53,0.15)" : "#161625",
                      border: i === currentStep
                        ? "2px solid #ff6b35"
                        : i < currentStep
                        ? "2px solid #22c55e"
                        : "1px solid #25253f",
                      color: i < currentStep ? "#22c55e" : i === currentStep ? "#ff6b35" : "#7070a0",
                    }}
                  >
                    {i < currentStep ? (
                      <Check size={16} />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className="text-xs text-center max-w-[80px]"
                    style={{ color: i <= currentStep ? "#f0f0f8" : "#7070a0" }}
                  >
                    {step[lang] ?? step.en}
                  </span>
                </div>
                {i < PROGRESS_STEPS.length - 1 && (
                  <div
                    className="w-12 h-px mb-5"
                    style={{ background: i < currentStep ? "#22c55e" : "#25253f" }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "#25253f" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "#ff6b35" }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-center" style={{ color: "#7070a0" }}>{progress}{tx("audit", "progressLabel", lang)}</p>
          </div>
        </motion.div>
      )}

      {/* Error: inline box with AlertCircle */}
      {phase === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl p-8 space-y-4 flex flex-col items-center"
          style={{ background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.3)" }}
        >
          <AlertCircle size={36} style={{ color: "#ff4d6d" }} />
          <p className="font-semibold" style={{ color: "#ff4d6d" }}>{tx("audit", "errorTitle", lang)}</p>
          <p className="text-sm text-center max-w-md" style={{ color: "#7070a0" }}>{error}</p>
          <button
            onClick={() => setPhase("idle")}
            className="text-sm font-medium px-5 py-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ color: "#ff6b35", border: "1px solid rgba(255,107,53,0.3)" }}
          >
            {tx("audit", "retry", lang)}
          </button>
        </motion.div>
      )}

      {/* Done: animated results */}
      {phase === "done" && result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-5"
        >
          <div
            className="rounded-2xl p-8"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#7070a0" }}>
              {tx("audit", "scoreLabel", lang)} {form.brand_name}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <CountUp target={result.arrs} color={arrsColor(result.arrs)} />
                <div className="text-sm font-medium mb-0.5 mt-1">{tx("audit", "arrsLabel", lang)}</div>
                <div className="text-xs" style={{ color: arrsColor(result.arrs) }}>
                  {arrsLabel(result.arrs)}
                </div>
              </div>
              <div>
                <CountUpDecimal target={result.sov} color="#f5a623" />
                <div className="text-sm font-medium mb-0.5 mt-1">{tx("audit", "sovLabel", lang)}</div>
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
        </motion.div>
      )}
    </div>
  );
}
