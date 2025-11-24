import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Category } from "@/types";

interface CategoriesState {
    categories: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoriesState = {
    categories: [],
    loading: false,
    error: null,
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload;
            state.loading = false;
            state.error = null;
        },
        addCategory: (state, action: PayloadAction<Category>) => {
            state.categories.push(action.payload);
        },
        updateCategory: (state, action: PayloadAction<Category>) => {
            const index = state.categories.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
        },
        deleteCategory: (state, action: PayloadAction<number>) => {
            state.categories = state.categories.filter(c => c.id !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const {
    setCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    setLoading,
    setError
} = categoriesSlice.actions;
export default categoriesSlice.reducer;