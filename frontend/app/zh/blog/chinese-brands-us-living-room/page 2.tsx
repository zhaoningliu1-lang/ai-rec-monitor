import Link from "next/link";

export const metadata = {
  title: "从TikTok到Amazon到YouTube：中国品牌如何在美国攻下客厅 | 阿凡提",
  description:
    "一场关于全渠道战略、品牌本地化与信任构建的深度解析。帮助中国跨境品牌理解美国消费者购买旅程的13个关键决策节点。",
};

/* ── shared styles ─────────────────────────────────────────────────────────── */
const card = {
  background: "#12121e",
  border: "1px solid #25253f",
  borderRadius: 12,
  padding: "24px 28px",
} as const;

const accent = { color: "#ff6b35" } as const;
const muted = { color: "#7070a0" } as const;
const body = { color: "#c0c0d8", fontSize: 15, lineHeight: 1.8 } as const;
const h2Style = { fontSize: 22, fontWeight: 800, color: "#f0f0f8", marginBottom: 12 } as const;
const h3Style = { fontSize: 17, fontWeight: 700, color: "#f0f0f8", marginBottom: 8 } as const;

function Callout({ children, color = "#ff6b35" }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: `${color}08`, border: `1px solid ${color}30` }}
    >
      {children}
    </div>
  );
}

