import { supabase } from "@/lib/supabase";
import type { PostDetails, PostListItem, PostInput } from "@/types";
import { hasUserLikedPost } from "./likes";

// Helper to map post data to include relations
const mapPostData = async (post: any, userId?: string): Promise<PostDetails | PostListItem> => {
    const mapped: any = { ...post };

    // 1. Map the aliased data 'author_profile' to the 'profiles' key
    mapped.profiles = post.author_profile;
    // 2. Clean up the temporary key
    delete mapped.profiles;

    mapped.categories = post.categories;
    mapped.tags = post.post_tags || [];
    delete mapped.post_tags;

    if (userId) {
        mapped.user_has_liked = await hasUserLikedPost(post.id, userId);
    }
    return mapped as PostDetails;
};

// Get paginated posts (published only)
// export const getPosts = async (
//     page = 1,
//     limit = 10,
//     search = '',
//     categoryId?: number,
//     tagId?: number,
//     userId?: string,
// ): Promise<{ posts: PostListItem[]; totalPages: number }> => {
//     let query = supabase
//         .from('posts')
//         .select(`
//             id, title, slug, excerpt, cover_image, created_at, like_count, comment_count,
//             author_profile:profiles (username, display_name, avatar_url),
//             categories (name, slug),
//             post_tags (tags (name, slug))
//         `, { count: 'exact' })
//         .eq('published', true)
//         .order('created_at', { ascending: false })
//         .range((page - 1) * limit, page * limit - 1);

//     if (search) query = query.ilike('title', `%${search}%`);
//     if (categoryId) query = query.eq('category_id', categoryId);
//     if (tagId) query = query.eq('post_tags.tag_id', tagId);

//     const { data, error, count } = await query;
//     if (error) throw error;
//     const posts = await Promise.all((data || []).map((post: any) => mapPostData(post, userId)));
//     const totalPages = Math.ceil((count || 0) / limit);
//     return { posts: posts as PostListItem[], totalPages };
// };

export const getPosts = async (
    page = 1,
    limit = 10,
    search = '',
    categoryId?: number,
    tagId?: number,
    userId?: string,
): Promise<{ posts: PostListItem[]; totalPages: number }> => {
    let query = supabase
        .from('posts')
        .select(`
            *,
            author (id, username, display_name, avatar_url),
            categories (name, slug),
            post_tags (tags (name, slug))
        `, { count: 'exact' })
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

    if (search) query = query.ilike('title', `%${search}%`);
    if (categoryId) query = query.eq('category_id', categoryId);
    if (tagId) query = query.eq('post_tags.tag_id', tagId);

    const { data, error, count } = await query;
    if (error) throw error;
    const posts = await Promise.all((data || []).map((post: any) => mapPostData(post, userId)));
    const totalPages = Math.ceil((count || 0) / limit);
    return { posts: posts as PostListItem[], totalPages };
};

// Get a single post by slug (published only)
export const getPostBySlug = async (slug: string, userId?: string): Promise<PostDetails | null> => {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            id, author, title, slug, excerpt, content, category_id, cover_image, published, 
            featured, created_at, updated_at, like_count, comment_count,
            author (id, username, display_name, avatar_url),
            categories (name, slug),
            post_tags (tags (name, slug))
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single();
    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
    }
    if (!data) return null;
    return await mapPostData(data, userId) as PostDetails;
};

// Get a single post by ID (for edit mode, includes drafts)
export const getPostById = async (id: string): Promise<PostDetails> => {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            id, author, title, slug, excerpt, content, category_id, cover_image, 
            published, featured, created_at, updated_at, like_count, comment_count,
            author (username, display_name, avatar_url),
            categories (name, slug),
            post_tags (tags (id, name, slug))
        `)
        .eq('id', id)
        .single();
    if (error) throw error;
    if (!data) throw new Error("Post not found");

    const post = await mapPostData(data);
    post.user_has_liked = undefined;
    return post as PostDetails;
};

// Get all posts by a specific author (for dashboard)
export const getAuthorPosts = async (authorId: string): Promise<Array<{ id: string; title: string; slug: string; published: boolean; created_at: string; like_count: number; comment_count: number }>> => {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            id, title, slug, published, created_at, like_count, comment_count
        `)
        .eq('author', authorId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

// Create a new post
export const createPost = async (post: PostInput & { author: string }): Promise<PostDetails> => {
    const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select('id')
        .single();
    if (error) throw error;
    if (!data) throw new Error('Post creation failed');
    return await getPostById(data.id);
};

// Update a post
export const updatePost = async (id: string, updates: Partial<PostDetails>): Promise<PostDetails> => {
    const { data, error } = await supabase
        .from('posts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('id')
        .single();
    if (error) throw error;
    if (!data) throw new Error('Post update failed');
    return await getPostById(data.id);
};

// Delete a post
export const deletePost = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
};

// --- TAGS MANAGEMENT ---
// Update tags associated with a post
export const updatePostTags = async (postId: string, tagIds: string[]) => {
    // 1. Delete all existing tags for this post
    const { error: deleteError } = await supabase
        .from('post_tags')
        .delete()
        .eq('post_id', postId);
    if (deleteError) throw deleteError;
    if (tagIds.length === 0) return; // No new tags to add

    // 2. Insert new tags
    const newTags = tagIds.map(tag_id => ({ post_id: postId, tag_id }));
    const { error: insertError } = await supabase
        .from('post_tags')
        .insert(newTags);
    if (insertError) throw insertError;
};

// --- ADMIN ONLY ---
// Get all posts (including drafts, for admin dashboard)
export const getAllPosts = async (
    page = 1,
    limit = 10,
    search = '',
    categoryId?: number,
    tagId?: number,
    authorId?: string,
    userId?: string,
): Promise<{ posts: PostDetails[]; totalPages: number }> => {
    let query = supabase
        .from('posts')
        .select(`
            id, author, title, slug, excerpt, content, category_id, 
            cover_image, published, featured, created_at, updated_at, like_count, comment_count,
            author (username, display_name, avatar_url),
            categories (name, slug),
            post_tags (tags (id, name, slug))
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

    if (search) query = query.ilike('title', `%${search}%`);
    if (categoryId) query = query.eq('category_id', categoryId);
    if (tagId) query = query.eq('post_tags.tag_id', tagId);
    if (authorId) query = query.eq('author', authorId);

    const { data, error, count } = await query;
    if (error) throw error;
    const posts = await Promise.all((data || []).map((post: any) => mapPostData(post, userId)));
    const totalPages = Math.ceil((count || 0) / limit);
    return { posts: posts as PostDetails[], totalPages };
};