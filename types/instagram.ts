export interface InstagramUser {
  value: string; // Username
  timestamp?: number; // Unix timestamp when they followed/following started
}

export interface InstagramData {
  followers: InstagramUser[];
  following: InstagramUser[];
}

export interface AnalysisResult {
  hasPreviousData: boolean; // Whether a previous session's data was available for comparison
  unfollowers: InstagramUser[]; // People who unfollowed you (requires previous data)
  youUnfollowed: InstagramUser[]; // People you unfollowed (requires previous data)
  mutualFollows: InstagramUser[]; // People you both follow
  newFollowers: InstagramUser[]; // New followers since last upload (requires previous data)
  newFollowing: InstagramUser[]; // New people you're following since last upload (requires previous data)
  notFollowingBack: InstagramUser[]; // People you follow but don't follow you back
  notFollowingThemBack: InstagramUser[]; // People following you but you don't follow back
  stats: {
    totalFollowers: number;
    totalFollowing: number;
    mutualCount: number;
    unfollowersCount: number;
    youUnfollowedCount: number;
    notFollowingBackCount: number;
    notFollowingThemBackCount: number;
  };
}
