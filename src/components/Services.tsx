import { Building2, LayoutGrid, ClipboardList, ShieldCheck, Check } from 'lucide-react';
import { siteConfig } from '@/config/site';

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'kehadiran-digital': Building2,
  'informasi-produk-layanan': LayoutGrid,
  'proses-pemesanan-administrasi': ClipboardList,
  'identitas-infrastruktur-digital': ShieldCheck,
};

export function Services() {
  return (
    <section
      id="layanan"
      aria-labelledby="services-heading"
      className="py-16 md:py-24 bg-surface border-b border-border scroll-mt-16 md:scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block text-xs md:text-sm font-semibold tracking-wider uppercase text-brand-accent-strong bg-accent-surface px-3 py-1.5 rounded-full border border-brand-accent/20 mb-3">
            {siteConfig.servicesSection.badge}
          </span>
          <h2
            id="services-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary tracking-tight mb-4"
          >
            {siteConfig.servicesSection.title}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {siteConfig.servicesSection.description}
          </p>
        </div>

        {/* 4 Solution Area Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {siteConfig.services.map((service) => {
            const IconComponent = serviceIcons[service.id] || Building2;

            return (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-border p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Icon badge */}
                  <div className="w-12 h-12 rounded-lg bg-accent-surface text-brand-accent-strong border border-brand-accent/20 flex items-center justify-center mb-6">
                    <IconComponent className="w-6 h-6" aria-hidden="true" />
                  </div>

                  {/* Service Title */}
                  <h3 className="text-xl font-bold text-brand-primary mb-3">
                    {service.title}
                  </h3>

                  {/* Service Description */}
                  <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Examples List */}
                  <div className="border-t border-border pt-4">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                      Contoh Kebutuhan:
                    </span>
                    <ul className="space-y-2.5" aria-label={`Contoh kebutuhan ${service.title}`}>
                      {service.capabilities.map((cap, idx) => (
                        <li key={idx} className="flex items-start text-sm text-text-primary">
                          <Check className="w-4 h-4 text-brand-accent-strong mt-0.5 mr-2 shrink-0" aria-hidden="true" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

