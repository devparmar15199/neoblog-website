import React from "react";

interface CategoryBadgeProps {
  name: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ name }) => {
  return (
    <span
      className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm tracking-wide transition-colors"
    >
      {name}
    </span>
  );
};
