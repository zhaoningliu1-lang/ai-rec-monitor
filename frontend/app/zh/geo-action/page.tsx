"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type Run, type GeoPlan } from "@/lib/api";
import { getToken } from "@/lib/auth";
import {
  GEO_BRANDS,
  CATEGORY_CONFIG,
  PRIORITY_CONFIG,
  EFFORT_CONFIG,
  type ActionCategory,
  type ActionPriority,
  type GeoAction,
} from "@/lib/geo-action-data";

// ── 中文标签 ─────────────────────────────────────────────────────────────────

const PRIORITY_ZH: Record<ActionPriority, string> = { critical: "必须修复", high: "高优先级", medium: "中优先级" };
const CATEGORY_ZH: Record<ActionCategory, string> = { content: "内容优化", reddit: "Reddit", schema: "结构化标记", citations: "权威引用", social: "社会证明", reviews: "评价管理" };
const EFFORT_ZH: Record<"low" | "medium" | "high", string> = { low: "低投入", medium: "中投入", high: "高投入" };

type FilterPriority = "all" | ActionPriority;
type FilterCategory = "all" | ActionCategory;

interface PlanData {
  brand: string; category: string; currentGeoScore: number; projectedGeoScore: number;
  weaknesses: string[]; actions: GeoAction[];
}

function toPlanData(plan: GeoPlan): PlanData {
  return { brand: plan.brand_name, category: plan.category, currentGeoScore: plan.current_geo_score, projectedGeoScore: plan.projected_geo_score, weaknesses: plan.weaknesses, actions: plan.actions as GeoAction[] };
}

const STEPS_ZH = ["分析扫描指标...", "识别引用缺口...", "审查竞争损失...", "构建行动计划..."];

function GenerateButton({ onGenerate, generating }: { onGenerate: () => void; generating: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!generating) { setStep(0); return; }
    const t = setInterval(() => setStep(s => (s + 1) % STEPS_ZH.length), 2500);
    return () => clearInterval(t);
  }, [generating]);

  if (generating) {
    return (
      <div className="rounded-2xl p-12 text-center space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <div className="inline-block w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#ff6b35", borderTopColor: "transparent" }} />
        <p className="text-sm font-medium" style={{ color: "#f0f0f8" }}>{STEPS_ZH[step]}</p>
        <p className="text-xs" style={{ color: "#555580" }}>大约需要 10 秒</p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl p-12 text-center space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
      <div className="text-3xl mb-2">🎯</div>
      <p className="text-sm" style={{ color: "#9090b0" }}>此次扫描尚未生成计划。基于扫描数据生成定制 GEO 行动计划。</p>
      <button onClick={onGenerate} className="px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85" style={{ background: "#ff6b35", color: "#fff" }}>
        生成 GEO 行动计划
      </button>
      <p className="text-xs" style={{ color: "#555580" }}>消耗 2 Credits · 约 10 秒</p>
    </div>
  );
}

