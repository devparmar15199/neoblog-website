import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { mode } = useSelector((state: RootState) => state.theme);

    useEffect(() => {
        const root = document.documentElement;
        if (mode === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [mode]);

    return <>{children}</>;
};