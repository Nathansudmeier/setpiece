import Link from "next/link";
import { requireAdmin } from "@/lib/beheer/auth";
import { logout } from "../actions";

export default async function PostvakLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="bh-shell">
      <header className="bh-topbar">
        <Link href="/beheer" className="bh-topbar__brand">
          <img src="/logos/setpiece-logo-wit.png" alt="Setpiece" width={122} height={28} />
          <span className="bh-topbar__label">Beheer</span>
        </Link>
        <div className="bh-topbar__actions">
          <span className="bh-topbar__user">{session.email}</span>
          <form action={logout}>
            <button type="submit" className="bh-topbar__logout">
              Log uit
            </button>
          </form>
        </div>
      </header>
      <main className="bh-main">{children}</main>
    </div>
  );
}
