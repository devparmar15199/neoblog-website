import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CommentWithAuthor } from "@/types";

interface CommentsState {
    comments: CommentWithAuthor[];
    loading: boolean;
    error: string | null;
}

const initialState: CommentsState = {
    comments: [],
    loading: false,
    error: null,
};

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        setComments: (state, action: PayloadAction<CommentWithAuthor[]>) => {
            state.comments = action.payload;
            state.loading = false;
            state.error = null;
        },
        addComment: (state, action: PayloadAction<CommentWithAuthor>) => {
            // Prevent duplicate adds (Realtime + Optimistic UI often collide)
            if (state.comments.find(c => c.id === action.payload.id)) {
                state.comments.push(action.payload);
            }
        },
        updateComment: (state, action: PayloadAction<Partial<CommentWithAuthor>>) => {
            const index = state.comments.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) state.comments[index] = { ...state.comments[index], ...action.payload };
        },
        deleteComment: (state, action: PayloadAction<string>) => {
            state.comments = state.comments.filter((c) => c.id !== action.payload);
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

export const { setComments, addComment, updateComment, deleteComment, setLoading, setError } = commentsSlice.actions;
export default commentsSlice.reducer;