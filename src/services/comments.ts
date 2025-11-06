import { supabase } from "../lib/supabase";

export interface Comment {
    id: string;
    post_id: string;
    author: string;
    parent_id?: string;
    content: string;
    created_at: string;
    is_edited: boolean;
    profiles?: { username: string; display_name: string; avatar_url: string };
}

// Fetch comments for a specific post
export const getComments = async (postId: string) => {
    const { data, error } = await supabase
        .from('comments')
        .select(`
            *, 
            profiles!author (username, display_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
    if (error) throw error;
    return data as Comment[];
};

// Add a new comment
export const addComment = async (comment: Omit<Comment, 'id' | 'created_at' | 'is_edited'>) => {
    const { data, error } = await supabase
        .from('comments')
        .insert(comment)
        .select()
        .single();
    if (error) throw error;
    return data as Comment;
};

// Update a comment's content by ID
export const updateComment = async (id: string, content: string) => {
    const { data, error } = await supabase
        .from('comments')
        .update({ content, is_edited: true })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data as Comment;
};

// Delete a comment by ID
export const deleteComment = async (id: string) => {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) throw error;
};

// Real-time subscription to comments on a specific post
export const subscribeToComments = (postId: string, callback: (payload: any) => void) => {
    return supabase
        .channel(`comments:${postId}`)
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
            callback
        ).subscribe();
};