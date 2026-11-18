import { zipSync, strToU8 } from "fflate";
import { allBilling, readBilling } from "@/lib/billing/data";
import { archivedPdf, hashPdf } from "@/lib/billing/storage";
import { filterInvoices } from "@/lib/billing/model";
import { amsterdamDate } from "@/lib/beheer/model";
export const runtime = "nodejs";
export async function GET(request: Request) {
  const data = await allBilling(),
    query = new URL(request.url).searchParams;
  const invoices = filterInvoices(
    data.invoices,
    data.customers,
    {
      q: query.get("q") ?? "",
      year: query.get("year") ?? "",
      state: query.get("state") ?? "",
    },
    amsterdamDate(),
  );
  const headers = {
    "Cache-Control": "private, no-store",
    "X-Robots-Tag": "noindex, nofollow",
  };
  if (
    invoices.length > 200 ||
    invoices.reduce((n, i) => n + (i.pdf_bytes ?? 0), 0) > 64 * 1024 * 1024
  )
    return Response.json(
      {
        error:
          "Deze export is te groot (maximaal 200 documenten / 64 MB). Beperk de selectie met jaar- of statusfilters.",
      },
      { status: 413, headers },
    );
  const files: Record<string, Uint8Array> = {},
    manifest: {
      id: string;
      number: string | null;
      path: string | null;
      sha256: string | null;
      bytes: number | null;
      status: string;
    }[] = [],
    records = [];
  for (const i of invoices) {
    const detail = await readBilling(i.id);
    records.push({
      invoice: i,
      lines: detail.lines,
      payments: detail.payments,
      dispatches: detail.dispatches,
      audit: detail.audit,
    });
    const name = i.pdf_hash ? `pdf/${i.number}-${i.id}.pdf` : null;
    if (name && i.pdf_path && i.pdf_hash && i.pdf_bytes) {
      try {
        const bytes = await archivedPdf(i.pdf_path, i.pdf_hash, i.pdf_bytes);
        files[name] = bytes;
        manifest.push({
          id: i.id,
          number: i.number,
          path: name,
          sha256: hashPdf(bytes),
          bytes: bytes.length,
          status: "verified",
        });
      } catch {
        return Response.json(
          {
            error: `Export afgebroken: PDF ${i.id} is niet bereikbaar of de integriteit wijkt af.`,
          },
          { status: 503, headers },
        );
      }
    } else
      manifest.push({
        id: i.id,
        number: i.number,
        path: null,
        sha256: null,
        bytes: null,
        status: ["concept", "vervallen"].includes(i.status)
          ? "not_applicable"
          : "missing_pdf",
      });
  }
  files["facturen.json"] = strToU8(
    JSON.stringify(
      {
        exported_at: new Date().toISOString(),
        time_zone: "Europe/Amsterdam",
        records,
      },
      null,
      2,
    ),
  );
  files["manifest.json"] = strToU8(JSON.stringify(manifest, null, 2));
  const archive = zipSync(files, { level: 1 });
  return new Response(Buffer.from(archive), {
    headers: {
      ...headers,
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="setpiece-facturen-${amsterdamDate()}.zip"`,
    },
  });
}
