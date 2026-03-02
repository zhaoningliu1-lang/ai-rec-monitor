import { api, LeaderboardEntry } from "@/lib/api";
import CategoryLeaderboardView from "@/components/views/CategoryLeaderboardView";

export default async function CategoryLeaderboardPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryName = decodeURIComponent(category);

  let leaderboard: LeaderboardEntry[] = [];
  try {
    leaderboard = await api.getCategoryLeaderboard(categoryName);
  } catch {
    // API may not be available
  }

  return <CategoryLeaderboardView categoryName={categoryName} leaderboard={leaderboard} lang="en" />;
}
