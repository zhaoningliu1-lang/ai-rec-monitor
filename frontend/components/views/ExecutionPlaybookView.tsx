"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_COMPANIES, DEMO_PLAYBOOKS, ContentStatus, OKR, NextAction, ActionPriority } from "@/lib/company-demo-data";
import { tx, Lang } from "@/lib/i18n";

function statusStyle(status: ContentStatus): { bg: string; color: string } {
  if (status === "published") return { bg: "rgba(34,197,94,0.12)",   color: "#22c55e" };
  if (status === "measuring") return { bg: "rgba(245,166,35,0.12)",  color: "#f5a623" };
  return                             { bg: "rgba(112,112,160,0.12)", color: "#7070a0" };
}

function citationStyle(status: string): { bg: string; color: string } {
  if (status === "published")       return { bg: "rgba(34,197,94,0.12)",   color: "#22c55e" };
  if (status === "in negotiation")  return { bg: "rgba(255,107,53,0.12)",  color: "#ff6b35" };
  if (status === "outreach sent")   return { bg: "rgba(245,166,35,0.12)",  color: "#f5a623" };
  return                                   { bg: "rgba(112,112,160,0.12)", color: "#7070a0" };
}

function priorityStyle(p: ActionPriority): { bg: string; color: string } {
  if (p === "urgent") return { bg: "rgba(255,77,109,0.12)", color: "#ff4d6d" };
  if (p === "high")   return { bg: "rgba(255,107,53,0.12)", color: "#ff6b35" };
  return                     { bg: "rgba(245,166,35,0.12)", color: "#f5a623" };
}

function okrProgress(okr: OKR): number {
  if (okr.lowerIsBetter) {
    const range = okr.startVal - okr.target;
    if (range <= 0) return 100;
    return Math.min(100, Math.max(0, ((okr.startVal - okr.current) / range) * 100));
  }
  const range = okr.target - okr.startVal;
  if (range <= 0) return 100;
  return Math.min(100, Math.max(0, ((okr.current - okr.startVal) / range) * 100));
}

function okrStatusStyle(s: OKR["status"]): { bg: string; color: string } {
  if (s === "achieved") return { bg: "rgba(245,166,35,0.12)",  color: "#f5a623" };
  if (s === "on track") return { bg: "rgba(34,197,94,0.12)",   color: "#22c55e" };
  return                       { bg: "rgba(255,77,109,0.12)",  color: "#ff4d6d" };
}

function localizeStatus(status: string, lang: Lang): string {
  const map: Record<string, { en: string; zh: string }> = {
    published:        { en: "published",       zh: "已发布" },
    measuring:        { en: "measuring",       zh: "观察中" },
    draft:            { en: "draft",           zh: "草稿" },
    "in negotiation": { en: "in negotiation",  zh: "洽谈中" },
    "outreach sent":  { en: "outreach sent",   zh: "已外联" },
    "not started":    { en: "not started",     zh: "未开始" },
    achieved:         { en: "achieved",        zh: "已达成" },
    "on track":       { en: "on track",        zh: "进行中" },
    "at risk":        { en: "at risk",         zh: "存在风险" },
    urgent:           { en: "urgent",          zh: "紧急" },
    high:             { en: "high",            zh: "高优先" },
    medium:           { en: "medium",          zh: "中优先" },
  };
  return map[status]?.[lang] ?? status;
}

