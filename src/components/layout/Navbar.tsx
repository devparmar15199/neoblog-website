import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, PenSquare } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";
import { UserAvatarMenu } from "./UserAvatarMenu";
import { NotificationBell } from "./NotificationBell";
import { MobileMenu } from "./MobileMenu";
import { NAV_LINKS } from "@/config/navigation";

export const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 font-bold text-xl mr-6">
          <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            NeoBlog
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {NAV_LINKS.filter(l => l.showInDesktop).map(link => (
            <Link key={link.path} to={link.path} className="hover:text-primary transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Search Bar (Flex-1 to push items to sides) */}
        <div className="hidden md:flex flex-1 items-center justify-center px-4 max-w-lg mx-auto">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="pl-9 h-9 w-full bg-muted/50 focus:bg-background transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <ThemeToggle />

          {user ? (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate('/create-post')}>
                <PenSquare className="mr-2 h-4 w-4" /> Write
              </Button>
              <NotificationBell />
              <UserAvatarMenu />
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/auth?mode=login')}>Log in</Button>
              <Button onClick={() => navigate('/auth?mode=register')}>Sign up</Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
    </header>
  );
};