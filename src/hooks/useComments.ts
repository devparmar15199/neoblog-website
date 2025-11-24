import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
    setComments,
    addComment as addCommentAction,
    updateComment as updateCommentAction,
    deleteComment as deleteCommentAction,
    setLoading,
    setError,
} from "../store/slices/commentsSlice";
import {
    getComments,
    getCommentById,
    addComment,
    updateComment,
    deleteComment,
    subscribeToComments,
} from "../services/comments";
import type { CreateCommentPayload, CommentWithAuthor } from "@/types";
import toast from "react-hot-toast";

export const useComments = (postId: string) => {
    const dispatch = useDispatch();
    const { comments, loading, error } = useSelector((state: RootState) => state.comments);

    // 1. Initial Fetch & Subscription
    useEffect(() => {
        if (!postId) return;

        dispatch(setLoading(true));

        const fetchComments = async () => {
            try {
                const data = await getComments(postId);
                dispatch(setComments(data));
            } catch (error: any) {
                console.error("Fetch comments error:", error);
                dispatch(setError(error.message || 'Failed to fetch comments'));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchComments();

        // 2. Realtime Subscription
        const subscription = subscribeToComments(postId, async (payload) => {
            const { eventType, new: newRecord, old: oldRecord } = payload;

            if (eventType === 'INSERT') {
                try {
                    const fullComment = await getCommentById(newRecord.id);
                    dispatch(addCommentAction(fullComment));
                } catch (error) {
                    console.error("Error fetching new real-time comment:", error);
                }
            } else if (eventType === 'UPDATE') {
                dispatch(updateCommentAction(newRecord));
            } else if (eventType === 'DELETE') {
                dispatch(deleteCommentAction(oldRecord.id));
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [dispatch, postId]);

    // --- Actions ---

    const handleAddComment = useCallback(async (payload: CreateCommentPayload): Promise<CommentWithAuthor> => {
        try {
            dispatch(setError(null));
            const newComment = await addComment(payload);
            dispatch(addCommentAction(newComment));
            toast.success("Comment posted!");
            return newComment;
        } catch (error: any) {
            const message = error.message || 'Failed to post comment';
            dispatch(setError(message));
            toast.error(message);
            throw error;
        }
    }, [dispatch]);

    const handleUpdateComment = useCallback(async (id: string, content: string): Promise<CommentWithAuthor> => {
        try {
            dispatch(setError(null));
            const updatedComment = await updateComment(id, content);
            dispatch(updateCommentAction(updatedComment));
            toast.success("Comment updated!");
            return updatedComment;
        } catch (error: any) {
            const message = error.message || 'Failed to update comment';
            dispatch(setError(message));
            toast.error(message);
            throw error;
        }
    }, [dispatch]);

    const handleDeleteComment = useCallback(async (id: string): Promise<void> => {
        try {
            dispatch(setError(null));
            await deleteComment(id);
            dispatch(deleteCommentAction(id));
            toast.success("Comment deleted!");
        } catch (error: any) {
            const message = error.message || 'Failed to delete comment';
            dispatch(setError(message));
            toast.error(message);
            throw error;
        }
    }, [dispatch]);

    return {
        comments,
        loading,
        error,
        addComment: handleAddComment,
        updateComment: handleUpdateComment,
        deleteComment: handleDeleteComment,
    };
};