import Link from "next/link";

export const metadata = {
  title: "定价 — Avanti GEO 平台",
  description:
    "AI 可见度监控、选品情报与 GEO 优化的透明定价。专为跨境电商品牌打造。",
};

const TIERS = [
  {
    name: "入门版",
    nameEn: "Starter",
    price: 99,
    annual: 79,
    description: "适合独立卖家和正在摸底 AI 曝光度的小品牌。",
    cta: "免费开始 →",
    href: "/zh/signup",
    highlight: false,
    features: [
      "追踪 1 个品牌",
      "月度 GEO 报告",
      "4 大 AI 引擎（ChatGPT、Claude、Gemini、Perplexity）",
      "ARRS 评分 + SOV 拆解",
      "选品情报：仅限 Top 3 品类（只读）",
      "邮件推送",
    ],
    notIncluded: ["完整选品情报", "PDF 导出", "API 接入"],
  },
  {
    name: "成长版",
    nameEn: "Growth",
    price: 249,
    annual: 199,
    description: "适合在 AI 可见度上认真竞争的成长型品牌——最受欢迎的方案。",
    cta: "免费开始 →",
    href: "/zh/signup",
    highlight: true,
    badge: "最受欢迎",
    features: [
      "追踪 3 个品牌",
      "双周 GEO 报告",
      "4 大 AI 引擎",
      "ARRS + SOV + 竞品对标",
      "完整选品情报（全品类 + 筛选器）",
      "成本优化计算器",
      "PDF 导出",
      "优先邮件支持",
    ],
    notIncluded: ["API 接入", "定制品类追踪"],
  },
  {
    name: "规模版",
    nameEn: "Scale",
    price: 499,
    annual: 499,
    description: "适合代理机构和管理多品牌的跨境电商运营团队。",
    cta: "联系我们 →",
    href: "https://calendly.com/brivesubscription/30min",
    highlight: false,
    features: [
      "追踪 10 个品牌",
      "每周 GEO 报告",
      "4 大 AI 引擎 + 自定义查询集",
      "完整选品情报",
      "定制品类 & 关键词追踪",
      "API 接入",
      "PDF + CSV 导出",
      "季度 1v1 策略通话",
      "Slack 集成",
      "专属 Onboarding",
    ],
    notIncluded: [],
  },
];

const COMPARISON = [
  { feature: "追踪品牌数量",       starter: "1",     growth: "3",     scale: "10" },
  { feature: "报告频率",            starter: "月度",  growth: "双周",  scale: "每周" },
  { feature: "AI 引擎覆盖",        starter: "4",     growth: "4",     scale: "4 + 定制" },
  { feature: "ARRS 评分",          starter: true,    growth: true,    scale: true },
  { feature: "SOV 拆解",           starter: true,    growth: true,    scale: true },
  { feature: "竞品对标",           starter: false,   growth: true,    scale: true },
  { feature: "完整选品情报",       starter: false,   growth: true,    scale: true },
  { feature: "成本优化计算器",     starter: false,   growth: true,    scale: true },
  { feature: "PDF 导出",           starter: false,   growth: true,    scale: true },
  { feature: "API 接入",           starter: false,   growth: false,   scale: true },
  { feature: "定制品类追踪",       starter: false,   growth: false,   scale: true },
  { feature: "策略通话",           starter: false,   growth: false,   scale: "季度" },
];

function Check() {
  return <span style={{ color: "#22c55e" }}>✓</span>;
}
function Cross() {
  return <span style={{ color: "#3a3a5c" }}>—</span>;
}

