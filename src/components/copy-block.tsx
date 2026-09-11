import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyBlock({
  title,
  filename,
  code,
  summary,
}: {
  title: string;
  filename: string;
  code: string;
  summary?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <article className="rounded-lg border border-border bg-elevated p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold">{title}</h3>
          <p className="mt-0.5 font-mono text-[11px] text-muted">{filename}</p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={async () => {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            toast.success(`Copied ${filename}`);
            window.setTimeout(() => setCopied(false), 1600);
          }}
        >
          {copied ? <Check /> : <Copy />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      {summary ? <p className="mt-3 text-sm text-muted leading-relaxed">{summary}</p> : null}
      <pre className="mt-3 max-h-64 overflow-auto rounded-md bg-bg p-3 font-mono text-[11px] leading-relaxed text-fg">
        {code}
      </pre>
    </article>
  );
}
