import { BookMarked, Compass, House, Scale, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Paths that should highlight this item as the active section. */
  matches: string[];
}

export const navItems: NavItem[] = [
  { href: "/discover", label: "Home", icon: House, matches: ["/", "/discover"] },
  { href: "/ideas", label: "Explore ideas", icon: Compass, matches: ["/ideas", "/weekly", "/reframe", "/insights"] },
  { href: "/ethics/natural-law", label: "Natural Law", icon: Scale, matches: ["/ethics"] },
  { href: "/my-philosophy", label: "My Philosophy", icon: BookMarked, matches: ["/my-philosophy"] },
];

export function isActive(item: NavItem, pathname: string): boolean {
  return item.matches.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
