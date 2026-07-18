import type { Metadata, Viewport } from "next";
import { inter, ibmPlexMono, clashDisplayVariable } from "@/lib/fonts";
import { AppProviders } from "@/providers/app-providers";
import { SkipToContent } from "@/components/a11y/skip-to-content";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | InfantinoOrg",
    default: "InfantinoOrg | Your World Cup Companion",
  },
  description: "The AI-augmented companion platform for the FIFA World Cup 2026.",
  applicationName: "InfantinoOrg",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F9FA" }, // neutral-50
    { media: "(prefers-color-scheme: dark)", color: "#14181D" },  // neutral-900
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${inter.variable} 
          ${ibmPlexMono.variable} 
          ${clashDisplayVariable} 
          antialiased min-h-screen flex flex-col
        `}
      >
        <AppProviders>
          <SkipToContent />
          <SiteHeader />
          <main 
            id="main-content" 
            className="flex flex-col min-h-[calc(100vh-var(--header-height))] pt-[var(--header-height)] md:pb-0 pb-[calc(var(--mobile-nav-height)+env(safe-area-inset-bottom))]"
          >
            {children}
          </main>
          <SiteFooter />
          <MobileTabBar />
        </AppProviders>
      </body>
    </html>
  );
}
