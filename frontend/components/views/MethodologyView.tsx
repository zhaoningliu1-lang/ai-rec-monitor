import { Lang } from "@/lib/i18n";

interface Props {
  lang: Lang;
}

const CONTENT = {
  en: {
    title: "Methodology",
    subtitle: "Exactly how an Avanti scan measures AI visibility — so you can defend every number in the report.",
    sections: [
      {
        h: "1 · What we measure",
        p: "When a buyer asks ChatGPT or Claude for a recommendation, either your brand is in the answer or a competitor's is. A scan sends a controlled panel of real buyer questions to the AI engines and records, verbatim, what comes back. Every score in the report is computed from those raw responses — all of which you can read, unedited, in the Response Explorer.",
      },
      {
        h: "2 · How the questions are built",
        p: "You pick a department (e.g. \"Automotive accessories\"); nobody shops by department, so we first resolve your brand to the category a buyer actually types — e.g. Vantrue → \"dash cam\", Cal.com → \"scheduling software\". The category we measured is printed at the top of every report as “Measured as”. Questions are then drawn from three intent tiers: High Intent (ready to buy, weighted 1.5×), Comparison (weighing options, 1.2×), and Informational (researching, 1.0×). Consumer categories additionally sample generational phrasings (Gen Z social-driven queries through Boomer trust-driven queries). No question ever names your brand — the AI must bring you up on its own.",
      },
      {
        h: "3 · Engines and versions",
        p: "Free scans query OpenAI (gpt-4o-mini) and Anthropic Claude (claude-fable-5) with neutral system prompts — the engine answers exactly as it would answer a real user, and is never told a measurement is happening. Paid monitoring adds Gemini and Perplexity. Every run is date-stamped (top of the report); AI answers drift over time, which is precisely why visibility is worth monitoring.",
      },
      {
        h: "4 · Mention detection",
        p: "Latin-script brand names must appear as whole words (\"Sudowrite\" never matches the word \"write\"). Chinese/Japanese/Korean names match as substrings, since those scripts don't delimit words. Known aliases (绿联 ↔ UGREEN) count as the same brand.",
      },
      {
        h: "5 · The scores",
        p: "AI Visibility Score = your intent-weighted share of voice (0–100) among the brands tracked in this scan — it is relative to the competitors you listed, not an absolute market number. Mentions = the count of AI answers naming you, out of all answers sampled. AI Recommendation Risk = how far you trail the strongest competitor per intent tier, weighted (0 = no gap; requires competitors to mean anything). Sentiment is a directional keyword-window signal — treat it as a hint, not a verdict.",
      },
      {
        h: "6 · Sampling honesty",
        p: "A free scan is 15 questions × 2 engines = 30 answers. That is enough to see structure (who dominates, where your gaps are) but individual scores can move roughly ±8 points between runs — AI engines are not deterministic. Paid monitoring runs larger panels on a schedule and reports trends, which is where the signal gets sharp. If a number surprises you, run it again before you act on it.",
      },
      {
        h: "7 · Fair use",
        p: "Anonymous: 3 free scans per day. Free account: 8 per day. Paid plans: unlimited. Each scan costs us real inference — the caps keep the free tier alive.",
      },
    ],
    cta: "Run a free scan →",
  },
  zh: {
    title: "测量方法",
    subtitle: "Avanti 扫描如何测量 AI 可见度——让报告里的每个数字都经得起追问。",
    sections: [
      {
        h: "1 · 我们测什么",
        p: "当买家向 ChatGPT 或 Claude 要推荐时，答案里要么有你的品牌，要么有竞品的。一次扫描向 AI 引擎发送一组受控的真实买家问题，并逐字记录返回内容。报告里的每个分数都由这些原始回答计算而来——全部原文可在 Response Explorer 里查看，未经删改。",
      },
      {
        h: "2 · 问题怎么来的",
        p: "你选择的是\"部门\"（如\"汽车配件\"），但没人按部门购物——我们先把你的品牌解析成买家真正会输入的品类：Vantrue →\"行车记录仪（dash cam）\"、Cal.com →\"日程安排软件\"。本次实际测量的品类会印在每份报告顶部（\"Measured as\"）。问题分三个意图层：高意图（准备购买，权重 1.5×）、对比（权衡选项，1.2×）、信息（调研阶段，1.0×）。消费品类还会按代际采样（Gen Z 的社交化问法到 Boomer 的信任向问法）。任何问题都不会点名你的品牌——AI 必须自己提到你才算数。",
      },
      {
        h: "3 · 引擎与版本",
        p: "免费扫描查询 OpenAI（gpt-4o-mini）与 Anthropic Claude（claude-fable-5），系统提示保持中立——引擎按回答真实用户的方式回答，且不知道正在被测量。付费监测增加 Gemini 与 Perplexity。每次运行都有日期戳（报告顶部）；AI 的回答会随时间漂移，这正是可见度值得持续监测的原因。",
      },
      {
        h: "4 · 提及判定",
        p: "拉丁字母品牌名必须以完整词出现（\"Sudowrite\"永远不会匹配到 \"write\" 这个词）。中/日/韩品牌名按子串匹配（这些文字不以空格分词）。已知别名（绿联 ↔ UGREEN）计为同一品牌。",
      },
      {
        h: "5 · 分数定义",
        p: "AI 可见度评分 = 在本次扫描追踪的品牌中，你的意图加权声量份额（0–100）——它是相对于你填写的竞品的，不是绝对市场数字。提及数 = 点名你的 AI 回答数 / 抽样总数。AI 推荐风险 = 你在各意图层落后最强竞品的加权差距（0 = 无差距；不填竞品则无意义）。情感分析是关键词窗口的方向性信号——当参考，别当结论。",
      },
      {
        h: "6 · 抽样诚实度",
        p: "免费扫描为 15 个问题 × 2 引擎 = 30 条回答。足以看清结构（谁占主导、缺口在哪），但单次分数在两次运行之间可能波动约 ±8 分——AI 引擎不是确定性的。付费监测以更大样本定期运行并报告趋势，信号在趋势里才真正锋利。如果某个数字让你意外，行动之前先再跑一次。",
      },
      {
        h: "7 · 公平使用",
        p: "匿名：每天 3 次免费扫描。免费账户：每天 8 次。付费套餐：不限。每次扫描都消耗真实的推理成本——限额是为了让免费层能一直活着。",
      },
    ],
    cta: "跑一次免费扫描 →",
  },
};

export default function MethodologyView({ lang }: Props) {
  const c = CONTENT[lang === "zh" ? "zh" : "en"];
  const auditHref = lang === "zh" ? "/zh/audit" : "/audit";
  return (
    <div className="max-w-3xl mx-auto space-y-8 pt-4 pb-16">
      <div>
        <div
          className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.25)" }}
        >
          {lang === "zh" ? "透明度" : "Transparency"}
        </div>
        <h1 className="text-4xl font-black mb-3">{c.title}</h1>
        <p className="text-sm max-w-xl" style={{ color: "#7070a0" }}>{c.subtitle}</p>
      </div>

      <div className="space-y-6">
        {c.sections.map((s) => (
          <section
            key={s.h}
            className="rounded-2xl p-6"
            style={{ background: "#0f0f17", border: "1px solid #25253f" }}
          >
            <h2 className="text-base font-bold mb-2" style={{ color: "#f0f0f8" }}>{s.h}</h2>
            <p className="text-sm leading-relaxed" style={{ color: "#9a9ac0" }}>{s.p}</p>
          </section>
        ))}
      </div>

      <div className="text-center pt-2">
        <a
          href={auditHref}
          className="inline-block px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          {c.cta}
        </a>
      </div>
    </div>
  );
}
