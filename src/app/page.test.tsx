import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from './page';
import { siteConfig } from '@/config/site';

describe('HomePage (Full Narrative Composition)', () => {
  it('renders all sections in single page narrative order', () => {
    const { container } = render(<HomePage />);

    // Header: Navbar
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();

    // Section 1: Hero (#beranda)
    const heroSection = container.querySelector('section#beranda');
    expect(heroSection).toBeInTheDocument();

    // Section 2: Services (#layanan)
    const servicesSection = container.querySelector('section#layanan');
    expect(servicesSection).toBeInTheDocument();

    // Section 3: Demo Showcase (#demo)
    const demoSection = container.querySelector('section#demo');
    expect(demoSection).toBeInTheDocument();

    // Section 4: How It Works (#cara-kerja)
    const howItWorksSection = container.querySelector('section#cara-kerja');
    expect(howItWorksSection).toBeInTheDocument();

    // Section 5: Approach (#tentang)
    const approachSection = container.querySelector('section#tentang');
    expect(approachSection).toBeInTheDocument();

    // Section 6: Closing CTA
    const ctaHeading = screen.getByRole('heading', {
      level: 2,
      name: siteConfig.closingCta.title,
    });
    expect(ctaHeading).toBeInTheDocument();

    // Footer
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();

    // Verify DOM sequence: Header -> Hero -> Services -> Demos -> HowItWorks -> Approach -> CTA -> Footer
    const sections = Array.from(container.querySelectorAll('header, section, footer'));
    const tagNames = sections.map((el) => {
      if (el.tagName.toLowerCase() === 'header') return 'header';
      if (el.tagName.toLowerCase() === 'footer') return 'footer';
      return el.id ? `section#${el.id}` : 'section[cta]';
    });

    expect(tagNames).toEqual([
      'header',
      'section#beranda',
      'section#layanan',
      'section#demo',
      'section#cara-kerja',
      'section#tentang',
      'section[cta]',
      'footer',
    ]);
  });

  it('maintains strict semantic heading hierarchy', () => {
    render(<HomePage />);

    // Single h1 in Hero
    const h1Headings = screen.getAllByRole('heading', { level: 1 });
    expect(h1Headings).toHaveLength(1);
    expect(h1Headings[0]).toHaveTextContent(siteConfig.hero.headline);

    // Section h2 headings across the full page
    const h2Headings = screen.getAllByRole('heading', { level: 2 });
    expect(h2Headings.length).toBe(5);
    expect(h2Headings[0]).toHaveTextContent('Solusi Digital Sesuai Kebutuhan Usaha Anda');
    expect(h2Headings[1]).toHaveTextContent('Jelajahi Demo Interaktif');
    expect(h2Headings[2]).toHaveTextContent(siteConfig.howItWorks.title);
    expect(h2Headings[3]).toHaveTextContent(siteConfig.approach.title);
    expect(h2Headings[4]).toHaveTextContent(siteConfig.closingCta.title);
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

  it('provides h3 headings for all service cards, demo cards, steps, and principles', () => {
    render(<HomePage />);

    const h3Headings = screen.getAllByRole('heading', { level: 3 });
    // Services (4) + Demos (2) + HowItWorks (3) + Approach (3) = 12 h3 headings
    expect(h3Headings).toHaveLength(12);

    const h3Texts = h3Headings.map((h) => h.textContent);
    // Services
    siteConfig.services.forEach((s) => {
      expect(h3Texts).toContain(s.title);
    });
    // Demos
    siteConfig.demos.forEach((d) => {
      expect(h3Texts).toContain(d.title);
    });
    // HowItWorks
    siteConfig.howItWorks.steps.forEach((step) => {
      expect(h3Texts).toContain(`Langkah ${step.step}: ${step.title}`);
    });
    // Approach
    siteConfig.approach.principles.forEach((p) => {
      expect(h3Texts).toContain(p.title);
    });
  });

  it('ensures all interactive elements have visible focus ring classes', () => {
    const { container } = render(<HomePage />);

    const interactiveElements = Array.from(
      container.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    );

    expect(interactiveElements.length).toBeGreaterThan(0);

    interactiveElements.forEach((el) => {
      const className = el.getAttribute('class') || '';
      expect(className).toMatch(/focus-visible:outline-brand-accent/);
    });
  });

  it('ensures all rendered images include non-empty descriptive alt text', () => {
    const { container } = render(<HomePage />);

    const images = Array.from(container.querySelectorAll<HTMLImageElement>('img'));
    expect(images.length).toBeGreaterThan(0);

    images.forEach((img) => {
      const alt = img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.trim().length).toBeGreaterThan(0);
    });
  });

  it('ensures all external links specify target="_blank" and rel="noopener noreferrer"', () => {
    const originalDemoUrl = siteConfig.demos[0].url;
    const originalWaNumber = siteConfig.contact.whatsapp.number;
    const originalWaConfigured = siteConfig.contact.whatsapp.isConfigured;

    try {
      siteConfig.demos[0].url = 'https://konveksi.example.com';
      siteConfig.contact.whatsapp.number = '6281234567890';
      siteConfig.contact.whatsapp.isConfigured = true;

      const { container } = render(<HomePage />);

      const links = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href]'));
      const externalLinks = links.filter((link) => {
        const href = link.getAttribute('href') || '';
        return href.startsWith('http://') || href.startsWith('https://');
      });

      externalLinks.forEach((link) => {
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toContain('noopener');
        expect(link.getAttribute('rel')).toContain('noreferrer');
      });
    } finally {
      siteConfig.demos[0].url = originalDemoUrl;
      siteConfig.contact.whatsapp.number = originalWaNumber;
      siteConfig.contact.whatsapp.isConfigured = originalWaConfigured;
    }
  });

  it('verifies responsive container constraints and horizontal padding to prevent overflow down to 360px', () => {
    const { container } = render(<HomePage />);

    // Section root elements or their direct container wrappers must enforce horizontal padding (px-4)
    const sectionContainers = container.querySelectorAll(
      'header > div, section > div, footer > div'
    );

    expect(sectionContainers.length).toBeGreaterThanOrEqual(7);

    sectionContainers.forEach((el) => {
      const className = el.getAttribute('class') || '';
      expect(className).toMatch(/px-4/);
      expect(className).toMatch(/mx-auto/);
    });

    // Hero section must explicitly have overflow-hidden
    const heroSection = container.querySelector('section#beranda');
    expect(heroSection).toHaveClass('overflow-hidden');
  });

  it('validates WCAG AA color contrast compliance (>= 4.5:1 for normal text, >= 3:1 for large text)', () => {
    function getLuminance(hex: string): number {
      const rgb = hex.replace('#', '').match(/.{2}/g)!.map((x) => parseInt(x, 16) / 255);
      const a = rgb.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function getContrast(hex1: string, hex2: string): number {
      const l1 = getLuminance(hex1);
      const l2 = getLuminance(hex2);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }

    // Normal text pairs (must be >= 4.5:1)
    const normalTextPairs = [
      { name: 'Ink on White', fg: '#202938', bg: '#FFFFFF' },
      { name: 'Ink on Surface Gray', fg: '#202938', bg: '#F7F8FA' },
      { name: 'Slate on White', fg: '#596575', bg: '#FFFFFF' },
      { name: 'Slate on Surface Gray', fg: '#596575', bg: '#F7F8FA' },
      { name: 'Deep Teal Eyebrow on Accent Surface', fg: '#066F6A', bg: '#E7F7F5' },
      { name: 'Deep Teal on White', fg: '#066F6A', bg: '#FFFFFF' },
      { name: 'Navy Button Text on Teal CTA', fg: '#1E2B4B', bg: '#1AA99E' },
      { name: 'White Text on Navy CTA Banner', fg: '#FFFFFF', bg: '#1E2B4B' },
    ];

    normalTextPairs.forEach(({ name, fg, bg }) => {
      const ratio = getContrast(fg, bg);
      expect(
        ratio,
        `Expected ${name} (${fg} on ${bg}) to satisfy WCAG AA >= 4.5:1, got ${ratio.toFixed(2)}:1`
      ).toBeGreaterThanOrEqual(4.5);
    });
  });

});

