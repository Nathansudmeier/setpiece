import Link from "next/link";
import { notFound } from "next/navigation";
import { isCmsSlug } from "@/lib/cms/schema";
import { readCmsAdmin } from "@/lib/cms/admin";
import { readPublished } from "@/lib/cms/read";
import Preview from "@/components/cms/Preview";
export const metadata = {
  title: "Besloten voorvertoning",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isCmsSlug(slug)) notFound();
  const doc = await readCmsAdmin(slug);
  const sharedCopy =
    slug === "shared" ? doc.draft : await readPublished("shared");
  const copy = slug === "shared" ? await readPublished("home") : doc.draft;
  return (
    <>
      <div className="bw-preview-bar">
        <strong>Besloten conceptvoorvertoning · versie {doc.version}</strong>
        <Link href={`/beheer/website/${slug}`}>Terug naar bewerken</Link>
        <p>
          Links openen de openbare website. Het contactformulier is in deze
          voorvertoning uitgeschakeld.
        </p>
      </div>
      <div className="bw-preview">
        <Preview
          slug={slug === "shared" ? "home" : slug}
          copy={copy}
          sharedCopy={sharedCopy}
        />
      </div>
    </>
  );
}
