"use client";

import { useState, useEffect } from "react";
import { PromptResultDetail } from "@/lib/api";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

const INTENT_LABELS: Record<string, string> = {
  high: "High Intent",
  comparison: "Comparison",
  info: "Informational",
};

const INTENT_COLORS: Record<string, { bg: string; color: string }> = {
  high:       { bg: "rgba(255,77,109,0.12)",  color: "#ff4d6d" },
  comparison: { bg: "rgba(245,166,35,0.12)",  color: "#f5a623" },
  info:       { bg: "rgba(112,112,160,0.12)", color: "#7070a0" },
};

const PROVIDER_COLORS: Record<string, { bg: string; color: string }> = {
  openai:  { bg: "rgba(34,197,94,0.12)",   color: "#22c55e" },
  claude:  { bg: "rgba(255,107,53,0.12)",  color: "#ff6b35" },
  gemini:  { bg: "rgba(74,159,224,0.12)",  color: "#4a9fe0" },
};

function highlightBrands(text: string, primaryBrand: string, competitors: string[]) {
  const all = [primaryBrand, ...competitors].filter(Boolean);
  if (all.length === 0) return [<span key={0}>{text}</span>];

  const escaped = all.map((b) => b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, i) => {
    const isPrimary = part.toLowerCase() === primaryBrand.toLowerCase();
    const isCompetitor = !isPrimary && competitors.some((c) => c.toLowerCase() === part.toLowerCase());
    if (isPrimary) {
      return (
        <mark
          key={i}
          style={{
            background: "rgba(255,107,53,0.25)",
            color: "#ff6b35",
            borderRadius: 3,
            padding: "0 2px",
            fontWeight: 600,
          }}
        >
          {part}
        </mark>
      );
    }
    if (isCompetitor) {
      return (
        <mark
          key={i}
          style={{
            background: "rgba(112,112,160,0.2)",
            color: "#a0a0c8",
            borderRadius: 3,
            padding: "0 2px",
          }}
        >
          {part}
        </mark>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ResponseExplorer({
  runId,
  brandName,
  competitorNames,
}: {
  runId: string;
  brandName: string;
  competitorNames: string[];
}) {
  const [results, setResults] = useState<PromptResultDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Filters
  const [intentFilter, setIntentFilter] = useState<string>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [mentionedFilter, setMentionedFilter] = useState<string>("all");

  useEffect(() => {
    const params = new URLSearchParams({ limit: "200" });
    if (intentFilter !== "all") params.set("intent", intentFilter);
    if (providerFilter !== "all") params.set("provider", providerFilter);
    if (mentionedFilter !== "all") params.set("mentioned", mentionedFilter === "yes" ? "true" : "false");

    setLoading(true);
    fetch(`${BASE}/runs/${runId}/results?${params}`, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setLoading(false);
      });
  }, [runId, intentFilter, providerFilter, mentionedFilter]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const mentionedCount = results.filter((r) => r.brand_mentioned).length;
  const notMentionedCount = results.length - mentionedCount;

  const FilterBtn = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className="text-xs px-3 py-1.5 rounded-lg transition-colors"
      style={
        active
          ? { background: "#ff6b35", color: "#fff" }
          : { background: "#161625", border: "1px solid #25253f", color: "#7070a0" }
      }
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: "#161625", borderBottom: "1px solid #25253f" }}
      >
        <div>
          <span className="font-semibold text-sm">AI Response Explorer</span>
          <span className="text-xs ml-3" style={{ color: "#7070a0" }}>
            {loading ? "Loading…" : `${results.length} responses · ${mentionedCount} mention brand · ${notMentionedCount} don't`}
          </span>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3 text-xs" style={{ color: "#7070a0" }}>
          <span>
            <mark style={{ background: "rgba(255,107,53,0.25)", color: "#ff6b35", borderRadius: 3, padding: "0 3px" }}>
              {brandName}
            </mark>
            {" "}= you
          </span>
          <span>
            <mark style={{ background: "rgba(112,112,160,0.2)", color: "#a0a0c8", borderRadius: 3, padding: "0 3px" }}>
              competitor
            </mark>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div
        className="px-4 py-3 flex flex-wrap gap-2 items-center"
        style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}
      >
        <span className="text-xs mr-1" style={{ color: "#7070a0" }}>Intent:</span>
        {["all", "high", "comparison", "info"].map((v) => (
          <FilterBtn key={v} active={intentFilter === v} onClick={() => setIntentFilter(v)}>
            {v === "all" ? "All" : INTENT_LABELS[v]}
          </FilterBtn>
        ))}
        <span className="text-xs ml-3 mr-1" style={{ color: "#7070a0" }}>Provider:</span>
        {["all", "openai", "claude"].map((v) => (
          <FilterBtn key={v} active={providerFilter === v} onClick={() => setProviderFilter(v)}>
            {v === "all" ? "All" : v}
          </FilterBtn>
        ))}
        <span className="text-xs ml-3 mr-1" style={{ color: "#7070a0" }}>Mentioned:</span>
        {[
          { v: "all", label: "All" },
          { v: "yes", label: "✓ Mentioned" },
          { v: "no", label: "✗ Not mentioned" },
        ].map(({ v, label }) => (
          <FilterBtn key={v} active={mentionedFilter === v} onClick={() => setMentionedFilter(v)}>
            {label}
          </FilterBtn>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 text-sm" style={{ color: "#ff4d6d", background: "#0f0f17" }}>
          Could not load responses: {error}
        </div>
      )}

      {/* Results list */}
      <div style={{ background: "#0f0f17" }}>
        {loading && (
          <div className="px-4 py-8 text-center text-sm" style={{ color: "#7070a0" }}>
            Loading responses…
          </div>
        )}
        {!loading && results.length === 0 && (
          <div className="px-4 py-8 text-center text-sm" style={{ color: "#7070a0" }}>
            No responses match the current filters.
          </div>
        )}
        {!loading &&
          results.map((r, idx) => {
            const isExpanded = expanded.has(r.id);
            const intent = r.intent_type ?? "high";
            const ic = INTENT_COLORS[intent] ?? INTENT_COLORS.info;
            const pc = r.provider ? (PROVIDER_COLORS[r.provider] ?? PROVIDER_COLORS.openai) : null;
            const mentionedComps = Object.entries(r.competitors_data || {})
              .filter(([, v]) => v.mentioned)
              .map(([name]) => name);

            return (
              <div
                key={r.id}
                style={{ borderTop: idx > 0 ? "1px solid #25253f" : undefined }}
              >
                {/* Row header */}
                <button
                  className="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-white/[0.02]"
                  onClick={() => toggleExpand(r.id)}
                >
                  {/* Mention indicator */}
                  <div
                    className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={
                      r.brand_mentioned
                        ? { background: "rgba(34,197,94,0.15)", color: "#22c55e" }
                        : { background: "rgba(255,77,109,0.12)", color: "#ff4d6d" }
                    }
                  >
                    {r.brand_mentioned ? "✓" : "✗"}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Query */}
                    <p className="text-sm font-medium leading-snug mb-1.5" style={{ color: "#f0f0f8" }}>
                      {r.prompt_text}
                    </p>
                    {/* Badges row */}
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: ic.bg, color: ic.color }}>
                        {INTENT_LABELS[intent] ?? intent}
                      </span>
                      {pc && r.provider && (
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: pc.bg, color: pc.color }}>
                          {r.provider}
                        </span>
                      )}
                      {mentionedComps.length > 0 && (
                        <span className="text-xs" style={{ color: "#7070a0" }}>
                          Also mentioned: {mentionedComps.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expand chevron */}
                  <span className="text-xs mt-1 shrink-0" style={{ color: "#25253f" }}>
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </button>

                {/* Expanded: raw AI response */}
                {isExpanded && (
                  <div
                    className="px-4 pb-4 ml-8"
                    style={{ borderTop: "1px solid #25253f" }}
                  >
                    <p className="text-xs pt-3 mb-2 font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>
                      AI Response
                    </p>
                    <div
                      className="text-sm leading-relaxed p-4 rounded-xl"
                      style={{ background: "#161625", color: "#c0c0d8" }}
                    >
                      {highlightBrands(r.raw_response, brandName, competitorNames)}
                    </div>
                    {r.brand_mention_position !== null && r.brand_mention_position !== undefined && (
                      <p className="text-xs mt-2" style={{ color: "#7070a0" }}>
                        {brandName} appeared at position #{r.brand_mention_position} in this response
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
