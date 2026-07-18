import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-sans font-semibold transition-all disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-pitch-600 text-neutral-0 hover:bg-pitch-800 active:scale-[0.98] active:brightness-95 shadow-elevation-1 hover:shadow-elevation-2",
        secondary:
          "border border-night-700 bg-transparent text-night-700 hover:bg-night-100 active:scale-[0.98]",
        ghost:
          "bg-transparent text-night-700 hover:bg-neutral-100 active:bg-neutral-200",
        gold:
          "bg-[linear-gradient(90deg,var(--color-gold-500)_0%,var(--color-gold-300)_100%)] text-neutral-900 hover:brightness-110 active:scale-[0.98] shadow-elevation-1 hover:shadow-elevation-2",
        destructive:
          "bg-semantic-error text-neutral-0 hover:brightness-90 active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-5 py-2.5 text-sm", // md (44px min touch target)
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11", // 44px
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={isLoading || props.disabled}
          aria-busy={isLoading}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        <span className={cn(isLoading && "opacity-0")}>{children}</span>
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
