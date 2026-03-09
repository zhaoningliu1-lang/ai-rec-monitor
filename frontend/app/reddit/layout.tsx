import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reddit Citation Intelligence — AI Source Tracker | Avanti GEO",
  description:
    "Track which Reddit threads AI models cite about your brand. Monitor sentiment, upvotes, and AI citation frequency.",
};

export default function RedditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
