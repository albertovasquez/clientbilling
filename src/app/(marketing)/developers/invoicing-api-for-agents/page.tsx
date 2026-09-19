import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, Button, Container, CtaButton, Heading, Kicker, Section } from "@/components/ui";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Invoicing API for AI agents",
  description:
    "Create, send, remind, and record payments through REST or MCP. Every write is idempotent. Every action has an actor. Every billing record can be verified.",
  alternates: { canonical: "/developers/invoicing-api-for-agents" },
};

export default function InvoicingApiForAgentsPage() {
  return (
    <>
      <Section>
        <Container width="article">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Developers", href: "/docs/api" },
              { label: "For agents" },
            ]}
          />
          <Kicker className="mt-8">REST and MCP</Kicker>
          <Heading level={1} className="mt-2">
            Invoicing API for AI agents
          </Heading>
          <p className="mt-6 text-body text-ink-soft">
            Create, send, remind, and record payments through REST or MCP. Every write is
            idempotent. Every action has an actor. Every billing record can be verified. The same
            invoice the merchant sees in the dashboard is the object your agent writes.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/app/settings/api" size="lg">
              Create an API key
            </Button>
            <CtaButton cta="apiReference" position="inline" size="lg" />
          </div>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>MCP quick start</Heading>
          <p className="mt-4 text-body text-ink-soft">
            Point an MCP client at <code className="text-ink">{siteConfig.url}/api/mcp</code> with
            a Bearer API key. Bind the key to a service account under Settings, API keys so every
            write records that actor on the invoice&apos;s billing activity.
          </p>
          <pre className="mt-6 overflow-x-auto rounded-md border border-rule bg-sheet p-4 font-mono text-caption text-ink">
{`{
  "mcpServers": {
    "clientbilling": {
      "url": "${siteConfig.url}/api/mcp",
      "headers": {
        "Authorization": "Bearer cb_live_..."
      }
    }
  }
}`}
          </pre>
          <p className="mt-4 text-body text-ink-soft">
            Tools: <code>list_invoices</code>, <code>get_invoice</code>, <code>create_invoice</code>,{" "}
            <code>send_invoice</code>, <code>send_reminder</code>, <code>record_payment</code>,{" "}
            <code>get_payment_costs</code>, <code>verify_record</code> (pending until the proof engine
            ships). There are no tools that charge a card, refund, or move funds.
          </p>
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <Heading level={2}>OpenAPI example</Heading>
          <p className="mt-4 text-body text-ink-soft">
            Create a draft with an idempotency key. The response includes the actor that performed
            the write.
          </p>
          <pre className="mt-6 overflow-x-auto rounded-md border border-rule bg-sheet p-4 font-mono text-caption text-ink">
{`curl -s -X POST ${siteConfig.url}/api/v1/invoices \\
  -H "Authorization: Bearer cb_live_..." \\
  -H "Idempotency-Key: create-1001" \\
  -H "Content-Type: application/json" \\
  -d '{
    "newClient": { "name": "Jane Client", "email": "jane@example.com" },
    "lines": [{ "description": "Consulting", "quantity": 10, "unitPrice": 150 }]
  }'`}
          </pre>
          <p className="mt-4 text-body text-ink-soft">
            Machine-readable OpenAPI:{" "}
            <Link href="/docs/api/openapi.json" className="text-carbon underline-offset-4 hover:underline">
              /docs/api/openapi.json
            </Link>
            .
          </p>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>Idempotency and actors</Heading>
          <p className="mt-4 text-body text-ink-soft">
            REST mutations require an <code>Idempotency-Key</code> header. MCP write tools take an{" "}
            <code>idempotencyKey</code> argument. The same key with the same body replays; a different
            body returns a conflict. Each mutation records who acted: a user, an API key, or a
            service account bound to the key. Open the invoice in the app to see billing activity
            with that actor.
          </p>
          <p className="mt-4 text-body text-ink-soft">
            Test keys use the <code>cb_test_</code> prefix and share an allowance of 100 writes a day
            on REST and MCP, currently free. Live keys have no daily write quota today; both kinds
            are held to 120 requests a minute. A Machine tier is planned, its pricing is not set,
            and the terms give 30 days of notice before anything free becomes paid.
          </p>
          <p className="mt-4 text-body text-ink-soft">
            Test keys act on your real account. They create real invoices and record real payments,
            so a send from a test key reaches the client on file. There is no separate test dataset
            today.
          </p>
          <p className="mt-6 text-body text-ink-soft">
            Full HTTP details live in the{" "}
            <Link href="/docs/api" className="text-carbon underline-offset-4 hover:underline">
              API reference
            </Link>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
