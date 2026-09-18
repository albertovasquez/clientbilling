import Link from "next/link";
import { revokeApiKeyAction } from "@/app/app/api-key-actions";
import { ApiKeyForm } from "@/components/app/ApiKeyForm";
import { buttonClass, Heading } from "@/components/ui";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "API keys" };

export default async function ApiSettingsPage() {
  const user = await requireUser();
  const keys = await prisma.apiKey.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div>
        <Heading level={1}>API keys</Heading>
        <p className="mt-2 max-w-prose-guide text-body text-ink-soft">
          Keys let a script or an agent create clients and invoices, send and remind, and mark
          invoices paid on your behalf. A key acts as you. Keep it secret and revoke it if it leaks.
          The reference is at{" "}
          <Link href="/docs/api" className="text-action underline-offset-4 hover:underline">
            {siteConfig.domain}/docs/api
          </Link>
          .
        </p>
      </div>

      <section className="rounded-2xl border border-rule bg-paper p-6">
        <Heading level={2}>Create a key</Heading>
        <ApiKeyForm />
      </section>

      <section className="rounded-2xl border border-rule bg-paper p-6">
        <Heading level={2}>Your keys</Heading>
        {keys.length === 0 ? (
          <p className="mt-2 text-small text-ink-soft">No keys yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-rule border-y border-rule">
            {keys.map((k) => (
              <li key={k.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-small">
                <div>
                  <p className="font-semibold text-ink">
                    {k.name} <span className="font-normal text-muted">({k.prefix}...)</span>
                  </p>
                  <p className="text-caption text-muted">
                    Created {k.createdAt.toISOString().slice(0, 10)}
                    {k.lastUsedAt ? `, last used ${k.lastUsedAt.toISOString().slice(0, 10)}` : ", never used"}
                    {k.revokedAt ? `, revoked ${k.revokedAt.toISOString().slice(0, 10)}` : ""}
                  </p>
                </div>
                {!k.revokedAt ? (
                  <form action={revokeApiKeyAction}>
                    <input type="hidden" name="id" value={k.id} />
                    <button type="submit" className={buttonClass("quiet", "md")}>
                      Revoke
                    </button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
