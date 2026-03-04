import Link from "next/link";

export const metadata = {
  title: "研究报告与案例分析 — Avanti",
  description: "Avanti 发布的 AI 可见度审计报告、GEO 案例分析与品牌基准研究。",
};

const POSTS = [
  {
    slug: "insta360-vs-dji",
    tag: "GEO 案例分析",
    title: "Insta360 vs DJI：消费者向 AI 询问相机推荐时，谁赢了？",
    excerpt:
      "我们在 ChatGPT、Claude、Gemini 和 Perplexity 上运行了 47 个查询。DJI 的 AI 可见度是 Insta360 的 2.3 倍——但差距可以弥补。这是完整分析。",
    date: "2026年3月",
    readTime: "8 分钟",
  },
];

export default function ZhBlogIndexPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      <div className="space-y-2">
        <div
          className="inline-block text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
        >
          Avanti 研究
        </div>
        <h1 className="text-3xl font-bold mt-3">GEO 研究报告与案例分析</h1>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          真实品牌的 AI 可见度审计——精确呈现现状、原因，以及如何改变。
        </p>
      </div>

      <div className="space-y-4">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/zh/blog/${post.slug}`}
            className="block rounded-xl p-6 transition-colors group"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="space-y-3">
              <div
                className="inline-block text-xs px-2.5 py-0.5 rounded-full font-medium"
                style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
              >
                {post.tag}
              </div>
              <h2
                className="text-lg font-semibold leading-snug group-hover:text-white transition-colors"
                style={{ color: "#f0f0f8" }}
              >
                {post.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
                {post.excerpt}
              </p>
              <div
                className="flex items-center gap-4 text-xs pt-1"
                style={{ color: "#7070a0" }}
              >
                <span>{post.date}</span>
                <span>·</span>
                <span>阅读时长 {post.readTime}</span>
                <span
                  className="ml-auto font-medium group-hover:text-white transition-colors"
                  style={{ color: "#ff6b35" }}
                >
                  阅读报告 →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div
        className="rounded-xl p-6 text-center space-y-3"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="text-sm font-medium">想让我们为你的品牌出一份报告？</p>
        <p className="text-xs" style={{ color: "#7070a0" }}>
          完全免费，无需注册，2 分钟内完成。
        </p>
        <Link
          href="/zh/audit"
          className="inline-block text-sm font-medium px-5 py-2 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          立即免费诊断 →
        </Link>
      </div>
    </div>
  );
}
