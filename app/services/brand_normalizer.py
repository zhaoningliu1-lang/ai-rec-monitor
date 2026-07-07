"""
Brand name normalization: resolve brand names from any language to their
English equivalents for consistent AI mention detection.

Strategy (in order):
1. Exact match in hardcoded alias table → instant, zero API cost
2. Non-ASCII script detected (CJK / Cyrillic / Arabic / etc.) → Claude Haiku
3. ASCII brand name → keep as-is (AI responds in English anyway)

This ensures that searching "绿联" and "UGREEN" always produces identical SOV.
"""
import logging
import re

logger = logging.getLogger(__name__)


# ── Hardcoded brand alias table ──────────────────────────────────────────────
# Format: "本地名称": "Official English Name"
# Covers ~150 well-known global brands to avoid unnecessary LLM calls.

_KNOWN_ALIASES: dict[str, str] = {

    # ── Consumer Electronics & Accessories (China) ─────────────────────────
    "绿联": "UGREEN",
    "安克": "Anker",
    "倍思": "Baseus",
    "品胜": "PISEN",
    "公牛": "Bull",
    "德力西": "DELIXI",
    "奥睿科": "ORICO",
    "雷柏": "Rapoo",
    "漫步者": "Edifier",
    "飞利浦": "Philips",
    "索尼": "Sony",
    "三星": "Samsung",
    "苹果": "Apple",
    "华为": "Huawei",
    "小米": "Xiaomi",
    "荣耀": "Honor",
    "一加": "OnePlus",
    "魅族": "Meizu",
    "联想": "Lenovo",
    "华硕": "ASUS",
    "戴尔": "Dell",
    "惠普": "HP",
    "宏碁": "Acer",
    "微软": "Microsoft",
    "谷歌": "Google",
    "英特尔": "Intel",
    "英伟达": "NVIDIA",
    "高通": "Qualcomm",

    # ── Cameras & Drones ──────────────────────────────────────────────────
    "大疆": "DJI",
    "海康威视": "Hikvision",
    "大华": "Dahua",
    "佳能": "Canon",
    "尼康": "Nikon",
    "富士": "Fujifilm",
    "奥林巴斯": "Olympus",
    "徕卡": "Leica",

    # ── Smart Home / Robotics ─────────────────────────────────────────────
    "科沃斯": "Ecovacs",
    "石头科技": "Roborock",
    "追觅": "Dreame",
    "云鲸": "Narwal",
    "米家": "Xiaomi Smart",
    "涂鸦": "Tuya",
    "欧普": "OPPLE",
    "雷士": "NVC",

    # ── Power & Energy ────────────────────────────────────────────────────
    "正浩": "EcoFlow",
    "德兰明海": "Bluetti",
    "宝时得": "Positec",
    "创科": "Techtronic",

    # ── Audio ─────────────────────────────────────────────────────────────
    "博士": "Bose",
    "哈曼卡顿": "Harman Kardon",
    "拜亚动力": "Beyerdynamic",
    "森海塞尔": "Sennheiser",
    "铁三角": "Audio-Technica",
    "哈曼": "Harman",

    # ── Home Appliances ───────────────────────────────────────────────────
    "海尔": "Haier",
    "美的": "Midea",
    "格力": "Gree",
    "海信": "Hisense",
    "奥克斯": "AUX",
    "志高": "CHIGO",
    "创维": "Skyworth",
    "长虹": "Changhong",
    "康佳": "KONKA",
    "方太": "Fotile",
    "老板": "Robam",
    "苏泊尔": "Supor",
    "九阳": "Joyoung",
    "小熊": "Bear",
    "飞科": "Flyco",
    "松下": "Panasonic",
    "东芝": "Toshiba",
    "日立": "Hitachi",
    "三菱": "Mitsubishi",
    "大金": "Daikin",
    "伊莱克斯": "Electrolux",

    # ── Beauty & Skincare ─────────────────────────────────────────────────
    "欧莱雅": "L'Oreal",
    "兰蔻": "Lancome",
    "雅诗兰黛": "Estee Lauder",
    "资生堂": "Shiseido",
    "科颜氏": "Kiehl's",
    "薇诺娜": "Winona",
    "珀莱雅": "Proya",
    "百雀羚": "Pechoin",
    "自然堂": "Chando",
    "花西子": "Florasis",
    "完美日记": "Perfect Diary",
    "橘朵": "Judydoll",
    "悦诗风吟": "Innisfree",
    "雪花秀": "Sulwhasoo",
    "兰芝": "Laneige",
    "伊蒂之屋": "Etude House",
    "后": "The History of Whoo",
    "赫莲娜": "Helena Rubinstein",
    "海蓝之谜": "La Mer",
    "娇兰": "Guerlain",
    "纪梵希": "Givenchy",
    "阿玛尼": "Armani",
    "香奈儿": "Chanel",
    "迪奥": "Dior",

    # ── Sportswear & Apparel ──────────────────────────────────────────────
    "耐克": "Nike",
    "阿迪达斯": "Adidas",
    "彪马": "Puma",
    "安踏": "ANTA",
    "李宁": "Li-Ning",
    "特步": "Xtep",
    "鸿星尔克": "ERKE",
    "波司登": "Bosideng",
    "优衣库": "Uniqlo",
    "ZARA": "Zara",

    # ── Automotive ────────────────────────────────────────────────────────
    "比亚迪": "BYD",
    "吉利": "Geely",
    "长城": "Great Wall",
    "奇瑞": "Chery",
    "长安": "Changan",
    "理想": "Li Auto",
    "蔚来": "NIO",
    "小鹏": "Xpeng",
    "问界": "AITO",
    "丰田": "Toyota",
    "本田": "Honda",
    "日产": "Nissan",
    "马自达": "Mazda",
    "斯巴鲁": "Subaru",
    "宝马": "BMW",
    "奔驰": "Mercedes-Benz",
    "奥迪": "Audi",
    "大众": "Volkswagen",
    "宝时捷": "Porsche",
    "保时捷": "Porsche",
    "沃尔沃": "Volvo",
    "现代": "Hyundai",
    "起亚": "Kia",

    # ── Food & Beverage ───────────────────────────────────────────────────
    "娃哈哈": "Wahaha",
    "农夫山泉": "Nongfu Spring",
    "元气森林": "Genki Forest",
    "三顿半": "Saturnbird",
    "喜茶": "HEYTEA",
    "奈雪的茶": "Nayuki",
    "星巴克": "Starbucks",
    "麦当劳": "McDonald's",
    "肯德基": "KFC",
    "必胜客": "Pizza Hut",
    "汉堡王": "Burger King",

    # ── Internet / Software ───────────────────────────────────────────────
    "字节跳动": "ByteDance",
    "抖音": "TikTok",
    "微信": "WeChat",
    "支付宝": "Alipay",
    "淘宝": "Taobao",
    "天猫": "Tmall",
    "京东": "JD.com",
    "拼多多": "Pinduoduo",
    "美团": "Meituan",
    "滴滴": "DiDi",
    "百度": "Baidu",
    "腾讯": "Tencent",
    "阿里巴巴": "Alibaba",
    "网易": "NetEase",
    "爱奇艺": "iQIYI",
    "优酷": "Youku",
    "哔哩哔哩": "Bilibili",
    "快手": "Kuaishou",
    "小红书": "Xiaohongshu",

    # ── Korean Brands (Hangul) ────────────────────────────────────────────
    "삼성": "Samsung",
    "엘지": "LG",
    "엘지전자": "LG Electronics",
    "현대": "Hyundai",
    "기아": "Kia",
    "아모레퍼시픽": "AmorePacific",
    "설화수": "Sulwhasoo",
    "라네즈": "Laneige",
    "이니스프리": "Innisfree",
    "에뛰드": "Etude House",
    "스킨푸드": "Skinfood",
    "닥터자르트": "Dr. Jart+",
    "네이버": "Naver",
    "카카오": "Kakao",
    "쿠팡": "Coupang",

    # ── Japanese Brands (Kanji/Kana) ──────────────────────────────────────
    "ソニー": "Sony",
    "パナソニック": "Panasonic",
    "東芝": "Toshiba",
    "キヤノン": "Canon",
    "ニコン": "Nikon",
    "シャープ": "Sharp",
    "ブラザー": "Brother",
    "任天堂": "Nintendo",
    "トヨタ": "Toyota",
    "ホンダ": "Honda",
    "日産": "Nissan",
    "富士通": "Fujitsu",
    "日本電気": "NEC",
    "無印良品": "Muji",
    "ユニクロ": "Uniqlo",
    "資生堂": "Shiseido",
    "花王": "Kao",
    "ライオン": "Lion",

    # ── Russian / Cyrillic Brands ─────────────────────────────────────────
    "Яндекс": "Yandex",
    "Сбер": "Sber",
    "Сбербанк": "Sberbank",
    "Лукойл": "Lukoil",
    "Газпром": "Gazprom",
    "МТС": "MTS",
    "Мегафон": "MegaFon",
    "Аэрофлот": "Aeroflot",
    "ВКонтакте": "VKontakte",

    # ── Arabic Brands ─────────────────────────────────────────────────────
    "سامسونج": "Samsung",
    "آبل": "Apple",
    "هواوي": "Huawei",
    "شاومي": "Xiaomi",
    "طيران الإمارات": "Emirates",
    "الاتحاد للطيران": "Etihad Airways",
    "نون": "Noon",
    "جرير": "Jarir",
    "أمازون": "Amazon",

    # ── Traditional Chinese (繁體中文) ─────────────────────────────────────────
    # Consumer Electronics
    "綠聯": "UGREEN",
    "品勝": "PISEN",
    "奧睿科": "ORICO",
    "飛利浦": "Philips",
    "蘋果": "Apple",
    "華為": "Huawei",
    "榮耀": "Honor",
    "聯想": "Lenovo",
    "華碩": "ASUS",
    "戴爾": "Dell",
    "微軟": "Microsoft",
    "英特爾": "Intel",
    "英偉達": "NVIDIA",

    # Cameras & Drones (TC)
    "海康威視": "Hikvision",
    "大華": "Dahua",
    "奧林巴斯": "Olympus",
    "徠卡": "Leica",

    # Smart Home (TC)
    "石頭科技": "Roborock",
    "追覓": "Dreame",
    "雲鯨": "Narwal",
    "塗鴉": "Tuya",
    "歐普": "OPPLE",

    # Power & Energy (TC)
    "德蘭明海": "Bluetti",
    "寶時得": "Positec",
    "創科": "Techtronic",

    # Audio (TC)
    "哈曼卡頓": "Harman Kardon",
    "拜亞動力": "Beyerdynamic",
    "森海塞爾": "Sennheiser",
    "鐵三角": "Audio-Technica",

    # Home Appliances (TC)
    "海爾": "Haier",
    "奧克斯": "AUX",
    "創維": "Skyworth",
    "長虹": "Changhong",
    "老闆": "Robam",
    "蘇泊爾": "Supor",
    "九陽": "Joyoung",
    "飛科": "Flyco",
    "東芝": "Toshiba",
    "伊萊克斯": "Electrolux",

    # Beauty (TC)
    "歐萊雅": "L'Oreal",
    "蘭蔻": "Lancome",
    "雅詩蘭黛": "Estee Lauder",
    "科顏氏": "Kiehl's",
    "薇諾娜": "Winona",
    "珀萊雅": "Proya",
    "完美日記": "Perfect Diary",
    "悅詩風吟": "Innisfree",
    "蘭芝": "Laneige",
    "後": "The History of Whoo",
    "赫蓮娜": "Helena Rubinstein",
    "海藍之謎": "La Mer",
    "嬌蘭": "Guerlain",
    "紀梵希": "Givenchy",
    "阿瑪尼": "Armani",
    "香奈兒": "Chanel",
    "迪奧": "Dior",

    # Sportswear (TC)
    "阿迪達斯": "Adidas",
    "彪馬": "Puma",
    "李寧": "Li-Ning",
    "鴻星爾克": "ERKE",
    "優衣庫": "Uniqlo",

    # Automotive (TC)
    "比亞迪": "BYD",
    "長城": "Great Wall",
    "長安": "Changan",
    "蔚來": "NIO",
    "小鵬": "Xpeng",
    "問界": "AITO",
    "豐田": "Toyota",
    "日產": "Nissan",
    "馬自達": "Mazda",
    "斯巴魯": "Subaru",
    "寶馬": "BMW",
    "賓士": "Mercedes-Benz",
    "平治": "Mercedes-Benz",   # Hong Kong variant
    "奧迪": "Audi",
    "大眾": "Volkswagen",
    "保時捷": "Porsche",
    "富豪": "Volvo",           # Taiwan variant for Volvo
    "現代": "Hyundai",
    "起亞": "Kia",

    # Food & Beverage (TC)
    "農夫山泉": "Nongfu Spring",
    "元氣森林": "Genki Forest",
    "三頓半": "Saturnbird",
    "麥當勞": "McDonald's",
    "必勝客": "Pizza Hut",
    "漢堡王": "Burger King",

    # Internet / Software (TC)
    "字節跳動": "ByteDance",
    "支付寶": "Alipay",
    "淘寶": "Taobao",
    "天貓": "Tmall",
    "京東": "JD.com",
    "美團": "Meituan",
    "騰訊": "Tencent",
    "網易": "NetEase",
    "愛奇藝": "iQIYI",
    "優酷": "Youku",
    "嗶哩嗶哩": "Bilibili",
    "小紅書": "Xiaohongshu",

    # ── Spanish Brands ────────────────────────────────────────────────────────
    "El Corte Inglés": "El Corte Ingles",
    "Telefónica": "Telefonica",
    "Movistar": "Movistar",
    "Iberdrola": "Iberdrola",
    "Banco Santander": "Santander",
    "Santander": "Santander",
    "BBVA": "BBVA",
    "CaixaBank": "CaixaBank",
    "Mapfre": "Mapfre",
    "Inditex": "Inditex",
    "Mercadona": "Mercadona",
    "SEAT": "SEAT",
    "Cupra": "Cupra",
    "Correos": "Correos",
    "Endesa": "Endesa",
    "Repsol": "Repsol",
    "Mango": "Mango",
    "Campofrío": "Campofrio",
    "El Pozo": "El Pozo",
    "Mahou": "Mahou",
    "Estrella Damm": "Estrella Damm",
    "Estrella Galicia": "Estrella Galicia",
    "Desigual": "Desigual",
    "Tous": "Tous",
    "Loewe": "Loewe",

    # ── Portuguese (Brazil) Brands ────────────────────────────────────────────
    "Magazine Luiza": "Magazine Luiza",
    "Magalu": "Magazine Luiza",
    "Lojas Americanas": "Americanas",
    "Americanas": "Americanas",
    "Mercado Livre": "MercadoLibre",
    "Itaú": "Itau",
    "Itaú Unibanco": "Itau",
    "Banco Bradesco": "Bradesco",
    "Bradesco": "Bradesco",
    "Banco do Brasil": "Banco do Brasil",
    "Caixa Econômica Federal": "Caixa",
    "O Boticário": "O Boticario",
    "Boticário": "O Boticario",
    "Natura": "Natura",
    "Havaianas": "Havaianas",
    "Petrobras": "Petrobras",
    "Embraer": "Embraer",
    "Nubank": "Nubank",
    "iFood": "iFood",
    "Rappi": "Rappi",
    "Ambev": "Ambev",
    "Skol": "Skol",
    "Brahma": "Brahma",
    "Antarctica": "Antarctica",
    "Totvs": "Totvs",
    "Oi": "Oi",
    "Claro Brasil": "Claro",
    "Tim Brasil": "TIM Brasil",
    "Vivo": "Vivo",
    "Casas Bahia": "Casas Bahia",
    "Ponto Frio": "Ponto Frio",
    "Lojas Renner": "Renner",
    "Renner": "Renner",
    "Riachuelo": "Riachuelo",
    "Arezzo": "Arezzo",
    "Hering": "Hering",
    "Reserva": "Reserva",
    "Farm Rio": "Farm Rio",
    "Melissa": "Melissa",
    "Grendene": "Grendene",
    "Quinto Andar": "QuintoAndar",
    "XP Investimentos": "XP Inc",
    "Itaúsa": "Itausa",
}

