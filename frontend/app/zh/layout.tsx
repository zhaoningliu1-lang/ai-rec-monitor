import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avanti — AI 品牌可见度监控",
  description: "知道你的品牌在 AI 时代的真实位置。",
};

export default function ZhLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
