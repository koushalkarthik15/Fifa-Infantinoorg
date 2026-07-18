import * as React from "react"
import { cn } from "@/lib/utils"
import { Heading, Text } from "./typography"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  secondaryAction?: React.ReactNode
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, secondaryAction, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl bg-neutral-50/50 border border-neutral-100 animate-fade-in",
          className
        )}
        {...props}
      >
        {icon && (
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
            {icon}
          </div>
        )}
        <Heading variant="h4" className="mb-2 text-night-900">
          {title}
        </Heading>
        {description && (
          <Text variant="body-md" className="mb-6 max-w-sm text-neutral-600">
            {description}
          </Text>
        )}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            {action && <div>{action}</div>}
            {secondaryAction && <div>{secondaryAction}</div>}
          </div>
        )}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
