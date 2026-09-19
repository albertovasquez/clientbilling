import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { Breadcrumb, Container, Disclosure, Heading, Kicker, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "API reference",
  description: "ClientBilling API v1: create clients and invoices, send, remind, and update status with a personal API key.",
  alternates: { canonical: "/docs/api" },
};

/** Renders docs/agents/api.md so the reference in the repo is the reference on the site. */
export default async function ApiDocsPage() {
  const file = path.join(process.cwd(), "docs/agents/api.md");
  const source = fs.readFileSync(file, "utf8").replace(/^# .*\n/, "");
  const html = (await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(source)).toString();

  return (
    <Section>
      <Container width="article">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Invoices", href: "/invoices" }, { label: "API" }]} />
        <Kicker className="mt-8">Updated September 18, 2026</Kicker>
        <Heading level={1} className="mt-2">
          API reference
        </Heading>
        <p className="mt-4 text-body text-ink-soft">
          For scripts and agents that run an invoicing account on its owner&apos;s behalf. Create a key
          under Settings, API keys in the app. Machine-readable OpenAPI is at{" "}
          <a href="/docs/api/openapi.json" className="text-action underline-offset-4 hover:underline">
            /docs/api/openapi.json
          </a>
          .
        </p>
        <Disclosure compact className="mt-4" />
        <div className="prose prose-billing mt-10 max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      </Container>
    </Section>
  );
}
