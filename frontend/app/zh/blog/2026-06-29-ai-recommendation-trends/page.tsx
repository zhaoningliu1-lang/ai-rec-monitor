import Link from "next/link";

export const metadata = {
  title: "AI 的推荐：跨境电商趋势 | Avanti",
  description: "探索AI对跨境电商中推荐的主要品类。",
};

export default function BlogPost20260629AiRecommendationTrendsZh() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* 头部 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            电子商务
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>2026年6月29日 · 5 分钟阅读</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI 的推荐：跨境电商趋势
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          在过去一周，AI模型影响了跨境电商市场。ChatGPT在个人护理品类的推荐增加了42%。Claude、Gemini和Perplexity也显示出变化。
        </p>
      </div>

      {/* 关键发现 */}
      <div
        className="rounded-xl p-6 space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #ff6b35" }}
      >
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          关键发现
        </div>
        <ul className="space-y-2 text-sm" style={{ color: "#f0f0f8" }}>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>ChatGPT推荐个人护理，兴趣增加42%。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Claude看到电子产品的SOV上升38%。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Gemini突出时尚，增加31%。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Perplexity建议家用厨房，激增29%。</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">ChatGPT推动个人护理增长</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          在过去的一周内，ChatGPT推动了个人护理产品42%的推荐增长。像Olay和L&apos;Oreal这样的品牌在消费者中获得了吸引力。这一趋势为亚马逊卖家提供了在护肤和美容产品领域扩展产品种类和抓住新兴需求的机会。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Claude对电子产品的关注</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Claude的数据表明电子产品的SOV出现了38%的显著增长。三星和苹果等品牌得到突显。卖家应优先优化清单和库存更新，以利用这一类别的提高知名度和消费者兴趣。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Gemini和Perplexity的品类变化</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Gemini指出时尚服装的推荐增加了31%，齐拉等品牌出现了增长。同时，Perplexity指出家用厨房产品增长了29%，关注点如Instant Pot。这些洞察建议在这些蓬勃发展的品类中采用多样化的销售策略。
        </p>
      </div>

      {/* 数据快照 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI 推荐数据快照</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>2026年6月29日 · Avanti 平台数据</p>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <th className="text-left p-4 font-medium" style={{ color: "#7070a0" }}>品牌 / 品类</th>
                <th className="text-center p-4 font-medium" style={{ color: "#7070a0" }}>AI 指标</th>
                <th className="text-center p-4 font-medium" style={{ color: "#7070a0" }}>信号</th>
                <th className="text-left p-4 font-medium" style={{ color: "#7070a0" }}>洞察</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">个人护理</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>42%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>受ChatGPT推荐影响</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">电子产品</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>38%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>在Claude的数据中突显</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">时尚服装</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>31%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Gemini突出</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">家用厨房</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>29%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Perplexity的选品增长显著</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">玩具游戏</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>15%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>回避</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>低AI模型推荐</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div
        className="rounded-xl p-8 text-center space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="font-semibold text-lg">追踪你的品牌 AI 可见度</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          免费 GEO Score 诊断——查看你的品牌在 ChatGPT、Claude、Gemini、Perplexity
          的提及率与市场份额。
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/zh/signup"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            免费诊断 →
          </Link>
          <Link
            href="/zh/blog"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            更多报告 →
          </Link>
        </div>
      </div>
    </div>
  );
}
