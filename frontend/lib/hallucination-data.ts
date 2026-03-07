// AI Hallucination Detector — demo data
// Each brand has claims from 3 AI models, each claim is fact-checked

export type ClaimStatus = "accurate" | "wrong" | "partial";
export type ModelName = "ChatGPT" | "Claude" | "Gemini";
export type HrsLevel = "low" | "medium" | "high";

export interface Claim {
  text: string;         // What AI actually said
  status: ClaimStatus;
  correction?: string;  // What's actually true (for wrong / partial)
}

export interface ModelResponse {
  model: ModelName;
  claims: Claim[];
}

export interface BrandHallucination {
  id: string;
  brand: string;
  category: string;
  geoScore: number;
  responses: ModelResponse[];
}

export const HALLUCINATION_BRANDS: BrandHallucination[] = [
  {
    id: "noco-gb40",
    brand: "NOCO Boost GB40",
    category: "Car Jump Starters",
    geoScore: 74,
    responses: [
      {
        model: "ChatGPT",
        claims: [
          { text: "Delivers 1000A peak current for 12V batteries", status: "accurate" },
          { text: "Priced between $79–$89 on Amazon", status: "wrong", correction: "Actual retail: $99.95" },
          { text: "Compatible with engines up to 6.0L gas and 4.0L diesel", status: "partial", correction: "Gas is correct (6.0L); diesel is 3.0L, not 4.0L" },
          { text: "Includes spark-proof connection and reverse polarity protection", status: "accurate" },
          { text: "Weighs approximately 2.4 pounds", status: "accurate" },
        ],
      },
      {
        model: "Claude",
        claims: [
          { text: "Provides 1000 peak amps for jump starting", status: "accurate" },
          { text: "Currently retails for approximately $80", status: "wrong", correction: "Actual retail: $99.95" },
          { text: "Compatible with 6-liter gas engines", status: "accurate" },
          { text: "Has built-in LED flashlight with multiple modes", status: "accurate" },
          { text: "Comes with a 3-year warranty", status: "wrong", correction: "NOCO offers a 1-year limited warranty for GB40" },
        ],
      },
      {
        model: "Gemini",
        claims: [
          { text: "Features 1000 peak amps and UltraSafe technology", status: "accurate" },
          { text: "Includes built-in air compressor for tire inflation", status: "wrong", correction: "GB40 has no air compressor — that's a different product line (GB70 Pro)" },
          { text: "Priced around $99", status: "accurate" },
          { text: "Works for diesel engines up to 3 liters", status: "accurate" },
          { text: "Over 124,000 customer reviews on Amazon", status: "accurate" },
        ],
      },
    ],
  },
  {
    id: "jumpstart-pro",
    brand: "JumpStart Pro",
    category: "Car Jump Starters",
    geoScore: 68,
    responses: [
      {
        model: "ChatGPT",
        claims: [
          { text: "Delivers 1500A peak current", status: "wrong", correction: "JumpStart Pro is rated at 1000A peak, not 1500A" },
          { text: "Priced at $69.99", status: "wrong", correction: "Actual retail: $89.99" },
          { text: "Available on Amazon and major retail chains", status: "accurate" },
          { text: "Comes with a 2-year warranty", status: "partial", correction: "Warranty is 18 months, not 2 years" },
          { text: "Has smart clamp technology with error indicators", status: "accurate" },
        ],
      },
      {
        model: "Claude",
        claims: [
          { text: "Provides 1000A peak current", status: "accurate" },
          { text: "Retails for approximately $90", status: "accurate" },
          { text: "Manufactured in Germany with CE certification", status: "wrong", correction: "Manufactured in China; CE certified but not German-made" },
          { text: "Works for engines up to 7 liters gas", status: "wrong", correction: "Rated for up to 6.0L gas engines" },
        ],
      },
      {
        model: "Gemini",
        claims: [
          { text: "Features waterproof casing with IP65 rating", status: "wrong", correction: "No IP rating listed; not marketed as waterproof" },
          { text: "Has 1000 amp peak capacity", status: "accurate" },
          { text: "Currently priced around $85–95", status: "accurate" },
          { text: "Includes USB-A and USB-C charging ports", status: "partial", correction: "Has USB-A port but no USB-C port in current model" },
        ],
      },
    ],
  },
  {
    id: "drivesafe-pro",
    brand: "DriveSafe Pro",
    category: "Dash Cameras",
    geoScore: 18,
    responses: [
      {
        model: "ChatGPT",
        claims: [
          { text: "Records in 4K UHD resolution", status: "wrong", correction: "DriveSafe Pro records in 1080p Full HD, not 4K" },
          { text: "Has built-in GPS for route logging", status: "wrong", correction: "No GPS module; route logging not available" },
          { text: "Priced at approximately $89", status: "accurate" },
          { text: "Includes parking mode with motion detection", status: "accurate" },
          { text: "160-degree wide-angle lens", status: "accurate" },
        ],
      },
      {
        model: "Claude",
        claims: [
          { text: "Features 4K resolution front camera", status: "wrong", correction: "1080p Full HD — 4K is not supported" },
          { text: "Retails for around $85 on Amazon", status: "accurate" },
          { text: "Parking mode with motion detection", status: "accurate" },
          { text: "GPS tracking for automatic route logging", status: "wrong", correction: "No GPS; route logging requires separate device" },
          { text: "Compatible with iOS and Android apps", status: "partial", correction: "Android app only; no official iOS app" },
        ],
      },
      {
        model: "Gemini",
        claims: [
          { text: "Records in Full HD 1080p", status: "accurate" },
          { text: "No built-in GPS", status: "accurate" },
          { text: "Retail price around $89", status: "accurate" },
          { text: "Advanced night vision capability", status: "partial", correction: "Basic night mode available but not a dedicated night vision system" },
        ],
      },
    ],
  },
  {
    id: "magdrive-pro",
    brand: "MagDrive Pro",
    category: "Car Phone Mounts",
    geoScore: 24,
    responses: [
      {
        model: "ChatGPT",
        claims: [
          { text: "Compatible with all MagSafe iPhones (iPhone 12 and above)", status: "accurate" },
          { text: "Works with Android phones via included adapter", status: "wrong", correction: "No adapter included; Android compatibility requires separate magnetic ring (sold separately)" },
          { text: "Priced at $29", status: "wrong", correction: "Retail price is $39" },
          { text: "Supports 15W wireless charging", status: "wrong", correction: "MagDrive Pro is a mount only — no wireless charging capability" },
        ],
      },
      {
        model: "Claude",
        claims: [
          { text: "MagSafe compatible for iPhone 12 and newer", status: "accurate" },
          { text: "Includes 15W fast wireless charging", status: "wrong", correction: "Mount only — no charging functionality" },
          { text: "Costs around $35–40", status: "accurate" },
          { text: "Holds up to 20N of magnetic force", status: "partial", correction: "Rated at 18N, not 20N" },
        ],
      },
      {
        model: "Gemini",
        claims: [
          { text: "Designed for MagSafe-compatible iPhones", status: "accurate" },
          { text: "Available in 15W wireless charging variant", status: "wrong", correction: "No wireless charging variant exists for this model" },
          { text: "Retail price around $39", status: "accurate" },
          { text: "Compatible with all smartphones via universal magnetic ring (included)", status: "wrong", correction: "Magnetic ring is sold separately for $8.99; not included" },
        ],
      },
    ],
  },
];

export function computeHRS(brand: BrandHallucination): { score: number; level: HrsLevel; accurate: number; wrong: number; partial: number; total: number } {
  let accurate = 0, wrong = 0, partial = 0;
  for (const r of brand.responses) {
    for (const c of r.claims) {
      if (c.status === "accurate") accurate++;
      else if (c.status === "wrong") wrong++;
      else partial++;
    }
  }
  const total = accurate + wrong + partial;
  const score = Math.round(((wrong + partial * 0.5) / total) * 100);
  const level: HrsLevel = score < 20 ? "low" : score < 45 ? "medium" : "high";
  return { score, level, accurate, wrong, partial, total };
}
