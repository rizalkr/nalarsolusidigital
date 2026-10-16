import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  const isConfigured = siteConfig.isSiteUrlConfigured && Boolean(siteConfig.siteUrl?.trim());
  const baseUrl = siteConfig.siteUrl ? siteConfig.siteUrl.trim().replace(/\/+$/, '') : '';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    ...(isConfigured && baseUrl
      ? {
          sitemap: `${baseUrl}/sitemap.xml`,
        }
      : {}),
  };
}
