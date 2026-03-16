"use client";

import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";

/* ── risk cards ─────────────────────────────────────── */
const RISKS = [
  {
    icon: "🎭",
    title: "竞争对手恶意投毒",
    desc: "竞争对手正在向 AI 训练数据中植入虚假产品声明。ChatGPT 和 Claude 可能已经在把谎言当事实传播。",
    accent: "#ff4d6d",
  },
  {
    icon: "🤖",
    title: "AI 幻觉编造信息",
    desc: "AI 模型会凭空编造规格、价格和功能。你的品牌将为从未做过的承诺背锅。",
    accent: "#f5a623",
  },
  {
    icon: "📉",
    title: "隐性口碑损害",
    desc: "负面情绪正在 AI 引擎中被无声放大，而你一无所知。等你发现时，客户早已流失。",
    accent: "#ff6b35",
  },
];

/* ── service cards ──────────────────────────────────── */
const SERVICES = [
  {
    icon: "🔍",
    title: "幻觉扫描",
    desc: "我们向 ChatGPT、Claude、Gemini、Perplexity 查询你的品牌，逐条标记每一个错误声明 -- 错误规格、编造评价、过时价格。",
    tag: "4 大 AI 引擎",
  },
  {
    icon: "🕵️",
    title: "竞品投毒检测",
    desc: "将你的 AI 曝光与主要竞品对比分析，检测对手是否在操纵 AI 输出结果。",
    tag: "竞争情报",
  },
  {
    icon: "✅",
    title: "跨平台交叉验证",
    desc: "将 AI 所说的内容与 Reddit、YouTube、TikTok、Google Trends 的真实数据进行比对验证，分辨真话与幻觉。",
    tag: "5+ 数据源",
  },
  {
    icon: "📊",
    title: "AI 可见度基线建立",
    desc: "在所有 AI 引擎中建立你的品牌 AI 可见度评分基线。在优化之前，先精确了解你的起点。",
    tag: "基准评估",
  },
];

/* ── steps ──────────────────────────────────────────── */
const STEPS = [
  {
    n: "01",
    title: "提供品牌信息",
    desc: "告诉我们你的品牌名称、产品线和目标市场。只需 30 秒。",
  },
  {
    n: "02",
    title: "自动扫描 AI 引擎",
    desc: "我们的系统在 4+ 个 AI 引擎中自动运行查询，支持 3 种语言（中文、英文、印尼语）。数百条查询，零人工。",
  },
  {
    n: "03",
    title: "获取审计报告",
    desc: "收到一份完整报告，包含每个发现、风险等级，以及修复优先级行动方案。",
  },
];

/* ── pricing tiers ──────────────────────────────────── */
const TIERS = [
  {
    name: "免费扫描",
    price: "免费",
    period: "永久",
    desc: "快速了解你的 AI 品牌现状",
    features: [
      "1 个品牌，1 个产品",
      "2 个 AI 引擎（ChatGPT + Claude）",
      "仅英文",
      "基础幻觉检查",
      "概要报告",
    ],
    cta: "开始免费审计",
    href: "/zh/runs/new",
    highlight: false,
  },
  {
    name: "完整审计",
    price: "$199",
    period: "一次性",
    desc: "全面品牌安全评估",
    features: [
      "1 个品牌，所有产品",
      "4 个 AI 引擎",
      "3 种语言（中/英/印尼）",
      "跨平台交叉验证",
      "竞品投毒检测",
      "详细报告 + 行动方案",
      "Growth / Agency 方案已包含",
    ],
    cta: "获取完整审计",
    href: "/zh/runs/new",
    highlight: true,
  },
  {
    name: "企业定制",
    price: "定制",
    period: "按月",
    desc: "持续监控 + 专属支持",
    features: [
      "不限品牌和产品",
      "自定义 AI 引擎范围",
      "全语言覆盖",
      "每周持续监控",
      "专属客户经理",
      "API 接入",
      "自定义集成",
    ],
    cta: "联系销售",
    href: "/zh/book-demo",
    highlight: false,
  },
];

