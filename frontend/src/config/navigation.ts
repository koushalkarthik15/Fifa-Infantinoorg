import {
  Home,
  Users,
  Map,
  Accessibility,
  HeartHandshake,
  Leaf,
  User,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

export interface NavigationItem {
  label: string
  href: string
  icon: LucideIcon
  enabled: boolean
  mobileVisible: boolean // whether it appears in the bottom mobile tab bar
  isAI?: boolean
}

export const navigationConfig: NavigationItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    enabled: true, // we have a placeholder home page
    mobileVisible: true,
  },
  {
    label: "Crowd Intelligence",
    href: "/crowd",
    icon: Users,
    enabled: true,
    mobileVisible: true,
  },
  {
    label: "Navigation",
    href: "/navigation",
    icon: Map,
    enabled: true,
    mobileVisible: true,
  },
  {
    label: "Accessibility",
    href: "/accessibility",
    icon: Accessibility,
    enabled: true,
    mobileVisible: false,
  },
  {
    label: "Volunteer",
    href: "/volunteer",
    icon: HeartHandshake,
    enabled: true,
    mobileVisible: false,
  },
  {
    label: "Sustainability",
    href: "/sustainability",
    icon: Leaf,
    enabled: true,
    mobileVisible: false,
  },
  {
    label: "AI Companion",
    href: "/ai-companion", // Assuming we will have an AI companion page later, but for now it's enabled
    icon: Sparkles,
    enabled: true,
    mobileVisible: true,
    isAI: true,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    enabled: true,
    mobileVisible: true,
  },
]
