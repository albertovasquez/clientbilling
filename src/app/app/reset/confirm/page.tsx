import type { Metadata } from "next";
import Link from "next/link";
import { ResetConfirmForm } from "@/components/app/ResetForms";
import { Container, Heading, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

type Props = { searchParams?: Promise<{ email?: string; token?: string }> };

export default async function ResetConfirmPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const email = typeof params.email === "string" ? params.email.toLowerCase().trim() : "";
  const token = typeof params.token === "string" ? params.token : "";
  const valid = email.includes("@") && token.length >= 20;

  return (
    <Section>
      <Container width="article">
        <Heading level={1}>Choose a new password</Heading>
        {valid ? (
          <ResetConfirmForm email={email} token={token} />
        ) : (
          <p className="mt-4 text-body text-ink-soft">
            This reset link is incomplete.{" "}
            <Link href="/app/reset" className="font-semibold text-action hover:underline">
              Request a new one
            </Link>
            .
          </p>
        )}
      </Container>
    </Section>
  );
}
