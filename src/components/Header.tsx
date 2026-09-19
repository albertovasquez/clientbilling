import Link from "next/link";
import { CtaButton, RecordMark } from "@/components/ui";
import { siteConfig } from "@/lib/site";

/**
 * At phone width the site name is hidden (the mark stays) so the three nav
 * links fit without wrapping; the compare button appears from sm up.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-3 sm:flex-nowrap sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
          aria-label={siteConfig.name}
        >
          <RecordMark />
          <span className="hidden font-display text-display-sm font-semibold text-ink group-hover:text-action sm:inline">
            {siteConfig.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="flex min-w-0 flex-wrap items-center gap-0.5 sm:flex-nowrap sm:gap-2">
          {siteConfig.nav.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className="whitespace-nowrap rounded-md px-2 py-2 text-small font-medium text-ink-soft transition-colors hover:bg-field hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action sm:px-3"
            >
              {item.label}
            </Link>
          ))}
          <span className="hidden sm:inline-flex">
            <CtaButton cta="compare" position="nav" className="ml-1 whitespace-nowrap" />
          </span>
        </nav>
      </div>
    </header>
  );
}
