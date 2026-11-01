import {
  MessageCircle,
  Compass,
  Code2,
  Target,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { siteConfig, type WorkflowStep, type CaraKerjaPrinciple } from '@/config/site';

const stepIcons: Record<number, React.ComponentType<{ className?: string }>> = {
  1: MessageCircle,
  2: Compass,
  3: Code2,
};

const principleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Pahami Kebutuhan': Target,
  'Tentukan Prioritas': Sliders,
  'Kerjakan Sesuai Kesepakatan': ShieldCheck,
};

export function CaraKerja() {
  const { caraKerja } = siteConfig;

  return (
    <section
      id="cara-kerja"
      aria-labelledby="cara-kerja-heading"
      className="py-16 md:py-24 bg-surface border-b border-border scroll-mt-16 md:scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <span className="inline-block text-xs md:text-sm font-semibold tracking-wider uppercase text-brand-accent-strong bg-accent-surface px-3 py-1.5 rounded-full border border-brand-accent/20 mb-3">
            {caraKerja.badge}
          </span>
          <h2
            id="cara-kerja-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary tracking-tight mb-4"
          >
            {caraKerja.title}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {caraKerja.description}
          </p>
        </div>

        {/* Compact Guiding Principles Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 sm:mb-16">
          {caraKerja.principles.map((principle: CaraKerjaPrinciple) => {
            const IconComponent = principleIcons[principle.title] || Target;

            return (
              <div
                key={principle.title}
                className="bg-white/90 rounded-xl border border-border p-4 sm:p-5 flex items-start gap-3.5 shadow-xs transition-shadow hover:shadow-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-accent-surface text-brand-accent-strong border border-brand-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <IconComponent className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-brand-primary mb-1">
                    {principle.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Numbered Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {caraKerja.steps.map((step: WorkflowStep) => {
            const IconComponent = stepIcons[step.step] || MessageCircle;

            return (
              <div
                key={step.step}
                className="bg-white rounded-xl border border-border p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative"
              >
                <div>
                  {/* Top indicator: Icon & Numeric Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-lg bg-accent-surface text-brand-accent-strong border border-brand-accent/20 flex items-center justify-center">
                      <IconComponent className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <span
                      className="text-2xl font-bold text-brand-accent-strong/40 select-none"
                      aria-hidden="true"
                    >
                      0{step.step}
                    </span>
                  </div>

                  {/* Step Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-brand-primary mb-3">
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

