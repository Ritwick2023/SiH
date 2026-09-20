'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { X, Send, Sparkles, Zap, RotateCcw, WifiOff, HelpCircle } from 'lucide-react';
import { CopilotMessage } from './CopilotMessage';
import { CopilotFaqBrowser } from './CopilotFaqBrowser';
import { VoiceInputButton } from '@/components/common/VoiceInputButton';
import type { CopilotUserContext } from '@/lib/copilotPrompt';
import { matchPreMadeFaq } from '@/data/copilotFaqResponses';

// ============================================================================
// TYPES
// ============================================================================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface CopilotPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userContext?: CopilotUserContext;
}

// ============================================================================
// QUICK ACTION CHIPS
// ============================================================================

const QUICK_ACTIONS_EN = [
  { label: '📊 My Readiness', prompt: 'What is my readiness index and how can I improve it?' },
  { label: '🎯 Skill Gaps', prompt: 'Show me my top competency gaps and what to do about them' },
  { label: '📝 Take Assessment', prompt: 'What tests and assignments are available?' },
  { label: '🧠 Practice MCQs', prompt: 'How does the MCQ Generator work?' },
  { label: '📄 MoSPI Manuals', prompt: 'Where can I find MoSPI manuals and documents?' },
  { label: '🛤️ Recommend Courses', prompt: 'Recommend iGOT courses for my skill gaps' },
  { label: '🏛️ FRAC Levels', prompt: 'Explain the FRAC competency levels L1 to L5' },
  { label: '🧭 Platform Guide', prompt: 'Give me a quick overview of all platform features' },
];

const QUICK_ACTIONS_HI = [
  { label: '📊 मेरी तैयारी', prompt: 'What is my readiness index and how can I improve it?' },
  { label: '🎯 कौशल अंतर', prompt: 'Show me my top competency gaps and what to do about them' },
  { label: '📝 टेस्ट दें', prompt: 'What tests and assignments are available?' },
  { label: '🧠 अभ्यास MCQ', prompt: 'How does the MCQ Generator work?' },
  { label: '📄 सर्वेक्षण नियमावली', prompt: 'Where can I find MoSPI manuals and documents?' },
  { label: '🛤️ अनुशंसित कोर्स', prompt: 'Recommend iGOT courses for my skill gaps' },
  { label: '🏛️ FRAC स्तर', prompt: 'Explain the FRAC competency levels L1 to L5' },
  { label: '🧭 मंच का परिचय', prompt: 'Give me a quick overview of all platform features' },
];

// ============================================================================
// COMPONENT
// ============================================================================

function getWelcomeMessage(userContext?: CopilotUserContext): Message {
  const isHi = userContext?.preferredLanguage === 'hi';
  let greeting: string;

  if (isHi) {
    greeting = userContext?.name
      ? `🙏 नमस्ते, **${userContext.name}**! मैं आपका स्टैटविद्या कोपायलट हूँ।\n\n${userContext.cadre || 'आधिकारिक सांख्यिकी प्रणाली'} में एक **${userContext.designation || userContext.role || 'शिक्षार्थी'}** के रूप में, मैं आपको प्लेटफ़ॉर्म नेविगेट करने, अपने योग्यता अंतराल को समझने और उपयुक्त iGOT पाठ्यक्रम खोजने में मदद कर सकता हूँ।\n\nआप क्या खोजना चाहेंगे?`
      : `🙏 **नमस्ते!** मैं आपका स्टैटविद्या कोपायलट हूँ।\n\nमैं आपकी FRAC योग्यता ट्रैकिंग, iGOT अध्ययन पथ और मंच नेविगेशन में मदद कर सकता हूँ।\n\nआप क्या खोजना चाहेंगे?`;
  } else {
    greeting = userContext?.name
      ? `🙏 Namaste, **${userContext.name}**! I'm your StatVidya Copilot.\n\nAs a **${userContext.designation || userContext.role || 'learner'}** in ${userContext.cadre || 'the Official Statistical System'}, I can help you navigate the platform, understand your competency gaps, and find relevant iGOT courses.\n\nWhat would you like to explore?`
      : `🙏 **Namaste!** I'm your StatVidya Copilot.\n\nI can help you with FRAC competency tracking, iGOT learning pathways, and platform navigation.\n\nWhat would you like to explore?`;
  }

  return {
    id: 'welcome',
    role: 'assistant',
    content: greeting,
    timestamp: new Date(1730000000000),
  };
}