# ── Script detection ──────────────────────────────────────────────────────────
# Matches any non-Latin script that would need resolution
_NON_ASCII_SCRIPT_RE = re.compile(
    r"["
    r"\u4e00-\u9fff"    # CJK Unified Ideographs
    r"\u3040-\u30ff"    # Hiragana + Katakana
    r"\uac00-\ud7af"    # Hangul Syllables
    r"\u1100-\u11ff"    # Hangul Jamo
    r"\u3400-\u4dbf"    # CJK Extension A
    r"\u0400-\u04ff"    # Cyrillic
    r"\u0600-\u06ff"    # Arabic
    r"\u0750-\u077f"    # Arabic Supplement
    r"\u0900-\u097f"    # Devanagari (Hindi)
    r"\u0e00-\u0e7f"    # Thai
    r"\u0600-\u06ff"    # Arabic
    r"\u05d0-\u05ea"    # Hebrew
    r"\u0370-\u03ff"    # Greek
    r"]"
)


def _contains_non_ascii_script(text: str) -> bool:
    return bool(_NON_ASCII_SCRIPT_RE.search(text))


async def _resolve_via_llm(name: str) -> str | None:
    """
    Call Claude Haiku to resolve an unknown non-ASCII brand name to English.
    Used only as fallback when the hardcoded table has no match.
    """
    from app.config import settings

    if not settings.anthropic_api_key:
        return None

    try:
        import anthropic

        client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
        msg = await client.messages.create(
            model="claude-fable-5",
            max_tokens=30,
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"What is the official English brand name for '{name}'? "
                        "Reply with ONLY the English brand name (1-4 words). "
                        "If unknown or already English, reply with the original name."
                    ),
                }
            ],
        )
        result = msg.content[0].text.strip().strip('"').strip("'") if msg.content else None
        if result and result.lower() != name.lower():
            logger.info("LLM alias resolved: '%s' → '%s'", name, result)
            return result
    except Exception as exc:
        logger.warning("LLM alias resolution failed for '%s': %s", name, exc)

    return None


