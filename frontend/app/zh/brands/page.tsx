import Link from "next/link";

export const metadata = {
  title: "品牌 GEO 仪表盘 — Avanti",
  description:
    "追踪您的品牌在 AI 中的可见度。监控 GEO 分数、语音份额以及 ChatGPT、Claude、Gemini 和 Perplexity 的 AI 推荐。",
};

const SAMPLE_BRANDS = [
  { name: "EcoFlow", slug: "ecoflow", category: "便携储能", sov: 34.0 },
  { name: "Jackery", slug: "jackery", category: "便携储能", sov: 28.7 },
  { name: "Bluetti", slug: "bluetti", category: "便携储能", sov: 12.3 },
  { name: "Anker", slug: "anker", category: "消费电子", sov: 45.2 },
  { name: "Goal Zero", slug: "goal-zero", category: "便携储能", sov: 8.1 },
];

export default function BrandsPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/zh/dashboard" className="text-sm transition-colors hover:text-white" style={{ color: "#7070a0" }}>
              ← 控制台
            </Link>
          </div>
          <h1 className="text-4xl font-black mb-4" style={{ color: "#ffffff" }}>
            品牌 GEO 仪表盘
          </h1>
          <p className="text-lg" style={{ color: "#a0a0b0" }}>
            追踪您的品牌在 ChatGPT、Claude、Gemini 和 Perplexity 中的 AI 可见度。
            监控 GEO 分数、语音份额和 AI 推荐。
          </p>
        </div>

        {/* CTA */}
        <div className="rounded-2xl p-8 mb-12" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", border: "1px solid #25253f" }}>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#ffffff" }}>
            想追踪您自己的品牌？
          </h2>
          <p className="mb-6" style={{ color: "#a0a0b0" }}>
            开始免费 AI 可见度审计。我们将分析您的品牌在 AI 推荐中的表现。
          </p>
          <Link
            href="/zh/book-demo"
            className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
            style={{ background: "#f5a623", color: "#000000" }}
          >
            获取免费审计 →
          </Link>
        </div>

        {/* Sample Brands */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: "#ffffff" }}>
            我们正在追踪的示例品牌
          </h2>
          <div className="grid gap-4">
            {SAMPLE_BRANDS.map((brand) => (
              <Link
                key={brand.slug}
                href={`/zh/brands/${brand.slug}`}
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
                      语音份额
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
