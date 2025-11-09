import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "../ui/DropdownMenu";
import { Button } from "../ui/Button";

interface UserAvatarMenuProps {
    handleSignOut: () => void;
}

export const UserAvatarMenu: React.FC<UserAvatarMenuProps> = ({ handleSignOut }) => {
    const { profile } = useSelector((state: RootState) => state.auth);

    const displayName = profile?.display_name || profile?.username || "User";
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="size-9">
                        <AvatarImage src={profile?.avatar_url || ''} alt={displayName} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">User menu</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-bold">
                    <div className="flex flex-col space-y-1">
                        <p className="font-medium">{displayName}</p>
                        <p className="text-xs text-muted-foreground">
                            @{profile?.username}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center">
                            <User className="mr-2 size-4" />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="flex items-center">
                            <Settings className="mr-2 size-4" />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleSignOut} variant="destructive">
                    <LogOut className="mr-2 size-4" />
                    Log Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
