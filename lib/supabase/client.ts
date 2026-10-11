import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseJsClient } from '@supabase/supabase-js';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-url')
);

export function createClient() {
  if (!isSupabaseConfigured) {
    return null;
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Single instance for direct client-side operations
export const supabase = isSupabaseConfigured 
  ? createSupabaseJsClient(supabaseUrl, supabaseAnonKey) 
  : null;
