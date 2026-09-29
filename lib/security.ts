import { NextResponse } from "next/server";
import type { SubmitResult } from "./schemas";

// Request guard shared by the form endpoints. It runs before any parsing:
// content type, same-origin, body size and a per-client rate limit.

type Guard = { ok: true; body: unknown } | { ok: false; response: NextResponse<SubmitResult> };

const fail = (status: number, error: string, headers?: HeadersInit): Guard => ({
  ok: false,
  response: NextResponse.json<SubmitResult>({ ok: false, error }, { status, headers }),
});

// Best-effort limiter. Serverless instances do not share memory, so this
// slows down a single abusive client per instance; put a platform-level
// rate limit (for example Vercel Firewall) in front for hard guarantees.
const hits = new Map<string, number[]>();

function rateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [entry, times] of hits) if (!times.some((time) => now - time < windowMs)) hits.delete(entry);
  }
  return recent.length > limit;
}

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") !== "cross-site";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function guardRequest(request: Request, options: { name: string; maxBytes: number; limit: number; windowMs: number }): Promise<Guard> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return fail(415, "Send the form as JSON.");
  }
  if (!sameOrigin(request)) return fail(403, "This form only accepts submissions from the Mayank site.");

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > options.maxBytes) return fail(413, "The submission is too large.");

  if (rateLimited(`${options.name}:${clientKey(request)}`, options.limit, options.windowMs)) {
    return fail(429, "Too many submissions from this connection. Please wait a few minutes and try again.", { "Retry-After": String(Math.ceil(options.windowMs / 1000)) });
  }

  const text = await request.text();
  if (text.length > options.maxBytes) return fail(413, "The submission is too large.");
  try {
    return { ok: true, body: JSON.parse(text) };
  } catch {
    return fail(400, "The submission could not be read.");
  }
}

// Strip line breaks and control characters from values used in one-line
// fields such as an email subject.
export function singleLine(value: string, max = 120) {
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max);
}
