'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { CopilotPanel } from './CopilotPanel';
import type { CopilotUserContext } from '@/lib/copilotPrompt';

interface CopilotFABProps {
  userContext?: CopilotUserContext;
}

export function CopilotFAB({ userContext }: CopilotFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Pulse animation on first render
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Panel */}
      <CopilotPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userContext={userContext}
      />

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed bottom-4 right-4 z-997 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#1C4CA1] to-[#1164BE] text-white shadow-xl border border-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 sm:right-6 sm:bottom-6 ${
          isOpen ? 'rotate-0 scale-90 opacity-0 pointer-events-none' : 'rotate-0 scale-100 opacity-100'
        } ${!hasAnimated ? 'copilot-fab-pulse' : ''}`}
        aria-label={isOpen ? 'Close copilot' : 'Open StatVidya Copilot'}
        title="StatVidya Copilot"
      >
        <Sparkles className="h-6 w-6 text-[#FFA72F]" />

        {/* Notification dot on first visit */}
        {!hasAnimated && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[--color-primary-light] opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-primary" />
          </span>
        )}
      </button>
    </>
  );
}

