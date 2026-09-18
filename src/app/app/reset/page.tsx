import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ResetRequestForm } from "@/components/app/ResetForms";
import { Container, Heading, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Reset your password",
  robots: { index: false, follow: false },
};

export default async function ResetPage() {
  const session = await auth();
  if (session?.user) redirect("/app");

  return (
    <Section>
      <Container width="article">
        <Heading level={1}>Reset your password</Heading>
        <p className="mt-4 text-body text-ink-soft">
          Enter the email on your account and we will send a link to choose a new password.
        </p>
        <ResetRequestForm />
      </Container>
    </Section>
  );
}
