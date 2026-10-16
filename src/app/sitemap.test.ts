import { describe, it, expect, afterEach } from 'vitest';
import sitemap from './sitemap';
import { siteConfig } from '@/config/site';

describe('sitemap metadata route', () => {
  const originalSiteUrl = siteConfig.siteUrl;
  const originalIsConfigured = siteConfig.isSiteUrlConfigured;

  afterEach(() => {
    siteConfig.siteUrl = originalSiteUrl;
    siteConfig.isSiteUrlConfigured = originalIsConfigured;
  });

  it('generates valid sitemap entries with canonical URL when siteUrl is configured', () => {
    siteConfig.siteUrl = 'https://nalarsolusidigital.my.id';
    siteConfig.isSiteUrlConfigured = true;

    const result = sitemap();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);

    const entry = result[0];
    expect(entry.url).toBe('https://nalarsolusidigital.my.id');
    expect(entry.changeFrequency).toBe('weekly');
    expect(entry.priority).toBe(1);
    expect(entry.lastModified).toBeInstanceOf(Date);
  });

  it('returns empty array safely when siteUrl is not configured', () => {
    siteConfig.siteUrl = '';
    siteConfig.isSiteUrlConfigured = false;

    const result = sitemap();

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

  it('returns empty array safely when isSiteUrlConfigured is false even if siteUrl has a fallback', () => {
    siteConfig.siteUrl = 'https://some-unverified-url.com';
    siteConfig.isSiteUrlConfigured = false;

    const result = sitemap();

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

  it('normalizes trailing slashes on siteUrl to prevent duplicate slashes in sitemap', () => {
    siteConfig.siteUrl = 'https://nalarsolusidigital.my.id///';
    siteConfig.isSiteUrlConfigured = true;

    const result = sitemap();

    expect(result[0].url).toBe('https://nalarsolusidigital.my.id');
  });

  it('returns empty array when siteUrl consists solely of whitespace', () => {
    siteConfig.siteUrl = '   ';
    siteConfig.isSiteUrlConfigured = true;

    const result = sitemap();

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });
});
