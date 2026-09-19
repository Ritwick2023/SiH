'use client';

import { memo } from 'react';
import { Bot, User, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface CopilotMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  timestamp?: Date;
}

function renderRouteLink(route: string, key: string) {
  return (
    <Link
      key={key}
      href={route}
      className="inline-flex items-center gap-0.5 rounded-md bg-[--color-primary]/15 border border-[--color-primary]/30 px-1.5 py-0.5 text-[11px] font-mono font-semibold text-[#555934] hover:bg-[#555934] hover:text-white transition-all shadow-2xs mx-0.5"
    >
      {route}
      <ArrowUpRight className="h-3 w-3 opacity-70" />
    </Link>
  );
}

function renderPlainTextWithItalics(text: string, keyPrefix: string) {
  const italicSegments = text.split(/(\*[^*]+?\*)/g);
  if (italicSegments.length > 1) {
    return (
      <span key={keyPrefix}>
        {italicSegments.map((seg, i) => {
          if (seg.startsWith('*') && seg.endsWith('*') && seg.length > 2) {
            return (
              <em key={`${keyPrefix}-it-${i}`} className="italic">
                {seg.slice(1, -1)}
              </em>
            );
          }
          return <span key={`${keyPrefix}-tx-${i}`}>{seg}</span>;
        })}
      </span>
    );
  }
  return <span key={keyPrefix}>{text}</span>;
}

/**
 * Render inline text elements: bold, italic, code, route links, and priority badges.
 * Prevents raw or orphan '**' from ever leaking into the UI.
 */
