import { createHash } from "node:crypto";
import type { Invoice } from "./schema";
export const hashPdf = (bytes: Uint8Array) =>
  createHash("sha256").update(bytes).digest("hex");
export function verifyPdf(bytes: Uint8Array, hash: string, length: number) {
  if (
    bytes.length !== length ||
    bytes.length > 5242880 ||
    Buffer.from(bytes.subarray(0, 5)).toString() !== "%PDF-" ||
    hashPdf(bytes) !== hash
  )
    throw new Error(
      "De PDF-integriteit kan niet worden bevestigd. Er zijn geen bytes vrijgegeven.",
    );
}
export type PdfRecoveryIO = {
  read: (path: string) => Promise<Uint8Array | null>;
  render: (invoice: Invoice) => Promise<Uint8Array>;
  prepare: (invoice: Invoice, hash: string, bytes: number) => Promise<Invoice>;
  upload: (path: string, bytes: Uint8Array) => Promise<void>;
  attach: (
    invoice: Invoice,
    path: string,
    hash: string,
    bytes: number,
  ) => Promise<void>;
};
/** The archive object is authoritative once uploaded. Every re-entry begins with fresh SQL state. */
export async function recoverInvoicePdf(
  initial: Invoice,
  io: PdfRecoveryIO,
): Promise<void> {
  let i = initial;
  if (i.pdf_path && i.pdf_hash && i.pdf_bytes) {
    const b = await io.read(i.pdf_path);
    if (!b) throw new Error("De opgeslagen PDF is niet bereikbaar.");
    verifyPdf(b, i.pdf_hash, i.pdf_bytes);
    return;
  }
  if (i.status !== "definitief" || !i.frozen || !i.sequence_year || !i.number)
    throw new Error("Maak het gecontroleerde concept eerst definitief.");
  const path = `${i.owner_id}/${i.sequence_year}/${i.number}-${i.id}.pdf`;
  if (i.pdf_prepared_hash && i.pdf_prepared_bytes) {
    const b = await io.read(path);
    if (b) {
      verifyPdf(b, i.pdf_prepared_hash, i.pdf_prepared_bytes);
      await io.attach(i, path, i.pdf_prepared_hash, i.pdf_prepared_bytes);
      return;
    }
  }
  const bytes = await io.render(i),
    hash = hashPdf(bytes);
  verifyPdf(bytes, hash, bytes.length);
  if (
    i.pdf_prepared_hash &&
    (i.pdf_prepared_hash !== hash || i.pdf_prepared_bytes !== bytes.length)
  )
    throw new Error(
      `PDF ${i.id}: de voorbereiding heeft andere bytes. Herstel met de vastgelegde renderer/assets; het archief wordt nooit overschreven.`,
    );
  if (!i.pdf_prepared_hash) i = await io.prepare(i, hash, bytes.length);
  try {
    await io.upload(path, bytes);
  } catch {
    const b = await io.read(path);
    if (!b)
      throw new Error(
        "De PDF is voorbereid, maar uploaden is nog niet bevestigd. Kies PDF maken om te hervatten.",
      );
    verifyPdf(b, hash, bytes.length);
  }
  const stored = await io.read(path);
  if (!stored)
    throw new Error(
      "Upload is nog niet bevestigd. Kies PDF maken om te hervatten.",
    );
  verifyPdf(stored, hash, bytes.length);
  await io.attach(i, path, hash, bytes.length);
}
