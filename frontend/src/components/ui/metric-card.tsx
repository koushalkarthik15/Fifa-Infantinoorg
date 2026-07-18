import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"

export interface MetricCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    direction: "up" | "down" | "neutral"
  }
}

export function MetricCard({ label, value, icon: Icon, trend }: MetricCardProps) {
  return (
    <Card variant="standard" className="h-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-body-sm font-medium text-neutral-600">
              {label}
            </p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-h2 font-display font-bold text-neutral-900">
                {value}
              </h4>
              {trend && (
                <div 
                  className={`flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    trend.direction === "up" 
                      ? "bg-semantic-success/15 text-semantic-success" 
                      : trend.direction === "down" 
                        ? "bg-semantic-error/15 text-semantic-error" 
                        : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {trend.direction === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
                  {trend.direction === "down" && <TrendingDown className="h-3 w-3 mr-1" />}
                  {trend.direction === "neutral" && <Minus className="h-3 w-3 mr-1" />}
                  {trend.value}
                </div>
              )}
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-night-100/50 text-night-700">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
