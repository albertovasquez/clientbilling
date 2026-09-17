import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-start px-4 py-24 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-teal-800">
        404
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-source-serif)] text-3xl font-semibold text-slate-900">
        Page not found
      </h1>
      <p className="mt-3 text-slate-600">
        That URL does not match a page on ClientBilling. Try the blog index or
        head home.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Go home
        </Link>
        <Link
          href="/blog"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          Browse blog
        </Link>
      </div>
    </div>
  );
}
