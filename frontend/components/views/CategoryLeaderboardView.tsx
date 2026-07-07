import Link from "next/link";
import { LeaderboardEntry } from "@/lib/api";
import { Lang, tx } from "@/lib/i18n";

const CALENDLY = "https://cal.com/johnson-liu-avanti/30min";

interface Props {
  categoryName: string;
  leaderboard: LeaderboardEntry[];
  lang: Lang;
}

function SovBar({ value, rank }: { value: number; rank: number }) {
  const color = rank === 1 ? "#f5a623" : rank === 2 ? "#ff6b35" : "#7070a0";
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#25253f" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, value * 2)}%`, background: color }}
        />
      </div>
      <span className="text-xs w-10 text-right" style={{ color }}>
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

export default function CategoryLeaderboardView({ categoryName, leaderboard, lang }: Props) {
  const indexPath = lang === "zh" ? "/zh/categories" : "/categories";
  const topBrand = leaderboard[0];
  const median =
    leaderboard.length > 0
      ? leaderboard.reduce((sum, e) => sum + e.weighted_sov, 0) / leaderboard.length
      : 0;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href={indexPath} className="text-sm hover:text-white transition-colors" style={{ color: "#7070a0" }}>
          {tx("leaderboard", "back", lang)}
        </Link>
        <span style={{ color: "#25253f" }}>/</span>
        <h1 className="text-xl font-bold">{categoryName}</h1>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: "rgba(255,107,53,0.12)", color: "#ff6b35", border: "1px solid rgba(255,107,53,0.25)" }}
        >
          {tx("leaderboard", "pill", lang)}
        </span>
      </div>

      {/* Summary stats */}
      {leaderboard.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: tx("leaderboard", "statBrands", lang), value: String(leaderboard.length) },
            { label: tx("leaderboard", "statLeader", lang), value: topBrand?.brand_name ?? "—", gold: true },
            { label: tx("leaderboard", "statMedian", lang), value: `${median.toFixed(1)}%` },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-5" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
              <div className="text-2xl font-black mb-1" style={{ color: s.gold ? "#f5a623" : "#f0f0f8" }}>
                {s.value}
              </div>
              <div className="text-xs" style={{ color: "#7070a0" }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard table */}
      {leaderboard.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ background: "#0f0f17", border: "1px solid #25253f" }}
        >
          <p className="text-sm mb-4" style={{ color: "#7070a0" }}>
            {tx("leaderboard", "noData", lang)}
          </p>
          <Link href="/runs/new" className="text-sm underline" style={{ color: "#ff6b35" }}>
            {tx("leaderboard", "runAudit", lang)}
          </Link>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <div
            className="px-4 py-3 font-semibold text-sm flex items-center justify-between"
            style={{ background: "#161625", borderBottom: "1px solid #25253f" }}
          >
            <span>{tx("leaderboard", "tableTitle", lang)}</span>
            <span className="text-xs font-normal" style={{ color: "#7070a0" }}>
              {tx("leaderboard", "tableSubtitle", lang)}
            </span>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wide" style={{ background: "#161625", color: "#7070a0" }}>
              <tr>
                <th className="text-left px-4 py-2 w-10">#</th>
                <th className="text-left px-4 py-2">{tx("leaderboard", "colBrand", lang)}</th>
                <th className="text-left px-4 py-2">{tx("leaderboard", "colWeightedSov", lang)}</th>
                <th className="text-left px-4 py-2">{tx("leaderboard", "colHighIntent", lang)}</th>
                <th className="text-left px-4 py-2">{tx("leaderboard", "colComparison", lang)}</th>
                <th className="text-left px-4 py-2">{tx("leaderboard", "colArrs", lang)}</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody style={{ background: "#0f0f17" }}>
              {leaderboard.map((entry, i) => {
                const rank = i + 1;
                const rankColor =
                  rank === 1 ? "#f5a623" : rank === 2 ? "#ff6b35" : rank === 3 ? "#7070a0" : "#25253f";
                return (
                  <tr
                    key={entry.brand_name}
                    style={{
                      borderTop: "1px solid #25253f",
                      background: rank === 1 ? "rgba(245,166,35,0.03)" : undefined,
                    }}
                  >
                    <td className="px-4 py-3 font-black text-base" style={{ color: rankColor }}>
                      {rank}
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: rank <= 3 ? "#f0f0f8" : "#c0c0d8" }}>
                      {entry.brand_name}
                      {rank === 1 && (
                        <span className="text-xs ml-2 px-1.5 py-0.5 rounded" style={{ background: "rgba(245,166,35,0.15)", color: "#f5a623" }}>
                          {tx("leaderboard", "leaderBadge", lang)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 w-48">
                      <SovBar value={entry.weighted_sov} rank={rank} />
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#7070a0" }}>
                      {entry.sov_high.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#7070a0" }}>
                      {entry.sov_comparison.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: entry.arrs > 50 ? "#ff4d6d" : entry.arrs > 25 ? "#f5a623" : "#22c55e" }}>
                      {entry.arrs.toFixed(0)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/brands/${encodeURIComponent(entry.brand_name)}`}
                        className="text-xs underline hover:text-white transition-colors"
                        style={{ color: "#7070a0" }}
                      >
                        {tx("leaderboard", "colDetail", lang)}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CTA */}
      <div
        className="rounded-2xl p-8 grid md:grid-cols-2 gap-6 items-center"
        style={{ background: "linear-gradient(135deg, #0f0f17 0%, #161625 100%)", border: "1px solid #25253f" }}
      >
        <div>
          <p className="font-bold text-lg mb-2">{tx("leaderboard", "ctaTitle", lang)}</p>
          <p className="text-sm" style={{ color: "#7070a0" }}>
            {tx("leaderboard", "ctaSub", lang)}
          </p>
        </div>
        <div className="flex gap-3 md:justify-end">
          <Link
            href="/audit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: "#ff6b35", color: "#fff" }}
          >
            {tx("leaderboard", "freeAudit", lang)}
          </Link>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors hover:text-white"
            style={{ border: "1px solid #25253f", color: "#7070a0" }}
          >
            {tx("leaderboard", "bookCall", lang)}
          </a>
        </div>
      </div>
    </div>
  );
}
