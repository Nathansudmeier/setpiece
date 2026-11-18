import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json | undefined };
type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
    Functions: {
      sp_command: {
        Args: {
          p_request_id: string;
          p_operation: string;
          p_payload: Json;
          p_expected_version: number | null;
        };
        Returns: Json;
      };
      sp_billing_read: {
        Args: { p_id: string | null; p_after: string | null; p_limit: number };
        Returns: Json;
      };
      sp_invoice_pdf_consume: { Args: { p_hash: string }; Returns: Json };
    };
  };
};
export async function billingSessionClient() {
  const jar = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => jar.getAll(),
        setAll(values) {
          try {
            for (const v of values) jar.set(v.name, v.value, v.options);
          } catch {
            /* Server Component: proxy refreshes cookies. */
          }
        },
      },
    },
  );
}
export function billingStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key)
    throw new Error("Facturatieopslag is nog niet geconfigureerd.");
  return createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
