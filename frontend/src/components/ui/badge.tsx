import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // TDS Semantic Variants (Additive)
        neutral: "border-transparent bg-neutral-100 text-neutral-800",
        success: "border-transparent bg-pitch-600 text-neutral-0",
        warning: "border-transparent bg-semantic-warning text-neutral-900",
        error: "border-transparent bg-semantic-error text-neutral-900",
        info: "border-transparent bg-semantic-info text-neutral-900",
        gold: "border-transparent bg-[linear-gradient(90deg,var(--color-gold-500)_0%,var(--color-gold-300)_100%)] text-neutral-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
