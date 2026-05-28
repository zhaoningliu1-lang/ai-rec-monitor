import Link from "next/link";

export const metadata = {
  title: "本周AI驱动的跨境电商推荐趋势 | Avanti",
  description: "探索本周AI推荐的顶级产品类别及其影响。",
};

export default function BlogPost20260528AiRecommendationTrendsZh() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* 头部 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            AI趋势
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>2026年5月28日 · 5 分钟阅读</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          本周AI驱动的跨境电商推荐趋势
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          本周，像ChatGPT和Claude这样的AI模型正在提升特定产品类别的可见性。过去7天，这些推荐提升了亚马逊的声音份额（SOV）达18%。
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>AI以23%提升“家居厨房”的可见性</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>由于AI趋势，“时尚”品类的推荐增长了15%</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Gemini优先电子产品，SOV增加12%</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>AI模型将“健康个人护理”SOV提高9%</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI提升家居厨房产品</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          AI模型如ChatGPT和Gemini已使“家居厨房”类别在亚马逊上的可见性增加了23%。这一增长通过对商品列表推荐的有针对性的增强来实现，尤其是智能家居设备。建议卖家优化其商品列表，采用与AI相关的关键词，以吸引日益增长的需求。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">时尚品类迎来潮流提升</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Claude和Perplexity偏爱时尚品类，导致其SOV增加了15%。专注于可持续性和流行趋势的时尚品牌获得了更高的推荐。卖家应调整库存和营销策略，以顺应AI识别的趋势并借势发展。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">电子产品获得市场份额</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          电子产品类别的SOV增长了12%，主要受到Gemini推荐的推动。高需求产品包括智能手表和耳机。随着AI关注这些产品，卖家应考虑采用动态定价策略和增强客户评价，以保持竞争力。
        </p>
      </div>

      {/* 数据快照 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI 推荐数据快照</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>2026年5月28日 · Avanti 平台数据</p>
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
                <td className="p-4 font-medium text-sm">家居厨房</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>23%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>智能家居设备关注增加</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">时尚</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>15%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>可持续性趋势增加</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">电子产品</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>12%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>关注智能手表和耳机</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">健康个人护理</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>9%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>对保健产品的重视增加</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">玩具游戏</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>-5%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>回避</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>本周兴趣下降</td>
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
