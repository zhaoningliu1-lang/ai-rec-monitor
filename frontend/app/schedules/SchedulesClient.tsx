"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, Schedule } from "@/lib/api";
import { isLoggedIn, isPaid } from "@/lib/auth";
import { Lang, tx } from "@/lib/i18n";

const PROVIDER_OPTIONS = ["openai", "claude"] as const;
const REGION_OPTIONS = ["US", "UK", "DE"] as const;

export default function SchedulesClient({ lang = "en" }: { lang?: Lang }) {
  const s = (k: keyof typeof import("@/lib/i18n").t.schedules) => tx("schedules", k, lang);
  const pricingHref = lang === "zh" ? "/zh/pricing" : "/pricing";

  const [authed, setAuthed] = useState<boolean | null>(null); // null = loading
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    setAuthed(isLoggedIn());
    setPaid(isPaid());
  }, []);

  const CRON_PRESETS = [
    { label: s("cronMon9"),   value: "0 9 * * 1" },
    { label: s("cronDaily8"), value: "0 8 * * *" },
    { label: s("cronSun0"),   value: "0 0 * * 0" },
  ];

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    brand_name: "",
    competitor_names: "",
    category: "",
    region: "US" as "US" | "UK" | "DE",
    providers: ["openai", "claude"] as string[],
    price_band: "",
    cron_expr: "0 9 * * 1",
    num_prompts: 60,
  });

  useEffect(() => {
    api.listSchedules()
      .then(setSchedules)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleProvider = (p: string) => {
    setForm((f) => ({
      ...f,
      providers: f.providers.includes(p)
        ? f.providers.filter((x) => x !== p)
        : [...f.providers, p],
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const created = await api.createSchedule({
        brand_name: form.brand_name.trim(),
        competitor_names: form.competitor_names.split(",").map((x) => x.trim()).filter(Boolean),
        category: form.category.trim(),
        region: form.region,
        providers: form.providers,
        price_band: form.price_band.trim() || undefined,
        cron_expr: form.cron_expr,
        num_prompts: form.num_prompts,
      });
      setSchedules((prev) => [created, ...prev]);
      setShowForm(false);
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  };

  const toggleEnabled = async (sc: Schedule) => {
    try {
      const updated = sc.enabled
        ? await api.disableSchedule(sc.id)
        : await api.enableSchedule(sc.id);
      setSchedules((prev) => prev.map((x) => (x.id === sc.id ? updated : x)));
    } catch (e) {
      alert(String(e));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(s("deleteConfirm"))) return;
    try {
      await api.deleteSchedule(id);
      setSchedules((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      alert(String(e));
    }
  };

  const inputCls = "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors";
  const inputStyle = { background: "#161625", border: "1px solid #25253f", color: "#f0f0f8" };
  const focusOn  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.currentTarget.style.borderColor = "#ff6b35");
  const focusOff = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.currentTarget.style.borderColor = "#25253f");

  /* ── Gate: not logged in or not paid ── */
  if (authed === false) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{s("title")}</h1>
        <div className="rounded-2xl p-10 text-center space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <p className="text-lg font-semibold">{s("loginRequired")}</p>
          <Link href={lang === "zh" ? "/zh/login" : "/login"} className="inline-block text-sm font-medium px-6 py-2.5 rounded-xl transition-opacity hover:opacity-80" style={{ background: "#ff6b35", color: "#fff" }}>
            {s("loginCta")}
          </Link>
        </div>
      </div>
    );
  }

  if (authed && !paid) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{s("title")}</h1>
        <div className="rounded-2xl p-10 text-center space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}>Growth</div>
          <p className="text-lg font-semibold">{s("paidOnly")}</p>
          <p className="text-sm max-w-md mx-auto" style={{ color: "#7070a0" }}>{s("paidOnlyDesc")}</p>
          <Link href={pricingHref} className="inline-block text-sm font-medium px-6 py-2.5 rounded-xl transition-opacity hover:opacity-80" style={{ background: "#ff6b35", color: "#fff" }}>
            {s("upgradeCta")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{s("title")}</h1>
          <p className="text-sm mt-1" style={{ color: "#7070a0" }}>{s("subtitle")}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-medium px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          {showForm ? s("cancelBtn") : s("newBtn")}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl p-6 space-y-4"
          style={{ background: "#0f0f17", border: "1px solid #25253f" }}
        >
          <h2 className="font-semibold">{s("formTitle")}</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{s("brandLabel")}</label>
              <input className={inputCls} style={inputStyle} onFocus={focusOn} onBlur={focusOff}
                value={form.brand_name} onChange={(e) => setForm((f) => ({ ...f, brand_name: e.target.value }))}
                placeholder="Nekteck" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{s("categoryLabel")}</label>
              <input className={inputCls} style={inputStyle} onFocus={focusOn} onBlur={focusOff}
                value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="USB-C chargers" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              {s("competitorsLabel")} <span className="font-normal" style={{ color: "#7070a0" }}>{s("competitorsSub")}</span>
            </label>
            <input className={inputCls} style={inputStyle} onFocus={focusOn} onBlur={focusOff}
              value={form.competitor_names} onChange={(e) => setForm((f) => ({ ...f, competitor_names: e.target.value }))}
              placeholder="Anker, Spigen" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{s("regionLabel")}</label>
              <select className={inputCls} style={inputStyle} onFocus={focusOn} onBlur={focusOff}
                value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value as "US" | "UK" | "DE" }))}>
                {REGION_OPTIONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{s("promptsLabel")}</label>
              <input type="number" min={1} max={200} className={inputCls} style={inputStyle} onFocus={focusOn} onBlur={focusOff}
                value={form.num_prompts} onChange={(e) => setForm((f) => ({ ...f, num_prompts: parseInt(e.target.value) || 60 }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{s("priceLabel")}</label>
              <input className={inputCls} style={inputStyle} onFocus={focusOn} onBlur={focusOff}
                value={form.price_band} onChange={(e) => setForm((f) => ({ ...f, price_band: e.target.value }))}
                placeholder="$20-$40" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{s("cronLabel")}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {CRON_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, cron_expr: p.value }))}
                  className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
                  style={form.cron_expr === p.value
                    ? { background: "#ff6b35", color: "#fff", border: "1px solid #ff6b35" }
                    : { background: "#161625", color: "#7070a0", border: "1px solid #25253f" }}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <input className={`${inputCls} font-mono`} style={inputStyle} onFocus={focusOn} onBlur={focusOff}
              value={form.cron_expr} onChange={(e) => setForm((f) => ({ ...f, cron_expr: e.target.value }))} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{s("providersLabel")}</label>
            <div className="flex gap-3">
              {PROVIDER_OPTIONS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleProvider(p)}
                  className="text-sm px-4 py-1.5 rounded-xl border transition-colors"
                  style={form.providers.includes(p)
                    ? { background: "#ff6b35", color: "#fff", border: "1px solid #ff6b35" }
                    : { background: "#161625", color: "#7070a0", border: "1px solid #25253f" }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded p-3 text-sm"
              style={{ background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)", color: "#ff4d6d" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving || form.providers.length === 0}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            {saving ? s("creating") : s("createBtn")}
          </button>
        </form>
      )}

      {loading && (
        <div className="rounded-xl p-12 text-center" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <p className="text-sm" style={{ color: "#7070a0" }}>{s("loading")}</p>
        </div>
      )}

      {!loading && schedules.length === 0 && (
        <div className="rounded-xl p-12 text-center" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <p className="text-sm" style={{ color: "#7070a0" }}>{s("empty")}</p>
        </div>
      )}

      {!loading && schedules.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wide" style={{ background: "#161625", color: "#7070a0" }}>
              <tr>
                <th className="text-left px-4 py-3">{s("colBrand")}</th>
                <th className="text-left px-4 py-3">{s("colCategory")}</th>
                <th className="text-left px-4 py-3">{s("colCron")}</th>
                <th className="text-left px-4 py-3">{s("colNext")}</th>
                <th className="text-left px-4 py-3">{s("colStatus")}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody style={{ background: "#0f0f17" }}>
              {schedules.map((sc) => (
                <tr key={sc.id} style={{ borderTop: "1px solid #25253f" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "#ff6b35" }}>{sc.brand_name}</td>
                  <td className="px-4 py-3" style={{ color: "#7070a0" }}>{sc.category}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "#7070a0" }}>{sc.cron_expr}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#7070a0" }}>
                    {sc.next_run_at ? new Date(sc.next_run_at).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={sc.enabled
                        ? { background: "rgba(34,197,94,0.12)", color: "#22c55e" }
                        : { background: "rgba(112,112,160,0.12)", color: "#7070a0" }}
                    >
                      {sc.enabled ? s("active") : s("paused")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => toggleEnabled(sc)}
                        className="text-xs underline transition-colors hover:text-white"
                        style={{ color: "#7070a0" }}
                      >
                        {sc.enabled ? s("pause") : s("resume")}
                      </button>
                      <button
                        onClick={() => handleDelete(sc.id)}
                        className="text-xs underline transition-colors hover:opacity-80"
                        style={{ color: "#ff4d6d" }}
                      >
                        {s("delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
