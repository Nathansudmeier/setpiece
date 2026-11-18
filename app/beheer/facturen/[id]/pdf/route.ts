import { z } from "zod";
import { renderInvoicePdf } from "@/lib/billing/pdf";
import { DEFAULT_SETTINGS, DEFAULT_CUSTOMER } from "@/lib/billing/schema";
import { readBilling } from "@/lib/billing/data";
import { archivedPdf, PDF_HEADERS } from "@/lib/billing/storage";
export const runtime = "nodejs";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success)
    return new Response(null, { status: 404, headers: PDF_HEADERS });
  const data = await readBilling(id),
    i = data.invoices[0];
  if (
    i?.status === "concept" &&
    new URL(request.url).searchParams.get("concept") === "1"
  ) {
    const frozen = {
      seller: data.settings?.data ?? DEFAULT_SETTINGS,
      customer:
        data.customers.find((c) => c.id === i.customer_id)?.data ??
        DEFAULT_CUSTOMER,
      invoice: i,
      original: null,
      lines: data.lines.filter((l) => l.active),
      template_version: "setpiece-invoice-v1" as const,
    };
    const bytes = await renderInvoicePdf(frozen, null, true);
    return new Response(Buffer.from(bytes), {
      headers: {
        ...PDF_HEADERS,
        "Content-Disposition": 'attachment; filename="Setpiece-concept.pdf"',
      },
    });
  }
  if (!i?.pdf_path || !i.pdf_hash || !i.pdf_bytes)
    return Response.json(
      { error: "De PDF is nog niet gemaakt." },
      { status: 404, headers: { "Cache-Control": "private, no-store" } },
    );
  try {
    const bytes = await archivedPdf(i.pdf_path, i.pdf_hash, i.pdf_bytes);
    return new Response(Buffer.from(bytes), {
      headers: {
        ...PDF_HEADERS,
        "Content-Disposition": `attachment; filename="Setpiece-factuur-${i.number}.pdf"`,
      },
    });
  } catch {
    return Response.json(
      {
        error: `PDF ${id}: integriteit of opslag niet bevestigd. Probeer opnieuw of laat de beheerder het archief controleren.`,
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "private, no-store",
          "X-Robots-Tag": "noindex",
        },
      },
    );
  }
}
