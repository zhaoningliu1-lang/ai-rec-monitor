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
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError("");
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div style={{ background: "#12121e", border: "1px solid #25253f", borderRadius: 16 }} className="w-full max-w-md p-8 text-center space-y-4">
          <p style={{ color: "#ff4d6d", fontSize: 15 }}>Invalid or missing reset link.</p>
          <Link href="/forgot-password" style={{ color: "#ff6b35", fontSize: 14 }}>Request a new one</Link>
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
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f0f0f8" }}>Password updated!</h1>
            <p style={{ color: "#7070a0", fontSize: 14 }}>Redirecting you to sign in…</p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f0f0f8" }}>Set new password</h1>
              <p style={{ color: "#7070a0", fontSize: 14, marginTop: 8 }}>
                Choose a strong password — at least 8 characters.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label style={{ fontSize: 12, color: "#7070a0", display: "block", marginBottom: 6 }}>
                  New password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, color: "#7070a0", display: "block", marginBottom: 6 }}>
                  Confirm password
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Same password again"
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
                {loading ? "Updating…" : "Update password →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
