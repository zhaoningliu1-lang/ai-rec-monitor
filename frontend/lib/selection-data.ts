export type SellerSignal = "strong_buy" | "watch" | "avoid";

export interface BrandSov {
  name: string;
  sov: number;  // percentage 0-100
  arrs: number; // lower = better
}

export interface CategoryData {
  id: string;
  category: string;
  categoryZh: string;
  parentSection: "Consumer Electronics" | "Outdoor & Sports" | "Home & Kitchen" | "Beauty & Care";
  parentSectionZh: string;
  trend: "up" | "stable" | "down";
  trendPts: string;
  topBrands: BrandSov[];
  sellerSignal: SellerSignal;
  sellerNote: string;
  sellerNoteZh: string;
}

export const SELECTION_DATA: CategoryData[] = [
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
  },
  {
    id: "usb-c-chargers",
    category: "USB-C Chargers",
    categoryZh: "USB-C 充电器",
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
    sellerNote: "Anker dominates with 3× Ugreen SOV. High competition — only enter with clear differentiation.",
    sellerNoteZh: "Anker 声量是 Ugreen 的 3 倍。竞争激烈——仅在有明确差异化时入场。",
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
  },
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
  },
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
  },
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
  },
];

export const SECTIONS = [
  { id: "all",           label: "All Categories", labelZh: "全部品类" },
  { id: "Consumer Electronics", label: "Electronics",   labelZh: "消费电子" },
  { id: "Outdoor & Sports",     label: "Outdoor",       labelZh: "运动户外" },
  { id: "Home & Kitchen",       label: "Home",          labelZh: "家居厨房" },
  { id: "Beauty & Care",        label: "Beauty",        labelZh: "美妆个护" },
] as const;
