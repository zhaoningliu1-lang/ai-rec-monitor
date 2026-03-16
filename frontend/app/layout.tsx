import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import NavBar from "./NavBar";
import { Analytics } from "@vercel/analytics/next";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://avantia2a.com";

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
        <footer className="border-t mt-20 pt-12 pb-8" style={{ borderColor: "#1a1a2e" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
              {/* Brand column */}
              <div className="md:col-span-1">
                <span className="font-black text-lg tracking-tight" style={{ color: "#ff6b35" }}>AVANTI</span>
                <p className="text-xs mt-3 leading-relaxed" style={{ color: "#52526e" }}>
                  AI brand visibility platform for cross-border ecommerce. Track how ChatGPT, Claude, and Gemini recommend your products — and optimize for the AI age.
                </p>
              </div>

              {/* Product column */}
              <div>
                <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#7070a0" }}>Product</h4>
                <ul className="space-y-2 text-xs" style={{ color: "#52526e" }}>
                  <li><a href="/audit" className="hover:text-white transition-colors">AI Brand Audit</a></li>
                  <li><a href="/trends" className="hover:text-white transition-colors">Trend Monitor</a></li>
                  <li><a href="/geo-action" className="hover:text-white transition-colors">AI Visibility Plan</a></li>
                  <li><a href="/selection" className="hover:text-white transition-colors">Selection Intelligence</a></li>
                  <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                </ul>
              </div>

              {/* Company column */}
              <div>
                <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#7070a0" }}>Company</h4>
                <ul className="space-y-2 text-xs" style={{ color: "#52526e" }}>
                  <li><a href="/blog" className="hover:text-white transition-colors">Research</a></li>
                  <li><a href="/book-demo" className="hover:text-white transition-colors">Book a Demo</a></li>
                  <li><a href="mailto:hello@avantia2a.com" className="hover:text-white transition-colors">hello@avantia2a.com</a></li>
                </ul>
              </div>

              {/* Legal column */}
              <div>
                <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#7070a0" }}>Legal</h4>
                <ul className="space-y-2 text-xs" style={{ color: "#52526e" }}>
                  <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="/data-deletion" className="hover:text-white transition-colors">Data Deletion</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: "#1a1a2e" }}>
              <p className="text-xs" style={{ color: "#3f3f5c" }}>&copy; {new Date().getFullYear()} Avanti Growth Labs LLC. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white" style={{ color: "#3f3f5c" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white" style={{ color: "#3f3f5c" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
