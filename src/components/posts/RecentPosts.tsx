import { useState, useEffect } from "react";
import { getPosts } from "@/services/posts";
import type { PostListItem } from "@/types";
import { PostCard } from "./PostCard";
import { PostCardSkeleton } from "./PostCardSkeleton";

export const RecentPosts = () => {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      setLoading(true);
      try {
        const { posts: recentPosts } = await getPosts(1, 3);
        setPosts(recentPosts);
      } catch (error) {
        setError("Failed to load recent posts.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-destructive bg-destructive/10 rounded-lg">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    <div className="text-center p-10 text-muted-foreground bg-accent/20 rounded-lg">
      No posts have been published yet.
    </div>
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
