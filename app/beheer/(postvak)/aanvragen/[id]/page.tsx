import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button } from "@/components/ds";
import { requireAdmin } from "@/lib/beheer/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/beheer/format";
import { STATUSES, type Submission } from "@/lib/beheer/statuses";
import StatusSelect from "./StatusSelect";
import NotesForm from "./NotesForm";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getSubmission(id: string): Promise<Submission | null> {
  if (!UUID_PATTERN.test(id)) return null;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("contact_submissions")
    .select("id, created_at, name, email, company, message, source, status, read_at, notes")
    .eq("id", id)
    .maybeSingle();

  return (data as Submission | null) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const submission = await getSubmission(id);
  return { title: submission ? `Aanvraag van ${submission.name}` : "Aanvraag" };
}

export default async function AanvraagPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) notFound();

  // Eerste keer geopend: markeer als gelezen. De pagina is per request
  // dynamisch, dus de lijst toont bij de volgende weergave de juiste stand.
  if (!submission.read_at) {
    const supabase = await createSupabaseServerClient();
    const readAt = new Date().toISOString();
    const { error } = await supabase
      .from("contact_submissions")
      .update({ read_at: readAt })
      .eq("id", submission.id)
      .is("read_at", null);
    if (!error) submission.read_at = readAt;
  }

  const firstName = submission.name.trim().split(/\s+/)[0];
  const replyHref =
    `mailto:${submission.email}` +
    `?subject=${encodeURIComponent("Re: jouw aanvraag via setpiece.nl")}` +
    `&body=${encodeURIComponent(`Hoi ${firstName},\n\nBedankt voor je bericht.\n\n`)}`;

  return (
    <section className="bh-page">
      <Link href="/beheer" className="bh-back">
        <span aria-hidden="true">←</span> Postvak
      </Link>

      <div className="bh-detail">
        <article className="bh-detail__main">
          <header className="bh-detail__head">
            <div className="bh-detail__title">
              <h1 className="bh-h1">{submission.name}</h1>
              <Badge variant={STATUSES[submission.status].badge}>
                {STATUSES[submission.status].label}
              </Badge>
            </div>
            <p className="bh-detail__meta">
              <a href={`mailto:${submission.email}`}>{submission.email}</a>
              {submission.company && <span> · {submission.company}</span>}
              <span>
                {" "}
                · <time dateTime={submission.created_at}>{formatDateTime(submission.created_at)}</time>
              </span>
            </p>
          </header>

          <div className="sp-card sp-card--surface bh-message">
            <p className="bh-message__body">{submission.message}</p>
          </div>

          <div className="sp-card sp-card--tint bh-notes">
            <h2 className="bh-panel__title">Notities</h2>
            <NotesForm id={submission.id} notes={submission.notes} />
          </div>
        </article>

        <aside className="bh-detail__side">
          <div className="sp-card sp-card--surface bh-panel">
            <h2 className="bh-panel__title">Acties</h2>
            <Button variant="primary" size="md" href={replyHref}>
              Beantwoord per mail
            </Button>
            <div className="bh-panel__field">
              <label className="bh-label" htmlFor="status-select">
                Status
              </label>
              <StatusSelect id={submission.id} status={submission.status} />
            </div>
          </div>

          <div className="sp-card sp-card--outline bh-panel">
            <h2 className="bh-panel__title">Details</h2>
            <dl className="bh-dl">
              <div>
                <dt>Ontvangen</dt>
                <dd>{formatDateTime(submission.created_at)}</dd>
              </div>
              <div>
                <dt>Gelezen</dt>
                <dd>{submission.read_at ? formatDateTime(submission.read_at) : "Nog niet"}</dd>
              </div>
              <div>
                <dt>Bron</dt>
                <dd>{submission.source}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  );
}
