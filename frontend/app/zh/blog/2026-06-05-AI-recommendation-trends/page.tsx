import Link from "next/link";

export const metadata = {
  title: "AI推荐：本周跨境电商趋势 | Avanti",
  description: "了解AI偏好的产品类别及卖家见解。",
};

export default function BlogPost20260605AiRecommendationTrendsZh() {
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
          <span className="text-xs" style={{ color: "#7070a0" }}>2026年6月5日 · 5 分钟阅读</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI推荐：本周跨境电商趋势
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          本周，诸如ChatGPT和Claude这样的AI频推电子产品和服装，偏爱三星和耐克等品牌。份额数据分析揭示了电商卖家的关键见解。
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>电子产品以40%的份额领先推荐。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>三星在AI驱动建议中占15%的份额。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>服装的推荐量增加了30%。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>耐克在服装品牌中占有12.5%的份额。</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">电子产品在AI推荐中占据主导</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          本周，电子品类在AI推荐中占据40%的份额，ChatGPT和Claude频繁建议高科技产品。以三星为首，占15%的建议率。苹果和索尼等品牌也在崛起，显示出由AI趋势引导的强大消费者兴趣。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI偏好中的服装崛起</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          本周，服装类别的AI推荐量增加了30%。耐克以12.5%的份额领先，其次是阿迪达斯。这一增长部分归功于季节性趋势和AI型号Gemini推荐的新产品发布。此领域卖家应考虑提升产品可见性以把握这一势头。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI模型及其品牌偏好</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          如Perplexity的AI模型显著影响品牌能见度，偏好那些保持一致参与和创新营销策略的品牌。目前的AI分析显示，偏好那些在客户体验和可持续性方面表现优异的品牌，这是卖家需纳入其策略的重要因素。
        </p>
      </div>

      {/* 数据快照 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI 推荐数据快照</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>2026年6月5日 · Avanti 平台数据</p>
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
                <td className="p-4 font-medium text-sm">三星</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>15%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>电子产品中份额高。</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">苹果</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>10%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>AI提及量适度增加。</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">耐克</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>12.5%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>服装品牌中领先推荐。</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">索尼</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>8%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>检测到兴趣增长。</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">阿迪达斯</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>7%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>本周推荐率稳定。</td>
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
