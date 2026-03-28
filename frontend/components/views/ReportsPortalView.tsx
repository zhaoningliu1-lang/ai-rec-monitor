"use client";

import { useEffect, useState } from "react";
import {
  reportsApi,
  SharedReport,
  ReportViewEntry,
} from "@/lib/api";
import { getToken } from "@/lib/auth";
import {
  Upload,
  Link2,
  Eye,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";

const t = {
  en: {
    title: "Report Portal",
    subtitle: "Share reports with clients via trackable links",
    upload: "Upload Report",
    titleLabel: "Report Title",
    titlePlaceholder: "e.g. SENSARTE — AI Visibility Report March 2026",
    brandLabel: "Brand Name (optional)",
    brandPlaceholder: "e.g. SENSARTE",
    slugLabel: "Custom URL Slug (optional)",
    slugPlaceholder: "e.g. sensarte-march-2026",
    selectFile: "Select HTML File",
    uploading: "Uploading...",
    myReports: "My Reports",
    noReports: "No reports yet. Upload your first report above.",
    views: "views",
    copyLink: "Copy Link",
    copied: "Copied!",
    delete: "Delete",
    viewAnalytics: "View Analytics",
    hideAnalytics: "Hide Analytics",
    noViews: "No views yet",
    loginRequired: "Please log in to manage reports.",
    viewTime: "Viewed At",
    ip: "IP Address",
    ua: "Browser",
  },
  zh: {
    title: "报告门户",
    subtitle: "通过可追踪链接与客户分享报告",
    upload: "上传报告",
    titleLabel: "报告标题",
    titlePlaceholder: "例如：SENSARTE — AI 可见度报告 2026年3月",
    brandLabel: "品牌名（可选）",
    brandPlaceholder: "例如：SENSARTE",
    slugLabel: "自定义 URL 标识（可选）",
    slugPlaceholder: "例如：sensarte-march-2026",
    selectFile: "选择 HTML 文件",
    uploading: "上传中...",
    myReports: "我的报告",
    noReports: "暂无报告，请在上方上传第一份报告。",
    views: "次浏览",
    copyLink: "复制链接",
    copied: "已复制！",
    delete: "删除",
    viewAnalytics: "查看分析",
    hideAnalytics: "收起分析",
    noViews: "暂无浏览记录",
    loginRequired: "请登录后管理报告。",
    viewTime: "浏览时间",
    ip: "IP 地址",
    ua: "浏览器",
  },
};

export default function ReportsPortalView({ lang = "en" }: { lang?: "en" | "zh" }) {
  const i = t[lang];
  const [reports, setReports] = useState<SharedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  // Upload form state
  const [title, setTitle] = useState("");
  const [brandName, setBrandName] = useState("");
  const [slug, setSlug] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  // Analytics state
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewsData, setViewsData] = useState<Record<string, ReportViewEntry[]>>({});
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    setLoggedIn(!!token);
    if (token) fetchReports();
    else setLoading(false);
  }, []);

  async function fetchReports() {
    try {
      const data = await reportsApi.list();
      setReports(data);
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setHtmlContent(ev.target?.result as string);
    };
    reader.readAsText(file);
  }

  async function handleUpload() {
    if (!title.trim() || !htmlContent) return;
    setUploading(true);
    try {
      const newReport = await reportsApi.upload({
        title: title.trim(),
        html_content: htmlContent,
        brand_name: brandName.trim() || undefined,
        slug: slug.trim() || undefined,
      });
      setReports((prev) => [newReport, ...prev]);
      setTitle("");
      setBrandName("");
      setSlug("");
      setHtmlContent("");
      setFileName("");
    } catch {
      /* noop */
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await reportsApi.remove(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch {
      /* noop */
    }
  }

  async function toggleAnalytics(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!viewsData[id]) {
      try {
        const views = await reportsApi.getViews(id);
        setViewsData((prev) => ({ ...prev, [id]: views }));
      } catch {
        /* noop */
      }
    }
  }

  function copyLink(url: string, token: string) {
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  }

  if (!loggedIn) {
    return (
      <div className="text-center py-20 text-[var(--muted)]">{i.loginRequired}</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{i.title}</h1>
        <p className="text-sm text-[rgba(255,255,255,.5)] mt-1">{i.subtitle}</p>
      </div>

      {/* Upload Section */}
      <div className="rounded-xl border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.03)] p-6 space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Upload size={16} className="text-[#ff6b35]" />
          {i.upload}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[rgba(255,255,255,.5)] mb-1">{i.titleLabel}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={i.titlePlaceholder}
              className="w-full bg-[rgba(255,255,255,.06)] border border-[rgba(255,255,255,.1)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#ff6b35] transition"
            />
          </div>
          <div>
            <label className="block text-xs text-[rgba(255,255,255,.5)] mb-1">{i.brandLabel}</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder={i.brandPlaceholder}
              className="w-full bg-[rgba(255,255,255,.06)] border border-[rgba(255,255,255,.1)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#ff6b35] transition"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[rgba(255,255,255,.5)] mb-1">{i.slugLabel}</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={i.slugPlaceholder}
              className="w-full bg-[rgba(255,255,255,.06)] border border-[rgba(255,255,255,.1)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#ff6b35] transition"
            />
          </div>
          <div>
            <label className="block text-xs text-[rgba(255,255,255,.5)] mb-1">{i.selectFile}</label>
            <label className="flex items-center gap-2 bg-[rgba(255,255,255,.06)] border border-[rgba(255,255,255,.1)] rounded-lg px-3 py-2 text-sm cursor-pointer hover:border-[#ff6b35] transition">
              <FileText size={14} className="text-[rgba(255,255,255,.4)]" />
              <span className={fileName ? "text-white" : "text-[rgba(255,255,255,.4)]"}>
                {fileName || i.selectFile}
              </span>
              <input
                type="file"
                accept=".html,.htm"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <button
          onClick={handleUpload}
          disabled={!title.trim() || !htmlContent || uploading}
          className="px-5 py-2 rounded-lg bg-[#ff6b35] text-white text-sm font-medium hover:bg-[#e55a2b] disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {uploading ? i.uploading : i.upload}
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold">{i.myReports}</h2>

        {loading ? (
          <div className="text-center py-12 text-[rgba(255,255,255,.4)]">...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-[rgba(255,255,255,.4)]">{i.noReports}</div>
        ) : (
          reports.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.03)] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate">{r.title}</div>
                  <div className="text-xs text-[rgba(255,255,255,.4)] mt-0.5 flex items-center gap-3">
                    {r.brand_name && (
                      <span className="px-2 py-0.5 rounded-full bg-[rgba(255,107,53,.12)] text-[#ff6b35] text-[10px] font-medium">
                        {r.brand_name}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Eye size={11} /> {r.view_count} {i.views}
                    </span>
                    <span>{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => copyLink(r.share_url, r.token)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-[rgba(255,255,255,.06)] hover:bg-[rgba(255,255,255,.1)] transition"
                  >
                    {copiedToken === r.token ? (
                      <><Check size={12} className="text-green-400" /> {i.copied}</>
                    ) : (
                      <><Copy size={12} /> {i.copyLink}</>
                    )}
                  </button>
                  <a
                    href={r.share_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-[rgba(255,255,255,.06)] hover:bg-[rgba(255,255,255,.1)] transition"
                  >
                    <Link2 size={12} />
                  </a>
                  <button
                    onClick={() => toggleAnalytics(r.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-[rgba(255,255,255,.06)] hover:bg-[rgba(255,255,255,.1)] transition"
                  >
                    {expandedId === r.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {expandedId === r.id ? i.hideAnalytics : i.viewAnalytics}
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 rounded-lg text-[rgba(255,255,255,.3)] hover:text-red-400 hover:bg-[rgba(239,68,68,.1)] transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Analytics Drawer */}
              {expandedId === r.id && (
                <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,.08)]">
                  {!viewsData[r.id] ? (
                    <div className="text-xs text-[rgba(255,255,255,.3)] py-2">...</div>
                  ) : viewsData[r.id].length === 0 ? (
                    <div className="text-xs text-[rgba(255,255,255,.3)] py-2">{i.noViews}</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-[rgba(255,255,255,.4)]">
                            <th className="text-left py-1 pr-4 font-medium">{i.viewTime}</th>
                            <th className="text-left py-1 pr-4 font-medium">{i.ip}</th>
                            <th className="text-left py-1 font-medium">{i.ua}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewsData[r.id].map((v, idx) => (
                            <tr key={idx} className="border-t border-[rgba(255,255,255,.05)]">
                              <td className="py-1.5 pr-4 text-[rgba(255,255,255,.7)]">
                                {new Date(v.viewed_at).toLocaleString()}
                              </td>
                              <td className="py-1.5 pr-4 text-[rgba(255,255,255,.5)]">
                                {v.ip_address || "—"}
                              </td>
                              <td className="py-1.5 text-[rgba(255,255,255,.4)] truncate max-w-[200px]">
                                {v.user_agent?.split(" ").slice(0, 3).join(" ") || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
