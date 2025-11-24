import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
    mode: "light" | "dark";
}

// Helper to get the initial theme synchronously
const getInitialTheme = (): "light" | "dark" => {
    // Check if running in browser
    if (typeof window !== "undefined" && window.localStorage) {
        const savedMode = localStorage.getItem("theme") as "light" | "dark" | null;

        // 1. Return saved preference
        if (savedMode) {
            return savedMode;
        }

        // 2. Return system preference
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }
    }

    // 3. Default fallback
    return "light";
};

const initialState: ThemeState = {
    mode: getInitialTheme(),
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.mode = action.payload;
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;