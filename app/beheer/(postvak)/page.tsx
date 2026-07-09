import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ds";
import { requireAdmin } from "@/lib/beheer/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCompact } from "@/lib/beheer/format";
import { STATUSES, isSubmissionStatus, type Submission } from "@/lib/beheer/statuses";

export const metadata: Metadata = {
  title: "Postvak",
};

const FILTERS = [
  { key: "alles", label: "Alles" },
  ...Object.entries(STATUSES).map(([key, value]) => ({ key, label: value.label })),
];

export default async function PostvakPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const rawFilter = typeof params.status === "string" ? params.status : "alles";
  const filter = isSubmissionStatus(rawFilter) ? rawFilter : "alles";

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("id, created_at, name, email, company, message, source, status, read_at, notes")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <section className="bh-page">
        <h1 className="bh-h1">Postvak</h1>
        <p className="bh-inline-error" role="alert">
          Het postvak laden lukte niet. Ververs de pagina of probeer het later opnieuw.
        </p>
      </section>
    );
  }

  const submissions = (data ?? []) as Submission[];
  const unreadCount = submissions.filter((s) => !s.read_at).length;
  const counts = new Map<string, number>([["alles", submissions.length]]);
  for (const s of submissions) {
    counts.set(s.status, (counts.get(s.status) ?? 0) + 1);
  }

  const visible = filter === "alles" ? submissions : submissions.filter((s) => s.status === filter);
  const now = new Date();

  return (
    <section className="bh-page">
      <header className="bh-page__head">
        <h1 className="bh-h1">Postvak</h1>
        <p className="bh-page__sub">
          {submissions.length === 0
            ? "Nog geen aanvragen."
            : `${submissions.length} ${submissions.length === 1 ? "aanvraag" : "aanvragen"}, waarvan ${unreadCount} ongelezen.`}
        </p>
      </header>

      <nav className="sp-tabs bh-tabs" aria-label="Filter op status">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "alles" ? "/beheer" : `/beheer?status=${f.key}`}
            className={`sp-tab${filter === f.key ? " sp-tab--active" : ""}`}
            aria-current={filter === f.key ? "page" : undefined}
          >
            {f.label}
            <span className="bh-tab__count">{counts.get(f.key) ?? 0}</span>
          </Link>
        ))}
      </nav>

      {visible.length === 0 ? (
        <div className="bh-empty">
          <span className="bh-empty__mark" aria-hidden="true">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="26" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
              <circle cx="28" cy="28" r="12" stroke="currentColor" strokeOpacity="0.45" strokeWidth="2" />
              <line x1="28" y1="2" x2="28" y2="16" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
              <line x1="28" y1="40" x2="28" y2="54" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
            </svg>
          </span>
          <p className="bh-empty__title">
            {filter === "alles" ? "Postvak leeg" : `Geen aanvragen met status "${STATUSES[filter].label}"`}
          </p>
          <p className="bh-empty__text">
            Nieuwe aanvragen via het formulier op setpiece.nl verschijnen hier vanzelf.
          </p>
        </div>
      ) : (
        <ul className="bh-list">
          {visible.map((s, index) => {
            const unread = !s.read_at;
            return (
              <li key={s.id} style={{ "--index": index } as React.CSSProperties}>
                <Link
                  href={`/beheer/aanvragen/${s.id}`}
                  prefetch={false}
                  className={`bh-row${unread ? " bh-row--unread" : ""}`}
                >
                  <span className="bh-row__dot" aria-hidden="true" />
                  <span className="bh-row__who">
                    <span className="bh-row__name">
                      {s.name}
                      {unread && <span className="bh-visually-hidden"> (ongelezen)</span>}
                    </span>
                    {s.company && <span className="bh-row__company">{s.company}</span>}
                  </span>
                  <span className="bh-row__preview">{s.message}</span>
                  <span className="bh-row__meta">
                    <Badge variant={STATUSES[s.status].badge}>{STATUSES[s.status].label}</Badge>
                    <time className="bh-row__time" dateTime={s.created_at}>
                      {formatCompact(s.created_at, now)}
                    </time>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
