"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SELECTION_DATA, SECTIONS, PRODUCT_DATA, type SellerSignal } from "@/lib/selection-data";
import { getToken } from "@/lib/auth";

// ── 辅助组件 ──────────────────────────────────────────────────────────────────

const ARRS_COLOR = (v: number) => v < 30 ? "#22c55e" : v < 50 ? "#f5a623" : "#ff4d6d";
const SIGNAL_CFG: Record<SellerSignal, { label: string; color: string; bg: string }> = {
  strong_buy: { label: "强烈推荐入场", color: "#22c55e", bg: "rgba(34,197,94,.10)" },
  watch:      { label: "观望",         color: "#f5a623", bg: "rgba(245,166,35,.10)" },
  avoid:      { label: "暂缓",         color: "#7070a0", bg: "rgba(112,112,160,.08)" },
};

function Sparkline({ data, color = "#ff6b35" }: { data: number[]; color?: string }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const W = 80, H = 28;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * H}`).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const GEO_PLAN = 199;
interface OpItem { id: string; label: string; unit: string; pct: number; def: number; max: number; weekly?: boolean }
const OPS: OpItem[] = [
  { id: "cs",   label: "客服接待",          unit: "小时/周",  pct: .70, def: 20, max: 80, weekly: true },
  { id: "res",  label: "选品调研",          unit: "小时/月", pct: .60, def: 15, max: 60 },
  { id: "tr",   label: "翻译与本地化",       unit: "小时/月", pct: .80, def: 10, max: 40 },
  { id: "data", label: "数据录入与报表整理",  unit: "小时/月", pct: .75, def: 20, max: 80 },
];

// ── 主组件 ────────────────────────────────────────────────────────────────────

export default function ZhProductPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [vals, setVals] = useState<Record<string, number>>(Object.fromEntries(OPS.map(i => [i.id, i.def])));
  const [rate, setRate] = useState(15);

  useEffect(() => { setLoggedIn(!!getToken()); }, []);

  const moHrs  = (item: OpItem) => item.weekly ? vals[item.id] * 4.33 : vals[item.id];
  const total  = OPS.reduce((s, i) => s + moHrs(i) * rate, 0);
  const saved  = OPS.reduce((s, i) => s + moHrs(i) * rate * i.pct, 0);
  const geoMos = Math.floor(saved / GEO_PLAN);

  const primaryCta = loggedIn
    ? { href: "/runs/new",  label: "运行新一轮分析 →" }
    : { href: "/zh/signup", label: "免费开始 — 无需信用卡 →" };

  const q = search.trim().toLowerCase();
  const skuMatches = q.length >= 2
    ? Object.entries(PRODUCT_DATA).flatMap(([catId, products]) => {
        const cat = SELECTION_DATA.find(c => c.id === catId);
        return products
          .filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            (p.asin ?? "").toLowerCase().includes(q)
          )
          .map(p => ({ ...p, catId, catName: cat?.categoryZh ?? catId }));
      })
    : [];

  const filtered = filter === "all" ? SELECTION_DATA : SELECTION_DATA.filter(c => c.parentSection === filter);

  return (
    <div className="space-y-20 py-10 max-w-5xl mx-auto px-4">

      {/* ── 顶部英雄区 ── */}
      <div className="text-center space-y-5 max-w-3xl mx-auto">
        <div
          className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.25)" }}
        >
          阿凡提 产品
        </div>
        <h1 className="text-4xl font-black leading-tight">
          AI 大清洗来了。<br />
          <span style={{ color: "#ff6b35" }}>你的品牌在 AI 答案里吗？</span>
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#9090b0" }}>
          你在 Shopee 是爆款，但当马来西亚买家打开 ChatGPT 问「最佳启动宝 2026」，
          你的品牌根本不在答案里。阿凡提帮你追踪、修复、并预测这个问题。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={primaryCta.href}
            className="px-8 py-3.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff", boxShadow: "0 0 32px rgba(255,107,53,.3)" }}
          >
            {primaryCta.label}
          </Link>
          <Link
            href="/zh/company/techvision-pro"
            className="px-8 py-3.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ border: "1px solid #25253f", color: "#f0f0f8" }}
          >
            查看 Live Demo →
          </Link>
        </div>
      </div>

      {/* ── 数字跑马灯 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { num: "4",    label: "大 AI 引擎",        sub: "ChatGPT · Claude · Gemini · Perplexity" },
          { num: "200+", label: "买家查询语料库",     sub: "中英文 + 东南亚本地语言" },
          { num: "12",   label: "汽配 & 3C 品类",     sub: "启动宝 · 行车记录仪 · 支架 · 充电器" },
          { num: "实时",  label: "每周自动更新",       sub: "追踪 AI 排名周环比变化" },
        ].map(s => (
          <div key={s.num} className="rounded-xl p-4 text-center" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
            <div className="text-2xl font-black mb-1" style={{ color: "#ff6b35" }}>{s.num}</div>
            <div className="text-sm font-semibold mb-0.5">{s.label}</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════ STEP 1 ═══════════════════════════════════ */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0"
            style={{ background: "rgba(255,107,53,0.15)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.4)" }}
          >1</div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#ff6b35" }}>诊断</div>
            <h2 className="text-2xl font-black">AI 排名第几？GEO 评分诊断你的可见度</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="space-y-5">
            <p className="text-sm leading-relaxed" style={{ color: "#9090b0" }}>
              阿凡提调用 ChatGPT、Claude、Gemini、Perplexity 四大 AI，
              针对你的品类运行 20+ 个真实买家查询——就像你的目标客户实际会问的那些问题。
              结果给出 GEO 评分（越低越好）和与竞品的 SOV 声量对比。
            </p>
            <ul className="space-y-2 text-sm" style={{ color: "#9090b0" }}>
              {[
                "GEO 评分 · 越低 = 被推荐越多",
                "与竞品的声量份额（SOV）对比",
                "按查询意图（高意向 / 对比 / 资讯）分类分析",
                "引用来源追溯（YouTube / 评测网站 / 社区）",
                "缩小差距的 3 步具体行动计划",
              ].map(f => (
                <li key={f} className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5" style={{ color: "#ff6b35" }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={loggedIn ? "/runs/new" : "/zh/signup"}
              className="inline-block text-sm font-semibold px-6 py-3 rounded-xl transition-opacity hover:opacity-85"
              style={{ background: "#ff6b35", color: "#fff" }}
            >
              {loggedIn ? "运行新一轮诊断 →" : "注册——立即运行免费诊断 →"}
            </Link>
          </div>

          {/* Demo 卡 — 汽配品牌 */}
          <div className="rounded-2xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>
              示例报告 — JumpStart Pro（应急启动宝）
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black shrink-0"
                style={{ background: "rgba(245,166,35,0.12)", border: "2px solid #f5a623", color: "#f5a623" }}
              >41</div>
              <div>
                <div className="text-sm font-semibold">GEO 评分</div>
                <div className="text-xs mt-0.5" style={{ color: "#f5a623" }}>观望区间 — 竞品正在侵蚀你的 AI 份额</div>
                <div className="text-xs mt-1" style={{ color: "#7070a0" }}>GEO 综合分：68/100 · 趋势 ↑</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7070a0" }}>
                AI 声量份额 (SOV)
              </div>
              {[
                { name: "NOCO GB40（竞品）", sov: 34.2, isYou: false },
                { name: "JumpStart Pro（你）", sov: 19.3, isYou: true },
                { name: "TACKLIFE T8",         sov: 14.7, isYou: false },
              ].map(b => (
                <div key={b.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: b.isYou ? "#ff6b35" : "#f0f0f8" }}>{b.name}</span>
                    <span style={{ color: "#7070a0" }}>{b.sov}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "#25253f" }}>
                    <div className="h-full rounded-full"
                      style={{ width: `${(b.sov / 50) * 100}%`, background: b.isYou ? "#ff6b35" : "#3a3a5f" }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs pt-2" style={{ color: "#5a5a7a", borderTop: "1px solid #25253f" }}>
              真实查询：「best car jump starter Malaysia 2026」· 2026-02-28 扫描
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════ STEP 2 ═══════════════════════════════════ */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0"
            style={{ background: "rgba(245,166,35,0.12)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.35)" }}
          >2</div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#f5a623" }}>监控</div>
            <h2 className="text-2xl font-black">每周追踪 AI 排名变化趋势</h2>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <div className="px-6 py-4 flex items-center gap-3" style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
            <span className="text-sm font-semibold">DriveX International — 4 周 GEO 趋势</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,107,53,0.08)", color: "#ff6b35" }}>
              Shopee SEA · Amazon US
            </span>
          </div>
          {[
            { name: "JumpStart Pro",  scores: [52, 56, 62, 68], trend: "#22c55e", tag: "↑ 执行手册生效" },
            { name: "MagDrive Pro",   scores: [31, 29, 27, 24], trend: "#ff4d6d", tag: "↓ 内容差距扩大" },
            { name: "DriveSafe Pro",  scores: [38, 33, 27, 18], trend: "#ff4d6d", tag: "↓ 紧急——AI 正在过滤该品牌" },
          ].map((b, i) => (
            <div
              key={b.name}
              className="flex items-center gap-4 px-6 py-4"
              style={{ background: i % 2 === 0 ? "#0a0a12" : "#0d0d18", borderBottom: "1px solid #1a1a2e" }}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{b.name}</div>
                <div className="text-xs mt-0.5" style={{ color: b.trend }}>{b.tag}</div>
              </div>
              <div className="flex gap-3 text-center">
                {["1月6日", "1月13日", "1月20日", "1月27日"].map((w, j) => (
                  <div key={w} className="hidden sm:block">
                    <div className="text-xs font-bold" style={{ color: b.trend }}>{b.scores[j]}</div>
                    <div className="text-xs" style={{ color: "#4a4a6a" }}>{w}</div>
                  </div>
                ))}
              </div>
              <Sparkline data={b.scores} color={b.trend} />
            </div>
          ))}
        </div>

        <div
          className="rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center gap-5"
          style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)" }}
        >
          <div className="text-3xl shrink-0">📊</div>
          <div>
            <div className="font-semibold text-sm mb-1">GEO → 平台销量信号相关性</div>
            <p className="text-sm leading-relaxed" style={{ color: "#9090b0" }}>
              JumpStart Pro GEO 分 4 周 +16 → Shopee MY 同期搜索量 +23%。
              DriveSafe Pro GEO 分 −20 → 独立站流量 −18%。
              AI 可见度是平台流量的领先指标，提前 2–4 周预警。
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════ STEP 3 ═══════════════════════════════════ */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0"
            style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.35)" }}
          >3</div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#22c55e" }}>发现</div>
            <h2 className="text-2xl font-black">AI 正在推荐买家购买哪些 SKU？</h2>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索品牌、SKU 或 ASIN（例如：NOCO、B015TKUPIC）"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none pr-10"
            style={{ background: "#0f0f17", border: "1px solid #25253f", color: "#f0f0f8" }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded" style={{ color: "#7070a0" }}>✕</button>
          )}
        </div>

        {skuMatches.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>
              找到 {skuMatches.length} 个匹配 SKU
            </div>
            {skuMatches.slice(0, 6).map((p, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-xl" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{p.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#7070a0" }}>{p.catName} · {p.brand}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold" style={{ color: ARRS_COLOR(p.arrs) }}>{p.aiMentions}/100</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>AI 提及</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold" style={{ color: ARRS_COLOR(p.arrs) }}>GEO {p.arrs}</div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>{p.priceRange}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!search && (
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setFilter(s.id)}
                className="text-xs px-4 py-1.5 rounded-full font-medium transition-colors"
                style={filter === s.id ? { background: "#ff6b35", color: "#fff" } : { background: "#0f0f17", border: "1px solid #25253f", color: "#7070a0" }}>
                {s.labelZh}
              </button>
            ))}
          </div>
        )}

        {!search && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(cat => {
              const sig = SIGNAL_CFG[cat.sellerSignal];
              const max = cat.topBrands[0].sov;
              return (
                <div key={cat.id} className="rounded-xl p-5 space-y-4 flex flex-col" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-sm">{cat.categoryZh}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#7070a0" }}>{cat.parentSectionZh}</div>
                    </div>
                    <div className="text-xs font-bold shrink-0" style={{ color: cat.trend === "up" ? "#22c55e" : cat.trend === "down" ? "#ff4d6d" : "#7070a0" }}>
                      {cat.trend === "up" ? "↑" : cat.trend === "down" ? "↓" : "→"} {cat.trendPts} pts
                    </div>
                  </div>
                  <div className="text-xs font-bold px-2.5 py-1 rounded-full self-start" style={{ background: sig.bg, color: sig.color }}>{sig.label}</div>
                  <div className="space-y-2">
                    {cat.topBrands.map(b => (
                      <div key={b.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span style={{ color: "#f0f0f8" }}>{b.name}</span>
                          <div className="flex items-center gap-2">
                            <span style={{ color: "#7070a0" }}>{b.sov}% SOV</span>
                            <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ background: `${ARRS_COLOR(b.arrs)}18`, color: ARRS_COLOR(b.arrs) }}>{b.arrs}</span>
                          </div>
                        </div>
                        <div className="h-1 rounded-full" style={{ background: "#25253f" }}>
                          <div className="h-full rounded-full" style={{ width: `${(b.sov / max) * 100}%`, background: "#ff6b35" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed mt-auto" style={{ color: "#7070a0" }}>{cat.sellerNoteZh}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════ STEP 4 ═══════════════════════════════════ */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0"
            style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.35)" }}>4</div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#60a5fa" }}>优化 & 资金</div>
            <h2 className="text-2xl font-black">省下的运营成本，正好能支付 GEO 订阅</h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">团队时薪</span>
                <span className="font-bold" style={{ color: "#ff6b35" }}>${rate}/小时</span>
              </div>
              <input type="range" min={8} max={50} value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-orange-500" />
              <div className="flex justify-between text-xs" style={{ color: "#7070a0" }}><span>$8</span><span>$50</span></div>
            </div>
            {OPS.map(item => {
              const hrs = moHrs(item);
              const save = hrs * rate * item.pct;
              return (
                <div key={item.id} className="rounded-xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#7070a0" }}>AI 可接管 {Math.round(item.pct * 100)}% 的工作量</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{vals[item.id]} {item.unit}</div>
                      <div className="text-xs" style={{ color: "#7070a0" }}>${(hrs * rate).toFixed(0)}/月</div>
                    </div>
                  </div>
                  <input type="range" min={0} max={item.max} value={vals[item.id]} onChange={e => setVals(p => ({ ...p, [item.id]: Number(e.target.value) }))} className="w-full accent-orange-500" />
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "#7070a0" }}>0 小时</span>
                    <span style={{ color: "#22c55e" }}>AI 节省：${save.toFixed(0)}/月</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-2 lg:sticky lg:top-20">
            <div className="rounded-xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="text-sm font-semibold">月度节省分析</div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span style={{ color: "#7070a0" }}>当前月度成本</span><span>${total.toFixed(0)}</span></div>
                <div className="flex justify-between text-sm"><span style={{ color: "#7070a0" }}>AI 优化后</span><span>${(total - saved).toFixed(0)}</span></div>
                <div className="h-px" style={{ background: "#25253f" }} />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">月度节省</span>
                  <span className="text-2xl font-black" style={{ color: "#ff6b35" }}>${saved.toFixed(0)}</span>
                </div>
              </div>
              {saved > 0 && (
                <div className="rounded-lg p-4 space-y-1" style={{ background: "rgba(255,107,53,.08)", border: "1px solid rgba(255,107,53,.2)" }}>
                  <div className="text-xs font-semibold" style={{ color: "#ff6b35" }}>这笔钱能做什么</div>
                  <p className="text-sm" style={{ color: "#f0f0f8" }}>
                    {geoMos > 0 ? <><strong>{geoMos} 个月</strong>的阿凡提 GEO 监控，每月自动运行。</> : "拖动滑块增加工时，查看可支持的 GEO 月数。"}
                  </p>
                </div>
              )}
              <Link href={loggedIn ? "/runs/new" : "/zh/signup"}
                className="block text-center text-sm font-semibold px-4 py-3 rounded-xl transition-opacity hover:opacity-85"
                style={{ background: "#ff6b35", color: "#fff" }}>
                {loggedIn ? "开始 GEO 监控 →" : "注册——开始节省并投入 GEO →"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── 底部 CTA ── */}
      <div className="rounded-2xl p-10 text-center space-y-6"
        style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.2)" }}>
        <h3 className="text-2xl font-black">从今天开始，占领 AI 推荐位</h3>
        <p className="text-sm" style={{ color: "#9090b0" }}>
          当你的竞品还不知道 AI 流量是什么的时候，你已经在那里了。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={loggedIn ? "/zh/dashboard" : "/zh/signup"}
            className="px-8 py-3.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff" }}>
            {loggedIn ? "进入仪表盘 →" : "免费开始 →"}
          </Link>
          <Link href="/zh/pricing"
            className="px-8 py-3.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ border: "1px solid #25253f", color: "#f0f0f8" }}>
            查看定价
          </Link>
          <Link href="/zh/book-demo"
            className="px-8 py-3.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ border: "1px solid rgba(255,107,53,0.4)", color: "#ff6b35" }}>
            预约免费演示 →
          </Link>
        </div>
      </div>

    </div>
  );
}
