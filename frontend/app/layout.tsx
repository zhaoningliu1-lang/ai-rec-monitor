import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import NavBar from "./NavBar";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://avanti.so";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "Avanti — AI Brand Visibility",
    template: "%s | Avanti",
  },
  description:
    "Know where your brand stands in the AI age. Measure how often ChatGPT, Claude, and Gemini recommend you vs competitors — and close the gap.",
  openGraph: {
    type: "website",
    siteName: "Avanti",
    title: "Avanti — AI Brand Visibility",
    description:
      "Measure how often AI assistants recommend your brand vs competitors. Free audit, no signup.",
    url: BASE,
  },
  twitter: {
    card: "summary_large_image",
    title: "Avanti — AI Brand Visibility",
    description:
      "Measure how often AI assistants recommend your brand vs competitors. Free audit, no signup.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased min-h-screen`} style={{ background: "#09090f", color: "#f0f0f8" }}>
        <NavBar />
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
