'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Mark component mounted after client hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Open menu
  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Close menu and restore focus to trigger button
  const closeMenu = useCallback(() => {
    setIsOpen(false);
    toggleButtonRef.current?.focus();
  }, []);

  // Handle link navigation: close menu without forcing focus back to trigger
  const handleLinkClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Keyboard navigation, focus trap, and body scroll lock
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
      // Focus close button on next tick once mounted
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeMenu]);

  // Auto-close on viewport resize to desktop (>= 768px)
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

  const drawerContent = (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="presentation"
    >
      {/* Dark frosted glass backdrop covering full viewport */}
      <div
        data-testid="mobile-nav-backdrop"
        className="fixed inset-0 bg-brand-primary/50 backdrop-blur-xs sm:backdrop-blur-sm animate-fade-in motion-reduce:animate-none"
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Glassmorphism Drawer Panel */}
      <div
        ref={drawerRef}
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi mobile"
        className="relative w-full max-w-[300px] sm:max-w-xs h-full min-h-screen h-[100dvh] flex flex-col z-10 
          bg-white/95 backdrop-blur-xl backdrop-saturate-150 supports-[not(backdrop-filter:blur(0))]:bg-white
          border-l border-white/60 shadow-[-8px_0_30px_rgba(30,43,75,0.15)] rounded-l-2xl
          animate-slide-in-right motion-reduce:animate-none overflow-hidden"
      >
        {/* Header: Title and Close button */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/70 shrink-0">
          <span className="font-bold text-brand-primary text-lg tracking-tight">Menu</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeMenu}
            aria-label="Tutup panel menu"
            className="p-2 text-text-secondary hover:text-brand-primary hover:bg-surface rounded-lg focus-visible:outline-brand-accent transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav
          className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5"
          aria-label="Navigasi Menu Mobile"
        >
          <ul className="space-y-1.5">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className="block px-4 py-3 text-base font-medium text-text-primary hover:text-brand-accent-strong hover:bg-brand-accent/10 active:bg-brand-accent/20 rounded-xl focus-visible:outline-brand-accent transition-all"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Consultation CTA */}
        <div className="p-6 pt-4 border-t border-border/70 bg-white/40 shrink-0">
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className="w-full inline-flex items-center justify-center px-4 py-3.5 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-primary/90 focus-visible:outline-brand-accent transition-all shadow-md active:scale-[0.98]"
            >
              {ctaLabel}
            </a>
          ) : email ? (
            <a
              href={`mailto:${email}?subject=Konsultasi%20Website%20-%20Nalar%20Solusi%20Digital`}
              onClick={handleLinkClick}
              title={`Kirim email ke ${email}`}
              className="w-full inline-flex items-center justify-center px-4 py-3.5 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-primary/90 focus-visible:outline-brand-accent transition-all shadow-md active:scale-[0.98]"
            >
              {ctaLabel}
            </a>
          ) : (
            <a
              href="#tentang"
              onClick={handleLinkClick}
              title="Saluran konsultasi WhatsApp sedang dipersiapkan"
              className="w-full inline-flex items-center justify-center px-4 py-3.5 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-primary/90 focus-visible:outline-brand-accent transition-all shadow-md active:scale-[0.98]"
            >
              {ctaLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="md:hidden">
      {/* Menu Toggle Button */}
      <button
        ref={toggleButtonRef}
        type="button"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
        className="p-2 text-text-primary hover:text-brand-accent-strong focus-visible:outline-brand-accent rounded-lg transition-colors"
      >
        <Menu className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Render via portal into document.body only when opened */}
      {mounted && isOpen && typeof document !== 'undefined'
        ? createPortal(drawerContent, document.body)
        : null}
    </div>
  );
}
