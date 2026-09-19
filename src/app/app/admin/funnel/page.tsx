import { notFound } from "next/navigation";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { Heading } from "@/components/ui";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Funnel" };

const steps: { name: string; label: string }[] = [
  { name: "signup", label: "Sign-ups" },
  { name: "invoice_created", label: "Invoices created" },
  { name: "invoice_sent", label: "Invoices sent (email)" },
  { name: "invoice_viewed", label: "Invoices opened by a payer" },
  { name: "invoice_paid", label: "Invoices paid in full" },
  { name: "payment_recorded", label: "Partial payments recorded" },
  { name: "payer_card_intent", label: "Payers asking to pay by card" },
  { name: "payer_pay_link_click", label: "Pay online clicks" },
  { name: "invoice_overdue", label: "Invoices gone overdue" },
  { name: "invoice_reminder_sent", label: "Reminders sent" },
  { name: "collect_requested", label: "Collect requests (concierge)" },
  { name: "api_key_created", label: "API keys created" },
  { name: "recurring_run", label: "Recurring invoices generated" },
  { name: "calculator_complete", label: "Fee calculator completions" },
  { name: "cost_table_edit", label: "Homepage cost table edits" },
  { name: "hero_signup_click", label: "Hero sign-up clicks" },
  { name: "proof_strip_click", label: "Proof strip clicks" },
  { name: "affiliate_cta_click", label: "CDG link clicks" },
  { name: "password_reset_requested", label: "Password resets requested" },
];

async function countSince(name: string, since: Date): Promise<number> {
  return prisma.event.count({ where: { name, createdAt: { gte: since } } });
}

/** Internal funnel (decision 0007). Counts only; no personal data on screen. */
export default async function FunnelPage() {
  const user = await requireUser();
  if (!isAdminEmail(user.email)) notFound();

  // Server component; reading the clock here is intentional.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const d7 = new Date(now - 7 * 86_400_000);
  const d30 = new Date(now - 30 * 86_400_000);

  const rows = await Promise.all(
    steps.map(async (step) => ({
      label: step.label,
      values: [await countSince(step.name, d7), await countSince(step.name, d30)],
    })),
  );

  const [users, invoices, distinctSenders] = await Promise.all([
    prisma.user.count(),
    prisma.invoice.count(),
    prisma.invoice.groupBy({ by: ["userId"], where: { sentAt: { not: null } } }).then((g) => g.length),
  ]);

  const clicks = await prisma.event.findMany({
    where: { name: "affiliate_cta_click", createdAt: { gte: d30 } },
    select: { payload: true },
    take: 5000,
  });
  const byPosition = new Map<string, number>();
  for (const c of clicks) {
    try {
      const p = c.payload ? (JSON.parse(c.payload) as { cta_position?: string; cta_type?: string }) : {};
      const key = `${p.cta_type ?? "?"} at ${p.cta_position ?? "?"}`;
      byPosition.set(key, (byPosition.get(key) ?? 0) + 1);
    } catch {
      /* ignore */
    }
  }
  const clickRows = [...byPosition.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, n]) => ({ label, values: [n] }));

  return (
    <div className="space-y-10">
      <div>
        <Heading level={1}>Funnel</Heading>
        <p className="mt-2 text-small text-ink-soft">
          First-party event counts. Totals: {users} accounts, {invoices} invoices, {distinctSenders} accounts that have sent at least one invoice.
        </p>
      </div>
      <Table>
        <TableCaption>Events by step</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">
              <span className="sr-only">Attribute</span>
            </TableHead>
            {["Last 7 days", "Last 30 days"].map((col) => (
              <TableHead key={col} scope="col">
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.label}>
              <TableCell className="font-medium">{r.label}</TableCell>
              {r.values.map((v, i) => (
                <TableCell key={i} className="tabular-nums text-muted-foreground">
                  {String(v)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table>
        <TableCaption>CDG link clicks by type and position, last 30 days</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">
              <span className="sr-only">Attribute</span>
            </TableHead>
            <TableHead scope="col">Clicks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(clickRows.length ? clickRows : [{ label: "No clicks recorded yet", values: [0] }]).map((r) => (
            <TableRow key={r.label}>
              <TableCell className="font-medium">{r.label}</TableCell>
              {r.values.map((v, i) => (
                <TableCell key={i} className="tabular-nums text-muted-foreground">
                  {String(v)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
