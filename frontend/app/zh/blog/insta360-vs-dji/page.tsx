import Link from "next/link";

export const metadata = {
  title: "Insta360 vs DJI：AI 可见度完整分析（2026）— 阿凡提",
  description:
    "当消费者向 AI 询问相机推荐时，谁赢了？我们在 ChatGPT、Claude、Gemini、Perplexity 上运行了 47 个查询，找到了答案。",
};

const ARRS_COLOR = (score: number) =>
  score < 30 ? "#22c55e" : score < 60 ? "#f5a623" : "#ff4d6d";

export default function ZhInsta360VsDjiPage() {
  return (
    <article className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/zh/blog"
          className="text-xs uppercase tracking-widest transition-colors hover:text-white"
          style={{ color: "#7070a0" }}
        >
          ← 研究报告
        </Link>

        <div
          className="inline-block text-xs px-3 py-1 rounded-full font-medium mt-4"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
        >
          GEO 案例分析
        </div>

        <h1 className="text-3xl font-bold leading-tight mt-3">
          Insta360 vs DJI：消费者向 AI 询问相机推荐时，
          <span style={{ color: "#ff6b35" }}>谁赢了？</span>
        </h1>

        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          我们在 ChatGPT、Claude、Gemini 和 Perplexity 上运行了 47 个查询——涵盖运动相机、360° 相机、旅行 Vlog 和内容创作者场景。这是每个品牌的出现位置、缺失位置，以及差距成因的完整分析。
        </p>

        <div className="flex items-center gap-6 text-xs pt-2" style={{ color: "#7070a0" }}>
          <span>阿凡提 研究团队</span>
          <span>·</span>
          <span>2026年3月</span>
          <span>·</span>
          <span>47 个查询 · 4 个 AI 引擎</span>
        </div>
      </div>

      <hr style={{ borderColor: "#25253f" }} />

      {/* Executive Summary */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">执行摘要</h2>

        <div className="grid grid-cols-2 gap-4">
          {[
            { brand: "Insta360", arrs: 52, sov: "19.4%", high: "38%", compare: "61%", consistent: "低" },
            { brand: "DJI",      arrs: 18, sov: "44.7%", high: "79%", compare: "88%", consistent: "高" },
          ].map((b) => (
            <div
              key={b.brand}
              className="rounded-xl p-5 space-y-3"
              style={{ background: "#0f0f17", border: "1px solid #25253f" }}
            >
              <div className="font-bold text-lg">{b.brand}</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "#7070a0" }}>ARRS 评分</span>
                  <span className="font-bold" style={{ color: ARRS_COLOR(b.arrs) }}>{b.arrs}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#7070a0" }}>AI 加权 SOV</span>
                  <span className="font-medium">{b.sov}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#7070a0" }}>高意向查询出现率</span>
                  <span className="font-medium">{b.high}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#7070a0" }}>比较类查询出现率</span>
                  <span className="font-medium">{b.compare}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#7070a0" }}>跨引擎一致性</span>
                  <span className="font-medium">{b.consistent}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl p-5 text-sm leading-relaxed"
          style={{ background: "rgba(245,166,35,0.07)", border: "1px solid rgba(245,166,35,0.2)", color: "#f5a623" }}
        >
          <strong>结论：</strong>DJI 的 AI 可见度是 Insta360 的 2.3 倍。Insta360 在 360° 相机查询中领先——但在几乎所有其他场景中落败。差距来自第三方内容覆盖度，而非产品质量。
        </div>
      </section>

      {/* Per-engine SOV */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">各 AI 引擎 SOV 明细</h2>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wide" style={{ background: "#161625", color: "#7070a0" }}>
              <tr>
                <th className="text-left px-4 py-3">AI 引擎</th>
                <th className="text-left px-4 py-3">Insta360</th>
                <th className="text-left px-4 py-3">DJI</th>
                <th className="text-left px-4 py-3">差距</th>
              </tr>
            </thead>
            <tbody style={{ background: "#0f0f17" }}>
              {[
                { engine: "ChatGPT (GPT-4o)",    i360: "21.3%", dji: "46.8%", gap: "−25.5pts" },
                { engine: "Claude 3.5 Sonnet",   i360: "24.1%", dji: "40.2%", gap: "−16.1pts" },
                { engine: "Gemini 1.5 Pro",      i360: "17.6%", dji: "47.3%", gap: "−29.7pts" },
                { engine: "Perplexity Pro",      i360: "14.6%", dji: "44.5%", gap: "−29.9pts" },
              ].map((row) => (
                <tr key={row.engine} style={{ borderTop: "1px solid #25253f" }}>
                  <td className="px-4 py-3 font-medium">{row.engine}</td>
                  <td className="px-4 py-3" style={{ color: "#7070a0" }}>{row.i360}</td>
                  <td className="px-4 py-3" style={{ color: "#7070a0" }}>{row.dji}</td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "#ff4d6d" }}>{row.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          Insta360 在 Claude 上表现最好——Claude 的训练数据更偏重书面评测内容，Insta360 在此有一定的垂直覆盖。Gemini 和 Perplexity 大量依赖实时网页结果，DJI 的内容体量在此占据压倒性优势。
        </p>
      </section>

      {/* Query breakdown */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">查询类型详细拆解</h2>

        <div className="space-y-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7070a0" }}>
              高意向购买类查询
            </div>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
              <table className="w-full text-sm">
                <thead style={{ background: "#161625", color: "#7070a0" }}>
                  <tr>
                    <th className="text-left px-4 py-2 text-xs">查询内容</th>
                    <th className="text-left px-4 py-2 text-xs">Insta360</th>
                    <th className="text-left px-4 py-2 text-xs">DJI</th>
                  </tr>
                </thead>
                <tbody style={{ background: "#0f0f17" }}>
                  {[
                    { q: "2026年最佳运动相机",          i: "✅ 第3位", d: "✅ 第2位" },
                    { q: "最佳360°相机",                i: "✅ 第1位（X4）", d: "⚠️ 第4位" },
                    { q: "旅行 Vlog 最佳相机",           i: "⚠️ 偶有提及", d: "✅ 第1位" },
                    { q: "极限运动最佳相机",             i: "⚠️ 偶有提及", d: "✅ 第1-2位" },
                    { q: "内容创作者最佳相机",           i: "❌ 未出现", d: "✅ 第2位" },
                    { q: "500美元以内最佳科技礼物",       i: "❌ 未出现", d: "✅ 第1位" },
                    { q: "初学者最佳相机",               i: "❌ 未出现", d: "✅ 第1位" },
                    { q: "最佳防水运动相机",             i: "✅ 第2位", d: "✅ 第1位" },
                  ].map((r) => (
                    <tr key={r.q} style={{ borderTop: "1px solid #25253f" }}>
                      <td className="px-4 py-2.5" style={{ color: "#f0f0f8" }}>{r.q}</td>
                      <td className="px-4 py-2.5 font-medium text-xs" style={{
                        color: r.i.startsWith("✅") ? "#22c55e" : r.i.startsWith("⚠️") ? "#f5a623" : "#ff4d6d",
                      }}>{r.i}</td>
                      <td className="px-4 py-2.5 font-medium text-xs" style={{
                        color: r.d.startsWith("✅") ? "#22c55e" : r.d.startsWith("⚠️") ? "#f5a623" : "#ff4d6d",
                      }}>{r.d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7070a0" }}>
              品牌认知类查询
            </div>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
              <table className="w-full text-sm">
                <thead style={{ background: "#161625", color: "#7070a0" }}>
                  <tr>
                    <th className="text-left px-4 py-2 text-xs">查询内容</th>
                    <th className="text-left px-4 py-2 text-xs">AI 回答摘要</th>
                  </tr>
                </thead>
                <tbody style={{ background: "#0f0f17" }}>
                  {[
                    { q: "Insta360 是好品牌吗？", a: 'ChatGPT："是的，尤其在360°领域。"Gemini："不错但较为小众。"Claude："在特定场景下非常出色。"' },
                    { q: "DJI 是最好的相机品牌吗？", a: '全部4个引擎："DJI 是消费级相机和无人机的行业领导者。"' },
                    { q: "为什么选Insta360而非DJI？", a: '"360°沉浸式视频、隐形自拍杆技术、强大的AI剪辑能力。"——AI能够表达这一点，但主动推荐时仍默认选择DJI。' },
                    { q: "Insta360以什么著称？", a: '"360°相机和FlowState防抖技术。"——回答准确，但在泛类查询中AI不会主动提及Insta360。' },
                  ].map((r) => (
                    <tr key={r.q} style={{ borderTop: "1px solid #25253f" }}>
                      <td className="px-4 py-2.5 font-medium w-44" style={{ color: "#f0f0f8" }}>{r.q}</td>
                      <td className="px-4 py-2.5 text-xs leading-relaxed" style={{ color: "#7070a0" }}>{r.a}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Root cause */}
      <section className="space-y-5">
        <h2 className="text-xl font-semibold">差距的根本原因</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          AI 不会独立形成观点——它综合了网络上关于某品牌的所有内容。我们追溯了每一条 DJI 引用的来源。
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
            <div className="font-semibold" style={{ color: "#22c55e" }}>DJI — 引用来源</div>
            <ul className="text-sm space-y-1.5" style={{ color: "#7070a0" }}>
              <li>The Wirecutter / NYT · 28篇评测</li>
              <li>Tom's Guide · 19篇评测</li>
              <li>Rtings.com · 14篇深度测试</li>
              <li>CNET、The Verge · 22篇文章</li>
              <li>Reddit r/videography · 400+帖子</li>
              <li>YouTube 评测元数据 · 1,200+</li>
              <li>Amazon "畅销榜" 标签 · 被AI引用</li>
            </ul>
          </div>
          <div className="rounded-xl p-5 space-y-3" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
            <div className="font-semibold" style={{ color: "#f5a623" }}>Insta360 — 引用来源</div>
            <ul className="text-sm space-y-1.5" style={{ color: "#7070a0" }}>
              <li>The Verge · 4篇（产品发布报道）</li>
              <li>Tom's Guide · 6篇（360°垂直评测）</li>
              <li>PetaPixel · 8篇（摄影圈垂直内容）</li>
              <li>Reddit · 稀少，主要在r/360cameras</li>
              <li>YouTube · 360°领域强，其他领域弱</li>
              <li className="pt-1" style={{ color: "#ff4d6d" }}>❌ 无 Wirecutter 专项评测</li>
              <li style={{ color: "#ff4d6d" }}>❌ 几乎未出现在"礼品推荐"文章中</li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl p-4 text-sm" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="font-semibold mb-2">核心洞察</div>
          <p style={{ color: "#7070a0" }}>
            当 AI 回答"旅行 Vlog 最佳相机"时，它并非基于规格参数做判断——而是在模式匹配：哪个品牌在这类表述的文章中出现最频繁。Insta360 已在<em>360°相机</em>讨论中建立了权威，但尚未进入主流<em>创作者/Vlogger/礼品</em>场景的讨论。这是内容缺口，不是产品缺口。
          </p>
        </div>
      </section>

      {/* Action plan */}
      <section className="space-y-5">
        <h2 className="text-xl font-semibold">90天内缩小差距的三项行动</h2>

        {[
          {
            priority: "P1",
            color: "#ff4d6d",
            title: "立即进入「内容创作者」场景——这是最紧迫的缺口",
            body: "Insta360 的产品本身完全符合创作者受众的需求（AI辅助剪辑、隐形自拍杆、紧凑机身）。但这一点没有体现在AI推荐里，因为主流科技媒体没有写过对应角度的文章。只需要在 Tom's Guide 或 Wirecutter 的「2026年最佳创作者相机」专题中出现一次，就能立即改变AI引用来源。",
            action: "目标媒体：Tom's Guide、Wirecutter、CNET。推介角度：「会自动剪辑的相机——为什么AI原生相机是下一代创作者工具」",
          },
          {
            priority: "P2",
            color: "#f5a623",
            title: "在主流相机社区建立 Reddit 存在感",
            body: "r/videography、r/Cameras 和 r/travel 合计超过400万成员。Perplexity 和 Claude 都大量索引 Reddit 内容。目前 Insta360 的讨论局限在 r/360cameras（9万成员）。一个结构化的社区计划——真实用户分享真实拍摄成果——就能产生 AI 所需的有机引用。",
            action: "目标社区：r/videography、r/travel、r/solotravel。方式：创作者种草计划，非付费推广。",
          },
          {
            priority: "P3",
            color: "#22c55e",
            title: "在产品页面加入 AI 可引用的事实数据",
            body: "AI 更倾向于引用具体、可核实的声明，而非品牌宣传文案。Insta360 的产品页视觉效果出众，但数据密度不足。加入结构化规格说明，例如「业界领先稳定性：6轴FlowState vs 行业标准3轴」或「全球超过200万创作者信赖」，就能给 AI 提供可引用的事实锚点。",
            action: "为 GO 4、X5 和 Ace Pro 产品页各添加一个「规格事实栏」，包含5–8条可引用数据点。",
          },
        ].map((item) => (
          <div
            key={item.priority}
            className="rounded-xl p-5 space-y-3"
            style={{ background: "#0f0f17", border: `1px solid ${item.color}30` }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${item.color}20`, color: item.color }}>
                {item.priority}
              </span>
              <span className="font-semibold">{item.title}</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>{item.body}</p>
            <div className="text-xs px-3 py-2 rounded-lg" style={{ background: "#161625", color: "#f0f0f8" }}>
              <strong style={{ color: item.color }}>行动：</strong>{item.action}
            </div>
          </div>
        ))}
      </section>

      {/* Target visual */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">90天目标</h2>
        <div className="rounded-xl p-6 space-y-5" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          {[
            { label: "Insta360（当前）",     val: 19.4, max: 50, color: "#f5a623" },
            { label: "Insta360（90天目标）", val: 32,   max: 50, color: "#ff6b35", dim: true },
            { label: "DJI（当前）",          val: 44.7, max: 50, color: "#22c55e" },
          ].map((bar) => (
            <div key={bar.label} className="space-y-1.5">
              <div className="flex justify-between text-xs" style={{ color: "#7070a0" }}>
                <span>{bar.label}</span>
                <span>{bar.val}% SOV</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "#25253f" }}>
                <div className="h-full rounded-full" style={{ width: `${(bar.val / 50) * 100}%`, background: bar.color, opacity: bar.dim ? 0.5 : 1 }} />
              </div>
            </div>
          ))}
          <p className="text-xs" style={{ color: "#7070a0" }}>
            基于 阿凡提 GEO 改善模型：在60天内完成 P1+P2 行动，通常可在一个季度内带来 +8–14pts SOV 提升。
          </p>
        </div>
      </section>

      <hr style={{ borderColor: "#25253f" }} />

      {/* CTA */}
      <div className="text-center space-y-4">
        <p className="text-base font-semibold">想为你的品牌获取同类报告？</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          我们运行完整查询组合，追溯每条引用来源，并给出优先级行动计划——完全免费，无需注册。
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/zh/audit"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            立即免费诊断 →
          </Link>
          <a
            href="https://calendly.com/brivesubscription/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            预约策略通话
          </a>
        </div>
        <div className="pt-4">
          <Link href="/zh/blog" className="text-xs transition-colors hover:text-white" style={{ color: "#7070a0" }}>
            ← 更多研究报告
          </Link>
        </div>
      </div>
    </article>
  );
}
