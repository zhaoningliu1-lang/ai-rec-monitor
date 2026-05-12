import Link from "next/link";

export const metadata = {
  title: "AI趋势：本周领先电商品类揭秘 | Avanti",
  description: "探索AI驱动的产品趋势及品牌可见性，助力本周跨境卖家。",
};

export default function BlogPost20260512AiRecommendationTrendsZh() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* 头部 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            电商趋势
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>2026年5月12日 · 5 分钟阅读</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI趋势：本周领先电商品类揭秘
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          本周，ChatGPT、Claude、Gemini 和 Perplexity等AI模型对电子产品和时尚表现出强烈兴趣。数据显示，顶级品牌的AI驱动推荐增加了22%。
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>电子产品推荐增加22%。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>时尚品类AI可见性上升18%。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>索尼在电子产品中通过AI获得15%SOV。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>耐克在时尚推荐中以12%SOV领先。</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">电子产品主导AI推荐</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          本周，电子产品在AI生成的推荐中大幅上升，环比增长22%。索尼等品牌在AI领域占据了15%的声音份额（SOV）。此趋势表明卖家应优化其列表，使用AI推荐的常用术语进行优化。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">时尚品类吸引AI关注</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          时尚紧随其后，AI驱动上升了18%。耐克特别在AI模型中达到了12%的SOV，成为讨论焦点。确保产品描述的详细和更新将进一步提升此增长品类的可见性。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">家居产品：AI兴趣新起点</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          虽然不如电子和时尚品类，家居产品的AI推荐提升了10%。宜家被指出占据了6%的SOV。扩展家居装饰产品范围和战略性面向AI的营销策略可以利用这种新趋势。
        </p>
      </div>

      {/* 数据快照 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI 推荐数据快照</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>2026年5月12日 · Avanti 平台数据</p>
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
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>15%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>在AI推荐中激增</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">耐克</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>12%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>在时尚AI可见性中领先</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">宜家</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>6%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>家居产品兴趣增长</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">阿迪达斯</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>4%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>在时尚中份额稳定</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">惠普</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>3%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>回避</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>AI参与度最低</td>
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
