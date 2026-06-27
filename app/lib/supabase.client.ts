import { createBrowserClient } from "@supabase/ssr";

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Returns a singleton Supabase browser client.
 * Safe to call multiple times — only one instance is created.
 */
export function getSupabaseBrowserClient() {
  if (supabaseClient) return supabaseClient;

  supabaseClient = createBrowserClient(
    window.ENV.SUPABASE_URL,
    window.ENV.SUPABASE_ANON_KEY
  );

  return supabaseClient;
}

/**
 * Extends the Window interface to include server-injected env vars.
 * These values are set in root.tsx via a <script> tag.
 */
declare global {
  interface Window {
    ENV: {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      GITHUB_URL: string;
      LINKEDIN_URL: string;
    };
  }
}
