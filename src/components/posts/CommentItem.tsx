import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { CommentWithAuthor } from "@/types";
import { useAuth } from "@/hooks/useAuth";

interface CommentItemProps {
  comment: CommentWithAuthor;
  onDelete: (id: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user?.id === comment.author;

  const initials = (comment.profiles.display_name || comment.profiles.username || "?")
    .substring(0, 2).toUpperCase();

  return (
    <div className="flex gap-4 p-4 group animate-in fade-in slide-in-from-bottom-2">
      <Link to={`/profile/${comment.profiles.username}`}>
        <Avatar className="size-9 border">
          <AvatarImage src={comment.profiles.avatar_url || undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              to={`/profile/${comment.profiles.username}`}
              className="text-sm font-semibold hover:underline"
            >
              {comment.profiles.display_name || comment.profiles.username}
            </Link>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>

          {isOwner && (
            <Button
              variant="ghost"
              size="icon"
              className="size-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDelete(comment.id)}
              title="Delete comment"
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>

        <div className="text-sm text-foreground/90 leading-relaxed wrap-break-word bg-muted/30 p-3 rounded-md rounded-tl-none">
          {comment.content}
        </div>
      </div>
    </div>
  );
};
