import Link from "next/link";
import {
  WORKSPACES,
  WORK_STATUSES,
  dateLabel,
  type WorkItem,
} from "@/lib/beheer/model";
export default function WorkList({
  items,
  empty = "Er staat hier nog geen werk.",
}: {
  items: WorkItem[];
  empty?: string;
}) {
  return items.length ? (
    <ul className="bw-list">
      {items.map((item) => (
        <li key={item.id}>
          <Link className="bw-work-row" href={`/beheer/werk/${item.id}`}>
            <div>
              <span className="bw-eyebrow">
                {WORKSPACES[item.workspace]} · {item.assignee}
                {item.assignee_person_id ? " · persoon gekoppeld" : ""}
              </span>
              <strong>{item.title}</strong>
              {item.next_step && <p>{item.next_step}</p>}
            </div>
            <div className="bw-row-meta">
              <span className="bw-status">{WORK_STATUSES[item.status]}</span>
              <span>
                {item.priority === 1
                  ? "Hoge prioriteit"
                  : item.priority === 3
                    ? "Lage prioriteit"
                    : "Normale prioriteit"}
              </span>
              {item.due_on && <span>Deadline {dateLabel(item.due_on)}</span>}
              {item.follow_up_on && (
                <span>Opvolgen {dateLabel(item.follow_up_on)}</span>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <div className="bw-empty">
      <p>{empty}</p>
    </div>
  );
}
