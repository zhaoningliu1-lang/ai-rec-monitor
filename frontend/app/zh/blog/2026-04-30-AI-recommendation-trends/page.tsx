import Link from "next/link";

export const metadata = {
  title: "AI趋势：跨境电商中的热门产品类别 | Avanti",
  description: "探索本周AI推荐趋势和热门产品类别。",
};

export default function BlogPost20260430AiRecommendationTrendsZh() {
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
          <span className="text-xs" style={{ color: "#7070a0" }}>2026年4月30日 · 5 分钟阅读</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI趋势：跨境电商中的热门产品类别
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          本周，ChatGPT、Claude和Gemini等AI模型在跨境电商中对某些产品类别的偏好有所增加。电子产品以27%的推荐率领先，其次是健康补品的18%。
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>电子产品以27%的AI推荐率占据主导地位</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>健康补品的AI偏好增加了18%</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>时尚品牌在AI模型中占据14%的声量</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>家居用品上升11%，进入AI的热门推荐类别</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI模型偏爱电子产品</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          在本周的AI推荐中，电子产品一直保持领先地位。以27%的份额，该类别主要由三星和苹果等消费电子品牌推动。由于这些品牌的技术进步和消费者需求指标，ChatGPT和Claude表现出明显偏好。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">健康补品获得关注</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          健康补品在AI模型中的关注度增加，目前占推荐的18%。如Nature&apos;s Bounty和Optimum Nutrition等品牌领跑此趋势。这一趋势反映了消费者对健康产品的意识和需求增加。Perplexity的推荐引擎特别强调了这些品牌，因为它们的高参与率。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">新兴类别：时尚和家居用品</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          时尚和家居用品是AI推荐中显著增加的新兴类别。时尚领域占据了14%的声量，像耐克和Zara等品牌利用AI算法提高品牌知名度。在现代家居美学的消费者兴趣上升的推动下，家居用品的推荐率上升了11%。
        </p>
      </div>

      {/* 数据快照 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI 推荐数据快照</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>2026年4月30日 · Avanti 平台数据</p>
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
                <td className="p-4 font-medium text-sm">消费电子产品</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>27%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>因技术进步成为AI优先事项</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">健康补品</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>18%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>健康趋势增长提升潜力</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">时尚</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>14%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>随着AI关注增长，考虑投资</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">家居用品</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>11%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>消费者兴趣的增加使其具有吸引力</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">玩具和游戏</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>6%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>回避</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>AI推荐中的兴趣下降</td>
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
