import Link from "next/link";
import { CtaButton } from "@/components/ui";
import { siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
        >
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-action font-display text-small font-semibold text-paper"
          >
            CB
          </span>
          <span className="font-display text-display-sm font-semibold text-ink group-hover:text-action">
            {siteConfig.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          {siteConfig.nav.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className="rounded-md px-2.5 py-2 text-small font-medium text-ink-soft transition-colors hover:bg-field hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action sm:px-3"
            >
              {item.label}
            </Link>
          ))}
          <CtaButton cta="compare" position="nav" className="ml-1 hidden sm:inline-flex" />
        </nav>
      </div>
    </header>
  );
}
