import { supabase } from "../lib/supabase";

export interface Post {
    id: string;
    author: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category_id?: number;
    created_at: string;
    updated_at: string;
    published: boolean;
    featured: boolean;
    cover_image: string;
    tags?: { name: string }[];
    category?: { name: string };
}

// Get paginated posts with optional search, category, and tag filters
export const getPosts = async (
    page = 1,
    limit = 10,
    search = '',
    categoryId?: number,
    tagId?: number,
) => {
    let query = supabase
        .from('posts')
        .select(`
            *,
            profiles!author (username, display_name, avatar_url),
            categories (name),
            post_tags (tags (name))
        `, { count: 'exact' })
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

    if (search) query = query.ilike('title', `%${search}%`);
    if (categoryId) query = query.eq('category_id', categoryId);
    if (tagId) query = query.eq('post_tags.tag_id', tagId);

    const { data, error, count } = await query;
    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / limit);
    return { posts: data as Post[], totalPages };
};

// Get a single post by ID (needed for dashboard edit/admin views)
export const getPostById = async (id: string) => {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles!author (username, display_name, avatar_url),
            categories (name),
            post_tags (tags (name))
        `)
        .eq('id', id)
        .single();
    if (error) throw error;
    return data as Post;
};

// Get all posts by a specific author (for dashboard)
export const getAuthorPosts = async (authorId: string) => {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            id, title, slug, published, created_at
        `)
        .eq('author', authorId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

// Update tags associated with a post
// This should be called after createPost or updatePost
export const updatePostTags = async (postId: string, tagIds: number[]) => {
    // 1. Delete existing tags
    const { error: deleteError } = await supabase
        .from('post_tags')
        .delete()
        .eq('post_id', postId);
    if (deleteError) throw deleteError;

    // 2. Insert new tags
    const newTags = tagIds.map(tag_id => ({ post_id: postId, tag_id }));
    if (newTags.length === 0) return; // Nothing to insert

    const { data, error: insertError } = await supabase
        .from('post_tags')
        .insert(newTags)
        .select();
    if (insertError) throw insertError;
    return data;
};

// Get a single post by slug
export const getPostBySlug = async (slug: string) => {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles!author (username, display_name, avatar_url),
            categories (name),
            post_tags (tags (name))
        `)
        .eq('slug', slug)
        .single();
    if (error) throw error;
    return data as Post;
};

// Create a new post
export const createPost = async (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select()
        .single();
    if (error) throw error;
    return data as Post;  
};

// Update a post by ID
export const updatePost = async (id: string, updates: Partial<Post>) => {
    const { data, error } = await supabase
        .from('posts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data as Post;  
};

// Delete a post by ID
export const deletePost = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
};