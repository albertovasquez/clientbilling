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
        <Heading level={1}>Create an invoice account</Heading>
        <p className="mt-4 text-body text-ink-soft">
          Free invoice create and send. Unpaid invoices work without payments
          connected. When you want card collect, apply to CDG or connect an
          existing Quantum gateway. ClientBilling never stores card data.
        </p>
        {!process.env.DATABASE_URL ? (
          <p className="mt-4 rounded-lg border border-verdict-rule bg-verdict-tint p-4 text-small text-ink">
            DATABASE_URL is not set on this deployment yet. Add Postgres in
            Vercel env vars, then return here to sign up.
          </p>
        ) : null}
        <SignUpForm />
      </Container>
    </Section>
  );
}
