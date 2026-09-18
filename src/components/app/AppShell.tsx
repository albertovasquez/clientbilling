import Link from "next/link";
import { signOutAction } from "@/app/app/actions";
import { buttonClass } from "@/components/ui";
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
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-2 text-small font-medium text-ink-soft hover:bg-field hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <form action={signOutAction}>
              <button type="submit" className={buttonClass("quiet", "md", "ml-1")}>
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-page px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
