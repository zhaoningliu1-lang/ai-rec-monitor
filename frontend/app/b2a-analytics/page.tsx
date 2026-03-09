"use client";

import { motion } from "framer-motion";
import { Activity, Search, Users, TrendingUp } from "lucide-react";

const CALENDLY = "https://calendly.com/brivesubscription/30min";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const BLIND_SPOTS = [
  "Can\u2019t distinguish AI-referred visits from direct traffic",
  "No visibility into which AI engines send users",
  "Zero insight into AI query intent",
  "Competitor mentions in AI responses invisible",
];

const CAPABILITIES = [
  "Attribute traffic to ChatGPT, Perplexity, Gemini, Claude",
  "See exactly which queries trigger your brand mention",
  "Track competitor share-of-voice in AI answers",
  "Measure AI-to-conversion funnel end-to-end",
];

const METRICS = [
  {
    icon: Activity,
    title: "AI Engine Attribution",
    desc: "Know exactly which AI engine sent each visitor \u2014 ChatGPT, Perplexity, Gemini, or Claude",
  },
  {
    icon: Search,
    title: "Query Intent Analysis",
    desc: "See the actual questions users asked AI before landing on your site",
  },
  {
    icon: Users,
    title: "Competitor Mention Tracking",
    desc: "Monitor when and how competitors appear in AI answers alongside your brand",
  },
  {
    icon: TrendingUp,
    title: "Agent Conversion Funnel",
    desc: "Track the full journey from AI discovery to purchase completion",
  },
];

export default function B2AAnalyticsPage() {
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
            B2A ANALYTICS
          </div>

          <h1
            className="text-4xl md:text-5xl font-black leading-tight"
            style={{ color: "#f0f0f8" }}
          >
            Your Brand is Getting Discovered by AI.
            <br />
            <span style={{ color: "#ff6b35" }}>Are You Measuring It?</span>
          </h1>

          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#9090b0" }}
          >
            Traditional analytics can&apos;t see AI-driven traffic. B2A Analytics
            makes the invisible visible.
          </p>

          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3.5 rounded-xl text-base font-semibold transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            Request Early Access &rarr;
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
              Old World (Google Analytics)
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
              New World (B2A Analytics)
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
            Ready to See Your AI Traffic?
          </h2>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3.5 rounded-xl text-base font-semibold transition-opacity hover:opacity-85"
              style={{ background: "#ff6b35", color: "#fff" }}
            >
              Request Early Access
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
