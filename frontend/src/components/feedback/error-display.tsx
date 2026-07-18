import * as React from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Heading, Text } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

export interface ErrorDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
  icon?: React.ReactNode
}

export const ErrorDisplay = React.forwardRef<HTMLDivElement, ErrorDisplayProps>(
  (
    {
      title = "Something went wrong",
      description = "We encountered an unexpected issue.",
      onRetry,
      retryLabel = "Try again",
      icon = <AlertCircle className="h-8 w-8 text-semantic-error" aria-hidden="true" />,
      className,
      ...props
    },
    ref
  ) => {
    // Automatically focus the container when rendered to ensure screen readers announce it
    React.useEffect(() => {
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.focus()
      }
    }, [ref])

    return (
      <div
        ref={ref}
        tabIndex={-1} // Makes it focusable programmatically
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-neutral-0 p-8 text-center shadow-elevation-1",
          className
        )}
        role="alert"
        aria-live="assertive"
        {...props}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FCECEE]">
          {icon}
        </div>
        <Heading variant="h4" className="mb-2 text-neutral-900">
          {title}
        </Heading>
        <Text variant="body-md" className="mb-6 max-w-sm text-neutral-600">
          {description}
        </Text>
        {onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            {retryLabel}
          </Button>
        )}
      </div>
    )
  }
)
ErrorDisplay.displayName = "ErrorDisplay"
