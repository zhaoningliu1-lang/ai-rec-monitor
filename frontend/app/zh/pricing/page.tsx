import Link from "next/link";

export const metadata = {
  title: "定价 — 阿凡提 GEO 平台",
  description:
    "AI 可见度监控、选品情报与 GEO 优化的透明定价。专为亚马逊卖家、TikTok Shop 品牌、DTC 独立站、跨境代理机构及 Shopee/Lazada 卖家打造。",
};

const CALENDLY = "https://calendly.com/brivesubscription/30min";

const TIERS = [
  {
    name: "入门版",
    nameEn: "Starter",
    price: 99,
    annual: 79,
    description: "适合独立卖家摸底 AI 曝光度。亚马逊 FBA、TikTok Shop 或 DTC 品牌均适用。",
    cta: "免费开始 →",
    href: "/zh/signup",
    highlight: false,
    badge: null as string | null,
    features: [
      "追踪 1 个品牌",
      "月度 GEO 报告",
      "4 大 AI 引擎（ChatGPT、Claude、Gemini、Perplexity）",
      "GEO 评分 + SOV 拆解",
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
      "GEO 评分 + SOV + 竞品对标",
      "完整选品情报（全品类 + 筛选器）",
      "成本优化计算器",
      "PDF 导出",
      "优先邮件支持",
    ],
    notIncluded: ["API 接入", "定制品类追踪"],
  },
  {
    name: "代理版",
    nameEn: "Agency",
    price: 999,
    annual: 799,
    description: "适合代理机构和服务商，管理多个客户品牌，支持白标报告和分账户。",
    cta: "免费开始 →",
    href: "/zh/signup",
    highlight: false,
    badge: null as string | null,
    features: [
      "追踪 20 个品牌",
      "每周 GEO 报告",
      "4 大 AI 引擎 + 自定义查询集",
      "完整选品情报",
      "白标 PDF 报告",
      "客户独立看板",
      "API 接入",
      "定制品类 & 关键词追踪",
      "转售 / 子账户管理",
      "优先 Slack 支持",
    ],
    notIncluded: [],
  },
  {
    name: "企业版",
    nameEn: "Enterprise",
    price: 0,
    annual: 0,
    description: "不限品牌数量，自定义 AI 引擎覆盖，专属策略师，适合大型运营团队。",
    cta: "预约通话 →",
    href: CALENDLY,
    highlight: false,
    badge: null as string | null,
    features: [
      "不限品牌数量",
      "自定义报告频率",
      "自定义 AI 引擎 + 语言覆盖",
      "白标 + API 接入",
      "专属 GEO 策略师",
      "SLA + 企业级安全",
    ],
    notIncluded: [],
  },
];