function renderInlineContent(text: string) {
  // Normalize bold route paths like **/dashboard** into route pills
  const normalized = text.replace(/\*\*(\/[a-zA-Z0-9\-_/]+)\*\*/g, '`$1`');

  // Tokenize by bold, backtick code, or priority badges
  const tokenRegex = /(\*\*[^*]+?\*\*|`[^`]+?`|\((?:Critical|Important|Desirable)(?:\s+gap)?\))/gi;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
      // Plain text segment before token: strip any orphan/stray **
      const plain = normalized.slice(lastIndex, match.index).replace(/\*\*/g, '');
      if (plain) {
        elements.push(renderPlainTextWithItalics(plain, `plain-${lastIndex}`));
      }
    }

    const token = match[0];
    const key = `token-${match.index}`;

    // Bold
    if (token.startsWith('**') && token.endsWith('**')) {
      const boldContent = token.slice(2, -2).trim();
      if (boldContent.startsWith('/') && !boldContent.includes(' ')) {
        elements.push(renderRouteLink(boldContent, key));
      } else {
        elements.push(
          <strong key={key} className="font-semibold text-[#2d1f17]">
            {boldContent}
          </strong>
        );
      }
    }
    // Code / Route pills
    else if (token.startsWith('`') && token.endsWith('`')) {
      const codeVal = token.slice(1, -1);
      if (codeVal.startsWith('/')) {
        elements.push(renderRouteLink(codeVal, key));
      } else {
        elements.push(
          <code
            key={key}
            className="rounded bg-[#E8DACB]/60 px-1.5 py-0.5 text-xs font-mono text-[#2d1f17]"
          >
            {codeVal}
          </code>
        );
      }
    }
    // Priority badges (Critical gap / Important gap / Desirable gap)
    else {
      const isCritical = /critical/i.test(token);
      const isImportant = /important/i.test(token);
      const label = isCritical ? 'Critical' : isImportant ? 'Important' : 'Desirable';

      elements.push(
        <span
          key={key}
          className={`ml-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
            isCritical
              ? 'bg-[#8C5B3E]/15 text-[#8C5B3E]'
              : isImportant
              ? 'bg-[#BF9B7A]/25 text-[#593E2E]'
              : 'bg-[#F2E6D8] text-[#2d1f17]'
          }`}
        >
          {label}
        </span>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  // Trailing segment: strip any trailing/unclosed ** (e.g. streaming or malformed)
  if (lastIndex < normalized.length) {
    const trailing = normalized.slice(lastIndex).replace(/\*\*/g, '');
    if (trailing) {
      elements.push(renderPlainTextWithItalics(trailing, `trailing-${lastIndex}`));
    }
  }

  return elements;
}

/**
 * Render structured message blocks (headings, lists, HR, paragraphs)
 */
function renderStructuredMessage(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="my-1.5 space-y-1.5 pl-0.5">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Horizontal Rule (--- or ***)
    if (/^(---|\*\*\*|___)$/.test(trimmed)) {
      flushList();
      elements.push(<hr key={`hr-${lineIdx}`} className="my-2 border-0 h-px bg-[#BF9B7A]/30" />);
      return;
    }

    // Headings (### Header, ## Header, # Header)
    if (/^#{1,4}\s+/.test(trimmed)) {
      flushList();
      const headerText = trimmed.replace(/^#{1,4}\s+/, '').replace(/^\*\*|\*\*$/g, '').trim();
      elements.push(
        <h4
          key={`h-${lineIdx}`}
          className="mt-3 mb-1 text-[11px] font-bold uppercase tracking-wider text-[#555934] flex items-center gap-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#555934]" />
          {renderInlineContent(headerText)}
        </h4>
      );
      return;
    }

    // Bullet list items (- Item, * Item, • Item)
    if (/^[-*•]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[-*•]\s+/, '');
      currentList.push(
        <li key={`li-${lineIdx}`} className="flex items-start gap-2 text-[13px] leading-relaxed">
          <span className="h-1.5 w-1.5 rounded-full bg-[#555934] shrink-0 mt-2" />
          <div className="flex-1">{renderInlineContent(itemText)}</div>
        </li>
      );
      return;
    }

    // Numbered list items (1. Item, 2. Item)
    if (/^\d+\.\s+/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (match) {
        const num = match[1];
        const itemText = match[2];
        currentList.push(
          <li key={`nli-${lineIdx}`} className="flex items-start gap-2 text-[13px] leading-relaxed">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#555934]/15 text-[10px] font-bold text-[#555934] shrink-0 mt-0.5">
              {num}
            </span>
            <div className="flex-1">{renderInlineContent(itemText)}</div>
          </li>
        );
        return;
      }
    }

    // Regular Paragraph
    flushList();
    elements.push(
      <p key={`p-${lineIdx}`} className="my-1 text-[13px] leading-relaxed text-[#2d1f17]">
        {renderInlineContent(trimmed)}
      </p>
    );
  });

  flushList();
  return elements;
}

function CopilotMessageInner({ role, content, timestamp }: CopilotMessageProps) {
  const isBot = role === 'assistant';

  return (
    <div
      className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
      style={{ animation: 'copilot-msg-in 0.25s ease-out' }}
    >
      {/* Bot Avatar */}
      {isBot && (
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#555934] shadow-xs">
          <Bot className="h-3.5 w-3.5 text-white" />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`group relative max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
          isBot
            ? 'rounded-tl-md bg-white text-[#2d1f17] shadow-xs'
            : 'rounded-tr-md bg-[#555934] text-white'
        }`}
      >
        {isBot ? (
          <div className="space-y-0.5">
            {!content.trim() ? (
              <div className="flex items-center gap-1.5 py-1 px-0.5">
                <span className="h-2 w-2 rounded-full bg-[#555934] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-[#555934] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-[#555934] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              renderStructuredMessage(content)
            )}
          </div>
        ) : (
          <div className="whitespace-pre-wrap break-words">{content}</div>
        )}

        {/* Hover Timestamp */}
        {timestamp && (
          <div className="absolute -bottom-4 left-1 hidden text-[10px] text-stone-400 group-hover:block">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isBot && (
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8DACB] shadow-xs">
          <User className="h-3.5 w-3.5 text-[#555934]" />
        </div>
      )}
    </div>
  );
}

export const CopilotMessage = memo(CopilotMessageInner);
