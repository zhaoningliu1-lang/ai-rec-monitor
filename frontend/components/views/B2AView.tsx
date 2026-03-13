"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  api,
  B2AEngineAttribution,
  B2ACompetitiveLandscape,
  B2ASourceIntelligence,
  B2ATrafficStats,
  CategoryEntry,
} from "@/lib/api";
import { Lang, tx } from "@/lib/i18n";

const ENGINE_COLORS: Record<string, string> = {
  openai: "#10a37f",
  claude: "#d97706",
  gemini: "#4285f4",
  perplexity: "#1a73e8",
  copilot: "#0078d4",
};

const ENGINE_LABELS: Record<string, string> = {
  openai: "ChatGPT",
  claude: "Claude",
  gemini: "Gemini",
  perplexity: "Perplexity",
  copilot: "Copilot",
};

const BLIND_SPOTS_EN = [
  "Can\u2019t distinguish AI-referred visits from direct traffic",
  "No visibility into which AI engines send users",
  "Zero insight into AI query intent",
  "Competitor mentions in AI responses invisible",
];
const BLIND_SPOTS_ZH = [
  "无法区分 AI 引荐访客和直接访问",
  "看不到哪个 AI 引擎带来了用户",
  "对 AI 查询意图零洞察",
  "竞品在 AI 回答中的提及完全不可见",
];

const CAPABILITIES_EN = [
  "Attribute traffic to ChatGPT, Perplexity, Gemini, Claude",
  "See exactly which queries trigger your brand mention",
  "Track competitor share-of-voice in AI answers",
  "Measure AI-to-conversion funnel end-to-end",
];
const CAPABILITIES_ZH = [
  "将流量归因到 ChatGPT、Perplexity、Gemini、Claude",
  "精确查看哪些查询触发了你的品牌提及",
  "追踪竞品在 AI 回答中的声量份额",
  "端到端衡量 AI 到转化的漏斗",
];

const CALENDLY = "https://calendly.com/brivesubscription/30min";

