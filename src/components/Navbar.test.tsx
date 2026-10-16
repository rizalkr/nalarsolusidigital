import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { siteConfig } from '@/config/site';
import * as whatsappModule from '@/lib/whatsapp';

describe('Navbar Component', () => {
  it('renders the landscape logo linking to #beranda', () => {
    render(<Navbar />);
    const logoLink = screen.getByLabelText(/Nalar Solusi Digital - Kembali ke Beranda/i);
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '#beranda');

    const logoImg = screen.getByAltText(siteConfig.logo.landscape.alt);
    expect(logoImg).toBeInTheDocument();
  });

  it('renders desktop navigation links with correct anchor targets', () => {
    render(<Navbar />);
    const expectedAnchors = [
      { text: 'Layanan', href: '#layanan' },
      { text: 'Demo', href: '#demo' },
      { text: 'Cara Kerja', href: '#cara-kerja' },
      { text: 'Tentang', href: '#tentang' },
    ];

    expectedAnchors.forEach(({ text, href }) => {
      const link = screen.getAllByRole('link', { name: text })[0];
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', href);
    });
  });

  it('renders desktop consultation CTA button with fallback when WhatsApp is unconfigured', () => {
    const spy = vi.spyOn(whatsappModule, 'buildWhatsAppUrl').mockReturnValue(null);
    render(<Navbar />);
    const ctaLinks = screen.getAllByRole('link', { name: /Konsultasi Gratis/i });
    expect(ctaLinks.length).toBeGreaterThan(0);
    expect(ctaLinks[0]).toHaveAttribute('href', '#tentang');
    spy.mockRestore();
  });

  it('renders desktop consultation CTA button with external link when WhatsApp is configured', () => {
    const spy = vi
      .spyOn(whatsappModule, 'buildWhatsAppUrl')
      .mockReturnValue('https://wa.me/6281529964902?text=Halo');
    render(<Navbar />);
    const ctaLinks = screen.getAllByRole('link', { name: /Konsultasi Gratis/i });
    expect(ctaLinks.length).toBeGreaterThan(0);
    expect(ctaLinks[0]).toHaveAttribute('href', 'https://wa.me/6281529964902?text=Halo');
    expect(ctaLinks[0]).toHaveAttribute('target', '_blank');
    expect(ctaLinks[0]).toHaveAttribute('rel', 'noopener noreferrer');
    spy.mockRestore();
  });
});

