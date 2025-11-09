import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setTheme, toggleTheme } from "@/store/slices/themeSlice";

export const useTheme = () => {
    const dispatch = useDispatch();
    const { mode } = useSelector((state: RootState) => state.theme);

    // Sync theme with localStorage and document class
    useEffect(() => {
        const savedMode = localStorage.getItem("theme") as "light" | "dark" | null;

        // On mount: restore from localStorage or system preference
        if (savedMode) {
            dispatch(setTheme(savedMode));
        } else if (window.matchMedia("(prefers-color-scheme: dark").matches) {
            dispatch(setTheme("dark"));
        }

        // Apply theme class to document
        document.documentElement.classList.toggle("dark", mode === "dark");
    }, [dispatch, mode]);

    // Toggle theme and persist
    const toggle = () => {
        const newMode = mode === "light" ? "dark" : "light";
        dispatch(toggleTheme());
        localStorage.setItem("theme", newMode);
    };

    // Set theme explicitly
    const set = (newMode: "light" | "dark") => {
        dispatch(setTheme(newMode));
        localStorage.setItem("theme", newMode);
    };

    return { mode, toggle, set };
};