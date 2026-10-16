import Image from 'next/image';
import { siteConfig } from '@/config/site';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 bg-white">
      <div className="max-w-2xl w-full border border-border-subtle rounded-2xl p-8 md:p-10 bg-surface shadow-sm text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo-landscape.png"
            alt={siteConfig.name}
            width={240}
            height={85}
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

        <div className="border-t border-border-subtle pt-6 text-left">
          <h2 className="text-xs font-semibold tracking-wider uppercase text-text-secondary mb-3">
            Design Tokens & Brand Palette (Phase 1 Foundation)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-brand-primary text-white font-medium">
              Navy
              <span className="block text-[10px] opacity-80">#1E2B4B</span>
            </div>
            <div className="p-3 rounded-lg bg-brand-accent text-white font-medium">
              Teal
              <span className="block text-[10px] opacity-80">#1AA99E</span>
            </div>
            <div className="p-3 rounded-lg bg-brand-accent-strong text-white font-medium">
              Deep Teal
              <span className="block text-[10px] opacity-80">#087F79</span>
            </div>
            <div className="p-3 rounded-lg bg-white border border-border-subtle text-text-primary font-medium">
              Surface / Border
              <span className="block text-[10px] text-text-secondary">#F7F8FA / #DCE3EB</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs text-text-secondary text-center">
          Fase 1: Project Foundation, Design Tokens, and Global Layout ready for review.
        </div>
      </div>
    </main>
  );
}

