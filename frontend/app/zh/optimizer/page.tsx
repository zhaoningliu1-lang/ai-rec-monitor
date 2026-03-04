"use client";

import { useState } from "react";
import Link from "next/link";

const GEO_PLAN_COST = 199;

interface OpItem {
  id: string;
  label: string;
  unit: string;
  aiSavingPct: number;
  defaultVal: number;
  max: number;
  weeklyToMonthly?: boolean;
}

const OP_ITEMS: OpItem[] = [
  { id: "cs",        label: "客服接待",           unit: "小时/周",  aiSavingPct: 0.70, defaultVal: 20, max: 80, weeklyToMonthly: true },
  { id: "research",  label: "选品调研",           unit: "小时/月", aiSavingPct: 0.60, defaultVal: 15, max: 60 },
  { id: "translate", label: "翻译与本地化",        unit: "小时/月", aiSavingPct: 0.80, defaultVal: 10, max: 40 },
  { id: "data",      label: "数据录入与报表整理",   unit: "小时/月", aiSavingPct: 0.75, defaultVal: 20, max: 80 },
];

export default function ZhOptimizerPage() {
  const [vals, setVals] = useState<Record<string, number>>(
    Object.fromEntries(OP_ITEMS.map((i) => [i.id, i.defaultVal]))
  );
  const [hourlyRate, setHourlyRate] = useState(15);

  const monthlyHours = (item: OpItem) =>
    item.weeklyToMonthly ? vals[item.id] * 4.33 : vals[item.id];

  const currentCost  = OP_ITEMS.reduce((s, i) => s + monthlyHours(i) * hourlyRate, 0);
  const savedCost    = OP_ITEMS.reduce((s, i) => s + monthlyHours(i) * hourlyRate * i.aiSavingPct, 0);
  const optimizedCost = currentCost - savedCost;
  const geoMonths    = Math.floor(savedCost / GEO_PLAN_COST);

  return (
    <div className="py-12 space-y-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div
          className="inline-block text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
        >
          AI 成本优化
        </div>
        <h1 className="text-3xl font-bold">找到做 GEO 的预算</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          大多数跨境品牌正在付钱让人做 AI 几秒钟就能完成的事。
          精确计算你能省多少，然后把这笔钱投入 AI 可见度建设。
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-3 space-y-6">
          <div
            className="rounded-xl p-5 space-y-4"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">团队时薪</span>
              <span className="font-bold" style={{ color: "#ff6b35" }}>${hourlyRate}/小时</span>
            </div>
            <input type="range" min={8} max={50} value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full accent-orange-500" />
            <div className="flex justify-between text-xs" style={{ color: "#7070a0" }}>
              <span>$8/小时</span><span>$50/小时</span>
            </div>
          </div>

          {OP_ITEMS.map((item) => {
            const hrs  = monthlyHours(item);
            const cost = hrs * hourlyRate;
            const saved = cost * item.aiSavingPct;
            return (
              <div key={item.id} className="rounded-xl p-5 space-y-3"
                style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#7070a0" }}>
                      AI 可接管 {Math.round(item.aiSavingPct * 100)}% 的工作量
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{vals[item.id]} {item.unit}</div>
                    <div className="text-xs" style={{ color: "#7070a0" }}>${cost.toFixed(0)}/月</div>
                  </div>
                </div>
                <input type="range" min={0} max={item.max} value={vals[item.id]}
                  onChange={(e) => setVals((p) => ({ ...p, [item.id]: Number(e.target.value) }))}
                  className="w-full accent-orange-500" />
                <div className="flex justify-between text-xs">
                  <span style={{ color: "#7070a0" }}>0 小时</span>
                  <span style={{ color: "#22c55e" }}>AI 节省：${saved.toFixed(0)}/月</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-2 lg:sticky lg:top-20 space-y-4">
          <div className="rounded-xl p-6 space-y-5"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
            <div className="text-sm font-semibold">月度成本分析</div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: "#7070a0" }}>当前月度成本</span>
                <span className="font-medium">${currentCost.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#7070a0" }}>AI 优化后</span>
                <span className="font-medium">${optimizedCost.toFixed(0)}</span>
              </div>
              <div className="h-px" style={{ background: "#25253f" }} />
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">月度节省</span>
                <span className="text-2xl font-black" style={{ color: "#ff6b35" }}>
                  ${savedCost.toFixed(0)}
                </span>
              </div>
            </div>

            {savedCost > 0 && (
              <div className="rounded-lg p-4 space-y-2"
                style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)" }}>
                <div className="text-xs font-semibold" style={{ color: "#ff6b35" }}>这笔省下来的钱能做什么</div>
                <p className="text-sm" style={{ color: "#f0f0f8" }}>
                  {geoMonths > 0 ? (
                    <>你节省的费用足以支付 <strong>{geoMonths} 个月</strong>的 Avanti GEO 监控计划。</>
                  ) : "拖动滑块增加工时，查看可支持的 GEO 月数。"}
                </p>
                {geoMonths >= 1 && (
                  <div className="text-xs" style={{ color: "#7070a0" }}>
                    Avanti Scale 计划 = ${GEO_PLAN_COST}/月
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <Link href="/zh/audit"
                className="block text-center text-sm font-medium px-4 py-2.5 rounded-lg transition-opacity hover:opacity-80"
                style={{ background: "#ff6b35", color: "#fff" }}>
                开始 GEO 监控 →
              </Link>
              <a href="https://calendly.com/brivesubscription/30min"
                target="_blank" rel="noopener noreferrer"
                className="block text-center text-sm font-medium px-4 py-2.5 rounded-lg transition-colors hover:text-white"
                style={{ border: "1px solid #25253f", color: "#7070a0" }}>
                预约免费策略通话
              </a>
            </div>
          </div>

          <div className="rounded-xl p-5 space-y-3"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>AI 可以接管的工作</div>
            <ul className="space-y-2 text-xs" style={{ color: "#7070a0" }}>
              {["客户询盘路由与初稿回复", "亚马逊 listing 翻译与本地化", "竞品价格与 BSR 监控", "周报生成与数据汇总", "基于 AI 趋势信号的选品调研"].map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <span style={{ color: "#22c55e" }}>✓</span>{i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-6 max-w-2xl mx-auto text-center space-y-3"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <p className="text-sm font-semibold">复利优势</p>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          AI 降低运营成本 → 节省的钱投入 GEO 监控 → AI 开始更频繁推荐你的品牌 → 自然流量增加 → 获客成本降低 → 更多预算用于 GEO。这是一个正向循环。
        </p>
        <Link href="/zh/selection" className="inline-block text-sm transition-colors hover:text-white" style={{ color: "#ff6b35" }}>
          查看 AI 在你品类的推荐情况 →
        </Link>
      </div>
    </div>
  );
}
