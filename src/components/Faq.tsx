'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function Faq() {
  const { faq } = siteConfig;
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-16 md:py-24 bg-surface border-b border-border scroll-mt-16 md:scroll-mt-20"
    >
      {/* Structured Data: FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Section Header */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <span className="inline-block text-xs md:text-sm font-semibold tracking-wider uppercase text-brand-accent-strong bg-accent-surface px-3 py-1.5 rounded-full border border-brand-accent/20 mb-3">
              {faq.badge}
            </span>
            <h2
              id="faq-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary tracking-tight mb-4"
            >
              {faq.title}
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Hal-hal yang sering ditanyakan seputar cara kami bekerja dan menentukan solusi yang paling sesuai untuk usaha Anda.
            </p>
          </div>

          {/* Right Column: Single-Open Accordion Items */}
          <div className="lg:col-span-8 divide-y divide-border rounded-xl border border-border bg-white shadow-xs overflow-hidden">
            {faq.items.map((item, index) => {
              const isOpen = openId === item.id;
              const questionId = `faq-question-${item.id}`;
              const answerId = `faq-answer-${item.id}`;
              const itemNumber = String(index + 1).padStart(2, '0');

              return (
                <div key={item.id} className="transition-colors">
                  <h3>
                    <button
                      type="button"
                      id={questionId}
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => toggleItem(item.id)}
                      className="w-full py-5 px-6 sm:px-8 flex items-center justify-between gap-4 text-left font-bold text-base sm:text-lg text-brand-primary hover:bg-surface/50 focus-visible:outline-brand-accent transition-colors cursor-pointer"
                    >
                      <span className="flex items-start sm:items-center gap-3 sm:gap-4">
                        <span
                          className="font-mono text-xs sm:text-sm font-semibold text-brand-accent-strong mt-0.5 sm:mt-0"
                          aria-hidden="true"
                        >
                          {itemNumber}
                        </span>
                        <span>{item.question}</span>
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-text-secondary shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-brand-accent-strong' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>
                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    hidden={!isOpen}
                    className="px-6 sm:px-8 pb-5 pt-1 text-sm sm:text-base text-text-secondary leading-relaxed border-t border-border/50 bg-surface/30"
                  >
                    <p>{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
