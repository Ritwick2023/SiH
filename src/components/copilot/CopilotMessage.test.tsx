import { describe, it, expect, beforeEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { CopilotMessage } from './CopilotMessage';

// @ts-expect-error - React act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('CopilotMessage Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  });

  it('renders bold markdown cleanly as strong tags without raw asterisks', async () => {
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <CopilotMessage
          role="assistant"
          content="This is **bold text** and **another item** in the message."
        />
      );
    });

    const strongs = container.querySelectorAll('strong');
    expect(strongs.length).toBe(2);
    expect(strongs[0].textContent).toBe('bold text');
    expect(strongs[1].textContent).toBe('another item');
    expect(container.textContent).not.toContain('**');
  });

  it('renders interactive route links from both backticks and bold paths without raw asterisks', async () => {
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <CopilotMessage
          role="assistant"
          content="Check your readiness on `/dashboard` and view gaps on **/skill-gap**."
        />
      );
    });

    const links = container.querySelectorAll('a');
    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe('/dashboard');
    expect(links[1].getAttribute('href')).toBe('/skill-gap');
    expect(container.textContent).not.toContain('**');
  });

  it('safely handles unclosed double asterisks during streaming without showing literal **', async () => {
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <CopilotMessage
          role="assistant"
          content="Generating response with **streaming text that is not closed"
        />
      );
    });

    expect(container.textContent).toContain('streaming text that is not closed');
    expect(container.textContent).not.toContain('**');
  });

  it('handles Hindi bold text without leaking asterisks', async () => {
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <CopilotMessage
          role="assistant"
          content="नमस्ते **अमित**! आपका **तैयारी सूचकांक** 80% है।"
        />
      );
    });

    const strongs = container.querySelectorAll('strong');
    expect(strongs.length).toBe(2);
    expect(strongs[0].textContent).toBe('अमित');
    expect(strongs[1].textContent).toBe('तैयारी सूचकांक');
    expect(container.textContent).not.toContain('**');
  });

  it('renders headings cleanly even if markdown bold syntax is present inside header', async () => {
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <CopilotMessage
          role="assistant"
          content="### **Executive Summary**\nDetails about the summary."
        />
      );
    });

    const header = container.querySelector('h4');
    expect(header).not.toBeNull();
    expect(header?.textContent).toContain('Executive Summary');
    expect(header?.textContent).not.toContain('**');
  });
});
