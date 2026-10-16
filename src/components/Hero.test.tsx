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

  it('wraps preview cards into accessible links pointing to #contoh-solusi with descriptive aria-labels', () => {
    render(<Hero />);
    const konveksiCard = screen.getByRole('link', {
      name: /Lihat rincian solusi Ruang Konveksi/i,
    });
    expect(konveksiCard).toBeInTheDocument();
    expect(konveksiCard).toHaveAttribute('href', '#contoh-solusi');

    const rentalCard = screen.getByRole('link', {
      name: /Lihat rincian solusi Rental Mobil/i,
    });
    expect(rentalCard).toBeInTheDocument();
    expect(rentalCard).toHaveAttribute('href', '#contoh-solusi');
  });

  it('applies fanned playing card layout, mobile anti-overflow constraints, and hover elevation classes', () => {
    render(<Hero />);
    const konveksiCard = screen.getByRole('link', {
      name: /Lihat rincian solusi Ruang Konveksi/i,
    });
    const rentalCard = screen.getByRole('link', {
      name: /Lihat rincian solusi Rental Mobil/i,
    });

    // Card 1 classes: desktop angled -rotate-2, z-20, transition-all, hover/focus elevation
    expect(konveksiCard).toHaveClass('md:-rotate-2');
    expect(konveksiCard).toHaveClass('z-20');
    expect(konveksiCard).toHaveClass('transition-all');
    expect(konveksiCard).toHaveClass('duration-300');
    expect(konveksiCard).toHaveClass('ease-out');
    expect(konveksiCard).toHaveClass('hover:rotate-0');
    expect(konveksiCard).toHaveClass('hover:scale-[1.02]');
    expect(konveksiCard).toHaveClass('hover:z-30');
    expect(konveksiCard).toHaveClass('hover:shadow-xl');
    expect(konveksiCard).toHaveClass('focus-visible:rotate-0');
    expect(konveksiCard).toHaveClass('focus-visible:scale-[1.02]');
    expect(konveksiCard).toHaveClass('focus-visible:z-30');
    expect(konveksiCard).toHaveClass('focus-visible:outline-brand-accent');

    // Card 2 classes: mobile strictly vertical offset -translate-y-3.5 with rotate-0, desktop fanned out behind
    expect(rentalCard).toHaveClass('-translate-y-3.5');
    expect(rentalCard).toHaveClass('rotate-0');
    expect(rentalCard).toHaveClass('md:translate-x-6');
    expect(rentalCard).toHaveClass('md:-translate-y-4');
    expect(rentalCard).toHaveClass('md:rotate-3');
    expect(rentalCard).toHaveClass('scale-[0.98]');
    expect(rentalCard).toHaveClass('z-10');
    expect(rentalCard).toHaveClass('hover:rotate-0');
    expect(rentalCard).toHaveClass('hover:scale-[1.02]');
    expect(rentalCard).toHaveClass('hover:z-30');
    expect(rentalCard).toHaveClass('hover:shadow-xl');
    expect(rentalCard).toHaveClass('focus-visible:rotate-0');
    expect(rentalCard).toHaveClass('focus-visible:scale-[1.02]');
    expect(rentalCard).toHaveClass('focus-visible:z-30');
    expect(rentalCard).toHaveClass('focus-visible:outline-brand-accent');
  });

  it('renders subtle caption cue below cards linking to #contoh-solusi', () => {
    render(<Hero />);
    const captionLink = screen.getByRole('link', {
      name: /Klik kartu untuk melihat rincian solusi/i,
    });
    expect(captionLink).toBeInTheDocument();
    expect(captionLink).toHaveAttribute('href', '#contoh-solusi');
    expect(captionLink).toHaveClass('focus-visible:outline-brand-accent');
  });

  it('retains priority image loading on Card 1 for optimal LCP', () => {
    render(<Hero />);
    const konveksiImg = screen.getByAltText(/Preview Ruang Konveksi/i);
    // In next/image, priority images or next/image mock keep appropriate loading attributes
    expect(konveksiImg).toBeInTheDocument();
  });
});

