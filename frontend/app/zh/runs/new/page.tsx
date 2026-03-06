"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

const PROVIDER_OPTIONS = ["openai", "claude"] as const;
const REGION_OPTIONS = ["US", "UK", "DE"] as const;

type AnalysisType = "brand" | "seller" | "sku";

const TYPE_CONFIG: Record<AnalysisType, { label: string; placeholder: string; hint: string }> = {
  brand:  { label: "品牌名称",        placeholder: "例如：JumpStart Pro、Vantrue、NOCO",              hint: "追踪品牌整体在 AI 推荐中的曝光度" },
  seller: { label: "卖家 / 公司名称", placeholder: "例如：NOCO Company、Vantrue Electronics",        hint: "查看该卖家产品线在 AI 推荐中的整体表现" },
  sku:    { label: "产品 / SKU 名称", placeholder: "例如：NOCO GB40 1000A、Vantrue N4 Pro",         hint: "追踪具体型号在 AI 中的排名，对比竞品 SKU" },
};

export default function ZhNewRunPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisType, setAnalysisType] = useState<AnalysisType>("brand");

  const [form, setForm] = useState({
    brand_name: "",
    competitor_names: "",
    category: "",
    region: "US" as "US" | "UK" | "DE",
    num_prompts: 60,
    providers: ["openai", "claude"] as string[],
    price_band: "",
  });

  const toggleProvider = (p: string) => {
    setForm((f) => ({
      ...f,
      providers: f.providers.includes(p)
        ? f.providers.filter((x) => x !== p)
        : [...f.providers, p],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const run = await api.createRun({
        brand_name: form.brand_name.trim(),
        competitor_names: form.competitor_names
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        category: form.category.trim(),
        region: form.region,
        num_prompts: form.num_prompts,
        providers: form.providers,
        price_band: form.price_band.trim() || undefined,
      });
      router.push(`/zh/runs/${run.id}`);
    } catch (e) {
      setError(String(e));
      setLoading(false);
    }
  };

  const inputCls = "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors";
  const inputStyle = { background: "#161625", border: "1px solid #25253f", color: "#f0f0f8" };

  return (
    <div className="max-w-xl space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/zh/dashboard" className="text-sm transition-colors hover:text-white" style={{ color: "#7070a0" }}>
          ← 数据看板
        </Link>
        <span style={{ color: "#25253f" }}>/</span>
        <h1 className="text-xl font-bold">新建分析</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-6 space-y-5"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        {/* 分析类型选择器 */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>
            分析类型
          </label>
          <div className="flex gap-2 flex-wrap">
            {(["brand", "seller", "sku"] as AnalysisType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setAnalysisType(t)}
                className="text-sm px-3 py-1.5 rounded-lg border transition-colors"
                style={
                  analysisType === t
                    ? { background: "#ff6b35", color: "#fff", border: "1px solid #ff6b35" }
                    : { background: "#161625", color: "#7070a0", border: "1px solid #25253f" }
                }
              >
                {{ brand: "品牌", seller: "卖家", sku: "具体产品" }[t]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">{TYPE_CONFIG[analysisType].label} *</label>
          <input
            className={inputCls}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#ff6b35")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#25253f")}
            placeholder={TYPE_CONFIG[analysisType].placeholder}
            value={form.brand_name}
            onChange={(e) => setForm((f) => ({ ...f, brand_name: e.target.value }))}
            required
          />
          <p className="text-xs mt-1.5" style={{ color: "#555580" }}>{TYPE_CONFIG[analysisType].hint}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            竞品 <span className="font-normal" style={{ color: "#7070a0" }}>（逗号分隔）</span>
          </label>
          <input
            className={inputCls}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#ff6b35")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#25253f")}
            placeholder="例如：Anker, Spigen, Belkin"
            value={form.competitor_names}
            onChange={(e) => setForm((f) => ({ ...f, competitor_names: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">品类 *</label>
          <input
            className={inputCls}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#ff6b35")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#25253f")}
            placeholder="例如：USB-C 充电器"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">地区</label>
            <select
              className={inputCls}
              style={inputStyle}
              value={form.region}
              onChange={(e) => setForm((f) => ({ ...f, region: e.target.value as "US" | "UK" | "DE" }))}
            >
              {REGION_OPTIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">提示词数量</label>
            <input
              type="number"
              min={1}
              max={200}
              className={inputCls}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#ff6b35")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#25253f")}
              value={form.num_prompts}
              onChange={(e) => setForm((f) => ({ ...f, num_prompts: parseInt(e.target.value) || 60 }))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            价格区间 <span className="font-normal" style={{ color: "#7070a0" }}>（可选）</span>
          </label>
          <input
            className={inputCls}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#ff6b35")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#25253f")}
            placeholder="例如：$20-$40"
            value={form.price_band}
            onChange={(e) => setForm((f) => ({ ...f, price_band: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">模型</label>
          <div className="flex gap-3">
            {PROVIDER_OPTIONS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => toggleProvider(p)}
                className="text-sm px-4 py-1.5 rounded-xl border transition-colors"
                style={
                  form.providers.includes(p)
                    ? { background: "#ff6b35", color: "#fff", border: "1px solid #ff6b35" }
                    : { background: "#161625", color: "#7070a0", border: "1px solid #25253f" }
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div
            className="rounded p-3 text-sm"
            style={{ background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)", color: "#ff4d6d" }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || form.providers.length === 0}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          {loading ? "启动中…" : "开始分析"}
        </button>
      </form>
    </div>
  );
}
