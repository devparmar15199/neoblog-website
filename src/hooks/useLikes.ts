import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setPostLikes } from "@/store/slices/postsSlice";
import { addLike, removeLike, getLikeStatus } from "@/services/likes";
import { setError } from "@/store/slices/authSlice";

export const useLikes = (postId: string) => {
    const dispatch = useDispatch();

    // Get the current user ID for checking like status
    const userId = useSelector((state: RootState) => state.auth.user?.id);

    // Get current like state from posts slice
    const { currentPostLikes: count, currentPostIsLiked: isLiked } = useSelector((state: RootState) => state.posts);

    // Memoize the fetch function
    const fetchLikeStatus = useCallback(async () => {
        if (!userId || !postId) {
            dispatch(setPostLikes({ count: 0, isLiked: false }));
            return;
        }
        try {
            const { likeCount, isLiked } = await getLikeStatus(postId, userId);
            dispatch(setPostLikes({ count: likeCount, isLiked }));
        } catch (error: any) {
            console.error("Failed to fetch like status:", error);
        }
    }, [dispatch, postId, userId]);

    useEffect(() => {
        // Fetch status when post ID or user ID changes
        fetchLikeStatus();
    }, [fetchLikeStatus]);

    const handleToggleLike = async () => {
        if (!userId) {
            dispatch(setError("You must be logged in to like a post."));
            return;
        }

        try {
            dispatch(setError(null));

            if (isLiked) {
                // If already liked, remove the like
                await removeLike(postId, userId);
            } else {
                // If not liked, add a like
                await addLike(postId, userId);
            }

            // Immediately update local state for responsiveness and refetch status
            const newCount = isLiked ? count - 1 : count + 1;
            dispatch(setPostLikes({ count: newCount, isLiked: !isLiked }));

            // Refetch the like status to ensure consistency
            setTimeout(fetchLikeStatus, 500);
        } catch (error: any) {
            dispatch(setError(error.message || "Failed to toggle like status."));
            // Revert local state on error
            dispatch(setPostLikes({ count, isLiked }));
            throw error;
        }
    };

    return {
        count,
        isLiked,
        toggleLike: handleToggleLike,
        userId,
    };
};