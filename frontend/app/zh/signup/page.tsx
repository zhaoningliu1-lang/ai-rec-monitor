"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/lib/auth";

export default function ZhSignupPage() {
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
    if (password.length < 8) { setError("密码至少需要 8 位字符"); return; }
    setLoading(true);
    try {
      await register(email, password, fullName || undefined, companyName || undefined);
      router.push("/zh/account");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "注册失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div style={{ background: "#12121e", border: "1px solid #25253f", borderRadius: 16 }} className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div style={{ fontSize: 13, color: "#ff6b35", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 12 }}>
            完全免费——无需信用卡
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f0f0f8" }}>
            免费开始诊断
          </h1>
          <p style={{ color: "#7070a0", fontSize: 14, marginTop: 8 }}>
            60 秒内了解你的品牌在 AI 搜索中的真实位置。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={{ fontSize: 12, color: "#7070a0", display: "block", marginBottom: 6 }}>姓名</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
              placeholder="张三" style={inputStyle} />
          </div>

          <div>
            <label style={{ fontSize: 12, color: "#7070a0", display: "block", marginBottom: 6 }}>公司名称（选填）</label>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
              placeholder="XX 科技有限公司" style={inputStyle} />
          </div>

          <div>
            <label style={{ fontSize: 12, color: "#7070a0", display: "block", marginBottom: 6 }}>工作邮箱 *</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="zhang@company.com" style={inputStyle} />
          </div>

          <div>
            <label style={{ fontSize: 12, color: "#7070a0", display: "block", marginBottom: 6 }}>密码 *</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 8 位字符" style={inputStyle} />
          </div>

          {error && (
            <p style={{ color: "#ff4d6d", fontSize: 13, background: "#1e0a10", border: "1px solid #ff4d6d44", borderRadius: 8, padding: "8px 12px" }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}
            style={{ background: "#ff6b35", color: "#fff", width: "100%", padding: "12px", borderRadius: 10, fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "注册中…" : "立即免费注册 →"}
          </button>
        </form>

        <p style={{ color: "#7070a0", fontSize: 12, textAlign: "center", marginTop: 20 }}>
          已有账户？{" "}
          <Link href="/zh/login" style={{ color: "#ff6b35" }}>直接登录</Link>
        </p>
        <p style={{ color: "#3a3a5c", fontSize: 11, textAlign: "center", marginTop: 16 }}>
          注册即表示您同意我们的服务条款和隐私政策。
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#09090f", border: "1px solid #25253f",
  borderRadius: 8, padding: "10px 14px", color: "#f0f0f8",
  fontSize: 14, outline: "none", boxSizing: "border-box",
};
