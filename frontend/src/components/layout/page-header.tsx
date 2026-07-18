import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  iconClassName?: string
  badge?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  iconClassName,
  badge,
  actions,
  className
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-start md:justify-between pb-6 border-b border-neutral-100", className)}>
      <div className="flex gap-4 items-start">
        {Icon && (
          <div className={cn("hidden sm:flex mt-1 h-12 w-12 items-center justify-center rounded-xl bg-night-100 text-night-700", iconClassName)}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-display-sm text-night-900 font-display font-bold">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className="text-body-md text-neutral-600 max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}
