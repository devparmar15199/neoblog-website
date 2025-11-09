import { supabase } from "@/lib/supabase";
import type { Comment } from "@/types";

// Helper to map comment data
const mapCommentData = (comment: any): Comment => {
    const mapped: any = { ...comment };
    mapped.profiles = mapped.author_profile;
    delete mapped.author_profile;
    return mapped as Comment;
}

// Fetch comments for a specific post
export const getComments = async (postId: string): Promise<Comment[]> => {
    const { data, error } = await supabase
        .from('comments')
        .select(`
            *, 
            author_profile:profiles (username, display_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map(mapCommentData);
};

// Add a new comment
export const addComment = async (comment: {
    post_id: string;
    author: string;
    content: string;
    parent_id: string | null;
}): Promise<Comment> => {
    const { data, error } = await supabase
        .from('comments')
        .insert(comment)
        .select(`
            *,
            author_profile:profiles (username, display_name, avatar_url)
        `)
        .single();  // Return the newly created comment with profile data
    if (error) throw error;
    return mapCommentData(data) as Comment;
};

// Update a comment
export const updateComment = async (id: string, content: string): Promise<Comment> => {
    const { data, error } = await supabase
        .from('comments')
        .update({ content, is_edited: true })
        .eq('id', id)
        .select(`
            *,
            author_profile:profiles (username, display_name, avatar_url)
        `)
        .single();
    if (error) throw error;
    return mapCommentData(data) as Comment;
};

// Delete a comment
export const deleteComment = async (id: string) => {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) throw error;
};

// Real-time subscription
export const subscribeToComments = (postId: string, callback: (payload: any) => void) => {
    return supabase
        .channel(`comments:${postId}`)
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
            callback
        ).subscribe();
};