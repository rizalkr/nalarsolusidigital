import { describe, it, expect, afterEach } from 'vitest';
import robots from './robots';
import { siteConfig } from '@/config/site';

describe('robots metadata route', () => {
  const originalSiteUrl = siteConfig.siteUrl;
  const originalIsConfigured = siteConfig.isSiteUrlConfigured;

  afterEach(() => {
    siteConfig.siteUrl = originalSiteUrl;
    siteConfig.isSiteUrlConfigured = originalIsConfigured;
  });

  it('generates valid robots configuration with wildcard user-agent and allowed root', () => {
    const result = robots();

    expect(result).toBeDefined();
    expect(result.rules).toBeDefined();

    if (Array.isArray(result.rules)) {
      expect(result.rules[0].userAgent).toBe('*');
      expect(result.rules[0].allow).toBe('/');
    } else {
      expect(result.rules.userAgent).toBe('*');
      expect(result.rules.allow).toBe('/');
    }
  });

  it('includes sitemap URL when siteUrl is configured', () => {
    siteConfig.siteUrl = 'https://nalarsolusidigital.my.id';
    siteConfig.isSiteUrlConfigured = true;

    const result = robots();

    expect(result.sitemap).toBe('https://nalarsolusidigital.my.id/sitemap.xml');
  });

  it('safely omits sitemap when siteUrl is unconfigured or empty', () => {
    siteConfig.siteUrl = '';
    siteConfig.isSiteUrlConfigured = false;

    const result = robots();

    expect(result.sitemap).toBeUndefined();
    expect(result.rules).toBeDefined();
  });

  it('safely omits sitemap when isSiteUrlConfigured is false even if siteUrl has a value', () => {
    siteConfig.siteUrl = 'https://unverified-domain.com';
    siteConfig.isSiteUrlConfigured = false;

    const result = robots();

    expect(result.sitemap).toBeUndefined();
    expect(result.rules).toBeDefined();
  });

  it('normalizes trailing slashes on siteUrl to prevent duplicate slashes', () => {
    siteConfig.siteUrl = 'https://nalarsolusidigital.my.id///';
    siteConfig.isSiteUrlConfigured = true;

    const result = robots();

    expect(result.sitemap).toBe('https://nalarsolusidigital.my.id/sitemap.xml');
  });

  it('safely omits sitemap when siteUrl contains only whitespace', () => {
    siteConfig.siteUrl = '   ';
    siteConfig.isSiteUrlConfigured = true;

    const result = robots();

    expect(result.sitemap).toBeUndefined();
  });
});
