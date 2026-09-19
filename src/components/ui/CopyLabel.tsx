export type CopyKind = "client" | "file" | "agent";

const labels: Record<CopyKind, string> = {
  client: "Client copy",
  file: "File copy",
  agent: "Agent copy",
};

type CopyLabelProps = {
  kind: CopyKind;
  className?: string;
};

/**
 * Which copy of the record a view is (docs/brand/brief.md, "Copy labels").
 * Top right of a document, in caption Plex Mono with a carbon rule. The
 * client copy shows how to pay, the file copy adds the economics, the agent
 * copy is the JSON.
 */
export function CopyLabel({ kind, className = "" }: CopyLabelProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-sm border border-carbon px-1.5 py-0.5 font-mono text-[0.75rem] leading-tight text-carbon ${className}`}
    >
      {labels[kind]}
    </span>
  );
}
