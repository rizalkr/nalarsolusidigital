'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { DemoItem } from '@/config/site';
import { DemoModal } from './DemoModal';

export interface DemoCarouselProps {
  demos: DemoItem[];
}

export function DemoCarousel({ demos }: DemoCarouselProps) {
  const [selectedDemo, setSelectedDemo] = useState<DemoItem | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const triggerButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);

  // Check scroll position and scroll boundaries
  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const hasOverflow = scrollWidth > clientWidth + 2;

    setIsScrollable(hasOverflow);
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState, demos]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Scroll by roughly one card width + gap
    const scrollAmount = Math.max(el.clientWidth * 0.75, 300);
    const targetScroll = direction === 'left' ? -scrollAmount : scrollAmount;

    el.scrollBy({ left: targetScroll, behavior: 'smooth' });
  };

  const handleOpenDetail = (demo: DemoItem) => {
    activeTriggerRef.current = triggerButtonRefs.current[demo.id] || null;
    setSelectedDemo(demo);
  };

  const handleCloseDetail = () => {
    setSelectedDemo(null);
  };

  if (!demos || demos.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full">
      {/* Navigation Controls Header (shown when carousel is scrollable or on tablet/desktop) */}
      <div className="flex items-center justify-between mb-6">

        {isScrollable && (
          <div className="flex items-center gap-2" aria-label="Navigasi Galeri Demo">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Gulir ke demo sebelumnya"
              className={`p-2 rounded-lg border border-border bg-white text-brand-primary shadow-xs transition-all focus-visible:outline-brand-accent ${
                canScrollLeft
                  ? 'hover:bg-surface hover:border-brand-primary/30 cursor-pointer active:scale-95'
                  : 'opacity-40 cursor-not-allowed text-text-secondary'
              }`}
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Gulir ke demo berikutnya"
              className={`p-2 rounded-lg border border-border bg-white text-brand-primary shadow-xs transition-all focus-visible:outline-brand-accent ${
                canScrollRight
                  ? 'hover:bg-surface hover:border-brand-primary/30 cursor-pointer active:scale-95'
                  : 'opacity-40 cursor-not-allowed text-text-secondary'
              }`}
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        onScroll={updateScrollState}
        tabIndex={0}
        aria-label="Koleksi Demo Interaktif"
        className={`flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 px-1 sm:px-2 focus-visible:outline-brand-accent rounded-xl ${
          demos.length <= 2 ? 'md:justify-center' : ''
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {demos.map((demo) => (
          <article
            key={demo.id}
            data-testid={`demo-card-${demo.id}`}
            className="w-[84vw] max-w-[340px] sm:w-[320px] md:w-[360px] flex-shrink-0 snap-start bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
          >
            {/* Screenshot Preview */}
            <div className="relative aspect-[16/10] w-full bg-surface border-b border-border overflow-hidden">
              <Image
                src={demo.previewImage}
                alt={`Preview website ${demo.name}`}
                fill
                sizes="(max-width: 640px) 85vw, (max-width: 768px) 320px, 360px"
                className="object-cover object-top transition-transform duration-300 hover:scale-102"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md border border-border shadow-xs">
                  {demo.badge}
                </span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-brand-accent-strong uppercase tracking-wider">
                  {demo.name}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-brand-primary mt-1 line-clamp-2">
                  {demo.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-2 line-clamp-3">
                  {demo.description}
                </p>
              </div>

              {/* Action Button: Lihat Detail */}
              <div className="mt-5 pt-4 border-t border-border">
                <button
                  ref={(el) => {
                    triggerButtonRefs.current[demo.id] = el;
                  }}
                  type="button"
                  onClick={() => handleOpenDetail(demo)}
                  aria-haspopup="dialog"
                  aria-label={`Lihat detail demo ${demo.name}`}
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm font-semibold text-brand-primary bg-surface hover:bg-border/60 border border-border rounded-lg transition-colors group focus-visible:outline-brand-accent cursor-pointer"
                >
                  <span>Lihat Detail</span>
                  <ArrowRight className="w-4 h-4 text-brand-accent-strong group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Accessible Detail Modal */}
      <DemoModal
        demo={selectedDemo}
        isOpen={Boolean(selectedDemo)}
        onClose={handleCloseDetail}
        triggerRef={activeTriggerRef}
      />
    </div>
  );
}
