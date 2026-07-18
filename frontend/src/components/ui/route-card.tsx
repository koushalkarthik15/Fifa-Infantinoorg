import * as React from "react"
import { MapPin, Clock, ArrowRight, Accessibility, Leaf } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"

export interface RouteCardProps {
  destination: string
  eta: string
  distance: string
  transportMode: React.ReactNode
  isAccessible?: boolean
  isSustainable?: boolean
  status?: "available" | "busy" | "error"
  onClick?: () => void
}

export function RouteCard({
  destination,
  eta,
  distance,
  transportMode,
  isAccessible,
  isSustainable,
  status = "available",
  onClick,
}: RouteCardProps) {
  return (
    <Card 
      variant="standard" 
      interactive={!!onClick} 
      className={onClick ? "cursor-pointer" : ""}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-night-100 text-night-700">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-body-sm text-neutral-600 font-medium mb-0.5">Destination</p>
              <h4 className="text-h4 text-neutral-900">{destination}</h4>
            </div>
          </div>
          
          <div className="flex items-center self-start sm:self-auto space-x-2">
            <StatusBadge 
              status={status} 
              icon={Clock} 
              label={eta} 
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
          <div className="flex items-center gap-4 text-body-sm text-neutral-600 font-mono">
            <span className="flex items-center gap-1.5">
              {transportMode}
            </span>
            <span className="text-neutral-300">•</span>
            <span>{distance}</span>
          </div>

          <div className="flex items-center gap-2">
            {isAccessible && (
              <div 
                className="flex h-7 w-7 items-center justify-center rounded-full bg-pitch-100 text-pitch-600"
                title="Accessible Route"
              >
                <Accessibility className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Accessible Route</span>
              </div>
            )}
            {isSustainable && (
              <div 
                className="flex h-7 w-7 items-center justify-center rounded-full bg-semantic-success/15 text-semantic-success"
                title="Sustainable Route"
              >
                <Leaf className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Sustainable Route</span>
              </div>
            )}
            {onClick && (
              <ArrowRight className="h-4 w-4 text-neutral-400 ml-2" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
