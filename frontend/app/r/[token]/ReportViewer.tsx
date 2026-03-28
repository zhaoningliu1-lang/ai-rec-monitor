"use client";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

export default function ReportViewer({ token }: { token: string }) {
  return (
    <div className="fixed inset-0 bg-white">
      <iframe
        src={`${API}/reports/${token}/html`}
        className="w-full h-full border-0"
        title="Report"
      />
      <a
        href="https://avantia2a.com"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-3 right-4 text-[11px] px-3 py-1.5 rounded-full bg-[rgba(0,0,0,.7)] text-white/70 hover:text-white backdrop-blur-sm transition z-50"
      >
        Powered by <span className="text-[#ff6b35] font-medium">Avanti</span>
      </a>
    </div>
  );
}
