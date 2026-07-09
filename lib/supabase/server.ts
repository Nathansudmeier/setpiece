import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Serverclient voor Server Components, Server Actions en Route Handlers.
// Leest de sessie uit cookies; schrijven kan alleen in Server Actions.
// Het verversen van verlopen tokens gebeurt in proxy.ts.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components mogen geen cookies schrijven; de proxy
            // handelt sessieverversing af, dus dit is veilig te negeren.
          }
        },
      },
    }
  );
}
