"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPassword } from "@/lib/auth";

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

export default function ForgotPasswordZhPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      setError("出现错误，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div style={{ background: "#12121e", border: "1px solid #25253f", borderRadius: 16 }} className="w-full max-w-md p-8">
        {sent ? (
          <div className="text-center space-y-4">
            <div style={{ fontSize: 40 }}>📬</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f0f0f8" }}>查收邮件</h1>
            <p style={{ color: "#7070a0", fontSize: 14, lineHeight: 1.6 }}>
              如果 <strong style={{ color: "#a0a0c8" }}>{email}</strong> 已注册，我们已发送重置链接，1小时内有效。
            </p>
            <Link href="/zh/login" style={{ display: "inline-block", marginTop: 8, color: "#ff6b35", fontSize: 14 }}>
              返回登录
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f0f0f8" }}>忘记密码？</h1>
              <p style={{ color: "#7070a0", fontSize: 14, marginTop: 8 }}>
                输入邮箱，我们将发送密码重置链接。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label style={{ fontSize: 12, color: "#7070a0", display: "block", marginBottom: 6 }}>
                  邮箱
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
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
                {loading ? "发送中…" : "发送重置链接 →"}
              </button>
            </form>

            <p style={{ color: "#7070a0", fontSize: 12, textAlign: "center", marginTop: 20 }}>
              记起来了？{" "}
              <Link href="/zh/login" style={{ color: "#ff6b35" }}>去登录</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
