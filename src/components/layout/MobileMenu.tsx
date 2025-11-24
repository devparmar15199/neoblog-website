import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/Sheet";
import { Button } from "../ui/Button";
import { LogOut, UserCog, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { NAV_LINKS } from "@/config/navigation";
import toast from "react-hot-toast";

interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, setIsOpen }) => {
    const { user, profile, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        setIsOpen(false);
        toast.success("Signed out");
        navigate("/auth");
    };

    const handleLinkClick = () => setIsOpen(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="left" className="w-72 p-0 flex flex-col h-full">
                <SheetHeader className="p-6 border-b">
                    <SheetTitle className="text-2xl font-bold text-left bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        NeoBlog
                    </SheetTitle>
                </SheetHeader>

                <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
                    {NAV_LINKS.map((link) => {
                        if (link.requiresAuth && !user) return null;
                        return (
                            <Link key={link.path} to={link.path} onClick={handleLinkClick}>
                                <Button variant="ghost" className="w-full justify-start text-lg font-medium h-12">
                                    <link.icon className="size-5 mr-3" />
                                    {link.name}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t p-4 mt-auto">
                    {user ? (
                        <div className="space-y-2">
                            <Link to="/profile" onClick={handleLinkClick}>
                                <Button variant="ghost" className="w-full justify-start text-base">
                                    <UserCog className="size-5 mr-3" />
                                    {profile?.display_name || "Profile"}
                                </Button>
                            </Link>
                            <Button onClick={handleSignOut} variant="destructive" className="w-full justify-start">
                                <LogOut className="size-5 mr-3" /> Sign Out
                            </Button>
                        </div>
                    ) : (
                        <Link to="/auth" onClick={handleLinkClick}>
                            <Button className="w-full" icon={LogIn}>Sign In</Button>
                        </Link>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};