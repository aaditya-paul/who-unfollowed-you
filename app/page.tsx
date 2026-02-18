'use client';

import { useState, useEffect, useCallback } from 'react';
import FileUpload from '@/components/FileUpload';
import AnalysisResults from '@/components/AnalysisResults';
import { parseFollowersFile, parseFollowingFile, analyzeInstagramData } from '@/lib/instagram-parser';
import { saveInstagramData, getInstagramData, getPreviousInstagramData, clearInstagramData } from '@/lib/storage';
import { InstagramData, AnalysisResult } from '@/types/instagram';

export default function Home() {
  const [followers, setFollowers] = useState<InstagramData['followers']>([]);
  const [following, setFollowing] = useState<InstagramData['following']>([]);
  const [followersFileName, setFollowersFileName] = useState<string>('');
  const [followingFileName, setFollowingFileName] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeData = useCallback((data: InstagramData) => {
    setIsAnalyzing(true);
    try {
      const previousDataRaw = getPreviousInstagramData();
      const previousData: InstagramData | undefined = previousDataRaw ?? undefined;
      const result = analyzeInstagramData(data, previousData);
      setAnalysisResult(result);
      console.log('Analysis complete:', {
        followers: data.followers.length,
        following: data.following.length,
        mutual: result.stats.mutualCount,
        unfollowers: result.stats.unfollowersCount,
      });
    } catch (err) {
      setError(`Analysis error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Load saved data on mount
  useEffect(() => {
    const savedData = getInstagramData();
    if (savedData) {
      setFollowers(savedData.followers);
      setFollowing(savedData.following);
    }
  }, []);

  // Run analysis whenever both lists are populated (handles async state updates and file uploads)
  useEffect(() => {
    if (followers.length > 0 && following.length > 0) {
      const data: InstagramData = { followers, following };
      saveInstagramData(data);
      analyzeData(data);
    }
  }, [followers, following, analyzeData]);

  const handleFollowersUpload = (content: string, fileName: string) => {
    try {
      setError('');
      const parsed = parseFollowersFile(content);
      if (parsed.length === 0) {
        setError('Followers file appears to be empty. Please check your file.');
        return;
      }
      setFollowers(parsed);
      setFollowersFileName(fileName);
      console.log(`Parsed ${parsed.length} followers`);
    } catch (err) {
      setError(`Error parsing followers file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Followers parse error:', err);
    }
  };

  const handleFollowingUpload = (content: string, fileName: string) => {
    try {
      setError('');
      const parsed = parseFollowingFile(content);
      if (parsed.length === 0) {
        setError('Following file appears to be empty. Please check your file.');
        return;
      }
      setFollowing(parsed);
      setFollowingFileName(fileName);
      console.log(`Parsed ${parsed.length} following`);
    } catch (err) {
      setError(`Error parsing following file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Following parse error:', err);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearInstagramData();
      setFollowers([]);
      setFollowing([]);
      setFollowersFileName('');
      setFollowingFileName('');
      setAnalysisResult(null);
      setError('');
    }
  };

  const hasData = followers.length > 0 && following.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8 md:px-8 lg:px-16">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Who unfollowed you
          </p>
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100">
            Instagram Follower Analyzer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Upload your Instagram data to discover who unfollowed you, mutual follows, and more
          </p>
        </div>

        {/* Instructions */}
        <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <h2 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
            How to get your Instagram data:
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>Go to Instagram Settings → Your activity → Download your information</li>
            <li>Select &quot;Followers&quot; and &quot;Following&quot; from the data types</li>
            <li>Choose JSON format and request your data</li>
            <li>Once downloaded, extract the ZIP file</li>
            <li>Upload the followers.json and following.json files below</li>
          </ol>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}

        {/* File Upload */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Upload Instagram Data
            </h2>
            {hasData && (
              <button
                onClick={handleClearData}
                className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
              >
                Clear Data
              </button>
            )}
          </div>
          <FileUpload
            onFollowersUpload={handleFollowersUpload}
            onFollowingUpload={handleFollowingUpload}
            followersFileName={followersFileName}
            followingFileName={followingFileName}
          />
          {hasData && (
            <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-200">
              ✓ Data loaded: {followers.length.toLocaleString()} followers,{' '}
              {following.length.toLocaleString()} following
              {analysisResult && !isAnalyzing && (
                <span className="ml-2">• Analysis complete!</span>
              )}
            </div>
          )}
        </div>

        {/* Loading Indicator */}
        {isAnalyzing && (
          <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-blue-900 dark:text-blue-100">
                Analyzing your Instagram data...
              </p>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && !isAnalyzing && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Analysis Results
            </h2>
            <AnalysisResults results={analysisResult} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Your data is processed locally in your browser and never sent to any server.
          </p>
          <p className="mt-1">
            Privacy-first Instagram analytics tool.
          </p>
        </footer>
      </main>
    </div>
  );
}
