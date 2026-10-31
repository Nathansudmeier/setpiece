"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/beheer/auth";
import { billingCommand, readBilling } from "@/lib/billing/data";
import { ensureInvoicePdf } from "@/lib/billing/storage";
import type { Json } from "@/lib/billing/client";
const operations = new Set([
  "settings.update",
  "customer.create",
  "customer.update",
  "invoice.create",
  "invoice.update",
  "invoice.void",
  "invoice.finalize",
  "invoice.credit",
  "invoice.correct",
  "payment.record",
  "payment.reverse",
  "dispatch.cancel",
  "dispatch.requeue",
  "invoice.mark_sent",
]);
export type BillingResult = {
  ok: boolean;
  error?: string;
  id?: string;
  replacement_id?: string;
  version?: number;
};
export async function mutateBilling(
  request: string,
  operation: string,
  payload: Json,
  version: number | null,
): Promise<BillingResult> {
  await requireAdmin();
  if (!operations.has(operation) || request.length < 8 || request.length > 160)
    return { ok: false, error: "Onbekende facturatiehandeling." };
  try {
    const data = await billingCommand(request, operation, payload, version);
    const result = z
      .object({
        id: z.string().optional(),
        version: z.number().int().optional(),
        replacement_id: z.string().nullable().optional(),
      })
      .passthrough()
      .parse(data);
    const reread =
      result.id && ["invoice.create", "invoice.update"].includes(operation)
        ? await readBilling(result.id)
        : null;
    revalidatePath("/beheer", "layout");
    return {
      ok: true,
      id: result.id,
      replacement_id: result.replacement_id ?? undefined,
      version: reread?.invoices[0]?.version ?? result.version,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Opslaan is niet bevestigd. Probeer dezelfde poging opnieuw.",
    };
  }
}
export async function makeInvoicePdf(id: string): Promise<BillingResult> {
  await requireAdmin();
  if (!z.string().uuid().safeParse(id).success)
    return { ok: false, error: "Ongeldige factuur." };
  try {
    const data = await readBilling(id),
      invoice = data.invoices[0];
    if (!invoice) return { ok: false, error: "Factuur niet beschikbaar." };
    await ensureInvoicePdf(invoice);
    revalidatePath("/beheer", "layout");
    return { ok: true, id };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "De PDF is nog niet gemaakt. Probeer opnieuw.",
    };
  }
}
