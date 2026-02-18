'use client';

import { AnalysisResult } from '@/types/instagram';
import Link from 'next/link';
import { useState } from 'react';

interface AnalysisResultsProps {
  results: AnalysisResult;
}

export default function AnalysisResults({ results }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<string>('stats');

  const tabs = [
    { id: 'stats', label: 'Stats', count: null },
    { id: 'unfollowers', label: 'Unfollowers', count: results.stats.unfollowersCount },
    { id: 'youUnfollowed', label: 'You Unfollowed', count: results.stats.youUnfollowedCount },
    { id: 'newFollowers', label: 'New Followers', count: results.newFollowers.length },
    { id: 'newFollowing', label: 'New Following', count: results.newFollowing.length },
    { id: 'notFollowingBack', label: 'Not Following Back', count: results.stats.notFollowingBackCount },
    { id: 'notFollowingThemBack', label: 'Not Following Them Back', count: results.stats.notFollowingThemBackCount },
    { id: 'mutualFollows', label: 'Mutual Follows', count: results.stats.mutualCount },
  ];

  const renderUserList = (users: typeof results.unfollowers) => {
    if (users.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          No users found
        </div>
      );
    }

    return (
      <div className="grid gap-2">
        {users.map((user, index) => (
          <div
            key={`${user.value}-${index}`}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
          >
            <Link href={`https://www.instagram.com/${user.value}`}>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              @{user.value}
            </span>
            </Link>
            {user.timestamp && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(user.timestamp * 1000).toLocaleDateString()}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Followers"
              value={results.stats.totalFollowers}
              icon="👥"
            />
            <StatCard
              title="Total Following"
              value={results.stats.totalFollowing}
              icon="➕"
            />
            <StatCard
              title="Mutual Follows"
              value={results.stats.mutualCount}
              icon="🤝"
            />
            <StatCard
              title="Unfollowers"
              value={results.stats.unfollowersCount}
              icon="👋"
              variant="warning"
            />
            <StatCard
              title="You Unfollowed"
              value={results.stats.youUnfollowedCount}
              icon="➖"
              variant="info"
            />
            <StatCard
              title="Not Following Back"
              value={results.stats.notFollowingBackCount}
              icon="❌"
              variant="danger"
            />
            <StatCard
              title="Not Following Them Back"
              value={results.stats.notFollowingThemBackCount}
              icon="⚠️"
              variant="warning"
            />
          </div>
        );
      case 'unfollowers':
        return renderUserList(results.unfollowers);
      case 'youUnfollowed':
        return renderUserList(results.youUnfollowed);
      case 'notFollowingBack':
        return renderUserList(results.notFollowingBack);
      case 'notFollowingThemBack':
        return renderUserList(results.notFollowingThemBack);
      case 'mutualFollows':
        return renderUserList(results.mutualFollows);
      case 'newFollowers':
        return renderUserList(results.newFollowers);
      case 'newFollowing':
        return renderUserList(results.newFollowing);
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            }`}
          >
            {tab.label}
            {tab.count !== null && tab.count > 0 && (
              <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs dark:bg-gray-700">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px] rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
        {renderContent()}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  variant?: 'default' | 'warning' | 'danger' | 'info';
}

function StatCard({ title, value, icon, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700',
    warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
    danger: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
  };

  return (
    <div className={`rounded-lg border p-4 ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value.toLocaleString()}
          </p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}
