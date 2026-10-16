import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from './Hero';
import { siteConfig } from '@/config/site';

describe('Hero Component', () => {
  it('renders section with id="beranda" and scroll-margin classes to prevent header occlusion', () => {
    const { container } = render(<Hero />);
    const section = container.querySelector('section#beranda');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('scroll-mt-16');
    expect(section).toHaveClass('md:scroll-mt-20');
  });

  it('renders eyebrow text matching PRD specifications', () => {
    render(<Hero />);
    expect(screen.getByText(siteConfig.hero.eyebrow)).toBeInTheDocument();
  });

  it('renders main headline as an h1 heading', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(siteConfig.hero.headline);
  });

  it('renders description text verbatim from PRD 8.2', () => {
    render(<Hero />);
    expect(screen.getByText(siteConfig.hero.description)).toBeInTheDocument();
  });

  it('renders mandatory tagline verbatim placed between description and CTAs', () => {
    const { container } = render(<Hero />);
    const taglineElement = screen.getByText(new RegExp(siteConfig.hero.tagline, 'i'));
    expect(taglineElement).toBeInTheDocument();

    // Verify ordering: Description appears before Tagline, and Tagline before CTAs
    const heroText = container.textContent || '';
    const descIndex = heroText.indexOf(siteConfig.hero.description);
    const taglineIndex = heroText.indexOf(siteConfig.hero.tagline);
    const ctaIndex = heroText.indexOf(siteConfig.hero.primaryCta);

    expect(descIndex).toBeGreaterThan(-1);
    expect(taglineIndex).toBeGreaterThan(descIndex);
    expect(ctaIndex).toBeGreaterThan(taglineIndex);
  });

  it('renders primary CTA (Konsultasi Gratis) and secondary CTA (Lihat Contoh Solusi)', () => {
    render(<Hero />);
    const primaryCta = screen.getByRole('link', { name: new RegExp(siteConfig.hero.primaryCta, 'i') });
    expect(primaryCta).toBeInTheDocument();

    const secondaryCta = screen.getByRole('link', { name: new RegExp(siteConfig.hero.secondaryCta, 'i') });
    expect(secondaryCta).toBeInTheDocument();
    expect(secondaryCta).toHaveAttribute('href', '#contoh-solusi');
  });

  it('renders right column preview cards for Ruang Konveksi and Rental Mobil with badges', () => {
    render(<Hero />);
    expect(screen.getByText('Ruang Konveksi')).toBeInTheDocument();
    expect(screen.getByText('Rental Mobil')).toBeInTheDocument();

    const badges = screen.getAllByText('DEMO INTERAKTIF');
    expect(badges.length).toBeGreaterThanOrEqual(2);

    expect(screen.getByAltText(/Preview Ruang Konveksi/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Preview Rental Mobil/i)).toBeInTheDocument();
  });
});

