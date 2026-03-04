import Link from "next/link";

export const metadata = {
  title: "为什么 AI 不提你的品牌：跨境卖家 GEO 入门指南 | 阿凡提",
  description:
    "ChatGPT 正在把买家引导给你的竞争对手。以下是 AI 忽视你品牌的 5 个原因——以及你现在可以做什么。",
};

export default function ZhWhyAIIgnoresYourBrandPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            GEO 入门指南
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>2026年3月 · 6分钟阅读</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          为什么 AI 不提你的品牌：跨境亚马逊卖家 GEO 入门指南
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          一个买家问 ChatGPT：「运动耳机哪款最好？」
          ChatGPT 说了 Bose、Sony 和 Jabra。你的品牌——在亚马逊有 4.4 分、2000 条评论——一个字都没有被提到。
          这是为什么？你能做什么？
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">购买路径已经从根本上发生了改变</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          2023 年之前，漏斗很简单：买家在谷歌输入关键词 → 找到你的 listing 或广告 → 购买。
          亚马逊 BSR 和关键词优化统治一切。
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          今天，越来越多的买家——尤其是高 AOV、决策链路长的购物——从 AI 助手开始。
          他们用自然语言描述需求，请 AI 推荐。AI 说出 2–3 个品牌，买家直接去亚马逊或品牌官网购买。
        </p>
        <div
          className="rounded-xl p-5 space-y-3"
          style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.3)" }}
        >
          <div className="text-sm font-semibold" style={{ color: "#ff6b35" }}>新的购买漏斗</div>
          <div className="flex items-center gap-2 text-xs flex-wrap" style={{ color: "#f0f0f8" }}>
            <span className="px-2 py-1 rounded" style={{ background: "#1a1a2e" }}>买家有需求</span>
            <span style={{ color: "#7070a0" }}>→</span>
            <span className="px-2 py-1 rounded" style={{ background: "#1a1a2e" }}>问 ChatGPT</span>
            <span style={{ color: "#7070a0" }}>→</span>
            <span className="px-2 py-1 rounded" style={{ background: "#1a1a2e" }}>AI 说出品牌</span>
            <span style={{ color: "#7070a0" }}>→</span>
            <span className="px-2 py-1 rounded" style={{ background: "#1a1a2e" }}>购买</span>
          </div>
          <p className="text-xs" style={{ color: "#7070a0" }}>
            如果 AI 没有说你的名字，你在这个买家的考虑范围内根本不存在——无论你的 BSR 或评论数多高。
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold">AI 不提你品牌的 5 个原因</h2>

        {[
          {
            num: "01",
            title: "没有权威的第三方引用",
            body: "AI 模型不引用亚马逊评论。它们引用 Wirecutter、CNET、Reddit、OutdoorGearLab 和专业论坛。如果你的品牌从未被这些来源评测过，AI 没有足够的理由推荐你。第三方权威内容覆盖是 AI 可见度的第一驱动力。",
            fix: "在你的品类中，争取 3–5 个权威来源的评测。一篇 Wirecutter 推荐就能让 AI SOV 提升 8–12 个点。",
          },
          {
            num: "02",
            title: "你的内容没有回答 AI 收到的问题",
            body: "AI 模型回答问题。如果你的网站只有带规格参数的产品页，你什么都没有回答。AI 推荐的品牌拥有深度内容库：「徒步 vs 露营怎么选」「X 和 Y 有什么区别」「哪个尺寸适合我」。这些内容才是被引用的。",
            fix: "写 10+ 篇专门回答买家向 AI 提问的文章。目标是自然语言形式的购买意图查询，而不是关键词堆砌的标题。",
          },
          {
            num: "03",
            title: "你的品牌名缺乏辨识度",
            body: "AI 模型偏爱在众多来源中反复出现的品牌名。一个叫「VEATOOL」或「GEEKPURE」的品牌对 AI 来说很难与质量信号关联——名字本身没有提供任何语境。而「EcoFlow」出现在可持续发展论坛、户外博客和科技评测中。",
            fix: "投资品牌级内容，把你的名字与特定定位绑定。跨来源的一致性是建立 AI 品牌认知的关键。",
          },
          {
            num: "04",
            title: "你在优化昨天的漏斗",
            body: "Helium 10 和 Jungle Scout 告诉你上个月亚马逊上有哪些关键词被搜索了。它们无法告诉你 AI 今天正在推荐什么。这是两种根本不同的信号。只优化历史搜索数据的卖家，是在为一个正在萎缩的漏斗构建。",
            fix: "跑一次 ARRS 诊断，看看你现在在 AI 推荐中处于什么位置——而不是上个季度关键词搜索中的位置。",
          },
          {
            num: "05",
            title: "竞争对手正在主动构建他们的 AI 存在",
            body: "EcoFlow、Anker 和 Jackery 有内容团队，无论是否有意为之，都在构建庞大的引用网络。每一个产品对比视频、他们参与的每一个 Reddit 讨论串、每一篇被转载的新闻稿——这就是 AI 模型学习的原材料。",
            fix: "现在就开始构建你的 GEO 基础，趁差距还没有拉大。每个细分品类里最先入场的品牌，将是最难被取代的。",
          },
        ].map((item) => (
          <div
            key={item.num}
            className="rounded-xl p-6 space-y-3"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl font-black shrink-0" style={{ color: "rgba(255,107,53,0.3)" }}>
                {item.num}
              </div>
              <div className="space-y-3">
                <div className="font-semibold text-sm">{item.title}</div>
                <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{item.body}</p>
                <div
                  className="rounded-lg p-3 text-xs"
                  style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}
                >
                  <span style={{ color: "#22c55e" }}>改进方向：</span>
                  <span style={{ color: "#7070a0" }}>{item.fix}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">我们如何衡量 AI 可见度：ARRS 评分</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          <strong>AI 推荐排名分（ARRS）</strong>衡量你的品牌在品类内 AI 回答中出现的频率。
          数据来自对 ChatGPT、Claude、Gemini 和 Perplexity 的系统性查询。
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { range: "ARRS &lt; 30", label: "主导", color: "#22c55e", desc: "AI 在绝大多数查询中都会把你的品牌排在前 2–3 位。" },
            { range: "ARRS 30–59", label: "中等", color: "#f5a623", desc: "AI 会提及你的品牌，但不是每次相关查询都会。" },
            { range: "ARRS ≥ 60", label: "隐形", color: "#ff4d6d", desc: "AI 几乎不推荐你的品牌。需要重点投入。" },
          ].map((tier) => (
            <div
              key={tier.label}
              className="rounded-xl p-4 space-y-2 text-center"
              style={{ background: "#0f0f17", border: `1px solid ${tier.color}30` }}
            >
              <div
                className="font-bold text-sm"
                style={{ color: tier.color }}
                dangerouslySetInnerHTML={{ __html: tier.range }}
              />
              <div className="text-xs font-semibold">{tier.label}</div>
              <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{tier.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl p-8 text-center space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="font-semibold text-lg">现在就看看 AI 如何排名你的品牌</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          免费诊断。查看你的 ARRS 评分，以及与品类内所有竞品的对比。不需要注册，2 分钟搞定。
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/zh/signup"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            立即免费诊断 →
          </Link>
          <a
            href="https://calendly.com/brivesubscription/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            预约策略通话
          </a>
        </div>
      </div>
    </div>
  );
}
