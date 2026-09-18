import Link from "next/link";
import { signOutAction } from "@/app/app/actions";
import { Button } from "@/components/shadcn/button";
import { siteConfig } from "@/lib/site";

const nav = [
  { href: "/app", label: "Invoices" },
  { href: "/app/clients", label: "Clients" },
  { href: "/app/invoices/new", label: "New invoice" },
  { href: "/app/recurring", label: "Recurring" },
  { href: "/app/settings", label: "Business" },
  { href: "/app/settings/payments", label: "Getting paid" },
  { href: "/app/settings/api", label: "API" },
];

type Props = {
  email?: string | null;
  isAdmin?: boolean;
  children: React.ReactNode;
};

export function AppShell({ email, isAdmin = false, children }: Props) {
  return (
    <div className="min-h-full bg-field">
      <header className="border-b border-rule bg-paper">
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="font-display text-display-sm font-semibold text-ink"
            >
              {siteConfig.name} invoices
            </Link>
            {email ? (
              <span className="text-caption text-muted">{email}</span>
            ) : null}
          </div>
          <nav className="flex flex-wrap items-center gap-1" aria-label="App">
            {[...nav, ...(isAdmin ? [{ href: "/app/admin/funnel", label: "Funnel" }] : [])].map((item) => (
              <Button key={item.href} asChild variant="ghost" size="sm">
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" size="sm" className="ml-1">
                Sign out
              </Button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-page px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
