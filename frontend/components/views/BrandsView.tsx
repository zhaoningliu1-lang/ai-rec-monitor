"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, CategoryEntry, LeaderboardEntry } from "@/lib/api";
import { Lang, tx } from "@/lib/i18n";

interface BrandRow {
  name: string;
  category: string;
  sov: number;
}

export default function BrandsView({ lang }: { lang: Lang }) {
  const s = (k: keyof typeof import("@/lib/i18n").t.brands) => tx("brands", k, lang);
  const h = (p: string) => (lang === "zh" ? `/zh${p}` : p);

  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const cats: CategoryEntry[] = await api.listCategories();
        // Fetch leaderboard for up to 5 categories
        const topCats = cats.slice(0, 5);
        const leaderboards = await Promise.all(
          topCats.map((c) =>
            api.getCategoryLeaderboard(c.category)
              .then((entries) => entries.map((e) => ({ name: e.brand_name, category: c.category, sov: e.weighted_sov })))
              .catch(() => [] as BrandRow[])
          )
        );
        const all = leaderboards.flat();
        // Deduplicate by brand name, keep highest SOV
        const map = new Map<string, BrandRow>();
        for (const b of all) {
          const existing = map.get(b.name);
          if (!existing || b.sov > existing.sov) map.set(b.name, b);
        }
        const sorted = [...map.values()].sort((a, b) => b.sov - a.sov);
        setBrands(sorted);
      } catch {
        // fallback empty
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Link href={h("/dashboard")} className="text-sm transition-colors hover:text-white" style={{ color: "#7070a0" }}>
            {s("backDash")}
          </Link>
        </div>
        <h1 className="text-4xl font-black mb-4" style={{ color: "#ffffff" }}>
          {s("title")}
        </h1>
        <p className="text-lg" style={{ color: "#a0a0b0" }}>
          {s("subtitle")}
        </p>
      </div>

      {/* CTA */}
      <div className="rounded-2xl p-8 mb-12" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", border: "1px solid #25253f" }}>
        <h2 className="text-2xl font-bold mb-3" style={{ color: "#ffffff" }}>
          {s("trackYours")}
        </h2>
        <p className="mb-6" style={{ color: "#a0a0b0" }}>
          {s("trackDesc")}
        </p>
        <Link
          href={h("/audit")}
          className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          {s("freeAudit")}
        </Link>
      </div>

      {/* Brand List */}
      <div>
        <h2 className="text-2xl font-bold mb-6" style={{ color: "#ffffff" }}>
          {s("sampleTitle")}
        </h2>

        {loading && (
          <div className="rounded-xl p-12 text-center" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
            <p className="text-sm" style={{ color: "#7070a0" }}>{s("loading")}</p>
          </div>
        )}

        {!loading && brands.length === 0 && (
          <div className="rounded-xl p-12 text-center" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
            <p className="text-sm" style={{ color: "#7070a0" }}>{s("noBrands")}</p>
          </div>
        )}

        {!loading && brands.length > 0 && (
          <div className="grid gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href={h(`/brands/${encodeURIComponent(brand.name)}`)}
                className="block rounded-xl p-5 transition-all hover:scale-[1.01]"
                style={{ background: "#0f0f17", border: "1px solid #25253f" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold mb-1" style={{ color: "#ffffff" }}>
                      {brand.name}
                    </div>
                    <div className="text-sm" style={{ color: "#7070a0" }}>
                      {brand.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: "#ff6b35" }}>
                      {brand.sov.toFixed(1)}%
                    </div>
                    <div className="text-xs" style={{ color: "#7070a0" }}>
                      {s("sov")}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
