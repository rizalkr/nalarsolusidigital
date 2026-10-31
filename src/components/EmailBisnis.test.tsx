import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmailBisnis } from './EmailBisnis';
import { siteConfig } from '@/config/site';
import * as whatsappModule from '@/lib/whatsapp';

describe('EmailBisnis Component', () => {
  it('renders section landmark with proper id and accessible labelling', () => {
    const { container } = render(<EmailBisnis />);
    const section = container.querySelector('section#email-bisnis');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('aria-labelledby', 'email-bisnis-heading');

    const heading = screen.getByRole('heading', { level: 2, name: siteConfig.emailBusiness.title });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute('id', 'email-bisnis-heading');
  });

  it('renders badge, lead paragraph, and 3 benefits verbatim', () => {
    render(<EmailBisnis />);
    expect(screen.getByText(siteConfig.emailBusiness.badge)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.emailBusiness.lead)).toBeInTheDocument();

    siteConfig.emailBusiness.benefits.forEach((benefit) => {
      expect(screen.getByText(benefit.title)).toBeInTheDocument();
      expect(screen.getByText(benefit.description)).toBeInTheDocument();
    });
  });

  it('renders LPSE/SPSE mandatory tender notice verbatim', () => {
    render(<EmailBisnis />);
    expect(screen.getByText(siteConfig.emailBusiness.importantNotice.label)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.emailBusiness.importantNotice.description)).toBeInTheDocument();
  });

  it('renders closing text and WhatsApp CTA link when configured', () => {
    const spy = vi.spyOn(whatsappModule, 'buildWhatsAppUrl').mockReturnValue('https://wa.me/6281529964902?text=test');

    render(<EmailBisnis />);
    expect(screen.getByText(siteConfig.emailBusiness.closingText)).toBeInTheDocument();

    const ctaLink = screen.getByRole('link', { name: new RegExp(siteConfig.emailBusiness.ctaLabel, 'i') });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', 'https://wa.me/6281529964902?text=test');
    expect(ctaLink).toHaveAttribute('target', '_blank');

    spy.mockRestore();
  });

  it('renders fallback anchor to #kontak when WhatsApp URL cannot be generated', () => {
    const spy = vi.spyOn(whatsappModule, 'buildWhatsAppUrl').mockReturnValue(null);

    render(<EmailBisnis />);
    const ctaLink = screen.getByRole('link', { name: new RegExp(siteConfig.emailBusiness.ctaLabel, 'i') });
    expect(ctaLink).toHaveAttribute('href', '#kontak');

    spy.mockRestore();
  });
});

