import Image from 'next/image';
import { siteConfig } from '@/config/site';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 bg-white">
      <div className="max-w-3xl w-full border border-border rounded-2xl p-8 md:p-10 bg-surface shadow-sm text-center">
        <div className="flex justify-center mb-6">
          <Image
            src={siteConfig.logo.landscape.src}
            alt={siteConfig.logo.landscape.alt}
            width={siteConfig.logo.landscape.width}
            height={siteConfig.logo.landscape.height}
            priority
            className="h-14 w-auto object-contain"
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-brand-primary mb-3">
          {siteConfig.name}
        </h1>

        <p className="text-base md:text-lg text-text-secondary italic mb-8 font-medium">
          &ldquo;{siteConfig.tagline}&rdquo;
        </p>

        <div className="border-t border-border pt-6 text-left">
          <h2 className="text-xs font-semibold tracking-wider uppercase text-text-secondary mb-4">
            Design Tokens & Brand Palette (PRD Section 9.1)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-brand-primary text-white font-medium">
              Navy (brand-primary)
              <span className="block text-[10px] opacity-80">#1E2B4B</span>
            </div>
            {/* Note: Dark text on Teal satisfies WCAG AA contrast (4.80:1) */}
            <div className="p-3 rounded-lg bg-brand-accent text-brand-primary font-medium">
              Teal (brand-accent)
              <span className="block text-[10px] opacity-80">#1AA99E</span>
            </div>
            <div className="p-3 rounded-lg bg-brand-accent-strong text-white font-medium">
              Deep Teal (brand-accent-strong)
              <span className="block text-[10px] opacity-80">#087F79</span>
            </div>
            <div className="p-3 rounded-lg bg-accent-surface border border-border text-brand-accent-strong font-medium">
              Soft Teal (accent-surface)
              <span className="block text-[10px] opacity-80">#E7F7F5</span>
            </div>
            <div className="p-3 rounded-lg bg-surface border border-border text-text-primary font-medium">
              Soft Gray (surface)
              <span className="block text-[10px] text-text-secondary">#F7F8FA</span>
            </div>
            <div className="p-3 rounded-lg bg-white border border-border text-text-primary font-medium">
              White (background)
              <span className="block text-[10px] text-text-secondary">#FFFFFF</span>
            </div>
            <div className="p-3 rounded-lg bg-text-primary text-white font-medium">
              Ink (text-primary)
              <span className="block text-[10px] opacity-80">#202938</span>
            </div>
            <div className="p-3 rounded-lg bg-text-secondary text-white font-medium">
              Slate (text-secondary)
              <span className="block text-[10px] opacity-80">#596575</span>
            </div>
            <div className="p-3 rounded-lg bg-white border-2 border-border text-text-primary font-medium">
              Light Border (border)
              <span className="block text-[10px] text-text-secondary">#DCE3EB</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-border flex flex-wrap items-center justify-between text-xs text-text-secondary gap-2">
          <span>Fase 1: Project Foundation, Design Tokens, & Global Layout</span>
          <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-border">
            WhatsApp: {siteConfig.contact.whatsapp.isConfigured ? 'Configured' : 'Belum diisi'}
          </span>
        </div>
      </div>
    </main>
  );
}
