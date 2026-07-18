"use client"

import * as React from "react"
import Link from "next/link"
import { MapPinOff } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Focus the container on mount so screen readers announce the 404 state
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus()
    }
  }, [])

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <EmptyState
        ref={containerRef}
        tabIndex={-1}
        icon={<MapPinOff className="h-6 w-6" aria-hidden="true" />}
        title="Page not found"
        description="The page you are looking for doesn't exist or has been moved."
        className="max-w-md w-full rounded-lg"
        action={
          <Button asChild variant="primary">
            <Link href="/">Return to Home</Link>
          </Button>
        }
      />
    </div>
  )
}
