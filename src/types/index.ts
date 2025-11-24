// ============================================================
// BASE DATABASE ENTITIES (Direct table mappings)
// ============================================================

export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author: string;
  parent_id: string | null;
  content: string;
  is_edited: boolean;
  created_at: string;
}

export interface Like {
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface Bookmark {
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface Follower {
  follower_id: string;  // Who is following
  following_id: string; // Who is being followed
  created_at: string;
}

// ============================================================
// JOINED / RESPONSE TYPES (What Supabase returns)
// ============================================================

// Helper: Profile subset often returned in joins
export type PostAuthorProfile = Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url'>;

// Helper: How supabase returns many-to-many tags via the 'post_tags' junction table
// Result shape: post_tags: [ { tags: { name: 'Tech', slug: 'tech' } } ]
export interface PostTagResponse {
  tags: Pick<Tag, 'id' | 'name' | 'slug'> | null;
}


/**
 * The main Post type used in your UI (Cards, Details, Lists).
 * Includes joined data (author, category, tags) and computed fields.
 */
export interface PostDetails {
  // Direct Columns
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

  // Joined Relations
  // Note: Supabase usually names the joined property after the table name ('profiles')
  profiles: PostAuthorProfile;
  categories: Pick<Category, 'id' | 'name' | 'slug'> | null;

  // Many-to-Many relation via 'post_tags'
  post_tags: PostTagResponse[];

  // UI/Client-side computed state (requires extra check or .rpc)
  user_has_liked?: boolean;
  user_has_bookmarked?: boolean;
}

export type PostListItem = Pick<PostDetails, 
  | 'id'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'cover_image'
  | 'created_at'
  | 'like_count'
  | 'comment_count'
  | 'profiles'
  | 'categories'
  | 'post_tags'
  | 'user_has_liked'
  | 'user_has_bookmarked'
>;

/**
 * Comment with Author details (for Comment Lists)
 */
export interface CommentWithAuthor extends Comment {
  profiles: PostAuthorProfile;
}

// ============================================================
// NOTIFICATION TYPES
// ============================================================

export type NotificationType = 'new_comment' | 'new_like' | 'new_follower';

export interface NotificationData {
  postId?: string;
  commentId?: string;
  followerId?: string;
  senderUsername?: string;
  [key: string]: any; // Allow extra fields
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  data: NotificationData | null;
  is_read: boolean;
  created_at: string;
}

// ============================================================
// CLIENT PAYLOADS (Forms/Action Arguments)
// ============================================================

export interface CreatePostPayload {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category_id?: number | null;
  cover_image?: string | null;
  published?: boolean;
  featured?: boolean;
  tags?: string[]; // Array of Tag Names or IDs to associate
}

export interface UpdatePostPayload extends Partial<CreatePostPayload> {}

export interface CreateCommentPayload {
  post_id: string;
  author: string;
  content: string;
  parent_id?: string;
}