"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, Schedule } from "@/lib/api";

const PROVIDER_OPTIONS = ["openai", "claude"] as const;
const REGION_OPTIONS = ["US", "UK", "DE"] as const;

const CRON_PRESETS_EN = [
  { label: "Every Monday 9am", value: "0 9 * * 1" },
  { label: "Every day 8am", value: "0 8 * * *" },
  { label: "Every Sunday midnight", value: "0 0 * * 0" },
];
const CRON_PRESETS_ZH = [
  { label: "每周一 9:00", value: "0 9 * * 1" },
  { label: "每天 8:00", value: "0 8 * * *" },
  { label: "每周日 0:00", value: "0 0 * * 0" },
];

const S = {
  en: {
    title: "Schedules", subtitle: "Automated recurring runs",
    newBtn: "+ New Schedule", cancelBtn: "Cancel", formTitle: "New schedule",
    brandLabel: "Brand name *", categoryLabel: "Category *",
    competitorsLabel: "Competitors", competitorsSub: "(comma separated)",
    regionLabel: "Region", promptsLabel: "Prompts", priceLabel: "Price band",
    cronLabel: "Schedule (cron)", providersLabel: "Providers",
    deleteConfirm: "Delete this schedule?",
    creating: "Creating…", createBtn: "Create schedule",
    empty: "No schedules yet.",
    colBrand: "Brand", colCategory: "Category", colCron: "Cron",
    colNext: "Next run", colStatus: "Status",
    active: "active", paused: "paused",
    pause: "Pause", resume: "Resume", delete: "Delete",
  },
  zh: {
    title: "自动监控", subtitle: "定时自动执行的分析任务",
    newBtn: "+ 新建监控", cancelBtn: "取消", formTitle: "新建监控",
    brandLabel: "品牌名称 *", categoryLabel: "品类 *",
    competitorsLabel: "竞品", competitorsSub: "（逗号分隔）",
    regionLabel: "地区", promptsLabel: "提示词数量", priceLabel: "价格区间",
    cronLabel: "定时规则（Cron）", providersLabel: "模型",
    deleteConfirm: "确认删除该监控任务？",
    creating: "创建中…", createBtn: "创建监控",
    empty: "暂无监控任务。",
    colBrand: "品牌", colCategory: "品类", colCron: "Cron",
    colNext: "下次运行", colStatus: "状态",
    active: "运行中", paused: "已暂停",
    pause: "暂停", resume: "恢复", delete: "删除",
  },
} as const;

export default function SchedulesClient({ initial, lang = "en" }: { initial: Schedule[]; lang?: "en" | "zh" }) {
  const t = S[lang];
  const CRON_PRESETS = lang === "zh" ? CRON_PRESETS_ZH : CRON_PRESETS_EN;
  const router = useRouter();
  const [schedules, setSchedules] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setError("");
    try {
      const s = await api.createSchedule({
        brand_name: form.brand_name.trim(),
        competitor_names: form.competitor_names.split(",").map((x) => x.trim()).filter(Boolean),
        category: form.category.trim(),
        region: form.region,
        providers: form.providers,
        price_band: form.price_band.trim() || undefined,
        cron_expr: form.cron_expr,
        num_prompts: form.num_prompts,
      });
      setSchedules((prev) => [s, ...prev]);
      setShowForm(false);
      router.refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const toggleEnabled = async (s: Schedule) => {
    try {
      const updated = s.enabled
        ? await api.disableSchedule(s.id)
        : await api.enableSchedule(s.id);
      setSchedules((prev) => prev.map((x) => (x.id === s.id ? updated : x)));
    } catch (e) {
      alert(String(e));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.deleteConfirm)) return;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-sm mt-1" style={{ color: "#7070a0" }}>{t.subtitle}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-medium px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          {showForm ? t.cancelBtn : t.newBtn}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl p-6 space-y-4"
          style={{ background: "#0f0f17", border: "1px solid #25253f" }}
        >
          <h2 className="font-semibold">{t.formTitle}</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t.brandLabel}</label>
              <input className={inputCls} style={inputStyle} onFocus={focusOn} onBlur={focusOff}
                value={form.brand_name} onChange={(e) => setForm((f) => ({ ...f, brand_name: e.target.value }))}
                placeholder="Nekteck" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t.categoryLabel}</label>
              <input className={inputCls} style={inputStyle} onFocus={focusOn} onBlur={focusOff}
                value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="USB-C chargers" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              {t.competitorsLabel} <span className="font-normal" style={{ color: "#7070a0" }}>{t.competitorsSub}</span>
            </label>
            <input className={inputCls} style={inputStyle} onFocus={focusOn} onBlur={focusOff}
              value={form.competitor_names} onChange={(e) => setForm((f) => ({ ...f, competitor_names: e.target.value }))}
              placeholder="Anker, Spigen" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t.regionLabel}</label>
              <select className={inputCls} style={inputStyle} onFocus={focusOn} onBlur={focusOff}
                value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value as "US" | "UK" | "DE" }))}>
                {REGION_OPTIONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t.promptsLabel}</label>
              <input type="number" min={1} max={200} className={inputCls} style={inputStyle} onFocus={focusOn} onBlur={focusOff}
                value={form.num_prompts} onChange={(e) => setForm((f) => ({ ...f, num_prompts: parseInt(e.target.value) || 60 }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t.priceLabel}</label>
              <input className={inputCls} style={inputStyle} onFocus={focusOn} onBlur={focusOff}
                value={form.price_band} onChange={(e) => setForm((f) => ({ ...f, price_band: e.target.value }))}
                placeholder="$20-$40" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t.cronLabel}</label>
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
            <label className="block text-sm font-medium mb-2">{t.providersLabel}</label>
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
            disabled={loading || form.providers.length === 0}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            {loading ? t.creating : t.createBtn}
          </button>
        </form>
      )}

      {schedules.length === 0 && (
        <div className="rounded-xl p-12 text-center" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <p className="text-sm" style={{ color: "#7070a0" }}>{t.empty}</p>
        </div>
      )}

      {schedules.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wide" style={{ background: "#161625", color: "#7070a0" }}>
              <tr>
                <th className="text-left px-4 py-3">{t.colBrand}</th>
                <th className="text-left px-4 py-3">{t.colCategory}</th>
                <th className="text-left px-4 py-3">{t.colCron}</th>
                <th className="text-left px-4 py-3">{t.colNext}</th>
                <th className="text-left px-4 py-3">{t.colStatus}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody style={{ background: "#0f0f17" }}>
              {schedules.map((s) => (
                <tr key={s.id} style={{ borderTop: "1px solid #25253f" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "#ff6b35" }}>{s.brand_name}</td>
                  <td className="px-4 py-3" style={{ color: "#7070a0" }}>{s.category}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "#7070a0" }}>{s.cron_expr}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#7070a0" }}>
                    {s.next_run_at ? new Date(s.next_run_at).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={s.enabled
                        ? { background: "rgba(34,197,94,0.12)", color: "#22c55e" }
                        : { background: "rgba(112,112,160,0.12)", color: "#7070a0" }}
                    >
                      {s.enabled ? t.active : t.paused}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => toggleEnabled(s)}
                        className="text-xs underline transition-colors hover:text-white"
                        style={{ color: "#7070a0" }}
                      >
                        {s.enabled ? t.pause : t.resume}
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-xs underline transition-colors hover:opacity-80"
                        style={{ color: "#ff4d6d" }}
                      >
                        {t.delete}
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
