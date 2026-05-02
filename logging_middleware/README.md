# Logging Middleware Package

A production-ready, reusable logging middleware package designed for both `backend` and `frontend` TypeScript/JavaScript environments. 

## Features
- **Auto-Refreshing Auth**: Automatically calls the authentication API to fetch, store, and reuse the Bearer `access_token`. 
- **Graceful Token Refresh**: If the logging API responds with a `401 Unauthorized`, the middleware automatically invalidates the token, fetches a new one, and retries the log once seamlessly.
- **Strict Validation**: Validates the stack, log level, and correct package correlation before attempting network calls.
- **Cross-Environment Reusability**: Uses native `fetch` and isomorphic design allowing identical usage in Node.js, Next.js, React, or pure Browser environments.
- **Graceful Fallback & Premium Aesthetics**: Implements a robust fallback logging mechanism. If the network drops, logs are printed to the console using a completely custom, professionally curated RGB ANSI color palette (avoiding typical flat terminal colors to look distinct and modern).
- **Concurrency Safe**: The authentication layer uses a singleton promise to ensure multiple simultaneous logs do not trigger multiple redundant authentication API calls.

## Folder Structure
```text
/logging_middleware
├── auth.ts      # Authentication logic and token management
├── config.ts    # Configuration, URLs, and overridable settings
├── example.ts   # Test script demonstrating usage
├── index.ts     # Public API exports
├── logger.ts    # Core logic, validation, and network requests
└── types.ts     # Strict TypeScript typings
```

## Setup & Usage

Simply import the `Log` function. The middleware handles authentication under the hood automatically.

```typescript
import { Log } from './logging_middleware';

// Example: Backend Error
await Log("backend", "error", "handler", "received string, expected bool");

// Example: Frontend Info
await Log("frontend", "info", "component", "User navigated to home");
```

## Running the Example
If you are using Node.js:
```bash
npx ts-node example.ts
```
