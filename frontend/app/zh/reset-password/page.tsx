"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { resetPassword } from "@/lib/auth";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#09090f",
  border: "1px solid #25253f",
  borderRadius: 8,
  padding: "10px 14px",
  color: "#f0f0f8",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("两次密码不一致。"); return; }
    if (password.length < 8) { setError("密码至少需要8个字符。"); return; }
    setError("");
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push("/zh/login"), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "重置失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div style={{ background: "#12121e", border: "1px solid #25253f", borderRadius: 16 }} className="w-full max-w-md p-8 text-center space-y-4">
          <p style={{ color: "#ff4d6d", fontSize: 15 }}>无效或缺失的重置链接。</p>
          <Link href="/zh/forgot-password" style={{ color: "#ff6b35", fontSize: 14 }}>重新申请</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div style={{ background: "#12121e", border: "1px solid #25253f", borderRadius: 16 }} className="w-full max-w-md p-8">
        {done ? (
          <div className="text-center space-y-4">
            <div style={{ fontSize: 40 }}>✅</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f0f0f8" }}>密码已更新！</h1>
            <p style={{ color: "#7070a0", fontSize: 14 }}>正在跳转到登录页…</p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f0f0f8" }}>设置新密码</h1>
              <p style={{ color: "#7070a0", fontSize: 14, marginTop: 8 }}>
                请设置一个强密码，至少8个字符。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label style={{ fontSize: 12, color: "#7070a0", display: "block", marginBottom: 6 }}>
                  新密码
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少8个字符"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, color: "#7070a0", display: "block", marginBottom: 6 }}>
                  确认密码
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="再次输入密码"
                  style={inputStyle}
                />
              </div>

              {error && (
                <p style={{ color: "#ff4d6d", fontSize: 13, background: "#1e0a10", border: "1px solid #ff4d6d44", borderRadius: 8, padding: "8px 12px" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ background: "#ff6b35", color: "#fff", width: "100%", padding: "12px", borderRadius: 10, fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "更新中…" : "更新密码 →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordZhPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
