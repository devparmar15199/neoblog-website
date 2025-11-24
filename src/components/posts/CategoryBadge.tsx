import { Badge } from "../ui/Badge";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: { id: number; name: string; slug: string } | null;
  className?: string;
}

export const CategoryBadge = ({ category, className }: CategoryBadgeProps) => {
  const navigate = useNavigate();

  if (!category) return null;

  return (
    <Badge
      variant="secondary"
      className={cn(
        "cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        navigate(`/?category=${category.id}`);
      }}
    >
      {category.name}
    </Badge>
  );
};
