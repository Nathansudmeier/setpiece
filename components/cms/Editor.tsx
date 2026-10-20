"use client";
import Link from "next/link";
import { useActionState } from "react";
import { changeCms } from "@/app/beheer/cms-actions";
import { CMS_SCHEMA, type CmsSlug } from "@/lib/cms/schema";
import type { CmsDocument } from "@/lib/cms/admin";
export function CmsAction({
  doc,
  intent,
  revisionId,
  children,
}: {
  doc: CmsDocument;
  intent: "publish" | "restore";
  revisionId?: string;
  children: React.ReactNode;
}) {
  const [state, action, pending] = useActionState(changeCms, null);
  return (
    <form action={action}>
      <input type="hidden" name="slug" value={doc.slug} />
      <input type="hidden" name="version" value={doc.version} />
      <input type="hidden" name="intent" value={intent} />
      <input type="hidden" name="request_id" value={crypto.randomUUID()} />
      {revisionId && (
        <input type="hidden" name="revision_id" value={revisionId} />
      )}
      <button className="bw-secondary" disabled={pending}>
        {pending ? "Verwerken…" : children}
      </button>
      {state?.error && (
        <p role="alert" className="bw-error">
          {state.error}
        </p>
      )}
      {state?.ok && <p role="status">{state.message}</p>}
    </form>
  );
}
export default function Editor({ doc }: { doc: CmsDocument }) {
  const [state, action, pending] = useActionState(changeCms, null);
  const schema = CMS_SCHEMA[doc.slug as CmsSlug];
  return (
    <form action={action} className="bw-form bw-cms-form">
      <input type="hidden" name="slug" value={doc.slug} />
      <input type="hidden" name="version" value={doc.version} />
      <input type="hidden" name="intent" value="save" />
      <input type="hidden" name="request_id" value={crypto.randomUUID()} />
      {state?.error && (
        <p role="alert" className="bw-error">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="bw-notice">
          {state.message}
        </p>
      )}
      {Object.entries(schema.fields).map(([key, f], i) => (
        <label key={key} className="bw-cms-field">
          <span>
            {f.label}{" "}
            <small>
              {i + 1} ·{" "}
              {f.value.length > 90 ? f.value.slice(0, 87) + "…" : f.value}
            </small>
          </span>
          {f.type === "textarea" ? (
            <textarea
              name={key}
              rows={3}
              required
              maxLength={10000}
              defaultValue={doc.draft[key] ?? f.value}
            />
          ) : (
            <input
              name={key}
              required
              maxLength={10000}
              defaultValue={doc.draft[key] ?? f.value}
            />
          )}
        </label>
      ))}
      <div className="bw-save">
        <button className="bw-primary" disabled={pending}>
          {pending ? "Opslaan…" : "Concept opslaan"}
        </button>
        <Link href={`/beheer/website/${doc.slug}/preview`} prefetch={false}>
          Opgeslagen concept bekijken
        </Link>
      </div>
    </form>
  );
}
