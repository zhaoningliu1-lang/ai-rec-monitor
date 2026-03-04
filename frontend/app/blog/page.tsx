import Link from "next/link";

export const metadata = {
  title: "Research & GEO Case Studies — Avanti",
  description:
    "AI visibility audits, GEO case studies, and brand benchmarking reports from Avanti.",
};

const POSTS = [
  {
    slug: "insta360-vs-dji",
    tag: "GEO Case Study",
    title: "Insta360 vs DJI: Who Wins When Buyers Ask AI for Camera Recommendations?",
    excerpt:
      "We ran 47 queries across ChatGPT, Claude, Gemini, and Perplexity. DJI's AI visibility is 2.3× Insta360's — but the gap is closable. Here's the full breakdown.",
    date: "March 2026",
    readTime: "8 min read",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      <div className="space-y-2">
        <div
          className="inline-block text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
        >
          Avanti Research
        </div>
        <h1 className="text-3xl font-bold mt-3">GEO Reports & Case Studies</h1>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          Real AI visibility audits for real brands — showing exactly where they
          stand, why, and what to do about it.
        </p>
      </div>

      <div className="space-y-4">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
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
                <span>{post.readTime}</span>
                <span
                  className="ml-auto font-medium group-hover:text-white transition-colors"
                  style={{ color: "#ff6b35" }}
                >
                  Read report →
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
        <p className="text-sm font-medium">Want us to run a report for your brand?</p>
        <p className="text-xs" style={{ color: "#7070a0" }}>
          Free, no signup required. Takes under 2 minutes.
        </p>
        <Link
          href="/audit"
          className="inline-block text-sm font-medium px-5 py-2 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          Run Free Audit →
        </Link>
      </div>
    </div>
  );
}
