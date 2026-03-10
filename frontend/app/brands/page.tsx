import Link from "next/link";

export const metadata = {
  title: "Brand GEO Dashboard — Avanti",
  description:
    "Track your brand's AI visibility. Monitor GEO scores, share of voice, and AI recommendations across ChatGPT, Claude, Gemini, and Perplexity.",
};

const SAMPLE_BRANDS = [
  { name: "EcoFlow", slug: "ecoflow", category: "Portable Power", sov: 34.0 },
  { name: "Jackery", slug: "jackery", category: "Portable Power", sov: 28.7 },
  { name: "Bluetti", slug: "bluetti", category: "Portable Power", sov: 12.3 },
  { name: "Anker", slug: "anker", category: "Consumer Electronics", sov: 45.2 },
  { name: "Goal Zero", slug: "goal-zero", category: "Portable Power", sov: 8.1 },
];

export default function BrandsPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/dashboard" className="text-sm transition-colors hover:text-white" style={{ color: "#7070a0" }}>
              ← Dashboard
            </Link>
          </div>
          <h1 className="text-4xl font-black mb-4" style={{ color: "#ffffff" }}>
            Brand GEO Dashboard
          </h1>
          <p className="text-lg" style={{ color: "#a0a0b0" }}>
            Track your brand's AI visibility across ChatGPT, Claude, Gemini, and Perplexity.
            Monitor GEO scores, share of voice, and AI recommendations.
          </p>
        </div>

        {/* CTA */}
        <div className="rounded-2xl p-8 mb-12" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", border: "1px solid #25253f" }}>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#ffffff" }}>
            Want to track your own brand?
          </h2>
          <p className="mb-6" style={{ color: "#a0a0b0" }}>
            Get started with a free AI visibility audit. We'll analyze how your brand appears in AI recommendations.
          </p>
          <Link
            href="/book-demo"
            className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
            style={{ background: "#f5a623", color: "#000000" }}
          >
            Get Free Audit →
          </Link>
        </div>

        {/* Sample Brands */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: "#ffffff" }}>
            Sample Brands We're Tracking
          </h2>
          <div className="grid gap-4">
            {SAMPLE_BRANDS.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
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
                    <div className="text-2xl font-bold" style={{ color: "#f5a623" }}>
                      {brand.sov}%
                    </div>
                    <div className="text-xs" style={{ color: "#7070a0" }}>
                      Share of Voice
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
