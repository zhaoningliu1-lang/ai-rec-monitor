"use client";

import { useState } from "react";
import Link from "next/link";
import { SELECTION_DATA, SECTIONS, type SellerSignal } from "@/lib/selection-data";

const ARRS_COLOR = (v: number) => v < 30 ? "#22c55e" : v < 50 ? "#f5a623" : "#ff4d6d";
const SIGNAL_CFG: Record<SellerSignal, { label: string; color: string; bg: string }> = {
  strong_buy: { label: "强烈推荐入场", color:"#22c55e", bg:"rgba(34,197,94,.10)" },
  watch:      { label: "观望",         color:"#f5a623", bg:"rgba(245,166,35,.10)" },
  avoid:      { label: "暂缓",         color:"#7070a0", bg:"rgba(112,112,160,.08)" },
};
const TREND_ICON: Record<string, string> = { up:"↑", stable:"→", down:"↓" };
const TREND_CLR:  Record<string, string> = { up:"#22c55e", stable:"#7070a0", down:"#ff4d6d" };

const GEO_PLAN = 199;
interface OpItem { id:string; label:string; unit:string; pct:number; def:number; max:number; weekly?:boolean }
const OPS: OpItem[] = [
  { id:"cs",   label:"客服接待",          unit:"小时/周",  pct:.70, def:20, max:80, weekly:true },
  { id:"res",  label:"选品调研",          unit:"小时/月", pct:.60, def:15, max:60 },
  { id:"tr",   label:"翻译与本地化",       unit:"小时/月", pct:.80, def:10, max:40 },
  { id:"data", label:"数据录入与报表整理",  unit:"小时/月", pct:.75, def:20, max:80 },
];

type Tab = "geo" | "selection" | "optimizer";
const TABS: { id: Tab; label: string }[] = [
  { id:"geo",       label:"可见度诊断" },
  { id:"selection", label:"AI 选品情报" },
  { id:"optimizer", label:"成本优化" },
];

