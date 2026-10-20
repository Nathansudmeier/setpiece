"use client";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveWork } from "@/app/beheer/work-actions";
import {
  ASSIGNEES,
  WORKSPACES,
  WORK_STATUSES,
  type WorkItem,
  type WorkKind,
  type Person,
} from "@/lib/beheer/model";
import PersonPicker from "./PersonPicker";
export default function WorkForm({
  kind,
  item,
  projects,
  people,
  initialPerson,
}: {
  kind: WorkKind;
  item?: WorkItem;
  projects: WorkItem[];
  people: Person[];
  initialPerson?: Person;
}) {
  const [state, action, pending] = useActionState(saveWork, null);
  const router = useRouter();
  const [requestId] = useState(() => crypto.randomUUID());
  const [docs, setDocs] = useState(
    item?.documents.length ? item.documents : [{ title: "", url: "" }],
  );
  useEffect(() => {
    if (state?.ok) {
      if (!item && state.id) router.push(`/beheer/werk/${state.id}`);
      else {
        router.refresh();
      }
    }
  }, [state, item, router]);
  const person = (id?: string | null) => people.filter((p) => p.id === id);
  return (
    <form action={action} className="bw-form">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <input type="hidden" name="version" value={item?.version ?? ""} />
      <input type="hidden" name="request_id" value={requestId} />
      {state?.error && (
        <p role="alert" className="bw-error" tabIndex={-1}>
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="bw-notice">
          Opgeslagen.
        </p>
      )}
      <fieldset>
        <legend>
          {kind === "project"
            ? "Het gewenste resultaat"
            : kind === "decision"
              ? "Het voorstel"
              : "De eerstvolgende stap"}
        </legend>
        <label>
          {kind === "project" ? "Projectnaam" : "Titel"}
          <input
            name="title"
            required
            maxLength={240}
            defaultValue={item?.title}
          />
        </label>
        <label>
          {kind === "project"
            ? "Gewenst resultaat"
            : kind === "decision"
              ? "Context en voorgestelde vervolgstap"
              : "Toelichting"}
          <textarea
            aria-label={
              kind === "project"
                ? "Gewenst resultaat"
                : kind === "decision"
                  ? "Context en voorgestelde vervolgstap"
                  : "Toelichting"
            }
            name="description"
            rows={4}
            maxLength={20000}
            defaultValue={item?.description}
          />
        </label>
        <div className="bw-grid">
          <label>
            Werkgebied
            <select
              aria-label="Werkgebied"
              name="workspace"
              defaultValue={item?.workspace ?? "setpiece"}
            >
              {Object.entries(WORKSPACES).map(([v, l]) => (
                <option value={v} key={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label>
            Prioriteit
            <select
              aria-label="Prioriteit"
              name="priority"
              defaultValue={item?.priority ?? 2}
            >
              <option value="1">Hoog</option>
              <option value="2">Normaal</option>
              <option value="3">Laag</option>
            </select>
          </label>
          <label>
            Status
            <select
              aria-label="Status"
              name="status"
              defaultValue={item?.status ?? "open"}
            >
              {Object.entries(WORK_STATUSES).map(([v, l]) => (
                <option value={v} key={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label>
            Verantwoordelijke
            <input
              aria-label="Verantwoordelijke"
              name="assignee"
              list="work-assignees"
              required
              maxLength={120}
              defaultValue={item?.assignee ?? "Nathan"}
            />
            <datalist id="work-assignees">
              {ASSIGNEES.map((x) => (
                <option key={x} value={x} />
              ))}
            </datalist>
            <small>Typ een naam of kies een bot. Koppel hieronder eventueel de bestaande persoon.</small>
          </label>
        </div>
        <PersonPicker
          name="assignee_person_id"
          label="Verantwoordelijke persoon (optioneel)"
          initial={person(item?.assignee_person_id)}
        />
        {kind !== "project" && (
          <label>
            Project
            <select
              aria-label="Project"
              name="project_id"
              defaultValue={item?.project_id ?? ""}
            >
              <option value="">Zelfstandige actie / voorstel</option>
              {projects.map((p) => (
                <option value={p.id} key={p.id}>
                  {p.title} · {WORKSPACES[p.workspace]}
                </option>
              ))}
            </select>
            <small>Het werkgebied moet overeenkomen met het project.</small>
          </label>
        )}
        <label>
          Eerstvolgende stap of mijlpaal
          <input
            aria-label="Eerstvolgende stap of mijlpaal"
            name="next_step"
            maxLength={2000}
            defaultValue={item?.next_step}
          />
        </label>
        <div className="bw-grid">
          <label>
            {kind === "project"
              ? "Einddatum (afspraak)"
              : "Deadline (afspraak)"}
            <input
              aria-label={
                kind === "project"
                  ? "Einddatum (afspraak)"
                  : "Deadline (afspraak)"
              }
              type="date"
              name="due_on"
              defaultValue={item?.due_on ?? ""}
            />
          </label>
          <label>
            Opvolgdatum (herinnering)
            <input
              type="date"
              name="follow_up_on"
              defaultValue={item?.follow_up_on ?? ""}
            />
          </label>
        </div>
        <PersonPicker
          name="waiting_person_id"
          label="Wachten op"
          initial={person(item?.waiting_person_id)}
        />
      </fieldset>
      <fieldset>
        <legend>Bron en uitvoering</legend>
        <label>
          Bronlink
          <input
            aria-label="Bronlink"
            name="source_url"
            type="url"
            placeholder="https://…"
            defaultValue={item?.source_url}
          />
        </label>
        <label>
          Bronbericht of verwijzing
          <input
            aria-label="Bronbericht of verwijzing"
            name="source_ref"
            maxLength={2000}
            defaultValue={item?.source_ref}
            placeholder="Bijvoorbeeld kanaal, bericht-ID en datum"
          />
        </label>
        <label>
          Bewijs van gestarte uitvoering
          <input
            aria-label="Bewijs van gestarte uitvoering"
            name="execution_ref"
            maxLength={2000}
            defaultValue={item?.execution_ref}
          />
          <small>
            Een opdracht toewijzen start de bot nog niet. Bezig vereist een
            concrete uitvoeringsverwijzing.
          </small>
        </label>
        {kind === "decision" ? (
          <>
            <label>
              Oordeel
              <select
                aria-label="Oordeel"
                name="result"
                defaultValue={item?.result ?? ""}
              >
                <option value="">Nog te beoordelen</option>
                <option value="goedgekeurd">Goedgekeurd</option>
                <option value="afgewezen">Afgewezen</option>
                <option value="teruggegeven">Teruggegeven</option>
              </select>
            </label>
            <p>
              Bewaar je oordeel met status Afgerond. Een goedkeuring verstuurt
              of publiceert niets. Leg de toegestane vervolgstap vast of draag
              die apart over aan Jarvis.
            </p>
          </>
        ) : (
          <label>
            Resultaat of opleververwijzing
            <textarea
              aria-label="Resultaat of opleververwijzing"
              name="result"
              maxLength={10000}
              rows={3}
              defaultValue={item?.result}
            />
            <small>Verplicht bij het afronden van een actie.</small>
          </label>
        )}
      </fieldset>
      <fieldset>
        <legend>Personen en naslag</legend>
        <PersonPicker
          name="people"
          label="Betrokken personen"
          multiple
          initial={
            item
              ? people.filter((p) => item.people.includes(p.id))
              : initialPerson
                ? [initialPerson]
                : []
          }
        />
        <label>
          {kind === "decision" ? "Terugkoppeling bij je oordeel" : "Notities"}
          <textarea
            aria-label={
              kind === "decision" ? "Terugkoppeling bij je oordeel" : "Notities"
            }
            name="notes"
            maxLength={20000}
            rows={4}
            defaultValue={item?.notes}
          />
        </label>
        {docs.map((d, i) => (
          <div className="bw-grid" key={i}>
            <label>
              Documentnaam
              <input name="document_title" defaultValue={d.title} />
            </label>
            <label>
              Documentlink
              <input type="url" name="document_url" defaultValue={d.url} />
            </label>
          </div>
        ))}
        <button
          type="button"
          className="bw-secondary"
          onClick={() => setDocs([...docs, { title: "", url: "" }])}
          disabled={docs.length >= 30}
        >
          Documentverwijzing toevoegen
        </button>
      </fieldset>
      <div className="bw-save">
        <button className="bw-primary" disabled={pending}>
          {pending ? "Opslaan…" : "Opslaan"}
        </button>
        <Link
          href={
            kind === "project"
              ? "/beheer/projecten"
              : kind === "decision"
                ? "/beheer/beslissingen"
                : "/beheer/acties"
          }
        >
          Terug naar overzicht
        </Link>
      </div>
    </form>
  );
}
