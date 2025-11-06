import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/Button";
import { PlusCircle } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { UserAvatarMenu } from "./UserAvatarMenu";
import { MobileMenu } from "./MobileMenu";
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
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto h-16 flex justify-between items-center px-4 md:px-6">
        {/* File Menu (Left Side) */}
        <MobileMenu handleSignOut={handleSignOut} />

        {/* Logo/Brand */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary">
          My<span className="text-foreground">Blog</span>
        </Link>

        {/* Desktop Nav and User Actions (Right Side) */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Desktop Create Post Button */}
          {user && (
            <Link to="/posts/create" className="hidden lg:inline-flex">
              <Button variant="default" size="sm" icon={PlusCircle}>
                Create Post
              </Button>
            </Link>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Authentication/Profile */}
          {user ? (
            <UserAvatarMenu handleSignOut={handleSignOut} />
          ) : (
            <div className="hidden lg:block">
              <Link to="/auth">
                <Button variant="default" size="sm">Sign In</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};