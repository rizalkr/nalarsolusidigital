import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Faq } from './Faq';
import { siteConfig } from '@/config/site';

describe('Faq Component', () => {
  it('renders section landmark with proper id and accessible labelling', () => {
    const { container } = render(<Faq />);
    const section = container.querySelector('section#faq');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('aria-labelledby', 'faq-heading');

    const heading = screen.getByRole('heading', { level: 2, name: siteConfig.faq.title });
    expect(heading).toBeInTheDocument();
  });

  it('renders all 6 questions with appropriate button controls', () => {
    render(<Faq />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(6);

    siteConfig.faq.items.forEach((item, index) => {
      expect(screen.getByText(item.question)).toBeInTheDocument();
      const button = buttons[index];
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-controls', `faq-answer-${item.id}`);
    });
  });

  it('implements single-open accordion behavior when clicking items', () => {
    render(<Faq />);
    const buttons = screen.getAllByRole('button');

    // Initially, answers are hidden
    const firstAnswer = screen.getByText(siteConfig.faq.items[0].answer);
    expect(firstAnswer.closest('div[role="region"]')).toHaveAttribute('hidden');

    // Click item 1 -> opens item 1
    fireEvent.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
    expect(firstAnswer.closest('div[role="region"]')).not.toHaveAttribute('hidden');

    // Click item 2 -> opens item 2, automatically closes item 1 (single-open)
    const secondAnswer = screen.getByText(siteConfig.faq.items[1].answer);
    fireEvent.click(buttons[1]);
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'true');
    expect(firstAnswer.closest('div[role="region"]')).toHaveAttribute('hidden');
    expect(secondAnswer.closest('div[role="region"]')).not.toHaveAttribute('hidden');

    // Click item 2 again -> toggles closed
    fireEvent.click(buttons[1]);
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'false');
    expect(secondAnswer.closest('div[role="region"]')).toHaveAttribute('hidden');
  });

  it('renders valid FAQPage JSON-LD schema with all 6 Q&A pairs', () => {
    const { container } = render(<Faq />);
    const scriptTag = container.querySelector('script[type="application/ld+json"]');
    expect(scriptTag).toBeInTheDocument();

    const parsedJsonLd = JSON.parse(scriptTag!.textContent || '{}');
    expect(parsedJsonLd['@context']).toBe('https://schema.org');
    expect(parsedJsonLd['@type']).toBe('FAQPage');
    expect(parsedJsonLd.mainEntity).toHaveLength(6);
    expect(parsedJsonLd.mainEntity[0].name).toBe(siteConfig.faq.items[0].question);
    expect(parsedJsonLd.mainEntity[0].acceptedAnswer.text).toBe(siteConfig.faq.items[0].answer);
  });
});

