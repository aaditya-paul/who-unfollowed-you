# Who Unfollowed You? - Instagram Follower Analyzer

A web application that analyzes your Instagram follower and following lists to discover insights like who unfollowed you, who's not following back, mutual follows, and more.

## Features

- 📊 **Comprehensive Analysis**: Compare your followers and following lists
- 🔍 **Find Unfollowers**: Discover who you follow but doesn't follow you back
- 👥 **Mutual Follows**: See who follows you and you follow them back
- 📈 **Statistics**: View detailed stats about your Instagram connections
- 🔒 **Privacy First**: All processing happens locally in your browser - no data is uploaded to any server
- 📁 **Multiple Formats**: Supports JSON, CSV, and text file formats

## How to Get Your Instagram Data

1. Go to Instagram Settings → Your activity → **Download your information**
2. Select **JSON** format
3. Choose **Followers** and **Following** from the list
4. Click **Create File** and wait for Instagram to prepare your data
5. Download the ZIP file when ready
6. Extract the ZIP file
7. Upload the following files:
   - `followers_1.json` (or similar follower files)
   - `following.json`

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## How It Works

1. **Upload Your Data**: Upload your Instagram followers and following JSON files
2. **Analysis**: The app automatically parses and compares the data
3. **Insights**: View detailed results including:
   - **Unfollowers**: People you follow who don't follow you back
   - **Not Following Back**: People who follow you but you don't follow them
   - **You Not Following Back**: People you follow but they don't follow you
   - **Mutual Follows**: People who follow each other

## Supported File Formats

- **JSON**: Instagram's native export format (recommended)
- **CSV**: Comma-separated values with username, name, etc.
- **TXT**: Plain text file with one username per line

## Privacy

This application runs entirely in your browser. Your Instagram data is never uploaded to any server. All processing happens locally on your device.

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React 19** - UI library

## License

MIT
