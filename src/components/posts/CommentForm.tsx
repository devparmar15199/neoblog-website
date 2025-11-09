import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "@/store";
import { useComments } from "@/hooks/useComments";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

interface CommentFormProps {
  postId: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
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
        parent_id: null,
      });
      setNewComment("");
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
        placeholder={`Commenting as ${profile?.username || 'User'}...`}
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