function StatCard({ num, label }: { num: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 36, fontWeight: 900, color: "#f0f0f8" }}>{num}</div>
      <div style={{ fontSize: 13, color: "#7070a0", marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function ZhChineseBrandsUSLivingRoomPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35" }}
          >
            出海战略
          </span>
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}
          >
            特邀嘉宾
          </span>
          <span className="text-xs" style={muted}>2026年3月 &middot; 12 分钟阅读</span>
        </div>
        <p className="text-sm" style={accent}>
          从 TikTok 到 Amazon 到 YouTube
        </p>
        <h1 className="text-3xl font-bold leading-tight" style={{ color: "#f0f0f8" }}>
          中国品牌如何在美国攻下客厅？
        </h1>
        <p className="text-base leading-relaxed" style={muted}>
          一场关于全渠道战略、品牌本地化与信任构建的深度解析。
          <br />
          根据 <strong style={{ color: "#c0c0d8" }}>Elaine Lai Wright</strong>（多元文化营销专家 / 品牌架构师）演讲整理。
        </p>
      </div>

      {/* ── Section 1: 美国消费者购买旅程 ───────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>美国消费者购买旅程</h2>
        <p style={body}>
          美国消费者的购买决策并非线性，而是在社交媒体、搜索引擎、电商平台与线下场景之间反复穿梭。
          理解每一个触点的心理需求，是中国出海品牌制胜的起点。
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 py-4">
          {[
            { stage: "认知", sub: "社交发现与曝光" },
            { stage: "考虑", sub: "比较与信息检索" },
            { stage: "初印象", sub: "品牌信任与证据" },
            { stage: "决策", sub: "结账与购买体验" },
            { stage: "售后", sub: "履约与客户服务" },
          ].map((s, i) => (
            <div key={s.stage} className="flex items-center gap-3">
              <div
                className="text-center px-4 py-3 rounded-xl"
                style={{ ...card, minWidth: 110 }}
              >
                <div className="text-xs font-bold" style={accent}>{s.stage}</div>
                <div className="text-[10px] mt-1" style={muted}>{s.sub}</div>
              </div>
              {i < 4 && <span style={muted}>&rarr;</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 2: 13 关键决策节点 ──────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>跨越信任鸿沟：深度本地化击穿 13 个关键决策节点</h2>
        <p style={body}>
          美国消费者的购买旅程涵盖从认知、进入比较名单、初始印象、信任建立到最终购买与购后体验等
          13 个关键支柱。中国品牌必须针对每个颗粒度的痛点进行精准打击：
        </p>

        <div className="space-y-4">
          {[
            {
              title: "消除初始偏见",
              desc: "在全渠道植入\"信任证据\" —— 权威评测、认证背书、社交证明，消除消费者对品牌产地的刻板印象。",
            },
            {
              title: "价值驱动而非仅低价驱动",
              desc: "利用 KOL 真实测评、用户评价（UGC）和本地媒体报道背书，将品牌叙事从\"便宜\"转向\"创新\"。",
            },
            {
              title: "文化与本地化深度适配",
              desc: "从页面语言、产品包装到使用说明，深度契合美国消费者习惯与审美。不是翻译，是重新本地化。",
            },
          ].map((item) => (
            <div key={item.title} style={card}>
              <h3 style={{ ...h3Style, ...accent }}>{item.title}</h3>
              <p className="text-sm" style={muted}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: 用户画像 ────────────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>精准的用户洞察：户外运动设备消费者画像</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div style={card}>
            <h3 style={h3Style}>核心人口特征</h3>
            <ul className="space-y-2 text-sm" style={muted}>
              <li><strong style={{ color: "#c0c0d8" }}>年龄：</strong>25&ndash;45岁，男性为主（约65%）</li>
              <li><strong style={{ color: "#c0c0d8" }}>收入：</strong>家庭年收入 $75,000&ndash;$150,000</li>
              <li><strong style={{ color: "#c0c0d8" }}>地域：</strong>西海岸（加州、科罗拉多）、太平洋西北地区</li>
              <li><strong style={{ color: "#c0c0d8" }}>教育：</strong>本科及以上学历占比超70%</li>
            </ul>
          </div>
          <div style={card}>
            <h3 style={h3Style}>购买驱动与行为特征</h3>
            <ul className="space-y-2 text-sm" style={muted}>
              <li>重视性能参数与真实用户评测，对品牌原产地持开放态度</li>
              <li>YouTube 深度测评与 Reddit 社区讨论是核心决策来源</li>
              <li>偏好有可持续制造理念的品牌，愿意为创新功能支付溢价</li>
              <li>高度依赖 KOL 与户外运动社群的口碑背书</li>
              <li>促销节点集中在 Prime Day、黑色星期五及春季开赛季</li>
            </ul>
          </div>
        </div>

        <Callout color="#22c55e">
          <p className="text-sm" style={{ color: "#22c55e" }}>
            <strong>户外运动品牌战略：</strong>以&ldquo;高性价比+专业性能&rdquo;为核心差异化定位，
            通过赞助本土户外赛事、与垂直KOL深度合作，快速建立品牌公信力，
            绕过单纯价格战的红海竞争。
          </p>
        </Callout>
      </div>

      {/* ── Section 4: 多渠道 vs 全渠道 ────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>多渠道、多触点、低摩擦的消费者购物选择</h2>
        <p style={body}>
          没有品牌的消费品，永远只能在亚马逊的价格绞杀中挣扎。当前美国消费者拥有前所未有的选择权，
          线上与线下的触点界限已经完全模糊。
        </p>

        <Callout>
          <p className="text-sm font-bold" style={accent}>多渠道（Multichannel）&ne; 全渠道（Omnichannel）</p>
          <p className="text-sm mt-2" style={muted}>
            简单地&ldquo;多开几个账号&rdquo;或&ldquo;多铺几个渠道&rdquo;，缺乏连贯性，无法建立品牌认知。
          </p>
          <p className="text-sm mt-2" style={muted}>
            <strong style={{ color: "#c0c0d8" }}>全渠道</strong>的核心是将消费者置于中心，
            确保所有触点在视觉、基调与品牌叙事上保持无缝一致体验。
          </p>
        </Callout>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: "🌐", label: "品牌官网 / DTC独立站" },
            { icon: "📦", label: "亚马逊等电商平台" },
            { icon: "📱", label: "YouTube / TikTok / Instagram" },
            { icon: "📍", label: "线下门店与快闪活动" },
          ].map((ch) => (
            <div key={ch.label} style={card} className="text-center">
              <div className="text-2xl mb-2">{ch.icon}</div>
              <div className="text-xs font-medium" style={{ color: "#c0c0d8" }}>{ch.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 5: 媒体三角 ────────────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>美国媒体平台分类：付费、自有与赢得媒体</h2>
        <p style={body}>
          三者协同运作，覆盖从认知到复购的完整购买旅程。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "付费媒体 (Paid)",
              subtitle: "快速曝光，精准触达",
              items: "所有可付费的媒介和平台",
              impact: "影响：认知 → 考虑",
              color: "#ff6b35",
            },
            {
              title: "自有媒体 (Owned)",
              subtitle: "长期资产，品牌主权",
              items: "官网 + 社媒账号",
              impact: "影响：初印象 → 决策 → 复购",
              color: "#60a5fa",
            },
            {
              title: "赢得媒体 (Earned)",
              subtitle: "信任背书，口碑裂变",
              items: "YouTube KOL 测评、Reddit 讨论、UGC 内容、媒体报道",
              impact: "影响：考虑 → 信任建立 → 倡导",
              color: "#22c55e",
            },
          ].map((m) => (
            <div key={m.title} style={card}>
              <h3 style={{ ...h3Style, color: m.color }}>{m.title}</h3>
              <p className="text-xs italic mb-2" style={{ color: m.color }}>{m.subtitle}</p>
              <p className="text-xs mb-3" style={muted}>{m.items}</p>
              <p className="text-xs font-bold" style={{ color: "#c0c0d8" }}>{m.impact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 6: 飞轮引擎 ────────────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>飞轮引擎：以数据为轴心的全域营销网络</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { step: "精准获客", desc: "付费广告精准投放，内容种草触达目标人群" },
            { step: "首次转化", desc: "无缝结账体验，多元支付选项提升转化率" },
            { step: "UGC 用户共创", desc: "鼓励真实评价与内容共创，将用户变为品牌代言人" },
            { step: "复购增长", desc: "邮件营销与积分计划，延长销售周期，提升 CLV" },
          ].map((s) => (
            <div key={s.step} style={card}>
              <h4 className="text-xs font-bold mb-2" style={accent}>{s.step}</h4>
              <p className="text-xs" style={muted}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 7: 双轨模型 ────────────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>顶层战略重构：破局&ldquo;三无&rdquo;，建立双轨运营模型</h2>
        <p style={body}>
          很多企业出海面临&ldquo;有供应链、无品牌力&rdquo;的典型困境 —— 100% 依赖亚马逊，利润被压缩，
          且无法沉淀用户数据资产。亚马逊本质上是一个比价引擎，平台上的客户属于亚马逊，而非品牌。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "亚马逊：做量",
              desc: "用于销售标品和走量款，保持价格竞争力，覆盖广泛流量入口，快速建立销售基础与评价体系。",
            },
            {
              title: "DTC官网：做利",
              desc: "承载差异化的高利润产品、完整的品牌故事，并掌握核心客户数据（邮件列表、购买行为、复购路径）。",
            },
            {
              title: "全渠道一致性基建",
              desc: "在主营渠道确立品牌调性、视觉元素与产品呈现方式，再向其他渠道扩展，确保所有触点体验无缝衔接。",
            },
          ].map((t) => (
            <div key={t.title} style={card}>
              <h3 style={h3Style}>{t.title}</h3>
              <p className="text-xs" style={muted}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 8: 四大体验战场 ────────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>决胜四大体验战场：重塑统一商业链路</h2>
        <p style={body}>
          根据 2025 年美国零售基准报告，领先品牌正在通过以下四个&ldquo;统一商业战场&rdquo;重塑美国消费者的购物体验：
        </p>

        {[
          {
            num: "1",
            title: "购物（Shopping）：打造无边界发现画布",
            desc: "Z世代以社交媒体为首选搜索引擎。布局YouTube故事型视频、Instagram生活方式内容，将产品转化为\"周末派对\"\"校园通勤\"\"车旅露营\"等美国本土生活场景。",
          },
          {
            num: "2",
            title: "结账（Check-out）：从交易终点到智能枢纽",
            desc: "将购物车打造为动态客户互动枢纽。提供信用卡、数字钱包、BNPL先买后付等高度整合的支付选项，不仅提升转化率，还能使客单价提高 15%。",
          },
          {
            num: "3",
            title: "履约（Fulfillment）：透明化驱动的信任网络",
            desc: "提供实时主动的订单追踪更新，可让\"我的订单在哪里？\"客服咨询量下降 50%。",
          },
          {
            num: "4",
            title: "服务（Service）：构建全域互联的客服生态",
            desc: "打通数字、社媒和电话支持，顺畅的退换货、包邮、FAQ政策与及时响应，是美国消费者复购和口碑传播的核心决定因素。",
          },
        ].map((bf) => (
          <div key={bf.num} style={card} className="flex gap-4">
            <div
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
              style={{ background: "#ff6b3520", color: "#ff6b35" }}
            >
              {bf.num}
            </div>
            <div>
              <h3 style={{ ...h3Style, ...accent }}>{bf.title}</h3>
              <p className="text-sm" style={muted}>{bf.desc}</p>
            </div>
          </div>
        ))}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 py-6">
          <StatCard num="13" label="关键决策节点" />
          <StatCard num="50%" label="客服咨询减少" />
          <StatCard num="15%" label="客单价提升" />
        </div>

        <Callout>
          <p className="text-sm font-bold" style={{ color: "#c0c0d8" }}>
            出海不是把产品搬到美国，而是把品牌种在美国消费者心中。
          </p>
          <p className="text-xs mt-2" style={muted}>
            全渠道统一商业体验要求在品牌、营销、客服和产品部门之间打破壁垒，
            以用户为圆心，以数据为驱动，构建一个立体的信任生态。
          </p>
        </Callout>
      </div>

      {/* ── Section 9: 促销年历 ────────────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>美国电商促销年历</h2>
        <p style={body}>
          掌握美国全年核心促销节点，是制定出海营销预算与备货计划的战略基础。
        </p>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2" style={{ minWidth: 700 }}>
            {[
              { month: "一月", event: "新年，清仓" },
              { month: "二月", event: "情人节" },
              { month: "三月", event: "春季发布" },
              { month: "四月", event: "复活节" },
              { month: "五月", event: "母亲节，阵亡将士纪念日" },
              { month: "六月", event: "父亲节，骄傲月" },
              { month: "七月", event: "Prime Day，国庆日" },
              { month: "八月", event: "返校季" },
              { month: "九月", event: "劳动节" },
              { month: "十月", event: "万圣节，节前大促" },
              { month: "十一月", event: "感恩节，黑五，网一" },
              { month: "十二月", event: "圣诞节，年底大促" },
            ].map((m) => (
              <div key={m.month} style={{ ...card, padding: "10px 6px", textAlign: "center" as const }}>
                <div className="text-xs font-bold" style={accent}>{m.month}</div>
                <div className="text-[9px] mt-1 leading-tight" style={muted}>{m.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 10: 代际消费者 ─────────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>美国代际消费者价值观与购买驱动</h2>
        <p style={body}>
          美国市场横跨多个消费代际，每一代人的价值观、媒体习惯与购买驱动力存在显著差异。
          精准识别目标受众的代际特征，是产品定位与内容策略的核心依据。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              gen: "婴儿潮一代",
              years: "1946-1964",
              age: "61-79岁",
              traits: "重视品质、耐用性与品牌传承。偏好电视广告、邮件营销与实体零售体验。价格敏感度较低，忠诚度高，决策周期长。",
            },
            {
              gen: "X一代",
              years: "1965-1980",
              age: "45-60岁",
              traits: "注重性价比与实用功能。活跃于Facebook和电子邮件，信任专家评测与朋友推荐。是美国家庭消费的核心决策者。",
            },
            {
              gen: "千禧一代",
              years: "1981-1996",
              age: "29-44岁",
              traits: "追求品牌价值观契合与可持续性。活跃于Instagram和YouTube，依赖KOL评测与社群口碑。愿意为有故事的品牌支付溢价。",
            },
            {
              gen: "Z世代",
              years: "1997-2012",
              age: "13-28岁",
              traits: "以TikTok为搜索引擎，重视真实性、个性化与社会责任。BNPL先买后付用户比例最高，购买决策快但忠诚度需持续维护。",
            },
          ].map((g) => (
            <div key={g.gen} style={card}>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 style={{ ...h3Style, margin: 0, ...accent }}>{g.gen}</h3>
                <span className="text-xs" style={muted}>({g.years}) {g.age}</span>
              </div>
              <p className="text-xs" style={muted}>{g.traits}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 11: 社媒平台 ───────────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>美国社媒平台概览</h2>
        <p style={body}>
          出海品牌可根据目标受众代际与产品特性，有策略地选择核心阵地进行深耕布局。
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              name: "TikTok",
              audience: "Z世代 / 千禧一代",
              format: "短视频、直播带货，病毒式传播与新品种草",
              biz: "TikTok Shop、直播带货",
            },
            {
              name: "Instagram",
              audience: "千禧一代 / Z世代",
              format: "图文、Reels、Stories，生活方式美学与KOL合作",
              biz: "购物标签、广告投放",
            },
            {
              name: "YouTube",
              audience: "全年龄段",
              format: "长视频与Shorts，深度测评与品牌教育",
              biz: "前贴片广告、合作视频",
            },
            {
              name: "Facebook",
              audience: "X一代 / 婴儿潮",
              format: "图文、视频、社群，社区运营与再营销",
              biz: "Facebook Ads、Marketplace",
            },
            {
              name: "Pinterest",
              audience: "女性 / 千禧一代",
              format: "图片与创意版，家居、美妆、生活方式场景",
              biz: "购物广告、创意Pins",
            },
            {
              name: "Reddit",
              audience: "千禧/X一代，男性为主，高学历、高收入",
              format: "深度讨论、产品测评与社区问答，用户匿名性强、信任度高",
              biz: "Reddit Ads、品牌互动、垂版块精准投放",
            },
          ].map((p) => (
            <div key={p.name} style={card}>
              <h3 style={{ ...h3Style, color: "#ff6b35" }}>{p.name}</h3>
              <p className="text-[10px] font-medium mb-2" style={{ color: "#60a5fa" }}>{p.audience}</p>
              <p className="text-xs mb-2" style={muted}>{p.format}</p>
              <p className="text-[10px]" style={{ color: "#52526e" }}>商业化：{p.biz}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 12: 结语 ───────────────────────────────────────────────── */}
      <div className="space-y-5">
        <h2 style={h2Style}>真正的挑战</h2>

        <div
          className="rounded-2xl p-8 text-center space-y-4"
          style={{ background: "linear-gradient(135deg, #1a0e06 0%, #12121e 100%)", border: "1px solid #ff6b3530" }}
        >
          <p className="text-2xl font-black" style={{ color: "#f0f0f8" }}>
            不是<span style={accent}>走出去</span>
          </p>
          <p className="text-2xl font-black" style={{ color: "#f0f0f8" }}>
            而是<span style={accent}>融进去</span>
          </p>
          <div className="pt-4" style={{ borderTop: "1px solid #25253f" }}>
            <p className="text-sm" style={muted}>
              出海不是一次性的战役，而是一场持久战。
              <br />
              品牌本土化是这场战役中最关键的战略投入之一。
            </p>
          </div>
        </div>
      </div>

      {/* ── 署名 ───────────────────────────────────────────────────────────── */}
      <div style={{ ...card, background: "#0f0f17" }}>
        <p className="text-xs" style={muted}>
          <strong style={{ color: "#c0c0d8" }}>关于作者：</strong>本文根据 Elaine Lai Wright
          的演讲整理。Elaine 是多元文化营销专家与品牌架构师，专注于帮助中国品牌在美国市场建立真实的本地化存在。
          关注公众号/视频号：&ldquo;Elaine谈品牌出海&rdquo;。
        </p>
        <p className="text-xs mt-3" style={muted}>
          <strong style={{ color: "#c0c0d8" }}>Avanti 的角色：</strong>Avanti（阿凡提）帮助跨境品牌量化和优化其
          AI 可见度 —— 美国消费者最新、增长最快的发现渠道。
          <Link href="/zh/audit" style={accent}> 立即免费 AI 品牌诊断 &rarr;</Link>
        </p>
      </div>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <div className="text-center space-y-3 pt-4">
        <p className="text-sm" style={muted}>
          想看看 AI 助手在你的品类里推荐哪些品牌？
        </p>
        <Link
          href="/zh/audit"
          className="inline-block text-sm font-bold px-6 py-3 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: "#ff6b35", color: "#fff" }}
        >
          免费 AI 品牌诊断 &rarr;
        </Link>
      </div>

      {/* Back */}
      <div>
        <Link href="/zh/blog" className="text-xs hover:text-white transition-colors" style={muted}>
          &larr; 返回研究报告
        </Link>
      </div>
    </div>
  );
}
