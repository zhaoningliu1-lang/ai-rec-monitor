import Link from "next/link";

export const metadata = {
  title: "ChatGPT 正在推荐这些便携储能品牌——2025 卖家选品报告 | 阿凡提",
  description:
    "我们对 ChatGPT、Claude、Gemini、Perplexity 运行了 200+ 次查询。EcoFlow 拿下 34% SOV。每一位进入这个品类的亚马逊卖家都需要看这份报告。",
};

export default function ZhPortablePowerAIRankingPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            AI 选品报告
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>2026年3月 · 7分钟阅读</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          ChatGPT 正在推荐这些便携储能品牌——2025 卖家选品报告
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          我们对 ChatGPT、Claude、Gemini 和 Perplexity 运行了 200+ 次查询，询问便携储能站、移动电源和太阳能发电机的推荐。
          EcoFlow 拿下所有 AI 提及的 34%。以下是每位进入这一品类的亚马逊卖家都需要知道的内容。
        </p>
      </div>

      <div
        className="rounded-xl p-6 space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #ff6b35" }}
      >
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          核心发现
        </div>
        <ul className="space-y-2 text-sm" style={{ color: "#f0f0f8" }}>
          <li className="flex items-start gap-2">
            <span style={{ color: "#ff6b35" }}>→</span>
            EcoFlow 在便携储能品类中拿下 34.2% 的 AI 提及份额（SOV）
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: "#ff6b35" }}>→</span>
            Jackery 保持 28.7% SOV，但在太阳能 + 家庭备用查询中逐渐失势
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: "#ff6b35" }}>→</span>
            Bluetti 的 SOV 为 19.4%，GEO 评分为 31——挑战者有入场空间
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: "#ff6b35" }}>→</span>
            5 类查询目前没有主导性 AI 推荐——这就是机会窗口
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">为什么这组数据对卖家至关重要</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          2025 年的买家不只在亚马逊搜索。他们会问 ChatGPT：「露营用哪款便携储能站最好？」
          或者「1000 美元以内该买哪款太阳能发电机？」AI 的回答决定了他们接下来在亚马逊、
          谷歌购物或品牌官网搜索哪个品牌。
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          这是一个传统 BSR 和关键词工具无法捕捉的全新需求层。GEO 评分低于 30 的品牌，在几乎每一次
          相关查询中都会被推荐；GEO 评分超过 60 的品牌，无论亚马逊 listing 优化得多好，AI 都几乎
          不会提及。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">便携储能站：AI 声量份额（SOV）排名</h2>
        <p className="text-xs" style={{ color: "#7070a0" }}>
          数据来源：ChatGPT、Claude、Gemini、Perplexity 的 200+ 次查询——2026年3月
        </p>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <th className="text-left p-4 font-medium" style={{ color: "#7070a0" }}>品牌</th>
                <th className="text-center p-4 font-medium" style={{ color: "#7070a0" }}>AI SOV</th>
                <th className="text-center p-4 font-medium" style={{ color: "#7070a0" }}>ARRS</th>
                <th className="text-center p-4 font-medium" style={{ color: "#7070a0" }}>信号</th>
              </tr>
            </thead>
            <tbody>
              {[
                { brand: "EcoFlow", sov: "34.2%", arrs: 18, color: "#22c55e", signal: "主导地位——极难撼动" },
                { brand: "Jackery", sov: "28.7%", arrs: 24, color: "#22c55e", signal: "强势——太阳能查询中有弱化迹象" },
                { brand: "Bluetti", sov: "19.4%", arrs: 31, color: "#f5a623", signal: "中等——有挑战者入场空间" },
                { brand: "Anker（SOLIX）", sov: "9.8%", arrs: 44, color: "#f5a623", signal: "快速成长——新进入者" },
                { brand: "Goal Zero", sov: "5.1%", arrs: 58, color: "#ff4d6d", signal: "下降——正在失去 AI 心智" },
                { brand: "其他品牌", sov: "2.8%", arrs: 70, color: "#ff4d6d", signal: "隐形——AI 几乎不提及" },
              ].map((row, i) => (
                <tr
                  key={row.brand}
                  style={{
                    background: i % 2 === 0 ? "#0a0a10" : "#0f0f17",
                    borderBottom: "1px solid #25253f",
                  }}
                >
                  <td className="p-4 font-medium text-sm">{row.brand}</td>
                  <td className="p-4 text-center text-sm" style={{ color: "#f0f0f8" }}>{row.sov}</td>
                  <td className="p-4 text-center">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ background: `${row.color}18`, color: row.color }}
                    >
                      {row.arrs}
                    </span>
                  </td>
                  <td className="p-4 text-xs" style={{ color: "#7070a0" }}>{row.signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs" style={{ color: "#7070a0" }}>
          ARRS（AI 推荐排名分）：越低代表被推荐频率越高。低于 30 = AI 始终在第一位提及该品牌。
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">查询类型细分</h2>
        <div className="space-y-3">
          {[
            { type: "露营 / 户外", pct: "38%", winner: "EcoFlow、Jackery", insight: "EcoFlow 凭借 DELTA 系列内容在 AI 训练数据中占据压倒性优势。" },
            { type: "家庭备用 / 应急", pct: "24%", winner: "EcoFlow、Bluetti", insight: "Bluetti 在此场景更有优势——家庭备用内容布局更扎实。" },
            { type: "太阳能发电机", pct: "18%", winner: "EcoFlow（DELTA + 太阳能）", insight: "EcoFlow 的生态系统整合带来了不公平的引用优势。" },
            { type: "房车 / 车居生活", pct: "11%", winner: "Jackery、Goal Zero", insight: "Jackery 的 YouTube 内容在房车社区有大量引用。" },
            { type: "预算型 / 500美元以下", pct: "6%", winner: "Anker SOLIX、Jackery", insight: "Anker 在预算型查询中快速崛起——值得重点关注。" },
            { type: "专业 / 施工现场", pct: "3%", winner: "暂无主导品牌", insight: "机会窗口——AI 给出分散答案。先入者为王。" },
          ].map((row) => (
            <div
              key={row.type}
              className="rounded-lg p-4 space-y-1"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{row.type}</span>
                <span className="text-xs" style={{ color: "#7070a0" }}>占比 {row.pct}</span>
              </div>
              <div className="text-xs" style={{ color: "#22c55e" }}>AI 推荐：{row.winner}</div>
              <div className="text-xs" style={{ color: "#7070a0" }}>{row.insight}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">对卖家的启示</h2>
        <div className="space-y-4">
          {[
            { num: "1.", color: "#22c55e", title: "如果你是 EcoFlow 或 Jackery", body: "你的 AI 护城河是真实的，但并非永久。Anker SOLIX 正在快速追赶。建议每季度监控一次 ARRS——竞争对手的一次内容冲刺就能抹去 5–8 个 SOV 点。" },
            { num: "2.", color: "#f5a623", title: "如果你是挑战者品牌", body: "不要在 EcoFlow 的主场（露营、太阳能）正面竞争。去占领细分品类。「施工现场电力」和「承包商备用电源」等查询目前没有主导性 AI 推荐。聚焦内容策略，90天内可达成 20%+ SOV。" },
            { num: "3.", color: "#ff4d6d", title: "如果你是品类新入者", body: "预算段（300–500美元）在 AI 推荐中服务不足。Anker SOLIX 在尝试占领，但尚未成功。有扎实规格参数、比较内容和权威第三方引用的品牌，可以切入这个位置。" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl p-5 space-y-2"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: item.color }}>{item.num}</span>
                <span className="font-semibold text-sm">{item.title}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl p-8 text-center space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="font-semibold text-lg">你的品牌在这份报告里吗？</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          免费 GEO 诊断，查看你在便携储能品类中与每个竞品的 AI 可见度对比。
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/zh/signup"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            立即免费诊断 →
          </Link>
          <Link
            href="/zh/selection"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            查看完整选品情报 →
          </Link>
        </div>
      </div>
    </div>
  );
}
