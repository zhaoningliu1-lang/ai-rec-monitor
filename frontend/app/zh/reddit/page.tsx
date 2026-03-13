import type { Metadata } from "next";
import RedditView from "@/components/views/RedditView";

export const metadata: Metadata = {
  title: "Reddit 引用情报 — AI 信源追踪 | 阿凡提 GEO",
  description:
    "追踪 AI 模型引用哪些 Reddit 帖子来评价你的品牌。监控情感、点赞数和 AI 引用频率。",
};

export default function ZhRedditPage() {
  return <RedditView lang="zh" />;
}
