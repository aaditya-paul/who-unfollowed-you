"use client";

import { AnalysisResult, InstagramUser } from "@/types/instagram";
import { useState } from "react";

interface ResultsDisplayProps {
  results: AnalysisResult;
}

function UserList({ users, title }: { users: InstagramUser[]; title: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.value.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const displayedUsers = showAll ? filteredUsers : filteredUsers.slice(0, 50);

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400">No results found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {users.length} {users.length === 1 ? "account" : "accounts"}
        </span>
      </div>

      {users.length > 10 && (
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        />
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {displayedUsers.map((user, index) => (
          <div
            key={`${user.value}-${index}`}
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                @{user.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length > 50 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 w-full py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Show all {filteredUsers.length} results
        </button>
      )}
    </div>
  );
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<
    "unfollowers" | "notFollowingBack" | "youNotFollowingBack" | "mutual"
  >("unfollowers");

  const tabs = [
    {
      id: "unfollowers" as const,
      label: "Unfollowers",
      count: results.stats.unfollowersCount,
    },
    {
      id: "notFollowingBack" as const,
      label: "Not Following Back",
      count: results.stats.notFollowingBackCount,
    },
    {
      id: "youNotFollowingBack" as const,
      label: "You Not Following Back",
      count: results.stats.notFollowingThemBackCount,
    },
    {
      id: "mutual" as const,
      label: "Mutual Follows",
      count: results.stats.mutualCount,
    },
  ];

  const getActiveUsers = () => {
    switch (activeTab) {
      case "unfollowers":
        return results.unfollowers;
      case "notFollowingBack":
        return results.notFollowingBack;
      case "youNotFollowingBack":
        return results.notFollowingThemBack;
      case "mutual":
        return results.mutualFollows;
      default:
        return [];
    }
  };

  const getActiveTitle = () => {
    return tabs.find((t) => t.id === activeTab)?.label || "";
  };

  return (
    <div className="w-full space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Followers
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {results.stats.totalFollowers.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Following
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {results.stats.totalFollowing.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Mutual Follows
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {results.stats.mutualCount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Active Tab Content */}
      <UserList users={getActiveUsers()} title={getActiveTitle()} />
    </div>
  );
}
