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
    addComment,
    updateComment,
    deleteComment,
    subscribeToComments,
} from "../services/comments";
import type { Comment } from "@/types";
import toast from "react-hot-toast";

export const useComments = (postId: string) => {
    const dispatch = useDispatch();
    const { comments, loading, error } = useSelector((state: RootState) => state.comments);

    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const fetchComments = async () => {
            try {
                const data = await getComments(postId);
                dispatch(setComments(data));
            } catch (error: any) {
                const message = error.message || 'Failed to fetch comments';
                dispatch(setError(message));
                toast.error(message);
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchComments();

        const subscription = subscribeToComments(postId, (payload) => {
            const { eventType } = payload;

            if (eventType === 'INSERT') {
                dispatch(addCommentAction(payload.new as Comment));
            } else if (eventType === 'UPDATE') {
                dispatch(updateCommentAction(payload.new as Comment));
            } else if (eventType === 'DELETE') {
                dispatch(deleteCommentAction(payload.old.id));
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [dispatch, postId]);

    const handleAddComment = useCallback(async (input: {
        post_id: string;
        author: string;
        content: string;
        parent_id: string | null;
    }): Promise<Comment> => {
        try {
            dispatch(setError(null));
            const newComment = await addComment(input);
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

    const handleUpdateComment = useCallback(async (id: string, content: string): Promise<Comment> => {
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