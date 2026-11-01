import { MessageSquare, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { buildWhatsAppUrl, formatPhoneDisplay } from '@/lib/whatsapp';

export function Contact() {
  const { kontak, contact } = siteConfig;
  const whatsappUrl = buildWhatsAppUrl({
    message: contact.whatsapp.defaultMessages.consultation,
  });
  const displayPhone = formatPhoneDisplay(contact.whatsapp.number);
  const email = contact.email?.trim() || null;

  return (
    <section
      id="kontak"
      aria-labelledby="contact-heading"
      className="py-16 md:py-24 bg-brand-primary text-white border-b border-border scroll-mt-16 md:scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block text-xs md:text-sm font-semibold tracking-wider uppercase text-accent-surface bg-brand-accent/20 px-3 py-1.5 rounded-full border border-brand-accent/30 mb-4">
            {kontak.badge}
          </span>
          <h2
            id="contact-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-4"
          >
            {kontak.title}
          </h2>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {kontak.description}
          </p>
        </div>

        {/* Contact Channels Grid */}
        <address className="not-italic">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Channel 1: WhatsApp */}
            {whatsappUrl && displayPhone ? (
              <div className="bg-white/10 rounded-xl border border-white/15 p-6 sm:p-8 flex flex-col justify-between hover:bg-white/[0.14] transition-colors">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-brand-accent/20 text-accent-surface border border-brand-accent/30 flex items-center justify-center mb-6">
                    <MessageSquare className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">
                    WhatsApp
                  </span>
                  <p className="text-lg sm:text-xl font-bold text-white mb-3">
                    {displayPhone}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/15">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent hover:text-white focus-visible:outline-brand-accent transition-colors cursor-pointer"
                    aria-label="Chat WhatsApp (membuka di tab baru)"
                  >
                    <span>{kontak.whatsappLabel}</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ) : null}

            {/* Channel 2: Email */}
            {email ? (
              <div className="bg-white/10 rounded-xl border border-white/15 p-6 sm:p-8 flex flex-col justify-between hover:bg-white/[0.14] transition-colors">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-brand-accent/20 text-accent-surface border border-brand-accent/30 flex items-center justify-center mb-6">
                    <Mail className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">
                    Email
                  </span>
                  <p className="text-lg sm:text-xl font-bold text-white mb-3 break-all">
                    {email}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/15">
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent hover:text-white focus-visible:outline-brand-accent transition-colors"
                  >
                    <span>{kontak.emailLabel}</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ) : null}

            {/* Channel 3: Lokasi */}
            <div className="bg-white/10 rounded-xl border border-white/15 p-6 sm:p-8 flex flex-col justify-between hover:bg-white/[0.14] transition-colors">
              <div>
                <div className="w-12 h-12 rounded-lg bg-brand-accent/20 text-accent-surface border border-brand-accent/30 flex items-center justify-center mb-6">
                  <MapPin className="w-6 h-6" aria-hidden="true" />
                </div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">
                  Lokasi
                </span>
                <p className="text-base sm:text-lg font-bold text-white mb-2">
                  Klaten
                </p>
                <p className="text-sm text-white/80 leading-relaxed">
                  {kontak.location}
                </p>
              </div>
            </div>
          </div>
        </address>
      </div>
    </section>
  );
}
