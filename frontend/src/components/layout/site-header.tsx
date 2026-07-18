"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navigationConfig, type NavigationItem } from "@/config/navigation"
import { NavigationOverflow } from "./navigation-overflow"
import { cn } from "@/lib/utils"

export const SiteHeader = React.memo(function SiteHeader() {
  const pathname = usePathname()

  // Desktop shows all primary links except AI and Profile (they go on the right)
  const primaryLinks = navigationConfig.filter(
    (item) => !item.isAI && item.label !== "Profile"
  )

  const profileLink = navigationConfig.find((item) => item.label === "Profile")

  // For tablet sizes, we show fewer links and overflow the rest
  // This is a naive implementation; CSS media queries will handle the visibility
  const visiblePrimaryLinks = primaryLinks.slice(0, 3)
  const overflowLinks = primaryLinks.slice(3)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[var(--header-height)] bg-night-700 text-neutral-0 shadow-elevation-1">
      <div className="mx-auto flex h-full max-w-[var(--container-xl)] items-center justify-between px-4 md:px-6 lg:px-9">
        
        {/* Left: Branding */}
        <div className="flex shrink-0 items-center">
          <Link 
            href="/" 
            className="text-h3 font-display font-bold text-neutral-0 hover:text-neutral-100 rounded-sm"
          >
            InfantinoOrg
          </Link>
        </div>

        {/* Center: Navigation (Hidden on mobile) */}
        <nav 
          className="hidden md:flex flex-1 items-center justify-center gap-6"
          aria-label="Primary Navigation"
        >
          {/* Desktop view: show all */}
          <div className="hidden lg:flex items-center gap-6">
            {primaryLinks.map((item) => (
              <NavLink key={item.label} item={item} pathname={pathname} />
            ))}
          </div>

          {/* Tablet view: show 3, overflow rest */}
          <div className="flex lg:hidden items-center gap-4">
            {visiblePrimaryLinks.map((item) => (
              <NavLink key={item.label} item={item} pathname={pathname} />
            ))}
            <NavigationOverflow items={overflowLinks} />
          </div>
        </nav>

        {/* Right: AI & Profile (Hidden on mobile) */}
        <div className="hidden md:flex shrink-0 items-center gap-4">


          {profileLink && (
            <div className="flex items-center gap-2">
              <Link
                href="/settings"
                className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-300 transition-colors hover:text-neutral-0"
                aria-label="Settings"
              >
                {/* Dynamically import Settings icon from lucide to avoid changing import at top */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </Link>
              <Link
                href={profileLink.href}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-neutral-300 transition-colors",
                  !profileLink.enabled && "opacity-50 pointer-events-none",
                  profileLink.enabled && "hover:text-neutral-0"
                )}
                aria-label={profileLink.label}
                aria-disabled={!profileLink.enabled}
              >
                <profileLink.icon className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
})

function NavLink({ item, pathname }: { item: NavigationItem; pathname: string }) {
  const isActive = pathname === item.href && item.enabled

  if (!item.enabled) {
    return (
      <span
        className="text-body-md font-medium text-neutral-400 opacity-60 cursor-not-allowed"
        aria-disabled="true"
      >
        {item.label}
      </span>
    )
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "relative text-body-md font-medium transition-colors rounded-sm",
        isActive ? "text-neutral-0" : "text-neutral-300 hover:text-neutral-0"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {item.label}
      {isActive && (
        <span
          className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-pitch-500"
          aria-hidden="true"
        />
      )}
    </Link>
  )
}
