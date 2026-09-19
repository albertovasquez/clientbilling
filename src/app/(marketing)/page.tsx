import { EventLink } from "@/components/EventLink";
import { HeroInvoice } from "@/components/HeroInvoice";
import {
  Button,
  Container,
  CopyLabel,
  CtaButton,
  Disclosure,
  Heading,
  RecordMark,
  Section,
  SourceNote,
  formatCheckedDate,
} from "@/components/ui";
import { CDG_CHECKED, cdgSources } from "@/lib/cdg";
import { exampleInvoiceSnapshots } from "@/lib/example-invoice";
import { formatCents } from "@/lib/money";
import { exampleAccount, exampleAccountMarkup } from "@/lib/payments-example";
import { getFeaturedPosts } from "@/lib/posts";

/** Send, Collect, Automate: what the product does today, never what it will do. */
const propositions = [
  {
    title: "Send",
    body: "Invoices, recurring bills, and reminders. A PDF on every email, a public page for every payer, and a record of who opened what.",
    icon: (
      <>
        <rect x="3" y="2" width="14" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 7h8M6 11h8M6 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Collect",
    body: "Bank transfer, card, or your own pay link. Record every payment, partial or full, and see the fee and the net on each rail before you choose one.",
    icon: (
      <>
        <rect x="2" y="5" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 9h18" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
  {
    title: "Automate",
    body: "Overdue sweeps, scheduled invoices, and an API so a script or an agent can bill on your behalf. Same invoice, same rules.",
    icon: (
      <>
        <path d="M4 6h14M4 11h14M4 16h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="17" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
];

/** The agent copy of the same record the hero shows, as the API returns it. */
const agentCopy = `GET /api/v1/invoices/inv_01J9X4K2

{
  "number": "1042",
  "status": "sent",
  "client": { "name": "Harbor Lane Dental" },
  "totalCents": 250000,
  "paidCents": 0,
  "balanceCents": 250000,
  "dueDate": "2026-10-15",
  "lineItems": [
    { "description": "Remodel, phase 1 labor", "quantity": 20, "unitPriceCents": 9500 },
    { "description": "Fixtures and materials", "quantity": 1, "unitPriceCents": 60000 }
  ],
  "publicUrl": "https://www.clientbilling.com/i/6z7grjvgwt2z",
  "pdfUrl": "https://www.clientbilling.com/i/6z7grjvgwt2z/pdf"
}`;

export default function HomePage() {
  const featured = getFeaturedPosts(3);
  const markup = exampleAccountMarkup();

  return (
    <>
      <Section id="top">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-10">
            <div className="flex flex-col gap-6">
              <Heading level={1} className="text-balance">
                Bill clients.
                <br className="hidden sm:inline" /> Know what getting paid costs.
              </Heading>
              <p className="max-w-prose-guide text-pretty text-body text-ink-soft">
                Free invoicing that applies payment costs to the invoice before you send it. Every
                number has a source.
              </p>
              <p className="-mt-2 text-small text-muted">
                For people, software, and agents. Same invoice. Same rules.
              </p>
              <Disclosure className="-mt-2" />
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <CtaButton cta="signUp" position="hero" size="lg" event="hero_signup_click" />
                <CtaButton cta="api" position="hero" variant="secondary" size="lg" />
              </div>
              <p className="font-mono text-caption text-muted">
                No card on file. No plan to pick. Your data exports as CSV.
              </p>
            </div>
            <HeroInvoice snapshots={exampleInvoiceSnapshots()} />
          </div>
        </Container>
      </Section>

      {/*
        One record, three views, one proof (decision 0021, terminology). The
        three copies exist today; the proof engine is the next phase, so the
        strip says planned and its link goes to the record the API returns
        rather than to a verification page that does not exist yet (epic #37).
      */}
      <Section band="sheet" rule className="py-6 sm:py-6">
        <Container>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Heading level={2} size="sm">
              One record. Three views. One proof.
            </Heading>
            <div className="flex flex-wrap items-center gap-2">
              <CopyLabel kind="client" />
              <CopyLabel kind="file" />
              <CopyLabel kind="agent" />
              <EventLink
                href="/docs/api"
                event="proof_strip_click"
                className="ml-1 inline-flex items-center gap-1.5 rounded-sm text-small font-semibold text-cleared underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-carbon"
              >
                <RecordMark variant="registration" size={14} />
                See how a record is verified
              </EventLink>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="invoices">
        <Container>
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {propositions.map((item) => (
              <div key={item.title} className="flex flex-col gap-2.5">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  aria-hidden="true"
                  className="text-carbon"
                >
                  {item.icon}
                </svg>
                <Heading level={2} size="sm">
                  {item.title}
                </Heading>
                <p className="text-pretty text-body text-ink-soft">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/*
        Where a merchant decides how to collect, so this is where CDG appears
        (decision 0021). The claim is the corrected one: rates are easy to
        publish, applying them to the invoice in front of you is different.
        Every CDG figure comes from the rates module through payments-example.
      */}
      <Section band="sheet" rule id="payments">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-4">
              <Heading level={2} className="text-balance">
                The rate is applied to the invoice, not buried in a pricing page.
              </Heading>
              <p className="text-pretty text-body text-ink-soft">
                Processing rates are easy to publish. Applying them to the invoice in front of you is
                different. ClientBilling shows the known cost and expected net before you send, names
                the source, and tells you when a cost cannot be known in advance.
              </p>
              <p className="text-small text-ink-soft">
                Enter your own bank and card rates in settings, or use published ones. Nothing is
                estimated silently.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-4 border-b border-rule-strong pb-2.5">
                <span className="text-small text-muted">Monthly card volume, last 90 days</span>
                <span className="font-mono text-display-sm font-medium text-ink">
                  {formatCents(exampleAccount.monthlyVolumeCents)}
                </span>
              </div>
              <dl className="flex flex-col">
                {exampleAccount.mix.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-baseline justify-between gap-4 py-1.5 text-small ${i > 0 ? "border-t border-rule" : ""}`}
                  >
                    <dt className="text-ink-soft">{row.label}</dt>
                    <dd className="font-mono text-ink">{row.percent}%</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-2 flex flex-col gap-3 rounded border border-rule bg-paper p-5">
                <p className="text-small text-ink">
                  This example account&apos;s card volume is in the band where CDG Commerce publishes
                  interchange-plus pricing ({markup.band}). At {markup.formula} above interchange, the
                  markup on its card payments would have been{" "}
                  <span className="font-mono font-medium">{formatCents(markup.markupCents)}</span> a
                  month. Interchange itself varies by card and is not estimated.
                </p>
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-4">
                  <CtaButton cta="compareCosts" position="inline" />
                  <span className="text-caption text-muted">
                    ClientBilling may earn a commission if you sign up with CDG. Your pricing does not
                    change.
                  </span>
                </div>
              </div>

              <SourceNote
                source={cdgSources.interchangePlus}
                checked={CDG_CHECKED}
                note="The volume and the payment mix above are an example account, not a real one."
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section id="developers">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
            <div className="flex flex-col gap-4">
              <CopyLabel kind="agent" className="self-start" />
              <Heading level={2} id="agents" className="text-balance">
                The same invoice, readable by software.
              </Heading>
              <p className="text-pretty text-body text-ink-soft">
                One record, three copies. Your client gets the page and the PDF. Your bookkeeper gets
                the export. A script or an AI agent gets JSON over a REST API with a personal key, and
                can create, send, remind, and record payments under the same rules you use.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Button href="/docs/api" variant="secondary">
                  Read the API reference
                </Button>
                <span className="text-caption text-muted">
                  Planned: webhooks, an MCP server, and a verifiable record of every billing event.
                </span>
              </div>
            </div>

            <div className="relative mb-2.5 mr-2.5 min-w-0">
              <div aria-hidden className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded bg-carbon-tint" />
              <pre className="relative overflow-x-auto rounded bg-ink p-5 font-mono text-caption leading-relaxed text-paper sm:p-6">
                <code>{agentCopy}</code>
              </pre>
            </div>
          </div>
        </Container>
      </Section>

      <Section band="field" rule id="guides">
        <Container>
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col gap-2">
              <Heading level={2} size="sm">
                Guides
              </Heading>
              <p className="text-small text-ink-soft">
                Plain reading on what merchant accounts, gateways, and rates actually cost. Every
                number sourced and dated.
              </p>
              <Button href="/blog" variant="quiet" className="mt-2 self-start">
                All guides
              </Button>
            </div>
            <ul className="lg:col-span-2">
              {featured.map((post) => (
                <li key={post.slug} className="border-t border-rule last:border-b">
                  <Button
                    href={`/blog/${post.slug}`}
                    variant="quiet"
                    className="flex w-full flex-col gap-1 py-3.5 text-left font-normal text-ink no-underline hover:underline sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <span className="text-body">{post.title}</span>
                    <span className="shrink-0 font-mono text-caption text-muted">
                      Updated {formatCheckedDate(post.updated ?? post.date)}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </>
  );
}
