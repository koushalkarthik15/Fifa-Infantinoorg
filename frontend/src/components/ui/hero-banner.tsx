import * as React from "react"
import { cn } from "@/lib/utils"

interface HeroBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  gradient?: "stadium-lights" | "championship-shine"
  primaryAction?: React.ReactNode
  secondaryAction?: React.ReactNode
}

export function HeroBanner({
  title,
  subtitle,
  gradient = "stadium-lights",
  primaryAction,
  secondaryAction,
  className,
  ...props
}: HeroBannerProps) {
  const gradientClass =
    gradient === "stadium-lights"
      ? "bg-[linear-gradient(180deg,rgba(10,42,71,0.8)_0%,rgba(22,72,122,0.9)_100%)] text-neutral-0"
      : "bg-[linear-gradient(135deg,var(--color-gold-300)_0%,var(--color-gold-500)_100%)] text-neutral-900"

  return (
    <section
      className={cn(
        "relative flex flex-col justify-end w-full min-h-[320px] md:min-h-[400px] overflow-hidden rounded-none md:rounded-xl",
        gradientClass,
        className
      )}
      {...props}
    >
      {/* Optional pattern overlay to avoid plain gradients since we aren't using stock photos */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="relative z-10 p-6 md:p-10 container mx-auto">
        <h1 className="text-display-lg md:text-display-xl font-display font-bold tracking-tight mb-4 drop-shadow-sm">
          {title}
        </h1>
        {subtitle && (
          <p className="text-body-lg md:text-h4 opacity-90 mb-6 max-w-2xl">
            {subtitle}
          </p>
        )}
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full sm:w-auto">
            {primaryAction && <div className="w-full sm:w-auto">{primaryAction}</div>}
            {secondaryAction && <div className="w-full sm:w-auto">{secondaryAction}</div>}
          </div>
        )}
      </div>
    </section>
  )
}
