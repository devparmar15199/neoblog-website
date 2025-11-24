import { supabase } from "@/lib/supabase";
import type { Profile, PostListItem } from "@/types";

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

// Get all published posts by a specific author
// We fetch enough data to render a standard PostCard
export const getPostsByAuthorUsername = async (username: string): Promise<PostListItem[]> => {
    // 1. Get the author's ID first
    const profile = await getProfileByUsername(username);
    if (!profile) throw new Error('Profile not found');

    const authorId = profile.id;

    // 2. Query posts
    const { data, error } = await supabase
        .from('posts')
        .select(`
            id, title, slug, excerpt, cover_image, created_at, like_count, comment_count,
            author:profiles!posts_author_fkey (id, username, display_name, avatar_url),
            categories (id, name, slug),
            post_tags (
                tags (id, name, slug)
            )
        `)
        .eq('author', authorId)
        .eq('published', true)
        .order('created_at', { ascending: false });

    if (error) throw error;

    // 3. Flatten tags similar to main post service
    const posts = (data || []).map((post: any) => {
        const mapped = { ...post };

        if (mapped.author) {
            mapped.profiles = mapped.author;
            delete mapped.author;
        }

        if (mapped.post_tags) {
            mapped.post_tags = mapped.post_tags.filter((pt: any) => pt.tags !== null);
        }
        
        return mapped;
    });

    return posts as PostListItem[];
};