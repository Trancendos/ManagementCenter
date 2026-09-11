import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,color,border-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-fg hover:opacity-90 active:scale-[0.98]",
        secondary:
          "bg-elevated text-fg border border-border hover:border-border-strong",
        ghost: "text-muted hover:text-fg hover:bg-elevated",
        danger:
          "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25",
        outline:
          "border border-border text-fg hover:border-accent/50 hover:text-accent",
      },
      size: {
        sm: "h-8 rounded-sm px-3 text-xs",
        md: "h-10 rounded-md px-4 text-sm",
        lg: "h-11 rounded-md px-5 text-sm",
        icon: "size-10 rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
