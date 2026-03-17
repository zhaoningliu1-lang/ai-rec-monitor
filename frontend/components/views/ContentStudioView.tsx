"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { contentApi, ContentDraft, ContentGenerateRequest, ContentGenerateResult } from "@/lib/api";

/* ── i18n ────────────────────────────────────────────────────────── */
const T: Record<string, Record<string, string>> = {
  pageTitle:      { en: "Content Studio",                           zh: "内容工作室" },
  pageSubtitle:   { en: "Generate & publish AI-optimised content across platforms", zh: "生成并发布跨平台 AI 优化内容" },
  tabGenerate:    { en: "Generate",                                  zh: "内容生成" },
  tabPublish:     { en: "Publish",                                   zh: "发布管理" },
  tabTemplates:   { en: "Templates",                                 zh: "批量模板" },
  tabCalendar:    { en: "Calendar",                                  zh: "发布日历" },
  brand:          { en: "Brand",                                     zh: "品牌" },
  product:        { en: "Product",                                   zh: "产品" },
  market:         { en: "Market",                                    zh: "市场" },
  generateBtn:    { en: "✨ Generate Content",                       zh: "✨ 生成内容" },
  generating:     { en: "Generating…",                               zh: "生成中…" },
  copyBtn:        { en: "Copy",                                      zh: "复制" },
  saveDraft:      { en: "Save Draft",                                zh: "保存草稿" },
  publishBtn:     { en: "Publish →",                                 zh: "发布 →" },
  scheduleBtn:    { en: "Schedule",                                  zh: "排期" },
  deleteBtn:      { en: "Delete",                                    zh: "删除" },
  draftStatus:    { en: "Draft",                                     zh: "草稿" },
  scheduledStatus:{ en: "Scheduled",                                 zh: "已排期" },
  publishedStatus:{ en: "Published",                                 zh: "已发布" },
  noDrafts:       { en: "No drafts yet. Generate some content first.", zh: "暂无草稿，先去生成内容吧。" },
  addRow:         { en: "+ Add Row",                                 zh: "+ 添加行" },
  generateAll:    { en: "▶ Generate All",                            zh: "▶ 批量生成" },
  exportCsv:      { en: "⬇ Export CSV",                             zh: "⬇ 导出 CSV" },
  keyword:        { en: "Keyword",                                   zh: "关键词" },
  platform:       { en: "Platform",                                  zh: "平台" },
  status:         { en: "Status",                                    zh: "状态" },
  preview:        { en: "Preview",                                   zh: "预览" },
  calendarEmpty:  { en: "No scheduled content this month.",         zh: "本月暂无排期内容。" },
  geoGaps:        { en: "GEO Visibility Gaps (optional)",           zh: "AI 可见度缺口（选填）" },
  keywords:       { en: "Keywords (comma-separated)",               zh: "关键词（逗号分隔）" },
  language:       { en: "Language",                                  zh: "语言" },
  copied:         { en: "Copied!",                                   zh: "已复制！" },
  savedOk:        { en: "Saved to drafts.",                         zh: "已保存为草稿。" },
  errorGenerate:  { en: "Generation failed. Please try again.",     zh: "生成失败，请重试。" },
  purchaseRate:   { en: "Purchase intent rate",                     zh: "购买意图率" },
  mentionRate:    { en: "AI mention rate",                          zh: "AI 提及率" },
  redditMentions: { en: "Reddit mentions",                          zh: "Reddit 提及数" },
  youtubeGap:     { en: "YouTube content gap",                      zh: "YouTube 内容缺口" },
  openLink:       { en: "Open link →",                              zh: "打开链接 →" },
  publishResult:  { en: "Publish result",                           zh: "发布结果" },
  noEvents:       { en: "Nothing scheduled.",                       zh: "暂无排期。" },
  scheduledAt:    { en: "Scheduled for",                            zh: "排期时间" },
};
type Lang = "en" | "zh";
const t = (key: string, lang: Lang) => T[key]?.[lang] ?? T[key]?.en ?? key;

