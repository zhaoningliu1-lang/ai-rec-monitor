"use client";

import { useState } from "react";
import Link from "next/link";

const GEO_PLAN_COST = 199; // Avanti Scale plan

interface OpItem {
  id: string;
  label: string;
  unit: string;
  aiSavingPct: number;  // 0–1
  defaultVal: number;
  max: number;
  weeklyToMonthly?: boolean; // if true: val * 4.33
}

const OP_ITEMS: OpItem[] = [
  { id: "cs",        label: "Customer Service",          unit: "hrs/week",  aiSavingPct: 0.70, defaultVal: 20, max: 80, weeklyToMonthly: true },
  { id: "research",  label: "Product Research & Sourcing", unit: "hrs/month", aiSavingPct: 0.60, defaultVal: 15, max: 60 },
  { id: "translate", label: "Translation & Localization", unit: "hrs/month", aiSavingPct: 0.80, defaultVal: 10, max: 40 },
  { id: "data",      label: "Data Entry & Reporting",    unit: "hrs/month", aiSavingPct: 0.75, defaultVal: 20, max: 80 },
];

export default function OptimizerPage() {
  const [vals, setVals] = useState<Record<string, number>>(
    Object.fromEntries(OP_ITEMS.map((i) => [i.id, i.defaultVal]))
  );
  const [hourlyRate, setHourlyRate] = useState(15);

  const monthlyHours = (item: OpItem) =>
    item.weeklyToMonthly ? vals[item.id] * 4.33 : vals[item.id];

  const currentCost = OP_ITEMS.reduce(
    (sum, item) => sum + monthlyHours(item) * hourlyRate, 0
  );
  const savedCost = OP_ITEMS.reduce(
    (sum, item) => sum + monthlyHours(item) * hourlyRate * item.aiSavingPct, 0
  );
  const optimizedCost = currentCost - savedCost;
  const geoMonths = Math.floor(savedCost / GEO_PLAN_COST);

  return (
    <div className="py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div
          className="inline-block text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
        >
          AI Cost Optimizer
        </div>
        <h1 className="text-3xl font-bold">
          Find the Budget to Fund Your GEO
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Most cross-border brands are paying humans to do what AI can handle in seconds.
          Calculate exactly how much you can save — and reinvest into AI visibility.
        </p>
      </div>

      {/* Main calculator */}
      <div className="grid lg:grid-cols-5 gap-6 items-start">
        {/* Left: Inputs */}
        <div className="lg:col-span-3 space-y-6">
          {/* Hourly rate */}
          <div
            className="rounded-xl p-5 space-y-4"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Team hourly rate</span>
              <span className="font-bold" style={{ color: "#ff6b35" }}>
                ${hourlyRate}/hr
              </span>
            </div>
            <input
              type="range"
              min={8}
              max={50}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs" style={{ color: "#7070a0" }}>
              <span>$8/hr</span>
              <span>$50/hr</span>
            </div>
          </div>

          {/* Op items */}
          {OP_ITEMS.map((item) => {
            const hrs = monthlyHours(item);
            const cost = hrs * hourlyRate;
            const saved = cost * item.aiSavingPct;
            return (
              <div
                key={item.id}
                className="rounded-xl p-5 space-y-3"
                style={{ background: "#0f0f17", border: "1px solid #25253f" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#7070a0" }}>
                      AI can replace {Math.round(item.aiSavingPct * 100)}% of this work
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{vals[item.id]} {item.unit}</div>
                    <div className="text-xs" style={{ color: "#7070a0" }}>
                      ${cost.toFixed(0)}/mo cost
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={item.max}
                  value={vals[item.id]}
                  onChange={(e) =>
                    setVals((prev) => ({ ...prev, [item.id]: Number(e.target.value) }))
                  }
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-xs">
                  <span style={{ color: "#7070a0" }}>0 hrs</span>
                  <span style={{ color: "#22c55e" }}>
                    AI saves: ${saved.toFixed(0)}/mo
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Results card (sticky) */}
        <div className="lg:col-span-2 lg:sticky lg:top-20 space-y-4">
          <div
            className="rounded-xl p-6 space-y-5"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="text-sm font-semibold">Monthly Cost Breakdown</div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: "#7070a0" }}>Current monthly cost</span>
                <span className="font-medium">${currentCost.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#7070a0" }}>After AI optimization</span>
                <span className="font-medium">${optimizedCost.toFixed(0)}</span>
              </div>
              <div
                className="h-px"
                style={{ background: "#25253f" }}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Monthly savings</span>
                <span
                  className="text-2xl font-black"
                  style={{ color: "#ff6b35" }}
                >
                  ${savedCost.toFixed(0)}
                </span>
              </div>
            </div>

            {savedCost > 0 && (
              <div
                className="rounded-lg p-4 space-y-2"
                style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)" }}
              >
                <div className="text-xs font-semibold" style={{ color: "#ff6b35" }}>
                  What this funds
                </div>
                <p className="text-sm" style={{ color: "#f0f0f8" }}>
                  {geoMonths > 0 ? (
                    <>
                      Your savings cover{" "}
                      <strong>{geoMonths} month{geoMonths !== 1 ? "s" : ""}</strong> of
                      Avanti GEO monitoring — every month, automatically.
                    </>
                  ) : (
                    "Increase your hours above to see GEO months funded."
                  )}
                </p>
                {geoMonths >= 1 && (
                  <div className="text-xs" style={{ color: "#7070a0" }}>
                    Avanti Scale Plan = ${GEO_PLAN_COST}/mo
                    {geoMonths >= 2 && ` · ${geoMonths}× ROI per saved dollar`}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <Link
                href="/audit"
                className="block text-center text-sm font-medium px-4 py-2.5 rounded-lg transition-opacity hover:opacity-80"
                style={{ background: "#ff6b35", color: "#fff" }}
              >
                Start GEO Monitoring →
              </Link>
              <a
                href="https://cal.com/johnson-liu-avanti/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm font-medium px-4 py-2.5 rounded-lg transition-colors hover:text-white"
                style={{ border: "1px solid #25253f", color: "#7070a0" }}
              >
                Book Free Strategy Call
              </a>
            </div>
          </div>

          {/* What AI replaces */}
          <div
            className="rounded-xl p-5 space-y-3"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>
              What AI handles
            </div>
            <ul className="space-y-2 text-xs" style={{ color: "#7070a0" }}>
              {[
                "Customer inquiry routing & draft replies",
                "Amazon listing translation & localization",
                "Competitor price & BSR monitoring",
                "Weekly reporting & data aggregation",
                "Product research from AI trend signals",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "#22c55e" }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom explainer */}
      <div
        className="rounded-xl p-6 max-w-2xl mx-auto text-center space-y-3"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="text-sm font-semibold">The compounding advantage</p>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          AI cuts your ops cost → you invest savings into GEO monitoring →
          AI starts recommending your brand more → more organic demand →
          lower CAC → more budget for GEO. It compounds.
        </p>
        <Link
          href="/selection"
          className="inline-block text-sm transition-colors hover:text-white"
          style={{ color: "#ff6b35" }}
        >
          See what AI is recommending in your category →
        </Link>
      </div>
    </div>
  );
}
