import Link from "next/link";

export const metadata = {
  title: "AI推荐趋势：跨境电商产品专家推荐 | Avanti",
  description: "探索AI产品推荐、品类趋势及顶级品牌。",
};

export default function BlogPost20261007AiRecommendationTrendsZh() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* 头部 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            AI推荐
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>2026年10月7日 · 6 分钟阅读</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI推荐趋势：跨境电商产品专家推荐
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          本周，AI推荐模型如ChatGPT和Claude对电子产品的推荐增加了19%。索尼和LG等品牌的可见度提升了12%。
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>ChatGPT对电子产品推荐增加19%</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>索尼电子产品SOV达到12%，居领先</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Claude更青睐家用电器，增加18%</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Perplexity的化妆品推荐可见度上升15%</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">电子产品遥遥领先</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          包括ChatGPT和Gemini在内的AI模型对电子产品的推荐增加了19%。索尼和LG尤其受益，索尼的SOV本季度首次达到12%。这是亚马逊卖家在该品类中集中营销努力的关键指标。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">家用电器的动量增加</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Claude对家用电器的推荐比上周增加了18%。像博世和惠而浦这样的品牌出现了显著的产品可见度提升，为卖家调整库存和促销策略提供了有利时机。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">化妆品受AI关注激增</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Perplexity对化妆品的推荐增加了15%，巴黎欧莱雅领先。这一变化表明美容板块的卖家有强劲的机会提升产品列表并抓住不断增长的兴趣。
        </p>
      </div>

      {/* 数据快照 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI 推荐数据快照</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>2026年10月7日 · Avanti 平台数据</p>
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
                <td className="p-4 font-medium text-sm">索尼</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>12%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>在电子产品中的可见度提升</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">LG</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>9%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>电子产品中的潜力</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">博世</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>7.5%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>家用电器中的增长</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">惠而浦</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>6.8%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>回避</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>可见度停滞</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">巴黎欧莱雅</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>11%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>在化妆品中的上升</td>
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
