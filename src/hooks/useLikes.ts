import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { toggleCurrentPostLike } from "@/store/slices/postsSlice";
import { addLike, removeLike } from "@/services/likes";
import toast from "react-hot-toast";

export const useLikes = () => {
    const dispatch = useDispatch();

    // Auth and Post State
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const currentPost = useSelector((state: RootState) => state.posts.currentPost);

    // Derive state safely
    const count = currentPost?.like_count ?? 0;
    const isLiked = currentPost?.user_has_liked ?? false;

    const handleToggleLike = useCallback(async (): Promise<void> => {
        if (!userId) {
            toast.error("You must be logged in to like a post.");
            return;
        }

        if (!currentPost) {
            return;
        };

        const postId = currentPost.id;
        const newIsLiked = !isLiked;

        // 1. Optimistic Update (Immediate UI change)
        dispatch(toggleCurrentPostLike(newIsLiked));

        try {
            // 2. API Call
            if (newIsLiked) {
                await addLike(postId, userId);
            } else {
                await removeLike(postId, userId);
            }
        } catch (error: any) {
            // 3. Revert on failure
            dispatch(toggleCurrentPostLike(!newIsLiked));
            toast.error(error.message || "Failed to update like status.");
        }
    }, [dispatch, userId, isLiked, currentPost]);

    return {
        count,
        isLiked,
        toggleLike: handleToggleLike,
        userId,
    };
};