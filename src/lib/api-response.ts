import { NextResponse } from "next/server";

export function apiError(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

export function apiOk(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export async function readJson<T = Record<string, unknown>>(req: Request): Promise<T | null> {
  try {
    const body = (await req.json()) as T;
    return body && typeof body === "object" ? body : null;
  } catch {
    return null;
  }
}