describe('MobileNav Component', () => {
  const mockItems = [
    { label: 'Layanan', href: '#layanan' },
    { label: 'Demo', href: '#demo' },
    { label: 'Cara Kerja', href: '#cara-kerja' },
    { label: 'Tentang', href: '#tentang' },
  ];

  it('renders mobile menu trigger with proper accessibility attributes', () => {
    render(<MobileNav items={mockItems} whatsappUrl={null} />);
    const toggleButton = screen.getByRole('button', { name: /Buka menu navigasi/i });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens mobile drawer when toggle button is clicked', () => {
    render(<MobileNav items={mockItems} whatsappUrl={null} />);
    const toggleButton = screen.getByRole('button', { name: /Buka menu navigasi/i });

    fireEvent.click(toggleButton);

    const dialog = screen.getByRole('dialog', { name: /Menu navigasi mobile/i });
    expect(dialog).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

    // Nav items are visible in mobile drawer
    expect(screen.getByRole('link', { name: 'Layanan' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Demo' })).toBeInTheDocument();
  });

  it('closes mobile drawer when Escape key is pressed', () => {
    render(<MobileNav items={mockItems} whatsappUrl={null} />);
    const toggleButton = screen.getByRole('button', { name: /Buka menu navigasi/i });

    fireEvent.click(toggleButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes mobile drawer when a link is clicked', () => {
    render(<MobileNav items={mockItems} whatsappUrl={null} />);
    const toggleButton = screen.getByRole('button', { name: /Buka menu navigasi/i });

    fireEvent.click(toggleButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Layanan' });
    fireEvent.click(link);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes mobile drawer when close button is clicked', () => {
    render(<MobileNav items={mockItems} whatsappUrl={null} />);
    const toggleButton = screen.getByRole('button', { name: /Buka menu navigasi/i });

    fireEvent.click(toggleButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /Tutup panel menu/i });
    fireEvent.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('handles WhatsApp URL properly when provided', () => {
    render(
      <MobileNav
        items={mockItems}
        whatsappUrl="https://wa.me/6281234567890?text=Halo"
      />
    );
    const toggleButton = screen.getByRole('button', { name: /Buka menu navigasi/i });
    fireEvent.click(toggleButton);

    const ctaLink = screen.getByRole('link', { name: /Konsultasi Gratis/i });
    expect(ctaLink).toHaveAttribute('href', 'https://wa.me/6281234567890?text=Halo');
    expect(ctaLink).toHaveAttribute('target', '_blank');
    expect(ctaLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('handles email fallback properly when WhatsApp is unconfigured and email is provided', () => {
    render(
      <MobileNav
        items={mockItems}
        whatsappUrl={null}
        email="info@nalarsolusidigital.com"
      />
    );
    const toggleButton = screen.getByRole('button', { name: /Buka menu navigasi/i });
    fireEvent.click(toggleButton);

    const ctaLink = screen.getByRole('link', { name: /Konsultasi Gratis/i });
    expect(ctaLink).toHaveAttribute(
      'href',
      'mailto:info@nalarsolusidigital.com?subject=Konsultasi%20Website%20-%20Nalar%20Solusi%20Digital'
    );
  });

  it('traps focus inside mobile drawer: Tab on last element wraps to first element', () => {
    render(<MobileNav items={mockItems} whatsappUrl={null} />);
    const toggleButton = screen.getByRole('button', { name: /Buka menu navigasi/i });
    fireEvent.click(toggleButton);

    const closeButton = screen.getByRole('button', { name: /Tutup panel menu/i });
    const ctaLink = screen.getByRole('link', { name: /Konsultasi Gratis/i });

    // Focus last element
    ctaLink.focus();
    expect(document.activeElement).toBe(ctaLink);

    // Press Tab
    fireEvent.keyDown(document, { key: 'Tab', code: 'Tab' });
    expect(document.activeElement).toBe(closeButton);
  });

  it('traps focus inside mobile drawer: Shift+Tab on first element wraps to last element', () => {
    render(<MobileNav items={mockItems} whatsappUrl={null} />);
    const toggleButton = screen.getByRole('button', { name: /Buka menu navigasi/i });
    fireEvent.click(toggleButton);

    const closeButton = screen.getByRole('button', { name: /Tutup panel menu/i });
    const ctaLink = screen.getByRole('link', { name: /Konsultasi Gratis/i });

    // Focus first element
    closeButton.focus();
    expect(document.activeElement).toBe(closeButton);

    // Press Shift+Tab
    fireEvent.keyDown(document, { key: 'Tab', code: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(ctaLink);
  });

  it('restores focus to toggle button when closed via close button', () => {
    render(<MobileNav items={mockItems} whatsappUrl={null} />);
    const toggleButton = screen.getByRole('button', { name: /Buka menu navigasi/i });
    fireEvent.click(toggleButton);

    const closeButton = screen.getByRole('button', { name: /Tutup panel menu/i });
    fireEvent.click(closeButton);

    expect(document.activeElement).toBe(toggleButton);
  });

  it('automatically closes mobile drawer when window is resized to desktop width (>= 768px)', () => {
    render(<MobileNav items={mockItems} whatsappUrl={null} />);
    const toggleButton = screen.getByRole('button', { name: /Buka menu navigasi/i });
    fireEvent.click(toggleButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    // Simulate window resize to desktop
    window.innerWidth = 800;
    fireEvent(window, new Event('resize'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });
});
