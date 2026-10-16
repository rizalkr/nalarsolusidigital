import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Approach } from './Approach';
import { siteConfig } from '@/config/site';

describe('Approach Component', () => {
  it('renders section with id="tentang" and scroll margin classes to prevent navbar occlusion', () => {
    const { container } = render(<Approach />);
    const section = container.querySelector('section#tentang');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('scroll-mt-16');
    expect(section).toHaveClass('md:scroll-mt-20');
  });

  it('renders section title as an h2 heading matching siteConfig', () => {
    render(<Approach />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(siteConfig.approach.title);
  });

  it('renders section description verbatim from PRD Section 8.6', () => {
    render(<Approach />);
    expect(screen.getByText(siteConfig.approach.description)).toBeInTheDocument();
  });

  it('renders all 3 guiding principles with h3 titles and descriptions', () => {
    render(<Approach />);

    // Principle 1: Pahami Kebutuhan
    expect(screen.getByRole('heading', { level: 3, name: 'Pahami Kebutuhan' })).toBeInTheDocument();
    expect(screen.getByText('Memulai dari masalah dan tujuan usaha.')).toBeInTheDocument();

    // Principle 2: Tentukan Prioritas
    expect(screen.getByRole('heading', { level: 3, name: 'Tentukan Prioritas' })).toBeInTheDocument();
    expect(screen.getByText(siteConfig.approach.principles[1].description)).toBeInTheDocument();

    // Principle 3: Kerjakan Sesuai Kesepakatan / Bangun Sesuai Kesepakatan
    expect(screen.getByRole('heading', { level: 3, name: siteConfig.approach.principles[2].title })).toBeInTheDocument();
    expect(screen.getByText(siteConfig.approach.principles[2].description)).toBeInTheDocument();
  });

  it('avoids generic marketing superlatives', () => {
    const { container } = render(<Approach />);
    const text = container.textContent || '';

    // Must not contain unbacked superlatives per PRD Section 8.6
    expect(text).not.toMatch(/paling murah/i);
    expect(text).not.toMatch(/terbaik di indonesia/i);
    expect(text).not.toMatch(/pasti meningkatkan penjualan/i);
  });

  it('contains zero emoticons or emojis in the rendered markup', () => {
    const { container } = render(<Approach />);
    const text = container.textContent || '';
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
    expect(emojiRegex.test(text)).toBe(false);
  });
});
