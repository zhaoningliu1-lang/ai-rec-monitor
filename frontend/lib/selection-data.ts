export type SellerSignal = "strong_buy" | "watch" | "avoid";
export type Platform = "Amazon" | "TikTok" | "Shopee" | "DTC" | "All";

// ── Phase 3: Product-level AI mention data ────────────────────────────────
export interface ProductMention {
  name: string;          // Exact product name as mentioned by AI
  brand: string;
  asin?: string;         // Amazon ASIN if applicable
  aiMentions: number;    // Out of 100 queries in this category
  arrs: number;          // AI Recommendation Rank Score (lower = better)
  priceRange: string;    // e.g. "$149–$199"
  aiContext: string;     // Typical context AI uses when mentioning this product
  aiContextZh: string;
}

export const PRODUCT_DATA: Record<string, ProductMention[]> = {
  "portable-power": [
    { name: "EcoFlow Delta Pro Ultra", brand: "EcoFlow", asin: "B0CHX5ZB1M", aiMentions: 71, arrs: 14, priceRange: "$3,299–$4,499", aiContext: "\"Best for whole-home backup and off-grid living\" — cited in 71% of high-capacity power queries.", aiContextZh: "「全屋备用和离网生活首选」——在 71% 的大容量电源查询中被引用。" },
    { name: "EcoFlow River 2 Pro", brand: "EcoFlow", asin: "B0BVRX4JLQ", aiMentions: 58, arrs: 19, priceRange: "$399–$549", aiContext: "\"Best mid-range portable power for camping trips\" — dominant in $300–$600 queries.", aiContextZh: "「露营中端便携电源首选」——在 $300–$600 查询中占主导。" },
    { name: "Jackery Explorer 1000 Pro", brand: "Jackery", asin: "B09GH3K7KS", aiMentions: 52, arrs: 22, priceRange: "$799–$999", aiContext: "\"Reliable, beginner-friendly power station\" — recommended alongside solar panels.", aiContextZh: "「可靠、新手友好的电源站」——与太阳能板组合推荐。" },
    { name: "Jackery Explorer 300 Plus", brand: "Jackery", asin: "B0C4P2SQFQ", aiMentions: 34, arrs: 31, priceRange: "$249–$299", aiContext: "\"Best budget option for day hikes\" — mentioned in entry-level queries.", aiContextZh: "「日间徒步最佳预算选择」——在入门级查询中提及。" },
    { name: "Bluetti AC200MAX", brand: "Bluetti", asin: "B09CXYQC41", aiMentions: 29, arrs: 34, priceRange: "$1,199–$1,499", aiContext: "\"Expandable capacity for serious overlanders\" — niche but growing.", aiContextZh: "「严肃越野爱好者的可扩展容量」——细分但增长中。" },
    { name: "Goal Zero Yeti 500X", brand: "Goal Zero", asin: "B07Y5JMBRP", aiMentions: 14, arrs: 51, priceRange: "$499–$649", aiContext: "\"Premium lifestyle brand\" — cited by style-focused AI queries but losing ground.", aiContextZh: "「高端生活方式品牌」——被注重风格的 AI 查询引用，但正在失去份额。" },
  ],
  "wireless-earbuds": [
    { name: "Soundcore Liberty 4 NC", brand: "Soundcore", asin: "B0BX49PRPZ", aiMentions: 64, arrs: 18, priceRange: "$79–$99", aiContext: "\"Best budget ANC earbuds\" — mentioned in 64% of under-$100 noise-cancelling queries.", aiContextZh: "「最佳预算降噪耳机」——在 64% 的百元以下降噪查询中被提及。" },
    { name: "Soundcore Q45", brand: "Soundcore", asin: "B09GHHKCDR", aiMentions: 41, arrs: 24, priceRange: "$59–$79", aiContext: "\"Best over-ear for budget travelers\" — frequently bundled with Soundcore earbuds.", aiContextZh: "「旅行者最佳头戴式预算耳机」——常与 Soundcore 耳机打包推荐。" },
    { name: "QCY T13 ANC", brand: "QCY", asin: "B0BKWTPXCD", aiMentions: 28, arrs: 38, priceRange: "$29–$49", aiContext: "\"Ultra-budget with ANC\" — mentioned when users ask for cheapest noise-cancelling.", aiContextZh: "「超低价降噪」——当用户询问最便宜的降噪选项时被提及。" },
    { name: "QCY MelobudsANC", brand: "QCY", asin: "B0CDRPCL8N", aiMentions: 19, arrs: 47, priceRange: "$39–$59", aiContext: "\"Rising challenger in value earbuds\" — newer model gaining AI mentions.", aiContextZh: "「高性价比耳机新兴挑战者」——新型号正在获得更多 AI 提及。" },
    { name: "Mpow M30 Plus", brand: "Mpow", asin: "B09CF27JNK", aiMentions: 12, arrs: 54, priceRange: "$19–$35", aiContext: "\"Only mentioned for extreme budget queries\" — declining visibility.", aiContextZh: "「仅在极限预算查询中被提及」——可见度下降中。" },
  ],
  "skincare": [
    { name: "NuFace Trinity Pro", brand: "NuFace", asin: "B08CZMJGR4", aiMentions: 68, arrs: 19, priceRange: "$299–$399", aiContext: "\"Clinical-grade microcurrent at home\" — cited as the gold standard in 68% of facial toning queries.", aiContextZh: "「家用临床级微电流」——在 68% 的面部塑形查询中被引为黄金标准。" },
    { name: "Foreo Luna 4 Plus", brand: "Foreo", asin: "B0BRVTDQ2H", aiMentions: 51, arrs: 24, priceRange: "$249–$329", aiContext: "\"Best dual-action cleansing and firming device\" — frequently recommended for skincare beginners.", aiContextZh: "「最佳双效清洁紧致仪」——常推荐给护肤初学者。" },
    { name: "CurrentBody LED Face Mask", brand: "CurrentBody", asin: "B08BFDSLVX", aiMentions: 38, arrs: 29, priceRange: "$380–$499", aiContext: "\"Only FDA-cleared at-home LED mask\" — certification language drives AI citation.", aiContextZh: "「唯一经 FDA 认证的家用 LED 面罩」——认证用语驱动 AI 引用。" },
    { name: "Theraface Pro", brand: "Therabody", asin: "B0B7RQXG2Z", aiMentions: 22, arrs: 41, priceRange: "$399–$499", aiContext: "\"Best for jaw tension + facial massage\" — specific use-case niche.", aiContextZh: "「改善下颌紧张和面部按摩最佳选择」——特定用途细分。" },
  ],
  "kitchen-appliances": [
    { name: "Cosori TurboBlaze Air Fryer 6Qt", brand: "Cosori", asin: "B0CH4PFSZQ", aiMentions: 61, arrs: 18, priceRange: "$119–$159", aiContext: "\"Best mid-size air fryer for families\" — mentioned in 61% of air fryer queries.", aiContextZh: "「最佳家庭中号空气炸锅」——在 61% 的空气炸锅查询中被提及。" },
    { name: "Ninja Foodi DZ401 2-Basket", brand: "Ninja", asin: "B0BVJVX9MP", aiMentions: 54, arrs: 21, priceRange: "$169–$229", aiContext: "\"Best dual-basket air fryer\" — dominates 2-basket category with strong review volume.", aiContextZh: "「最佳双抽屉空气炸锅」——凭借强大的评论量主导双抽屉品类。" },
    { name: "Instant Pot Duo 7-in-1 (8qt)", brand: "Instant Pot", asin: "B00FLYWNYQ", aiMentions: 47, arrs: 24, priceRange: "$89–$129", aiContext: "\"The classic for meal-prepping families\" — legacy brand with high AI visibility.", aiContextZh: "「备餐家庭的经典选择」——历史品牌具有高 AI 可见度。" },
    { name: "Cosori Smart WiFi Air Fryer 5.8Qt", brand: "Cosori", asin: "B07GJBBGHG", aiMentions: 33, arrs: 29, priceRange: "$89–$119", aiContext: "\"Best value smart air fryer\" — WiFi connectivity sets it apart in tech-focused queries.", aiContextZh: "「最佳性价比智能空气炸锅」——WiFi 连接功能在科技类查询中脱颖而出。" },
    { name: "Breville BOV900BSS Oven", brand: "Breville", asin: "B074Z77WNS", aiMentions: 26, arrs: 36, priceRange: "$349–$499", aiContext: "\"Best countertop oven for serious home cooks\" — premium segment with loyal audience.", aiContextZh: "「认真居家厨师最佳台面烤箱」——高端细分具有忠实受众。" },
  ],
  "tiktok-viral-beauty": [
    { name: "CeraVe Moisturizing Cream", brand: "CeraVe", asin: "B01MSSDEPK", aiMentions: 74, arrs: 14, priceRange: "$14–$22", aiContext: "\"Dermatologist-recommended daily moisturizer\" — CeraVe's TikTok virality permanently elevated its AI ranking.", aiContextZh: "「皮肤科医生推荐的日常保湿霜」——CeraVe 的 TikTok 爆红永久提升了其 AI 排名。" },
    { name: "The Ordinary Niacinamide 10%", brand: "The Ordinary", asin: "B07XGGFBYH", aiMentions: 58, arrs: 19, priceRange: "$8–$12", aiContext: "\"Best budget serum for pores and blemishes\" — #skincare TikTok content drove AI citation.", aiContextZh: "「最佳平价毛孔和瑕疵精华」——#skincare TikTok 内容驱动 AI 引用。" },
    { name: "Laneige Lip Sleeping Mask", brand: "Laneige", asin: "B009MXVMME", aiMentions: 41, arrs: 28, priceRange: "$24–$32", aiContext: "\"Best overnight lip treatment\" — TikTok beauty routines made this a household name.", aiContextZh: "「最佳夜间唇部护理」——TikTok 美妆攻略让这款产品家喻户晓。" },
    { name: "e.l.f. Halo Glow Liquid Filter", brand: "e.l.f.", asin: "B0BJM5GFYR", aiMentions: 34, arrs: 33, priceRange: "$14–$18", aiContext: "\"Viral dupe for Charlotte Tilbury\" — TikTok makeup trends driving AI recommendation rapidly.", aiContextZh: "「Charlotte Tilbury 的爆红平替」——TikTok 妆容趋势快速推动 AI 推荐。" },
  ],
  "camping-gear": [
    { name: "Coleman Skydome Camping Tent", brand: "Coleman", asin: "B09XWGW1PC", aiMentions: 58, arrs: 21, priceRange: "$89–$149", aiContext: "\"Best beginner tent for families\" — mentioned in majority of camping setup queries.", aiContextZh: "「家庭初学者最佳帐篷」——在大多数营地装备查询中被提及。" },
    { name: "MSR Hubba Hubba NX2", brand: "MSR", asin: "B007X4GRSE", aiMentions: 41, arrs: 27, priceRange: "$449–$599", aiContext: "\"Best ultralight backpacking tent\" — premium segment with strong authority signals.", aiContextZh: "「最佳超轻背包帐篷」——高端细分具有强权威信号。" },
    { name: "BioLite FirePit+", brand: "BioLite", asin: "B086C7VQPL", aiMentions: 28, arrs: 39, priceRange: "$149–$199", aiContext: "\"Best smokeless fire pit\" — unique positioning keeps it cited despite smaller brand.", aiContextZh: "「最佳无烟篝火炉」——独特定位使其尽管品牌较小仍被引用。" },
  ],
};


