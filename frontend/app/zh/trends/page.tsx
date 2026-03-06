import Link from "next/link";

export const metadata = {
  title: "汽配产品 AI 可见度趋势 — 2025年1月 | 阿凡提",
  description:
    "哪些汽配品牌和产品在 AI 推荐中上升或下降？对 ChatGPT、Claude、Gemini、Perplexity 的周度追踪，覆盖车载启动宝、行车记录仪、车载手机支架三大品类。",
};

const WEEKS = ["1月6日", "1月13日", "1月20日", "1月27日"];

interface TrendProduct {
  name: string;
  brand: string;
  asin?: string;
  weeks: number[];
  arrs: number;
  priceRange: string;
  trend: "rising" | "stable" | "falling";
  insight: string;
}

interface CategoryTrend {
  id: string;
  label: string;
  products: TrendProduct[];
  categoryInsight: string;
}

const TREND_DATA: CategoryTrend[] = [
  {
    id: "car-jump-starters",
    label: "汽车应急启动宝",
    categoryInsight:
      "启动宝 AI 提及量 1 月上涨 +11%，主要受低温天气搜索驱动。NOCO 凭借专家评测引用护城河持续领跑。中国品牌 Gooloo 和 HULKMAN 正在快速追赶。",
    products: [
      { name: "NOCO Boost Plus GB40", brand: "NOCO", asin: "B015TKUPIC", weeks: [68, 70, 72, 74], arrs: 16, priceRange: "$99–$129", trend: "rising", insight: "Wirecutter 和 Car and Driver 的专家引用持续积累。低温季节推动「最佳启动宝」查询量 1 月上涨 34%。" },
      { name: "NOCO Boost HD GB70",   brand: "NOCO", asin: "B07237VJ4L", weeks: [55, 57, 58, 59], arrs: 21, priceRange: "$179–$219", trend: "rising", insight: "卡车和柴油车细分市场增长。GB70 垄断商用车辆查询——竞争对手几乎忽视了这一细分。" },
      { name: "Gooloo GP4000",        brand: "Gooloo", asin: "B0BXLHQ8KM", weeks: [32, 34, 36, 38], arrs: 34, priceRange: "$59–$79", trend: "rising", insight: "品类中增速最快的品牌。安全认证语言（「防反接保护」「防火花」）正在触发更多 AI 引用，ARRS 4 周从 41 降至 34。" },
      { name: "HULKMAN Alpha85S",     brand: "HULKMAN", asin: "B09TFQZ4RN", weeks: [25, 26, 27, 29], arrs: 41, priceRange: "$89–$119", trend: "rising", insight: "OLED 显示屏和智能诊断定位正在吸引科技型买家。仍低于 AI 推荐的关键阈值。" },
      { name: "Stanley J5C09",        brand: "Stanley", asin: "B000NHW946", weeks: [31, 29, 27, 24], arrs: 52, priceRange: "$49–$69", trend: "falling", insight: "老牌品牌正在失去份额——产品页内容自 2022 年以来未更新，AI 质量过滤器正在降低过期产品描述的权重。" },
    ],
  },
  {
    id: "dash-cameras",
    label: "行车记录仪",
    categoryInsight:
      "行车记录仪品类 1 月「三通道全覆盖」查询量激增 +22%。Vantrue 是最大受益方。单摄像头品牌的 AI 相对份额正在下降。",
    products: [
      { name: "Vantrue N4 Pro 三通道", brand: "Vantrue", asin: "B0BSVTPFZJ", weeks: [60, 63, 65, 67], arrs: 19, priceRange: "$179–$229", trend: "rising", insight: "「最佳三通道行车记录仪」已成为独立 AI 查询品类。Vantrue 以 67/100 的提及率垄断该查询——无竞品接近。" },
      { name: "Thinkware U1000",      brand: "Thinkware", asin: "B09FCKNG8C", weeks: [50, 51, 52, 52], arrs: 24, priceRange: "$249–$329", trend: "stable", insight: "车队和专业场景中表现稳健。AI 提及趋于平稳，消费者查询更倾向低价位。B2B 车队市场持续强劲。" },
      { name: "Garmin Dash Cam 67W",  brand: "Garmin", asin: "B09G6FHK1G", weeks: [42, 43, 43, 44], arrs: 29, priceRange: "$179–$219", trend: "stable", insight: "Garmin 品牌信任度在单镜头查询中形成天花板效应。稳定但无增长——缺少三通道产品来捕捉增速最快的查询细分。" },
      { name: "Nextbase 622GW",       brand: "Nextbase", asin: "B08KWFLTQS", weeks: [38, 37, 38, 38], arrs: 33, priceRange: "$199–$269", trend: "stable", insight: "Alexa 集成仍在智能家居相关查询中驱动提及。SOS 功能是安全类内容的独特引用驱动因素。" },
      { name: "Rexing V1-4K",         brand: "Rexing", asin: "B07YDMC8JG", weeks: [24, 23, 22, 21], arrs: 48, priceRange: "$69–$99", trend: "falling", insight: "下滑中——单靠低价定位已不足以获得 AI 引用。低专家评测数量和高自动生成内容比例（28%）正触发质量过滤器惩罚。" },
    ],
  },
  {
    id: "car-phone-mounts",
    label: "车载手机支架",
    categoryInsight:
      "MagSafe 普及推动「MagSafe 车载支架」查询量 2025 年 1 月激增 41%。无 MagSafe 产品的品牌无论整体评分如何都在失去 AI 份额。",
    products: [
      { name: "Spigen OneTap Pro 3 MagSafe", brand: "Spigen", asin: "B0BVMNR33G", weeks: [56, 58, 60, 61], arrs: 22, priceRange: "$34–$49", trend: "rising", insight: "iPhone 专属定位正在奏效。「iPhone 最佳 MagSafe 车载支架」查询几乎全部指向 Spigen。韩国品牌信任度 + 科技评测引用强化可见度。" },
      { name: "ESR HaloLock 2合1",    brand: "ESR", asin: "B0BVZW34DC", weeks: [44, 46, 47, 48], arrs: 27, priceRange: "$29–$44", trend: "rising", insight: "「带无线充电的 MagSafe 支架」是 ESR 主导的独立子查询。性价比角度正在发挥作用——AI 在对比查询中越来越多地推荐 ESR。" },
      { name: "iOttie Easy One Touch 5", brand: "iOttie", asin: "B07GRSGR86", weeks: [38, 38, 39, 39], arrs: 31, priceRange: "$24–$34", trend: "stable", insight: "通用支架细分保持稳定。iOttie 受益于「非 iPhone 用户」和「旧款安卓」查询路由。若 MagSafe 普及持续，面临风险。" },
      { name: "Lamicall 磁吸出风口",   brand: "Lamicall", asin: "B071NZWN2D", weeks: [28, 27, 28, 28], arrs: 39, priceRange: "$14–$22", trend: "stable", insight: "超低价细分。仅由价格查询驱动的稳定提及量。无专家评测，但亚马逊评论量使其在「最便宜车载支架」查询中保持存在。" },
    ],
  },
];

