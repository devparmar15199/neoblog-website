import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setTheme, toggleTheme } from "@/store/slices/themeSlice";

export const useTheme = () => {
    const dispatch = useDispatch();
    const { mode } = useSelector((state: RootState) => state.theme);

    // Sync theme with document class and localStorage whenever 'mode' changes
    useEffect(() => {
        const root = window.document.documentElement;

        // Remove the old class and add the new one
        root.classList.remove("light", "dark");
        root.classList.add(mode);

        // Persist to localStorage
        localStorage.setItem("theme", mode);

    }, [mode]);

    // Handlers
    const toggle = useCallback(() => {
        dispatch(toggleTheme());
    }, [dispatch]);

    const set = useCallback((newMode: "light" | "dark") => {
        dispatch(setTheme(newMode));
    }, [dispatch]);

    return { mode, toggle, set };
};