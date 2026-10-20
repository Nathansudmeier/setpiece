import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/beheer/auth";
import { logout } from "../actions";
import Navigation from "@/components/beheer/Navigation";
export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  return (
    <div className="bh-shell bw-shell">
      <a className="bw-skip" href="#main-content">
        Naar de inhoud
      </a>
      <header className="bw-top">
        <Link href="/beheer" aria-label="Setpiece vandaag">
          <Image
            src="/logos/workspoor/setpiece-logo-paper.svg"
            alt="Setpiece"
            width={140}
            height={36}
            loading="eager"
            style={{width:140,height:"auto"}}
          />
        </Link>
        <span className="bw-top__label">Jouw werkruimte</span>
        <details className="bw-account">
          <summary>Account</summary>
          <div>
            <p>{session.email}</p>
            <Link href="/beheer/export">Exporteer je werk</Link>
            <form action={logout}>
              <button>Uitloggen</button>
            </form>
          </div>
        </details>
      </header>
      <Navigation />
      <main id="main-content" className="bw-main">
        {children}
      </main>
      <footer className="bw-footer">
        Besloten Setpiece-omgeving{" "}
        <span>Planning en weergave: Europe/Amsterdam</span>
      </footer>
    </div>
  );
}
