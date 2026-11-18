import { createHash } from "node:crypto";
import { z } from "zod";
import { billingStorageClient } from "@/lib/billing/client";
import { archivedPdf, PDF_HEADERS } from "@/lib/billing/storage";
import { consumeRateLimit } from "@/lib/security/rate-limit";
export const runtime = "nodejs";
const missing = () =>
  new Response(null, {
    status: 404,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
    },
  });
export async function HEAD() {
  return missing();
}
export async function GET(request: Request) {
  const match = /^Bearer ([a-f0-9]{64})$/.exec(
    request.headers.get("authorization") ?? "",
  );
  if (!match) return missing();
  const hash = createHash("sha256").update(match[1]).digest("hex");
  try {
    if (
      !(await consumeRateLimit({
        identifier: hash,
        action: "invoice-pdf",
        limit: 20,
        windowSeconds: 900,
      }))
    )
      return missing();
    const { data, error } = await billingStorageClient().rpc(
      "sp_invoice_pdf_consume",
      { p_hash: hash },
    );
    const parsed = z
      .object({
        path: z.string(),
        hash: z.string().regex(/^[a-f0-9]{64}$/),
        bytes: z.number().int().min(1).max(5242880),
        filename: z
          .string()
          .regex(/^Setpiece-factuur-[A-Z]{1,4}\d{4}-\d+\.pdf$/),
      })
      .safeParse(data);
    if (error || !parsed.success) return missing();
    const p = parsed.data,
      bytes = await archivedPdf(p.path, p.hash, p.bytes);
    return new Response(Buffer.from(bytes), {
      headers: {
        ...PDF_HEADERS,
        "Content-Disposition": `attachment; filename="${p.filename}"`,
      },
    });
  } catch {
    return missing();
  }
}
