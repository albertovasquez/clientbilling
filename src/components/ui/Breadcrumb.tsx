import Link from "next/link";
import { siteConfig } from "@/lib/site";

type BreadcrumbProps = {
  items: { label: string; href?: string }[];
  className?: string;
};

/** Visual breadcrumb plus BreadcrumbList JSON-LD. Last item is the current page. */
export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${siteConfig.url}${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={`text-small text-muted ${className}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-action">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={last ? "truncate text-ink-soft" : ""}
                  aria-current={last ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!last ? <span aria-hidden>/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
