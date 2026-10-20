"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { quickUpdate } from "@/app/beheer/work-actions";
import { nextFollowUpDate, type WorkItem } from "@/lib/beheer/model";
export default function QuickActions({ item }: { item: WorkItem }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();
  function run(patch: Record<string, unknown>) {
    const f = new FormData();
    for (const [k, v] of Object.entries({
      id: item.id,
      kind: item.kind,
      version: String(item.version),
      request_id: crypto.randomUUID(),
      patch: JSON.stringify(patch),
    }))
      f.set(k, v);
    start(async () => {
      try {
        await quickUpdate(f);
        setError("");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Bijwerken lukte niet.");
      }
    });
  }
  return (
    <div className="bw-quick">
      <p>Snel bijwerken</p>
      {error && (
        <p role="alert" className="bw-error">
          {error}
        </p>
      )}
      {["afgerond", "gearchiveerd"].includes(item.status) ? (
        <button disabled={pending} onClick={() => run({ status: "open" })}>
          Heropenen
        </button>
      ) : (
        <>
          <button
            disabled={pending || (!item.result && item.kind === "task")}
            onClick={() => run({ status: "afgerond" })}
          >
            Afronden
            {!item.result && item.kind === "task"
              ? " (vul eerst resultaat in)"
              : ""}
          </button>
          <button
            disabled={pending}
            onClick={() =>
              run({
                follow_up_on: nextFollowUpDate(),
              })
            }
          >
            Morgen opvolgen
          </button>
          <button
            disabled={pending}
            onClick={() => run({ status: "gearchiveerd" })}
          >
            Archiveren
          </button>
        </>
      )}
    </div>
  );
}
