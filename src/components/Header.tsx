import Link from "next/link";
import { softCtaCopy, siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-800 text-sm font-bold text-white shadow-sm"
          >
            CB
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900 group-hover:text-teal-800">
            {siteConfig.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          {siteConfig.nav.map((item) => {
            const isCdg = item.href === "/cdgcommerce";
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={
                  isCdg
                    ? "rounded-md px-2.5 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:px-3"
                    : "rounded-md px-2.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:px-3"
                }
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/cdgcommerce"
            className="ml-1 hidden rounded-lg bg-teal-800 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:inline-flex"
          >
            {softCtaCopy.checkCdgOptions}
          </Link>
        </nav>
      </div>
    </header>
  );
}
