import Link from "next/link";

type DisclosureProps = {
  compact?: boolean;
  className?: string;
};

/** The one affiliate disclosure sentence. Directly under every page title. */
export function Disclosure({ compact = false, className = "" }: DisclosureProps) {
  return (
    <p className={`text-caption text-muted ${className}`}>
      {compact
        ? "Affiliate disclosure: ClientBilling may earn a commission from CDG Commerce. "
        : "ClientBilling may earn a commission if you apply to CDG Commerce through our links. It does not change your pricing. "}
      <Link
        href="/affiliate-disclosure"
        className="underline underline-offset-2 hover:text-ink"
      >
        Details
      </Link>
    </p>
  );
}
