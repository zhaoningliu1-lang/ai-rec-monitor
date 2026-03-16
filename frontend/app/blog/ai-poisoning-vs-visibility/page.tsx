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
        <p className="text-xl font-semibold" style={{ color: "#f0f0f8" }}>
          AI 投毒 vs AI 可见度管理：阿凡提的立场
        </p>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          2026 年 3.15 晚会曝光了「力擎 GEO 系统」通过伪造数据操纵 AI 模型的灰色产业链。
          这件事让整个 GEO 行业站在了聚光灯下。作为一家以 AI 可见度监控为核心业务的公司，
          我们认为有必要公开、清晰地说明：我们做什么，不做什么，以及这两者之间的本质区别。
        </p>
      </div>

      {/* What happened */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">What the 315 Gala Exposed</h2>
        <p className="text-sm font-medium" style={{ color: "#9090c0" }}>
          3.15 晚会曝光了什么
        </p>
        <div
          className="rounded-xl p-5 space-y-3"
          style={{
            background: "rgba(255,68,77,0.06)",
            border: "1px solid rgba(255,68,77,0.3)",
          }}
        >
          <div className="text-sm font-semibold" style={{ color: "#ff4d6d" }}>
            曝光核心
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
            央视调查发现，部分公司打着「GEO 优化」的旗号，实际上在做 <strong style={{ color: "#f0f0f8" }}>AI 投毒</strong>
            ——批量生成虚假文章、伪造用户评价、向 AI 训练数据中注入不实信息，
            以操纵 ChatGPT、文心一言等大模型的推荐结果。
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
            这不是优化，这是<strong style={{ color: "#ff4d6d" }}>信息污染</strong>。
            这些行为损害了 AI 生态的可信度，也损害了每一个依赖 AI 获取真实信息的消费者和品牌。
          </p>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          我们对此的态度非常明确：<strong style={{ color: "#f0f0f8" }}>3.15 曝光的问题是真实存在的，
          这些做法必须被制止。</strong>事实上，阿凡提建立的整套产品体系，
          恰恰是为了帮助品牌<strong style={{ color: "#f0f0f8" }}>发现和防御</strong>这类攻击。
        </p>
      </div>

      {/* What Avanti does */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">What Avanti Does (and Doesn&apos;t Do)</h2>
        <p className="text-sm font-medium" style={{ color: "#9090c0" }}>
          阿凡提做什么，不做什么
        </p>

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
              We DO / 我们做的
            </div>
            <ul className="space-y-2">
              {[
                "监测 4+ AI 引擎如何看待你的品牌",
                "告诉品牌：「AI 现在是这样描述你的」",
                "检测 AI 幻觉——发现 AI 对你品牌的错误描述",
                "跨平台验证：Reddit、YouTube、TikTok、Google Trends 交叉核实",
                "提供数据驱动的洞察和改善建议",
                "帮助品牌用真实、高质量内容提升 AI 可见度",
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
              We DON&apos;T / 我们不做的
            </div>
            <ul className="space-y-2">
              {[
                "不伪造任何数据或文章",
                "不向 AI 训练数据中注入虚假信息",
                "不生成虚假评论或评价",
                "不操纵 AI 模型的输出结果",
                "不制造虚假的第三方引用",
                "不做任何形式的 AI 投毒",
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
          简而言之：我们是<strong style={{ color: "#f0f0f8" }}>雷达</strong>，不是<strong style={{ color: "#f0f0f8" }}>导弹</strong>。
          我们帮你看清战场，但不会往战场上扔假情报。
        </p>
      </div>

      {/* Poisoning vs Optimization */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Poisoning vs. Legitimate Optimization</h2>
        <p className="text-sm font-medium" style={{ color: "#9090c0" }}>
          投毒 vs 正当优化：本质区别
        </p>

        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          这个区分并不新鲜。SEO 行业早在十几年前就经历过同样的分水岭：
        </p>

        <div className="space-y-3">
          {[
            {
              label: "Black Hat SEO",
              labelZh: "黑帽 SEO",
              color: "#ff4d6d",
              items: [
                "关键词堆砌 (Keyword Stuffing)",
                "链接农场 (Link Farms)",
                "隐藏文本 (Hidden Text)",
                "虚假门页 (Doorway Pages)",
              ],
            },
            {
              label: "White Hat SEO",
              labelZh: "白帽 SEO",
              color: "#22c55e",
              items: [
                "高质量原创内容",
                "合理的结构化数据 (Schema.org)",
                "真实的用户体验优化",
                "权威的外部引用建设",
              ],
            },
          ].map((section) => (
            <div
              key={section.label}
              className="rounded-xl p-5 space-y-2"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div className="text-sm font-bold" style={{ color: section.color }}>
                {section.label} · {section.labelZh}
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
          GEO（Generative Engine Optimization）的逻辑完全一样：
        </p>

        <div className="space-y-3">
          {[
            {
              label: "AI 投毒 (Poisoning)",
              color: "#ff4d6d",
              bg: "rgba(255,68,77,0.06)",
              border: "rgba(255,68,77,0.25)",
              items: [
                "批量生成虚假文章注入 AI 训练语料",
                "伪造不存在的评测和用户评价",
                "制造虚假引用来源欺骗 AI 爬虫",
                "向知识图谱注入不实数据",
              ],
            },
            {
              label: "正当 GEO 优化 (Legitimate GEO)",
              color: "#22c55e",
              bg: "rgba(34,197,94,0.06)",
              border: "rgba(34,197,94,0.25)",
              items: [
                "创建真实、高质量的产品内容和品牌叙事",
                "部署结构化数据 (Schema.org) 帮助 AI 准确理解",
                "经营真实的社区互动（Reddit、论坛、社媒）",
                "发布准确的产品信息和规格数据",
                "获取真实的第三方评测和媒体报道",
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
            <strong style={{ color: "#f5a623" }}>核心原则：</strong>
            如果你需要<strong style={{ color: "#f0f0f8" }}>伪造</strong>信息才能让 AI 推荐你，
            说明你的产品或品牌本身还没有准备好。正当的 GEO 优化应该是让 AI
            <strong style={{ color: "#f0f0f8" }}>更准确地</strong>发现和理解你已经拥有的真实优势。
          </p>
        </div>
      </div>

      {/* Why this matters */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Why This Matters for Your Brand</h2>
        <p className="text-sm font-medium" style={{ color: "#9090c0" }}>
          为什么品牌方必须关注这件事
        </p>

        {[
          {
            num: "01",
            title: "竞争对手可能正在用虚假信息攻击你的品牌",
            body: "3.15 曝光的不仅是「自吹自擂」——有些服务商会生成关于竞品的负面虚假信息。如果有人在 AI 训练数据中植入「XX 品牌质量堪忧」的虚假文章，你可能完全不知道。而当消费者问 AI「XX品牌怎么样」时，这些虚假信息就会出现在回答中。",
          },
          {
            num: "02",
            title: "AI 幻觉每天都在生成关于你品牌的错误信息",
            body: "即使没有人主动投毒，AI 模型本身也会产生「幻觉」——凭空编造不存在的产品功能、错误的价格、虚假的用户投诉。你需要监控工具来及时发现这些问题，在它们扩散之前采取行动。",
          },
          {
            num: "03",
            title: "AI 时代的品牌安全需要「可见度」，不是「操纵」",
            body: "品牌在搜索引擎时代需要 SEO 监控工具来追踪排名。品牌在 AI 时代同样需要 GEO 监控工具来追踪 AI 可见度。监控不是操纵——就像安装摄像头不等于去偷东西。你需要知道 AI 在说什么，才能保护自己。",
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
        <p className="text-sm font-medium" style={{ color: "#9090c0" }}>
          阿凡提如何保护你的品牌
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: "\uD83D\uDD0D",
              title: "AI Visibility Monitoring",
              titleZh: "AI 可见度监控",
              desc: "持续追踪 ChatGPT、Claude、Gemini、Perplexity 等 4+ AI 引擎如何描述和推荐你的品牌。每周更新，实时掌握品牌的 AI 声量变化。",
              color: "#ff6b35",
            },
            {
              icon: "\u26A0\uFE0F",
              title: "Hallucination Detection",
              titleZh: "AI 幻觉检测",
              desc: "自动检测 AI 对你品牌的错误描述、虚假声明和不实信息。发现问题立即告警，帮你在虚假信息扩散前采取行动。",
              color: "#f5a623",
            },
            {
              icon: "\u2705",
              title: "Cross-Platform Verification",
              titleZh: "跨平台交叉验证",
              desc: "将 AI 的说法与 Reddit、YouTube、TikTok、Google Trends 的真实市场数据交叉比对。分辨哪些是真实信号，哪些是被注入的假信息。",
              color: "#22c55e",
            },
            {
              icon: "\uD83D\uDEE1\uFE0F",
              title: "AI Brand Safety Audit",
              titleZh: "AI 品牌安全审计",
              desc: "全面评估你的品牌在 AI 生态中的信息完整性。检查是否有虚假信息、竞争对手的恶意攻击、或 AI 幻觉导致的品牌风险。",
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
                <div className="text-xs font-medium mt-0.5" style={{ color: "#9090c0" }}>
                  {feature.titleZh}
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
        <p className="text-sm font-medium" style={{ color: "#9090c0" }}>
          3.15 曝光恰恰验证了我们在做的事
        </p>
        <div
          className="rounded-xl p-6 space-y-4"
          style={{
            background: "rgba(255,107,53,0.04)",
            border: "1px solid rgba(255,107,53,0.25)",
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
            说实话——当我们第一次看到 3.15 的报道时，我们的反应不是恐慌，而是
            <strong style={{ color: "#f0f0f8" }}>「这正是我们一直在说的」</strong>。
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
            阿凡提从第一天起就在建设一个<strong style={{ color: "#f0f0f8" }}>监测和防御</strong>体系，
            而不是一个操纵体系。我们的幻觉检测功能本身就是为了帮助品牌发现
            AI 中关于自己的错误信息——无论这些错误信息是 AI 自己「编」的，
            还是有人故意「投」的。
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
            我们的跨平台验证系统会自动比对 AI 的说法和真实市场数据。
            当 AI 声称「XX 品牌是品类销量第一」时，我们会去 Reddit、TikTok、
            Google Trends 上验证这个说法是否属实。
            <strong style={{ color: "#f0f0f8" }}>这恰恰是对抗 AI 投毒最有效的武器。</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs" style={{ color: "#f0f0f8" }}>
          <span className="px-3 py-1.5 rounded-lg" style={{ background: "#1a1a2e" }}>
            AI 投毒泛滥
          </span>
          <span style={{ color: "#7070a0" }}>&rarr;</span>
          <span className="px-3 py-1.5 rounded-lg" style={{ background: "#1a1a2e" }}>
            品牌需要知道 AI 在说什么
          </span>
          <span style={{ color: "#7070a0" }}>&rarr;</span>
          <span
            className="px-3 py-1.5 rounded-lg font-medium"
            style={{ background: "rgba(255,107,53,0.15)", color: "#ff6b35" }}
          >
            阿凡提的价值
          </span>
        </div>
      </div>

      {/* Our commitment */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Our Commitment</h2>
        <p className="text-sm font-medium" style={{ color: "#9090c0" }}>
          我们的承诺
        </p>
        <div className="space-y-3">
          {[
            {
              title: "透明",
              titleEn: "Transparency",
              desc: "我们的监测方法、数据来源、评分逻辑全部可审计。我们不做黑箱操作。",
            },
            {
              title: "真实",
              titleEn: "Authenticity",
              desc: "我们只基于真实数据提供洞察。我们的优化建议始终指向创建真实、高质量的内容，而非伪造信息。",
            },
            {
              title: "防御",
              titleEn: "Defense",
              desc: "我们帮助品牌发现和应对 AI 生态中的虚假信息威胁——无论这些威胁来自 AI 幻觉还是人为投毒。",
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
                {item.title.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-sm">
                  {item.title}
                  <span className="ml-2 text-xs font-normal" style={{ color: "#7070a0" }}>
                    {item.titleEn}
                  </span>
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
        <p className="font-semibold text-lg">担心 AI 在说你品牌的坏话？先查一查。</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          免费 AI 品牌安全审计。看看 ChatGPT、Claude、Gemini 现在如何描述你的品牌。
          发现幻觉和虚假信息，在它们伤害你之前。
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/signup"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            免费品牌安全审计 →
          </Link>
          <a
            href="https://calendly.com/brivesubscription/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            预约 Demo 演示
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center">
        <p className="text-xs leading-relaxed" style={{ color: "#505070" }}>
          本文由阿凡提 (Avanti) 团队发布于 2026 年 3 月 15 日。
          我们欢迎行业讨论和媒体问询。
          联系方式：team@avantia2a.com
        </p>
      </div>
    </div>
  );
}
