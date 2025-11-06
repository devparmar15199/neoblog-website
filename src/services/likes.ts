import { supabase } from "@/lib/supabase";

interface LikeStatus {
    isLiked: boolean;
    likeCount: number;
}

// Get like status and count for a specific post
export const getLikeStatus = async (postId: string, userId: string): Promise<LikeStatus> => {
    // 1. Get total likes count
    const { count: likeCount, error: countError } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact' })
        .eq('post_id', postId);
    
    if (countError) throw countError;

    // 2. Check if the current user has liked it
    const { data: userData, error: userError } = await supabase
        .from('post_likes')
        .select('user_id')
        .match({ post_id: postId, user_id: userId })
        .maybeSingle();
    
    if (userError) throw userError;

    return {
        isLiked: !!userData,
        likeCount: likeCount || 0,
    };
};

// Add a like
export const addLike = async (postId: string, userId: string) => {
    const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: userId });
    if (error) throw error;
};

// Remove a like
export const removeLike = async (postId: string, userId: string) => {
    const { error } = await supabase
        .from('post_likes')
        .delete()
        .match({ post_id: postId, user_id: userId });
    if (error) throw error;
};