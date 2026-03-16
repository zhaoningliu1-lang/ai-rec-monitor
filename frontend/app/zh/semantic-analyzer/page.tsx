"use client";

import { useState } from "react";
import { Brain, CheckCircle, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

interface AnalysisResult {
  score: number;
  readability: string;
  semanticDepth: number;
  structureScore: number;
  suggestions: string[];
  strengths: string[];
}

export default function SemanticAnalyzerPage() {
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = async () => {
    if (!url && !content) return;
    setLoading(true);

    // Simulate API call - in production, this would call the actual API
    setTimeout(() => {
      setResult({
        score: 72,
        readability: "良好",
        semanticDepth: 78,
        structureScore: 68,
        suggestions: [
          "添加更多小标题以改善内容结构",
          "加入更具体的技术规格说明",
          "添加竞品对比表格",
          "增加核心产品功能的内容深度",
        ],
        strengths: [
          "产品描述清晰易懂",
          "合理运用要点列表",
          "规范的语义化 HTML 结构",
          "相关关键词自然融入",
        ],
      });
      setLoading(false);
    }, 2000);
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
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "rgba(255,107,53,0.15)", color: "#ff6b35" }}>新功能</span>
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#f0f0f8" }}>语义分析器</h1>
          <p className="text-base" style={{ color: "#7070a0" }}>
            分析您的内容对 AI 理解的优化程度，获取可执行建议以提高 AI 引用率。
          </p>
        </div>

        {/* Input Section */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "#f0f0f8" }}>待分析的 URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/product-page"
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: "#1a1a2e", border: "1px solid #25253f", color: "#f0f0f8" }}
              />
            </div>

            <div className="text-center text-xs" style={{ color: "#5050a0" }}>或</div>

            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "#f0f0f8" }}>粘贴内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="在此粘贴您的产品描述、博客文章或其他内容..."
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
                  分析中...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  开始分析
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
              <h2 className="text-lg font-semibold mb-6" style={{ color: "#f0f0f8" }}>分析结果</h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl p-4 text-center" style={{ background: "#1a1a2e" }}>
                  <div className="text-3xl font-bold mb-1" style={{ color: getScoreColor(result.score) }}>{result.score}</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>综合评分</div>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: "#1a1a2e" }}>
                  <div className="text-3xl font-bold mb-1" style={{ color: getScoreColor(result.semanticDepth) }}>{result.semanticDepth}</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>语义深度</div>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: "#1a1a2e" }}>
                  <div className="text-3xl font-bold mb-1" style={{ color: getScoreColor(result.structureScore) }}>{result.structureScore}</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>结构评分</div>
                </div>
              </div>

              <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4" style={{ color: "#22c55e" }} />
                  <span className="text-sm font-medium" style={{ color: "#22c55e" }}>可读性：{result.readability}</span>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="rounded-2xl p-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "#22c55e" }}>✓ 优势</h3>
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
              <h3 className="text-sm font-semibold mb-4" style={{ color: "#eab308" }}>⚡ 改进建议</h3>
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
                需要详细的优化方案？
              </p>
              <a
                href="/zh/geo-action"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-xl font-medium"
                style={{ background: "#ff6b35", color: "#fff" }}
              >
                获取 AI 可见度方案 <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-6" style={{ color: "#f0f0f8" }}>语义分析工作原理</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="text-xs font-bold mb-2" style={{ color: "#ff6b35" }}>01</div>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>内容解析</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>AI 分析您的内容结构、句子复杂度和语义关系。</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="text-xs font-bold mb-2" style={{ color: "#ff6b35" }}>02</div>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>深度评分</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>评估主题深度、专业信号和事实密度。</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="text-xs font-bold mb-2" style={{ color: "#ff6b35" }}>03</div>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>可操作洞察</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>获取具体建议以提高 AI 引用潜力。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
