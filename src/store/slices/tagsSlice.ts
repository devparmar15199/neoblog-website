import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Tag } from "@/types";

interface TagsState {
    tags: Tag[];
    loading: boolean;
    error: string | null;
}

const initialState: TagsState = {
    tags: [],
    loading: false,
    error: null,
};

const tagsSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
        setTags: (state, action: PayloadAction<Tag[]>) => {
            state.tags = action.payload;
            state.loading = false;
            state.error = null;
        },
        addTag: (state, action: PayloadAction<Tag>) => {
            state.tags.push(action.payload);
        },
        updateTag: (state, action: PayloadAction<Tag>) => {
            const index = state.tags.findIndex(t => t.id === action.payload.id);
            if (index !== -1) state.tags[index] = action.payload;
        },
        deleteTag: (state, action: PayloadAction<number>) => {
            state.tags = state.tags.filter(t => t.id !== action.payload);
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
    setTags,
    addTag,
    updateTag,
    deleteTag,
    setLoading,
    setError
} = tagsSlice.actions;
export default tagsSlice.reducer;