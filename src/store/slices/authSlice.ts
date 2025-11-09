import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types";

interface AuthState {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    profile: null,
    loading: true,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            // state.loading = false;
            state.error = null;
            // when user logs out, clear profile too
            if (!action.payload) {
                state.profile = null;
            }
        },
        setProfile: (state, action: PayloadAction<Profile | null>) => {
            state.profile = action.payload;
            // state.loading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
});

export const { setUser, setProfile, setLoading, setError, clearError } = authSlice.actions;
export default authSlice.reducer;