export interface BrandSov {
  name: string;
  sov: number;  // percentage 0-100
  arrs: number; // lower = better
}

export interface CategoryData {
  id: string;
  category: string;
  categoryZh: string;
  parentSection: "Consumer Electronics" | "Outdoor & Sports" | "Home & Kitchen" | "Beauty & Care" | "TikTok Trending" | "Family & Kids";
  parentSectionZh: string;
  trend: "up" | "stable" | "down";
  trendPts: string;
  topBrands: BrandSov[];
  sellerSignal: SellerSignal;
  sellerNote: string;
  sellerNoteZh: string;
  platforms: Platform[];  // where this category is hottest
  platformNote?: string;  // short platform-specific note
  platformNoteZh?: string;
}

export const SELECTION_DATA: CategoryData[] = [
  // ── Consumer Electronics ──────────────────────────────────────────────────
  {
    id: "portable-power",
    category: "Portable Power Stations",
    categoryZh: "便携储能",
    parentSection: "Consumer Electronics",
    parentSectionZh: "消费电子",
    trend: "up",
    trendPts: "+4.2",
    topBrands: [
      { name: "EcoFlow",  sov: 34.2, arrs: 18 },
      { name: "Jackery",  sov: 28.7, arrs: 24 },
      { name: "Bluetti",  sov: 19.4, arrs: 31 },
    ],
    sellerSignal: "strong_buy",
    sellerNote: "AI mentions EcoFlow in 9/10 outdoor power queries. Demand rising ahead of camping season.",
    sellerNoteZh: "AI 在 9/10 户外用电查询中提及 EcoFlow，露营旺季前需求信号持续上升。",
    platforms: ["Amazon", "DTC"],
    platformNote: "Strongest on Amazon. EcoFlow owns DTC channel through direct site referrals.",
    platformNoteZh: "亚马逊最强。EcoFlow 通过直接官网引流主导 DTC 渠道。",
  },
  {
    id: "usb-c-chargers",
    category: "USB-C Chargers & Cables",
    categoryZh: "USB-C 充电器 & 数据线",
    parentSection: "Consumer Electronics",
    parentSectionZh: "消费电子",
    trend: "stable",
    trendPts: "+0.3",
    topBrands: [
      { name: "Anker",    sov: 41.8, arrs: 14 },
      { name: "Ugreen",   sov: 22.3, arrs: 28 },
      { name: "Baseus",   sov: 14.7, arrs: 39 },
    ],
    sellerSignal: "watch",
    sellerNote: "Anker dominates with 3× Ugreen SOV. High competition — only enter with clear differentiation (GaN, multi-port design).",
    sellerNoteZh: "Anker 声量是 Ugreen 的 3 倍。竞争激烈——仅在有明确差异化（GaN、多口设计）时入场。",
    platforms: ["Amazon", "Shopee"],
    platformNote: "Shopee SEA markets show 40% lower AI SOV than Amazon — opportunity for regional positioning.",
    platformNoteZh: "Shopee 东南亚市场 AI SOV 比亚马逊低 40%，存在区域定位机会。",
  },
  {
    id: "wireless-earbuds",
    category: "Wireless Earbuds",
    categoryZh: "真无线耳机",
    parentSection: "Consumer Electronics",
    parentSectionZh: "消费电子",
    trend: "up",
    trendPts: "+2.8",
    topBrands: [
      { name: "Soundcore", sov: 29.1, arrs: 22 },
      { name: "QCY",       sov: 16.4, arrs: 44 },
      { name: "Mpow",      sov: 11.2, arrs: 51 },
    ],
    sellerSignal: "strong_buy",
    sellerNote: "Mid-range segment ($30–$80) is undercovered in AI recommendations. Clear entry opportunity.",
    sellerNoteZh: "$30–$80 中端品类在 AI 推荐中覆盖不足，存在明确入场机会。",
    platforms: ["Amazon", "TikTok", "Shopee"],
    platformNote: "TikTok viral unboxing content driving 28% of new AI mentions in this category.",
    platformNoteZh: "TikTok 开箱内容带动该品类 28% 的新增 AI 提及。",
  },
  {
    id: "action-cameras",
    category: "Action Cameras",
    categoryZh: "运动相机",
    parentSection: "Consumer Electronics",
    parentSectionZh: "消费电子",
    trend: "up",
    trendPts: "+1.9",
    topBrands: [
      { name: "GoPro",    sov: 38.6, arrs: 16 },
      { name: "DJI",      sov: 28.3, arrs: 21 },
      { name: "Insta360", sov: 14.7, arrs: 52 },
    ],
    sellerSignal: "watch",
    sellerNote: "GoPro + DJI lock up 67% SOV. Insta360 has niche in 360° but limited general visibility.",
    sellerNoteZh: "GoPro + DJI 占据 67% SOV。Insta360 在 360° 细分有优势，但通用可见度有限。",
    platforms: ["Amazon", "DTC"],
    platformNote: "DJI owns AI mindshare for drone + camera combos. GoPro leads in pure action queries.",
    platformNoteZh: "DJI 主导无人机+相机组合的 AI 认知。GoPro 在纯动作类查询中领先。",
  },
  {
    id: "phone-accessories",
    category: "Phone Cases & Accessories",
    categoryZh: "手机壳 & 配件",
    parentSection: "Consumer Electronics",
    parentSectionZh: "消费电子",
    trend: "up",
    trendPts: "+3.4",
    topBrands: [
      { name: "Spigen",    sov: 32.1, arrs: 19 },
      { name: "Casetify",  sov: 24.8, arrs: 22 },
      { name: "Torras",    sov: 11.4, arrs: 47 },
    ],
    sellerSignal: "strong_buy",
    sellerNote: "AI queries spike with every new iPhone/Android release. Torras ARRS gap vs Spigen signals entry window.",
    sellerNoteZh: "每次新机发布 AI 查询激增。Torras 与 Spigen 的 ARRS 差距是中国品牌入场的机会窗口。",
    platforms: ["Amazon", "TikTok", "Shopee"],
    platformNote: "TikTok Shop is driving 35% of accessory discovery for Gen Z. Customization plays well on Shopee SEA.",
    platformNoteZh: "TikTok Shop 驱动 35% 的 Z 世代配件发现。定制化在 Shopee 东南亚市场表现强劲。",
  },

  // ── Outdoor & Sports ───────────────────────────────────────────────────────
  {
    id: "camping-gear",
    category: "Camping & Hiking Gear",
    categoryZh: "露营户外装备",
    parentSection: "Outdoor & Sports",
    parentSectionZh: "运动户外",
    trend: "up",
    trendPts: "+5.7",
    topBrands: [
      { name: "Coleman",  sov: 31.4, arrs: 19 },
      { name: "MSR",      sov: 18.2, arrs: 27 },
      { name: "BioLite",  sov: 12.6, arrs: 38 },
    ],
    sellerSignal: "strong_buy",
    sellerNote: "Strongest rising signal in outdoor this quarter. AI recommendations up 5.7pts MoM.",
    sellerNoteZh: "本季户外品类上升最强信号。AI 推荐度月环比增长 5.7pts。",
    platforms: ["Amazon", "DTC"],
    platformNote: "DTC brands with strong review profiles get cited 2× more often than Amazon-only sellers.",
    platformNoteZh: "有强评论档案的 DTC 品牌被引用频率是纯亚马逊卖家的 2 倍。",
  },
  {
    id: "solar-panels",
    category: "Portable Solar Panels",
    categoryZh: "便携太阳能板",
    parentSection: "Outdoor & Sports",
    parentSectionZh: "运动户外",
    trend: "up",
    trendPts: "+3.1",
    topBrands: [
      { name: "Renogy",   sov: 36.8, arrs: 21 },
      { name: "Bluetti",  sov: 21.3, arrs: 29 },
      { name: "Goal Zero", sov: 18.9, arrs: 32 },
    ],
    sellerSignal: "strong_buy",
    sellerNote: "AI bundles solar + power stations in 70% of off-grid queries. Strong cross-sell signal.",
    sellerNoteZh: "AI 在 70% 的离网查询中将太阳能+储能组合推荐。强烈的关联销售信号。",
    platforms: ["Amazon", "DTC"],
  },
  {
    id: "fitness-equipment",
    category: "Home Fitness Equipment",
    categoryZh: "家用健身器材",
    parentSection: "Outdoor & Sports",
    parentSectionZh: "运动户外",
    trend: "up",
    trendPts: "+4.8",
    topBrands: [
      { name: "Bowflex",     sov: 26.3, arrs: 24 },
      { name: "Lifeline",    sov: 14.7, arrs: 41 },
      { name: "Rogue",       sov: 12.1, arrs: 29 },
    ],
    sellerSignal: "strong_buy",
    sellerNote: "Resistance bands, adjustable dumbbells, and compact racks: AI queries up 4.8pts. Mid-price brands have clear white space.",
    sellerNoteZh: "弹力带、可调哑铃、紧凑型器械：AI 查询上升 4.8pts，中价位品牌有明显空白。",
    platforms: ["Amazon", "TikTok"],
    platformNote: "TikTok fitness creators drive 40% of product discovery in this category.",
    platformNoteZh: "TikTok 健身创作者驱动该品类 40% 的产品发现。",
  },

  // ── Home & Kitchen ─────────────────────────────────────────────────────────
  {
    id: "smart-home",
    category: "Smart Home Devices",
    categoryZh: "智能家居设备",
    parentSection: "Home & Kitchen",
    parentSectionZh: "家居厨房",
    trend: "stable",
    trendPts: "-0.8",
    topBrands: [
      { name: "Govee",    sov: 27.6, arrs: 26 },
      { name: "Meross",   sov: 19.4, arrs: 33 },
      { name: "Kasa",     sov: 16.2, arrs: 35 },
    ],
    sellerSignal: "watch",
    sellerNote: "Market cooling slightly. Govee dominates with strong content. Only enter with ecosystem play.",
    sellerNoteZh: "市场略有降温。Govee 凭借强内容主导。仅在有生态玩法时入场。",
    platforms: ["Amazon", "DTC"],
  },
  {
    id: "kitchen-appliances",
    category: "Small Kitchen Appliances",
    categoryZh: "厨房小家电",
    parentSection: "Home & Kitchen",
    parentSectionZh: "家居厨房",
    trend: "up",
    trendPts: "+3.6",
    topBrands: [
      { name: "Cosori",      sov: 28.4, arrs: 22 },
      { name: "Ninja",       sov: 24.7, arrs: 18 },
      { name: "Instant Pot", sov: 19.3, arrs: 25 },
    ],
    sellerSignal: "strong_buy",
    sellerNote: "Air fryers + multi-cookers are being actively recommended in 8/10 kitchen queries. Cosori's ARRS shows strong Chinese brand success path.",
    sellerNoteZh: "空气炸锅 + 多功能锅在 8/10 的厨房查询中被主动推荐。Cosori 的 ARRS 展示了中国品牌成功路径。",
    platforms: ["Amazon", "TikTok", "Shopee"],
    platformNote: "TikTok cooking content drives discovery. Shopee SEA kitchen appliance demand up 32% YoY.",
    platformNoteZh: "TikTok 烹饪内容驱动发现。Shopee 东南亚厨电需求同比增长 32%。",
  },
  {
    id: "air-purifiers",
    category: "Air Purifiers & Humidifiers",
    categoryZh: "空气净化器 & 加湿器",
    parentSection: "Home & Kitchen",
    parentSectionZh: "家居厨房",
    trend: "up",
    trendPts: "+5.2",
    topBrands: [
      { name: "Levoit",     sov: 33.7, arrs: 20 },
      { name: "Winix",      sov: 18.4, arrs: 31 },
      { name: "Blueair",    sov: 14.2, arrs: 27 },
    ],
    sellerSignal: "strong_buy",
    sellerNote: "Levoit is a Chinese brand dominating through AI visibility — strongest case study for GEO strategy in home category.",
    sellerNoteZh: "Levoit 是通过 AI 可见度主导市场的中国品牌——家居品类 GEO 策略最强案例。",
    platforms: ["Amazon", "Shopee"],
    platformNote: "Shopee SEA shows high AI recommendation rate for air purifiers — pollution awareness driving demand.",
    platformNoteZh: "Shopee 东南亚空气净化器 AI 推荐率高——污染意识驱动需求。",
  },

  // ── Beauty & Care ──────────────────────────────────────────────────────────
  {
    id: "skincare",
    category: "Skincare Devices",
    categoryZh: "美容仪器",
    parentSection: "Beauty & Care",
    parentSectionZh: "美妆个护",
    trend: "up",
    trendPts: "+6.3",
    topBrands: [
      { name: "NuFace",   sov: 28.4, arrs: 23 },
      { name: "Foreo",    sov: 24.1, arrs: 26 },
      { name: "CurrentBody", sov: 17.8, arrs: 31 },
    ],
    sellerSignal: "strong_buy",
    sellerNote: "Fastest-growing AI recommendation category this quarter. High-AOV, AI drives 60%+ of discovery.",
    sellerNoteZh: "本季 AI 推荐增速最快品类。高客单价，AI 驱动超 60% 的品牌发现。",
    platforms: ["Amazon", "DTC", "TikTok"],
    platformNote: "DTC brands dominate AI citation — professional endorsements and clinical studies drive inclusion.",
    platformNoteZh: "DTC 品牌主导 AI 引用——专业背书和临床研究驱动被引用。",
  },
  {
    id: "hair-care-tools",
    category: "Hair Care Tools",
    categoryZh: "美发工具",
    parentSection: "Beauty & Care",
    parentSectionZh: "美妆个护",
    trend: "up",
    trendPts: "+4.1",
    topBrands: [
      { name: "Dyson",      sov: 44.2, arrs: 12 },
      { name: "BaByliss",   sov: 16.8, arrs: 34 },
      { name: "Shark",      sov: 12.3, arrs: 41 },
    ],
    sellerSignal: "watch",
    sellerNote: "Dyson's AI dominance (44% SOV) makes direct competition hard. Opportunity in mid-tier ($50–$150) segments AI underserves.",
    sellerNoteZh: "Dyson 的 AI 主导地位（44% SOV）使直接竞争困难。机会在 AI 服务不足的中端（$50–$150）细分市场。",
    platforms: ["Amazon", "TikTok"],
    platformNote: "TikTok hair tutorials have driven Dyson's AI mindshare — content strategy is the path in.",
    platformNoteZh: "TikTok 美发教程推动了 Dyson 的 AI 认知——内容策略是进入的路径。",
  },

  // ── TikTok Trending ────────────────────────────────────────────────────────
  {
    id: "tiktok-viral-beauty",
    category: "Viral Skincare & Beauty",
    categoryZh: "TikTok 爆款美妆",
    parentSection: "TikTok Trending",
    parentSectionZh: "TikTok 热卖",
    trend: "up",
    trendPts: "+8.4",
    topBrands: [
      { name: "CeraVe",     sov: 31.2, arrs: 16 },
      { name: "The Ordinary", sov: 22.7, arrs: 21 },
      { name: "Laneige",    sov: 14.8, arrs: 33 },
    ],
    sellerSignal: "strong_buy",
    sellerNote: "TikTok virality is directly feeding AI recommendation engines 2–4 weeks later. CeraVe's TikTok moment became AI dominance.",
    sellerNoteZh: "TikTok 爆红会在 2–4 周后直接输入 AI 推荐引擎。CeraVe 的 TikTok 时刻变成了 AI 主导地位。",
    platforms: ["TikTok", "Amazon"],
    platformNote: "Signal: TikTok virality → AI mention spike with 2–4 week lag. Monitor TikTok hashtag velocity as leading indicator.",
    platformNoteZh: "信号：TikTok 爆红 → 2–4 周后 AI 提及激增。监测 TikTok 话题标签速度作为领先指标。",
  },
  {
    id: "tiktok-home-gadgets",
    category: "Trending Home & Kitchen Gadgets",
    categoryZh: "TikTok 家居好物",
    parentSection: "TikTok Trending",
    parentSectionZh: "TikTok 热卖",
    trend: "up",
    trendPts: "+7.2",
    topBrands: [
      { name: "Carote",      sov: 22.4, arrs: 29 },
      { name: "Our Place",   sov: 18.7, arrs: 25 },
      { name: "Zulay",       sov: 11.3, arrs: 44 },
    ],
    sellerSignal: "strong_buy",
    sellerNote: "\"TikTok made me buy it\" gadgets are appearing in AI recommendation outputs 3–6 weeks post-viral. Window for entry is narrow.",
    sellerNoteZh: "「TikTok 让我买了它」系列好物在爆红后 3–6 周出现在 AI 推荐输出中。入场窗口很短。",
    platforms: ["TikTok", "Amazon", "Shopee"],
    platformNote: "Carote is a Chinese brand that won through TikTok content → AI citation flywheel. Blueprint for other brands.",
    platformNoteZh: "Carote 是通过 TikTok 内容 → AI 引用飞轮获胜的中国品牌，是其他品牌的蓝图。",
  },
  {
    id: "athletic-apparel",
    category: "Athletic & Activewear",
    categoryZh: "运动服饰",
    parentSection: "TikTok Trending",
    parentSectionZh: "TikTok 热卖",
    trend: "up",
    trendPts: "+5.9",
    topBrands: [
      { name: "Halara",      sov: 19.4, arrs: 38 },
      { name: "Alo Yoga",    sov: 24.6, arrs: 22 },
      { name: "Vuori",       sov: 18.2, arrs: 27 },
    ],
    sellerSignal: "strong_buy",
    sellerNote: "Halara's AI ARRS gap vs Alo (38 vs 22) shows upside — it's TikTok-viral but AI under-cites it. GEO opportunity confirmed.",
    sellerNoteZh: "Halara 与 Alo 的 AI ARRS 差距（38 vs 22）显示上升空间——TikTok 已爆红但 AI 引用不足。GEO 机会确认。",
    platforms: ["TikTok", "DTC"],
    platformNote: "Halara is building through TikTok; Alo owns AI. Content + citation strategy bridges the gap.",
    platformNoteZh: "Halara 通过 TikTok 成长，Alo 拥有 AI。内容 + 引用策略可弥合差距。",
  },

  // ── Family & Kids ──────────────────────────────────────────────────────────
  {
    id: "baby-gear",
    category: "Baby & Toddler Gear",
    categoryZh: "婴幼儿用品",
    parentSection: "Family & Kids",
    parentSectionZh: "母婴亲子",
    trend: "up",
    trendPts: "+3.8",
    topBrands: [
      { name: "Graco",       sov: 29.7, arrs: 21 },
      { name: "BABYBJÖRN",   sov: 22.4, arrs: 24 },
      { name: "Ergobaby",    sov: 16.8, arrs: 31 },
    ],
    sellerSignal: "strong_buy",
    sellerNote: "Safety-focused AI queries are rising. Brands with credible safety certifications (JPMA, CE, CPSC) are cited 3× more.",
    sellerNoteZh: "安全导向 AI 查询上升。持有可信安全认证（JPMA、CE、CPSC）的品牌被引用率高 3 倍。",
    platforms: ["Amazon", "Shopee"],
    platformNote: "Shopee SEA baby category growing 28% YoY. AI-driven discovery is primary research method for new parents.",
    platformNoteZh: "Shopee 东南亚婴幼儿品类同比增长 28%。AI 驱动的发现是新父母的主要研究方式。",
  },
  {
    id: "pet-products",
    category: "Pet Care & Accessories",
    categoryZh: "宠物用品",
    parentSection: "Family & Kids",
    parentSectionZh: "母婴亲子",
    trend: "up",
    trendPts: "+4.6",
    topBrands: [
      { name: "KONG",        sov: 24.3, arrs: 23 },
      { name: "Furbo",       sov: 18.7, arrs: 29 },
      { name: "PetLibro",    sov: 13.2, arrs: 41 },
    ],
    sellerSignal: "strong_buy",
    sellerNote: "Pet humanization trend is accelerating AI recommendation growth. PetLibro (Chinese brand) closing gap fast — ARRS dropped 12pts in 6 months.",
    sellerNoteZh: "宠物拟人化趋势加速 AI 推荐增长。PetLibro（中国品牌）快速追赶——ARRS 6 个月内下降 12pts。",
    platforms: ["Amazon", "TikTok"],
    platformNote: "TikTok pet content virality is the strongest AI citation predictor in this category.",
    platformNoteZh: "TikTok 宠物内容爆红是该品类最强的 AI 引用预测指标。",
  },
];

export const SECTIONS = [
  { id: "all",                  label: "All Categories",    labelZh: "全部品类" },
  { id: "Consumer Electronics", label: "Electronics",       labelZh: "消费电子" },
  { id: "Outdoor & Sports",     label: "Outdoor",           labelZh: "运动户外" },
  { id: "Home & Kitchen",       label: "Home",              labelZh: "家居厨房" },
  { id: "Beauty & Care",        label: "Beauty",            labelZh: "美妆个护" },
  { id: "TikTok Trending",      label: "TikTok Trending",   labelZh: "TikTok 热卖" },
  { id: "Family & Kids",        label: "Family",            labelZh: "母婴亲子" },
] as const;
