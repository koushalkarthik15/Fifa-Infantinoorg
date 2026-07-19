"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { type NavigationItem } from "@/config/navigation"

export interface NavigationOverflowProps {
  items: NavigationItem[]
}

/**
 * A simplified implementation for the "More" overflow menu on tablet sizes.
 * Will be upgraded to a Radix Dropdown/Sheet in future updates.
 */
export function NavigationOverflow({ items }: NavigationOverflowProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  // Close the menu when clicking outside (default behavior)
  React.useEffect(() => {
    const handleOutsideClick = () => {
      setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener("click", handleOutsideClick)
      return () => document.removeEventListener("click", handleOutsideClick)
    }
  }, [isOpen])

  if (items.length === 0) return null

  return (
    <div className="relative">
      <button
        type="button"
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 text-body-md font-medium text-neutral-0 hover:text-pitch-300 rounded-md transition-colors",
          isOpen && "text-pitch-300"
        )}
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span>More</span>
        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-md bg-neutral-0 py-1 shadow-elevation-3 ring-1 ring-night-900/5 z-50"
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item) => {
            const isActive = pathname === item.href && item.enabled
            
            if (!item.enabled) {
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-2 px-4 py-2 text-body-sm text-neutral-400 cursor-not-allowed opacity-60"
                  role="menuitem"
                  aria-disabled="true"
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </div>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-body-sm hover:bg-neutral-50 focus:bg-neutral-50",
                  isActive ? "text-pitch-600 font-semibold bg-pitch-100" : "text-neutral-800"
                )}
                role="menuitem"
                aria-current={isActive ? "page" : undefined}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
