import Link from "next/link";

import WorkspoorShell from "@/components/workspoor/WorkspoorShell";

export default function NotFound() {
  return (
    <WorkspoorShell>
      <section className="ws-error-page">
        <div>
          <p className="ws-context">404</p>
          <h1>Dit spoor loopt hier niet verder.</h1>
          <p>De pagina bestaat niet meer of het adres klopt niet.</p>
          <Link className="ws-button" href="/">
            Naar de homepage
          </Link>
        </div>
      </section>
    </WorkspoorShell>
  );
}
