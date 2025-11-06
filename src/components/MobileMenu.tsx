import React from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/Button";
import { MenuIcon, HomeIcon, PlusCircle, LogOut, UserCog } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";


interface MobileMenuProps {
    handleSignOut: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ handleSignOut }) => {
    const { user, profile } = useSelector((state: RootState) => state.auth);

    // Common navigation links
    const navLinks = [
        { name: "Home", path: "/", icon: HomeIcon },
        { name: "Create Post", path: "/posts/create", icon: PlusCircle, requiresAuth: true },
        { name: "Profile", path: "/profile", icon: UserCog, requiresAuth: true },
        { name: "Logout", path: "/", icon: LogOut, requiresAuth: true },
    ];

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="lg:hidden"
                >
                    <MenuIcon className="size-5" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-6">
                    {navLinks.map((link) => {
                        if (link.requiresAuth && !user) return null;

                        return (
                            <Link key={link.path} to={link.path} className="text-lg font-medium hover:text-primary transition-colors">
                                <Button variant="ghost" className="w-full justify-start">
                                    <link.icon className="size-5 mr-2" />
                                    {link.name}
                                </Button>
                            </Link>
                        );
                    })}
                </div>

                {user && (
                    <div className="border-t pt-4">
                        <Link to="/profile" className="w-full">
                            <Button variant="ghost" className="w-full justify-start mb-2">
                                <UserCog className="size-5 mr-2" />
                                {profile?.display_name || profile?.username || "Profile"}
                            </Button>
                        </Link>
                        <Button
                            onClick={handleSignOut}
                            variant="destructive"
                            className="w-full"
                            icon={LogOut}
                        >
                            Sign Out
                        </Button>
                    </div>
                )}
                {!user && (
                    <div className="border-t pt-4">
                        <Link to="/auth" className="w-full">
                            <Button variant="default" className="w-full">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};