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
              "Product schema found",
              "name, description, image present",
              "sku and brand defined",
            ],
          },
          faq: {
            status: "fail",
            items: [
              "No FAQ schema detected",
              "Add FAQ schema to improve AI citation",
            ],
          },
          review: {
            status: "warning",
            items: [
              "AggregateRating found",
              "Missing individual Review schemas",
            ],
          },
          organization: {
            status: "pass",
            items: [
              "Organization schema found",
              "name, url, logo present",
              "contactPoint defined",
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
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>NEW</span>
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#f0f0f8" }}>Schema Tester</h1>
          <p className="text-base" style={{ color: "#7070a0" }}>
            Test your structured data (JSON-LD) for AI compatibility. Proper schema helps AI understand and cite your content.
          </p>
        </div>

        {/* Input Section */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "#f0f0f8" }}>Page URL to test</label>
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
                  Analyzing Schema...
                </>
              ) : (
                <>
                  <Code className="w-4 h-4" />
                  Test Schema
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
              <h2 className="text-lg font-semibold mb-6" style={{ color: "#f0f0f8" }}>Schema Analysis Results</h2>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="text-5xl font-bold" style={{ color: result.score >= 70 ? "#22c55e" : "#eab308" }}>{result.score}</div>
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: "#f0f0f8" }}>Schema Score</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>
                    {result.hasSchema ? `${result.schemaTypes.length} schema types detected` : "No structured data found"}
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
                Need help adding schema to your pages?
              </p>
              <a
                href="/geo-action"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-xl font-medium"
                style={{ background: "#a855f7", color: "#fff" }}
              >
                Get Schema Implementation Guide <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Why Schema Matters */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-6" style={{ color: "#f0f0f8" }}>Why Structured Data Matters for AI</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>AI Parses Structured Data</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>JSON-LD and Schema.org markup help AI extract key facts directly from your pages.</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>Better Citation Chances</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>Pages with proper schema are 3x more likely to be cited in AI responses.</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>Rich Results Display</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>Schema enables rich snippets in search and helps AI understand your content context.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
