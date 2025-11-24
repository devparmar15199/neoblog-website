import { useState } from "react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { useComments } from "@/hooks/useComments";
import { useAuth } from "@/hooks/useAuth";
import { SendHorizontal } from "lucide-react";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Link } from "react-router-dom";

interface CommentFormProps {
  postId: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComment } = useComments(postId);
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-6 bg-muted/30 rounded-lg text-center border border-dashed">
        <p className="text-muted-foreground text-sm mb-3">
          Join the conversation by signing in.
        </p>
        <Link to="/auth?mode=login">
          <Button variant="outline" size="sm">Log In to Comment</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment({
        post_id: postId,
        author: user.id,
        content: content.trim(),
        parent_id: undefined,
      });
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="Write a thoughtful comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] resize-y focus-visible:ring-primary/50"
        required
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="gap-2"
        >
          {isSubmitting ? <LoadingSpinner size="sm" /> : <SendHorizontal className="size-4" />}
          Post Comment
        </Button>
      </div>
    </form>
  );
};