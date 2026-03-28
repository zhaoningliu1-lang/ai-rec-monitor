"""Mock 1688 supplier data, tariff lookup, and landed cost calculator.

Structured for future real API replacement — swap search_suppliers() internals
to call 1688 Open Platform when ready.
"""

from dataclasses import asdict, dataclass, field


@dataclass
class Supplier:
    id: str
    name: str           # Chinese supplier name
    name_en: str
    location: str       # e.g., "Yongkang, Zhejiang"
    min_order: int
    unit_price_usd: float
    lead_time_days: int
    rating: float
    transactions: int
    image_url: str
    categories: list[str] = field(default_factory=list)
    certifications: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class TariffInfo:
    hs_code: str
    description: str
    duty_rate_pct: float
    section_301_pct: float
    notes: str

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class LandedCostBreakdown:
    supplier_unit_cost: float
    quantity: int
    shipping_per_unit: float
    duty_amount: float
    section_301_amount: float
    fba_fee: float
    total_landed_per_unit: float
    total_cost: float
    suggested_retail: float
    estimated_margin_pct: float
    duty_pct: float
    section_301_pct: float

    def to_dict(self) -> dict:
        return asdict(self)


# ── Mock 1688 Supplier Database ────────────────────────────────────────────

MOCK_SUPPLIERS: dict[str, list[Supplier]] = {
    "cookware": [
        Supplier("sup-001", "永康市金厨炊具有限公司", "Yongkang Jinchu Cookware Co., Ltd",
                 "Yongkang, Zhejiang", 500, 4.80, 25, 4.7, 12400,
                 "/mock/supplier-cookware-1.jpg",
                 ["wok", "frying pan", "cookware", "stainless steel"],
                 ["FDA", "LFGB", "SGS"]),
        Supplier("sup-002", "广州市厨邦不粘锅制造有限公司", "Guangzhou Chubang Nonstick Manufacturing",
                 "Guangzhou, Guangdong", 300, 5.20, 20, 4.8, 8700,
                 "/mock/supplier-cookware-2.jpg",
                 ["nonstick pan", "ceramic cookware", "frying pan"],
                 ["FDA", "CE", "PFOA-free"]),
        Supplier("sup-003", "武义县恒达金属制品有限公司", "Wuyi Hengda Metal Products Co., Ltd",
                 "Wuyi, Zhejiang", 200, 6.50, 30, 4.5, 5300,
                 "/mock/supplier-cookware-3.jpg",
                 ["cast iron", "dutch oven", "grill pan", "cookware"],
                 ["FDA", "SGS", "ISO9001"]),
        Supplier("sup-004", "潮州市枫溪区鑫源陶瓷厂", "Chaozhou Xinyuan Ceramics Factory",
                 "Chaozhou, Guangdong", 1000, 3.20, 35, 4.3, 3100,
                 "/mock/supplier-cookware-4.jpg",
                 ["ceramic", "bakeware", "casserole", "cookware"],
                 ["FDA", "CE"]),
    ],
    "baby": [
        Supplier("sup-101", "汕头市澄海区贝乐玩具有限公司", "Shantou Beile Baby Products Co., Ltd",
                 "Shantou, Guangdong", 500, 3.50, 25, 4.6, 9800,
                 "/mock/supplier-baby-1.jpg",
                 ["baby pillow", "baby blanket", "infant products"],
                 ["CPSIA", "CPC", "ASTM F963"]),
        Supplier("sup-102", "义乌市母婴优品贸易有限公司", "Yiwu Muying Premium Trading Co., Ltd",
                 "Yiwu, Zhejiang", 200, 4.80, 20, 4.7, 6500,
                 "/mock/supplier-baby-2.jpg",
                 ["baby bottle", "sippy cup", "feeding supplies"],
                 ["FDA", "BPA-free", "CPSIA"]),
        Supplier("sup-103", "宁波安贝儿童用品有限公司", "Ningbo Anbei Children Products Co., Ltd",
                 "Ningbo, Zhejiang", 300, 7.20, 30, 4.8, 4200,
                 "/mock/supplier-baby-3.jpg",
                 ["baby carrier", "stroller accessories", "car seat"],
                 ["CPSIA", "EN 13209", "ASTM"]),
    ],
    "electronics": [
        Supplier("sup-201", "深圳市极光科技有限公司", "Shenzhen Aurora Tech Co., Ltd",
                 "Shenzhen, Guangdong", 100, 12.50, 15, 4.9, 21000,
                 "/mock/supplier-electronics-1.jpg",
                 ["wireless charger", "power bank", "USB hub", "electronics"],
                 ["FCC", "CE", "RoHS", "UL"]),
        Supplier("sup-202", "东莞市佳声电子有限公司", "Dongguan Jiasheng Electronics Co., Ltd",
                 "Dongguan, Guangdong", 200, 8.90, 20, 4.6, 15600,
                 "/mock/supplier-electronics-2.jpg",
                 ["bluetooth speaker", "earbuds", "audio", "electronics"],
                 ["FCC", "CE", "BQB"]),
        Supplier("sup-203", "惠州市智联光电科技有限公司", "Huizhou Zhilian Optoelectronics",
                 "Huizhou, Guangdong", 500, 6.30, 25, 4.4, 7800,
                 "/mock/supplier-electronics-3.jpg",
                 ["LED strip", "smart light", "desk lamp", "electronics"],
                 ["FCC", "CE", "ETL", "UL"]),
    ],
    "home": [
        Supplier("sup-301", "南通市海安居家纺织有限公司", "Nantong Haian Home Textile Co., Ltd",
                 "Nantong, Jiangsu", 200, 5.80, 20, 4.7, 11200,
                 "/mock/supplier-home-1.jpg",
                 ["bedding", "throw blanket", "pillow cover", "home textile"],
                 ["OEKO-TEX", "BSCI"]),
        Supplier("sup-302", "慈溪市恒洁卫浴有限公司", "Cixi Hengjie Bathroom Products Co., Ltd",
                 "Cixi, Zhejiang", 500, 4.20, 25, 4.5, 6900,
                 "/mock/supplier-home-2.jpg",
                 ["bathroom organizer", "shower caddy", "soap dispenser"],
                 ["SGS", "ISO9001"]),
        Supplier("sup-303", "佛山市顺德区创意家居有限公司", "Foshan Shunde Creative Home Co., Ltd",
                 "Foshan, Guangdong", 100, 9.50, 15, 4.8, 8400,
                 "/mock/supplier-home-3.jpg",
                 ["storage rack", "kitchen organizer", "shelf", "home decor"],
                 ["SGS", "BSCI", "ISO14001"]),
    ],
    "outdoor": [
        Supplier("sup-401", "永康市探路者户外用品有限公司", "Yongkang Trailblazer Outdoor Co., Ltd",
                 "Yongkang, Zhejiang", 300, 7.80, 25, 4.6, 5600,
                 "/mock/supplier-outdoor-1.jpg",
                 ["camping stove", "portable grill", "outdoor cookware"],
                 ["FDA", "CE", "SGS"]),
        Supplier("sup-402", "厦门绿野户外装备有限公司", "Xiamen Greenfield Outdoor Equipment",
                 "Xiamen, Fujian", 200, 11.50, 20, 4.7, 3800,
                 "/mock/supplier-outdoor-2.jpg",
                 ["tent", "sleeping bag", "backpack", "camping"],
                 ["SGS", "BSCI", "ISO9001"]),
    ],
}


