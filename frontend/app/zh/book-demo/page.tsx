"use client";

import { useEffect } from "react";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/brivesubscription/30min";

export default function ZhBookDemoPage() {
  useEffect(() => {
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
          完全免费 · 30 分钟
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 900, color: "#f0f0f8", lineHeight: 1.2, marginBottom: 16 }}>
          预约免费 AI 可见度<br />
          <span style={{ color: "#ff6b35" }}>战略咨询通话</span>
        </h1>
        <p style={{ color: "#7070a0", fontSize: 18, maxWidth: 520, margin: "0 auto" }}>
          我们将实时为你拆解品牌在 AI 搜索中的当前表现，对标竞品差距，并制定 90 天 GEO 行动计划——全程免费。
        </p>
      </div>

      {/* Value props */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 56 }}>
        {[
          { icon: "📊", title: "AI 可见度评分", desc: "精准了解 ChatGPT、Claude、Gemini 提及你品牌的频次，与竞品逐一对比。" },
          { icon: "🎯", title: "竞品差距分析", desc: "找出哪些品牌正在抢占 AI 声量份额，以及它们的打法是什么。" },
          { icon: "🗺️", title: "90 天 GEO 行动路线图", desc: "通话结束时带走一份定制化内容与引用策略，直接缩小可见度差距。" },
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
            "战略通话之后，我们明确了应该瞄准哪些 AI 查询。6 周内 ARRS 从 58 降到了 31。"
          </p>
          <p style={{ fontSize: 12, color: "#7070a0", marginTop: 8 }}>—— 某消费电子 DTC 品牌创始人</p>
        </div>
      </div>

      {/* Calendly embed */}
      <div style={{ background: "#12121e", border: "1px solid #25253f", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "24px 28px", borderBottom: "1px solid #25253f" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f0f0f8", margin: 0 }}>选择一个适合你的时间</h2>
          <p style={{ color: "#7070a0", fontSize: 14, marginTop: 6 }}>30 分钟 · 视频通话 · 完全免费</p>
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
