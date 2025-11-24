import { Home, Compass, PenSquare, MessageSquareText } from "lucide-react";

export const NAV_LINKS = [
  { name: "Home", path: "/", icon: Home, requiresAuth: false, showInDesktop: true },
  { name: "Explore", path: "/explore", icon: Compass, requiresAuth: false, showInDesktop: true },
  { name: "Write", path: "/create-post", icon: PenSquare, requiresAuth: true, showInDesktop: false }, // Desktop uses a button
  { name: "Messages", path: "/messages", icon: MessageSquareText, requiresAuth: true, showInDesktop: false }, // Mobile only usually
];