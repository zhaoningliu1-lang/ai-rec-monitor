import Link from "next/link";

export const metadata = {
  title: "AI推荐：本周热门商品类别 | Avanti",
  description: "了解本周电商中AI推荐的热门商品类别。",
};

export default function BlogPost20260410AiRecommendationTrendsZh() {
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
          <span className="text-xs" style={{ color: "#7070a0" }}>2026年4月10日 · 5 分钟阅读</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI推荐：本周热门商品类别
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          本周，ChatGPT、Claude、Gemini和Perplexity等AI模型显示，环保产品的需求增加了25%。美容和电子产品在推荐中排名靠前，品牌偏好明显转变。
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>环保产品的AI推荐增加了25%。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>本周AI对美容产品的推荐增加了19%。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>电子产品在推荐类别中占据了30%的SOV。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>由于AI的可见性，补充品类的表现提高了12%。</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">环保和可持续性影响</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          本周AI对环保产品的重视增加了25%，建议零售商优先考虑可持续包装。像Seventh Generation和The Honest Company这样的品牌的SOV增加了32%，这可能是由于这些模型指出的消费者偏好变化。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">新星：美容产品</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          美容产品的AI推荐增加了19%，护肤品和化妆品占优势。雅诗兰黛和欧莱雅位居前列，各自的品牌可见性增长超过5%。AI趋势指向有机和多功能产品的兴趣扩大。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">电子产品与AI影响</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          电子产品仍然是推荐的热门类别，占据30%的SOV。像索尼和三星这样的品牌受到青睐，分别增长了3%和4%的可见性。该类别的持久力归因于持续的创新和AI驱动的消费电子偏好洞察。
        </p>
      </div>

      {/* 数据快照 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI 推荐数据快照</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>2026年4月10日 · Avanti 平台数据</p>
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
                <td className="p-4 font-medium text-sm">Seventh Generation</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>32%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>环保意识提升品牌SOV</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">欧莱雅</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>5.2%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>对有机美容的兴趣上升</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">索尼</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>3%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>科技创新带来的强劲地位</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">亚马逊Basics</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>1.5%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>回避</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>AI兴趣下降</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">Fitbit</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>4.7%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>健康科技的吸引力增加</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">The Honest Company</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>12%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>受可持续性趋势推动</td>
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
