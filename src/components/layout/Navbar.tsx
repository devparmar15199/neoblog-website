import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { PlusCircle } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { UserAvatarMenu } from "./UserAvatarMenu";
import { MobileMenu } from "./MobileMenu";
import { NotificationBell } from "./NotificationBell";
import toast from 'react-hot-toast';

export const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("Sign out failed. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* File Menu (Left Side) */}
        <MobileMenu handleSignOut={handleSignOut} />

        {/* Logo/Brand */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Neo<span className="text-primary">Blog</span>
        </Link>

        {/* Desktop Nav and User Actions (Right Side) */}
        <nav className="flex items-center gap-2 md:gap-3">
          {/* Desktop Create Post Button */}
          {user && (
            <Link to="/posts/create" className="hidden md:block">
              <Button size="sm" icon={PlusCircle}>
                Create
              </Button>
            </Link>
          )}

          {/* Notification Bell */}
          {user && <NotificationBell />}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Authentication/Profile */}
          {user ? (
            <UserAvatarMenu handleSignOut={handleSignOut} />
          ) : (
            <Link to="/auth" className="hidden md:block">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};