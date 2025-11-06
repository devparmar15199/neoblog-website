import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useComments } from "@/hooks/useComments";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Edit, MessageCircle, ChevronLeft, User, Calendar } from "lucide-react";
import { setCurrentPost } from "@/store/slices/postsSlice";
import { getPostBySlug } from "@/services/posts";
import toast from "react-hot-toast";

import { LikeButton } from "./LikeButton";

const CommentForm = ({ postId }: { postId: string; }) => {
  const { user, profile } = useSelector((state: RootState) => state.auth);
  const { addComment } = useComments(postId);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    setIsSubmitting(true);

    try {
      await addComment({
        post_id: postId,
        author: user.id,
        content: newComment.trim(),
      });
      setNewComment("");
      // onCommentAdded();
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Add comment failed:", error);
      toast.error("Failed to add comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <p className="text-center text-muted-foreground p-4 border rounded-md">
        <Link to="/auth" className="text-primary hover:underline font-medium">Sign in</Link> to join the discussion.
      </p>
    );
  }

  return (
    <form onSubmit={handleAddComment} className="space-y-3">
      <Textarea
        placeholder={`Commenting as ${profile?.username || 'Guest'}...`}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        rows={3}
        required
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        icon={MessageCircle}
        // className="h-12 font-bold"
        disabled={isSubmitting || newComment.trim().length === 0}
      >
        {isSubmitting ? <LoadingSpinner size="sm" /> : "Post Comment"}
      </Button>
    </form>
  );
};

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    created_at: string;
    profiles?: {
      username: string;
      display_name: string;
      avatar_url: string
    };
  }
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const displayName = comment.profiles?.display_name || comment.profiles?.username || 'Anonymous';
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="flex space-x-3 p-3 border-b last:border-b-0">
      <Avatar className="size-8">
        <AvatarImage src={comment.profiles?.avatar_url || undefined} alt={displayName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm">{displayName}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(comment.created_at).toLocaleDateString()}
          </p>
        </div>
        <p className="text-sm mt-1">{comment.content}</p>
      </div>
    </div>
  );
};

export const PostDetail = () => {
  const dispatch = useDispatch();
  const { slug } = useParams<{ slug: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentPost, loading: postLoading } = useSelector((state: RootState) => state.posts);
  const { comments, loading: commentsLoading, error: commentsError } = useSelector((state: RootState) => state.comments);

  // Fetch post by slug
  useEffect(() => {
    const fetchPost = async () => {
      // dispatch(setCurrentPost(null));
      try {
        const response = await getPostBySlug(slug!);
        if (response) {
          dispatch(setCurrentPost(response));
        } else {
          // dispatch(setCurrentPost(null));
          toast.error("Post not found");
        }
      } catch (error) {
        toast.error("Failed to fetch post");
      }
    };
    if (slug) fetchPost();
  }, [slug, dispatch]);

  const postExists = currentPost && !postLoading;

  if (postLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }

  if (!postExists) {
    return (
      <div className="text-center p-10 space-y-4">
        <p className="text-2xl font-bold text-destructive">Post Not Found (404)</p>
        <Link to="/posts">
          <Button icon={ChevronLeft}>Back to Blog</Button>
        </Link>
      </div>
    );
  }

  // Fallback for metadata
  const postAuthor = currentPost.profiles?.display_name || currentPost.profiles?.username || 'Unknown Author';

  const initialLikesCount = currentPost.likes_count || 0;
  const isUserLiked = currentPost.user_has_liked || false;

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
          <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
            {currentPost.category && (
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium text-xs">
                {currentPost.category.name}
              </span>
            )}
            {/* Edit Button */}
            {user && user.id === currentPost.author && (
              <Link to={`/posts/edit/${currentPost.slug}`}> {/* Use slug for routing consistency */}
                <Button icon={Edit} variant="outline" size="sm">Edit Post</Button>
              </Link>
            )}
          </div>

          <CardTitle className="text-4xl font-extrabold leading-tight">{currentPost.title}</CardTitle>
          <CardDescription className="text-lg italic pt-1">{currentPost.excerpt}</CardDescription>
        </CardHeader>

        {/* Author & Date */}
        <div className="flex items-center gap-3 px-6 pb-4 border-b">
          <User className="size-4 text-primary" />
          <span className="text-sm font-medium">{postAuthor}</span>
          <Calendar className="size-4 text-primary ml-4" />
          <span className="text-sm text-muted-foreground">{new Date(currentPost.created_at).toLocaleDateString()}</span>

          <LikeButton
            postId={currentPost.id}
            initialLikes={initialLikesCount}
            initialIsLiked={isUserLiked}
          />
        
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
            dangerouslySetInnerHTML={{ __html: currentPost.content }}
            // Use prose class for readability in dark/light mode
            className="prose dark:prose-invert max-w-none prose-lg"
          />
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
