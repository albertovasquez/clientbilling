import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const TTL_MS = 24 * 60 * 60 * 1000;

export type IdempotencyBegin =
  | { ok: true; key: string; fingerprint: string }
  | { ok: false; response: NextResponse };

/**
 * Claim an Idempotency-Key before running the handler. Inserts a pending row so
 * concurrent same-key requests cannot both mutate. Replays a stored response
 * when the fingerprint matches; conflicts when the body differs or another
 * request still holds the claim.
 */
export async function beginIdempotency(
  userId: string,
  req: Request,
  rawBody: string,
): Promise<IdempotencyBegin> {
  const key = (req.headers.get("idempotency-key") ?? "").trim();
  if (!key || key.length > 256) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Idempotency-Key header is required on this request" },
        { status: 400 },
      ),
    };
  }
  const fingerprint = fingerprintRequest(req.method, new URL(req.url).pathname, rawBody);
  const expiresAt = new Date(Date.now() + TTL_MS);

  try {
    await prisma.idempotencyRecord.create({
      data: {
        userId,
        key,
        requestFingerprint: fingerprint,
        responseStatus: 0,
        responseBody: "",
        expiresAt,
      },
    });
    return { ok: true, key, fingerprint };
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
      throw error;
    }
  }

  const existing = await prisma.idempotencyRecord.findUnique({
    where: { userId_key: { userId, key } },
  });
  if (!existing || existing.expiresAt.getTime() <= Date.now()) {
    // Expired or missing after race: replace and claim.
    await prisma.idempotencyRecord.deleteMany({ where: { userId, key } });
    await prisma.idempotencyRecord.create({
      data: {
        userId,
        key,
        requestFingerprint: fingerprint,
        responseStatus: 0,
        responseBody: "",
        expiresAt,
      },
    });
    return { ok: true, key, fingerprint };
  }
  if (existing.requestFingerprint !== fingerprint) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Idempotency-Key was already used with a different request" },
        { status: 409 },
      ),
    };
  }
  if (existing.responseStatus === 0) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "A request with this Idempotency-Key is already in progress" },
        { status: 409 },
      ),
    };
  }
  return {
    ok: false,
    response: new NextResponse(existing.responseBody, {
      status: existing.responseStatus,
      headers: { "Content-Type": "application/json", "Idempotency-Replayed": "true" },
    }),
  };
}

export async function storeIdempotency(
  userId: string,
  key: string,
  fingerprint: string,
  status: number,
  body: unknown,
): Promise<void> {
  const responseBody = JSON.stringify(body);
  const expiresAt = new Date(Date.now() + TTL_MS);
  await prisma.idempotencyRecord.update({
    where: { userId_key: { userId, key } },
    data: {
      requestFingerprint: fingerprint,
      responseStatus: status,
      responseBody,
      expiresAt,
    },
  });
}

export function fingerprintRequest(method: string, pathname: string, rawBody: string): string {
  return createHash("sha256")
    .update(`${method.toUpperCase()}\n${pathname}\n${rawBody}`, "utf8")
    .digest("hex");
}

/** Read the raw body once so fingerprinting and JSON parsing share the same bytes. */
export async function readRawBody(req: Request): Promise<string> {
  try {
    return await req.text();
  } catch {
    return "";
  }
}

export function parseRawJson<T = Record<string, unknown>>(raw: string): T | null {
  if (!raw) return null;
  try {
    const body = JSON.parse(raw) as T;
    return body && typeof body === "object" ? body : null;
  } catch {
    return null;
  }
}
