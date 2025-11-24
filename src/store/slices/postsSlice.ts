import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PostDetails, PostListItem } from "@/types";

interface PostsState {
    posts: PostListItem[];
    currentPost: PostDetails | null;
    loading: boolean;
    error: string | null;
    totalPages: number;
}

const initialState: PostsState = {
    posts: [],
    currentPost: null,
    loading: false,
    error: null,
    totalPages: 1,
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts: (state, action: PayloadAction<{ posts: PostListItem[]; totalPages: number }>) => {
            state.posts = action.payload.posts;
            state.totalPages = action.payload.totalPages;
            state.loading = false;
            state.error = null;
        },
        setCurrentPost: (state, action: PayloadAction<PostDetails | null>) => {
            state.currentPost = action.payload;
            state.loading = false;
        },
        toggleCurrentPostLike: (state, action: PayloadAction<boolean>) => {
            if (state.currentPost) {
                const isLiking = action.payload;
                state.currentPost.user_has_liked = isLiking;
                state.currentPost.like_count += isLiking ? 1 : -1;
            }
        },
        toggleCurrentPostBookmark: (state, action: PayloadAction<boolean>) => {
            if (state.currentPost) {
                state.currentPost.user_has_bookmarked = action.payload;
            }
        },
        addPost: (state, action: PayloadAction<PostListItem>) => {
            state.posts.unshift(action.payload);
        },
        updatePost: (state, action: PayloadAction<PostListItem>) => {
            const index = state.posts.findIndex((post) => post.id === action.payload.id);
            if (index !== -1) state.posts[index] = action.payload;
        },
        deletePost: (state, action: PayloadAction<string>) => {
            state.posts = state.posts.filter((post) => post.id !== action.payload);
            if (state.currentPost?.id === action.payload) state.currentPost = null;
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
    setPosts,
    setCurrentPost,
    addPost,
    updatePost,
    deletePost,
    toggleCurrentPostLike,
    toggleCurrentPostBookmark,
    setLoading,
    setError
} = postsSlice.actions;
export default postsSlice.reducer;