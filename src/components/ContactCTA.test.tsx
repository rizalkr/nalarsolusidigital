import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContactCTA } from './ContactCTA';
import { siteConfig } from '@/config/site';
import * as whatsappModule from '@/lib/whatsapp';

describe('ContactCTA Component', () => {
  it('renders section title as an h2 heading matching siteConfig', () => {
    render(<ContactCTA />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(siteConfig.closingCta.title);
  });

  it('renders description verbatim from PRD Section 8.7', () => {
    render(<ContactCTA />);
    expect(screen.getByText(siteConfig.closingCta.description)).toBeInTheDocument();
  });

  it('renders CTA button with label "Konsultasi Gratis via WhatsApp"', () => {
    render(<ContactCTA />);
    const ctaLink = screen.getByRole('link', {
      name: new RegExp(siteConfig.closingCta.ctaLabel, 'i'),
    });
    expect(ctaLink).toBeInTheDocument();
  });

  it('falls back safely when WhatsApp is unconfigured', () => {
    const spy = vi.spyOn(whatsappModule, 'buildWhatsAppUrl').mockReturnValue(null);
    render(<ContactCTA />);
    const ctaLink = screen.getByRole('link', {
      name: new RegExp(siteConfig.closingCta.ctaLabel, 'i'),
    });
    const href = ctaLink.getAttribute('href');
    expect(href).toMatch(/^(#tentang|mailto:)/);
    spy.mockRestore();
  });

  it('uses Navy background (bg-brand-primary) and Teal accents (bg-brand-accent)', () => {
    const { container } = render(<ContactCTA />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-brand-primary');

    const ctaLink = screen.getByRole('link', {
      name: new RegExp(siteConfig.closingCta.ctaLabel, 'i'),
    });
    expect(ctaLink).toHaveClass('bg-brand-accent');
  });

  it('does not repeat the mandatory tagline from the Hero section', () => {
    const { container } = render(<ContactCTA />);
    const text = container.textContent || '';
    expect(text).not.toContain(siteConfig.tagline);
  });

  it('renders external WhatsApp link with secure target and rel attributes when WhatsApp is configured', () => {
    const spy = vi
      .spyOn(whatsappModule, 'buildWhatsAppUrl')
      .mockReturnValue('https://wa.me/6281234567890?text=Halo%20Nalar%20Solusi%20Digital');

    render(<ContactCTA />);
    const ctaLink = screen.getByRole('link', {
      name: new RegExp(siteConfig.closingCta.ctaLabel, 'i'),
    });

    expect(ctaLink).toHaveAttribute(
      'href',
      'https://wa.me/6281234567890?text=Halo%20Nalar%20Solusi%20Digital'
    );
    expect(ctaLink).toHaveAttribute('target', '_blank');
    expect(ctaLink).toHaveAttribute('rel', 'noopener noreferrer');

    spy.mockRestore();
  });

  it('contains zero emoticons or emojis in the rendered markup', () => {
    const { container } = render(<ContactCTA />);
    const text = container.textContent || '';
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
    expect(emojiRegex.test(text)).toBe(false);
  });
});
