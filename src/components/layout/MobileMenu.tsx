import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/Sheet";
import { Button } from "../ui/Button";
import { Home, PlusCircle, LogOut, UserCog, MessageSquareText, LogIn } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

interface MobileMenuProps {
    handleSignOut: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ handleSignOut }) => {
    const { user, profile } = useSelector((state: RootState) => state.auth);

    const navLinks = [
        { name: "Home", path: "/", icon: Home, requiresAuth: false },
        { name: "Create Post", path: "/posts/create", icon: PlusCircle, requiresAuth: true },
        { name: "Messages", path: "/messages", icon: MessageSquareText, requiresAuth: true },
    ];

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="lg:hidden"
                >
                    <span className="sr-only">Open menu</span>
                    {/* <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg> */}
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="p-6 border-b">
                    <SheetTitle className="text-2xl font-bold text-primary">NeoBlog</SheetTitle>
                </SheetHeader>

                <nav className="flex-1 space-y-1 p-4">
                    {navLinks.map((link) => {
                        if (link.requiresAuth && !user) return null;
                        return (
                            <SheetTrigger asChild key={link.path}>
                                <Link to={link.path}>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-lg font-medium hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <link.icon className="size-5 mr-3" />
                                        {link.name}
                                    </Button>
                                </Link>
                            </SheetTrigger>
                        );
                    })}
                </nav>

                {/* Auth/User Footer Section */}
                <div className="border-t p-4">
                    {user ? (
                        <>
                            <SheetTrigger asChild>
                                <Link to="/profile" className="block">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-base font-medium"
                                    >
                                        <UserCog className="size-5 mr-3" />
                                        {profile?.display_name || profile?.username}
                                    </Button>
                                </Link>
                            </SheetTrigger>
                            <Button
                                onClick={handleSignOut}
                                variant="destructive"
                                className="mt-2 w-full justify-start"
                                icon={LogOut}
                            >
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <SheetTrigger asChild>
                            <Link to="/auth">
                                <Button
                                    variant="default"
                                    className="w-full"
                                    icon={LogIn}
                                >
                                    Sign In
                                </Button>
                            </Link>
                        </SheetTrigger>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};