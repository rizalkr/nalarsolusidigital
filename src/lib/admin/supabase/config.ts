/**
 * Centralized Supabase public configuration.
 * Supports both modern NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and legacy NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey),
  };
}

export function requireSupabaseConfig() {
  const { url, anonKey, isConfigured } = getSupabaseConfig();

  if (!isConfigured || !url || !anonKey) {
    throw new Error(
      'Supabase URL or Publishable/Anon Key is missing from environment variables.'
    );
  }

  return { url, anonKey };
}

