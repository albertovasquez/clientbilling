import Link from "next/link";
import {
  createServiceAccountAction,
  createWebhookEndpointAction,
  revokeApiKeyAction,
  revokeServiceAccountAction,
  revokeWebhookEndpointAction,
} from "@/app/app/api-key-actions";
import { ApiKeyForm } from "@/components/app/ApiKeyForm";
import { WebhookForm } from "@/components/app/WebhookForm";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/shadcn/table";
import { Heading } from "@/components/ui";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "API keys" };

export default async function ApiSettingsPage() {
  const user = await requireUser();
  const [keys, serviceAccounts, webhooks] = await Promise.all([
    prisma.apiKey.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    prisma.serviceAccount.findMany({
      where: { userId: user.id, revokedAt: null },
      orderBy: { createdAt: "desc" },
    }),
    prisma.webhookEndpoint.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <Heading level={1}>API keys</Heading>
        <p className="mt-2 max-w-prose-guide text-body text-ink-soft">
          Keys let a script or an agent create clients and invoices, send and remind, and record
          payments on your behalf. Bind a key to a service account when you want machine actions to
          show that actor. The reference is at{" "}
          <Link href="/docs/api" className="text-action underline-offset-4 hover:underline">
            {siteConfig.domain}/docs/api
          </Link>
          ; OpenAPI is at{" "}
          <Link href="/docs/api/openapi.json" className="text-action underline-offset-4 hover:underline">
            /docs/api/openapi.json
          </Link>
          .
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Heading level={2}>Service accounts</Heading>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={createServiceAccountAction} className="flex max-w-xl flex-wrap items-end gap-3">
            <div className="grid min-w-[14rem] flex-1 gap-1.5">
              <Label htmlFor="sa-name">Name</Label>
              <Input id="sa-name" name="name" required maxLength={60} placeholder="billing agent" />
            </div>
            <Button type="submit">Create</Button>
          </form>
          {serviceAccounts.length === 0 ? (
            <p className="text-small text-ink-soft">No service accounts yet.</p>
          ) : (
            <Table>
              <TableBody>
                {serviceAccounts.map((sa) => (
                  <TableRow key={sa.id}>
                    <TableCell className="font-semibold text-ink">{sa.name}</TableCell>
                    <TableCell className="text-caption text-muted">{sa.id}</TableCell>
                    <TableCell className="text-right">
                      <form action={revokeServiceAccountAction}>
                        <input type="hidden" name="id" value={sa.id} />
                        <Button type="submit" variant="ghost" size="sm">
                          Revoke
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Heading level={2}>Create a key</Heading>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ApiKeyForm serviceAccounts={serviceAccounts.map((sa) => ({ id: sa.id, name: sa.name }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Heading level={2}>Your keys</Heading>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <p className="text-small text-ink-soft">No keys yet.</p>
          ) : (
            <Table>
              <TableBody>
                {keys.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="font-semibold text-ink">
                      {k.name} <span className="font-normal text-muted">({k.prefix}...)</span>
                    </TableCell>
                    <TableCell className="text-caption text-muted">
                      Created {k.createdAt.toISOString().slice(0, 10)}
                      {k.lastUsedAt ? `, last used ${k.lastUsedAt.toISOString().slice(0, 10)}` : ", never used"}
                      {k.revokedAt ? `, revoked ${k.revokedAt.toISOString().slice(0, 10)}` : ""}
                      {k.scopes ? `; scopes ${k.scopes}` : ""}
                    </TableCell>
                    <TableCell className="text-right">
                      {!k.revokedAt ? (
                        <form action={revokeApiKeyAction}>
                          <input type="hidden" name="id" value={k.id} />
                          <Button type="submit" variant="ghost" size="sm">
                            Revoke
                          </Button>
                        </form>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Heading level={2}>Webhooks</Heading>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-small text-ink-soft">
            HTTPS endpoints receive signed JSON for invoice.created, invoice.sent, invoice.viewed,
            invoice.paid, payment.recorded, and invoice.overdue. Verify{" "}
            <code>ClientBilling-Signature</code> as documented in the API reference.
          </p>
          <WebhookForm />
          {webhooks.length === 0 ? (
            <p className="text-small text-ink-soft">No webhook endpoints yet.</p>
          ) : (
            <Table>
              <TableBody>
                {webhooks.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-semibold text-ink break-all">{w.url}</TableCell>
                    <TableCell className="text-caption text-muted">
                      {w.active && !w.revokedAt ? "active" : "revoked"}
                    </TableCell>
                    <TableCell className="text-right">
                      {w.active && !w.revokedAt ? (
                        <form action={revokeWebhookEndpointAction}>
                          <input type="hidden" name="id" value={w.id} />
                          <Button type="submit" variant="ghost" size="sm">
                            Revoke
                          </Button>
                        </form>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
