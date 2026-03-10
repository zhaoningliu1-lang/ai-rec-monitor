"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Plus, Clock, Zap, Eye, Hash, MessageSquare, TrendingUp,
  BarChart3, FileText, Users, ArrowRight, CheckCircle2, XCircle,
  Loader2, ChevronRight, Grip, Trash2, Copy, LayoutTemplate,
} from "lucide-react";

/* ─── types ─── */
type WorkflowStatus = "active" | "paused" | "draft";
type RunStatus = "success" | "failed" | "running";

interface WorkflowNode {
  id: string;
  type: "trigger" | "action";
  name: string;
  icon: string;
  config: Record<string, string>;
}

interface Workflow {
  id: string;
  name: string;
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  lastRun: string | null;
  totalRuns: number;
  createdAt: string;
}

interface WorkflowRun {
  id: string;
  status: RunStatus;
  startedAt: string;
  duration: string;
  results: string;
}

/* ─── demo data ─── */
const DEMO_WORKFLOWS: Workflow[] = [
  {
    id: "wf-1", name: "Daily Trend Watcher", status: "active",
    nodes: [
      { id: "n1", type: "trigger", name: "Daily at 9 AM", icon: "clock", config: { time: "09:00" } },
      { id: "n2", type: "action", name: "Analyze trending sounds", icon: "trending", config: {} },
      { id: "n3", type: "action", name: "Extract top scripts", icon: "file", config: {} },
    ],
    lastRun: "2 hours ago", totalRuns: 47, createdAt: "2026-02-14",
  },
  {
    id: "wf-2", name: "Competitor Monitor", status: "active",
    nodes: [
      { id: "n1", type: "trigger", name: "New post by @competitor", icon: "eye", config: {} },
      { id: "n2", type: "action", name: "Analyze engagement", icon: "bar", config: {} },
    ],
    lastRun: "5 hours ago", totalRuns: 123, createdAt: "2026-01-20",
  },
  {
    id: "wf-3", name: "Hashtag Tracker", status: "paused",
    nodes: [
      { id: "n1", type: "trigger", name: "Every 6 hours", icon: "clock", config: {} },
      { id: "n2", type: "action", name: "Track #skincare", icon: "hash", config: {} },
    ],
    lastRun: "1 day ago", totalRuns: 89, createdAt: "2026-02-01",
  },
];

const DEMO_RUNS: WorkflowRun[] = [
  { id: "r1", status: "success", startedAt: "Today 9:00 AM", duration: "2m 14s", results: "Found 12 trending sounds, 3 new viral formats" },
  { id: "r2", status: "success", startedAt: "Yesterday 9:00 AM", duration: "1m 58s", results: "8 trending sounds, 1 emerging hashtag" },
  { id: "r3", status: "failed", startedAt: "Mar 8, 9:00 AM", duration: "0m 32s", results: "Rate limit exceeded — retried at 9:15 AM" },
  { id: "r4", status: "success", startedAt: "Mar 7, 9:00 AM", duration: "2m 05s", results: "15 trending sounds, 5 competitor uploads detected" },
  { id: "r5", status: "success", startedAt: "Mar 6, 9:00 AM", duration: "1m 47s", results: "10 trending sounds" },
];

/* ─── templates ─── */
const TEMPLATES = [
  {
    id: "t1", name: "Daily Trend Watcher", desc: "Track trending sounds, effects, and formats every morning.",
    icon: TrendingUp, color: "#ff6b35",
    nodes: ["Daily trigger", "Analyze trending", "Extract scripts", "Notify Slack"],
  },
  {
    id: "t2", name: "Competitor Monitor", desc: "Get alerts when competitors post and auto-analyze their engagement.",
    icon: Users, color: "#8b5cf6",
    nodes: ["New post trigger", "Analyze engagement", "Compare metrics", "Save report"],
  },
  {
    id: "t3", name: "Viral Script Extractor", desc: "Find viral videos in your niche and extract their hook + script patterns.",
    icon: FileText, color: "#22c55e",
    nodes: ["Trending trigger", "Filter by niche", "Extract scripts", "Categorize hooks"],
  },
  {
    id: "t4", name: "Hashtag Tracker", desc: "Monitor hashtag performance and spot emerging trends before they peak.",
    icon: Hash, color: "#f5a623",
    nodes: ["Scheduled trigger", "Track hashtags", "Trend analysis", "Alert on spike"],
  },
];

