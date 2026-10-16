import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from './page';
import { siteConfig } from '@/config/site';

describe('HomePage (Phase 2 Composition)', () => {
  it('renders all 4 Phase 2 components (Navbar, Hero, Services, DemoShowcase)', () => {
    const { container } = render(<HomePage />);

    // Navbar header
    expect(container.querySelector('header')).toBeInTheDocument();

    // Section 1: Hero (#beranda)
    expect(container.querySelector('section#beranda')).toBeInTheDocument();

    // Section 2: Services (#layanan)
    expect(container.querySelector('section#layanan')).toBeInTheDocument();

    // Section 3: Demo Showcase (#contoh-solusi)
    expect(container.querySelector('section#contoh-solusi')).toBeInTheDocument();
  });

  it('maintains strict semantic heading hierarchy', () => {
    render(<HomePage />);

    // Single h1 in Hero
    const h1Headings = screen.getAllByRole('heading', { level: 1 });
    expect(h1Headings).toHaveLength(1);
    expect(h1Headings[0]).toHaveTextContent(siteConfig.hero.headline);

    // Section h2 headings
    const h2Headings = screen.getAllByRole('heading', { level: 2 });
    expect(h2Headings.length).toBeGreaterThanOrEqual(2);
    expect(h2Headings[0]).toHaveTextContent('Solusi Digital Sesuai Kebutuhan Usaha Anda');
    expect(h2Headings[1]).toHaveTextContent('Lihat Contoh Solusi Digital');
  });

  it('renders the mandatory tagline verbatim in the Hero section', () => {
    render(<HomePage />);
    expect(
      screen.getByText(new RegExp(siteConfig.hero.tagline, 'i'))
    ).toBeInTheDocument();
  });

  it('contains zero emoticons or emojis in the rendered markup', () => {
    const { container } = render(<HomePage />);
    const pageText = container.textContent || '';

    // Regex matching emoji and common emoticon unicode ranges
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
    expect(emojiRegex.test(pageText)).toBe(false);
  });

  it('does not contain out-of-scope Phase 3 components yet', () => {
    const { container } = render(<HomePage />);

    // Phase 3 components should not be present
    expect(container.querySelector('section#cara-kerja')).not.toBeInTheDocument();
    expect(container.querySelector('section#tentang')).not.toBeInTheDocument();
    expect(container.querySelector('footer')).not.toBeInTheDocument();
  });
});
