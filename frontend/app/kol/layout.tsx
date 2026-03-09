import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KOL Source Tracker — Creator AI Citations | Avanti GEO",
  description:
    "Discover which YouTube, TikTok, and blog creators shape AI's view of your brand through citation influence.",
};

export default function KolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
