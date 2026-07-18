import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
  {
    variants: {
      status: {
        active: "bg-pitch-500/15 text-pitch-800",
        available: "bg-semantic-success/15 text-pitch-800",
        busy: "bg-semantic-warning/15 text-neutral-900",
        warning: "bg-semantic-warning/15 text-neutral-900",
        success: "bg-semantic-success/15 text-pitch-800",
        offline: "bg-neutral-400/15 text-neutral-800",
        error: "bg-semantic-error/15 text-neutral-900",
        ai: "bg-ai-violet/15 text-neutral-900",
        live: "bg-semantic-error/15 text-neutral-900 animate-pulse",
      },
    },
    defaultVariants: {
      status: "active",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  icon: LucideIcon
  label: string
}

export function StatusBadge({
  className,
  status,
  icon: Icon,
  label,
  ...props
}: StatusBadgeProps) {
  return (
    <div
      className={cn(statusBadgeVariants({ status }), className)}
      role="status"
      {...props}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
