import Link from "next/link";

export const metadata = {
  title: "AI Poisoning vs. AI Visibility Management: Our Position | Avanti",
  description:
    "After the 2026 CCTV 315 Gala exposed AI data poisoning schemes, we explain the critical difference between manipulating AI and monitoring AI visibility. Avanti measures — we don't manipulate.",
};

export default function AIPoisoningVsVisibilityPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,68,77,0.12)", color: "#ff4d6d" }}
          >
            Industry Position
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>
            March 15, 2026 · 8 min read
          </span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI Poisoning vs. AI Visibility Management: Our Position
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          The 2026 CCTV 315 Consumer Protection Gala exposed a gray-market industry chain
          where companies like &ldquo;Liqing GEO System&rdquo; were fabricating data to manipulate AI models.
          This put the entire GEO (Generative Engine Optimization) industry in the spotlight.
          As a company whose core business is AI visibility monitoring,
          we believe it&apos;s important to publicly and clearly state: what we do, what we don&apos;t do,
          and the fundamental difference between the two.
        </p>
      </div>

      {/* What happened */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">What the 315 Gala Exposed</h2>
        <div
          className="rounded-xl p-5 space-y-3"
          style={{
            background: "rgba(255,68,77,0.06)",
            border: "1px solid rgba(255,68,77,0.3)",
          }}
        >
          <div className="text-sm font-semibold" style={{ color: "#ff4d6d" }}>
            The Core Revelation
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
            CCTV investigators discovered that some companies were operating under the banner of
            &ldquo;GEO optimization&rdquo; while actually engaging in{" "}
            <strong style={{ color: "#f0f0f8" }}>AI data poisoning</strong>
            — mass-generating fake articles, fabricating user reviews, and injecting false
            information into AI training data to manipulate recommendation results from
            ChatGPT, Wenxin Yiyan, and other large language models.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
            This isn&apos;t optimization — it&apos;s{" "}
            <strong style={{ color: "#ff4d6d" }}>information pollution</strong>.
            These practices undermine the credibility of the AI ecosystem and harm
            every consumer and brand that relies on AI for truthful information.
          </p>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Our position is unequivocal:{" "}
          <strong style={{ color: "#f0f0f8" }}>
            the problems exposed by the 315 Gala are real, and these practices must be stopped.
          </strong>{" "}
          In fact, Avanti&apos;s entire product ecosystem was built precisely to help brands{" "}
          <strong style={{ color: "#f0f0f8" }}>detect and defend against</strong> this kind of attack.
        </p>
      </div>

      {/* What Avanti does */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">What Avanti Does (and Doesn&apos;t Do)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* What we DO */}
          <div
            className="rounded-xl p-5 space-y-3"
            style={{
              background: "rgba(34,197,94,0.04)",
              border: "1px solid rgba(34,197,94,0.25)",
            }}
          >
            <div className="text-sm font-bold" style={{ color: "#22c55e" }}>
              What We Do
            </div>
            <ul className="space-y-2">
              {[
                "Monitor how 4+ AI engines describe your brand",
                "Tell brands: \"This is how AI currently talks about you\"",
                "Detect AI hallucinations — find false claims about your brand",
                "Cross-platform verification: Reddit, YouTube, TikTok, Google Trends",
                "Provide data-driven insights and improvement recommendations",
                "Help brands improve AI visibility with authentic, high-quality content",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-xs leading-relaxed" style={{ color: "#7070a0" }}>
                  <span style={{ color: "#22c55e" }} className="shrink-0">&#10003;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What we DON'T */}
          <div
            className="rounded-xl p-5 space-y-3"
            style={{
              background: "rgba(255,68,77,0.04)",
              border: "1px solid rgba(255,68,77,0.25)",
            }}
          >
            <div className="text-sm font-bold" style={{ color: "#ff4d6d" }}>
              What We Don&apos;t Do
            </div>
            <ul className="space-y-2">
              {[
                "We don't fabricate data or articles",
                "We don't inject false information into AI training data",
                "We don't generate fake reviews or ratings",
                "We don't manipulate AI model outputs",
                "We don't create fraudulent third-party citations",
                "We don't engage in any form of AI data poisoning",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-xs leading-relaxed" style={{ color: "#7070a0" }}>
                  <span style={{ color: "#ff4d6d" }} className="shrink-0">&#10007;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          In short: we are the <strong style={{ color: "#f0f0f8" }}>radar</strong>,
          not the <strong style={{ color: "#f0f0f8" }}>missile</strong>.
          We help you see the battlefield clearly — we don&apos;t plant false intelligence on it.
        </p>
      </div>

      {/* Poisoning vs Optimization */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Poisoning vs. Legitimate Optimization</h2>

        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          This distinction isn&apos;t new. The SEO industry went through the exact same
          watershed moment over a decade ago:
        </p>

        <div className="space-y-3">
          {[
            {
              label: "Black Hat SEO",
              color: "#ff4d6d",
              items: [
                "Keyword Stuffing",
                "Link Farms",
                "Hidden Text",
                "Doorway Pages",
              ],
            },
            {
              label: "White Hat SEO",
              color: "#22c55e",
              items: [
                "High-quality original content",
                "Proper structured data (Schema.org)",
                "Genuine user experience optimization",
                "Authoritative external link building",
              ],
            },
          ].map((section) => (
            <div
              key={section.label}
              className="rounded-xl p-5 space-y-2"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div className="text-sm font-bold" style={{ color: section.color }}>
                {section.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {section.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2.5 py-1 rounded-lg"
                    style={{ background: "#1a1a2e", color: "#7070a0" }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          The logic for GEO (Generative Engine Optimization) is exactly the same:
        </p>

        <div className="space-y-3">
          {[
            {
              label: "AI Poisoning",
              color: "#ff4d6d",
              bg: "rgba(255,68,77,0.06)",
              border: "rgba(255,68,77,0.25)",
              items: [
                "Mass-generating fake articles to inject into AI training corpora",
                "Fabricating non-existent reviews and user testimonials",
                "Creating fraudulent citation sources to deceive AI crawlers",
                "Injecting false data into knowledge graphs",
              ],
            },
            {
              label: "Legitimate GEO Optimization",
              color: "#22c55e",
              bg: "rgba(34,197,94,0.06)",
              border: "rgba(34,197,94,0.25)",
              items: [
                "Creating authentic, high-quality product content and brand narratives",
                "Deploying structured data (Schema.org) to help AI understand accurately",
                "Building genuine community engagement (Reddit, forums, social media)",
                "Publishing accurate product information and specification data",
                "Earning authentic third-party reviews and media coverage",
              ],
            },
          ].map((section) => (
            <div
              key={section.label}
              className="rounded-xl p-5 space-y-3"
              style={{ background: section.bg, border: `1px solid ${section.border}` }}
            >
              <div className="text-sm font-bold" style={{ color: section.color }}>
                {section.label}
              </div>
              <ul className="space-y-1.5">
                {section.items.map((item) => (
                  <li key={item} className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
                    <span style={{ color: section.color }} className="mr-2">
                      {section.color === "#ff4d6d" ? "\u2717" : "\u2713"}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(245,166,35,0.06)",
            border: "1px solid rgba(245,166,35,0.3)",
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
            <strong style={{ color: "#f5a623" }}>Core Principle: </strong>
            If you need to <strong style={{ color: "#f0f0f8" }}>fabricate</strong> information
            to get AI to recommend you, it means your product or brand isn&apos;t ready yet.
            Legitimate GEO optimization should help AI{" "}
            <strong style={{ color: "#f0f0f8" }}>more accurately</strong> discover and
            understand the real strengths you already have.
          </p>
        </div>
      </div>

      {/* Why this matters */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Why This Matters for Your Brand</h2>

        {[
          {
            num: "01",
            title: "Competitors may be attacking your brand with false information",
            body: "What the 315 Gala exposed wasn't just self-promotion — some service providers generate negative false information about competitors. If someone plants fake articles claiming \"Brand X has serious quality issues\" in AI training data, you might never know. But when consumers ask AI \"What do you think of Brand X?\", those false claims will appear in the response.",
          },
          {
            num: "02",
            title: "AI hallucinations generate wrong information about your brand every day",
            body: "Even without deliberate poisoning, AI models produce \"hallucinations\" on their own — fabricating non-existent product features, incorrect prices, and fake customer complaints. You need monitoring tools to catch these issues before they spread and cause real damage to your reputation.",
          },
          {
            num: "03",
            title: "Brand safety in the AI era requires visibility, not manipulation",
            body: "Brands needed SEO monitoring tools to track search rankings in the search engine era. Brands equally need AI visibility monitoring tools to track their presence in the AI era. Monitoring is not manipulation — just as installing security cameras doesn't mean you're going to rob the place. You need to know what AI is saying to protect yourself.",
          },
        ].map((item) => (
          <div
            key={item.num}
            className="rounded-xl p-6 space-y-3"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="flex items-start gap-4">
              <div
                className="text-2xl font-black shrink-0"
                style={{ color: "rgba(255,107,53,0.3)" }}
              >
                {item.num}
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-sm">{item.title}</div>
                <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
                  {item.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* What Avanti offers */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">How Avanti Protects Your Brand</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: "\uD83D\uDD0D",
              title: "AI Visibility Monitoring",
              desc: "Continuously track how ChatGPT, Claude, Gemini, Perplexity, and 4+ AI engines describe and recommend your brand. Updated weekly so you always know how your brand's AI presence is evolving.",
              color: "#ff6b35",
            },
            {
              icon: "\u26A0\uFE0F",
              title: "Hallucination Detection",
              desc: "Automatically detect false claims, fabricated features, and inaccurate descriptions AI makes about your brand. Get alerted immediately so you can take action before misinformation spreads.",
              color: "#f5a623",
            },
            {
              icon: "\u2705",
              title: "Cross-Platform Verification",
              desc: "Cross-reference AI claims with real market data from Reddit, YouTube, TikTok, and Google Trends. Distinguish genuine signals from injected false information across the entire digital ecosystem.",
              color: "#22c55e",
            },
            {
              icon: "\uD83D\uDEE1\uFE0F",
              title: "AI Brand Safety Audit",
              desc: "Comprehensive assessment of your brand's information integrity in the AI ecosystem. Check for misinformation, competitor attacks, and AI hallucination risks threatening your brand reputation.",
              color: "#60a5fa",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl p-5 space-y-3"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div className="text-2xl">{feature.icon}</div>
              <div>
                <div className="font-semibold text-sm" style={{ color: feature.color }}>
                  {feature.title}
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* The 315 validates us */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">The 315 Expos&eacute; Validates What We&apos;ve Been Building</h2>
        <div
          className="rounded-xl p-6 space-y-4"
          style={{
            background: "rgba(255,107,53,0.04)",
            border: "1px solid rgba(255,107,53,0.25)",
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
            Honestly — when we first saw the 315 report, our reaction wasn&apos;t panic. It was{" "}
            <strong style={{ color: "#f0f0f8" }}>&ldquo;this is exactly what we&apos;ve been saying.&rdquo;</strong>
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
            From day one, Avanti has been building a{" "}
            <strong style={{ color: "#f0f0f8" }}>monitoring and defense</strong> system —
            not a manipulation system. Our hallucination detection feature was designed precisely to
            help brands discover false information about themselves in AI — whether that misinformation
            was &ldquo;hallucinated&rdquo; by AI on its own, or deliberately &ldquo;injected&rdquo; by bad actors.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
            Our cross-platform verification system automatically cross-references AI claims with
            real market data. When AI claims &ldquo;Brand X is the #1 best-seller in its category,&rdquo;
            we verify that claim against Reddit, TikTok, and Google Trends.{" "}
            <strong style={{ color: "#f0f0f8" }}>
              This is precisely the most effective weapon against AI data poisoning.
            </strong>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs" style={{ color: "#f0f0f8" }}>
          <span className="px-3 py-1.5 rounded-lg" style={{ background: "#1a1a2e" }}>
            AI Poisoning Rises
          </span>
          <span style={{ color: "#7070a0" }}>&rarr;</span>
          <span className="px-3 py-1.5 rounded-lg" style={{ background: "#1a1a2e" }}>
            Brands Need to Know What AI Says
          </span>
          <span style={{ color: "#7070a0" }}>&rarr;</span>
          <span
            className="px-3 py-1.5 rounded-lg font-medium"
            style={{ background: "rgba(255,107,53,0.15)", color: "#ff6b35" }}
          >
            Avanti&apos;s Value
          </span>
        </div>
      </div>

      {/* Our commitment */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Our Commitment</h2>
        <div className="space-y-3">
          {[
            {
              title: "Transparency",
              initial: "T",
              desc: "Our monitoring methods, data sources, and scoring logic are fully auditable. We don't operate black boxes.",
            },
            {
              title: "Authenticity",
              initial: "A",
              desc: "We only provide insights based on real data. Our optimization recommendations always point toward creating authentic, high-quality content — never fabricating information.",
            },
            {
              title: "Defense",
              initial: "D",
              desc: "We help brands detect and respond to misinformation threats in the AI ecosystem — whether those threats come from AI hallucinations or deliberate data poisoning.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-xl p-5"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm"
                style={{ background: "#ff6b35", color: "#fff" }}
              >
                {item.initial}
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-sm">
                  {item.title}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="rounded-xl p-8 text-center space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="font-semibold text-lg">Worried about what AI is saying about your brand?</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          Free AI Brand Safety Audit. See how ChatGPT, Claude, and Gemini currently describe your brand.
          Detect hallucinations and misinformation before they cause damage.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/runs/new"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            Free Brand Safety Audit &rarr;
          </Link>
          <a
            href="https://calendly.com/brivesubscription/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            Book a Demo
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center">
        <p className="text-xs leading-relaxed" style={{ color: "#505070" }}>
          Published by the Avanti team on March 15, 2026.
          We welcome industry discussion and media inquiries.
          Contact: team@avantia2a.com
        </p>
      </div>
    </div>
  );
}
