import { Target, Sliders, ShieldCheck } from 'lucide-react';
import { siteConfig, type PrincipleItem } from '@/config/site';

const principleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Pahami Kebutuhan': Target,
  'Tentukan Prioritas': Sliders,
  'Bangun Sesuai Kesepakatan': ShieldCheck,
};

export function Approach() {
  return (
    <section
      id="tentang"
      aria-labelledby="approach-heading"
      className="py-16 md:py-24 bg-background border-b border-border scroll-mt-16 md:scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block text-xs md:text-sm font-semibold tracking-wider uppercase text-brand-accent-strong bg-accent-surface px-3 py-1.5 rounded-full border border-brand-accent/20 mb-3">
            Pendekatan Kami
          </span>
          <h2
            id="approach-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary tracking-tight mb-4"
          >
            {siteConfig.approach.title}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {siteConfig.approach.description}
          </p>
        </div>

        {/* 3 Principles Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {siteConfig.approach.principles.map((principle: PrincipleItem) => {
            const IconComponent = principleIcons[principle.title] || Target;

            return (
              <div
                key={principle.title}
                className="bg-surface rounded-xl border border-border p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-white text-brand-accent-strong border border-brand-accent/20 flex items-center justify-center mb-6">
                    <IconComponent className="w-6 h-6" aria-hidden="true" />
                  </div>

                  {/* Principle Title */}
                  <h3 className="text-xl font-bold text-brand-primary mb-3">
                    {principle.title}
                  </h3>

                  {/* Principle Description */}
                  <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
