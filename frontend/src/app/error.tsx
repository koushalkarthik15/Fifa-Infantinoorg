"use client"

import * as React from "react"
import { ErrorDisplay } from "@/components/feedback/error-display"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    // Log the error to an error reporting service if it existed
    console.error("Route Error caught by error.tsx:", error)
  }, [error])

  // Focus management is handled inside ErrorDisplay's internal ref,
  // but we can pass our own ref if we want to control it from the page level.
  // We'll let ErrorDisplay handle the auto-focus since it's built-in.
  
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <ErrorDisplay
        ref={containerRef}
        title="We encountered an issue"
        description="Something went wrong while loading this page. Please try again."
        onRetry={reset}
        retryLabel="Try again"
        className="max-w-md w-full"
      />
    </div>
  )
}
