import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import { Label } from "./ui/Label";
import { Button } from "./ui/Button";

export const ThemeToggle = () => {
    const { mode, toggle } = useTheme();

    return (
        <div className="flex items-center gap-2">
            <Button
                id="theme-mode"
                onClick={toggle} 
                variant="ghost" 
                size="icon"
                aria-label="Toggle theme mode"
            >
            {mode === "dark" 
                ? <Sun className="h-5 w-5" /> 
                : <Moon className="h-5 w-5" />
            }
            </Button>
            <Label htmlFor="theme-mode" className="sr-only">Toggle Dark Mode</Label>
        </div>
    );
}