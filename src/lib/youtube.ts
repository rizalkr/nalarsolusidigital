/**
 * Utility functions for parsing YouTube links and generating embed URLs.
 */

/**
 * Extracts an 11-character YouTube video ID from various URL formats or raw ID string.
 */
export function extractYouTubeVideoId(input: string | null | undefined): string | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 1. Support pasting full <iframe> snippet
  const iframeMatch = trimmed.match(/<iframe\s+[^>]*src=["']([^"']+)["']/i);
  const target = iframeMatch ? iframeMatch[1].trim() : trimmed;

  // 2. Raw 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(target)) {
    return target;
  }

  // 3. URL formats
  try {
    const urlString =
      target.startsWith('http://') || target.startsWith('https://')
        ? target
        : `https://${target}`;
    const url = new URL(urlString);
    const hostname = url.hostname.replace(/^www\./, '').replace(/^m\./, '');

    if (hostname === 'youtube.com' || hostname === 'youtube-nocookie.com') {
      // /watch?v=ID
      const v = url.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
        return v;
      }
      // /shorts/ID, /embed/ID, /v/ID
      const pathParts = url.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2 && ['shorts', 'embed', 'v'].includes(pathParts[0])) {
        const id = pathParts[1];
        if (/^[a-zA-Z0-9_-]{11}$/.test(id)) {
          return id;
        }
      }
    } else if (hostname === 'youtu.be') {
      // youtu.be/ID
      const id = url.pathname.slice(1).split('/')[0];
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return id;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export interface YouTubeEmbedOptions {
  autoplay?: boolean;
}

/**
 * Generates privacy-friendly youtube-nocookie embed URL with autoplay parameters.
 */
export function getYouTubeEmbedUrl(
  input: string | null | undefined,
  options?: YouTubeEmbedOptions
): string | null {
  const videoId = extractYouTubeVideoId(input);
  if (!videoId) return null;

  const autoplay = options?.autoplay ?? true;
  const params = new URLSearchParams({
    rel: '0',
    ...(autoplay ? { autoplay: '1' } : {}),
  });

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

