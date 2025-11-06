import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { 
    setComments, 
    addComment as addCommentAction, 
    updateComment as updateCommentAction, 
    deleteComment as deleteCommentAction,
    setLoading,
    setError,
} from "../store/slices/commentsSlice";
import { getComments, addComment, updateComment, deleteComment, subscribeToComments } from "../services/comments";

export const useComments = (postId: string) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(true));
        const fetchComments = async () => {
            try {
                const data = await getComments(postId);
                dispatch(setComments(data));
            } catch (error: any) {
                dispatch(setError(error.message || 'Failed to fetch comments'));
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchComments();

        const subscription = subscribeToComments(postId, (payload) => {
            if (payload.eventType === 'INSERT') dispatch(addCommentAction(payload.new));
            else if (payload.eventType === 'UPDATE') dispatch(updateCommentAction(payload.new));
            else if (payload.eventType === 'DELETE') dispatch(deleteCommentAction(payload.old.id));
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [dispatch, postId]);

    const handleAddComment = async (comment: any) => {
        try {
            dispatch(setError(null));
            const newComment = await addComment(comment);
            dispatch(addCommentAction(newComment));
            return newComment;
        } catch (error: any) {
            dispatch(setError(error.message || 'Failed to add comment'));
            throw error;
        }
    };

    const handleUpdateComment = async (id: string, content: string) => {
        try {
            dispatch(setError(null));
            const updatedComment = await updateComment(id, content);
            dispatch(updateCommentAction(updatedComment));
            return updatedComment;
        } catch (error: any) {
            dispatch(setError(error.message || 'Failed to update comment'));
            throw error;
        }
    };

    const handleDeleteComment = async (id: string) => {
        try {
            dispatch(setError(null));
            await deleteComment(id);
            dispatch(deleteCommentAction(id));
        } catch (error: any) {
            dispatch(setError(error.message || 'Failed to delete comment'));
            throw error;
        }
    };

    return {
        addComment: handleAddComment,
        updateComment: handleUpdateComment,
        deleteComment: handleDeleteComment,
    };
};