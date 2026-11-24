import Link from "next/link";

export const metadata = {
  title: "AI推荐：电商中的热门品类 | Avanti",
  description: "探索AI驱动的产品类别趋势和亚马逊的SOV数据。",
};

export default function BlogPost20261124AiRecommendationTrendsZh() {
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
          <span className="text-xs" style={{ color: "#7070a0" }}>2026年11月24日 · 5 分钟阅读</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          AI推荐：电商中的热门品类
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          本周，AI推荐引擎如ChatGPT、Claude和Gemini主要关注电子产品、美妆和家居用品。这些品类在跨境平台上的推荐份额超过65%。
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>电子产品的AI推荐增长30%。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>美妆产品的品牌SOV增长25%。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>家居用品的跨境可见度提高20%。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>AI平台预计智能家居设备需求强劲。</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">电子产品引领AI推荐</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          AI模型如ChatGPT和Perplexity展示了对电子产品的空前关注，几乎占据了全部推荐的45%。值得注意的是，索尼和三星等品牌的可见度增加了30%。该类卖家应优化其列表以提高AI可发现性。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">美妆产品需求上升</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          美妆行业的SOV增长了25%，得益于AI趋势青睐护肤品和化妆品。像L&apos;Oréal和Estée Lauder等品牌引领了这一增长，建议卖家利用网红合作和精美产品图片以保持竞争力。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">家居用品：下一个前沿</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          随着Gemini等AI平台对家居用品的关注，推荐量增加了20%，突显了该类别的潜力。具体而言，智能家居设备受到关注，为跨境卖家提供了拓展市场的机会。
        </p>
      </div>

      {/* 数据快照 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI 推荐数据快照</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>2026年11月24日 · Avanti 平台数据</p>
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
                <td className="p-4 font-medium text-sm">电子产品</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>45%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>AI模型高度关注</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">美妆产品</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>25%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>SOV增加显示潜力</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">家居用品</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>20%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>智能设备兴趣增长</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">时尚</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>15%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#ff4d6d18", color: "#ff4d6d" }}>回避</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>AI兴趣降低</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">玩具和游戏</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>10%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>注意到季节性波动</td>
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