export default function ExecutionPlaybookView({
  slug,
  lang,
}: {
  slug: string;
  lang: Lang;
}) {
  const TABS = [
    tx("execution", "tabContent", lang),
    tx("execution", "tabCitation", lang),
    tx("execution", "tabOkr", lang),
    tx("execution", "tabActions", lang),
  ] as const;

  const [activeTab, setActiveTab] = useState(TABS[0]);

  const company = DEMO_COMPANIES[slug];
  const playbook = DEMO_PLAYBOOKS[slug];
  const base = lang === "zh" ? `/zh/company/${slug}` : `/company/${slug}`;

  if (!company || !playbook) {
    return (
      <div className="text-center py-24" style={{ color: "#7070a0" }}>
        {tx("execution", "notFound", lang)}{" "}
        <Link href={lang === "zh" ? "/zh" : "/"} className="underline" style={{ color: "#ff6b35" }}>← Back</Link>
      </div>
    );
  }

  const pendingActions = playbook.nextActions.filter((a) => !a.done);
  const doneActions = playbook.nextActions.filter((a) => a.done);
  const sortedActions: NextAction[] = [
    ...pendingActions.sort((a, b) => {
      const order: ActionPriority[] = ["urgent", "high", "medium"];
      return order.indexOf(a.priority) - order.indexOf(b.priority);
    }),
    ...doneActions,
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href={base}
          className="text-sm hover:text-white transition-colors mb-3 inline-block"
          style={{ color: "#7070a0" }}
        >
          ← {company.name}
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black">{tx("execution", "title", lang)}</h1>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{
              background: `${company.planColor}18`,
              color: company.planColor,
              border: `1px solid ${company.planColor}33`,
            }}
          >
            {lang === "zh" ? (company.planZh ?? company.plan) : company.plan}
          </span>
        </div>
        <p className="text-sm mt-1" style={{ color: "#7070a0" }}>
          {tx("execution", "subtitle", lang)}
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="text-sm px-4 py-2 rounded-xl font-medium transition-colors"
            style={
              activeTab === tab
                ? { background: "#ff6b35", color: "#fff" }
                : { background: "#0f0f17", border: "1px solid #25253f", color: "#7070a0" }
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab 1: Content Library ── */}
      {activeTab === TABS[0] && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <div
            className="px-4 py-3 text-sm font-semibold flex items-center justify-between"
            style={{ background: "#161625", borderBottom: "1px solid #25253f" }}
          >
            <span>{tx("execution", "tabContent", lang)}</span>
            <span className="text-xs font-normal" style={{ color: "#7070a0" }}>
              {playbook.contentBriefs.filter((b) => b.status === "published").length} {localizeStatus("published", lang)} ·{" "}
              {playbook.contentBriefs.filter((b) => b.status === "measuring").length} {localizeStatus("measuring", lang)} ·{" "}
              {playbook.contentBriefs.filter((b) => b.status === "draft").length} {localizeStatus("draft", lang)}
            </span>
          </div>
          <table className="w-full text-sm" style={{ background: "#0f0f17" }}>
            <thead className="text-xs uppercase tracking-wide" style={{ background: "#161625", color: "#7070a0" }}>
              <tr>
                <th className="text-left px-4 py-2">{tx("execution", "colBrand", lang)}</th>
                <th className="text-left px-4 py-2">{tx("execution", "colTitle", lang)}</th>
                <th className="text-left px-4 py-2">{tx("execution", "colKeyword", lang)}</th>
                <th className="text-left px-4 py-2">{tx("execution", "colFormat", lang)}</th>
                <th className="text-left px-4 py-2">{tx("execution", "colStatus", lang)}</th>
                <th className="text-left px-4 py-2">{tx("execution", "colDue", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {playbook.contentBriefs.map((brief) => {
                const s = statusStyle(brief.status);
                return (
                  <tr key={brief.id} style={{ borderTop: "1px solid #25253f" }}>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
                      >
                        {brief.brand}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium max-w-xs" style={{ color: "#f0f0f8" }}>
                      <p className="truncate">{lang === "zh" ? (brief.titleZh ?? brief.title) : brief.title}</p>
                    </td>
                    <td className="px-4 py-3 text-xs max-w-xs" style={{ color: "#7070a0" }}>
                      <p className="truncate">{brief.targetKeyword}</p>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#7070a0" }}>{lang === "zh" ? (brief.aiFormatZh ?? brief.aiFormat) : brief.aiFormat}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={s}>
                        {localizeStatus(brief.status, lang)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#7070a0" }}>{brief.dueDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Tab 2: Citation Targets ── */}
      {activeTab === TABS[1] && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <div
            className="px-4 py-3 text-sm font-semibold flex items-center justify-between"
            style={{ background: "#161625", borderBottom: "1px solid #25253f" }}
          >
            <span>{tx("execution", "tabCitation", lang)}</span>
            <span className="text-xs font-normal" style={{ color: "#7070a0" }}>
              {playbook.citationTargets.filter((t) => t.status === "published").length} {localizeStatus("published", lang)} ·{" "}
              {playbook.citationTargets.filter((t) => t.status !== "published" && t.status !== "not started").length}{" "}
              {lang === "zh" ? "进行中" : "in progress"}
            </span>
          </div>
          <table className="w-full text-sm" style={{ background: "#0f0f17" }}>
            <thead className="text-xs uppercase tracking-wide" style={{ background: "#161625", color: "#7070a0" }}>
              <tr>
                <th className="text-left px-4 py-2">{tx("execution", "colPublication", lang)}</th>
                <th className="text-left px-4 py-2 w-12">{tx("execution", "colDA", lang)}</th>
                <th className="text-left px-4 py-2">{tx("execution", "colTargetBrands", lang)}</th>
                <th className="text-left px-4 py-2">{tx("execution", "colStatus", lang)}</th>
                <th className="text-left px-4 py-2">{tx("execution", "colNotes", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {playbook.citationTargets.map((ct) => {
                const s = citationStyle(ct.status);
                return (
                  <tr key={ct.id} style={{ borderTop: "1px solid #25253f" }}>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#f0f0f8" }}>
                      {ct.publication}
                      {ct.relevance === "high" && (
                        <span className="ml-1.5 text-xs px-1 py-0.5 rounded" style={{ background: "rgba(245,166,35,0.1)", color: "#f5a623" }}>
                          {tx("execution", "high", lang)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono" style={{ color: "#7070a0" }}>{ct.domainAuthority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {ct.targetBrands.map((b) => (
                          <span key={b} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,107,53,0.1)", color: "#ff6b35" }}>
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={s}>
                        {localizeStatus(ct.status, lang)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs max-w-xs" style={{ color: "#7070a0" }}>{lang === "zh" ? (ct.notesZh ?? ct.notes) : ct.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Tab 3: OKR Tracker ── */}
      {activeTab === TABS[2] && (
        <div className="space-y-4">
          {playbook.okrs.map((okr) => {
            const pct = okrProgress(okr);
            const ss = okrStatusStyle(okr.status);
            return (
              <div
                key={okr.id}
                className="rounded-2xl p-6 space-y-4"
                style={{ background: "#0f0f17", border: "1px solid #25253f" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold mb-1">{lang === "zh" ? (okr.objectiveZh ?? okr.objective) : okr.objective}</p>
                    <p className="text-sm" style={{ color: "#7070a0" }}>{lang === "zh" ? (okr.keyResultZh ?? okr.keyResult) : okr.keyResult}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={ss}>
                      {localizeStatus(okr.status, lang)}
                    </span>
                    <span className="text-xs" style={{ color: "#7070a0" }}>{tx("execution", "due", lang)} {okr.dueDate}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5" style={{ color: "#7070a0" }}>
                    <span>{tx("execution", "start", lang)}: {okr.startVal}{okr.unit}</span>
                    <span style={{ color: "#f0f0f8" }}>
                      {tx("execution", "current", lang)}: <strong>{okr.current}{okr.unit}</strong>
                    </span>
                    <span>{tx("execution", "target", lang)}: {okr.target}{okr.unit}</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#25253f" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: pct >= 100 ? "#22c55e" : okr.status === "at risk" ? "#ff4d6d" : "#ff6b35",
                      }}
                    />
                  </div>
                  <div className="text-xs mt-1 text-right" style={{ color: "#7070a0" }}>
                    {pct.toFixed(0)}{tx("execution", "pctComplete", lang)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Tab 4: Next Actions ── */}
      {activeTab === TABS[3] && (
        <div className="space-y-3">
          {sortedActions.map((action) => {
            const ps = priorityStyle(action.priority);
            return (
              <div
                key={action.id}
                className="rounded-xl p-5 flex items-start gap-4"
                style={{
                  background: "#0f0f17",
                  border: "1px solid #25253f",
                  opacity: action.done ? 0.45 : 1,
                }}
              >
                <div className="shrink-0 mt-0.5">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={ps}>
                    {localizeStatus(action.priority, lang)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold mb-0.5"
                    style={{ color: "#f0f0f8", textDecoration: action.done ? "line-through" : "none" }}
                  >
                    {action.done && <span className="mr-1.5" style={{ color: "#22c55e" }}>✓</span>}
                    {lang === "zh" ? (action.titleZh ?? action.title) : action.title}
                  </p>
                  <p className="text-sm" style={{ color: "#7070a0" }}>{lang === "zh" ? (action.descriptionZh ?? action.description) : action.description}</p>
                </div>

                <div className="shrink-0 text-right space-y-1">
                  <div>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: "rgba(255,107,53,0.1)", color: "#ff6b35" }}
                    >
                      {action.relatedBrand}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: "#7070a0" }}>{action.assignee}</div>
                  <div className="text-xs" style={{ color: "#25253f" }}>{tx("execution", "due", lang)} {action.dueDate}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
