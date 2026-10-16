'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export interface MobileNavProps {
  items: Array<{ label: string; href: string }>;
  whatsappUrl: string | null;
  email?: string | null;
  ctaLabel?: string;
}

export function MobileNav({
  items,
  whatsappUrl,
  email,
  ctaLabel = 'Konsultasi Gratis',
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Close menu and restore focus to trigger button
  const closeMenu = useCallback(() => {
    setIsOpen(false);
    toggleButtonRef.current?.focus();
  }, []);

  // Handle link navigation: close menu without forcing focus back to trigger
  const handleLinkClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Keyboard navigation: Escape to close, focus trap inside dialog
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // Focus the close button when opened
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeMenu]);

  // Viewport resize handling: auto-close drawer and clear scroll lock when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="md:hidden">
      {/* Menu Toggle Button */}
      <button
        ref={toggleButtonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
        className="p-2 text-text-primary hover:text-brand-accent-strong focus-visible:outline-brand-accent rounded-lg transition-colors"
      >
        <Menu className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Backdrop and Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-brand-primary/40 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div
            ref={drawerRef}
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi mobile"
            className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col p-6 z-10 border-l border-border animate-slide-in-right"
          >
            {/* Header: Title and Close button */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="font-semibold text-brand-primary text-base">Menu</span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeMenu}
                aria-label="Tutup panel menu"
                className="p-2 text-text-secondary hover:text-brand-primary rounded-lg focus-visible:outline-brand-accent transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-6 overflow-y-auto" aria-label="Navigasi Menu Mobile">
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className="block px-3 py-2.5 text-base font-medium text-text-primary hover:text-brand-accent-strong hover:bg-surface rounded-lg transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Consultation CTA */}
            <div className="pt-4 border-t border-border">
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary/90 focus-visible:outline-brand-accent transition-colors shadow-sm"
                >
                  {ctaLabel}
                </a>
              ) : email ? (
                <a
                  href={`mailto:${email}?subject=Konsultasi%20Website%20-%20Nalar%20Solusi%20Digital`}
                  onClick={handleLinkClick}
                  title={`Kirim email ke ${email}`}
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary/90 focus-visible:outline-brand-accent transition-colors shadow-sm"
                >
                  {ctaLabel}
                </a>
              ) : (
                <a
                  href="#tentang"
                  onClick={handleLinkClick}
                  title="Saluran konsultasi WhatsApp sedang dipersiapkan"
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary/90 focus-visible:outline-brand-accent transition-colors shadow-sm"
                >
                  {ctaLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