/* ─── trigger / action catalog ─── */
const TRIGGERS = [
  { id: "daily", name: "Daily Schedule", desc: "Run every day at a set time", icon: Clock, color: "#ff6b35" },
  { id: "trending", name: "New Trending", desc: "When a new sound/effect trends", icon: TrendingUp, color: "#22c55e" },
  { id: "competitor", name: "Competitor Posted", desc: "When a tracked account posts", icon: Eye, color: "#8b5cf6" },
];
const ACTIONS = [
  { id: "analyze", name: "Analyze Video", desc: "AI analysis of video content & engagement", icon: BarChart3, color: "#ff6b35" },
  { id: "extract", name: "Extract Script", desc: "Pull hook, CTA, and script structure", icon: FileText, color: "#22c55e" },
  { id: "comments", name: "Get Comments", desc: "Scrape and analyze comment sentiment", icon: MessageSquare, color: "#f5a623" },
  { id: "hashtag", name: "Track Hashtag", desc: "Monitor hashtag volume and growth", icon: Hash, color: "#8b5cf6" },
];

/* ─── shared UI ─── */
const card = { background: "#161625", border: "1px solid #25253f", borderRadius: 16 };
const statusColor: Record<WorkflowStatus, string> = { active: "#22c55e", paused: "#f5a623", draft: "#7070a0" };
const runStatusIcon: Record<RunStatus, React.ReactNode> = {
  success: <CheckCircle2 size={14} style={{ color: "#22c55e" }} />,
  failed: <XCircle size={14} style={{ color: "#ff4d6d" }} />,
  running: <Loader2 size={14} className="animate-spin" style={{ color: "#ff6b35" }} />,
};

/* ================================================================
   1. DASHBOARD VIEW
   ================================================================ */
