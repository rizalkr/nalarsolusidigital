import { MessageSquare, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { buildWhatsAppUrl, formatPhoneDisplay } from '@/lib/whatsapp';

export function Contact() {
  const { contactSection, contact } = siteConfig;
  const whatsappUrl = buildWhatsAppUrl({
    message: contact.whatsapp.defaultMessages.consultation,
  });
  const displayPhone = formatPhoneDisplay(contact.whatsapp.number);
  const email = contact.email?.trim() || null;

  return (
    <section
      id="kontak"
      aria-labelledby="contact-heading"
      className="py-16 md:py-24 bg-background border-b border-border scroll-mt-16 md:scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block text-xs md:text-sm font-semibold tracking-wider uppercase text-brand-accent-strong bg-accent-surface px-3 py-1.5 rounded-full border border-brand-accent/20 mb-3">
            {contactSection.badge}
          </span>
          <h2
            id="contact-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary tracking-tight mb-4"
          >
            {contactSection.title}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {contactSection.description}
          </p>
        </div>

        {/* Contact Channels Grid */}
        <address className="not-italic">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Channel 1: WhatsApp */}
            {whatsappUrl && displayPhone ? (
              <div className="bg-surface rounded-xl border border-border p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-sm transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-accent-surface text-brand-accent-strong border border-brand-accent/20 flex items-center justify-center mb-6">
                    <MessageSquare className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                    WhatsApp
                  </span>
                  <p className="text-lg sm:text-xl font-bold text-brand-primary mb-3">
                    {displayPhone}
                  </p>
                </div>
                <div className="pt-4 border-t border-border">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent-strong hover:text-brand-accent focus-visible:outline-brand-accent transition-colors cursor-pointer"
                    aria-label="Chat WhatsApp (membuka di tab baru)"
                  >
                    <span>{contactSection.whatsappLabel}</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ) : null}

            {/* Channel 2: Email */}
            {email ? (
              <div className="bg-surface rounded-xl border border-border p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-sm transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-accent-surface text-brand-accent-strong border border-brand-accent/20 flex items-center justify-center mb-6">
                    <Mail className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                    Email
                  </span>
                  <p className="text-lg sm:text-xl font-bold text-brand-primary mb-3 break-all">
                    {email}
                  </p>
                </div>
                <div className="pt-4 border-t border-border">
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent-strong hover:text-brand-accent focus-visible:outline-brand-accent transition-colors"
                  >
                    <span>{contactSection.emailLabel}</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ) : null}

            {/* Channel 3: Lokasi */}
            <div className="bg-surface rounded-xl border border-border p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-sm transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-lg bg-accent-surface text-brand-accent-strong border border-brand-accent/20 flex items-center justify-center mb-6">
                  <MapPin className="w-6 h-6" aria-hidden="true" />
                </div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                  Lokasi
                </span>
                <p className="text-base sm:text-lg font-bold text-brand-primary mb-2">
                  Klaten
                </p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {contactSection.location}
                </p>
              </div>
            </div>
          </div>
        </address>
      </div>
    </section>
  );
}
