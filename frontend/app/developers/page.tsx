"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  createApiKey,
  fetchMe,
  listApiKeys,
  revokeApiKey,
  type APIKeyCreated,
  type APIKeyInfo,
  type UserProfile,
} from "@/lib/auth";

/* ── Endpoint reference ────────────────────────────────────────────────────── */

const ENDPOINTS: { method: string; path: string; desc: string; credit: string }[] = [
  { method: "GET",  path: "/api/v1/me",                          desc: "Verify API key & account info",          credit: "0" },
  { method: "GET",  path: "/api/v1/credits",                     desc: "Credit balance & cost reference",        credit: "0" },
  { method: "POST", path: "/api/v1/scans",                       desc: "Create a new AI visibility scan",        credit: "free (2/mo)" },
  { method: "GET",  path: "/api/v1/scans",                       desc: "List your scans",                        credit: "0" },
  { method: "GET",  path: "/api/v1/scans/{id}",                  desc: "Get scan status & results",              credit: "0" },
  { method: "GET",  path: "/api/v1/scans/{id}/metrics",          desc: "Computed metrics (SOV, ARRS)",           credit: "0" },
  { method: "GET",  path: "/api/v1/scans/{id}/geo-plan",         desc: "Get AI action plan",                     credit: "0" },
  { method: "POST", path: "/api/v1/scans/{id}/geo-plan",         desc: "Generate action plan via Claude",        credit: "0" },
  { method: "GET",  path: "/api/v1/scans/{id}/market-signals",   desc: "Cross-platform market signals",          credit: "0" },
  { method: "GET",  path: "/api/v1/search/reddit",               desc: "Search Reddit for brand mentions",       credit: "1" },
  { method: "GET",  path: "/api/v1/search/kol",                  desc: "Search YouTube for KOL coverage",        credit: "1" },
  { method: "GET",  path: "/api/v1/search/tiktok",               desc: "Search TikTok Shop products",            credit: "1" },
  { method: "GET",  path: "/api/v1/categories",                  desc: "List all monitored categories",          credit: "0" },
  { method: "GET",  path: "/api/v1/categories/{cat}/leaderboard", desc: "Brand rankings by AI visibility",       credit: "0" },
  { method: "GET",  path: "/api/v1/trends/google/{cat}",         desc: "Google Trends for a category",           credit: "0" },
];

/* ── Code examples ─────────────────────────────────────────────────────────── */

const curlExample = (key: string) => `# Verify your API key
curl -H "X-API-Key: ${key}" \\
  https://api.avantia2a.com/api/v1/me

# Create a scan
curl -X POST -H "X-API-Key: ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{"brand_name":"Supuon","category":"baby pillow","providers":["openai","anthropic","google"],"num_prompts":10}' \\
  https://api.avantia2a.com/api/v1/scans

# Search Reddit
curl -H "X-API-Key: ${key}" \\
  "https://api.avantia2a.com/api/v1/search/reddit?q=baby+pillow&limit=10"`;

const pythonExample = (key: string) => `import requests

API_KEY = "${key}"
BASE = "https://api.avantia2a.com/api/v1"
headers = {"X-API-Key": API_KEY}

# Verify key
me = requests.get(f"{BASE}/me", headers=headers).json()
print(f"Logged in as {me['email']} — {me['credit_balance']} credits")

# Create a scan
scan = requests.post(f"{BASE}/scans", headers=headers, json={
    "brand_name": "Supuon",
    "category": "baby pillow",
    "providers": ["openai", "anthropic", "google"],
    "num_prompts": 10,
}).json()
print(f"Scan started: {scan['id']}")

# Poll until complete
import time
while True:
    status = requests.get(f"{BASE}/scans/{scan['id']}", headers=headers).json()
    if status["status"] == "completed":
        break
    time.sleep(5)

# Get metrics
metrics = requests.get(f"{BASE}/scans/{scan['id']}/metrics", headers=headers).json()
print(f"SOV: {metrics['sov_overall']}%")`;

const jsExample = (key: string) => `const API_KEY = "${key}";
const BASE = "https://api.avantia2a.com/api/v1";
const headers = { "X-API-Key": API_KEY };

// Verify key
const me = await fetch(\`\${BASE}/me\`, { headers }).then(r => r.json());
console.log(\`Logged in as \${me.email}\`);

// Create a scan
const scan = await fetch(\`\${BASE}/scans\`, {
  method: "POST",
  headers: { ...headers, "Content-Type": "application/json" },
  body: JSON.stringify({
    brand_name: "Supuon",
    category: "baby pillow",
    providers: ["openai", "anthropic", "google"],
    num_prompts: 10,
  }),
}).then(r => r.json());

// Search Reddit (1 credit)
const reddit = await fetch(
  \`\${BASE}/search/reddit?q=baby+pillow&limit=10\`,
  { headers }
).then(r => r.json());
console.log(\`Found \${reddit.total} posts\`);`;

const mcpConfig = (key: string) => `{
  "mcpServers": {
    "avanti-geo": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-proxy", "https://api.avantia2a.com/api/v1"],
      "env": {
        "API_KEY": "${key}"
      }
    }
  }
}`;

