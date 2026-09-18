import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInForm } from "@/components/app/AuthForm";
import { Container, Heading, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

type Props = { searchParams?: Promise<{ next?: string }> };

export default async function SignInPage({ searchParams }: Props) {
  const session = await auth();
  if (session?.user) redirect("/app");
  const params = searchParams ? await searchParams : {};
  const nextPath = typeof params.next === "string" ? params.next : "/app";

  return (
    <Section>
      <Container width="article">
        <Heading level={1}>Sign in</Heading>
        <p className="mt-4 text-body text-ink-soft">
          Open your ClientBilling invoices. Create and send for free. Collect
          online through CDG Commerce Quantum when you are ready.
        </p>
        {!process.env.DATABASE_URL ? (
          <p className="mt-4 rounded-lg border border-verdict-rule bg-verdict-tint p-4 text-small text-ink">
            DATABASE_URL is not set on this deployment yet. Add a Neon (or other
            Postgres) connection string in Vercel env vars to enable sign-in.
          </p>
        ) : null}
        <SignInForm nextPath={nextPath} />
      </Container>
    </Section>
  );
}
