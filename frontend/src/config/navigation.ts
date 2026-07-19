import {
  Home,
  Users,
  Map,
  Accessibility,
  HeartHandshake,
  Leaf,
  User,
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
    enabled: true,
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
    label: "Profile",
    href: "/profile",
    icon: User,
    enabled: true,
    mobileVisible: true,
  },
]
