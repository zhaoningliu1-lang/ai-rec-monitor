import Link from "next/link";
import { CategoryEntry } from "@/lib/api";
import { Lang, tx, t } from "@/lib/i18n";
import { groupCategoriesByParent } from "@/lib/category-hierarchy";

type CategoriesKey = keyof typeof t.categories;

// Static demo data shown when no real scan data exists
const STATIC_AUTO: CategoryEntry[] = [
  { category: "Car Jump Starters",    brand_count: 8 },
  { category: "Dash Cameras",         brand_count: 7 },
  { category: "Car Phone Mounts",     brand_count: 6 },
  { category: "Car Battery Chargers", brand_count: 5 },
  { category: "Tire Inflators",       brand_count: 5 },
];

const STATIC_3C: CategoryEntry[] = [
  { category: "Portable Power Stations", brand_count: 11 },
  { category: "USB-C Chargers",          brand_count: 9 },
  { category: "Wireless Earbuds",        brand_count: 14 },
  { category: "Bluetooth Speakers",      brand_count: 8 },
  { category: "Smart Home Devices",      brand_count: 7 },
];

const STATIC_HOME: CategoryEntry[] = [
  { category: "Robot Vacuums",       brand_count: 10 },
  { category: "Air Purifiers",       brand_count: 8 },
  { category: "Kitchen Appliances",  brand_count: 6 },
  { category: "Home Organization",   brand_count: 5 },
];

const STATIC_BEAUTY: CategoryEntry[] = [
  { category: "Skincare",              brand_count: 12 },
  { category: "Hair Care",             brand_count: 9 },
  { category: "Makeup",                brand_count: 7 },
];

interface Props {
  categories: CategoryEntry[];
  lang: Lang;
}

export default function CategoriesView({ categories, lang }: Props) {
  const grouped = groupCategoriesByParent(categories);
  const indexPath = lang === "zh" ? "/zh/categories" : "/categories";
  const isDemo = categories.length === 0;

  // Static demo sections used when API returns empty
  const demoSections = [
    {
      id: "automotive",
      label: tx("categories", "sectionAutomotive" as CategoriesKey, lang),
      entries: STATIC_AUTO,
    },
    {
      id: "3c",
      label: tx("categories", "sectionConsumerElec" as CategoriesKey, lang),
      entries: STATIC_3C,
    },
    {
      id: "home-kitchen",
      label: tx("categories", "sectionHomeKitchen" as CategoriesKey, lang),
      entries: STATIC_HOME,
    },
    {
      id: "beauty",
      label: tx("categories", "sectionBeauty" as CategoriesKey, lang),
      entries: STATIC_BEAUTY,
    },
  ];

  function renderCategoryGrid(entries: CategoryEntry[], sectionLabel: string, sectionKey: string) {
    return (
      <div key={sectionKey}>
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
          {isDemo && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(245,166,35,0.08)", color: "#f5a623" }}>
              {tx("categories", "demoLabel" as CategoriesKey, lang)}
            </span>
          )}
        </div>
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
  }

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

      {/* Demo fallback banner */}
      {isDemo && (
        <div
          className="rounded-xl px-5 py-3 flex items-center gap-3"
          style={{ background: "rgba(245,166,35,0.07)", border: "1px solid rgba(245,166,35,0.2)" }}
        >
          <span className="text-base">📊</span>
          <p className="text-sm" style={{ color: "#b0905a" }}>
            {tx("categories", "demoBanner" as CategoriesKey, lang)}
            {" "}
            <Link href="/runs/new" className="underline font-medium" style={{ color: "#f5a623" }}>
              {tx("categories", "demoScanCta" as CategoriesKey, lang)}
            </Link>
          </p>
        </div>
      )}

      {/* Real data sections */}
      {!isDemo && grouped.map(({ parent, entries }) => {
        const sectionLabel = tx("categories", parent.labelKey as CategoriesKey, lang);
        return renderCategoryGrid(entries, sectionLabel, parent.id);
      })}

      {/* Static demo sections */}
      {isDemo && demoSections.map((s) => renderCategoryGrid(s.entries, s.label, s.id))}

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
