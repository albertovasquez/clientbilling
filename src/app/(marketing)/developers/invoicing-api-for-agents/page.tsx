import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, Button, Container, Heading, Kicker, Section } from "@/components/ui";
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
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/app/settings/api" size="lg">
              Create an API key
            </Button>
            <Button href="/docs/api" variant="secondary" size="lg">
              Read the API reference
            </Button>
            <Button href="/docs/api/openapi.json" variant="secondary" size="lg">
              OpenAPI
            </Button>
          </div>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>MCP quick start</Heading>
          <p className="mt-4 text-body text-ink-soft">
            Point an MCP client at <code className="text-ink">{siteConfig.url}/api/mcp</code> with
            a Bearer API key. Bind the key to a service account under Settings, API keys so every
            write shows that actor on the invoice timeline.
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
          <Heading level={2}>Idempotency and actors</Heading>
          <p className="mt-4 text-body text-ink-soft">
            REST mutations require an <code>Idempotency-Key</code> header. MCP write tools take an{" "}
            <code>idempotencyKey</code> argument. The same key with the same body replays; a different
            body returns a conflict. Each mutation records who acted: a user, an API key, or a
            service account bound to the key.
          </p>
          <p className="mt-4 text-body text-ink-soft">
            Sandbox keys use the <code>cb_test_</code> prefix and share a free allowance of 100 writes
            per day. Live keys are unrestricted until the Machine tier is enforced. The{" "}
            <code>machineEnabled</code> flag is reserved for that gate and does not block keys today.
          </p>
          <p className="mt-6 text-body text-ink-soft">
            Full HTTP details live in the{" "}
            <Link href="/docs/api" className="text-carbon underline-offset-4 hover:underline">
              API reference
            </Link>{" "}
            and{" "}
            <Link href="/docs/api/openapi.json" className="text-carbon underline-offset-4 hover:underline">
              OpenAPI document
            </Link>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
