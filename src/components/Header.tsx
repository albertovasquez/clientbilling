import Link from "next/link";
import { CtaButton, RecordMark } from "@/components/ui";
import { siteConfig } from "@/lib/site";

const linkClass =
  "block whitespace-nowrap rounded-md px-3 py-2 text-small font-medium text-ink-soft transition-colors hover:bg-field hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action";

/**
 * The header (decision 0021): Invoices, Payments, For agents, Developers,
 * Guides, Sign in, with "Create an invoice" as the button. Six items plus a
 * button do not fit a 390 px phone, so below lg they collapse into a native
 * details disclosure: the mark, the site name, and the button stay visible and
 * the menu opens and takes keyboard focus without JavaScript.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-page items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
          aria-label={siteConfig.name}
        >
          <RecordMark />
          <span className="font-display text-body font-semibold text-ink group-hover:text-action sm:text-display-sm">
            {siteConfig.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden min-w-0 items-center gap-1 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link key={`${item.href}-${item.label}`} href={item.href} className={linkClass}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <CtaButton cta={siteConfig.headerCta} position="nav" className="whitespace-nowrap" />
          <details className="group relative lg:hidden">
            <summary
              className="flex cursor-pointer list-none items-center rounded-md p-2 text-ink-soft hover:bg-field hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
              aria-label="Menu"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              >
                <path d="M3 6h14M3 10h14M3 14h14" className="group-open:hidden" />
                <path d="M5 5l10 10M15 5L5 15" className="hidden group-open:block" />
              </svg>
            </summary>
            <nav
              aria-label="Primary, phone"
              className="absolute right-0 top-full z-50 mt-2 w-52 rounded-lg border border-rule bg-paper p-1.5 shadow-lg"
            >
              {siteConfig.nav.map((item) => (
                <Link key={`menu-${item.href}-${item.label}`} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
