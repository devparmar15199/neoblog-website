// ============================================================
// BASE TYPES (Direct table columns)
// ============================================================
// Profile type from 'profiles' table
export interface Profile {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    role: 'user' | 'admin';
    created_at: string;
}

// Category type from 'categories' table
export interface Category {
    id: number;
    name: string;
    description: string | null;
    slug: string;
}

// Tag type from 'tags' table
export interface Tag {
    id: number;
    name: string;
    slug: string;
}

// Helper type for the joined profile data used in Post/Comment views
export type PostProfile = Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url'>;
// Helper type for tags data (reflects the post_tags junction table structure)
type PostTagRelation = { tags: Pick<Tag, 'name' | 'slug'> };

// Comment type from 'comments' table
export interface Comment {
    id: string;
    post_id: string;
    author: string; // user ID
    parent_id: string | null;
    content: string;
    is_edited: boolean;
    created_at: string;
    // Joined profile data (required when selected in queries)
    profiles: PostProfile;
}

// Like type from 'post_likes' table
export interface Like {
    user_id: string;
    post_id: string;
    created_at: string;
}

// ============================================================
// POST TYPES (with joined/relational data)
// ============================================================

/**
 * The full, detailed interface representing a post (e.g., on a detail page).
 * Includes all direct table columns and full relational data.
 */
export interface PostDetails {
    id: string;
    author: string; // user ID
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    category_id: number | null;
    cover_image: string | null;
    published: boolean;
    featured: boolean;
    created_at: string;
    updated_at: string | null;

    // Denormalized counts
    like_count: number;
    comment_count: number;

    // Relational data (from joins, named 'profiles' for frontend use)
    profiles: PostProfile;
    categories: Pick<Category, 'name' | 'slug'> | null; // Category relation
    tags: PostTagRelation[]; // Tags relation (via junction table)
    
    // User-specific state, typically added client-side or from a view
    user_has_liked?: boolean;
}

// ============================================================
// POST LIST ITEM TYPE (Simplified for Listings)
// ============================================================

/**
 * A leaner type for post listings (e.g., PostCard).
 * Uses 'Pick' from the unified PostDetails interface.
 */
export type PostListItem = Pick<PostDetails,
    'id' 
    | 'title' 
    | 'slug'
    | 'author'
    | 'excerpt' 
    | 'cover_image' 
    | 'created_at' 
    | 'like_count' 
    | 'comment_count' 
    | 'categories' 
    | 'tags' 
    | 'user_has_liked'
>;

// ============================================================
// NOTIFICATION TYPES
// ============================================================
export interface NotificationData {
    postId?: string;
    commentId?: string;
    senderUsername?: string;
}

export interface Notification {
    id: string;
    user_id: string;
    type: string;
    data: NotificationData | null;
    is_read: boolean;
    created_at: string;
}

// ============================================================
// CLIENT PAYLOADS
// ============================================================
export interface PostInput {
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    category_id?: number | null;
    cover_image?: string | null;
    published?: boolean;
    featured?: boolean;
}