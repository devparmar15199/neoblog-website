import { Outlet, Link, useLocation } from "react-router-dom";
import { Users, FileText, Tags, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navItems = [
    { name: "Overview", path: "/admin", icon: BarChart },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Posts", path: "/admin/posts", icon: FileText },
    { name: "Taxonomy", path: "/admin/taxonomy", icon: Tags },
];

export const AdminLayout = () => {
    const location = useLocation();

    return (
        <div className="flex flex-col md:flex-row gap-8 pt-4">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 shrink-0 space-y-2">
                <div className="font-bold text-xl px-4 mb-4 text-red-600">Admin Panel</div>
                <nav className="grid gap-1">
                    {navItems.map((item) => (
                        <Link key={item.path} to={item.path}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-2",
                                    location.pathname === item.path && "bg-secondary font-semibold"
                                )}
                            >
                                <item.icon className="size-4" />
                                {item.name}
                            </Button>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
                <div className="bg-card border rounded-lg shadow-sm p-6 min-h-[calc(100vh-10rem)]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};