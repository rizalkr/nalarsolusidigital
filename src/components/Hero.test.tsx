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

  it('renders primary CTA (Konsultasi Gratis) and secondary CTA (Lihat Demo)', () => {
    render(<Hero />);
    const primaryCta = screen.getByRole('link', { name: new RegExp(siteConfig.hero.primaryCta, 'i') });
    expect(primaryCta).toBeInTheDocument();

    const secondaryCta = screen.getByRole('link', { name: new RegExp(siteConfig.hero.secondaryCta, 'i') });
    expect(secondaryCta).toBeInTheDocument();
    expect(secondaryCta).toHaveTextContent('Lihat Demo');
    expect(secondaryCta).toHaveAttribute('href', '#contoh-solusi');
  });

  it('renders the three informative floating cards in the hero visual', () => {
    render(<Hero />);
    expect(screen.getByText('Katalog Produk')).toBeInTheDocument();
    expect(screen.getByText('Produk tersusun rapi dan mudah dijelajahi.')).toBeInTheDocument();

    expect(screen.getByText('Alur Pemesanan')).toBeInTheDocument();
    expect(screen.getByText('Permintaan pelanggan lebih terstruktur.')).toBeInTheDocument();

    expect(screen.getByText('Email Bisnis')).toBeInTheDocument();
    expect(screen.getByText('Komunikasi dengan identitas usaha.')).toBeInTheDocument();
  });

  it('renders HeroVisual with aria-hidden="true" on the decorative browser mockup wrapper', () => {
    const { container } = render(<Hero />);
    const decorativeEl = container.querySelector('[aria-hidden="true"]');
    expect(decorativeEl).toBeInTheDocument();
  });

  it('does not render any demo screenshot images in the hero section', () => {
    render(<Hero />);
    expect(screen.queryByAltText(/Preview Ruang Konveksi/i)).not.toBeInTheDocument();
    expect(screen.queryByAltText(/Preview Rental Mobil/i)).not.toBeInTheDocument();
  });

  it('does not render business-specific names in the hero visual', () => {
    render(<Hero />);
    // The specific demo names should not appear in the hero's right-column visual
    // (they belong in DemoShowcase)
    const links = screen.getAllByRole('link');
    // Only the CTA links should be present, not card links to #contoh-solusi with demo names
    const demoNameLinks = links.filter(l =>
      l.getAttribute('aria-label')?.match(/Ruang Konveksi|Rental Mobil/)
    );
    expect(demoNameLinks).toHaveLength(0);
  });
});
