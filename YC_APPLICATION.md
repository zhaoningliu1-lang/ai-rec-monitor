# 阿凡提 (Avanti) — YC Application Draft (2026 Batch)

> Internal working document. Answers drafted for Y Combinator application.
> Fill in all `[PLACEHOLDER]` values before submitting.

---

## 1. Company Name and URL

**Company name:** Avanti（阿凡提）

**Chinese brand name:** 阿凡提 — 民间故事里永远比市场早一步的聪明商人

**URL:** https://avantia2a.com

**Tagline:** Know what AI recommends before your competitors stock it.

---

## 2. Describe What Your Company Does in 50 Characters or Less

```
AI product intelligence for cross-border sellers
```

*(49 characters)*

---

## 3. What Does Your Company Do?

阿凡提 (Avanti) is an AI-native product intelligence platform built for cross-border e-commerce sellers.

We solve two problems simultaneously:

**Problem 1 — Brand visibility in AI:** When a buyer asks ChatGPT or Claude "what's the best baby monitor under $80?", which brands get recommended? Sellers have no idea. Our GEO Monitor (Generative Engine Optimization) tracks brand and product appearances across ChatGPT, Claude, Gemini, and Perplexity — giving sellers a Share of Voice score and ARRS (AI Recommendation Rank Score) so they know where they stand and how to improve.

**Problem 2 — Product selection:** Cross-border sellers on Amazon FBA, TikTok Shop, and Shopee need to decide what to source 6–8 weeks before demand peaks. We aggregate what AI models are currently recommending to real buyers — by category, brand, and SKU — so sellers can see emerging demand signals before they show up in sales rank data.

Together, these are two sides of the same flywheel — not just two separate features.

**The growth flywheel:**

```
① Selection Intelligence
   AI is recommending X category → seller sources X product (6–8 weeks lead time)
        ↓
② Seller lists the product on Amazon / TikTok Shop / Shopee
        ↓
③ GEO Monitor
   Is AI recommending MY brand for X? What's my SOV vs competitors?
        ↓
④ GEO Optimization
   Seller publishes content, gets reviews, builds authority → AI cites their brand more
        ↓
⑤ Higher AI SOV → more buyer discovery → more sales → validated signal feeds back to ①
```

Every seller who uses Selection Intelligence to pick a winning product becomes a GEO Monitor customer to protect that position. Every GEO customer who improves their AI ranking validates which categories are hot — strengthening our Selection Intelligence data for all sellers.

This is not a feature bundle. It's a compound intelligence loop where each product makes the other more valuable.

---

## 4. Why Did You Pick This Idea to Work on?

I came at this from two directions that collided.

First: I spent time with cross-border sellers and watched them obsess over tools like Helium 10 and Jungle Scout — historical sales rank data, keyword volume, review counts. All backward-looking. The best sellers I talked to were already asking ChatGPT for product recommendations themselves and manually checking what came up. Nobody had automated this.

Second: I noticed that the GEO (Generative Engine Optimization) category was exploding for Western brands — tools like Relixir, Goodie, AirTraffic all raised money in 2024-2025. But every single one of them is built for Western brand managers optimizing for US buyers. None of them speak to a Chinese seller on 1688 trying to figure out which yoga mats to source for Amazon Europe next quarter.

The gap was obvious. The tools existed for the wrong customer. The right customer — cross-border e-commerce sellers — is an enormous, underserved market with a real willingness to pay for data.

I started building immediately. The insight felt time-sensitive: the window where being early in AI-search product intelligence matters is right now, not in two years.

---

## 5. What's New, Different, or Surprising About What You're Building?

Three things that surprised even me as I built this:

**1. Multi-language AI queries return completely different product recommendations.**

When you ask ChatGPT "推荐一款适合宝宝的婴儿监视器" (Chinese) versus "best baby monitor for newborns" (English), you get meaningfully different brand sets. This is not a translation artifact — it reflects different training data distributions. Western GEO tools query only in English. We query in Chinese, English, Bahasa Indonesia, and will expand to other languages. This means sellers targeting Southeast Asian buyers are flying blind with every tool on the market except ours.

