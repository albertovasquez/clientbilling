import type { Metadata } from "next";
import { auth } from "@/auth";
import { AppShell } from "@/components/app/AppShell";
import { isAdminEmail } from "@/lib/admin";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: {
    default: "Invoices",
    template: "%s | ClientBilling invoices",
  },
};

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // Auth pages render without the app chrome.
  if (!session?.user) {
    return <div className="min-h-full bg-field">{children}</div>;
  }
  return (
    <AppShell email={session.user.email} isAdmin={isAdminEmail(session.user.email)}>
      {children}
    </AppShell>
  );
}
