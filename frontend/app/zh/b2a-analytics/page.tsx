"use client";

import { motion } from "framer-motion";
import { Activity, Search, Users, TrendingUp } from "lucide-react";

const CALENDLY = "https://calendly.com/brivesubscription/30min";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const BLIND_SPOTS = [
  "无法区分 AI 推荐访问和直接流量",
  "看不到哪些 AI 引擎发送了用户",
  "对 AI 查询意图零洞察",
  "AI 回答中的竞品提及不可见",
];

const CAPABILITIES = [
  "归因流量到 ChatGPT、Perplexity、Gemini、Claude",
  "查看触发品牌提及的确切查询",
  "追踪竞品在 AI 回答中的话语权",
  "端到端衡量 AI 到转化漏斗",
];

const METRICS = [
  {
    icon: Activity,
    title: "AI 引擎归因",
    desc: "精确知道每位访客来自哪个 AI 引擎 — ChatGPT、Perplexity、Gemini 或 Claude",
  },
  {
    icon: Search,
    title: "查询意图分析",
    desc: "查看用户在访问你网站之前向 AI 提出的实际问题",
  },
  {
    icon: Users,
    title: "竞品提及追踪",
    desc: "监控竞品何时以及如何在 AI 回答中与你的品牌一起出现",
  },
  {
    icon: TrendingUp,
    title: "Agent 转化漏斗",
    desc: "追踪从 AI 发现到完成购买的完整旅程",
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
            B2A 分析
          </div>

          <h1
            className="text-4xl md:text-5xl font-black leading-tight"
            style={{ color: "#f0f0f8" }}
          >
            你的品牌正在被 AI 发现。
            <br />
            <span style={{ color: "#ff6b35" }}>你在衡量吗？</span>
          </h1>

          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#9090b0" }}
          >
            传统分析工具看不到 AI 驱动的流量。B2A Analytics
            让不可见变为可见。
          </p>

          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3.5 rounded-xl text-base font-semibold transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            申请抢先体验 &rarr;
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
              旧世界（Google Analytics）
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
              新世界（B2A Analytics）
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
            准备好查看你的 AI 流量了吗？
          </h2>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3.5 rounded-xl text-base font-semibold transition-opacity hover:opacity-85"
              style={{ background: "#ff6b35", color: "#fff" }}
            >
              申请抢先体验
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
