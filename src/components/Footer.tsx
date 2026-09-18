import Link from "next/link";
import { CtaButton } from "@/components/ui";
import { author } from "@/lib/author";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-rule bg-field">
      <div className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display text-display-sm font-semibold text-ink">
              {siteConfig.name}
            </p>
            <p className="mt-2 max-w-sm text-small text-ink-soft">
              Independent guides to merchant accounts, processing costs, and
              billing operations, written by{" "}
              <Link href={author.path} className="text-action underline-offset-4 hover:underline">
                {author.name}
              </Link>
              . We may earn a commission when you apply to CDG Commerce through
              our links.
            </p>
          </div>

          <div>
            <p className="text-small font-semibold text-ink">Guides</p>
            <ul className="mt-3 space-y-2">
              {siteConfig.footerNav.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="text-small text-ink-soft hover:text-action focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/methodology" className="text-small text-ink-soft hover:text-action">
                  How we score
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-small font-semibold text-ink">Ready for numbers?</p>
            <p className="mt-3 text-small text-ink-soft">
              CDG answers a quote request with a phone call and a rate sheet.
              Compare the published pricing first if you want context.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <CtaButton cta="quote" position="footer" variant="secondary" />
              <CtaButton cta="apply" position="footer" variant="quiet" />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-rule pt-6 text-small text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="flex flex-wrap gap-x-4">
            <Link href="/affiliate-disclosure" className="underline-offset-2 hover:text-ink hover:underline">
              Affiliate disclosure
            </Link>
            <Link href="/privacy" className="underline-offset-2 hover:text-ink hover:underline">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
