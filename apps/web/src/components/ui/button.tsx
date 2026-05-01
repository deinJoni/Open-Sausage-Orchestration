import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-medium outline-none transition-[opacity,background,color,transform,box-shadow] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-destructive/30 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "hover:-translate-y-px rounded-full bg-primary text-primary-foreground hover:bg-foreground active:scale-[0.98]",
        destructive:
          "rounded-full bg-destructive text-primary-foreground hover:opacity-90",
        outline:
          "rounded-full border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-primary-foreground",
        ghost:
          "rounded-none px-0 font-semibold text-[11px] text-foreground uppercase tracking-[0.06em] hover:opacity-70",
        link: "rounded-none px-0 font-semibold text-[11px] text-brand uppercase tracking-[0.06em] hover:opacity-70",
        live: "rounded-full bg-live text-live-foreground shadow-sm",
      },
      size: {
        default: "h-9 px-5 py-2 text-[13px]",
        sm: "h-8 px-3 text-[11px]",
        lg: "h-11 px-7 text-sm",
        icon: "size-9 rounded-full",
      },
    },
    compoundVariants: [
      {
        variant: ["link", "ghost"],
        size: ["default", "sm", "lg"],
        className: "h-auto",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  type = "button",
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? SlotPrimitive.Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      type={type}
      {...props}
    />
  );
}

export { Button, buttonVariants };
