import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignUpForm } from "@/components/app/AuthForm";
import { Container, Heading, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Create an account",
  robots: { index: false, follow: false },
};

export default async function SignUpPage() {
  const session = await auth();
  if (session?.user) redirect("/app");

  return (
    <Section>
      <Container width="article">
        <Heading level={1}>Create a free invoice account</Heading>
        <p className="mt-4 text-body text-ink-soft">
          Create, send, and track invoices. Your payment instructions go on every
          invoice so clients know how to pay you. ClientBilling never stores card
          data and is not a payment processor.
        </p>
        {!process.env.DATABASE_URL ? (
          <p className="mt-4 rounded-lg border border-rule-due bg-due-tint p-4 text-small text-ink">
            Sign-up is not available on this deployment yet.
          </p>
        ) : null}
        <SignUpForm />
      </Container>
    </Section>
  );
}
