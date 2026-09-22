/**
 * StatVidya Universal Resilient Service Bridge
 * 
 * Supports Zero-Downtime Dual-Mode architecture:
 * Attempts remote microservice execution with a strict timeout (default 1,500ms).
 * If the remote service is offline, slow, or throws an error, gracefully falls back
 * to local heuristic or in-memory algorithms without interrupting the user.
 */

export async function executeWithFallback<T>(
  remoteAction: () => Promise<T>,
  localFallback: () => Promise<T> | T,
  serviceName: string,
  timeoutMs: number = 1500
): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error(`${serviceName} timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    const result = await Promise.race([remoteAction(), timeoutPromise]);
    if (timer) clearTimeout(timer);
    return result;
  } catch (error) {
    if (timer) clearTimeout(timer);
    if (process.env.NODE_ENV !== 'test') {
      console.warn(
        `[StatVidya Fallback] ${serviceName} unavailable: ${(error as Error).message}. Routing to local fallback.`
      );
    }
    return await localFallback();
  }
}

/**
 * Type-safe environment variable reader that works in both client and server runtimes.
 */
export function getServiceUrl(envKey: string, fallback: string): string {
  if (typeof window === 'undefined') {
    return process.env[envKey] || fallback;
  }
  const windowEnv = (window as unknown as Record<string, unknown>)[envKey] as string | undefined;
  return windowEnv || process.env[envKey] || fallback;
}

/**
 * Returns secure headers for calling internal analytics microservice,
 * including bearer authorization when running server-side.
 */
export function getAnalyticsHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const secret = typeof process !== 'undefined' ? process.env?.ANALYTICS_API_SECRET : undefined;
  if (secret) {
    headers['Authorization'] = `Bearer ${secret}`;
  }
  return headers;
}
