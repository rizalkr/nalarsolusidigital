import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Contact } from './Contact';
import { siteConfig } from '@/config/site';
import * as whatsappModule from '@/lib/whatsapp';

describe('Contact Component', () => {
  it('renders section landmark with proper id and accessible labelling', () => {
    const { container } = render(<Contact />);
    const section = container.querySelector('section#kontak');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('aria-labelledby', 'contact-heading');

    const heading = screen.getByRole('heading', { level: 2, name: siteConfig.contactSection.title });
    expect(heading).toBeInTheDocument();
  });

  it('renders badge, description, and location verbatim from specifications', () => {
    render(<Contact />);
    expect(screen.getByText(siteConfig.contactSection.badge)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.contactSection.description)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.contactSection.location)).toBeInTheDocument();
  });

  it('formats WhatsApp phone number for display (08xx-xxxx-xxxx) with click-to-chat link', () => {
    const spyFormat = vi.spyOn(whatsappModule, 'formatPhoneDisplay').mockReturnValue('0815-2996-4902');
    const spyUrl = vi.spyOn(whatsappModule, 'buildWhatsAppUrl').mockReturnValue('https://wa.me/6281529964902?text=test');

    render(<Contact />);
    expect(screen.getByText('0815-2996-4902')).toBeInTheDocument();

    const waLink = screen.getByRole('link', { name: /Chat WhatsApp/i });
    expect(waLink).toBeInTheDocument();
    expect(waLink).toHaveAttribute('href', 'https://wa.me/6281529964902?text=test');
    expect(waLink).toHaveAttribute('target', '_blank');

    spyFormat.mockRestore();
    spyUrl.mockRestore();
  });

  it('renders email mailto link when email is configured', () => {
    const originalEmail = siteConfig.contact.email;
    siteConfig.contact.email = 'info@nalarsolusidigital.my.id';

    render(<Contact />);
    expect(screen.getByText('info@nalarsolusidigital.my.id')).toBeInTheDocument();

    const emailLink = screen.getByRole('link', { name: /Kirim email/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:info@nalarsolusidigital.my.id');

    siteConfig.contact.email = originalEmail;
  });

  it('hides email card completely when email is null or empty', () => {
    const originalEmail = siteConfig.contact.email;
    siteConfig.contact.email = null;

    render(<Contact />);
    expect(screen.queryByRole('link', { name: /Kirim email/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Email/i)).not.toBeInTheDocument();

    siteConfig.contact.email = originalEmail;
  });
});

