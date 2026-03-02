import Link from "next/link";
import { CategoryEntry } from "@/lib/api";
import { Lang, tx, t } from "@/lib/i18n";
import { groupCategoriesByParent } from "@/lib/category-hierarchy";

type CategoriesKey = keyof typeof t.categories;

interface Props {
  categories: CategoryEntry[];
  lang: Lang;
}

export default function CategoriesView({ categories, lang }: Props) {
  const grouped = groupCategoriesByParent(categories);
  const indexPath = lang === "zh" ? "/zh/categories" : "/categories";

  return (
    <div className="space-y-8">
      <div>
        <div
          className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.25)" }}
        >
          {tx("categories", "pill", lang)}
        </div>
        <h1 className="text-3xl font-black mb-2">{tx("categories", "title", lang)}</h1>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          {tx("categories", "subtitle", lang)}
        </p>
      </div>

      {categories.length === 0 && (
        <div
          className="rounded-xl p-12 text-center"
          style={{ background: "#0f0f17", border: "1px solid #25253f" }}
        >
          <p className="text-sm mb-4" style={{ color: "#7070a0" }}>
            {tx("categories", "noCategories", lang)}
          </p>
          <Link href="/runs/new" className="text-sm underline" style={{ color: "#ff6b35" }}>
            {tx("categories", "startFirst", lang)}
          </Link>
        </div>
      )}

      {grouped.map(({ parent, entries }) => {
        const sectionLabel = tx("categories", parent.labelKey as CategoriesKey, lang);
        return (
          <div key={parent.id}>
            {/* Section header */}
            <div
              className="flex items-center gap-3 mb-4 pb-2"
              style={{ borderBottom: "1px solid #25253f" }}
            >
              <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>
                {sectionLabel}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,107,53,0.08)", color: "#ff6b35" }}>
                {entries.length}
              </span>
            </div>

            {/* Category cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {entries.map((cat, i) => (
                <Link
                  key={cat.category}
                  href={`${indexPath}/${encodeURIComponent(cat.category)}`}
                  className="rounded-xl p-5 flex items-center gap-4 group transition-colors"
                  style={{ background: "#0f0f17", border: "1px solid #25253f" }}
                >
                  <div
                    className="text-lg font-black w-8 text-center shrink-0"
                    style={{ color: i === 0 ? "#f5a623" : "#25253f" }}
                  >
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold group-hover:underline mb-0.5" style={{ color: "#f0f0f8" }}>
                      {cat.category}
                    </div>
                    <div className="text-xs" style={{ color: "#7070a0" }}>
                      {cat.brand_count} {cat.brand_count !== 1 ? tx("categories", "brandsTracked", lang) : tx("categories", "brandSingular", lang)}
                    </div>
                  </div>
                  <div className="text-sm shrink-0" style={{ color: "#25253f" }}>→</div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      {/* Explainer */}
      {categories.length > 0 && (
        <div
          className="rounded-xl p-6"
          style={{ background: "#0f0f17", border: "1px solid #25253f" }}
        >
          <h2 className="font-semibold mb-3 text-sm">{tx("categories", "indexTitle", lang)}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
            {tx("categories", "indexBody", lang)}
          </p>
        </div>
      )}
    </div>
  );
}
