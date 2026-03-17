"use client";

import { useState } from "react";
import { MessageSquare, CheckCircle, AlertCircle, ArrowRight, Loader2, Code, Copy } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
  schema_format?: object;
}

interface FAQResult {
  product: string;
  faqs: FAQ[];
  credits_remaining?: number;
  credits_deducted?: number;
}

const translations = {
  en: {
    title: "FAQ Generator",
    subtitle: "Generate AI-optimized FAQ content with structured schema markup. FAQs formatted for AI citation and Google's FAQ rich results.",
    productLabel: "Product name",
    productPlaceholder: "e.g. Electric Hot Pot",
    categoryLabel: "Category",
    categoryPlaceholder: "e.g. Kitchen Appliances",
    countLabel: "Number of FAQs",
    generate: "Generate FAQs",
    generating: "Generating...",
    results: "Generated FAQs",
    copySchema: "Copy Schema",
    copied: "Copied!",
    showSchema: "View JSON-LD Schema",
    hideSchema: "Hide Schema",
    getPlan: "Get Full AI Visibility Plan",
    howItWorks: "How FAQ Generation Works",
    step1Title: "AI-Powered Questions",
    step1Desc: "GPT-4o generates natural questions buyers actually ask about your product.",
    step2Title: "Structured Answers",
    step2Desc: "Concise, factual answers (50-150 words) optimized for AI citation.",
    step3Title: "Schema Markup",
    step3Desc: "Ready-to-paste FAQPage JSON-LD schema for rich search results.",
    credits: "credits",
    noCredits: "Not enough credits",
    upgrade: "Upgrade to continue",
    faq: "FAQ",
  },
  zh: {
    title: "FAQ 生成器",
    subtitle: "生成AI优化的FAQ内容，含结构化Schema标记。专为AI引用和谷歌FAQ富结果优化。",
    productLabel: "产品名称",
    productPlaceholder: "例如：电热锅",
    categoryLabel: "品类",
    categoryPlaceholder: "例如：厨房电器",
    countLabel: "FAQ数量",
    generate: "生成FAQ",
    generating: "生成中...",
    results: "生成的FAQ",
    copySchema: "复制Schema",
    copied: "已复制！",
    showSchema: "查看JSON-LD Schema",
    hideSchema: "隐藏Schema",
    getPlan: "获取完整AI可见度计划",
    howItWorks: "FAQ生成原理",
    step1Title: "AI驱动的问题",
    step1Desc: "GPT-4o生成买家真实会问的自然问题。",
    step2Title: "结构化答案",
    step2Desc: "简洁事实性答案（50-150字），针对AI引用优化。",
    step3Title: "Schema标记",
    step3Desc: "可直接粘贴的FAQPage JSON-LD Schema，用于富结果。",
    credits: "积分",
    noCredits: "积分不足",
    upgrade: "升级以继续",
    faq: "FAQ",
  },
};

