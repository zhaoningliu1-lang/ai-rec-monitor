"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      await register(email, password, fullName || undefined, companyName || undefined);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div style={{ background: "#12121e", border: "1px solid #25253f", borderRadius: 16 }} className="w-full max-w-md p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f0f0f8" }}>
            Start your free audit
          </h1>
          <p style={{ color: "#7070a0", fontSize: 14, marginTop: 8 }}>
            See where your brand stands in AI search — in 60 seconds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={{ fontSize: 12, color: "#7070a0", display: "block", marginBottom: 6 }}>
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Smith"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: "#7070a0", display: "block", marginBottom: 6 }}>
              Company (optional)
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Inc."
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: "#7070a0", display: "block", marginBottom: 6 }}>
              Work email *
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
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
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
            {loading ? "Creating account…" : "Create free account →"}
          </button>
        </form>

        <p style={{ color: "#7070a0", fontSize: 12, textAlign: "center", marginTop: 20 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#ff6b35" }}>Sign in</Link>
        </p>

        <p style={{ color: "#3a3a5c", fontSize: 11, textAlign: "center", marginTop: 16 }}>
          By signing up you agree to our Terms of Service and Privacy Policy.
        </p>

        {/* Bilingual trust badges */}
        <p style={{ color: "#6060a0", fontSize: 12, textAlign: "center", marginTop: 20 }}>
          ✓ 免费获得3次完整品牌诊断 &nbsp;✓ 无需信用卡 &nbsp;✓ 随时取消
        </p>
        <p style={{ color: "#6060a0", fontSize: 12, textAlign: "center", marginTop: 6 }}>
          ✓ 3 free brand audits &nbsp;✓ No credit card required &nbsp;✓ Cancel anytime
        </p>
      </div>
    </div>
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