# ── Tariff Lookup Table ────────────────────────────────────────────────────

TARIFF_TABLE: dict[str, TariffInfo] = {
    "7323.93": TariffInfo("7323.93", "Stainless steel table/kitchen articles",
                          3.4, 7.5, "List 4A Section 301 tariff applies"),
    "7323.94": TariffInfo("7323.94", "Iron/steel enameled kitchen articles",
                          3.4, 7.5, "List 4A Section 301"),
    "7615.10": TariffInfo("7615.10", "Aluminum table/kitchen articles",
                          3.1, 7.5, "List 4A Section 301"),
    "3924.10": TariffInfo("3924.10", "Plastic tableware & kitchenware",
                          3.4, 7.5, "List 4A Section 301"),
    "6911.10": TariffInfo("6911.10", "Ceramic tableware & kitchenware",
                          8.0, 7.5, "List 4A Section 301"),
    "6912.00": TariffInfo("6912.00", "Ceramic household articles",
                          6.0, 7.5, "List 4A Section 301"),
    "9503.00": TariffInfo("9503.00", "Toys, puzzles, models",
                          0.0, 7.5, "List 4A Section 301"),
    "9401.71": TariffInfo("9401.71", "Upholstered metal-frame seats",
                          0.0, 25.0, "List 3 Section 301"),
    "8516.79": TariffInfo("8516.79", "Electric kitchen appliances (other)",
                          3.4, 25.0, "List 3 Section 301"),
    "8516.60": TariffInfo("8516.60", "Electric cooking stoves/ranges",
                          3.4, 25.0, "List 3 Section 301"),
    "9404.90": TariffInfo("9404.90", "Pillows, cushions & similar furnishings",
                          6.0, 7.5, "List 4A Section 301"),
    "6302.31": TariffInfo("6302.31", "Cotton bed linen",
                          7.4, 7.5, "List 4A Section 301"),
    "8504.40": TariffInfo("8504.40", "Static converters (power supplies/chargers)",
                          1.5, 25.0, "List 2 Section 301"),
    "8518.40": TariffInfo("8518.40", "Audio-frequency electric amplifiers",
                          4.9, 25.0, "List 3 Section 301"),
    "9405.42": TariffInfo("9405.42", "LED light fixtures",
                          3.9, 7.5, "List 4A Section 301"),
    "4202.92": TariffInfo("4202.92", "Travel bags, backpacks (textile outer)",
                          17.6, 7.5, "List 4A Section 301"),
    "6306.22": TariffInfo("6306.22", "Tents of synthetic fibers",
                          9.0, 7.5, "List 4A Section 301"),
}