/* ── Component ─────────────────────────────────────────────────────────────── */

const TABS = ["curl", "Python", "JavaScript", "MCP Config"] as const;
type Tab = (typeof TABS)[number];

export default function DevelopersPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [keys, setKeys] = useState<APIKeyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [justCreated, setJustCreated] = useState<APIKeyCreated | null>(null);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<Tab>("curl");
  const [revoking, setRevoking] = useState<string | null>(null);

  const displayKey = justCreated?.raw_key ?? "avanti_YOUR_API_KEY";

  const loadKeys = useCallback(async () => {
    try {
      const k = await listApiKeys();
      setKeys(k);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchMe()
      .then((u) => {
        setUser(u);
        return loadKeys();
      })
      .catch(() => router.push("/login?next=/developers"))
      .finally(() => setLoading(false));
  }, [router, loadKeys]);

  async function handleCreate() {
    if (!newKeyName.trim()) return;
    setCreating(true);
    try {
      const created = await createApiKey(newKeyName.trim());
      setJustCreated(created);
      setNewKeyName("");
      await loadKeys();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create key");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm("Revoke this API key? This cannot be undone.")) return;
    setRevoking(id);
    try {
      await revokeApiKey(id);
      if (justCreated?.id === id) setJustCreated(null);
      await loadKeys();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to revoke key");
    } finally {
      setRevoking(null);
    }
  }

  function copyKey() {
    if (!justCreated) return;
    navigator.clipboard.writeText(justCreated.raw_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getCodeExample(): string {
    switch (tab) {
      case "curl":       return curlExample(displayKey);
      case "Python":     return pythonExample(displayKey);
      case "JavaScript": return jsExample(displayKey);
      case "MCP Config": return mcpConfig(displayKey);
    }
  }

  if (loading) {
    return <div style={{ color: "#7070a0", paddingTop: 80, textAlign: "center" }}>Loading...</div>;
  }
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto" style={{ paddingTop: 32, paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f0f0f8" }}>Developers</h1>
          <span style={{ background: "#ff6b3520", color: "#ff6b35", fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 8px" }}>
            Beta
          </span>
        </div>
        <p style={{ color: "#7070a0", fontSize: 15, lineHeight: 1.6, maxWidth: 600 }}>
          Build AI-native integrations with Avanti. Use our API to let your agents monitor AI visibility,
          search market signals, and generate content — programmatically.
        </p>
      </div>

      {/* ── Section 1: API Key Management ─────────────────────────────────────── */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f8", marginBottom: 16 }}>API Keys</h2>

        {/* Create key */}
        <div
          style={{
            background: "#12121e", border: "1px solid #25253f", borderRadius: 12,
            padding: "20px 24px", marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key name (e.g. my-agent)"
              maxLength={100}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              style={{
                flex: 1, background: "#0a0a14", border: "1px solid #25253f", borderRadius: 8,
                padding: "10px 14px", color: "#f0f0f8", fontSize: 14, outline: "none",
              }}
            />
            <button
              onClick={handleCreate}
              disabled={creating || !newKeyName.trim()}
              style={{
                background: "#ff6b35", color: "#fff", border: "none", borderRadius: 8,
                padding: "10px 20px", fontSize: 14, fontWeight: 700,
                cursor: creating || !newKeyName.trim() ? "not-allowed" : "pointer",
                opacity: creating || !newKeyName.trim() ? 0.5 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {creating ? "Creating..." : "Create Key"}
            </button>
          </div>

          {/* Just-created key warning */}
          {justCreated && (
            <div
              style={{
                marginTop: 16, background: "#1a2e1a", border: "1px solid #22c55e40",
                borderRadius: 8, padding: "14px 16px",
              }}
            >
              <p style={{ fontSize: 12, color: "#22c55e", fontWeight: 600, marginBottom: 8 }}>
                Key created! Copy it now — you won&apos;t see it again.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <code
                  style={{
                    flex: 1, background: "#0a0a14", padding: "8px 12px", borderRadius: 6,
                    color: "#f0f0f8", fontSize: 13, fontFamily: "monospace", wordBreak: "break-all",
                  }}
                >
                  {justCreated.raw_key}
                </code>
                <button
                  onClick={copyKey}
                  style={{
                    background: "#22c55e", color: "#fff", border: "none", borderRadius: 6,
                    padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Key list */}
        {keys.length > 0 && (
          <div
            style={{
              background: "#12121e", border: "1px solid #25253f", borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #25253f" }}>
                  {["Name", "Key", "Created", "Last Used", ""].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 16px", textAlign: "left", fontSize: 11,
                        fontWeight: 600, color: "#7070a0", textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.id} style={{ borderBottom: "1px solid #25253f20" }}>
                    <td style={{ padding: "10px 16px", fontSize: 14, color: "#f0f0f8", fontWeight: 500 }}>
                      {k.name}
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 13, color: "#7070a0", fontFamily: "monospace" }}>
                      {k.key_prefix}...
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 13, color: "#7070a0" }}>
                      {new Date(k.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 13, color: "#7070a0" }}>
                      {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : "Never"}
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "right" }}>
                      <button
                        onClick={() => handleRevoke(k.id)}
                        disabled={revoking === k.id}
                        style={{
                          background: "transparent", border: "1px solid #ff4d6d30", color: "#ff4d6d",
                          borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer",
                          opacity: revoking === k.id ? 0.5 : 1,
                        }}
                      >
                        {revoking === k.id ? "..." : "Revoke"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {keys.length === 0 && !loading && (
          <p style={{ color: "#3a3a5c", fontSize: 13 }}>No API keys yet. Create one above to get started.</p>
        )}
      </section>

      {/* ── Section 2: Code Examples ──────────────────────────────────────────── */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f8", marginBottom: 16 }}>Quick Start</h2>

        <div style={{ background: "#12121e", border: "1px solid #25253f", borderRadius: 12, overflow: "hidden" }}>
          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: "1px solid #25253f" }}>
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: "10px 0", fontSize: 13, fontWeight: tab === t ? 700 : 400,
                  color: tab === t ? "#ff6b35" : "#7070a0", background: "transparent",
                  border: "none", borderBottom: tab === t ? "2px solid #ff6b35" : "2px solid transparent",
                  cursor: "pointer", transition: "color 0.15s",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Code block */}
          <pre
            style={{
              padding: "20px 24px", margin: 0, overflow: "auto", maxHeight: 480,
              fontSize: 13, lineHeight: 1.6, color: "#c0c0d8", fontFamily: "monospace",
              whiteSpace: "pre-wrap", wordBreak: "break-all",
            }}
          >
            {getCodeExample()}
          </pre>
        </div>
      </section>

      {/* ── Section 3: Endpoint Reference ─────────────────────────────────────── */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f8", marginBottom: 4 }}>API Reference</h2>
        <p style={{ color: "#7070a0", fontSize: 13, marginBottom: 16 }}>
          Base URL: <code style={{ background: "#0a0a14", padding: "2px 6px", borderRadius: 4, color: "#ff6b35" }}>
            https://api.avantia2a.com
          </code>{" "}
          · Authenticate with <code style={{ background: "#0a0a14", padding: "2px 6px", borderRadius: 4, color: "#c0c0d8" }}>
            X-API-Key
          </code> header
        </p>

        <div style={{ background: "#12121e", border: "1px solid #25253f", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #25253f" }}>
                {["Method", "Endpoint", "Description", "Credit"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 16px", textAlign: "left", fontSize: 11,
                      fontWeight: 600, color: "#7070a0", textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((ep, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #25253f15" }}>
                  <td style={{ padding: "8px 16px" }}>
                    <span
                      style={{
                        fontSize: 11, fontWeight: 700, fontFamily: "monospace",
                        color: ep.method === "POST" ? "#22c55e" : "#60a5fa",
                        background: ep.method === "POST" ? "#22c55e15" : "#60a5fa15",
                        borderRadius: 4, padding: "2px 6px",
                      }}
                    >
                      {ep.method}
                    </span>
                  </td>
                  <td style={{ padding: "8px 16px", fontSize: 13, color: "#c0c0d8", fontFamily: "monospace" }}>
                    {ep.path}
                  </td>
                  <td style={{ padding: "8px 16px", fontSize: 13, color: "#7070a0" }}>
                    {ep.desc}
                  </td>
                  <td style={{ padding: "8px 16px", fontSize: 12, color: "#7070a0", textAlign: "center" }}>
                    {ep.credit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ color: "#3a3a5c", fontSize: 12, marginTop: 8 }}>
          Full OpenAPI docs at{" "}
          <a href="https://api.avantia2a.com/docs" target="_blank" rel="noopener noreferrer" style={{ color: "#7070a0" }}>
            /docs
          </a>
        </p>
      </section>

      {/* ── Section 4: MCP Config Generator ───────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f8", marginBottom: 4 }}>MCP Integration</h2>
        <p style={{ color: "#7070a0", fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
          Connect Avanti to Claude Code, Cursor, or any MCP-compatible AI agent.
          Paste the config below into your <code style={{ background: "#0a0a14", padding: "2px 6px", borderRadius: 4, color: "#c0c0d8" }}>
            .mcp.json
          </code> or agent settings.
        </p>

        <div
          style={{
            background: "#12121e", border: "1px solid #25253f", borderRadius: 12,
            padding: "20px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#7070a0" }}>
              .mcp.json
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(mcpConfig(displayKey));
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              style={{
                background: "#1a1a2e", border: "1px solid #25253f", color: "#7070a0",
                borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer",
              }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre
            style={{
              margin: 0, background: "#0a0a14", borderRadius: 8, padding: "16px 20px",
              fontSize: 13, lineHeight: 1.6, color: "#c0c0d8", fontFamily: "monospace",
              overflow: "auto",
            }}
          >
            {mcpConfig(displayKey)}
          </pre>

          {!justCreated && (
            <p style={{ color: "#7070a0", fontSize: 12, marginTop: 12, fontStyle: "italic" }}>
              Create an API key above to auto-fill the config with your key.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
