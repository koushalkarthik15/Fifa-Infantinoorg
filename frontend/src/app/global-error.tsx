"use client"

import * as React from "react"
import { ErrorDisplay } from "@/components/feedback/error-display"
import { inter, ibmPlexMono, clashDisplayVariable } from "@/lib/fonts"
import "./globals.css" // Required because the root layout's CSS won't be loaded if it crashes

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error("Global Error caught:", error)
  }, [error])

  return (
    <html lang="en">
      <body
        className={`
          ${inter.variable} 
          ${ibmPlexMono.variable} 
          ${clashDisplayVariable} 
          antialiased min-h-screen bg-neutral-50 flex items-center justify-center p-6
        `}
      >
        <ErrorDisplay
          title="Application Error"
          description="A critical error occurred. Please refresh the page or try again."
          onRetry={() => {
            // Attempt to recover by resetting the error boundary, 
            // or falling back to a hard reload if the crash is severe.
            reset()
            window.location.reload()
          }}
          retryLabel="Reload Application"
          className="max-w-md w-full"
        />
      </body>
    </html>
  )
}
