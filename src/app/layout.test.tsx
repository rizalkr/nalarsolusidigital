import { describe, it, expect } from 'vitest';
import RootLayout, { metadata, viewport } from './layout';
import { siteConfig } from '@/config/site';

describe('RootLayout and Metadata Configuration', () => {
  it('exports valid viewport configuration with brand theme color', () => {
    expect(viewport).toBeDefined();
    expect(viewport.width).toBe('device-width');
    expect(viewport.initialScale).toBe(1);
    expect(viewport.themeColor).toBe('#1E2B4B');
  });

  it('exports comprehensive metadata with title, description, and metadataBase', () => {
    expect(metadata.metadataBase).toBeInstanceOf(URL);
    expect(metadata.metadataBase?.protocol).toMatch(/^https?:$/);
    expect(metadata.title).toEqual({
      default: `${siteConfig.name} - Solusi Website untuk Usaha Lokal`,
      template: `%s | ${siteConfig.name}`,
    });
    expect(metadata.description).toBe(siteConfig.description);
    expect(metadata.icons).toEqual({
      icon: '/favicon.ico',
    });
  });

  it('exports complete Open Graph metadata matching PRD requirements', () => {
    expect(metadata.openGraph).toBeDefined();
    const og = metadata.openGraph;

    expect(og?.title).toBe(`${siteConfig.name} - Solusi Website untuk Usaha Lokal`);
    expect(og?.description).toBe(siteConfig.description);
    expect(og?.siteName).toBe(siteConfig.name);
    expect(og?.locale).toBe('id_ID');
    if (og && 'type' in og) {
      expect(og.type).toBe('website');
    } else {
      expect.fail('Expected openGraph to include type website');
    }

    expect(Array.isArray(og?.images)).toBe(true);
    const images = og?.images as Array<{ url: string; width: number; height: number; alt: string }>;
    expect(images.length).toBeGreaterThan(0);
    expect(images[0].url).toBe(siteConfig.logo.portrait.src);
    expect(images[0].width).toBe(siteConfig.logo.portrait.width);
    expect(images[0].height).toBe(siteConfig.logo.portrait.height);
    expect(images[0].alt).toBe(siteConfig.name);

    if (siteConfig.isSiteUrlConfigured) {
      expect(og?.url).toBe(siteConfig.siteUrl);
    }
  });

  it('exports complete Twitter Card metadata with summary_large_image', () => {
    expect(metadata.twitter).toBeDefined();
    const twitter = metadata.twitter;

    if (twitter && 'card' in twitter) {
      expect(twitter.card).toBe('summary_large_image');
    } else {
      expect.fail('Expected twitter to include card summary_large_image');
    }
    expect(twitter?.title).toBe(`${siteConfig.name} - Solusi Website untuk Usaha Lokal`);
    expect(twitter?.description).toBe(siteConfig.description);
    expect(twitter?.images).toEqual([siteConfig.logo.portrait.src]);
  });

  it('renders root layout with id lang, font variable, and body styling', () => {
    const testChild = <div data-testid="test-child">Konten Uji</div>;
    const element = RootLayout({ children: testChild });

    expect(element.type).toBe('html');
    expect(element.props.lang).toBe('id');
    expect(element.props.className).toBe('--font-plus-jakarta-sans');

    const bodyElement = element.props.children;
    expect(bodyElement.type).toBe('body');
    expect(bodyElement.props.className).toContain('min-h-screen');
    expect(bodyElement.props.className).toContain('bg-background');
    expect(bodyElement.props.className).toContain('text-text-primary');
    expect(bodyElement.props.children).toContain(testChild);
  });
});