**2. The supply chain signal works in reverse — and it's earlier than anything else.**

1688 and Alibaba search trends (Chinese domestic wholesale platforms) lead Amazon sales rank by 6–8 weeks because that's the manufacturing lead time. When we combine "AI is recommending X category" with "1688 hot searches for X are spiking," we have a compound signal that no competitor has even thought to build. Traditional e-commerce analytics tools don't have access to Chinese-language data. GEO tools don't care about sourcing. We sit at the intersection.

**3. AI recommendation volatility is much higher than anyone expects.**

In our initial data pulls, brand SOV in AI recommendations shifts meaningfully week-over-week — sometimes dramatically after a product launch, a viral review, or a model update. Sellers think of AI recommendations as static. They're not. This makes monitoring a recurring necessity, not a one-time lookup.

---

## 6. How Does Your Company Make Money?

**SaaS subscription, monthly and annual.**

Pricing tiers (draft):

| Plan | Price | For |
|---|---|---|
| Starter | $49/mo | 1 brand, 3 categories, weekly snapshots |
| Growth | $149/mo | 5 brands, 20 categories, daily monitoring |
| Pro | $399/mo | Unlimited brands, custom queries, API access, multi-language |
| Agency / Aggregator | Custom | Multi-seller management, white-label |

This pricing mirrors Helium 10 / Jungle Scout's model, which cross-border sellers already pay without hesitation. The top 20% of Amazon FBA sellers spend $300–$800/month on data tools. We are not asking them to add a budget line — we are asking them to shift spend toward the data source that matters in 2026.

