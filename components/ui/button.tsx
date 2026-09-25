import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent text-button font-semibold whitespace-nowrap transition-colors outline-hidden select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-green text-bone hover:bg-moss",
        secondary:
          "border-gray bg-transparent text-current hover:bg-smoke/40",
      },
      size: {
        default: "h-11 gap-2 px-6",
        icon: "size-10",
        "icon-sm": "size-8",
      },
      arrow: {
        true: "pr-3",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      arrow: false,
    },
  }
)

export type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>

function Button({
  className,
  variant = "primary",
  size = "default",
  arrow = false,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    arrow?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, arrow, className }))}
      {...props}
    >
      {children}
      {!asChild && arrow ? (
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-current/10">
          <ArrowRight className="size-3.5" aria-hidden />
        </span>
      ) : null}
    </Comp>
  )
}

export { Button, buttonVariants }