export default function GeoActionZhPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [planNotFound, setPlanNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("all");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      setIsDemo(true);
      const d = GEO_BRANDS[0];
      setPlan({ brand: d.brand, category: d.category, currentGeoScore: d.currentGeoScore, projectedGeoScore: d.projectedGeoScore, weaknesses: d.weaknesses, actions: d.actions });
      setLoading(false);
      return;
    }
    api.listRuns()
      .then(all => { const c = all.filter(r => r.status === "done"); setRuns(c); if (c.length > 0) setSelectedRunId(c[0].id); else setLoading(false); })
      .catch(() => { setError("加载失败"); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!selectedRunId || isDemo) return;
    setLoading(true); setPlan(null); setPlanNotFound(false); setError(null);
    setFilterPriority("all"); setFilterCategory("all"); setExpandedId(null);
    api.getGeoPlan(selectedRunId)
      .then(p => { setPlan(toPlanData(p)); setPlanNotFound(false); })
      .catch(e => { if (String(e).includes("404")) setPlanNotFound(true); else setError("加载计划失败"); })
      .finally(() => setLoading(false));
  }, [selectedRunId, isDemo]);

  const handleGenerate = async () => {
    if (!selectedRunId) return;
    setGenerating(true); setError(null);
    try { const p = await api.createGeoPlan(selectedRunId); setPlan(toPlanData(p)); setPlanNotFound(false); }
    catch (e) { setError(String(e)); }
    finally { setGenerating(false); }
  };

  const scoreLift = plan ? plan.projectedGeoScore - plan.currentGeoScore : 0;
  const criticalCount = plan?.actions.filter(a => a.priority === "critical").length ?? 0;
  const highCount = plan?.actions.filter(a => a.priority === "high").length ?? 0;

  const filtered = plan ? plan.actions.filter(a => {
    if (filterPriority !== "all" && a.priority !== filterPriority) return false;
    if (filterCategory !== "all" && a.category !== filterCategory) return false;
    return true;
  }).sort((a, b) => ({ critical: 0, high: 1, medium: 2 }[a.priority] - { critical: 0, high: 1, medium: 2 }[b.priority])) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.25)" }}>
            GEO 行动计划
          </div>
          <div className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,107,53,0.08)", color: "#ff6b35" }}>
            由 Avanti 提供支持
          </div>
        </div>
        <h1 className="text-3xl font-black">你的 AI 可见度实战手册——逐步执行</h1>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "#9090b0" }}>
          知道 GEO 评分只是第一步。这份手册告诉你具体要修复什么、发布什么、说什么——让 AI 模型开始更准确、更频繁地引用你的品牌。
        </p>
      </div>

      {isDemo && (
        <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.2)" }}>
          <span className="text-lg">🔍</span>
          <div className="flex-1"><p className="text-sm font-medium" style={{ color: "#f0f0f8" }}>这是演示计划。登录并运行扫描以获取你的定制 GEO 行动计划。</p></div>
          <Link href="/zh/login" className="px-4 py-2 rounded-lg text-sm font-medium shrink-0" style={{ background: "#ff6b35", color: "#fff" }}>登录</Link>
        </div>
      )}

      {!isDemo && runs.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>选择扫描</div>
          <div className="flex gap-2 flex-wrap">
            {runs.slice(0, 8).map(r => (
              <button key={r.id} onClick={() => setSelectedRunId(r.id)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-colors"
                style={r.id === selectedRunId ? { background: "#1a1a2e", border: "1px solid #ff6b35", color: "#f0f0f8" } : { background: "#0f0f17", border: "1px solid #25253f", color: "#7070a0" }}>
                <span>{r.brand_name}</span>
                <span className="text-xs" style={{ color: "#555580" }}>{new Date(r.created_at).toLocaleDateString()}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {!isDemo && runs.length === 0 && !loading && (
        <div className="rounded-2xl p-12 text-center space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <p className="text-sm" style={{ color: "#9090b0" }}>运行你的第一次 AI 可见度扫描，获取定制 GEO 行动计划。</p>
          <Link href="/zh/audit" className="inline-block px-6 py-3 rounded-xl text-sm font-semibold" style={{ background: "#ff6b35", color: "#fff" }}>开始免费审计</Link>
        </div>
      )}

      {loading && <div className="flex items-center justify-center py-16"><div className="text-sm animate-pulse" style={{ color: "#7070a0" }}>加载中...</div></div>}
      {error && <div className="rounded-lg p-4 text-sm" style={{ background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)", color: "#ff4d6d" }}>{error}</div>}
      {planNotFound && !generating && <GenerateButton onGenerate={handleGenerate} generating={false} />}
      {generating && <GenerateButton onGenerate={handleGenerate} generating={true} />}

      {plan && !loading && !generating && (
        <>
          {/* Score card */}
          <div className="rounded-2xl p-6 grid md:grid-cols-3 gap-6" style={{ background: "#0f0f17", border: "1px solid rgba(96,165,250,0.25)" }}>
            <div className="flex flex-col justify-center">
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>当前 GEO 评分</div>
              <div className="text-6xl font-black mb-1" style={{ color: plan.currentGeoScore >= 70 ? "#22c55e" : plan.currentGeoScore >= 40 ? "#f5a623" : "#ff4d6d" }}>{plan.currentGeoScore}</div>
              <div className="text-xs" style={{ color: "#555580" }}>基于 AI 审计</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="text-3xl" style={{ color: "#7070a0" }}>→</div>
              <div className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }}>
                预计提升 +{scoreLift} 分
              </div>
              <div className="text-xs text-center" style={{ color: "#555580" }}>{criticalCount} 项必须修复 + {highCount} 项高优先级</div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7070a0" }}>执行后预测评分</div>
              <div className="text-6xl font-black mb-1" style={{ color: "#22c55e" }}>{plan.projectedGeoScore}</div>
              <div className="text-xs" style={{ color: "#555580" }}>完成全部必须+高优先级行动后</div>
            </div>
          </div>

          {/* Weaknesses */}
          {plan.weaknesses.length > 0 && (
            <div className="rounded-2xl p-5 space-y-3" style={{ background: "rgba(255,77,109,0.04)", border: "1px solid rgba(255,77,109,0.2)" }}>
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#ff4d6d" }}>拖低 GEO 评分的原因</div>
              <ul className="space-y-2">
                {plan.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#9090b0" }}>
                    <span style={{ color: "#ff4d6d" }} className="shrink-0 mt-0.5">✗</span>{w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setFilterPriority("all")} className="text-xs px-3 py-1 rounded-lg border transition-colors"
                  style={filterPriority === "all" ? { background: "#ff6b3522", color: "#ff6b35", border: "1px solid #ff6b3555" } : { background: "#0f0f17", color: "#7070a0", border: "1px solid #25253f" }}>全部</button>
                {(["critical", "high", "medium"] as ActionPriority[]).map(p => (
                  <button key={p} onClick={() => setFilterPriority(p)} className="text-xs px-3 py-1 rounded-lg border transition-colors"
                    style={filterPriority === p ? { background: PRIORITY_CONFIG[p].bg, color: PRIORITY_CONFIG[p].color, border: `1px solid ${PRIORITY_CONFIG[p].border}` } : { background: "#0f0f17", color: "#7070a0", border: "1px solid #25253f" }}>
                    {PRIORITY_ZH[p]}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setFilterCategory("all")} className="text-xs px-3 py-1 rounded-lg border transition-colors"
                  style={filterCategory === "all" ? { background: "#1a1a2e", color: "#f0f0f8", border: "1px solid #25253f" } : { background: "transparent", color: "#7070a0", border: "1px solid transparent" }}>全部类型</button>
                {(Object.keys(CATEGORY_CONFIG) as ActionCategory[]).map(cat => (
                  <button key={cat} onClick={() => setFilterCategory(cat)} className="text-xs px-3 py-1 rounded-lg border transition-colors"
                    style={filterCategory === cat ? { background: "#1a1a2e", color: "#f0f0f8", border: "1px solid #25253f" } : { background: "transparent", color: "#7070a0", border: "1px solid transparent" }}>
                    {CATEGORY_CONFIG[cat].icon} {CATEGORY_ZH[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
              <div className="text-sm text-center py-8" style={{ color: "#555580" }}>当前筛选条件下没有行动项。</div>
            ) : (
              <div className="space-y-3">
                {filtered.map((action, i) => {
                  const pC = PRIORITY_CONFIG[action.priority];
                  const catC = CATEGORY_CONFIG[action.category];
                  const isExp = expandedId === action.id;
                  return (
                    <div key={action.id} className="rounded-2xl overflow-hidden" style={{ background: "#0f0f17", border: `1px solid ${isExp ? pC.border : "#1a1a2e"}` }}>
                      <button className="w-full px-5 py-4 flex items-start gap-3 text-left" onClick={() => setExpandedId(isExp ? null : action.id)}>
                        <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mt-0.5" style={{ background: pC.bg, color: pC.color }}>{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: pC.color, background: pC.bg }}>{PRIORITY_ZH[action.priority]}</span>
                            <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#161625", color: "#9090b0" }}>{catC.icon} {CATEGORY_ZH[action.category]}</span>
                            <span className="text-xs font-semibold" style={{ color: "#22c55e" }}>{action.impact}</span>
                            <span className="text-xs ml-auto shrink-0" style={{ color: EFFORT_CONFIG[action.effort].color }}>{EFFORT_ZH[action.effort]}</span>
                          </div>
                          <p className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>{action.title}</p>
                        </div>
                        <span className="shrink-0 text-xs mt-1" style={{ color: "#555580" }}>{isExp ? "▲" : "▼"}</span>
                      </button>
                      {isExp && (
                        <div className="px-5 pb-5 space-y-3 border-t" style={{ borderColor: "#1a1a2e" }}>
                          <div className="pt-3 space-y-3">
                            <div>
                              <div className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: "#7070a0" }}>为什么对 GEO 重要</div>
                              <p className="text-sm leading-relaxed" style={{ color: "#9090b0" }}>{action.why}</p>
                            </div>
                            <div className="rounded-xl p-4" style={{ background: "#161625", border: "1px solid #25253f" }}>
                              <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#60a5fa" }}>如何执行</div>
                              <p className="text-sm leading-relaxed" style={{ color: "#c0c0d8" }}>{action.how}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* How GEO works */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: "#ff6b35" }}>GEO 优化的运作原理</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: "📡", title: "AI 抓取公开网络", desc: "ChatGPT、Claude 和 Gemini 从你的产品页面、Reddit、评测网站和新闻文章中提取内容。内容的质量和结构决定了它们的输出。" },
            { icon: "⚡", title: "结构胜过内容数量", desc: "一个带有结构化标记的 FAQ 页面，比 10 篇博文更有效。AI 是一个解析器——给它清晰、结构化的事实，它就会引用。" },
            { icon: "📈", title: "GEO 效果随时间叠加", desc: "每个行动都会强化下一个。修正产品页规格 + 回复 Reddit 帖子 + 获得一篇专家评测，形成的引用三角很难被取代。" },
          ].map(item => (
            <div key={item.icon} className="flex gap-3">
              <div className="text-xl shrink-0">{item.icon}</div>
              <div>
                <div className="font-semibold text-sm mb-1">{item.title}</div>
                <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-5" style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.2)" }}>
        <div className="flex-1">
          <div className="font-semibold mb-1">获取你品牌的定制 GEO 行动计划</div>
          <p className="text-sm" style={{ color: "#9090b0" }}>我们将审计你的 AI 可见度，找出引用瓶颈，并给你一份逐步修复的实战手册。</p>
        </div>
        <div className="flex gap-3 shrink-0 flex-wrap">
          <Link href="/zh/audit" className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85" style={{ background: "#ff6b35", color: "#fff" }}>免费审计 →</Link>
          <Link href="/zh/hallucination" className="px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80" style={{ border: "1px solid #25253f", color: "#f0f0f8" }}>查看幻觉检测 →</Link>
        </div>
      </div>
    </div>
  );
}
