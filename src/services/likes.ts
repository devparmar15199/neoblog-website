import { supabase } from "@/lib/supabase";

// Add a like
// The 'update_like_count' trigger will handle updating the 'posts' table.
export const addLike = async (postId: string, userId: string) => {
    const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: userId });
    if (error) throw error;
};

// Remove a like
// The 'update_like_count' trigger will handle updating the 'posts' table.
export const removeLike = async (postId: string, userId: string) => {
    const { error } = await supabase
        .from('post_likes')
        .delete()
        .match({ post_id: postId, user_id: userId });
    if (error) throw error;
};

// Check if user has liked a post
export const hasUserLikedPost = async (postId: string, userId: string): Promise<boolean> => {
    const { count, error } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
        .eq('user_id', userId);
    if (error) throw error;
    return (count || 0) > 0;
};