"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { login } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push(next);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div style={{ background: "#12121e", border: "1px solid #25253f", borderRadius: 16 }} className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f0f0f8" }}>Welcome back</h1>
          <p style={{ color: "#7070a0", fontSize: 14, marginTop: 8 }}>
            Sign in to your Avanti account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={{ fontSize: 12, color: "#7070a0", display: "block", marginBottom: 6 }}>
              Email
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

          <div>
            <label style={{ fontSize: 12, color: "#7070a0", display: "block", marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
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
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>

        <p style={{ color: "#7070a0", fontSize: 12, textAlign: "center", marginTop: 20 }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "#ff6b35" }}>Create one free</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

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
