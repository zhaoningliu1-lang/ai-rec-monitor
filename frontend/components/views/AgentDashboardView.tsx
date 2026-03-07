"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, AgentCycle, CycleStatus } from "@/lib/api";

/* ── step metadata ──────────────────────────────────────────────── */

const STEPS: { key: string; label: string; statusKey: CycleStatus; outputKey: keyof AgentCycle }[] = [
  { key: "monitor",    label: "Monitor",    statusKey: "monitoring",    outputKey: "monitor_output" },
  { key: "analyst",    label: "Analyst",    statusKey: "analyzing",     outputKey: "analyst_output" },
  { key: "strategist", label: "Strategist", statusKey: "strategizing",  outputKey: "strategist_output" },
  { key: "experiment", label: "Experiment", statusKey: "experimenting", outputKey: "experiment_output" },
];

const STATUS_ORDER: CycleStatus[] = ["pending", "monitoring", "analyzing", "strategizing", "experimenting", "completed", "failed"];

function stepState(cycleStatus: CycleStatus, stepStatus: CycleStatus): "done" | "active" | "pending" {
  const ci = STATUS_ORDER.indexOf(cycleStatus);
  const si = STATUS_ORDER.indexOf(stepStatus);
  if (cycleStatus === "completed") return "done";
  if (cycleStatus === "failed") return ci > si ? "done" : ci === si ? "active" : "pending";
  if (ci > si) return "done";
  if (ci === si) return "active";
  return "pending";
}

/* ── severity colors ────────────────────────────────────────────── */

function severityColor(s: string) {
  if (s === "high") return "#ef4444";
  if (s === "medium") return "#f59e0b";
  return "#22c55e";
}

function priorityBadge(p: string) {
  const colors: Record<string, string> = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: `${colors[p] ?? "#666"}20`, color: colors[p] ?? "#888" }}
    >
      {p}
    </span>
  );
}

/* ── main component ─────────────────────────────────────────────── */

