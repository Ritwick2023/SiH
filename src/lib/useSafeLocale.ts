'use client';

import { useLocale } from 'next-intl';

/**
 * Safely accesses next-intl's useLocale() hook.
 * If called in an environment without NextIntlClientProvider (such as unit tests
 * or isolated component renders), it falls back gracefully to `fallbackLocale`
 * instead of throwing an unhandled exception.
 */
export function useSafeLocale(fallbackLocale: string = 'en'): string {
  try {
    return useLocale();
  } catch {
    return fallbackLocale;
  }
}
