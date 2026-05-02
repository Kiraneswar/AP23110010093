# Campus Notification System

This is a frontend campus notification dashboard built with Next.js, Material UI, and a custom isomorphic logging middleware.

## Project Structure

The repository is divided into two main parts:

- `logging_middleware/`: A standalone, reusable logging and authentication package. It handles token fetching and caching, auto-refreshes tokens on 401/403 errors, and provides a clean color-coded console logger as a fallback when the remote logging API is down.
- `notification_app_fe/`: The frontend application built in Next.js. It features a Material UI design, a Min Heap-based priority sorting algorithm, and local read/unread state management.

## Tech Stack

- **Framework**: Next.js
- **Styling**: Material UI (MUI)
- **Language**: TypeScript
- **Data Structures**: Min Heap for efficient O(N log K) priority sorting

## Key Features

1. **Top Priority Notifications**: Automatically pulls the top 3 notifications based on weighted priority (Placement > Result > Event) and recency.
2. **Filtering & Pagination**: Allows users to filter by notification type and paginate through the history.
3. **Smart Error Handling**: The UI catches network and authentication failures gracefully and provides a retry mechanism.
4. **Isomorphic Logging**: Tracks actions across both the client-side UI and server-side API requests.

## How to Run Locally

1. **Install Dependencies**
   Navigate to the frontend directory and install the packages. The logging middleware is already linked locally via package.json.
   ```bash
   cd notification_app_fe
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

3. **View the App**
   Open your browser and navigate to `http://localhost:3000`. You will be automatically redirected to the notifications dashboard.

## Configuration

To update the API credentials, edit `logging_middleware/config.ts` and restart the Next.js server. The Next.js configuration includes an API proxy rewrite to naturally bypass CORS issues during local development.
