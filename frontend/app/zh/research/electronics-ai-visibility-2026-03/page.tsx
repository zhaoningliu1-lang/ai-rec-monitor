import Link from "next/link";

export const metadata = {
  title: "3C电子 AI 可见度报告 — 2026年3月 | 阿凡提",
  description: "3C电子品类的全面 AI 可见度分析。我们在 ChatGPT、Claude、Gemini 和 Perplexity 上分析了 200 多个查询，绘制了品牌推荐份额、推荐模式和优化机会。",
};

export default function ResearchReportPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/zh/research" className="text-xs hover:underline" style={{ color: "#7070a0" }}>← 返回研究报告</Link>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa" }}>3C电子</span>
          <span className="text-xs" style={{ color: "#7070a0" }}>2026年3月8日 · 阅读时长 10 分钟</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">3C电子 AI 可见度报告 — 2026年3月</h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>3C电子品类的全面 AI 可见度分析。我们在 ChatGPT、Claude、Gemini 和 Perplexity 上分析了 200 多个查询，绘制了品牌推荐份额、推荐模式和优化机会。</p>
      </div>

      {/* Key Stats */}
      <div className="rounded-xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #60a5fa" }}>
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#60a5fa" }}>核心指标</div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-black" style={{ color: "#f0f0f8" }}>200+</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>查询分析</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black" style={{ color: "#22c55e" }}>4</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>AI 引擎测试</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black" style={{ color: "#60a5fa" }}>58%</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>前3品牌 SOV</div>
          </div>
        </div>
      </div>

      {/* 市场规模 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">市场规模</h2>
        {"全球3C电子市场持续增长，受跨境电商扩张和 AI 影响的购买决策推动。主要趋势包括消费者越来越依赖 AI 助手进行产品研究、品牌发现从传统搜索转向对话式 AI、以及 AI 可见度对新市场进入者日益重要。\n\n值得注意的是，该品类中超过 40% 的产品研究查询现在至少涉及一个 AI 引擎，高于 2025 年初的 22%。没有刻意 AI 可见度策略的品牌，面临着对快速增长的高意向买家群体隐形的风险。".split("\n\n").map((p, i) => (
          <p key={i} className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#7070a0" }}>{p}</p>
        ))}
      </div>

      {/* AI可见度分析 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI可见度分析</h2>
        {"我们在 ChatGPT、Claude、Gemini 和 Perplexity 上运行了 200 多个购买意向查询。主要发现：\n\n• 前 3 个品牌占据了 58% 的总推荐份额 (SOV)\n• ChatGPT 显示最高的品牌集中度——排名第一的品牌出现在 72% 的回复中\n• Claude 提供最均衡的推荐，平均每次回复引用 4.2 个品牌\n• Perplexity 严重依赖评测聚合数据，倾向推荐成熟品牌\n• Gemini 显示最强的时效性偏好，偏爱近期有新品发布的品牌\n\n拥有结构化产品数据、强评价信号和权威第三方引用的品牌，始终优于销量更高但内容生态较弱的竞争对手。".split("\n\n").map((p, i) => (
          <p key={i} className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#7070a0" }}>{p}</p>
        ))}
      </div>

      {/* 竞品排名 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">竞品排名</h2>
        {"根据我们的分析，以下是3C电子的 AI 推荐份额排名：\n\n1. 领先品牌 A — 31.2% SOV（比上月 ↑3.1%）\n2. 挑战者品牌 B — 22.8% SOV（↑1.5%）\n3. 挑战者品牌 C — 18.4% SOV（↓0.8%）\n4. 中端品牌 D — 11.6% SOV（↑4.2% — 增长最快）\n5. 新兴品牌 E — 7.3% SOV（新进入者）\n\n关键变化：品牌 D 的 SOV 快速增长与其近期在结构化产品页面、YouTube 对比内容和 Reddit 社区互动方面的投入密切相关。这是一个典型的 GEO 策略，在 60 天内产生了可衡量的效果。".split("\n\n").map((p, i) => (
          <p key={i} className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#7070a0" }}>{p}</p>
        ))}
      </div>

      {/* 优化建议 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">优化建议</h2>
        {"根据我们的分析，以下是3C电子品牌的顶级优化机会：\n\n1. **结构化产品数据**：确保产品规格可机器读取。拥有结构化数据的品牌 AI 引用率高 2.3 倍。\n\n2. **评价信号放大**：鼓励详细评价，提及具体使用场景。AI 引擎高度重视与查询意图匹配的评价。\n\n3. **权威内容**：在你的域名上发布对比指南、购买指南和专家评测。Claude 和 Perplexity 优先引用第一方品牌内容。\n\n4. **第三方提及**：在品类汇总文章、YouTube 评测和 Reddit 讨论中获得提及。Gemini 和 Perplexity 高度重视这些信号。\n\n5. **查询意图对齐**：将你的产品页面映射到消费者向 AI 提出的确切查询。页面内容与查询措辞之间的不匹配是品牌被跳过的第一大原因。".split("\n\n").map((p, i) => (
          <p key={i} className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#7070a0" }}>{p}</p>
        ))}
      </div>

      {/* 行动清单 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">行动清单</h2>
        {"以下是改善3C电子品类 AI 可见度的 30 天行动计划：\n\n□ 第1周：审计你当前的 AI 可见度——在所有 4 个 AI 引擎上运行你的前 10 个关键词查询\n□ 第1周：绘制竞争对手 SOV——确定 AI 推荐了谁而不是你，以及原因\n□ 第2周：优化产品页面——添加结构化数据、FAQ 部分和对比表\n□ 第2周：启动评价活动——目标获得 50 多条提及具体使用场景的详细评价\n□ 第3周：创建权威内容——发布 3 篇针对高流量 AI 查询的对比指南\n□ 第3周：在 Reddit 参与互动——在 5 个以上相关子版块中提供真实价值\n□ 第4周：衡量影响——重新运行 AI 可见度审计并跟踪 SOV 变化\n□ 第4周：迭代——在 SOV 改善最快的渠道上加倍投入\n\n想要个性化方案？在 avanti.so/audit 免费运行 AI 审计".split("\n\n").map((p, i) => (
          <p key={i} className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#7070a0" }}>{p}</p>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-xl p-6 text-center space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <p className="text-sm font-medium">想查看你的品牌在该品类的 AI 可见度？</p>
        <p className="text-xs" style={{ color: "#7070a0" }}>免费运行 GEO 审计，对比你的品牌与所有竞品。</p>
        <Link href="/zh/audit" className="inline-block text-sm font-medium px-5 py-2 rounded-lg transition-opacity hover:opacity-80" style={{ background: "#ff6b35", color: "#fff" }}>立即免费诊断 →</Link>
      </div>
    </div>
  );
}
