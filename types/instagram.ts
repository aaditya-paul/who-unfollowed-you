export interface InstagramUser {
  value: string; // Username
  timestamp?: number; // Unix timestamp when they followed/following started
}

export interface InstagramData {
  followers: InstagramUser[];
  following: InstagramUser[];
}

export interface AnalysisResult {
  unfollowers: InstagramUser[]; // People who unfollowed you
  youUnfollowed: InstagramUser[]; // People you unfollowed
  mutualFollows: InstagramUser[]; // People you both follow
  newFollowers: InstagramUser[]; // New followers (compared to previous data)
  newFollowing: InstagramUser[]; // New people you're following
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
