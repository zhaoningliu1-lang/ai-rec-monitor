"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMe, type UserProfile } from "@/lib/auth";

const ADMIN_EMAIL = "johnsonliu@hks.harvard.edu";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  subscription_tier: string;
  subscription_status: string;
  created_at: string;
  is_active: boolean;
}

interface ActivityEntry {
  id: string;
  brand_name: string;
  category: string;
  status: string;
  created_at: string;
  user_email: string;
}

type Tab = "users" | "activity";

export default function AdminPage() {
  const router = useRouter();
  const [me, setMe] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    fetchMe()
      .then((profile) => {
        if (profile.email !== ADMIN_EMAIL) {
          router.push("/dashboard");
          return;
        }
        setMe(profile);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!me || me.email !== ADMIN_EMAIL) return;
    setDataLoading(true);
    const token = localStorage.getItem("avanti_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    if (tab === "users") {
      fetch(`${BASE}/admin/users`, { headers })
        .then((r) => r.json())
        .then(setUsers)
        .catch(() => setUsers([]))
        .finally(() => setDataLoading(false));
    } else {
      fetch(`${BASE}/admin/activity`, { headers })
        .then((r) => r.json())
        .then(setActivity)
        .catch(() => setActivity([]))
        .finally(() => setDataLoading(false));
    }
  }, [me, tab]);

  if (loading) {
    return <div style={{ color: "#7070a0", paddingTop: 80, textAlign: "center" }}>Loading…</div>;
  }

  if (!me || me.email !== ADMIN_EMAIL) return null;

  const tabStyle = (t: Tab) => ({
    padding: "8px 20px",
    fontSize: 14,
    fontWeight: 600 as const,
    borderRadius: 8,
    border: "none",
    cursor: "pointer" as const,
    background: tab === t ? "#ff6b35" : "#161625",
    color: tab === t ? "#fff" : "#7070a0",
  });

  function tierColor(tier: string) {
    if (tier === "scale") return "#a855f7";
    if (tier === "growth") return "#ff6b35";
    if (tier === "enterprise") return "#22c55e";
    return "#7070a0";
  }

  function statusColor(status: string) {
    if (status === "done") return "#22c55e";
    if (status === "running") return "#ff6b35";
    if (status === "queued") return "#f5a623";
    if (status === "failed") return "#ff4d6d";
    return "#7070a0";
  }

  return (
    <div className="max-w-5xl mx-auto" style={{ paddingTop: 32 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f0f0f8", marginBottom: 4 }}>
          Admin Dashboard
        </h1>
        <p style={{ color: "#7070a0", fontSize: 14 }}>Manage users and monitor platform activity</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button onClick={() => setTab("users")} style={tabStyle("users")}>Users</button>
        <button onClick={() => setTab("activity")} style={tabStyle("activity")}>Activity</button>
      </div>

      {dataLoading ? (
        <div style={{ color: "#7070a0", textAlign: "center", padding: 40 }}>Loading…</div>
      ) : tab === "users" ? (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wide" style={{ background: "#161625", color: "#7070a0" }}>
              <tr>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Company</th>
                <th className="text-left px-4 py-3">Plan</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody style={{ background: "#0f0f17" }}>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center" style={{ color: "#7070a0" }}>
                    No users found (admin API endpoint may not be deployed yet)
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} style={{ borderTop: "1px solid #25253f" }}>
                    <td className="px-4 py-3" style={{ color: "#f0f0f8" }}>{u.email}</td>
                    <td className="px-4 py-3" style={{ color: "#7070a0" }}>{u.full_name ?? "–"}</td>
                    <td className="px-4 py-3" style={{ color: "#7070a0" }}>{u.company_name ?? "–"}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: `${tierColor(u.subscription_tier)}20`, color: tierColor(u.subscription_tier) }}
                      >
                        {u.subscription_tier}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs" style={{ color: u.is_active ? "#22c55e" : "#ff4d6d" }}>
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#7070a0" }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {users.length > 0 && (
            <div style={{ background: "#161625", borderTop: "1px solid #25253f", padding: "8px 16px" }}>
              <span className="text-xs" style={{ color: "#7070a0" }}>{users.length} total users</span>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #25253f" }}>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wide" style={{ background: "#161625", color: "#7070a0" }}>
              <tr>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Brand</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody style={{ background: "#0f0f17" }}>
              {activity.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center" style={{ color: "#7070a0" }}>
                    No activity found (admin API endpoint may not be deployed yet)
                  </td>
                </tr>
              ) : (
                activity.map((a) => (
                  <tr key={a.id} style={{ borderTop: "1px solid #25253f" }}>
                    <td className="px-4 py-3" style={{ color: "#f0f0f8" }}>{a.user_email}</td>
                    <td className="px-4 py-3" style={{ color: "#ff6b35" }}>{a.brand_name}</td>
                    <td className="px-4 py-3" style={{ color: "#7070a0" }}>{a.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: `${statusColor(a.status)}20`, color: statusColor(a.status) }}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#7070a0" }}>
                      {new Date(a.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {activity.length > 0 && (
            <div style={{ background: "#161625", borderTop: "1px solid #25253f", padding: "8px 16px" }}>
              <span className="text-xs" style={{ color: "#7070a0" }}>{activity.length} recent activities</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
