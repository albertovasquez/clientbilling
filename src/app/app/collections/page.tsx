import Link from "next/link";
import { CollectionsImportForm } from "@/components/app/CollectionsImportForm";
import { Heading } from "@/components/ui";
import { Badge } from "@/components/shadcn/badge";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/shadcn/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { ageBucket } from "@/lib/collections/csv";
import { prisma } from "@/lib/db";
import { formatCents } from "@/lib/money";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Collections" };

const statusLabel = { needs_review: "Needs answers", ready: "Ready", paused: "Paused for you" } as const;

export default async function CollectionsPage() {
  const user = await requireUser();
  const accounts = await prisma.collectionAccount.findMany({
    where: { userId: user.id },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 500,
  });
  const totalCents = accounts.reduce((sum, a) => sum + a.amountCents, 0);

  return (
    <div>
      <Heading level={1}>Collections</Heading>
      <p className="mt-2 max-w-2xl text-small text-ink-soft">
        Bring in business accounts that owe you money and tell us how you want each one handled. Nothing is sent yet: in this
        preview you set up accounts and rules only. When messaging arrives, it will go from your own email, every message will
        wait for your approval, and payments will go to your own pay link. The assistant always says it is an AI and offers a
        person.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <Heading level={2}>Import accounts</Heading>
          <CardDescription>Business debts only. We never collect or hold money.</CardDescription>
        </CardHeader>
        <CardContent>
          <CollectionsImportForm />
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <Heading level={2}>Accounts</Heading>
          <CardDescription>
            {accounts.length === 0
              ? "No accounts yet."
              : `${accounts.length} account${accounts.length === 1 ? "" : "s"}, ${formatCents(totalCents)} owed in total.`}
          </CardDescription>
        </CardHeader>
        {accounts.length > 0 ? (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Owed</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <Link href={`/app/collections/${a.id}`} className="font-semibold text-ink hover:text-primary">
                        {a.company}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {a.debtorName}, {a.email}
                    </TableCell>
                    <TableCell className="tabular-nums">{formatCents(a.amountCents, a.currency)}</TableCell>
                    <TableCell>{ageBucket(a.ageDays)}</TableCell>
                    <TableCell>
                      <Badge variant={a.status === "ready" ? "default" : "secondary"}>{statusLabel[a.status]}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        ) : null}
      </Card>
    </div>
  );
}
