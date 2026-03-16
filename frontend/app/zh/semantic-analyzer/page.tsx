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
        readability: "Good",
        semanticDepth: 78,
        structureScore: 68,
        suggestions: [
          "Add more subheadings to improve content structure",
          "Include more specific technical specifications",
          "Add comparison tables with competitors",
          "Increase content depth for key product features",
        ],
        strengths: [
          "Clear product descriptions",
          "Good use of bullet points",
          "Proper semantic HTML structure",
          "Relevant keywords naturally integrated",
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
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "rgba(255,107,53,0.15)", color: "#ff6b35" }}>NEW</span>
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#f0f0f8" }}>Semantic Analyzer</h1>
          <p className="text-base" style={{ color: "#7070a0" }}>
            Analyze how well your content is structured for AI understanding. Get actionable insights to improve AI citation rates.
          </p>
        </div>

        {/* Input Section */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "#f0f0f8" }}>URL to analyze</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/product-page"
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: "#1a1a2e", border: "1px solid #25253f", color: "#f0f0f8" }}
              />
            </div>
            
            <div className="text-center text-xs" style={{ color: "#5050a0" }}>or</div>
            
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "#f0f0f8" }}>Paste content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your product description, blog post, or content here..."
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
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Analyze Content
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
              <h2 className="text-lg font-semibold mb-6" style={{ color: "#f0f0f8" }}>Analysis Results</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl p-4 text-center" style={{ background: "#1a1a2e" }}>
                  <div className="text-3xl font-bold mb-1" style={{ color: getScoreColor(result.score) }}>{result.score}</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>Overall Score</div>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: "#1a1a2e" }}>
                  <div className="text-3xl font-bold mb-1" style={{ color: getScoreColor(result.semanticDepth) }}>{result.semanticDepth}</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>Semantic Depth</div>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: "#1a1a2e" }}>
                  <div className="text-3xl font-bold mb-1" style={{ color: getScoreColor(result.structureScore) }}>{result.structureScore}</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>Structure Score</div>
                </div>
              </div>

              <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4" style={{ color: "#22c55e" }} />
                  <span className="text-sm font-medium" style={{ color: "#22c55e" }}>Readability: {result.readability}</span>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="rounded-2xl p-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "#22c55e" }}>✓ Strengths</h3>
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
              <h3 className="text-sm font-semibold mb-4" style={{ color: "#eab308" }}>⚡ Improvements</h3>
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
                Want a detailed optimization plan?
              </p>
              <a
                href="/geo-action"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-xl font-medium"
                style={{ background: "#ff6b35", color: "#fff" }}
              >
                Get AI Visibility Plan <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-6" style={{ color: "#f0f0f8" }}>How Semantic Analysis Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="text-xs font-bold mb-2" style={{ color: "#ff6b35" }}>01</div>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>Content Parsing</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>AI analyzes your content structure, sentence complexity, and semantic relationships.</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="text-xs font-bold mb-2" style={{ color: "#ff6b35" }}>02</div>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>Depth Scoring</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>Evaluates topic depth, expertise signals, and factual density.</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="text-xs font-bold mb-2" style={{ color: "#ff6b35" }}>03</div>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>Actionable Insights</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>Get specific recommendations to improve AI citation potential.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
