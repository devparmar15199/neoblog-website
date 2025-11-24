import { supabase } from "@/lib/supabase";
import type { PostListItem } from "@/types";

// Get all posts bookmarked by a specific user
export const getBookmarkedPosts = async (userId: string): Promise<PostListItem[]> => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select(`
      post_id,
      posts:post_id (
        id, title, slug, excerpt, cover_image, created_at, 
        like_count, comment_count,
        author:profiles!posts_author_fkey (id, username, display_name, avatar_url),
        categories (id, name, slug),
        post_tags (tags (id, name, slug))
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Flatten the response to match PostListItem
  return (data || []).map((item: any) => {
    const post = { ...item.posts };
    if (post.author) {
      post.profiles = post.author;
      delete post.author;
    }
    // Helper to flatten tags
    if (post.post_tags) {
        post.tags = post.post_tags.map((pt: any) => pt.tags).filter(Boolean);
        delete post.post_tags;
    }
    // Saved posts are obviously bookmarked by the user
    post.user_has_bookmarked = true; 
    return post;
  }) as PostListItem[];
};