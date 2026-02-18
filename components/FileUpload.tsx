'use client';

import { useRef, useState } from 'react';

interface FileUploadProps {
  onFollowersUpload: (content: string, fileName: string) => void;
  onFollowingUpload: (content: string, fileName: string) => void;
  followersFileName?: string;
  followingFileName?: string;
}

export default function FileUpload({
  onFollowersUpload,
  onFollowingUpload,
  followersFileName,
  followingFileName,
}: FileUploadProps) {
  const followersInputRef = useRef<HTMLInputElement>(null);
  const followingInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileRead = (file: File, type: 'followers' | 'following') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (type === 'followers') {
        onFollowersUpload(content, file.name);
      } else {
        onFollowingUpload(content, file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'followers' | 'following') => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileRead(file, type);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'followers' | 'following') => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/json' || file.name.toLowerCase().endsWith('.json'))) {
      handleFileRead(file, type);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Followers Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Followers JSON File
        </label>
        <div
          className={`relative rounded-lg border-2 border-dashed p-6 transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => handleDrop(e, 'followers')}
        >
          <input
            ref={followersInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => handleFileSelect(e, 'followers')}
          />
          <div className="text-center">
            {followersFileName ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  ✓ {followersFileName}
                </p>
                <button
                  onClick={() => followersInputRef.current?.click()}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Change file
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Drag & drop or{' '}
                  <button
                    onClick={() => followersInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    browse
                  </button>
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Upload followers.json from Instagram data
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Following Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Following JSON File
        </label>
        <div
          className={`relative rounded-lg border-2 border-dashed p-6 transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => handleDrop(e, 'following')}
        >
          <input
            ref={followingInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => handleFileSelect(e, 'following')}
          />
          <div className="text-center">
            {followingFileName ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  ✓ {followingFileName}
                </p>
                <button
                  onClick={() => followingInputRef.current?.click()}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Change file
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Drag & drop or{' '}
                  <button
                    onClick={() => followingInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    browse
                  </button>
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Upload following.json from Instagram data
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