export default function B2AView({ lang }: { lang: Lang }) {
  const s = (k: keyof typeof import("@/lib/i18n").t.b2a) => tx("b2a", k, lang);
  const h = (p: string) => (lang === "zh" ? `/zh${p}` : p);

  const [attribution, setAttribution] = useState<B2AEngineAttribution | null>(null);
  const [categories, setCategories] = useState<CategoryEntry[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>("");
  const [landscape, setLandscape] = useState<B2ACompetitiveLandscape | null>(null);
  const [sources, setSources] = useState<B2ASourceIntelligence | null>(null);
  const [traffic, setTraffic] = useState<B2ATrafficStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [snippetCopied, setSnippetCopied] = useState(false);

  // Load attribution, categories, traffic stats on mount
  useEffect(() => {
    Promise.all([
      api.getEngineAttribution().catch(() => null),
      api.listCategories().catch(() => []),
      api.getSourceIntelligence().catch(() => null),
      api.getTrafficStats(undefined, 30).catch(() => null),
    ]).then(([attr, cats, src, traf]) => {
      setAttribution(attr);
      setCategories(cats);
      setSources(src);
      setTraffic(traf);
      if (cats.length > 0) setSelectedCat(cats[0].category);
      setLoading(false);
    });
  }, []);

  // Load competitive landscape when category changes
  useEffect(() => {
    if (!selectedCat) return;
    api.getCompetitiveLandscape(selectedCat, 8).then(setLandscape).catch(() => {});
  }, [selectedCat]);

  const copySnippet = () => {
    navigator.clipboard.writeText('<script src="https://avantia2a.com/b2a/b2a.js" async></script>');
    setSnippetCopied(true);
    setTimeout(() => setSnippetCopied(false), 2000);
  };

  const blindSpots = lang === "zh" ? BLIND_SPOTS_ZH : BLIND_SPOTS_EN;
  const capabilities = lang === "zh" ? CAPABILITIES_ZH : CAPABILITIES_EN;
  const hasData = attribution && attribution.total_prompts > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero */}
      <section className="text-center space-y-4">
        <div
          className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
          style={{ background: "rgba(255,107,53,0.10)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.30)" }}
        >
          B2A ANALYTICS
          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(255,107,53,0.20)" }}>
            {s("beta")}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black leading-tight" style={{ color: "#f0f0f8" }}>
          {s("title")}
        </h1>
        <p className="text-base max-w-2xl mx-auto" style={{ color: "#9090b0" }}>
          {s("subtitle")}
        </p>
      </section>

      {/* Problem / Solution */}
      <section className="grid md:grid-cols-2 gap-5">
        <div className="rounded-2xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f", opacity: 0.6 }}>
          <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: "#7070a0" }}>{s("oldWorld")}</h3>
          <ul className="space-y-2">
            {blindSpots.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#7070a0" }}>
                <span className="shrink-0 mt-0.5" style={{ color: "#ff4d6d" }}>&#10007;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid rgba(34,197,94,0.30)" }}>
          <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: "#22c55e" }}>{s("newWorld")}</h3>
          <ul className="space-y-2">
            {capabilities.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#d0d0e8" }}>
                <span className="shrink-0 mt-0.5" style={{ color: "#22c55e" }}>&#10003;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* AI Engine Attribution — REAL DATA */}
      <section className="rounded-2xl p-6 space-y-5" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#f0f0f8" }}>{s("engineTitle")}</h2>
          <p className="text-sm mt-1" style={{ color: "#7070a0" }}>{s("engineDesc")}</p>
        </div>

        {loading && (
          <div className="py-8 text-center">
            <p className="text-sm" style={{ color: "#7070a0" }}>{s("loading")}</p>
          </div>
        )}

        {!loading && !hasData && (
          <div className="py-8 text-center">
            <p className="text-sm mb-3" style={{ color: "#7070a0" }}>{s("noData")}</p>
            <Link href={h("/audit")} className="text-sm underline" style={{ color: "#ff6b35" }}>
              {s("runAudit")}
            </Link>
          </div>
        )}

        {!loading && hasData && attribution && (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ background: "#161625", border: "1px solid #25253f" }}>
                <div className="text-2xl font-bold" style={{ color: "#ff6b35" }}>
                  {attribution.total_prompts.toLocaleString()}
                </div>
                <div className="text-xs mt-1" style={{ color: "#7070a0" }}>{s("totalPrompts")}</div>
              </div>
              <div className="rounded-xl p-4" style={{ background: "#161625", border: "1px solid #25253f" }}>
                <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>
                  {attribution.total_mentions.toLocaleString()}
                </div>
                <div className="text-xs mt-1" style={{ color: "#7070a0" }}>{s("totalMentions")}</div>
              </div>
            </div>

            {/* Engine bars */}
            <div className="space-y-3">
              {attribution.engines.map((eng) => {
                const color = ENGINE_COLORS[eng.engine] || "#ff6b35";
                const label = ENGINE_LABELS[eng.engine] || eng.engine;
                return (
                  <div key={eng.engine} className="rounded-xl p-4" style={{ background: "#161625", border: "1px solid #25253f" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold" style={{ color }}>{label}</span>
                      <div className="flex items-center gap-4 text-xs" style={{ color: "#9090b0" }}>
                        <span>{s("mentionRate")}: <b style={{ color: "#f0f0f8" }}>{eng.mention_rate}%</b></span>
                        {eng.avg_position && (
                          <span>{s("avgPosition")}: <b style={{ color: "#f0f0f8" }}>#{eng.avg_position}</b></span>
                        )}
                        <span>{s("shareOfMentions")}: <b style={{ color: "#f0f0f8" }}>{eng.share_of_mentions}%</b></span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: "#25253f" }}>
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${eng.mention_rate}%`, background: color }}
                      />
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#7070a0" }}>
                      {eng.mentions.toLocaleString()} / {eng.total_prompts.toLocaleString()} prompts
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Competitive Landscape — by engine */}
      <section className="rounded-2xl p-6 space-y-5" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#f0f0f8" }}>{s("competitiveTitle")}</h2>
          <p className="text-sm mt-1" style={{ color: "#7070a0" }}>{s("competitiveDesc")}</p>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCat(cat.category)}
                className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
                style={selectedCat === cat.category
                  ? { background: "#ff6b35", color: "#fff", border: "1px solid #ff6b35" }
                  : { background: "#161625", color: "#7070a0", border: "1px solid #25253f" }}
              >
                {cat.category}
              </button>
            ))}
          </div>
        )}

        {landscape && landscape.brands.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase" style={{ color: "#7070a0" }}>
                  <th className="text-left py-2 px-3">Brand</th>
                  {Object.keys(landscape.brands[0]?.engines || {}).map((eng) => (
                    <th key={eng} className="text-center py-2 px-3">
                      <span style={{ color: ENGINE_COLORS[eng] || "#ff6b35" }}>
                        {ENGINE_LABELS[eng] || eng}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {landscape.brands.map((b, i) => (
                  <tr key={b.brand} style={{ borderTop: i > 0 ? "1px solid #25253f" : undefined }}>
                    <td className="py-2.5 px-3 font-medium" style={{ color: "#f0f0f8" }}>{b.brand}</td>
                    {Object.entries(b.engines).map(([eng, data]) => (
                      <td key={eng} className="text-center py-2.5 px-3">
                        <div className="inline-flex items-center gap-1.5">
                          <div className="w-12 h-1.5 rounded-full" style={{ background: "#25253f" }}>
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${Math.min(data.sov, 100)}%`,
                                background: ENGINE_COLORS[eng] || "#ff6b35",
                              }}
                            />
                          </div>
                          <span className="text-xs" style={{ color: "#9090b0" }}>{data.sov}%</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-sm" style={{ color: "#7070a0" }}>{s("selectCategory")}</p>
          </div>
        )}
      </section>

      {/* Source Intelligence */}
      {sources && sources.sources.length > 0 && (
        <section className="rounded-2xl p-6 space-y-5" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: "#f0f0f8" }}>{s("sourceTitle")}</h2>
            <p className="text-sm mt-1" style={{ color: "#7070a0" }}>{s("sourceDesc")}</p>
          </div>
          <div className="space-y-2">
            {sources.sources.slice(0, 15).map((src) => (
              <div key={src.domain} className="flex items-center justify-between rounded-lg px-4 py-2.5"
                style={{ background: "#161625", border: "1px solid #25253f" }}>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono" style={{ color: "#f0f0f8" }}>{src.domain}</span>
                  <div className="flex gap-1">
                    {src.engines.map((eng) => (
                      <span key={eng} className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: `${ENGINE_COLORS[eng] || "#ff6b35"}22`, color: ENGINE_COLORS[eng] || "#ff6b35" }}>
                        {ENGINE_LABELS[eng] || eng}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-xs font-medium" style={{ color: "#9090b0" }}>
                  {src.count} {s("citations")}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Live AI Traffic (from B2A events) */}
      {traffic && traffic.total_visits > 0 && (
        <section className="rounded-2xl p-6 space-y-5" style={{ background: "#0f0f17", border: "1px solid rgba(34,197,94,0.30)" }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold" style={{ color: "#f0f0f8" }}>
                {lang === "zh" ? "实时 AI 流量" : "Live AI Traffic"}
              </h2>
              <p className="text-sm mt-1" style={{ color: "#7070a0" }}>
                {lang === "zh" ? `过去 ${traffic.period_days} 天由 AI 引擎带来的访客` : `Visitors referred by AI engines in the last ${traffic.period_days} days`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold" style={{ color: "#22c55e" }}>
                {traffic.total_visits.toLocaleString()}
              </div>
              <div className="text-xs" style={{ color: "#7070a0" }}>
                {lang === "zh" ? "AI 访客" : "AI visits"}
              </div>
            </div>
          </div>

          {/* Engine breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {traffic.engines.slice(0, 4).map((eng) => (
              <div key={eng.engine} className="rounded-xl p-3" style={{ background: "#161625", border: "1px solid #25253f" }}>
                <div className="text-lg font-bold" style={{ color: ENGINE_COLORS[eng.engine.toLowerCase()] || "#ff6b35" }}>
                  {eng.visits}
                </div>
                <div className="text-xs" style={{ color: "#9090b0" }}>{eng.engine}</div>
                <div className="text-[10px]" style={{ color: "#7070a0" }}>{eng.pct}%</div>
              </div>
            ))}
          </div>

          {/* Daily sparkline (simple bar chart) */}
          {traffic.daily.length > 1 && (
            <div>
              <div className="text-xs mb-2" style={{ color: "#7070a0" }}>
                {lang === "zh" ? "每日趋势" : "Daily Trend"}
              </div>
              <div className="flex items-end gap-[2px] h-12">
                {traffic.daily.slice(-30).map((d, i) => {
                  const max = Math.max(...traffic.daily.slice(-30).map((x) => x.visits));
                  const pct = max > 0 ? (d.visits / max) * 100 : 0;
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{ height: `${Math.max(pct, 4)}%`, background: "#22c55e", opacity: 0.7 }}
                      title={`${d.date}: ${d.visits}`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Top pages */}
          {traffic.top_pages.length > 0 && (
            <div>
              <div className="text-xs mb-2" style={{ color: "#7070a0" }}>
                {lang === "zh" ? "AI 访客最多的页面" : "Top Pages by AI Visits"}
              </div>
              <div className="space-y-1">
                {traffic.top_pages.slice(0, 5).map((p) => (
                  <div key={p.page} className="flex items-center justify-between text-xs px-3 py-1.5 rounded"
                    style={{ background: "#161625" }}>
                    <span className="font-mono" style={{ color: "#d0d0e8" }}>{p.page}</span>
                    <span style={{ color: "#22c55e" }}>{p.visits}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* B2A JS Snippet */}
      <section className="rounded-2xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid rgba(255,107,53,0.20)" }}>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#f0f0f8" }}>{s("snippetTitle")}</h2>
          <p className="text-sm mt-1" style={{ color: "#7070a0" }}>{s("snippetDesc")}</p>
        </div>
        <div className="rounded-lg p-4 font-mono text-xs leading-relaxed overflow-x-auto" style={{ background: "#161625", border: "1px solid #25253f", color: "#22c55e" }}>
          {'<script src="https://avantia2a.com/b2a/b2a.js" async></script>'}
        </div>
        <button
          onClick={copySnippet}
          className="text-sm font-medium px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: snippetCopied ? "#22c55e" : "#ff6b35", color: "#fff" }}
        >
          {snippetCopied ? s("snippetCopied") : s("snippetCopy")}
        </button>
      </section>

      {/* Bottom CTA */}
      <section className="rounded-2xl p-8 text-center space-y-4"
        style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.20)" }}>
        <h2 className="text-2xl font-black" style={{ color: "#f0f0f8" }}>{s("ctaTitle")}</h2>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded-xl text-base font-semibold transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            {s("ctaBtn")}
          </a>
          <span
            className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.30)" }}
          >
            {s("beta")}
          </span>
        </div>
      </section>
    </div>
  );
}