export function CopilotPanel({ isOpen, onClose, userContext }: CopilotPanelProps) {
  const isHindi = userContext?.preferredLanguage === 'hi';
  const quickActions = isHindi ? QUICK_ACTIONS_HI : QUICK_ACTIONS_EN;
  const [messages, setMessages] = useState<Message[]>(() => [getWelcomeMessage(userContext)]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [isOffline, setIsOffline] = useState(() =>
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );
  const msgCounterRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Dynamic welcome message based on active language if conversation is not started yet
  const effectiveMessages = useMemo(() => {
    if (messages.length === 1 && messages[0].id === 'welcome') {
      return [getWelcomeMessage(userContext)];
    }
    return messages;
  }, [messages, userContext]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [effectiveMessages, scrollToBottom]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Keyboard: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Online/offline detection – reads initial state from browser Navigator API (external system)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOffline(typeof navigator !== 'undefined' ? !navigator.onLine : false);
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // ─── Send Message ───
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    msgCounterRef.current += 1;
    const userMsg: Message = {
      id: `user-${msgCounterRef.current}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    msgCounterRef.current += 1;
    const assistantId = `assistant-${msgCounterRef.current}`;
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // ─── Ultra-Fast Curated FAQs & Suggestions (instant delivery) ───
      const preMadeResponse = matchPreMadeFaq(text, userContext);
      if (preMadeResponse) {
        // Minimal delay for natural feel, then render entire response at once
        await new Promise((resolve) => setTimeout(resolve, 80));

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: preMadeResponse, isStreaming: false }
              : m
          )
        );
        setIsLoading(false);
        return;
      }

      // Build conversation history (last 4 messages for fastest prompt processing)
      const history = [...effectiveMessages, userMsg]
        .filter((m) => m.id !== 'welcome')
        .slice(-4)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          userContext,
        }),
      });

      if (!response.ok) throw new Error('API error');

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('text/event-stream')) {
        // ─── High-Performance Stream Renderer ───
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader');

        const decoder = new TextDecoder();
        let buffer = '';
        let accumulated = '';
        let renderPending = false;

        const scheduleRender = () => {
          if (renderPending) return;
          renderPending = true;
          requestAnimationFrame(() => {
            renderPending = false;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: accumulated, isStreaming: true }
                  : m
              )
            );
          });
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;

            const data = trimmed.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulated += parsed.content;
                scheduleRender();
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }

        // Finalize
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: accumulated, isStreaming: false } : m
          )
        );
      } else {
        // ─── JSON (fallback) Response ───
        const data = await response.json();
        const content = data.message?.content || data.content || 'I couldn\'t process that. Try rephrasing your question.';

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content, isStreaming: false }
              : m
          )
        );
      }
    } catch {
      // Error fallback
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: '⚠️ I\'m having trouble connecting right now. You can still navigate using the sidebar, or try again in a moment.',
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
  };

  const clearChat = () => {
    setMessages([getWelcomeMessage(userContext)]);
  };

  const handleFaqSelect = (prompt: string) => {
    setShowFaq(false);
    sendMessage(prompt);
  };

  if (!isOpen) return null;

  const showQuickActions = effectiveMessages.length <= 1 && !showFaq;

  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        className="fixed inset-0 z-998 bg-black/20 backdrop-blur-xs sm:hidden"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="StatVidya Copilot"
        className="fixed bottom-20 right-4 z-999 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:right-6 sm:bottom-24"
        style={{
          width: 'min(400px, calc(100vw - 2rem))',
          height: 'min(560px, calc(100vh - 10rem))',
          animation: 'copilot-panel-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between bg-[#1F273A] border-b border-[#2C3B59] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/15">
              <Sparkles className="h-4 w-4 text-[#FFA72F]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">
                StatVidya Copilot
              </h2>
              <p className="text-[10px] text-white/70 font-medium">
                {isOffline ? '⚡ Offline Mode' : '● AI-Powered Assistant'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowFaq((p) => !p)}
              className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                showFaq
                  ? 'bg-white/25 text-white'
                  : 'text-white/70 hover:bg-white/15 hover:text-white'
              }`}
              title={showFaq ? (isHindi ? 'चैट पर लौटें' : 'Back to Chat') : (isHindi ? 'FAQ ज्ञान आधार' : 'FAQ Knowledge Base')}
            >
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
            {effectiveMessages.length > 1 && (
              <button
                onClick={clearChat}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 hover:bg-white/15 hover:text-white transition-colors"
                title="Clear chat"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 hover:bg-white/15 hover:text-white transition-colors"
              title="Close (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ─── Offline Banner ─── */}
        {isOffline && (
          <div className="flex items-center gap-2 bg-[#FFA72F]/15 px-3 py-1.5 text-[11px] text-amber-800">
            <WifiOff className="h-3 w-3 shrink-0" />
            <span>Offline — using built-in navigation assistance</span>
          </div>
        )}

        {/* ─── FAQ Browser OR Messages ─── */}
        {showFaq ? (
          <CopilotFaqBrowser isHindi={isHindi} onSelectQuestion={handleFaqSelect} />
        ) : (
          <>
            {/* ─── Messages ─── */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3" id="copilot-messages">
              {effectiveMessages.map((msg) => (
                <CopilotMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  isStreaming={msg.isStreaming}
                  timestamp={msg.timestamp}
                />
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* ─── Quick Actions ─── */}
            {showQuickActions && (
              <div className="px-3 py-2 bg-[#EDF0F7]/60 border-t border-[#D8DFEE]">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3 text-[#FFA72F]" /> {isHindi ? 'त्वरित विकल्प' : 'Quick Actions'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.prompt)}
                      disabled={isLoading}
                      className="rounded-full bg-white border border-[#D8DFEE] px-2.5 py-1 text-[11px] font-medium text-[#1F273A] transition-all hover:bg-[#1C4CA1] hover:text-white hover:shadow-xs active:scale-95 disabled:opacity-50"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ─── Input ─── */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 bg-[#EDF0F7] border-t border-[#D8DFEE] px-3 py-2.5"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isHindi
                ? 'FRAC, अध्ययन पथ, या नेविगेशन के बारे में पूछें...'
                : 'Ask about FRAC, pathways, navigation...'
            }
            disabled={isLoading}
            className="flex-1 rounded-xl bg-white border border-[#D8DFEE] px-3 py-2 text-[13px] text-[#1F273A] placeholder:text-stone-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#1C4CA1]/30 disabled:opacity-50"
            style={{ minHeight: '36px' }}
          />
          <VoiceInputButton
            size="sm"
            lang={isHindi ? 'hi' : 'en'}
            onTranscript={(transcript) => {
              setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1C4CA1] text-white shadow-sm transition-all hover:bg-[#153A7A] hover:shadow-md active:scale-95 disabled:opacity-40 disabled:hover:bg-[#1C4CA1] disabled:hover:shadow-sm"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}
