import { createBrowserClient } from "@supabase/ssr";

// Browserclient (singleton) voor client components, zoals het
// contactformulier. Deelt de cookie-sessie met de serverkant (/beheer).
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