export default function AgentDashboardView() {
  const [cycles, setCycles] = useState<AgentCycle[]>([]);
  const [active, setActive] = useState<AgentCycle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* form state */
  const [brand, setBrand] = useState("Anker");
  const [category, setCategory] = useState("portable power station");
  const [competitors, setCompetitors] = useState("EcoFlow, Jackery, Bluetti");
  const [region, setRegion] = useState("us");
  const [providers, setProviders] = useState<string[]>(["openai"]);

  /* load history */
  useEffect(() => {
    api.listCycles(10).then(setCycles).catch(() => {});
  }, []);

  /* polling for active cycle */
  const startPolling = useCallback((id: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const c = await api.getCycle(id);
        setActive(c);
        if (c.status === "completed" || c.status === "failed") {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          api.listCycles(10).then(setCycles).catch(() => {});
        }
      } catch { /* ignore */ }
    }, 2000);
  }, []);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  /* launch cycle */
  const launch = async () => {
    setError("");
    setLoading(true);
    try {
      const cycle = await api.createCycle({
        brand_name: brand.trim(),
        category: category.trim(),
        region,
        competitor_names: competitors.split(",").map((s) => s.trim()).filter(Boolean),
        providers,
      });
      setActive(cycle);
      startPolling(cycle.id);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to launch cycle");
    } finally {
      setLoading(false);
    }
  };

  /* resume viewing a past cycle */
  const viewCycle = async (id: string) => {
    const c = await api.getCycle(id);
    setActive(c);
    if (c.status !== "completed" && c.status !== "failed") {
      startPolling(c.id);
    }
  };

  const isRunning = active && active.status !== "completed" && active.status !== "failed" && active.status !== "pending";

  return (
    <div className="space-y-8 pb-16">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: "linear-gradient(135deg, #ff6b35, #ff8f65)" }}>
            A
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#f0f0f8" }}>Growth Agent Engine</h1>
            <p className="text-sm" style={{ color: "#7070a0" }}>
              Autonomous 4-agent loop: Monitor → Analyst → Strategist → Experiment
            </p>
          </div>
        </div>
        <p className="text-sm mt-3 leading-relaxed max-w-2xl" style={{ color: "#9090b0" }}>
          Launch an autonomous growth cycle and watch four AI agents collaborate to analyze your
          brand&apos;s visibility in AI recommendation engines, identify root causes, design
          optimization experiments, and validate results — all without human intervention.
        </p>
      </header>

      {/* ── Launch form ────────────────────────────────────────── */}
      <section className="rounded-2xl p-6" style={{ background: "#0f0f1a", border: "1px solid #25253f" }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "#f0f0f8" }}>Launch Growth Cycle</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <label className="space-y-1">
            <span className="text-xs font-medium" style={{ color: "#7070a0" }}>Brand</span>
            <input value={brand} onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "#1a1a2e", border: "1px solid #25253f", color: "#f0f0f8" }} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium" style={{ color: "#7070a0" }}>Category</span>
            <input value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "#1a1a2e", border: "1px solid #25253f", color: "#f0f0f8" }} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium" style={{ color: "#7070a0" }}>Competitors (comma-separated)</span>
            <input value={competitors} onChange={(e) => setCompetitors(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "#1a1a2e", border: "1px solid #25253f", color: "#f0f0f8" }} />
          </label>
          <div className="flex gap-4">
            <label className="space-y-1 flex-1">
              <span className="text-xs font-medium" style={{ color: "#7070a0" }}>Region</span>
              <select value={region} onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: "#1a1a2e", border: "1px solid #25253f", color: "#f0f0f8" }}>
                <option value="us">US</option>
                <option value="uk">UK</option>
                <option value="de">DE</option>
              </select>
            </label>
            <label className="space-y-1 flex-1">
              <span className="text-xs font-medium" style={{ color: "#7070a0" }}>Provider</span>
              <select value={providers[0]} onChange={(e) => setProviders([e.target.value])}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: "#1a1a2e", border: "1px solid #25253f", color: "#f0f0f8" }}>
                <option value="openai">OpenAI</option>
                <option value="claude">Claude</option>
                <option value="gemini">Gemini</option>
              </select>
            </label>
          </div>
        </div>
        {error && <p className="text-sm mb-3" style={{ color: "#ef4444" }}>{error}</p>}
        <button
          onClick={launch}
          disabled={loading || !!isRunning}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          {loading ? "Launching..." : isRunning ? "Cycle Running..." : "Launch Growth Cycle"}
        </button>
      </section>

      {/* ── Pipeline visualization ─────────────────────────────── */}
      {active && (
        <section className="rounded-2xl p-6" style={{ background: "#0f0f1a", border: "1px solid #25253f" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold" style={{ color: "#f0f0f8" }}>
              Cycle: {active.brand_name}
              <span className="text-sm font-normal ml-2" style={{ color: "#7070a0" }}>{active.category}</span>
            </h2>
            <StatusBadge status={active.status} />
          </div>

          {/* step indicators */}
          <div className="flex items-center gap-0 mb-8">
            {STEPS.map((step, i) => {
              const s = stepState(active.status, step.statusKey);
              return (
                <div key={step.key} className="flex items-center" style={{ flex: 1 }}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                      style={{
                        background: s === "done" ? "#22c55e" : s === "active" ? "#ff6b35" : "#1a1a2e",
                        border: `2px solid ${s === "done" ? "#22c55e" : s === "active" ? "#ff6b35" : "#25253f"}`,
                        color: s === "pending" ? "#7070a0" : "#fff",
                        boxShadow: s === "active" ? "0 0 20px rgba(255,107,53,0.3)" : "none",
                      }}
                    >
                      {s === "done" ? "\u2713" : s === "active" ? <PulsingDot /> : i + 1}
                    </div>
                    <span className="text-xs mt-2 font-medium" style={{ color: s === "pending" ? "#555" : s === "active" ? "#ff6b35" : "#f0f0f8" }}>
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="h-0.5 flex-1 -mx-2 mt-[-18px]"
                      style={{ background: stepState(active.status, STEPS[i + 1].statusKey) !== "pending" ? "#22c55e" : "#25253f" }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* agent outputs */}
          <div className="space-y-4">
            {STEPS.map((step) => {
              const s = stepState(active.status, step.statusKey);
              const output = active[step.outputKey] as Record<string, unknown> | null;
              if (s === "pending") return null;
              return (
                <AgentCard
                  key={step.key}
                  label={step.label}
                  agentKey={step.key}
                  status={s}
                  output={output}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ── History ────────────────────────────────────────────── */}
      {cycles.length > 0 && (
        <section className="rounded-2xl p-6" style={{ background: "#0f0f1a", border: "1px solid #25253f" }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "#f0f0f8" }}>Recent Cycles</h2>
          <div className="space-y-2">
            {cycles.map((c) => (
              <button
                key={c.id}
                onClick={() => viewCycle(c.id)}
                className="w-full text-left p-3 rounded-xl flex items-center justify-between transition-colors hover:opacity-80"
                style={{ background: "#1a1a2e", border: "1px solid #25253f" }}
              >
                <div>
                  <span className="text-sm font-medium" style={{ color: "#f0f0f8" }}>{c.brand_name}</span>
                  <span className="text-xs ml-2" style={{ color: "#7070a0" }}>{c.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: "#7070a0" }}>
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                  <StatusBadge status={c.status} />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    pending:       { bg: "#25253f", fg: "#7070a0" },
    monitoring:    { bg: "#ff6b3520", fg: "#ff6b35" },
    analyzing:     { bg: "#3b82f620", fg: "#3b82f6" },
    strategizing:  { bg: "#8b5cf620", fg: "#8b5cf6" },
    experimenting: { bg: "#f59e0b20", fg: "#f59e0b" },
    completed:     { bg: "#22c55e20", fg: "#22c55e" },
    failed:        { bg: "#ef444420", fg: "#ef4444" },
  };
  const c = colors[status] ?? colors.pending;
  return (
    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: c.bg, color: c.fg }}>
      {status}
    </span>
  );
}

function PulsingDot() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#ff6b35" }} />
      <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: "#ff6b35" }} />
    </span>
  );
}

function AgentCard({ label, agentKey, status, output }: {
  label: string;
  agentKey: string;
  status: "done" | "active" | "pending";
  output: Record<string, unknown> | null;
}) {
  const icons: Record<string, string> = { monitor: "📡", analyst: "🔍", strategist: "🎯", experiment: "🧪" };

  return (
    <div className="rounded-xl p-5 transition-all" style={{
      background: "#12122a",
      border: `1px solid ${status === "active" ? "#ff6b3560" : "#25253f"}`,
      boxShadow: status === "active" ? "0 0 30px rgba(255,107,53,0.08)" : "none",
    }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icons[agentKey]}</span>
        <h3 className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>{label} Agent</h3>
        {status === "active" && <span className="text-xs animate-pulse" style={{ color: "#ff6b35" }}>reasoning...</span>}
      </div>

      {status === "active" && !output && (
        <div className="flex items-center gap-2 text-sm" style={{ color: "#7070a0" }}>
          <span className="animate-spin">&#9881;</span> Agent is thinking...
        </div>
      )}

      {output && agentKey === "monitor" && <MonitorOutput data={output} />}
      {output && agentKey === "analyst" && <AnalystOutput data={output} />}
      {output && agentKey === "strategist" && <StrategistOutput data={output} />}
      {output && agentKey === "experiment" && <ExperimentOutput data={output} />}
    </div>
  );
}

/* ── Output renderers ────────────────────────────────────────────── */

function MonitorOutput({ data }: { data: Record<string, unknown> }) {
  const signals = (data.signals as Array<{ type: string; severity: string; message: string }>) ?? [];
  const baseline = data.baseline_metrics as Record<string, number> | undefined;

  return (
    <div className="space-y-3">
      {baseline && Object.keys(baseline).length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Weighted SOV", value: `${(baseline.weighted_sov ?? 0).toFixed(1)}%` },
            { label: "High-Intent SOV", value: `${(baseline.sov_high ?? 0).toFixed(1)}%` },
            { label: "ARRS Risk", value: `${(baseline.arrs ?? 0).toFixed(0)}/100` },
            { label: "Mentions", value: `${baseline.mention_count ?? 0}/${baseline.total_prompts ?? 0}` },
          ].map((m) => (
            <div key={m.label} className="p-3 rounded-lg" style={{ background: "#1a1a2e" }}>
              <div className="text-xs" style={{ color: "#7070a0" }}>{m.label}</div>
              <div className="text-lg font-bold" style={{ color: "#f0f0f8" }}>{m.value}</div>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-2">
        {signals.map((sig, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: severityColor(sig.severity) }} />
            <span style={{ color: "#d0d0e0" }}>{sig.message}</span>
          </div>
        ))}
      </div>
      <div className="text-xs" style={{ color: "#555" }}>{data.snapshots_analyzed as number} snapshots analyzed</div>
    </div>
  );
}

function AnalystOutput({ data }: { data: Record<string, unknown> }) {
  const causes = (data.root_causes as string[]) ?? [];
  const threats = (data.threats as string[]) ?? [];
  const opps = (data.opportunities as string[]) ?? [];
  const summary = data.executive_summary as string;

  return (
    <div className="space-y-3">
      {summary && <p className="text-sm leading-relaxed" style={{ color: "#d0d0e0" }}>{summary}</p>}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: "#ef4444" }}>Root Causes</div>
          {causes.map((c, i) => (
            <p key={i} className="text-xs mb-1.5 leading-relaxed" style={{ color: "#9090b0" }}>• {c}</p>
          ))}
        </div>
        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: "#f59e0b" }}>Threats</div>
          {threats.map((t, i) => (
            <p key={i} className="text-xs mb-1.5 leading-relaxed" style={{ color: "#9090b0" }}>• {t}</p>
          ))}
        </div>
        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: "#22c55e" }}>Opportunities</div>
          {opps.map((o, i) => (
            <p key={i} className="text-xs mb-1.5 leading-relaxed" style={{ color: "#9090b0" }}>• {o}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function StrategistOutput({ data }: { data: Record<string, unknown> }) {
  const experiments = (data.experiments as Array<{
    id: number;
    hypothesis: string;
    action: string;
    expected_sov_lift: string;
    priority: string;
    timeframe: string;
    metrics_to_track: string[];
  }>) ?? [];

  return (
    <div className="space-y-3">
      {experiments.map((exp, i) => (
        <div key={i} className="p-4 rounded-lg" style={{ background: "#1a1a2e", border: "1px solid #25253f" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>Experiment {exp.id ?? i + 1}</span>
            {priorityBadge(exp.priority)}
            <span className="text-xs ml-auto" style={{ color: "#7070a0" }}>{exp.timeframe}</span>
          </div>
          <p className="text-sm mb-1" style={{ color: "#d0d0e0" }}>{exp.hypothesis}</p>
          <p className="text-xs" style={{ color: "#9090b0" }}>{exp.action}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs font-medium" style={{ color: "#22c55e" }}>Expected lift: {exp.expected_sov_lift}</span>
            {exp.metrics_to_track?.length > 0 && (
              <span className="text-xs" style={{ color: "#7070a0" }}>
                Track: {exp.metrics_to_track.join(", ")}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperimentOutput({ data }: { data: Record<string, unknown> }) {
  const freshSov = data.fresh_sov as number ?? 0;
  const baselineSov = data.baseline_sov as number ?? 0;
  const delta = data.sov_delta as number ?? 0;
  const mentions = data.brand_mentions as number ?? 0;
  const total = data.total_queries as number ?? 0;
  const conclusions = data.conclusions as {
    conclusion?: string;
    confidence?: string;
    key_insight?: string;
    next_actions?: string[];
  } | undefined;
  const results = (data.test_results as Array<{
    prompt: string;
    brand_mentioned: boolean;
    response_preview?: string;
    error?: string;
  }>) ?? [];

  return (
    <div className="space-y-4">
      {/* metrics row */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 rounded-lg" style={{ background: "#1a1a2e" }}>
          <div className="text-xs" style={{ color: "#7070a0" }}>Fresh SOV</div>
          <div className="text-lg font-bold" style={{ color: "#f0f0f8" }}>{freshSov.toFixed(1)}%</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: "#1a1a2e" }}>
          <div className="text-xs" style={{ color: "#7070a0" }}>Baseline SOV</div>
          <div className="text-lg font-bold" style={{ color: "#f0f0f8" }}>{baselineSov.toFixed(1)}%</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: "#1a1a2e" }}>
          <div className="text-xs" style={{ color: "#7070a0" }}>Delta</div>
          <div className="text-lg font-bold" style={{ color: delta >= 0 ? "#22c55e" : "#ef4444" }}>
            {delta >= 0 ? "+" : ""}{delta.toFixed(1)}pp
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: "#1a1a2e" }}>
          <div className="text-xs" style={{ color: "#7070a0" }}>Mentions</div>
          <div className="text-lg font-bold" style={{ color: "#f0f0f8" }}>{mentions}/{total}</div>
        </div>
      </div>

      {/* conclusions */}
      {conclusions && (
        <div className="p-4 rounded-lg" style={{ background: "#1a1a2e", border: "1px solid #25253f" }}>
          {conclusions.key_insight && (
            <p className="text-sm font-semibold mb-2" style={{ color: "#ff6b35" }}>{conclusions.key_insight}</p>
          )}
          {conclusions.conclusion && (
            <p className="text-sm mb-3 leading-relaxed" style={{ color: "#d0d0e0" }}>{conclusions.conclusion}</p>
          )}
          {conclusions.confidence && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{
              background: conclusions.confidence === "high" ? "#22c55e20" : conclusions.confidence === "medium" ? "#f59e0b20" : "#ef444420",
              color: conclusions.confidence === "high" ? "#22c55e" : conclusions.confidence === "medium" ? "#f59e0b" : "#ef4444",
            }}>
              Confidence: {conclusions.confidence}
            </span>
          )}
          {conclusions.next_actions && conclusions.next_actions.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-semibold mb-1" style={{ color: "#7070a0" }}>Next Actions</div>
              {conclusions.next_actions.map((a, i) => (
                <p key={i} className="text-xs mb-1" style={{ color: "#9090b0" }}>→ {a}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* test queries */}
      <details>
        <summary className="text-xs cursor-pointer" style={{ color: "#7070a0" }}>
          View {results.length} test queries
        </summary>
        <div className="mt-2 space-y-2">
          {results.map((r, i) => (
            <div key={i} className="p-3 rounded-lg text-xs" style={{ background: "#1a1a2e" }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ background: r.brand_mentioned ? "#22c55e" : "#ef4444" }} />
                <span style={{ color: "#d0d0e0" }}>{r.prompt}</span>
              </div>
              {r.response_preview && (
                <p className="mt-1 leading-relaxed" style={{ color: "#666" }}>{r.response_preview}</p>
              )}
              {r.error && <p style={{ color: "#ef4444" }}>{r.error}</p>}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
