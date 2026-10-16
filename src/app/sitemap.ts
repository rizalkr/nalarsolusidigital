import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const isConfigured = siteConfig.isSiteUrlConfigured && Boolean(siteConfig.siteUrl?.trim());
  if (!isConfigured) {
    return [];
  }

  const baseUrl = siteConfig.siteUrl.trim().replace(/\/+$/, '');
  if (!baseUrl) {
    return [];
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
