export interface CategoryParent {
  id: string;
  labelKey: string; // key in t.categories for i18n label
  children: string[]; // exact category strings from DB (case-insensitive match)
}

export const CATEGORY_HIERARCHY: CategoryParent[] = [
  {
    id: "consumer-electronics",
    labelKey: "sectionConsumerElec",
    children: [
      "Consumer Electronics",
      "Consumer electronics",
      "USB-C Chargers",
      "Portable Charger",
      "Portable Power Stations",
      "Solar Panels",
      "Wireless Earbuds",
      "Bluetooth Speakers",
      "Smart Home Devices",
    ],
  },
  {
    id: "beauty",
    labelKey: "sectionBeauty",
    children: ["Beauty & skincare", "Beauty & Personal Care", "Skincare", "Hair Care", "Makeup"],
  },
  {
    id: "home-kitchen",
    labelKey: "sectionHomeKitchen",
    children: ["Home & kitchen", "Home & Kitchen", "Kitchen Appliances", "Cookware", "Home Organization"],
  },
  {
    id: "sports",
    labelKey: "sectionSports",
    children: ["Sports & outdoor", "Sports & Outdoors", "Camping Gear", "Fitness Equipment", "Cycling"],
  },
  {
    id: "health",
    labelKey: "sectionHealth",
    children: ["Health & wellness", "Health & Wellness", "Supplements", "Medical Devices"],
  },
  {
    id: "pet",
    labelKey: "sectionPet",
    children: ["Pet supplies", "Pet Supplies", "Dog Supplies", "Cat Supplies"],
  },
  {
    id: "baby",
    labelKey: "sectionBaby",
    children: ["Baby & kids", "Baby & Kids", "Baby Gear", "Kids Toys", "Educational Toys"],
  },
  {
    id: "food",
    labelKey: "sectionFood",
    children: ["Food & beverage", "Food & Beverage", "Coffee & Tea", "Snacks", "Protein & Nutrition"],
  },
  {
    id: "apparel",
    labelKey: "sectionGeneral", // re-use general if no dedicated key
    children: ["Apparel & fashion", "Apparel & Fashion", "Athletic Wear", "Footwear"],
  },
  {
    id: "software",
    labelKey: "sectionSoftware",
    children: ["Software / SaaS", "Productivity Tools", "Marketing Software", "Developer Tools"],
  },
];

/** Groups a flat API category list into parent sections.
 *  Categories not matched by any parent fall into "general". */
export function groupCategoriesByParent(
  flat: { category: string; brand_count: number }[]
): { parent: { id: string; labelKey: string }; entries: { category: string; brand_count: number }[] }[] {
  const childToParent = new Map<string, string>();
  for (const parent of CATEGORY_HIERARCHY) {
    for (const child of parent.children) {
      childToParent.set(child.toLowerCase(), parent.id);
    }
  }

  const grouped = new Map<string, { category: string; brand_count: number }[]>();
  for (const entry of flat) {
    const parentId = childToParent.get(entry.category.toLowerCase()) ?? "general";
    if (!grouped.has(parentId)) grouped.set(parentId, []);
    grouped.get(parentId)!.push(entry);
  }

  const result: { parent: { id: string; labelKey: string }; entries: { category: string; brand_count: number }[] }[] = [];
  for (const parent of CATEGORY_HIERARCHY) {
    const entries = grouped.get(parent.id) ?? [];
    if (entries.length > 0) result.push({ parent, entries });
  }

  const uncategorized = grouped.get("general") ?? [];
  if (uncategorized.length > 0) {
    result.push({ parent: { id: "general", labelKey: "sectionGeneral" }, entries: uncategorized });
  }

  return result;
}
