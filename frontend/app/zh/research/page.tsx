import Link from "next/link";
import { RESEARCH_REPORTS, getCategoryByKey } from "@/lib/research-reports";

export const metadata = {
  title: "AI 可见度研究报告 — 阿凡提",
  description:
    "每日 AI 可见度研究报告，覆盖 7 个产品品类。市场分析、竞品排名和优化建议，助力跨境卖家提升 AI 推荐份额。",
};

const CATEGORY_FILTERS = [
  { key: "all", label: "全部品类" },
  { key: "baby", label: "婴儿用品" },
  { key: "electronics", label: "3C电子" },
  { key: "outdoor", label: "户外运动" },
  { key: "home", label: "家居用品" },
  { key: "fashion", label: "时尚配饰" },
  { key: "beauty", label: "美妆护肤" },
  { key: "pet", label: "宠物用品" },
];

export default function ZhResearchIndexPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      <div className="space-y-2">
        <div
          className="inline-block text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
        >
          阿凡提 研究
        </div>
        <h1 className="text-3xl font-bold mt-3">AI 可见度研究报告</h1>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          每日研究报告，分析 7 个产品品类的 AI 推荐模式——每天更新来自 ChatGPT、Claude、Gemini 和 Perplexity 的最新数据。
        </p>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_FILTERS.map((f) => {
          const cat = f.key !== "all" ? getCategoryByKey(f.key) : null;
          return (
            <span
              key={f.key}
              className="text-xs px-3 py-1 rounded-full font-medium cursor-default"
              style={{
                background: cat ? cat.bg : "rgba(255,107,53,0.12)",
                color: cat ? cat.color : "#ff6b35",
              }}
            >
              {f.label}
            </span>
          );
        })}
      </div>

      {/* Report list */}
      <div className="space-y-4">
        {RESEARCH_REPORTS.map((report) => {
          const cat = getCategoryByKey(report.categoryKey);
          return (
            <Link
              key={report.slug}
              href={`/zh/research/${report.slug}`}
              className="block rounded-xl p-6 transition-colors group"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div className="space-y-3">
                <div
                  className="inline-block text-xs px-2.5 py-0.5 rounded-full font-medium"
                  style={{ background: cat.bg, color: cat.color }}
                >
                  {report.tag.zh}
                </div>
                <h2
                  className="text-lg font-semibold leading-snug group-hover:text-white transition-colors"
                  style={{ color: "#f0f0f8" }}
                >
                  {report.title.zh}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
                  {report.excerpt.zh}
                </p>
                <div
                  className="flex items-center gap-4 text-xs pt-1"
                  style={{ color: "#7070a0" }}
                >
                  <span>{report.dateLabel.zh}</span>
                  <span>·</span>
                  <span>阅读时长 {report.readTime.zh}</span>
                  <span
                    className="ml-auto font-medium group-hover:text-white transition-colors"
                    style={{ color: "#ff6b35" }}
                  >
                    阅读报告 →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <div
        className="rounded-xl p-6 text-center space-y-3"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="text-sm font-medium">想要你品类的定制报告？</p>
        <p className="text-xs" style={{ color: "#7070a0" }}>
          免费 GEO 诊断，查看你在品类内的 AI 可见度 vs 所有竞品。
        </p>
        <Link
          href="/zh/signup"
          className="inline-block text-sm font-medium px-5 py-2 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          立即免费诊断 →
        </Link>
      </div>
    </div>
  );
}