const COMPARISON = [
  { feature: "追踪品牌数量",       starter: "1",     growth: "3",     agency: "20",         enterprise: "不限" },
  { feature: "报告频率",            starter: "月度",  growth: "双周",  agency: "每周",        enterprise: "自定义" },
  { feature: "AI 引擎覆盖",        starter: "4",     growth: "4",     agency: "4 + 定制",    enterprise: "自定义" },
  { feature: "GEO 评分",           starter: true,    growth: true,    agency: true,          enterprise: true },
  { feature: "SOV 拆解",           starter: true,    growth: true,    agency: true,          enterprise: true },
  { feature: "竞品对标",           starter: false,   growth: true,    agency: true,          enterprise: true },
  { feature: "完整选品情报",       starter: false,   growth: true,    agency: true,          enterprise: true },
  { feature: "成本优化计算器",     starter: false,   growth: true,    agency: true,          enterprise: true },
  { feature: "PDF 导出",           starter: false,   growth: true,    agency: true,          enterprise: true },
  { feature: "白标报告",           starter: false,   growth: false,   agency: true,          enterprise: true },
  { feature: "API 接入",           starter: false,   growth: false,   agency: true,          enterprise: true },
  { feature: "定制品类追踪",       starter: false,   growth: false,   agency: true,          enterprise: true },
  { feature: "子账户 / 转售权限",  starter: false,   growth: false,   agency: true,          enterprise: true },
  { feature: "专属策略师",         starter: false,   growth: false,   agency: false,         enterprise: true },
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
          定价
        </div>
        <h1 className="text-4xl font-bold">简单透明的定价</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          专为亚马逊 FBA 卖家、TikTok Shop 品牌、DTC 独立站、跨境代理机构
          及 Shopee / Lazada 出海卖家打造。所有方案含 14 天免费试用，无需信用卡。
        </p>
      </div>

      {/* Tier cards — 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="rounded-2xl p-5 space-y-5 flex flex-col relative"
            style={{
              background: tier.highlight ? "rgba(255,107,53,0.06)" : "#0f0f17",
              border: tier.highlight ? "2px solid #ff6b35" : "1px solid #25253f",
            }}
          >
            {tier.badge && (
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
                style={{ background: "#ff6b35", color: "#fff" }}
              >
                {tier.badge}
              </div>
            )}

            <div className="space-y-1">
              <div className="font-bold text-base">
                {tier.name}
                <span className="ml-1.5 text-xs font-normal" style={{ color: "#3a3a5c" }}>{tier.nameEn}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
                {tier.description}
              </p>
            </div>

            <div>
              {tier.annual > 0 ? (
                <>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-black">${tier.annual}</span>
                    <span className="text-sm pb-1" style={{ color: "#7070a0" }}>/月</span>
                  </div>
                  {tier.annual !== tier.price && (
                    <div className="text-xs mt-1" style={{ color: "#7070a0" }}>
                      按月付 ${tier.price}/月 · 按年付节省 ${(tier.price - tier.annual) * 12}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-3xl font-black">定制报价</div>
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
                包含
              </div>
              <ul className="space-y-1.5">
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

      {/* Who is this for */}
      <div
        className="rounded-xl p-6 space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ff6b35" }}>适用用户</div>
        <div className="grid md:grid-cols-4 gap-4 text-xs">
          {[
            { icon: "🛒", type: "亚马逊 FBA 卖家", desc: "在备货前追踪品类 AI 推荐趋势。了解 AI 是否正在把买家引向竞争对手。" },
            { icon: "🎵", type: "TikTok Shop 品牌", desc: "监控 TikTok 爆款之后 AI 引擎推荐了哪些产品。在信号峰值前提前布局。" },
            { icon: "🌐", type: "DTC / 独立站卖家", desc: "在 AI 搜索层建立品牌权威。让 AI 在引导高意向买家时主动引用你。" },
            { icon: "🏪", type: "Shopee / Lazada 卖家", desc: "追踪东南亚市场 AI 可见度。了解跨境扩张时 AI 更推荐哪些品牌。" },
          ].map((item) => (
            <div key={item.type} className="space-y-1.5">
              <div className="text-base">{item.icon}</div>
              <div className="font-semibold" style={{ color: "#f0f0f8" }}>{item.type}</div>
              <p style={{ color: "#7070a0" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Free tool callout */}
      <div
        className="rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <div>
          <div className="font-semibold text-sm">成本优化计算器 — 永久免费</div>
          <p className="text-xs mt-1" style={{ color: "#7070a0" }}>
            精确计算 AI 能帮你省多少运营成本——以及省下来的钱够支付几个月 GEO 监控。
            无需登录，无需信用卡。
          </p>
        </div>
        <Link
          href="/zh/optimizer"
          className="shrink-0 text-sm font-medium px-5 py-2 rounded-lg transition-colors hover:text-white"
          style={{ border: "1px solid #25253f", color: "#7070a0" }}
        >
          计算节省额 →
        </Link>
      </div>

      {/* Comparison table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-center">功能全对比</h2>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <th className="text-left p-4 font-medium text-xs" style={{ color: "#7070a0" }}>功能</th>
                <th className="text-center p-4 font-medium text-xs">入门版</th>
                <th className="text-center p-4 font-bold text-xs" style={{ color: "#ff6b35" }}>成长版</th>
                <th className="text-center p-4 font-medium text-xs">代理版</th>
                <th className="text-center p-4 font-medium text-xs">企业版</th>
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
                  <td className="p-3 text-xs" style={{ color: "#f0f0f8" }}>{row.feature}</td>
                  <td className="p-3 text-center text-xs">
                    {typeof row.starter === "boolean"
                      ? row.starter ? <Check /> : <Cross />
                      : <span style={{ color: "#f0f0f8" }}>{row.starter}</span>}
                  </td>
                  <td className="p-3 text-center text-xs">
                    {typeof row.growth === "boolean"
                      ? row.growth ? <Check /> : <Cross />
                      : <span style={{ color: "#f0f0f8" }}>{row.growth}</span>}
                  </td>
                  <td className="p-3 text-center text-xs">
                    {typeof row.agency === "boolean"
                      ? row.agency ? <Check /> : <Cross />
                      : <span style={{ color: "#f0f0f8" }}>{row.agency}</span>}
                  </td>
                  <td className="p-3 text-center text-xs">
                    {typeof row.enterprise === "boolean"
                      ? row.enterprise ? <Check /> : <Cross />
                      : <span style={{ color: "#f0f0f8" }}>{row.enterprise}</span>}
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
            q: "「品牌」怎么计算？",
            a: "1 个品牌 = 1 个在 AI 引擎中追踪的实体。如果你旗下有多个品牌名（主品牌 + 子品牌），每个独立计算。代理机构追踪客户品牌时，每个客户品牌单独计算。",
          },
          {
            q: "你们追踪哪 4 个 AI 引擎？",
            a: "ChatGPT（GPT-4o）、Claude、Gemini 和 Perplexity——这 4 个正在主动影响买家决策的引擎。跨境品牌的查询同时覆盖英文和中文。代理版和企业版支持自定义语言集。",
          },
          {
            q: "TikTok Shop 卖家和 Shopee/Lazada 卖家也适合用吗？",
            a: "适合。我们追踪买家搜索品类时 AI 引擎推荐的是哪些品牌——无论最终在哪个平台购买。TikTok 爆款通常在爆红后 2–3 周出现 AI 推荐信号。Shopee/Lazada 卖家可通过英文 AI 查询了解跨境扩张方向。",
          },
          {
            q: "我是代理机构，管理 20+ 个品牌，代理版适合我吗？",
            a: "适合。代理版包含白标 PDF 报告（可以贴你自己的 logo 发给客户）、子账户管理（每个客户独立视图）和 API 接入。20 个以上品牌可联系我们获取批量定价。",
          },
          {
            q: "随时可以取消吗？",
            a: "可以。没有长期合同，在账户设置中取消，当前计费周期结束后生效。",
          },
          {
            q: "阿凡提 和 Helium 10 有什么区别？",
            a: "Helium 10 追踪亚马逊平台上的历史销售数据、BSR 和关键词。阿凡提 追踪 AI 模型现在正在把未来买家引向哪里——是关于需求去向的前瞻信号，不是已发生的历史。",
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
        <p className="text-2xl font-bold">先做免费诊断</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          看到你的品牌 GEO 评分和每个竞品的 SOV 对比——在选择方案之前。
        </p>
        <div className="flex justify-center gap-3 pt-2 flex-wrap">
          <Link
            href="/zh/signup"
            className="text-sm font-semibold px-6 py-3 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            免费开始 →
          </Link>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium px-6 py-3 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            预约 Demo
          </a>
        </div>
      </div>
    </div>
  );
}
