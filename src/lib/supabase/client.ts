import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://vhpcbfvoowbhsrtozxlg.supabase.co/rest/v1/";

let browserClient: SupabaseClient | null = null;

function normalizeSupabaseUrl(value: string) {
  return value.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

function parseAdminEmails(value?: string) {
  return (value ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function getSupabasePublicConfig() {
  const projectUrl = normalizeSupabaseUrl(
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
      process.env.NEXT_PUBLIC_SUPABASE_REST_URL ??
      DEFAULT_SUPABASE_URL,
  );
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "";

  return {
    projectUrl,
    restUrl: `${projectUrl}/rest/v1`,
    publishableKey,
    adminEmails: parseAdminEmails(process.env.NEXT_PUBLIC_ADMIN_EMAILS),
    isConfigured: Boolean(projectUrl && publishableKey),
  };
}

export function getSupabaseBrowserClient() {
  const { projectUrl, publishableKey, isConfigured } = getSupabasePublicConfig();

  if (!isConfigured) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(projectUrl, publishableKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    });
  }

  return browserClient;
}
