import { describe, it, expect } from 'vitest';
import { extractYouTubeVideoId, getYouTubeEmbedUrl } from './youtube';

describe('YouTube Utilities', () => {
  describe('extractYouTubeVideoId', () => {
    it('returns null for empty, whitespace, or invalid inputs', () => {
      expect(extractYouTubeVideoId('')).toBeNull();
      expect(extractYouTubeVideoId('   ')).toBeNull();
      expect(extractYouTubeVideoId(null)).toBeNull();
      expect(extractYouTubeVideoId(undefined)).toBeNull();
      expect(extractYouTubeVideoId('not-a-valid-youtube-link')).toBeNull();
      expect(extractYouTubeVideoId('https://google.com')).toBeNull();
    });

    it('extracts direct 11-char video ID', () => {
      expect(extractYouTubeVideoId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
      expect(extractYouTubeVideoId('abc_123-XYZ')).toBe('abc_123-XYZ');
    });

    it('extracts from standard watch URL', () => {
      expect(
        extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      ).toBe('dQw4w9WgXcQ');
      expect(
        extractYouTubeVideoId('http://youtube.com/watch?v=dQw4w9WgXcQ&t=10s')
      ).toBe('dQw4w9WgXcQ');
      expect(
        extractYouTubeVideoId('https://m.youtube.com/watch?v=dQw4w9WgXcQ')
      ).toBe('dQw4w9WgXcQ');
    });

    it('extracts from youtu.be short URL', () => {
      expect(extractYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe(
        'dQw4w9WgXcQ'
      );
      expect(extractYouTubeVideoId('http://youtu.be/dQw4w9WgXcQ?t=42')).toBe(
        'dQw4w9WgXcQ'
      );
    });

    it('extracts from shorts URL', () => {
      expect(
        extractYouTubeVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ')
      ).toBe('dQw4w9WgXcQ');
    });

    it('extracts from embed URL', () => {
      expect(
        extractYouTubeVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')
      ).toBe('dQw4w9WgXcQ');
      expect(
        extractYouTubeVideoId('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
      ).toBe('dQw4w9WgXcQ');
      expect(
        extractYouTubeVideoId('https://www.youtube.com/embed/myzmdNQ1Ssg?si=OHvLHY6LhOFhy3CX')
      ).toBe('myzmdNQ1Ssg');
    });

    it('extracts from full iframe HTML embed snippet', () => {
      const iframeSnippet =
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/myzmdNQ1Ssg?si=OHvLHY6LhOFhy3CX" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
      expect(extractYouTubeVideoId(iframeSnippet)).toBe('myzmdNQ1Ssg');
      expect(getYouTubeEmbedUrl(iframeSnippet)).toBe(
        'https://www.youtube-nocookie.com/embed/myzmdNQ1Ssg?rel=0&autoplay=1'
      );
    });
  });

  describe('getYouTubeEmbedUrl', () => {
    it('returns null for invalid inputs', () => {
      expect(getYouTubeEmbedUrl('')).toBeNull();
      expect(getYouTubeEmbedUrl(null)).toBeNull();
      expect(getYouTubeEmbedUrl('invalid')).toBeNull();
    });

    it('generates embed URL with autoplay enabled by default', () => {
      const result = getYouTubeEmbedUrl('https://youtu.be/dQw4w9WgXcQ');
      expect(result).toBe(
        'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1'
      );
    });

    it('generates embed URL without autoplay when autoplay: false', () => {
      const result = getYouTubeEmbedUrl('dQw4w9WgXcQ', { autoplay: false });
      expect(result).toBe(
        'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0'
      );
    });
  });
});

