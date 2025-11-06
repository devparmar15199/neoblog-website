import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPosts, setLoading, setError, addPost, updatePost, deletePost } from "../store/slices/postsSlice";
import {
    getPosts,
    createPost,
    updatePost as updatePostService,
    deletePost as deletePostService,
    updatePostTags,
    type Post,
} from "../services/posts";

export const usePosts = (
    page = 1,
    limit = 10,
    search = '',
    categoryId?: number,
    tagId?: number,
) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(true));
        const fetchPosts = async () => {
            try {
                const { posts, totalPages } = await getPosts(page, limit, search, categoryId, tagId);
                dispatch(setPosts({ posts, totalPages }));
            } catch (error: any) {
                dispatch(setError(error.message || 'Failed to fetch posts'));
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchPosts();
    }, [dispatch, page, limit, search, categoryId, tagId]);

    const handleCreatePost = async (
        post: Omit<Post, 'id' | 'created_at' | 'updated_at'>,
        tagIds: number[] = [],
    ) => {
        try {
            dispatch(setError(null));
            const newPost = await createPost(post);

            if (tagIds.length > 0) {
                await updatePostTags(newPost.id, tagIds);
            }

            dispatch(addPost(newPost));
            return newPost;
        } catch (error: any) {
            dispatch(setError(error.message || 'Failed to create post'));
            throw error;
        }
    };

    const handleUpdatePost = async (id: string, updates: Partial<Post>, tagIds?: number[]) => {
        try {
            dispatch(setError(null));
            const updatedPost = await updatePostService(id, updates);

            if (tagIds !== undefined) {
                await updatePostTags(id, tagIds);
            }

            dispatch(updatePost(updatedPost));
            return updatedPost;
        } catch (error: any) {
            dispatch(setError(error.message || 'Failed to update post'));
            throw error;
        }
    };

    const handleDeletePost = async (id: string) => {
        try {
            dispatch(setError(null));
            await deletePostService(id);
            dispatch(deletePost(id));
        } catch (error: any) {
            dispatch(setError(error.message || 'Failed to delete post'));
            throw error;
        }
    };

    return {
        createPost: handleCreatePost,
        updatePost: handleUpdatePost,
        deletePost: handleDeletePost,
    };
};