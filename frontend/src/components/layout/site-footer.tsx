import * as React from "react"
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="w-full bg-neutral-50 py-8 md:py-12 border-t border-neutral-200">
      <div className="mx-auto max-w-[var(--container-xl)] px-4 md:px-6 lg:px-9">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-body-md font-semibold text-neutral-800">
              InfantinoOrg
            </span>
            <span className="text-body-sm text-neutral-600">
              &copy; {new Date().getFullYear()}
            </span>
          </div>
          
          <nav aria-label="Footer Navigation">
            <ul className="flex items-center gap-6 text-body-sm text-neutral-600">
              <li>
                <span className="text-neutral-600">Developed by </span>
                <Link
                  href="https://github.com/koushalkarthik15"
                  className="hover:text-night-700 rounded-sm transition-colors font-semibold text-neutral-800"
                >
                  Koushal Karthik Rao
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
