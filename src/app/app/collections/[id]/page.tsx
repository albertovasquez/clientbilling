import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteAccountAction } from "@/app/app/collections-actions";
import { CollectionQuestionnaireForm } from "@/components/app/CollectionQuestionnaireForm";
import { Heading } from "@/components/ui";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/shadcn/card";
import { ageBucket } from "@/lib/collections/csv";
import { escalations, relationships, tones } from "@/lib/collections/questionnaire";
import { prisma } from "@/lib/db";
import { formatCents } from "@/lib/money";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Collections account" };

export default async function CollectionAccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const a = await prisma.collectionAccount.findFirst({ where: { id, userId: user.id } });
  if (!a) notFound();

  return (
    <div>
      <Link href="/app/collections" className="text-small text-action underline-offset-4 hover:underline">
        All accounts
      </Link>
      <Heading level={1} className="mt-2">
        {a.company}
      </Heading>
      <p className="mt-2 text-small text-ink-soft">
        {a.debtorName}, {a.email}. {formatCents(a.amountCents, a.currency)} owed
        {a.invoiceDate ? `, invoiced ${a.invoiceDate.toISOString().slice(0, 10)}` : ""} ({ageBucket(a.ageDays)}).
      </p>
      {a.description ? <p className="mt-2 text-small">{a.description}</p> : null}

      <Card className="mt-8">
        <CardHeader>
          <Heading level={2}>How should we handle this account?</Heading>
          <CardDescription>
            These answers set the limits the assistant must stay inside. It can never offer less than your minimum or a
            longer plan than you allow, and anything outside these rules comes to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CollectionQuestionnaireForm
            accountId={a.id}
            relationships={relationships}
            tones={tones}
            escalations={escalations}
            defaults={{
              relationship: a.relationship ?? undefined,
              disputed: a.disputed,
              disputeNotes: a.disputeNotes ?? undefined,
              minSettlementPct: a.minSettlementPct?.toString(),
              maxPlanMonths: a.maxPlanMonths?.toString(),
              tone: a.tone ?? undefined,
              escalation: a.escalation ?? undefined,
              escalationNotes: a.escalationNotes ?? undefined,
            }}
          />
        </CardContent>
      </Card>

      <form action={deleteAccountAction} className="mt-8">
        <input type="hidden" name="id" value={a.id} />
        <Button type="submit" variant="ghost" size="sm">
          Remove this account
        </Button>
      </form>
    </div>
  );
}