export default function BrandSafetyPageZh() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0e1a" }}>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ paddingTop: 80, paddingBottom: 80 }}>
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute w-96 h-96 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #ff4d6d 0%, transparent 70%)", top: "-8%", left: "20%", filter: "blur(80px)" }} />
          <div className="absolute w-80 h-80 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #f5a623 0%, transparent 70%)", bottom: "5%", right: "15%", filter: "blur(100px)" }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <AnimateIn>
            <div className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full font-bold uppercase tracking-wider mb-8"
              style={{ background: "rgba(255,77,109,0.10)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.25)" }}>
              <span>AI 品牌保护</span>
            </div>
          </AnimateIn>

          <AnimateIn delay={80}>
            <h1 style={{ fontSize: 52, fontWeight: 900, color: "#f0f0f8", lineHeight: 1.1, marginBottom: 20 }}>
              AI 品牌安全审计
            </h1>
          </AnimateIn>

          <AnimateIn delay={160}>
            <p style={{ fontSize: 24, fontWeight: 600, color: "#ff4d6d", marginBottom: 20, lineHeight: 1.3 }}>
              AI 对你的品牌说的是真话吗？
            </p>
          </AnimateIn>

          <AnimateIn delay={240}>
            <p style={{ fontSize: 17, color: "#7070a0", maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.7 }}>
              近期调查揭示，虚假数据正在被大规模注入 AI 模型。
              竞争对手可能已经在污染你品牌的 AI 信息。
              在你的客户发现之前，先搞清楚真相。
            </p>
          </AnimateIn>

          <AnimateIn delay={320}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/zh/runs/new"
                className="text-base font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #ff4d6d, #ff6b35)", color: "#fff", boxShadow: "0 8px 32px rgba(255,77,109,0.3)" }}>
                开始免费审计
              </Link>
              <Link href="/zh/book-demo"
                className="text-base font-medium px-8 py-3.5 rounded-xl transition-colors hover:text-white"
                style={{ color: "#ff6b35", border: "1px solid rgba(255,107,53,0.35)" }}>
                预约演示
              </Link>
            </div>
            <p className="mt-3 text-xs" style={{ color: "#555580" }}>所有阿凡提账户免费使用</p>
          </AnimateIn>
        </div>
      </section>

      {/* ── Problem Statement ─────────────────────────── */}
      <section style={{ paddingTop: 60, paddingBottom: 80 }}>
        <div className="max-w-5xl mx-auto px-6">
          <AnimateIn>
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#ff4d6d" }}>核心问题</p>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: "#f0f0f8", lineHeight: 1.15 }}>
                你的品牌正在 AI 搜索中被攻击<br />而你浑然不知
              </h2>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {RISKS.map((r, i) => (
              <AnimateIn key={r.title} delay={i * 100}>
                <div className="h-full rounded-2xl p-7 transition-all hover:translate-y-[-2px]"
                  style={{ background: "#12121e", border: `1px solid ${r.accent}25`, boxShadow: `0 0 40px ${r.accent}08` }}>
                  <div style={{ fontSize: 36, marginBottom: 16 }}>{r.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f8", marginBottom: 10 }}>{r.title}</h3>
                  <p style={{ fontSize: 14, color: "#7070a0", lineHeight: 1.7 }}>{r.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Audit ─────────────────────────────── */}
      <section style={{ paddingTop: 60, paddingBottom: 80, background: "rgba(18,18,30,0.5)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <AnimateIn>
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#f5a623" }}>审计内容</p>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: "#f0f0f8", lineHeight: 1.15 }}>
                四层 AI 品牌保护体系
              </h2>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SERVICES.map((s, i) => (
              <AnimateIn key={s.title} delay={i * 80}>
                <div className="h-full rounded-2xl p-7 transition-all hover:translate-y-[-2px]"
                  style={{ background: "#0d0d19", border: "1px solid #25253f" }}>
                  <div className="flex items-start justify-between mb-4">
                    <div style={{ fontSize: 32 }}>{s.icon}</div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(245,166,35,0.10)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.20)" }}>
                      {s.tag}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f8", marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "#7070a0", lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────── */}
      <section style={{ paddingTop: 60, paddingBottom: 80 }}>
        <div className="max-w-4xl mx-auto px-6">
          <AnimateIn>
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#22c55e" }}>使用流程</p>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: "#f0f0f8", lineHeight: 1.15 }}>
                三步搞定，48 小时内出结果
              </h2>
            </div>
          </AnimateIn>

          <div className="space-y-6">
            {STEPS.map((s, i) => (
              <AnimateIn key={s.n} delay={i * 100}>
                <div className="flex items-start gap-6 rounded-2xl p-7"
                  style={{ background: "#12121e", border: "1px solid #25253f" }}>
                  <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-xl font-black text-lg"
                    style={{ background: "rgba(34,197,94,0.10)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.20)" }}>
                    {s.n}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f8", marginBottom: 8 }}>{s.title}</h3>
                    <p style={{ fontSize: 14, color: "#7070a0", lineHeight: 1.7 }}>{s.desc}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────── */}
      <section style={{ paddingTop: 60, paddingBottom: 80, background: "rgba(18,18,30,0.5)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <AnimateIn>
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#ff6b35" }}>价格方案</p>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: "#f0f0f8", lineHeight: 1.15 }}>
                免费起步，按需升级
              </h2>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIERS.map((t, i) => (
              <AnimateIn key={t.name} delay={i * 100}>
                <div className="h-full flex flex-col rounded-2xl p-7 transition-all hover:translate-y-[-2px]"
                  style={{
                    background: t.highlight ? "#14101e" : "#12121e",
                    border: t.highlight ? "1px solid rgba(255,107,53,0.4)" : "1px solid #25253f",
                    boxShadow: t.highlight ? "0 0 60px rgba(255,107,53,0.08)" : "none",
                  }}>
                  {t.highlight && (
                    <div className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full self-start mb-4"
                      style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}>
                      最受欢迎
                    </div>
                  )}
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f0f8", marginBottom: 4 }}>{t.name}</h3>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span style={{ fontSize: 40, fontWeight: 900, color: t.highlight ? "#ff6b35" : "#f0f0f8" }}>{t.price}</span>
                    <span style={{ fontSize: 13, color: "#555580" }}>{t.period}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#7070a0", marginBottom: 20 }}>{t.desc}</p>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "#a0a0c0" }}>
                        <span style={{ color: "#22c55e", marginTop: 2, flexShrink: 0 }}>&#10003;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={t.href}
                    className="block text-center text-sm font-bold py-3 rounded-xl transition-all hover:opacity-90"
                    style={t.highlight
                      ? { background: "linear-gradient(135deg, #ff4d6d, #ff6b35)", color: "#fff" }
                      : { color: "#ff6b35", border: "1px solid rgba(255,107,53,0.35)" }
                    }>
                    {t.cta}
                  </Link>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────── */}
      <section style={{ paddingTop: 80, paddingBottom: 100 }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimateIn>
            <div style={{ fontSize: 56, marginBottom: 20 }}>&#x1F6E1;&#xFE0F;</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: "#f0f0f8", lineHeight: 1.15, marginBottom: 16 }}>
              别等销量下滑<br />才发现问题所在
            </h2>
            <p style={{ fontSize: 17, color: "#7070a0", maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7 }}>
              今天就运行免费 AI 品牌安全审计，精确了解 AI 正在对你的客户说什么。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/zh/runs/new"
                className="text-base font-bold px-10 py-4 rounded-xl transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #ff4d6d, #ff6b35)", color: "#fff", boxShadow: "0 8px 32px rgba(255,77,109,0.3)" }}>
                开始免费审计
              </Link>
              <Link href="/zh/book-demo"
                className="text-base font-medium px-8 py-3.5 rounded-xl transition-colors hover:text-white"
                style={{ color: "#ff6b35", border: "1px solid rgba(255,107,53,0.35)" }}>
                预约演示
              </Link>
            </div>
            <p className="mt-3 text-xs" style={{ color: "#555580" }}>所有阿凡提账户免费使用</p>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
