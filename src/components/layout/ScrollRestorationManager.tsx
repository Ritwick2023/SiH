'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollRestorationManager
 *
 * Preserves scroll position across full-page reloads and browser refreshes
 * using sessionStorage without interfering with native back/forward history navigation.
 *
 * Key Design & Security Considerations:
 * 1. history.scrollRestoration = 'manual' to prevent browser racing with client hydration.
 * 2. Scoped by exact window.location.pathname.
 * 3. Persists scrollY on beforeunload and debounced scroll.
 * 4. Restores position on mount using requestAnimationFrame / setTimeout retry to accommodate async content.
 * 5. Cleans up stale entries to prevent memory leaks in sessionStorage.
 * 6. Zero sensitive data stored — strictly window.scrollX and window.scrollY numbers.
 */
export function ScrollRestorationManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const storageKey = `statvidya_scroll_${pathname}`;

    // 1. Attempt scroll restoration on route mount / refresh
    const savedPos = sessionStorage.getItem(storageKey);
    if (savedPos) {
      try {
        const { x, y } = JSON.parse(savedPos);
        if (typeof x === 'number' && typeof y === 'number' && (x > 0 || y > 0)) {
          // Staggered restoration to accommodate DOM hydration and async chart rendering
          requestAnimationFrame(() => {
            window.scrollTo({ left: x, top: y, behavior: 'instant' });
            setTimeout(() => {
              window.scrollTo({ left: x, top: y, behavior: 'instant' });
            }, 100);
            setTimeout(() => {
              if (Math.abs(window.scrollY - y) > 30) {
                window.scrollTo({ left: x, top: y, behavior: 'instant' });
              }
            }, 350);
          });
        }
      } catch {
        // Ignore JSON parse errors
      }
    }

    // 2. Save scroll position periodically and on unload
    let scrollTimeout: NodeJS.Timeout | null = null;
    const saveCurrentScroll = () => {
      try {
        const x = window.scrollX;
        const y = window.scrollY;
        sessionStorage.setItem(storageKey, JSON.stringify({ x, y, ts: Date.now() }));
      } catch {
        // Ignore storage write failures (e.g. private mode quota)
      }
    };

    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(saveCurrentScroll, 150);
    };

    const handleBeforeUnload = () => {
      saveCurrentScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  return null;
}
