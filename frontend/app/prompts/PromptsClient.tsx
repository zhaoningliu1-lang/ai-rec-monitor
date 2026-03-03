"use client";

import { useEffect, useState } from "react";
import { Lang, tx } from "@/lib/i18n";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

interface Prompt {
  id: string;
  category: string;
  region: string;
  prompt_text: string;
  intent_type: "high" | "comparison" | "info";
  status: "active" | "suggested" | "inactive";
  source: string;
  usage_count: number;
  created_at: string;
}

const INTENT_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  high:       { bg: "rgba(255,107,53,0.12)", color: "#ff6b35", label: "High-intent" },
  comparison: { bg: "rgba(245,166,35,0.12)", color: "#f5a623", label: "Comparison" },
  info:       { bg: "rgba(112,112,160,0.12)", color: "#7070a0", label: "Informational" },
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  active:    { bg: "rgba(34,197,94,0.12)",   color: "#22c55e" },
  suggested: { bg: "rgba(245,166,35,0.12)",  color: "#f5a623" },
  inactive:  { bg: "rgba(112,112,160,0.12)", color: "#7070a0" },
};

type TabFilter = "all" | "active" | "suggested" | "inactive";

interface Props { lang?: Lang }

export default function PromptsClient({ lang = "en" }: Props) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<TabFilter>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Add form
  const [addForm, setAddForm] = useState({
    category: "", region: "US", prompt_text: "", intent_type: "high",
  });
  const [addSaving, setAddSaving] = useState(false);

  // Suggest form
  const [suggestForm, setSuggestForm] = useState({
    brand_name: "", category: "", region: "US", count: 8,
  });
  const [suggesting, setSuggesting] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    setIsLoggedIn(true);
    fetchPrompts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchPrompts() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/prompts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setPrompts(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: "active" | "inactive") {
    await fetch(`${BASE}/prompts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setPrompts((ps) => ps.map((p) => p.id === id ? { ...p, status } : p));
  }

  async function handleDelete(id: string) {
    if (!confirm(tx("prompts", "confirmDelete", lang))) return;
    await fetch(`${BASE}/prompts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setPrompts((ps) => ps.filter((p) => p.id !== id));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddSaving(true);
    try {
      const res = await fetch(`${BASE}/prompts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const created = await res.json();
      setPrompts((ps) => [created, ...ps]);
      setShowAdd(false);
      setAddForm({ category: "", region: "US", prompt_text: "", intent_type: "high" });
    } catch (e) {
      alert(String(e));
    } finally {
      setAddSaving(false);
    }
  }

  async function handleSuggest(e: React.FormEvent) {
    e.preventDefault();
    setSuggesting(true);
    try {
      const res = await fetch(`${BASE}/prompts/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(suggestForm),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? `${res.status}`);
      }
      const created: Prompt[] = await res.json();
      setPrompts((ps) => [...created, ...ps]);
      setShowSuggest(false);
      setSuggestForm({ brand_name: "", category: "", region: "US", count: 8 });
    } catch (e) {
      alert(String(e));
    } finally {
      setSuggesting(false);
    }
  }

  const filtered = tab === "all" ? prompts : prompts.filter((p) => p.status === tab);

  const intentLabel = (t: string) =>
    t === "high" ? tx("prompts", "intentHigh", lang)
    : t === "comparison" ? tx("prompts", "intentComp", lang)
    : tx("prompts", "intentInfo", lang);

  const statusLabel = (s: string) =>
    s === "active" ? tx("prompts", "statusActive", lang)
    : s === "suggested" ? tx("prompts", "statusSuggested", lang)
    : tx("prompts", "statusInactive", lang);

  if (!isLoggedIn && !loading) {
    return (
      <div className="max-w-3xl mx-auto pt-20 text-center" style={{ color: "#7070a0" }}>
        {tx("prompts", "loginRequired", lang)}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.25)" }}
          >
            {tx("prompts", "pill", lang)}
          </div>
          <h1 className="text-3xl font-black mb-1">{tx("prompts", "title", lang)}</h1>
          <p className="text-sm" style={{ color: "#7070a0" }}>{tx("prompts", "subtitle", lang)}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setShowSuggest(true)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: "rgba(245,166,35,0.12)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.3)" }}
          >
            {tx("prompts", "aiSuggest", lang)}
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            {tx("prompts", "addPrompt", lang)}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        {(["all", "active", "suggested", "inactive"] as TabFilter[]).map((t) => {
          const count = t === "all" ? prompts.length : prompts.filter((p) => p.status === t).length;
          const tabLabelMap: Record<TabFilter, string> = {
            all:       tx("prompts", "tabAll", lang),
            active:    tx("prompts", "tabActive", lang),
            suggested: tx("prompts", "tabSuggested", lang),
            inactive:  tx("prompts", "tabInactive", lang),
          };
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
              style={
                tab === t
                  ? { background: "#25253f", color: "#f0f0f8" }
                  : { color: "#7070a0" }
              }
            >
              {tabLabelMap[t]}{" "}
              <span className="ml-1 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
        {loading ? (
          <div className="p-10 text-center text-sm" style={{ color: "#7070a0" }}>Loading…</div>
        ) : error ? (
          <div className="p-10 text-center text-sm" style={{ color: "#ff4d6d" }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-sm font-medium">{tx("prompts", "noPrompts", lang)}</p>
            <p className="text-xs" style={{ color: "#7070a0" }}>{tx("prompts", "noPromptsHint", lang)}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#7070a0" }}>
                  {tx("prompts", "colPrompt", lang)}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#7070a0" }}>
                  {tx("prompts", "colIntent", lang)}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: "#7070a0" }}>
                  {tx("prompts", "colCategory", lang)}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: "#7070a0" }}>
                  {tx("prompts", "colStatus", lang)}
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#7070a0" }}>
                  {tx("prompts", "colActions", lang)}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const ic = INTENT_COLORS[p.intent_type] ?? INTENT_COLORS.high;
                const sc = STATUS_COLORS[p.status] ?? STATUS_COLORS.active;
                return (
                  <tr
                    key={p.id}
                    style={{ background: i % 2 === 0 ? "#0a0a12" : "#0d0d18", borderBottom: "1px solid #1a1a2e" }}
                  >
                    <td className="px-4 py-3 max-w-xs">
                      <p className="truncate" title={p.prompt_text}>{p.prompt_text}</p>
                      {p.source === "ai_suggested" && (
                        <span className="text-xs mt-0.5" style={{ color: "#f5a623" }}>✦ AI</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: ic.bg, color: ic.color }}
                      >
                        {intentLabel(p.intent_type)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell" style={{ color: "#7070a0" }}>
                      <span className="text-xs">{p.category} · {p.region}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {statusLabel(p.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.status !== "active" && (
                          <button
                            onClick={() => handleStatusChange(p.id, "active")}
                            className="text-xs px-2 py-1 rounded-lg transition-opacity hover:opacity-80"
                            style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}
                          >
                            {tx("prompts", "activate", lang)}
                          </button>
                        )}
                        {p.status === "active" && (
                          <button
                            onClick={() => handleStatusChange(p.id, "inactive")}
                            className="text-xs px-2 py-1 rounded-lg transition-opacity hover:opacity-80"
                            style={{ background: "rgba(112,112,160,0.1)", color: "#7070a0" }}
                          >
                            {tx("prompts", "deactivate", lang)}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-xs px-2 py-1 rounded-lg transition-opacity hover:opacity-80"
                          style={{ background: "rgba(255,77,109,0.1)", color: "#ff4d6d" }}
                        >
                          {tx("prompts", "delete", lang)}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <form
            onSubmit={handleAdd}
            className="w-full max-w-lg rounded-2xl p-8 space-y-5"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <h2 className="text-lg font-bold">{tx("prompts", "modalAddTitle", lang)}</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#7070a0" }}>{tx("prompts", "labelCategory", lang)}</label>
                <input
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                  style={{ background: "#161625", border: "1px solid #25253f", color: "#f0f0f8" }}
                  placeholder={tx("prompts", "phCategory", lang)}
                  value={addForm.category}
                  onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#7070a0" }}>{tx("prompts", "labelRegion", lang)}</label>
                <select
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                  style={{ background: "#161625", border: "1px solid #25253f", color: "#f0f0f8" }}
                  value={addForm.region}
                  onChange={(e) => setAddForm((f) => ({ ...f, region: e.target.value }))}
                >
                  <option>US</option><option>UK</option><option>DE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#7070a0" }}>{tx("prompts", "labelIntent", lang)}</label>
              <select
                className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                style={{ background: "#161625", border: "1px solid #25253f", color: "#f0f0f8" }}
                value={addForm.intent_type}
                onChange={(e) => setAddForm((f) => ({ ...f, intent_type: e.target.value }))}
              >
                <option value="high">{tx("prompts", "intentHigh", lang)}</option>
                <option value="comparison">{tx("prompts", "intentComp", lang)}</option>
                <option value="info">{tx("prompts", "intentInfo", lang)}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#7070a0" }}>{tx("prompts", "labelPromptText", lang)}</label>
              <textarea
                className="w-full rounded-xl px-3 py-2 text-sm outline-none resize-none"
                style={{ background: "#161625", border: "1px solid #25253f", color: "#f0f0f8" }}
                rows={3}
                placeholder={tx("prompts", "phPromptText", lang)}
                value={addForm.prompt_text}
                onChange={(e) => setAddForm((f) => ({ ...f, prompt_text: e.target.value }))}
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: "1px solid #25253f", color: "#7070a0" }}
              >
                {tx("prompts", "cancel", lang)}
              </button>
              <button
                type="submit"
                disabled={addSaving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-50"
                style={{ background: "#ff6b35", color: "#fff" }}
              >
                {tx("prompts", "save", lang)}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Suggest Modal */}
      {showSuggest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <form
            onSubmit={handleSuggest}
            className="w-full max-w-lg rounded-2xl p-8 space-y-5"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div>
              <h2 className="text-lg font-bold mb-1">{tx("prompts", "modalSuggestTitle", lang)}</h2>
              <p className="text-xs" style={{ color: "#7070a0" }}>{tx("prompts", "suggestHint", lang)}</p>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#7070a0" }}>{tx("prompts", "labelBrand", lang)}</label>
              <input
                className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                style={{ background: "#161625", border: "1px solid #25253f", color: "#f0f0f8" }}
                placeholder={tx("prompts", "phBrand", lang)}
                value={suggestForm.brand_name}
                onChange={(e) => setSuggestForm((f) => ({ ...f, brand_name: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#7070a0" }}>{tx("prompts", "labelCategory", lang)}</label>
                <input
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                  style={{ background: "#161625", border: "1px solid #25253f", color: "#f0f0f8" }}
                  placeholder={tx("prompts", "phCategory", lang)}
                  value={suggestForm.category}
                  onChange={(e) => setSuggestForm((f) => ({ ...f, category: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#7070a0" }}>{tx("prompts", "labelRegion", lang)}</label>
                <select
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                  style={{ background: "#161625", border: "1px solid #25253f", color: "#f0f0f8" }}
                  value={suggestForm.region}
                  onChange={(e) => setSuggestForm((f) => ({ ...f, region: e.target.value }))}
                >
                  <option>US</option><option>UK</option><option>DE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#7070a0" }}>{tx("prompts", "labelCount", lang)}</label>
              <input
                type="number"
                min={1}
                max={20}
                className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                style={{ background: "#161625", border: "1px solid #25253f", color: "#f0f0f8" }}
                value={suggestForm.count}
                onChange={(e) => setSuggestForm((f) => ({ ...f, count: parseInt(e.target.value) || 8 }))}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowSuggest(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: "1px solid #25253f", color: "#7070a0" }}
              >
                {tx("prompts", "cancel", lang)}
              </button>
              <button
                type="submit"
                disabled={suggesting}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-50"
                style={{ background: "rgba(245,166,35,0.2)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.4)" }}
              >
                {suggesting ? tx("prompts", "generating", lang) : tx("prompts", "generate", lang)}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
