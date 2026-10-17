import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ContactCTA } from './ContactCTA';
import { ConsultationModal } from './ConsultationModal';
import { consultationModalStore } from '@/lib/consultationModalStore';
import { siteConfig } from '@/config/site';

describe('ContactCTA Component', () => {
  beforeEach(() => {
    consultationModalStore.reset();
  });

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
    const ctaButton = screen.getByRole('button', {
      name: new RegExp(siteConfig.closingCta.ctaLabel, 'i'),
    });
    expect(ctaButton).toBeInTheDocument();
  });

  it('triggers the consultation modal when CTA button is clicked', () => {
    render(
      <>
        <ContactCTA />
        <ConsultationModal />
      </>
    );

    const ctaButton = screen.getByRole('button', {
      name: new RegExp(siteConfig.closingCta.ctaLabel, 'i'),
    });
    fireEvent.click(ctaButton);

    expect(
      screen.getByRole('dialog', { name: /Mari Ceritakan Kebutuhan Usaha Anda/i })
    ).toBeInTheDocument();
  });

  it('uses Navy background (bg-brand-primary) and Teal accents (bg-brand-accent)', () => {
    const { container } = render(<ContactCTA />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-brand-primary');

    const ctaButton = screen.getByRole('button', {
      name: new RegExp(siteConfig.closingCta.ctaLabel, 'i'),
    });
    expect(ctaButton).toHaveClass('bg-brand-accent');
  });

  it('does not repeat the mandatory tagline from the Hero section', () => {
    const { container } = render(<ContactCTA />);
    const text = container.textContent || '';
    expect(text).not.toContain(siteConfig.tagline);
  });

  it('contains zero emoticons or emojis in the rendered markup', () => {
    const { container } = render(<ContactCTA />);
    const text = container.textContent || '';
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
    expect(emojiRegex.test(text)).toBe(false);
  });
});
