import { createContext, useContext, type ReactNode } from "react";
import { useTheme } from "@/hooks/useTheme";

type Theme = "dark" | "light";

type ThemeProviderProps = {
    children: ReactNode;
};

const ThemeProviderContext = createContext<{ theme: Theme } | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
    const { mode } = useTheme();

    return (
        <ThemeProviderContext.Provider value={{ theme: mode }}>
            {children}
        </ThemeProviderContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeProviderContext);
    if (context === undefined) {
        throw new Error("useThemeContext must be used within a ThemeProvider");
    }
    return context;
};