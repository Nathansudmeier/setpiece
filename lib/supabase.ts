import { createClient } from "@supabase/supabase-js";

// Browser client voor de Setpiece marketing site. De site is statisch;
// Supabase staat klaar voor toekomstige features (intake, formulieren).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
