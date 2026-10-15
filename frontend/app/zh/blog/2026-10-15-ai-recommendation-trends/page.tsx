import Link from "next/link";

export const metadata = {
  title: "AI趋势：本周跨境电商推荐的热门产品 | Avanti",
  description: "了解卖家应关注的AI推荐产品类别及其SOV数据。",
};

export default function BlogPost20261015AiRecommendationTrendsZh() {
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
          <span className="text-xs" style={{ color: "#7070a0" }}>2026年10月15日 · 6 分钟阅读</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI趋势：本周跨境电商推荐的热门产品
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          本周，AI模型如ChatGPT和Claude显示对家居和厨房类产品的偏好增加，占据25.4%的SOV。随着AI影响力的增长，跟踪推荐趋势对于希望优化产品的亚马逊卖家至关重要。
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>家居和厨房以25.4% SOV领先，比上周增长3.2%。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>电子产品的AI推荐下降到17.8%，减少4.5%。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Gemini对健康和个人护理产品显示22%的偏好。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Perplexity的时尚选择SOV上升6.3%。</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI产品推荐的变化</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          AI模型如ChatGPT和Claude已将重点转移到家居和厨房类产品，该类别现以25.4%的SOV领先。这比上周增长了3.2%，表明消费者对即将到来的假日季的兴趣增加。相比之下，电子产品类别SOV下降了4.5%，降至17.8%。卖家应考虑据此调整库存和营销策略。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Gemini对健康和个人护理的强烈偏好</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Gemini显示出对健康和个人护理产品的显著22%倾向。这一趋势受益于持续的健康意识运动所推动的消费者需求增长。像高露洁和宝洁这样的品牌在AI模型中由于强调健康益处而增加了可见度。此类别的卖家可通过在产品描述和SEO策略中强化健康益处来利用这一趋势。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">时尚品类通过AI推荐提升的SOV</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          根据Perplexity的数据显示，时尚品类的SOV显著上升了6.3%。随着秋季趋势的出现，AI模型推荐时尚和季节性服装。巴塔哥尼亚和哥伦比亚等品牌正在获得关注，可能是由于其广泛的秋季新品。卖家应聚焦于季节性关键字，并考虑推出战略性促销活动来捕捉这一时机。
        </p>
      </div>

      {/* 数据快照 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI 推荐数据快照</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>2026年10月15日 · Avanti 平台数据</p>
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
                <td className="p-4 font-medium text-sm">家居和厨房</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>25.4%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>SOV领先类目</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">电子产品</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>17.8%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>SOV减少</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">健康和个人护理</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>22%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>AI偏好高</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">时尚</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>18.5%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>季节性需求增加</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">玩具和游戏</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>11%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>回避</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>相比其他类别SOV较低</td>
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
