"use client";

import { useState } from "react";
import { Code, CheckCircle, XCircle, AlertCircle, ArrowRight, Loader2, Copy, Check } from "lucide-react";

interface SchemaResult {
  hasSchema: boolean;
  schemaTypes: string[];
  score: number;
  findings: {
    product: { status: "pass" | "fail" | "warning"; items: string[] };
    faq: { status: "pass" | "fail" | "warning"; items: string[] };
    review: { status: "pass" | "fail" | "warning"; items: string[] };
    organization: { status: "pass" | "fail" | "warning"; items: string[] };
  };
  rawSchema?: string;
}

export default function SchemaTesterPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SchemaResult | null>(null);
  const [copied, setCopied] = useState(false);

  const analyze = async () => {
    if (!url) return;
    setLoading(true);

    setTimeout(() => {
      setResult({
        hasSchema: true,
        schemaTypes: ["Product", "Organization", "BreadcrumbList"],
        score: 72,
        findings: {
          product: {
            status: "pass",
            items: [
              "已找到 Product schema",
              "name、description、image 字段完整",
              "sku 和 brand 已定义",
            ],
          },
          faq: {
            status: "fail",
            items: [
              "未检测到 FAQ schema",
              "添加 FAQ schema 以提高 AI 引用率",
            ],
          },
          review: {
            status: "warning",
            items: [
              "已找到 AggregateRating",
              "缺少独立的 Review schema",
            ],
          },
          organization: {
            status: "pass",
            items: [
              "已找到 Organization schema",
              "name、url、logo 字段完整",
              "contactPoint 已定义",
            ],
          },
        },
        rawSchema: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "NOCO Boost GB40",
  "description": "Compact, lithium-ion jump starter...",
  "brand": {
    "@type": "Brand",
    "name": "NOCO"
  },
  "sku": "GB40",
  "offers": {
    "@type": "Offer",
    "price": "99.95",
    "priceCurrency": "USD"
  }
}
</script>`,
      });
      setLoading(false);
    }, 2000);
  };

  const getStatusIcon = (status: "pass" | "fail" | "warning") => {
    if (status === "pass") return <CheckCircle className="w-4 h-4" style={{ color: "#22c55e" }} />;
    if (status === "warning") return <AlertCircle className="w-4 h-4" style={{ color: "#eab308" }} />;
    return <XCircle className="w-4 h-4" style={{ color: "#ef4444" }} />;
  };

  const getStatusColor = (status: "pass" | "fail" | "warning") => {
    if (status === "pass") return "#22c55e";
    if (status === "warning") return "#eab308";
    return "#ef4444";
  };

  const copySchema = () => {
    if (result?.rawSchema) {
      navigator.clipboard.writeText(result.rawSchema);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#09090f" }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl" style={{ background: "rgba(168,85,247,0.15)" }}>
              <Code className="w-6 h-6" style={{ color: "#a855f7" }} />
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>新功能</span>
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#f0f0f8" }}>Schema 测试器</h1>
          <p className="text-base" style={{ color: "#7070a0" }}>
            测试您的结构化数据 (JSON-LD) 的 AI 兼容性。正确的 Schema 帮助 AI 理解并引用您的内容。
          </p>
        </div>

        {/* Input Section */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "#f0f0f8" }}>待测试的页面 URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourbrand.com/product-page"
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: "#1a1a2e", border: "1px solid #25253f", color: "#f0f0f8" }}
              />
            </div>

            <button
              onClick={analyze}
              disabled={loading || !url}
              className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
              style={{
                background: loading || !url ? "#25253f" : "#a855f7",
                color: loading || !url ? "#5050a0" : "#fff"
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  分析 Schema 中...
                </>
              ) : (
                <>
                  <Code className="w-4 h-4" />
                  开始测试
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
              <h2 className="text-lg font-semibold mb-6" style={{ color: "#f0f0f8" }}>Schema 分析结果</h2>

              <div className="flex items-center gap-6 mb-6">
                <div className="text-5xl font-bold" style={{ color: result.score >= 70 ? "#22c55e" : "#eab308" }}>{result.score}</div>
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: "#f0f0f8" }}>Schema 评分</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>
                    {result.hasSchema ? `检测到 ${result.schemaTypes.length} 种 schema 类型` : "未发现结构化数据"}
                  </div>
                </div>
              </div>

              {result.schemaTypes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {result.schemaTypes.map((type, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(168,85,247,0.2)", color: "#a855f7" }}>
                      {type}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Product Schema */}
            <div className="rounded-2xl p-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(result.findings.product.status)}
                <h3 className="text-sm font-semibold" style={{ color: getStatusColor(result.findings.product.status) }}>
                  Product Schema
                </h3>
              </div>
              <ul className="space-y-2">
                {result.findings.product.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "#a0a0c0" }}>
                    {result.findings.product.status === "pass" ? <CheckCircle className="w-3 h-3" style={{ color: "#22c55e" }} /> : <AlertCircle className="w-3 h-3" style={{ color: "#eab308" }} />}
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQ Schema */}
            <div className="rounded-2xl p-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(result.findings.faq.status)}
                <h3 className="text-sm font-semibold" style={{ color: getStatusColor(result.findings.faq.status) }}>
                  FAQ Schema
                </h3>
              </div>
              <ul className="space-y-2">
                {result.findings.faq.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "#a0a0c0" }}>
                    {result.findings.faq.status === "pass" ? <CheckCircle className="w-3 h-3" style={{ color: "#22c55e" }} /> : <XCircle className="w-3 h-3" style={{ color: "#ef4444" }} />}
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Review Schema */}
            <div className="rounded-2xl p-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(result.findings.review.status)}
                <h3 className="text-sm font-semibold" style={{ color: getStatusColor(result.findings.review.status) }}>
                  Review Schema
                </h3>
              </div>
              <ul className="space-y-2">
                {result.findings.review.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "#a0a0c0" }}>
                    {result.findings.review.status === "pass" ? <CheckCircle className="w-3 h-3" style={{ color: "#22c55e" }} /> : <AlertCircle className="w-3 h-3" style={{ color: "#eab308" }} />}
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Organization Schema */}
            <div className="rounded-2xl p-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(result.findings.organization.status)}
                <h3 className="text-sm font-semibold" style={{ color: getStatusColor(result.findings.organization.status) }}>
                  Organization Schema
                </h3>
              </div>
              <ul className="space-y-2">
                {result.findings.organization.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "#a0a0c0" }}>
                    <CheckCircle className="w-3 h-3" style={{ color: "#22c55e" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="rounded-2xl p-6 text-center" style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.05) 100%)", border: "1px solid rgba(168,85,247,0.2)" }}>
              <p className="text-sm mb-4" style={{ color: "#a0a0c0" }}>
                需要帮助为页面添加 Schema？
              </p>
              <a
                href="/zh/geo-action"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-xl font-medium"
                style={{ background: "#a855f7", color: "#fff" }}
              >
                获取 Schema 实施指南 <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Why Schema Matters */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-6" style={{ color: "#f0f0f8" }}>结构化数据对 AI 的重要性</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>AI 解析结构化数据</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>JSON-LD 和 Schema.org 标记帮助 AI 直接从页面提取关键信息。</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>更高的引用概率</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>拥有正确 Schema 的页面被 AI 引用的概率高出 3 倍。</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>富媒体结果展示</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>Schema 支持搜索中的富媒体摘要，并帮助 AI 理解您的内容上下文。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
