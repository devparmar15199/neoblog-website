import { Badge } from "../ui/Badge";
import { useNavigate } from "react-router-dom";

interface TagBadgeProps {
  tag: { id: number; name: string; slug: string };
}

export const TagBadge = ({ tag }: TagBadgeProps) => {
  const navigate = useNavigate();

  return (
    <Badge
      variant="outline"
      className="text-xs font-normal cursor-pointer hover:border-primary hover:text-primary transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/?tag=${tag.id}`);
      }}
    >
      #{tag.name}
    </Badge>
  );
};