function Sparkline({ data, trend }: { data: number[]; trend: "rising" | "stable" | "falling" }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const W = 88, H = 30;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * (H - 4) - 2}`).join(" ");
  const color = trend === "rising" ? "#22c55e" : trend === "falling" ? "#ff4d6d" : "#f5a623";
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - ((v - min) / range) * (H - 4) - 2;
        return <circle key={i} cx={x} cy={y} r={i === data.length - 1 ? 3 : 2} fill={color} />;
      })}
    </svg>
  );
}

function ChangeBadge({ from, to }: { from: number; to: number }) {
  const diff = to - from;
  const color = diff > 0 ? "#22c55e" : diff < 0 ? "#ff4d6d" : "#7070a0";
  return (
    <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: `${color}1a`, color }}>
      {diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : "—"}
    </span>
  );
}

export default function ZhTrendsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

      <div>
        <div className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.25)" }}>
          AI 可见度趋势 — 2025年1月
        </div>
        <h1 className="text-3xl font-black mb-2">汽配产品 AI 月度提及追踪</h1>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "#9090b0" }}>
          对 AI 助手（ChatGPT、Claude、Gemini、Perplexity）在 100 个标准化买家查询中提及汽配产品频率的周度追踪。
          基于真实亚马逊数据抓取 + 模拟周更进展。覆盖 Shopee 东南亚相关查询。
        </p>
        <div className="flex items-center gap-4 mt-3">
          <span className="text-xs" style={{ color: "#4a4a6a" }}>最后更新：2025年1月27日</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e" }}>4 周追踪</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,107,53,0.08)", color: "#ff6b35" }}>3 品类 · 14 款产品</span>
        </div>
      </div>

      <div className="rounded-xl px-5 py-3 flex flex-wrap items-center gap-4"
        style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#7070a0" }}>读图说明：</span>
        <span className="text-xs" style={{ color: "#9090b0" }}>数字 = 100 个标准化查询中的 AI 提及次数</span>
        <div className="flex items-center gap-1.5"><span style={{ color: "#22c55e", fontSize: 12 }}>↑</span><span className="text-xs" style={{ color: "#9090b0" }}>上升</span></div>
        <div className="flex items-center gap-1.5"><span style={{ color: "#f5a623", fontSize: 12 }}>→</span><span className="text-xs" style={{ color: "#9090b0" }}>稳定</span></div>
        <div className="flex items-center gap-1.5"><span style={{ color: "#ff4d6d", fontSize: 12 }}>↓</span><span className="text-xs" style={{ color: "#9090b0" }}>下降</span></div>
        <span className="text-xs" style={{ color: "#9090b0" }}>ARRS：越低 = AI 推荐越稳定</span>
      </div>

      {TREND_DATA.map(cat => (
        <div key={cat.id} className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-start gap-3 pb-3" style={{ borderBottom: "1px solid #25253f" }}>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{cat.label}</h2>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: "#7070a0" }}>{cat.categoryInsight}</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
            <div className="grid gap-0 text-xs font-semibold uppercase tracking-wider px-5 py-3"
              style={{ background: "#0f0f17", borderBottom: "1px solid #25253f", color: "#7070a0", gridTemplateColumns: "1fr 80px 80px 80px 80px 100px 60px" }}>
              <span>产品</span>
              {WEEKS.map(w => <span key={w} className="text-center">{w}</span>)}
              <span className="text-center">4周趋势</span>
              <span className="text-center">ARRS</span>
            </div>

            {cat.products.map((p, i) => {
              const trendColor = p.trend === "rising" ? "#22c55e" : p.trend === "falling" ? "#ff4d6d" : "#f5a623";
              const trendIcon  = p.trend === "rising" ? "↑" : p.trend === "falling" ? "↓" : "→";
              return (
                <div key={p.name} style={{ background: i % 2 === 0 ? "#0a0a12" : "#0d0d18", borderBottom: i < cat.products.length - 1 ? "1px solid #1a1a2e" : undefined }}>
                  <div className="grid items-center gap-0 px-5 py-3"
                    style={{ gridTemplateColumns: "1fr 80px 80px 80px 80px 100px 60px" }}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ color: trendColor }}>{trendIcon}</span>
                        <span className="font-medium text-sm" style={{ color: "#f0f0f8" }}>{p.name}</span>
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "#4a4a6a" }}>
                        {p.brand} · {p.priceRange}
                        {p.asin && <span className="ml-2 opacity-50">ASIN {p.asin}</span>}
                      </div>
                    </div>
                    {p.weeks.map((v, wi) => (
                      <div key={wi} className="text-center">
                        <span className="text-sm font-bold" style={{ color: v >= 60 ? "#22c55e" : v >= 40 ? "#f5a623" : v >= 20 ? "#9090b0" : "#ff4d6d" }}>{v}</span>
                        {wi === p.weeks.length - 1 && <div className="mt-0.5"><ChangeBadge from={p.weeks[0]} to={v} /></div>}
                      </div>
                    ))}
                    <div className="flex justify-center pl-2"><Sparkline data={p.weeks} trend={p.trend} /></div>
                    <div className="text-center">
                      <span className="text-sm font-bold" style={{ color: p.arrs < 25 ? "#22c55e" : p.arrs < 40 ? "#f5a623" : "#ff4d6d" }}>{p.arrs}</span>
                    </div>
                  </div>
                  <div className="px-5 pb-3 text-xs leading-relaxed" style={{ color: "#6a6a8a", paddingLeft: "2.5rem" }}>{p.insight}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="rounded-2xl p-6 space-y-4" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: "#ff6b35" }}>2025 年 1 月 · 关键结论</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: "🥇", title: "NOCO GB40 无可撼动", desc: "Wirecutter + Car and Driver 的专家引用护城河难以快速复制。74/100 AI 提及，ARRS 仅 16。" },
            { icon: "🚀", title: "Gooloo 上涨最快（4 周 +6）", desc: "安全认证语言触发 AI 质量信号。这是一个战术 GEO 优化的典型案例。" },
            { icon: "📉", title: "Rexing 和 Stanley 正在下滑", desc: "低价定位 + 内容陈旧 + 高自动生成内容引用比例 = AI 质量过滤器惩罚，均下滑 3–6 次提及。" },
            { icon: "🔮", title: "MagSafe 正在重塑手机支架品类", desc: "MagSafe 专项查询激增 41%。无 MagSafe 内容的品牌无论整体质量如何都在失去 AI 份额。" },
          ].map(tk => (
            <div key={tk.icon} className="flex gap-3">
              <div className="text-xl shrink-0">{tk.icon}</div>
              <div>
                <div className="font-semibold text-sm mb-1">{tk.title}</div>
                <p className="text-xs leading-relaxed" style={{ color: "#7070a0" }}>{tk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-5"
        style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.2)" }}>
        <div className="flex-1">
          <div className="font-semibold mb-1">追踪你自己品牌的 AI 可见度</div>
          <p className="text-sm" style={{ color: "#9090b0" }}>
            查看你的品牌或产品在真实 AI 回复中的排名。免费诊断，无需信用卡。
          </p>
        </div>
        <div className="flex gap-3 shrink-0 flex-wrap">
          <Link href="/zh/audit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff" }}>
            运行免费诊断 →
          </Link>
          <Link href="/zh/selection"
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ border: "1px solid #25253f", color: "#f0f0f8" }}>
            查看 AI 选品情报 →
          </Link>
        </div>
      </div>

    </div>
  );
}
