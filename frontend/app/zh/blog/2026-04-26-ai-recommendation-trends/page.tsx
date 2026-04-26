import Link from "next/link";

export const metadata = {
  title: "在线卖家必看：AI驱动的热门产品类别推荐 | Avanti",
  description: "了解最新的AI推荐趋势，关注主要产品类别和品牌。",
};

export default function BlogPost20260426AiRecommendationTrendsZh() {
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
          <span className="text-xs" style={{ color: "#7070a0" }}>2026年4月26日 · 6 分钟阅读</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          在线卖家必看：AI驱动的热门产品类别推荐
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          在最近的分析中，AI模型如ChatGPT和Claude推动了40%的跨境电商增长。看看它们青睐哪些类别和品牌。
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
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>ChatGPT对电子产品的推荐率高出45%</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>运动器材被Claude推荐28%</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Perplexity令时尚品牌提升15%</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>家居厨房在全球SOV中领先，达到37%</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">电子产品主导AI推荐</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          ChatGPT已将电子产品识别为关键增长领域，比第二大类别多推荐了45%。索尼和三星等品牌的可见度因此提升12%。对于卖家来说，这显示出在新技术发布方面投资的良好机会。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Claude关注运动器材</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Claude的模型已转向推荐运动器材，推荐率达到28%。耐克和阿迪达斯的品牌可见度提高了10%以上。卖家可利用即将到来的夏季运动季节，优化库存。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Perplexity助力时尚的明显提升</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          Perplexity的数据驱动见解使时尚领域显著提升，品牌推荐频率增长15%。Zara和H&amp;M尤为突出，其可持续产品线受到特别强烈的推荐。卖家可以通过放大环保产品线来利用这一趋势。
        </p>
      </div>

      {/* 数据快照 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI 推荐数据快照</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>2026年4月26日 · Avanti 平台数据</p>
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
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>ChatGPT高推荐率</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">运动器材</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>28%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Claude的本季度顶级类别</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">时尚</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>15%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>Perplexity增强环保产品线</td>
              </tr>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">家居厨房</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>37%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#22c55e18", color: "#22c55e" }}>强势买入</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>全球SOV领先类别</td>
              </tr>
              <tr style={{ background: "#0a0a10", borderBottom: "1px solid #25253f" }}>
                <td className="p-4 font-medium text-sm">美容产品</td>
                <td className="p-4 text-center" style={{ color: "#f0f0f8" }}>12%</td>
                <td className="p-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "#f5a62318", color: "#f5a623" }}>观望</span></td>
                <td className="p-4 text-xs" style={{ color: "#7070a0" }}>适合高峰季节的适度推荐</td>
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
