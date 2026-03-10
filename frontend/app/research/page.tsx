import Link from "next/link";
import { RESEARCH_REPORTS, getCategoryByKey } from "@/lib/research-reports";

export const metadata = {
  title: "AI Visibility Research Reports — Avanti",
  description:
    "Daily AI visibility research reports across 7 product categories. Market analysis, competitor rankings, and optimization recommendations for cross-border sellers.",
};

const CATEGORY_FILTERS = [
  { key: "all", label: "All Categories" },
  { key: "baby", label: "Baby Products" },
  { key: "electronics", label: "Electronics" },
  { key: "outdoor", label: "Outdoor Sports" },
  { key: "home", label: "Home & Living" },
  { key: "fashion", label: "Fashion" },
  { key: "beauty", label: "Beauty" },
  { key: "pet", label: "Pet Products" },
];

export default function ResearchIndexPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      <div className="space-y-2">
        <div
          className="inline-block text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
        >
          Avanti Research
        </div>
        <h1 className="text-3xl font-bold mt-3">AI Visibility Research Reports</h1>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          Daily research reports analyzing AI recommendation patterns across 7 product
          categories — updated every day with fresh data from ChatGPT, Claude, Gemini &amp; Perplexity.
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
              href={`/research/${report.slug}`}
              className="block rounded-xl p-6 transition-colors group"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div className="space-y-3">
                <div
                  className="inline-block text-xs px-2.5 py-0.5 rounded-full font-medium"
                  style={{ background: cat.bg, color: cat.color }}
                >
                  {report.tag.en}
                </div>
                <h2
                  className="text-lg font-semibold leading-snug group-hover:text-white transition-colors"
                  style={{ color: "#f0f0f8" }}
                >
                  {report.title.en}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
                  {report.excerpt.en}
                </p>
                <div
                  className="flex items-center gap-4 text-xs pt-1"
                  style={{ color: "#7070a0" }}
                >
                  <span>{report.dateLabel.en}</span>
                  <span>·</span>
                  <span>{report.readTime.en}</span>
                  <span
                    className="ml-auto font-medium group-hover:text-white transition-colors"
                    style={{ color: "#ff6b35" }}
                  >
                    Read report →
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
        <p className="text-sm font-medium">Want a custom report for your category?</p>
        <p className="text-xs" style={{ color: "#7070a0" }}>
          Free GEO Score audit. See your AI visibility score vs every competitor in your category.
        </p>
        <Link
          href="/signup"
          className="inline-block text-sm font-medium px-5 py-2 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          Run Free Audit →
        </Link>
      </div>
    </div>
  );
}