export default function FAQGeneratorPage() {
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FAQResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSchema, setExpandedSchema] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const isZh = typeof window !== "undefined" && window.location?.pathname?.startsWith("/zh");
  const t = translations[isZh ? "zh" : "en"];

  const generate = async () => {
    if (!product || !category) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/geo-tools/faq/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, category, count }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.detail?.code === "credits_exhausted") {
          setError(`${t.noCredits}: ${data.detail.balance} ${t.credits} remaining`);
          setLoading(false);
          return;
        }
        throw new Error(data.detail?.message || "Generation failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const copyAllSchemas = () => {
    if (!result) return;
    const schemas = result.faqs.map((f) => f.schema_format).filter(Boolean);
    navigator.clipboard.writeText(JSON.stringify(schemas, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: "#09090f" }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl" style={{ background: "rgba(255,107,53,0.15)" }}>
              <MessageSquare className="w-6 h-6" style={{ color: "#ff6b35" }} />
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "rgba(255,107,53,0.15)", color: "#ff6b35" }}>NEW</span>
            {result?.credits_deducted && (
              <span className="text-xs" style={{ color: "#7070a0" }}>
                -{result.credits_deducted} {t.credits}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#f0f0f8" }}>{t.title}</h1>
          <p className="text-base" style={{ color: "#7070a0" }}>{t.subtitle}</p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl p-4 mb-6" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <div className="flex items-center gap-2 text-sm" style={{ color: "#ef4444" }}>
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "#f0f0f8" }}>{t.productLabel}</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder={t.productPlaceholder}
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: "#1a1a2e", border: "1px solid #25253f", color: "#f0f0f8" }}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "#f0f0f8" }}>{t.categoryLabel}</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={t.categoryPlaceholder}
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: "#1a1a2e", border: "1px solid #25253f", color: "#f0f0f8" }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block" style={{ color: "#f0f0f8" }}>
              {t.countLabel}: <span style={{ color: "#ff6b35" }}>{count}</span>
            </label>
            <input
              type="range"
              min={3}
              max={10}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: "#ff6b35" }}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: "#5050a0" }}>
              <span>3</span><span>10</span>
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading || !product || !category}
            className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
            style={{
              background: loading || !product || !category ? "#25253f" : "#ff6b35",
              color: loading || !product || !category ? "#5050a0" : "#fff",
            }}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />{t.generating}</>
            ) : (
              <><MessageSquare className="w-4 h-4" />{t.generate}</>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" style={{ color: "#f0f0f8" }}>{t.results}</h2>
              <button
                onClick={copyAllSchemas}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: copied ? "rgba(34,197,94,0.15)" : "rgba(255,107,53,0.15)", color: copied ? "#22c55e" : "#ff6b35", border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(255,107,53,0.3)"}` }}
              >
                {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? t.copied : t.copySchema}
              </button>
            </div>

            {result.faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl p-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-xs font-bold px-2 py-1 rounded-full shrink-0 mt-0.5" style={{ background: "rgba(255,107,53,0.15)", color: "#ff6b35" }}>
                    {t.faq} {i + 1}
                  </span>
                  <h3 className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>{faq.question}</h3>
                </div>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: "#a0a0c0" }}>{faq.answer}</p>

                {faq.schema_format && (
                  <div>
                    <button
                      onClick={() => setExpandedSchema(expandedSchema === i ? null : i)}
                      className="flex items-center gap-1.5 text-xs transition-colors"
                      style={{ color: "#7070a0", background: "none", border: "none", cursor: "pointer" }}
                    >
                      <Code className="w-3 h-3" />
                      {expandedSchema === i ? t.hideSchema : t.showSchema}
                    </button>
                    {expandedSchema === i && (
                      <pre
                        className="mt-3 p-4 rounded-xl text-xs overflow-x-auto"
                        style={{ background: "#1a1a2e", color: "#a0a0c0", border: "1px solid #25253f" }}
                      >
                        {JSON.stringify(faq.schema_format, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* CTA */}
            <div className="rounded-2xl p-6 text-center mt-4" style={{ background: "linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(255,107,53,0.05) 100%)", border: "1px solid rgba(255,107,53,0.2)" }}>
              <p className="text-sm mb-4" style={{ color: "#a0a0c0" }}>
                {isZh ? "想要完整的AI可见度提升计划？" : "Want a complete AI visibility improvement plan?"}
              </p>
              <a
                href="/geo-action"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-xl font-medium"
                style={{ background: "#ff6b35", color: "#fff" }}
              >
                {t.getPlan} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-6" style={{ color: "#f0f0f8" }}>{t.howItWorks}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { num: "01", title: t.step1Title, desc: t.step1Desc },
              { num: "02", title: t.step2Title, desc: t.step2Desc },
              { num: "03", title: t.step3Title, desc: t.step3Desc },
            ].map((step) => (
              <div key={step.num} className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
                <div className="text-xs font-bold mb-2" style={{ color: "#ff6b35" }}>{step.num}</div>
                <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>{step.title}</h3>
                <p className="text-xs" style={{ color: "#7070a0" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
