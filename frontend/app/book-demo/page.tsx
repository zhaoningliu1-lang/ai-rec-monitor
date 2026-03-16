"use client";

import { useEffect } from "react";

// ── Replace this with your Calendly link ─────────────────────────────────────
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/brivesubscription/30min";

export default function BookDemoPage() {
  useEffect(() => {
    // Load Calendly widget script
    const existing = document.getElementById("calendly-script");
    if (existing) return;
    const script = document.createElement("script");
    script.id = "calendly-script";
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <div className="max-w-4xl mx-auto" style={{ paddingTop: 40, paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ display: "inline-block", background: "#1a0e06", border: "1px solid #ff6b3540", borderRadius: 99, padding: "6px 18px", fontSize: 13, color: "#ff6b35", fontWeight: 700, marginBottom: 20, letterSpacing: "0.06em" }}>
          FREE — 30 MINUTES
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 900, color: "#f0f0f8", lineHeight: 1.15, marginBottom: 16 }}>
          Book a free AI visibility<br />
          <span style={{ color: "#ff6b35" }}>strategy call</span>
        </h1>
        <p style={{ color: "#7070a0", fontSize: 18, maxWidth: 520, margin: "0 auto" }}>
          We&apos;ll walk through your brand&apos;s current AI search presence, benchmark it against competitors, and map out a 90-day AI visibility plan — live, for free.
        </p>
      </div>

      {/* Value props */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 56 }}>
        {[
          { icon: "📊", title: "Your AI Visibility Score", desc: "See exactly how often ChatGPT, Claude & Gemini mention your brand vs competitors." },
          { icon: "🎯", title: "Competitor Gap Analysis", desc: "Identify which brands are winning Share of Voice — and why." },
          { icon: "🗺️", title: "90-Day AI Visibility Roadmap", desc: "Leave with a custom content + citation plan to close the visibility gap." },
        ].map((item) => (
          <div key={item.title} style={{ background: "#12121e", border: "1px solid #25253f", borderRadius: 12, padding: "24px 20px" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#f0f0f8", marginBottom: 8 }}>{item.title}</p>
            <p style={{ fontSize: 13, color: "#7070a0", lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Social proof */}
      <div style={{ background: "#12121e", border: "1px solid #25253f", borderRadius: 12, padding: "20px 24px", marginBottom: 48, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 32 }}>💬</div>
        <div>
          <p style={{ fontSize: 14, color: "#d0d0e8", lineHeight: 1.6, fontStyle: "italic" }}>
            &ldquo;After the strategy call we knew exactly which AI queries to target. Our AI Visibility Score dropped from 58 to 31 in 6 weeks.&rdquo;
          </p>
          <p style={{ fontSize: 12, color: "#7070a0", marginTop: 8 }}>— DTC Brand Founder, Consumer Electronics</p>
        </div>
      </div>

      {/* Calendly embed */}
      <div style={{ background: "#12121e", border: "1px solid #25253f", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "24px 28px", borderBottom: "1px solid #25253f" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f0f0f8", margin: 0 }}>Pick a time that works for you</h2>
          <p style={{ color: "#7070a0", fontSize: 14, marginTop: 6 }}>30 minutes · Video call · Free</p>
        </div>
        <div
          className="calendly-inline-widget"
          data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=12121e&text_color=f0f0f8&primary_color=ff6b35`}
          style={{ minWidth: 320, height: 700 }}
        />
      </div>
    </div>
  );
}
