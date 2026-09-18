import { prisma } from "@/lib/db";

/**
 * First-party product events (decision 0007). Server-side writer. Never throws:
 * measurement must not break a user action.
 */
export async function recordEvent(input: {
  name: string;
  path?: string;
  userId?: string | null;
  payload?: Record<string, unknown>;
  country?: string | null;
}): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  try {
    await prisma.event.create({
      data: {
        name: input.name.slice(0, 64),
        path: input.path?.slice(0, 256),
        userId: input.userId ?? undefined,
        payload: input.payload ? JSON.stringify(input.payload).slice(0, 2000) : undefined,
        country: input.country ?? undefined,
      },
    });
  } catch (error) {
    console.error("[events] failed to record", input.name, error);
  }
}
