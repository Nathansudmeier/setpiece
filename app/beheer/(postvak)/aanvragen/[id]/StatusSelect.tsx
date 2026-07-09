"use client";

import { useState, useTransition } from "react";
import { updateStatus } from "@/app/beheer/actions";
import { STATUSES, type SubmissionStatus } from "@/lib/beheer/statuses";

export default function StatusSelect({ id, status }: { id: string; status: SubmissionStatus }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value;
    setError(null);
    startTransition(async () => {
      const result = await updateStatus(id, next);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <>
      <div className="sp-select-wrap">
        <select
          id="status-select"
          className="sp-select"
          defaultValue={status}
          onChange={handleChange}
          disabled={pending}
        >
          {Object.entries(STATUSES).map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </select>
        <svg
          className="sp-select-chevron"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      {error && (
        <p className="bh-inline-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
