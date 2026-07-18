import * as React from "react"
import { Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AIRecommendationCardProps {
  title: string
  recommendation: string
  actionLabel?: string
  onAction?: () => void
  confidenceLabel?: string
}

export function AIRecommendationCard({
  title,
  recommendation,
  actionLabel,
  onAction,
  confidenceLabel,
}: AIRecommendationCardProps) {
  return (
    <Card variant="ai-recommendation">
      <CardHeader className="pb-3 flex flex-row items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-ai-violet)_0%,var(--color-ai-cyan)_100%)] text-neutral-0">
          <Sparkles className="h-4 w-4" />
        </div>
        <CardTitle className="flex-1">{title}</CardTitle>
        {confidenceLabel && (
          <span className="text-[10px] font-mono text-ai-violet px-2 py-0.5 rounded-full bg-ai-violet/10">
            {confidenceLabel}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-body-md text-neutral-700 leading-relaxed">
          {recommendation}
        </p>
      </CardContent>
      {actionLabel && (
        <CardFooter className="pt-0">
          <Button variant="primary" size="sm" onClick={onAction} className="w-full sm:w-auto mt-2">
            {actionLabel}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
