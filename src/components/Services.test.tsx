import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Services } from './Services';
import { siteConfig } from '@/config/site';
import * as whatsappModule from '@/lib/whatsapp';

describe('Services Component (Katalog Layanan Interaktif)', () => {
  it('renders section with id="layanan" and scroll-margin classes', () => {
    const { container } = render(<Services />);
    const section = container.querySelector('section#layanan');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('scroll-mt-16');
    expect(section).toHaveClass('md:scroll-mt-20');
  });

  it('renders section badge, heading (h2), description, and tileHint from layananSection', () => {
    render(<Services />);
    expect(screen.getByText(siteConfig.layananSection.badge)).toBeInTheDocument();
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(siteConfig.layananSection.title);
    expect(screen.getByText(siteConfig.layananSection.description)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.layananSection.tileHint)).toBeInTheDocument();
  });

  it('renders 8 compact service tiles and 3 package tiles (only icon and title, no inline descriptions)', () => {
    render(<Services />);

    // 8 Layanan tiles
    siteConfig.layanan.forEach((item) => {
      expect(screen.getByRole('heading', { level: 3, name: item.title })).toBeInTheDocument();
      // Inline descriptions should not be displayed in compact tile view
      expect(screen.queryByText(item.description)).not.toBeInTheDocument();
    });

    // Subtitle Paket
    expect(screen.getByText(siteConfig.paketSectionTitle)).toBeInTheDocument();

    // 3 Paket tiles
    siteConfig.paket.forEach((item) => {
      expect(screen.getByRole('heading', { level: 3, name: item.title })).toBeInTheDocument();
      // Audience should not be in the tile
      expect(screen.queryByText(new RegExp(item.audience, 'i'))).not.toBeInTheDocument();
    });

    // 11 clickable tile buttons initially
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(11);
  });

  it('opens modal on tile click displaying description and deliverables', () => {
    render(<Services />);
    const gbpTile = screen.getByRole('button', {
      name: new RegExp(siteConfig.layanan[0].title, 'i'),
    });

    // Modal is initially not open
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Click tile to open modal
    fireEvent.click(gbpTile);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(siteConfig.layanan[0].description)).toBeInTheDocument();

    siteConfig.layanan[0].deliverables.forEach((deliv) => {
      expect(screen.getByText(deliv)).toBeInTheDocument();
    });
  });

  it('selects item from modal, closes modal, and marks tile aria-pressed="true"', () => {
    render(<Services />);
    const firstTile = screen.getByRole('button', {
      name: new RegExp(siteConfig.layanan[0].title, 'i'),
    });

    // Initially not selected
    expect(firstTile).toHaveAttribute('aria-pressed', 'false');

    // Open modal
    fireEvent.click(firstTile);

    // Click "Pilih layanan ini" button in modal
    const selectBtn = screen.getByRole('button', {
      name: siteConfig.layananSection.modalSelectLabel,
    });
    fireEvent.click(selectBtn);

    // Modal closes
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Tile is now marked as selected
    expect(firstTile).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders empty CTA button when 0 items are selected', () => {
    render(<Services />);

    const emptyCta = screen.getByRole('link', {
      name: new RegExp(siteConfig.layananSection.emptyCtaLabel, 'i'),
    });
    expect(emptyCta).toBeInTheDocument();
    expect(emptyCta).toHaveAttribute('href', '#kontak');

    // Sticky bar is NOT rendered
    expect(screen.queryByText(/layanan dipilih/i)).not.toBeInTheDocument();
  });

  it('renders sticky bar with correct count and WhatsApp link with selected titles encoded', () => {
    const spy = vi.spyOn(whatsappModule, 'buildWhatsAppUrl').mockImplementation((options) => {
      const msg = options?.message || '';
      return `https://wa.me/6281529964902?text=${encodeURIComponent(msg)}`;
    });

    render(<Services />);

    // Select first item via modal
    const gbpTile = screen.getByRole('button', {
      name: new RegExp(siteConfig.layanan[0].title, 'i'),
    });
    fireEvent.click(gbpTile);
    const selectGbp = screen.getByRole('button', {
      name: siteConfig.layananSection.modalSelectLabel,
    });
    fireEvent.click(selectGbp);

    // Select second item via modal
    const emailTile = screen.getByRole('button', {
      name: new RegExp(siteConfig.layanan[1].title, 'i'),
    });
    fireEvent.click(emailTile);
    const selectEmail = screen.getByRole('button', {
      name: siteConfig.layananSection.modalSelectLabel,
    });
    fireEvent.click(selectEmail);

    // Empty state CTA should disappear
    expect(
      screen.queryByRole('link', { name: new RegExp(siteConfig.layananSection.emptyCtaLabel, 'i') })
    ).not.toBeInTheDocument();

    // Sticky bar appears with count 2
    expect(screen.getByText('2 layanan dipilih')).toBeInTheDocument();

    // WhatsApp CTA link in sticky bar
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
    const firstTile = screen.getByRole('button', {
      name: new RegExp(siteConfig.layanan[0].title, 'i'),
    });
    fireEvent.click(firstTile);

    const selectBtn = screen.getByRole('button', {
      name: siteConfig.layananSection.modalSelectLabel,
    });
    fireEvent.click(selectBtn);

    const ctaLink = screen.getByRole('link', {
      name: new RegExp(siteConfig.layananSection.ctaLabel, 'i'),
    });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', '#kontak');

    spy.mockRestore();
  });
});
