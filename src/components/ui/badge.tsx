import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase",
  {
    variants: {
      tone: {
        muted: "bg-elevated text-muted border border-border",
        accent: "bg-accent/15 text-accent border border-accent/25",
        danger: "bg-danger/15 text-danger border border-danger/25",
        warn: "bg-warn/15 text-warn border border-warn/25",
        ok: "bg-ok/15 text-ok border border-ok/25",
      },
    },
    defaultVariants: { tone: "muted" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
