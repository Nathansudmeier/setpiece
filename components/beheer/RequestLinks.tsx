"use client";
import { useActionState, useState } from "react";
import { saveRequestLink } from "@/app/beheer/work-actions";
import type { Person, RequestLink, WorkItem } from "@/lib/beheer/model";
import PersonPicker from "./PersonPicker";
export default function RequestLinks({
  submissionId,
  link,
  items,
  person,
}: {
  submissionId: string;
  link?: RequestLink;
  items: WorkItem[];
  person?: Person;
}) {
  const [state, action, pending] = useActionState(saveRequestLink, null);
  const [requestId] = useState(() => crypto.randomUUID());
  return (
    <form action={action} className="bw-form bw-panel">
      <h2>Verbind met je werk</h2>
      {link && <p role="status"><strong>Koppeling opgeslagen.</strong> <small>Versie {link.version}</small></p>}
      <p>
        Kies bestaande gegevens. Er wordt geen nieuwe persoon, actie of project
        aangemaakt.
      </p>
      <input type="hidden" name="submission_id" value={submissionId} />
      <input type="hidden" name="version" value={link?.version ?? ""} />
      <input type="hidden" name="request_id" value={requestId} />
      <PersonPicker
        name="person_id"
        label="Persoon"
        initial={person ? [person] : []}
      />
      {(["project", "task"] as const).map((kind) => (
        <label key={kind}>
          {kind === "project" ? "Project" : "Actie"}
          <select
            name={`${kind}_id`}
            defaultValue={
              kind === "project"
                ? (link?.project_id ?? "")
                : (link?.task_id ?? "")
            }
          >
            <option value="">Geen koppeling</option>
            {items
              .filter((x) => x.kind === kind)
              .map((x) => (
                <option value={x.id} key={x.id}>
                  {x.title}
                </option>
              ))}
          </select>
        </label>
      ))}
      {state?.error && (
        <p role="alert" className="bw-error">
          {state.error}
        </p>
      )}
      {state?.ok && <p role="status">Koppeling opgeslagen.</p>}
      <button className="bw-secondary" disabled={pending}>
        {pending ? "Opslaan…" : "Koppeling opslaan"}
      </button>
    </form>
  );
}
