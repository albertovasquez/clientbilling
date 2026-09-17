import { cdgClaims } from "@/lib/site";

type FitNotFitProps = {
  id?: string;
  className?: string;
};

/** Prequalification: who should consider CDG vs who probably isn't a fit. */
export function FitNotFit({ id = "fit", className = "" }: FitNotFitProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 ${className}`.trim()}
    >
      <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Is CDG Commerce a fit?
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
        A quick prequalification filter — based on how CDG describes who they
        can and cannot support. Confirm details directly with CDG during a
        quote or application.
      </p>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-teal-200 bg-teal-50/60 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-teal-950">
            Worth considering if…
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-700">
            {cdgClaims.fitIf.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700"
                />
                {item}
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Probably isn&apos;t right if…
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-700">
            {cdgClaims.notFitIf.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-400"
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            Restricted categories can change. Phrase carefully and verify with
            CDG — we do not invent eligibility rules.
          </p>
        </article>
      </div>
    </section>
  );
}
