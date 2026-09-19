import { describe, it, expect, beforeEach, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { CopilotFaqBrowser } from './CopilotFaqBrowser';
import { FAQ_CATEGORIES } from '@/data/copilotFaqCategories';

// @ts-expect-error - React act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('CopilotFaqBrowser Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  });

  it('renders all 12 categories with badges and header info', async () => {
    const onSelect = vi.fn();
    const root = createRoot(container);

    await act(async () => {
      root.render(<CopilotFaqBrowser isHindi={false} onSelectQuestion={onSelect} />);
    });

    // Check title
    expect(container.textContent).toContain('Knowledge Base');
    expect(container.textContent).toContain('54 instant answers');

    // Check that all 12 categories appear
    for (const cat of FAQ_CATEGORIES) {
      expect(container.textContent).toContain(cat.title);
    }
  });

  it('renders Hindi labels when isHindi is true', async () => {
    const onSelect = vi.fn();
    const root = createRoot(container);

    await act(async () => {
      root.render(<CopilotFaqBrowser isHindi={true} onSelectQuestion={onSelect} />);
    });

    expect(container.textContent).toContain('ज्ञान आधार');
    expect(container.textContent).toContain('मंच का अवलोकन');
    expect(container.textContent).toContain('डैशबोर्ड और तैयारी');
  });

  it('expands category on click and triggers onSelectQuestion on question click', async () => {
    const onSelect = vi.fn();
    const root = createRoot(container);

    await act(async () => {
      root.render(<CopilotFaqBrowser isHindi={false} onSelectQuestion={onSelect} />);
    });

    // Click the first category button to expand
    const buttons = container.querySelectorAll('button');
    const firstCatButton = buttons[0]; // Category button

    await act(async () => {
      firstCatButton.click();
    });

    // Find the question buttons inside the expanded category
    const questionButtons = container.querySelectorAll('button');
    // First question of first category is "What is StatVidya?"
    let whatIsStatVidyaBtn: HTMLButtonElement | null = null;
    questionButtons.forEach((btn) => {
      if (btn.textContent?.includes('What is StatVidya?')) {
        whatIsStatVidyaBtn = btn;
      }
    });

    expect(whatIsStatVidyaBtn).not.toBeNull();

    await act(async () => {
      whatIsStatVidyaBtn!.click();
    });

    expect(onSelect).toHaveBeenCalledWith('What is StatVidya?');
  });
});