export default function TikTokDashboardView() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#f0f0f8" }}>TikTok Workflows</h1>
          <p className="text-sm mt-1" style={{ color: "#7070a0" }}>Automate your TikTok analysis with visual workflows</p>
        </div>
        <div className="flex gap-3">
          <Link href="/tiktok/templates"
            className="text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors hover:bg-white/5"
            style={{ color: "#ff6b35", border: "1px solid rgba(255,107,53,0.35)" }}>
            <LayoutTemplate size={15} /> Templates
          </Link>
          <Link href="/tiktok/builder"
            className="text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}>
            <Plus size={15} /> New Workflow
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Workflows", value: "2", sub: "of 3 total" },
          { label: "Total Runs (30d)", value: "259", sub: "+18% vs last month" },
          { label: "Insights Generated", value: "1,240", sub: "scripts, trends, alerts" },
        ].map((s) => (
          <div key={s.label} className="p-5 rounded-2xl" style={card}>
            <div className="text-xs font-medium mb-1" style={{ color: "#7070a0" }}>{s.label}</div>
            <div className="text-2xl font-bold" style={{ color: "#f0f0f8" }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "#555580" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Workflow list */}
      <div className="space-y-3">
        {DEMO_WORKFLOWS.map((wf) => (
          <motion.div key={wf.id} whileHover={{ scale: 1.005 }} className="p-5 rounded-2xl cursor-pointer transition-colors hover:border-white/10"
            style={card} onClick={() => router.push(`/tiktok/${wf.id}`)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,107,53,0.12)" }}>
                  <Zap size={18} style={{ color: "#ff6b35" }} />
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "#f0f0f8" }}>{wf.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#7070a0" }}>
                    {wf.nodes.length} steps &middot; {wf.totalRuns} runs &middot; Last run {wf.lastRun ?? "never"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: `${statusColor[wf.status]}15`, color: statusColor[wf.status] }}>
                  {wf.status}
                </span>
                <ChevronRight size={16} style={{ color: "#7070a0" }} />
              </div>
            </div>
            {/* mini pipeline */}
            <div className="flex items-center gap-2 mt-3 ml-12">
              {wf.nodes.map((n, i) => (
                <div key={n.id} className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-md"
                    style={{ background: n.type === "trigger" ? "rgba(255,107,53,0.1)" : "rgba(112,112,160,0.1)",
                             color: n.type === "trigger" ? "#ff6b35" : "#7070a0" }}>
                    {n.name}
                  </span>
                  {i < wf.nodes.length - 1 && <ArrowRight size={10} style={{ color: "#555580" }} />}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   2. WORKFLOW BUILDER VIEW
   ================================================================ */
export function TikTokBuilderView() {
  const router = useRouter();
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [nodes, setNodes] = useState<{ id: string; type: "trigger" | "action"; catalogId: string; name: string; color: string }[]>([]);
  const [showCatalog, setShowCatalog] = useState<"trigger" | "action" | null>(null);

  const addNode = (type: "trigger" | "action", catalogId: string, name: string, color: string) => {
    setNodes((prev) => [...prev, { id: `n-${Date.now()}`, type, catalogId, name, color }]);
    setShowCatalog(null);
  };
  const removeNode = (id: string) => setNodes((prev) => prev.filter((n) => n.id !== id));
  const hasTrigger = nodes.some((n) => n.type === "trigger");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/tiktok" className="text-xs px-2.5 py-1 rounded-lg transition-colors hover:text-white"
            style={{ color: "#7070a0", border: "1px solid #25253f" }}>&larr; Back</Link>
          <input value={workflowName} onChange={(e) => setWorkflowName(e.target.value)}
            className="text-xl font-bold bg-transparent border-none outline-none focus:ring-0"
            style={{ color: "#f0f0f8" }} />
        </div>
        <button onClick={() => { alert("Workflow saved!"); router.push("/tiktok"); }}
          className="text-sm font-medium px-5 py-2 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: "#ff6b35", color: "#fff" }}>
          Save Workflow
        </button>
      </div>

      {/* Canvas */}
      <div className="rounded-2xl p-8 min-h-[480px]" style={{ ...card, background: "#0c0c18" }}>
        {nodes.length === 0 && !showCatalog ? (
          <div className="flex flex-col items-center justify-center h-80 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(255,107,53,0.1)" }}>
              <Zap size={28} style={{ color: "#ff6b35" }} />
            </div>
            <h3 className="text-lg font-semibold mb-1" style={{ color: "#f0f0f8" }}>Start building your workflow</h3>
            <p className="text-sm mb-5" style={{ color: "#7070a0" }}>Add a trigger to begin, then chain actions.</p>
            <button onClick={() => setShowCatalog("trigger")}
              className="text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
              style={{ background: "#ff6b35", color: "#fff" }}>
              <Plus size={14} className="inline mr-1.5" /> Add Trigger
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Node list */}
            <AnimatePresence mode="popLayout">
              {nodes.map((n, i) => (
                <motion.div key={n.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -40 }}>
                  {i > 0 && (
                    <div className="flex justify-center py-1">
                      <div className="w-px h-6" style={{ background: "#25253f" }} />
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "#161625", border: `1px solid ${n.color}30` }}>
                    <Grip size={14} style={{ color: "#555580" }} className="cursor-grab" />
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${n.color}18` }}>
                      {n.type === "trigger" ? <Clock size={15} style={{ color: n.color }} /> : <Zap size={15} style={{ color: n.color }} />}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold uppercase tracking-wider" style={{ color: n.color }}>{n.type}</div>
                      <div className="text-sm font-medium" style={{ color: "#f0f0f8" }}>{n.name}</div>
                    </div>
                    <button onClick={() => removeNode(n.id)} className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                      style={{ color: "#7070a0", background: "none", border: "none", cursor: "pointer" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add button */}
            {nodes.length > 0 && !showCatalog && (
              <div className="flex justify-center pt-2">
                <div className="flex gap-2">
                  {!hasTrigger && (
                    <button onClick={() => setShowCatalog("trigger")}
                      className="text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors hover:bg-white/5"
                      style={{ color: "#ff6b35", border: "1px solid rgba(255,107,53,0.3)", background: "none", cursor: "pointer" }}>
                      <Plus size={12} /> Trigger
                    </button>
                  )}
                  <button onClick={() => setShowCatalog("action")}
                    className="text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors hover:bg-white/5"
                    style={{ color: "#7070a0", border: "1px solid #25253f", background: "none", cursor: "pointer" }}>
                    <Plus size={12} /> Action
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Catalog panel */}
        <AnimatePresence>
          {showCatalog && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
              className="mt-6 p-5 rounded-xl" style={{ background: "#161625", border: "1px solid #25253f" }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>
                  {showCatalog === "trigger" ? "Choose a Trigger" : "Choose an Action"}
                </h4>
                <button onClick={() => setShowCatalog(null)} className="text-xs px-2 py-1 rounded-md"
                  style={{ color: "#7070a0", background: "none", border: "1px solid #25253f", cursor: "pointer" }}>Cancel</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(showCatalog === "trigger" ? TRIGGERS : ACTIONS).map((item) => (
                  <button key={item.id} onClick={() => addNode(showCatalog, item.id, item.name, item.color)}
                    className="text-left p-4 rounded-xl transition-colors hover:bg-white/5"
                    style={{ background: "none", border: "1px solid #25253f", cursor: "pointer" }}>
                    <item.icon size={20} style={{ color: item.color }} className="mb-2" />
                    <div className="text-sm font-medium" style={{ color: "#f0f0f8" }}>{item.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#7070a0" }}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ================================================================
   3. TEMPLATES VIEW
   ================================================================ */
export function TikTokTemplatesView() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#f0f0f8" }}>Workflow Templates</h1>
          <p className="text-sm mt-1" style={{ color: "#7070a0" }}>Start from a pre-built workflow and customize it</p>
        </div>
        <Link href="/tiktok" className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:text-white"
          style={{ color: "#7070a0", border: "1px solid #25253f" }}>&larr; Back to Workflows</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {TEMPLATES.map((t) => (
          <motion.div key={t.id} whileHover={{ scale: 1.01 }}
            className="p-6 rounded-2xl cursor-pointer transition-colors hover:border-white/10"
            style={card} onClick={() => router.push("/tiktok/builder")}>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${t.color}15` }}>
                <t.icon size={22} style={{ color: t.color }} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: "#f0f0f8" }}>{t.name}</h3>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "#7070a0" }}>{t.desc}</p>
                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  {t.nodes.map((step, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-md"
                        style={{ background: i === 0 ? `${t.color}15` : "rgba(112,112,160,0.08)",
                                 color: i === 0 ? t.color : "#7070a0" }}>
                        {step}
                      </span>
                      {i < t.nodes.length - 1 && <ArrowRight size={8} style={{ color: "#555580" }} />}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-xs font-medium flex items-center gap-1" style={{ color: "#ff6b35" }}>
                    Use template <Copy size={11} />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   4. WORKFLOW DETAIL VIEW
   ================================================================ */
export function TikTokDetailView({ workflowId }: { workflowId: string }) {
  const wf = DEMO_WORKFLOWS.find((w) => w.id === workflowId) ?? DEMO_WORKFLOWS[0];
  const [tab, setTab] = useState<"runs" | "settings">("runs");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/tiktok" className="text-xs px-2.5 py-1 rounded-lg transition-colors hover:text-white"
            style={{ color: "#7070a0", border: "1px solid #25253f" }}>&larr; Back</Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold" style={{ color: "#f0f0f8" }}>{wf.name}</h1>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                style={{ background: `${statusColor[wf.status]}15`, color: statusColor[wf.status] }}>
                {wf.status}
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: "#7070a0" }}>Created {wf.createdAt} &middot; {wf.totalRuns} total runs</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/tiktok/builder"
            className="text-xs font-medium px-4 py-2 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "#7070a0", border: "1px solid #25253f" }}>
            Edit
          </Link>
          <button className="text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff", border: "none", cursor: "pointer" }}>
            <Play size={13} /> Run Now
          </button>
        </div>
      </div>

      {/* Pipeline visualization */}
      <div className="p-5 rounded-2xl" style={card}>
        <div className="text-xs font-medium mb-3" style={{ color: "#7070a0" }}>Workflow Pipeline</div>
        <div className="flex items-center gap-3 flex-wrap">
          {wf.nodes.map((n, i) => (
            <div key={n.id} className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ background: n.type === "trigger" ? "rgba(255,107,53,0.08)" : "rgba(112,112,160,0.06)",
                         border: `1px solid ${n.type === "trigger" ? "rgba(255,107,53,0.2)" : "#25253f"}` }}>
                {n.type === "trigger" ? <Clock size={14} style={{ color: "#ff6b35" }} /> : <Zap size={14} style={{ color: "#7070a0" }} />}
                <span className="text-sm font-medium" style={{ color: n.type === "trigger" ? "#ff6b35" : "#f0f0f8" }}>{n.name}</span>
              </div>
              {i < wf.nodes.length - 1 && <ArrowRight size={14} style={{ color: "#555580" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        {(["runs", "settings"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="text-xs font-medium px-4 py-1.5 rounded-lg capitalize transition-colors"
            style={{ background: tab === t ? "rgba(255,107,53,0.12)" : "transparent",
                     color: tab === t ? "#ff6b35" : "#7070a0", border: "none", cursor: "pointer" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Run history */}
      {tab === "runs" && (
        <div className="rounded-2xl overflow-hidden" style={card}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #25253f" }}>
                {["Status", "Started", "Duration", "Results"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium" style={{ color: "#7070a0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_RUNS.map((run) => (
                <tr key={run.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: "1px solid #25253f" }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      {runStatusIcon[run.status]}
                      <span className="text-xs capitalize" style={{ color: run.status === "failed" ? "#ff4d6d" : "#f0f0f8" }}>{run.status}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: "#f0f0f8" }}>{run.startedAt}</td>
                  <td className="px-5 py-3 text-xs" style={{ color: "#7070a0" }}>{run.duration}</td>
                  <td className="px-5 py-3 text-xs" style={{ color: "#7070a0" }}>{run.results}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Settings placeholder */}
      {tab === "settings" && (
        <div className="p-8 rounded-2xl text-center" style={card}>
          <p className="text-sm" style={{ color: "#7070a0" }}>Workflow settings &mdash; schedule, notifications, and connections will appear here.</p>
        </div>
      )}
    </div>
  );
}