/* ── Constants ───────────────────────────────────────────────────── */
const PLATFORMS = [
  { id: "reddit",   label: "Reddit",   icon: "💬", desc: "Community post" },
  { id: "amazon",   label: "Amazon",   icon: "📦", desc: "Listing copy" },
  { id: "blog",     label: "Blog",     icon: "📝", desc: "SEO article" },
  { id: "x",        label: "X",        icon: "𝕏",  desc: "Tweet / thread" },
  { id: "linkedin", label: "LinkedIn", icon: "💼", desc: "Professional post" },
  { id: "tiktok",   label: "TikTok",   icon: "🎵", desc: "Video script" },
] as const;

type PlatformId = typeof PLATFORMS[number]["id"];

const MARKETS = ["US", "CN", "SEA", "JP", "KR", "EU", "UK"];
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "id", label: "Bahasa" },
  { code: "th", label: "ภาษาไทย" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
];

const CONTENT_TYPE_MAP: Record<PlatformId, string> = {
  reddit: "post", x: "post", linkedin: "post",
  amazon: "listing", blog: "article", tiktok: "script",
};

/* ── Shared helpers ──────────────────────────────────────────────── */
function StatusBadge({ status, lang }: { status: string; lang: Lang }) {
  const colors: Record<string, string> = {
    draft:     "bg-[#25253f] text-[#a0a0c0]",
    scheduled: "bg-amber-500/20 text-amber-300",
    published: "bg-emerald-500/20 text-emerald-300",
  };
  const label: Record<string, string> = {
    draft: t("draftStatus", lang), scheduled: t("scheduledStatus", lang), published: t("publishedStatus", lang),
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[status] ?? colors.draft}`}>
      {label[status] ?? status}
    </span>
  );
}

function PlatformIcon({ platform }: { platform: string }) {
  const p = PLATFORMS.find(x => x.id === platform);
  return <span className="text-sm">{p?.icon ?? "📄"}</span>;
}

/* ── Tab 1: Generate ─────────────────────────────────────────────── */
function GenerateTab({ lang }: { lang: Lang }) {
  const [brand, setBrand] = useState("Olayks");
  const [product, setProduct] = useState("Electric Hot Pot");
  const [market, setMarket] = useState("US");
  const [language, setLanguage] = useState("en");
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>("reddit");
  const [keywords, setKeywords] = useState("");
  const [gapPurchase, setGapPurchase] = useState("4%");
  const [gapMention, setGapMention] = useState("22%");
  const [gapReddit, setGapReddit] = useState("4 posts");
  const [gapYoutube, setGapYoutube] = useState("496×");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentGenerateResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const handleGenerate = useCallback(async () => {
    if (!brand || !product) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const geo_gaps: Record<string, string> = {};
      if (gapPurchase) geo_gaps.purchase_rate = gapPurchase;
      if (gapMention)  geo_gaps.mention_rate  = gapMention;
      if (gapReddit)   geo_gaps.reddit_mentions = gapReddit;
      if (gapYoutube)  geo_gaps.youtube_gap    = gapYoutube;

      const req: ContentGenerateRequest = {
        brand,
        product,
        platform: selectedPlatform,
        market,
        language,
        geo_gaps: Object.keys(geo_gaps).length ? geo_gaps : undefined,
        keywords: keywords ? keywords.split(",").map(k => k.trim()).filter(Boolean) : undefined,
      };
      const res = await contentApi.generate(req);
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("errorGenerate", lang));
    } finally {
      setLoading(false);
    }
  }, [brand, product, market, language, selectedPlatform, keywords, gapPurchase, gapMention, gapReddit, gapYoutube, lang]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    const text = result.title ? `${result.title}\n\n${result.body}` : result.body;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  const handleSaveDraft = useCallback(async () => {
    if (!result) return;
    try {
      await contentApi.createDraft({
        brand,
        platform: selectedPlatform,
        content_type: CONTENT_TYPE_MAP[selectedPlatform],
        title: result.title || undefined,
        body: result.body,
        keywords: result.hashtags || [],
      });
      setSavedMsg(t("savedOk", lang));
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (e) {
      console.error(e);
    }
  }, [result, brand, selectedPlatform, lang]);

  return (
    <div className="space-y-6">
      {/* Input row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-[#a0a0c0] mb-1">{t("brand", lang)}</label>
          <input
            className="w-full bg-[#16162a] border border-[#25253f] rounded-lg px-3 py-2 text-sm text-[#f0f0f8] focus:outline-none focus:border-[#ff6b35]"
            value={brand} onChange={e => setBrand(e.target.value)}
            placeholder="Brand name"
          />
        </div>
        <div>
          <label className="block text-xs text-[#a0a0c0] mb-1">{t("product", lang)}</label>
          <input
            className="w-full bg-[#16162a] border border-[#25253f] rounded-lg px-3 py-2 text-sm text-[#f0f0f8] focus:outline-none focus:border-[#ff6b35]"
            value={product} onChange={e => setProduct(e.target.value)}
            placeholder="Product name"
          />
        </div>
        <div>
          <label className="block text-xs text-[#a0a0c0] mb-1">{t("market", lang)}</label>
          <select
            className="w-full bg-[#16162a] border border-[#25253f] rounded-lg px-3 py-2 text-sm text-[#f0f0f8] focus:outline-none focus:border-[#ff6b35]"
            value={market} onChange={e => setMarket(e.target.value)}
          >
            {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[#a0a0c0] mb-1">{t("language", lang)}</label>
          <select
            className="w-full bg-[#16162a] border border-[#25253f] rounded-lg px-3 py-2 text-sm text-[#f0f0f8] focus:outline-none focus:border-[#ff6b35]"
            value={language} onChange={e => setLanguage(e.target.value)}
          >
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
      </div>

      {/* Platform cards */}
      <div>
        <label className="block text-xs text-[#a0a0c0] mb-2">{t("platform", lang)}</label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {PLATFORMS.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-sm transition-all ${
                selectedPlatform === p.id
                  ? "border-[#ff6b35] bg-[#ff6b35]/10 text-[#ff6b35]"
                  : "border-[#25253f] bg-[#16162a] text-[#a0a0c0] hover:border-[#ff6b35]/50"
              }`}
            >
              <span className="text-xl">{p.icon}</span>
              <span className="font-medium text-xs">{p.label}</span>
              <span className="text-[10px] opacity-60">{p.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* GEO Gaps */}
      <div>
        <label className="block text-xs text-[#a0a0c0] mb-2">{t("geoGaps", lang)}</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { key: "gapPurchase", label: t("purchaseRate", lang), val: gapPurchase, set: setGapPurchase },
            { key: "gapMention",  label: t("mentionRate",  lang), val: gapMention,  set: setGapMention  },
            { key: "gapReddit",   label: t("redditMentions", lang), val: gapReddit, set: setGapReddit   },
            { key: "gapYoutube",  label: t("youtubeGap",   lang), val: gapYoutube,  set: setGapYoutube  },
          ].map(f => (
            <div key={f.key} className="bg-[#16162a] border border-[#25253f] rounded-lg px-3 py-2">
              <div className="text-[10px] text-[#a0a0c0] mb-1">{f.label}</div>
              <input
                className="w-full bg-transparent text-sm text-[#f0f0f8] focus:outline-none"
                value={f.val} onChange={e => f.set(e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-xs text-[#a0a0c0] mb-1">{t("keywords", lang)}</label>
        <input
          className="w-full bg-[#16162a] border border-[#25253f] rounded-lg px-3 py-2 text-sm text-[#f0f0f8] focus:outline-none focus:border-[#ff6b35]"
          value={keywords} onChange={e => setKeywords(e.target.value)}
          placeholder="electric hot pot, dorm cooking, budget kitchen..."
        />
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={loading || !brand || !product}
        className="w-full py-3 rounded-xl bg-[#ff6b35] hover:bg-[#ff8555] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all"
      >
        {loading ? t("generating", lang) : t("generateBtn", lang)}
      </button>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Result card */}
      {result && (
        <div className="bg-[#16162a] border border-[#25253f] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlatformIcon platform={result.platform} />
              <span className="font-semibold text-[#f0f0f8]">
                {PLATFORMS.find(p => p.id === result.platform)?.label} — {result.content_type}
              </span>
            </div>
            {result.hashtags?.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {result.hashtags.slice(0, 4).map((h, i) => (
                  <span key={i} className="text-[10px] bg-[#25253f] text-[#a0a0c0] px-2 py-0.5 rounded">{h}</span>
                ))}
              </div>
            )}
          </div>

          {result.title && (
            <div className="text-[#ff6b35] font-semibold text-sm">{result.title}</div>
          )}

          <div className="text-[#c0c0d8] text-sm leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
            {result.body}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg border border-[#25253f] hover:border-[#ff6b35]/50 text-[#a0a0c0] hover:text-[#f0f0f8] text-sm transition-all"
            >
              {copied ? t("copied", lang) : t("copyBtn", lang)}
            </button>
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 rounded-lg border border-[#ff6b35]/40 hover:bg-[#ff6b35]/10 text-[#ff6b35] text-sm transition-all"
            >
              {savedMsg || t("saveDraft", lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Tab 2: Publish ──────────────────────────────────────────────── */
function PublishTab({ lang }: { lang: Lang }) {
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);
  const [filterPlatform, setFilterPlatform] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [publishResult, setPublishResult] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const loadDrafts = useCallback(async () => {
    try {
      const res = await contentApi.listDrafts({
        platform: filterPlatform || undefined,
        status: filterStatus || undefined,
      });
      setDrafts(res.drafts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filterPlatform, filterStatus]);

  useEffect(() => { loadDrafts(); }, [loadDrafts]);

  const handlePublish = useCallback(async (id: string) => {
    try {
      const res = await contentApi.publishDraft(id);
      setPublishResult(prev => ({ ...prev, [id]: res.message }));
      if (res.url) window.open(res.url, "_blank");
      await loadDrafts();
    } catch (e: unknown) {
      setPublishResult(prev => ({ ...prev, [id]: e instanceof Error ? e.message : "Failed" }));
    }
  }, [loadDrafts]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Delete this draft?")) return;
    try {
      await contentApi.deleteDraft(id);
      await loadDrafts();
    } catch (e) { console.error(e); }
  }, [loadDrafts]);

  const handleCopy = useCallback((draft: ContentDraft) => {
    const text = draft.title ? `${draft.title}\n\n${draft.body}` : draft.body;
    navigator.clipboard.writeText(text);
  }, []);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        <select
          className="bg-[#16162a] border border-[#25253f] rounded-lg px-3 py-2 text-sm text-[#a0a0c0] focus:outline-none focus:border-[#ff6b35]"
          value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}
        >
          <option value="">All platforms</option>
          {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <select
          className="bg-[#16162a] border border-[#25253f] rounded-lg px-3 py-2 text-sm text-[#a0a0c0] focus:outline-none focus:border-[#ff6b35]"
          value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="draft">{t("draftStatus", lang)}</option>
          <option value="scheduled">{t("scheduledStatus", lang)}</option>
          <option value="published">{t("publishedStatus", lang)}</option>
        </select>
      </div>

      {loading && <div className="text-center text-[#a0a0c0] py-8">Loading…</div>}

      {!loading && drafts.length === 0 && (
        <div className="text-center text-[#a0a0c0] py-12 text-sm">{t("noDrafts", lang)}</div>
      )}

      {!loading && drafts.map(draft => (
        <div key={draft.id} className="bg-[#16162a] border border-[#25253f] rounded-xl p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <PlatformIcon platform={draft.platform} />
              <div className="min-w-0">
                <div className="text-sm font-medium text-[#f0f0f8] truncate">{draft.title || draft.brand}</div>
                <div className="text-xs text-[#a0a0c0]">{draft.brand} · {draft.platform} · {draft.content_type}</div>
              </div>
            </div>
            <StatusBadge status={draft.status} lang={lang} />
          </div>

          <div className="text-[#c0c0d8] text-xs leading-relaxed line-clamp-3">{draft.body}</div>

          {publishResult[draft.id] && (
            <div className="text-xs text-amber-300 bg-amber-500/10 rounded px-3 py-2">
              {t("publishResult", lang)}: {publishResult[draft.id]}
            </div>
          )}

          {draft.platform_url && (
            <a href={draft.platform_url} target="_blank" rel="noopener noreferrer"
               className="text-xs text-[#ff6b35] hover:underline">
              {t("openLink", lang)}
            </a>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => handleCopy(draft)}
              className="px-3 py-1.5 rounded-lg border border-[#25253f] hover:border-[#ff6b35]/50 text-[#a0a0c0] hover:text-[#f0f0f8] text-xs transition-all"
            >
              {t("copyBtn", lang)}
            </button>
            {draft.status !== "published" && (
              <button
                onClick={() => handlePublish(draft.id)}
                className="px-3 py-1.5 rounded-lg bg-[#ff6b35]/10 border border-[#ff6b35]/30 hover:bg-[#ff6b35]/20 text-[#ff6b35] text-xs transition-all"
              >
                {t("publishBtn", lang)}
              </button>
            )}
            <button
              onClick={() => handleDelete(draft.id)}
              className="px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-400 text-xs transition-all ml-auto"
            >
              {t("deleteBtn", lang)}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Tab 3: Templates (Batch) ────────────────────────────────────── */
interface TemplateRow {
  id: string;
  brand: string;
  product: string;
  platform: PlatformId;
  keywords: string;
  status: "pending" | "generating" | "done" | "error";
  preview: string;
}

function TemplatesTab({ lang }: { lang: Lang }) {
  const [rows, setRows] = useState<TemplateRow[]>([
    { id: "1", brand: "Olayks", product: "Electric Hot Pot", platform: "reddit",   keywords: "dorm cooking", status: "pending", preview: "" },
    { id: "2", brand: "Olayks", product: "Electric Hot Pot", platform: "amazon",   keywords: "electric hot pot",  status: "pending", preview: "" },
    { id: "3", brand: "Olayks", product: "Electric Hot Pot", platform: "linkedin", keywords: "kitchen appliance",  status: "pending", preview: "" },
  ]);
  const [generating, setGenerating] = useState(false);

  const addRow = () => {
    setRows(prev => [...prev, {
      id: Date.now().toString(),
      brand: prev[0]?.brand || "",
      product: prev[0]?.product || "",
      platform: "reddit",
      keywords: "",
      status: "pending",
      preview: "",
    }]);
  };

  const updateRow = (id: string, field: keyof TemplateRow, value: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeRow = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const handleGenerateAll = useCallback(async () => {
    const pending = rows.filter(r => r.status !== "done");
    if (!pending.length) return;
    setGenerating(true);

    for (const row of pending) {
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: "generating" } : r));
      try {
        const result = await contentApi.generate({
          brand: row.brand,
          product: row.product,
          platform: row.platform,
          keywords: row.keywords ? row.keywords.split(",").map(k => k.trim()) : undefined,
        });
        setRows(prev => prev.map(r => r.id === row.id ? {
          ...r, status: "done",
          preview: (result.title ? result.title + "\n\n" : "") + result.body.slice(0, 200) + "…",
        } : r));
      } catch {
        setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: "error" } : r));
      }
    }
    setGenerating(false);
  }, [rows]);

  const handleExportCsv = useCallback(() => {
    const header = "brand,product,platform,keywords,status,preview\n";
    const body = rows.map(r =>
      [r.brand, r.product, r.platform, r.keywords, r.status, `"${r.preview.replace(/"/g, '""')}"`].join(",")
    ).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "content-batch.csv"; a.click();
    URL.revokeObjectURL(url);
  }, [rows]);

  const statusColor: Record<string, string> = {
    pending:    "text-[#a0a0c0]",
    generating: "text-amber-300",
    done:       "text-emerald-400",
    error:      "text-red-400",
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end">
        <button
          onClick={handleGenerateAll}
          disabled={generating}
          className="px-4 py-2 rounded-lg bg-[#ff6b35] hover:bg-[#ff8555] disabled:opacity-50 text-white text-sm font-semibold transition-all"
        >
          {generating ? t("generating", lang) : t("generateAll", lang)}
        </button>
        <button
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-lg border border-[#25253f] hover:border-[#ff6b35]/50 text-[#a0a0c0] hover:text-[#f0f0f8] text-sm transition-all"
        >
          {t("exportCsv", lang)}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#25253f]">
        <table className="w-full text-sm">
          <thead className="bg-[#16162a]">
            <tr>
              {["brand", "product", "platform", "keywords", "status", "preview"].map(col => (
                <th key={col} className="text-left px-3 py-2.5 text-[10px] text-[#a0a0c0] font-medium uppercase tracking-wide">
                  {col}
                </th>
              ))}
              <th className="px-3 py-2.5 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id} className={`border-t border-[#25253f] ${idx % 2 === 0 ? "bg-[#0d0d1a]" : "bg-[#16162a]/30"}`}>
                <td className="px-2 py-2">
                  <input className="w-24 bg-transparent text-[#f0f0f8] text-xs focus:outline-none" value={row.brand} onChange={e => updateRow(row.id, "brand", e.target.value)} />
                </td>
                <td className="px-2 py-2">
                  <input className="w-32 bg-transparent text-[#f0f0f8] text-xs focus:outline-none" value={row.product} onChange={e => updateRow(row.id, "product", e.target.value)} />
                </td>
                <td className="px-2 py-2">
                  <select
                    className="bg-transparent text-[#f0f0f8] text-xs focus:outline-none"
                    value={row.platform}
                    onChange={e => updateRow(row.id, "platform", e.target.value)}
                  >
                    {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.label}</option>)}
                  </select>
                </td>
                <td className="px-2 py-2">
                  <input className="w-36 bg-transparent text-[#a0a0c0] text-xs focus:outline-none" value={row.keywords} onChange={e => updateRow(row.id, "keywords", e.target.value)} placeholder="keyword1, keyword2" />
                </td>
                <td className={`px-2 py-2 text-xs font-medium ${statusColor[row.status]}`}>
                  {row.status === "generating" ? "⟳" : ""} {row.status}
                </td>
                <td className="px-2 py-2 max-w-[200px]">
                  <span className="text-[11px] text-[#a0a0c0] line-clamp-1">{row.preview || "—"}</span>
                </td>
                <td className="px-2 py-2">
                  <button onClick={() => removeRow(row.id)} className="text-red-400/50 hover:text-red-400 text-xs">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addRow}
        className="w-full py-2.5 rounded-xl border border-dashed border-[#25253f] hover:border-[#ff6b35]/50 text-[#a0a0c0] hover:text-[#ff6b35] text-sm transition-all"
      >
        {t("addRow", lang)}
      </button>
    </div>
  );
}

/* ── Tab 4: Calendar ─────────────────────────────────────────────── */
function CalendarTab({ lang }: { lang: Lang }) {
  const [events, setEvents] = useState<ContentDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Current month state
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed

  useEffect(() => {
    contentApi.getCalendar()
      .then(res => setEvents(res.events))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun

  // Group events by date (YYYY-MM-DD)
  const eventsByDate: Record<string, ContentDraft[]> = {};
  events.forEach(ev => {
    const dateStr = (ev.scheduled_at || ev.published_at || "").slice(0, 10);
    if (dateStr) {
      if (!eventsByDate[dateStr]) eventsByDate[dateStr] = [];
      eventsByDate[dateStr].push(ev);
    }
  });

  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] || []) : [];

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Calendar grid */}
      <div className="md:col-span-2 bg-[#16162a] border border-[#25253f] rounded-xl p-4">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); }}
            className="p-1.5 rounded hover:bg-[#25253f] text-[#a0a0c0] hover:text-[#f0f0f8] transition-colors"
          >‹</button>
          <span className="text-sm font-semibold text-[#f0f0f8]">{monthLabel}</span>
          <button
            onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); }}
            className="p-1.5 rounded hover:bg-[#25253f] text-[#a0a0c0] hover:text-[#f0f0f8] transition-colors"
          >›</button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 text-center mb-1">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
            <div key={d} className="text-[10px] text-[#a0a0c0] py-1">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEvents = eventsByDate[dateStr] || [];
            const isToday = dateStr === new Date().toISOString().slice(0, 10);
            const isSelected = dateStr === selectedDate;
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`relative min-h-[40px] rounded-lg p-1 text-xs transition-all ${
                  isSelected ? "bg-[#ff6b35]/20 border border-[#ff6b35]" :
                  isToday ? "bg-[#ff6b35]/10 border border-[#ff6b35]/30" :
                  "hover:bg-[#25253f] border border-transparent"
                } ${isToday ? "text-[#ff6b35]" : "text-[#c0c0d8]"}`}
              >
                <div className="font-medium">{day}</div>
                {dayEvents.length > 0 && (
                  <div className="flex flex-wrap gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((ev, idx) => (
                      <div key={idx} className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
                    ))}
                    {dayEvents.length > 3 && <span className="text-[8px] text-[#a0a0c0]">+{dayEvents.length - 3}</span>}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {loading && <div className="text-center text-[#a0a0c0] text-xs mt-4">Loading events…</div>}
        {!loading && events.length === 0 && (
          <div className="text-center text-[#a0a0c0] text-xs mt-4">{t("calendarEmpty", lang)}</div>
        )}
      </div>

      {/* Day detail panel */}
      <div className="bg-[#16162a] border border-[#25253f] rounded-xl p-4">
        <div className="text-sm font-semibold text-[#f0f0f8] mb-3">
          {selectedDate || "Select a day"}
        </div>
        {selectedDate && selectedEvents.length === 0 && (
          <div className="text-xs text-[#a0a0c0]">{t("noEvents", lang)}</div>
        )}
        <div className="space-y-3">
          {selectedEvents.map(ev => (
            <div key={ev.id} className="bg-[#0d0d1a] rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2">
                <PlatformIcon platform={ev.platform} />
                <span className="text-xs font-medium text-[#f0f0f8] truncate">{ev.title || ev.brand}</span>
              </div>
              <div className="text-[10px] text-[#a0a0c0] line-clamp-2">{ev.body.slice(0, 100)}…</div>
              <div className="flex items-center justify-between">
                <StatusBadge status={ev.status} lang={lang} />
                {ev.scheduled_at && (
                  <span className="text-[10px] text-[#a0a0c0]">
                    {new Date(ev.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export default function ContentStudioView({ lang = "en" }: { lang?: Lang }) {
  const [activeTab, setActiveTab] = useState<"generate" | "publish" | "templates" | "calendar">("generate");

  const tabs = [
    { id: "generate",  label: t("tabGenerate",  lang), icon: "✨" },
    { id: "publish",   label: t("tabPublish",   lang), icon: "🚀" },
    { id: "templates", label: t("tabTemplates", lang), icon: "📋" },
    { id: "calendar",  label: t("tabCalendar",  lang), icon: "📅" },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#f0f0f8]">{t("pageTitle", lang)}</h1>
        <p className="text-[#a0a0c0] text-sm mt-1">{t("pageSubtitle", lang)}</p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-[#16162a] border border-[#25253f] rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[#ff6b35] text-white"
                : "text-[#a0a0c0] hover:text-[#f0f0f8]"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "generate"  && <GenerateTab  lang={lang} />}
        {activeTab === "publish"   && <PublishTab   lang={lang} />}
        {activeTab === "templates" && <TemplatesTab lang={lang} />}
        {activeTab === "calendar"  && <CalendarTab  lang={lang} />}
      </div>
    </div>
  );
}
