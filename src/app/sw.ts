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
  interface ExtendableMessageEvent extends Event {
    data: { type?: string; [key: string]: unknown } | null;
    ports: ReadonlyArray<MessagePort>;
    waitUntil(f: Promise<unknown>): void;
  }
  interface WorkerGlobalScope {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    addEventListener(type: string, listener: (event: ExtendableMessageEvent) => void): void;
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

// Listen for logout events to purge sensitive route & assessment caches
self.addEventListener("message", (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === "PURGE_SENSITIVE_CACHE") {
    event.waitUntil(
      Promise.all([
        caches.delete("statvidya-assessments"),
        caches.delete("statvidya-app-routes"),
      ]).then(() => {
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ success: true });
        }
      })
    );
  }
});