Long-term, we see opportunity in a data marketplace: selling aggregated, anonymized category-level AI recommendation trends to brands (consumer goods companies, VCs doing category research, Amazon's own vendor analytics). But SaaS is the immediate model.

---

## 7. How Far Along Are You?

**Product status:** Live and functional. The core GEO Monitor backend is running in production on Railway. We can query ChatGPT, Claude, Gemini, and Perplexity for any product category, parse structured brand/SKU mentions, compute SOV and ARRS scores, and surface trends over time in a Next.js dashboard.

**Timeline:**
- Week 1 (started [PLACEHOLDER DATE]): Core architecture built — FastAPI backend, PostgreSQL, async AI query engine, Next.js frontend.
- Week 2 (current): First seller demo scheduled Friday. Onboarding flow being finalized.
- Week 3 target: First paying customer or LOI.

**Revenue:** Pre-revenue. First demo this week.

**Users:** [PLACEHOLDER — number of beta users / waitlist signups as of application date]

**Key milestone completed:** Multi-model query pipeline is working (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, Perplexity). Brand extraction, SOV calculation, and ARRS scoring are live. Dashboard deployed to Vercel (ai-rec-monitor.vercel.app).

Being honest: this is very early. The insight is clear, the product is functional, and the first real customer conversation is happening this week. We are not bullshitting about traction we don't have — we are applying because the timing of the idea and the speed of execution feels right for YC's model.

---

## 8. Who Are Your Competitors and How Are You Different?

**Direct GEO competitors (Western-focused):**

| Company | What they do | What they miss |
|---|---|---|
| Relixir | GEO monitoring for brands, content optimization | US/Western brands only, English queries only, no e-commerce seller angle |
| Goodie AI | GEO analytics dashboard | Same — brand managers, not sellers. No multi-language. No sourcing signal. |
| AirTraffic | AI search visibility tracking | Similar. Enterprise US brands. No cross-border e-commerce. |
| Profound | AI answer monitoring for enterprises | Enterprise SaaS, not SMB sellers, expensive, US-centric |

**Traditional e-commerce intelligence tools:**

| Company | What they do | What they miss |
|---|---|---|
| Helium 10 | Amazon keyword/sales rank tracking | Backward-looking (what's already selling). Zero AI query data. |
| Jungle Scout | Product research, sales estimates | Same — historical signals only. No AI layer. |
| DataHawk / Perpetua | Amazon analytics + advertising | Ad optimization, not product discovery intelligence. |
| Seller Sprite | Chinese-audience Amazon tool | Keyword-based, traditional search. No AI model tracking. |

**Our differentiation:**

1. **Vertical:** Built for cross-border sellers, not Western brand CMOs. Different pain, different UX, different pricing, different distribution (Chinese seller communities, 1688 ecosystems, Shopee/Lazada partner networks).

2. **Multi-language query engine:** The only tool querying AI models in Chinese, English, and Southeast Asian languages simultaneously. This is a structural data advantage.

3. **Selection intelligence, not just brand tracking:** "What should I source?" is a more urgent question for a cross-border seller than "How visible is my brand?" We answer both.

4. **Supply chain signal integration:** No GEO tool in the market has ever thought about 1688/Alibaba wholesale search trends. We do.

5. **Multi-platform scope:** We cover Amazon, TikTok Shop, and Shopee/Lazada query patterns — not just US Amazon.

The one-liner: **"Helium 10 tracks what's selling on Amazon. We track what AI is telling buyers to buy next."**

---

## 9. What's Your Biggest Advantage That Competitors Can't Copy Easily?

**Data network effect + language/cultural access.**

Here is why this is hard to replicate:

The most valuable part of our product is not the query engine — running AI queries is table stakes. The valuable part is the **normalized, historical, multi-language dataset of AI recommendations** that we are building week over week. Once we have 6 months of data showing how brand SOV shifts across models and languages for 500 product categories, that dataset becomes a durable asset. A new entrant starting today starts from zero on that data.

Second: our **distribution moat is cultural access.** Reaching Chinese cross-border sellers requires trust built through Chinese-language content, WeChat/小红书 presence, Pinduoduo/1688 ecosystem relationships, and an understanding of how these sellers think about tools (they share tools in private WeChat groups, they are price-sensitive but ROI-obsessed, they trust peer recommendations over cold outreach). A US SaaS startup cannot replicate this without years of effort. I have this natively.

Third: the **supply chain signal combination** (AI recommendations + 1688 search trends + manufacturing lead times) is a compound insight that requires simultaneous understanding of AI infrastructure and Chinese wholesale markets. No existing GEO tool has this roadmap. No existing e-commerce tool has built toward AI. We are at the intersection.

---

## 10. What's the Plan for the Next 6 Months?

**Month 1 (March 2026):**
- First 3–5 paying customers from Friday demo and warm network
- Instrument usage analytics — understand which features drive "aha moment"
- Weekly snapshots → daily monitoring for paid users
- Build WeChat mini-program or landing page for Chinese seller community distribution

**Month 2 (April 2026):**
- Target [PLACEHOLDER] MRR
- Launch in 2 Chinese seller communities (小红书 / 雨果网 / 跨境电商圈)
- Add TikTok Shop category coverage (separate query set for TikTok product discovery patterns)
- Interview 20 sellers systematically about selection workflow — validate/refine Selection Intelligence product

**Month 3 (May 2026):**
- Target [PLACEHOLDER] MRR
- Ship Selection Intelligence v1: category-level AI recommendation trending dashboard
- Begin 1688 hot search integration for supply chain signal layer
- First case study: seller who sourced a product based on Avanti signal, hit sales within [PLACEHOLDER] weeks

**Month 4–5 (June–July 2026):**
- Target [PLACEHOLDER] MRR (~30–50 paying customers)
- Southeast Asia expansion: Shopee/Lazada category coverage, Bahasa query engine live
- Test agency tier: 3P Amazon management agencies managing 10+ seller accounts
- Explore partnership with freight forwarder or sourcing agent (embedded Avanti signal in their workflow)

**Month 6 (August 2026):**
- Evaluate Series A readiness vs. YC Demo Day momentum
- Target [PLACEHOLDER] ARR run rate
- Clear evidence of retention: sellers renewing 2nd and 3rd month
- Begin building branded dashboard for 1688/Alibaba seller-side (supply side signal product)

---

## 11. Why You? Why Are You the Right Person to Build This?

I am building at the intersection of three things that rarely exist in one person:

**1. I understand cross-border e-commerce from the inside.**
I have spent time embedded with Chinese Amazon FBA sellers — not reading about them, but sitting in warehouses, joining seller WeChat groups, watching them make sourcing decisions at 2am based on spreadsheets and gut feel. I understand the exact pain of being 8 weeks away from a shipping decision with no forward-looking signal.

**2. I understand AI infrastructure.**
I built the backend of this product in a week — FastAPI, async query pipelines hitting multiple LLM APIs simultaneously, PostgreSQL with async SQLAlchemy, Docker, Railway deployment, Vercel frontend. I am not waiting for an engineer. I am the engineer.

**3. I understand why GEO matters before most of the market does.**
The insight that AI is replacing Google for product discovery is not obvious to most sellers yet. It will be obvious in 18 months. The window to build the category-defining tool is right now. I noticed this gap because I was watching both the GEO startup funding landscape (Western) and the cross-border seller tooling market (Chinese) simultaneously — and saw that nobody was connecting them.

**What I am missing:** Sales experience at scale, and a co-founder. I am actively looking for a co-founder with strong seller community distribution — either a former Amazon seller with a large network, or someone with B2B SaaS GTM experience in the Chinese tech ecosystem. [PLACEHOLDER — update if co-founder found before submission]

---

## 12. What's Your Monthly Revenue?

**$0 MRR as of application date.**

We are pre-revenue. First customer demo is this week. I am not trying to obscure this — we are genuinely in the "launched, seeking first paying customer" stage.

Context: the product is live and functional, not vaporware. But we have not yet converted a user to paid. That is the singular focus of the next 2 weeks.

[PLACEHOLDER — update with actual MRR if customer(s) close before YC submission deadline]

---

## 13. How Many Active Users / Customers?

**Customers:** 0 paying.

**Beta users / demo pipeline:** [PLACEHOLDER — number of sellers who have seen demo or signed up for waitlist]

**Engagement so far:**
- [PLACEHOLDER — number of demo calls scheduled/completed]
- [PLACEHOLDER — any LOIs, verbal commitments, or pilot agreements]
- Product has been used internally to run [PLACEHOLDER] category scans across [PLACEHOLDER] AI models

We will have clearer user numbers by the time we submit. Applying now because the momentum feels right to engage YC early and get feedback.

---

## 14. What's the Size of the Market Opportunity?

**Bottom-up TAM:**

- Estimated 10 million+ active cross-border e-commerce sellers globally (Amazon, TikTok Shop, Shopee, Lazada, independent DTC).
- Of these, approximately 3–5 million are Chinese sellers (the primary distribution target).
- The most relevant cohort: Amazon FBA sellers with $100K+ annual revenue — estimated 500,000–800,000 globally. These sellers already pay $99–$399/month for tools like Helium 10 and Jungle Scout.
- At $149/month average, capturing 1% of this cohort = ~$100M ARR.

**Adjacent market:**

- Brands (consumer goods companies) doing GEO monitoring: the Western GEO market alone is projected at $[PLACEHOLDER]B by 2028 (per Gartner/IDC estimates).
- Amazon agencies and aggregators (Thrasio model companies) managing 10–100 seller accounts — they pay 5–10x individual seller pricing for multi-account tools.
- Data licensing: category-level AI recommendation trends are valuable to CPG companies, VCs doing market research, and platform analytics teams.

**Market timing:**

The cross-border e-commerce market is $785B and growing at ~25% annually. More importantly, AI-assisted product discovery is not a future trend — it is happening now. ChatGPT has over 300M weekly active users. Perplexity processes 100M+ queries/month. Sellers who understand their AI visibility in 2026 will have a structural advantage over those who don't until 2028. We are selling into an urgent, current need, not a hypothetical future one.

**Realistic 3-year target:** $5–15M ARR from SMB seller subscriptions, with a path to $50M+ ARR if we expand to agency/aggregator tier and data licensing.

---

## 15. If You Had 2 Minutes with a YC Partner, What Would You Say?

---

Product discovery is moving from Google to AI. When someone asks ChatGPT "what's the best kitchen knife under $50?", a brand either shows up or it doesn't. There's no bidding, no keyword optimization — just whatever the model decides to say.

This is happening right now. And the 10 million cross-border sellers who supply most of the physical products on Amazon and TikTok Shop have no idea where they stand.

We built Avanti to fix that. Two products:

One — GEO Monitor. Track how often your brand appears when buyers ask AI about your category. We query ChatGPT, Claude, Gemini, and Perplexity in multiple languages (English, Chinese, Bahasa) because the answers are genuinely different in each language. We score you on Share of Voice and an AI Recommendation Rank Score. You get a dashboard, weekly trends, and alerts when you drop.

Two — Selection Intelligence. For sellers who haven't launched yet — which products is AI actively recommending to buyers? Which categories are getting more AI mentions week over week? We combine that with 1688 wholesale search trends (6–8 weeks ahead of Amazon demand) to give sellers a forward-looking sourcing signal that nothing else in the market provides.

Every existing GEO tool is built for Western brand managers. None of them speak Chinese. None of them care about sourcing. None of them cover Southeast Asia. We are the only tool built specifically for the cross-border seller.

We launched the product this week. First seller demo is Friday. We are pre-revenue, but the product is live and the timing feels critical — the window to define this category for this customer base is right now, not in two years.

The one thing I'd want you to take away: Helium 10 tells sellers what's already selling. We tell them what AI is recommending buyers buy next. That's a fundamentally different signal, and nobody else is building it for this market.

---

## Appendix: Key Metrics to Track Before Submission

Fill in these before submitting the application:

| Metric | Current Value | Target by Submission |
|---|---|---|
| MRR | $0 | $[X] |
| Paying customers | 0 | [X] |
| Beta / waitlist users | [X] | [X] |
| Demo calls completed | [X] | [X] |
| Categories tracked (in product) | [X] | [X] |
| AI query volume (lifetime) | [X] | [X] |
| Weeks since first line of code | 1 | [X] |

---

## Appendix: Positioning Notes

**For the application form — avoid these phrases:**
- "AI-powered" (too generic)
- "revolutionize" / "disrupt"
- "unique algorithm"
- "proprietary AI"

**Use instead:**
- "track" / "monitor" / "surface"
- "cross-border sellers" (specific customer)
- "AI recommendations" (concrete, specific technology)
- "Share of Voice" / "ARRS" (named metrics that feel real)
- Specific competitor names (shows market awareness)

**Tone calibration:**
YC values directness and honesty about stage. Don't inflate. Don't apologize for being early. Be matter-of-fact: "We launched last week. First demo Friday. Pre-revenue. Here's exactly why this is the right time and why I'm the right person."

---

## Appendix: Video Pitch Structure (1-minute YC video)

If required:

1. **0:00–0:15** — The moment: "When a buyer asks ChatGPT for a product recommendation, a brand either shows up or it doesn't. 10 million cross-border sellers have no idea where they stand."
2. **0:15–0:35** — The product: Show the dashboard. SOV number. ARRS score. Category trending graph.
3. **0:35–0:50** — The insight: "We're the only tool built for cross-border sellers, querying in Chinese and English and Bahasa — because the AI gives different answers in different languages."
4. **0:50–1:00** — The ask: "We launched this week. I'm [NAME], solo founder. Building fast. Looking for YC to help us go from first paying customer to market leader."

---

*Last updated: March 2026*
*Version: Draft 1.0 — for internal use, do not distribute*
