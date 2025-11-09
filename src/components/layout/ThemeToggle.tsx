import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/Button";

export const ThemeToggle = () => {
    const { mode, toggle } = useTheme();

    return (
        <Button
            onClick={toggle}
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
        >
            {mode === "dark"
                ? <Sun className="size-5 transition-transform duration-300" />
                : <Moon className="size-5 transition-transform duration-300" />
            }
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}