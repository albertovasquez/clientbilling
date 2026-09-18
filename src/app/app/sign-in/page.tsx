import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInForm } from "@/components/app/AuthForm";
import { Container, Heading, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

type Props = { searchParams?: Promise<{ next?: string; reset?: string }> };

export default async function SignInPage({ searchParams }: Props) {
  const session = await auth();
  if (session?.user) redirect("/app");
  const params = searchParams ? await searchParams : {};
  const nextPath = typeof params.next === "string" ? params.next : "/app";
  const notice = params.reset === "1" ? "Your password is updated. Sign in with the new one." : undefined;

  return (
    <Section>
      <Container width="article">
        <Heading level={1}>Sign in</Heading>
        <p className="mt-4 text-body text-ink-soft">
          Open your ClientBilling invoices.
        </p>
        {!process.env.DATABASE_URL ? (
          <p className="mt-4 rounded-lg border border-verdict-rule bg-verdict-tint p-4 text-small text-ink">
            Sign-in is not available on this deployment yet.
          </p>
        ) : null}
        <SignInForm nextPath={nextPath} notice={notice} />
      </Container>
    </Section>
  );
}
