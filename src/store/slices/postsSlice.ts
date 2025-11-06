import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "../../services/posts";

interface PostsState {
    posts: Post[];
    currentPost: Post | null;
    currentPostLikes: number;
    currentPostIsLiked: boolean;
    loading: boolean;
    error: string | null;
    totalPages: number;
}

const initialState: PostsState = {
    posts: [],
    currentPost: null,
    currentPostLikes: 0,
    currentPostIsLiked: false,
    loading: false,
    error: null,
    totalPages: 1,
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts: (state, action: PayloadAction<{ posts: Post[]; totalPages: number }>) => {
            state.posts = action.payload.posts;
            state.totalPages = action.payload.totalPages;
            state.loading = false;
            state.error = null;
        },
        setCurrentPost: (state, action: PayloadAction<Post>) => {
            state.currentPost = action.payload;
            // when setting new current post reset likes info 
            state.currentPostLikes = 0;
            state.currentPostIsLiked = false;
            state.loading = false;
        },
        setPostLikes: (state, action: PayloadAction<{ count: number; isLiked: boolean }>) => {
            state.currentPostLikes = action.payload.count;
            state.currentPostIsLiked = action.payload.isLiked;
        },
        addPost: (state, action: PayloadAction<Post>) => {
            state.posts.unshift(action.payload);
        },
        updatePost: (state, action: PayloadAction<Post>) => {
            const index = state.posts.findIndex((post) => post.id === action.payload.id);
            if (index !== -1) state.posts[index] = action.payload;
            if (state.currentPost?.id === action.payload.id) state.currentPost = action.payload;
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
    setPostLikes, 
    setLoading, 
    setError 
} = postsSlice.actions;
export default postsSlice.reducer;