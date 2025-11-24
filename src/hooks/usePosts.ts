import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
    setPosts,
    setCurrentPost,
    setLoading,
    setError,
    addPost,
    updatePost,
    deletePost
} from "../store/slices/postsSlice";
import {
    getPosts,
    getPostBySlug,
    getPostById,
    createPost,
    updatePost as updatePostService,
    deletePost as deletePostService,
} from "../services/posts";
import type { PostDetails, CreatePostPayload, UpdatePostPayload } from "@/types";
import toast from "react-hot-toast";

export const usePosts = (
    page = 1,
    limit = 10,
    search = '',
    categoryId?: number,
    tagId?: number,
) => {
    const dispatch = useDispatch();

    const {
        posts,
        currentPost,
        loading,
        error,
        totalPages
    } = useSelector((state: RootState) => state.posts);

    const userId = useSelector((state: RootState) => state.auth.user?.id);

    // Fetch List
    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const fetchPosts = async () => {
            try {
                const { posts, totalPages } = await getPosts(
                    page,
                    limit,
                    search,
                    categoryId,
                    tagId,
                    userId
                );
                dispatch(setPosts({ posts, totalPages }));
            } catch (error: any) {
                const message = error.message || 'Failed to load posts';
                dispatch(setError(message));
                toast.error(message);
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchPosts();
    }, [dispatch, page, limit, search, categoryId, tagId, userId]);

    // Load a single post by slug (for public view)
    const loadPostBySlug = useCallback(async (slug: string): Promise<PostDetails | null> => {
        dispatch(setLoading(true));
        try {
            const post = await getPostBySlug(slug, userId);
            dispatch(setCurrentPost(post));
            return post;
        } catch (error: any) {
            const message = error.message || 'Failed to load post';
            dispatch(setError(message));
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, userId]);

    // Load a single post by ID (for editing, includes unpublished)
    const loadPostById = useCallback(async (id: string): Promise<PostDetails> => {
        dispatch(setLoading(true));
        try {
            const post = await getPostById(id);
            dispatch(setCurrentPost(post));
            return post;
        } catch (error: any) {
            const message = error.message || 'Failed to load post';
            dispatch(setError(message));
            toast.error(message);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // Create a new post
    const handleCreatePost = useCallback(async (
        postInput: CreatePostPayload,
        authorId: string,
    ): Promise<PostDetails> => {
        try {
            dispatch(setError(null));
            const newPost = await createPost({ ...postInput, author: authorId });
            const postListItem: any = { ...newPost };
            dispatch(addPost(postListItem));
            toast.success('Post created successfully');
            return newPost;
        } catch (error: any) {
            const message = error.message || 'Failed to create post';
            dispatch(setError(message));
            toast.error(message);
            throw error;
        }
    }, [dispatch]);

    // Update an existing post
    const handleUpdatePost = useCallback(async (
        id: string,
        updates: UpdatePostPayload,
    ): Promise<PostDetails> => {
        try {
            dispatch(setError(null));
            const updatedPost = await updatePostService(id, updates);

            dispatch(updatePost(updatedPost as any));

            if (currentPost?.id === id) {
                dispatch(setCurrentPost(updatedPost));
            }
            toast.success('Post updated successfully');
            return updatedPost;
        } catch (error: any) {
            const message = error.message || 'Failed to update post';
            dispatch(setError(message));
            toast.error(message);
            throw error;
        }
    }, [dispatch, currentPost]);

    // Delete a post
    const handleDeletePost = useCallback(async (id: string): Promise<void> => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            dispatch(setError(null));
            await deletePostService(id);
            dispatch(deletePost(id));
            toast.success('Post deleted successfully');
        } catch (error: any) {
            const message = error.message || 'Failed to delete post';
            dispatch(setError(message));
            toast.error(message);
        }
    }, [dispatch]);

    return {
        posts,
        currentPost,
        loading,
        error,
        totalPages,
        loadPostBySlug,
        loadPostById,
        createPost: handleCreatePost,
        updatePost: handleUpdatePost,
        deletePost: handleDeletePost,
    };
};