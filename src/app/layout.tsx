import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1E2B4B',
};

const pageTitle = `${siteConfig.name} - Solusi Website untuk Usaha Lokal`;
const pageDescription = siteConfig.description;

const defaultBaseUrl = 'https://nalarsolusidigital.my.id';
const siteBaseUrl =
  siteConfig.isSiteUrlConfigured && siteConfig.siteUrl
    ? siteConfig.siteUrl
    : defaultBaseUrl;

export const metadata: Metadata = {
  title: {
    default: pageTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: pageDescription,
  metadataBase: new URL(siteBaseUrl),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    ...(siteConfig.isSiteUrlConfigured ? { url: siteConfig.siteUrl } : {}),
    siteName: siteConfig.name,
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: siteConfig.logo.portrait.src,
        width: siteConfig.logo.portrait.width,
        height: siteConfig.logo.portrait.height,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: [siteConfig.logo.portrait.src],
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
