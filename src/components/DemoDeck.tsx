'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ExternalLink, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DemoItem } from '@/config/site';

interface DemoDeckProps {
  demos: DemoItem[];
}

export function DemoDeck({ demos }: DemoDeckProps) {
  const [activeId, setActiveId] = useState<string>(demos[0]?.id ?? '');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (!demos || demos.length === 0) {
    return null;
  }

  const handleTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    if (demos.length === 0) return;
    let targetIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = (currentIndex + 1) % demos.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = (currentIndex - 1 + demos.length) % demos.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = demos.length - 1;
    } else {
      return;
    }

    const targetDemo = demos[targetIndex];
    if (targetDemo) {
      setActiveId(targetDemo.id);
      tabRefs.current[targetIndex]?.focus();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Tab Switcher */}
      <div
        role="tablist"
        aria-label="Pilihan Contoh Solusi"
        className="flex items-center justify-center gap-2 p-1.5 bg-surface border border-border rounded-xl mx-auto w-fit mb-8 shadow-xs"
      >
        {demos.map((demo, index) => {
          const isActive = demo.id === activeId;
          return (
            <button
              key={demo.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={`demo-tab-${demo.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`demo-panel-${demo.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(demo.id)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
              className={cn(
                'px-5 py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 focus-visible:outline-brand-accent',
                isActive
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-brand-primary hover:bg-white/70'
              )}
            >
              {demo.name}
            </button>
          );
        })}
      </div>

      {/* Playing Cards Stacking Deck */}
      <div className="relative pt-6 pb-2 px-2 sm:px-4">
        <div className="grid grid-cols-1 grid-rows-1">
          {demos.map((demo, index) => {
            const isActive = demo.id === activeId;

            return (
              <article
                key={demo.id}
                id={`demo-panel-${demo.id}`}
                role="tabpanel"
                aria-labelledby={`demo-tab-${demo.id}`}
                tabIndex={isActive ? 0 : -1}
                data-testid={`demo-card-${demo.id}`}
                data-active={isActive ? 'true' : 'false'}
                title={isActive ? undefined : `Klik untuk menampilkan ${demo.name}`}
                onClick={isActive ? undefined : () => setActiveId(demo.id)}
                onKeyDown={
                  isActive
                    ? undefined
                    : (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveId(demo.id);
                        }
                      }
                }
                className={cn(
                  'col-start-1 row-start-1 bg-white rounded-2xl border border-border transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden origin-top',
                  isActive
                    ? 'z-20 scale-100 rotate-0 translate-x-0 translate-y-0 shadow-lg pointer-events-auto'
                    : 'z-10 cursor-pointer scale-[0.96] opacity-85 hover:opacity-100 translate-x-0 -translate-y-3.5 rotate-0 md:translate-x-4 md:translate-y-0 md:rotate-2'
                )}
              >
                {/* Card Image / Preview */}
                <div className="relative aspect-[16/10] w-full bg-surface border-b border-border">
                  <Image
                    src={demo.previewImage}
                    alt={`Tampilan antarmuka ${demo.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-primary bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md border border-border shadow-sm">
                      {demo.badge}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="mb-2">
                      <span className="text-xs font-medium text-brand-accent-strong uppercase tracking-wider">
                        {demo.name}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-brand-primary mt-1">
                        {demo.title}
                      </h3>
                    </div>

                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6">
                      {demo.description}
                    </p>

                    {/* Feature Highlights from PRD */}
                    <div className="border-t border-border pt-4 mb-6">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                        Fitur Implementasi:
                      </span>
                      <ul className="space-y-2" aria-label={`Fitur ${demo.name}`}>
                        {demo.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm text-text-primary">
                            <Check className="w-4 h-4 text-brand-accent-strong mt-0.5 mr-2 shrink-0" aria-hidden="true" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Action */}
                  <div className="pt-4 border-t border-border">
                    {demo.url ? (
                      <a
                        href={demo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={isActive ? 0 : -1}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-sm focus-visible:outline-brand-accent transition-colors"
                      >
                        <span>{demo.ctaLabel}</span>
                        <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      </a>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled
                          aria-disabled="true"
                          aria-label={`${demo.ctaLabel} - Segera Hadir`}
                          tabIndex={isActive ? 0 : -1}
                          className="inline-flex flex-wrap items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg cursor-not-allowed opacity-80 max-w-full focus-visible:outline-brand-accent"
                        >
                          <span>{demo.ctaLabel}</span>
                          <span className="text-[11px] bg-white border border-border px-1.5 py-0.5 rounded text-text-secondary font-medium">
                            Segera Hadir
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

