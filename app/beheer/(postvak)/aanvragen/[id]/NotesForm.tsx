"use client";

import { useActionState } from "react";
import { Button } from "@/components/ds";
import { saveNotes, type FormState } from "@/app/beheer/actions";

export default function NotesForm({ id, notes }: { id: string; notes: string | null }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(saveNotes, null);

  return (
    <form className="bh-notes__form" action={formAction}>
      <input type="hidden" name="id" value={id} />
      <textarea
        className="bh-textarea"
        name="notes"
        rows={5}
        maxLength={10000}
        defaultValue={notes ?? ""}
        placeholder="Interne notities bij deze aanvraag. Alleen zichtbaar in het beheer."
        aria-label="Notities"
        disabled={pending}
      />
      <div className="bh-notes__actions">
        <Button variant="secondary" size="sm" type="submit" disabled={pending}>
          {pending ? "Opslaan..." : "Bewaar notities"}
        </Button>
        <span className="bh-notes__feedback" role="status">
          {state?.ok && !pending ? "Opgeslagen" : ""}
          {state?.error && !pending ? state.error : ""}
        </span>
      </div>
    </form>
  );
}
