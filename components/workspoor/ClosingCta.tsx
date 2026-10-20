import Link from "next/link";
import { readPublished } from "@/lib/cms/read";
import type { CmsCopy } from "@/lib/cms/schema";
export default async function ClosingCta({
  title,
  body,
  sharedCopy,
}: {
  title?: string;
  body?: string;
  sharedCopy?: CmsCopy;
}) {
  const copy = sharedCopy ?? (await readPublished("shared"));
  return (
    <section className="ws-closing" aria-labelledby="closing-title">
      <div className="ws-frame ws-closing__grid">
        <h2 id="closing-title">{title ?? copy.cta_title}</h2>
        <div>
          <p>{body ?? copy.cta_body}</p>
          <Link className="ws-button" href={copy.link_cta}>
            {copy.cta_label}
          </Link>
        </div>
      </div>
    </section>
  );
}
