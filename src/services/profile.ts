import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";

// Get a single public profile by username
export const getProfileByUsername = async (username: string): Promise<Profile> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
    if (error) throw error;
    return data as Profile;
};

// Get all published posts by a specific author's username
export const getPostsByAuthorUsername = async (username: string): Promise<Array<{ id: string; title: string; slug: string; published: boolean; created_at: string; like_count: number; comment_count: number }>> => {
    // 1. Get the author's ID first
    const profile = await getProfileByUsername(username);
    const authorId = profile.id;

    // 2. Query the posts table using the author ID (published only)
    const { data, error } = await supabase
        .from('posts')
        .select(`
            id, title, slug, published, created_at, like_count, comment_count
        `)
        .eq('author', authorId)
        .eq('published', true)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};