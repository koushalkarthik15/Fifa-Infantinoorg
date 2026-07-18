"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navigationConfig } from "@/config/navigation"
import { cn } from "@/lib/utils"

export const MobileTabBar = React.memo(function MobileTabBar() {
  const pathname = usePathname()

  // Filter items visible on mobile, limited to 5 max as per TDS
  const mobileItems = navigationConfig
    .filter((item) => item.mobileVisible)
    .slice(0, 5)

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-0 shadow-[0_-4px_12px_rgba(10,42,71,0.08)] pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile Navigation"
    >
      <ul className="flex h-[var(--mobile-nav-height)] items-center justify-around px-2">
        {mobileItems.map((item) => {
          const isActive = pathname === item.href && item.enabled
          const isAI = item.isAI

          if (!item.enabled) {
            return (
              <li key={item.label} className="flex-1">
                <div
                  className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] gap-1 opacity-40 cursor-not-allowed"
                  aria-disabled="true"
                >
                  <item.icon className="h-6 w-6 text-neutral-500" aria-hidden="true" />
                  <span className="text-[10px] font-medium text-neutral-600">
                    {item.label}
                  </span>
                </div>
              </li>
            )
          }

          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] gap-1 rounded-md transition-colors",
                  isActive ? "text-pitch-600" : "text-neutral-600 hover:text-pitch-500"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {isAI ? (
                  <div className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full transition-transform",
                    isActive ? "bg-[linear-gradient(135deg,var(--color-ai-violet)_0%,var(--color-ai-cyan)_100%)] text-neutral-0" : "bg-neutral-100 text-neutral-800"
                  )}>
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">{item.label}</span>
                  </div>
                ) : (
                  <item.icon
                    className={cn("h-6 w-6 transition-transform", isActive && "scale-110")}
                    aria-hidden="true"
                    strokeWidth={isActive ? 2 : 2}
                    fill={isActive ? "currentColor" : "none"}
                  />
                )}
                
                {!isAI && (
                  <span
                    className={cn(
                      "text-[10px] font-medium transition-all",
                      isActive ? "text-pitch-600 font-bold" : "text-neutral-600"
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
})
