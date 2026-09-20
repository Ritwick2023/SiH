'use client';

import { useLocale } from 'next-intl';
import { useCallback } from 'react';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const currentLocale = useLocale();

  const handleLanguageChange = useCallback(
    (lang: 'en' | 'hi') => {
      if (typeof document !== 'undefined') {
        // Persist explicit locale cookie
        document.cookie = `locale=${lang};path=/;max-age=31536000;SameSite=Lax`;

        // Sync demo_user persona preferred_language if active
        try {
          const match = document.cookie.match(/(?:^|;\s*)demo_user=([^;]+)/);
          if (match) {
            const demoUser = JSON.parse(decodeURIComponent(match[1]));
            demoUser.preferred_language = lang;
            if (demoUser.user_metadata) {
              demoUser.user_metadata.preferred_language = lang;
            }
            document.cookie = `demo_user=${encodeURIComponent(JSON.stringify(demoUser))};path=/;max-age=${60 * 60 * 24 * 7};SameSite=Lax`;
          }
        } catch {
          // Ignore JSON parse errors
        }

        // Cleanly reload page to re-render server and client components with new locale
        window.location.reload();
      }
    },
    []
  );

  return (
    <div className="fixed bottom-4 left-4 md:hidden flex items-center gap-1.5 bg-white border border-[#D8DFEE] rounded-full shadow-lg px-2 py-1.5 z-40">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
          currentLocale === 'en'
            ? 'bg-[#1C4CA1] text-white'
            : 'text-muted-foreground hover:bg-[#EDF0F7]'
        }`}
        aria-pressed={currentLocale === 'en'}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('hi')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
          currentLocale === 'hi'
            ? 'bg-[#1C4CA1] text-white'
            : 'text-muted-foreground hover:bg-[#EDF0F7]'
        }`}
        aria-pressed={currentLocale === 'hi'}
      >
        HI
      </button>
      <Globe className="h-3.5 w-3.5 text-[#FFA72F] mr-1" />
    </div>
  );
}
