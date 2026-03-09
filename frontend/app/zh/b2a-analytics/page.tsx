"use client";

import { motion } from "framer-motion";
import { Activity, Search, Users, TrendingUp } from "lucide-react";

const CALENDLY = "https://calendly.com/brivesubscription/30min";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const BLIND_SPOTS = [
  "\u65E0\u6CD5\u533A\u5206 AI \u63A8\u8350\u8BBF\u95EE\u548C\u76F4\u63A5\u6D41\u91CF",
  "\u770B\u4E0D\u5230\u54EA\u4E9B AI \u5F15\u64CE\u53D1\u9001\u4E86\u7528\u6237",
  "\u5BF9 AI \u67E5\u8BE2\u610F\u56FE\u96F6\u6D1E\u5BDF",
  "AI \u56DE\u7B54\u4E2D\u7684\u7ADE\u54C1\u63D0\u53CA\u4E0D\u53EF\u89C1",
];

const CAPABILITIES = [
  "\u5F52\u56E0\u6D41\u91CF\u5230 ChatGPT\u3001Perplexity\u3001Gemini\u3001Claude",
  "\u67E5\u770B\u89E6\u53D1\u54C1\u724C\u63D0\u53CA\u7684\u786E\u5207\u67E5\u8BE2",
  "\u8FFD\u8E2A\u7ADE\u54C1\u5728 AI \u56DE\u7B54\u4E2D\u7684\u8BDD\u8BED\u6743",
  "\u7AEF\u5230\u7AEF\u8861\u91CF AI \u5230\u8F6C\u5316\u6F0F\u6597",
];

const METRICS = [
  {
    icon: Activity,
    title: "AI \u5F15\u64CE\u5F52\u56E0",
    desc: "\u7CBE\u786E\u77E5\u9053\u6BCF\u4F4D\u8BBF\u5BA2\u6765\u81EA\u54EA\u4E2A AI \u5F15\u64CE \u2014 ChatGPT\u3001Perplexity\u3001Gemini \u6216 Claude",
  },
  {
    icon: Search,
    title: "\u67E5\u8BE2\u610F\u56FE\u5206\u6790",
    desc: "\u67E5\u770B\u7528\u6237\u5728\u8BBF\u95EE\u4F60\u7F51\u7AD9\u4E4B\u524D\u5411 AI \u63D0\u51FA\u7684\u5B9E\u9645\u95EE\u9898",
  },
  {
    icon: Users,
    title: "\u7ADE\u54C1\u63D0\u53CA\u8FFD\u8E2A",
    desc: "\u76D1\u63A7\u7ADE\u54C1\u4F55\u65F6\u4EE5\u53CA\u5982\u4F55\u5728 AI \u56DE\u7B54\u4E2D\u4E0E\u4F60\u7684\u54C1\u724C\u4E00\u8D77\u51FA\u73B0",
  },
  {
    icon: TrendingUp,
    title: "Agent \u8F6C\u5316\u6F0F\u6597",
    desc: "\u8FFD\u8E2A\u4ECE AI \u53D1\u73B0\u5230\u5B8C\u6210\u8D2D\u4E70\u7684\u5B8C\u6574\u65C5\u7A0B",
  },
];

export default function B2AAnalyticsZhPage() {
  return (
    <div style={{ background: "#0f0f17", minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-4 py-20 space-y-24">

        {/* ── Hero ──────────────────────────────────────────── */}
        <motion.section
          className="text-center space-y-6"
          {...fadeUp}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(255,107,53,0.10)",
              color: "#ff6b35",
              border: "1px solid rgba(255,107,53,0.30)",
            }}
          >
            B2A \u5206\u6790
          </div>

          <h1
            className="text-4xl md:text-5xl font-black leading-tight"
            style={{ color: "#f0f0f8" }}
          >
            \u4F60\u7684\u54C1\u724C\u6B63\u5728\u88AB AI \u53D1\u73B0\u3002
            <br />
            <span style={{ color: "#ff6b35" }}>\u4F60\u5728\u8861\u91CF\u5417\uFF1F</span>
          </h1>

          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#9090b0" }}
          >
            \u4F20\u7EDF\u5206\u6790\u5DE5\u5177\u770B\u4E0D\u5230 AI \u9A71\u52A8\u7684\u6D41\u91CF\u3002B2A Analytics
            \u8BA9\u4E0D\u53EF\u89C1\u53D8\u4E3A\u53EF\u89C1\u3002
          </p>

          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3.5 rounded-xl text-base font-semibold transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            \u7533\u8BF7\u62A2\u5148\u4F53\u9A8C &rarr;
          </a>
        </motion.section>

        {/* ── Problem / Solution 2-column ──────────────────── */}
        <motion.section
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          {/* Old World */}
          <div
            className="rounded-2xl p-6 space-y-4"
            style={{
              background: "#0f0f17",
              border: "1px solid #25253f",
              opacity: 0.55,
            }}
          >
            <h3
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "#7070a0" }}
            >
              \u65E7\u4E16\u754C\uFF08Google Analytics\uFF09
            </h3>
            <ul className="space-y-3">
              {BLIND_SPOTS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: "#7070a0" }}
                >
                  <span className="shrink-0 mt-0.5" style={{ color: "#ff4d6d" }}>
                    &#10007;
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* New World */}
          <div
            className="rounded-2xl p-6 space-y-4"
            style={{
              background: "#0f0f17",
              border: "1px solid rgba(34,197,94,0.30)",
            }}
          >
            <h3
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "#22c55e" }}
            >
              \u65B0\u4E16\u754C\uFF08B2A Analytics\uFF09
            </h3>
            <ul className="space-y-3">
              {CAPABILITIES.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: "#d0d0e8" }}
                >
                  <span className="shrink-0 mt-0.5" style={{ color: "#22c55e" }}>
                    &#10003;
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* ── Metric Cards ─────────────────────────────────── */}
        <section className="grid sm:grid-cols-2 gap-5">
          {METRICS.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.title}
                className="rounded-2xl p-6 space-y-3"
                style={{
                  background: "#0f0f17",
                  border: "1px solid #25253f",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(255,107,53,0.10)",
                    color: "#ff6b35",
                  }}
                >
                  <Icon size={20} />
                </div>
                <h4 className="text-base font-bold" style={{ color: "#f0f0f8" }}>
                  {m.title}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "#9090b0" }}>
                  {m.desc}
                </p>
              </motion.div>
            );
          })}
        </section>

        {/* ── Bottom CTA ───────────────────────────────────── */}
        <motion.section
          className="rounded-2xl p-10 text-center space-y-5"
          style={{
            background: "rgba(255,107,53,0.06)",
            border: "1px solid rgba(255,107,53,0.20)",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-2xl md:text-3xl font-black"
            style={{ color: "#f0f0f8" }}
          >
            \u51C6\u5907\u597D\u67E5\u770B\u4F60\u7684 AI \u6D41\u91CF\u4E86\u5417\uFF1F
          </h2>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3.5 rounded-xl text-base font-semibold transition-opacity hover:opacity-85"
              style={{ background: "#ff6b35", color: "#fff" }}
            >
              \u7533\u8BF7\u62A2\u5148\u4F53\u9A8C
            </a>
            <span
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
              style={{
                background: "rgba(255,107,53,0.12)",
                color: "#ff6b35",
                border: "1px solid rgba(255,107,53,0.30)",
              }}
            >
              Beta
            </span>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
