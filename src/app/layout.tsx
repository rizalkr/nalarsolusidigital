import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - Solusi Website untuk Usaha Lokal`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // Only set metadataBase when siteUrl is explicitly configured and validated
  ...(siteConfig.isSiteUrlConfigured
    ? { metadataBase: new URL(siteConfig.siteUrl) }
    : {}),
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="min-h-screen bg-background text-text-primary antialiased selection:bg-accent-surface selection:text-brand-accent-strong">
        {children}
      </body>
    </html>
  );
}
