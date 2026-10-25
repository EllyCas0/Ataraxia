import { BookMarked, Compass, MessageCircle, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Paths that should highlight this item as the active section. */
  matches: string[];
}

export const navItems: NavItem[] = [
  { href: "/ideas", label: "Discover", icon: Compass, matches: ["/discover", "/ideas", "/weekly", "/reframe", "/ethics", "/insights"] },
  { href: "/reflect", label: "Reflect", icon: MessageCircle, matches: ["/reflect"] },
  { href: "/my-philosophy", label: "My Philosophy", icon: BookMarked, matches: ["/my-philosophy"] },
];

// The only way into a new conversation is the primary button on Discover and on Reflect: there is no
// separate "New" button in the navigation.
export const NEW_CONVERSATION_HREF = "/reflect/new";

export function isActive(item: NavItem, pathname: string): boolean {
  return item.matches.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