# ── Search & Calculation Functions ─────────────────────────────────────────

def search_suppliers(keyword: str) -> list[Supplier]:
    """Fuzzy keyword match against mock 1688 supplier data."""
    keyword_lower = keyword.lower()
    results: list[Supplier] = []
    for _cat, suppliers in MOCK_SUPPLIERS.items():
        for s in suppliers:
            # Match against supplier categories, name, name_en
            searchable = " ".join(s.categories + [s.name, s.name_en, _cat]).lower()
            if keyword_lower in searchable or any(kw in searchable for kw in keyword_lower.split()):
                results.append(s)
    # Deduplicate by id and sort by rating desc
    seen = set()
    unique: list[Supplier] = []
    for s in results:
        if s.id not in seen:
            seen.add(s.id)
            unique.append(s)
    unique.sort(key=lambda x: (-x.rating, -x.transactions))
    return unique


def get_tariff(hs_code: str) -> TariffInfo | None:
    """Look up tariff info by HS code."""
    return TARIFF_TABLE.get(hs_code)


def calculate_landed_cost(
    supplier_unit_cost: float,
    quantity: int,
    hs_code: str,
    weight_kg: float = 1.0,
) -> LandedCostBreakdown:
    """Calculate full landed cost breakdown for importing from China to US.

    Includes: sea freight shipping, customs duty, Section 301 tariff, FBA fees.
    """
    tariff = get_tariff(hs_code)
    duty_pct = tariff.duty_rate_pct if tariff else 3.4
    s301_pct = tariff.section_301_pct if tariff else 7.5

    # Shipping: ~$4.50/kg sea freight (includes port fees, drayage, etc.)
    shipping_per_unit = round(weight_kg * 4.50, 2)

    # CIF value (cost + insurance + freight)
    cif = supplier_unit_cost + shipping_per_unit

    # Duty and 301 tariff applied on CIF value
    duty_amount = round(cif * duty_pct / 100, 2)
    s301_amount = round(cif * s301_pct / 100, 2)

    # FBA fee estimate (referral 15% on retail + fulfillment ~$3-6 based on weight)
    fba_fulfillment = round(3.00 + weight_kg * 1.50, 2)

    # Total landed cost before FBA referral
    landed_before_referral = supplier_unit_cost + shipping_per_unit + duty_amount + s301_amount + fba_fulfillment

    # Suggested retail: ~2.8x landed (healthy margin for cross-border)
    suggested_retail = round(landed_before_referral * 2.8, 2)

    # FBA referral fee (15% of retail)
    fba_referral = round(suggested_retail * 0.15, 2)

    # Total landed cost per unit (all-in)
    total_landed = round(landed_before_referral + fba_referral, 2)

    # Margin
    margin_pct = round((suggested_retail - total_landed) / suggested_retail * 100, 1)

    return LandedCostBreakdown(
        supplier_unit_cost=supplier_unit_cost,
        quantity=quantity,
        shipping_per_unit=shipping_per_unit,
        duty_amount=duty_amount,
        section_301_amount=s301_amount,
        fba_fee=round(fba_fulfillment + fba_referral, 2),
        total_landed_per_unit=total_landed,
        total_cost=round(total_landed * quantity, 2),
        suggested_retail=suggested_retail,
        estimated_margin_pct=margin_pct,
        duty_pct=duty_pct,
        section_301_pct=s301_pct,
    )
