"use client";

import { useState } from "react";
import { Brain, CheckCircle, AlertCircle, ArrowRight, Loader2, CreditCard } from "lucide-react";


interface AnalysisResult {
  score: number;
  readability: string;
  semanticDepth: number;
  structureScore: number;
  suggestions: string[];
  strengths: string[];
  credits_remaining?: number;
  credits_deducted?: number;
}

const translations = {
  en: {
    title: "Semantic Analyzer",
    subtitle: "Analyze how well your content is structured for AI understanding. Get actionable insights to improve AI citation rates.",
    urlLabel: "URL to analyze",
    urlPlaceholder: "https://example.com/product-page",
    or: "or",
    contentLabel: "Paste content",
    contentPlaceholder: "Paste your product description, blog post, or content here...",
    analyze: "Analyze Content",
    analyzing: "Analyzing...",
    results: "Analysis Results",
    overallScore: "Overall Score",
    semanticDepth: "Semantic Depth",
    structureScore: "Structure Score",
    readability: "Readability",
    strengths: "Strengths",
    improvements: "Improvements",
    getPlan: "Get AI Visibility Plan",
    howItWorks: "How Semantic Analysis Works",
    step1Title: "Content Parsing",
    step1Desc: "AI analyzes your content structure, sentence complexity, and semantic relationships.",
    step2Title: "Depth Scoring",
    step2Desc: "Evaluates topic depth, expertise signals, and factual density.",
    step3Title: "Actionable Insights",
    step3Desc: "Get specific recommendations to improve AI citation potential.",
    credits: "credits",
    noCredits: "Not enough credits",
    upgrade: "Upgrade to continue",
  },
  zh: {
    title: "语义分析器",
    subtitle: "分析你的内容对AI有多友好。获取可操作的建议来提高AI引用率。",
    urlLabel: "要分析的URL",
    urlPlaceholder: "https://example.com/product-page",
    or: "或",
    contentLabel: "粘贴内容",
    contentPlaceholder: "在这里粘贴你的产品描述、博客文章或内容...",
    analyze: "分析内容",
    analyzing: "分析中...",
    results: "分析结果",
    overallScore: "综合评分",
    semanticDepth: "语义深度",
    structureScore: "结构评分",
    readability: "可读性",
    strengths: "优势",
    improvements: "改进建议",
    getPlan: "获取AI可见度计划",
    howItWorks: "语义分析原理",
    step1Title: "内容解析",
    step1Desc: "AI分析你的内容结构、句子复杂度和语义关系。",
    step2Title: "深度评分",
    step2Desc: "评估主题深度、专业信号和事实密度。",
    step3Title: "可操作建议",
    step3Desc: "获取具体的AI引用优化建议。",
    credits: "积分",
    noCredits: "积分不足",
    upgrade: "升级以继续",
  },
};

export default function SemanticAnalyzerPage() {
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isZh = typeof window !== "undefined" && window.location?.pathname?.startsWith("/zh");
  const t = translations[isZh ? "zh" : "en"];

  const analyze = async () => {
    if (!url && !content) return;
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/geo-tools/semantic/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url || null, content: content || null }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        if (data.detail?.code === "credits_exhausted") {
          setError(`${t.noCredits}: ${data.detail.balance} ${t.credits} remaining`);
          setLoading(false);
          return;
        }
        throw new Error(data.detail?.message || "Analysis failed");
      }
      
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#eab308";
    return "#ef4444";
  };

  return (
    <div className="min-h-screen" style={{ background: "#09090f" }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl" style={{ background: "rgba(255,107,53,0.15)" }}>
              <Brain className="w-6 h-6" style={{ color: "#ff6b35" }} />
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "rgba(255,107,53,0.15)", color: "#ff6b35" }}>NEW</span>
            {result?.credits_deducted && (
              <span className="text-xs" style={{ color: "#7070a0" }}>
                -{result.credits_deducted} {t.credits}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#f0f0f8" }}>{t.title}</h1>
          <p className="text-base" style={{ color: "#7070a0" }}>
            {t.subtitle}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-xl p-4 mb-6" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <div className="flex items-center gap-2 text-sm" style={{ color: "#ef4444" }}>
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "#f0f0f8" }}>{t.urlLabel}</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t.urlPlaceholder}
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: "#1a1a2e", border: "1px solid #25253f", color: "#f0f0f8" }}
              />
            </div>
            
            <div className="text-center text-xs" style={{ color: "#5050a0" }}>{t.or}</div>
            
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "#f0f0f8" }}>{t.contentLabel}</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t.contentPlaceholder}
                rows={6}
                className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                style={{ background: "#1a1a2e", border: "1px solid #25253f", color: "#f0f0f8" }}
              />
            </div>

            <button
              onClick={analyze}
              disabled={loading || (!url && !content)}
              className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
              style={{ 
                background: loading || (!url && !content) ? "#25253f" : "#ff6b35",
                color: loading || (!url && !content) ? "#5050a0" : "#fff"
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.analyzing}
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  {t.analyze}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Score Overview */}
            <div className="rounded-2xl p-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <h2 className="text-lg font-semibold mb-6" style={{ color: "#f0f0f8" }}>{t.results}</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl p-4 text-center" style={{ background: "#1a1a2e" }}>
                  <div className="text-3xl font-bold mb-1" style={{ color: getScoreColor(result.score) }}>{result.score}</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>{t.overallScore}</div>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: "#1a1a2e" }}>
                  <div className="text-3xl font-bold mb-1" style={{ color: getScoreColor(result.semanticDepth) }}>{result.semanticDepth}</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>{t.semanticDepth}</div>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: "#1a1a2e" }}>
                  <div className="text-3xl font-bold mb-1" style={{ color: getScoreColor(result.structureScore) }}>{result.structureScore}</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>{t.structureScore}</div>
                </div>
              </div>

              <div className="rounded-xl p-4" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: "#22c55e" }} />
                  <span className="text-sm font-medium" style={{ color: "#22c55e" }}>{t.readability}: {result.readability}</span>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="rounded-2xl p-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "#22c55e" }}>✓ {t.strengths}</h3>
              <ul className="space-y-2">
                {result.strengths.map((strength, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "#a0a0c0" }}>
                    <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: "#22c55e" }} />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="rounded-2xl p-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "#eab308" }}>⚡ {t.improvements}</h3>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "#a0a0c0" }}>
                    <AlertCircle className="w-3 h-3 flex-shrink-0" style={{ color: "#eab308" }} />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="rounded-2xl p-6 text-center" style={{ background: "linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(255,107,53,0.05) 100%)", border: "1px solid rgba(255,107,53,0.2)" }}>
              <p className="text-sm mb-4" style={{ color: "#a0a0c0" }}>
                {isZh ? "想要详细的优化计划？" : "Want a detailed optimization plan?"}
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
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="text-xs font-bold mb-2" style={{ color: "#ff6b35" }}>01</div>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>{t.step1Title}</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>{t.step1Desc}</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="text-xs font-bold mb-2" style={{ color: "#ff6b35" }}>02</div>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>{t.step2Title}</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>{t.step2Desc}</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="text-xs font-bold mb-2" style={{ color: "#ff6b35" }}>03</div>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>{t.step3Title}</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
