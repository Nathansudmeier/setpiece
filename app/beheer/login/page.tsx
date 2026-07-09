import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ds";
import { logout } from "../actions";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Inloggen",
};

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();

  // Al ingelogd als beheerder: direct door naar het postvak.
  // Ingelogd zonder beheerrechten: laat dat zien in plaats van te loopen.
  if (data?.claims) {
    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.claims.sub)
      .maybeSingle();

    if (adminRow) redirect("/beheer");

    return (
      <main className="bh-login">
        <div className="bh-login__card">
          <img
            className="bh-login__logo"
            src="/logos/setpiece-logo-wit.png"
            alt="Setpiece"
            width={140}
            height={32}
          />
          <h1 className="bh-login__title">Geen toegang</h1>
          <p className="bh-login__intro">
            Dit account heeft geen beheerrechten. Log uit en probeer het met een ander account.
          </p>
          <form action={logout}>
            <Button variant="on-dark" size="md" type="submit">
              Log uit
            </Button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="bh-login">
      <div className="bh-login__card">
        <img
          className="bh-login__logo"
          src="/logos/setpiece-logo-wit.png"
          alt="Setpiece"
          width={140}
          height={32}
        />
        <h1 className="bh-login__title">Beheer</h1>
        <p className="bh-login__intro">Log in om het postvak en de site te beheren.</p>
        <LoginForm />
      </div>
    </main>
  );
}
