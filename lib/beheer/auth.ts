import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type BeheerSession = {
  userId: string;
  email: string;
};

// Data Access Layer-check: elke beheerpagina en server action gaat hierdoorheen.
// De proxy doet alleen een optimistische sessiecheck; hier verifiëren we het
// JWT én het admin-lidmaatschap. cache() dedupliceert binnen één request.
export const requireAdmin = cache(async (): Promise<BeheerSession> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) redirect("/beheer/login");

  // RLS laat een gebruiker alleen de eigen admin-rij zien; geen rij betekent
  // ingelogd maar geen beheerder. De loginpagina toont dan "geen toegang".
  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", claims.sub)
    .maybeSingle();

  if (!adminRow) redirect("/beheer/login");

  return {
    userId: claims.sub,
    email: typeof claims.email === "string" ? claims.email : "",
  };
});