export default function ZhProductPage() {
  const [tab, setTab]       = useState<Tab>("geo");
  const [filter, setFilter] = useState("all");
  const [vals, setVals]     = useState<Record<string, number>>(
    Object.fromEntries(OPS.map(i => [i.id, i.def]))
  );
  const [rate, setRate] = useState(15);

  const moHrs  = (item: OpItem) => item.weekly ? vals[item.id]*4.33 : vals[item.id];
  const total  = OPS.reduce((s,i) => s + moHrs(i)*rate, 0);
  const saved  = OPS.reduce((s,i) => s + moHrs(i)*rate*i.pct, 0);
  const geoMos = Math.floor(saved / GEO_PLAN);

  const filtered = filter === "all" ? SELECTION_DATA
    : SELECTION_DATA.filter(c => c.parentSection === filter);

  return (
    <div className="space-y-8 py-12">

      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-block text-xs px-3 py-1 rounded-full font-medium"
          style={{ background:"rgba(255,107,53,.12)", color:"#ff6b35" }}>
          阿凡提 产品
        </div>
        <h1 className="text-3xl font-bold">三个工具，一个不对称优势。</h1>
        <p className="text-sm leading-relaxed" style={{ color:"#7070a0" }}>
          知道 AI 怎么给你的品牌排名。知道 AI 在推荐买家购买什么。找到资金来做这一切。注册即可免费解锁全部工具。
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex justify-center gap-2 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="text-sm px-5 py-2 rounded-full font-medium transition-colors"
            style={tab === t.id
              ? { background:"#ff6b35", color:"#fff" }
              : { background:"#0f0f17", border:"1px solid #25253f", color:"#7070a0" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── GEO ── */}
      {tab === "geo" && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="space-y-5">
              <h2 className="text-xl font-bold">
                当买家向 AI 询问该买什么，<br />
                <span style={{ color:"#ff6b35" }}>你的品牌出现在答案里了吗？</span>
              </h2>
              <p className="text-sm leading-relaxed" style={{ color:"#7070a0" }}>
                阿凡提 在 ChatGPT、Claude、Gemini 和 Perplexity 上运行 20+ 个查询，给出你的 ARRS 评分、与每个竞品的声量对比，以及差距成因的精准分析。
              </p>
              <ul className="space-y-2 text-sm" style={{ color:"#7070a0" }}>
                {["AI 推荐排名评分（ARRS）", "与所有竞品的声量份额（SOV）对比", "按查询意图拆解的详细分析", "引用来源溯源分析", "缩小差距的 3 步行动计划"].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span style={{ color:"#ff6b35" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/zh/signup"
                className="inline-block text-sm font-medium px-6 py-3 rounded-lg transition-opacity hover:opacity-80"
                style={{ background:"#ff6b35", color:"#fff", boxShadow:"0 0 24px rgba(255,107,53,.3)" }}>
                注册——立即运行免费诊断 →
              </Link>
            </div>

            {/* Demo card */}
            <div className="rounded-2xl p-6 space-y-5"
              style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ color:"#7070a0" }}>
                示例报告 — ChargeFast
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black shrink-0"
                  style={{ background:"rgba(245,166,35,.12)", border:"2px solid #f5a623", color:"#f5a623" }}>
                  42
                </div>
                <div>
                  <div className="text-sm font-semibold">ARRS 评分</div>
                  <div className="text-xs mt-1" style={{ color:"#7070a0" }}>
                    中等可见度——竞品正在抢占 AI 推荐位
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-widest" style={{ color:"#7070a0" }}>
                  AI 声量份额
                </div>
                {[
                  { name:"ChargeFast（你）", sov:18.4, isYou:true },
                  { name:"Anker",            sov:41.2, isYou:false },
                  { name:"Ugreen",           sov:22.1, isYou:false },
                ].map(b => (
                  <div key={b.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color:b.isYou?"#ff6b35":"#f0f0f8" }}>{b.name}</span>
                      <span style={{ color:"#7070a0" }}>{b.sov}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background:"#25253f" }}>
                      <div className="h-full rounded-full"
                        style={{ width:`${(b.sov/50)*100}%`, background:b.isYou?"#ff6b35":"#3a3a5f" }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs pt-2" style={{ color:"#7070a0", borderTop:"1px solid #25253f" }}>
                注册后查看你品牌的真实数据 →
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link href="/zh/blog/insta360-vs-dji"
              className="text-sm transition-colors hover:text-white"
              style={{ color:"#7070a0" }}>
              查看真实 GEO 报告：Insta360 vs DJI →
            </Link>
          </div>
        </div>
      )}

      {/* ── SELECTION ── */}
      {tab === "selection" && (
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-xl font-bold">AI 正在告诉买家购买什么</h2>
            <p className="text-sm" style={{ color:"#7070a0" }}>
              追踪 4 个 AI 引擎的推荐规律，知道哪些品类正在升温——比竞争对手提前备货。
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setFilter(s.id)}
                className="text-xs px-4 py-1.5 rounded-full transition-colors font-medium"
                style={filter === s.id
                  ? { background:"#ff6b35", color:"#fff" }
                  : { background:"#0f0f17", border:"1px solid #25253f", color:"#7070a0" }}>
                {s.labelZh}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(cat => {
              const sig = SIGNAL_CFG[cat.sellerSignal];
              const max = cat.topBrands[0].sov;
              return (
                <div key={cat.id} className="rounded-xl p-5 space-y-4 flex flex-col"
                  style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-sm">{cat.categoryZh}</div>
                      <div className="text-xs mt-0.5" style={{ color:"#7070a0" }}>{cat.parentSectionZh}</div>
                    </div>
                    <div className="text-xs font-bold shrink-0" style={{ color:TREND_CLR[cat.trend] }}>
                      {TREND_ICON[cat.trend]} {cat.trendPts} pts
                    </div>
                  </div>
                  <div className="text-xs font-bold px-2.5 py-1 rounded-full self-start"
                    style={{ background:sig.bg, color:sig.color }}>{sig.label}</div>
                  <div className="space-y-2">
                    {cat.topBrands.map(b => (
                      <div key={b.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span style={{ color:"#f0f0f8" }}>{b.name}</span>
                          <div className="flex items-center gap-2">
                            <span style={{ color:"#7070a0" }}>{b.sov}% SOV</span>
                            <span className="text-xs font-medium px-1.5 py-0.5 rounded"
                              style={{ background:`${ARRS_COLOR(b.arrs)}18`, color:ARRS_COLOR(b.arrs) }}>
                              {b.arrs}
                            </span>
                          </div>
                        </div>
                        <div className="h-1 rounded-full" style={{ background:"#25253f" }}>
                          <div className="h-full rounded-full"
                            style={{ width:`${(b.sov/max)*100}%`, background:"#ff6b35" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed mt-auto" style={{ color:"#7070a0" }}>
                    {cat.sellerNoteZh}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="rounded-xl p-6 text-center space-y-3"
            style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
            <p className="font-semibold">你的品牌在这份榜单里吗？</p>
            <p className="text-sm" style={{ color:"#7070a0" }}>注册后追踪你的品牌位置，并在 AI 排名变化时收到提醒。</p>
            <Link href="/zh/signup"
              className="inline-block text-sm font-medium px-6 py-2.5 rounded-lg transition-opacity hover:opacity-80"
              style={{ background:"#ff6b35", color:"#fff" }}>
              免费注册——追踪你的品牌 →
            </Link>
          </div>
        </div>
      )}

      {/* ── OPTIMIZER ── */}
      {tab === "optimizer" && (
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-xl font-bold">找到做 GEO 的预算</h2>
            <p className="text-sm" style={{ color:"#7070a0" }}>
              计算 AI 能省多少运营成本，再看这笔钱能支持几个月的 GEO 监控。
            </p>
          </div>
          <div className="grid lg:grid-cols-5 gap-6 items-start">
            <div className="lg:col-span-3 space-y-5">
              <div className="rounded-xl p-5 space-y-4"
                style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">团队时薪</span>
                  <span className="font-bold" style={{ color:"#ff6b35" }}>${rate}/小时</span>
                </div>
                <input type="range" min={8} max={50} value={rate}
                  onChange={e => setRate(Number(e.target.value))}
                  className="w-full accent-orange-500" />
                <div className="flex justify-between text-xs" style={{ color:"#7070a0" }}>
                  <span>$8</span><span>$50</span>
                </div>
              </div>
              {OPS.map(item => {
                const hrs = moHrs(item);
                const cost = hrs*rate;
                const save = cost*item.pct;
                return (
                  <div key={item.id} className="rounded-xl p-5 space-y-3"
                    style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs mt-0.5" style={{ color:"#7070a0" }}>
                          AI 可接管 {Math.round(item.pct*100)}% 的工作量
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{vals[item.id]} {item.unit}</div>
                        <div className="text-xs" style={{ color:"#7070a0" }}>${cost.toFixed(0)}/月</div>
                      </div>
                    </div>
                    <input type="range" min={0} max={item.max} value={vals[item.id]}
                      onChange={e => setVals(p => ({...p,[item.id]:Number(e.target.value)}))}
                      className="w-full accent-orange-500" />
                    <div className="flex justify-between text-xs">
                      <span style={{ color:"#7070a0" }}>0 小时</span>
                      <span style={{ color:"#22c55e" }}>AI 节省：${save.toFixed(0)}/月</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="lg:col-span-2 lg:sticky lg:top-20 space-y-4">
              <div className="rounded-xl p-6 space-y-5"
                style={{ background:"#0f0f17", border:"1px solid #25253f" }}>
                <div className="text-sm font-semibold">月度节省分析</div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span style={{ color:"#7070a0" }}>当前月度成本</span>
                    <span>${total.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color:"#7070a0" }}>AI 优化后</span>
                    <span>${(total-saved).toFixed(0)}</span>
                  </div>
                  <div className="h-px" style={{ background:"#25253f" }} />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">月度节省</span>
                    <span className="text-2xl font-black" style={{ color:"#ff6b35" }}>
                      ${saved.toFixed(0)}
                    </span>
                  </div>
                </div>
                {saved > 0 && (
                  <div className="rounded-lg p-4 space-y-1"
                    style={{ background:"rgba(255,107,53,.08)", border:"1px solid rgba(255,107,53,.2)" }}>
                    <div className="text-xs font-semibold" style={{ color:"#ff6b35" }}>这笔钱能做什么</div>
                    <p className="text-sm" style={{ color:"#f0f0f8" }}>
                      {geoMos > 0
                        ? <><strong>{geoMos} 个月</strong>的 阿凡提 GEO 监控，每月自动运行。</>
                        : "拖动滑块增加工时，查看可支持的 GEO 月数。"}
                    </p>
                  </div>
                )}
                <Link href="/zh/signup"
                  className="block text-center text-sm font-medium px-4 py-2.5 rounded-lg transition-opacity hover:opacity-80"
                  style={{ background:"#ff6b35", color:"#fff" }}>
                  注册——开始节省并投入 GEO →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
