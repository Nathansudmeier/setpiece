import "server-only";
import { billingStorageClient } from "./client";
import { billingCommand } from "./data";
import { renderInvoicePdf } from "./pdf";
import { invoiceSchema, type Invoice } from "./schema";
import { recoverInvoicePdf, verifyPdf } from "./pdf-recovery";
export { hashPdf, verifyPdf } from "./pdf-recovery";
async function readObject(path: string): Promise<Uint8Array | null> {
  const { data, error } = await billingStorageClient()
    .storage.from("facturen")
    .download(path);
  if (error) {
    if (["404", "400"].includes(String(error.statusCode))) return null;
    throw new Error("PDF-opslag controleren lukt niet. Probeer opnieuw.");
  }
  if (!data) return null;
  if (data.type !== "application/pdf")
    throw new Error("De opgeslagen PDF heeft een onbekend bestandstype.");
  return new Uint8Array(await data.arrayBuffer());
}
export async function archivedPdf(path: string, hash: string, length: number) {
  const b = await readObject(path);
  if (!b)
    throw new Error("De opgeslagen PDF is niet bereikbaar. Probeer opnieuw.");
  verifyPdf(b, hash, length);
  return b;
}
export async function ensureInvoicePdf(invoice: Invoice) {
  await recoverInvoicePdf(invoice, {
    read: readObject,
    render: async (i) => {
      if (!i.frozen) throw new Error("De definitieve inhoud ontbreekt.");
      return renderInvoicePdf(i.frozen, i.finalized_at);
    },
    prepare: async (i, hash, bytes) =>
      invoiceSchema.parse(
        await billingCommand(
          crypto.randomUUID(),
          "invoice.prepare_pdf",
          { id: i.id, hash, bytes, template_version: i.template_version },
          i.version,
        ),
      ),
    upload: async (path, bytes) => {
      const { error } = await billingStorageClient()
        .storage.from("facturen")
        .upload(path, bytes, { contentType: "application/pdf", upsert: false });
      if (error) throw new Error("Upload nog niet bevestigd.");
    },
    attach: async (i, path, hash, bytes) => {
      await billingCommand(
        crypto.randomUUID(),
        "invoice.attach_pdf",
        { id: i.id, path, hash, bytes },
        i.version,
      );
    },
  });
}
export const PDF_HEADERS = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "Referrer-Policy": "no-referrer",
  "Content-Type": "application/pdf",
  "X-Content-Type-Options": "nosniff",
};