async def build_name_aliases(
    brand_name: str,
    competitor_names: list[str],
) -> dict[str, list[str]]:
    """
    Build a mapping of {original_name: [list_of_aliases]} for the brand and
    all competitors.

    Resolution order per name:
    1. Hardcoded table lookup → zero latency, zero cost
    2. Non-ASCII script detected → Claude Haiku LLM call
    3. ASCII name → single-element list (no resolution needed)

    Example:
        brand="绿联", competitors=["安克", "Belkin"]
        → {"绿联": ["绿联", "UGREEN"], "安克": ["安克", "Anker"], "Belkin": ["Belkin"]}
    """
    aliases: dict[str, list[str]] = {}

    for name in [brand_name] + list(competitor_names):
        name_stripped = name.strip()

        # 1. Hardcoded lookup (exact match)
        english = _KNOWN_ALIASES.get(name_stripped)
        if english:
            aliases[name] = [name, english]
            logger.info("Alias (table): '%s' → '%s'", name, english)
            continue

        # 2. Non-ASCII script → LLM fallback
        if _contains_non_ascii_script(name_stripped):
            llm_english = await _resolve_via_llm(name_stripped)
            if llm_english:
                aliases[name] = [name, llm_english]
            else:
                aliases[name] = [name]
            continue

        # 3. ASCII brand — no resolution needed
        aliases[name] = [name]

    return aliases
