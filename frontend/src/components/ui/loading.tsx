import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: "sm" | "md" | "lg"
}

const spinnerSizes = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size = "md", ...props }, ref) => (
    <Loader2
      ref={ref}
      className={cn("animate-spin text-neutral-400", spinnerSizes[size], className)}
      role="status"
      aria-label="Loading"
      {...props}
    />
  )
)
Spinner.displayName = "Spinner"

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("animate-pulse rounded-md bg-neutral-200", className)}
      {...props}
    />
  )
)
Skeleton.displayName = "Skeleton"

export interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ className, message = "Loading...", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-0/80 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <Spinner size="lg" className="text-pitch-500 mb-4" />
      {message && (
        <span className="text-body-md font-medium text-neutral-800" aria-live="polite">
          {message}
        </span>
      )}
    </div>
  )
)
LoadingOverlay.displayName = "LoadingOverlay"

export { Spinner, Skeleton, LoadingOverlay }
