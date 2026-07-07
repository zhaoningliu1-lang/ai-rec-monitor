import Link from "next/link";

export const metadata = {
  title: "From TikTok to Amazon to YouTube: How Chinese Brands Conquer the American Living Room | Avanti",
  description:
    "A deep analysis of omnichannel strategy, brand localization, and trust-building for Chinese cross-border brands entering the US market.",
};

/* ── shared styles ─────────────────────────────────────────────────────────── */
const card = {
  background: "#12121e",
  border: "1px solid #25253f",
  borderRadius: 12,
  padding: "24px 28px",
} as const;

const accent = { color: "#ff6b35" } as const;
const muted = { color: "#7070a0" } as const;
const body = { color: "#c0c0d8", fontSize: 15, lineHeight: 1.8 } as const;
const h2Style = { fontSize: 22, fontWeight: 800, color: "#f0f0f8", marginBottom: 12 } as const;
const h3Style = { fontSize: 17, fontWeight: 700, color: "#f0f0f8", marginBottom: 8 } as const;

function Callout({ children, color = "#ff6b35" }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: `${color}08`, border: `1px solid ${color}30` }}
    >
      {children}
    </div>
  );
}

function StatCard({ num, label }: { num: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 36, fontWeight: 900, color: "#f0f0f8" }}>{num}</div>
      <div style={{ fontSize: 13, color: "#7070a0", marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function ChineseBrandsUSLivingRoomPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            Cross-Border Strategy
          </span>
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}
          >
            Guest Post
          </span>
          <span className="text-xs" style={muted}>March 2026 &middot; 12 min read</span>
        </div>
        <p className="text-sm" style={accent}>
          From TikTok to Amazon to YouTube
        </p>
        <h1 className="text-3xl font-bold leading-tight" style={{ color: "#f0f0f8" }}>
          How Chinese Brands Conquer the American Living Room
        </h1>
        <p className="text-base leading-relaxed" style={muted}>
          A deep analysis of omnichannel strategy, brand localization, and trust-building.
          <br />
          Based on a presentation by <strong style={{ color: "#c0c0d8" }}>Elaine Lai Wright</strong> &mdash; Multicultural Marketing Executive &amp; Brand Architect.
        </p>
      </div>

      {/* ── Section 1: Purchase Journey ─────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>The American Consumer Purchase Journey</h2>
        <p style={body}>
          American consumers don&apos;t follow a linear purchase path. Instead, they shuttle back and forth
          between social media, search engines, ecommerce platforms, and offline experiences in a
          non-linear, multi-touchpoint journey.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 py-4">
          {[
            { stage: "Awareness", sub: "Social discovery & exposure" },
            { stage: "Consideration", sub: "Comparison & research" },
            { stage: "First Impression", sub: "Brand trust & evidence" },
            { stage: "Decision", sub: "Checkout & purchase" },
            { stage: "Post-Sale", sub: "Fulfillment & service" },
          ].map((s, i) => (
            <div key={s.stage} className="flex items-center gap-3">
              <div
                className="text-center px-4 py-3 rounded-xl"
                style={{ ...card, minWidth: 110 }}
              >
                <div className="text-xs font-bold" style={accent}>{s.stage}</div>
                <div className="text-[10px] mt-1" style={muted}>{s.sub}</div>
              </div>
              {i < 4 && <span style={muted}>&rarr;</span>}
            </div>
          ))}
        </div>

        <Callout>
          <p className="text-sm font-semibold" style={accent}>Key Insight</p>
          <p className="text-sm mt-1" style={muted}>
            Understanding the psychological needs at each touchpoint is the starting point
            for Chinese cross-border brands to win in the US market.
          </p>
        </Callout>
      </div>

      {/* ── Section 2: 13 Decision Nodes ───────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>Crossing the Trust Gap: 13 Key Decision Nodes</h2>
        <p style={body}>
          The American consumer purchase journey spans from awareness, to comparison shortlisting,
          first impression, trust-building, final purchase, and post-sale experience &mdash; 13 critical
          pillars in total. Chinese brands must address each granular pain point with precision:
        </p>

        <div className="space-y-4">
          {[
            {
              title: "Eliminate Initial Bias",
              desc: "Plant \"trust evidence\" across all channels &mdash; editorial reviews, certifications, and social proof that overcome country-of-origin skepticism.",
            },
            {
              title: "Value-Driven, Not Just Price-Driven",
              desc: "Leverage authentic KOL reviews, user-generated content (UGC), and local media coverage to shift the narrative from \"cheap\" to \"innovative.\"",
            },
            {
              title: "Deep Cultural & Localization Fit",
              desc: "From page language, product packaging, to instruction manuals &mdash; deeply match American consumer habits and aesthetics.",
            },
          ].map((item) => (
            <div key={item.title} style={card}>
              <h3 style={{ ...h3Style, ...accent }}>{item.title}</h3>
              <p className="text-sm" style={muted}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: User Persona ────────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>Precision User Insight: The Outdoor Sports Consumer</h2>
        <p style={body}>
          Understanding your target consumer at a granular level is essential. Here&apos;s a representative
          persona for the outdoor sports equipment category:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div style={card}>
            <h3 style={h3Style}>Demographics</h3>
            <ul className="space-y-2 text-sm" style={muted}>
              <li><strong style={{ color: "#c0c0d8" }}>Age:</strong> 25&ndash;45, predominantly male (~65%)</li>
              <li><strong style={{ color: "#c0c0d8" }}>Income:</strong> $75,000&ndash;$150,000 household</li>
              <li><strong style={{ color: "#c0c0d8" }}>Location:</strong> West Coast (CA, CO), Pacific Northwest</li>
              <li><strong style={{ color: "#c0c0d8" }}>Education:</strong> Bachelor&apos;s degree or higher (70%+)</li>
            </ul>
          </div>
          <div style={card}>
            <h3 style={h3Style}>Purchase Behavior</h3>
            <ul className="space-y-2 text-sm" style={muted}>
              <li>Values performance specs &amp; authentic user reviews; open to brand origin</li>
              <li>YouTube deep-dives &amp; Reddit discussions are core decision sources</li>
              <li>Prefers brands with sustainable manufacturing ethos</li>
              <li>Heavily relies on KOL &amp; outdoor community endorsements</li>
              <li>Peaks around Prime Day, Black Friday, spring season</li>
            </ul>
          </div>
        </div>

        <Callout color="#22c55e">
          <p className="text-sm" style={{ color: "#22c55e" }}>
            <strong>Strategy for outdoor brands:</strong> Position on &ldquo;high performance-to-price ratio + professional specs&rdquo; as core differentiation.
            Build brand credibility through sponsoring local outdoor events and partnering with vertical KOLs &mdash; bypassing pure price wars.
          </p>
        </Callout>
      </div>

      {/* ── Section 4: Multichannel vs Omnichannel ─────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>Multi-Channel, Multi-Touchpoint, Low-Friction Shopping</h2>
        <p style={body}>
          Without brand power, a product can only compete on price in Amazon&apos;s bloodbath. Today,
          American consumers have unprecedented choice, and the boundary between online and offline
          touchpoints has completely blurred.
        </p>

        <Callout>
          <p className="text-sm font-bold" style={accent}>Multichannel ≠ Omnichannel</p>
          <p className="text-sm mt-2" style={muted}>
            The difference between &ldquo;opening a few accounts across channels&rdquo; and &ldquo;unifying the brand
            experience across channels&rdquo; is the difference between a fragmented presence and true
            brand recognition.
          </p>
          <p className="text-sm mt-2" style={muted}>
            <strong style={{ color: "#c0c0d8" }}>Omnichannel</strong> places the consumer at the center,
            ensuring that all touchpoints &mdash; brand website, Amazon, social media, and offline &mdash; maintain
            consistent visual identity, tone, and brand narrative for a seamless experience.
          </p>
        </Callout>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: "🌐", label: "Brand DTC Site" },
            { icon: "📦", label: "Amazon & Marketplaces" },
            { icon: "📱", label: "YouTube / TikTok / IG" },
            { icon: "📍", label: "Offline & Pop-ups" },
          ].map((ch) => (
            <div key={ch.label} style={card} className="text-center">
              <div className="text-2xl mb-2">{ch.icon}</div>
              <div className="text-xs font-medium" style={{ color: "#c0c0d8" }}>{ch.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 5: Media Triangle ──────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>US Media Platform Taxonomy: Paid, Owned &amp; Earned</h2>
        <p style={body}>
          The three types of media work in concert, covering the complete purchase journey from
          awareness to repurchase.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Paid Media",
              subtitle: "Fast reach, precision targeting",
              items: "All paid channels & platforms",
              impact: "Awareness → Consideration",
              color: "#ff6b35",
            },
            {
              title: "Owned Media",
              subtitle: "Long-term assets, brand sovereignty",
              items: "Brand website + social accounts",
              impact: "First Impression → Decision → Repurchase",
              color: "#60a5fa",
            },
            {
              title: "Earned Media",
              subtitle: "Trust endorsement, word-of-mouth",
              items: "YouTube KOL reviews, Reddit discussions, UGC, media coverage",
              impact: "Consideration → Trust → Advocacy",
              color: "#22c55e",
            },
          ].map((m) => (
            <div key={m.title} style={card}>
              <h3 style={{ ...h3Style, color: m.color }}>{m.title}</h3>
              <p className="text-xs italic mb-2" style={{ color: m.color }}>{m.subtitle}</p>
              <p className="text-xs mb-3" style={muted}>{m.items}</p>
              <p className="text-xs font-bold" style={{ color: "#c0c0d8" }}>Impact: {m.impact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 6: Flywheel ────────────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>The Flywheel Engine: Data-Centric Marketing Network</h2>
        <p style={body}>
          A successful US market entry isn&apos;t about one-time campaigns &mdash; it&apos;s about building a
          self-reinforcing flywheel powered by data:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { step: "Precision Acquisition", desc: "Paid ads + content seeding to reach target audience" },
            { step: "First Conversion", desc: "Seamless checkout, diverse payment options to boost CVR" },
            { step: "UGC Co-Creation", desc: "Encourage authentic reviews & content, turning users into brand ambassadors" },
            { step: "Repurchase Growth", desc: "Email marketing & loyalty programs to extend CLV and reduce CAC" },
          ].map((s) => (
            <div key={s.step} style={card}>
              <h4 className="text-xs font-bold mb-2" style={accent}>{s.step}</h4>
              <p className="text-xs" style={muted}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div style={card}>
            <h3 style={h3Style}>Cross-Channel Attribution</h3>
            <p className="text-sm" style={muted}>
              Analyze touchpoint data to understand the complete conversion funnel. Use attribution
              models to ensure every marketing dollar is spent on what works.
            </p>
          </div>
          <div style={card}>
            <h3 style={h3Style}>Exponential Word-of-Mouth</h3>
            <ul className="text-sm space-y-1" style={muted}>
              <li>&bull; Targeted email campaigns</li>
              <li>&bull; Loyalty &amp; points programs for UGC</li>
              <li>&bull; Turn consumers into brand co-creators &amp; advocates</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Section 7: Dual-Track Model ────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>Top-Level Strategy: Breaking the &ldquo;Three Nothings&rdquo;</h2>
        <p style={body}>
          Many Chinese companies going overseas face the classic trap: <strong style={{ color: "#f0f0f8" }}>&ldquo;supply chain
          but no brand power&rdquo;</strong> &mdash; 100% dependent on Amazon, margins compressed, no user data ownership.
          Amazon is fundamentally a price-comparison engine; the customers belong to Amazon, not your brand.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Amazon: Volume",
              desc: "Sell standard products and high-velocity SKUs. Maintain price competitiveness, cover broad traffic entry points, and quickly build reviews & sales foundation.",
            },
            {
              title: "DTC Website: Margin",
              desc: "Carry differentiated, high-margin products with complete brand storytelling. Own core customer data (email lists, purchase behavior, repurchase paths).",
            },
            {
              title: "Omnichannel Consistency",
              desc: "Establish brand identity, visual elements, and product presentation in main channels first, then expand to others ensuring seamless experience at every touchpoint.",
            },
          ].map((t) => (
            <div key={t.title} style={card}>
              <h3 style={h3Style}>{t.title}</h3>
              <p className="text-xs" style={muted}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 8: Four Battlefields ────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>Four Experience Battlefields: Unified Commerce</h2>
        <p style={body}>
          According to the 2025 US retail benchmark report, leading brands are reshaping the
          American shopping experience through four &ldquo;unified commercial battlefields&rdquo;:
        </p>

        {[
          {
            num: "1",
            title: "Shopping: Borderless Discovery",
            desc: "Gen Z uses social media as their primary search engine. Deploy YouTube story-format videos, Instagram lifestyle content, positioning products into American life scenarios like \"weekend parties,\" \"campus commute,\" and \"van-life camping.\"",
          },
          {
            num: "2",
            title: "Checkout: Smart Transaction Hub",
            desc: "Transform the shopping cart into a dynamic customer engagement hub. Offer credit cards, digital wallets, BNPL, and other integrated payment options that not only boost conversion rate but also increase average order value by 15%.",
          },
          {
            num: "3",
            title: "Fulfillment: Transparency-Driven Trust",
            desc: "Provide real-time, proactive order tracking updates. \"Where's my order?\" inquiries drop by 50% with transparent delivery networks.",
          },
          {
            num: "4",
            title: "Service: Omni-Connected Customer Experience",
            desc: "Integrate digital, social media, and phone support. Smooth returns, shipping policies, FAQ, and responsive service are core factors in American consumers' repurchase decisions and word-of-mouth.",
          },
        ].map((bf) => (
          <div key={bf.num} style={card} className="flex gap-4">
            <div
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
              style={{ background: "#ff6b3520", color: "#ff6b35" }}
            >
              {bf.num}
            </div>
            <div>
              <h3 style={{ ...h3Style, ...accent }}>{bf.title}</h3>
              <p className="text-sm" style={muted}>{bf.desc}</p>
            </div>
          </div>
        ))}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 py-6">
          <StatCard num="13" label="Key Decision Nodes" />
          <StatCard num="50%" label="Fewer Service Inquiries" />
          <StatCard num="15%" label="Higher AOV" />
        </div>

        <Callout>
          <p className="text-sm font-bold" style={{ color: "#c0c0d8" }}>
            Going global isn&apos;t about moving products to America &mdash;
            it&apos;s about planting your brand in American consumers&apos; hearts.
          </p>
          <p className="text-xs mt-2" style={muted}>
            Unified commerce requires breaking down walls between brand, marketing, customer service,
            and product departments &mdash; centering on users, driven by data, building a three-dimensional
            trust ecosystem.
          </p>
        </Callout>
      </div>

      {/* ── Section 9: Promotional Calendar ────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>US Ecommerce Promotional Calendar</h2>
        <p style={body}>
          Mastering the core US promotional calendar is the foundation for planning your
          marketing budget and inventory strategy:
        </p>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2" style={{ minWidth: 700 }}>
            {[
              { month: "Jan", event: "New Year, Clearance" },
              { month: "Feb", event: "Valentine's Day" },
              { month: "Mar", event: "Spring Launch" },
              { month: "Apr", event: "Easter" },
              { month: "May", event: "Mother's Day, Memorial Day" },
              { month: "Jun", event: "Father's Day, Pride" },
              { month: "Jul", event: "Prime Day, July 4th" },
              { month: "Aug", event: "Back to School" },
              { month: "Sep", event: "Labor Day" },
              { month: "Oct", event: "Halloween, Pre-holiday" },
              { month: "Nov", event: "Black Friday, Cyber Monday" },
              { month: "Dec", event: "Christmas, Year-end" },
            ].map((m) => (
              <div key={m.month} style={{ ...card, padding: "10px 6px", textAlign: "center" as const }}>
                <div className="text-xs font-bold" style={accent}>{m.month}</div>
                <div className="text-[9px] mt-1 leading-tight" style={muted}>{m.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 10: Generational Values ────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>Generational Consumer Values &amp; Purchase Drivers</h2>
        <p style={body}>
          The US market spans multiple consumer generations, each with distinct values, media habits,
          and purchase drivers. Identifying your target generation is essential for product positioning
          and content strategy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              gen: "Baby Boomers",
              years: "1946-1964",
              age: "61-79",
              traits: "Value quality, durability & brand heritage. Prefer TV ads, email marketing, and in-store retail. Low price sensitivity, high loyalty, long decision cycles.",
            },
            {
              gen: "Gen X",
              years: "1965-1980",
              age: "45-60",
              traits: "Focus on value-for-money & practical features. Active on Facebook and email. Trust expert reviews & friend recommendations. Core household decision-makers.",
            },
            {
              gen: "Millennials",
              years: "1981-1996",
              age: "29-44",
              traits: "Seek brand values & sustainability. Active on Instagram and YouTube. Rely on KOL reviews & community word-of-mouth. Willing to pay premium for brands with stories.",
            },
            {
              gen: "Gen Z",
              years: "1997-2012",
              age: "13-28",
              traits: "TikTok as primary search engine. Value authenticity, personalization & social responsibility. Highest BNPL adoption. Fast decisions but loyalty requires continuous effort.",
            },
          ].map((g) => (
            <div key={g.gen} style={card}>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 style={{ ...h3Style, margin: 0, ...accent }}>{g.gen}</h3>
                <span className="text-xs" style={muted}>({g.years}) {g.age} yrs</span>
              </div>
              <p className="text-xs" style={muted}>{g.traits}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 11: Social Platform Map ────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>US Social Media Platform Overview</h2>
        <p style={body}>
          Brands can strategically select their core platforms based on target generation and product
          characteristics for deep engagement:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              name: "TikTok",
              audience: "Gen Z / Millennials",
              format: "Short video, livestream commerce, viral seeding",
              biz: "TikTok Shop, livestream selling",
            },
            {
              name: "Instagram",
              audience: "Millennials / Gen Z",
              format: "Photos, Reels, Stories, lifestyle aesthetics & KOL collabs",
              biz: "Shopping tags, ads",
            },
            {
              name: "YouTube",
              audience: "All ages",
              format: "Long-form video & Shorts, deep reviews & brand education",
              biz: "Pre-roll ads, creator partnerships",
            },
            {
              name: "Facebook",
              audience: "Gen X / Boomers",
              format: "Text, video, groups, community management & retargeting",
              biz: "Facebook Ads, Marketplace",
            },
            {
              name: "Pinterest",
              audience: "Women / Millennials",
              format: "Images & creative boards: home, beauty, lifestyle",
              biz: "Shopping ads, creative Pins",
            },
            {
              name: "Reddit",
              audience: "Millennials / Gen X, male-skewed, high-income",
              format: "Deep discussions, product reviews, Q&A, high-trust anonymous feedback",
              biz: "Reddit Ads, brand engagement, vertical subreddit presence",
            },
          ].map((p) => (
            <div key={p.name} style={card}>
              <h3 style={{ ...h3Style, color: "#ff6b35" }}>{p.name}</h3>
              <p className="text-[10px] font-medium mb-2" style={{ color: "#60a5fa" }}>{p.audience}</p>
              <p className="text-xs mb-2" style={muted}>{p.format}</p>
              <p className="text-[10px]" style={{ color: "#52526e" }}>Monetization: {p.biz}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 12: Conclusion ─────────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>The Real Challenge</h2>

        <div
          className="rounded-2xl p-8 text-center space-y-4"
          style={{ background: "linear-gradient(135deg, #1a0e06 0%, #12121e 100%)", border: "1px solid #ff6b3530" }}
        >
          <p className="text-2xl font-black" style={{ color: "#f0f0f8" }}>
            Not <span style={accent}>going out</span>,
          </p>
          <p className="text-2xl font-black" style={{ color: "#f0f0f8" }}>
            but <span style={accent}>integrating in</span>.
          </p>
          <div className="pt-4" style={{ borderTop: "1px solid #25253f" }}>
            <p className="text-sm" style={muted}>
              Going global is not a one-time campaign &mdash; it&apos;s a sustained war.
              <br />
              Brand localization is the most critical strategic investment in this battle.
            </p>
          </div>
        </div>
      </div>

      {/* ── Attribution ────────────────────────────────────────────────────── */}
      <div style={{ ...card, background: "#0f0f17" }}>
        <p className="text-xs" style={muted}>
          <strong style={{ color: "#c0c0d8" }}>About the author:</strong> This article is adapted from a presentation
          by Elaine Lai Wright, a multicultural marketing executive and brand architect specializing in
          helping Chinese brands build authentic presence in the US market. Follow her on WeChat:
          &ldquo;Elaine谈品牌出海&rdquo;.
        </p>
        <p className="text-xs mt-3" style={muted}>
          <strong style={{ color: "#c0c0d8" }}>Avanti&apos;s role:</strong> Avanti helps cross-border brands measure
          and optimize their AI visibility &mdash; the newest and fastest-growing discovery channel for
          American consumers. <Link href="/audit" style={accent}>Run a free AI brand audit &rarr;</Link>
        </p>
      </div>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <div className="text-center space-y-3 pt-4">
        <p className="text-sm" style={muted}>
          Want to see how AI assistants recommend brands in your category?
        </p>
        <Link
          href="/audit"
          className="inline-block text-sm font-bold px-6 py-3 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          Run Free AI Audit &rarr;
        </Link>
      </div>

      {/* Back */}
      <div>
        <Link href="/blog" className="text-xs hover:text-white transition-colors" style={muted}>
          &larr; Back to Research
        </Link>
      </div>
    </div>
  );
}
