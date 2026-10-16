import { MessageCircle, Compass, Code2 } from 'lucide-react';
import { siteConfig, type WorkflowStep } from '@/config/site';

const stepIcons: Record<number, React.ComponentType<{ className?: string }>> = {
  1: MessageCircle,
  2: Compass,
  3: Code2,
};

export function HowItWorks() {
  return (
    <section
      id="cara-kerja"
      aria-labelledby="how-it-works-heading"
      className="py-16 md:py-24 bg-surface border-b border-border scroll-mt-16 md:scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block text-xs md:text-sm font-semibold tracking-wider uppercase text-brand-accent-strong bg-accent-surface px-3 py-1.5 rounded-full border border-brand-accent/20 mb-3">
            Cara Kerja
          </span>
          <h2
            id="how-it-works-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary tracking-tight mb-4"
          >
            {siteConfig.howItWorks.title}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {siteConfig.howItWorks.description}
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {siteConfig.howItWorks.steps.map((step: WorkflowStep) => {
            const IconComponent = stepIcons[step.step] || MessageCircle;

            return (
              <div
                key={step.step}
                className="bg-white rounded-xl border border-border p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div>
                  {/* Top indicator: Icon & Numeric Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-lg bg-accent-surface text-brand-accent-strong border border-brand-accent/20 flex items-center justify-center">
                      <IconComponent className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <span className="text-2xl font-bold text-brand-accent-strong/40 select-none" aria-hidden="true">
                      0{step.step}
                    </span>
                  </div>

                  {/* Step Title */}
                  <h3 className="text-xl font-bold text-brand-primary mb-3">
                    Langkah {step.step}: {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contextual Notice */}
        <div className="mt-8 text-center">
          <p className="text-xs text-text-secondary">
            Estimasi waktu dan ruang lingkup pengerjaan disepakati bersama berdasarkan kebutuhan spesifik setiap usaha.
          </p>
        </div>
      </div>
    </section>
  );
}
