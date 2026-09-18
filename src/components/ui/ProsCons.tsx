type ProsConsProps = {
  pros: string[];
  cons: string[];
  className?: string;
};

export function ProsCons({ pros, cons, className = "" }: ProsConsProps) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 ${className}`}>
      <div>
        <h3 className="text-small font-semibold text-ink">Pros</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-small text-ink-soft">
          {pros.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-small font-semibold text-ink">Cons</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-small text-ink-soft">
          {cons.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
