import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Profile } from "@/types";

interface UsersSlice {
    users: Profile[];
    loading: boolean;
    error: string | null;
    totalPages: number;
}

const initialState: UsersSlice = {
    users: [],
    loading: false,
    error: null,
    totalPages: 1,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<{ users: Profile[]; totalPages: number }>) => {
            state.users = action.payload.users;
            state.totalPages = action.payload.totalPages;
            state.loading = false;
            state.error = null;
        },
        updateUser: (state, action: PayloadAction<Profile>) => {
            const index = state.users.findIndex(u => u.id === action.payload.id);
            if (index !== -1) state.users[index] = action.payload;
        },
        deleteUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(u => u.id !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
    }
});

export const { setUsers, updateUser, deleteUser, setLoading, setError } = usersSlice.actions;
export default usersSlice.reducer;