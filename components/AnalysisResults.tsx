'use client';

import { AnalysisResult, InstagramUser } from '@/types/instagram';
import { useState, useMemo } from 'react';

interface AnalysisResultsProps {
  results: AnalysisResult;
}

type TabId =
  | 'stats'
  | 'notFollowingBack'
  | 'notFollowingThemBack'
  | 'mutualFollows'
  | 'unfollowers'
  | 'youUnfollowed'
  | 'newFollowers'
  | 'newFollowing';

// ─── User List ──────────────────────────────────────────────────────────────
interface UserListProps {
  users: InstagramUser[];
  emptyMessage?: string;
  emptyDetail?: string;
}

function UserList({ users, emptyMessage = 'No users found', emptyDetail }: UserListProps) {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const list = q ? users.filter((u) => u.value.toLowerCase().includes(q)) : users;
    return [...list].sort((a, b) => a.value.localeCompare(b.value));
  }, [users, search]);

  const handleCopy = () => {
    const text = filtered.map((u) => `@${u.value}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (users.length === 0) {
    return (
      <div className="py-12 text-center space-y-2">
        <p className="text-gray-500 dark:text-gray-400 font-medium">{emptyMessage}</p>
        {emptyDetail && (
          <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm mx-auto">{emptyDetail}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder={`Search ${users.length} accounts…`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCopy}
          className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
        >
          {copied ? '✓ Copied' : 'Copy list'}
        </button>
      </div>

      {search && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {filtered.length} of {users.length} accounts
        </p>
      )}

      <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">No accounts match your search</p>
        ) : (
          filtered.map((user, i) => <UserRow key={`${user.value}-${i}`} user={user} />)
        )}
      </div>
    </div>
  );
}

function UserRow({ user }: { user: InstagramUser }) {
  return (
    <a
      href={`https://www.instagram.com/${user.value}/`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
    >
      <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        @{user.value}
      </span>
      <div className="flex items-center gap-3">
        {user.timestamp && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {new Date(user.timestamp * 1000).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )}
        <span className="text-xs text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
          ↗ Open
        </span>
      </div>
    </a>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AnalysisResults({ results }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('stats');
  const { hasPreviousData } = results;
  const historicalNote = 'Upload your data again after some time to compare and see changes.';

  const tabs: { id: TabId; label: string; count: number | null; requiresPrevious?: boolean }[] = [
    { id: 'stats', label: 'Overview', count: null },
    { id: 'notFollowingBack', label: "Don't Follow Back", count: results.stats.notFollowingBackCount },
    { id: 'notFollowingThemBack', label: "You Don't Follow Back", count: results.stats.notFollowingThemBackCount },
    { id: 'mutualFollows', label: 'Mutual', count: results.stats.mutualCount },
    { id: 'unfollowers', label: 'Unfollowers', count: results.stats.unfollowersCount, requiresPrevious: true },
    { id: 'youUnfollowed', label: 'You Unfollowed', count: results.stats.youUnfollowedCount, requiresPrevious: true },
    { id: 'newFollowers', label: 'New Followers', count: results.newFollowers.length, requiresPrevious: true },
    { id: 'newFollowing', label: 'New Following', count: results.newFollowing.length, requiresPrevious: true },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return <StatsGrid results={results} hasPreviousData={hasPreviousData} />;
      case 'notFollowingBack':
        return <UserList users={results.notFollowingBack} emptyMessage="Everyone follows you back!" />;
      case 'notFollowingThemBack':
        return <UserList users={results.notFollowingThemBack} emptyMessage="You follow everyone who follows you!" />;
      case 'mutualFollows':
        return <UserList users={results.mutualFollows} emptyMessage="No mutual follows found" />;
      case 'unfollowers':
        return (
          <UserList
            users={results.unfollowers}
            emptyMessage={hasPreviousData ? 'No one unfollowed you since last upload' : 'No previous data to compare'}
            emptyDetail={!hasPreviousData ? historicalNote : undefined}
          />
        );
      case 'youUnfollowed':
        return (
          <UserList
            users={results.youUnfollowed}
            emptyMessage={hasPreviousData ? "You haven't unfollowed anyone since last upload" : 'No previous data to compare'}
            emptyDetail={!hasPreviousData ? historicalNote : undefined}
          />
        );
      case 'newFollowers':
        return (
          <UserList
            users={results.newFollowers}
            emptyMessage={hasPreviousData ? 'No new followers since last upload' : 'No previous data to compare'}
            emptyDetail={!hasPreviousData ? historicalNote : undefined}
          />
        );
      case 'newFollowing':
        return (
          <UserList
            users={results.newFollowing}
            emptyMessage={hasPreviousData ? "You haven't followed anyone new since last upload" : 'No previous data to compare'}
            emptyDetail={!hasPreviousData ? historicalNote : undefined}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* First-upload notice */}
      {!hasPreviousData && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          <strong>First upload detected.</strong> Tabs marked with 🕐 (Unfollowers, New Followers, etc.) need a
          second upload after some time to detect changes. The tabs{' '}
          <em>Don&apos;t Follow Back</em>, <em>You Don&apos;t Follow Back</em>, and <em>Mutual</em> are already
          populated.
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700 pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const dimmed = tab.requiresPrevious && !hasPreviousData;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={dimmed ? 'Requires a second upload to compare' : undefined}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : dimmed
                  ? 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {tab.requiresPrevious && !hasPreviousData && <span className="ml-1 text-xs opacity-50">🕐</span>}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[320px] rounded-lg bg-gray-50 dark:bg-gray-900 p-5">{renderContent()}</div>
    </div>
  );
}

// ─── Stats Grid ──────────────────────────────────────────────────────────────
function StatsGrid({ results, hasPreviousData }: { results: AnalysisResult; hasPreviousData: boolean }) {
  const ratio =
    results.stats.totalFollowers > 0
      ? (results.stats.totalFollowing / results.stats.totalFollowers).toFixed(2)
      : '—';

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
          Current snapshot
        </p>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          <StatCard title="Followers" value={results.stats.totalFollowers} icon="👥" />
          <StatCard title="Following" value={results.stats.totalFollowing} icon="➕" />
          <StatCard title="Mutual Follows" value={results.stats.mutualCount} icon="🤝" />
          <StatCard title="Follow Ratio" value={ratio} icon="📊" />
        </div>
        <div className="mt-3 grid gap-3 grid-cols-2">
          <StatCard title="They Don't Follow Back" value={results.stats.notFollowingBackCount} icon="❌" variant="danger" />
          <StatCard title="You Don't Follow Back" value={results.stats.notFollowingThemBackCount} icon="⚠️" variant="warning" />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
          Changes since last upload
          {!hasPreviousData && <span className="ml-2 text-amber-500 normal-case font-normal">(upload again to unlock)</span>}
        </p>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          <StatCard title="Unfollowers" value={hasPreviousData ? results.stats.unfollowersCount : '—'} icon="👋" variant={hasPreviousData ? 'danger' : 'default'} />
          <StatCard title="You Unfollowed" value={hasPreviousData ? results.stats.youUnfollowedCount : '—'} icon="➖" variant={hasPreviousData ? 'info' : 'default'} />
          <StatCard title="New Followers" value={hasPreviousData ? results.newFollowers.length : '—'} icon="🎉" variant={hasPreviousData ? 'success' : 'default'} />
          <StatCard title="New Following" value={hasPreviousData ? results.newFollowing.length : '—'} icon="✨" variant={hasPreviousData ? 'success' : 'default'} />
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  variant?: 'default' | 'warning' | 'danger' | 'info' | 'success';
}

function StatCard({ title, value, icon, variant = 'default' }: StatCardProps) {
  const variantStyles: Record<string, string> = {
    default: 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700',
    warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
    danger: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    success: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
  };

  const display = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <div className={`rounded-lg border p-4 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{display}</p>
        </div>
        <span className="text-2xl shrink-0">{icon}</span>
      </div>
    </div>
  );
}
