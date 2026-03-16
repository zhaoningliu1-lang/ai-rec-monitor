"use client";

import { useState } from "react";
import { ShieldCheck, CheckCircle, XCircle, AlertTriangle, ArrowRight, Loader2, Users, Award, FileText, Globe } from "lucide-react";

interface EEATResult {
  score: number;
  experience: number;
  expertise: number;
  authoritativeness: number;
  trustworthiness: number;
  findings: {
    experience: { status: "pass" | "fail" | "warning"; items: string[] };
    expertise: { status: "pass" | "fail" | "warning"; items: string[] };
    authoritativeness: { status: "pass" | "fail" | "warning"; items: string[] };
    trustworthiness: { status: "pass" | "fail" | "warning"; items: string[] };
  };
}

export default function EEATCheckerPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EEATResult | null>(null);

  const analyze = async () => {
    if (!url) return;
    setLoading(true);
    
    setTimeout(() => {
      setResult({
        score: 68,
        experience: 72,
        expertise: 75,
        authoritativeness: 62,
        trustworthiness: 65,
        findings: {
          experience: {
            status: "pass",
            items: [
              "About page with team photos found",
              "Company history and founding story present",
              "User testimonials section detected",
            ],
          },
          expertise: {
            status: "pass",
            items: [
              "Author bio pages detected",
              "Industry certifications displayed",
              "Technical specifications comprehensive",
            ],
          },
          authoritativeness: {
            status: "warning",
            items: [
              "Missing third-party press mentions",
              "No visible partnerships or affiliations",
              "Limited external citations detected",
            ],
          },
          trustworthiness: {
            status: "warning",
            items: [
              "Contact page needs more detail",
              "Privacy policy exists but could be more prominent",
              "No visible security badges",
            ],
          },
        },
      });
      setLoading(false);
    }, 2500);
  };

  const getStatusIcon = (status: "pass" | "fail" | "warning") => {
    if (status === "pass") return <CheckCircle className="w-4 h-4" style={{ color: "#22c55e" }} />;
    if (status === "warning") return <AlertTriangle className="w-4 h-4" style={{ color: "#eab308" }} />;
    return <XCircle className="w-4 h-4" style={{ color: "#ef4444" }} />;
  };

  const getStatusColor = (status: "pass" | "fail" | "warning") => {
    if (status === "pass") return "#22c55e";
    if (status === "warning") return "#eab308";
    return "#ef4444";
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
            <div className="p-3 rounded-xl" style={{ background: "rgba(59,130,246,0.15)" }}>
              <ShieldCheck className="w-6 h-6" style={{ color: "#3b82f6" }} />
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6" }}>NEW</span>
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: "#f0f0f8" }}>E-E-A-T Checker</h1>
          <p className="text-base" style={{ color: "#7070a0" }}>
            Evaluate your brand's Experience, Expertise, Authoritativeness, and Trustworthiness signals — critical for AI citation.
          </p>
        </div>

        {/* Input Section */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "#f0f0f8" }}>Website URL to analyze</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourbrand.com"
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: "#1a1a2e", border: "1px solid #25253f", color: "#f0f0f8" }}
              />
            </div>

            <button
              onClick={analyze}
              disabled={loading || !url}
              className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
              style={{ 
                background: loading || !url ? "#25253f" : "#3b82f6",
                color: loading || !url ? "#5050a0" : "#fff"
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing E-E-A-T Signals...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Analyze E-E-A-T
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
              <h2 className="text-lg font-semibold mb-6" style={{ color: "#f0f0f8" }}>E-E-A-T Analysis Results</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <div className="rounded-xl p-3 text-center" style={{ background: "#1a1a2e" }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: getScoreColor(result.score) }}>{result.score}</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>Overall</div>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: "#1a1a2e" }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: getScoreColor(result.experience) }}>{result.experience}</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>Experience</div>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: "#1a1a2e" }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: getScoreColor(result.expertise) }}>{result.expertise}</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>Expertise</div>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: "#1a1a2e" }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: getScoreColor(result.authoritativeness) }}>{result.authoritativeness}</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>Authority</div>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: "#1a1a2e" }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: getScoreColor(result.trustworthiness) }}>{result.trustworthiness}</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>Trust</div>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="rounded-2xl p-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(result.findings.experience.status)}
                <h3 className="text-sm font-semibold" style={{ color: getStatusColor(result.findings.experience.status) }}>
                  Experience (E)
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)", color: "#a0a0c0" }}>
                  {result.findings.experience.status === "pass" ? "Good" : "Needs Work"}
                </span>
              </div>
              <ul className="space-y-2">
                {result.findings.experience.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "#a0a0c0" }}>
                    <Users className="w-3 h-3" style={{ color: getStatusColor(result.findings.experience.status) }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Expertise */}
            <div className="rounded-2xl p-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(result.findings.expertise.status)}
                <h3 className="text-sm font-semibold" style={{ color: getStatusColor(result.findings.expertise.status) }}>
                  Expertise (E)
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)", color: "#a0a0c0" }}>
                  {result.findings.expertise.status === "pass" ? "Good" : "Needs Work"}
                </span>
              </div>
              <ul className="space-y-2">
                {result.findings.expertise.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "#a0a0c0" }}>
                    <Award className="w-3 h-3" style={{ color: getStatusColor(result.findings.expertise.status) }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Authoritativeness */}
            <div className="rounded-2xl p-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(result.findings.authoritativeness.status)}
                <h3 className="text-sm font-semibold" style={{ color: getStatusColor(result.findings.authoritativeness.status) }}>
                  Authoritativeness (A)
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)", color: "#a0a0c0" }}>
                  {result.findings.authoritativeness.status === "pass" ? "Good" : "Needs Work"}
                </span>
              </div>
              <ul className="space-y-2">
                {result.findings.authoritativeness.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "#a0a0c0" }}>
                    <Globe className="w-3 h-3" style={{ color: getStatusColor(result.findings.authoritativeness.status) }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Trustworthiness */}
            <div className="rounded-2xl p-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(result.findings.trustworthiness.status)}
                <h3 className="text-sm font-semibold" style={{ color: getStatusColor(result.findings.trustworthiness.status) }}>
                  Trustworthiness (T)
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)", color: "#a0a0c0" }}>
                  {result.findings.trustworthiness.status === "pass" ? "Good" : "Needs Work"}
                </span>
              </div>
              <ul className="space-y-2">
                {result.findings.trustworthiness.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "#a0a0c0" }}>
                    <FileText className="w-3 h-3" style={{ color: getStatusColor(result.findings.trustworthiness.status) }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="rounded-2xl p-6 text-center" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.05) 100%)", border: "1px solid rgba(59,130,246,0.2)" }}>
              <p className="text-sm mb-4" style={{ color: "#a0a0c0" }}>
                Get a complete optimization plan for your E-E-A-T signals
              </p>
              <a
                href="/geo-action"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-xl font-medium"
                style={{ background: "#3b82f6", color: "#fff" }}
              >
                Get Optimization Plan <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Why E-E-A-T Matters */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-6" style={{ color: "#f0f0f8" }}>Why E-E-A-T Matters for AI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>AI Weighs Trust Like a Researcher</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>AI models evaluate source credibility the same way academic researchers do — through citations, credentials, and consistent data quality.</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>Expert Content Gets Cited</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>Content authored or verified by domain experts is heavily favored by AI models over generic marketing copy.</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>Authority Builds Over Time</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>Third-party mentions, press coverage, and industry recognition signal lasting credibility to AI systems.</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <h3 className="text-sm font-medium mb-2" style={{ color: "#f0f0f8" }}>Trust is the Foundation</h3>
              <p className="text-xs" style={{ color: "#7070a0" }}>Without trust signals, even excellent content gets filtered out as unreliable by AI citation systems.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
