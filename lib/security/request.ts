import "server-only";

import type { NextRequest } from "next/server";

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function hasValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

export function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n?/g, "\n").trim().slice(0, maxLength);
}

export function requestIsTooLarge(request: NextRequest, maxBytes = 24_000): boolean {
  const length = Number(request.headers.get("content-length") ?? 0);
  return Number.isFinite(length) && length > maxBytes;
}

export function logPublicEndpoint(
  endpoint: "contact" | "intake",
  status: "accepted" | "rejected" | "failed",
  startedAt: number,
  reason?: string,
) {
  console.info(
    JSON.stringify({
      event: "public_endpoint",
      endpoint,
      status,
      reason,
      durationMs: Date.now() - startedAt,
    }),
  );
}
