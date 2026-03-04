import Link from "next/link";

export const metadata = {
  title: "2025 跨境卖家省钱指南：AI 能替代哪些岗位 | 阿凡提",
  description:
    "大多数跨境品牌每月花 800–2000 美元雇人做 AI 几秒钟就能搞定的事情。以下是哪里可以省钱——以及如何把这笔钱投入 GEO 形成复利。",
};

export default function ZhAICostGuide2025Page() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            运营指南
          </span>
          <span className="text-xs" style={{ color: "#7070a0" }}>2026年3月 · 6分钟阅读</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight">
          2025 跨境卖家省钱指南：5 个 AI 现在就能替代的运营环节
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "#7070a0" }}>
          大多数跨境品牌每月花 800–2,000 美元雇人做 AI 几秒钟就能处理好的事情。
          以下是具体在哪里省钱——以及如何把节省下来的钱投入 GEO，形成长期复利。
        </p>
      </div>

      <div
        className="rounded-xl p-6 space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #ff6b35" }}
      >
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#ff6b35" }}>
          一眼看清数字
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-black" style={{ color: "#f0f0f8" }}>$910</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>平均月节省额</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black" style={{ color: "#22c55e" }}>68%</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>平均 AI 可替代比例</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black" style={{ color: "#ff6b35" }}>4.5×</div>
            <div className="text-xs" style={{ color: "#7070a0" }}>省钱可支持的 GEO 月数</div>
          </div>
        </div>
        <p className="text-xs" style={{ color: "#7070a0" }}>
          基于典型跨境品牌 $15/小时人力成本和标准工作量。计算你自己的数字 →{" "}
          <Link href="/zh/optimizer" style={{ color: "#ff6b35" }}>成本优化计算器（免费）</Link>
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">为什么 2026 年这件事比以往更重要</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          跨境电商的利润空间比以往更薄。平台费在涨，物流成本难以预测，广告 CPM 持续攀升。
          与此同时，AI 现在可以处理你的团队约 70% 的重复性、依赖语言的工作。
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
          2026 年赢的品牌不只是在省钱——他们把省下来的钱重新投入 AI 可见度（GEO）。
          飞轮效应：AI 帮你省钱 → 投入 GEO → AI 更频繁地推荐你 → 自然需求增加 → 客户获取成本降低。
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold">5 个 AI 比你的团队做得更好的运营环节</h2>

        {[
          {
            num: "01",
            op: "客服——70% 可被 AI 替代",
            hours: "典型：20小时/周",
            saving: "$390/月（$15/小时）",
            tools: "ChatGPT、Claude、Intercom AI、Tidio",
            what: "AI 处理：FAQ 回复、订单状态查询、退货请求分流、评论回复草稿、延误通知。",
            whatHuman: "人工仍需处理：复杂纠纷、退款审批、需要同理心的升级案例。",
            tip: "设置 AI 起草回复，人工审核后发出。这一项就能节省 60–70% 的客服时间，而不牺牲质量。",
          },
          {
            num: "02",
            op: "选品研究与采购——60% 可被 AI 替代",
            hours: "典型：15小时/月",
            saving: "$135/月（$15/小时）",
            tools: "阿凡提 选品情报、Perplexity、带网页浏览的 Claude",
            what: "AI 处理：品类趋势分析、竞品研究、阿里巴巴/1688 供应商发现、规格对比表、MOQ 调研。",
            whatHuman: "人工仍需处理：供应商关系建立、工厂审核、样品评估。",
            tip: "用 阿凡提 选品情报，在备货前就知道 AI 正在推哪些品类。这是你选品决策的免费信号。",
          },
          {
            num: "03",
            op: "翻译与本地化——80% 可被 AI 替代",
            hours: "典型：10小时/月",
            saving: "$120/月（$15/小时）",
            tools: "Claude、GPT-4o、DeepL Pro",
            what: "AI 处理：亚马逊 listing 翻译（标题、卖点、描述）、A+ 内容、广告文案、客户邮件、包装文字、合规说明。",
            whatHuman: "人工仍需处理：母语者审核主推文案、文化细节检查。",
            tip: "提示词参考：「将这个 listing 翻译给在日本亚马逊购物的中国买家看。保留利益优先的结构，本地化习惯用语。」结果 90% 可以直接发布。",
          },
          {
            num: "04",
            op: "数据录入与报告——75% 可被 AI 替代",
            hours: "典型：20小时/月",
            saving: "$225/月（$15/小时）",
            tools: "带 CSV 上传的 Claude、Google Sheets AI、Notion AI",
            what: "AI 处理：库存对账、每周绩效报告、BSR 追踪摘要、广告支出分析、竞品价格监控。",
            whatHuman: "人工仍需处理：异常数据的战略解读、董事会级别汇报。",
            tip: "把 Seller Central 报告上传给 Claude，问：「总结上周表现，标记 BSR 下降超 10% 的 SKU，并建议优先补哪些货。」",
          },
          {
            num: "05",
            op: "GEO 内容创作——新机会",
            hours: "因情况而异",
            saving: "替代每月 500–2000 美元的代理费",
            tools: "Claude、阿凡提 GEO 推荐",
            what: "AI 处理：针对自然语言购买查询的引用优化博客文章、比较文章、FAQ 页面、产品规格指南、Reddit 风格问答内容。",
            whatHuman: "人工仍需处理：内容策略、专家事实核查、主动联系权威媒体。",
            tip: "为回答 AI 查询而创作的内容同样是 SEO 内容。你不是在 SEO 和 GEO 之间二选一——一篇写得好的比较文章两者都能服务。",
          },
        ].map((item) => (
          <div
            key={item.num}
            className="rounded-xl p-6 space-y-4"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-black mb-1" style={{ color: "rgba(255,107,53,0.4)" }}>{item.num}</div>
                <div className="font-bold text-sm">{item.op}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs" style={{ color: "#7070a0" }}>{item.hours}</div>
                <div className="text-sm font-bold" style={{ color: "#22c55e" }}>{item.saving}</div>
              </div>
            </div>
            <div className="space-y-2 text-xs" style={{ color: "#7070a0" }}>
              <div><span className="font-semibold" style={{ color: "#f0f0f8" }}>AI 处理：</span>{item.what}</div>
              <div><span className="font-semibold" style={{ color: "#f0f0f8" }}>人工仍需：</span>{item.whatHuman}</div>
              <div><span className="font-semibold" style={{ color: "#f0f0f8" }}>推荐工具：</span>{item.tools}</div>
            </div>
            <div
              className="rounded-lg p-3 text-xs"
              style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.2)" }}
            >
              <span style={{ color: "#ff6b35" }}>实操技巧：</span>
              <span style={{ color: "#7070a0" }}>{item.tip}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">复利飞轮</h2>
        <div className="rounded-xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
          <div className="flex flex-col gap-2 text-sm">
            {[
              { label: "AI 每月帮你省下 $910 运营成本", color: "#22c55e" },
              { label: "你投入 $199/月 到 阿凡提 GEO 监控", color: "#ff6b35" },
              { label: "AI 开始更频繁地推荐你的品牌", color: "#f5a623" },
              { label: "AI 驱动的自然需求增加", color: "#22c55e" },
              { label: "客户获取成本下降", color: "#f5a623" },
              { label: "更多预算释放用于 GEO 扩展", color: "#ff6b35" },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: `${step.color}20`, color: step.color }}
                >
                  {i + 1}
                </div>
                <span style={{ color: "#f0f0f8" }}>{step.label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>
            2026 年理解这个飞轮的品牌，将在 2027 年建立起几乎无法被攻破的 AI 可见度护城河。
          </p>
        </div>
      </div>

      <div
        className="rounded-xl p-6 space-y-4 text-center"
        style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.3)" }}
      >
        <div className="font-semibold">计算你的确切节省额</div>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          我们的免费成本优化计算器让你输入团队实际工时和时薪，
          精确计算节省额能覆盖几个月的 GEO 监控。
        </p>
        <Link
          href="/zh/optimizer"
          className="inline-block text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          打开成本优化计算器（免费）→
        </Link>
      </div>

      <div
        className="rounded-xl p-8 text-center space-y-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}
      >
        <p className="font-semibold text-lg">立即开始你的 AI 可见度诊断</p>
        <p className="text-sm" style={{ color: "#7070a0" }}>
          免费 ARRS 评分、SOV 拆解和竞品对比。在你的竞争对手看到数据之前，先看到。
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
            查看 AI 选品情报 →
          </Link>
        </div>
      </div>
    </div>
  );
}
