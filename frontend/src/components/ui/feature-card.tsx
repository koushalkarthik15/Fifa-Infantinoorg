import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  iconClassName?: string
  statusNode?: React.ReactNode
  metricsNode?: React.ReactNode
  interactive?: boolean
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  iconClassName,
  statusNode,
  metricsNode,
  interactive = false,
}: FeatureCardProps) {
  return (
    <Card 
      variant="standard" 
      interactive={interactive} 
      className={interactive ? "cursor-pointer" : ""}
    >
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-night-100 text-night-700", iconClassName)}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        {statusNode && <div>{statusNode}</div>}
      </CardHeader>
      <CardContent className="pb-4">
        <CardTitle className="mb-2 text-h4">{title}</CardTitle>
        <CardDescription className="text-body-sm line-clamp-2">
          {description}
        </CardDescription>
      </CardContent>
      {metricsNode && (
        <CardFooter className="pt-0 pb-6">
          <div className="w-full flex items-center justify-between border-t border-neutral-100 pt-4">
            {metricsNode}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
