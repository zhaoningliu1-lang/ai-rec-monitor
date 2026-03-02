"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RunSnapshot } from "@/lib/api";

export default function TrendChart({ data }: { data: RunSnapshot[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm" style={{ color: "#7070a0" }}>
        No trend data yet. Run a few analyses first.
      </div>
    );
  }

  const chartData = data.map((s) => ({
    date: new Date(s.snapshot_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    "Weighted SOV": parseFloat(s.weighted_sov.toFixed(1)),
    ARRS: parseFloat(s.arrs.toFixed(1)),
    "SOV High-Intent": parseFloat(s.sov_high.toFixed(1)),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#25253f" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#7070a0" }} axisLine={{ stroke: "#25253f" }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#7070a0" }} domain={[0, 100]} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#161625", border: "1px solid #25253f", borderRadius: 8, color: "#f0f0f8" }}
          labelStyle={{ color: "#f0f0f8" }}
        />
        <Legend wrapperStyle={{ color: "#7070a0", fontSize: 12 }} />
        <Line type="monotone" dataKey="Weighted SOV" stroke="#ff6b35" strokeWidth={2} dot={{ r: 3, fill: "#ff6b35" }} />
        <Line type="monotone" dataKey="ARRS" stroke="#f5a623" strokeWidth={2} dot={{ r: 3, fill: "#f5a623" }} />
        <Line type="monotone" dataKey="SOV High-Intent" stroke="#22c55e" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