export default function ZhPricingPage() {
  return (
    <div className="py-16 space-y-20 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div
          className="inline-block text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
        >
          定价方案
        </div>
        <h1 className="text-4xl font-bold">简单透明，按需选择</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          专为认真做 AI 可见度的跨境品牌打造。
          所有方案均含 14 天免费试用，无需信用卡。
        </p>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="rounded-2xl p-6 space-y-6 flex flex-col"
            style={{
              background: tier.highlight ? "rgba(255,107,53,0.06)" : "#0f0f17",
              border: tier.highlight ? "2px solid #ff6b35" : "1px solid #25253f",
              position: "relative",
            }}
          >
            {tier.badge && (
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: "#ff6b35", color: "#fff" }}
              >
                {tier.badge}
              </div>
            )}

            <div className="space-y-1">
              <div className="font-bold text-lg">{tier.name}</div>
              <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
                {tier.description}
              </p>
            </div>

            <div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black">${tier.annual}</span>
                <span className="text-sm pb-1" style={{ color: "#7070a0" }}>/月</span>
              </div>
              {tier.annual !== tier.price && (
                <div className="text-xs mt-1" style={{ color: "#7070a0" }}>
                  月付 ${tier.price} · 年付节省 ${(tier.price - tier.annual) * 12}
                </div>
              )}
              {tier.annual === tier.price && tier.name !== "规模版" && (
                <div className="text-xs mt-1" style={{ color: "#7070a0" }}>按月计费</div>
              )}
              {tier.name === "规模版" && (
                <div className="text-xs mt-1" style={{ color: "#7070a0" }}>联系我们获取批量定价</div>
              )}
            </div>

            <Link
              href={tier.href}
              target={tier.href.startsWith("http") ? "_blank" : undefined}
              rel={tier.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="block text-center text-sm font-semibold px-4 py-2.5 rounded-lg transition-opacity hover:opacity-80"
              style={
                tier.highlight
                  ? { background: "#ff6b35", color: "#fff" }
                  : { border: "1px solid #25253f", color: "#f0f0f8" }
              }
            >
              {tier.cta}
            </Link>

            <div className="space-y-2 flex-1">
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7070a0" }}>
                包含功能
              </div>
              <ul className="space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "#f0f0f8" }}>
                    <span style={{ color: "#22c55e", flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
                {tier.notIncluded.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "#3a3a5c" }}>
                    <span style={{ flexShrink: 0 }}>—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Free tool callout */}
      <div
        className="rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <div>
          <div className="font-semibold text-sm">成本优化计算器 — 永久免费</div>
          <p className="text-xs mt-1" style={{ color: "#7070a0" }}>
            计算 AI 能为你省下多少运营成本，以及这笔钱能支持几个月的 GEO 监控。无需注册。
          </p>
        </div>
        <Link
          href="/zh/optimizer"
          className="shrink-0 text-sm font-medium px-5 py-2 rounded-lg transition-colors hover:text-white"
          style={{ border: "1px solid #25253f", color: "#7070a0" }}
        >
          立即计算 →
        </Link>
      </div>

      {/* Comparison table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-center">功能对比</h2>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <th className="text-left p-4 font-medium" style={{ color: "#7070a0" }}>功能</th>
                <th className="text-center p-4 font-medium">入门版</th>
                <th className="text-center p-4 font-bold" style={{ color: "#ff6b35" }}>成长版</th>
                <th className="text-center p-4 font-medium">规模版</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr
                  key={row.feature}
                  style={{
                    background: i % 2 === 0 ? "#0a0a10" : "#0f0f17",
                    borderBottom: "1px solid #25253f",
                  }}
                >
                  <td className="p-4 text-xs" style={{ color: "#f0f0f8" }}>{row.feature}</td>
                  <td className="p-4 text-center text-xs">
                    {typeof row.starter === "boolean"
                      ? row.starter ? <Check /> : <Cross />
                      : <span style={{ color: "#f0f0f8" }}>{row.starter}</span>}
                  </td>
                  <td className="p-4 text-center text-xs">
                    {typeof row.growth === "boolean"
                      ? row.growth ? <Check /> : <Cross />
                      : <span style={{ color: "#f0f0f8" }}>{row.growth}</span>}
                  </td>
                  <td className="p-4 text-center text-xs">
                    {typeof row.scale === "boolean"
                      ? row.scale ? <Check /> : <Cross />
                      : <span style={{ color: "#f0f0f8" }}>{row.scale}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-center">常见问题</h2>
        {[
          {
            q: "「品牌」是怎么计算的？",
            a: "一个品牌 = 我们在 AI 引擎中追踪的一个实体。如果你有多个品牌（主品牌 + 子品牌），每个单独计算。",
          },
          {
            q: "你们追踪哪 4 个 AI 引擎？",
            a: "ChatGPT（GPT-4o）、Claude、Gemini 和 Perplexity——目前最主动影响买家决策的四大引擎。跨境卖家可选中英文双语查询。",
          },
          {
            q: "可以随时取消吗？",
            a: "可以。无长期合同。在账户设置中取消，当前计费周期结束后生效。",
          },
          {
            q: "我是代理机构，管理 20+ 个品牌，有批量方案吗？",
            a: "有。通过规模版方案联系我们，或预约策略通话——我们为代理机构提供定制批量定价。",
          },
          {
            q: "Avanti 和 Helium 10、Jungle Scout 有什么区别？",
            a: "Helium 10 和 Jungle Scout 追踪亚马逊平台上的历史销售数据、BSR 和关键词。Avanti 追踪 AI 模型正在把未来买家引向哪里——这是关于需求走向的信号，不是需求历史。",
          },
        ].map(({ q, a }) => (
          <div key={q} className="space-y-2">
            <div className="font-semibold text-sm">{q}</div>
            <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{a}</p>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        className="rounded-2xl p-10 text-center space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="text-2xl font-bold">先看数据，再决定是否付费</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          先跑一次免费诊断，看清你的 ARRS 评分和 SOV——无需注册，无需信用卡。
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/zh/signup"
            className="text-sm font-semibold px-6 py-3 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            免费开始 →
          </Link>
          <a
            href="https://calendly.com/brivesubscription/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium px-6 py-3 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            预约演示
          </a>
        </div>
      </div>
    </div>
  );
}
