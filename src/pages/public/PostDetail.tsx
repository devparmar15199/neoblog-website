import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import { useComments } from "@/hooks/useComments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CategoryBadge } from "@/components/posts/CategoryBadge";
import { TagBadge } from "@/components/posts/TagBadge";
import { LikeButton } from "@/components/posts/LikeButton";
import { CommentForm } from "@/components/posts/CommentForm";
import { CommentItem } from "@/components/posts/CommentItem";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, MessageCircle } from "lucide-react";
import parse from 'html-react-parser';

export const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentPost, loadPostBySlug, loading: postLoading, error } = usePosts();
  const { comments, deleteComment, loading: commentsLoading } = useComments(currentPost?.id || "");

  useEffect(() => {
    if (slug) loadPostBySlug(slug);
  }, [slug, loadPostBySlug]);

  if (postLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground animate-pulse">Loading story...</p>
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <p className="text-muted-foreground">The story you are looking for might have been removed or is private.</p>
        <Link to="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Navigation */}
      <div className="mb-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="pl-0 gap-1 text-muted-foreground hover:text-foreground -ml-2">
            <ChevronLeft className="size-4" /> Back to feed
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-6 mb-8">
        <div className="space-y-4">
          {currentPost.categories && (
            <CategoryBadge category={currentPost.categories} />
          )}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1]">
            {currentPost.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {currentPost.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between py-6 border-y">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${currentPost.profiles.username}`}>
              <Avatar className="size-10 border bg-background">
                <AvatarImage src={currentPost.profiles.avatar_url || undefined} />
                <AvatarFallback>
                  {currentPost.profiles.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="text-sm">
              <Link to={`/profile/${currentPost.profiles.username}`} className="font-semibold hover:underline">
                {currentPost.profiles.display_name || currentPost.profiles.username}
              </Link>
              <div className="text-muted-foreground">
                {formatDistanceToNow(new Date(currentPost.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>
          <LikeButton variant="outline" />
        </div>
      </header>

      {/* Hero Image */}
      {currentPost.cover_image && (
        <figure className="mb-10 -mx-4 md:mx-0">
          <div className="aspect-video overflow-hidden md:rounded-xl shadow-sm bg-muted">
            <img
              src={currentPost.cover_image}
              alt={currentPost.title}
              className="w-full h-full object-cover"
            />
          </div>
        </figure>
      )}

      {/* Main Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-10 prose-img:rounded-xl prose-headings:scroll-mt-20">
        {parse(currentPost.content || "")}
      </div>

      {/* Footer: Tags */}
      {currentPost.post_tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {currentPost.post_tags.map((pt: any) => (
            <TagBadge key={pt.tags.id} tag={pt.tags} />
          ))}
        </div>
      )}

      <Separator className="mb-10" />

      {/* Discussion Section */}
      <section id="comments" className="space-y-8">
        <div className="flex items-center gap-2">
          <MessageCircle className="size-6 text-primary" />
          <h3 className="text-2xl font-bold">Discussion ({comments.length})</h3>
        </div>

        <CommentForm postId={currentPost.id} />

        <div className="space-y-6 mt-8">
          {commentsLoading ? (
            <div className="flex justify-center py-8"><LoadingSpinner /></div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDelete={deleteComment}
              />
            ))
          ) : (
            <div className="text-center py-10 bg-muted/30 rounded-lg border border-dashed">
              <p className="text-muted-foreground">No comments yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};