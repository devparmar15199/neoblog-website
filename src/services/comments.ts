import { supabase } from "@/lib/supabase";
import type { CommentWithAuthor, CreateCommentPayload } from "@/types";

// Fetch all comments for a post (with author details)
export const getComments = async (postId: string): Promise<CommentWithAuthor[]> => {
    const { data, error } = await supabase
        .from('comments')
        .select(`
            *, 
            profiles (
                id,
                username, 
                display_name, 
                avatar_url
            )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data as CommentWithAuthor[];
};

// Fetch a SINGLE comment (Used for Realtime updates to get profile data)
export const getCommentById = async (commentId: string): Promise<CommentWithAuthor> => {
    const { data, error } = await supabase
        .from('comments')
        .select(`
            *,
            profiles (
                id,
                username, 
                display_name, 
                avatar_url
            )
        `)
        .eq('id', commentId)
        .single();

    if (error) throw error;
    return data as CommentWithAuthor;
};

// Add a new comment
export const addComment = async (payload: CreateCommentPayload): Promise<CommentWithAuthor> => {
    const { data, error } = await supabase
        .from('comments')
        .insert({
            post_id: payload.post_id,
            author: payload.author,
            content: payload.content,
            parent_id: payload.parent_id || null,
        })
        .select(`
            *,
            profiles (
                id,
                username, 
                display_name, 
                avatar_url
            )
        `)
        .single();

    if (error) throw error;
    return data as CommentWithAuthor;
};

// Update a comment
export const updateComment = async (id: string, content: string): Promise<CommentWithAuthor> => {
    const { data, error } = await supabase
        .from('comments')
        .update({ content, is_edited: true })
        .eq('id', id)
        .select(`
            *,
            profiles (
                id,
                username, 
                display_name, 
                avatar_url
            )
        `)
        .single();

    if (error) throw error;
    return data as CommentWithAuthor;
};

// Delete a comment
export const deleteComment = async (id: string) => {
    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// Real-time subscription
export const subscribeToComments = (postId: string, callback: (payload: any) => void) => {
    return supabase
        .channel(`comments:${postId}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'comments',
                filter: `post_id=eq.${postId}`
            },
            callback
        )
        .subscribe();
};