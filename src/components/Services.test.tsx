import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Services } from './Services';
import { siteConfig } from '@/config/site';
import * as whatsappModule from '@/lib/whatsapp';

describe('Services Component (Katalog Layanan Interaktif)', () => {
  it('renders section with id="layanan" and scroll-margin classes to prevent header occlusion', () => {
    const { container } = render(<Services />);
    const section = container.querySelector('section#layanan');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('scroll-mt-16');
    expect(section).toHaveClass('md:scroll-mt-20');
  });

  it('renders section badge, heading (h2), and description from layananSection', () => {
    render(<Services />);
    expect(screen.getByText(siteConfig.layananSection.badge)).toBeInTheDocument();
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(siteConfig.layananSection.title);
    expect(screen.getByText(siteConfig.layananSection.description)).toBeInTheDocument();
  });

  it('renders all 8 concrete layanan cards and 3 paket cards with h3 headings', () => {
    render(<Services />);

    // 8 Layanan cards
    siteConfig.layanan.forEach((item) => {
      expect(screen.getByRole('heading', { level: 3, name: item.title })).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
    });

    // Subtitle Paket
    expect(screen.getByText(siteConfig.paketSectionTitle)).toBeInTheDocument();

    // 3 Paket cards
    siteConfig.paket.forEach((item) => {
      expect(screen.getByRole('heading', { level: 3, name: item.title })).toBeInTheDocument();
      expect(screen.getByText(new RegExp(item.audience, 'i'))).toBeInTheDocument();
    });

    // Total 11 clickable card buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(11);
  });

  it('renders "Anda dapat:" deliverables and "Termasuk:" includes on respective cards', () => {
    render(<Services />);
    const andaDapatLabels = screen.getAllByText('Anda dapat:');
    expect(andaDapatLabels).toHaveLength(8);

    const termasukLabels = screen.getAllByText('Termasuk:');
    expect(termasukLabels).toHaveLength(3);

    // Specific note for sistem administrasi & gbp
    expect(screen.getByText(siteConfig.layanan[0].note!)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.layanan[7].note!)).toBeInTheDocument();
  });

  it('toggles card selection on click and updates aria-pressed', () => {
    render(<Services />);
    const firstCardButton = screen.getByRole('button', {
      name: new RegExp(siteConfig.layanan[0].title, 'i'),
    });

    // Initially not pressed
    expect(firstCardButton).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByText('Dipilih')).not.toBeInTheDocument();

    // Click to select
    fireEvent.click(firstCardButton);
    expect(firstCardButton).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Dipilih')).toBeInTheDocument();

    // Click again to deselect
    fireEvent.click(firstCardButton);
    expect(firstCardButton).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByText('Dipilih')).not.toBeInTheDocument();
  });

  it('renders empty CTA button when 0 cards are selected', () => {
    render(<Services />);

    const emptyCta = screen.getByRole('link', { name: new RegExp(siteConfig.layananSection.emptyCtaLabel, 'i') });
    expect(emptyCta).toBeInTheDocument();
    expect(emptyCta).toHaveAttribute('href', '#kontak');

    // Sticky bar is NOT rendered
    expect(screen.queryByRole('region', { name: /Layanan terpilih/i })).not.toBeInTheDocument();
  });

  it('renders sticky bar with correct count and WhatsApp link with selected titles encoded', () => {
    const spy = vi.spyOn(whatsappModule, 'buildWhatsAppUrl').mockImplementation((options) => {
      const msg = options?.message || '';
      return `https://wa.me/6281529964902?text=${encodeURIComponent(msg)}`;
    });

    render(<Services />);

    const gbpButton = screen.getByRole('button', {
      name: new RegExp(siteConfig.layanan[0].title, 'i'),
    });
    const emailButton = screen.getByRole('button', {
      name: new RegExp(siteConfig.layanan[1].title, 'i'),
    });

    // Select 2 items
    fireEvent.click(gbpButton);
    fireEvent.click(emailButton);

    // Empty state CTA should disappear
    expect(
      screen.queryByRole('link', { name: new RegExp(siteConfig.layananSection.emptyCtaLabel, 'i') })
    ).not.toBeInTheDocument();

    // Sticky bar appears with count 2
    const stickyBar = screen.getByRole('region', { name: /Layanan terpilih/i });
    expect(stickyBar).toBeInTheDocument();
    expect(stickyBar).toHaveTextContent('2 layanan dipilih');

    // WhatsApp CTA button in sticky bar
    const waLink = screen.getByRole('link', {
      name: new RegExp(siteConfig.layananSection.ctaLabel, 'i'),
    });
    expect(waLink).toBeInTheDocument();
    expect(waLink).toHaveAttribute('target', '_blank');

    const href = waLink.getAttribute('href') || '';
    expect(href).toContain('wa.me/');
    expect(href).toContain(encodeURIComponent(siteConfig.layanan[0].title));
    expect(href).toContain(encodeURIComponent(siteConfig.layanan[1].title));

    spy.mockRestore();
  });

  it('falls back to #kontak link when WhatsApp is not configured and items are selected', () => {
    const spy = vi.spyOn(whatsappModule, 'buildWhatsAppUrl').mockReturnValue(null);

    render(<Services />);
    const firstCard = screen.getByRole('button', {
      name: new RegExp(siteConfig.layanan[0].title, 'i'),
    });
    fireEvent.click(firstCard);

    const ctaLink = screen.getByRole('link', {
      name: new RegExp(siteConfig.layananSection.ctaLabel, 'i'),
    });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', '#kontak');

    spy.mockRestore();
  });
});
