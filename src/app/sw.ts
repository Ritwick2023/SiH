import { defaultCache } from "@serwist/next/worker";
import {
  type PrecacheEntry,
  Serwist,
  NetworkFirst,
  StaleWhileRevalidate,
  NetworkOnly,
  BackgroundSyncPlugin,
} from "serwist";

declare global {
  interface WorkerGlobalScope {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope & { __SW_MANIFEST: (PrecacheEntry | string)[] | undefined };

// Serwist BackgroundSyncPlugin (Task D1): Resilient queue with 7-day retention
const assessmentSyncPlugin = new BackgroundSyncPlugin("statvidya-assessment-sync", {
  maxRetentionTime: 7 * 24 * 60, // 7 days in minutes
});

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Background Sync for Assessment submissions
    {
      matcher: ({ url, request }) => url.pathname === "/api/assessment/sync" && request.method === "POST",
      handler: new NetworkOnly({
        plugins: [assessmentSyncPlugin],
      }),
      method: "POST",
    },
    // Cache assessment pages and shell for offline survey completion
    {
      matcher: ({ url }) => url.pathname.startsWith("/assessment"),
      handler: new NetworkFirst({
        cacheName: "statvidya-assessments",
        networkTimeoutSeconds: 3,
      }),
    },
    // Cache static data & dashboard routes for instant offline viewing
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/dashboard") ||
        url.pathname.startsWith("/pathways") ||
        url.pathname.startsWith("/profile") ||
        url.pathname.startsWith("/skill-gap"),
      handler: new StaleWhileRevalidate({
        cacheName: "statvidya-app-routes",
      }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
