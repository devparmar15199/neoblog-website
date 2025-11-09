import React, { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { usePosts } from "@/hooks/usePosts";
import { useComments } from "@/hooks/useComments";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Edit, MessageCircle, ChevronLeft, User, Calendar, Tag } from "lucide-react";
import parse from 'html-react-parser';
// import { setCurrentPost } from "@/store/slices/postsSlice";
// import { getPostBySlug } from "@/services/posts";
import toast from "react-hot-toast";
// import { LikeButton } from "@/components/posts/LikeButton";

import { LikeButton } from "@/components/posts/LikeButton";
import { CommentForm } from "@/components/posts/CommentForm";
import { CommentItem } from "@/components/posts/CommentItem";
import { TagBadge } from "@/components/posts/TagBadge";

export const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);
  const { currentPost, loading: postLoading } = useSelector((state: RootState) => state.posts);

  const { loadPostBySlug } = usePosts();

  // Fetch post by slug
  useEffect(() => {
    if (slug) {
      loadPostBySlug(slug).catch((error) => {
        console.error(error);
        toast.error("Post not found.");
        navigate("/posts");
      });
    }
  }, [slug, loadPostBySlug, navigate]);

  const { comments, loading: commentsLoading, error: commentsError } = useComments(currentPost?.id || '');

  if (postLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }

  if (!currentPost) {
    return (
      <div className="text-center p-10 space-y-4">
        <p className="text-2xl font-bold text-destructive">Post Not Found</p>
        <Link to="/posts">
          <Button icon={ChevronLeft}>Back to Blog</Button>
        </Link>
      </div>
    );
  }

  // Fallback for metadata
  const postAuthor = currentPost.author?.display_name || currentPost.author?.username;
  const postAuthorId = currentPost.author?.id;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Back Button */}
      <Link to="/posts">
        <Button variant="ghost" icon={ChevronLeft}>Back to Blog</Button>
      </Link>

      {/* Post Content Card */}
      <Card className="shadow-xl">
        <CardHeader>
          {/* Tags and Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
            {currentPost.categories && (
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium text-xs">
                {currentPost.categories.name}
              </span>
            )}
            {currentPost.tags?.map((tagObj) => (
              <TagBadge key={tagObj.tags.slug} name={tagObj.tags.name} />
            ))}

            <div className="grow" />

            {/* Edit Button */}
            {user && (user.id === postAuthorId) && (
              <Link to={`/posts/edit/${currentPost.id}`}> {/* Use slug for routing consistency */}
                <Button icon={Edit} variant="outline" size="sm">Edit Post</Button>
              </Link>
            )}
          </div>

          <CardTitle className="text-4xl font-extrabold leading-tight">{currentPost.title}</CardTitle>
          <CardDescription className="text-lg italic pt-1">{currentPost.excerpt}</CardDescription>
        </CardHeader>

        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 px-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <User className="size-4 text-primary" />
            <span className="text-sm font-medium">{postAuthor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            <span className="text-sm text-muted-foreground">{new Date(currentPost.created_at).toLocaleDateString()}</span>
          </div>
                    
          {/* 5. RENDER LIKE BUTTON (No props needed) */}
          <LikeButton />
        </div>

        <CardContent className="space-y-6 pt-6">
          {/* Cover Image */}
          {currentPost.cover_image && (
            <div className="w-full max-h-[400px] overflow-hidden rounded-lg shadow-lg">
              <img
                src={currentPost.cover_image}
                alt={currentPost.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Main Content */}
          <div
            className="prose dark:prose-invert max-w-none prose-lg"
          >
            {/* Render content as text for now if not using markdown */}
            {parse(currentPost.content || "No content.")}
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card className="p-6 space-y-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <MessageCircle className="size-5 text-primary" />
          Comments ({comments.length})
        </CardTitle>

        {/* Add Comment Form */}
        {/* <CommentForm postId={currentPost.id} onCommentAdded={refetchComments} /> */}
        <CommentForm postId={currentPost.id} />

        {/* Comments List */}
        <div className="pt-4 border-t space-y-2">
          {commentsLoading ? (
            <div className="flex justify-center py-4"><LoadingSpinner /></div>
          ) : commentsError ? (
            <p className="text-destructive text-center">{commentsError}</p>
          ) : comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Be the first to comment!</p>
          ) : (
            <div className="divide-y divide-border/50">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
