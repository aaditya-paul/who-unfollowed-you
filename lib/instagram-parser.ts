import {
  InstagramUser,
  InstagramData,
  AnalysisResult,
} from "@/types/instagram";

function extractUsernameFromHref(href: unknown): string | null {
  if (typeof href !== "string") return null;

  const raw = href.trim();
  if (!raw) return null;

  const parseFromPath = (path: string): string | null => {
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 0) return null;
    const last = parts[parts.length - 1];
    const prev = parts.length >= 2 ? parts[parts.length - 2] : null;
    if (prev === "_u") return last;
    return last;
  };

  try {
    const url = new URL(raw);
    return parseFromPath(url.pathname);
  } catch {
    const noQuery = raw.split("?")[0] ?? raw;
    return parseFromPath(noQuery);
  }
}

function extractInstagramUser(item: any): InstagramUser | null {
  const first = Array.isArray(item?.string_list_data)
    ? item.string_list_data[0]
    : undefined;

  const candidates: unknown[] = [
    first?.value,
    item?.title,
    first?.href,
    item?.href,
    item?.value,
  ];

  let username: string | null = null;
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) {
      username = c.trim();
      break;
    }
  }

  if (username && username.startsWith("http")) {
    username = extractUsernameFromHref(username);
  } else if (!username) {
    username = extractUsernameFromHref(first?.href ?? item?.href);
  }

  if (!username || !username.trim()) return null;

  const ts = first?.timestamp ?? item?.timestamp;
  const timestamp =
    typeof ts === "number" && Number.isFinite(ts) ? ts : undefined;

  return { value: username, timestamp };
}

/**
 * Parse Instagram followers JSON file
 * Instagram data export format: { "relationships_followers": [...] }
 */
export function parseFollowersFile(content: string): InstagramUser[] {
  const data = JSON.parse(content);
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.relationships_followers)
      ? data.relationships_followers
      : [];

  if (!Array.isArray(list)) throw new Error("Invalid followers file format");

  return list
    .map(extractInstagramUser)
    .filter((u): u is InstagramUser => Boolean(u));
}

/**
 * Parse Instagram following JSON file
 * Instagram data export format: { "relationships_following": [...] }
 */
export function parseFollowingFile(content: string): InstagramUser[] {
  const data = JSON.parse(content);
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.relationships_following)
      ? data.relationships_following
      : [];

  if (!Array.isArray(list)) throw new Error("Invalid following file format");

  return list
    .map(extractInstagramUser)
    .filter((u): u is InstagramUser => Boolean(u));
}

/**
 * Analyze Instagram data to find various insights
 */
export function analyzeInstagramData(
  currentData: InstagramData,
  previousData?: InstagramData,
): AnalysisResult {
  const currentFollowers = new Set(
    currentData.followers.map((f) => f.value.toLowerCase()),
  );
  const currentFollowing = new Set(
    currentData.following.map((f) => f.value.toLowerCase()),
  );

  // Find mutual follows
  const mutualFollows = currentData.followers.filter((follower) =>
    currentFollowing.has(follower.value.toLowerCase()),
  );

  // Find people you follow but don't follow you back
  const notFollowingBack = currentData.following.filter(
    (following) => !currentFollowers.has(following.value.toLowerCase()),
  );

  // Find people following you but you don't follow back
  const notFollowingThemBack = currentData.followers.filter(
    (follower) => !currentFollowing.has(follower.value.toLowerCase()),
  );

  // Compare with previous data if available
  let unfollowers: InstagramUser[] = [];
  let youUnfollowed: InstagramUser[] = [];
  let newFollowers: InstagramUser[] = [];
  let newFollowing: InstagramUser[] = [];

  if (previousData) {
    const previousFollowers = new Set(
      previousData.followers.map((f) => f.value.toLowerCase()),
    );
    const previousFollowing = new Set(
      previousData.following.map((f) => f.value.toLowerCase()),
    );

    // Find who unfollowed you
    unfollowers = previousData.followers.filter(
      (follower) => !currentFollowers.has(follower.value.toLowerCase()),
    );

    // Find who you unfollowed
    youUnfollowed = previousData.following.filter(
      (following) => !currentFollowing.has(following.value.toLowerCase()),
    );

    // Find new followers
    newFollowers = currentData.followers.filter(
      (follower) => !previousFollowers.has(follower.value.toLowerCase()),
    );

    // Find new following
    newFollowing = currentData.following.filter(
      (following) => !previousFollowing.has(following.value.toLowerCase()),
    );
  }

  return {
    hasPreviousData: !!previousData,
    unfollowers,
    youUnfollowed,
    mutualFollows,
    newFollowers,
    newFollowing,
    notFollowingBack,
    notFollowingThemBack,
    stats: {
      totalFollowers: currentData.followers.length,
      totalFollowing: currentData.following.length,
      mutualCount: mutualFollows.length,
      unfollowersCount: unfollowers.length,
      youUnfollowedCount: youUnfollowed.length,
      notFollowingBackCount: notFollowingBack.length,
      notFollowingThemBackCount: notFollowingThemBack.length,
    },
  };
}
