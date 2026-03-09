import Link from "next/link";

export const metadata = {
  title: "Helium 10 vs 阿凡提：传统选品工具 vs AI 可见度监控 | 阿凡提",
  description:
    "Helium 10 告诉你上个月卖了什么。阿凡提 告诉你 AI 今天正在推荐什么。以下是每种工具的适用场景——以及为什么认真做跨境的卖家两个都需要。",
};

export default function ZhHelium10VsAvantiPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            工具对比
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>2026年3月 · 5分钟阅读</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          Helium 10 vs 阿凡提：传统选品工具 vs AI 可见度监控
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          Helium 10 是为亚马逊算法打造的。阿凡提 是为 AI 推荐层打造的。
          它们回答的是不同的问题。以下是每种工具的适用场景，以及为什么最聪明的卖家两个都在用。
        </p>
      </div>

      <div
        className="rounded-xl p-5 space-y-3"
        style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.3)" }}
      >
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          一句话总结
        </div>
        <ul className="space-y-2 text-xs" style={{ color: "#f0f0f8" }}>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Helium 10：追踪亚马逊平台上的历史需求信号（BSR、搜索量、评论）</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Avanti：追踪 AI 模型现在正在把未来买家引向哪里</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>Helium 10 告诉你什么有效过。Avanti 告诉你什么正在来。</li>
          <li className="flex items-start gap-2"><span style={{ color: "#ff6b35" }}>→</span>两者不互相替代——它们在衡量购买漏斗的不同层级。</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">核心区别：历史需求 vs 未来需求</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
            <div className="font-bold text-sm">Helium 10</div>
            <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
              读取亚马逊平台数据——搜索量、BSR 历史、评论速度、竞品销售额估算。
              所有数据都基于买家过去 30–90 天在亚马逊上的行为。
            </p>
            <div className="text-xs font-semibold" style={{ color: "#22c55e" }}>
              回答：「买家搜索了什么、买了什么？」
            </div>
          </div>
          <div className="rounded-xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #ff6b35" }}>
            <div className="font-bold text-sm">Avanti</div>
            <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
              对 ChatGPT、Claude、Gemini 和 Perplexity 发送买家问题，然后分析 AI 推荐了哪些品牌和品类。
              这是前瞻性的——它捕捉的是需求被引导的方向，在亚马逊数据出现之前。
            </p>
            <div className="text-xs font-semibold" style={{ color: "#ff6b35" }}>
              回答：「AI 现在正在告诉买家购买什么？」
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">功能对比</h2>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "#0f0f17", borderBottom: "1px solid #25253f" }}>
                <th className="text-left p-4 font-medium" style={{ color: "#7070a0" }}>功能</th>
                <th className="text-center p-4 font-medium">Helium 10</th>
                <th className="text-center p-4 font-bold" style={{ color: "#ff6b35" }}>Avanti</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "数据来源", h10: "亚马逊平台", av: "ChatGPT / Claude / Gemini / Perplexity" },
                { feature: "信号类型", h10: "历史（30–90天滞后）", av: "实时 AI 推荐" },
                { feature: "BSR / 排名追踪", h10: "✓", av: "—" },
                { feature: "关键词搜索量", h10: "✓", av: "—" },
                { feature: "评论监控", h10: "✓", av: "—" },
                { feature: "Listing 优化", h10: "✓", av: "—" },
                { feature: "AI 品牌可见度（ARRS）", h10: "—", av: "✓" },
                { feature: "AI 声量份额（SOV）", h10: "—", av: "✓" },
                { feature: "竞品 AI 对标", h10: "—", av: "✓" },
                { feature: "AI 选品情报", h10: "—", av: "✓（哪些品类正被 AI 推）" },
                { feature: "GEO 优化指导", h10: "—", av: "✓" },
                { feature: "定价", h10: "$99–$279/月", av: "$79–$499/月" },
                { feature: "最适合", h10: "亚马逊运营", av: "AI 时代品牌战略" },
              ].map((row, i) => (
                <tr
                  key={row.feature}
                  style={{
                    background: i % 2 === 0 ? "#0a0a10" : "#0f0f17",
                    borderBottom: "1px solid #25253f",
                  }}
                >
                  <td className="p-4" style={{ color: "#f0f0f8" }}>{row.feature}</td>
                  <td className="p-4 text-center" style={{ color: row.h10 === "—" ? "#3a3a5c" : "#f0f0f8" }}>{row.h10}</td>
                  <td className="p-4 text-center" style={{ color: row.av === "—" ? "#3a3a5c" : "#f0f0f8" }}>{row.av}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Helium 10 看不到的盲区</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          2026 年只靠 Helium 10 的根本问题在于：它衡量亚马逊的历史数据。
          但购买决策越来越多地发生在买家到达亚马逊之前。
        </p>
        <div className="rounded-xl p-5 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
            设想这个场景：买家在 ChatGPT 搜索「150美元以内最好的运动耳机」。
            ChatGPT 推荐了 Sony、Jabra 和 Anker。买家去亚马逊搜索这些品牌。
            你的品牌——4.5 分、Helium 10 机会分 8——根本没有进入买家的考虑范围。
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
            Helium 10 无法告诉你这件事正在发生。它仍然会显示「高搜索量」——
            因为 Sony 和 Jabra 的搜索量确实很高，但那些搜索都去了你的竞争对手。
          </p>
          <p className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>
            阿凡提 展示的是 AI 层——买家搜索亚马逊之前，考虑范围在哪里形成的。
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">结论：互补，而非竞争</h2>
        <div className="rounded-xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="text-sm font-semibold">2026 年的推荐工具组合</div>
          <div className="space-y-2 text-xs" style={{ color: "#7070a0" }}>
            <div className="flex items-start gap-2">
              <span style={{ color: "#22c55e" }}>Helium 10</span>
              <span>→ 亚马逊运营、关键词研究、BSR 追踪</span>
            </div>
            <div className="flex items-start gap-2">
              <span style={{ color: "#ff6b35" }}>阿凡提</span>
              <span>→ AI 可见度、品牌对标、选品情报、GEO 战略</span>
            </div>
            <div className="flex items-start gap-2">
              <span style={{ color: "#7070a0" }}>阿凡提 成本优化器</span>
              <span>→ 免费。帮你算清楚 AI 节省下来的运营成本足够支付两个工具的订阅。</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-8 text-center space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="font-semibold text-lg">看看 AI 如何排名你的品牌 vs 竞争对手</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          免费 GEO 诊断。无需信用卡。2 分钟。看到 Helium 10 无法给你的数据。
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
            href="/zh/pricing"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            查看定价 →
          </Link>
        </div>
      </div>
    </div>
  );
}
