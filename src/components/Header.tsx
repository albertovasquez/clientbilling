import Link from "next/link";
import { CtaButton, RecordMark } from "@/components/ui";
import { siteConfig } from "@/lib/site";

const linkClass =
  "block whitespace-nowrap rounded-md px-3 py-2 text-small font-medium text-ink-soft transition-colors hover:bg-field hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action";

/** The six items, rendered the same way in the desktop bar and the phone menu. */
function NavLinks({ keyPrefix }: { keyPrefix: string }) {
  return siteConfig.nav.map((item) => (
    <Link key={`${keyPrefix}-${item.href}-${item.label}`} href={item.href} className={linkClass}>
      {item.label}
    </Link>
  ));
}

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
      <div className="mx-auto flex max-w-page items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action sm:gap-2.5"
          aria-label={siteConfig.name}
        >
          <RecordMark />
          {/*
            The site name stays visible and whole at every width (style guide,
            site navigation): a truncated wordmark reading "Client..." is not
            the site name, so it never truncates. At 320px the row buys the
            space from padding, from gaps, and from one step down in the
            wordmark's own size below 360px. The button keeps text-small,
            which is the size the type scale gives buttons.
          */}
          <span className="whitespace-nowrap font-display text-body font-semibold text-ink group-hover:text-action max-[360px]:text-small sm:text-display-sm">
            {siteConfig.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden min-w-0 items-center gap-1 lg:flex">
          <NavLinks keyPrefix="bar" />
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <CtaButton
            cta={siteConfig.headerCta}
            position="nav"
            className="whitespace-nowrap max-sm:px-2.5"
          />
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
              className="absolute right-0 top-full z-50 mt-2 w-52 rounded border border-rule-strong bg-paper p-1.5"
            >
              <NavLinks keyPrefix="menu" />
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
