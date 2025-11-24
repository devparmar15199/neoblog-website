import { supabase } from "@/lib/supabase";
import type { PostDetails, CreatePostPayload, UpdatePostPayload, PostListItem } from "@/types";
import { hasUserLikedPost } from "./likes";

// --- HELPER: Data Mapper ---
// Flattens Supabase joined responses into our clean UI types
const mapPostData = async (post: any, userId?: string): Promise<PostDetails> => {
    const mapped: any = { ...post };

    // 1. Map 'author' (joined data) to 'profiles' to match your Type definition
    // We asked Supabase to return it as 'author', so we map it to 'profiles'
    if (mapped.author) {
        mapped.profiles = mapped.author;
        delete mapped.author;
    }

    // 2. Flatten Tags
    if (mapped.post_tags) {
        mapped.post_tags = mapped.post_tags.filter((postTag: any) => postTag.tags != null);
    } else {
        mapped.post_tags = [];
    }

    // 3. User Context
    if (userId) {
        const [liked, bookmarked] = await Promise.all([
            hasUserLikedPost(post.id, userId),
            hasUserBookmarkedPost(post.id, userId)
        ]);
        mapped.user_has_liked = liked;
        mapped.user_has_bookmarked = bookmarked;
    }

    return mapped as PostDetails;
};

// --- BOOKMARKS ---
// Check if user has bookmarked a post
export const hasUserBookmarkedPost = async (postId: string, userId: string): Promise<boolean> => {
    const { count, error } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
        .eq('user_id', userId);

    if (error) throw error;
    return (count || 0) > 0;
};

// Toggle Bookmark status for a post
export const toggleBookmark = async (postId: string, userId: string, isBookmarked: boolean) => {
    if (isBookmarked) {
        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .match({ post_id: postId, user_id: userId });
        if (error) throw error;
    } else {
        const { error } = await supabase
            .from('bookmarks')
            .insert({ post_id: postId, user_id: userId });
        if (error) throw error;
    }   
};

// --- READ POSTS ---
// Get paginated list of published posts with optional filters
export const getPosts = async (
    page = 1,
    limit = 10,
    search = '',
    categoryId?: number,
    tagId?: number,
    userId?: string,
): Promise<{ posts: PostListItem[]; totalPages: number }> => {

    let postIdsToFetch: string[] | null = null;
    let totalCount = 0;

    if (search) {
        const { data: searchResults, error: searchError } = await supabase
        .rpc('search_posts', { search_term: search });
        
        if (searchError) throw searchError;
        postIdsToFetch = (searchResults || []).map((p: any) => p.id);
        totalCount = postIdsToFetch?.length || 0;
    }

    // FIX: Explicitly reference the relationship "author" points to "profiles"
    let query = supabase
        .from('posts')
        .select(`
            *,
            author:profiles!posts_author_fkey (id, username, display_name, avatar_url),
            categories (id, name, slug),
            post_tags (
                tags (id, name, slug)
            )
        `, { count: 'exact' })
        .eq('published', true);

    // Apply filters
    if (postIdsToFetch !== null) {
        query = query.in('id', postIdsToFetch); // Filter by RPC results
    } else {
        query = query.order('created_at', { ascending: false }); // Default sort
    }

    if (categoryId) query = query.eq('category_id', categoryId);
    if (tagId) {
        query = query.eq('post_tags.tag_id', tagId);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = page * limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    const finalCount = postIdsToFetch !== null ? totalCount : (count || 0);
    const posts = await Promise.all((data || []).map((post: any) => mapPostData(post, userId)));
    const totalPages = Math.ceil(finalCount / limit);

    return { posts: posts as PostListItem[], totalPages };
};

// --- READ POSTS (ADMIN) ---
// Fetches ALL posts (including drafts) with granular filtering
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
      *,
      author:profiles!posts_author_fkey (id, username, display_name, avatar_url),
      categories (id, name, slug),
      post_tags (
        tags (id, name, slug)
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false });

  // 1. Search (Standard ILIKE since RPC usually hides drafts)
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  // 2. Filters
  if (categoryId) query = query.eq('category_id', categoryId);
  if (authorId) query = query.eq('author', authorId);
  if (tagId) query = query.eq('post_tags.tag_id', tagId);

  // 3. Pagination
  const from = (page - 1) * limit;
  const to = page * limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  const posts = await Promise.all((data || []).map((post: any) => mapPostData(post, userId)));
  const totalPages = Math.ceil((count || 0) / limit);

  return { posts, totalPages };
};

// Get a single post by slug (published only)
export const getPostBySlug = async (slug: string, userId?: string): Promise<PostDetails | null> => {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            author:profiles!posts_author_fkey (id, username, display_name, avatar_url),
            categories (id, name, slug),
            post_tags (
                tags (id, name, slug)
            )
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
    }
    return await mapPostData(data, userId);
};

// Get a single post by ID (for edit mode, includes drafts)
export const getPostById = async (id: string): Promise<PostDetails> => {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            author:profiles!posts_author_fkey (id, username, display_name, avatar_url),
            categories (id, name, slug),
            post_tags (
                tags (id, name, slug)
            )
        `)
        .eq('id', id)
        .single();

    if (error) throw error;
    return await mapPostData(data);
};

// --- CREATE / UPDATE / DELETE ---
// Create a new post
export const createPost = async (post: CreatePostPayload & { author: string }): Promise<PostDetails> => {
    // 1. Extract tags from payload (they go to a separate table)
    const { tags, ...postData } = post;
    
    // 2. Insert post
    const { data: newPost, error } = await supabase
        .from('posts')
        .insert(postData)
        .select('id')
        .single();

    if (error) throw error;

    // 3. Handle Tags
    if (tags && tags.length > 0) {
        await updatePostTags(newPost.id, tags);
    }

    // 4. Return the full post details
    return await getPostById(newPost.id);
};

// Update a post
export const updatePost = async (id: string, payload: UpdatePostPayload, tags?: string[]): Promise<PostDetails> => {
    const { tags: _, ...updates } = payload;
    const { data, error } = await supabase
        .from('posts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('id')
        .single();

    if (error) throw error;

    if (tags !== undefined) {
        await updatePostTags(id, tags);
    }

    return await getPostById(data.id);
};

// Delete a post
export const deletePost = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
};

// --- TAGS MANAGEMENT ---
// Update tags associated with a post
export const updatePostTags = async (postId: string, tagNames: string[]) => {
    // 1. Delete all existing tags for this post
    const { error: deleteError } = await supabase
        .from('post_tags')
        .delete()
        .eq('post_id', postId);
    if (deleteError) throw deleteError;

    if (tagNames.length === 0) return; // No new tags to add

    const { data: existingTags } = await supabase.from('tags').select('id, name').in('name', tagNames);
    if (!existingTags) return;

    const newTags = existingTags.map(t => ({ post_id: postId, tag_id: t.id }));
    
    if (newTags.length > 0) {
        const { error: insertError } = await supabase.from('post_tags').insert(newTags);
        if (insertError) throw insertError;
    }
};