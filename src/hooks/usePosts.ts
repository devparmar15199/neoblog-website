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
    updatePostTags,
} from "../services/posts";
import type { PostDetails, PostListItem, PostInput } from "@/types";
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
            toast.error(message);
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

    const handleCreatePost = useCallback(async (
        postInput: PostInput & { author: string },
        tagIds: string[] = [],
    ): Promise<PostDetails> => {
        try {
            dispatch(setError(null));
            const newPost = await createPost(postInput);
            if (tagIds.length > 0) {
                await updatePostTags(newPost.id, tagIds);
            }
            const postListItem: PostListItem = {
                id: newPost.id,
                title: newPost.title,
                slug: newPost.slug,
                excerpt: newPost.excerpt,
                cover_image: newPost.cover_image,
                created_at: newPost.created_at,
                like_count: newPost.like_count,
                comment_count: newPost.comment_count,
                author: newPost.author,
                categories: newPost.categories,
                tags: newPost.tags,
                user_has_liked: false,
            };
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

    const handleUpdatePost = useCallback(async (
        id: string,
        updates: Partial<PostDetails>,
        tagIds?: string[]
    ): Promise<PostDetails> => {
        try {
            dispatch(setError(null));
            if (tagIds !== undefined) {
                await updatePostTags(id, tagIds);
            }
            const updatedPost = await updatePostService(id, updates);
            const postListItem: PostListItem = {
                id: updatedPost.id,
                title: updatedPost.title,
                slug: updatedPost.slug,
                excerpt: updatedPost.excerpt,
                cover_image: updatedPost.cover_image,
                created_at: updatedPost.created_at,
                like_count: updatedPost.like_count,
                comment_count: updatedPost.comment_count,
                author: updatedPost.author,
                categories: updatedPost.categories,
                tags: updatedPost.tags,
                user_has_liked: currentPost?.id === id ? currentPost.user_has_liked : false,
            };
            dispatch(updatePost(postListItem));
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

    const handleDeletePost = useCallback(async (id: string): Promise<void> => {
        try {
            dispatch(setError(null));
            await deletePostService(id);
            dispatch(deletePost(id));
            toast.success('Post deleted successfully');
        } catch (error: any) {
            const message = error.message || 'Failed to delete post';
            dispatch(setError(message));
            toast.error(message);
            throw error;
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